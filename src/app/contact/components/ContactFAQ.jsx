"use client"
import React, { useState, memo, useCallback } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "Are your Middle Eastern products authentic?",
    answer: "Absolutely. All our premium ouds, gourmet chocolates, exotic juices, and luxury goods are sourced directly from authorized distributors and verified souks in Saudi Arabia and Dubai. We guarantee 100% authenticity on every single item.",
  },
  {
    question: "How long does shipping take?",
    answer: "We offer express shipping island-wide. Delivery typically takes 1 to 2 business days within the Eastern Province and Colombo, and 2 to 3 business days for other regions across Sri Lanka.",
  },
  {
    question: "Can I request custom product sourcing?",
    answer: "Yes, we specialize in custom personal imports! If there is a specific Arabian perfume, brand of dates, or luxury confectionary you want from Dubai or Saudi Arabia, let us know via the form, and our procurement team will source it for you.",
  },
  {
    question: "Do you offer wholesale or bulk pricing?",
    answer: "Yes, we support corporate gifting, luxury events, and wholesale accounts. Please reach out to us directly through our immediate hotlines or mark your message subject as 'Wholesale Inquiry' for specialized custom pricing.",
  },
];

const FAQItem = memo(({ item, isOpen, onClick, idx }) => {
  const handleToggle = useCallback(() => onClick(idx), [onClick, idx]);

  return (
    <div className="border-b border-[#e7e3d9]/60 dark:border-[#352d28]/60 pb-4 last:border-b-0 last:pb-0">
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between text-left py-3 group focus:outline-none"
      >
        <span
          className={`text-sm font-semibold tracking-wide transition-colors duration-300 ${isOpen
            ? "text-[#a97d43] dark:text-[#d4af37]"
            : "text-slate-800 dark:text-zinc-300 lg:group-hover:text-[#a97d43] lg:dark:group-hover:text-[#d4af37]"
            }`}
        >
          {item.question}
        </span>
        <span className="ml-4 shrink-0 text-slate-400 dark:text-zinc-500 lg:group-hover:text-[#a97d43] lg:dark:group-hover:text-[#d4af37] transition-colors">
          {isOpen ? (
            <Minus className="w-4 h-4 text-[#a97d43] dark:text-[#d4af37]" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out overflow-hidden transform-gpu backface-hidden ${isOpen
          ? "grid-rows-[1fr] opacity-100 mt-2"
          : "grid-rows-[0fr] opacity-0"
          }`}
      >
        <div className="overflow-hidden">
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-light pb-2">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
});

FAQItem.displayName = "FAQItem";

const ContactFAQ = memo(() => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = useCallback((index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  }, []);

  return (
    <div className="bg-white dark:bg-[#1d1815] border border-[#e7e3d9]/60 dark:border-[#352d28]/60 rounded-xl py-6 px-4 md:p-12 shadow-sm lg:hover:shadow-xl transition-all duration-300 transform-gpu backface-hidden">
      <div className="mb-10 text-center lg:text-left">
        <h2 className="text-3xl font-serif font-black text-[#2c2520] dark:text-white mb-2 tracking-tight">
          Common Questions
        </h2>
        <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
          <span className="h-[1.5px] w-6 bg-[#a97d43] dark:bg-[#d4af37]" />
          <span className="text-[10px] font-bold tracking-widest text-[#a97d43] dark:text-[#d4af37] uppercase font-sans">
            Helpful Information
          </span>
        </div>
        <p className="text-slate-500 dark:text-zinc-400 text-xs font-light leading-relaxed">
          Quick answers to our most popular inquiries about imported luxury goods, shipping, and custom requests.
        </p>
      </div>

      <div className="space-y-4">
        {FAQ_ITEMS.map((item, idx) => (
          <FAQItem
            key={idx}
            item={item}
            isOpen={activeIndex === idx}
            onClick={toggleAccordion}
            idx={idx}
          />
        ))}
      </div>
    </div>
  );
});

ContactFAQ.displayName = "ContactFAQ";

export default ContactFAQ;
