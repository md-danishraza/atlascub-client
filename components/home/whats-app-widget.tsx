"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa"; // Standard WhatsApp icon

export function WhatsappWidget() {
  const pathname = usePathname();

  // ONLY render on the homepage ("/")
  const isHomepage = pathname === "/";

  // WhatsApp Configuration
  const phoneNumber = "8287627289"; 
  const initialMessage = "Hi Atlascub! I'm interested in exploring your premium collections and need some assistance.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(initialMessage)}`;

  return (
    <AnimatePresence>
      {isHomepage && (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 200, delay: 1 }} // Delays entry slightly so it doesn't clash with page load
          className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-50 flex items-center group"
        >
          {/* Tooltip that slides out on hover */}
          <motion.div className="absolute left-full ml-4 hidden md:flex items-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
            <div className="bg-foreground text-background text-xs font-body font-medium py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap">
              Chat with an expert
            </div>
            {/* Tooltip triangle */}
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-foreground" />
          </motion.div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center justify-center"
            aria-label="Chat with us on WhatsApp"
          >
            {/* Continuous Pulse Ring */}
            <motion.div
              animate={{
                scale: [1, 1.4, 1.4],
                opacity: [0.6, 0, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeOut",
              }}
              className="absolute inset-0 rounded-full bg-[#25D366]"
            />

            {/* Main Button */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40 transition-shadow hover:shadow-xl hover:shadow-[#25D366]/50"
            >
              <FaWhatsapp className="h-7 w-7" />
            </motion.div>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}