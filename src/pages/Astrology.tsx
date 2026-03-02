import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI } from "@google/genai";
import AstrologyRitual from "../components/AstrologyRitual";
import ChatBox from "../components/ChatBox";
import ReactMarkdown from "react-markdown";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const ZODIACS = [
  "白羊座", "金牛座", "双子座", "巨蟹座", "狮子座", "处女座",
  "天秤座", "天蝎座", "射手座", "摩羯座", "水瓶座", "双鱼座"
];

export default function Astrology() {
  const [zodiac, setZodiac] = useState("");
  const [aspect, setAspect] = useState("综合运势"); // 综合运势, 感情, 事业
  const [timeframe, setTimeframe] = useState("今日"); // 今日, 本周, 本月
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const calculate = async () => {
    if (!zodiac) return;
    setIsCalculating(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `请作为一位资深占星师，为【${zodiac}】预测【${timeframe}】的【${aspect}】。结合当前的星象运行（可以虚构一些合理的星象如水星逆行、木星进入某宫等增加真实感），给出详细的运势解析和应对建议。排版优美，使用Markdown格式。`,
      });

      setResult(response.text || "星象模糊，请重试。");
    } catch (error) {
      console.error(error);
      setResult("抱歉，星辰轨迹被遮蔽，请稍后再试。");
    }
  };

  return (
    <div className="p-6 md:p-12 pb-24 md:pb-12 max-w-5xl mx-auto min-h-full flex flex-col">
      <AnimatePresence>
        {isCalculating && !result && (
          <AstrologyRitual onComplete={() => {}} />
        )}
      </AnimatePresence>

      <header className="mb-12 text-center">
        <h1 className="text-4xl font-light tracking-[0.2em] mb-4 text-blue-200">星象占星</h1>
        <p className="text-blue-300/60 tracking-wider">仰望星空，寻找命运的指引</p>
      </header>

      {!result ? (
        <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full gap-10">
          
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 w-full">
            {ZODIACS.map((z) => (
              <button
                key={z}
                onClick={() => setZodiac(z)}
                className={`p-3 rounded-2xl border transition-all duration-300 ${
                  zodiac === z 
                    ? "bg-blue-600/20 border-blue-400 text-blue-100 shadow-[0_0_20px_rgba(96,165,250,0.2)]" 
                    : "bg-black/20 border-white/5 text-neutral-400 hover:border-blue-500/30 hover:text-blue-200"
                }`}
              >
                <span className="tracking-widest text-sm">{z}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4 w-full items-center">
            <div className="flex gap-2 bg-blue-950/30 p-1 rounded-full border border-blue-500/20">
              {["今日", "本周", "本月"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-6 py-2 rounded-full text-sm tracking-widest transition-all ${
                    timeframe === t
                      ? "bg-blue-500/20 text-blue-200 shadow-sm"
                      : "bg-transparent text-blue-200/50 hover:text-blue-200/80"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex gap-2 bg-blue-950/30 p-1 rounded-full border border-blue-500/20">
              {["综合运势", "感情运势", "事业财富"].map((a) => (
                <button
                  key={a}
                  onClick={() => setAspect(a)}
                  className={`px-6 py-2 rounded-full text-sm tracking-widest transition-all ${
                    aspect === a
                      ? "bg-blue-500/20 text-blue-200 shadow-sm"
                      : "bg-transparent text-blue-200/50 hover:text-blue-200/80"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={calculate}
            disabled={!zodiac}
            className="mt-4 px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-white tracking-[0.2em] hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            开启星盘
          </button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col gap-8"
        >
          <div className="flex justify-between items-center border-b border-blue-500/20 pb-6">
            <div>
              <h2 className="text-2xl text-blue-100 tracking-widest">{zodiac}</h2>
              <p className="text-blue-400/60 tracking-wider mt-1">{timeframe} · {aspect}</p>
            </div>
            <button 
              onClick={() => { setResult(null); setIsCalculating(false); }}
              className="px-4 py-2 rounded-full border border-blue-500/30 text-blue-300 hover:bg-blue-500/10 transition-colors text-sm"
            >
              重新观测
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-blue-950/10 border border-blue-500/20 rounded-3xl p-8 prose prose-invert prose-blue max-h-[60vh] overflow-y-auto">
              <div className="markdown-body">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </div>
            
            <ChatBox 
              context={`星座：${zodiac}\n测算时间：${timeframe}\n测算方面：${aspect}\n星象解析：${result}`}
              systemInstruction="你是一位精通西方占星术的占星师。用户刚刚查看了他们的星象运势，你需要根据之前的解析，回答用户进一步的疑问。语气要专业、神秘、充满宇宙的宏大感。"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
