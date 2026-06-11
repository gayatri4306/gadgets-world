import { Product, Category, Offer, Review } from "./types";

// Helper reviews generator
const MOCK_REVIEWS: Review[] = [
  {
    id: "r1",
    author: "Alex Mercer",
    rating: 5,
    comment: "This is easily the best tech purchase I've made this year. High performance, beautifully designed, and the neon accents look amazing on my desk!",
    date: "2026-05-18",
  },
  {
    id: "r2",
    author: "Elena Rostov",
    rating: 4.8,
    comment: "Extremely fast shipping. The specs are perfectly accurate, and battery life is actually better than advertised. 10/10 would buy again.",
    date: "2026-06-01",
  },
  {
    id: "r3",
    author: "Marcus Vane",
    rating: 4.2,
    comment: "Very solid build quality. Integrates seamlessly into my high-tech home ecosystem. The companion mobile app was also very easy to pair.",
    date: "2026-06-05",
  },
];

export const CATEGORIES: Category[] = [
  {
    id: "electronics",
    name: "Smart Electronics",
    icon: "Smartphone",
    description: "Futuristic smartphones, flagship visual tablets, and premium noise-cancelling audiophile items.",
    itemCount: 8,
    color: "cyan",
  },
  {
    id: "vehicles",
    name: "Electric Mobility",
    icon: "Zap",
    description: "Next-gen carbon fiber electric scooters, magnetic hub-motor bikes, and high-performance smart e-vehicles.",
    itemCount: 6,
    color: "purple",
  },
  {
    id: "computers",
    name: "Computers & Rigs",
    icon: "Laptop",
    description: "Liquid-cooled workstation laptops, high-performance graphic hubs, and high-DPI pro setups.",
    itemCount: 8,
    color: "blue",
  },
  {
    id: "accessories",
    name: "Cyber Accessories",
    icon: "Cpu",
    description: "Transparent casing mechanical keyboards, power banks with OLED displays, and smart VR wearable interfaces.",
    itemCount: 10,
    color: "pink",
  },
];

