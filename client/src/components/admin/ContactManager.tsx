import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Mail, Globe, Calendar, User } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import type { Contact } from "@shared/schema";

export default function ContactManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Fetch all contacts
  const { data: contacts = [], isLoading } = useQuery<Contact[]>({
    queryKey: ["/api/admin/contacts"],
  });

  // Update contact status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest(`/api/admin/contacts/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] });
      toast({
        title: "Status Updated",
        description: "Contact status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    },
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "new":
        return "default";
      case "in-progress":
        return "secondary";
      case "resolved":
        return "outline";
      case "closed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "new":
        return "New";
      case "in-progress":
        return "In Progress";
      case "resolved":
        return "Resolved";
      case "closed":
        return "Closed";
      default:
        return status;
    }
  };

  const handleStatusChange = (contact: Contact, newStatus: string) => {
    updateStatusMutation.mutate({ id: contact.id, status: newStatus });
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
      <div>
        <h2 className="text-2xl font-bold text-foreground">Contact Management</h2>
        <p className="text-muted-foreground">
          Manage and respond to customer inquiries ({contacts.length} total)
        </p>
      </div>

      {/* Contacts List */}
      <div className="grid gap-4">
        {contacts.map((contact: Contact) => (
          <Card key={contact.id} className="hover-elevate">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={getStatusBadgeVariant(contact.status)}>
                      {getStatusLabel(contact.status)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {contact.createdAt ? formatDistanceToNow(new Date(contact.createdAt)) : "Unknown"} ago
                    </span>
                  </div>
                  <CardTitle className="text-lg">{contact.name}</CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <a 
                        href={`mailto:${contact.email}`} 
                        className="text-primary hover:underline"
                        data-testid={`link-email-${contact.id}`}
                      >
                        {contact.email}
                      </a>
                    </span>
                    {contact.company && (
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {contact.company}
                      </span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={contact.status}
                    onValueChange={(value) => handleStatusChange(contact, value)}
                  >
                    <SelectTrigger className="w-40" data-testid={`select-status-${contact.id}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedContact(contact)}
                        data-testid={`button-view-${contact.id}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Contact Details</DialogTitle>
                      </DialogHeader>
                      <ContactDetails contact={contact} />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {contact.message}
              </p>
            </CardContent>
          </Card>
        ))}

        {contacts.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Mail className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No contacts yet</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                When people submit the contact form, their inquiries will appear here for you to manage.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function ContactDetails({ contact }: { contact: Contact }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Name
              </label>
              <p className="text-sm font-medium">{contact.name}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Email
              </label>
              <a 
                href={`mailto:${contact.email}`} 
                className="text-sm text-primary hover:underline block"
                data-testid="link-contact-email"
              >
                {contact.email}
              </a>
            </div>
            {contact.company && (
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Company
                </label>
                <p className="text-sm">{contact.company}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </label>
              <div className="mt-1">
                <Badge variant={getStatusBadgeVariant(contact.status)}>
                  {getStatusLabel(contact.status)}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Submitted
              </label>
              <p className="text-sm">
                {contact.createdAt ? format(new Date(contact.createdAt), "PPp") : "Unknown"}
              </p>
              <p className="text-xs text-muted-foreground">
                {contact.createdAt ? formatDistanceToNow(new Date(contact.createdAt)) : "Unknown"} ago
              </p>
            </div>
            {contact.updatedAt && contact.updatedAt !== contact.createdAt && (
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Last Updated
                </label>
                <p className="text-sm">
                  {format(new Date(contact.updatedAt), "PPp")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(contact.updatedAt))} ago
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Message</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-40">
            <p className="text-sm whitespace-pre-wrap">{contact.message}</p>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "new":
      return "default" as const;
    case "in-progress":
      return "secondary" as const;
    case "resolved":
      return "outline" as const;
    case "closed":
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "new":
      return "New";
    case "in-progress":
      return "In Progress";
    case "resolved":
      return "Resolved";
    case "closed":
      return "Closed";
    default:
      return status;
  }
}