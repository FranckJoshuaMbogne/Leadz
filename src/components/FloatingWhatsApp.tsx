import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export function FloatingWhatsApp() {
  return (
    <motion.a
      href="https://wa.me/10000000000"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-pill bg-[#25D366] text-white shadow-glow"
    >
      <MessageCircle size={26} />
    </motion.a>
  );
}
