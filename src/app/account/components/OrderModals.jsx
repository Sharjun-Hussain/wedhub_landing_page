"use client";

import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { X, Package, Star, Upload } from "lucide-react";
import { toast } from "sonner";
import { cancelOrder, markOrderReceived, submitProductReview } from "@/lib/api";

const formatCurrency = (amount) => {
  return "Rs. " + amount.toLocaleString("en-LK", { minimumFractionDigits: 2 });
};

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") || "https://fe.inzeedo.lk";
  return `${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
};

export const ProductReviewModal = ({
  isOpen,
  onClose,
  item,
  token,
  onSuccess,
}) => {
  const modalRef = useRef(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setRating(5);
      setComment("");
      setImages([]);
      setPreviews([]);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useGSAP(
    () => {
      if (isOpen) {
        gsap.fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.95, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "power2.out" },
        );
      }
    },
    { scope: modalRef, dependencies: [isOpen] },
  );

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    setImages((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      return newPreviews.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Please provide a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("order_item_id", item.id);
      formData.append("rating", rating);
      formData.append("comment", comment);

      images.forEach((image) => {
        formData.append("images[]", image);
      });

      await submitProductReview(formData, token);
      toast.success("Review submitted successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error(error.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Review Product
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
            <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 shrink-0 overflow-hidden">
              {item.Product?.primary_image_path ? (
                <img
                  src={getImageUrl(item.Product.primary_image_path)}
                  alt={item.Product?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="w-full h-full p-3 text-slate-300" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {item.Product?.name}
              </p>
              <p className="text-xs text-slate-500">{item.ProductVariant?.variant_name}</p>
            </div>
          </div>

          <div className="space-y-3 text-center">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Your Rating
            </label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform active:scale-90"
                >
                  <Star
                    className={`w-10 h-10 ${rating >= star ? "fill-yellow-400 text-yellow-400" : "text-slate-200 dark:text-zinc-700"}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider pl-1">
              Your Comment
            </label>
            <textarea
              required
              placeholder="What did you think of the product?"
              className="w-full h-32 p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white resize-none"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center pl-1">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Product Photos
              </label>
              <span className="text-xs text-slate-500">
                {images.length} / 5
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {previews.map((preview, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800"
                >
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full shadow-lg"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {images.length < 5 && (
                <label className="aspect-square flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors">
                  <Upload className="w-6 h-6 text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">
                    Add Photo
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-slate-100 dark:border-zinc-800">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/25 transition-all active:scale-[0.98] disabled:opacity-50 uppercase tracking-widest text-sm"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

export const OrderModal = ({
  order,
  onClose,
  token,
  onStatusUpdate,
  onReviewItem,
}) => {
  const modalRef = useRef(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCancelReason, setShowCancelReason] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const cancelReasons = [
    "Found a better price elsewhere",
    "Changed my mind",
    "Delivery is taking too long",
    "Order placed by mistake",
    "Other",
  ];

  useEffect(() => {
    if (order) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [order]);

  useGSAP(
    () => {
      if (order) {
        gsap.fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.95, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "power2.out" },
        );
      }
    },
    { scope: modalRef, dependencies: [order] },
  );

  const handleCancel = async () => {
    const finalReason =
      selectedReason === "Other" ? customReason : selectedReason;
    if (!finalReason) {
      toast.error("Please select or enter a cancellation reason");
      return;
    }

    setIsUpdating(true);
    try {
      await cancelOrder(order.id, token, finalReason);
      toast.success("Order cancelled successfully");
      setShowCancelReason(false);
      onStatusUpdate?.();
    } catch (error) {
      toast.error(error.message || "Failed to cancel order");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkReceived = async () => {
    if (!window.confirm("Confirm that you have received this order?")) return;
    setIsUpdating(true);
    try {
      await markOrderReceived(order.id, token);
      toast.success("Order marked as received");
      onStatusUpdate?.();
    } catch (error) {
      toast.error(error.message || "Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              Order {order.order_number || `#${order.id}`}
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
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Placed on {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {showCancelReason ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Why are you cancelling?
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
                Please select a reason to help us improve.
              </p>

              <div className="space-y-3">
                {cancelReasons.map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedReason === reason
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                        : "bg-white dark:bg-zinc-900 border-slate-100 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancel_reason"
                      className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                      checked={selectedReason === reason}
                      onChange={() => setSelectedReason(reason)}
                    />
                    <span
                      className={`text-sm font-medium ${selectedReason === reason ? "text-blue-700 dark:text-blue-400" : "text-slate-700 dark:text-slate-300"}`}
                    >
                      {reason}
                    </span>
                  </label>
                ))}
              </div>

              {selectedReason === "Other" && (
                <div className="mt-4 animate-in fade-in zoom-in-95 duration-200">
                  <textarea
                    placeholder="Tell us more..."
                    className="w-full p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px] text-slate-900 dark:text-white"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                  />
                </div>
              )}
            </div>
          ) : (
            <>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                  Items
                </h4>
                <div className="space-y-4">
                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800"
                    >
                      <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 shrink-0 flex items-center justify-center overflow-hidden">
                        {item.Product?.primary_image_path ? (
                          <img
                            src={getImageUrl(item.Product.primary_image_path)}
                            alt={item.Product?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-8 h-8 text-slate-300 dark:text-zinc-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {item.Product?.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {item.ProductVariant?.variant_name} | Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {formatCurrency(parseFloat(item.price * item.quantity))}
                      </p>
                      {order.order_status === "delivered" && (
                        <button
                          onClick={() => onReviewItem(item)}
                          className="ml-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                        >
                          Review
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                    Summary
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">
                        Subtotal
                      </span>
                      <span className="text-slate-900 dark:text-white font-medium">
                        {formatCurrency(parseFloat(order.total_amount))}
                      </span>
                    </div>
                    {parseFloat(order.discount_amount) > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span className="font-medium">
                          -{formatCurrency(parseFloat(order.discount_amount))}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-zinc-800">
                      <span className="font-bold text-slate-900 dark:text-white">
                        Total
                      </span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(parseFloat(order.net_amount))}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                    Shipping Details
                  </h4>
                  <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white">
                      {order.shipping_name}
                    </p>
                    <p>{order.shipping_address}</p>
                    <p className="pt-2">{order.shipping_phone}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-6 bg-white dark:bg-zinc-800/50 border-t border-slate-100 dark:border-zinc-800 flex flex-wrap gap-3 justify-end">
          {showCancelReason ? (
            <>
              <button
                onClick={() => setShowCancelReason(false)}
                disabled={isUpdating}
                className="px-8 h-12 text-slate-600 dark:text-slate-400 font-black rounded-2xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 uppercase tracking-wider text-xs"
              >
                Back
              </button>
              <button
                onClick={handleCancel}
                disabled={
                  isUpdating ||
                  !selectedReason ||
                  (selectedReason === "Other" && !customReason)
                }
                className="px-8 h-12 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition-colors shadow-xl shadow-red-500/20 disabled:opacity-50 uppercase tracking-wider text-xs"
              >
                {isUpdating ? "Cancelling..." : "Confirm Cancellation"}
              </button>
            </>
          ) : (
            <>
              {order.order_status === "pending" && (
                <button
                  onClick={() => setShowCancelReason(true)}
                  disabled={isUpdating}
                  className="px-8 h-12 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-black rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50 uppercase tracking-wider text-xs border border-red-100 dark:border-red-900/30"
                >
                  Cancel Order
                </button>
              )}
              {(order.order_status === "processing" ||
                order.order_status === "shipped") && (
                <button
                  onClick={handleMarkReceived}
                  disabled={isUpdating}
                  className="px-8 h-12 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 uppercase tracking-wider text-xs active:scale-[0.98]"
                >
                  Order Received
                </button>
              )}
              <button
                onClick={onClose}
                className="px-8 h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl hover:opacity-90 transition-opacity uppercase tracking-wider text-xs"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
