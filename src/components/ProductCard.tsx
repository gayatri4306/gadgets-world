import React from "react";
import { Star, Heart, ShoppingCart, Eye } from "lucide-react";
import { Product, formatPrice } from "../types";

interface ProductCardProps {
  key?: string;
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export default function ProductCard({
  product,
  onSelect,
  onAddToCart,
  isWishlisted,
  onToggleWishlist
}: ProductCardProps) {
  // calculate savings percentage
  const discountPercent = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-[#18181b] border border-[#27272a] rounded-2xl overflow-hidden hover:border-[#06b6d4]/50 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-[#06b6d4]/5">
      
      {/* Absolute top badge layers */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.badge && (
          <span className="px-2 py-1 bg-[#a855f7] text-white text-[9px] font-bold tracking-widest uppercase rounded">
            {product.badge}
          </span>
        )}
        {discountPercent > 0 && (
          <span className="px-2 py-1 bg-[#f43f5e] text-white text-[9px] font-bold tracking-widest uppercase rounded">
            -{discountPercent}% OFF
          </span>
        )}
      </div>

      <button 
        onClick={() => onToggleWishlist(product.id)}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 backdrop-blur-sm border border-neutral-700 hover:border-[#f43f5e] text-neutral-300 hover:text-[#f43f5e] transition-all"
        title="Add to Wishlist"
      >
        <Heart className={`w-4.5 h-4.5 ${isWishlisted ? "fill-[#f43f5e] text-[#f43f5e]" : ""}`} />
      </button>

      {/* Product Image Stage */}
      <div 
        onClick={() => onSelect(product)}
        className="relative pt-[100%] bg-neutral-900 cursor-pointer overflow-hidden group-hover:opacity-95"
      >
        <img 
          src={product.image} 
          alt={product.name} 
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Hover quick inspect sheet overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="flex items-center space-x-1.5 text-xs text-white bg-black/80 border border-neutral-700 px-4 py-2 rounded-full font-medium">
            <Eye className="w-4 h-4 text-[#06b6d4]" />
            <span>Telemetry view</span>
          </span>
        </div>
      </div>

      {/* Card Info stack */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono tracking-wider uppercase text-neutral-400">
            <span>{product.brand}</span>
            <div className="flex items-center space-x-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{product.rating}</span>
            </div>
          </div>

          <h3 
            onClick={() => onSelect(product)}
            className="text-white font-semibold text-sm sm:text-base hover:text-[#06b6d4] transition-colors cursor-pointer truncate"
          >
            {product.name}
          </h3>

          <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing / CTA row */}
        <div className="mt-4 pt-3 border-t border-[#27272a]/80 flex items-center justify-between">
          <div className="text-left">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg font-mono font-bold text-white">{formatPrice(product.price)}</span>
              {discountPercent > 0 && (
                <span className="text-xs text-neutral-500 line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
            {/* Stock indicator */}
            <p className="text-[9px] mt-0.5">
              {product.stock <= 5 ? (
                <span className="text-[#f43f5e] font-mono font-bold uppercase animate-pulse">Only {product.stock} units left</span>
              ) : (
                <span className="text-emerald-400 font-mono">In Stock ({product.stock})</span>
              )}
            </p>
          </div>

          {/* Quick Add To Cart */}
          <button 
            disabled={product.stock === 0}
            onClick={() => onAddToCart(product)}
            className="p-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Instant Add to Cart"
          >
            <ShoppingCart className="w-4.5 h-4.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
