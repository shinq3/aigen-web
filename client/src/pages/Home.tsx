import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import NewsSection from "@/components/NewsSection";
import CTASection from "@/components/CTASection";
import { MessageCircle, Heart, Building, GraduationCap, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { linkTo, useLocale } from "@/lib/i18n-utils";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

// TODO: remove mock functionality - replace with real data from API
import lingaLinkImage from "@assets/generated_images/LingaLink_learning_dashboard_mockup_3e4a3eec.png";
import eduMateImage from "@assets/generated_images/EduMate_collaboration_interface_5d5ed6fd.png";
import officeBrainImage from "@assets/generated_images/OfficeBrain_file_system_interface_be3ae664.png";
import enterpriseLLMImage from "@assets/stock_images/enterprise_ai_dashbo_34de58a9.jpg";
import baydSystemImage from "@assets/generated_images/Bayd-System_studio_dashboard_36de2e47.png";
import aigenOneImage from "@assets/stock_images/enterprise_ai_dashbo_34de58a9.jpg";
import manifestoAiCoding from "@assets/stock_images/manifesto_ai_coding.jpg";
import manifestoBusinessAnalysis from "@assets/stock_images/manifesto_business_analysis.jpg";
import manifestoPairProgramming from "@assets/stock_images/manifesto_pair_programming.jpg";
import manifestoDecision from "@assets/stock_images/manifesto_decision.jpg";

export default function Home() {
  const { t } = useTranslation(['home', 'products', 'common']);
  const { locale } = useLocale();
  const [, setLocation] = useLocation();

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('dauchy_visited');
    const isDirectAccess = !document.referrer || !document.referrer.includes(window.location.host);
    
    if (!hasVisited && isDirectAccess) {
      sessionStorage.setItem('dauchy_visited', 'true');
      setLocation(linkTo('/chat', locale));
    } else if (!hasVisited) {
      sessionStorage.setItem('dauchy_visited', 'true');
    }
  }, [locale, setLocation]);

  // TODO: remove mock functionality - replace with API calls
  const featuredProducts = [
    {
      id: "aigen-one",
      name: t('products:aigenone.name'),
      description: t('products:aigenone.description'),
      image: aigenOneImage,
      status: "released" as const,
      tags: t('products:aigenone.tags', { returnObjects: true }) as string[],
      href: linkTo("/products/aigen-one", locale)
    },
    {
      id: "lingalink",
      name: t('products:lingalink.name'),
      description: t('products:lingalink.description'),
      image: lingaLinkImage,
      status: "released" as const,
      tags: t('products:lingalink.tags', { returnObjects: true }) as string[],
      href: linkTo("/products/lingalink", locale)
    },
    {
      id: "edumate",
      name: t('products:edumate.name'),
      description: t('products:edumate.description'),
      image: eduMateImage,
      status: "beta" as const,
      tags: t('products:edumate.tags', { returnObjects: true }) as string[],
      href: linkTo("/products/edumate", locale)
    },
    {
      id: "officebrain",
      name: t('products:officebrain.name'),
      description: t('products:officebrain.description'),
      image: officeBrainImage,
      status: "released" as const,
      tags: t('products:officebrain.tags', { returnObjects: true }) as string[],
      href: linkTo("/products/officebrain", locale)
    },
    {
      id: "enterprise-llm",
      name: t('products:enterprisellm.name'),
      description: t('products:enterprisellm.description'),
      image: enterpriseLLMImage,
      status: "released" as const,
      tags: t('products:enterprisellm.tags', { returnObjects: true }) as string[],
      href: linkTo("/products/enterprise-llm", locale)
    },
    {
      id: "bayd-system",
      name: t('products:baydsystem.name'),
      description: t('products:baydsystem.description'),
      image: baydSystemImage,
      status: "coming_soon" as const,
      tags: t('products:baydsystem.tags', { returnObjects: true }) as string[],
      href: linkTo("/products/bayd-system", locale)
    }
  ];

  const { data: apiNews = [] } = useQuery<any[]>({
    queryKey: ['/api/news', locale],
    queryFn: () => fetch(`/api/news?locale=${locale}&limit=6`).then(r => r.json()),
  });

  const latestNews = apiNews.slice(0, 6).map((item: any) => ({
    id: item.id,
    title: item.title,
    summary: item.summary || item.excerpt || '',
    source: item.sourceAttribution || "D'auchy.Studio",
    publishedAt: item.publishedAt || item.createdAt || new Date().toISOString(),
    thumbnail: item.thumbnail || item.featuredImageUrl || item.thumbnailUrl || undefined,
    isExternal: item.isExternal || false,
    href: item.isExternal
      ? (item.sourceUrl || '#')
      : linkTo(`/news/${item.id}`, locale),
  }));


  const ctaActions = [
    {
      label: t('common:buttons.contact'),
      href: linkTo("/contact", locale),
      variant: "secondary" as const,
      icon: <MessageCircle className="w-4 h-4" />
    }
  ];

  // Development achievements data
  const developmentAchievements = [
    {
      title: t('home:sections.achievements.categories.healthcare.title') || "医療・ヘルスケア",
      icon: <Heart className="w-8 h-8 text-orange-500" />,
      systems: (t('home:sections.achievements.categories.healthcare.systems', { returnObjects: true }) as string[]) || [
        "医療材料管理システム（トレーサビリティ対応）",
        "電子カルテ連携システム",
        "スマホ診療（遠隔医療）システム",
        "会員・文書管理システム（例：県医師会）"
      ]
    },
    {
      title: t('home:sections.achievements.categories.business.title') || "ブランド・顧客サービス",
      icon: <Building className="w-8 h-8 text-orange-500" />,
      systems: (t('home:sections.achievements.categories.business.systems', { returnObjects: true }) as string[]) || [
        "飲料メーカーアミューズメントサイト",
        "自動車メーカー顧客サービスアプリ",
        "買い取り業会員サービスシステム",
        "通信業者会員情報管理システム"
      ]
    },
    {
      title: t('home:sections.achievements.categories.culture.title') || "文化・教育・その他",
      icon: <GraduationCap className="w-8 h-8 text-orange-500" />,
      systems: (t('home:sections.achievements.categories.culture.systems', { returnObjects: true }) as string[]) || [
        "美術館（ビーコン展示案内システム）",
        "美術館ECサイト連携在庫管理システム"
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <main>
      <HeroSection
        title={t('home:hero.title')}
        subtitleLines={t('home:hero.subtitleLines', { returnObjects: true }) as string[]}
        primaryCta={{ 
          label: t('header:navigation.products'), 
          scrollTo: "products-section"
        }}
        secondaryCta={{ 
          label: t('common:buttons.learnMore'), 
          scrollTo: "manifesto-section"
        }}
      />

      <section id="manifesto-section" className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <p className="text-2xl md:text-3xl font-bold text-foreground leading-relaxed">
              {t('home:manifesto.heading')}<br />
              {t('home:manifesto.headingLine2')}
            </p>
            <p className="text-lg md:text-xl text-muted-foreground mt-4">
              {t('home:manifesto.headingSub')}
            </p>
          </motion.div>

          <div className="space-y-24 lg:space-y-32">

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
            >
              <div className="order-2 lg:order-1">
                <div className="inline-block px-3 py-1 rounded-md bg-primary/10 text-primary text-sm font-medium mb-4">
                  {t('home:manifesto.problem.badge')}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 leading-tight">
                  {t('home:manifesto.problem.title')}<br />
                  <span className="text-primary">{t('home:manifesto.problem.titleHighlight')}</span>{t('home:manifesto.problem.titleSuffix')}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('home:manifesto.problem.description')}
                </p>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative rounded-md overflow-hidden aspect-[16/10]">
                  <img src={manifestoAiCoding} alt="AIによるコード生成" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
            >
              <div>
                <div className="relative rounded-md overflow-hidden aspect-[16/10]">
                  <img src={manifestoBusinessAnalysis} alt="業務分析とヒアリング" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              </div>
              <div>
                <div className="inline-block px-3 py-1 rounded-md bg-primary/10 text-primary text-sm font-medium mb-4">
                  {t('home:manifesto.approach.badge')}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 leading-tight">
                  {t('home:manifesto.approach.title')}<br />
                  <span className="text-primary">{t('home:manifesto.approach.titleHighlight')}</span>
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('home:manifesto.approach.description')}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
            >
              <div className="order-2 lg:order-1">
                <div className="inline-block px-3 py-1 rounded-md bg-primary/10 text-primary text-sm font-medium mb-4">
                  {t('home:manifesto.judgment.badge')}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 leading-tight">
                  {t('home:manifesto.judgment.title')}<br />
                  <span className="text-primary">{t('home:manifesto.judgment.titleHighlight')}</span>
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('home:manifesto.judgment.description')}
                </p>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative rounded-md overflow-hidden aspect-[16/10]">
                  <img src={manifestoDecision} alt="経験に基づく判断" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
            >
              <div>
                <div className="relative rounded-md overflow-hidden aspect-[16/10]">
                  <img src={manifestoPairProgramming} alt="AIペアコーディング" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              </div>
              <div>
                <div className="inline-block px-3 py-1 rounded-md bg-primary/10 text-primary text-sm font-medium mb-4">
                  {t('home:manifesto.pairCoding.badge')}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 leading-tight">
                  {t('home:manifesto.pairCoding.title')}<br />
                  <span className="text-primary">{t('home:manifesto.pairCoding.titleHighlight')}</span>
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('home:manifesto.pairCoding.description')}
                </p>
              </div>
            </motion.div>

          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mt-24"
          >
            <Link href={linkTo("/ai-pair-coding", locale)}>
              <Button size="lg" className="px-10 py-6 text-lg font-semibold">
                {t('home:manifesto.ctaButton')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>

        </div>
      </section>
      
      <div id="products-section">
        <ProductGrid
          title={t('home:sections.products.subtitle')}
          products={featuredProducts}
          ctaHref={linkTo("/products", locale)}
        />
      </div>
      
      {/* AI Pair Coding Banner */}
      <section className="py-8 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="container mx-auto px-4">
          <Link href={linkTo("/ai-pair-coding", locale)}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row items-center justify-between gap-6 hover-elevate active-elevate-2 rounded-lg p-6 bg-white/10 backdrop-blur-sm cursor-pointer"
              data-testid="banner-ai-pair-coding"
            >
              <div className="flex items-center gap-4">
                <Badge className="bg-white text-orange-600 font-semibold px-3 py-1">
                  {t('home:sections.aiPairCoding.badge')}
                </Badge>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                    {t('home:sections.aiPairCoding.title')}
                  </h3>
                  <p className="text-white/90">
                    {t('home:sections.aiPairCoding.description')}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="lg"
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white"
                data-testid="button-ai-pair-coding"
              >
                {t('home:sections.aiPairCoding.button')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </Link>
        </div>
      </section>
      
      {/* Development Achievements Section */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6" data-testid="text-achievements-title">
              {t('home:sections.vision.title')}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-orange-600 mx-auto mb-8" />
            <div className="max-w-4xl mx-auto mb-8 text-left">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {t('home:sections.vision.description') || "私たちは幅広い業界において、プロトタイプ作成から本格的なシステム開発まで、包括的なソリューションを提供しています。"}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    {t('home:hero.features.rapid')}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    {t('home:hero.features.development')}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    {t('home:hero.features.expertise')}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Achievements Cards Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-block px-8 py-4 border-2 border-primary/20 rounded-lg bg-gradient-to-r from-primary/5 to-orange-600/5">
              <h3 className="text-2xl font-semibold mb-2" data-testid="text-achievements-list-title">
                実績一覧（抜粋）
              </h3>
              <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-orange-600 mx-auto" />
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {developmentAchievements.map((category, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover-elevate bg-white dark:bg-white border-gray-200 shadow-sm" data-testid={`card-achievement-category-${index}`}>
                  <CardContent className="p-6">
                    <div className="mb-6 text-center">
                      <div className="w-16 h-16 bg-orange-50 dark:bg-orange-950 rounded-full flex items-center justify-center mx-auto mb-4">
                        {category.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-4" data-testid={`text-category-title-${index}`}>
                        {category.title}
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {category.systems.map((system, systemIndex) => (
                        <li 
                          key={systemIndex} 
                          className="text-muted-foreground text-sm leading-relaxed flex items-start gap-2"
                          data-testid={`text-system-${index}-${systemIndex}`}
                        >
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                          {system}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* YouTube Video Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-foreground mb-3">現在のAIの問題点</h2>
            <p className="text-muted-foreground text-lg">時代は繰り返す</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative w-full rounded-md overflow-hidden shadow-lg"
            style={{ paddingTop: '56.25%' }}
          >
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/2wmMBp7Q5m4"
              title="現在のAIの問題点"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </motion.div>
        </div>
      </section>

      <NewsSection
        title={t('home:sections.news.title')}
        items={latestNews}
        ctaHref={linkTo("/news", locale)}
      />
      
      <CTASection
        title={t('home:cta.title')} 
        actions={ctaActions}
      />
    </main>
  );
}