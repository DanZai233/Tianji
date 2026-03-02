import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI } from "@google/genai";
import TarotRitual from "../components/TarotRitual";
import ChatBox from "../components/ChatBox";
import ReactMarkdown from "react-markdown";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

  const drawCard = async () => {
    if (!question.trim()) return;
    setIsDrawing(true);

    // Simulate drawing 3 cards (Past, Present, Future)
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
      
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `用户的问题是：“${question}”。\n抽到的塔罗牌阵（过去、现在、未来）是：\n${cardsContext}\n\n请以专业塔罗师的口吻，给出详细的牌面解析。必须包含：\n1. 解释每张牌的含义及其在牌阵中的位置意义。\n2. 综合牌阵对用户的问题给出最终的建议和指引。\n排版要优美，使用Markdown格式。`,
      });

      setResult({
        cards: drawnCards,
        interpretation: response.text || "解析失败，请重试。",
      });
    } catch (error) {
      console.error(error);
      setResult({
        cards: drawnCards,
        interpretation: "抱歉，感应宇宙能量时受到干扰，请稍后再试。",
      });
    }
  };

  return (
    <div className="p-6 md:p-12 pb-24 md:pb-12 max-w-6xl mx-auto min-h-full flex flex-col">
      <AnimatePresence>
        {isDrawing && !result && (
          <TarotRitual onComplete={() => {}} />
        )}
      </AnimatePresence>

      <header className="mb-12 text-center">
        <h1 className="text-4xl font-serif italic tracking-widest mb-4 text-purple-200">塔罗秘仪</h1>
        <p className="text-purple-300/60 tracking-wider">在牌阵中寻找内心的答案</p>
      </header>

      {!result ? (
        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full gap-8">
          <div className="w-full relative">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="在心中默念你的问题，然后写在这里..."
              className="w-full h-32 bg-purple-950/20 border border-purple-500/30 rounded-2xl p-4 text-white placeholder:text-purple-300/30 focus:outline-none focus:border-purple-500/60 transition-colors resize-none"
            />
          </div>
          
          <div className="relative w-48 h-72 cursor-pointer group" onClick={drawCard}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-800 rounded-xl shadow-[0_0_30px_rgba(147,51,234,0.3)] transform transition-transform duration-500 group-hover:-translate-y-4 group-hover:shadow-[0_0_50px_rgba(147,51,234,0.5)] border border-purple-400/30 flex items-center justify-center overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50 mix-blend-overlay"></div>
               <div className="w-32 h-48 border border-purple-400/20 rounded-lg flex items-center justify-center">
                 <div className="w-24 h-24 rounded-full border border-purple-400/20 flex items-center justify-center">
                   <div className="w-16 h-16 border border-purple-400/20 transform rotate-45"></div>
                 </div>
               </div>
            </div>
            <div className="absolute -bottom-12 left-0 right-0 text-center text-purple-300/60 tracking-widest text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              点击抽取命运之牌
            </div>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
        >
          <div className="flex flex-col items-center gap-8">
            <div className="flex gap-4 w-full justify-center">
              {result.cards.map((c, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <p className="text-purple-300/80 text-xs tracking-widest">{c.position}</p>
                  <div className="relative w-24 h-40 md:w-32 md:h-48 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(147,51,234,0.2)] border border-purple-500/20 group">
                    <img 
                      src={`https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=400&auto=format&fit=crop&seed=${i}`} 
                      alt="Tarot Card"
                      className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${c.isReversed ? 'rotate-180' : ''}`}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                    <div className={`absolute bottom-2 left-0 right-0 text-center px-1 ${c.isReversed ? 'rotate-180 top-2 bottom-auto' : ''}`}>
                      <h3 className="text-[10px] md:text-xs font-serif text-white tracking-wider leading-tight">{c.card}</h3>
                      <p className="text-purple-300/80 text-[8px] md:text-[10px] tracking-widest mt-0.5">{c.isReversed ? '逆位' : '正位'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => { setResult(null); setQuestion(""); setIsDrawing(false); }}
              className="px-6 py-2 rounded-full border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 transition-colors tracking-widest text-sm"
            >
              重新占卜
            </button>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-purple-950/10 border border-purple-500/20 rounded-2xl p-6 md:p-8 overflow-y-auto max-h-[50vh] prose prose-invert prose-purple">
              <div className="mb-6 pb-6 border-b border-purple-500/20">
                <p className="text-purple-300/60 text-sm tracking-wider mb-2">你的问题：</p>
                <p className="text-lg text-purple-100">{question}</p>
              </div>
              <div className="markdown-body">
                <ReactMarkdown>{result.interpretation}</ReactMarkdown>
              </div>
            </div>
            
            <ChatBox 
              context={`问题：${question}\n牌阵：\n${result.cards.map(c => `【${c.position}】${c.card}(${c.isReversed ? '逆位' : '正位'})`).join('\n')}\n解析：${result.interpretation}`}
              systemInstruction="你是一位神秘、充满智慧的塔罗占卜师。用户刚刚抽取了塔罗牌，你需要根据牌面和之前的解析，回答用户进一步的疑问。语气要温和、神秘、有洞察力。"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
