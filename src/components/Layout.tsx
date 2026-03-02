import { Outlet, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Moon, Sun, Compass, BookOpen, Settings, ExternalLink, Github } from "lucide-react";
import { cn } from "../lib/utils";

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { path: "/", name: "天枢", icon: Sparkles },
    { path: "/astrology", name: "星象", icon: Moon },
    { path: "/tarot", name: "塔罗", icon: Sun },
    { path: "/qimen", name: "奇门", icon: Compass },
    { path: "/iching", name: "周易", icon: BookOpen },
  ];

  const settingsNavItems = [
    { path: "/settings/llm", name: "模型配置", icon: Settings },
  ];

  const moreWorks = [
    { name: "天机", url: "https://tianji-nu.vercel.app/", icon: Sparkles, color: "text-indigo-400" },
    { name: "AIMBOT", url: "https://aim.danzaii.cn/", icon: Github, color: "text-emerald-400" },
    { name: "AetherLink", url: "https://aether-link-ten.vercel.app/", icon: ExternalLink, color: "text-blue-400" },
    { name: "MoodCard", url: "https://mood.danzaii.cn/", icon: ExternalLink, color: "text-purple-400" },
    { name: "PinDou", url: "https://pindou.danzaii.cn/", icon: ExternalLink, color: "text-pink-400" },
    { name: "ChromatoPoetry", url: "https://color.danzaii.cn/", icon: ExternalLink, color: "text-amber-400" },
    { name: "Toiletime", url: "https://time.danzaii.cn/", icon: ExternalLink, color: "text-teal-400" },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col md:flex-row font-sans selection:bg-indigo-500/30">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/10 bg-black/50 backdrop-blur-xl p-6">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-medium tracking-widest">天机</h1>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                  isActive
                    ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="tracking-widest">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-6 border-t border-white/10">
          <nav className="flex flex-col gap-2">
            {settingsNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                    isActive
                      ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="tracking-widest">{item.name}</span>
                </Link>
              );
            })}
          </nav>
          
          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="text-xs text-neutral-500 tracking-widest mb-3 uppercase">更多作品</h3>
            <div className="space-y-1">
              {moreWorks.map((work) => {
                const Icon = work.icon;
                return (
                  <a
                    key={work.name}
                    href={work.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-all duration-300 group"
                  >
                    <Icon className={`w-4 h-4 ${work.color} group-hover:scale-110 transition-transform`} />
                    <span className="text-sm tracking-wider">{work.name}</span>
                    <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-50 transition-opacity" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden flex flex-col h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex-1 overflow-y-auto"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 p-4 pb-safe flex justify-around items-center z-50">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 p-2 transition-colors",
                isActive ? "text-white" : "text-neutral-500"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] tracking-widest">{item.name}</span>
            </Link>
          );
        })}
        <Link
          to="/settings/llm"
          className={cn(
            "flex flex-col items-center gap-1 p-2 transition-colors",
            location.pathname === "/settings/llm" ? "text-white" : "text-neutral-500"
          )}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] tracking-widest">配置</span>
        </Link>
      </nav>
    </div>
  );
}
