import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, RssIcon, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { z } from "zod";
import type { RssSource } from "@shared/schema";

const rssSourceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  feedUrl: z.string().url("Must be a valid URL"),
  language: z.enum(['ja', 'en', 'vi']),
  category: z.string().min(1, "Category is required"),
  pollingIntervalMinutes: z.string().min(1, "Polling interval is required"),
  isActive: z.boolean().default(true),
});

type RssSourceFormData = z.infer<typeof rssSourceSchema>;

export default function RssSourcesManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<RssSource | null>(null);

  const { data: sources = [], isLoading } = useQuery<RssSource[]>({
    queryKey: ["/api/admin/rss/sources"],
  });

  const form = useForm<RssSourceFormData>({
    resolver: zodResolver(rssSourceSchema),
    defaultValues: {
      name: editingSource?.name || "",
      feedUrl: editingSource?.feedUrl || "",
      language: editingSource?.language as 'ja' | 'en' | 'vi' || 'ja',
      category: editingSource?.category || "technology",
      pollingIntervalMinutes: editingSource?.pollingIntervalMinutes || "60",
      isActive: editingSource?.isActive ?? true,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: RssSourceFormData) =>
      apiRequest("/api/admin/rss/sources", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rss/sources"] });
      setIsCreateOpen(false);
      form.reset();
      toast({
        title: "RSS Source Created",
        description: "The RSS source has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create RSS source",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RssSourceFormData> }) =>
      apiRequest(`/api/admin/rss/sources/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rss/sources"] });
      setEditingSource(null);
      form.reset();
      toast({
        title: "RSS Source Updated",
        description: "The RSS source has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update RSS source",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/admin/rss/sources/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rss/sources"] });
      toast({
        title: "RSS Source Deleted",
        description: "The RSS source has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete RSS source",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: RssSourceFormData) => {
    if (editingSource) {
      updateMutation.mutate({ id: editingSource.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (source: RssSource) => {
    if (window.confirm(`Are you sure you want to delete "${source.name}"?`)) {
      deleteMutation.mutate(source.id);
    }
  };

  const handleEdit = (source: RssSource) => {
    setEditingSource(source);
    form.reset({
      name: source.name,
      feedUrl: source.feedUrl,
      language: source.language as 'ja' | 'en' | 'vi',
      category: source.category,
      pollingIntervalMinutes: source.pollingIntervalMinutes,
      isActive: source.isActive ?? true,
    });
  };

  const toggleActive = (source: RssSource) => {
    updateMutation.mutate({
      id: source.id,
      data: { isActive: !source.isActive },
    });
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">RSS Sources</h2>
          <p className="text-muted-foreground">Manage RSS feed sources for automated news import</p>
        </div>
        <Button onClick={() => { setIsCreateOpen(true); form.reset(); }} data-testid="button-create-rss-source">
          <Plus className="w-4 h-4 mr-2" />
          Add RSS Source
        </Button>
      </div>

      <div className="grid gap-4">
        {sources.map((source: RssSource) => (
          <Card key={source.id} className="hover-elevate">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {source.isActive ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                    <Badge variant="secondary">{source.language.toUpperCase()}</Badge>
                    <Badge variant="outline">{source.category}</Badge>
                  </div>
                  <CardTitle className="text-lg">{source.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {source.feedUrl}
                  </CardDescription>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>Poll every {source.pollingIntervalMinutes} minutes</span>
                    {source.lastPolledAt && (
                      <span>Last polled {formatDistanceToNow(new Date(source.lastPolledAt))} ago</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(source)}
                    data-testid={`button-toggle-${source.id}`}
                  >
                    {source.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(source)}
                    data-testid={`button-edit-${source.id}`}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(source)}
                    data-testid={`button-delete-${source.id}`}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}

        {sources.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <RssIcon className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No RSS sources</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                Add your first RSS source to start automatically importing news articles.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isCreateOpen || !!editingSource} onOpenChange={(open) => {
        if (!open) {
          setIsCreateOpen(false);
          setEditingSource(null);
          form.reset();
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingSource ? "Edit RSS Source" : "Add RSS Source"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Tech News Feed" data-testid="input-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="feedUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feed URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://example.com/feed.xml" data-testid="input-feed-url" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-language">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ja">Japanese</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="vi">Vietnamese</SelectItem>
                        </SelectContent>
                      </Select>
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
                      <FormControl>
                        <Input {...field} placeholder="technology" data-testid="input-category" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="pollingIntervalMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Polling Interval (minutes)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="60" data-testid="input-polling-interval" />
                    </FormControl>
                    <FormDescription>
                      How often to check this feed for new articles
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <FormDescription>
                        Enable automatic polling for this RSS feed
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-is-active"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditingSource(null);
                    form.reset();
                  }}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-save"
                >
                  {(createMutation.isPending || updateMutation.isPending) ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
