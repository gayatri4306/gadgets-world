import { 
  Package, 
  Calendar, 
  ChevronRight, 
  Truck, 
  ArrowLeft, 
  CheckCircle, 
  ShoppingBag,
  ExternalLink
} from "lucide-react";
import { Order, PageView, formatPrice } from "../types";

interface OrdersProps {
  orders: Order[];
  onGoToShop: () => void;
  showToast: (msg: string, type: "success" | "info" | "warn") => void;
}

export default function Orders({ orders, onGoToShop, showToast }: OrdersProps) {
  const handleTraceOrder = (id: string) => {
    showToast(`Initiating shipment tracking radar for order ${id}`, "info");
  };

  const statusColors = (status: Order["status"]) => {
    switch (status) {
      case "Delivered": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/35";
      case "Shipped": return "bg-[#06b6d4]/10 text-[#06b6d4] border-[#06b6d4]/35";
      case "Processing":
      default: return "bg-amber-500/10 text-amber-400 border-amber-500/35";
    }
  };

  if (orders.length === 0) {
    return (
      <div className="py-20 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#09090b] text-neutral-300">
        <div className="max-w-md mx-auto space-y-6">
          <div className="inline-flex p-6 bg-[#18181b] border border-[#27272a] rounded-full text-neutral-500 animate-[pulse_2.5s_infinite]">
            <Package className="w-16 h-16 text-[#a855f7]" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display font-black text-2xl uppercase tracking-wider text-white">No Order Transmissions</h2>
            <p className="text-sm text-neutral-400">
              There are no previous receipt parameters associated with your consumer profiles. Unlock shopping now!
            </p>
          </div>
          <button
            onClick={onGoToShop}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition"
          >
            <span>Begin Consignment Deploy</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-[#09090b] text-neutral-300 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Headers */}
        <div className="space-y-2 mb-10 pb-5 border-b border-[#27272a]">
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-wider flex items-center gap-2">
            <span>MY AUTHENTICATED ORDERS</span>
            <Package className="w-6 h-6 text-[#a855f7]" />
          </h1>
          <p className="text-xs font-mono text-neutral-400">
            LOCATE COPIES OF CONFIRMED RECEIPTS, LOGISTIC BLUEPRINTS, AND REAL-TIME ROUTE DISPATCHES
          </p>
        </div>

        {/* Master stack of orders */}
        <div className="max-w-4xl mx-auto space-y-6">
          {orders.map((order) => (
            <div 
              key={order.id}
              className="bg-[#18181b] border border-[#27272a] rounded-2xl overflow-hidden shadow-lg hover:border-[#a855f7]/30 transition duration-150"
            >
              
              {/* Order top bar summary */}
              <div className="bg-[#27272a]/30 p-4 border-b border-[#27272a] flex flex-wrap items-center justify-between text-xs font-mono gap-3">
                <div className="flex items-center space-x-4">
                  <div>
                    <span className="text-neutral-500 uppercase text-[9px] block">Order reference</span>
                    <span className="text-white font-bold tracking-wider">{order.id}</span>
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-neutral-500 uppercase text-[9px] block">Transaction date</span>
                    <span className="text-neutral-300 font-bold">{order.date}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 uppercase text-[9px] block">Method</span>
                    <span className="text-neutral-300 font-bold uppercase">{order.paymentMethod}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase border rounded font-mono ${statusColors(order.status)}`}>
                    {order.status}
                  </span>
                  <p className="text-right">
                    <span className="text-neutral-500 uppercase text-[9px] block">Total paid</span>
                    <span className="text-[#06b6d4] font-bold text-sm">{formatPrice(order.totalAmount)}</span>
                  </p>
                </div>
              </div>

              {/* Items grid row layout */}
              <div className="p-5 divide-y divide-[#27272a]/50">
                {order.items.map((it, i) => (
                  <div key={i} className="flex sm:items-center justify-between py-3 first:pt-0 last:pb-0 gap-3">
                    <div className="flex items-center space-x-3">
                      <img src={it.image} className="w-10 h-10 object-cover rounded border border-[#27272a]" referrerPolicy="no-referrer" />
                      <div className="text-left font-sans">
                        <span className="text-white text-xs font-bold leading-tight block truncate sm:max-w-md">{it.name}</span>
                        <span className="text-[10px] text-neutral-500 font-mono mt-0.5">Quantity: {it.quantity} • Unit Price: {formatPrice(it.price)}</span>
                      </div>
                    </div>
                    <div className="font-mono text-white text-xs text-right whitespace-nowrap">
                      {formatPrice(it.price * it.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action buttons (Tracking simulated telemetry) */}
              <div className="p-4 bg-neutral-900/30 border-t border-[#27272a] text-right flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-[10px] text-neutral-400 font-sans italic text-left">
                  * Logistics consignments mapped to: {order.shippingAddress.fullName}, {order.shippingAddress.addressLine}, {order.shippingAddress.city}
                </p>
                <button
                  onClick={() => handleTraceOrder(order.id)}
                  className="flex items-center justify-center space-x-2 bg-[#27272a] hover:bg-[#3d3d42] px-5 py-2 rounded-xl text-neutral-300 hover:text-white border border-[#27272a] text-xs font-mono font-medium transition cursor-pointer shrink-0"
                >
                  <Truck className="w-3.5 h-3.5 text-[#06b6d4]" />
                  <span>Map Telemetry Tracking</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
