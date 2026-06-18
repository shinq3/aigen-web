import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ExternalLink, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";

export interface NewsCardProps {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  thumbnail?: string;
  isExternal: boolean;
  href: string;
}

export default function NewsCard({
  title,
  summary,
  source,
  publishedAt,
  thumbnail,
  isExternal,
  href,
}: NewsCardProps) {
  const { t } = useTranslation('common');
  const [, setLocation] = useLocation();

  const handleNavigate = () => {
    if (isExternal) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      setLocation(href);
    }
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden hover-elevate border-border hover:border-primary/20 transition-colors duration-300 cursor-pointer" onClick={handleNavigate}>
        {thumbnail && (
          <CardHeader className="p-0">
            <div className="relative aspect-video overflow-hidden">
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              {isExternal && (
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-white/10 backdrop-blur-sm text-white">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    {t('labels.externalLink')}
                  </Badge>
                </div>
              )}
            </div>
          </CardHeader>
        )}

        <CardContent className="flex-1 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="text-xs" data-testid={`badge-source`}>
              {source}
            </Badge>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="w-3 h-3 mr-1" />
              <span data-testid={`text-published-date`}>{formatDate(publishedAt)}</span>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-3 line-clamp-2 leading-tight hover:text-primary transition-colors cursor-pointer" data-testid={`text-news-title`}>
            {title}
          </h3>

          <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed" data-testid={`text-news-summary`}>
            {summary}
          </p>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <button
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group"
            onClick={(e) => { e.stopPropagation(); handleNavigate(); }}
            data-testid={`button-read-more`}
          >
            {t('buttons.readMore')}
            {isExternal ? (
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            ) : (
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            )}
          </button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}