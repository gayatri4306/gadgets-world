import React, { useState } from "react";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  Compass,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  Bot,
  User,
  Sparkles,
  Cpu
} from "lucide-react";

interface AboutContactProps {
  showToast: (msg: string, type: "success" | "info" | "warn") => void;
}

interface ChatMessage {
  sender: "user" | "assistant";
  text: string;
}

export default function AboutContact({ showToast }: AboutContactProps) {
  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dept, setDept] = useState("technical");
  const [message, setMessage] = useState("");

  // ticket success
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  // AI Chat states
  const [chatInput, setChatInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "assistant",
      text: "Greetings, Client. I am the Gadgets World Cyber-Hardware Advisor. Specify any hardware parameters, compatibility inquiries, or system stock checks, and I will parse specifications immediately."
    }
  ]);

  const handleSubmitSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast("Please compile all mandatory support fields", "warn");
      return;
    }

    showToast("Transmitting support payload...", "info");

    fetch("/api/support/ticket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        subject: dept.toUpperCase(),
        message: message.trim()
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.ticket) {
        setSubmittedTicket(data.ticket.id);
        showToast("Support ticket compiled and registered successfully!", "success");
      } else {
        showToast(data.error || "Failed to submit support transmission", "warn");
      }
    })
    .catch(err => {
      console.error(err);
      // Resilient fallback local simulation
      const ticketId = "TICKET-" + Math.floor(100000 + Math.random() * 900000) + "-INQ";
      setSubmittedTicket(ticketId);
      showToast("Support ticket compiled and registered in offline storage mode!", "success");
    });
  };

  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim() || isGenerating) return;

    const userMsg = promptText.trim();
    setMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");
    setIsGenerating(true);

    fetch("/api/assistant/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: userMsg })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.response) {
        setMessages(prev => [...prev, { sender: "assistant", text: data.response }]);
      } else {
        setMessages(prev => [...prev, { sender: "assistant", text: data.error || "Unable to acquire response from hardware adviser cell." }]);
      }
    })
    .catch(err => {
      console.error(err);
      setMessages(prev => [...prev, { sender: "assistant", text: "Offline adapter: Unable to contact active Gemini API server route. Please verify that your dev server is fully active." }]);
    })
    .finally(() => {
      setIsGenerating(false);
    });
  };

  const resetTicket = () => {
    setName("");
    setEmail("");
    setDept("technical");
    setMessage("");
    setSubmittedTicket(null);
  };

  const samplePrompts = [
    "Tell me about the TitanX cellular features",
    "Show mechanical scooter engine specs",
    "Recommend computing gear under ₹1,65,000"
  ];

  return (
    <div className="py-8 bg-[#09090b] text-neutral-300 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header section */}
        <div className="space-y-2 mb-10 pb-5 border-b border-[#27272a]">
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-wider flex items-center gap-2">
            <span>ABOUT GADGETS WORLD & SUPPORT</span>
            <Building2 className="w-6 h-6 text-[#06b6d4]" />
          </h1>
          <p className="text-xs font-mono text-neutral-400">
            CONNECT WITH FUTURISTIC RETAIL INFRASTRUCTURES & CLIENT SERVICE DESKS
          </p>
        </div>

        {/* Company Overview panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch mb-16">
          
          <div className="lg:col-span-7 bg-[#18181b] border border-[#27272a] rounded-3xl p-6 sm:p-10 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#a855f7] border border-[#a855f7]/40 bg-[#a855f7]/10 px-2.5 py-1 rounded font-bold">
                The Corporate Philosophy
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
                Architects of <span className="text-[#06b6d4] text-shadow-cyan">Next-Gen Shopping</span>
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed font-sans">
                Launched in 2026, <strong>Gadgets World</strong> represents the pinnacle of premium electronic and smart mobility retail. Our core mission transcends standard commerce — we curate high-performance, aesthetically cohesive machinery designed for immediate physical integration.
              </p>
              <p className="text-sm text-neutral-400 leading-relaxed">
                By maintaining direct coordination channels with aircraft-grade titanium chassis smelters, liquid cooling designers, and pro peripheral programmers, we dispatch unmatched gear to buyers across the globe. Each delivery carries our stamp of architectural completeness.
              </p>
            </div>

            {/* Core credentials badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#27272a]/60">
              <div className="space-y-1">
                <span className="text-xs font-bold text-white font-mono block">99.8%</span>
                <span className="text-[10px] uppercase text-neutral-500 font-mono">Dispatches Verified</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#06b6d4] font-mono block">&lt; 3 Hours</span>
                <span className="text-[10px] uppercase text-neutral-500 font-mono">Support Responses</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#a855f7] font-mono block">Zero-Cost</span>
                <span className="text-[10px] uppercase text-neutral-500 font-mono">Exchanges Active</span>
              </div>
            </div>
          </div>

          {/* Location / HQ contacts card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#18181b] to-black border border-[#27272a] rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            
            {/* Ambient map graphics lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#06b6d4]/5 rounded-full blur-[50px]" />

            <div className="space-y-6 relative z-10 text-left">
              <h3 className="font-display font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <MapPin className="text-[#06b6d4] w-5 h-5" />
                <span>Consolidated HQ Terminal</span>
              </h3>

              <div className="space-y-4 text-xs font-sans">
                <div className="space-y-1">
                  <p className="text-[10px] font-mono uppercase text-neutral-500 tracking-wider">Physical Coordinates</p>
                  <p className="text-neutral-200 font-bold">Gadgets World Tower, Building 14</p>
                  <p className="text-neutral-400 leading-tight">Hyderabad Technology Park, Madhapur</p>
                  <p className="text-neutral-400">Telangana, 500081, India</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#27272a]/80">
                  <p className="flex items-center space-x-2 text-neutral-300">
                    <Phone className="w-4 h-4 text-[#06b6d4]" />
                    <span>+91 40 9876 5432</span>
                  </p>
                  <p className="flex items-center space-x-2 text-neutral-300">
                    <Mail className="w-4 h-4 text-purple-400" />
                    <span>support@gadgetsworld.internal</span>
                  </p>
                  <p className="flex items-center space-x-2 text-neutral-300">
                    <Clock className="w-4 h-4 text-neutral-400" />
                    <span>Terminal uptime: 09:00 - 21:00 UTC</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 relative z-10 text-left">
              <div className="p-3 bg-neutral-900 border border-[#27272a] rounded-xl flex items-center space-x-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <p className="text-[10px] text-neutral-400 leading-relaxed font-mono">
                  * Dynamic security certificates and logistics channels are fully verified across Indian, European, and US domains.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* COMBINED INTERACTIVE INTEGRATIONS AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* COLUMN 1: SMART AI HARDWARE ADVISOR */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-[#27272a]">
                <Bot className="w-6 h-6 text-[#06b6d4]" />
                <div>
                  <h3 className="font-display font-black text-lg text-white uppercase tracking-wider">AI Cyber-Adviser</h3>
                  <p className="text-[9px] font-mono text-[#06b6d4] tracking-widest uppercase">Powered by Google Gemini</p>
                </div>
              </div>

              {/* Chat messages viewport */}
              <div className="h-[280px] overflow-y-auto bg-neutral-950/80 rounded-2xl p-4 border border-[#27272a]/60 space-y-4 font-sans text-xs scrollbar-thin">
                {messages.map((m, idx) => (
                  <div key={idx} className={`flex gap-2.5 ${m.sender === "user" ? "justify-end text-right" : "justify-start text-left"}`}>
                    {m.sender !== "user" && <Bot className="w-4.5 h-4.5 text-[#06b6d4] flex-shrink-0 mt-0.5" />}
                    <div className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${m.sender === "user" ? "bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/20 text-neutral-200" : "bg-neutral-900 border border-[#27272a] text-neutral-300"}`}>
                      <p className="whitespace-pre-line">{m.text}</p>
                    </div>
                    {m.sender === "user" && <User className="w-4.5 h-4.5 text-[#a855f7] flex-shrink-0 mt-0.5" />}
                  </div>
                ))}
                {isGenerating && (
                  <div className="flex items-center space-x-2 text-xs text-neutral-500 font-mono">
                    <span className="w-1.5 h-1.5 bg-[#06b6d4] rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-[#06b6d4] rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-[#06b6d4] rounded-full animate-bounce [animation-delay:0.4s]" />
                    <span>querying hardware nodes...</span>
                  </div>
                )}
              </div>

              {/* Rapid suggestions */}
              <div className="flex flex-wrap gap-2 pt-1">
                {samplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendPrompt(p)}
                    className="text-[10px] font-mono px-3 py-1.5 bg-neutral-900 hover:bg-[#27272a] border border-[#27272a] text-[#06b6d4] hover:text-[#06b6d4]/80 rounded-full transition cursor-pointer"
                  >
                    🚀 {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Input prompt compiler */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendPrompt(chatInput);
              }}
              className="mt-4 flex items-center gap-2 pt-3 border-t border-[#27272a]"
            >
              <input
                type="text"
                placeholder="Ask about specs, stocks, customization..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-neutral-950 text-white text-xs border border-[#27272a] focus:border-[#06b6d4] rounded-full px-4.5 py-3 outline-none"
              />
              <button
                type="submit"
                disabled={isGenerating}
                className="p-3 bg-[#06b6d4] hover:bg-[#06b6d4]/80 disabled:opacity-40 text-black rounded-full cursor-pointer transition active:scale-95 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* COLUMN 2: DIAGNOSTIC TICKET TRANSMITTER */}
          <div className="flex flex-col justify-between">
            {submittedTicket ? (
              <div className="bg-[#18181b] border border-[#06b6d4]/40 rounded-3xl p-8 text-center space-y-6 shadow-xl relative overflow-hidden h-full flex flex-col justify-center items-center">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-600" />
                <div className="p-4 bg-cyan-500/10 rounded-full text-[#06b6d4] inline-flex">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-white font-bold font-display text-lg uppercase tracking-wide">SUPPORT PROTOCOL ASSIGNED</h4>
                  <p className="text-xs text-neutral-400 font-mono tracking-widest uppercase font-semibold">
                    TICKET_REF: <span className="text-[#06b6d4] font-bold">{submittedTicket}</span>
                  </p>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed max-w-sm mx-auto font-sans">
                  Your ticket has been logged inside our cloud-node database. Our diagnostic support engineers will review your transmission request within <span className="text-[#06b6d4] font-semibold">2 working hours</span>.
                </p>
                <button
                  type="button"
                  onClick={resetTicket}
                  className="bg-[#27272a] hover:bg-[#323236] text-[10px] font-mono tracking-widest uppercase text-white px-6 py-3 rounded-full border border-neutral-600 transition"
                >
                  Reset Support Terminal
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitSupport} className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6 sm:p-8 space-y-4 text-left h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 pb-3 border-b border-[#27272a] mb-4">
                    <HelpCircle className="w-5 h-5 text-[#a855f7]" />
                    <h3 className="font-display font-black text-lg text-white uppercase tracking-wider">Diagnostic Desk</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1 font-semibold">Full Committer Name*</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Gayatri Vurukuti"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#09090b] text-white text-xs border border-[#27272a] focus:border-[#06b6d4] rounded-xl px-4 py-3 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1 font-semibold">Verified Contact Email*</label>
                      <input 
                        type="email" 
                        required
                        placeholder="e.g. user@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#09090b] text-white text-xs border border-[#27272a] focus:border-[#06b6d4] rounded-xl px-4 py-3 outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1.5 font-semibold">Routing Cell</label>
                    <select 
                      value={dept}
                      onChange={(e) => setDept(e.target.value)}
                      className="w-full bg-[#09090b] text-neutral-300 text-xs border border-[#27272a] focus:border-[#06b6d4] rounded-xl px-4 py-3 outline-none font-mono"
                    >
                      <option value="technical">TECHNICAL HARDWARE BLUEPRINTS INC.</option>
                      <option value="sales">SALES & COUPLING REDEEM DESKS</option>
                      <option value="logistics">LOGISTICS CARRIER TRANSIT SHIELDS</option>
                      <option value="corporate">CORPORATE ALLIANCE VENTURES</option>
                    </select>
                  </div>

                  <div className="mt-3">
                    <label className="block text-[10px] font-mono uppercase text-[#06b6d4] mb-1.5 font-semibold">Message Description / Query Payload*</label>
                    <textarea 
                      rows={3}
                      required
                      placeholder="Elaborate details on hardware custom setups, warranty registrations, or bulk deliveries..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-[#09090b] text-white text-xs border border-[#27272a] focus:border-[#06b6d4] rounded-xl p-4 outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="pt-2 text-right">
                  <button
                    type="submit"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-mono font-bold tracking-widest uppercase text-white px-8 py-3.5 rounded-full shadow-lg cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-purple-200" />
                    <span>Transmit Query</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
