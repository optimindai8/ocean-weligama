import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAdminListGallery,
  useAdminUpdateGalleryStatus,
  useAdminDeleteGalleryItem,
  getAdminGetNotificationCountsQueryKey,
} from "@workspace/api-client-react";
import { AdminLayout } from "@/components/admin-layout";
import {
  Check,
  X,
  Trash2,
  Eye,
  Clock,
  ImageIcon,
  Maximize2,
  Filter,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

type StatusFilter = "all" | "pending" | "approved" | "rejected";

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "text-amber-500 bg-amber-50 border-amber-200", dot: "bg-amber-400" },
  approved: { label: "Approved", color: "text-green-600 bg-green-50 border-green-200", dot: "bg-green-500" },
  rejected: { label: "Rejected", color: "text-red-500 bg-red-50 border-red-200", dot: "bg-red-400" },
} as const;

export default function AdminGallery() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const { data: items = [], isLoading } = useAdminListGallery();
  const updateStatus = useAdminUpdateGalleryStatus();
  const deleteItem = useAdminDeleteGalleryItem();

  const filtered = items.filter((item) => statusFilter === "all" || item.status === statusFilter);

  const counts = {
    all: items.length,
    pending: items.filter((i) => i.status === "pending").length,
    approved: items.filter((i) => i.status === "approved").length,
    rejected: items.filter((i) => i.status === "rejected").length,
  };

  const handleStatusChange = async (id: string, status: "approved" | "rejected") => {
    try {
      await updateStatus.mutateAsync({ id, data: { status } });
      queryClient.invalidateQueries({ queryKey: ["/api/v1/admin/gallery"] });
      queryClient.invalidateQueries({ queryKey: getAdminGetNotificationCountsQueryKey() });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: ["/api/v1/admin/gallery"] });
      queryClient.invalidateQueries({ queryKey: getAdminGetNotificationCountsQueryKey() });
      setConfirmDelete(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground mb-1">Gallery Management</h1>
            <p className="text-muted-foreground text-sm">Review and moderate tourist-submitted photos before they appear on the website.</p>
          </div>
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/v1/admin/gallery"] })}
            disabled={isLoading}
            className="flex items-center gap-2 bg-card border border-border hover:border-primary/50 hover:bg-primary/5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-foreground disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {(["all", "pending", "approved", "rejected"] as StatusFilter[]).map((key) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStatusFilter(key)}
              className={`relative p-5 rounded-2xl border text-left transition-all overflow-hidden ${
                statusFilter === key
                  ? "border-primary text-primary shadow-lg shadow-primary/10"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              {statusFilter === key && (
                <motion.div
                  layoutId="active-filter-bg-gallery"
                  className="absolute inset-0 bg-primary/5"
                  style={{ zIndex: 0 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-2 mb-2">
                {key !== "all" && (
                  <div className={`w-2 h-2 rounded-full ${STATUS_CONFIG[key as keyof typeof STATUS_CONFIG].dot}`} />
                )}
                {key === "all" && <Filter className="w-3 h-3 text-muted-foreground" />}
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground capitalize">{key}</span>
              </div>
              <p className="relative z-10 text-3xl font-bold text-foreground">{counts[key]}</p>
            </motion.button>
          ))}
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ImageIcon className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {statusFilter === "pending" ? "No pending images" : `No ${statusFilter} images`}
            </h3>
            <p className="text-muted-foreground text-sm max-w-md">
              {statusFilter === "pending"
                ? "All tourist submissions have been reviewed. Great work!"
                : `There are no images with "${statusFilter}" status yet.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                  className="group relative bg-card rounded-[2rem] overflow-hidden border border-border shadow-sm hover:shadow-2xl hover:border-primary/40 transition-all duration-500 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={item.url}
                      alt={item.altText ?? "Gallery image"}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Status Badge */}
                    <div className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG]?.color ?? "text-gray-500 bg-gray-50 border-gray-200"}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG]?.dot ?? "bg-gray-400"}`} />
                      {STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG]?.label ?? item.status}
                    </div>

                    {/* Category Badge */}
                    {item.category && (
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-wider">
                        {item.category}
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setLightboxImg(item.url)}
                        className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center hover:bg-white/40 transition-all shadow-2xl"
                      >
                        <Maximize2 className="w-6 h-6 text-white" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Info & Actions */}
                  <div className="p-4">
                    {item.caption && (
                      <p className="text-sm text-foreground font-medium mb-1 truncate">{item.caption}</p>
                    )}
                    {item.createdAt && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-4">
                        <Clock className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {item.status !== "approved" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleStatusChange(item.id, "approved")}
                          disabled={updateStatus.isPending}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-green-500 text-white text-xs font-bold hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve
                        </motion.button>
                      )}
                      {item.status !== "rejected" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleStatusChange(item.id, "rejected")}
                          disabled={updateStatus.isPending}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors disabled:opacity-50"
                        >
                          <X className="w-3.5 h-3.5" />
                          Reject
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setConfirmDelete(item.id)}
                        className="w-10 flex-shrink-0 flex items-center justify-center py-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors border border-red-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>

                    {/* Re-approve if rejected */}
                    {item.status === "approved" && (
                      <div className="mt-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setConfirmDelete(item.id)}
                          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 transition-colors border border-red-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl"
            onClick={() => setLightboxImg(null)}
          >
            <button className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors">
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.8, opacity: 0, rotate: -2 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={lightboxImg}
              alt="Full view"
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Dialog */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Delete Image</h3>
                  <p className="text-sm text-muted-foreground">This cannot be undone.</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                This image will be permanently removed from the gallery and cannot be recovered.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-3 rounded-xl border border-border text-foreground font-semibold text-sm hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  disabled={deleteItem.isPending}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {deleteItem.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
