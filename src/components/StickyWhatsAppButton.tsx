import React from "react";
import { MessageCircle } from "lucide-react";
import { motion } from "motion/react";

export default function StickyWhatsAppButton() {
  const whatsappUrl = "https://wa.me/919226638440?text=Hi%20Raasta%20Trips!%20I%20am%20exploring%20your%20website%20and%20have%20a%20question%20about%20upcoming%20trips.";

  return (
    <motion.aside
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      aria-label="Direct Support"
      className="fixed bottom-6 right-6 z-40 flex items-center group"
    >
      {/* Tooltip on hover */}
      <div className="hidden md:flex items-center mr-3 px-3.5 py-1.5 rounded-full bg-[#202522] border border-[#8C9A82]/30 text-xs font-medium text-[#EDE9DF] shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
        <span>Chat with Raasta (+91 9226638440)</span>
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Support with Raasta Trips"
        className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-black flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-400/40"
      >
        <MessageCircle className="w-7 h-7 text-white fill-current" />
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D4A96C] text-[#182622] text-[9px] font-black flex items-center justify-center border-2 border-[#182622]">
          1
        </span>
      </a>
    </motion.aside>
  );
}
