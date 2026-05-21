import {
  useAdminListReviews,
  useAdminUpdateReview,
  useAdminDeleteReview,
  getAdminListReviewsQueryKey,
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
import { useState } from "react";

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
          <div className="space-y-4">
            {reviewList.map((review) => (
              <div
                key={review.id}
                className="bg-card rounded-2xl border border-border p-6"
                data-testid={`card-review-${review.id}`}
              >
                <div className="flex items-start justify-between mb-4">
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
                  <div className="flex items-center gap-2">
                    {review.isApproved ? (
                      <Badge className="bg-green-100 text-green-700 border-0">Approved</Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-700 border-0">Pending</Badge>
                    )}
                    {review.isFeatured && (
                      <Badge className="bg-blue-100 text-blue-700 border-0">Featured</Badge>
                    )}
                  </div>
                </div>

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

                <div className="flex gap-2 flex-wrap">
                  {!review.isApproved ? (
                    <Button
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white rounded-full gap-1"
                      onClick={() => update(review.id, { isApproved: true })}
                      data-testid={`button-approve-review-${review.id}`}
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full gap-1 text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => update(review.id, { isApproved: false })}
                      data-testid={`button-unapprove-review-${review.id}`}
                    >
                      <X className="w-3.5 h-3.5" /> Unapprove
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full gap-1"
                    onClick={() => update(review.id, { isFeatured: !review.isFeatured })}
                    data-testid={`button-feature-review-${review.id}`}
                  >
                    <Flag className="w-3.5 h-3.5" /> {review.isFeatured ? "Unfeature" : "Feature"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full gap-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 ml-auto"
                    onClick={() => setDeleteId(review.id)}
                    data-testid={`button-delete-review-${review.id}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground mt-3">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border flex items-center justify-center h-48">
            <p className="text-muted-foreground text-sm">No reviews yet</p>
          </div>
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
