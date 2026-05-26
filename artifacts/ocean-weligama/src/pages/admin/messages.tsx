import {
  useAdminListMessages,
  useAdminUpdateMessage,
  useAdminDeleteMessage,
  getAdminListMessagesQueryKey,
  useAdminMarkNotificationsRead,
  getAdminGetNotificationCountsQueryKey,
} from "@workspace/api-client-react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  MailOpen,
  Phone,
  Check,
  Search,
  Filter,
  Clock,
  ExternalLink,
  Trash2,
  ChevronRight,
  RefreshCcw
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminMessages() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"all" | "unread" | "replied">("unread");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

  const markReadNotifications = useAdminMarkNotificationsRead();



  const { data: messages, isLoading } = useAdminListMessages({ limit: 100 }, {
    query: { queryKey: getAdminListMessagesQueryKey({ limit: 100 }) },
  });

  const updateMessage = useAdminUpdateMessage();
  const deleteMessage = useAdminDeleteMessage();

  const getMsgCount = (f: string) => {
    const allMsgs = messages as any[] || [];
    if (f === "all") return allMsgs.length;
    if (f === "unread") return allMsgs.filter(m => !m.isRead).length;
    if (f === "replied") return allMsgs.filter(m => m.isReplied).length;
    return 0;
  };

  const messageList = (messages as any[])?.filter(msg => {
    // Apply status filter
    const statusMatch = filter === "unread" ? !msg.isRead : filter === "replied" ? msg.isReplied : true;
    
    // Apply search filter
    const nameMatch = msg.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return statusMatch && nameMatch;
  }) ?? [];

  function markRead(id: string, isRead: boolean) {
    updateMessage.mutate(
      { id, data: { isRead } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getAdminListMessagesQueryKey({ limit: 100 }) });
          queryClient.invalidateQueries({ queryKey: getAdminGetNotificationCountsQueryKey() });
        },
        onError: () => toast({ variant: "destructive", title: "Update failed" }),
      }
    );
  }

  function markReplied(id: string) {
    updateMessage.mutate(
      { id, data: { isReplied: true, isRead: true } },
      {
        onSuccess: () => {
          toast({ title: "Marked as replied" });
          queryClient.invalidateQueries({ queryKey: getAdminListMessagesQueryKey({ limit: 100 }) });
          queryClient.invalidateQueries({ queryKey: getAdminGetNotificationCountsQueryKey() });
        },
        onError: () => toast({ variant: "destructive", title: "Update failed" }),
      }
    );
  }

  function confirmDelete() {
    if (!deleteId) return;
    deleteMessage.mutate(
      { id: deleteId },
      {
        onSuccess: () => {
          toast({ title: "Message deleted permanently" });
          setDeleteId(null);
          queryClient.invalidateQueries({ queryKey: getAdminListMessagesQueryKey({ limit: 100 }) });
          queryClient.invalidateQueries({ queryKey: getAdminGetNotificationCountsQueryKey() });
        },
        onError: (err: any) => {
          console.error("Delete message error:", err);
          const status = err?.status || "Unknown Status";
          toast({
            variant: "destructive",
            title: `Deletion failed (${status})`,
            description: "Please check backend logs."
          });
        },
      }
    );
  }


  return (
    <AdminLayout>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Messages</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage and respond to guest inquiries.</p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
            <div className="relative group w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 pr-4 py-6 rounded-2xl border-border/50 bg-muted/20 focus:bg-background focus:ring-primary/20 transition-all text-sm font-medium"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-2xl border border-border/50 relative">
                {(["all", "unread", "replied"] as const).map((f) => (
                  <Button
                    key={f}
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilter(f)}
                    className={`rounded-xl px-6 capitalize text-xs font-bold transition-all relative z-10 flex items-center gap-2 group ${
                      filter === f ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {filter === f && (
                      <motion.div
                        layoutId="active-filter-bg-messages"
                        className="absolute inset-0 bg-background rounded-xl shadow-sm border border-border/50"
                        style={{ zIndex: -1 }}
                      />
                    )}
                    <span>{f}</span>
                    <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] transition-colors ${filter === f ? "bg-primary/10 text-primary" : "bg-muted-foreground/10 text-muted-foreground group-hover:bg-muted-foreground/20"}`}>
                      {getMsgCount(f)}
                    </span>
                  </Button>
                ))}
              </div>

              <Button
                size="icon"
                variant="outline"
                onClick={() => {
                  queryClient.invalidateQueries({ queryKey: getAdminListMessagesQueryKey({ limit: 100 }) });
                  toast({ title: "Checking for new messages..." });
                }}
                className="rounded-xl border-border/50 text-muted-foreground hover:text-primary transition-all active:scale-95"
              >
                <RefreshCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 rounded-2xl" />
            ))}
          </div>
        ) : messageList.length > 0 ? (
          <div className="bg-card rounded-[2rem] border border-border/60 overflow-hidden shadow-sm">
            <div className="divide-y divide-border/40">
              <AnimatePresence mode="popLayout">
                {messageList.map((msg: any, idx: number) => (
                  <motion.div
                    key={msg.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => {
                      setSelectedMessage(msg);
                      if (!msg.isRead) {
                        markRead(msg.id, true);
                      }
                    }}
                    className={`
                      relative group flex items-center justify-between p-5 cursor-pointer transition-all duration-300
                      hover:bg-primary/[0.03] active:bg-primary/[0.05]
                      ${!msg.isRead ? "bg-primary/[0.01]" : ""}
                    `}
                  >
                    {/* Hover gradient border line left */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className={`
                        w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                        ${!msg.isRead ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground"}
                      `}>
                        {!msg.isRead ? <Mail className="w-5 h-5" /> : <MailOpen className="w-5 h-5" />}
                      </div>
                      
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold truncate ${!msg.isRead ? "text-foreground" : "text-muted-foreground font-medium"}`}>
                            {msg.fullName}
                          </span>
                          {!msg.isRead && (
                            <Badge className="bg-primary text-[9px] h-4 px-1.5 font-black uppercase tracking-tighter">New</Badge>
                          )}
                          {msg.isReplied && (
                            <Badge className="bg-green-100 text-green-700 text-[9px] h-4 px-1.5 font-black uppercase tracking-tighter">Replied</Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground truncate opacity-70">
                          {msg.subject || "No Subject"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest hidden sm:block">
                        {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteId(msg.id);
                          }}
                          className="w-8 h-8 rounded-lg text-muted-foreground/40 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-[3rem] border border-dashed border-border/60 flex flex-col items-center justify-center py-32 text-center"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="w-20 h-20 rounded-3xl bg-muted/30 flex items-center justify-center mb-6"
            >
              <Mail className="w-10 h-10 text-muted-foreground/30" />
            </motion.div>
            <h3 className="text-xl font-bold text-foreground mb-2 italic">Quiet waters...</h3>
            <p className="text-muted-foreground text-sm max-w-xs">No messages match your current filter. Check back later!</p>
            <Button
              variant="link"
              onClick={() => setFilter("all")}
              className="mt-4 text-primary font-bold uppercase tracking-widest text-[10px]"
            >
              Show all messages
            </Button>
          </motion.div>
        )}
      </div>

        {/* Message Detail Dialog */}
        <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
          <DialogContent className="sm:max-w-2xl rounded-[2.5rem] border-primary/20 p-0 overflow-hidden shadow-2xl bg-white/95 backdrop-blur-xl">
            {selectedMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ staggerChildren: 0.1 }}
                className="flex flex-col"
              >
                <div className="bg-gradient-to-r from-primary/10 to-transparent p-8 border-b border-primary/10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
                        <Mail className="w-7 h-7" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-foreground tracking-tight leading-none mb-2">
                          {selectedMessage.fullName}
                        </h2>
                        <div className="flex flex-wrap gap-3">
                          <a href={`mailto:${selectedMessage.email}`} className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5">
                            <Mail className="w-3 h-3" /> {selectedMessage.email}
                          </a>
                          {selectedMessage.phone && (
                            <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                              <Phone className="w-3 h-3" /> {selectedMessage.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-white/50 px-3 py-1.5 rounded-full border border-border/50">
                      {new Date(selectedMessage.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  {selectedMessage.subject && (
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1 block">Subject</span>
                      <h3 className="text-lg font-bold text-foreground leading-tight">
                        {selectedMessage.subject}
                      </h3>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">Message Body</span>
                    <div className="bg-muted/30 rounded-3xl p-6 border border-border/50">
                      <p className="text-foreground/80 text-sm leading-relaxed whitespace-pre-wrap">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-8 pt-4 border-t border-border/50 bg-muted/10">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          markRead(selectedMessage.id, !selectedMessage.isRead);
                          setSelectedMessage((prev: any) => ({ ...prev, isRead: !prev.isRead }));
                        }}
                        className="rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 px-4 border-primary/20 text-primary hover:bg-primary/5"
                      >
                        {selectedMessage.isRead ? <Mail className="w-3.5 h-3.5" /> : <MailOpen className="w-3.5 h-3.5" />}
                        {selectedMessage.isRead ? "Mark Unread" : "Mark Read"}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteId(selectedMessage.id)}
                        className="rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 px-4 border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </Button>
                    </div>

                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${selectedMessage.email}&su=${encodeURIComponent(`Re: ${selectedMessage.subject ?? "Inquiry"} | Ocean Weligama`)}&body=${encodeURIComponent(`Hi ${selectedMessage.fullName.split(' ')[0]},\n\n`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        if (!selectedMessage.isRead) markRead(selectedMessage.id, true);
                        if (!selectedMessage.isReplied) markReplied(selectedMessage.id);
                        setSelectedMessage(null);
                      }}
                      className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest bg-primary text-white hover:bg-secondary transition-all shadow-xl shadow-primary/20 hover:scale-105"
                    >
                      <Mail className="w-4 h-4" />
                      Reply via Gmail
                      <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </DialogContent>
        </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-[2rem] border-primary/10 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-foreground tracking-tight">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone. This will permanently delete the message from the guest.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 mt-4">
            <AlertDialogCancel className="rounded-xl border-border hover:bg-muted font-bold text-xs uppercase tracking-widest">No, Keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-200"
            >
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
