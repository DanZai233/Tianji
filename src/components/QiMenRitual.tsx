import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function QiMenRitual({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState("heaven");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("earth"), 1500);
    const t2 = setTimeout(() => setPhase("human"), 3000);
    const t3 = setTimeout(() => setPhase("god"), 4500);
    const t4 = setTimeout(onComplete, 6500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl"
    >
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Earth Pan */}
        <motion.div 
          animate={{ rotate: phase === "earth" ? 90 : 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute w-72 h-72 border-2 border-dashed border-emerald-900/60 rounded-full flex items-center justify-center"
        >
          <span className="absolute top-4 text-emerald-700/60 text-sm font-serif">地盘八卦</span>
        </motion.div>
        
        {/* Heaven Pan */}
        <motion.div 
          animate={{ rotate: phase === "heaven" || phase === "earth" ? 180 : 90 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute w-56 h-56 border border-emerald-700/60 rounded-full flex items-center justify-center bg-emerald-950/20"
        >
          <span className="absolute top-4 text-emerald-500/60 text-sm font-serif">天盘九星</span>
        </motion.div>

        {/* Human Pan */}
        <motion.div 
          animate={{ rotate: phase === "human" ? -90 : 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute w-40 h-40 border-2 border-emerald-500/60 rounded-full flex items-center justify-center bg-emerald-900/30"
        >
          <span className="absolute top-3 text-emerald-400/80 text-sm font-serif">人盘八门</span>
        </motion.div>

        {/* God Pan */}
        <motion.div 
          animate={{ rotate: phase === "god" ? 360 : 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute w-24 h-24 border-2 border-emerald-300/80 rounded-full flex items-center justify-center bg-emerald-800/40 shadow-[0_0_40px_rgba(16,185,129,0.4)]"
        >
          <span className="text-emerald-100 text-lg font-serif">神盘</span>
        </motion.div>
      </div>
      <motion.p
        key={phase}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-16 text-xl tracking-[0.3em] text-emerald-200 font-serif"
      >
        {phase === "heaven" ? "布天盘九星..." : 
         phase === "earth" ? "排地盘八卦..." : 
         phase === "human" ? "转人盘八门..." : "定神盘八神..."}
      </motion.p>
    </motion.div>
  );
}
