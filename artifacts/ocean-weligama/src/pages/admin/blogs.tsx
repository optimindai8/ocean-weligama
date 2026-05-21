import { useState, useRef } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  useAdminListBlogs,
  useAdminCreateBlog,
  useAdminUpdateBlog,
  useAdminDeleteBlog,
  getAdminListBlogsQueryKey,
  customFetch,
  BlogInputCategory,
  BlogUpdateCategory,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit2, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
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
      });
    } else {
      setEditingBlog(null);
      setFormData({
        title: "",
        description: "",
        image: "",
        category: "Surfing",
        date: new Date().toISOString().split("T")[0],
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

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.image || !formData.category || !formData.date) {
      toast({ variant: "destructive", title: "All fields are required" });
      return;
    }

    // Must map date string to ISO date-time string as per API schema
    const payload = {
      ...formData,
      date: new Date(formData.date).toISOString()
    };

    if (editingBlog) {
      updateBlog.mutate(
        { id: editingBlog.id, data: { ...payload, category: payload.category as BlogUpdateCategory } },
        {
          onSuccess: () => {
            toast({ title: "Blog updated successfully" });
            queryClient.invalidateQueries({ queryKey: getAdminListBlogsQueryKey() });
            setIsDialogOpen(false);
          },
          onError: () => toast({ variant: "destructive", title: "Failed to update blog" }),
        }
      );
    } else {
      createBlog.mutate(
        { data: payload },
        {
          onSuccess: () => {
            toast({ title: "Blog created successfully" });
            queryClient.invalidateQueries({ queryKey: getAdminListBlogsQueryKey() });
            setIsDialogOpen(false);
          },
          onError: () => toast({ variant: "destructive", title: "Failed to create blog" }),
        }
      );
    }
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    deleteBlog.mutate(
      { id: deleteId },
      {
        onSuccess: () => {
          toast({ title: "Blog deleted successfully" });
          queryClient.invalidateQueries({ queryKey: getAdminListBlogsQueryKey() });
          setDeleteId(null);
        },
        onError: () => toast({ variant: "destructive", title: "Failed to delete blog" }),
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogList.map((blog) => (
              <div key={blog.id} className="bg-card rounded-[2rem] border border-border overflow-hidden hover:shadow-xl transition-all group">
                <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-primary uppercase tracking-wider">
                    {blog.category}
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs text-muted-foreground font-bold mb-2">
                    {new Date(blog.date).toLocaleDateString()}
                  </p>
                  <h3 className="text-xl font-serif font-bold mb-2 line-clamp-1">{blog.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-6">{blog.description}</p>
                  
                  <div className="flex items-center gap-2 pt-4 border-t border-border">
                    <Button variant="outline" size="sm" className="flex-1 rounded-full gap-2" onClick={() => handleOpenDialog(blog)}>
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 rounded-full gap-2 text-red-600 border-red-200 hover:bg-red-50" onClick={() => setDeleteId(blog.id)}>
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Stories Yet</h3>
            <p className="text-muted-foreground mb-4">Share your first story with the world.</p>
            <Button onClick={() => handleOpenDialog()} variant="outline" className="rounded-full">Create Story</Button>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] rounded-[2rem]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif">{editingBlog ? "Edit Story" : "Create New Story"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label>Cover Image</Label>
                <div className="flex gap-4 items-start">
                  {formData.image && (
                    <div className="w-32 h-24 rounded-xl overflow-hidden border border-border relative group">
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
                      className="w-full h-24 rounded-xl border-dashed flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? <Loader2 className="w-6 h-6 mb-2 animate-spin text-primary" /> : <ImageIcon className="w-6 h-6 mb-2" />}
                      <span className="text-xs font-bold uppercase tracking-wider">{isUploading ? "Uploading..." : "Upload Image"}</span>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="title">Story Title</Label>
                <Input 
                  id="title" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  placeholder="E.g., The Ultimate Guide to Surfing..." 
                  className="rounded-xl h-12"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(val) => setFormData({...formData, category: val as BlogInputCategory})}>
                    <SelectTrigger className="rounded-xl h-12">
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
                  <Label htmlFor="date">Publish Date</Label>
                  <Input 
                    id="date" 
                    type="date"
                    value={formData.date} 
                    onChange={(e) => setFormData({...formData, date: e.target.value})} 
                    className="rounded-xl h-12"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Story Content (Description)</Label>
                <Textarea 
                  id="description" 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  placeholder="Write your story here..."
                  className="min-h-[150px] rounded-xl resize-none"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-full px-6">Cancel</Button>
              <Button onClick={handleSubmit} disabled={isUploading || updateBlog.isPending || createBlog.isPending} className="bg-primary text-white rounded-full px-8">
                {editingBlog ? "Save Changes" : "Publish Story"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
          <AlertDialogContent className="rounded-[2rem] p-8">
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
