import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function AstrologyRitual({ onComplete }: { onComplete: () => void }) {
  const [stars, setStars] = useState<{x: number, y: number}[]>([]);
  
  useEffect(() => {
    const newStars = Array.from({ length: 25 }, () => ({
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80
    }));
    setStars(newStars);
    
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl overflow-hidden"
    >
      <div className="relative w-full h-full max-w-2xl max-h-[600px]">
        {stars.map((star, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0.5, 1], scale: 1 }}
            transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
            className="absolute w-1.5 h-1.5 bg-blue-300 rounded-full shadow-[0_0_10px_#93c5fd]"
            style={{ left: `${star.x}%`, top: `${star.y}%` }}
          />
        ))}
        <svg className="absolute inset-0 w-full h-full">
          {stars.map((star, i) => {
            if (i === stars.length - 1) return null;
            // Only connect some stars to make it look like constellations
            if (Math.random() > 0.6) return null;
            return (
              <motion.line
                key={`line-${i}`}
                x1={`${star.x}%`}
                y1={`${star.y}%`}
                x2={`${stars[i+1].x}%`}
                y2={`${stars[i+1].y}%`}
                stroke="rgba(147, 197, 253, 0.3)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: i * 0.1 }}
              />
            )
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-2xl tracking-[0.5em] text-blue-200 font-light bg-black/50 px-6 py-2 rounded-full backdrop-blur-md"
          >
            连接星辰轨迹...
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
