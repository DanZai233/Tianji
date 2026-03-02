import { motion } from "motion/react";

interface RitualOverlayProps {
  text: string;
  onComplete: () => void;
}

export default function RitualOverlay({ text, onComplete }: RitualOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={() => {
        setTimeout(onComplete, 3000); // 3 seconds of ritual
      }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl"
    >
      <div className="flex flex-col items-center gap-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 border-2 border-dashed border-indigo-500/50 rounded-full flex items-center justify-center"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 bg-indigo-500/20 rounded-full blur-xl"
          />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xl tracking-[0.5em] text-white/80 font-light"
        >
          {text}
        </motion.p>
      </div>
    </motion.div>
  );
}