export const PRODUCTS: Product[] = [
  // Category: Electronics
  {
    id: "elec-1",
    name: "TitanX Quantum Fold",
    category: "electronics",
    brand: "TitanX",
    price: 1399,
    originalPrice: 1599,
    rating: 4.9,
    reviewsCount: 142,
    reviews: [
      ...MOCK_REVIEWS,
      {
        id: "r-elec-1",
        author: "Sarah Jenkins",
        rating: 5,
        comment: "The crease is virtually invisible. The internal cooling works perfectly under extreme gaming sessions. Truly next-gen mobile computing.",
        date: "2026-06-08"
      }
    ],
    image: "https://files.catbox.moe/4niu2j.avif", // Phone on custom workspace
    secondaryImages: [
      "https://files.catbox.moe/xqq4it.jpg",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800"
    ],
    description: "The TitanX Quantum Fold represents a paradigm shift in cellular technology. Featuring a state-of-the-art flexible nano-OLED display, dual-chamber vapor cooling, and an integrated neural processing unit, it delivers desk-class performance directly in your pocket. Built with an aerospace-grade titanium chassis, it resists impacts while matching perfectly with a cyberpunk neon aesthetic.",
    specifications: [
      { label: "Internal Display", value: "7.9-inch Foldable Dynamic AMOLED 2X, 144Hz" },
      { label: "Processor", value: "Snapdragon Alpha Elite Quantum 4nm" },
      { label: "Memory & Storage", value: "18GB LPDDR5X / 1TB UFS 4.1" },
      { label: "Battery & charging", value: "5400mAh / 120W Super-Flash Charging" },
      { label: "Camera Specs", value: "200MP Main OIS + 50MP Periscope 10x Optical Zoom" }
    ],
    isFeatured: true,
    isTrending: true,
    stock: 12,
    badge: "FLAGSHIP",
  },
  {
    id: "elec-2",
    name: "SonicWave Eclipse ANC",
    category: "electronics",
    brand: "SonicWave",
    price: 299,
    originalPrice: 349,
    rating: 4.7,
    reviewsCount: 88,
    reviews: MOCK_REVIEWS,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800", // Premium headphones
    secondaryImages: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=800"
    ],
    description: "Shut out the world with active sound barrier technology. The SonicWave Eclipse matches a sleek matte-black polymer shell with electric blue sound guide rings. Customized 45mm beryllium drivers deliver deep sub-bass frequencies and crystallin highs. Perfect for professional audio designers, long-haul travelers, and immersive gamers.",
    specifications: [
      { label: "Acoustic Driver", value: "45mm Custom Beryllium Dome" },
      { label: "ANC depth", value: "-48dB Active Hybrid Shielding" },
      { label: "Connectivity", value: "Bluetooth 5.4 LE / Ultra-low Latency Mode" },
      { label: "Battery life", value: "65 Hours (ANC off) / 45 Hours (ANC active)" },
      { label: "Codec Support", value: "LDAC, aptX Adaptive, AAC, SBC" }
    ],
    isTrending: true,
    stock: 25,
    badge: "POPULAR",
  },
  {
    id: "elec-3",
    name: "Apex Tablet Pro 12X",
    category: "electronics",
    brand: "AeroTech",
    price: 849,
    originalPrice: 899,
    rating: 4.6,
    reviewsCount: 52,
    reviews: MOCK_REVIEWS,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800", // smart tablet
    secondaryImages: [
      "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?q=80&w=800"
    ],
    description: "Combining raw computing muscles with fluid screen graphics, the 12X is an illustrator's ultimate terminal. Fully compatible with our stylus and features a gorgeous 2.8K resolution screen. Made of solid matte aluminum chassis in cyber-slate finishing.",
    specifications: [
      { label: "Display", value: "12.4 inch Screen Core-OLED, 2800x1750, 120Hz" },
      { label: "Internal CPU", value: "V2 Octa-Core Graphics integrated" },
      { label: "Stylus support", value: "Magneto-Stylus with tilt sensitivity (Included)" },
      { label: "Weight", value: "490 grams ultra-slim" }
    ],
    stock: 18,
  },

  // Category: Vehicles
  {
    id: "veh-1",
    name: "Carbon Glide X1 Scooter",
    category: "vehicles",
    brand: "ApexGlide",
    price: 799,
    originalPrice: 999,
    rating: 4.8,
    reviewsCount: 64,
    reviews: MOCK_REVIEWS,
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=800", // Cyber-style scooter or electric transport
    secondaryImages: [
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800"
    ],
    description: "Designed for premium micro-mobility, the Carbon Glide X1 is fabricated entirely from double-weave carbon fiber. Propelled by a dual-bearing 1000W magnetic hub motor, it handles 20% incline angles without losing acceleration. Integrated dynamic under-glow LED running lights pulse with customizable color schemes to maximize nighttime safety.",
    specifications: [
      { label: "Motor Power", value: "1000W Brushless Direct Hub Motor" },
      { label: "Max Speed", value: "45 km/h (Sport+ mode)" },
      { label: "Max Range", value: "65 km on single charge" },
      { label: "Battery Unit", value: "48V 15.6Ah Premium LG Cells" },
      { label: "Weight Limit & Class", value: "Max 120kg / IPSX5 Water Resistant" }
    ],
    isFeatured: true,
    stock: 8,
    badge: "HOT OFFER",
  },
  {
    id: "veh-2",
    name: "CyberGlide Smart Bike EVO",
    category: "vehicles",
    brand: "CyberVeloc",
    price: 1899,
    originalPrice: 2199,
    rating: 4.9,
    reviewsCount: 31,
    reviews: MOCK_REVIEWS,
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=800", // smart bicycle
    secondaryImages: [
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=800"
    ],
    description: "Redefine city commuting with the CyberGlide Smart Bike Core. Integrating automated AI pedal assistance, integrated electronic GPS mapping anti-theft trackers, and electronic disk hydro-brakes, it provides absolute security and unmatched speed.",
    specifications: [
      { label: "Frame Core", value: "Grade-5 Aircraft Titanium + Carbon joints" },
      { label: "Smart Assist", value: "5-Level AI Sensor, adjusts to heart-rate" },
      { label: "GPS Security", value: "24/7 GSM/Satellite tracking + Remote lock" },
      { label: "Range Assists", value: "Up to 110 km of assisted ride" }
    ],
    isTrending: true,
    stock: 5,
    badge: "PREMIUM",
  },
  {
    id: "veh-3",
    name: "Zephyr Airboard PRO",
    category: "vehicles",
    brand: "Zephyr",
    price: 349,
    originalPrice: 399,
    rating: 4.5,
    reviewsCount: 47,
    reviews: MOCK_REVIEWS,
    image: "https://images.unsplash.com/photo-1596733212879-1bf4a938c520?q=80&w=800", // smart balance board
    secondaryImages: [],
    description: "An advanced smart self-balancing machine fitted with multi-directional gyroscopes and customized neon wheels. Designed for short commutes on solid pavements, university yards, and corporate campuses.",
    specifications: [
      { label: "Gyroscopic Balance", value: "3D Quad-Sensors" },
      { label: "Battery Unit", value: "Lithium-Polymer 36V 4.4Ah" },
      { label: "Charge duration", value: "1.5 hours to full" }
    ],
    stock: 14,
  },

  // Category: Computers
  {
    id: "comp-1",
    name: "Aether-15 Cyber Workstation",
    category: "computers",
    brand: "AetherLabs",
    price: 1999,
    originalPrice: 2299,
    rating: 4.9,
    reviewsCount: 201,
    reviews: MOCK_REVIEWS,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=800", // Laptop gaming setup
    secondaryImages: [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=800",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800"
    ],
    description: "The Aether-15 is an uncompromising monster workstation optimized for massive compilation processes, dynamic 3D rendering workflows, and triple-A VR gaming. Kept ice-cold by our proprietary Liquid-Mercury micro-pump tubes, it performs flawlessly even during intensive prolonged tasking. Enhanced with a stunning transparent keycap board with customized individual neon mapping.",
    specifications: [
      { label: "Processor Core", value: "Intel Lunar Core i9-16900HX (24 Cores)" },
      { label: "Graphics Engine", value: "NVIDIA RTX 5080 Laptop GPU 16GB VRAM" },
      { label: "Display spec", value: "15.6-inch Mini-LED 4K, 240Hz, HDR1000" },
      { label: "DRAM / Drive", value: "64GB DDR5 / 2TB PCIe Gen5 Raid 0 SSD" },
      { label: "Chassis Design", value: "Anodized Slate CNC Aluminum with Neon accents" }
    ],
    isFeatured: true,
    isTrending: true,
    stock: 6,
    badge: "BEAST SPEC",
  },
  {
    id: "comp-2",
    name: "Prism RGB Mech-Keyboardv2",
    category: "computers",
    brand: "PrismTech",
    price: 149,
    originalPrice: 189,
    rating: 4.8,
    reviewsCount: 228,
    reviews: MOCK_REVIEWS,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800", // Mech keyboard
    secondaryImages: [
      "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=800"
    ],
    description: "A highly clicky magnetic-switch mechanical keyboard with clear casing keys that emit stunning, fluid cyan and lavender glow animations. Supports hot-swappable mechanical switches.",
    specifications: [
      { label: "Switch Type", value: "Opto-Magnetic Linear Switches (Ultra-fast)" },
      { label: "Illumination", value: "Per-Key Addressable Cyber-Glow LED (RGB)" },
      { label: "Polling Rate", value: "8000Hz (0.125ms latency)" },
      { label: "Casing Material", value: "Semi-Transparent Frosted Polycarbonate" }
    ],
    isTrending: true,
    stock: 45,
    badge: "BEST SELLER",
  },
  {
    id: "comp-3",
    name: "OmniGrip Neon Pro Mouse",
    category: "computers",
    brand: "AeroTech",
    price: 79,
    originalPrice: 99,
    rating: 4.7,
    reviewsCount: 114,
    reviews: MOCK_REVIEWS,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=800", // gaming mouse
    secondaryImages: [],
    description: "Ultra lightweight hollow-frame honey-mesh mouse with a 36,000 DPI laser lens, neon violet breathing undergrid, and wireless low-latency connection.",
    specifications: [
      { label: "Sensor", value: "FocusPro 36K DPI Optical Core" },
      { label: "Weight", value: "49g ultra-hollow structural mesh" },
      { label: "Battery Unit", value: "Fast Rechargeable (95 hours usage)" }
    ],
    stock: 30,
  },

  // Category: Accessories
  {
    id: "acc-1",
    name: "NeuralLink XR Wearable VR",
    category: "accessories",
    brand: "NeuralHQ",
    price: 599,
    originalPrice: 699,
    rating: 4.9,
    reviewsCount: 78,
    reviews: MOCK_REVIEWS,
    image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=800", // VR headset
    secondaryImages: [
      "https://images.unsplash.com/photo-1576633534299-4996d9ea7d15?q=80&w=800"
    ],
    description: "Experience spatial workspace and immersive cyber gaming at scale with the NeuralLink XR. This lightweight head unit delivers crisp dual 4K OLED screens, real-time spatial lidar mapping, and advanced hand tracking telemetry. Connects wirelessly to any setup with lossless lag-free high-frequency streaming protocol.",
    specifications: [
      { label: "Display Optics", value: "Dual Micro-OLED, 4032 x 4032 pixels per eye" },
      { label: "Latency Rating", value: "Sub-12ms processing pipeline" },
      { label: "Sensing hardware", value: "6x Inside-Out Optical + Dual Lidar Scanners" },
      { label: "Audio Hardware", value: "Intelligent Spatial Ear-guides, integrated" }
    ],
    isFeatured: true,
    stock: 4,
    badge: "NEW TECH",
  },
  {
    id: "acc-2",
    name: "Onyx CyberBank 200W",
    category: "accessories",
    brand: "PrismTech",
    price: 89,
    originalPrice: 119,
    rating: 4.8,
    reviewsCount: 154,
    reviews: MOCK_REVIEWS,
    image: "https://images.unsplash.com/photo-1609592424085-f67aa8fb6ab3?q=80&w=800", // power bank/accessories
    secondaryImages: [],
    description: "A compact 25000mAh external battery built with transparent high-impact cyber plating. The integrated high-intensity cyber-OLED panel presents real-time data on output wattage, current battery temperature, and charging estimates.",
    specifications: [
      { label: "Total capacity", value: "25,000mAh Lithium Ion cells" },
      { label: "Max Out Port", value: "200W Combined Power Deliver (PD 3.1)" },
      { label: "Sensors", value: "OLED Realtime telemetry monitor" }
    ],
    stock: 50,
  },
  {
    id: "acc-3",
    name: "Apex Studio Smart Speaker",
    category: "accessories",
    brand: "SonicWave",
    price: 199,
    originalPrice: 249,
    rating: 4.6,
    reviewsCount: 96,
    reviews: MOCK_REVIEWS,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=800", // smart home speaker / gadgets
    secondaryImages: [],
    description: "Desktop smart speaker featuring a built-in liquid ferromagnetic frequency visualizer. The neon fluid dances dynamically with the beat of your music, lighting up your workstation beautifully with deep blues and cosmic violet.",
    specifications: [
      { label: "Acoustic driver", value: "30W Woofer + Dual 10W Dome Tweeters" },
      { label: "Visualizer", value: "Ferrofluid liquid core with backlighting" },
      { label: "Connecting module", value: "Wi-Fi 6 / Bluetooth Multi-connect" }
    ],
    stock: 22,
  }
];

export const SPECIAL_OFFERS: Offer[] = [
  {
    id: "off-1",
    title: "SUMMER CYBER SALE",
    code: "CYBER20",
    discountPercent: 20,
    description: "Save big on all next-gen smart devices, gaming stations, and PC rigs. Limited redemptions.",
    bannerImage: "https://images.unsplash.com/photo-1563013544-824ae1d704d3?q=80&w=800", // neon shopping banner
    endsIn: "2 days left",
  },
  {
    id: "off-2",
    title: "ECO-VEHICLE REBATE",
    code: "NEONMOBILITY",
    discountPercent: 15,
    description: "Flat range discounts on scooters, bikes, and smart electrical micro-commuter rigs.",
    bannerImage: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800",
    endsIn: "5 days left",
  },
  {
    id: "off-3",
    title: "NEW USER BONUS",
    code: "WELCOMEWORLD",
    discountPercent: 10,
    description: "Get started with your ultimate high-tech shopping spree. Applied to your first order.",
    bannerImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800",
    endsIn: "Ongoing Offer",
  }
];
