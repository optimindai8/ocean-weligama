import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLayout } from "@/components/admin-layout";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Check,
  ChevronDown,
  AlertTriangle,
  HelpCircle,
  Loader2,
  Save,
  GripVertical,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.DEV
  ? import.meta.env.VITE_API_URL || "http://localhost:8080"
  : "";

type FaqItem = {
  id: string;
  category: string;
  question: string;
  answer: string;
  sortOrder: number;
  createdAt: string;
};

function getAuthHeaders() {
  const token = localStorage.getItem("ow-admin-token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}/api${path}`, {
    ...options,
    headers: { ...getAuthHeaders(), ...(options?.headers || {}) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteModal({
  faq,
  onConfirm,
  onCancel,
  loading,
}: {
  faq: FaqItem;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl border border-red-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-5">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-[#0B3D5E] mb-2">Delete FAQ?</h3>
          <p className="text-slate-500 text-sm mb-2 leading-relaxed">
            You are about to permanently delete:
          </p>
          <p className="font-semibold text-[#0B3D5E] text-sm bg-slate-50 rounded-xl px-4 py-3 mb-6 border border-slate-200 w-full">
            "{faq.question}"
          </p>
          <p className="text-red-500 text-xs mb-8">This action cannot be undone.</p>
          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Delete
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── FAQ Form Modal ────────────────────────────────────────────────────────────
function FaqFormModal({
  faq,
  allCategories,
  onSave,
  onClose,
}: {
  faq: Partial<FaqItem> | null;
  allCategories: string[];
  onSave: (data: { category: string; question: string; answer: string }) => Promise<void>;
  onClose: () => void;
}) {
  const isEdit = !!faq?.id;
  const [category, setCategory] = useState(faq?.category || "");
  const [customCategory, setCustomCategory] = useState("");
  const [question, setQuestion] = useState(faq?.question || "");
  const [answer, setAnswer] = useState(faq?.answer || "");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const finalCategory = category === "__new__" ? customCategory : category;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!finalCategory.trim()) errs.category = "Category is required";
    if (!question.trim()) errs.question = "Question is required";
    if (!answer.trim()) errs.answer = "Answer is required";
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      await onSave({ category: finalCategory.trim(), question: question.trim(), answer: answer.trim() });
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        className="bg-white rounded-[2rem] p-8 max-w-2xl w-full shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B3D5E] text-white flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0B3D5E]">{isEdit ? "Edit FAQ" : "New FAQ"}</h2>
              <p className="text-xs text-slate-400">{isEdit ? "Update existing question" : "Add a new frequently asked question"}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#0B3D5E] hover:border-[#0B3D5E]/30 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-[#0B3D5E] mb-2">Category *</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setErrors((p) => ({ ...p, category: "" })); }}
                className={`w-full px-4 py-3 rounded-xl border text-sm bg-slate-50 focus:bg-white focus:border-[#0B3D5E] outline-none transition-colors appearance-none pr-10 ${errors.category ? "border-red-400 bg-red-50" : "border-slate-200"}`}
              >
                <option value="">Select category...</option>
                {allCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="__new__">+ Create new category</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            {category === "__new__" && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => { setCustomCategory(e.target.value); setErrors((p) => ({ ...p, category: "" })); }}
                placeholder="e.g. Activities & Excursions"
                className="w-full mt-2 px-4 py-3 rounded-xl border border-[#0B3D5E]/40 text-sm bg-white focus:border-[#0B3D5E] outline-none transition-colors"
              />
            )}
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          {/* Question */}
          <div>
            <label className="block text-sm font-semibold text-[#0B3D5E] mb-2">Question *</label>
            <input
              type="text"
              value={question}
              onChange={(e) => { setQuestion(e.target.value); setErrors((p) => ({ ...p, question: "" })); }}
              placeholder="e.g. What is included in the surf package?"
              className={`w-full px-4 py-3 rounded-xl border text-sm bg-slate-50 focus:bg-white focus:border-[#0B3D5E] outline-none transition-colors ${errors.question ? "border-red-400 bg-red-50" : "border-slate-200"}`}
            />
            {errors.question && <p className="text-red-500 text-xs mt-1">{errors.question}</p>}
          </div>

          {/* Answer */}
          <div>
            <label className="block text-sm font-semibold text-[#0B3D5E] mb-2">Answer *</label>
            <textarea
              value={answer}
              onChange={(e) => { setAnswer(e.target.value); setErrors((p) => ({ ...p, answer: "" })); }}
              placeholder="Provide a clear, helpful answer..."
              rows={6}
              className={`w-full px-4 py-3 rounded-xl border text-sm bg-slate-50 focus:bg-white focus:border-[#0B3D5E] outline-none transition-colors resize-y ${errors.answer ? "border-red-400 bg-red-50" : "border-slate-200"}`}
            />
            {errors.answer && <p className="text-red-500 text-xs mt-1">{errors.answer}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors text-sm">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-[#0B3D5E] text-white font-semibold hover:bg-[#0a3252] transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isEdit ? "Save Changes" : "Create FAQ"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [editFaq, setEditFaq] = useState<FaqItem | null | "new">(null);
  const [deleteFaq, setDeleteFaq] = useState<FaqItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { toast } = useToast();

  // Load FAQs on mount
  useState(() => {
    (async () => {
      try {
        const data = await apiFetch("/v1/admin/faqs");
        setFaqs(data);
      } catch (err: any) {
        toast({ title: "Failed to load FAQs", description: err.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    })();
  });

  const allCategories = useMemo(() => {
    const cats = Array.from(new Set(faqs.map((f) => f.category)));
    return cats.sort();
  }, [faqs]);

  const filtered = useMemo(() => {
    return faqs.filter((f) => {
      const matchCat = filterCat === "all" || f.category === filterCat;
      const matchSearch =
        !search ||
        f.question.toLowerCase().includes(search.toLowerCase()) ||
        f.answer.toLowerCase().includes(search.toLowerCase()) ||
        f.category.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [faqs, filterCat, search]);

  const grouped = useMemo(() => {
    const map: Record<string, FaqItem[]> = {};
    filtered.forEach((f) => {
      if (!map[f.category]) map[f.category] = [];
      map[f.category].push(f);
    });
    return map;
  }, [filtered]);

  async function handleSave(data: { category: string; question: string; answer: string }) {
    try {
      if (editFaq === "new") {
        const created = await apiFetch("/v1/admin/faqs", {
          method: "POST",
          body: JSON.stringify(data),
        });
        setFaqs((prev) => [created, ...prev]);
        toast({ title: "FAQ created!", description: `"${created.question}" added successfully.` });
      } else if (editFaq) {
        const updated = await apiFetch(`/v1/admin/faqs/${editFaq.id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        });
        setFaqs((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
        toast({ title: "FAQ updated!", description: "Changes saved successfully." });
      }
      setEditFaq(null);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      throw err;
    }
  }

  async function handleDelete() {
    if (!deleteFaq) return;
    setDeleteLoading(true);
    try {
      await apiFetch(`/v1/admin/faqs/${deleteFaq.id}`, { method: "DELETE" });
      setFaqs((prev) => prev.filter((f) => f.id !== deleteFaq.id));
      toast({ title: "FAQ deleted", description: `"${deleteFaq.question}" has been removed.` });
      setDeleteFaq(null);
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <AdminLayout>
      <div className="p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-[#0B3D5E] text-white flex items-center justify-center shadow-lg shadow-[#0B3D5E]/20">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#0B3D5E] font-serif">FAQ Manager</h1>
                <p className="text-slate-400 text-sm">Manage frequently asked questions on the public website</p>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <div className="px-3 py-1.5 bg-[#0B3D5E]/10 text-[#0B3D5E] rounded-lg text-xs font-bold">
                {faqs.length} Total FAQs
              </div>
              <div className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-xs font-bold">
                {allCategories.length} Categories
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setEditFaq("new")}
            className="flex items-center gap-2 px-6 py-3 bg-[#0B3D5E] text-white rounded-2xl font-bold text-sm shadow-lg shadow-[#0B3D5E]/20 hover:bg-[#0a3252] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New FAQ
          </motion.button>
        </div>

        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions or answers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-[#0B3D5E] placeholder:text-slate-400 focus:border-[#0B3D5E]/40 focus:outline-none transition-colors shadow-sm"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0B3D5E]">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="relative">
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-[#0B3D5E] font-semibold focus:border-[#0B3D5E]/40 focus:outline-none transition-colors shadow-sm"
            >
              <option value="all">All Categories</option>
              {allCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-8 h-8 text-[#0B3D5E] animate-spin mb-4" />
            <p className="text-slate-400 text-sm">Loading FAQs...</p>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-slate-200 rounded-[2rem] bg-white"
          >
            <HelpCircle className="w-12 h-12 text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-[#0B3D5E] mb-1">
              {search || filterCat !== "all" ? "No results found" : "No FAQs yet"}
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              {search || filterCat !== "all" ? "Try adjusting your filters." : "Get started by adding your first FAQ."}
            </p>
            {!search && filterCat === "all" && (
              <button
                onClick={() => setEditFaq("new")}
                className="flex items-center gap-2 px-6 py-3 bg-[#0B3D5E] text-white rounded-2xl font-bold text-sm hover:bg-[#0a3252] transition-colors"
              >
                <Plus className="w-4 h-4" /> Add First FAQ
              </button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-10">
            {Object.entries(grouped).map(([category, items], catIdx) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIdx * 0.06 }}
              >
                {/* Category header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-[#0B3D5E] flex items-center justify-center shadow-sm">
                    <HelpCircle className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-[#0B3D5E] font-serif">{category}</h2>
                  <span className="px-2.5 py-1 bg-[#0B3D5E]/10 text-[#0B3D5E] rounded-full text-[10px] font-black tracking-wide">
                    {items.length} {items.length === 1 ? "question" : "questions"}
                  </span>
                </div>

                <div className="space-y-3">
                  {items.map((faq, idx) => {
                    const isOpen = expandedId === faq.id;
                    return (
                      <motion.div
                        key={faq.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ delay: idx * 0.04 }}
                        className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md ${isOpen ? "border-[#0B3D5E]/30 shadow-[#0B3D5E]/5" : "border-slate-100"}`}
                      >
                        {/* Question row */}
                        <div className="flex items-center gap-3 px-5 py-4">
                          <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0 cursor-grab" />
                          <button
                            className="flex-1 text-left"
                            onClick={() => setExpandedId(isOpen ? null : faq.id)}
                          >
                            <span className={`font-semibold text-sm transition-colors ${isOpen ? "text-[#0B3D5E]" : "text-slate-700"}`}>
                              {faq.question}
                            </span>
                          </button>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setEditFaq(faq)}
                              className="w-8 h-8 rounded-xl bg-[#0B3D5E]/5 text-[#0B3D5E] hover:bg-[#0B3D5E]/10 flex items-center justify-center transition-colors"
                              title="Edit FAQ"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setDeleteFaq(faq)}
                              className="w-8 h-8 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors"
                              title="Delete FAQ"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </motion.button>
                            <button
                              onClick={() => setExpandedId(isOpen ? null : faq.id)}
                              className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-[#0B3D5E] border-[#0B3D5E] text-white" : "border-slate-200 text-slate-400 hover:border-[#0B3D5E]/30"}`}
                            >
                              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                            </button>
                          </div>
                        </div>

                        {/* Answer expand */}
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                            >
                              <div className="px-5 pb-5 pt-0 pl-12 border-t border-slate-100">
                                <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-wrap pt-3">
                                  {faq.answer}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {editFaq !== null && (
          <FaqFormModal
            faq={editFaq === "new" ? {} : editFaq}
            allCategories={allCategories}
            onSave={handleSave}
            onClose={() => setEditFaq(null)}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteFaq && (
          <DeleteModal
            faq={deleteFaq}
            onConfirm={handleDelete}
            onCancel={() => setDeleteFaq(null)}
            loading={deleteLoading}
          />
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
