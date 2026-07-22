import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface ProcessStepProps {
  index: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

export function ProcessStep({ index, title, description, icon: Icon }: ProcessStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: "easeOut" }}
      className="relative glass rounded-card p-6 md:p-8"
    >
      <div className="flex items-center justify-between">
        <span className="font-display text-4xl font-bold text-white/10">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-brand">
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <h3 className="mt-6 text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-silver">{description}</p>
    </motion.div>
  );
}
