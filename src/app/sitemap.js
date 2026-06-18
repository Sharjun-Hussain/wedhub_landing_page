import { fetchProducts, fetchCategories } from "@/lib/api";

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://wedhub.lk";

  // 1. Static routes
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/vendors",
    "/magazines",
    "/offers",
    "/login",
    "/register",
    "/privacy-policy",
    "/terms-and-conditions",
    "/cookies",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: route === "" ? 1 : 0.8,
  }));

  // 2. Fetch Categories
  let categoryRoutes = [];
  try {
    const categoriesResponse = await fetchCategories();
    if (categoriesResponse?.data) {
      categoryRoutes = categoriesResponse.data.map((cat) => ({
        url: `${baseUrl}/vendors?category=${cat.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error("Error fetching categories for sitemap:", error);
  }

  // 3. Fetch Products
  let productRoutes = [];
  try {
    const productsResponse = await fetchProducts({ per_page: 100 });
    if (productsResponse?.data?.data) {
      productRoutes = productsResponse.data.data.map((product) => ({
        url: `${baseUrl}/product/${product.slug}`,
        lastModified: product.updated_at
          ? new Date(product.updated_at)
          : new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      }));
    }
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
