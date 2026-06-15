"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Star,
  Share2,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  Award,
  ChevronRight,
  Check,
  Clock,
  MapPin,
  CreditCard,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";

export function ProductDetailView({ product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [expandedReview, setExpandedReview] = useState(null);
  const [activeTab, setActiveTab] = useState("specifications");

  const formatPrice = (price) => `₹${price.toLocaleString()}`;

  const reviews = [
    {
      id: 1,
      name: "Rajesh Kumar",
      rating: 5,
      date: "2 weeks ago",
      comment:
        "Excellent product! Fast delivery and great build quality. Highly recommended for professionals. The keyboard is comfortable for long typing sessions and the trackpad is responsive. Battery life is impressive - I get through a full workday without needing to charge.",
      verified: true,
      likes: 12,
      helpful: 15,
      images: ["/review-1-1.jpg", "/review-1-2.jpg"],
    },
    {
      id: 2,
      name: "Priya Sharma",
      rating: 4,
      date: "1 month ago",
      comment:
        "Good value for money. Performance is solid and design is sleek. Minor heating issues during heavy use but overall a great machine for the price.",
      verified: true,
      likes: 8,
      helpful: 10,
    },
    {
      id: 3,
      name: "Amit Singh",
      rating: 5,
      date: "3 weeks ago",
      comment:
        "Perfect for gaming and work. The display quality is outstanding and battery life exceeds expectations. The speakers are surprisingly good for a laptop this size.",
      verified: true,
      likes: 21,
      helpful: 25,
      images: ["/review-3-1.jpg"],
    },
  ];

  const ratingDistribution = [
    { stars: 5, percentage: 72, count: 108 },
    { stars: 4, percentage: 18, count: 27 },
    { stars: 3, percentage: 6, count: 9 },
    { stars: 2, percentage: 3, count: 4 },
    { stars: 1, percentage: 1, count: 2 },
  ];

  const relatedProducts = [
    {
      id: "related-1",
      name: "MacBook Air M2",
      image: "/macbook-air-m2-laptop.png",
      price: 89999,
      originalPrice: 119900,
      rating: 4.8,
      reviews: 142,
    },
    {
      id: "related-2",
      name: "Dell XPS 13",
      image: "/dell-xps-13-laptop.png",
      price: 79999,
      originalPrice: 109999,
      rating: 4.7,
      reviews: 89,
    },
    {
      id: "related-3",
      name: "HP Pavilion Gaming",
      image: "/hp-pavilion-gaming-laptop.png",
      price: 54999,
      originalPrice: 74999,
      rating: 4.6,
      reviews: 203,
    },
    {
      id: "related-4",
      name: "ASUS ROG Strix",
      image: "/asus-rog-strix-g15-gaming-laptop.png",
      price: 89999,
      originalPrice: 124999,
      rating: 4.9,
      reviews: 67,
    },
  ];

  const toggleReviewExpansion = (reviewId) => {
    if (expandedReview === reviewId) {
      setExpandedReview(null);
    } else {
      setExpandedReview(reviewId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
        <span className="hover:text-primary cursor-pointer">Home</span>
        <ChevronRight className="h-4 w-4" />
        <span className="hover:text-primary cursor-pointer">
          {product.category}
        </span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-card rounded-xl overflow-hidden border">
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
              <Badge className="bg-accent text-accent-foreground text-sm font-semibold">
                {product.discount}% OFF
              </Badge>
              {product.isBestSeller && (
                <Badge
                  variant="outline"
                  className="bg-background/80 backdrop-blur-sm"
                >
                  {/* Badge removed */}
                </Badge>
              )}
            </div>
            <img
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-contain p-8 transition-opacity duration-300"
            />
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                  selectedImage === index
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} view ${index + 1}`}
                  className="w-full h-full object-contain p-2"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-bold text-balance pr-4">
                {product.name}
              </h1>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm font-medium">
                  {product.rating}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviewCount} reviews)
              </span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-green-600 font-medium">
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
              {product.fastDelivery && (
                <>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-blue-600 font-medium flex items-center">
                    <Truck className="h-3.5 w-3.5 mr-1" /> Fast Delivery
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-4xl font-bold text-primary">
              {formatPrice(product.currentPrice)}
            </span>
            <span className="text-xl text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              Save {formatPrice(product.originalPrice - product.currentPrice)}
            </Badge>
          </div>

          <p className="text-muted-foreground leading-relaxed border-b pb-6">
            {product.description}
          </p>

          {/* Key Features */}
          <div className="border-b pb-6">
            <h3 className="font-semibold mb-3 text-lg">Key Features</h3>
            <ul className="space-y-3">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Color Options */}
          {product.colors && (
            <div className="border-b pb-6">
              <h3 className="font-semibold mb-3 text-lg">Color</h3>
              <div className="flex gap-3">
                {product.colors.map((color, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`h-12 w-12 rounded-full border-2 ${
                        index === 0
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border"
                      }`}
                      style={{ backgroundColor: color.value }}
                    ></div>
                    <span className="text-xs mt-1">{color.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border border-border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 rounded-none"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 min-w-12 text-center font-medium">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 rounded-none"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="flex-1 bg-primary hover:bg-primary/90 h-12 text-base"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                className="flex-1 h-12 text-base bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                Buy Now
              </Button>
              <div className="flex gap-3 sm:flex-col md:flex-row">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-12 p-0 hidden md:inline-flex"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <Card className="bg-muted/40">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Delivery</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Deliver to Mumbai 400001
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Free Delivery</span>
                  <span className="text-sm text-green-600">Tomorrow</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Express Delivery</span>
                  <span className="text-sm">Today · ₹99</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">1 Year Warranty</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">30-Day Returns</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">EMI Available</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Genuine Product</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-16">
        <TabsList className="w-full justify-start rounded-none border-b h-14 bg-transparent p-0">
          <TabsTrigger
            value="specifications"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary h-14 px-5 data-[state=active]:bg-transparent"
          >
            Specifications
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary h-14 px-5 data-[state=active]:bg-transparent"
          >
            Reviews ({product.reviewCount})
          </TabsTrigger>
          <TabsTrigger
            value="shipping"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary h-14 px-5 data-[state=active]:bg-transparent"
          >
            Shipping & Returns
          </TabsTrigger>
        </TabsList>

        <TabsContent value="specifications" className="mt-8">
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/40 py-4">
              <CardTitle className="text-lg">
                Technical Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {Object.entries(product.specifications).map(
                ([category, specs], index) => (
                  <div
                    key={index}
                    className={`border-b ${index % 2 === 0 ? "bg-muted/20" : ""}`}
                  >
                    <div className="px-6 py-4 font-medium text-sm bg-muted/10">
                      {category}
                    </div>
                    <div className="px-6 pb-4">
                      {Object.entries(specs).map(([key, value], specIndex) => (
                        <div
                          key={specIndex}
                          className="flex justify-between py-2"
                        >
                          <span className="text-muted-foreground">{key}</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center mb-6">
                    <div className="text-5xl font-bold mb-2">
                      {product.rating}
                    </div>
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Based on {product.reviewCount} reviews
                    </p>
                  </div>

                  <div className="space-y-3">
                    {ratingDistribution.map((rating, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex items-center w-12">
                          <span className="text-sm w-5">{rating.stars}</span>
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        </div>
                        <Progress
                          value={rating.percentage}
                          className="h-2 flex-1"
                        />
                        <span className="text-sm text-muted-foreground w-8">
                          {rating.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full mt-6">Write a Review</Button>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <div className="space-y-6">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-medium">
                              {review.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{review.name}</span>
                              {review.verified && (
                                <Badge
                                  variant="outline"
                                  className="text-xs py-0"
                                >
                                  Verified Purchase
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {review.date}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-foreground mb-4">
                        {expandedReview === review.id
                          ? review.comment
                          : `${review.comment.substring(0, 150)}${review.comment.length > 150 ? "..." : ""}`}
                      </p>

                      {review.comment.length > 150 && (
                        <Button
                          variant="link"
                          className="p-0 h-auto font-normal text-muted-foreground"
                          onClick={() => toggleReviewExpansion(review.id)}
                        >
                          {expandedReview === review.id ? (
                            <>
                              Show less <ChevronUp className="ml-1 h-4 w-4" />
                            </>
                          ) : (
                            <>
                              Read more <ChevronDown className="ml-1 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      )}

                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-2 mt-4">
                          {review.images.map((img, idx) => (
                            <div
                              key={idx}
                              className="w-20 h-20 rounded-md overflow-hidden border"
                            >
                              <img
                                src={img || "/placeholder.svg"}
                                alt={`Review image ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{review.helpful} helpful</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8">
                          Helpful
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Comment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-6">
                Load More Reviews
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="shipping" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span>Free shipping on orders above ₹500</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span>Standard delivery: 3-5 business days</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span>
                      Express delivery: 1-2 business days (additional charges
                      apply)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span>Cash on delivery available</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span>Track your order with real-time updates</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <RotateCcw className="h-5 w-5" />
                  Return Policy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span>30-day return window from delivery date</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span>
                      Items must be in original condition with packaging
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span>Free return pickup for defective items</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span>Refund processed within 7-10 business days</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span>
                      No questions asked return policy for premium members
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Frequently Bought Together */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Frequently Bought Together</h2>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex items-center">
                <div className="w-20 h-20 bg-card rounded-md overflow-hidden">
                  <img
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <Plus className="h-5 w-5 mx-4 text-muted-foreground" />
                <div className="w-20 h-20 bg-card rounded-md overflow-hidden">
                  <img
                    src="/laptop-bag.jpg"
                    alt="Laptop Bag"
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <Plus className="h-5 w-5 mx-4 text-muted-foreground" />
                <div className="w-20 h-20 bg-card rounded-md overflow-hidden">
                  <img
                    src="/wireless-mouse.jpg"
                    alt="Wireless Mouse"
                    className="w-full h-full object-contain p-2"
                  />
                </div>
              </div>

              <div className="flex-1 md:ml-6">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">Total Price:</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(product.currentPrice + 2499 + 1299)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Save ₹800 when bought together
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Button>Add all to Cart</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Related Products */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">You May Also Like</h2>
          <Button variant="link" className="p-0">
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <Card
              key={relatedProduct.id}
              className="group overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="relative">
                <div className="aspect-square bg-card rounded-t-xl overflow-hidden">
                  <img
                    src={relatedProduct.image || "/placeholder.svg"}
                    alt={relatedProduct.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2 line-clamp-2 h-12">
                  {relatedProduct.name}
                </h3>
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(relatedProduct.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({relatedProduct.reviews})
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-primary">
                    {formatPrice(relatedProduct.price)}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(relatedProduct.originalPrice)}
                  </span>
                </div>
                <Button className="w-full" size="sm">
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Recently Viewed */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recently Viewed</h2>
          <Button variant="link" className="p-0">
            Clear All <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {relatedProducts.slice(0, 3).map((product) => (
            <Card key={product.id} className="group overflow-hidden">
              <div className="aspect-square bg-card rounded-t-xl overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-3">
                <h3 className="text-sm font-medium line-clamp-2 mb-1">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary text-sm">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
