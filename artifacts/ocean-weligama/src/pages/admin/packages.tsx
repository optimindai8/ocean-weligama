import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useAdminListServices,
  useAdminCreateService,
  useAdminUpdateService,
  useAdminDeleteService,
  getAdminListServicesQueryKey,
} from "@workspace/api-client-react";
import {
  Service,
  ServiceInput,
  ServiceUpdate,
} from "@workspace/api-client-react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  MoreVertical,
  Settings2,
  Sparkles,
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

const serviceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().optional(),
  imageUrl: z.string().nullable().optional(),
  highlights: z.array(z.string().min(1)).min(1, "Add at least one item of inclusion"),
  type: z.enum(["main", "optional"]),
  category: z.string().nullable().optional(),
  basePrice: z.string().min(1, "Price is required").regex(/^\d+(\.\d{1,2})?$/, "Invalid price format (e.g. 99.99)"),
  isActive: z.boolean().default(true),
  isBookable: z.boolean().default(true),
  sortOrder: z.string().default("0"),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

export default function AdminPackages() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newHighlight, setNewHighlight] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"main" | "optional">("main");

  const { data: services, isLoading } = useAdminListServices({
    query: { queryKey: getAdminListServicesQueryKey() },
  });

  const createService = useAdminCreateService();
  const updateService = useAdminUpdateService();
  const deleteService = useAdminDeleteService();

  const getCategoryLabel = (cat: string | null | undefined): string => {
    if (!cat) return "Main Package";
    if (cat === "Beginner Surf Packages") return "Beginning Surf";
    if (cat === "Advance Surf Packages") return "Advance Surf";
    if (cat === "Yoga Retreat Packages") return "Yoga Surf";
    return cat;
  };

  const filteredServices = (services as Service[] || []).filter((s) => {
    if (activeTab === "main") {
      return s.type === "main";
    } else {
      return s.type === "optional" && [
        "Beginner Surf Packages",
        "Advance Surf Packages",
        "Yoga Retreat Packages"
      ].includes(s.category || "");
    }
  });

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      imageUrl: "",
      highlights: [],
      type: "main",
      category: "Main Package",
      basePrice: "0.00",
      isActive: true,
      isBookable: true,
      sortOrder: "0",
    },
  });

  const handleOpenDialog = (service?: Service) => {
    if (service) {
      setEditingService(service);
      form.reset({
        name: service.name,
        slug: service.slug,
        description: service.description || "",
        imageUrl: service.imageUrl || "",
        highlights: service.highlights || [],
        type: service.type as "main" | "optional",
        category: service.category || "Main Package",
        basePrice: service.basePrice,
        isActive: service.isActive,
        isBookable: service.isBookable ?? true,
        sortOrder: service.sortOrder?.toString() || "0",
      });
    } else {
      setEditingService(null);
      form.reset({
        name: "",
        slug: "",
        description: "",
        imageUrl: "",
        highlights: [],
        type: "main",
        category: "Main Package",
        basePrice: "0.00",
        isActive: true,
        isBookable: true,
        sortOrder: "0",
      });
    }
    setIsDialogOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const isDev = import.meta.env.DEV;
      const apiUrl = isDev ? (import.meta.env.VITE_API_URL || "http://localhost:8080") : "";
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("ow-admin-token")}`
        },
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        let errorMsg = "Upload failed";
        try {
          const errorData = JSON.parse(text);
          errorMsg = errorData.error || errorMsg;
        } catch {
          errorMsg = `Server error (${response.status}): ${text.slice(0, 100)}`;
        }
        throw new Error(errorMsg);
      }
      
      const data = await response.json();
      form.setValue("imageUrl", data.url);
      toast({ title: "Image uploaded successfully" });
    } catch (err: any) {
      toast({ 
        variant: "destructive", 
        title: "Upload failed", 
        description: err.message || "Could not upload image." 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const addHighlight = () => {
    if (!newHighlight.trim()) return;
    const current = form.getValues("highlights") || [];
    form.setValue("highlights", [...current, newHighlight.trim()]);
    setNewHighlight("");
  };

  const removeHighlight = (index: number) => {
    const current = form.getValues("highlights") || [];
    form.setValue("highlights", current.filter((_, i) => i !== index));
  };

  const onSubmit = (values: ServiceFormValues) => {
    const data = {
      ...values,
      description: values.description || null,
      imageUrl: values.imageUrl || null,
      category: values.category || "Main Package",
      unit: "flat_rate" as const,
      sortOrder: values.sortOrder ? parseInt(values.sortOrder, 10) || 0 : 0,
    };

    if (editingService) {
      updateService.mutate(
        { id: editingService.id, data: data as ServiceUpdate },
        {
          onSuccess: () => {
            toast({ title: "Package updated successfully" });
            setIsDialogOpen(false);
            queryClient.invalidateQueries({ queryKey: getAdminListServicesQueryKey() });
          },
          onError: (err: any) => {
            toast({ 
              variant: "destructive", 
              title: "Update failed", 
              description: err.response?.data?.error || "Unknown error occurred" 
            });
          },
        }
      );
    } else {
      createService.mutate(
        { data: data as ServiceInput },
        {
          onSuccess: () => {
            toast({ title: "Package created successfully" });
            setIsDialogOpen(false);
            queryClient.invalidateQueries({ queryKey: getAdminListServicesQueryKey() });
          },
          onError: (err: any) => {
            toast({ 
              variant: "destructive", 
              title: "Creation failed", 
              description: err.response?.data?.error || "Unknown error occurred" 
            });
          },
        }
      );
    }
  };

  const handleDelete = () => {
    if (!deletingId) return;
    deleteService.mutate(
      { id: deletingId },
      {
        onSuccess: () => {
          toast({ title: "Package deleted successfully" });
          setDeletingId(null);
          queryClient.invalidateQueries({ queryKey: getAdminListServicesQueryKey() });
        },
        onError: (err: any) => {
          toast({ 
            variant: "destructive", 
            title: "Deletion failed", 
            description: err.data?.error || err.message || "Unknown error occurred" 
          });
        },
      }
    );
  };

  const toggleActive = (service: Service) => {
    updateService.mutate(
      { id: service.id, data: { isActive: !service.isActive } },
      {
        onSuccess: () => {
          toast({ title: service.isActive ? "Package deactivated" : "Package activated" });
          queryClient.invalidateQueries({ queryKey: getAdminListServicesQueryKey() });
        },
        onError: () => toast({ variant: "destructive", title: "Update failed" }),
      }
    );
  };

  return (
    <AdminLayout>
      <div className="p-8 md:p-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-serif font-black text-[#0B3D5E]">
              Packages Administration
            </h1>
            <p className="text-slate-500 font-medium mt-2 text-sm">
              Manage Surf packages, Retreats, and Main packages.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Button 
              onClick={() => handleOpenDialog()} 
              className="rounded-full px-6 gap-2 bg-[#0B3D5E] hover:bg-[#0B3D5E]/90 text-white shadow-lg shadow-[#0B3D5E]/20 hover:shadow-xl hover:shadow-[#0B3D5E]/30 hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add New Package
            </Button>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex border-b border-slate-200 mb-8 gap-6 px-2"
        >
          <button
            onClick={() => setActiveTab("main")}
            className={`pb-4 px-2 text-sm font-black tracking-wide uppercase transition-all relative ${
              activeTab === "main"
                ? "text-[#0B3D5E]"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Surf Main Packages
            {activeTab === "main" && (
              <motion.div layoutId="packageTabIndicator" className="absolute bottom-0 left-0 right-0 h-1 bg-[#0B3D5E] rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("optional")}
            className={`pb-4 px-2 text-sm font-black tracking-wide uppercase transition-all relative ${
              activeTab === "optional"
                ? "text-[#0B3D5E]"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Optional Packages
            {activeTab === "optional" && (
              <motion.div layoutId="packageTabIndicator" className="absolute bottom-0 left-0 right-0 h-1 bg-[#0B3D5E] rounded-t-full" />
            )}
          </button>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-[22rem] rounded-[2.5rem]" />
            ))}
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, idx) => (
              <motion.div 
                key={service.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 flex flex-col"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 rounded-[1.2rem] overflow-hidden shadow-md shadow-slate-200/50 group-hover:scale-105 transition-transform bg-slate-50">
                    {service.imageUrl ? (
                      <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#0B3D5E]/5 flex items-center justify-center text-[#0B3D5E]/30">
                        <Sparkles className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-widest font-black border-0 ${service.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>
                      {service.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-[#0B3D5E] opacity-0 group-hover:opacity-100 transition-all">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-xl border-slate-100 p-2">
                        <DropdownMenuItem onClick={() => handleOpenDialog(service)} className="gap-3 cursor-pointer py-3 rounded-xl font-bold text-slate-600 hover:text-[#0B3D5E] hover:bg-slate-50">
                          <Pencil className="w-4 h-4" /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleActive(service)} className="gap-3 cursor-pointer py-3 rounded-xl font-bold text-slate-600 hover:text-[#0B3D5E] hover:bg-slate-50">
                          {service.isActive ? <><EyeOff className="w-4 h-4" /> Deactivate</> : <><Eye className="w-4 h-4" /> Activate</>}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setDeletingId(service.id)} 
                          className="gap-3 cursor-pointer py-3 rounded-xl font-bold text-rose-600 focus:text-rose-700 focus:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" /> Delete Permanently
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl font-serif font-black text-[#0B3D5E] mb-2 leading-tight pr-4">{service.name}</h3>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest text-[#4BBCCC] border-[#4BBCCC]/30 bg-[#4BBCCC]/5 rounded-md px-2 py-0.5">
                      {getCategoryLabel(service.category)}
                    </Badge>
                    <span className="text-[10px] text-slate-400 font-mono font-medium truncate max-w-[120px]">/{service.slug}</span>
                  </div>
                  <p className="text-sm text-slate-500 font-medium line-clamp-3 mb-6 min-h-[4.5rem]">
                    {service.description || "No description provided."}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-auto flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-0.5">Price</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-[#0B3D5E]">€{service.basePrice}</span>
                    </div>
                  </div>
                  {service.isBookable && (
                    <Badge className="bg-[#4BBCCC]/10 text-[#4BBCCC] border-none font-bold text-[10px] uppercase tracking-widest px-3 py-1 flex gap-1.5 items-center rounded-full shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#4BBCCC] animate-pulse" />
                      Bookable
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-sm p-20 flex flex-col items-center justify-center text-center"
          >
            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner">
              <Sparkles className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-2xl font-black text-[#0B3D5E] mb-2">No packages yet</h2>
            <p className="text-slate-500 font-medium max-w-md mb-8">
              Start adding your packages or retreats to show them to your guests.
            </p>
            <Button onClick={() => handleOpenDialog()} className="rounded-full px-8 bg-[#0B3D5E] hover:bg-[#0B3D5E]/90 text-white font-bold h-12 shadow-lg shadow-[#0B3D5E]/20">
              Create Your First Package
            </Button>
          </motion.div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[32px] p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                {editingService ? <><Settings2 className="w-6 h-6 text-primary" /> Edit Package</> : <><Plus className="w-6 h-6 text-primary" /> Add New Package</>}
              </DialogTitle>
              <DialogDescription>
                Fill in the details below to {editingService ? "update your existing" : "create a new"} package.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Left Column: Visuals & Basics */}
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <Label>Package Image</Label>
                      <div 
                        onClick={() => !form.watch("imageUrl") && fileInputRef.current?.click()}
                        className={`relative aspect-video rounded-3xl overflow-hidden bg-muted border-2 border-dashed border-border flex items-center justify-center group ${!form.watch("imageUrl") ? "cursor-pointer hover:border-primary/50 transition-colors" : ""}`}
                      >
                        {form.watch("imageUrl") ? (
                          <>
                            <img src={form.watch("imageUrl")!} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button 
                                type="button" 
                                variant="secondary" 
                                size="sm" 
                                className="rounded-full gap-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  fileInputRef.current?.click();
                                }}
                              >
                                <Upload className="w-4 h-4" /> Change
                              </Button>
                              <Button 
                                type="button" 
                                variant="destructive" 
                                size="sm" 
                                className="rounded-full gap-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  form.setValue("imageUrl", "");
                                }}
                              >
                                <X className="w-4 h-4" /> Remove
                              </Button>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            {isUploading ? (
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                            ) : (
                              <>
                                <Upload className="w-10 h-10 mb-2 opacity-50" />
                                <p className="text-sm font-medium">Click to upload image</p>
                                <p className="text-[10px] uppercase tracking-wider">JPG, PNG, WebP up to 5MB</p>
                              </>
                            )}
                          </div>
                        )}
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          className="hidden" 
                          onChange={handleFileUpload}
                          accept="image/*"
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Or paste image URL here..." {...field} value={field.value || ""} className="rounded-xl text-xs bg-muted/30 border-none" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Package Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Surfer Starter Package" {...field} className="rounded-xl h-12 text-lg font-semibold" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slug (URL Handle)</FormLabel>
                            <FormControl>
                              <Input placeholder="surfer-starter-package" {...field} className="rounded-xl font-mono text-sm" />
                            </FormControl>
                            <FormDescription>URL-friendly handle: oceanweligama.com/packages/<strong>{field.value || "slug"}</strong></FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Right Column: Configuration */}
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 gap-6">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Package Type</FormLabel>
                            <Select
                              onValueChange={(val) => {
                                field.onChange(val);
                                if (val === "main") {
                                  form.setValue("category", "Main Package");
                                } else {
                                  form.setValue("category", "Beginner Surf Packages");
                                }
                              }}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="rounded-xl h-12">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-xl">
                                <SelectItem value="main">Surf Main Package</SelectItem>
                                <SelectItem value="optional">Optional Package</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {form.watch("type") === "optional" && (
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Optional Package Sub-type</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value || "Beginner Surf Packages"}
                              >
                                <FormControl>
                                  <SelectTrigger className="rounded-xl h-12">
                                    <SelectValue placeholder="Select sub-type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="rounded-xl">
                                  <SelectItem value="Beginner Surf Packages">Beginning Surf</SelectItem>
                                  <SelectItem value="Advance Surf Packages">Advance Surf</SelectItem>
                                  <SelectItem value="Yoga Retreat Packages">Yoga Surf</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="basePrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price (€)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">€</span>
                                <Input type="text" placeholder="0.00" {...field} className="pl-9 rounded-xl font-bold h-12" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sortOrder"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sort Order</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0" {...field} className="rounded-xl h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="highlights"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <Label>What's Included (Add One by One)</Label>
                          <div className="flex gap-2">
                            <Input 
                              placeholder="e.g. 7 nights accommodation" 
                              value={newHighlight} 
                              onChange={(e) => setNewHighlight(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHighlight())}
                              className="rounded-xl"
                            />
                            <Button type="button" onClick={addHighlight} size="icon" className="rounded-xl shrink-0">
                              <Plus className="w-5 h-5" />
                            </Button>
                          </div>
                          <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto border border-border p-3 rounded-2xl bg-muted/10">
                            {field.value?.map((h, i) => (
                              <div key={i} className="flex items-center justify-between bg-muted/40 hover:bg-muted/70 transition-colors px-3 py-1.5 rounded-xl border border-border/40">
                                <span className="text-sm font-medium text-foreground">{h}</span>
                                <button 
                                  type="button" 
                                  onClick={() => removeHighlight(i)}
                                  className="w-6 h-6 rounded-full hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition-colors text-muted-foreground"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                            {(!field.value || field.value.length === 0) && (
                              <p className="text-[11px] text-muted-foreground italic text-center py-4">Add the things included in this package.</p>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4 pt-4">
                      <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem className="flex-1 flex flex-row items-center justify-between rounded-2xl border p-4 bg-muted/20">
                            <div className="space-y-0.5">
                              <FormLabel className="text-sm font-bold">Active</FormLabel>
                              <p className="text-[10px] text-muted-foreground">Visible to guests.</p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="isBookable"
                        render={({ field }) => (
                          <FormItem className="flex-1 flex flex-row items-center justify-between rounded-2xl border p-4 bg-muted/20">
                            <div className="space-y-0.5">
                              <FormLabel className="text-sm font-bold">Bookable</FormLabel>
                              <p className="text-[10px] text-muted-foreground">Accepts bookings.</p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-6 border-t">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the experience or add additional package notes..." 
                            className="min-h-[120px] rounded-2xl resize-none p-4" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter className="pt-8 border-t border-border">
                  <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-full px-8">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createService.isPending || updateService.isPending} className="rounded-full px-12 h-12 bg-primary shadow-xl shadow-primary/20">
                    {createService.isPending || updateService.isPending ? "Saving..." : editingService ? "Update Package" : "Create Package"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
          <AlertDialogContent className="rounded-[32px] p-8">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-bold">Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                This will permanently delete this package and all its associated data. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="pt-6">
              <AlertDialogCancel className="rounded-full border-none bg-muted hover:bg-muted/80">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Yes, Delete Permanently
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
