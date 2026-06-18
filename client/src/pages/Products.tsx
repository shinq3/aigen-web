import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/lib/i18n-utils";
import businessTechImage from '@assets/stock_images/business_technology_ac90df27.jpg';

// TODO: remove mock functionality - replace with real data from API
import lingaLinkImage from "@assets/generated_images/LingaLink_learning_dashboard_mockup_3e4a3eec.png";
import eduMateImage from "@assets/generated_images/EduMate_collaboration_interface_5d5ed6fd.png";
import officeBrainImage from "@assets/generated_images/OfficeBrain_file_system_interface_be3ae664.png";
import enterpriseLLMImage from "@assets/stock_images/enterprise_ai_dashbo_34de58a9.jpg";
import baydSystemImage from "@assets/generated_images/Bayd-System_studio_dashboard_36de2e47.png";
import aigenOneImage from "@assets/stock_images/enterprise_ai_dashbo_34de58a9.jpg";

export default function Products() {
  const { t } = useTranslation('products');
  const { locale } = useLocale();
  
  // TODO: remove mock functionality - replace with API calls
  const allProducts = [
    {
      id: "aigen-one",
      name: t('aigenone.name'),
      description: t('aigenone.description'),
      image: aigenOneImage,
      status: "released" as const,
      href: `/${locale}/products/aigen-one`
    },
    {
      id: "lingalink",
      name: t('lingalink.name'),
      description: t('lingalink.description'),
      image: lingaLinkImage,
      status: "released" as const,
      href: `/${locale}/products/lingalink`
    },
    {
      id: "edumate",
      name: t('edumate.name'),
      description: t('edumate.description'),
      image: eduMateImage,
      status: "beta" as const,
      href: `/${locale}/products/edumate`
    },
    {
      id: "officebrain",
      name: t('officebrain.name'),
      description: t('officebrain.description'),
      image: officeBrainImage,
      status: "released" as const,
      href: `/${locale}/products/officebrain`
    },
    {
      id: "enterprise-llm",
      name: t('enterprisellm.name'),
      description: t('enterprisellm.description'),
      image: enterpriseLLMImage,
      status: "released" as const,
      href: `/${locale}/products/enterprise-llm`
    },
    {
      id: "bayd-system",
      name: t('baydsystem.name'),
      description: t('baydsystem.description'),
      image: baydSystemImage,
      status: "coming_soon" as const,
      href: `/${locale}/products/bayd-system`
    }
  ];

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
    <main className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="py-16 lg:py-24 relative">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={businessTechImage}
            alt="Business technology background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-primary/20"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-white" data-testid="text-page-title">
              {t('title')}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </motion.div>
        </div>
      </section>


      {/* Products Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {allProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard {...product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}