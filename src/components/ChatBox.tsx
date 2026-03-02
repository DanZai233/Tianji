import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Sparkles, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { LLMService } from "../lib/llm-service";
import { LLMProviderConfig, DEFAULT_PROVIDERS, LLMMessage } from "../lib/llm-providers";

const STORAGE_KEY = "tianji_llm_providers";

interface Message {
  role: "user" | "model";
  content: string;
}

interface ChatBoxProps {
  context: string;
  systemInstruction: string;
}

function getActiveProvider(): LLMProviderConfig | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const providers: LLMProviderConfig[] = saved ? JSON.parse(saved) : DEFAULT_PROVIDERS;
    const enabled = providers.find(p => p.enabled && p.apiKey);
    return enabled || null;
  } catch {
    return DEFAULT_PROVIDERS.find(p => p.enabled && p.apiKey) || null;
  }
}

export default function ChatBox({ context, systemInstruction }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [llmService, setLlmService] = useState<LLMService | null>(null);
  const [providerName, setProviderName] = useState<string>("");

  useEffect(() => {
    const provider = getActiveProvider();
    if (provider) {
      setLlmService(new LLMService(provider));
      setProviderName(provider.name);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !llmService || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const allMessages: LLMMessage[] = [
        { role: "system", content: `${systemInstruction}\n\n 当前占卜结果上下文：\n${context}` },
        ...messages.map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
        { role: "user", content: userMsg },
      ];

      const response = await llmService.sendMessage(allMessages);
      setMessages((prev) => [...prev, { role: "model", content: response.text }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { role: "model", content: "抱歉，天机受到干扰，请稍后再试。" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
      <div className="p-4 border-b border-white/10 bg-black/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-sm tracking-widest text-white/80">解惑对话</span>
        </div>
        {providerName && (
          <span className="text-xs text-neutral-500 tracking-wider">{providerName}</span>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-white/30 text-sm tracking-wider">
            有什么关于占卜结果的疑问，都可以问我...
          </div>
        )}
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-indigo-600/80 text-white rounded-tr-sm"
                    : "bg-white/10 text-white/90 rounded-tl-sm prose prose-invert prose-sm"
                }`}
              >
                {msg.role === "model" ? (
                  <div className="markdown-body">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-white/10 p-3 rounded-2xl rounded-tl-sm">
              <Loader2 className="w-4 h-4 animate-spin text-white/50" />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-black/20 border-t border-white/10">
        <div className="flex items-center gap-2 bg-black/40 rounded-xl p-1 pr-2 border border-white/5 focus-within:border-indigo-500/50 transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="询问占卜师..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-white px-3 py-2 placeholder:text-white/30"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
