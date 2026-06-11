import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Edit, AlertTriangle, Upload, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useToast } from "@/hooks/use-toast";
import { AdminLayout } from "@/components/admin-layout";
import { motion } from "framer-motion";

const customFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("ow-admin-token");
  const headers = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(endpoint, { ...options, headers });
  if (!res.ok) throw new Error("API Error");
  return res.json();
};

const apiDelete = async (endpoint: string) => {
  const token = localStorage.getItem("ow-admin-token");
  const res = await fetch(endpoint, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("API Error");
};

type OfferAd = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  intervalMinutes: number;
  createdAt: string;
};

const AdForm = ({ ad, onSubmit, onCancel }: { ad?: OfferAd | null; onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; onCancel: () => void }) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(ad?.imageUrl || "");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const data: any = await customFetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      setUploadedUrl(data.url);
      toast({ title: "Image uploaded successfully" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Upload failed", description: err.message });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={ad?.title || ""} required placeholder="Summer Special 20%" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={ad?.description || ""} placeholder="Get 20% off on your next booking..." />
      </div>
      <div className="space-y-2">
        <Label>Ad Image</Label>
        <input type="hidden" name="imageUrl" value={uploadedUrl} />
        {uploadedUrl ? (
          <div className="relative rounded-xl overflow-hidden border border-slate-200 h-40">
            <img src={uploadedUrl} alt="Ad Preview" className="w-full h-full object-cover" />
            <Button type="button" size="icon" variant="destructive" className="absolute top-2 right-2 h-8 w-8 rounded-full" onClick={() => setUploadedUrl("")}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:bg-slate-50 transition-colors">
            <div className="space-y-1 text-center">
              <div className="flex text-sm text-slate-600 justify-center">
                <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-transparent font-medium text-primary hover:text-primary/80">
                  <div className="flex flex-col items-center gap-2">
                    {isUploading ? <Loader2 className="h-8 w-8 animate-spin text-primary" /> : <Upload className="h-8 w-8 text-slate-400" />}
                    <span>{isUploading ? "Uploading..." : "Click to upload an image"}</span>
                  </div>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageUpload} disabled={isUploading} accept="image/*" />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="intervalMinutes">Interval (Minutes)</Label>
        <Input id="intervalMinutes" name="intervalMinutes" type="number" defaultValue={ad?.intervalMinutes || 60} min={1} required />
        <p className="text-sm text-muted-foreground">How often this pop-up should appear to a user.</p>
      </div>
      <div className="flex items-center space-x-2 pt-2">
        <Switch id="isActive" name="isActive" defaultChecked={ad?.isActive ?? true} />
        <Label htmlFor="isActive">Active (Show to users)</Label>
      </div>
      <div className="pt-4 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isUploading}>Save Ad</Button>
      </div>
    </form>
  );
};

const AdCard = ({ ad, onEdit, onDelete, onToggleActive }: { ad: OfferAd; onEdit: (ad: OfferAd) => void; onDelete: (id: string) => void; onToggleActive: (id: string, active: boolean) => void }) => (
  <Card key={ad.id} className="relative overflow-hidden group">
    <CardHeader>
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-xl">{ad.title}</CardTitle>
          <CardDescription className="mt-1 line-clamp-2">{ad.description}</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(ad)}>
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Delete Offer Ad?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this offer ad? This action cannot be undone and will permanently remove the ad from the database and the website immediately.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>No, Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(ad.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Yes, Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      {ad.imageUrl && (
        <div className="mb-4 w-full h-32 rounded-md overflow-hidden bg-muted">
          <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex justify-between text-sm text-muted-foreground items-center">
        <span>Interval: Every {ad.intervalMinutes} mins</span>
        <div className="flex items-center gap-2">
          <span>Status:</span>
          <Switch 
            checked={ad.isActive} 
            onCheckedChange={(checked) => onToggleActive(ad.id, checked)}
          />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function AdminOfferAds() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<OfferAd | null>(null);

  const { data: ads = [], isLoading } = useQuery<OfferAd[]>({
    queryKey: ["admin-offer-ads"],
    queryFn: async () => {
      return customFetch("/api/v1/admin/offer-ads");
    },
  });

  const activeAds = ads.filter(ad => ad.isActive);
  const disabledAds = ads.filter(ad => !ad.isActive);

  const createMutation = useMutation({
    mutationFn: async (data: Partial<OfferAd>) => {
      return customFetch("/api/v1/admin/offer-ads", { method: "POST", body: JSON.stringify(data) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-offer-ads"] });
      toast({ title: "Success", description: "Offer ad created successfully." });
      setIsCreateOpen(false);
    },
    onError: () => {
      toast({ variant: "destructive", title: "Error", description: "Failed to create ad." });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<OfferAd> & { id: string }) => {
      return customFetch(`/api/v1/admin/offer-ads/${data.id}`, { method: "PATCH", body: JSON.stringify(data) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-offer-ads"] });
      toast({ title: "Success", description: "Offer ad updated successfully." });
      setEditingAd(null);
    },
    onError: () => {
      toast({ variant: "destructive", title: "Error", description: "Failed to update ad." });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiDelete(`/api/v1/admin/offer-ads/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-offer-ads"] });
      toast({ title: "Success", description: "Offer ad deleted successfully." });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete ad." });
    },
  });

  const handleSave = (e: React.FormEvent<HTMLFormElement>, id?: string) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      imageUrl: formData.get("imageUrl") as string,
      isActive: formData.get("isActive") === "on",
      intervalMinutes: parseInt(formData.get("intervalMinutes") as string) || 60,
    };

    if (id) {
      updateMutation.mutate({ ...data, id });
    } else {
      createMutation.mutate(data);
    }
  };

  // Inner components removed

  return (
    <AdminLayout>
      <div className="p-8 md:p-12 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
        >
          <div>
            <h1 className="text-4xl font-serif font-black text-[#0B3D5E]">Offer Ads</h1>
            <p className="text-slate-500 font-medium mt-2 text-sm">Manage promotional pop-ups for the main website.</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-all">
                <Plus className="h-4 w-4 mr-2" />
                Create Ad
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Offer Ad</DialogTitle>
                <DialogDescription>Add a new promotional pop-up to show on the main website.</DialogDescription>
              </DialogHeader>
              <AdForm onSubmit={(e) => handleSave(e)} onCancel={() => setIsCreateOpen(false)} />
            </DialogContent>
          </Dialog>
        </motion.div>

        <Dialog open={!!editingAd} onOpenChange={(open) => !open && setEditingAd(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Offer Ad</DialogTitle>
              <DialogDescription>Make changes to your promotional ad.</DialogDescription>
            </DialogHeader>
            <AdForm ad={editingAd} onSubmit={(e) => handleSave(e, editingAd?.id)} onCancel={() => setEditingAd(null)} />
          </DialogContent>
        </Dialog>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin h-10 w-10 text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mb-8 h-12 rounded-full p-1 bg-slate-100">
              <TabsTrigger value="active" className="rounded-full font-bold text-sm data-[state=active]:bg-white data-[state=active]:text-[#0B3D5E] data-[state=active]:shadow-sm">Currently Running ({activeAds.length})</TabsTrigger>
              <TabsTrigger value="disabled" className="rounded-full font-bold text-sm data-[state=active]:bg-white data-[state=active]:text-[#0B3D5E] data-[state=active]:shadow-sm">Disabled ({disabledAds.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="space-y-4 mt-0">
              {activeAds.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-[2rem] bg-white text-slate-500 shadow-sm flex flex-col items-center">
                  <div className="p-4 bg-slate-50 rounded-full mb-4">
                    <ImageIcon className="h-8 w-8 text-slate-300" />
                  </div>
                  <p className="font-bold">No active ads running</p>
                  <p className="text-sm mt-1">Create a new offer ad to see it here.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {activeAds.map((ad, i) => (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={ad.id}>
                      <AdCard ad={ad} onEdit={setEditingAd} onDelete={(id) => deleteMutation.mutate(id)} onToggleActive={(id, active) => updateMutation.mutate({ id, isActive: active })} />
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="disabled" className="space-y-4 mt-0">
              {disabledAds.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-[2rem] bg-white text-slate-500 shadow-sm flex flex-col items-center">
                  <div className="p-4 bg-slate-50 rounded-full mb-4">
                    <AlertTriangle className="h-8 w-8 text-slate-300" />
                  </div>
                  <p className="font-bold">No disabled ads</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {disabledAds.map((ad, i) => (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={ad.id}>
                      <AdCard ad={ad} onEdit={setEditingAd} onDelete={(id) => deleteMutation.mutate(id)} onToggleActive={(id, active) => updateMutation.mutate({ id, isActive: active })} />
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AdminLayout>
  );
}
