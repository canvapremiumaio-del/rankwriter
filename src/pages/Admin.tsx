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
import { Loader2, Trash2, Shield, Users, Search, Crown, UserCircle, ShieldCheck, ShieldOff, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface UserData {
  id: string;
  email: string | null;
  created_at: string;
  plan: "basic" | "pro" | "plus";
  isAdmin: boolean;
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
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);

  // Add user dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPlan, setNewPlan] = useState<"basic" | "pro" | "plus">("basic");
  const [addingUser, setAddingUser] = useState(false);

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

  useEffect(() => {
    if (!isAdmin) return;
    fetchUsers();
  }, [isAdmin]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    const [profilesRes, plansRes, rolesRes] = await Promise.all([
      supabase.from("profiles").select("id, email, created_at").order("created_at", { ascending: false }),
      supabase.from("user_plans").select("user_id, plan"),
      supabase.from("user_roles").select("user_id, role"),
    ]);

    if (profilesRes.error) {
      toast({ title: "Error", description: "Failed to load users", variant: "destructive" });
      setLoadingUsers(false);
      return;
    }

    const planMap = new Map(plansRes.data?.map((p) => [p.user_id, p.plan]) || []);
    const adminSet = new Set(
      rolesRes.data?.filter((r) => r.role === "admin").map((r) => r.user_id) || []
    );

    const merged: UserData[] = (profilesRes.data || []).map((p) => ({
      id: p.id,
      email: p.email,
      created_at: p.created_at,
      plan: (planMap.get(p.id) as "basic" | "pro" | "plus") || "basic",
      isAdmin: adminSet.has(p.id),
    }));

    setUsers(merged);
    setLoadingUsers(false);
  };

  const handlePlanChange = async (userId: string, newPlan: "basic" | "pro" | "plus") => {
    setUpdatingPlan(userId);
    const { error } = await supabase
      .from("user_plans")
      .upsert(
        { user_id: userId, plan: newPlan, updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );

    if (error) {
      toast({ title: "Error", description: "Failed to update plan", variant: "destructive" });
    } else {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, plan: newPlan } : u)));
      toast({ title: "Success", description: `Plan updated to ${newPlan}` });
    }
    setUpdatingPlan(null);
  };

  const handleToggleAdmin = async (userId: string, currentlyAdmin: boolean) => {
    if (userId === user?.id) {
      toast({ title: "Error", description: "You cannot change your own admin role", variant: "destructive" });
      return;
    }

    setUpdatingRole(userId);

    if (currentlyAdmin) {
      // Remove admin role — set back to 'user'
      const { error } = await supabase
        .from("user_roles")
        .update({ role: "user" as any })
        .eq("user_id", userId)
        .eq("role", "admin");

      if (error) {
        toast({ title: "Error", description: "Failed to remove admin role", variant: "destructive" });
      } else {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isAdmin: false } : u)));
        toast({ title: "Success", description: "Admin role removed" });
      }
    } else {
      // Make admin — upsert admin role
      const { error } = await supabase
        .from("user_roles")
        .upsert(
          { user_id: userId, role: "admin" as any },
          { onConflict: "user_id" }
        );

      if (error) {
        toast({ title: "Error", description: "Failed to make admin", variant: "destructive" });
      } else {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isAdmin: true } : u)));
        toast({ title: "Success", description: "User is now an admin" });
      }
    }
    setUpdatingRole(null);
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === user?.id) {
      toast({ title: "Error", description: "You cannot delete yourself", variant: "destructive" });
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete this user? This cannot be undone.");
    if (!confirmed) return;

    const { error } = await supabase.from("profiles").delete().eq("id", userId);

    if (error) {
      toast({ title: "Error", description: "Failed to delete user", variant: "destructive" });
    } else {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast({ title: "Success", description: "User removed" });
    }
  };

  const handleAddUser = async () => {
    if (!newEmail.trim() || !newPassword.trim()) return;
    setAddingUser(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-create-user", {
        body: { email: newEmail.trim(), password: newPassword, plan: newPlan },
      });
      if (error || data?.error) {
        toast({ title: "Error", description: data?.error || "Failed to create user", variant: "destructive" });
      } else {
        toast({ title: "User Created! ✅", description: `${newEmail} has been added successfully.` });
        setAddDialogOpen(false);
        setNewEmail("");
        setNewPassword("");
        setNewPlan("basic");
        fetchUsers();
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    }
    setAddingUser(false);
  };

  const filteredUsers = users.filter(
    (u) => !search || u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const adminCount = users.filter((u) => u.isAdmin).length;

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
            <p className="text-sm text-muted-foreground">Manage users, roles, and subscription plans</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
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
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-100">
                <Crown className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{users.filter((u) => u.plan === "plus").length}</p>
                <p className="text-xs text-muted-foreground">Plus Users</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-100">
                <ShieldCheck className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{adminCount}</p>
                <p className="text-xs text-muted-foreground">Admins</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search + Add User */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
          <Button onClick={() => setAddDialogOpen(true)} className="gap-2 h-11">
            <UserPlus className="w-4 h-4" />
            Add User
          </Button>
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
                  <TableHead>Role</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
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
                        <Badge
                          variant="secondary"
                          className={`text-[10px] font-semibold uppercase cursor-default ${
                            u.isAdmin
                              ? "bg-rose-100 text-rose-700 border border-rose-200"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {u.isAdmin ? (
                            <><ShieldCheck className="w-3 h-3 mr-1" /> Admin</>
                          ) : (
                            "User"
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={u.plan}
                          onValueChange={(val) => handlePlanChange(u.id, val as "basic" | "pro" | "plus")}
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
                                <span className="w-2 h-2 rounded-full bg-amber-500" />
                                Pro
                              </span>
                            </SelectItem>
                            <SelectItem value="plus">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-violet-500" />
                                Plus
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleAdmin(u.id, u.isAdmin)}
                            disabled={u.id === user?.id || updatingRole === u.id}
                            title={u.isAdmin ? "Remove admin" : "Make admin"}
                            className={u.isAdmin ? "text-rose-600 hover:text-rose-700 hover:bg-rose-50" : "text-muted-foreground hover:text-foreground"}
                          >
                            {updatingRole === u.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : u.isAdmin ? (
                              <ShieldOff className="w-4 h-4" />
                            ) : (
                              <ShieldCheck className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(u.id)}
                            disabled={u.id === user?.id}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Coupon Management */}
        <div className="mt-8">
          <AdminCoupons />
        </div>
      </div>

      {/* Add User Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account with email and password.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                placeholder="user@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <Input
                type="password"
                placeholder="Min 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Plan</label>
              <Select value={newPlan} onValueChange={(v) => setNewPlan(v as "basic" | "pro" | "plus")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="plus">Plus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full"
              onClick={handleAddUser}
              disabled={!newEmail.trim() || !newPassword.trim() || addingUser}
            >
              {addingUser ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
              Create User
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
