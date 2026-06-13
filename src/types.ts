export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Specification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  category: "electronics" | "vehicles" | "computers" | "accessories";
  brand: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  image: string;
  secondaryImages: string[];
  description: string;
  specifications: Specification[];
  isFeatured?: boolean;
  isTrending?: boolean;
  stock: number;
  badge?: string; // e.g. "HOT", "NEW", "-20%"
}

export interface Category {
  id: "electronics" | "vehicles" | "computers" | "accessories";
  name: string;
  icon: string; // lucide icon name
  description: string;
  itemCount: number;
  color: string; // e.g. "cyan" | "purple" | "pink" | "blue"
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Offer {
  id: string;
  title: string;
  code: string;
  discountPercent: number;
  description: string;
  bannerImage: string;
  endsIn: string; // remaining time descriptive string, or simple text like "2 days left"
}

export interface User {
  name: string;
  email: string;
  isLoggedIn: boolean;
  wishlist: string[]; // List of product IDs
  orders: Order[];
}

export interface Order {
  id: string;
  date: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  totalAmount: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    addressLine: string;
    city: string;
    zipCode: string;
    phone: string;
  };
}

export type PageView = "home" | "shop" | "detail" | "cart" | "checkout" | "offers" | "about" | "orders";

export function formatPrice(usdPrice: number): string {
  const inrPrice = Math.round(usdPrice * 83);
  return `₹${inrPrice.toLocaleString("en-IN")}`;
}
