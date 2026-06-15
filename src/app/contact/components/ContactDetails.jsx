import React, { memo } from "react";
import { Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react";

const InfoCard = memo(({ icon: Icon, title, details, link }) => (
  <div className="group flex flex-col py-6 px-4 rounded-xl bg-white dark:bg-[#1d1815] border border-[#e7e3d9]/60 dark:border-[#352d28]/60 shadow-sm lg:hover:border-[#d4af37]/40 lg:hover:shadow-xl lg:hover:shadow-[#a97d43]/5 transition-all duration-300 transform-gpu backface-hidden">
    <div className="w-10 h-10 bg-[#faf9f6] dark:bg-[#130f0d] border border-[#e7e3d9]/60 dark:border-[#352d28]/60 rounded-lg flex items-center justify-center mb-4 lg:group-hover:border-[#d4af37]/40 transition-colors">
      <Icon className="w-5 h-5 text-[#a97d43] dark:text-[#d4af37]" />
    </div>
    <div className="flex flex-col flex-grow">
      <h3 className="font-sans font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2">
        {title}
      </h3>
      <div className="space-y-1 mb-4 flex-grow">
        {details.map((detail, idx) => (
          <p
            key={idx}
            className="text-slate-500 dark:text-zinc-400 text-xs leading-relaxed"
          >
            {detail}
          </p>
        ))}
      </div>
      {link && (
        <a
          href={link.url}
          className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#a97d43] dark:text-[#d4af37] lg:hover:text-[#8e6837] lg:dark:hover:text-[#b89569] transition-colors mt-auto"
        >
          {link.text}
          <ArrowRight className="w-3.5 h-3.5 lg:group-hover:translate-x-0.5 transition-transform" />
        </a>
      )}
    </div>
  </div>
));

InfoCard.displayName = "InfoCard";

const ContactDetails = memo(() => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <InfoCard
        icon={MapPin}
        title="Service Headquarters"
        details={["Main Street, Sainthamruthu,", "Eastern Province, Sri Lanka"]}
        link={{ text: "View on Map", url: "#showroom-map" }}
      />
      <InfoCard
        icon={Phone}
        title="Immediate Hotline"
        details={["(+94) 77 123 4567", "(+94) 67 222 4567"]}
        link={{ text: "Call Agent", url: "tel:+94771234567" }}
      />
      <InfoCard
        icon={Mail}
        title="Digital Inquiries"
        details={["support@foreignemporium.lk", "sales@foreignemporium.lk"]}
        link={{ text: "Send Email", url: "mailto:support@foreignemporium.lk" }}
      />
      <InfoCard
        icon={Clock}
        title="Support Windows"
        details={["Mon - Sat: 9AM - 8PM", "Sun: 10AM - 4PM"]}
      />
    </div>
  );
});

ContactDetails.displayName = "ContactDetails";

export default ContactDetails;
