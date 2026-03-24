import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserPlan } from "@/hooks/useUserPlan";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PenLine, History, LogOut, CreditCard, LayoutDashboard, Shield } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";

const NavLink = ({ to, icon: Icon, label, active }: { to: string; icon: any; label: string; active: boolean }) => (
  <Link
    to={to}
    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
    }`}
  >
    <Icon className="w-4 h-4" />
    {label}
  </Link>
);

const NavBar = () => {
  const { user, signOut } = useAuth();
  const { plan } = useUserPlan();
  const { isAdmin } = useAdmin();
  const location = useLocation();

  if (!user) return null;

  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <NavLink to="/" icon={LayoutDashboard} label="Dashboard" active={location.pathname === "/"} />
          <NavLink to="/generate" icon={PenLine} label="Generate" active={location.pathname === "/generate"} />
          <NavLink to="/history" icon={History} label="History" active={location.pathname === "/history"} />
          <NavLink to="/pricing" icon={CreditCard} label="Pricing" active={location.pathname === "/pricing"} />
          {isAdmin && <NavLink to="/admin" icon={Shield} label="Admin" active={location.pathname === "/admin"} />}
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="secondary"
            className={`text-[10px] font-semibold uppercase hidden sm:flex ${
              plan === "pro"
                ? "bg-amber-500/15 text-amber-600 border border-amber-500/30"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {plan === "pro" ? "⭐ Pro" : "Basic"}
          </Badge>
          <span className="text-xs text-muted-foreground hidden md:block">{user.email}</span>
          <Button variant="ghost" size="sm" onClick={signOut} className="gap-2">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
