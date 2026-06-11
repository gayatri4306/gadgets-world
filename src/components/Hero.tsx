import { useState, useEffect } from "react";
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Zap,
  Tag,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { PageView } from "../types";

interface HeroProps {
  setView: (view: PageView) => void;
  setCategoryFilter: (category: string) => void;
}

interface Slide {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  desc: string;
  highlight: string;
  color: string; // "cyan" | "purple" | "blue" | "pink"
  image: string;
  ctaText: string;
}

const HERO_SLIDES: Slide[] = [
  {
    id: 1,
    badge: "NEW COHORT RELEASE",
    title: "TitanX Foldable",
    subtitle: "Quantum Series",
    desc: "Titanium casing, flexible high-frequency AMOLED internal display, and liquid vapor core integration.",
    highlight: "Double trade-in points active.",
    color: "cyan",
    image: "https://files.catbox.moe/elntwz.png",
    ctaText: "Examine Specs",
  },
  {
    id: 2,
    badge: "ECO-EV COMMUTE",
    title: "Carbon Glide X1",
    subtitle: "Aerodynamics Scooter",
    desc: "Aerospace double-carbon weave, high-intensity hub motor, and fully addressable smart neon bottom running LEDs.",
    highlight: "Free secure helmet included.",
    color: "purple",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=700",
    ctaText: "Pre-order Now",
  },
  {
    id: 3,
    badge: "WORKSTATION MONSTER",
    title: "Aether-15 Laptop",
    subtitle: "Liquid-Cooled Powerhouses",
    desc: "RTX 5080 workstation architecture, Mini-LED HDR1000 screen display, and mechanical transparent keys layout.",
    highlight: "Save up to $300 on custom setups.",
    color: "blue",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=700",
    ctaText: "Build Your Setup",
  }
];

