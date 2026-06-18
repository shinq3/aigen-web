import { motion } from "framer-motion";
import { Link } from "wouter";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ExternalLink,
  Clock,
  ArrowRight,
  Loader2
} from "lucide-react";
import newsroomImage from '@assets/stock_images/business_technology_ac90df27.jpg';

type NewsArticle = {
  id: string;
  title: string;
  summary: string;
  content: string;
  thumbnail: string;
  publishedAt: string;
  category: string;
  tags: string[];
  source: string;
  sourceUrl: string;
  isExternal: boolean;
  status: string;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

export default function News() {
  const { t, i18n } = useTranslation('news');
  
  // Category filter state - use a constant to represent "all"
  const ALL_CATEGORIES = 'ALL_CATEGORIES';
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORIES);
  
  // Fetch news from API with current locale
  const { data: allNews = [], isLoading, error } = useQuery<NewsArticle[]>({
    queryKey: ['/api/news', i18n.language],
    queryFn: async () => {
      const locale = i18n.language === 'en' ? 'en' : i18n.language === 'vi' ? 'vi' : 'ja';
      const response = await fetch(`/api/news?locale=${locale}`);
      if (!response.ok) throw new Error('Failed to fetch news');
      return response.json();
    }
  });
  
  useEffect(() => {
    document.title = t('meta.title') || "AI・テクノロジーニュース | D'auchy.Studio";
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('meta.description') || 'AI・テクノロジー業界の最新ニュースとトレンドをお届け。生成AI、企業DX、教育技術など幅広い分野の情報を発信しています。');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = t('meta.description') || 'AI・テクノロジー業界の最新ニュースとトレンドをお届け。生成AI、企業DX、教育技術など幅広い分野の情報を発信しています。';
      document.head.appendChild(meta);
    }
  }, [t]);

  // Get unique categories from news data
  const uniqueCategories = Array.from(new Set(allNews.map(article => article.category)));
  
  // Filter articles based on selected category
  const filteredNews = selectedCategory === ALL_CATEGORIES
    ? allNews 
    : allNews.filter(article => article.category === selectedCategory);

  // Handle category selection
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 relative">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={newsroomImage}
            alt="Modern newsroom background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-primary/20"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4 bg-orange-100 text-orange-800 border-orange-200" data-testid="badge-news">
              {t('hero.badge') || "最新ニュース"}
            </Badge>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-white" data-testid="text-title">
              {t('hero.title') || "AI・テクノロジーニュース"}
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              {(t('hero.subtitle') || "生成AI、企業DX、教育技術など\n最新のテクノロジートレンドをお届け").split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index === 0 && <br />}
                </span>
              ))}
            </p>
            <p className="text-lg mb-8 text-white/80 max-w-4xl mx-auto">
              {t('hero.description') || "業界の動向から実践的な活用事例まで、技術革新の最前線をわかりやすく解説します。"}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap gap-2 justify-center"
          >
            <Button
              onClick={() => handleCategoryClick(ALL_CATEGORIES)}
              variant={selectedCategory === ALL_CATEGORIES ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              data-testid="button-category-all"
            >
              {t('categories.all') || "すべて"}
            </Button>
            {uniqueCategories.map((category) => (
              <Button
                key={category}
                onClick={() => handleCategoryClick(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                data-testid={`button-category-${category}`}
              >
                {category}
              </Button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* News Timeline */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">{t('error.fetch_failed') || 'ニュースの取得に失敗しました'}</p>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">{t('no_news') || 'ニュースがありません'}</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-4"
            >
              {filteredNews.map((article) => (
                <motion.div key={article.id} variants={itemVariants}>
                  <Card className="hover-elevate group overflow-hidden">
                    {/* Header - Source and Date */}
                    <div className="flex items-center gap-3 p-4 pb-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-sm">
                          {article.source?.charAt(0) || 'D'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm truncate">{article.source || "D'auchy.Studio"}</span>
                          {article.isExternal && (
                            <Badge variant="outline" className="text-xs border-orange-200 text-orange-700 flex-shrink-0">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              {t('article.external_badge') || "外部"}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(article.publishedAt)}</span>
                          <span>·</span>
                          <Badge variant="secondary" className="text-xs py-0">
                            {article.category}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="px-4 pb-3">
                      <h3 className="text-base font-bold leading-snug group-hover:text-primary transition-colors mb-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {article.summary}
                      </p>
                    </div>

                    {/* Image */}
                    {article.thumbnail && (
                      <div className="px-4 pb-3">
                        <div className="relative overflow-hidden rounded-lg">
                          <img
                            src={article.thumbnail}
                            alt={article.title}
                            className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                      <div className="px-4 pb-3">
                        <div className="flex flex-wrap gap-1">
                          {article.tags.slice(0, 4).map((tag, idx) => (
                            <Badge 
                              key={`${article.id}-tag-${idx}`} 
                              variant="outline" 
                              className="text-xs border-muted-foreground/30"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="px-4 py-3 border-t flex items-center justify-between">
                      <Button 
                        asChild 
                        variant="ghost" 
                        size="sm" 
                        className="text-primary hover:text-primary hover:bg-primary/10"
                        data-testid={`button-read-${article.id}`}
                      >
                        {article.isExternal && article.sourceUrl ? (
                          <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            {t('article.read_article') || "記事を読む"}
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        ) : (
                          <Link href={`/news/${article.id}`} className="flex items-center gap-2">
                            {t('article.read_article') || "記事を読む"}
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        )}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

    </main>
  );
}