import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertNewsTranslationSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { z } from "zod";
import { Languages, Save, Sparkles, Loader2 } from "lucide-react";
import type { NewsTranslation, InsertNewsTranslation } from "@shared/schema";

const formSchema = insertNewsTranslationSchema.omit({ newsId: true });
type FormData = z.infer<typeof formSchema>;

interface NewsTranslationsEditorProps {
  newsId: string;
}

export default function NewsTranslationsEditor({ newsId }: NewsTranslationsEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeLocale, setActiveLocale] = useState<'ja' | 'en' | 'vi'>('ja');
  const [content, setContent] = useState("");

  const { data: translations = [], isLoading } = useQuery<NewsTranslation[]>({
    queryKey: ["/api/admin/news", newsId, "translations"],
    enabled: !!newsId,
  });

  const currentTranslation = translations.find(t => t.locale === activeLocale);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      locale: activeLocale,
      title: "",
      excerpt: "",
      content: "",
      seoTitle: "",
      seoDescription: "",
      aiSummary: "",
    },
  });

  useEffect(() => {
    if (currentTranslation) {
      form.reset({
        locale: currentTranslation.locale as 'ja' | 'en' | 'vi',
        title: currentTranslation.title,
        excerpt: currentTranslation.excerpt || "",
        content: currentTranslation.content,
        seoTitle: currentTranslation.seoTitle || "",
        seoDescription: currentTranslation.seoDescription || "",
        aiSummary: currentTranslation.aiSummary || "",
      });
      setContent(currentTranslation.content);
    } else {
      form.reset({
        locale: activeLocale,
        title: "",
        excerpt: "",
        content: "",
        seoTitle: "",
        seoDescription: "",
        aiSummary: "",
      });
      setContent("");
    }
  }, [currentTranslation, activeLocale, form]);

  const saveMutation = useMutation({
    mutationFn: (data: InsertNewsTranslation) => {
      if (currentTranslation) {
        return apiRequest(`/api/admin/news/translations/${currentTranslation.id}`, {
          method: "PUT",
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" },
        });
      } else {
        return apiRequest(`/api/admin/news/${newsId}/translations`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" },
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/news", newsId, "translations"] });
      toast({
        title: "Translation saved",
        description: `${getLocaleName(activeLocale)} translation has been saved successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save translation",
        variant: "destructive",
      });
    },
  });

  const aiGenerateMutation = useMutation({
    mutationFn: () => apiRequest(`/api/admin/news/${newsId}/generate-content`, {
      method: "POST",
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/news", newsId, "translations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      toast({
        title: "AI翻訳完了",
        description: "英語・ベトナム語の翻訳が生成されました。",
      });
    },
    onError: (error: any) => {
      toast({
        title: "AI翻訳エラー",
        description: error.message || "翻訳の生成に失敗しました",
        variant: "destructive",
      });
    },
  });

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header", "bold", "italic", "underline", "strike", "blockquote",
    "list", "bullet", "link", "image"
  ];

  const handleSubmit = (data: FormData) => {
    const submitData: InsertNewsTranslation = {
      ...data,
      newsId,
      locale: activeLocale,
      content,
    };
    saveMutation.mutate(submitData);
  };

  const getLocaleName = (locale: string) => {
    switch (locale) {
      case 'ja': return '日本語';
      case 'en': return 'English';
      case 'vi': return 'Tiếng Việt';
      default: return locale;
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading translations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Languages className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold">Translations</h3>
        </div>
        <Button
          variant="outline"
          onClick={() => aiGenerateMutation.mutate()}
          disabled={aiGenerateMutation.isPending}
          data-testid="button-ai-translate-all"
        >
          {aiGenerateMutation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 mr-2 text-orange-600" />
          )}
          {aiGenerateMutation.isPending ? "翻訳中..." : "AIで英語・ベトナム語に翻訳"}
        </Button>
      </div>

      <Tabs value={activeLocale} onValueChange={(v) => setActiveLocale(v as 'ja' | 'en' | 'vi')}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ja" data-testid="tab-locale-ja">
            🇯🇵 日本語
          </TabsTrigger>
          <TabsTrigger value="en" data-testid="tab-locale-en">
            🇬🇧 English
          </TabsTrigger>
          <TabsTrigger value="vi" data-testid="tab-locale-vi">
            🇻🇳 Tiếng Việt
          </TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-6">
            <TabsContent value={activeLocale} className="space-y-6 mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Content Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Content ({getLocaleName(activeLocale)})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder={`Enter title in ${getLocaleName(activeLocale)}`}
                              data-testid={`input-title-${activeLocale}`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="excerpt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Excerpt</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              value={field.value || ""}
                              placeholder="Brief description"
                              rows={3}
                              data-testid={`input-excerpt-${activeLocale}`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <FormLabel>Main Content</FormLabel>
                      <div className="border rounded-md" data-testid={`editor-content-${activeLocale}`}>
                        <ReactQuill
                          theme="snow"
                          value={content}
                          onChange={setContent}
                          modules={modules}
                          formats={formats}
                          placeholder={`Write content in ${getLocaleName(activeLocale)}...`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* SEO Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">SEO Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="seoTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SEO Title</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              value={field.value || ""}
                              placeholder="SEO optimized title"
                              data-testid={`input-seo-title-${activeLocale}`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="seoDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SEO Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              value={field.value || ""}
                              placeholder="Meta description for search engines"
                              rows={3}
                              data-testid={`input-seo-desc-${activeLocale}`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="aiSummary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>AI Summary</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              value={field.value || ""}
                              placeholder="AI-generated summary (optional)"
                              rows={4}
                              data-testid={`input-ai-summary-${activeLocale}`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="submit"
                  disabled={saveMutation.isPending}
                  data-testid={`button-save-translation-${activeLocale}`}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saveMutation.isPending ? "Saving..." : "Save Translation"}
                </Button>
              </div>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}
