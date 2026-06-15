"use client";

import React, { useState } from "react";
import { Plus, Minus, MessageCircle, HelpCircle } from "lucide-react";

// --- Inline SVG avatars (luxury themed) ---
const AVATARS = [
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23a97d43'/%3E%3Ccircle cx='50' cy='38' r='18' fill='%23faf9f6'/%3E%3Cellipse cx='50' cy='85' rx='28' ry='22' fill='%23faf9f6'/%3E%3C/svg%3E",
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%232c2520'/%3E%3Ccircle cx='50' cy='38' r='18' fill='%23d4af37'/%3E%3Cellipse cx='50' cy='85' rx='28' ry='22' fill='%23d4af37'/%3E%3C/svg%3E",
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23d4af37'/%3E%3Ccircle cx='50' cy='38' r='18' fill='%232c2520'/%3E%3Cellipse cx='50' cy='85' rx='28' ry='22' fill='%232c2520'/%3E%3C/svg%3E",
];

// --- ACCORDION ITEM ---
const FAQItem = ({ item, isOpen, onClick }) => (
  <div
    className={`border-b border-[#e7e3d9] dark:border-[#352d28]/60 last:border-0 ${
      isOpen ? "bg-slate-50/50 dark:bg-zinc-900/50" : "bg-transparent"
    } transition-colors duration-200`}
  >
    <button
      onClick={onClick}
      className="w-full py-5 px-4 flex items-center justify-between text-left group"
    >
      <span
        className={`text-base md:text-lg font-bold transition-colors duration-200 pr-4 ${
          isOpen
            ? "text-[#a97d43] dark:text-[#d4af37]"
            : "text-[#2c2520] dark:text-white group-hover:text-[#a97d43] dark:group-hover:text-[#d4af37]"
        }`}
      >
        {item.question}
      </span>
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
          isOpen
            ? "bg-[#a97d43]/10 dark:bg-[#d4af37]/10 text-[#a97d43] dark:text-[#d4af37]"
            : "bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 group-hover:bg-[#a97d43]/10 group-hover:text-[#a97d43]"
        }`}
      >
        {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      </div>
    </button>

    <div
      className={`grid transition-all duration-300 ease-in-out ${
        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}
    >
      <div className="overflow-hidden">
        <p className="px-4 pb-5 pt-0 text-[#6d513e] dark:text-[#a3988e] leading-relaxed text-sm md:text-base">
          {item.answer}
        </p>
      </div>
    </div>
  </div>
);

export default function FAQSection({ initialCmsData }) {
  const [openIndex, setOpenIndex] = useState(0);

  const cmsData = React.useMemo(() => {
    const defaults = {
      header: {
        label: "SUPPORT CENTER",
        title: "Frequently Asked Questions",
        description:
          "Everything you need to know about our imported collections, orders, and delivery schedules. Can't find your answer?",
      },
      faqs: [
        {
          question: "Do you offer cash on delivery (COD) for premium goods?",
          answer:
            "Yes! We offer convenient Cash on Delivery island-wide for orders below LKR 50,000. For rare custom imports or extremely high-value luxury orders, we may request a secure partial bank deposit prior to dispatch.",
        },
        {
          question: "How long does delivery take across provinces?",
          answer:
            "For Colombo and suburbs, we provide Same-Day or Next-Day premium courier delivery. For other provinces, your order is secured and delivered within 2-3 working days via our elite logistics partners.",
        },
        {
          question: "Are your ouds and perfumes 100% original?",
          answer:
            "Absolutely. At Foreign Emporium, authenticity is our primary signature. All ouds, incense, premium perfumes, and boutique gourmet items are sourced directly from authorized royal houses and official distributors in Saudi Arabia and Dubai.",
        },
        {
          question: "What temperature controls do you have for chocolates?",
          answer:
            "We understand that chocolates (especially our viral Dubai pistachio kunafa bars) are delicate. All our imported confectionery products are kept in climate-controlled boutique warehouses and dispatched in heat-resistant, insulated packaging to prevent melting.",
        },
        {
          question: "Can I place custom request orders for specific Middle Eastern goods?",
          answer:
            "Yes! We offer a VIP personal shopper service. If there is a particular premium item, high-end fragrance, or luxury date selection you desire from the Gulf region, please contact our concierge team and we will fly it in for you.",
        },
      ],
      footer: {
        title: "Still have questions?",
        subtitle:
          "Can't find the exact answer you're looking for? Reach out to our bespoke support team.",
        button_text: "Chat on WhatsApp",
        button_link: "https://wa.me/94777123456",
      },
    };

    if (!initialCmsData?.data) return defaults;

    const cms = initialCmsData.data;
    const newData = { ...defaults };

    if (cms.faq_header) {
      newData.header = { ...defaults.header, ...cms.faq_header };
    }

    const faqItems = [];
    let i = 1;
    while (cms[`faq_item_${i}`]) {
      faqItems.push({
        question: cms[`faq_item_${i}`].question || "",
        answer: cms[`faq_item_${i}`].answer || "",
      });
      i++;
    }
    if (faqItems.length > 0) newData.faqs = faqItems;

    if (cms.faq_footer) {
      newData.footer = { ...defaults.footer, ...cms.faq_footer };
    }

    return newData;
  }, [initialCmsData]);

  return (
    <section className="py-16 md:py-24 bg-[#faf9f6] dark:bg-[#130f0d] transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-center mb-12 md:mb-20">
          <div className="inline-flex items-center gap-2 text-[#a97d43] dark:text-[#d4af37] font-black uppercase tracking-wider text-xs mb-3">
            <HelpCircle className="w-4 h-4" /> {cmsData.header.label}
          </div>
          <h2 className="text-3xl lg:text-5xl font-black text-[#2c2520] dark:text-white mb-4 md:mb-6">
            {cmsData.header.title}
          </h2>
          <p className="text-[#6d513e] dark:text-[#a3988e] text-sm sm:text-base lg:text-lg max-w-xl mx-auto font-light leading-relaxed">
            {cmsData.header.description}
          </p>
        </div>

        {/* ACCORDION LIST */}
        <div className="bg-white dark:bg-[#1d1815] rounded-[2rem] border border-[#e7e3d9] dark:border-[#352d28]/60 shadow-xl shadow-[#2c2520]/5 dark:shadow-none overflow-hidden mb-8 md:mb-12">
          {cmsData.faqs.map((faq, index) => (
            <FAQItem
              key={index}
              item={faq}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>

        {/* CTA BOX */}
        <div className="bg-white dark:bg-[#1d1815] rounded-[2rem] border border-[#e7e3d9] dark:border-[#352d28]/60 py-8 px-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-[#2c2520]/5 dark:shadow-none">
          <div className="flex items-center gap-4 flex-col text-center lg:flex-row lg:text-left">
            <div className="flex -space-x-3">
              {AVATARS.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="Support agent"
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full border-4 border-white dark:border-[#1d1815]"
                />
              ))}
            </div>
            <div>
              <h4 className="font-bold text-[#2c2520] dark:text-white uppercase tracking-wide">
                {cmsData.footer.title}
              </h4>
              <p className="text-sm text-[#6d513e] dark:text-[#a3988e]">
                {cmsData.footer.subtitle}
              </p>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <a
              href={cmsData.footer.button_link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-[#2d2520] dark:bg-white text-white dark:text-zinc-900 rounded-full font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              <MessageCircle className="w-4 h-4" /> {cmsData.footer.button_text}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
