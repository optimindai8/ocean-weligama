import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useAdminListRooms,
  useAdminCreateRoom,
  useAdminUpdateRoom,
  useAdminDeleteRoom,
  getAdminListRoomsQueryKey,
} from "@workspace/api-client-react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  BedDouble,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  MoreVertical,
  Star,
  Upload,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
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

const roomSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  type: z.enum(["room", "villa", "dormitory", "suite"]).default("room"),
  maxGuests: z.coerce.number().min(1, "At least 1 guest required"),
  bedrooms: z.coerce.number().min(0),
  bathrooms: z.coerce.number().min(0),
  basePricePerNight: z.coerce.string().min(1, "Price is required").transform(val => val.trim()).refine(
    val => /^\d+(\.\d{1,2})?$/.test(val),
    "Price must be a valid number (e.g., 150 or 150.50)"
  ),
  currency: z.string().default("EUR"),
  status: z.enum(["active", "maintenance", "hidden"]).default("active"),
  isFeatured: z.boolean().default(false),
  gallery: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
});

type RoomFormValues = z.infer<typeof roomSchema>;

// useAdminCreateRoom hook is used directly below — no manual fetch needed.

export default function AdminRooms() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<{ id: string; name: string } | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: rooms, isLoading } = useAdminListRooms({
    query: { queryKey: getAdminListRoomsQueryKey() },
  });

  const createRoom = useAdminCreateRoom();
  const updateRoom = useAdminUpdateRoom();
  const deleteRoom = useAdminDeleteRoom();

  const roomList = rooms as Array<any> | undefined;

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      category: "solo",
      type: "room",
      maxGuests: 1,
      bedrooms: 1,
      bathrooms: 1,
      basePricePerNight: "100",
      currency: "EUR",
      status: "active",
      isFeatured: false,
      gallery: [],
      highlights: [""],
    },
  });

  const highlights = form.watch("highlights") || [""];
  const gallery = form.watch("gallery") || [];

  function openCreateDialog() {
    setEditingRoom(null);
    form.reset({
      name: "",
      slug: "",
      description: "",
      category: "solo",
      type: "room",
      maxGuests: 1,
      bedrooms: 1,
      bathrooms: 1,
      basePricePerNight: "100",
      currency: "EUR",
      status: "active",
      isFeatured: false,
      gallery: [],
      highlights: [""],
    });
    setIsDialogOpen(true);
  }

  function openEditDialog(room: any) {
    setEditingRoom(room);
    form.reset({
      name: room.name,
      slug: room.slug,
      description: room.description || "",
      category: room.category || "solo",
      type: room.type,
      maxGuests: room.maxGuests,
      bedrooms: room.bedrooms,
      bathrooms: room.bathrooms,
      basePricePerNight: room.basePricePerNight ? String(room.basePricePerNight) : "100",
      currency: room.currency || "EUR",
      status: room.status,
      isFeatured: room.isFeatured,
      gallery: room.gallery || (room.heroImageUrl ? [room.heroImageUrl] : []),
      highlights: room.highlights?.length ? room.highlights : [""],
    });
    setIsDialogOpen(true);
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);
    const uploadedUrls: string[] = [];

    try {
      const fileArray = Array.from(files);
      let completed = 0;
      const isDev = import.meta.env.DEV;
      const apiUrl = isDev ? (import.meta.env.VITE_API_URL || "http://localhost:8080") : "";
      const token = localStorage.getItem("ow-admin-token");
      
      if (!token) {
        toast({ variant: "destructive", title: "Authentication Error", description: "No admin token found. Please log in again." });
        setIsUploading(false);
        return;
      }

      for (const file of fileArray) {
        if (!file.type.startsWith("image/")) {
          toast({ variant: "destructive", title: "Invalid file type", description: `${file.name} is not an image` });
          continue;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast({ variant: "destructive", title: "File too large", description: `${file.name} is over 5MB` });
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${apiUrl}/api/upload`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: formData,
        });

        if (!response.ok) {
          const text = await response.text();
          let errorMsg = `Failed to upload ${file.name}`;
          try {
            const errorData = JSON.parse(text);
            errorMsg = errorData.error || errorMsg;
          } catch {
            errorMsg = `Server error (${response.status}): ${text.slice(0, 100)}`;
          }
          throw new Error(errorMsg);
        }

        const data = await response.json();
        uploadedUrls.push(data.url);
        
        completed++;
        setUploadProgress(Math.round((completed / fileArray.length) * 100));
      }

      const currentGallery = form.getValues("gallery") || [];
      form.setValue("gallery", [...currentGallery, ...uploadedUrls], { shouldValidate: true });
      
      toast({ title: "Images uploaded successfully" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Upload failed", description: error.message });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (indexToRemove: number) => {
    const current = form.getValues("gallery") || [];
    form.setValue("gallery", current.filter((_, i) => i !== indexToRemove), { shouldValidate: true });
  };

  async function onSubmit(values: RoomFormValues) {
    try {
      const filteredHighlights = values.highlights.filter((h) => h.trim() !== "");
      
      const generatedSlug = values.slug || values.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      
      const payload = {
        ...values,
        slug: generatedSlug,
        highlights: filteredHighlights,
        heroImageUrl: values.gallery.length > 0 ? values.gallery[0] : null,
      };

      if (editingRoom) {
        await updateRoom.mutateAsync({ id: editingRoom.id, data: payload as any });
        toast({ title: "✓ Room updated successfully" });
      } else {
        await createRoom.mutateAsync({ data: payload as any });
        toast({ title: "✓ Room created successfully" });
      }

      queryClient.invalidateQueries({ queryKey: getAdminListRoomsQueryKey() });
      setIsDialogOpen(false);
    } catch (err: any) {
      console.error("Room operation error:", err);
      toast({ variant: "destructive", title: "Action failed", description: err.message || "An unexpected error occurred" });
    }
  }

  const onInvalid = (errors: any) => {
    console.error("Form validation errors:", errors);
    const firstKey = Object.keys(errors)[0];
    if (firstKey) {
      const errorMsg = errors[firstKey]?.message || "Invalid field value";
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: `${firstKey}: ${errorMsg}`,
      });
    }
  };

  function toggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === "active" ? "hidden" : "active";
    updateRoom.mutate(
      { id, data: { status: newStatus } },
      {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getAdminListRoomsQueryKey() }),
      }
    );
  }

  function confirmDelete(id: string, name: string) {
    setRoomToDelete({ id, name });
    setIsDeleteDialogOpen(true);
  }

  function executeDelete() {
    if (!roomToDelete) return;
    deleteRoom.mutate(
      { id: roomToDelete.id },
      {
        onSuccess: () => {
          toast({ title: "Room deleted" });
          queryClient.invalidateQueries({ queryKey: getAdminListRoomsQueryKey() });
          setIsDeleteDialogOpen(false);
          setRoomToDelete(null);
        },
        onError: () => toast({ variant: "destructive", title: "Delete failed" }),
      }
    );
  }

  const STATUS_COLORS: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    hidden: "bg-gray-100 text-gray-700",
    maintenance: "bg-orange-100 text-orange-700",
  };

  const categories = [
    { id: "solo", label: "Solo Traveler Packages" },
    { id: "couples", label: "Two Person Packages" },
    { id: "family", label: "Family Accommodation Options" },
  ];

  return (
    <AdminLayout>
      <div className="p-8 md:p-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-serif font-black text-[#0B3D5E]">Rooms & Villas</h1>
            <p className="text-slate-500 font-medium mt-2 text-sm">Manage accommodation options and packages.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Button 
              onClick={openCreateDialog} 
              className="rounded-full px-6 gap-2 bg-[#0B3D5E] hover:bg-[#0B3D5E]/90 text-white shadow-lg shadow-[#0B3D5E]/20 hover:shadow-xl hover:shadow-[#0B3D5E]/30 hover:-translate-y-0.5 transition-all"
              disabled={isLoading || createRoom.isPending || updateRoom.isPending}
            >
              <Plus className="w-4 h-4" /> Add New Room
            </Button>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-[26rem] rounded-[2rem]" />)}
          </div>
        ) : roomList && roomList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roomList.map((room, idx) => {
              const coverImg = (room.gallery && room.gallery.length > 0) ? room.gallery[0] : room.heroImageUrl;
              const catLabel = categories.find(c => c.id === room.category)?.label || room.category;
              return (
              <motion.div 
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-[2.5rem] border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200 hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col"
              >
                <div className="relative h-56 bg-slate-50 overflow-hidden shrink-0">
                  {coverImg ? (
                    <img src={coverImg} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100/50">
                      <BedDouble className="w-12 h-12 text-slate-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D5E]/80 via-[#0B3D5E]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md ${
                      room.status === 'active' ? "bg-emerald-400 text-emerald-950" :
                      room.status === 'hidden' ? "bg-slate-700 text-white" :
                      "bg-amber-400 text-amber-950"
                    }`}>
                      {room.status}
                    </span>
                  </div>
                  {room.isFeatured && (
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-[#F0A500] fill-[#F0A500]" />
                      <span className="text-[10px] font-black text-[#0B3D5E] uppercase tracking-widest">Featured</span>
                    </div>
                  )}
                </div>
                
                <div className="p-8 relative flex-1 flex flex-col">
                  <div className="absolute -top-7 right-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="w-14 h-14 rounded-full bg-white shadow-xl shadow-slate-200/50 border-0 hover:scale-110 hover:shadow-2xl hover:bg-white transition-all duration-300">
                          <MoreVertical className="w-5 h-5 text-[#0B3D5E]" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-xl border-slate-100 p-2">
                        <DropdownMenuItem onClick={() => openEditDialog(room)} className="gap-3 cursor-pointer py-3 rounded-xl font-bold text-slate-600 hover:text-[#0B3D5E] hover:bg-slate-50">
                          <Pencil className="w-4 h-4" /> Edit Room Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleStatus(room.id, room.status)} className="gap-3 cursor-pointer py-3 rounded-xl font-bold text-slate-600 hover:text-[#0B3D5E] hover:bg-slate-50">
                          {room.status === "active" ? <><EyeOff className="w-4 h-4" /> Hide from Public</> : <><Eye className="w-4 h-4" /> Show to Public</>}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => confirmDelete(room.id, room.name)} className="gap-3 cursor-pointer py-3 rounded-xl font-bold text-rose-600 focus:text-rose-700 focus:bg-rose-50">
                          <Trash2 className="w-4 h-4" /> Delete Room
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <p className="text-[10px] font-black text-[#4BBCCC] uppercase tracking-widest mb-3 pr-16">{catLabel}</p>
                  <h3 className="text-2xl font-serif font-black text-[#0B3D5E] mb-2 pr-12 leading-tight">{room.name}</h3>
                  
                  <div className="flex items-baseline gap-1 mb-6 flex-1">
                    <span className="text-3xl font-black text-[#0B3D5E]">€{parseFloat(room.basePricePerNight).toFixed(0)}</span>
                    <span className="text-slate-400 text-sm font-bold">/ night</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs text-slate-500 font-bold uppercase tracking-wider pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#4BBCCC]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      <span>Max {room.maxGuests}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BedDouble className="w-4 h-4 text-[#4BBCCC]" />
                      <span>{room.type}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              )})}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-sm flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-24 h-24 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-6 shadow-inner">
              <BedDouble className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-[#0B3D5E] mb-2">No Rooms Configured</h3>
            <p className="text-slate-500 font-medium mb-8 max-w-sm">Start building your accommodation options to allow guests to book their stay.</p>
            <Button onClick={openCreateDialog} className="rounded-full px-8 bg-[#0B3D5E] hover:bg-[#0B3D5E]/90 shadow-lg shadow-[#0B3D5E]/20 text-white font-bold h-12">Create First Room</Button>
          </motion.div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-0 gap-0 flex flex-col">
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b px-8 py-6 flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-serif">{editingRoom ? "Edit Room" : "Create New Room"}</DialogTitle>
                <DialogDescription>Configure details, pricing, and upload the image gallery.</DialogDescription>
              </div>
            </div>

            <div className="p-8 overflow-y-auto flex-1">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-10">
                  
                  {/* Basic Information */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">1</div>
                      <h3 className="text-lg font-bold">Basic Information</h3>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Name</FormLabel>
                          <FormControl><Input placeholder="e.g. Basic Private Room - Ground Floor" {...field} className="rounded-xl" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="category" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger className="rounded-xl"><SelectValue placeholder="Select category" /></SelectTrigger></FormControl>
                            <SelectContent>
                              {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="description" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Description</FormLabel>
                        <FormControl><Textarea placeholder="Describe the room experience..." className="min-h-[120px] rounded-xl resize-y" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  {/* Capacity & Pricing */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">2</div>
                      <h3 className="text-lg font-bold">Capacity & Pricing</h3>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="type" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger className="rounded-xl"><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="room">Room</SelectItem>
                              <SelectItem value="villa">Villa</SelectItem>
                              <SelectItem value="dormitory">Dormitory</SelectItem>
                              <SelectItem value="suite">Suite</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="basePricePerNight" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price / Night (EUR)</FormLabel>
                          <FormControl><Input type="text" placeholder="e.g. 150" {...field} className="rounded-xl" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <FormField control={form.control} name="maxGuests" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Guests</FormLabel>
                          <FormControl><Input type="number" min="1" {...field} className="rounded-xl" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="bedrooms" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bedrooms</FormLabel>
                          <FormControl><Input type="number" min="0" {...field} className="rounded-xl" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="bathrooms" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bathrooms</FormLabel>
                          <FormControl><Input type="number" min="0" {...field} className="rounded-xl" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>

                  {/* Image Gallery */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">3</div>
                      <h3 className="text-lg font-bold">Image Gallery</h3>
                    </div>
                    
                    <div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {gallery.map((url, index) => (
                          <div key={url} className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-sm">
                            <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                            {index === 0 && (
                              <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow-sm">
                                Main Hero
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className={`aspect-[4/3] rounded-xl border-2 border-dashed border-primary/30 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
                        >
                          <Upload className="w-8 h-8 text-primary/50 mb-2" />
                          <span className="text-xs font-medium text-primary">Upload Photos</span>
                          <span className="text-[10px] text-muted-foreground mt-1">Multiple allowed</span>
                        </div>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                        />
                      </div>
                      {isUploading && (
                        <div className="text-sm text-primary font-medium flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-primary" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                          Uploading images ({uploadProgress}%)...
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">The first image will be used as the main thumbnail. You can upload multiple images at once.</p>
                    </div>
                  </div>

                  {/* Highlights Builder */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">4</div>
                      <h3 className="text-lg font-bold">Features & Inclusions</h3>
                    </div>
                    
                    <div className="bg-muted/50 p-6 rounded-2xl space-y-4">
                      {highlights.map((highlight, index) => (
                        <div key={index} className="flex gap-2 items-start">
                          <div className="w-8 h-10 flex items-center justify-center text-muted-foreground font-bold">{index + 1}.</div>
                          <Input
                            placeholder="e.g. Private balcony with ocean view"
                            value={highlight}
                            onChange={(e) => {
                              const newHighlights = [...highlights];
                              newHighlights[index] = e.target.value;
                              form.setValue("highlights", newHighlights, { shouldValidate: true, shouldDirty: true });
                            }}
                            className="bg-white rounded-xl"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="shrink-0 rounded-xl"
                            onClick={() => {
                              if (highlights.length > 1) {
                                form.setValue("highlights", highlights.filter((_, i) => i !== index), { shouldValidate: true, shouldDirty: true });
                              }
                            }}
                            disabled={highlights.length === 1}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="pl-10">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => form.setValue("highlights", [...highlights, ""], { shouldValidate: true, shouldDirty: true })}
                          className="rounded-full gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Feature
                        </Button>
                      </div>
                      <FormField control={form.control} name="highlights" render={() => <FormItem><FormMessage /></FormItem>} />
                    </div>
                  </div>

                  {/* Publishing Options */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">5</div>
                      <h3 className="text-lg font-bold">Publishing Options</h3>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <FormField control={form.control} name="status" render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-2xl border p-6 bg-card shadow-sm">
                          <div className="space-y-1">
                            <FormLabel className="text-base font-bold">Public Status</FormLabel>
                            <FormDescription>Is this room visible on the website?</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value === "active"} onCheckedChange={(checked) => field.onChange(checked ? "active" : "hidden")} />
                          </FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="isFeatured" render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-2xl border p-6 bg-card shadow-sm">
                          <div className="space-y-1">
                            <FormLabel className="text-base font-bold text-[#F0A500] flex items-center gap-1"><Star className="w-4 h-4 fill-[#F0A500]" /> Featured Room</FormLabel>
                            <FormDescription>Highlight this room on the homepage.</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )} />
                    </div>
                  </div>

                  <DialogFooter className="sticky bottom-0 bg-white/80 backdrop-blur-xl border-t p-6 -mx-8 -mb-8 rounded-b-3xl mt-8">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)} 
                      className="rounded-full px-6"
                      disabled={createRoom.isPending || updateRoom.isPending}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="rounded-full px-8 bg-primary hover:bg-primary/90"
                      disabled={createRoom.isPending || updateRoom.isPending || (editingRoom ? !form.formState.isDirty : false)}
                    >
                      {createRoom.isPending || updateRoom.isPending ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          {editingRoom ? "Saving..." : "Creating..."}
                        </>
                      ) : (editingRoom ? "Save Changes" : "Create Room")}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="rounded-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Room</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <strong>{roomToDelete?.name}</strong>? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={executeDelete} className="rounded-full bg-red-600 hover:bg-red-700 text-white">Delete Room</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </AdminLayout>
  );
}
