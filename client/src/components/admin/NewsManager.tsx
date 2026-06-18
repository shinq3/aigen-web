import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import NewsEditor from "./NewsEditor";
import NewsUpdatesModal from "./NewsUpdatesModal";
import NewsTranslationsEditor from "./NewsTranslationsEditor";
import { Plus, Edit, Trash2, MessageCircle, Eye, Newspaper, Languages, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { News, InsertNews } from "@shared/schema";

export default function NewsManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation('admin');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [selectedNewsForUpdates, setSelectedNewsForUpdates] = useState<News | null>(null);
  const [translatingNews, setTranslatingNews] = useState<News | null>(null);

  // Fetch all news
  const { data: allNews = [], isLoading } = useQuery<News[]>({
    queryKey: ["/api/admin/news"],
  });

  // Create news mutation
  const createMutation = useMutation({
    mutationFn: (data: InsertNews) => apiRequest("/api/admin/news", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/news"] });
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      setIsCreateOpen(false);
      toast({
        title: t('news.messages.created'),
        description: t('news.messages.created'),
      });
    },
    onError: (error) => {
      toast({
        title: t('common.error'),
        description: error.message || t('news.messages.createError'),
        variant: "destructive",
      });
    },
  });

  // Update news mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertNews> }) =>
      apiRequest(`/api/admin/news/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/news"] });
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      setEditingNews(null);
      toast({
        title: t('news.messages.updated'),
        description: t('news.messages.updated'),
      });
    },
    onError: (error) => {
      toast({
        title: t('common.error'),
        description: error.message || t('news.messages.updateError'),
        variant: "destructive",
      });
    },
  });

  // Delete news mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/admin/news/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/news"] });
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      toast({
        title: t('news.messages.deleted'),
        description: t('news.messages.deleted'),
      });
    },
    onError: (error) => {
      toast({
        title: t('common.error'),
        description: error.message || t('news.messages.deleteError'),
        variant: "destructive",
      });
    },
  });

  // AI Generate Content mutation
  const aiGenerateMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/admin/news/${id}/generate-content`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/news"] });
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      toast({
        title: "AI Content Generated",
        description: "News content and translations have been generated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: t('common.error'),
        description: error.message || "Failed to generate content",
        variant: "destructive",
      });
    },
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "published":
        return "default";
      case "draft":
        return "secondary";
      case "archived":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case "product":
        return "default";
      case "company":
        return "secondary";
      case "technology":
        return "outline";
      default:
        return "secondary";
    }
  };

  const handleDelete = (news: News) => {
    if (window.confirm(t('news.confirmDelete.message', { title: news.title }))) {
      deleteMutation.mutate(news.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t('news.title')}</h2>
          <p className="text-muted-foreground">{t('news.description')}</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-news">
              <Plus className="w-4 h-4 mr-2" />
{t('news.createNews')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('news.createNews')}</DialogTitle>
            </DialogHeader>
            <NewsEditor
              onSave={(data) => createMutation.mutate(data)}
              isLoading={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* News List */}
      <div className="grid gap-4">
        {allNews.map((news: News) => (
          <Card key={news.id} className="hover-elevate">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={getStatusBadgeVariant(news.status)}>
                      {t(`news.status.${news.status}` as any)}
                    </Badge>
                    <Badge variant={getCategoryBadgeVariant(news.category)}>
                      {t(`news.categories.${news.category}` as any)}
                    </Badge>
                    {news.isExternal && (
                      <Badge variant="outline">{t('news.form.isExternal')}</Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{news.title}</CardTitle>
                  <CardDescription>
                    Created {news.createdAt ? formatDistanceToNow(new Date(news.createdAt)) : 'Unknown'} ago
                    {news.publishedAt && (
                      <> • Published {formatDistanceToNow(new Date(news.publishedAt))} ago</>
                    )}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => aiGenerateMutation.mutate(news.id)}
                    disabled={aiGenerateMutation.isPending}
                    data-testid={`button-ai-generate-${news.id}`}
                    title="AI Generate Content"
                  >
                    <Sparkles className="w-4 h-4 text-orange-600" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTranslatingNews(news)}
                    data-testid={`button-translations-${news.id}`}
                  >
                    <Languages className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedNewsForUpdates(news)}
                    data-testid={`button-updates-${news.id}`}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingNews(news)}
                    data-testid={`button-edit-${news.id}`}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(news)}
                    data-testid={`button-delete-${news.id}`}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {news.excerpt && (
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {news.excerpt}
                </p>
              </CardContent>
            )}
          </Card>
        ))}

        {allNews.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Newspaper className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No news articles</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                Get started by creating your first news article to share updates with your audience.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Dialog */}
      {editingNews && (
        <Dialog open={!!editingNews} onOpenChange={() => setEditingNews(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit News Article</DialogTitle>
            </DialogHeader>
            <NewsEditor
              news={editingNews}
              onSave={(data) => updateMutation.mutate({ id: editingNews.id, data })}
              isLoading={updateMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* News Updates Modal */}
      {selectedNewsForUpdates && (
        <NewsUpdatesModal
          news={selectedNewsForUpdates}
          open={!!selectedNewsForUpdates}
          onOpenChange={() => setSelectedNewsForUpdates(null)}
        />
      )}

      {/* Translations Dialog */}
      {translatingNews && (
        <Dialog open={!!translatingNews} onOpenChange={() => setTranslatingNews(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Translations: {translatingNews.title}</DialogTitle>
            </DialogHeader>
            <NewsTranslationsEditor newsId={translatingNews.id} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}