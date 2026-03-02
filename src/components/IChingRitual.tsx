import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function IChingRitual({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState("tossing");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("forming"), 3500);
    const t2 = setTimeout(onComplete, 6000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl"
    >
      <div className="relative w-64 h-64 flex items-center justify-center">
        {phase === "tossing" && (
          <div className="flex gap-6">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  y: [0, -120, 0],
                  rotateX: [0, 1080, 0],
                  rotateY: [0, 720, 0]
                }}
                transition={{ duration: 1.2, repeat: 2, delay: i * 0.15, ease: "easeInOut" }}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 border-2 border-amber-200 shadow-[0_0_20px_rgba(217,119,6,0.6)] flex items-center justify-center"
              >
                <div className="w-6 h-6 border-2 border-amber-900/40 rounded-sm flex items-center justify-center">
                  <div className="w-2 h-2 bg-amber-900/40 rounded-full"></div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {phase === "forming" && (
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ duration: 1.5, type: "spring", bounce: 0.4 }}
            className="w-56 h-56 border-4 border-amber-600/60 rounded-full flex items-center justify-center relative shadow-[0_0_50px_rgba(217,119,6,0.3)]"
          >
            <div className="absolute w-full h-full animate-[spin_15s_linear_infinite]">
              {/* Bagua Lines */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <div key={deg} className="absolute inset-0 flex items-start justify-center" style={{ transform: `rotate(${deg}deg)` }}>
                  <div className="w-10 h-1.5 bg-amber-500/80 mt-3 rounded-full"></div>
                </div>
              ))}
            </div>
            <div className="w-28 h-28 rounded-full border-2 border-amber-500/60 flex items-center justify-center bg-amber-900/30 backdrop-blur-sm">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-black to-white flex items-center justify-center animate-[spin_4s_linear_infinite]">
                 {/* Simple Yin Yang representation */}
                 <div className="w-8 h-16 bg-white rounded-l-full absolute left-0"></div>
                 <div className="w-8 h-16 bg-black rounded-r-full absolute right-0"></div>
                 <div className="w-8 h-8 bg-black rounded-full absolute top-0 flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full"></div></div>
                 <div className="w-8 h-8 bg-white rounded-full absolute bottom-0 flex items-center justify-center"><div className="w-2 h-2 bg-black rounded-full"></div></div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <motion.p
        key={phase}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-16 text-xl tracking-[0.4em] text-amber-200 font-serif"
      >
        {phase === "tossing" ? "金钱演卦..." : "卦象生成..."}
      </motion.p>
    </motion.div>
  );
}
