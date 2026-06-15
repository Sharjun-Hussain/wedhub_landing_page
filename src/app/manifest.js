export default function manifest() {
  return {
    name: "Foreign Emporium",
    short_name: "Emporium",
    description: "Your elite boutique storefront for premium Saudi and Dubai luxury imports, authentic Arabian ouds, dates, and Middle Eastern delicacies.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf9f6",
    theme_color: "#130f0d",
    icons: [
      {
        src: "/logo.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
