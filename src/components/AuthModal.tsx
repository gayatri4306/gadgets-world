import React, { useState } from "react";
import { 
  X, 
  Lock, 
  Mail, 
  UserPlus, 
  Sparkles, 
  BadgeCheck,
  TrendingUp,
  User as UserIcon
} from "lucide-react";
import { User } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  showToast: (msg: string, type: "success" | "info" | "warn") => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  showToast
}: AuthModalProps) {
  // active tab: "login" | "register"
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Input states
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      showToast("Email and password credentials are mandatory", "warn");
      return;
    }

    if (activeTab === "register" && !name.trim()) {
      showToast("Please provide your name for registration", "warn");
      return;
    }

    // Process simulation
    const simulatedUser: User = {
      name: activeTab === "login" ? (email.split("@")[0] || "Buyer One") : name,
      email: email.trim().toLowerCase(),
      isLoggedIn: true,
      wishlist: [],
      orders: []
    };

    onLoginSuccess(simulatedUser);
    showToast(`Access granted! Welcome back, ${simulatedUser.name}`, "success");
    onClose();
    
    // Clear inputs
    setEmail("");
    setName("");
    setPassword("");
  };

  const handlePresetFill = () => {
    setEmail("vurukutigayatri8@gmail.com");
    setName("Gayatri Vurukuti");
    setPassword("password123");
    showToast("Profile preset loaded successfully!", "info");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred overlay */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
      />

      {/* Modal element */}
      <div className="relative w-full max-w-md bg-[#18181b] border border-[#27272a] hover:border-[#06b6d4]/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl overflow-hidden text-left transition-all z-10">
        
        {/* Scanning horizontal neon line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 via-[#a855f7] to-cyan-400" />

        {/* Top title and dismiss */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-display font-black text-xl text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>ACCESS NODE TERMINAL</span>
              <Sparkles className="w-4 h-4 text-[#06b6d4]" />
            </h3>
            <p className="text-[9px] font-mono text-neutral-400">AUTHENTICATE BUYER CREDENTIAL ENGINES</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-neutral-900 border border-[#27272a] hover:border-[#f43f5e] hover:text-[#f43f5e] text-neutral-400 rounded-xl transition"
            title="Eject terminal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs picker navigation links */}
        <div className="grid grid-cols-2 gap-1 bg-black/35 p-1 rounded-xl border border-[#27272a]">
          <button
            onClick={() => setActiveTab("login")}
            className={`py-2 text-xs font-mono font-bold tracking-widest uppercase rounded-lg transition-all cursor-pointer ${activeTab === "login" ? "bg-[#27272a] text-white" : "text-neutral-500 hover:text-neutral-300"}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`py-2 text-xs font-mono font-bold tracking-widest uppercase rounded-lg transition-all cursor-pointer ${activeTab === "register" ? "bg-[#27272a] text-purple-400" : "text-neutral-500 hover:text-neutral-300"}`}
          >
            New Identity
          </button>
        </div>

        {/* Preset helper button */}
        <button
          type="button"
          onClick={handlePresetFill}
          className="w-full flex items-center justify-center space-x-2 bg-[#27272a]/40 hover:bg-[#27272a]/80 border border-dashed border-neutral-700 hover:border-[#06b6d4] text-[10px] text-neutral-400 hover:text-white font-mono py-2.5 rounded-xl transition"
        >
          <TrendingUp className="w-3.5 h-3.5 text-[#06b6d4]" />
          <span>Inject Developer Preset Profile</span>
        </button>

        {/* Auth Forms */}
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          
          {activeTab === "register" && (
            <div>
              <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Human full name*</label>
              <div className="relative">
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Gayatri Vurukuti"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#09090b] text-white text-xs border border-[#27272a] focus:border-[#06b6d4] rounded-xl px-4 py-3 pl-11 outline-none"
                />
                <UserIcon className="absolute left-4 top-3.5 w-4 h-4 text-neutral-500" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Email address / identifier*</label>
            <div className="relative">
              <input 
                type="email" 
                required
                placeholder="e.g. user@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#09090b] text-white text-xs border border-[#27272a] focus:border-[#06b6d4] rounded-xl px-4 py-3 pl-11 outline-none font-mono text-[11px]"
              />
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-neutral-500" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Security password*</label>
            <div className="relative">
              <input 
                type="password" 
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#09090b] text-white text-xs border border-[#27272a] focus:border-[#06b6d4] rounded-xl px-4 py-3 pl-11 outline-none"
              />
              <Lock className="absolute left-4 top-3.5 w-4 h-4 text-neutral-500" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono font-bold tracking-widest text-xs py-3.5 rounded-xl shadow-lg transition duration-200 uppercase cursor-pointer"
          >
            <BadgeCheck className="w-4 h-4 text-purple-300" />
            <span>{activeTab === "login" ? "Verify Credentials" : "Issue Registration Identity"}</span>
          </button>

        </form>

        {/* Security assurance footnotes */}
        <p className="text-[9px] text-center text-neutral-500 leading-normal">
          By locking credentials you activate encrypted cookie telemetry and checkout synchronization frameworks. Terms of client access applied.
        </p>

      </div>
    </div>
  );
}
