// --- HELPER FUNCTIONS ---
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

// --- NEW ARRIVALS DATA ---
export const ARRIVALS_DATA = [
  {
    id: 1,
    category: "phones",
    title: "Nothing Phone (2)",
    brand: "Nothing",
    price: 165000,
    image:
      "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&q=80&w=600",
    added: "2 hrs ago",
  },
  {
    id: 2,
    category: "phones",
    title: "Pixel 8 Pro",
    brand: "Google",
    price: 285000,
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff75?auto=format&fit=crop&q=80&w=600",
    added: "1 day ago",
  },
  {
    id: 3,
    category: "phones",
    title: "iPhone 15",
    brand: "Apple",
    price: 245000,
    image:
      "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=600",
    added: "3 days ago",
  },
  {
    id: 4,
    category: "audio",
    title: "Sony ULT Wear",
    brand: "Sony",
    price: 55000,
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=600",
    added: "Just now",
  },
  {
    id: 5,
    category: "audio",
    title: "AirPods Pro 2",
    brand: "Apple",
    price: 75000,
    image:
      "https://images.unsplash.com/photo-1603351154351-5cf9972a9ce1?auto=format&fit=crop&q=80&w=600",
    added: "5 hrs ago",
  },
  {
    id: 6,
    category: "audio",
    title: "Bose QC Ultra",
    brand: "Bose",
    price: 95000,
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=600",
    added: "1 day ago",
  },
  {
    id: 7,
    category: "wearables",
    title: "Galaxy Watch 6",
    brand: "Samsung",
    price: 85000,
    image:
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=600",
    added: "2 days ago",
  },
  {
    id: 8,
    category: "wearables",
    title: "Apple Watch Ultra",
    brand: "Apple",
    price: 285000,
    image:
      "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?auto=format&fit=crop&q=80&w=600",
    added: "1 week ago",
  },
  {
    id: 9,
    category: "accessories",
    title: "Anker 20W Charger",
    brand: "Anker",
    price: 4500,
    image:
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=600",
    added: "3 hrs ago",
  },
  {
    id: 10,
    category: "accessories",
    title: "Spigen Case iPhone 15",
    brand: "Spigen",
    price: 8500,
    image:
      "https://images.unsplash.com/photo-1603351154351-5cf9972a9ce1?auto=format&fit=crop&q=80&w=600",
    added: "5 hrs ago",
  },
];

// --- DEALS DATA ---
export const MAIN_DEAL = {
  id: 101,
  title: "iPhone 15 Pro Max",
  subtitle: "Titanium - 256GB",
  price: 385000,
  originalPrice: 425000,
  image:
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800",
  endDate: new Date(Date.now() + 86400000), // 24 hours from now
  coupon: "DEAL_WEEK", // Admin added coupon
};

export const TOP_PICKS = [
  {
    id: 201,
    title: "MagSafe Charger",
    brand: "Apple",
    price: 12500,
    originalPrice: 15000,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=400",
    coupon: "ACCESSORY10",
  },
  {
    id: 202,
    title: "Samsung 45W Adapter",
    brand: "Samsung",
    price: 8500,
    originalPrice: 10500,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 203,
    title: "Pixel Buds Pro",
    brand: "Google",
    price: 45000,
    originalPrice: 55000,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1610465299993-e6675c9f9efa?auto=format&fit=crop&q=80&w=400",
  },
];

export const refurbishedDeals = [
  {
    id: "6",
    name: "iPhone 13 Pro (Refurbished)",
    image:
      "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=400",
    currentPrice: 185000,
    originalPrice: 245000,
    discount: 25,
    savings: 60000,
  },
  {
    id: "7",
    name: "Galaxy S22 Ultra (Refurbished)",
    image:
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=400",
    currentPrice: 165000,
    originalPrice: 220000,
    discount: 25,
    savings: 55000,
  },
  {
    id: "8",
    name: "Pixel 7 Pro (Refurbished)",
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff23?auto=format&fit=crop&q=80&w=400",
    currentPrice: 145000,
    originalPrice: 185000,
    discount: 22,
    savings: 40000,
  },
  {
    id: "9",
    name: "iPhone 12 (Refurbished)",
    image:
      "https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&q=80&w=400",
    currentPrice: 115000,
    originalPrice: 145000,
    discount: 20,
    savings: 30000,
  },
  {
    id: "10",
    name: "Galaxy Note 20 Ultra (Refurbished)",
    image:
      "https://images.unsplash.com/photo-1596367407372-96cb2910ce92?auto=format&fit=crop&q=80&w=400",
    currentPrice: 135000,
    originalPrice: 175000,
    discount: 23,
    savings: 40000,
  },
];

