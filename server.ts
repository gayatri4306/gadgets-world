import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Standard Products & Offers representation directly on the server to keep state in-sync
const INITIAL_PRODUCTS = [
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
      { id: "r1", author: "Alex Mercer", rating: 5, comment: "This is easily the best tech purchase I've made this year. High performance, beautifully designed, and the neon accents look amazing on my desk!", date: "2026-05-18" },
      { id: "r2", author: "Elena Rostov", rating: 4.8, comment: "Extremely fast shipping. The specs are perfectly accurate, and battery life is actually better than advertised. 10/10 would buy again.", date: "2026-06-01" },
      { id: "r-elec-1", author: "Sarah Jenkins", rating: 5, comment: "The crease is virtually invisible. The internal cooling works perfectly under extreme gaming sessions. Truly next-gen mobile computing.", date: "2026-06-08" }
    ],
    image: "https://files.catbox.moe/4niu2j.avif",
    secondaryImages: [
      "https://files.catbox.moe/xqq4it.jpg",
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
    badge: "FLAGSHIP"
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
    reviews: [
      { id: "r1", author: "Marcus Vane", rating: 4, comment: "Very solid build quality. Integrates seamlessly into my high-tech home ecosystem.", date: "2026-06-05" }
    ],
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800",
    secondaryImages: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800"
    ],
    description: "Shut out the world with active sound barrier technology. The SonicWave Eclipse matches a sleek matte-black polymer shell with electric blue sound guide rings. Customized 45mm beryllium drivers deliver deep sub-bass frequencies and crystalline highs.",
    specifications: [
      { label: "Acoustic Driver", value: "45mm Custom Beryllium Dome" },
      { label: "ANC depth", value: "-48dB Active Hybrid Shielding" },
      { label: "Connectivity", value: "Bluetooth 5.4 LE" }
    ],
    isTrending: true,
    stock: 25,
    badge: "POPULAR"
  },
  {
    id: "veh-1",
    name: "Carbon Glide X1 Scooter",
    category: "vehicles",
    brand: "ApexGlide",
    price: 799,
    originalPrice: 999,
    rating: 4.8,
    reviewsCount: 64,
    reviews: [],
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=800",
    secondaryImages: [],
    description: "Designed for premium micro-mobility, the Carbon Glide X1 is fabricated entirely from double-weave carbon fiber. Propelled by a dual-bearing 1000W magnetic hub motor.",
    specifications: [
      { label: "Motor Power", value: "1000W Brushless Direct Hub Motor" },
      { label: "Max Speed", value: "45 km/h (Sport+ mode)" }
    ],
    isFeatured: true,
    stock: 8,
    badge: "HOT OFFER"
  },
  {
    id: "comp-1",
    name: "Aether-15 Cyber Workstation",
    category: "computers",
    brand: "AetherLabs",
    price: 1999,
    originalPrice: 2299,
    rating: 4.9,
    reviewsCount: 201,
    reviews: [],
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=800",
    secondaryImages: [],
    description: "The Aether-15 is an uncompromising monster workstation optimized for massive compilation processes, dynamic 3D rendering workflows, and triple-A VR gaming.",
    specifications: [
      { label: "Processor Core", value: "Intel Lunar Core i9-16900HX (24 Cores)" },
      { label: "Graphics Engine", value: "NVIDIA RTX 5080 Laptop GPU 16GB VRAM" }
    ],
    isFeatured: true,
    isTrending: true,
    stock: 6,
    badge: "BEAST SPEC"
  },
  {
    id: "acc-1",
    name: "NeuralLink XR Wearable VR",
    category: "accessories",
    brand: "NeuralHQ",
    price: 599,
    originalPrice: 699,
    rating: 4.9,
    reviewsCount: 78,
    reviews: [],
    image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=800",
    secondaryImages: ["https://images.unsplash.com/photo-1576633534299-4996d9ea7d15?q=80&w=800"],
    description: "Experience spatial workspace and immersive cyber gaming at scale with the NeuralLink XR. This lightweight head unit delivers crisp dual 4K OLED screens.",
    specifications: [
      { label: "Display Optics", value: "Dual Micro-OLED, 4032 x 4032 pixels per eye" }
    ],
    isFeatured: true,
    stock: 4,
    badge: "NEW TECH"
  }
];

