import { Button } from "@/components/ui/button";
import NewsCard, { type NewsCardProps } from "./NewsCard";
import { motion } from "framer-motion";
import { ArrowRight, Newspaper } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";

interface NewsSectionProps {
  title: string;
  items: NewsCardProps[];
  ctaHref: string;
}

export default function NewsSection({ title, items, ctaHref }: NewsSectionProps) {
  const { t } = useTranslation(['home', 'common']);
  const [, setLocation] = useLocation();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Newspaper className="w-8 h-8 text-primary" />
            <h2 className="text-3xl lg:text-4xl font-bold" data-testid="text-news-section-title">
              {title}
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('home:sections.news.subtitle')}
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-orange-600 mx-auto mt-4" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {items.map((item, index) => (
            <motion.div key={item.id} variants={itemVariants}>
              <NewsCard {...item} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Button
            variant="outline"
            size="lg"
            className="group"
            data-testid="button-view-all-news"
            onClick={() => setLocation(ctaHref)}
          >
            {t('common:buttons.viewAllNews')}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}