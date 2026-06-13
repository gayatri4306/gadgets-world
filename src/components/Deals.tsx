import { useState } from "react";
import { 
  Percent, 
  Copy, 
  Check, 
  Sparkles, 
  Compass, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Tag
} from "lucide-react";
import { SPECIAL_OFFERS } from "../data";

interface DealsProps {
  onGoToShop: () => void;
  showToast: (msg: string, type: "success" | "info" | "warn") => void;
}

export default function Deals({ onGoToShop, showToast }: DealsProps) {
  const [copiedCodeSet, setCopiedCodeSet] = useState<Record<string, boolean>>({});

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeSet((prev) => ({ ...prev, [code]: true }));
    showToast(`Coupon code ${code} copied!`, "success");
    setTimeout(() => {
      setCopiedCodeSet((prev) => ({ ...prev, [code]: false }));
    }, 2500);
  };

  return (
    <div className="py-8 bg-[#09090b] text-neutral-300 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Headers */}
        <div className="space-y-2 mb-10 pb-5 border-b border-[#27272a]">
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-wider flex items-center gap-2">
            <span>OFFERS & PROMOTIONAL TERMINAL</span>
            <Compass className="w-6 h-6 text-[#a855f7] animate-[spin_8s_linear_infinite]" />
          </h1>
          <p className="text-xs font-mono text-neutral-400">
            LOAD ACTIVE COMPONENT REBATES TO INJECT INSTANT SAVINGS ON SHIPMENTS
          </p>
        </div>

        {/* Big visual showcase */}
        <div className="relative rounded-3xl bg-gradient-to-tr from-[#18181b] to-black border border-[#a855f7]/40 p-6 sm:p-10 md:p-14 overflow-hidden mb-12 shadow-2xl">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#06b6d4]/10 rounded-full blur-[80px]" />

          <div className="relative z-10 max-w-xl space-y-6">
            <span className="px-2.5 py-1 bg-[#a855f7]/25 text-[#a855f7] rounded text-[10px] font-mono tracking-widest font-bold uppercase border border-[#a855f7]/55">
              Seasonal Sales Surge
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white leading-none">
              SUMMER QUANTUM <span className="text-[#06b6d4] text-shadow-cyan">surges active</span>
            </h2>
            <p className="text-neutral-300 text-sm leading-relaxed">
              We've unlocked verified 20% flat warehouse allowances matching all computers, accessories, and mobile products. Copy code below to bind!
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <div 
                onClick={() => handleCopyCode("CYBER20")}
                className="bg-black/85 border border-[#27272a] hover:border-[#06b6d4] p-3 rounded-2xl flex items-center space-x-4 cursor-pointer group select-none transition"
              >
                <div>
                  <p className="text-[9px] uppercase font-mono tracking-wider text-neutral-400">ALLOWANCE CODE</p>
                  <p className="text-sm font-black font-mono tracking-widest text-white">CYBER20</p>
                </div>
                <div className="p-2 bg-neutral-800 rounded-lg text-neutral-400 group-hover:text-white transition">
                  {copiedCodeSet["CYBER20"] ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </div>
              </div>

              <button
                onClick={onGoToShop}
                className="flex items-center space-x-1 text-sm font-semibold text-[#06b6d4] hover:text-white hover:translate-x-1 transition duration-200"
              >
                <span>Deploy Catalog Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Coupons visual grid */}
        <div className="space-y-6">
          <h3 className="font-display font-black text-xl tracking-wider text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#06b6d4]" />
            <span>ACTIVE BLUEPRINT REBATE SLOTS</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SPECIAL_OFFERS.map((offer) => {
              const isCopied = !!copiedCodeSet[offer.code];

              return (
                <div 
                  key={offer.id}
                  className="bg-[#18181b] border border-[#27272a] hover:border-neutral-700 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg"
                >
                  
                  {/* Coupon card image slots */}
                  <div className="relative pt-[45%] bg-neutral-900 overflow-hidden">
                    <img src={offer.bannerImage} alt={offer.title} referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover grayscale-35" />
                    <div className="absolute inset-0 bg-black/55" />
                    <div className="absolute inset-0 p-4 flex flex-col justify-between items-start text-left">
                      <div className="flex items-center space-x-1.5 bg-[#09090b]/80 border border-[#27272a] px-2 py-1 rounded text-white font-mono text-[9px]">
                        <Clock className="w-3 h-3 text-[#a855f7]" />
                        <span>{offer.endsIn}</span>
                      </div>
                      
                      <div className="space-y-0.5">
                        <span className="text-2xl font-mono font-black text-[#06b6d4]">{offer.discountPercent}% OFF</span>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">{offer.title}</h4>
                      </div>
                    </div>
                  </div>

                  {/* Coupon specs */}
                  <div className="p-4 space-y-4 text-left flex-1 flex flex-col justify-between">
                    <p className="text-xs text-neutral-400 leading-relaxed font-sans min-h-[48px]">
                      {offer.description}
                    </p>

                    <div className="border-t border-[#27272a]/70 pt-3 flex items-center justify-between">
                      <div className="text-left font-mono">
                        <span className="text-[10px] text-neutral-500 uppercase leading-none block">Coupon identifier</span>
                        <span className="text-xs font-bold text-white uppercase tracking-wider">{offer.code}</span>
                      </div>

                      <button
                        onClick={() => handleCopyCode(offer.code)}
                        className={`flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-mono font-medium border transition duration-150 cursor-pointer ${isCopied ? "border-emerald-400/55 bg-emerald-500/10 text-emerald-400" : "border-[#27272a] bg-neutral-900 hover:border-neutral-500 text-neutral-300 hover:text-white"}`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>COPIED</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[#06b6d4]" />
                            <span>COPY CODE</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Customer policy metrics details banner */}
        <div className="mt-12 p-6 bg-gradient-to-r from-purple-500/5 via-cyan-500/0 t-purple-500/5 rounded-2xl border border-[#27272a] grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase text-[#06b6d4] font-bold flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              <span>Allowances Stack details</span>
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              * Active campaign discount code allowances are limited to single-consignor use. Check this page daily for newly registered allowance codes from Gadgets World engineers.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase text-purple-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Free cargo transit protocols</span>
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              * Any shopping basket total exceeding a net value of <span className="text-white font-bold">₹12,450</span> bypasses our standard prioritization cargo transit fee automatically. No codes required.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
