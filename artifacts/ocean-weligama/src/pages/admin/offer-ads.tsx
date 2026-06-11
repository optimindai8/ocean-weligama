import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Edit, AlertTriangle } from "lucide-react";
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

const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("ow-admin-token");
  const headers = {
    "Content-Type": "application/json",
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

export default function AdminOfferAds() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<OfferAd | null>(null);

  const { data: ads = [], isLoading } = useQuery<OfferAd[]>({
    queryKey: ["admin-offer-ads"],
    queryFn: async () => {
      return apiFetch("/api/admin/offer-ads");
    },
  });

  const activeAds = ads.filter(ad => ad.isActive);
  const disabledAds = ads.filter(ad => !ad.isActive);

  const createMutation = useMutation({
    mutationFn: async (data: Partial<OfferAd>) => {
      return apiFetch("/api/admin/offer-ads", { method: "POST", body: JSON.stringify(data) });
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
      return apiFetch(`/api/admin/offer-ads/${data.id}`, { method: "PATCH", body: JSON.stringify(data) });
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
      await apiDelete(`/api/admin/offer-ads/${id}`);
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

  const AdForm = ({ ad, onSubmit }: { ad?: OfferAd | null; onSubmit: (e: React.FormEvent<HTMLFormElement>) => void }) => (
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
        <Label htmlFor="imageUrl">Image URL (Optional)</Label>
        <Input id="imageUrl" name="imageUrl" defaultValue={ad?.imageUrl || ""} placeholder="https://example.com/image.jpg" />
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
        <Button type="button" variant="outline" onClick={() => ad ? setEditingAd(null) : setIsCreateOpen(false)}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );

  const AdCard = ({ ad }: { ad: OfferAd }) => (
    <Card key={ad.id} className="relative overflow-hidden group">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{ad.title}</CardTitle>
            <CardDescription className="mt-1 line-clamp-2">{ad.description}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => setEditingAd(ad)}>
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
                  <AlertDialogAction onClick={() => deleteMutation.mutate(ad.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
              onCheckedChange={(checked) => updateMutation.mutate({ id: ad.id, isActive: checked })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Offer Ad Post</h1>
          <p className="text-muted-foreground mt-1">Manage promotional pop-ups for the main website.</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Ad
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Offer Ad</DialogTitle>
              <DialogDescription>Add a new promotional pop-up to show on the main website.</DialogDescription>
            </DialogHeader>
            <AdForm onSubmit={(e) => handleSave(e)} />
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={!!editingAd} onOpenChange={(open) => !open && setEditingAd(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Offer Ad</DialogTitle>
            <DialogDescription>Make changes to your promotional ad.</DialogDescription>
          </DialogHeader>
          <AdForm ad={editingAd} onSubmit={(e) => handleSave(e, editingAd?.id)} />
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
            <TabsTrigger value="active">Currently Running ({activeAds.length})</TabsTrigger>
            <TabsTrigger value="disabled">Disabled ({disabledAds.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="space-y-4 mt-0">
            {activeAds.length === 0 ? (
              <div className="text-center py-12 border rounded-lg bg-card text-muted-foreground">
                No active ads running.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {activeAds.map(ad => <AdCard key={ad.id} ad={ad} />)}
              </div>
            )}
          </TabsContent>
          <TabsContent value="disabled" className="space-y-4 mt-0">
            {disabledAds.length === 0 ? (
              <div className="text-center py-12 border rounded-lg bg-card text-muted-foreground">
                No disabled ads.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {disabledAds.map(ad => <AdCard key={ad.id} ad={ad} />)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
