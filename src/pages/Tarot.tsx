import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import TarotRitual from "../components/TarotRitual";
import ChatBox from "../components/ChatBox";
import ReactMarkdown from "react-markdown";
import { LLMService } from "../lib/llm-service";
import { LLMProviderConfig, DEFAULT_PROVIDERS, LLMMessage } from "../lib/llm-providers";

const STORAGE_KEY = "tianji_llm_providers";

function getActiveProvider(): LLMProviderConfig | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const providers: LLMProviderConfig[] = saved ? JSON.parse(saved) : DEFAULT_PROVIDERS;
    const enabled = providers.find(p => p.enabled && p.apiKey);
    return enabled || null;
  } catch {
    return DEFAULT_PROVIDERS.find(p => p.enabled && p.apiKey) || null;
  }
}

const TAROT_CARDS = [
  "愚者 (The Fool)", "魔术师 (The Magician)", "女祭司 (The High Priestess)", "女皇 (The Empress)", "皇帝 (The Emperor)",
  "教皇 (The Hierophant)", "恋人 (The Lovers)", "战车 (The Chariot)", "力量 (Strength)", "隐士 (The Hermit)",
  "命运之轮 (Wheel of Fortune)", "正义 (Justice)", "倒吊人 (The Hanged Man)", "死神 (Death)", "节制 (Temperance)",
  "恶魔 (The Devil)", "高塔 (The Tower)", "星星 (The Star)", "月亮 (The Moon)", "太阳 (The Sun)",
  "审判 (Judgement)", "世界 (The World)"
];

interface TarotResult {
  cards: { card: string; isReversed: boolean; position: string }[];
  interpretation: string;
}

export default function Tarot() {
  const [question, setQuestion] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [result, setResult] = useState<TarotResult | null>(null);
  const [needsConfig, setNeedsConfig] = useState(false);

  const drawCard = async () => {
    if (!question.trim()) return;
    setIsDrawing(true);

    const provider = getActiveProvider();
    
    if (!provider) {
      setNeedsConfig(true);
      setIsDrawing(false);
      return;
    }

    const drawnCards = [];
    const availableCards = [...TAROT_CARDS];
    const positions = ["过去", "现在", "未来"];

    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * availableCards.length);
      const card = availableCards.splice(randomIndex, 1)[0];
      const isReversed = Math.random() > 0.5;
      drawnCards.push({ card, isReversed, position: positions[i] });
    }

    try {
      const cardsContext = drawnCards.map(c => `【${c.position}】: ${c.card} (${c.isReversed ? "逆位" : "正位"})`).join('\n');
      
      const llmService = new LLMService(provider);
      const messages: LLMMessage[] = [
        { role: "user", content: `用户的问题是："${question}"。\n抽到的塔罗牌阵（过去、现在、未来）是：\n${cardsContext}\n\n请以专业塔罗师的口吻，给出详细的牌面解析。必须包含：\n1. 解释每张牌的含义及其在牌阵中的位置意义。\n2. 综合牌阵对用户的问题给出最终的建议和指引。\n排版要优美，使用 Markdown 格式。` }
      ];
      
      const response = await llmService.sendMessage(messages);

      setResult({
        cards: drawnCards,
        interpretation: response.text || "解牌失败，请重试。",
      });
    } catch (error) {
      console.error(error);
      setResult({
        cards: drawnCards,
        interpretation: "抱歉，塔罗之力受到干扰，请稍后再试。",
      });
    } finally {
      setIsDrawing(false);
    }
  };

  return (
    <div className="p-6 md:p-12 pb-24 md:pb-12 max-w-5xl mx-auto min-h-full flex flex-col">
      <AnimatePresence>
        {isDrawing && !result && (
          <TarotRitual onComplete={() => {}} />
        )}
      </AnimatePresence>

      <header className="mb-12 text-center">
        <h1 className="text-4xl font-light tracking-[0.2em] mb-4 text-purple-200">塔罗秘仪</h1>
        <p className="text-purple-300/60 tracking-wider">打开心灵之门，揭示潜意识的奥秘</p>
      </header>

      {!result && !needsConfig ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl">
            <div className="mb-8">
              <label className="block text-sm text-purple-300/70 mb-3 tracking-wider">请写下您的问题</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="例如：我目前的感情状况如何？我应该如何改善？"
                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-purple-200/30 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
              />
            </div>

            <button
              onClick={drawCard}
              disabled={!question.trim() || isDrawing}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 disabled:from-neutral-700 disabled:to-neutral-700 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 tracking-widest font-medium shadow-lg"
            >
              开始抽牌
            </button>
          </div>
        </div>
      ) : needsConfig ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-medium text-white/80 mb-2">需要配置 API Key</h2>
          <p className="text-sm text-neutral-400 mb-6">请先配置大模型 API 才能使用此功能</p>
          <Link
            to="/settings/llm"
            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors tracking-wider font-medium"
          >
            去配置
          </Link>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col"
        >
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-medium tracking-wider text-purple-100 mb-2">问题：{question}</h2>
                <div className="flex gap-4 text-sm text-purple-300/60">
                  {result?.cards.map((c, i) => (
                    <span key={i}>
                      {c.position}: {c.card.split(' ')[0]} ({c.isReversed ? "逆位" : "正位"})
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => {
                  setResult(null);
                  setQuestion("");
                }}
                className="text-purple-300/50 hover:text-purple-200 transition-colors text-sm tracking-wider"
              >
                重新抽牌
              </button>
            </div>
            <div className="prose prose-invert prose-purple max-w-none">
              <ReactMarkdown>{result?.interpretation || ""}</ReactMarkdown>
            </div>
          </div>

          <ChatBox
            context={`问题：${question}\n\n牌阵：${result?.cards.map(c => `${c.position}: ${c.card} (${c.isReversed ? "逆位" : "正位"})`).join('\n')}\n\n解读结果：\n${result?.interpretation}`}
            systemInstruction="你是一位专业的塔罗占卜师，正在为用户解读塔罗牌阵。请基于上面的牌阵和解读，回答用户的疑问，给出更详细的解释和建议。"
          />
        </motion.div>
      )}
    </div>
  );
}