export const headphoneDeals = [
  {
    id: "11",
    name: "Sony WH-1000XM4 Wireless",
    image: "/sony-wh-1000xm4.png",
    currentPrice: 19999,
    originalPrice: 29990,
    discount: 33,
    savings: 9991,
  },
  {
    id: "12",
    name: "Apple AirPods Pro (2nd Gen)",
    image: "/images/products/airpods-pro.png",
    currentPrice: 21999,
    originalPrice: 24900,
    discount: 12,
    savings: 2901,
  },
  {
    id: "13",
    name: "Bose QuietComfort 45",
    image: "/bose-quietcomfort-45-headphones.png",
    currentPrice: 22999,
    originalPrice: 32900,
    discount: 30,
    savings: 9901,
  },
  {
    id: "14",
    name: "JBL Tune 760NC Wireless",
    image: "/jbl-tune-760nc-wireless-headphones.png",
    currentPrice: 4999,
    originalPrice: 7999,
    discount: 38,
    savings: 3000,
  },
  {
    id: "15",
    name: "Sennheiser HD 450BT",
    image: "/sennheiser-hd-450bt-bluetooth-headphones.png",
    currentPrice: 8999,
    originalPrice: 14990,
    discount: 40,
    savings: 5991,
  },
];

export const categories = [
  "Mobiles",
  "Mobile Accessories",
  "Gadgets",
  "Offers & Deals",
];

export const products = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    price: 1199.99,
    originalPrice: 1299.99,
    image:
      "https://images.pexels.com/photos/18525574/pexels-photo-18525574/free-photo-of-iphone-15-pro-max-box.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "Mobiles",
    brand: "Apple",
    rating: 4.9,
    reviewCount: 2847,
    description: "The ultimate iPhone with titanium design and A17 Pro chip.",
    features: ["Titanium Design", "A17 Pro Chip", "48MP Camera", "USB-C"],
    inStock: true,
    isNew: true,
    isFeatured: true,
    tags: ["iphone", "apple", "premium", "5g"],
  },
  {
    id: "2",
    name: "Samsung Galaxy S24 Ultra",
    price: 1299.99,
    image:
      "https://images.pexels.com/photos/21448648/pexels-photo-21448648/free-photo-of-samsung-galaxy-s24-ultra.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "Mobiles",
    brand: "Samsung",
    rating: 4.8,
    reviewCount: 1923,
    description: "Galaxy AI is here. Welcome to the era of mobile AI.",
    features: ["Galaxy AI", "Titanium Frame", "200MP Camera", "S Pen"],
    inStock: true,
    isFeatured: true,
    tags: ["samsung", "android", "ai", "5g"],
  },
  {
    id: "3",
    name: "MagSafe Charger",
    price: 39.99,
    originalPrice: 49.99,
    image:
      "https://images.pexels.com/photos/7742584/pexels-photo-7742584.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "Mobile Accessories",
    brand: "Apple",
    rating: 4.5,
    reviewCount: 567,
    description: "The MagSafe Charger makes wireless charging a snap.",
    features: [
      "Fast Wireless Charging",
      "Magnetic Alignment",
      "USB-C",
      "Compact",
    ],
    inStock: true,
    tags: ["charger", "wireless", "magsafe"],
  },
  {
    id: "4",
    name: "Sony WH-1000XM5",
    price: 349.99,
    image:
      "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "Gadgets",
    brand: "Sony",
    rating: 4.9,
    reviewCount: 432,
    description: "Industry-leading noise canceling headphones.",
    features: [
      "Noise Cancellation",
      "30-hour Battery",
      "Crystal Clear Calls",
      "Multipoint Connection",
    ],
    inStock: true,
    isNew: true,
    tags: ["audio", "headphones", "sony"],
  },
];

