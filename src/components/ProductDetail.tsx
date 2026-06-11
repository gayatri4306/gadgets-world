import React, { useState } from "react";
import { 
  ArrowLeft, 
  Heart, 
  Star, 
  ShoppingBag, 
  CheckCircle,
  Cpu, 
  ShieldCheck, 
  Truck,
  Plus,
  Minus,
  MessageSquare
} from "lucide-react";
import { Product, Review } from "../types";

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  relatedProducts: Product[];
  onSelectProduct: (product: Product) => void;
  showToast: (msg: string, type: "success" | "info" | "warn") => void;
}

export default function ProductDetail({
  product,
  onBack,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
  relatedProducts,
  onSelectProduct,
  showToast
}: ProductDetailProps) {
  // Image gallery select index
  const [activeImage, setActiveImage] = useState(product.image);
  // local order quantity count
  const [quantity, setQuantity] = useState(1);
  // detail tab: "desc" | "specs" | "reviews"
  const [currentTab, setCurrentTab] = useState<"desc" | "specs" | "reviews">("desc");

  // Review state variables
  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [activeReviews, setActiveReviews] = useState<Review[]>(product.reviews || []);

  // Sync state variables when product selection switches
  React.useEffect(() => {
    setActiveReviews(product.reviews || []);
    setActiveImage(product.image);
    setQuantity(1);
  }, [product]);

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) {
      showToast("Please provide your name and feedback testimony", "warn");
      return;
    }

    showToast("Publishing review telemetry report...", "info");

    fetch(`/api/products/${product.id}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        author: newReviewAuthor.trim(),
        rating: newReviewRating,
        comment: newReviewComment.trim()
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.product) {
        setActiveReviews(data.product.reviews || []);
        showToast("Thank you! Review published and synchronized successfully", "success");
        setNewReviewAuthor("");
        setNewReviewComment("");
        setNewReviewRating(5);
        if ((product as any).onRefreshCatalog) {
          (product as any).onRefreshCatalog();
        }
      } else {
        showToast(data.error || "Review submission failed", "warn");
      }
    })
    .catch(err => {
      console.error(err);
      // resilient offline fallback
      const review: Review = {
        id: "rev-" + Date.now(),
        author: newReviewAuthor.trim(),
        rating: newReviewRating,
        comment: newReviewComment.trim(),
        date: new Date().toISOString().split("T")[0],
      };
      setActiveReviews([review, ...activeReviews]);
      setNewReviewAuthor("");
      setNewReviewComment("");
      setNewReviewRating(5);
      showToast("Review submitted in offline storage mode!", "success");
    });
  };

  // Star breakdown summary calculations
  const totalRatingPoints = activeReviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = activeReviews.length > 0 
    ? (totalRatingPoints / activeReviews.length).toFixed(1) 
    : product.rating.toFixed(1);

  const starPercentages = [0, 0, 0, 0, 0]; // 1-star to 5-star
  activeReviews.forEach(r => {
    const starIdx = Math.min(Math.max(Math.floor(r.rating) - 1, 0), 4);
    starPercentages[starIdx]++;
  });

  const percentCount = (count: number) => {
    if (activeReviews.length === 0) return "0%";
    return `${Math.round((count / activeReviews.length) * 100)}%`;
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQty = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
    else showToast("Maximum warehouse stock reached", "warn");
  };

  const discountAmount = product.originalPrice - product.price;
  const savingPercent = Math.round((discountAmount / product.originalPrice) * 100);

  // Gallery array
  const gallery = [product.image, ...product.secondaryImages];

  return (
    <div className="py-6 bg-[#09090b] text-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumbs */}
        <button 
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-[#06b6d4] hover:text-[#06b6d4]/80 uppercase tracking-widest font-mono mb-8 group pl-1 focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Exit to Gear Catalog</span>
        </button>

        {/* Primary Spec Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          
          {/* Left panel components: Image galleries */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative bg-[#18181b] border border-[#27272a] rounded-2xl overflow-hidden p-2 flex items-center justify-center">
              <img 
                src={activeImage} 
                alt={product.name} 
                referrerPolicy="no-referrer"
                className="w-full h-auto max-h-[500px] object-cover rounded-xl transition duration-300"
              />
              {/* Image scanner glowing bar effect */}
              <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-500/5 to-transparent pointer-events-none" />
            </div>

            {/* Sub-images thumbnail grid */}
            {gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`relative aspect-square rounded-xl overflow-hidden border bg-[#18181b] p-1 transition-all focus:outline-none ${activeImage === img ? "border-[#06b6d4] scale-98" : "border-[#27272a] hover:border-neutral-500"}`}
                  >
                    <img src={img} alt="Thumbnail view" referrerPolicy="no-referrer" className="w-full h-full object-cover rounded-lg" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right panel components: Checkout telemetry, product details */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xs font-mono uppercase font-semibold text-[#06b6d4] tracking-wider">
                  {product.brand}
                </span>
                <span className="text-neutral-500">•</span>
                <span className="text-xs font-mono uppercase text-[#a855f7]">
                  {product.category}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight uppercase">
                {product.name}
              </h1>

              {/* Quick reviews banner overlay */}
              <div className="flex items-center space-x-3 mt-3">
                <div className="flex items-center space-x-1 text-amber-400">
                  <Star className="w-4.5 h-4.5 fill-amber-400" />
                  <span className="text-sm font-bold text-white font-mono">{averageRating}</span>
                </div>
                <span className="text-neutral-600">|</span>
                <span className="text-xs text-neutral-400 font-mono">
                  {activeReviews.length} custom testimonials
                </span>
                <span className="text-neutral-600">|</span>
                <span className={`text-xs font-semibold ${product.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock} units)` : "Out of stock"}
                </span>
              </div>
            </div>

            {/* Price components block */}
            <div className="p-4 rounded-2xl bg-[#18181b] border border-[#27272a]">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-mono font-black text-[#06b6d4]">${product.price}</span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-sm text-neutral-500 line-through">${product.originalPrice}</span>
                    <span className="text-xs bg-rose-500/10 text-[#f43f5e] border border-rose-500/30 px-2 py-0.5 rounded font-bold">
                      SAVE {savingPercent}%
                    </span>
                  </>
                )}
              </div>
              <p className="text-[10px] text-neutral-500 mt-1 uppercase font-mono tracking-wider">
                * VAT inclusive, secure transaction assurance applied.
              </p>
            </div>

            {/* Core description block */}
            <div>
              <p className="text-sm text-neutral-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity controls & Wishlist controls */}
            {product.stock > 0 && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-4">
                  <span className="text-xs uppercase font-semibold text-neutral-400 tracking-wider">Quantity:</span>
                  <div className="flex items-center border border-[#27272a] bg-[#18181b] rounded-xl overflow-hidden">
                    <button 
                      onClick={decreaseQty}
                      className="p-2.5 hover:bg-[#27272a] text-neutral-400 hover:text-white transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-5 py-1 text-sm font-bold font-mono text-white text-center min-w-[50px]">
                      {quantity}
                    </span>
                    <button 
                      onClick={increaseQty}
                      className="p-2.5 hover:bg-[#27272a] text-neutral-400 hover:text-white transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Primary CTA controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <button
                    onClick={() => onAddToCart(product, quantity)}
                    className="flex items-center justify-center space-x-2 bg-[#27272a] border border-neutral-600 hover:bg-[#323236] text-white py-3 px-6 rounded-full font-semibold transition shadow-md active:scale-98"
                  >
                    <ShoppingBag className="w-5 h-5 text-[#06b6d4]" />
                    <span>Deploy into Cart</span>
                  </button>

                  <button
                    onClick={() => onBuyNow(product, quantity)}
                    className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3 px-6 rounded-full font-bold transition shadow-lg shadow-purple-500/15 active:scale-98"
                  >
                    <span>Instant checkout</span>
                  </button>

                </div>
              </div>
            )}

            {/* Extra assurance metrics panel */}
            <div className="grid grid-cols-3 gap-2 py-4 border-y border-[#27272a]/70">
              <div className="flex flex-col items-center text-center p-2 rounded-xl bg-[#18181b]/30">
                <Truck className="w-4.5 h-4.5 text-[#06b6d4] mb-1" />
                <span className="text-[10px] text-white font-semibold">Priority Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center p-2 rounded-xl bg-[#18181b]/30">
                <ShieldCheck className="w-4.5 h-4.5 text-[#a855f7] mb-1" />
                <span className="text-[10px] text-white font-semibold">Guaranteed Quality</span>
              </div>
              <div className="flex flex-col items-center text-center p-2 rounded-xl bg-[#18181b]/30">
                <Heart 
                  onClick={() => onToggleWishlist(product.id)}
                  className={`w-4.5 h-4.5 text-[#f43f5e] cursor-pointer mb-1 ${isWishlisted ? "fill-[#f43f5e]" : ""}`}
                />
                <span className="text-[10px] text-white font-semibold">{isWishlisted ? "Wishlisted" : "Add wishlist"}</span>
              </div>
            </div>

          </div>

        </div>

        {/* Tab section: Descriptions vs Specs vs Reviews forms */}
        <div className="mt-16">
          <div className="flex border-b border-[#27272a]">
            {/* Tab 1: Description summary */}
            <button
              onClick={() => setCurrentTab("desc")}
              className={`pb-4 px-6 text-xs sm:text-sm font-bold tracking-widest font-mono uppercase transition-all relative outline-none focus:outline-none ${currentTab === "desc" ? "text-[#06b6d4]" : "text-neutral-500 hover:text-neutral-300"}`}
            >
              System Overview
              {currentTab === "desc" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#06b6d4]" />
              )}
            </button>

            {/* Tab 2: Technical Specifications details */}
            <button
              onClick={() => setCurrentTab("specs")}
              className={`pb-4 px-6 text-xs sm:text-sm font-bold tracking-widest font-mono uppercase transition-all relative outline-none focus:outline-none ${currentTab === "specs" ? "text-[#a855f7]" : "text-neutral-500 hover:text-neutral-300"}`}
            >
              Hardware Specifications
              {currentTab === "specs" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#a855f7]" />
              )}
            </button>

            {/* Tab 3: Ratings and Reviews testimony core logs */}
            <button
              onClick={() => setCurrentTab("reviews")}
              className={`pb-4 px-6 text-xs sm:text-sm font-bold tracking-widest font-mono uppercase transition-all relative outline-none focus:outline-none ${currentTab === "reviews" ? "text-white" : "text-neutral-500 hover:text-neutral-300"}`}
            >
              User Logs ({activeReviews.length})
              {currentTab === "reviews" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
              )}
            </button>
          </div>

          <div className="py-8">
            
            {/* System Overview Render block */}
            {currentTab === "desc" && (
              <div className="space-y-6 max-w-4xl text-left bg-[#18181b]/30 p-6 rounded-2xl border border-[#27272a]">
                <h3 className="font-display font-semibold text-lg text-white uppercase tracking-wider">Functional Design Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-neutral-400">
                  <p className="leading-relaxed">
                    Designed to withstand heavy daily use, each component conforms with strict industrial shielding codes. Our engineering focuses on heat dispersal, user ergonomic synergy, and zero latency interconnects. Fits perfectly into clean cyber setups and dark desktop workspaces.
                  </p>
                  <p className="leading-relaxed">
                    Purchase includes access to premium driver upgrades via the terminal, complete setup layout blueprints, local customer representation lines, and detailed step-by-step diagnostic workflows.
                  </p>
                </div>
              </div>
            )}

            {/* Technical Hardware Specs table representation */}
            {currentTab === "specs" && (
              <div className="max-w-3xl bg-[#18181b] border border-[#27272a] rounded-2xl overflow-hidden shadow-xl text-left">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#27272a]/40 border-b border-[#27272a] text-neutral-300 font-mono uppercase text-xs">
                      <th className="px-6 py-4 font-semibold">Parameter core</th>
                      <th className="px-6 py-4 font-semibold">Verified Specs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#27272a]/60">
                    {product.specifications.map((spec, i) => (
                      <tr key={i} className="hover:bg-neutral-800/20 transition-colors">
                        <td className="px-6 py-4 text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">{spec.label}</td>
                        <td className="px-6 py-4 text-white font-medium">{spec.value}</td>
                      </tr>
                    ))}
                    {/* fallback */}
                    {product.specifications.length === 0 && (
                      <tr>
                        <td colSpan={2} className="px-6 py-4 text-center text-neutral-500">No telemetry specs documented for accessory unit.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Reviews component stack */}
            {currentTab === "reviews" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                
                {/* Visual scorecard */}
                <div className="lg:col-span-4 space-y-6 text-left">
                  <div className="p-6 bg-[#18181b] border border-[#27272a] rounded-2xl text-center space-y-2">
                    <p className="text-sm font-mono uppercase text-neutral-400 tracking-widest">Global Score</p>
                    <p className="text-5xl font-mono font-black text-white">{averageRating}</p>
                    <div className="flex justify-center text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          className={`w-5 h-5 ${s <= parseFloat(averageRating) ? "fill-amber-400 text-amber-400" : "text-neutral-600"}`} 
                        />
                      ))}
                    </div>
                    <p className="text-xs text-neutral-500">Based on {activeReviews.length} authenticated buyers</p>
                  </div>

                  {/* Reviews bars */}
                  <div className="space-y-2 bg-[#18181b]/30 p-4 rounded-2xl border border-[#27272a]">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center space-x-3 text-xs text-neutral-400">
                        <span className="w-5 font-mono">{star}★</span>
                        <div className="flex-1 h-2 bg-[#27272a] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#06b6d4] to-indigo-500 rounded-full" 
                            style={{ width: percentCount(starPercentages[star - 1]) }}
                          />
                        </div>
                        <span className="w-10 text-right font-mono text-[10px]">{percentCount(starPercentages[star - 1])}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submittal and feedback lists panels */}
                <div className="lg:col-span-8 space-y-8 text-left">
                  
                  {/* Testimonial Writer form */}
                  <div className="bg-[#18181b] p-6 rounded-2xl border border-[#27272a] space-y-4">
                    <h4 className="font-display font-semibold text-white uppercase tracking-wider flex items-center space-x-2">
                      <MessageSquare className="w-5 h-5 text-[#06b6d4]" />
                      <span>Document Your Experience</span>
                    </h4>
                    
                    <form onSubmit={handleCreateReview} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5 font-semibold">User Identifier / Name</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Neo Carter"
                            value={newReviewAuthor}
                            onChange={(e) => setNewReviewAuthor(e.target.value)}
                            className="w-full bg-[#09090b] border border-[#27272a] focus:border-[#06b6d4] rounded-xl px-4 py-2.5 text-sm text-neutral-200"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5 font-semibold">Choose telemetry score</label>
                          <div className="flex items-center space-x-1.5 h-[42px]">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => setNewReviewRating(s)}
                                className="p-1 text-natural-400 hover:scale-110 active:scale-95 transition"
                              >
                                <Star className={`w-6 h-6 ${s <= newReviewRating ? "fill-amber-400 text-amber-400" : "text-neutral-600"}`} />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5 font-semibold">Full Testimonial comment</label>
                        <textarea 
                          rows={3}
                          placeholder="How does this gear look under different light? Discuss key latency or mechanical tactile feelings..."
                          value={newReviewComment}
                          onChange={(e) => setNewReviewComment(e.target.value)}
                          className="w-full bg-[#09090b] border border-[#27272a] focus:border-[#06b6d4] rounded-xl p-4 text-sm text-neutral-200 outline-none resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="bg-[#27272a] hover:bg-[#323236] border border-neutral-600 text-xs text-white font-mono uppercase tracking-widest px-6 py-3 rounded-full cursor-pointer"
                      >
                        Submit Telemetry Report
                      </button>
                    </form>
                  </div>

                  {/* List of client logs reviews */}
                  <div className="space-y-4">
                    <h4 className="text-xs uppercase font-mono tracking-widest text-[#06b6d4] border-b border-[#27272a] pb-2 font-bold">Registered Buyer Transmissions</h4>
                    {activeReviews.map((rev) => (
                      <div 
                        key={rev.id}
                        className="p-5 bg-[#18181b]/40 rounded-xl space-y-2.5 border border-[#27272a]/60 hover:border-[#27272a] transition duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-transparent flex items-center justify-center font-mono text-xs font-semibold uppercase text-white">
                              {rev.author.substring(0, 2)}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white leading-tight">{rev.author}</p>
                              <p className="text-[9px] font-mono text-neutral-500">{rev.date}</p>
                            </div>
                          </div>
                          
                          <div className="flex text-amber-400">
                            {[1, 2, 3, 4, 5].map((st) => (
                              <Star 
                                key={st} 
                                className={`w-3.5 h-3.5 ${st <= rev.rating ? "fill-amber-400 text-amber-400" : "text-neutral-700"}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-neutral-300 leading-relaxed font-sans">{rev.comment}</p>
                      </div>
                    ))}
                  </div>

                </div>

              </div>
            )}

          </div>
        </div>

        {/* RELATED GEAR SLIDES SECTION */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#27272a]">
            <h2 className="font-display font-black text-2xl text-white tracking-widest uppercase text-left mb-6">
              CYBER GEAR COMPATIBILITY <span className="text-[#06b6d4]">SUGGESTIONS</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => {
                const disc = rel.originalPrice > rel.price 
                  ? Math.round(((rel.originalPrice - rel.price) / rel.originalPrice) * 100) 
                  : 0;

                return (
                  <div 
                    key={rel.id}
                    onClick={() => { onSelectProduct(rel); setActiveImage(rel.image); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="p-4 bg-[#18181b] border border-[#27272a] hover:border-[#06b6d4]/50 rounded-2xl cursor-pointer transition flex flex-col justify-between hover:shadow-[#06b6d4]/5 shadow"
                  >
                    <div className="relative aspect-square rounded-xl bg-neutral-950 overflow-hidden mb-3">
                      <img src={rel.image} alt={rel.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      {disc > 0 && (
                        <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-rose-500 text-white text-[8px] font-bold tracking-widest rounded">
                          -{disc}%
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 text-left">
                      <p className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">{rel.brand}</p>
                      <h4 className="text-white font-semibold text-xs sm:text-sm truncate hover:text-[#06b6d4]">{rel.name}</h4>
                      <p className="text-xs font-mono font-bold text-[#06b6d4]">${rel.price}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
