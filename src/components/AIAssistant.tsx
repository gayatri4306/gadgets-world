import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  MessageSquare, 
  Minimize2, 
  HelpCircle,
  TrendingUp,
  Cpu,
  BadgeAlert
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product } from "../types";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: Date;
}

interface AIAssistantProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  setView: (view: "home" | "shop" | "detail" | "cart" | "checkout" | "offers" | "about" | "orders") => void;
  showToast: (msg: string, type: "success" | "info" | "warn") => void;
}

export default function AIAssistant({ products, onSelectProduct, setView, showToast }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-1",
      sender: "assistant",
      text: "Greetings, Client! I am your Cyber-Hardware Advisor. Ask me anything about stock configurations, device specifications, system compatibility, or hot deals!",
      timestamp: new Date()
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setUnreadCount(0);
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend: string) => {
    const promptText = textToSend.trim();
    if (!promptText || isGenerating) return;

    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      sender: "user",
      text: promptText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsGenerating(true);

    try {
      const response = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          chatHistory: messages.map(m => ({ role: m.sender, parts: [{ text: m.text }] }))
        })
      });

      const data = await response.json();
      if (data.success && data.response) {
        setMessages(prev => [...prev, {
          id: "asst-" + Date.now(),
          sender: "assistant",
          text: data.response,
          timestamp: new Date()
        }]);
      } else {
        throw new Error(data.error || "System node did not reply.");
      }
    } catch (err: any) {
      console.error("Assistant prompt relay error:", err);
      // Fallback response with catalog lookups
      let fallbackText = "Offline mode: I've scanned our current catalog for compatibility. ";
      const queryLower = promptText.toLowerCase();

      // Simple keywords lookups
      if (queryLower.includes("fold") || queryLower.includes("titanx") || queryLower.includes("phone")) {
        const p = products.find(prod => prod.id === "elec-1");
        fallbackText += `For cell fold technology, we have the **TitanX Quantum Fold** configured with Snapdragon Alpha Elite and 1TB storage of ultra-fast UFS 4.1 ($1399). Stock level is currently ${p?.stock || 12} units.`;
      } else if (queryLower.includes("scooter") || queryLower.includes("motor") || queryLower.includes("glide")) {
        const p = products.find(prod => prod.id === "veh-1");
        fallbackText += `Our primary electric micro-mobility unit is the **Carbon Glide X1 Scooter** ($799), utilizing a 1000W magnetic direct brushless hub motor with double-weave carbon fiber body. Stock level: ${p?.stock || 8} units.`;
      } else if (queryLower.includes("computer") || queryLower.includes("rig") || queryLower.includes("rtx") || queryLower.includes("workstation")) {
        const p = products.find(prod => prod.id === "comp-1");
        fallbackText += `Our apex workstation is the **Aether-15 Cyber Workstation** ($1999) built with a massive 24-core i9 processor and modular Nvidia RTX 5080 Laptop GPU. Stock level: ${p?.stock || 6}.`;
      } else if (queryLower.includes("vr") || queryLower.includes("wearable") || queryLower.includes("glasses")) {
        const p = products.find(prod => prod.id === "acc-1");
        fallbackText += `We offer the state-of-the-art **NeuralLink XR Wearable VR headset** ($599) featuring dual micro-OLED 4K screens per eye. Stock level: ${p?.stock || 4}.`;
      } else {
        fallbackText += "Presently, we have 5 high-tech item classifications online: TitanX Quantum Fold ($1399), SonicWave Eclipse ANC ($299), Carbon Glide Scooter ($799), Aether-15 Rig ($1999), and NeuralLink XR Glasses ($599). Please specify which one you'd like to inspect!";
      }

      setMessages(prev => [...prev, {
        id: "asst-fallback-" + Date.now(),
        sender: "assistant",
        text: fallbackText,
        timestamp: new Date()
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const sampleQuestions = [
    "Recommend a beast-mode gaming computer",
    "Show me specs of the foldable phone",
    "How does the Carbon Scooter engine compare?"
  ];

  return (
    <div className="fixed bottom-6 left-6 z-50 font-sans text-left">
      {/* Floating Action Button bubble */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            id="ai-assistant-toggle"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => {
              setIsOpen(true);
              setUnreadCount(0);
            }}
            className="group relative flex items-center justify-center p-4 bg-gradient-to-tr from-cyan-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-cyan-500/25 cursor-pointer border border-cyan-400/40 outline-none transition-all duration-300 active:scale-95"
            style={{ transformOrigin: "bottom left" }}
          >
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse shadow-md">
                {unreadCount}
              </span>
            )}
            <Bot className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
            
            {/* Hover tooltip hint */}
            <span className="absolute left-16 bg-[#18181b] border border-[#27272a] text-neutral-200 text-[10px] font-mono font-semibold tracking-wider uppercase px-3 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-250 shadow-xl">
              ⚡ LIVE CYBER ADVISOR
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ai-assistant-panel"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-80 sm:w-96 bg-[#09090b] border border-[#27272a]/90 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[520px] max-h-[85vh] relative"
            style={{ transformOrigin: "bottom left" }}
          >
            {/* Tech line indicator top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-teal-500 to-purple-600" />

            {/* Header section with Cyber Punk vibe */}
            <div className="p-4 bg-[#18181b] border-b border-[#27272a]/60 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-cyan-950/60 rounded-xl border border-cyan-500/20 text-[#06b6d4]">
                  <Bot className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display flex items-center gap-1.5">
                    <span>GW-ADVISOR INTEL</span>
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  </h4>
                  <p className="text-[9px] font-mono text-[#06b6d4] tracking-widest uppercase">NODE STATE: ACTIVE_GEMINI</p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 px-2.5 bg-neutral-900 border border-[#27272a] rounded-lg text-neutral-400 hover:text-white transition text-[10px] uppercase font-mono tracking-wider flex items-center gap-1 cursor-pointer"
                  title="Minimize chat window"
                >
                  <Minimize2 className="w-3 h-3" />
                  <span>Hide</span>
                </button>
              </div>
            </div>

            {/* Chat Content Panel */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin bg-neutral-950/90 bg-[radial-gradient(#18181b_1px,transparent_1px)] [background-size:16px_16px]">
              
              {/* Quick Assistant Introduction Widget */}
              <div className="p-3.5 bg-[#18181b]/50 border border-neutral-800 rounded-2xl space-y-2 text-xs text-neutral-400">
                <p className="font-semibold text-white font-mono text-[10px] tracking-widest uppercase text-cyan-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" /> SYSTEM INVENTORY DIRECTIVE
                </p>
                <p className="leading-relaxed">
                  Welcome to Gadget World's smart assistant layer. Use sample guides below or ask custom questions regarding device compatibility, speeds, or stock checks.
                </p>
              </div>

              {/* Message Streams */}
              {messages.map((m) => (
                <div key={m.id} className={`flex gap-2.5 ${m.sender === "user" ? "justify-end text-right" : "justify-start text-left"}`}>
                  {m.sender !== "user" && (
                    <div className="w-6.5 h-6.5 bg-[#18181b] border border-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400 flex-shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className={`p-3 rounded-2xl max-w-[82%] leading-relaxed ${
                    m.sender === "user" 
                      ? "bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/25 text-neutral-200 text-xs" 
                      : "bg-[#18181b] border border-[#27272a] text-neutral-300 text-xs"
                  }`}>
                    {/* Render message formatting beautifully */}
                    <p className="whitespace-pre-line overflow-hidden leading-relaxed font-sans">{m.text}</p>
                    <span className="block text-[8px] font-mono text-neutral-500 mt-1.5 uppercase">
                      {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {isGenerating && (
                <div className="flex items-center space-x-2 text-[10px] text-neutral-500 font-mono pl-1">
                  <span className="w-1.5 h-1.5 bg-[#06b6d4] rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-[#06b6d4] rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-[#06b6d4] rounded-full animate-bounce [animation-delay:0.4s]" />
                  <span>analyzing inventory hardware nodes...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Hot Topics Suggestions Box */}
            <div className="p-3 bg-[#18181b]/50 border-t border-[#27272a]/40 space-y-2">
              <p className="text-[9px] font-mono uppercase text-neutral-500 tracking-wider font-semibold">Suggested Hardware Inquiries</p>
              <div className="flex flex-col gap-1.5">
                {sampleQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(q)}
                    className="text-[10px] text-neutral-300 bg-neutral-900/80 hover:bg-[#18181b] border border-neutral-800 hover:border-[#06b6d4]/40 text-left px-3 py-1.5 rounded-xl transition truncate cursor-pointer"
                  >
                    🚀 {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 bg-neutral-950 border-t border-[#27272a] flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask smart cyber advisor..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isGenerating}
                className="flex-1 bg-[#09090b] text-neutral-200 text-xs border border-[#27272a] focus:border-[#06b6d4] rounded-full px-4 py-3 outline-none transition placeholder-neutral-600 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isGenerating || !input.trim()}
                className="p-3 bg-gradient-to-tr from-[#06b6d4] to-indigo-500 hover:opacity-90 disabled:opacity-30 text-black rounded-full cursor-pointer transition active:scale-95"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
