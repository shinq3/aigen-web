import { MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useLocale, linkTo } from "@/lib/i18n-utils";

export function ChatButton() {
  const { locale } = useLocale();

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Link href={linkTo("/chat", locale)}>
        <motion.button
          data-testid="button-chat-open"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover-elevate"
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      </Link>
    </motion.div>
  );
}
