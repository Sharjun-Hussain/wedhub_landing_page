"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Package, ChevronRight, Clock } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { fetchCustomerOrders } from "@/lib/api";
import { OrderModal, ProductReviewModal } from "./OrderModals";
import { formatDistanceToNow, format } from "date-fns";

const formatCurrency = (amount) => {
  return "Rs. " + amount.toLocaleString("en-LK", { minimumFractionDigits: 2 });
};

export const OrdersTab = ({ initialOrders = [] }) => {
  const [orders, setOrders] = useState(initialOrders);
  const [loading, setLoading] = useState(initialOrders.length === 0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedReviewItem, setSelectedReviewItem] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [ordersRefreshKey, setOrdersRefreshKey] = useState(0);
  const { data: session } = useSession();

  const loadOrders = useCallback(
    async (isRefresh = false) => {
      if (!session?.accessToken) return;
      if (!isRefresh && orders.length > 0) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await fetchCustomerOrders(session.accessToken);
        if (response.success || response.status === "success") {
          setOrders(response.data?.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast.error("Could not load your orders.");
      } finally {
        setLoading(false);
      }
    },
    [session],
  );

  useEffect(() => {
    loadOrders();
  }, [loadOrders, ordersRefreshKey]);

  if (loading) {
    return (
      <div className="animate-in fade-in duration-500 space-y-6">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-6">
          Order History
        </h2>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 bg-slate-50 dark:bg-zinc-900 animate-pulse rounded-2xl"
          />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="animate-in fade-in duration-500 text-center py-20">
        <div className="w-20 h-20 bg-slate-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-slate-300 dark:text-zinc-700" />
        </div>
        <h3 className="text-slate-900 dark:text-white font-bold">
          No orders yet
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
          When you make a purchase, your orders will appear here.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center mt-6 h-12 px-10 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 uppercase tracking-wide text-xs active:scale-[0.98]"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-6">
        Order History
      </h2>

      {orders.map((order) => (
        <div
          key={order.id}
          className="group border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all bg-white dark:bg-zinc-900"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-900 dark:text-white">
                  {order.order_number || `#${order.id}`}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
                  ${
                    order.order_status === "delivered"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : order.order_status === "processing"
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                        : order.order_status === "pending"
                          ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                          : "bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {order.order_status}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-300">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(order.created_at), {
                    addSuffix: true,
                  })}
                </span>
                <span className="text-slate-300 dark:text-zinc-700 text-xs hidden sm:inline-block">
                  &bull;
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400 dark:text-zinc-500 font-medium">
                  {format(
                    new Date(order.created_at),
                    "MMM d, yyyy 'at' h:mm a",
                  )}
                </span>
              </div>
            </div>
            <p className="font-black text-slate-900 dark:text-white text-lg sm:text-base">
              {formatCurrency(parseFloat(order.net_amount))}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-zinc-800">
            <p className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-[300px]">
              {order.items?.map((i) => i.Product?.name).join(", ")}
            </p>
            <button
              onClick={() => setSelectedOrder(order)}
              className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              View Details <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}

      {/* Domain-specific Modals */}
      <OrderModal
        order={selectedOrder}
        token={session?.accessToken}
        onStatusUpdate={() => {
          setOrdersRefreshKey((prev) => prev + 1);
          loadOrders(true);
          setSelectedOrder(null);
        }}
        onReviewItem={(item) => {
          setSelectedReviewItem(item);
          setIsReviewModalOpen(true);
        }}
        onClose={() => setSelectedOrder(null)}
      />

      <ProductReviewModal
        isOpen={isReviewModalOpen}
        item={selectedReviewItem}
        token={session?.accessToken}
        onClose={() => setIsReviewModalOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  );
};
