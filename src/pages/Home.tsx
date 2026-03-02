import { motion } from "motion/react";
import { Link } from "react-router-dom";

const categories = [
  {
    path: "/astrology",
    name: "星象占星",
    desc: "洞察星辰轨迹，解读命运密码",
    image: "https://images.unsplash.com/photo-1534239697882-8a52c3864ae2?q=80&w=1920&auto=format&fit=crop",
    color: "from-blue-900/80 to-indigo-900/80",
  },
  {
    path: "/tarot",
    name: "塔罗秘仪",
    desc: "倾听潜意识的低语，揭示未知之境",
    image: "https://images.unsplash.com/photo-1590595906931-81f04f0ccebb?q=80&w=1920&auto=format&fit=crop",
    color: "from-purple-900/80 to-fuchsia-900/80",
  },
  {
    path: "/qimen",
    name: "奇门遁甲",
    desc: "掌握时空法则，趋吉避凶之道",
    image: "https://images.unsplash.com/photo-1518709414768-a88986a45ca5?q=80&w=1920&auto=format&fit=crop",
    color: "from-emerald-900/80 to-teal-900/80",
  },
  {
    path: "/iching",
    name: "周易八卦",
    desc: "推演阴阳变化，明辨万物之理",
    image: "https://images.unsplash.com/photo-1614726365723-49cfae9f0294?q=80&w=1920&auto=format&fit=crop",
    color: "from-amber-900/80 to-orange-900/80",
  },
];

export default function Home() {
  return (
    <div className="p-6 md:p-12 pb-24 md:pb-12 max-w-7xl mx-auto">
      <header className="mb-16 mt-8 md:mt-0">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-light tracking-widest mb-4"
        >
          洞悉<span className="font-medium">天机</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-neutral-400 tracking-wider text-lg"
        >
          探索宇宙奥秘，聆听命运的回响
        </motion.p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {categories.map((cat, i) => (
          <Link key={cat.path} to={cat.path}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              className="group relative h-64 md:h-80 rounded-3xl overflow-hidden cursor-pointer"
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} mix-blend-multiply opacity-80 transition-opacity duration-500 group-hover:opacity-60`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h2 className="text-3xl font-medium tracking-widest mb-2 text-white/90 group-hover:text-white transition-colors">
                  {cat.name}
                </h2>
                <p className="text-white/60 tracking-wider transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  {cat.desc}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