// Server memory storage
let products = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
const orders: any[] = [];
const supportTickets: any[] = [];
const users = new Map<string, any>([
  ["vurukutigayatri8@gmail.com", {
    name: "Gayatri Vurukuti",
    email: "vurukutigayatri8@gmail.com",
    isLoggedIn: true,
    wishlist: [],
    orders: []
  }]
]);

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Log backend entry check
  console.log("Initializing dynamic full-stack Gadgets World routing engines.");

  // API Route: Get all products
  app.get("/api/products", (req, res) => {
    res.json({ success: true, products });
  });

  // API Route: Get single product details
  app.get("/api/products/:id", (req, res) => {
    const pId = req.params.id;
    const item = products.find((p: any) => p.id === pId);
    if (!item) {
      return res.status(404).json({ success: false, error: "Gear component not registered" });
    }
    res.json({ success: true, product: item });
  });

  // API Route: Post review dynamically
  app.post("/api/products/:id/review", (req, res) => {
    const pId = req.params.id;
    const { author, rating, comment } = req.body;

    if (!author || !rating || !comment) {
      return res.status(400).json({ success: false, error: "Review arguments missing" });
    }

    const item = products.find((p: any) => p.id === pId);
    if (!item) {
      return res.status(404).json({ success: false, error: "Product not located" });
    }

    const newReview = {
      id: "rev-" + Date.now(),
      author: author.trim(),
      rating: parseFloat(rating),
      comment: comment.trim(),
      date: new Date().toISOString().split("T")[0]
    };

    item.reviews = item.reviews || [];
    item.reviews.unshift(newReview);
    
    // Recalculate ratings
    item.reviewsCount = item.reviews.length;
    const totalScore = item.reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
    item.rating = parseFloat((totalScore / item.reviewsCount).toFixed(1));

    res.json({ success: true, product: item });
  });

  // API Route: Register/Login user
  app.post("/api/auth/login", (req, res) => {
    const { email, name, password } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: "Email address is mandatory" });
    }

    const cleanEmail = email.trim().toLowerCase();
    let clientUser = users.get(cleanEmail);

    if (!clientUser) {
      clientUser = {
        name: name ? name.trim() : (cleanEmail.split("@")[0] || "Cyber Buyer"),
        email: cleanEmail,
        isLoggedIn: true,
        wishlist: [],
        orders: []
      };
      users.set(cleanEmail, clientUser);
    } else {
      clientUser.isLoggedIn = true;
    }

    res.json({ success: true, user: clientUser });
  });

  // API Route: Get user profile details
  app.get("/api/auth/profile", (req, res) => {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, error: "Missing email parameter" });
    }
    const cleanEmail = String(email).trim().toLowerCase();
    const clientUser = users.get(cleanEmail);
    if (!clientUser) {
      return res.status(404).json({ success: false, error: "Profile not found" });
    }
    res.json({ success: true, user: clientUser });
  });

  // API Route: Post customer support tickets
  app.post("/api/support/ticket", (req, res) => {
    const { email, name, subject, message } = req.body;
    if (!email || !subject || !message) {
      return res.status(400).json({ success: false, error: "Validation keys missing" });
    }

    const newTicket = {
      id: "TKT-" + Math.floor(1000 + Math.random() * 9000),
      email: email.trim(),
      name: name ? name.trim() : "Guest User",
      subject: subject.trim(),
      message: message.trim(),
      dateCreated: new Date().toISOString(),
      status: "OPEN"
    };

    supportTickets.push(newTicket);
    console.log(`Support ticket received and registered: ${newTicket.id}`);
    res.json({ success: true, ticket: newTicket });
  });

  // API Route: Post Orders with stock decrements
  app.post("/api/orders", (req, res) => {
    const { email, items, totalAmount, paymentMethod, shippingAddress } = req.body;

    if (!email || !items || !items.length || !totalAmount) {
      return res.status(400).json({ success: false, error: "Invalid placement logs" });
    }

    // Verify and decrement product stock levels
    for (const orderItem of items) {
      const match = products.find((p: any) => p.id === orderItem.productId);
      if (match) {
        if (match.stock < orderItem.quantity) {
          return res.status(400).json({ 
            success: false, 
            error: `Insufficient stock for ${match.name}. Available warehouse level is ${match.stock}` 
          });
        }
        match.stock -= orderItem.quantity;
      }
    }

    const newOrder = {
      id: "GWD-" + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString().split("T")[0],
      items,
      totalAmount: parseFloat(totalAmount),
      status: "Processing",
      paymentMethod: paymentMethod || "CARD",
      shippingAddress: shippingAddress || {
        fullName: "Gayatri Vurukuti",
        addressLine: "A-Block Smart Suites",
        city: "Hyderabad",
        zipCode: "500001",
        phone: "+91 99999 99999"
      }
    };

    orders.push(newOrder);

    // Sync state in memory map
    const cleanEmail = email.trim().toLowerCase();
    const userProfile = users.get(cleanEmail);
    if (userProfile) {
      userProfile.orders = userProfile.orders || [];
      userProfile.orders.unshift(newOrder);
    }

    res.json({ success: true, order: newOrder });
  });

  // API Route: Smart AI Hardware Assistant (Gemini)
  app.post("/api/assistant/chat", async (req, res) => {
    const { prompt, chatHistory } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: "Prompt payload expected" });
    }

    console.log(`Smart advisor telemetry processing for query: "${prompt.slice(0, 50)}..."`);

    // If Gemini client not loaded, output fallback model parameters
    if (!ai) {
      const offlineReply = `[OFFLINE MODE] Greetings! Under client-offline mode (GEMINI_API_KEY environment variable not currently loaded in settings), I can still help you! 
      
Gadgets World features beautiful smart hardware such as:
1. **TitanX Quantum Fold**: State-of-the-art flexible folds phone with Snapdragon Alpha Elite ($1399).
2. **SonicWave Eclipse ANC**: Premium active sound barrier headphones ($299).
3. **Carbon Glide X1**: Aerospace Double-weave Carbon Scooter ($799).
4. **Aether-15 Cyber Workstation**: Liquid-Mercury cooling Core i9 gaming station ($1999).
5. **NeuralLink XR Headset**: Lossless ultra-low latency spatial VR glasses ($599).

Register or checkout dynamically to verify stock decrement limits! Please provide an API key inSettings > Secrets if you want live dynamic interactive chat logic.`;
      return res.json({ success: true, response: offlineReply });
    }

    try {
      // Prompt construction with system instructions and current product specifications details
      const systemGuide = `You are the Gadgets World AI Hardware Advisor. You style your replies in an elegant, tech-focused, high-contrast digital theme. 
      Your tone is professional, objective, smart, and fully informed of our current hardware catalog:
      
      Catalog Specs:
      - TitanX Quantum Fold: Foldable nano-OLED, Snapdragon Alpha Elite, 18GB RAM, 1TB Storage, 200MP Main Zoom ($1399). Stock: 12.
      - SonicWave Eclipse ANC: Matte black, beryllium dome drivers, -48dB Active Hybrid Shielding ($299). Stock: 25.
      - Carbon Glide X1 Scooter: 1000W magnetic brushless hub motor, LG Battery cells, carbon fiber ($799). Stock: 8.
      - Aether-15 Cyber Workstation: Intel Lunar Core i9 (24 Cores), Nvidia RTX 5080 (16GB), Liquid-Mercury tubes, Mini-LED 4K 240Hz screen ($1999). Stock: 6.
      - NeuralLink XR Wearable VR: Spatial lidar, dual 4K OLED screens per eye, sub-12ms response ($599). Stock: 4.
      
      Guide users on specifications, design cooling solutions, calculate compatibility, and answer clearly. Keep answers helpful and elegant. Use Markdown list elements format for easy reading.`;

      // Use the gemini-3.5-flash model as recommended for standard text Q&A tasks
      const geminiResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemGuide,
          temperature: 0.75
        }
      });

      const extractedText = geminiResponse.text || "No response received from cellular node.";
      res.json({ success: true, response: extractedText });

    } catch (err: any) {
      console.error("Gemini hardware api error: ", err);
      res.status(500).json({ success: false, error: err.message || "An assistant node error occurred." });
    }
  });

  // Integration of Vite Dev Server or Production Static Bundles
  if (process.env.NODE_ENV !== "production") {
    console.log("Mounting Vite Middleware for Developer HMR systems");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving pre-compiled client static bundles from /dist");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Bind server exclusively on standard port 3000 at 0.0.0.0
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server online at http://localhost:${PORT}`);
  });
}

startServer();