export default function Hero({ setView, setCategoryFilter }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  // Map slide colors to classes
  const getBannerColorClasses = (color: string) => {
    switch(color) {
      case "cyan": return {
        text: "text-[#06b6d4]",
        border: "border-[#06b6d4]/50",
        glow: "shadow-cyan-500/20",
        badgeBg: "bg-cyan-500/10 text-[#06b6d4] border-cyan-500/30",
        btnBg: "bg-[#06b6d4] text-black hover:bg-[#06b6d4]/80",
        dotBg: "bg-[#06b6d4]"
      };
      case "purple": return {
        text: "text-[#a855f7]",
        border: "border-[#a855f7]/50",
        glow: "shadow-purple-500/20",
        badgeBg: "bg-purple-500/10 text-[#a855f7] border-purple-500/30",
        btnBg: "bg-[#a855f7] text-white hover:bg-[#a855f7]/80",
        dotBg: "bg-[#a855f7]"
      };
      case "blue": 
      default: return {
        text: "text-[#3b82f6]",
        border: "border-[#3b82f6]/50",
        glow: "shadow-blue-500/20",
        badgeBg: "bg-blue-500/10 text-[#3b82f6] border-blue-500/30",
        btnBg: "bg-[#3b82f6] text-white hover:bg-[#3b82f6]/80",
        dotBg: "bg-[#3b82f6]"
      };
    }
  };

  const classes = getBannerColorClasses(slide.color);

  return (
    <div className="relative py-8 md:py-12 overflow-hidden bg-[#09090b]">
      
      {/* Background Neon Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Promo Carousel Block */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-[#18181b] to-[#09090b] border border-[#27272a] rounded-3xl p-6 sm:p-10 md:p-16 overflow-hidden shadow-2xl">
          
          {/* Cyber grid overlays */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Stacks */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <div className="inline-flex items-center space-x-2 bg-[#27272a]/50 px-3 py-1.5 rounded-full border border-white/5">
                <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-mono font-bold tracking-widest border ${classes.badgeBg}`}>
                  {slide.badge}
                </span>
                <span className="text-[10px] text-neutral-400 font-mono flex items-center gap-1">
                  <Tag className="w-3 h-3 text-[#06b6d4]" />
                  Seasonal Offers active
                </span>
              </div>

              <div className="space-y-2">
                <h1 className="font-display font-black text-4xl sm:text-5xl xl:text-6xl text-white tracking-tight leading-none uppercase">
                  {slide.title} <br />
                  <span className={`${classes.text} neon-text-glow font-extrabold`}>{slide.subtitle}</span>
                </h1>
                <p className="text-neutral-300 text-sm sm:text-base max-w-lg leading-relaxed font-sans">
                  {slide.desc}
                </p>
              </div>

              <div className="p-3 bg-[#27272a]/20 border-l-2 border-[#06b6d4] rounded-r-xl max-w-md">
                <p className="text-xs text-neutral-400 font-mono italic">
                  * Limited Time Reward: {slide.highlight}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button 
                  onClick={() => { setView("shop"); }}
                  className={`flex items-center space-x-2 text-sm font-semibold px-6 py-3.5 rounded-full shadow-lg ${classes.btnBg} transition-all duration-300 transform hover:-translate-y-0.5`}
                  id="hero-primary-cta"
                >
                  <span>{slide.ctaText}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button 
                  onClick={() => setView("offers")}
                  className="flex items-center space-x-2 text-sm text-neutral-300 font-medium px-6 py-3.5 rounded-full border border-[#27272a] hover:border-neutral-500 hover:text-white transition-all bg-black/40"
                >
                  <Tag className="w-4 h-4 text-[#a855f7]" />
                  <span>View All Promos</span>
                </button>
              </div>

            </div>

            {/* Right Graphics Panel */}
            <div className="lg:col-span-5 flex justify-center relative">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 xl:w-96 xl:h-96 rounded-2xl overflow-hidden border border-[#27272a]/80 shadow-2xl p-2 bg-[#27272a]/10 backdrop-blur-sm">
                
                {/* Tech scanline animations */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#06b6d4] to-transparent opacity-60 animate-[bounce_5s_infinite]" />
                
                <img 
                  src={slide.image} 
                  alt={slide.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-xl grayscale-20 hover:grayscale-0 transition-all duration-500 hover:scale-105"
                />
                
                {/* Visual Glow Layer */}
                <div className={`absolute inset-0 rounded-2xl pointer-events-none border border-transparent transition-all duration-300 ${classes.border} group-hover:block`} />
              </div>
            </div>

          </div>

          {/* Carousel Sliders Navigation toggling elements */}
          <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 flex items-center space-x-2 z-20">
            <button 
              onClick={prevSlide}
              className="p-2 rounded-full border border-[#27272a] hover:border-neutral-500 text-neutral-400 hover:text-white bg-black/40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex space-x-1.5 px-2">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentSlide ? `w-6 ${classes.dotBg}` : 'bg-neutral-600'}`}
                />
              ))}
            </div>
            <button 
              onClick={nextSlide}
              className="p-2 rounded-full border border-[#27272a] hover:border-neutral-500 text-neutral-400 hover:text-white bg-black/40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Trust & Guarantee Panel details (Horizontal band) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3 p-4 rounded-2xl bg-[#18181b] border border-[#27272a] text-left">
            <div className="p-2.5 bg-cyan-500/10 rounded-xl">
              <Truck className="w-5 h-5 text-[#06b6d4]" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider font-display">Expedited Transit</p>
              <p className="text-[10px] text-neutral-400">Dispatch in under 24 hours</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 rounded-2xl bg-[#18181b] border border-[#27272a] text-left">
            <div className="p-2.5 bg-purple-500/10 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-[#a855f7]" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider font-display">Secure Shielding</p>
              <p className="text-[10px] text-neutral-400">Guaranteed buyer warranties</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 rounded-2xl bg-[#18181b] border border-[#27272a] text-left">
            <div className="p-2.5 bg-[#3b82f6]/10 rounded-xl">
              <RotateCcw className="w-5 h-5 text-[#3b82f6]" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider font-display">Simple Exchanges</p>
              <p className="text-[10px] text-neutral-400">No hassle 30-day refunds</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 rounded-2xl bg-[#18181b] border border-[#27272a] text-left">
            <div className="p-2.5 bg-[#f43f5e]/10 rounded-xl">
              <Zap className="w-5 h-5 text-[#f43f5e]" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider font-display">Instant tech support</p>
              <p className="text-[10px] text-neutral-400">Dedicated engineer responses</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
