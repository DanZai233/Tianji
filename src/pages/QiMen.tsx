import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI } from "@google/genai";
import QiMenRitual from "../components/QiMenRitual";
import ChatBox from "../components/ChatBox";
import ReactMarkdown from "react-markdown";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function QiMen() {
  const [question, setQuestion] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [panInfo, setPanInfo] = useState<{ zhiFu: string; zhiShi: string; ju: string } | null>(null);

  const calculate = async () => {
    if (!question.trim()) return;
    setIsCalculating(true);

    // Mock Qi Men Pan info
    const jia = ["阳遁一局", "阴遁九局", "阳遁八局", "阴遁三局"][Math.floor(Math.random() * 4)];
    const zhiFu = ["天蓬星", "天任星", "天冲星", "天辅星", "天英星", "天芮星", "天柱星", "天心星"][Math.floor(Math.random() * 8)];
    const zhiShi = ["休门", "生门", "伤门", "杜门", "景门", "死门", "惊门", "开门"][Math.floor(Math.random() * 8)];
    
    setPanInfo({ ju: jia, zhiFu, zhiShi });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `用户的问题是：“${question}”。\n当前起局：${jia}，值符：${zhiFu}，值使：${zhiShi}。\n请作为一位精通奇门遁甲的大师，根据此局象（可自行推演九宫八门九星神盘的落宫情况以增加专业性），对用户的问题进行详细的断局和解答。必须包含：\n1. 所测事物的吉凶判断。\n2. 事情的发展趋势。\n3. 具体的应对策略和化解建议。\n排版优美，使用Markdown格式。`,
      });

      setResult(response.text || "排盘失败，请重试。");
    } catch (error) {
      console.error(error);
      setResult("抱歉，天机不可泄露，请稍后再试。");
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

      {!result ? (
        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full gap-12">
          
          <div className="relative w-64 h-64 border border-emerald-500/30 rounded-full flex items-center justify-center animate-[spin_60s_linear_infinite]">
            <div className="absolute inset-2 border border-dashed border-emerald-500/20 rounded-full"></div>
            <div className="absolute inset-8 border border-emerald-500/10 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 border border-emerald-500/40 transform rotate-45 flex items-center justify-center">
                 <span className="transform -rotate-45 text-emerald-500/50 font-serif">遁</span>
              </div>
            </div>
            {/* Bagua markers */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <div key={deg} className="absolute w-1 h-3 bg-emerald-500/40" style={{ transform: `rotate(${deg}deg) translateY(-32px)` }}></div>
            ))}
          </div>

          <div className="w-full space-y-4">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="输入你所求之事（如：寻物、求财、出行）..."
              className="w-full bg-emerald-950/20 border-b border-emerald-500/50 p-4 text-center text-white placeholder:text-emerald-300/30 focus:outline-none focus:border-emerald-400 transition-colors"
            />
            <button
              onClick={calculate}
              disabled={!question.trim()}
              className="w-full py-4 bg-emerald-900/40 border border-emerald-500/30 rounded-xl text-emerald-200 tracking-[0.2em] hover:bg-emerald-800/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              起局推演
            </button>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <div className="flex flex-col gap-6">
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <div className="text-6xl font-serif">遁</div>
              </div>
              <h3 className="text-emerald-400 text-sm tracking-widest mb-4">当前局象</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-black/30 p-3 rounded-lg border border-emerald-500/10">
                  <p className="text-emerald-500/60 text-xs mb-1">局数</p>
                  <p className="text-emerald-100">{panInfo?.ju}</p>
                </div>
                <div className="bg-black/30 p-3 rounded-lg border border-emerald-500/10">
                  <p className="text-emerald-500/60 text-xs mb-1">值符</p>
                  <p className="text-emerald-100">{panInfo?.zhiFu}</p>
                </div>
                <div className="bg-black/30 p-3 rounded-lg border border-emerald-500/10">
                  <p className="text-emerald-500/60 text-xs mb-1">值使</p>
                  <p className="text-emerald-100">{panInfo?.zhiShi}</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-emerald-500/20">
                <p className="text-emerald-400/60 text-sm tracking-wider mb-2">所测之事：</p>
                <p className="text-lg text-emerald-50">{question}</p>
              </div>
            </div>

            <button 
              onClick={() => { setResult(null); setQuestion(""); setIsCalculating(false); }}
              className="w-full py-3 rounded-xl border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 transition-colors tracking-widest"
            >
              重新起局
            </button>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-emerald-950/10 border border-emerald-500/20 rounded-2xl p-6 md:p-8 overflow-y-auto max-h-[50vh] prose prose-invert prose-emerald">
              <div className="markdown-body">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </div>
            
            <ChatBox 
              context={`问题：${question}\n局象：${panInfo?.ju}，值符${panInfo?.zhiFu}，值使${panInfo?.zhiShi}\n断局：${result}`}
              systemInstruction="你是一位精通奇门遁甲的国学大师。用户刚刚进行了奇门排盘，你需要根据之前的断局，回答用户进一步的疑问。语气要高深、沉稳、充满东方哲理。"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