const MOCK_PRODUCTS = [
  {
    id: "1",
    currentPrice: 119999,
    originalPrice: 139900,
    discount: 15,
    name: "iPhone 14",
    description: "A total powerhouse.",
    price: 799.99,
    salePrice: 699.99,
    category: "Mobiles",
    imageUrl:
      "https://images.pexels.com/photos/14666017/pexels-photo-14666017.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 4.8,
    reviewCount: 124,
    isNew: true,
    isInStock: true,
    tags: ["apple", "5g", "premium"],
  },
  {
    id: "2",
    currentPrice: 24999,
    originalPrice: 39900,
    discount: 35,
    name: "Redmi Note 13 Pro",
    description: "Super clear 200MP camera",
    price: 299.99,
    category: "Mobiles",
    imageUrl:
      "https://images.pexels.com/photos/19597856/pexels-photo-19597856/free-photo-of-redmi-note-13-pro-plus-5g.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 4.7,
    reviewCount: 89,
    isNew: false,
    isInStock: true,
    tags: ["xiaomi", "budget", "camera"],
  },
  {
    id: "3",
    currentPrice: 2999,
    originalPrice: 5900,
    discount: 50,
    name: "Fast Charging Adapter 20W",
    description: "Compact USB-C Power Adapter",
    price: 19.99,
    category: "Mobile Accessories",
    imageUrl:
      "https://images.pexels.com/photos/4219861/pexels-photo-4219861.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 4.6,
    reviewCount: 203,
    isNew: false,
    isInStock: true,
    tags: ["charger", "fast-charging"],
  },
  {
    id: "4",
    currentPrice: 4999,
    originalPrice: 9900,
    discount: 50,
    name: "Smart Watch Series 8",
    description: "Your essential companion for a healthy life",
    price: 399.99,
    salePrice: 349.99,
    category: "Gadgets",
    imageUrl:
      "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 4.7,
    reviewCount: 156,
    isNew: true,
    isInStock: false,
    tags: ["smartwatch", "fitness", "health"],
  },
  {
    id: "5",
    currentPrice: 1499,
    originalPrice: 2900,
    discount: 45,
    name: "Transparent Case for iPhone",
    description: "Crystal clear protection",
    price: 14.99,
    category: "Mobile Accessories",
    imageUrl:
      "https://images.pexels.com/photos/3756879/pexels-photo-3756879.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 4.4,
    reviewCount: 78,
    isNew: false,
    isInStock: true,
    tags: ["case", "protection"],
  },
  {
    id: "6",
    currentPrice: 8999,
    originalPrice: 15900,
    discount: 40,
    name: "Wireless Earbuds Pro",
    description: "Active Noise Cancellation",
    price: 129.99,
    category: "Gadgets",
    imageUrl:
      "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 4.3,
    reviewCount: 92,
    isNew: false,
    isInStock: true,
    tags: ["audio", "wireless", "anc"],
  },
];

// Simulate API call with delay
export async function getProducts() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_PRODUCTS;
}

export const CATEGORIES = [
  "Mobiles",
  "Mobile Accessories",
  "Gadgets",
  "Offers & Deals",
];

export const MOBILE_BRANDS = [
  "Apple",
  "Samsung",
  "Xiaomi",
  "Oppo",
  "Vivo",
  "OnePlus",
  "Google Pixel",
  "Realme",
  "Infinix",
  "Tecno",
  "Huawei",
  "Nokia",
  "Honor",
  "Itel",
];

export const STORAGE_OPTIONS = ["64GB", "128GB", "256GB", "512GB", "1TB"];
export const RAM_OPTIONS = ["4GB", "6GB", "8GB", "12GB", "16GB"];
export const CONDITIONS = ["New", "Used", "Refurbished"];
export const NETWORKS = ["4G", "5G"];

export const PRICE_RANGES = [
  { label: "Under $100", min: 0, max: 100 },
  { label: "$100 - $300", min: 100, max: 300 },
  { label: "$300 - $700", min: 300, max: 700 },
  { label: "$700+", min: 700, max: Infinity },
];

export const getAllProducts = () => {
  // Normalize and combine all data sources
  const allProducts = [
    ...ARRIVALS_DATA.map((item) => ({
      ...item,
      id: item.id.toString(),
      name: item.title,
      currentPrice: item.price,
      originalPrice: item.price * 1.1, // Fake original price
    })),
    {
      ...MAIN_DEAL,
      id: MAIN_DEAL.id.toString(),
      name: MAIN_DEAL.title,
      currentPrice: MAIN_DEAL.price,
      description: MAIN_DEAL.subtitle,
    },
    ...TOP_PICKS.map((item) => ({
      ...item,
      id: item.id.toString(),
      name: item.title,
      currentPrice: item.price,
    })),
    ...refurbishedDeals.map((item) => ({
      ...item,
      id: item.id.toString(),
    })),
    ...headphoneDeals.map((item) => ({
      ...item,
      id: item.id.toString(),
    })),
    ...products,
    ...MOCK_PRODUCTS,
  ];

  // Remove duplicates by ID
  const uniqueProducts = Array.from(
    new Map(allProducts.map((item) => [item.id, item])).values(),
  );

  return uniqueProducts;
};

export const getProductById = (id) => {
  const all = getAllProducts();
  return all.find((p) => p.id === id.toString());
};

export const getRelatedProducts = (id, category) => {
  const all = getAllProducts();
  return all
    .filter((p) => p.category === category && p.id !== id.toString())
    .slice(0, 4);
};
