import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import NavBar from "@/components/NavBar";
import AdminCoupons from "@/components/AdminCoupons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Trash2, Shield, Users, Search, Crown, UserCircle } from "lucide-react";

interface UserData {
  id: string;
  email: string | null;
  created_at: string;
  plan: "basic" | "pro";
}

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [search, setSearch] = useState("");
  const [updatingPlan, setUpdatingPlan] = useState<string | null>(null);

  // Check admin role
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth", { replace: true });
      return;
    }

    const checkAdmin = async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!data) {
        navigate("/", { replace: true });
        return;
      }
      setIsAdmin(true);
      setChecking(false);
    };

    checkAdmin();
  }, [user, authLoading, navigate]);

  // Fetch users
  useEffect(() => {
    if (!isAdmin) return;
    fetchUsers();
  }, [isAdmin]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, email, created_at")
      .order("created_at", { ascending: false });

    if (profilesError) {
      toast({ title: "Error", description: "Failed to load users", variant: "destructive" });
      setLoadingUsers(false);
      return;
    }

    const { data: plans } = await supabase
      .from("user_plans")
      .select("user_id, plan");

    const planMap = new Map(plans?.map((p) => [p.user_id, p.plan]) || []);

    const merged: UserData[] = (profiles || []).map((p) => ({
      id: p.id,
      email: p.email,
      created_at: p.created_at,
      plan: (planMap.get(p.id) as "basic" | "pro") || "basic",
    }));

    setUsers(merged);
    setLoadingUsers(false);
  };

  const handlePlanChange = async (userId: string, newPlan: "basic" | "pro") => {
    setUpdatingPlan(userId);
    const { error } = await supabase
      .from("user_plans")
      .update({ plan: newPlan, updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    if (error) {
      toast({ title: "Error", description: "Failed to update plan", variant: "destructive" });
    } else {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, plan: newPlan } : u)));
      toast({ title: "Success", description: `Plan updated to ${newPlan}` });
    }
    setUpdatingPlan(null);
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === user?.id) {
      toast({ title: "Error", description: "You cannot delete yourself", variant: "destructive" });
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete this user? This cannot be undone.");
    if (!confirmed) return;

    // Delete profile (cascade will handle related data)
    const { error } = await supabase.from("profiles").delete().eq("id", userId);

    if (error) {
      toast({ title: "Error", description: "Failed to delete user", variant: "destructive" });
    } else {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast({ title: "Success", description: "User removed" });
    }
  };

  const filteredUsers = users.filter(
    (u) => !search || u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading || checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Admin Panel
            </h1>
            <p className="text-sm text-muted-foreground">Manage users and their subscription plans</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-100">
                <Users className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{users.length}</p>
                <p className="text-xs text-muted-foreground">Total Users</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-sky-100">
                <UserCircle className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{users.filter((u) => u.plan === "basic").length}</p>
                <p className="text-xs text-muted-foreground">Basic Users</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <Crown className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{users.filter((u) => u.plan === "pro").length}</p>
                <p className="text-xs text-muted-foreground">Pro Users</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11"
          />
        </div>

        {/* Users Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {loadingUsers ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {u.email || "No email"}
                          {u.id === user?.id && (
                            <Badge variant="secondary" className="text-[10px]">You</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(u.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={u.plan}
                          onValueChange={(val) => handlePlanChange(u.id, val as "basic" | "pro")}
                          disabled={updatingPlan === u.id}
                        >
                          <SelectTrigger className="w-28 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                Basic
                              </span>
                            </SelectItem>
                            <SelectItem value="pro">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-violet-500" />
                                Pro
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(u.id)}
                          disabled={u.id === user?.id}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
