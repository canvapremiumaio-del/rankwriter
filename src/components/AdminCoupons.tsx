import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Trash2, Tag, Copy } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  plan: "basic" | "pro" | "plus";
  is_active: boolean;
  max_uses: number;
  used_count: number;
  created_at: string;
  expires_in_days: number | null;
}

const AdminCoupons = () => {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCode, setNewCode] = useState("");
  const [newPlan, setNewPlan] = useState<"basic" | "pro" | "plus">("pro");
  const [newMaxUses, setNewMaxUses] = useState("1");
  const [newExpiry, setNewExpiry] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setCoupons(data as unknown as Coupon[]);
    setLoading(false);
  };

  const generateCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
    setNewCode(code);
  };

  const handleCreate = async () => {
    const trimmed = newCode.trim().toUpperCase();
    if (!trimmed || trimmed.length < 4 || trimmed.length > 20) {
      toast({ title: "Error", description: "Code must be 4-20 characters", variant: "destructive" });
      return;
    }
    const maxUses = parseInt(newMaxUses);
    if (isNaN(maxUses) || maxUses < 1 || maxUses > 10000) {
      toast({ title: "Error", description: "Max uses must be 1-10000", variant: "destructive" });
      return;
    }

    const expiryDays = newExpiry ? parseInt(newExpiry) : null;
    if (expiryDays !== null && (isNaN(expiryDays) || expiryDays < 1 || expiryDays > 365)) {
      toast({ title: "Error", description: "Expiry must be 1-365 days", variant: "destructive" });
      return;
    }

    setCreating(true);
    const { error } = await supabase.from("coupons").insert({
      code: trimmed,
      plan: newPlan,
      max_uses: maxUses,
      expires_in_days: expiryDays,
    } as any);

    if (error) {
      toast({ title: "Error", description: error.message.includes("duplicate") ? "Code already exists" : "Failed to create coupon", variant: "destructive" });
    } else {
      toast({ title: "Coupon Created", description: `Code: ${trimmed}${expiryDays ? ` (${expiryDays} day${expiryDays > 1 ? 's' : ''} access)` : ' (Unlimited)'}` });
      setNewCode("");
      setNewMaxUses("1");
      setNewExpiry("");
      fetchCoupons();
    }
    setCreating(false);
  };

  const handleToggle = async (id: string, current: boolean) => {
    const { error } = await supabase.from("coupons").update({ is_active: !current }).eq("id", id);
    if (!error) setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, is_active: !current } : c)));
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this coupon?")) return;
    const { error } = await supabase.from("coupons").delete().eq("id", id);
    if (!error) setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied!", description: code });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-amber-100">
          <Tag className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Coupon Codes</h2>
          <p className="text-xs text-muted-foreground">Create and manage coupon codes for plan activation</p>
        </div>
      </div>

      {/* Create form */}
      <div className="bg-muted/50 rounded-xl border border-border p-4">
        <p className="text-sm font-medium text-foreground mb-3">Create New Coupon</p>
        <div className="flex flex-wrap gap-2 items-end">
          <div className="flex-1 min-w-[140px]">
            <label className="text-xs text-muted-foreground mb-1 block">Code</label>
            <div className="flex gap-1">
              <Input
                placeholder="COUPON123"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                maxLength={20}
                className="h-9"
              />
              <Button variant="outline" size="sm" onClick={generateCode} className="h-9 px-2 shrink-0" title="Generate">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="w-24">
            <label className="text-xs text-muted-foreground mb-1 block">Plan</label>
            <Select value={newPlan} onValueChange={(v) => setNewPlan(v as "basic" | "pro" | "plus")}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="plus">Plus</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-20">
            <label className="text-xs text-muted-foreground mb-1 block">Max Uses</label>
            <Input
              type="number"
              min={1}
              max={10000}
              value={newMaxUses}
              onChange={(e) => setNewMaxUses(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="w-24">
            <label className="text-xs text-muted-foreground mb-1 block">Expiry (days)</label>
            <Input
              type="number"
              min={1}
              max={365}
              placeholder="∞"
              value={newExpiry}
              onChange={(e) => setNewExpiry(e.target.value)}
              className="h-9"
            />
          </div>
          <Button onClick={handleCreate} disabled={creating} className="h-9">
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">
          Leave "Expiry" empty for unlimited access. Set days (e.g. 1, 7, 30) for temporary pro access.
        </p>
      </div>

      {/* Coupons table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">No coupons yet</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Uses</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono font-bold">{c.code}</code>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copyCode(c.code)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={
                      c.plan === "plus" ? "bg-violet-500/15 text-violet-600"
                        : c.plan === "pro" ? "bg-amber-500/15 text-amber-600" : ""
                    }>
                      {c.plan}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {c.expires_in_days ? (
                      <Badge variant="secondary" className="bg-sky-500/15 text-sky-600 text-[10px]">
                        {c.expires_in_days} day{c.expires_in_days > 1 ? "s" : ""}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs">Unlimited</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {c.used_count} / {c.max_uses}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={c.is_active ? "bg-emerald-500/15 text-emerald-600" : "bg-red-500/15 text-red-600"}
                    >
                      {c.is_active ? "Active" : "Disabled"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleToggle(c.id, c.is_active)} className="text-xs h-7">
                        {c.is_active ? "Disable" : "Enable"}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(c.id)} className="text-destructive hover:text-destructive h-7">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default AdminCoupons;
