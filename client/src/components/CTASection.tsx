import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Mail, MessageCircle } from "lucide-react";

interface CTASectionProps {
  title: string;
  actions: Array<{
    label: string;
    href: string;
    variant?: "default" | "outline" | "secondary";
    icon?: React.ReactNode;
  }>;
}

export default function CTASection({ title, actions }: CTASectionProps) {
  const backgroundVariants = {
    animate: {
      background: [
        "linear-gradient(45deg, hsl(var(--primary)) 0%, hsl(var(--primary)) 50%, rgb(234, 88, 12) 100%)",
        "linear-gradient(45deg, rgb(234, 88, 12) 0%, hsl(var(--primary)) 50%, hsl(var(--primary)) 100%)",
        "linear-gradient(45deg, hsl(var(--primary)) 0%, rgb(234, 88, 12) 50%, hsl(var(--primary)) 100%)",
      ],
    },
  };

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        variants={backgroundVariants}
        animate="animate"
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-black/10" />

      {/* Floating Elements */}
      <div className="absolute inset-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-white" data-testid="text-cta-title">
            {title}
          </h2>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "default"}
                size="lg"
                className={`px-8 py-6 text-lg font-semibold group ${
                  action.variant === "outline"
                    ? "bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
                    : action.variant === "secondary"
                    ? "bg-white text-primary hover:bg-white/90"
                    : ""
                }`}
                data-testid={`button-cta-${index}`}
                onClick={() => console.log(`Navigate to ${action.href}`)}
              >
                <span className="flex items-center gap-2">
                  {action.icon}
                  {action.label}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-white/80 mt-6 text-lg"
          >
            今すぐ始めて、AIの可能性を体験してください
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}