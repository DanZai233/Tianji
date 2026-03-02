import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function TarotRitual({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState("shuffling");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("cutting"), 2000);
    const t2 = setTimeout(() => setPhase("selecting"), 4000);
    const t3 = setTimeout(onComplete, 6500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl"
    >
      <div className="relative w-80 h-64 flex items-center justify-center">
        {phase === "shuffling" && (
          Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                x: [0, (i % 2 === 0 ? 1 : -1) * 60, 0],
                y: [0, (i % 2 === 0 ? -1 : 1) * 20, 0],
                rotate: [0, (i % 2 === 0 ? 15 : -15), 0]
              }}
              transition={{ duration: 0.6, repeat: 3 }}
              className="absolute w-24 h-36 bg-gradient-to-br from-purple-800 to-indigo-900 border border-purple-400/50 rounded-xl shadow-lg"
            >
              <div className="absolute inset-2 border border-purple-400/20 rounded-lg"></div>
            </motion.div>
          ))
        )}
        {phase === "cutting" && (
          <>
            <motion.div
              animate={{ x: -50, y: 20 }}
              transition={{ duration: 1, type: "spring" }}
              className="absolute w-24 h-36 bg-gradient-to-br from-purple-800 to-indigo-900 border border-purple-400/50 rounded-xl shadow-lg"
            >
              <div className="absolute inset-2 border border-purple-400/20 rounded-lg"></div>
            </motion.div>
            <motion.div
              animate={{ x: 50, y: -20 }}
              transition={{ duration: 1, type: "spring" }}
              className="absolute w-24 h-36 bg-gradient-to-br from-purple-800 to-indigo-900 border border-purple-400/50 rounded-xl shadow-lg"
            >
              <div className="absolute inset-2 border border-purple-400/20 rounded-lg"></div>
            </motion.div>
          </>
        )}
        {phase === "selecting" && (
          <div className="flex gap-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50, rotateY: 180 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ delay: i * 0.6, duration: 0.8, type: "spring" }}
                className="w-20 h-32 bg-gradient-to-br from-purple-600 to-fuchsia-800 border border-purple-300/50 rounded-lg shadow-[0_0_20px_rgba(147,51,234,0.4)] flex items-center justify-center"
              >
                <div className="w-16 h-28 border border-white/20 rounded flex items-center justify-center">
                  <div className="w-8 h-8 border border-white/30 transform rotate-45"></div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <motion.p
        key={phase}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-12 text-xl tracking-[0.3em] text-purple-200 font-serif"
      >
        {phase === "shuffling" ? "洗牌中..." : phase === "cutting" ? "切牌中..." : "抽取过去、现在与未来..."}
      </motion.p>
    </motion.div>
  );
}
