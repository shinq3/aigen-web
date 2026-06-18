import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, XCircle, Clock, ExternalLink, Image as ImageIcon, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { RssImportQueue } from "@shared/schema";

export default function RssImportQueueManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState<RssImportQueue | null>(null);
  const [generateImage, setGenerateImage] = useState(false);

  const { data: queueItems = [], isLoading } = useQuery<RssImportQueue[]>({
    queryKey: ["/api/admin/rss/queue"],
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/admin/rss/queue/${id}/approve`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rss/queue"] });
      setSelectedItem(null);
      toast({
        title: "Article Approved",
        description: "The article has been approved and will be processed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve article",
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/admin/rss/queue/${id}/reject`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rss/queue"] });
      setSelectedItem(null);
      toast({
        title: "Article Rejected",
        description: "The article has been rejected.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reject article",
        variant: "destructive",
      });
    },
  });

  const aiGenerateMutation = useMutation({
    mutationFn: ({ id, generateImage }: { id: string; generateImage: boolean }) =>
      apiRequest(`/api/admin/ai/generate-from-queue/${id}`, {
        method: "POST",
        body: JSON.stringify({
          generateImage,
          targetLanguages: ['ja', 'en', 'vi'],
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rss/queue"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/news"] });
      setSelectedItem(null);
      toast({
        title: "AI Generation Complete! 🎉",
        description: `Successfully generated multilingual news article with ${data.jobIds?.length || 0} AI jobs.`,
      });
    },
    onError: (error) => {
      toast({
        title: "AI Generation Failed",
        description: error.message || "Failed to generate article",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const extractPayloadInfo = (payload: any) => {
    return {
      title: payload?.title || 'Untitled',
      link: payload?.link || '',
      content: payload?.content || '',
      thumbnailUrl: payload?.thumbnailUrl || null,
      feedTitle: payload?.feedTitle || '',
      publishedAt: payload?.publishedAt || null,
    };
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
          <h2 className="text-2xl font-bold text-foreground">RSS Import Queue</h2>
          <p className="text-muted-foreground">Review and approve articles from RSS feeds</p>
        </div>
      </div>

      <div className="grid gap-4">
        {queueItems.map((item: RssImportQueue) => {
          const info = extractPayloadInfo(item.rawPayload);
          return (
            <Card key={item.id} className="hover-elevate">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusBadge(item.processingState || 'pending')}
                      {item.createdAt && (
                        <span className="text-sm text-muted-foreground">
                          Added {formatDistanceToNow(new Date(item.createdAt))} ago
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-lg">{info.title}</CardTitle>
                    <CardDescription className="mt-1">
                      From: {info.feedTitle}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.processingState === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedItem(item)}
                          data-testid={`button-view-${item.id}`}
                        >
                          View
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                          onClick={() => {
                            setSelectedItem(item);
                            setGenerateImage(false);
                          }}
                          disabled={aiGenerateMutation.isPending}
                          data-testid={`button-ai-generate-${item.id}`}
                        >
                          <Sparkles className="w-4 h-4 mr-1" />
                          AI Generate
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => approveMutation.mutate(item.id)}
                          disabled={approveMutation.isPending}
                          data-testid={`button-approve-${item.id}`}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => rejectMutation.mutate(item.id)}
                          disabled={rejectMutation.isPending}
                          data-testid={`button-reject-${item.id}`}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              {info.thumbnailUrl && (
                <CardContent>
                  <img 
                    src={info.thumbnailUrl} 
                    alt={info.title}
                    className="w-full h-48 object-cover rounded-md"
                  />
                </CardContent>
              )}
            </Card>
          );
        })}

        {queueItems.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Clock className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No articles in queue</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                Articles from RSS feeds will appear here for review.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>{extractPayloadInfo(selectedItem.rawPayload).title}</DialogTitle>
              <DialogDescription>
                Review article details before approving
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-4">
                {extractPayloadInfo(selectedItem.rawPayload).thumbnailUrl && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Thumbnail</h4>
                    <img 
                      src={extractPayloadInfo(selectedItem.rawPayload).thumbnailUrl!} 
                      alt="Article thumbnail"
                      className="w-full rounded-md"
                    />
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Source</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {extractPayloadInfo(selectedItem.rawPayload).feedTitle}
                    </span>
                    {extractPayloadInfo(selectedItem.rawPayload).link && (
                      <a 
                        href={extractPayloadInfo(selectedItem.rawPayload).link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View original
                      </a>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Content Preview</h4>
                  <div 
                    className="prose prose-sm max-w-none text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ 
                      __html: extractPayloadInfo(selectedItem.rawPayload).content.slice(0, 1000) + '...' 
                    }}
                  />
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="generate-image" 
                      checked={generateImage}
                      onCheckedChange={(checked) => setGenerateImage(checked === true)}
                      data-testid="checkbox-generate-image"
                    />
                    <Label htmlFor="generate-image" className="text-sm font-normal cursor-pointer">
                      Generate featured image with DALL-E 3 (takes longer)
                    </Label>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 flex-1"
                      onClick={() => aiGenerateMutation.mutate({ id: selectedItem.id, generateImage })}
                      disabled={aiGenerateMutation.isPending}
                      data-testid="button-ai-generate-modal"
                    >
                      {aiGenerateMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          AI Generate (ja/en/vi)
                        </>
                      )}
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => approveMutation.mutate(selectedItem.id)}
                      disabled={approveMutation.isPending}
                      data-testid="button-approve-modal"
                    >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Article
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => rejectMutation.mutate(selectedItem.id)}
                    disabled={rejectMutation.isPending}
                    data-testid="button-reject-modal"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Article
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedItem(null)}
                    data-testid="button-close-modal"
                  >
                    Close
                  </Button>
                </div>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
