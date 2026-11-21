import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  useAdminListBlogs,
  useAdminCreateBlog,
  useAdminUpdateBlog,
  useAdminDeleteBlog,
  getAdminListBlogsQueryKey,
  getListBlogsQueryKey,
  getGetBlogQueryKey,
  customFetch,
  BlogInputCategory,
  BlogUpdateCategory,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit2, Trash2, Image as ImageIcon, Loader2, Star, Check, Zap, Home as HomeIcon } from "lucide-react";
import { cn } from "@/lib/utils";
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

const CATEGORIES = ["Surfing", "Travel", "Food", "Lifestyle", "Yoga"];

export default function AdminBlogs() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    category: "Surfing" as BlogInputCategory,
    date: new Date().toISOString().split("T")[0],
    isMainPost: false,
    isLatest: false,
    showOnHome: false,
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: blogs, isLoading } = useAdminListBlogs({
    query: { queryKey: getAdminListBlogsQueryKey() },
  });

  const createBlog = useAdminCreateBlog();
  const updateBlog = useAdminUpdateBlog();
  const deleteBlog = useAdminDeleteBlog();

  const blogList = blogs as any[] | undefined;

  const handleOpenDialog = (blog?: any) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title,
        description: blog.description,
        image: blog.image,
        category: blog.category as BlogInputCategory,
        date: blog.date ? new Date(blog.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        isMainPost: blog.isMainPost ?? blog.isFeatured ?? false,
        isLatest: blog.isLatest ?? false,
        showOnHome: blog.showOnHome ?? false,
      });
    } else {
      setEditingBlog(null);
      setFormData({
        title: "",
        description: "",
        image: "",
        category: "Surfing",
        date: new Date().toISOString().split("T")[0],
        isMainPost: false,
        isLatest: false,
        showOnHome: false,
      });
    }
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formDataObj = new FormData();
    formDataObj.append("file", file);

    try {
      // Use customFetch to ensure VITE_API_URL and auth tokens are attached
      const data: any = await customFetch("/api/upload", {
        method: "POST",
        body: formDataObj,
      });

      setFormData(prev => ({ ...prev, image: data.url }));
      toast({ title: "Image uploaded successfully" });
    } catch (err: any) {
      console.error("Upload error:", err);
      toast({ variant: "destructive", title: "Failed to upload image", description: err.message || "An unexpected error occurred" });
    } finally {
      setIsUploading(false);
    }
  };

  const invalidateAllBlogQueries = (blogId?: string) => {
    queryClient.invalidateQueries({ queryKey: getAdminListBlogsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getListBlogsQueryKey() });
    if (blogId) {
      queryClient.invalidateQueries({ queryKey: getGetBlogQueryKey(blogId) });
    }
    // Deep invalidation across all blog queries (both admin and public)
    queryClient.invalidateQueries({
      predicate: (query) => {
        const first = query.queryKey[0];
        return typeof first === "string" && (first.includes("/api/v1/blogs") || first.includes("/api/v1/admin/blogs"));
      },
    });
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.image || !formData.category || !formData.date) {
      toast({ variant: "destructive", title: "All fields are required" });
      return;
    }

    // Must map date string to ISO date-time string as per API schema
    const payload = {
      ...formData,
      isFeatured: formData.isMainPost,
      date: new Date(formData.date).toISOString()
    };

    if (editingBlog) {
      const currentEditingId = editingBlog.id;
      updateBlog.mutate(
        { id: currentEditingId, data: { ...payload, category: payload.category as BlogUpdateCategory } },
        {
          onSuccess: () => {
            toast({ title: "Blog updated successfully" });
            invalidateAllBlogQueries(currentEditingId);
            setIsDialogOpen(false);
          },
          onError: () => toast({ variant: "destructive", title: "Failed to update blog" }),
        }
      );
    } else {
      createBlog.mutate(
        { data: payload },
        {
          onSuccess: (newBlog: any) => {
            toast({ title: "Blog created successfully" });
            invalidateAllBlogQueries(newBlog?.id);
            setIsDialogOpen(false);
          },
          onError: () => toast({ variant: "destructive", title: "Failed to create blog" }),
        }
      );
    }
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    const targetDeleteId = deleteId;
    deleteBlog.mutate(
      { id: targetDeleteId },
      {
        onSuccess: () => {
          toast({ title: "Blog deleted successfully" });
          invalidateAllBlogQueries(targetDeleteId);
          setDeleteId(null);
        },
        onError: () => toast({ variant: "destructive", title: "Failed to delete blog" }),
      }
    );
  };

  const handleToggleMainPost = (blog: any) => {
    const isCurrentlyMain = blog.isMainPost ?? blog.isFeatured ?? false;
    const nextVal = !isCurrentlyMain;
    updateBlog.mutate(
      {
        id: blog.id,
        data: {
          isMainPost: nextVal,
          isFeatured: nextVal,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: nextVal ? "Main Post Activated!" : "Main Post Deactivated",
            description: nextVal
              ? `"${blog.title}" is now the spotlight Main Post on the Blog page.`
              : `"${blog.title}" is no longer the main post.`,
          });
          invalidateAllBlogQueries(blog.id);
        },
        onError: () => {
          toast({ variant: "destructive", title: "Failed to update main post status" });
        },
      }
    );
  };

  const handleToggleLatest = (blog: any) => {
    const nextVal = !blog.isLatest;
    updateBlog.mutate(
      {
        id: blog.id,
        data: {
          isLatest: nextVal,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: nextVal ? "Latest Post Activated!" : "Removed from Latest Posts",
            description: nextVal
              ? `"${blog.title}" will show in the Latest post column.`
              : `"${blog.title}" removed from Latest post column.`,
          });
          invalidateAllBlogQueries(blog.id);
        },
        onError: () => {
          toast({ variant: "destructive", title: "Failed to update latest post status" });
        },
      }
    );
  };

  const handleToggleHome = (blog: any) => {
    const nextVal = !blog.showOnHome;
    updateBlog.mutate(
      {
        id: blog.id,
        data: {
          showOnHome: nextVal,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: nextVal ? "Show on Home Activated!" : "Removed from Home Page",
            description: nextVal
              ? `"${blog.title}" will display in the Home page stories section.`
              : `"${blog.title}" will no longer display on the Home page.`,
          });
          invalidateAllBlogQueries(blog.id);
        },
        onError: () => {
          toast({ variant: "destructive", title: "Failed to update home page status" });
        },
      }
    );
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground mb-1">Blog Management</h1>
            <p className="text-muted-foreground text-sm mt-1">Create and manage your beautiful blog stories.</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="bg-primary text-white rounded-full px-6 gap-2">
            <Plus className="w-4 h-4" /> Add New Story
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}
          </div>
        ) : blogList && blogList.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
            {blogList.map((blog) => (
              <motion.div 
                key={blog.id} 
                layout
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card rounded-[2rem] border border-border overflow-hidden shadow-sm hover:shadow-2xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <div className="absolute top-4 right-4 flex flex-col gap-1.5 items-end">
                    <div className="bg-white/95 backdrop-blur-md text-[10px] font-black px-2.5 py-1 rounded-full text-[#0B3D5E] uppercase tracking-widest shadow-md">
                      {blog.category}
                    </div>
                    {(blog.isMainPost || blog.isFeatured) && (
                      <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-[#0B3D5E] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1 border border-amber-300">
                        <Star className="w-3 h-3 fill-[#0B3D5E]" />
                        <span>Main Post</span>
                      </div>
                    )}
                    {blog.isLatest && (
                      <div className="bg-gradient-to-r from-sky-400 to-blue-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1 border border-sky-300">
                        <Zap className="w-3 h-3 fill-white" />
                        <span>Latest</span>
                      </div>
                    )}
                    {blog.showOnHome && (
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1 border border-emerald-400">
                        <HomeIcon className="w-3 h-3" />
                        <span>Home</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs text-muted-foreground font-bold mb-2">
                    {new Date(blog.date).toLocaleDateString()}
                  </p>
                  <h3 className="text-xl font-serif font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors">{blog.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{blog.description}</p>
                  
                  {/* 3 Placement Toggle Buttons on Card */}
                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 mb-4">
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 px-1">
                      Display Placements
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {/* Toggle 1: Main Post */}
                      <button
                        type="button"
                        onClick={() => handleToggleMainPost(blog)}
                        disabled={updateBlog.isPending}
                        data-testid={`card-toggle-main-${blog.id}`}
                        className={cn(
                          "flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer border select-none",
                          (blog.isMainPost || blog.isFeatured)
                            ? "bg-amber-400/25 border-amber-400 text-amber-900 shadow-xs ring-1 ring-amber-400/40"
                            : "bg-white border-slate-200 text-slate-500 hover:border-amber-300 hover:text-amber-800 hover:bg-amber-50/50"
                        )}
                        title={(blog.isMainPost || blog.isFeatured) ? "Spotlight Main Post on Blog Page" : "Click to set as Main Post"}
                      >
                        <Star className={cn("w-3 h-3 shrink-0", (blog.isMainPost || blog.isFeatured) ? "fill-amber-500 text-amber-500" : "text-slate-400")} />
                        <span className="truncate">Main</span>
                      </button>

                      {/* Toggle 2: Latest Post */}
                      <button
                        type="button"
                        onClick={() => handleToggleLatest(blog)}
                        disabled={updateBlog.isPending}
                        data-testid={`card-toggle-latest-${blog.id}`}
                        className={cn(
                          "flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer border select-none",
                          blog.isLatest
                            ? "bg-sky-400/25 border-sky-400 text-sky-900 shadow-xs ring-1 ring-sky-400/40"
                            : "bg-white border-slate-200 text-slate-500 hover:border-sky-300 hover:text-sky-800 hover:bg-sky-50/50"
                        )}
                        title={blog.isLatest ? "Showing in Latest Post Stack" : "Click to show in Latest Posts"}
                      >
                        <Zap className={cn("w-3 h-3 shrink-0", blog.isLatest ? "fill-sky-500 text-sky-500" : "text-slate-400")} />
                        <span className="truncate">Latest</span>
                      </button>

                      {/* Toggle 3: Home Page */}
                      <button
                        type="button"
                        onClick={() => handleToggleHome(blog)}
                        disabled={updateBlog.isPending}
                        data-testid={`card-toggle-home-${blog.id}`}
                        className={cn(
                          "flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer border select-none",
                          blog.showOnHome
                            ? "bg-emerald-400/25 border-emerald-400 text-emerald-900 shadow-xs ring-1 ring-emerald-400/40"
                            : "bg-white border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-emerald-800 hover:bg-emerald-50/50"
                        )}
                        title={blog.showOnHome ? "Showing on Home Page" : "Click to show on Home Page"}
                      >
                        <HomeIcon className={cn("w-3 h-3 shrink-0", blog.showOnHome ? "text-emerald-600" : "text-slate-400")} />
                        <span className="truncate">Home</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                    <Button variant="outline" size="sm" className="flex-1 rounded-xl gap-1.5 hover:bg-primary/5 hover:border-primary/30 transition-all font-bold text-xs" onClick={() => handleOpenDialog(blog)}>
                      <Edit2 className="w-3.5 h-3.5" /> Edit Story
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-xl px-3 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all" onClick={() => setDeleteId(blog.id)} title="Delete Story">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-[3rem] border border-dashed border-border flex flex-col items-center justify-center h-[400px] text-center"
          >
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="w-20 h-20 rounded-[2rem] bg-primary/5 flex items-center justify-center mb-6 border border-primary/10"
            >
              <Plus className="w-8 h-8 text-primary" />
            </motion.div>
            <h3 className="text-xl font-bold mb-2 text-foreground">No Stories Yet</h3>
            <p className="text-muted-foreground mb-6">Share your first story with the world.</p>
            <Button onClick={() => handleOpenDialog()} className="rounded-full px-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all">Create Story</Button>
          </motion.div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[620px] rounded-[2rem] max-h-[90vh] sm:max-h-[88vh] flex flex-col p-0 gap-0 overflow-hidden shadow-2xl border border-slate-200">
            {/* Pinned Sticky Header */}
            <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-slate-100 bg-white shrink-0 pr-12">
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif font-black text-[#0B3D5E]">
                  {editingBlog ? "Edit Story" : "Create New Story"}
                </DialogTitle>
              </DialogHeader>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Configure story details, imagery, and front-page placement toggles.
              </p>
            </div>

            {/* Smooth Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-5 space-y-5">
              <div className="grid gap-2">
                <Label className="text-xs font-bold text-slate-700">Cover Image</Label>
                <div className="flex gap-4 items-start">
                  {formData.image && (
                    <div className="w-28 h-20 rounded-xl overflow-hidden border border-border relative group shrink-0">
                      <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                    />
                    <Button 
                      variant="outline" 
                      className="w-full h-20 rounded-xl border-dashed flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? <Loader2 className="w-5 h-5 mb-1 animate-spin text-primary" /> : <ImageIcon className="w-5 h-5 mb-1" />}
                      <span className="text-[11px] font-bold uppercase tracking-wider">{isUploading ? "Uploading..." : "Upload Image"}</span>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="title" className="text-xs font-bold text-slate-700">Story Title</Label>
                <Input 
                  id="title" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  placeholder="E.g., The Ultimate Guide to Surfing..." 
                  className="rounded-xl h-11 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-xs font-bold text-slate-700">Category</Label>
                  <Select value={formData.category} onValueChange={(val) => setFormData({...formData, category: val as BlogInputCategory})}>
                    <SelectTrigger className="rounded-xl h-11 text-sm font-medium">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date" className="text-xs font-bold text-slate-700">Publish Date</Label>
                  <Input 
                    id="date" 
                    type="date"
                    value={formData.date} 
                    onChange={(e) => setFormData({...formData, date: e.target.value})} 
                    className="rounded-xl h-11 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description" className="text-xs font-bold text-slate-700">Story Content (Description)</Label>
                <Textarea 
                  id="description" 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  placeholder="Write your story here..."
                  className="min-h-[110px] max-h-[180px] rounded-xl resize-y text-sm leading-relaxed"
                />
              </div>

              {/* Three Placement Toggles */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Story Placement & Display Controls
                  </Label>
                  <span className="text-[10px] font-bold text-slate-400">3 Placements Available</span>
                </div>

                {/* 1. Main Post (Blog Page Big Post) */}
                <div className={cn(
                  "flex items-center justify-between p-3.5 rounded-2xl border transition-all",
                  formData.isMainPost 
                    ? "border-amber-300 bg-amber-50/70 shadow-xs" 
                    : "border-slate-200/90 bg-slate-50/70 hover:bg-slate-50"
                )}>
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                      formData.isMainPost ? "bg-amber-100 text-amber-700" : "bg-slate-200/70 text-slate-500"
                    )}>
                      <Star className={cn("w-5 h-5", formData.isMainPost ? "fill-amber-400 text-amber-500" : "text-slate-400")} />
                    </div>
                    <div>
                      <Label htmlFor="toggle-main-post" className="text-sm font-bold text-[#0B3D5E] cursor-pointer flex items-center gap-2">
                        <span>Blog Main Post (Big Spotlight Card)</span>
                        {formData.isMainPost && (
                          <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400/25 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full">
                            Active Main
                          </span>
                        )}
                      </Label>
                      <p className="text-xs text-slate-500 font-normal mt-0.5 leading-relaxed">
                        Displays this story as the primary large hero card on the left side of the Blog page.
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="toggle-main-post"
                    checked={formData.isMainPost}
                    onCheckedChange={(checked) => setFormData({ ...formData, isMainPost: checked })}
                    data-testid="toggle-modal-main-post"
                    className="ml-4 shrink-0"
                  />
                </div>

                {/* 2. Latest Post (Blog Page Column) */}
                <div className={cn(
                  "flex items-center justify-between p-3.5 rounded-2xl border transition-all",
                  formData.isLatest 
                    ? "border-sky-300 bg-sky-50/70 shadow-xs" 
                    : "border-slate-200/90 bg-slate-50/70 hover:bg-slate-50"
                )}>
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                      formData.isLatest ? "bg-sky-100 text-sky-700" : "bg-slate-200/70 text-slate-500"
                    )}>
                      <Zap className={cn("w-5 h-5", formData.isLatest ? "fill-sky-500 text-sky-500" : "text-slate-400")} />
                    </div>
                    <div>
                      <Label htmlFor="toggle-latest-post" className="text-sm font-bold text-[#0B3D5E] cursor-pointer flex items-center gap-2">
                        <span>Select as Latest Post (Blog Page)</span>
                        {formData.isLatest && (
                          <span className="text-[9px] font-black uppercase tracking-wider bg-sky-400/25 text-sky-800 border border-sky-300 px-2 py-0.5 rounded-full">
                            In Latest Stack
                          </span>
                        )}
                      </Label>
                      <p className="text-xs text-slate-500 font-normal mt-0.5 leading-relaxed">
                        Features this story in the vertical "Latest post" column on the right side of the Blog page.
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="toggle-latest-post"
                    checked={formData.isLatest}
                    onCheckedChange={(checked) => setFormData({ ...formData, isLatest: checked })}
                    data-testid="toggle-modal-latest-post"
                    className="ml-4 shrink-0"
                  />
                </div>

                {/* 3. Show on Home Page */}
                <div className={cn(
                  "flex items-center justify-between p-3.5 rounded-2xl border transition-all",
                  formData.showOnHome 
                    ? "border-emerald-300 bg-emerald-50/70 shadow-xs" 
                    : "border-slate-200/90 bg-slate-50/70 hover:bg-slate-50"
                )}>
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                      formData.showOnHome ? "bg-emerald-100 text-emerald-700" : "bg-slate-200/70 text-slate-500"
                    )}>
                      <HomeIcon className={cn("w-5 h-5", formData.showOnHome ? "text-emerald-600" : "text-slate-400")} />
                    </div>
                    <div>
                      <Label htmlFor="toggle-home-post" className="text-sm font-bold text-[#0B3D5E] cursor-pointer flex items-center gap-2">
                        <span>Show on Home Page</span>
                        {formData.showOnHome && (
                          <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-400/25 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full">
                            On Homepage
                          </span>
                        )}
                      </Label>
                      <p className="text-xs text-slate-500 font-normal mt-0.5 leading-relaxed">
                        Showcases this story in the Journal & Stories section on the main public homepage.
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="toggle-home-post"
                    checked={formData.showOnHome}
                    onCheckedChange={(checked) => setFormData({ ...formData, showOnHome: checked })}
                    data-testid="toggle-modal-home-post"
                    className="ml-4 shrink-0"
                  />
                </div>
              </div>
            </div>

            {/* Pinned Sticky Bottom Footer */}
            <div className="px-6 sm:px-8 py-4 border-t border-slate-100 bg-slate-50/90 backdrop-blur-md shrink-0 flex items-center justify-end gap-3 rounded-b-[2rem]">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-full px-6 font-bold text-xs h-10">
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isUploading || updateBlog.isPending || createBlog.isPending} 
                className="bg-[#0B3D5E] hover:bg-[#072438] text-white rounded-full px-8 font-bold text-xs h-10 shadow-md shadow-[#0B3D5E]/20"
              >
                {isUploading ? "Uploading..." : updateBlog.isPending || createBlog.isPending ? "Saving..." : editingBlog ? "Save Changes" : "Publish Story"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
          <AlertDialogContent className="rounded-[2rem] p-8 max-h-[90vh] overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-bold">Delete Story?</AlertDialogTitle>
              <AlertDialogDescription className="text-base text-muted-foreground">
                Are you sure you want to delete this story? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-8 gap-3">
              <AlertDialogCancel className="rounded-full px-8 h-12 font-bold uppercase tracking-widest text-[10px]">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="rounded-full px-8 h-12 font-bold uppercase tracking-widest text-[10px] bg-red-500 hover:bg-red-600 text-white">
                Delete Permanently
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
