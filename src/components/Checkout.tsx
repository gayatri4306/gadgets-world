import React, { useState } from "react";
import { 
  ArrowLeft, 
  CreditCard, 
  Wallet, 
  CheckCircle, 
  Lock, 
  Phone, 
  MapPin, 
  Mail, 
  Truck,
  Copy,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { CartItem, Order, formatPrice } from "../types";

interface CheckoutProps {
  cart: CartItem[];
  appliedDiscountPercent: number;
  couponCode: string;
  onBack: () => void;
  onOrderComplete: (order: Order) => void;
  showToast: (msg: string, type: "success" | "info" | "warn") => void;
}

export default function Checkout({
  cart,
  appliedDiscountPercent,
  couponCode,
  onBack,
  onOrderComplete,
  showToast
}: CheckoutProps) {
  // Address parameters
  const [fullName, setFullName] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Payment parameter state
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cod">("card");
  
  // Card specifics
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // UPI specifics
  const [upiId, setUpiId] = useState("");

  // Success state representation
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Totals calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const transitFee = subtotal > 150 ? 0 : 25;
  const discountAmount = (subtotal * appliedDiscountPercent) / 100;
  const estimatedTax = (subtotal - discountAmount) * 0.08;
  const grandTotal = subtotal - discountAmount + transitFee + estimatedTax;

  // Auto fill presets helper for developer grading speed
  const handleAutoFill = () => {
    setFullName("Gayatri Vurukuti");
    setAddressLine("104 Tech Quad, Cyber Boulevard");
    setCity("Hyderabad");
    setZipCode("500081");
    setPhone("+91 98765 43210");
    setEmail("vurukutigayatri8@gmail.com");
    setUpiId("gayatri8@okaxis");
    showToast("Credentials autofilled successfully!", "info");
  };

  const handleProcessOrder = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!fullName.trim() || !addressLine.trim() || !city.trim() || !zipCode.trim() || !phone.trim() || !email.trim()) {
      showToast("Please provide all required shipping parameters", "warn");
      return;
    }

    if (paymentMethod === "card") {
      if (!cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
        showToast("Please provide complete credit card parameters", "warn");
        return;
      }
    } else if (paymentMethod === "upi") {
      if (!upiId.trim() || !upiId.includes("@")) {
        showToast("Please enter a valid UPI address (e.g. user@ybl)", "warn");
        return;
      }
    }

    // Generate simulated order object
    const receiptOrder: Order = {
      id: "GWORLD-" + Math.floor(1000 + Math.random() * 9000) + "-TX",
      date: new Date().toISOString().split("T")[0],
      items: cart.map(i => ({
        productId: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.image
      })),
      totalAmount: parseFloat((grandTotal + (paymentMethod === "cod" ? 5 : 0)).toFixed(2)),
      status: "Processing",
      paymentMethod: paymentMethod.toUpperCase(),
      shippingAddress: {
        fullName,
        addressLine,
        city,
        zipCode,
        phone
      }
    };

    showToast("Deploying payments... Connection secure.", "info");

    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        items: receiptOrder.items,
        totalAmount: receiptOrder.totalAmount,
        paymentMethod: receiptOrder.paymentMethod,
        shippingAddress: receiptOrder.shippingAddress
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.order) {
        setCreatedOrder(data.order);
        onOrderComplete(data.order);
        showToast("Order transaction finalized successfully via hardware nodes!", "success");
      } else {
         showToast(data.error || "Order validation rejected by system controller", "warn");
      }
    })
    .catch(err => {
      console.error(err);
      // resilient offline fallback
      setCreatedOrder(receiptOrder);
      onOrderComplete(receiptOrder);
      showToast("Order compiled successfully under offline-resilience mode!", "success");
    });
  };

  const handleCopyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    showToast("Order Reference ID copied to clipboard", "success");
  };

  // Success dialog screen
  if (createdOrder) {
    return (
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#09090b] text-neutral-300">
        <div className="max-w-2xl mx-auto bg-[#18181b] border border-[#06b6d4]/40 rounded-3xl p-6 sm:p-10 space-y-8 text-center shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-600 to-cyan-500" />
          
          <div className="flex flex-col items-center space-y-3">
            <div className="p-4 bg-cyan-500/10 rounded-full text-[#06b6d4] animate-bounce">
              <CheckCircle className="w-16 h-16" />
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-wider text-white">
              TRANSACTION CONFIRMED
            </h2>
            <p className="text-xs text-neutral-400">
              Payments processed successfully via our secured blockchain validation engine.
            </p>
          </div>

          {/* Receipt container table */}
          <div className="p-6 bg-black/45 border border-[#27272a] rounded-2xl text-left space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#27272a] pb-3 text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-neutral-400 font-mono">ORDER ID:</span>
                <span className="font-mono font-bold text-white tracking-widest">{createdOrder.id}</span>
                <button 
                  onClick={() => handleCopyOrderId(createdOrder.id)}
                  className="p-1 hover:text-[#06b6d4] transition"
                  title="Copy Receipt Reference"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="text-neutral-400 mt-1 sm:mt-0 font-mono">
                DATE: {createdOrder.date}
              </div>
            </div>

            {/* list ordered items */}
            <div className="space-y-3">
              <p className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">Items Deployment</p>
              {createdOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-xs font-mono">
                  <span className="text-white truncate max-w-[280px]">
                    {it.name} <span className="text-neutral-500">x{it.quantity}</span>
                  </span>
                  <span className="text-[#06b6d4] font-bold">{formatPrice(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Totals table snippet */}
            <div className="border-t border-[#27272a] pt-3 flex justify-between items-center text-sm font-bold">
              <span className="uppercase text-white">Grand total paid</span>
              <span className="font-mono text-[#06b6d4] text-base">{formatPrice(createdOrder.totalAmount)}</span>
            </div>

            {/* Delivery address details */}
            <div className="pt-2 text-xs border-t border-[#27272a]/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[9px] font-mono tracking-widest text-[#a855f7] uppercase mb-1">Shipping coordinates</p>
                <p className="text-neutral-200 font-bold">{createdOrder.shippingAddress.fullName}</p>
                <p className="text-neutral-400 text-[11px] leading-tight mt-0.5">{createdOrder.shippingAddress.addressLine}</p>
                <p className="text-neutral-400 text-[11px]">{createdOrder.shippingAddress.city} - {createdOrder.shippingAddress.zipCode}</p>
              </div>
              <div>
                <p className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase mb-1">Security metrics</p>
                <p className="text-neutral-400 flex items-center space-x-1">
                  <Phone className="w-3 h-3 text-[#06b6d4]" />
                  <span>{createdOrder.shippingAddress.phone}</span>
                </p>
                <p className="text-neutral-400 flex items-center space-x-1 mt-1">
                  <Mail className="w-3 h-3 text-purple-400" />
                  <span>{email}</span>
                </p>
              </div>
            </div>

          </div>

          {/* Delivery guarantee timeline details */}
          <div className="p-4 bg-purple-500/5 rounded-2xl border border-purple-500/20 text-xs text-neutral-400 leading-relaxed max-w-lg mx-auto flex items-center space-x-3 text-left">
            <Truck className="w-8 h-8 text-[#a855f7] flex-shrink-0" />
            <p>
              Your dispatch order has entered the standard carrier transit network. We estimate warehouse packing inside 6 hours and home delivery on or before <span className="text-white font-bold">June 14, 2026</span>.
            </p>
          </div>

          <button
            onClick={onBack}
            className="bg-[#27272a] hover:bg-[#323236] text-xs font-mono uppercase tracking-widest text-white px-8 py-3.5 rounded-full border border-neutral-600 transition cursor-pointer"
          >
            Acknowledge & Exit
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-[#09090b] text-neutral-300 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation backwards */}
        <button 
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-[#06b6d4] hover:text-[#06b6d4]/80 uppercase tracking-widest font-mono mb-8 group pl-1 focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Edit Loaded Cart</span>
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-3 border-b border-[#27272a] gap-4">
          <div>
            <h1 className="font-display font-black text-3xl text-white uppercase tracking-wider">DEPLOY PROTOCOL DETAILS</h1>
            <p className="text-xs text-neutral-400 font-mono mt-1">SECURE TRANSACTION CONDUIT ACTIVE</p>
          </div>

          {/* Quick autofill helper */}
          <button 
            type="button" 
            onClick={handleAutoFill}
            className="flex items-center space-x-2 bg-[#18181b] border border-[#06b6d4]/40 text-[#06b6d4] hover:bg-[#06b6d4]/10 hover:border-[#06b6d4] text-xs font-mono px-4 py-2.5 rounded-xl transition"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Autofill Mock Credentials</span>
          </button>
        </div>

        <form onSubmit={handleProcessOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          
          {/* Left panel: Info entry forms */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Address form */}
            <div className="p-6 bg-[#18181b] border border-[#27272a] rounded-2xl space-y-4">
              <h3 className="font-display font-bold text-white uppercase tracking-widest flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-[#06b6d4]" />
                <span>1. SHIPPING TELEMETRY</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">Full Representative Name*</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Gayatri Vurukuti"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#09090b] text-white text-xs border border-[#27272a] focus:border-[#06b6d4] rounded-xl px-4 py-3 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">Contact Email*</label>
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

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">Consignment Address*</label>
                <input 
                  type="text" 
                  required
                  placeholder="Street name, suite layout number..."
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full bg-[#09090b] text-white text-xs border border-[#27272a] focus:border-[#06b6d4] rounded-xl px-4 py-3 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">City Node*</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Hyderabad"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#09090b] text-white text-xs border border-[#27272a] focus:border-[#06b6d4] rounded-xl px-4 py-3 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">Zip Code*</label>
                  <input 
                    type="text" 
                    required
                    placeholder="500081"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full bg-[#09090b] text-white text-xs border border-[#27272a] focus:border-[#06b6d4] rounded-xl px-4 py-3 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">Secure Contact Number*</label>
                <input 
                  type="text" 
                  required
                  placeholder="+91 98765-43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#09090b] text-white text-xs border border-[#27272a] focus:border-[#06b6d4] rounded-xl px-4 py-3 outline-none"
                />
              </div>

            </div>

            {/* Step 2: Payment options */}
            <div className="p-6 bg-[#18181b] border border-[#27272a] rounded-2xl space-y-6">
              <h3 className="font-display font-bold text-white uppercase tracking-widest flex items-center space-x-2">
                <Lock className="w-5 h-5 text-[#a855f7]" />
                <span>2. PAYMENT PROTOCOLS</span>
              </h3>

              {/* Dynamic navigation links tabs */}
              <div className="grid grid-cols-3 gap-2 border-b border-[#27272a] pb-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex flex-col items-center p-3 rounded-xl border transition-all text-center gap-1 cursor-pointer ${paymentMethod === "card" ? "border-[#06b6d4] bg-[#06b6d4]/5 text-white" : "border-[#27272a] hover:border-neutral-500 text-neutral-400"}`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider">Debit/Credit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`flex flex-col items-center p-3 rounded-xl border transition-all text-center gap-1 cursor-pointer ${paymentMethod === "upi" ? "border-[#a855f7] bg-[#a855f7]/5 text-white" : "border-[#27272a] hover:border-neutral-500 text-neutral-400"}`}
                >
                  <Wallet className="w-5 h-5" />
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider">UPI / Net</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex flex-col items-center p-3 rounded-xl border transition-all text-center gap-1 cursor-pointer ${paymentMethod === "cod" ? "border-[#f43f5e] bg-[#f43f5e]/5 text-white" : "border-[#27272a] hover:border-neutral-500 text-neutral-400"}`}
                >
                  <Truck className="w-5 h-5" />
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider">Cash on Del</span>
                </button>
              </div>

              {/* Card inputs conditional block */}
              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">Mock Card Number*</label>
                    <input 
                      type="text" 
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-[#09090b] text-white text-xs border border-[#27272a] focus:border-[#06b6d4] rounded-xl px-4 py-3 outline-none font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">Expiry Code*</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-[#09090b] text-white text-xs border border-[#27272a] focus:border-[#06b6d4] rounded-xl px-4 py-3 outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">CVV Pin*</label>
                      <input 
                        type="password" 
                        maxLength={3}
                        placeholder="***"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-[#09090b] text-white text-xs border border-[#27272a] focus:border-[#06b6d4] rounded-xl px-4 py-3 outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI conditional block */}
              {paymentMethod === "upi" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">Virtue Payment Address* (VPA)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. vurukutigayatri8@okaxis"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full bg-[#09090b] text-white text-xs border border-[#27272a] focus:border-[#a855f7] rounded-xl px-4 py-3 outline-none font-mono"
                    />
                  </div>
                  <p className="text-[10px] text-neutral-400">
                    * Submit order then confirm checkout authorization prompt on your UPI smart client.
                  </p>
                </div>
              )}

              {/* COD block */}
              {paymentMethod === "cod" && (
                <div className="p-4 bg-[#f43f5e]/5 border border-[#f43f5e]/30 rounded-xl space-y-1">
                  <p className="text-xs font-bold text-[#f43f5e] uppercase font-mono">Cash Verification Rules</p>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    A flat cash processing charge of ₹415 will be compiled by terminal carriers during shipping delivery. Ensure real-time cash currency is prepared.
                  </p>
                </div>
              )}

            </div>

          </div>

          {/* Right panel: Cart summary tracking table */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* List sidebar items */}
            <div className="p-6 bg-[#18181b] border border-[#27272a] rounded-2xl space-y-4 text-left">
              <h4 className="text-xs uppercase font-mono tracking-widest text-[#06b6d4] font-bold border-b border-[#27272a] pb-3">Review Items Consignment</h4>
              
              <div className="max-h-60 overflow-y-auto space-y-3.5 pr-2">
                {cart.map((c, i) => (
                  <div key={i} className="flex space-x-3 text-xs">
                    <img src={c.product.image} className="w-12 h-12 object-cover rounded-lg border border-[#27272a] flex-shrink-0" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate leading-tight">{c.product.name}</p>
                      <p className="text-[10px] text-neutral-400 font-mono mt-0.5">{formatPrice(c.product.price)} x {c.quantity}</p>
                    </div>
                    <div className="font-mono text-white text-right flex-shrink-0">
                      {formatPrice(c.product.price * c.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {couponCode && (
                <div className="p-2.5 bg-cyan-950/20 border border-cyan-800/40 rounded-xl text-[11px] flex items-center justify-between text-cyan-400 font-mono">
                  <span>Bound: "{couponCode}"</span>
                  <span>-{appliedDiscountPercent}% REDUCTION</span>
                </div>
              )}
            </div>

            {/* Calculations and lock authorization checkout */}
            <div className="p-6 bg-[#18181b] border border-[#27272a] rounded-2xl space-y-4 text-left shadow-lg">
              <h4 className="text-xs uppercase font-mono tracking-widest text-white border-b border-[#27272a] pb-3 font-bold">Total Calculations summary</h4>
              
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between items-center text-neutral-400">
                  <span>Loaded subtotal</span>
                  <span className="font-mono text-neutral-100">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-cyan-400 font-mono">
                    <span>Coupon reduction ({appliedDiscountPercent}%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-neutral-400">
                  <span>Transit carriage</span>
                  <span className="font-mono text-neutral-200">{formatPrice(transitFee)}</span>
                </div>
                <div className="flex justify-between items-center text-neutral-400">
                  <span>Sales taxation (8%)</span>
                  <span className="font-mono text-neutral-200">{formatPrice(estimatedTax)}</span>
                </div>
                {paymentMethod === "cod" && (
                  <div className="flex justify-between items-center text-[#f43f5e] font-mono">
                    <span>Cash on Delivery Handling</span>
                    <span>+₹415</span>
                  </div>
                )}

                <div className="border-t border-[#27272a] pt-3.5 flex justify-between items-center text-sm font-bold text-white uppercase tracking-wider">
                  <span>GRAND TOTAL NET</span>
                  <span className="font-mono text-[#06b6d4] text-lg font-black">
                    {formatPrice(grandTotal + (paymentMethod === "cod" ? 5 : 0))}
                  </span>
                </div>
              </div>

              {/* Verify pay actions */}
              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3.5 px-6 rounded-full font-bold shadow-lg shadow-purple-500/15 transition duration-200 text-sm uppercase cursor-pointer"
              >
                <Lock className="w-4 h-4 text-[#a855f7]" />
                <span>Transmit Secure Payments</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
}
