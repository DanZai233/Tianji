import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import QiMenRitual from "../components/QiMenRitual";
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

export default function QiMen() {
  const [question, setQuestion] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [panInfo, setPanInfo] = useState<{ zhiFu: string; zhiShi: string; ju: string } | null>(null);
  const [needsConfig, setNeedsConfig] = useState(false);

  const calculate = async () => {
    if (!question.trim()) return;
    setIsCalculating(true);

    const provider = getActiveProvider();
    
    if (!provider) {
      setNeedsConfig(true);
      setIsCalculating(false);
      return;
    }

    const jia = ["阳遁一局", "阴遁九局", "阳遁八局", "阴遁三局"][Math.floor(Math.random() * 4)];
    const zhiFu = ["天蓬星", "天任星", "天冲星", "天辅星", "天英星", "天芮星", "天柱星", "天心星"][Math.floor(Math.random() * 8)];
    const zhiShi = ["休门", "生门", "伤门", "杜门", "景门", "死门", "惊门", "开门"][Math.floor(Math.random() * 8)];
    
    setPanInfo({ ju: jia, zhiFu, zhiShi });

    try {
      const llmService = new LLMService(provider);
      const messages: LLMMessage[] = [
        { role: "user", content: `用户的问题是："${question}"。\n当前起局：${jia}，值符：${zhiFu}，值使：${zhiShi}。\n请作为一位精通奇门遁甲的大师，根据此局象（可自行推演九宫八门九星神盘的落宫情况以增加专业性），对用户的问题进行详细的断局和解答。必须包含：\n1. 所测事物的吉凶判断。\n2. 事情的发展趋势。\n3. 具体的应对策略和化解建议。\n排版优美，使用 Markdown 格式。` }
      ];
      
      const response = await llmService.sendMessage(messages);
      setResult(response.text || "排盘失败，请重试。");
    } catch (error) {
      console.error(error);
      setResult("抱歉，天机不可泄露，请稍后再试。");
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="p-6 md:p-12 pb-24 md:pb-12 max-w-5xl mx-auto min-h-full flex flex-col">
      <AnimatePresence>
        {isCalculating && !result && (
          <QiMenRitual onComplete={() => {}} />
        )}
      </AnimatePresence>

      <header className="mb-12 text-center">
        <h1 className="text-4xl font-serif tracking-[0.3em] mb-4 text-emerald-200">奇门遁甲</h1>
        <p className="text-emerald-300/60 tracking-wider">运筹帷幄之中，决胜千里之外</p>
      </header>

      {!result && !needsConfig ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl">
            <div className="mb-8">
              <label className="block text-sm text-emerald-300/70 mb-3 tracking-wider">请写下您要占卜的问题</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="例如：我目前的工作发展前景如何？我是否应该跳槽？"
                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-emerald-200/30 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
              />
            </div>

            <button
              onClick={calculate}
              disabled={!question.trim() || isCalculating}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-neutral-700 disabled:to-neutral-700 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 tracking-widest font-medium shadow-lg"
            >
              起局排盘
            </button>
          </div>
        </div>
      ) : needsConfig ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-medium text-white/80 mb-2">需要配置 API Key</h2>
          <p className="text-sm text-neutral-400 mb-6">请先配置大模型 API 才能使用此功能</p>
          <Link
            to="/settings/llm"
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors tracking-wider font-medium"
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
                <h2 className="text-2xl font-medium tracking-wider text-emerald-100">问题：{question}</h2>
                {panInfo && (
                  <div className="flex gap-6 mt-3 text-sm text-emerald-300/60">
                    <span>局数：{panInfo.ju}</span>
                    <span>值符：{panInfo.zhiFu}</span>
                    <span>值使：{panInfo.zhiShi}</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setResult(null);
                  setQuestion("");
                  setPanInfo(null);
                }}
                className="text-emerald-300/50 hover:text-emerald-200 transition-colors text-sm tracking-wider"
              >
                重新起局
              </button>
            </div>
            <div className="prose prose-invert prose-emerald max-w-none">
              <ReactMarkdown>{result || ""}</ReactMarkdown>
            </div>
          </div>

          <ChatBox
            context={`问题：${question}\n局数：${panInfo?.ju}\n值符：${panInfo?.zhiFu}\n值使：${panInfo?.zhiShi}\n\n排盘结果：\n${result}`}
            systemInstruction="你是一位精通奇门遁甲的易学大师，正在为用户解读奇门局象。请基于上面的局象和解读，回答用户的疑问，给出更详细的解释和建议。"
          />
        </motion.div>
      )}
    </div>
  );
}
