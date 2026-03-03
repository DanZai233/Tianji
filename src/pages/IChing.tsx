import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import IChingRitual from "../components/IChingRitual";
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

const HEXAGRAMS = [
  "乾为天", "坤为地", "水雷屯", "山水蒙", "水天需", "天水讼", "地水师", "水地比",
  "风天小畜", "天泽履", "地天泰", "天地否", "天火同人", "火天大有", "地山谦", "雷地豫"
];

export default function IChing() {
  const [question, setQuestion] = useState("");
  const [isTossing, setIsTossing] = useState(false);
  const [tossCount, setTossCount] = useState(0);
  const [lines, setLines] = useState<number[]>([]);
  const [result, setResult] = useState<{ hexagram: string; interpretation: string } | null>(null);
  const [needsConfig, setNeedsConfig] = useState(false);

  const tossCoins = () => {
    if (!question.trim()) return;
    
    if (tossCount < 6) {
      const toss = Array.from({length: 3}, () => Math.random() > 0.5 ? 3 : 2);
      const sum = toss.reduce((a, b) => a + b, 0);
      
      setLines(prev => [sum, ...prev]); 
      setTossCount(prev => prev + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = async () => {
    setIsTossing(true);
    
    const provider = getActiveProvider();
    
    if (!provider) {
      setNeedsConfig(true);
      setIsTossing(false);
      return;
    }
    
    const hexagram = HEXAGRAMS[Math.floor(Math.random() * HEXAGRAMS.length)];

    try {
      const llmService = new LLMService(provider);
      const messages: LLMMessage[] = [
        { role: "user", content: `用户的问题是："${question}"。\n通过抛掷铜钱得到的六爻结果（从下到上）是：${lines.join(', ')}（6 老阴，7 少阳，8 少阴，9 老阳）。\n本卦为：${hexagram}。\n请作为一位精通周易的易学大师，给出详细的解卦。必须包含：\n1. 卦辞解析和爻辞解析（针对动爻 6 和 9）。\n2. 所测事物的吉凶判断。\n3. 事情的发展趋势。\n4. 具体的应对策略和指导。\n排版优美，使用 Markdown 格式。` }
      ];
      
      const response = await llmService.sendMessage(messages);

      setResult({
        hexagram,
        interpretation: response.text || "解卦失败，请重试。",
      });
    } catch (error) {
      console.error(error);
      setResult({
        hexagram: HEXAGRAMS[Math.floor(Math.random() * HEXAGRAMS.length)],
        interpretation: "抱歉，卦象模糊，请稍后再试。",
      });
    } finally {
      setIsTossing(false);
      setTossCount(0);
    }
  };

  return (
    <div className="p-6 md:p-12 pb-24 md:pb-12 max-w-5xl mx-auto min-h-full flex flex-col">
      <AnimatePresence>
        {tossCount > 0 && tossCount < 6 && (
          <IChingRitual onComplete={() => {}} />
        )}
      </AnimatePresence>

      <header className="mb-12 text-center">
        <h1 className="text-4xl font-serif tracking-[0.3em] mb-4 text-amber-200">周易八卦</h1>
        <p className="text-amber-300/60 tracking-wider">易有太极，是生两仪，两仪生四象，四象生八卦</p>
      </header>

      {!result && !needsConfig ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl">
            {!isTossing ? (
              <>
                <div className="mb-8">
                  <label className="block text-sm text-amber-300/70 mb-3 tracking-wider">请写下您要占卜的问题</label>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="例如：我目前的事业发展方向是否正确？"
                    className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-amber-200/30 focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
                  />
                </div>

                <button
                  onClick={() => setIsTossing(true)}
                  disabled={!question.trim()}
                  className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:from-neutral-700 disabled:to-neutral-700 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 tracking-widest font-medium shadow-lg"
                >
                  开始摇卦
                </button>
              </>
            ) : (
              <div className="text-center">
                <div className="mb-8">
                  <p className="text-amber-200/80 tracking-wider mb-2">请集中精神，默念您的问题</p>
                  <p className="text-amber-300/50 text-sm">点击下方按钮抛掷铜钱</p>
                </div>

                <div className="flex justify-center gap-4 mb-8">
                  {Array.from({length: 6}).map((_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full border-2 transition-colors ${
                        i < tossCount
                          ? "bg-amber-500 border-amber-400"
                          : "border-amber-500/30"
                      }`}
                    />
                  ))}
                </div>

                {tossCount < 6 ? (
                  <button
                    onClick={tossCoins}
                    className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl transition-all duration-300 tracking-widest font-medium shadow-lg"
                  >
                    抛掷铜钱 ({tossCount}/6)
                  </button>
                ) : (
                  <button
                    onClick={calculateResult}
                    className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl transition-all duration-300 tracking-widest font-medium shadow-lg"
                  >
                    查看卦象
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ) : needsConfig ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-medium text-white/80 mb-2">需要配置 API Key</h2>
          <p className="text-sm text-neutral-400 mb-6">请先配置大模型 API 才能使用此功能</p>
          <Link
            to="/settings/llm"
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors tracking-wider font-medium"
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
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-medium tracking-wider text-amber-100 mb-2">{result?.hexagram}</h2>
                <p className="text-amber-300/60 text-sm">问题：{question}</p>
              </div>
              <button
                onClick={() => {
                  setResult(null);
                  setQuestion("");
                  setLines([]);
                  setTossCount(0);
                  setIsTossing(false);
                }}
                className="text-amber-300/50 hover:text-amber-200 transition-colors text-sm tracking-wider"
              >
                重新占卜
              </button>
            </div>
            <div className="prose prose-invert prose-amber max-w-none">
              <ReactMarkdown>{result?.interpretation || ""}</ReactMarkdown>
            </div>
          </div>

          <ChatBox
            context={`问题：${question}\n卦象：${result?.hexagram}\n\n解卦结果：\n${result?.interpretation}`}
            systemInstruction="你是一位精通周易的易学大师，正在为用户解读卦象。请基于上面的卦象和解卦结果，回答用户的疑问，给出更详细的解释和建议。"
          />
        </motion.div>
      )}
    </div>
  );
}
