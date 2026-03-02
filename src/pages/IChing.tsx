import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI } from "@google/genai";
import IChingRitual from "../components/IChingRitual";
import ChatBox from "../components/ChatBox";
import ReactMarkdown from "react-markdown";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const HEXAGRAMS = [
  "乾为天", "坤为地", "水雷屯", "山水蒙", "水天需", "天水讼", "地水师", "水地比",
  "风天小畜", "天泽履", "地天泰", "天地否", "天火同人", "火天大有", "地山谦", "雷地豫"
];

export default function IChing() {
  const [question, setQuestion] = useState("");
  const [isTossing, setIsTossing] = useState(false);
  const [tossCount, setTossCount] = useState(0);
  const [lines, setLines] = useState<number[]>([]); // 6, 7, 8, 9
  const [result, setResult] = useState<{ hexagram: string; interpretation: string } | null>(null);

  const tossCoins = () => {
    if (!question.trim()) return;
    
    if (tossCount < 6) {
      // Simulate tossing 3 coins
      const toss = Array.from({length: 3}, () => Math.random() > 0.5 ? 3 : 2);
      const sum = toss.reduce((a, b) => a + b, 0); // 6 (老阴), 7 (少阳), 8 (少阴), 9 (老阳)
      
      setLines(prev => [sum, ...prev]); 
      setTossCount(prev => prev + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = async () => {
    setIsTossing(true);
    const hexagram = HEXAGRAMS[Math.floor(Math.random() * HEXAGRAMS.length)];

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `用户的问题是：“${question}”。\n通过抛掷铜钱得到的六爻结果（从下到上）是：${lines.join(', ')}（6老阴，7少阳，8少阴，9老阳）。\n本卦为：${hexagram}。\n请作为一位精通周易的易学大师，给出详细的解卦。必须包含：\n1. 卦辞解析和爻辞解析（针对动爻6和9）。\n2. 所测事物的吉凶判断。\n3. 事情的发展趋势。\n4. 具体的应对策略和指导。\n排版优美，使用Markdown格式。`,
      });

      setResult({
        hexagram,
        interpretation: response.text || "解卦失败，请重试。",
      });
    } catch (error) {
      console.error(error);
      setResult({
        hexagram,
        interpretation: "抱歉，易理深奥，暂时无法解析，请稍后再试。",
      });
    } finally {
      setIsTossing(false);
    }
  };

  const renderLine = (val: number, index: number) => {
    const isYang = val === 7 || val === 9;
    const isChanging = val === 6 || val === 9;
    
    return (
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        key={index}
        className="flex items-center justify-center gap-4 w-full h-8 mb-2"
      >
        {isYang ? (
          <div className="w-full h-4 bg-amber-600/80 rounded-sm relative">
             {isChanging && <div className="absolute -right-6 top-0 text-amber-400 text-xs">O</div>}
          </div>
        ) : (
          <div className="w-full flex justify-between h-4 relative">
            <div className="w-[45%] h-full bg-amber-600/80 rounded-sm"></div>
            <div className="w-[45%] h-full bg-amber-600/80 rounded-sm"></div>
            {isChanging && <div className="absolute -right-6 top-0 text-amber-400 text-xs">X</div>}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="p-6 md:p-12 pb-24 md:pb-12 max-w-5xl mx-auto min-h-full flex flex-col">
      <AnimatePresence>
        {isTossing && !result && (
          <IChingRitual onComplete={() => {}} />
        )}
      </AnimatePresence>

      <header className="mb-12 text-center">
        <h1 className="text-4xl font-serif tracking-[0.4em] mb-4 text-amber-200">周易八卦</h1>
        <p className="text-amber-300/60 tracking-wider">一阴一阳之谓道</p>
      </header>

      {!result ? (
        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full gap-8">
          
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={tossCount > 0}
            placeholder="心诚则灵，输入所占之事..."
            className="w-full bg-transparent border-b-2 border-amber-900/50 p-4 text-center text-xl text-amber-100 placeholder:text-amber-900/50 focus:outline-none focus:border-amber-600 transition-colors disabled:opacity-50"
          />

          <div className="w-48 h-64 flex flex-col-reverse justify-end border border-amber-900/30 p-8 rounded-xl bg-amber-950/10">
            {lines.map((val, i) => renderLine(val, i))}
            {tossCount === 0 && (
              <div className="h-full flex items-center justify-center text-amber-900/40 text-sm tracking-widest" style={{ writingMode: 'vertical-rl' }}>
                虚心以待
              </div>
            )}
          </div>

          <button
            onClick={tossCount < 6 ? tossCoins : calculateResult}
            disabled={!question.trim() || isTossing}
            className="px-8 py-3 bg-amber-900/40 border border-amber-700/50 rounded-full text-amber-200 tracking-[0.2em] hover:bg-amber-800/60 transition-all"
          >
            {tossCount === 0 ? "开始起卦" : tossCount < 6 ? `掷铜钱 (第${tossCount + 1}爻)` : "解卦"}
          </button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <div className="flex flex-col items-center gap-8">
            <div className="bg-amber-950/20 border border-amber-700/30 p-12 rounded-2xl flex flex-col items-center w-full">
              <h2 className="text-3xl font-serif text-amber-300 tracking-[0.5em] mb-8">{result.hexagram}</h2>
              <div className="w-32 flex flex-col-reverse">
                {lines.map((val, i) => renderLine(val, i))}
              </div>
            </div>
            <button 
              onClick={() => { setResult(null); setQuestion(""); setTossCount(0); setLines([]); }}
              className="px-8 py-2 rounded-full border border-amber-700/50 text-amber-400 hover:bg-amber-900/40 transition-colors tracking-widest"
            >
              重新起卦
            </button>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-amber-950/10 border border-amber-900/30 rounded-2xl p-6 md:p-8 overflow-y-auto max-h-[50vh] prose prose-invert prose-amber">
              <div className="mb-6 pb-6 border-b border-amber-900/30">
                <p className="text-amber-600/80 text-sm tracking-wider mb-2">所占之事：</p>
                <p className="text-lg text-amber-100">{question}</p>
              </div>
              <div className="markdown-body">
                <ReactMarkdown>{result.interpretation}</ReactMarkdown>
              </div>
            </div>
            
            <ChatBox 
              context={`问题：${question}\n卦象：${result.hexagram}\n爻象：${lines.join(',')}\n解卦：${result.interpretation}`}
              systemInstruction="你是一位精通周易八卦的易学大师。用户刚刚完成了一次周易占卜，你需要根据之前的解卦，回答用户进一步的疑问。语气要古朴、智慧、充满哲理。"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
