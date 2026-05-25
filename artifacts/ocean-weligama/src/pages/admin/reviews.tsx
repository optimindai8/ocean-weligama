import {
  useAdminListReviews,
  useAdminUpdateReview,
  useAdminDeleteReview,
  getAdminListReviewsQueryKey,
  useAdminMarkNotificationsRead,
  getAdminGetNotificationCountsQueryKey,
} from "@workspace/api-client-react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Star, Check, X, Flag, MessageSquare, Trash2, AlertCircle, RefreshCcw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminReviews() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);



  const { data: reviews, isLoading } = useAdminListReviews({
    query: { queryKey: getAdminListReviewsQueryKey() },
  });

  const updateReview = useAdminUpdateReview();
  const deleteReview = useAdminDeleteReview();

  const reviewList = reviews as any[] | undefined;

  function update(id: string, data: Record<string, unknown>) {
    updateReview.mutate(
      { id, data },
      {
        onSuccess: () => {
          toast({ title: "Review updated" });
          queryClient.invalidateQueries({ queryKey: getAdminListReviewsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getAdminGetNotificationCountsQueryKey() });
        },
        onError: () => toast({ variant: "destructive", title: "Update failed" }),
      }
    );
  }

  function confirmDelete() {
    if (!deleteId) return;
    deleteReview.mutate(
      { id: deleteId },
      {
        onSuccess: () => {
          toast({ title: "Review deleted permanently" });
          setDeleteId(null);
          queryClient.invalidateQueries({ queryKey: getAdminListReviewsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getAdminGetNotificationCountsQueryKey() });
        },
        onError: (err: any) => {
          console.error("Delete review error:", err);
          const status = err?.status || "Unknown Status";
          const errorData = err?.data;
          const detail = typeof errorData === 'string' ? errorData : (errorData?.details || errorData?.error || "No specific error body");
          
          toast({ 
            variant: "destructive", 
            title: `Deletion failed (${status})`,
            description: detail.slice(0, 100) + (detail.length > 100 ? "..." : "")
          });
        },
      }
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground mb-1">Reviews Management</h1>
            <p className="text-muted-foreground text-sm mt-1">Moderate and respond to guest reviews.</p>
          </div>

          <button
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: getAdminListReviewsQueryKey() });
              toast({ title: "Checking for new reviews..." });
            }}
            disabled={isLoading}
            className="flex items-center gap-2 bg-card border border-border hover:border-primary/50 hover:bg-primary/5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-foreground disabled:opacity-50"
          >
            <RefreshCcw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
          </div>
        ) : reviewList && reviewList.length > 0 ? (
          <motion.div 
            className="space-y-4"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence mode="popLayout">
              {reviewList.map((review) => (
                <motion.div
                  key={review.id}
                  layout
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card rounded-[2rem] border border-border/60 p-6 shadow-sm hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden"
                  data-testid={`card-review-${review.id}`}
                >
                  {/* Subtle gradient background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <div className="relative z-10 flex items-start justify-between mb-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-border/50 flex items-center justify-center bg-muted/30 shrink-0">
                      {review.guestAvatarUrl ? (
                        <img src={review.guestAvatarUrl} alt={review.guestName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-muted-foreground/30 text-xs font-bold uppercase">{review.guestName.charAt(0)}</div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-bold text-foreground">{review.guestName}</p>
                        {review.guestCountry && (
                          <span className="text-xs text-muted-foreground">{review.guestCountry}</span>
                        )}
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{review.source}</span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-4 h-4 ${s <= review.ratingOverall ? "fill-[#F0A500] text-[#F0A500]" : "text-muted-foreground"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="relative z-10 flex items-center gap-2">
                    {review.isApproved ? (
                      <Badge className="bg-green-100 text-green-700 border-0 shadow-sm">Approved</Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-700 border-0">Pending</Badge>
                    )}
                    {review.isFeatured && (
                      <Badge className="bg-blue-100 text-blue-700 border-0">Featured</Badge>
                    )}
                  </div>
                </div>

                <div className="relative z-10">

                {review.title && (
                  <h3 className="text-lg font-bold text-foreground mb-2 italic">"{review.title}"</h3>
                )}
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{review.reviewText}</p>

                {review.ownerReply && (
                  <div className="bg-primary/5 rounded-xl p-4 mb-4 border border-primary/10">
                    <p className="text-xs font-bold text-primary mb-1 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> Owner Reply
                    </p>
                    <p className="text-sm text-muted-foreground">{review.ownerReply}</p>
                  </div>
                )}

                </div>

                <div className="relative z-10 flex gap-2 flex-wrap">
                  {!review.isApproved ? (
                    <Button
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white rounded-full gap-1 hover:scale-105 transition-transform"
                      onClick={() => update(review.id, { isApproved: true })}
                      data-testid={`button-approve-review-${review.id}`}
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full gap-1 text-red-600 border-red-200 hover:bg-red-50 hover:scale-105 transition-transform"
                      onClick={() => update(review.id, { isApproved: false })}
                      data-testid={`button-unapprove-review-${review.id}`}
                    >
                      <X className="w-3.5 h-3.5" /> Unapprove
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full gap-1 hover:scale-105 transition-transform"
                    onClick={() => update(review.id, { isFeatured: !review.isFeatured })}
                    data-testid={`button-feature-review-${review.id}`}
                  >
                    <Flag className="w-3.5 h-3.5" /> {review.isFeatured ? "Unfeature" : "Feature"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full gap-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 ml-auto hover:scale-105 transition-transform"
                    onClick={() => setDeleteId(review.id)}
                    data-testid={`button-delete-review-${review.id}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </Button>
                </div>

                <p className="relative z-10 text-xs text-muted-foreground mt-3">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
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
              <MessageSquare className="w-10 h-10 text-muted-foreground/30" />
            </motion.div>
            <h3 className="text-xl font-bold text-foreground mb-2 italic">Quiet waters...</h3>
            <p className="text-muted-foreground text-sm max-w-xs">No reviews match your current filter. Check back later!</p>
          </motion.div>
        )}

        <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
          <AlertDialogContent className="rounded-[2rem] p-8">
            <AlertDialogHeader>
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <AlertDialogTitle className="text-2xl font-bold">Delete Review?</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground text-base">
                This action is permanent. The review will be removed from the database and the public website. Any associated images will also be deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-8 gap-3">
              <AlertDialogCancel className="rounded-full px-8 h-12 font-bold uppercase tracking-widest text-[10px]">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="rounded-full px-8 h-12 font-bold uppercase tracking-widest text-[10px] bg-red-500 hover:bg-red-600 text-white"
              >
                Yes, Delete Permanently
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
