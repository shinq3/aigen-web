import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Plus, Edit, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import type { News, NewsUpdate, InsertNewsUpdate } from "@shared/schema";

interface NewsUpdatesModalProps {
  news: News;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NewsUpdatesModal({ news, open, onOpenChange }: NewsUpdatesModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<NewsUpdate | null>(null);
  const [newUpdateContent, setNewUpdateContent] = useState("");

  // Fetch news updates
  const { data: updates = [], isLoading } = useQuery({
    queryKey: ["/api/admin/news", news.id, "updates"],
    enabled: open,
  });

  // Create update mutation
  const createMutation = useMutation({
    mutationFn: (content: string) =>
      apiRequest(`/api/admin/news/${news.id}/updates`, {
        method: "POST",
        body: JSON.stringify({ content }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/news", news.id, "updates"] });
      setIsCreating(false);
      setNewUpdateContent("");
      toast({
        title: "Update Added",
        description: "News update has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add update",
        variant: "destructive",
      });
    },
  });

  // Delete update mutation
  const deleteMutation = useMutation({
    mutationFn: (updateId: string) =>
      apiRequest(`/api/admin/news/updates/${updateId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/news", news.id, "updates"] });
      toast({
        title: "Update Deleted",
        description: "News update has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete update",
        variant: "destructive",
      });
    },
  });

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header", "bold", "italic", "underline", 
    "list", "bullet", "link"
  ];

  const handleCreateUpdate = () => {
    if (!newUpdateContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter update content",
        variant: "destructive",
      });
      return;
    }
    createMutation.mutate(newUpdateContent);
  };

  const handleDeleteUpdate = (update: NewsUpdate) => {
    if (window.confirm("Are you sure you want to delete this update?")) {
      deleteMutation.mutate(update.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>News Updates - {news.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Create New Update */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Add Update</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreating(!isCreating)}
                  data-testid="button-toggle-create"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {isCreating ? "Cancel" : "Add Update"}
                </Button>
              </div>
            </CardHeader>
            {isCreating && (
              <CardContent>
                <div className="space-y-4">
                  <div className="min-h-[200px] border rounded-md">
                    <ReactQuill
                      theme="snow"
                      value={newUpdateContent}
                      onChange={setNewUpdateContent}
                      modules={modules}
                      formats={formats}
                      style={{ height: "160px" }}
                      placeholder="Enter update content..."
                      data-testid="editor-new-update"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreating(false)}
                      data-testid="button-cancel-update"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateUpdate}
                      disabled={createMutation.isPending}
                      data-testid="button-save-update"
                    >
                      {createMutation.isPending ? "Saving..." : "Add Update"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Updates List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Updates ({updates.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[400px]">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
                  </div>
                ) : updates.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No updates yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add the first update to track changes to this news article
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {updates.map((update: NewsUpdate, index: number) => (
                      <div key={update.id}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">
                                Update #{updates.length - index}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(update.createdAt))} ago
                              </span>
                            </div>
                            <div 
                              className="prose prose-sm max-w-none dark:prose-invert"
                              dangerouslySetInnerHTML={{ __html: update.content }}
                              data-testid={`update-content-${update.id}`}
                            />
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteUpdate(update)}
                              data-testid={`button-delete-update-${update.id}`}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        {index < updates.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}