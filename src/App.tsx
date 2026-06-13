import { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  User, 
  Menu, 
  X, 
  Sparkles, 
  Percent,
  ChevronRight,
  Filter,
  ArrowUpDown,
  Laptop,
  Cpu,
  Zap,
  Smartphone,
  Star,
  RefreshCw,
  Phone,
  Mail,
  ShieldCheck,
  Award
} from "lucide-react";

import { PageView, Product, CartItem, User as UserType, Order, formatPrice } from "./types";
import { PRODUCTS, CATEGORIES } from "./data";

// Import sub-components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Deals from "./components/Deals";
import AboutContact from "./components/AboutContact";
import AuthModal from "./components/AuthModal";
import Orders from "./components/Orders";
import AIAssistant from "./components/AIAssistant";

interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "warn";
}

export default function App() {
  // Navigation View State
  const [currentView, setView] = useState<PageView>("home");

  // Dynamic products state synced with active server state
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  
  // Selected detail product state
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);

  // Load products from server on mount
  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.products) {
          setProducts(data.products);
          const matched = data.products.find((p: any) => p.id === selectedProduct.id) || data.products[0];
          if (matched) {
            setSelectedProduct(matched);
          }
        }
      })
      .catch(err => console.error("Could not fetch remote products checklist, fallback set", err));
  }, []);

  // Sync refresh handle routine
  const refreshCatalog = () => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.products) {
          setProducts(data.products);
          if (selectedProduct) {
            const matched = data.products.find((p: any) => p.id === selectedProduct.id);
            if (matched) {
              setSelectedProduct(matched);
            }
          }
        }
      })
      .catch(err => console.error("Sync telemetry update failure:", err));
  };

  // Cart & Wishlist persistence with local storage keys
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("gworld_cart_v1");
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem("gworld_wishlist_v1");
    return saved ? JSON.parse(saved) : [];
  });

  // User Authentication State
  const [user, setUser] = useState<UserType>(() => {
    const saved = localStorage.getItem("gworld_user_v1");
    if (saved) return JSON.parse(saved);
    return {
      name: "",
      email: "",
      isLoggedIn: false,
      wishlist: [],
      orders: []
    };
  });

  // Auth modal overlay state
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Filter & Sorting criteria in Shop View
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(2500);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("popularity"); // "popularity" | "lowToHigh" | "highToLow" | "rating"
  
  // Checkout intermediary discount fields
  const [checkoutDiscount, setCheckoutDiscount] = useState<number>(0);
  const [checkoutCouponCode, setCheckoutCouponCode] = useState<string>("");

  // Custom Toast notification alerts state stack
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Local storage synchronization effects
  useEffect(() => {
    localStorage.setItem("gworld_cart_v1", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("gworld_wishlist_v1", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("gworld_user_v1", JSON.stringify(user));
  }, [user]);

  // Toast dispatch handler helper
  const showToast = (message: string, type: Toast["type"] = "success") => {
    const id = "toast-" + Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    if (product.stock === 0) {
      showToast("Selected gear is currently out of stock", "warn");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const nextQty = existing.quantity + quantity;
        if (nextQty > product.stock) {
          showToast(`Cannot exceed our total warehouse ceiling of ${product.stock} units`, "warn");
          return prev;
        }
        showToast(`Calculations updated! Total: ${nextQty}x ${product.name}`, "info");
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: nextQty } : item
        );
      }
      showToast(`Deployed ${quantity}x ${product.name} to checkout cart`, "success");
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateCartQty = (productId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    const matched = cart.find(i => i.product.id === productId);
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    if (matched) {
      showToast(`Detached ${matched.product.name} from shipping queue`, "info");
    }
  };

  // Wishlist operations
  const handleToggleWishlist = (productId: string) => {
    const matched = products.find(p => p.id === productId);
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast("Removed from curated watchlist", "info");
        return prev.filter((id) => id !== productId);
      } else {
        showToast(`Curated ${matched ? matched.name : "gear"} into curated watchlist`, "success");
        return [...prev, productId];
      }
    });

    // Sync state inside core profile if logged in
    if (user.isLoggedIn) {
      setUser(prev => ({
        ...prev,
        wishlist: prev.wishlist.includes(productId) 
          ? prev.wishlist.filter(id => id !== productId)
          : [...prev.wishlist, productId]
      }));
    }
  };

  // Buy Now pipeline action
  const handleBuyNow = (product: Product, quantity: number = 1) => {
    // Add to cart first
    const existing = cart.find(i => i.product.id === product.id);
    if (!existing) {
      setCart(prev => [...prev, { product, quantity }]);
    } else {
      setCart(prev => prev.map(i => i.product.id === product.id ? { ...i, quantity } : i));
    }
    
    // reset checkout intermediaries and route directly
    setCheckoutDiscount(0);
    setCheckoutCouponCode("");
    setView("checkout");
    showToast("Opening secure instant checkout panel", "info");
  };

  // User Authentications Success callback
  const handleAuthSuccess = (authenticatedUser: UserType) => {
    // Sync local storage carts and wishlists if profiles contain past parameters
    setUser(authenticatedUser);
    if (wishlist.length > 0) {
      setUser(prev => ({ ...prev, wishlist: [...new Set([...prev.wishlist, ...wishlist])] }));
    }
  };

  // Order Complete submittal handler
  const handleOrderComplete = (newOrder: Order) => {
    // Save to user history state
    setUser(prev => ({
      ...prev,
      orders: [newOrder, ...(prev.orders || [])]
    }));

    // Clear cart
    setCart([]);
    
    // Keep order view or checkout confirmation overlay active (order confirmed is inside checkout success modal, closing shifts view)
  };

  // Direct checkout route helper (Cart Page clicks begin deployment)
  const handleGoToCheckout = (appliedDiscountPercent: number, couponCode: string) => {
    setCheckoutDiscount(appliedDiscountPercent);
    setCheckoutCouponCode(couponCode);
    setView("checkout");
  };

  // Reset core shop search filters
  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchFilter("");
    setSelectedBrand("all");
    setMaxPrice(2500);
    setMinRating(0);
    setSortBy("popularity");
    showToast("Shop filters reset to catalog default", "info");
  };

  // Extract all unique brands dynamically for filters drop down catalog
  const allBrands = Array.from(new Set(products.map((p) => p.brand)));

  // Filter logic compilation
  const filteredProducts = products.filter((product) => {
    const matchCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchQuery = !searchFilter.trim() || 
      product.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchFilter.toLowerCase()) ||
      product.description.toLowerCase().includes(searchFilter.toLowerCase());
    const matchBrand = selectedBrand === "all" || product.brand === selectedBrand;
    const matchPrice = product.price <= maxPrice;
    const matchRating = product.rating >= minRating;

    return matchCategory && matchQuery && matchBrand && matchPrice && matchRating;
  });

  // Sort logic compilation
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "popularity") {
      return b.reviewsCount - a.reviewsCount; // popular is most reviews
    }
    if (sortBy === "lowToHigh") {
      return a.price - b.price;
    }
    if (sortBy === "highToLow") {
      return b.price - a.price;
    }
    if (sortBy === "rating") {
      return b.rating - a.rating;
    }
    return 0;
  });

  // Categories helper icons picker
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Smartphone": return <Smartphone className="w-5 h-5" />;
      case "Zap": return <Zap className="w-5 h-5" />;
      case "Laptop": return <Laptop className="w-5 h-5" />;
      case "Cpu":
      default: return <Cpu className="w-5 h-5" />;
    }
  };

  const currentCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-200 font-sans flex flex-col justify-between selection:bg-[#06b6d4]/40 selection:text-white">
      
      {/* Top Banner Ticker Alerts */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-cyan-950 text-white text-[11px] font-mono py-2 px-4 border-b border-white/5 flex justify-between items-center sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5 text-[#06b6d4] animate-pulse" />
          <span>CYBER ALLOWANCES SURGES: Lock in 20% flat warehouse rebates via code: <strong className="text-white bg-white/10 px-1 rounded">CYBER20</strong></span>
        </div>
        <div className="hidden md:flex items-center space-x-3 text-neutral-400">
          <span>Secure AES-256 Gateways</span>
          <span>•</span>
          <span className="text-[#a855f7]">Free Shipping over {formatPrice(150)}</span>
        </div>
      </div>

      {/* Main Header Navigator */}
      <Navbar
        currentView={currentView}
        setView={setView}
        cartCount={currentCartCount}
        wishlistCount={wishlist.length}
        user={user}
        setUser={setUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        setSelectedProduct={(p) => { setSelectedProduct(p); setView("detail"); }}
        showToast={showToast}
      />

      {/* Primary Application Pages Switch / Routers */}
      <main className="flex-1">

        {currentView === "home" && (
          <div className="space-y-4 animate-fade-in">
            {/* Landing promotions sliders */}
            <Hero 
              setView={setView} 
              setCategoryFilter={(cat) => { setSelectedCategory(cat); setView("shop"); }} 
            />

            {/* Quick Jumps - Categories sections */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
              <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#27272a]">
                <h2 className="font-display font-black text-2xl text-white tracking-widest uppercase">
                  CLASSIFIED GEAR <span className="text-[#06b6d4]">CATEGORIES</span>
                </h2>
                <span className="text-xs font-mono text-[#a855f7] uppercase tracking-wider">Deploy Selectors</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {CATEGORIES.map((cat) => (
                  <div 
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setView("shop"); }}
                    className="group bg-[#18181b] border border-[#27272a] hover:border-[#06b6d4]/55 rounded-2xl p-5 cursor-pointer transition flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-[#27272a] group-hover:bg-[#06b6d4]/10 rounded-xl text-neutral-400 group-hover:text-[#06b6d4] transition">
                        {getCategoryIcon(cat.icon)}
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500 uppercase">{cat.itemCount} items mapped</span>
                    </div>

                    <div className="mt-4 space-y-1">
                      <h3 className="font-bold text-white text-base group-hover:text-[#06b6d4] transition">{cat.name}</h3>
                      <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">{cat.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#27272a]/70 flex justify-between items-center text-xs font-semibold text-[#a855f7] inline-flex items-center space-x-1 hover:text-white transition">
                      <span>Initiate Feed</span>
                      <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Featured trending gear cards grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
              <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#27272a]">
                <h2 className="font-display font-black text-2xl text-white tracking-widest uppercase">
                  TRENDING DECOYS <span className="text-[#a855f7]">& FEATURED TELEMETRY</span>
                </h2>
                <button 
                  onClick={() => { setSelectedCategory("all"); setView("shop"); }}
                  className="flex items-center space-x-1.5 text-xs font-mono font-semibold text-[#06b6d4] hover:text-[#06b6d4]/80"
                >
                  <span>Access Complete Catalog</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.filter(p => p.isFeatured || p.isTrending).slice(0, 4).map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onSelect={(prod) => { setSelectedProduct(prod); setView("detail"); }}
                    onAddToCart={handleAddToCart}
                    isWishlisted={wishlist.includes(p.id)}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </div>
            </section>

            {/* Testimonial / Credential banner to drive sales */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
              <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                
                {/* Visual mesh */}
                <div className="absolute inset-0 bg-[#06b6d4]/2 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                <div className="space-y-2 max-w-xl relative z-10">
                  <div className="flex items-center space-x-2 text-xs font-mono text-[#a855f7] uppercase font-bold">
                    <Award className="w-4 h-4" />
                    <span>ENGINEER VERIFIED WARRANTY</span>
                  </div>
                  <h3 className="font-display font-black text-2xl uppercase tracking-wider text-white">
                    Need Custom Hardware Blueprints?
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                    Connect directly to support lines! Our design engineers custom map dual cooling options, coordinate delivery transits on bikes and cars, and resolve firmware configurations.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 shrink-0 relative z-10">
                  <button 
                    onClick={() => setView("about")}
                    className="px-5 py-3 bg-[#27272a] hover:bg-[#323236] border border-neutral-600 rounded-full text-xs font-mono font-bold tracking-wider text-white transition"
                  >
                    Open Support ticket
                  </button>
                  <button 
                    onClick={() => { setSelectedCategory("all"); setView("shop"); }}
                    className="px-5 py-3 bg-[#06b6d4] hover:bg-[#06b6d4]/80 text-black text-xs font-bold rounded-full transition shadow-md shadow-cyan-500/10"
                  >
                    Shop components
                  </button>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* Catalog List / Product Listing elements */}
        {currentView === "shop" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left animate-fade-in">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-3 border-b border-[#27272a] gap-4">
              <div>
                <h1 className="font-display font-black text-3xl text-white uppercase tracking-wider">
                  CYBER GEAR <span className="text-[#06b6d4] text-shadow-cyan">CATALOG</span>
                </h1>
                <p className="text-xs font-mono text-neutral-400 mt-1 uppercase">
                  {sortedProducts.length} items mapped to filters
                </p>
              </div>

              {/* Instant Search in Header */}
              <div className="relative max-w-xs w-full">
                <input 
                  type="text" 
                  placeholder="Filter name, brand, spec..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-[#18181b] text-neutral-200 border border-[#27272a] focus:border-[#06b6d4] rounded-full px-4 py-2.5 pl-10 text-xs outline-none"
                />
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                {searchFilter && (
                  <button onClick={() => setSearchFilter("")} className="absolute right-3.5 top-3 text-neutral-400">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Split layout: Left sidebar filter widgets vs Right products list */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left filter sidebars */}
              <aside className="lg:col-span-3 space-y-6">
                
                {/* Category Pickers */}
                <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 space-y-4">
                  <h4 className="text-xs uppercase font-mono tracking-widest text-white font-bold flex items-center justify-between">
                    <span>Category list</span>
                    <Filter className="w-3.5 h-3.5 text-neutral-500" />
                  </h4>
                  
                  <div className="space-y-1.5 text-xs text-neutral-400">
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className={`w-full text-left px-3 py-2 rounded-xl transition ${selectedCategory === "all" ? "bg-[#27272a] text-[#06b6d4] font-bold" : "hover:bg-neutral-800/40 hover:text-white"}`}
                    >
                      All hardware nodes
                    </button>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full text-left px-3 py-2 rounded-xl transition flex justify-between items-center ${selectedCategory === cat.id ? "bg-[#27272a] text-[#06b6d4] font-bold" : "hover:bg-neutral-800/40 hover:text-white"}`}
                      >
                        <span className="capitalize">{cat.id}</span>
                        <span className="text-[10px] font-mono text-neutral-500">{cat.itemCount}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Specs pricing & sliders */}
                <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 space-y-4 text-left">
                  <h4 className="text-xs uppercase font-mono tracking-widest text-[#06b6d4] font-bold">Max Price Ceiling</h4>
                  
                  <div className="space-y-2">
                    <input 
                      type="range" 
                      min={50}
                      max={2500}
                      step={50}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                      className="w-full h-1 bg-[#27272a] rounded-lg appearance-none cursor-pointer accent-[#06b6d4]"
                    />
                    <div className="flex justify-between items-center text-xs font-mono text-neutral-400">
                      <span>{formatPrice(50)}</span>
                      <span className="text-white font-bold">{formatPrice(maxPrice)} max limit</span>
                    </div>
                  </div>
                </div>

                {/* Brands picker */}
                <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 space-y-4">
                  <h4 className="text-xs uppercase font-mono tracking-widest text-white font-bold">Manufacturer Brands</h4>
                  
                  <div className="space-y-1.5 text-xs text-neutral-400">
                    <button
                      onClick={() => setSelectedBrand("all")}
                      className={`w-full text-left px-3 py-2 rounded-xl transition ${selectedBrand === "all" ? "bg-[#27272a] text-[#a855f7] font-bold" : "hover:bg-neutral-800/40 hover:text-white"}`}
                    >
                      All Manufacturers
                    </button>
                    {allBrands.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => setSelectedBrand(brand)}
                        className={`w-full text-left px-3 py-2 rounded-xl transition ${selectedBrand === brand ? "bg-[#27272a] text-[#a855f7] font-bold" : "hover:bg-neutral-800/40 hover:text-white"}`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ratings picker */}
                <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 space-y-4 text-left">
                  <h4 className="text-xs uppercase font-mono tracking-widest text-[#06b6d4] font-bold">Minimum Rating</h4>
                  <div className="flex justify-between">
                    {[0, 4, 4.5, 4.8].map((rt) => (
                      <button
                        key={rt}
                        onClick={() => setMinRating(rt)}
                        className={`px-2.5 py-1.5 text-[10px] font-mono border rounded-lg transition ${minRating === rt ? "border-[#06b6d4] bg-[#06b6d4]/5 text-white" : "border-[#27272a] text-neutral-400 hover:text-white"}`}
                      >
                        {rt === 0 ? "All" : `${rt}★+`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reset button action */}
                <button
                  onClick={handleResetFilters}
                  className="w-full py-3 bg-[#27272a] hover:bg-[#323236] text-neutral-300 hover:text-white rounded-xl text-xs font-mono font-bold uppercase transition"
                >
                  Clear catalog filters
                </button>

              </aside>

              {/* Right products grids */}
              <div className="lg:col-span-9 space-y-6">
                
                {/* Sorting choices header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#18181b] border border-[#27272a] rounded-2xl text-xs gap-3">
                  <div className="flex items-center space-x-2 text-neutral-400">
                    <ArrowUpDown className="w-4 h-4 text-[#a855f7]" />
                    <span>Catalog sorting constraints</span>
                  </div>
                  <div className="flex space-x-2 w-full sm:w-auto">
                    {[
                      { id: "popularity", name: "Popularity" },
                      { id: "lowToHigh", name: "Price: Low to High" },
                      { id: "highToLow", name: "Price: High to Low" },
                      { id: "rating", name: "Buyer Rating" }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSortBy(opt.id)}
                        className={`px-3 py-1.5 text-[10px] rounded-lg transition ${sortBy === opt.id ? "bg-white text-black font-bold" : "bg-[#27272a] text-neutral-400 hover:text-white"}`}
                      >
                        {opt.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Display grid */}
                {sortedProducts.length === 0 ? (
                  <div className="p-20 text-center bg-[#18181b] border border-[#27272a] rounded-2xl space-y-4">
                    <p className="text-sm font-semibold text-white">No products found</p>
                    <p className="text-xs text-neutral-400">No hardware nodes matched the specified criteria checklist. Reset filters to begin anew.</p>
                    <button onClick={handleResetFilters} className="bg-[#06b6d4] text-black text-xs font-mono font-bold px-4 py-2 rounded-xl">Reset catalog filters</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedProducts.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        onSelect={(prod) => { setSelectedProduct(prod); setView("detail"); }}
                        onAddToCart={handleAddToCart}
                        isWishlisted={wishlist.includes(p.id)}
                        onToggleWishlist={handleToggleWishlist}
                      />
                    ))}
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

        {/* Product details panel */}
        {currentView === "detail" && selectedProduct && (
          <ProductDetail
            product={{ ...selectedProduct, onRefreshCatalog: refreshCatalog } as any}
            onBack={() => setView("shop")}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            isWishlisted={wishlist.includes(selectedProduct.id)}
            onToggleWishlist={handleToggleWishlist}
            relatedProducts={products.filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id).slice(0, 4)}
            onSelectProduct={(p) => setSelectedProduct(p)}
            showToast={showToast}
          />
        )}

        {/* Cart Listing panel elements */}
        {currentView === "cart" && (
          <Cart
            cart={cart}
            onUpdateQty={handleUpdateCartQty}
            onRemoveItem={handleRemoveCartItem}
            onSelectProduct={(p) => { setSelectedProduct(p); setView("detail"); }}
            onGoToShop={() => setView("shop")}
            onGoToCheckout={handleGoToCheckout}
            showToast={showToast}
          />
        )}

        {/* Checkout panel elements */}
        {currentView === "checkout" && (
          <Checkout
            cart={cart}
            appliedDiscountPercent={checkoutDiscount}
            couponCode={checkoutCouponCode}
            onBack={() => setView("cart")}
            onOrderComplete={handleOrderComplete}
            showToast={showToast}
          />
        )}

        {/* Offers & Deals elements */}
        {currentView === "offers" && (
          <Deals 
            onGoToShop={() => setView("shop")} 
            showToast={showToast} 
          />
        )}

        {/* Support & Philosophy elements */}
        {currentView === "about" && (
          <AboutContact showToast={showToast} />
        )}

        {/* Orders Tracking history logs */}
        {currentView === "orders" && (
          <Orders 
            orders={user.orders || []} 
            onGoToShop={() => setView("shop")} 
            showToast={showToast} 
          />
        )}

      </main>

      {/* Corporate footer, secure credits, and compliance */}
      <footer className="bg-black text-[11px] text-neutral-500 border-t border-[#27272a] py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-neutral-800 rounded-lg text-white font-mono font-bold leading-none text-xs">GW</span>
              <span className="font-display font-bold text-white uppercase tracking-wider text-sm">GADGETS <span className="text-[#06b6d4]">World</span></span>
            </div>
            <p className="leading-relaxed">
              Curating high-specification military and industrial smart tech interfaces. Connecting engineers, designers, and high-frequency enthusiasts securely.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-white uppercase font-mono tracking-widest text-xs font-bold font-display">QUICK COMPONENT JUMPS</h4>
            <div className="flex flex-col space-y-2">
              <span onClick={() => { setSelectedCategory("electronics"); setView("shop"); }} className="hover:text-white cursor-pointer transition">Smart Electronics</span>
              <span onClick={() => { setSelectedCategory("vehicles"); setView("shop"); }} className="hover:text-white cursor-pointer transition">Electric Mobility</span>
              <span onClick={() => { setSelectedCategory("computers"); setView("shop"); }} className="hover:text-white cursor-pointer transition">Computers & Rigs</span>
              <span onClick={() => { setSelectedCategory("accessories"); setView("shop"); }} className="hover:text-white cursor-pointer transition">Cyber accessories</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-white uppercase font-mono tracking-widest text-xs font-bold font-display">SECURED BLUEPRINTS</h4>
            <div className="flex flex-col space-y-2">
              <span onClick={() => setView("offers")} className="hover:text-white cursor-pointer transition">Redemption allowances</span>
              <span onClick={() => setView("about")} className="hover:text-white cursor-pointer transition">Ticketing Support Desk</span>
              <span className="hover:text-white transition">Crypto-payment pathways</span>
              <span className="hover:text-white transition">Delivery Transit terms</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-white uppercase font-mono tracking-widest text-xs font-bold font-display flex items-center space-x-1">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
              <span>SECURITY CERTIFICATE</span>
            </h4>
            <p className="leading-relaxed">
              Licensed by <strong>Gadgets World Inc</strong>. Made for academic e-commerce placement presentation profiles. Fully responsive under standard viewport boundaries.
            </p>
            <p className="text-neutral-400 font-mono font-bold">
              Consignor: Gayatri Vurukuti
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#27272a]/45 mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between text-neutral-600">
          <p>© 2026 Gadgets World Tech. All specifications registered globally.</p>
          <p className="font-mono mt-2 sm:mt-0">SECURE SHELL PROTOCOLS ON SHIELD_ACTIVE</p>
        </div>
      </footer>

      {/* Global custom Toast Notification Alerts lists drawer inside page corners */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3.5 max-w-sm w-full font-sans">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={`p-4 rounded-2xl border text-xs leading-relaxed shadow-2xl flex items-center justify-between text-left transition duration-300 transform translate-y-0 scale-100 ${
              toast.type === "success" 
                ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-300"
                : toast.type === "warn"
                ? "bg-rose-950/90 border-rose-500/40 text-rose-300"
                : "bg-blue-950/90 border-blue-500/40 text-blue-300"
            }`}
          >
            <div className="flex-1 min-w-0 pr-3">
              <p className="font-semibold text-white uppercase font-mono tracking-wider text-[10px] mb-0.5">
                {toast.type === "success" 
                  ? "SYSTEM_OK" 
                  : toast.type === "warn" 
                  ? "SYSTEM_ALERT" 
                  : "SYSTEM_SIGNAL"}
              </p>
              <p className="text-neutral-200">{toast.message}</p>
            </div>
            
            <button 
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-neutral-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Smart Cyber AI Assistant Interactive Overlay */}
      <AIAssistant 
        products={products}
        onSelectProduct={(p) => { setSelectedProduct(p); setView("detail"); }}
        setView={setView}
        showToast={showToast}
      />

      {/* Global secure Client Authentication modalliers overlay dialogs */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleAuthSuccess}
        showToast={showToast}
      />

    </div>
  );
}
