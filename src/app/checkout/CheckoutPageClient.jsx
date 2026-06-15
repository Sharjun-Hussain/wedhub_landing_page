"use client";

import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Tag,
  Loader2,
  Clock,
  AlertCircle,
  Check,
  ChevronLeft,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { useStore } from "@/States/Store";
import { useSession, signOut } from "next-auth/react";
import {
  applyCoupon,
  removeCoupon,
  fetchCheckoutSession,
  confirmOrder,
  setCheckoutAddress,
} from "@/lib/api";
import { toast } from "sonner";
import AuthModal from "@/components/AuthModal";
import InlineAuth from "@/components/InlineAuth";
import { useCart } from "@/hooks/useCart";
import { useRouter, useSearchParams } from "next/navigation";
import {
  generateHypeParams,
  formatCurrency,
  normalizeImageUrl,
} from "@/lib/utils";

// --- MODULAR COMPONENTS ---
import { CheckoutSteps } from "./components/CheckoutSteps";
import { OrderSummary } from "./components/OrderSummary";
import { ShippingStep } from "./components/ShippingStep";
import { PaymentStep } from "./components/PaymentStep";
import { ReviewStep } from "./components/ReviewStep";
import { User, ShoppingBag, LogOut } from "lucide-react";

export default function CheckoutPageClient({
  searchParams,
  checkoutId: routeCheckoutId,
  initialSessionData,
  userProfile,
}) {
  const router = useRouter();
  const searchParamsHook = useSearchParams();
  const { state, dispatch } = useStore();
  const { data: session, status } = useSession();
  // Extract primitive so effects don't re-fire when next-auth
  // returns a new session object reference with the same token value
  const accessToken = session?.accessToken;
  const containerRef = useRef(null);

  // Derived params
  const checkoutId = routeCheckoutId || searchParams?.checkoutId;
  const isBuyNow = searchParams?.buyNow === "true";
  const buyNowProductId = searchParams?.productId;
  const buyNowVariantId = searchParams?.variantId;
  const buyNowQuantity = searchParams?.quantity || 1;
  const { buyNow: executeBuyNow, checkout: executeCartCheckout } = useCart();

  const [isFetchingSession, setIsFetchingSession] = useState(false);
  const hasInitiatedRef = useRef(false);
  const loadingSessionIdRef = useRef(null);
  // Tracks which checkout ID was successfully loaded into the store,
  // so loadCheckoutSession never re-fires after SET_CHECKOUT_SESSION dispatch
  const loadedCheckoutIdRef = useRef(null);

  // Initialize store with server-side data if available.
  // Also mark the ID as loaded so loadCheckoutSession doesn't re-fetch it.
  useEffect(() => {
    if (initialSessionData && !loadedCheckoutIdRef.current) {
      dispatch({ type: "SET_CHECKOUT_SESSION", session: initialSessionData });
      if (routeCheckoutId) {
        loadedCheckoutIdRef.current = routeCheckoutId;
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSessionData]);

  // Load Checkout Session if ID is present
  useEffect(() => {
    const initBuyNow = async () => {
      if (
        status === "authenticated" &&
        accessToken &&
        isBuyNow &&
        buyNowProductId &&
        !checkoutId &&
        !state.checkoutSession &&
        !hasInitiatedRef.current
      ) {
        hasInitiatedRef.current = true;
        setIsFetchingSession(true);
        try {
          const sessionData = await executeBuyNow(
            buyNowProductId,
            buyNowVariantId || null,
            parseInt(buyNowQuantity) || 1,
          );
          if (sessionData?.id) {
            router.replace(
              `/checkout/${sessionData.id}?${generateHypeParams()}`,
            );
          } else {
            setIsFetchingSession(false);
            hasInitiatedRef.current = false;
          }
        } catch (error) {
          console.error("Failed to initialize buy now after login", error);
          toast.error("Failed to initialize checkout. Please try again.");
          setIsFetchingSession(false);
          hasInitiatedRef.current = false;
        }
      }
    };

    const initRegularCheckout = async () => {
      if (
        status === "authenticated" &&
        accessToken &&
        !checkoutId &&
        !isBuyNow &&
        !state.checkoutSession &&
        !hasInitiatedRef.current
      ) {
        hasInitiatedRef.current = true;
        setIsFetchingSession(true);
        try {
          const sessionData = await executeCartCheckout();
          if (sessionData?.id) {
            router.replace(
              `/checkout/${sessionData.id}?${generateHypeParams()}`,
            );
          } else {
            setIsFetchingSession(false);
            hasInitiatedRef.current = false;
          }
        } catch (error) {
          console.error("Failed to initialize checkout session", error);
          toast.error("Failed to initialize checkout. Please try again.");
          setIsFetchingSession(false);
          hasInitiatedRef.current = false;
        }
      }
    };

    initBuyNow();
    initRegularCheckout();
  }, [
    status,
    accessToken,
    isBuyNow,
    buyNowProductId,
    buyNowVariantId,
    buyNowQuantity,
    checkoutId,
    state.checkoutSession,
    executeBuyNow,
    executeCartCheckout,
    router,
  ]);

  useEffect(() => {
    const loadCheckoutSession = async () => {
      if (!checkoutId || status !== "authenticated" || !accessToken) return;

      // Already successfully loaded this session ID — skip entirely.
      // This ref-based guard replaces state.checkoutSession in deps,
      // which would cause this effect to re-fire after every dispatch.
      if (loadedCheckoutIdRef.current === checkoutId) return;

      // Another async call is already in-flight for this ID
      if (loadingSessionIdRef.current === checkoutId) return;

      loadingSessionIdRef.current = checkoutId;
      setIsFetchingSession(true);
      try {
        const response = await fetchCheckoutSession(checkoutId, accessToken);
        if ((response?.success || response?.status === "success") && response?.data) {
          dispatch({ type: "SET_CHECKOUT_SESSION", session: response.data });
          loadedCheckoutIdRef.current = checkoutId;
        }
      } catch (error) {
        console.error("Failed to fetch checkout session:", error);
        toast.error("Could not load your checkout session.");
      } finally {
        setIsFetchingSession(false);
        loadingSessionIdRef.current = null;
      }
    };

    loadCheckoutSession();
  // state.checkoutSession intentionally omitted — loadedCheckoutIdRef handles
  // the "already loaded" guard so we don't loop on every dispatch
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutId, status, accessToken, dispatch]);

  const sessionData = state.checkoutSession;

  // Map cart items or session items
  let checkoutItems = [];
  let subtotal = 0;

  if (sessionData && sessionData.items) {
    checkoutItems = sessionData.items.map((item) => ({
      id: item.id,
      title: item.product?.name || "Product",
      brand:
        `${item.variant?.color || ""} ${item.variant?.storage_size || ""}`.trim() ||
        item.product?.type ||
        "",
      price: parseFloat(item.unit_price),
      quantity: item.quantity,
      images: [
        item.product?.primary_image_path
          ? normalizeImageUrl(item.product.primary_image_path)
          : "https://via.placeholder.com/400?text=No+Image",
      ],
    }));
    subtotal = parseFloat(sessionData.subtotal || 0);
  } else if (isBuyNow && buyNowProductId) {
    const buyNowName = searchParamsHook.get("name") || "Product";
    const buyNowPrice = parseFloat(searchParamsHook.get("price") || 0);
    const buyNowQty = parseInt(buyNowQuantity) || 1;
    const buyNowImage =
      searchParamsHook.get("image") ||
      "https://via.placeholder.com/400?text=Loading...";

    checkoutItems = [
      {
        id: "placeholder",
        title: buyNowName,
        brand: "Buy Now Item",
        price: buyNowPrice,
        quantity: buyNowQty,
        images: [buyNowImage],
      },
    ];
    subtotal = buyNowPrice * buyNowQty;
  } else {
    checkoutItems = state.cart.filter((item) => item.selected !== false);
    subtotal = checkoutItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }

  const deliveryFee = 0;
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    province: "",
    deliveryAddressId: null,
    paymentMethod: "cash_on_delivery",
    isSubmitting: false,
  });

  const [paymentSlip, setPaymentSlip] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [localProfile, setLocalProfile] = useState(null);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [deliveryAddresses, setDeliveryAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Coupons
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Timer
  const [timeLeft, setTimeLeft] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!sessionData?.created_at) return;
    const interval = setInterval(() => {
      const created = new Date(sessionData.created_at).getTime();
      const now = new Date().getTime();
      const duration = 30 * 60 * 1000;
      const remaining = duration - (now - created);
      if (remaining <= 0) {
        setTimeLeft(0);
        setIsExpired(true);
        clearInterval(interval);
      } else {
        setTimeLeft(Math.floor(remaining / 1000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionData?.created_at]);

  const formatTimeLeftValue = (seconds) => {
    if (seconds === null) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Profile sync
  useEffect(() => {
    if (userProfile && !profileLoaded) {
      const addr = userProfile.customer_profile?.default_delivery_address;
      if (addr) {
        setFormData((prev) => ({
          ...prev,
          fullName: addr.full_name || userProfile.name || "",
          phone: addr.phone || userProfile.customer_profile?.phone || "",
          address: addr.address_line_1 || "",
          address2: addr.address_line_2 || "",
          city: addr.city || "",
          district: addr.state || "",
          zip: addr.postal_code || "",
          province: addr.state || "",
          deliveryAddressId: addr.id || null,
        }));
      }
      setProfileLoaded(true);
    }
  }, [userProfile, profileLoaded]);

  const handleApplyCoupon = async () => {
    setCouponError("");
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a code");
      toast.error("Please enter a coupon code");
      return;
    }
    if (status !== "authenticated" || !session?.accessToken) {
      toast.info("Please login to apply coupons");
      setShowAuthModal(true);
      return;
    }
    setIsApplyingCoupon(true);
    try {
      const effectiveCheckoutId = checkoutId || sessionData?.id;
      if (!effectiveCheckoutId) {
        setCouponError("Checkout session not found. Please refresh the page.");
        toast.error("Checkout session not found. Please refresh.");
        return;
      }
      console.log("Applying coupon code:", code, "for checkout ID:", effectiveCheckoutId, "with subtotal:", subtotal);
      
      const result = await applyCoupon(
        effectiveCheckoutId,
        code,
        subtotal,
        session.accessToken,
      );
      
      console.log("Apply coupon API response:", result);

      if ((result.success || result.status === "success") && result.data) {
        setDiscount(parseFloat(result.data.discount_amount));
        setAppliedCoupon(code);
        setCouponCode("");
        toast.success(`Coupon applied successfully! Saved LKR ${result.data.discount_amount}`);
      } else {
        const msg = result.message || "Invalid coupon code";
        setCouponError(msg);
        toast.error(msg);
      }
    } catch (error) {
      console.error("Coupon apply catch error:", error);
      const errMsg = error.info?.message || error.message || "Failed to apply coupon.";
      setCouponError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = async () => {
    if (!session?.accessToken) return;
    setIsApplyingCoupon(true);
    try {
      const effectiveCheckoutId = checkoutId || sessionData?.id;
      if (!effectiveCheckoutId) return;
      await removeCoupon(effectiveCheckoutId, session.accessToken);
      setDiscount(0);
      setAppliedCoupon(null);
      toast.success("Coupon removed");
    } catch (error) {
      toast.error("Failed to remove coupon");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const total = subtotal + deliveryFee - discount;

  const handleDataChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckout = async () => {
    if (isExpired) {
      toast.error("Session expired.");
      return;
    }
    if (!session?.accessToken) return;
    const effectiveCheckoutId = checkoutId || sessionData?.id;
    if (!effectiveCheckoutId) return;

    if (formData.paymentMethod === "bank_transfer" && !paymentSlip) {
      toast.error("Please upload payment slip.");
      changeStep(2);
      return;
    }

    setFormData((prev) => ({ ...prev, isSubmitting: true }));
    try {
      const payload = new FormData();
      payload.append("payment_method", formData.paymentMethod);
      if (formData.deliveryAddressId) {
        payload.append("delivery_address_id", formData.deliveryAddressId);
      }
      if (appliedCoupon) {
        payload.append("coupon_code", appliedCoupon);
      }
      if (formData.paymentMethod === "bank_transfer" && paymentSlip) {
        payload.append("payment_slip", paymentSlip);
      }
      const response = await confirmOrder(
        effectiveCheckoutId,
        payload,
        session.accessToken,
      );
      if (response?.success || response?.status === "success") {
        toast.success("Order Placed!");
        dispatch({ type: "CLEAR_CHECKOUT_SESSION" });
        router.push(
          `/account?tab=orders&orderSuccess=true&${generateHypeParams()}`,
        );
      }
    } catch (error) {
      toast.error(error.message || "Failed to place order");
    } finally {
      setFormData((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const changeStep = (newStep) => {
    gsap.to(".animate-step", {
      x: -20,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setStep(newStep);
        gsap.fromTo(
          ".animate-step",
          { x: 20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4 },
        );
      },
    });
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setProfileLoaded(false);
  };

  useGSAP(
    () => {
      const tl = gsap.timeline();
      tl.fromTo(
        ".left-panel",
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8 },
      )
        .fromTo(
          ".right-panel",
          { x: 50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8 },
          "<",
        )
        .fromTo(
          ".stagger-in",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1 },
          "-=0.5",
        );
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-zinc-950 overflow-hidden font-sans transition-colors duration-300"
    >
      {/* Top Header Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 z-50 px-4 lg:px-16 flex items-center justify-between">
        {/* Mobile-only native-like header */}
        <div className="flex md:hidden items-center justify-between w-full">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 dark:bg-zinc-900 active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-5 h-5 text-slate-900 dark:text-white" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white text-lg">
              Checkout
            </span>
            <Lock className="w-4 h-4 text-green-600" />
          </div>
          <div className="w-10 h-10 flex items-center justify-center">
            {/* Empty placeholder for perfect centering */}
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <img
                src="/logo.png"
                alt="Foreign Emporium"
                className="h-8 w-auto object-contain dark:brightness-110"
              />
              <span className="font-serif font-black tracking-tight text-base text-[#2c2520] dark:text-white uppercase">
                Foreign <span className="text-[#a97d43] dark:text-[#d4af37]">Emporium</span>
              </span>
            </Link>
          </div>

          {status === "authenticated" && (
            <div className="flex items-center gap-5 lg:gap-6">
              <Link
                href="/account"
                className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-[#a97d43] dark:hover:text-[#d4af37] transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>My Orders</span>
              </Link>
              <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800" />
              
              {/* Luxury User Pill */}
              <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-full pl-1.5 pr-3.5 py-1 select-none hover:border-[#a97d43]/30 dark:hover:border-[#d4af37]/30 transition-all">
                <div className="w-7 h-7 rounded-full bg-[#a97d43] dark:bg-[#d4af37] text-white dark:text-zinc-950 flex items-center justify-center font-bold text-xs shadow-sm">
                  {session?.user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold text-[#2c2520] dark:text-zinc-200 leading-none">
                    {session?.user?.name}
                  </p>
                </div>
              </div>

              <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800" />
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-xs font-bold text-red-600 hover:text-red-700 dark:text-rose-400 dark:hover:text-rose-300 flex items-center gap-1.5 transition-colors group"
              >
                <LogOut className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {isFetchingSession && !state.checkoutSession && (
        <div className="fixed inset-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm z-100 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-[#a97d43] dark:text-[#d4af37] animate-spin" />
        </div>
      )}

      {/* Modular Left Panel */}
      <OrderSummary
        checkoutItems={checkoutItems}
        couponCode={couponCode}
        setCouponCode={setCouponCode}
        appliedCoupon={appliedCoupon}
        isApplyingCoupon={isApplyingCoupon}
        handleApplyCoupon={handleApplyCoupon}
        handleRemoveCoupon={handleRemoveCoupon}
        couponError={couponError}
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        discount={discount}
        total={total}
      />

      {/* Right Panel */}
      <div className="right-panel w-full lg:w-[55%] p-8 lg:p-16 lg:pl-24 pt-24 flex flex-col justify-center bg-white dark:bg-zinc-950 transition-colors">
        <div className="max-w-xl mx-auto w-full relative">
          {timeLeft !== null && timeLeft <= 300 && !isExpired && (
            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 rounded-2xl flex items-center justify-between">
              <span className="text-sm font-bold text-amber-800">
                Expires in {formatTimeLeftValue(timeLeft)}
              </span>
            </div>
          )}

          <CheckoutSteps step={step} />

          <div className="min-h-[400px]">
            {status === "unauthenticated" ? (
              <InlineAuth onSuccess={handleAuthSuccess} />
            ) : (
              <>
                {step === 1 && (
                  <ShippingStep
                    data={formData}
                    userProfile={localProfile || userProfile}
                    onChange={handleDataChange}
                    onNext={async (addressId) => {
                      const id = checkoutId || sessionData?.id;
                      if (!id) {
                        toast.error(
                           "Checkout session not ready. Please wait a moment.",
                        );
                        return;
                      }
                      await setCheckoutAddress(
                        id,
                        addressId,
                        session.accessToken,
                      );
                      changeStep(2);
                    }}
                    isAddressModalOpen={isAddressModalOpen}
                    setIsAddressModalOpen={setIsAddressModalOpen}
                    isSelectionModalOpen={isSelectionModalOpen}
                    setIsSelectionModalOpen={setIsSelectionModalOpen}
                    deliveryAddresses={deliveryAddresses}
                    loadingAddresses={loadingAddresses}
                    session={session}
                    setDeliveryAddresses={setDeliveryAddresses}
                    setEditingAddress={setEditingAddress}
                  />
                )}
                {step === 2 && (
                  <PaymentStep
                    data={formData}
                    onChange={handleDataChange}
                    onBack={() => changeStep(1)}
                    onNext={() => changeStep(3)}
                    total={total}
                    paymentSlip={paymentSlip}
                    setPaymentSlip={setPaymentSlip}
                  />
                )}
                {step === 3 && (
                  <ReviewStep
                    data={formData}
                    onBack={(val) => changeStep(val || 2)}
                    onSubmit={handleCheckout}
                    total={total}
                    isExpired={isExpired}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {isExpired && (
        <div className="fixed inset-0 z-200 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full p-10 bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-zinc-800">
            <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-8" />
            <h2 className="text-3xl font-black mb-4">Session Expired</h2>
            <Link
              href="/"
              className="w-full h-14 bg-[#2c2520] dark:bg-white text-white dark:text-[#2c2520] font-bold rounded-2xl flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
