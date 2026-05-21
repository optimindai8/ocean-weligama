import { useState } from "react";
import {
  useAdminListPricingRules,
  useAdminCreatePricingRule,
  useAdminDeletePricingRule,
  getAdminListPricingRulesQueryKey,
} from "@workspace/api-client-react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Tag } from "lucide-react";

export default function AdminPricing() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dateFrom: "",
    dateTo: "",
    pricePerNight: "",
    minNights: "1",
  });

  const { data: rules, isLoading } = useAdminListPricingRules({
    query: { queryKey: getAdminListPricingRulesQueryKey() },
  });

  const createRule = useAdminCreatePricingRule();
  const deleteRule = useAdminDeletePricingRule();

  const ruleList = rules as Array<{
    id: string;
    name: string;
    dateFrom: string;
    dateTo: string;
    pricePerNight: string;
    minNights: string;
    isActive: boolean;
  }> | undefined;

  function handleCreate() {
    if (!formData.name || !formData.dateFrom || !formData.dateTo || !formData.pricePerNight) {
      toast({ variant: "destructive", title: "All fields required" });
      return;
    }
    createRule.mutate(
      { data: { ...formData, isActive: true, priority: "10" } },
      {
        onSuccess: () => {
          toast({ title: "Pricing rule created" });
          queryClient.invalidateQueries({ queryKey: getAdminListPricingRulesQueryKey() });
          setShowForm(false);
          setFormData({ name: "", dateFrom: "", dateTo: "", pricePerNight: "", minNights: "1" });
        },
        onError: () => toast({ variant: "destructive", title: "Create failed" }),
      }
    );
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this pricing rule?")) return;
    deleteRule.mutate(
      { id },
      {
        onSuccess: () => {
          toast({ title: "Rule deleted" });
          queryClient.invalidateQueries({ queryKey: getAdminListPricingRulesQueryKey() });
        },
        onError: () => toast({ variant: "destructive", title: "Delete failed" }),
      }
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pricing Rules</h1>
            <p className="text-muted-foreground text-sm mt-1">Set seasonal and special pricing.</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#F0A500] hover:bg-[#D99500] text-white rounded-full gap-2"
            data-testid="button-add-pricing-rule"
          >
            <Plus className="w-4 h-4" /> Add Rule
          </Button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="bg-card rounded-2xl border border-border p-6 mb-6">
            <h3 className="font-bold text-foreground mb-4">New Pricing Rule</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Rule Name</label>
                <Input
                  placeholder="High Season, Christmas..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  data-testid="input-rule-name"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">From Date</label>
                <Input
                  type="date"
                  value={formData.dateFrom}
                  onChange={(e) => setFormData({ ...formData, dateFrom: e.target.value })}
                  data-testid="input-rule-date-from"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">To Date</label>
                <Input
                  type="date"
                  value={formData.dateTo}
                  onChange={(e) => setFormData({ ...formData, dateTo: e.target.value })}
                  data-testid="input-rule-date-to"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Price per Night ($)</label>
                <Input
                  type="number"
                  placeholder="120"
                  value={formData.pricePerNight}
                  onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                  data-testid="input-rule-price"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Min Nights</label>
                <Input
                  type="number"
                  placeholder="2"
                  value={formData.minNights}
                  onChange={(e) => setFormData({ ...formData, minNights: e.target.value })}
                  data-testid="input-rule-min-nights"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleCreate} disabled={createRule.isPending} className="rounded-full bg-primary hover:bg-secondary" data-testid="button-save-rule">
                {createRule.isPending ? "Saving..." : "Save Rule"}
              </Button>
              <Button variant="ghost" onClick={() => setShowForm(false)} className="rounded-full" data-testid="button-cancel-rule">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
          </div>
        ) : ruleList && ruleList.length > 0 ? (
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  {["Rule Name", "Date From", "Date To", "Price/Night", "Min Nights", "Status", ""].map((h) => (
                    <th key={h} className="text-left px-5 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ruleList.map((rule) => (
                  <tr key={rule.id} className="hover:bg-muted/20" data-testid={`row-rule-${rule.id}`}>
                    <td className="px-5 py-4 font-medium text-foreground">
                      <div className="flex items-center gap-2"><Tag className="w-4 h-4 text-accent" />{rule.name}</div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{rule.dateFrom}</td>
                    <td className="px-5 py-4 text-muted-foreground">{rule.dateTo}</td>
                    <td className="px-5 py-4 font-bold text-primary">${rule.pricePerNight}</td>
                    <td className="px-5 py-4 text-muted-foreground">{rule.minNights}n</td>
                    <td className="px-5 py-4">
                      <Badge className={rule.isActive ? "bg-green-100 text-green-700 border-0" : "bg-gray-100 text-gray-700 border-0"}>
                        {rule.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50 rounded-full"
                        onClick={() => handleDelete(rule.id)}
                        data-testid={`button-delete-rule-${rule.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border flex items-center justify-center h-48">
            <div className="text-center">
              <Tag className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
              <p className="text-muted-foreground text-sm">No pricing rules yet</p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
