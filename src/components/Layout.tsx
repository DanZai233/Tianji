import { Outlet, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Moon, Sun, Compass, BookOpen, Settings } from "lucide-react";
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
