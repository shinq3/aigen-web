import { useState, useRef, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertNewsSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { z } from "zod";
import type { News, InsertNews } from "@shared/schema";

// Custom Image blot that preserves align, style, width, height, class attributes
const BaseImage = Quill.import('formats/image') as any;
const IMG_ATTRS = ['align', 'style', 'width', 'height', 'class'];
class CustomImage extends BaseImage {
  static formats(domNode: Element) {
    return IMG_ATTRS.reduce((acc: Record<string, string>, attr) => {
      if (domNode.hasAttribute(attr)) acc[attr] = domNode.getAttribute(attr)!;
      return acc;
    }, {});
  }
  format(name: string, value: string) {
    if (IMG_ATTRS.includes(name)) {
      value ? this.domNode.setAttribute(name, value) : this.domNode.removeAttribute(name);
    } else {
      super.format(name, value);
    }
  }
}
CustomImage.blotName = 'image';
CustomImage.tagName = 'IMG';
Quill.register(CustomImage, true);

const formSchema = insertNewsSchema.omit({ authorId: true }).extend({
  publishedAt: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface NewsEditorProps {
  news?: News;
  onSave: (data: InsertNews) => void;
  isLoading?: boolean;
}

export default function NewsEditor({ news, onSave, isLoading }: NewsEditorProps) {
  const [content, setContent] = useState(news?.content || "");
  const [htmlMode, setHtmlMode] = useState(false);
  const [rawHtml, setRawHtml] = useState(news?.content || "");
  // Track whether HTML mode has been edited; if so, always save rawHtml to preserve custom attributes
  const [htmlModeModified, setHtmlModeModified] = useState(false);
  const quillRef = useRef<ReactQuill>(null);
  // Ref to ignore Quill onChange when programmatically setting content (e.g. on mode switch)
  const ignoringQuillChange = useRef(false);

  const switchToHtml = () => {
    setRawHtml(content);
    setHtmlMode(true);
  };

  const switchToVisual = () => {
    ignoringQuillChange.current = true;
    setContent(rawHtml);
    setHtmlMode(false);
    // After React re-renders and Quill fires onChange, we stop ignoring
    setTimeout(() => { ignoringQuillChange.current = false; }, 200);
  };

  const handleQuillChange = useCallback((val: string) => {
    setContent(val);
    if (!ignoringQuillChange.current) {
      // User actually typed in visual mode — visual mode is now the authoritative source
      setHtmlModeModified(false);
      setRawHtml(val);
    }
  }, []);

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const quill = quillRef.current?.getEditor();
        if (!quill) return;
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, "image", base64);
        quill.setSelection(range.index + 1, 0);
      };
      reader.readAsDataURL(file);
    };
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: news?.title || "",
      excerpt: news?.excerpt || "",
      content: news?.content || "",
      category: news?.category || "company",
      status: news?.status || "draft",
      featuredImage: news?.featuredImage || "",
      externalUrl: news?.externalUrl || "",
      sourceUrl: news?.sourceUrl || "",
      sourceAttribution: news?.sourceAttribution || "",
      isExternal: news?.isExternal || false,
      publishedAt: news?.publishedAt ? (() => {
        const d = new Date(news.publishedAt!);
        const pad = (n: number) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      })() : "",
    },
  });

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  }), [imageHandler]);

  const formats = [
    "header", "bold", "italic", "underline", "strike", "blockquote",
    "list", "bullet", "link", "image",
    "align", "style", "width", "height", "class"
  ];

  const handleSubmit = (data: FormData) => {
    // Use rawHtml when: currently in HTML mode, OR HTML was last edited (preserves custom attributes like align/style)
    const finalContent = (htmlMode || htmlModeModified) ? rawHtml : content;
    const submitData: any = {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: finalContent,
      category: data.category,
      tags: data.tags,
      featuredImage: data.featuredImage,
      isExternal: data.isExternal,
      externalUrl: data.externalUrl,
      sourceUrl: data.sourceUrl,
      sourceAttribution: data.sourceAttribution,
      status: data.status,
      publishedAt: data.publishedAt && data.status === "published" 
        ? new Date(data.publishedAt) 
        : data.status === "published" 
          ? new Date() 
          : undefined,
    };

    onSave(submitData);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Basic Information</CardTitle>
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
                          placeholder="Enter news title"
                          data-testid="input-title"
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
                          placeholder="Brief description of the news"
                          rows={3}
                          data-testid="input-excerpt"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="product">Product</SelectItem>
                          <SelectItem value="company">Company</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="featuredImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail URL</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          value={field.value || ""}
                          placeholder="https://example.com/image.jpg"
                          data-testid="input-thumbnail"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sourceUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source URL</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          value={field.value || ""}
                          placeholder="https://external-source.com"
                          data-testid="input-source-url"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sourceAttribution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source Attribution</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          value={field.value || ""}
                          placeholder="Source name or attribution"
                          data-testid="input-source-attribution"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="publishedAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publish Date</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="datetime-local"
                          data-testid="input-publish-date"
                        />
                      </FormControl>
                      <FormDescription>
                        Leave empty to use current time when publishing
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isExternal"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">External Article</FormLabel>
                        <FormDescription>
                          When enabled, clicking this article will open the source URL in a new tab instead of showing internal detail page
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={!!field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-external"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Content Editor */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-medium">Content</CardTitle>
                  {htmlModeModified && !htmlMode && (
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                      ※ HTMLで編集済み（保存時はHTMLを使用）
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 p-1 bg-muted rounded-md">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className={!htmlMode ? "bg-background shadow-sm" : ""}
                    onClick={switchToVisual}
                  >
                    ビジュアル
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className={htmlMode ? "bg-background shadow-sm" : ""}
                    onClick={switchToHtml}
                  >
                    HTML
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {htmlMode ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">HTMLを直接貼り付けできます。ビジュアルに戻すと反映されます。</p>
                  <Textarea
                    value={rawHtml}
                    onChange={(e) => { setRawHtml(e.target.value); setHtmlModeModified(true); }}
                    rows={16}
                    className="font-mono text-sm"
                    placeholder="<p>HTMLをここに貼り付けてください</p>"
                    data-testid="editor-html-source"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="min-h-[300px] border rounded-md">
                    <ReactQuill
                      ref={quillRef}
                      theme="snow"
                      value={content}
                      onChange={handleQuillChange}
                      modules={modules}
                      formats={formats}
                      style={{ height: "280px" }}
                      data-testid="editor-content"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              data-testid="button-save"
            >
              {isLoading ? "Saving..." : news ? "Update News" : "Create News"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}