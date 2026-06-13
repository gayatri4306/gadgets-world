import React, { useState } from "react";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  ShoppingBag, 
  ChevronRight, 
  Tag, 
  Sparkles,
  Lock
} from "lucide-react";
import { CartItem, Product, formatPrice } from "../types";
import { SPECIAL_OFFERS } from "../data";

interface CartProps {
  cart: CartItem[];
  onUpdateQty: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  onGoToShop: () => void;
  onGoToCheckout: (appliedDiscountPercent: number, couponCode: string) => void;
  showToast: (msg: string, type: "success" | "info" | "warn") => void;
}

export default function Cart({
  cart,
  onUpdateQty,
  onRemoveItem,
  onSelectProduct,
  onGoToShop,
  onGoToCheckout,
  showToast
}: CartProps) {
  const [promoInput, setPromoInput] = useState("");
  const [activeCoupon, setActiveCoupon] = useState<{ code: string; percent: number } | null>(null);

  // Math totals
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const transitFee = subtotal > 150 ? 0 : 25; // free shipping over $150
  
  const discountAmount = activeCoupon 
    ? (subtotal * activeCoupon.percent) / 100 
    : 0;
  
  const estimatedTax = (subtotal - discountAmount) * 0.08; // 8% sales tax
  const finalTotal = subtotal - discountAmount + transitFee + estimatedTax;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const query = promoInput.trim().toUpperCase();
    if (!query) return;

    const matchedPromo = SPECIAL_OFFERS.find(o => o.code.toUpperCase() === query);

    if (matchedPromo) {
      setActiveCoupon({
        code: matchedPromo.code,
        percent: matchedPromo.discountPercent,
      });
      setPromoInput("");
      showToast(`Promo code "${matchedPromo.code}" applied! Saved ${matchedPromo.discountPercent}%`, "success");
    } else {
      showToast("Invalid security code. Review Deals tab for codes.", "warn");
    }
  };

  const handleClearPromo = () => {
    setActiveCoupon(null);
    showToast("Promotional rebate code detached", "info");
  };

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#09090b] text-neutral-300">
        <div className="max-w-md mx-auto space-y-6">
          <div className="inline-flex p-6 bg-[#18181b] border border-[#27272a] rounded-full text-neutral-500 animate-[pulse_2s_infinite]">
            <ShoppingBag className="w-16 h-16 text-[#06b6d4]" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display font-black text-2xl uppercase tracking-wider text-white">Cart Empty</h2>
            <p className="text-sm text-neutral-400">
              There are no cyber accessories or vehicles assigned to your customer cart. Head out to the gears shop!
            </p>
          </div>
          <button
            onClick={onGoToShop}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition"
          >
            <span>Scan Catalog</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-[#09090b] text-neutral-300 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation back block */}
        <button 
          onClick={onGoToShop}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-[#06b6d4] hover:text-[#06b6d4]/80 uppercase tracking-widest font-mono mb-8 group pl-1 focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Exit to Gear Catalog</span>
        </button>

        <h1 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-widest mb-10 flex items-center space-x-3">
          <span>CUSTOMER DEPLOYMENT CARD</span>
          <span className="text-xs bg-cyan-500/10 border border-cyan-500/30 text-[#06b6d4] px-2.5 py-1 rounded font-mono">
            {cart.reduce((sum, i) => sum + i.quantity, 0)} items loaded
          </span>
        </h1>

        {/* Layout details split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          
          {/* Main Selected list stacks column */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div 
                key={item.product.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#18181b] border border-[#27272a] hover:border-neutral-700/80 rounded-2xl transition duration-150 gap-4"
              >
                
                {/* Information blocks */}
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div 
                    onClick={() => onSelectProduct(item.product)}
                    className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-900 border border-[#27272a] flex-shrink-0 p-1 cursor-pointer"
                  >
                    <img src={item.product.image} alt={item.product.name} referrerPolicy="no-referrer" className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-[10px] font-mono uppercase text-[#06b6d4]">{item.product.brand}</p>
                    <h3 
                      onClick={() => onSelectProduct(item.product)}
                      className="font-semibold text-white text-sm sm:text-base hover:text-cyan-400 transition cursor-pointer truncate"
                    >
                      {item.product.name}
                    </h3>
                    <p className="text-xs font-mono text-neutral-400 mt-1">{formatPrice(item.product.price)} / unit</p>
                  </div>
                </div>

                {/* Adjustments stack */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-6 sm:space-x-8 border-t border-[#27272a]/50 pt-3 sm:pt-0 sm:border-0">
                  
                  {/* Quantity widgets */}
                  <div className="flex items-center border border-[#27272a] bg-black/40 rounded-xl overflow-hidden">
                    <button
                      onClick={() => {
                        if (item.quantity > 1) {
                          onUpdateQty(item.product.id, item.quantity - 1);
                        } else {
                          onRemoveItem(item.product.id);
                        }
                      }}
                      className="p-2 hover:bg-[#27272a] text-neutral-400 hover:text-white transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3.5 font-bold font-mono text-sm text-white min-w-[30px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => {
                        if (item.quantity < item.product.stock) {
                          onUpdateQty(item.product.id, item.quantity + 1);
                        } else {
                          showToast("Maximum warehouse stock limit", "warn");
                        }
                      }}
                      className="p-2 hover:bg-[#27272a] text-neutral-400 hover:text-white transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Calculated total / Delete */}
                  <div className="flex items-center space-x-4">
                    <p className="text-right font-mono font-bold text-white text-sm sm:text-base min-w-[70px]">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="p-2.5 bg-neutral-900 border border-neutral-700 hover:bg-[#f43f5e]/10 hover:border-[#f43f5e] hover:text-[#f43f5e] rounded-xl text-neutral-400 transition"
                      title="Eject Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>

          {/* Checkout Totals Right Column */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Promo application block */}
            <div className="p-6 bg-[#18181b] border border-[#27272a] rounded-2xl space-y-3.5 text-left">
              <h4 className="text-xs uppercase font-mono tracking-widest text-[#06b6d4] font-bold">Apply Security Promo</h4>
              
              {activeCoupon ? (
                <div className="p-3 bg-cyan-950/40 border border-[#06b6d4]/40 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-[#06b6d4]" />
                    <div>
                      <span className="text-xs font-bold font-mono text-white text-shadow-cyan">{activeCoupon.code}</span>
                      <p className="text-[9px] text-[#06b6d4]">-{activeCoupon.percent}% rebate coupon valid</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleClearPromo}
                    className="p-1 text-xs text-neutral-400 hover:text-[#f43f5e]"
                  >
                    Detract
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="e.g. CYBER20" 
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="bg-black/35 text-white text-xs border border-[#27272a] focus:border-[#06b6d4] rounded-xl px-4 py-3 flex-1 outline-none uppercase font-mono"
                  />
                  <button
                    type="submit"
                    className="bg-[#27272a] hover:bg-[#323236] border border-neutral-600 px-4 py-3 text-xs font-mono font-semibold uppercase text-white rounded-xl cursor-pointer"
                  >
                    Bind
                  </button>
                </form>
              )}
              <p className="text-[10px] text-neutral-500">
                Coupons can be located on the <span className="text-[#a855f7] hover:underline cursor-pointer">Offers & Deals Page</span>.
              </p>
            </div>

            {/* Calculations breakdown block */}
            <div className="p-6 bg-[#18181b] border border-[#27272a] rounded-2xl space-y-4 text-left shadow-lg">
              <h4 className="text-xs uppercase font-mono tracking-widest text-white border-b border-[#27272a] pb-3 font-bold">Pricing Telemetry Details</h4>
              
              <div className="space-y-2.5 text-xs">
                
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Subtotal calculation</span>
                  <span className="font-mono text-neutral-200">{formatPrice(subtotal)}</span>
                </div>

                {activeCoupon && (
                  <div className="flex justify-between items-center text-cyan-400">
                    <span>Rebate Reduction ({activeCoupon.percent}%)</span>
                    <span className="font-mono">-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Priority Transit Fees</span>
                  <span className="font-mono text-neutral-200">
                    {transitFee === 0 ? <span className="text-emerald-400 font-bold uppercase">FREE</span> : formatPrice(transitFee)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Estimated Sales Tax (8%)</span>
                  <span className="font-mono text-neutral-200">{formatPrice(estimatedTax)}</span>
                </div>

                <div className="border-t border-[#27272a] pt-3 flex justify-between items-center">
                  <span className="text-sm font-bold text-white uppercase tracking-wider">Grand Total</span>
                  <span className="font-mono text-lg font-black text-white">{formatPrice(finalTotal)}</span>
                </div>

              </div>

              {/* Free transit notification banner */}
              {subtotal < 150 && (
                <div className="p-2.5 bg-purple-500/10 border border-purple-500/30 rounded-xl text-center">
                  <p className="text-[9px] text-[#a855f7] font-semibold">
                    Add {formatPrice(150 - subtotal)} more for FREE Priority Shipping!
                  </p>
                </div>
              )}

              {/* Secure checkout redirect button */}
              <button
                onClick={() => onGoToCheckout(activeCoupon ? activeCoupon.percent : 0, activeCoupon ? activeCoupon.code : "")}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3.5 px-6 rounded-full font-bold shadow-lg shadow-purple-500/15 transition-all text-sm uppercase cursor-pointer"
                id="cart-checkout-trigger"
              >
                <Lock className="w-4 h-4 text-[#a855f7]" />
                <span>Begin Deployment</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
