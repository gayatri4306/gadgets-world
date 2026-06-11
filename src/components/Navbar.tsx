import React, { useState, useRef, useEffect } from "react";
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  User, 
  Menu, 
  X, 
  Sparkles, 
  Percent, 
  Smartphone, 
  Zap, 
  Laptop, 
  Cpu,
  LogOut,
  ChevronRight
} from "lucide-react";
import { PageView, Product, User as UserType } from "../types";
import { PRODUCTS } from "../data";

interface NavbarProps {
  currentView: PageView;
  setView: (view: PageView) => void;
  cartCount: number;
  wishlistCount: number;
  user: UserType;
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
  onOpenAuth: () => void;
  setSelectedProduct: (product: Product) => void;
  showToast: (msg: string, type: "success" | "info" | "warn") => void;
}

export default function Navbar({
  currentView,
  setView,
  cartCount,
  wishlistCount,
  user,
  setUser,
  onOpenAuth,
  setSelectedProduct,
  showToast
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Filter products for dropdown suggestion
  const suggestions = searchQuery.trim()
    ? PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      setView("shop");
    }
  };

  const handleSuggestionClick = (product: Product) => {
    setSelectedProduct(product);
    setView("detail");
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const handleLogout = () => {
    setUser({
      name: "",
      email: "",
      isLoggedIn: false,
      wishlist: [],
      orders: []
    });
    showToast("Signed out successfully", "info");
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#09090b]/95 backdrop-blur-md border-b border-[#27272a] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => { setView("home"); setMobileMenuOpen(false); }}
            className="flex items-center space-x-2 cursor-pointer group"
            id="nav-logo"
          >
            <div className="relative p-2 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-xl overflow-hidden shadow-md shadow-cyan-500/20">
              <Sparkles className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl md:text-2xl tracking-wider text-white flex items-center">
                GADGETS <span className="text-[#06b6d4] ml-1 text-shadow-cyan">WORLD</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#a855f7] uppercase leading-none">
                FUTURE RETAIL
              </span>
            </div>
          </div>

          {/* Desktop Search Engine */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative" ref={suggestionRef}>
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                placeholder="Search high-tech gears..."
                value={searchQuery}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                className="w-full bg-[#18181b] text-neutral-200 border border-[#27272a] focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d4] rounded-full px-5 py-2 pl-11 text-sm outline-none transition-all duration-200 placeholder-neutral-500"
              />
              <Search className="absolute left-4 top-2.5 w-4.5 h-4.5 text-neutral-400" />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={() => setSearchQuery("")} 
                  className="absolute right-4 top-2.5 text-neutral-400 hover:text-[#f43f5e]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Smart Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-12 left-0 right-0 bg-[#18181b] border border-[#27272a] rounded-2xl shadow-2xl p-2 z-50 max-h-80 overflow-y-auto">
                <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 px-3 py-1 border-b border-[#27272a] mb-2 flex items-center justify-between">
                  <span>Matches Found</span>
                  <span className="text-[#06b6d4]">Press Enter to view all</span>
                </div>
                {suggestions.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSuggestionClick(p)}
                    className="flex items-center space-x-3 p-2 hover:bg-[#27272a] rounded-xl cursor-pointer transition-all duration-150"
                  >
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 object-cover rounded-lg border border-[#27272a]" 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                      <p className="text-[10px] text-neutral-400 capitalize">{p.brand} • {p.category}</p>
                    </div>
                    <div className="text-xs font-mono font-bold text-[#06b6d4]">
                      ${p.price}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Core Desktop Navigation options */}
          <div className="hidden lg:flex items-center space-x-6">
            <button 
              onClick={() => setView("shop")}
              className={`text-sm font-medium transition-colors hover:text-[#06b6d4] ${currentView === "shop" ? "text-[#06b6d4]" : "text-neutral-300"}`}
            >
              Shop Catalog
            </button>
            <button 
              onClick={() => setView("offers")}
              className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-[#a855f7] ${currentView === "offers" ? "text-[#a855f7]" : "text-neutral-300"}`}
            >
              <Percent className="w-4 h-4 text-[#a855f7]" />
              <span>Hot Deals</span>
            </button>
            <button 
              onClick={() => setView("about")}
              className={`text-sm font-medium transition-colors hover:text-white ${currentView === "about" ? "text-white" : "text-neutral-400"}`}
            >
              About & Support
            </button>
          </div>

          {/* Action icons / State hubs */}
          <div className="hidden md:flex items-center space-x-4 ml-4">
            
            {/* Wishlist */}
            <button 
              onClick={() => setView("shop")} // Wishlist triggers shop filters or quick list
              className="relative p-2 text-neutral-300 hover:text-[#f43f5e] transition-colors focus:outline-none"
              title="View Wishlist"
            >
              <Heart className="w-6 h-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#f43f5e] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#09090b]">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart */}
            <button 
              onClick={() => setView("cart")}
              className="relative p-2 text-neutral-300 hover:text-[#06b6d4] transition-colors focus:outline-none"
              title="Shopping Cart"
              id="navbar-cart-trigger"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#06b6d4] text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#09090b]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile Menu */}
            {user.isLoggedIn ? (
              <div className="flex items-center space-x-3 pl-2 border-l border-[#27272a]">
                <div 
                  onClick={() => setView("orders")}
                  className="cursor-pointer group flex items-center space-x-2"
                  title="View Orders"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#a855f7] to-[#06b6d4] flex items-center justify-center text-white text-xs font-bold font-mono">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden xl:block">
                    <p className="text-xs text-white max-w-[80px] truncate leading-tight font-medium">{user.name}</p>
                    <p className="text-[9px] text-[#06b6d4] uppercase font-mono tracking-wider leading-none">Buyer Status</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-neutral-400 hover:text-white transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-lg transition-all duration-200"
              >
                <User className="w-4 h-4" />
                <span>Access Terminal</span>
              </button>
            )}

          </div>

          {/* Mobile responsive toggle */}
          <div className="flex items-center md:hidden space-x-2">
            <button 
              onClick={() => setView("cart")}
              className="relative p-2 text-neutral-300 hover:text-[#06b6d4]"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#06b6d4] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-300 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#09090b] border-t border-[#27272a] px-4 pt-3 pb-6 space-y-4">
          
          {/* Mobile search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search gadgets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#18181b] text-neutral-200 border border-[#27272a] focus:border-[#06b6d4] rounded-full px-4 py-2 pl-10 text-sm outline-none"
            />
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-neutral-400" />
          </form>

          {/* Quick recommendations */}
          {searchQuery.trim().length > 0 && (
            <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-2 max-h-40 overflow-y-auto">
              {suggestions.map((p) => (
                <div 
                  key={p.id}
                  onClick={() => { handleSuggestionClick(p); setMobileMenuOpen(false); }}
                  className="flex items-center space-x-2 p-2 hover:bg-[#27272a] rounded cursor-pointer"
                >
                  <img src={p.image} className="w-8 h-8 object-cover rounded" referrerPolicy="no-referrer" />
                  <span className="text-xs text-white truncate flex-1">{p.name}</span>
                  <span className="text-xs text-[#06b6d4] font-mono">${p.price}</span>
                </div>
              ))}
            </div>
          )}

          {/* Navigation link stacks */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button 
              onClick={() => { setView("shop"); setMobileMenuOpen(false); }}
              className="flex items-center justify-between p-3 bg-[#18181b] hover:bg-[#27272a] text-neutral-300 rounded-xl text-xs font-semibold"
            >
              <span>Catalog Shop</span>
              <ChevronRight className="w-4 h-4 text-[#06b6d4]" />
            </button>
            <button 
              onClick={() => { setView("offers"); setMobileMenuOpen(false); }}
              className="flex items-center justify-between p-3 bg-[#18181b] hover:bg-[#27272a] text-neutral-300 rounded-xl text-xs font-semibold"
            >
              <span className="text-[#a855f7]">Special Offers</span>
              <ChevronRight className="w-4 h-4 text-[#a855f7]" />
            </button>
            <button 
              onClick={() => { setView("about"); setMobileMenuOpen(false); }}
              className="flex items-center justify-between p-3 bg-[#18181b] hover:bg-[#27272a] text-neutral-300 rounded-xl text-xs font-semibold"
            >
              <span>Support & Map</span>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </button>
            {user.isLoggedIn && (
              <button 
                onClick={() => { setView("orders"); setMobileMenuOpen(false); }}
                className="flex items-center justify-between p-3 bg-[#18181b] hover:bg-[#27272a] text-neutral-300 rounded-xl text-xs font-semibold"
              >
                <span>My Orders</span>
                <ChevronRight className="w-4 h-4 text-[#06b6d4]" />
              </button>
            )}
          </div>

          {/* User state in Mobile */}
          <div className="border-t border-[#27272a] pt-4 flex items-center justify-between">
            {user.isLoggedIn ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#a855f7] to-[#06b6d4] flex items-center justify-center text-white text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{user.name}</p>
                    <p className="text-xs text-neutral-400">{user.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="p-2 bg-[#18181b] hover:bg-[#27272a] rounded-lg text-[#f43f5e] cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-medium py-3 rounded-xl shadow-lg"
              >
                <User className="w-4 h-4" />
                <span>Customer Login</span>
              </button>
            )}
          </div>

        </div>
      )}
    </nav>
  );
}
