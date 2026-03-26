import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserPlan } from "@/hooks/useUserPlan";
import { useAdmin } from "@/hooks/useAdmin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  PenLine,
  History,
  CreditCard,
  Shield,
  LogOut,
  Sparkles,
} from "lucide-react";

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { plan, loading: planLoading } = useUserPlan();
  const { isAdmin } = useAdmin();

  const links = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/generate", icon: PenLine, label: "Generate" },
    { to: "/history", icon: History, label: "History" },
    { to: "/pricing", icon: CreditCard, label: "Pricing" },
  ];

  if (isAdmin) {
    links.push({ to: "/admin", icon: Shield, label: "Admin" });
  }

  const planBadge = plan === "plus"
    ? { label: "💎 Plus", cls: "bg-violet-500/20 text-violet-200 border-violet-400/30" }
    : plan === "pro"
      ? { label: "⭐ Pro", cls: "bg-amber-500/20 text-amber-200 border-amber-400/30" }
      : { label: "Basic", cls: "bg-white/10 text-blue-100 border-white/20" };

  return (
    <aside className="w-[220px] min-h-screen flex flex-col justify-between py-6 px-4"
      style={{
        background: "linear-gradient(180deg, #1e1b4b 0%, #4c1d95 30%, #be185d 65%, #ec4899 100%)",
      }}
    >
      {/* Top */}
      <div>
        {/* Brand */}
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight font-display">
            Rank<span className="text-cyan-300">Writer</span>
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1">
          {links.map((link) => {
            const active = location.pathname === link.to;
            return (
              <button
                key={link.to}
                onClick={() => navigate(link.to)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all w-full text-left ${
                  active
                    ? "bg-white/20 text-white shadow-lg shadow-cyan-500/10 backdrop-blur-sm"
                    : "text-blue-100/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <link.icon className={`w-4 h-4 ${active ? "text-cyan-300" : ""}`} />
                {link.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom */}
      <div className="space-y-3">
        {!planLoading && (
          <Badge
            variant="secondary"
            className={`text-[10px] font-semibold uppercase w-full justify-center py-1 border ${planBadge.cls}`}
          >
            {planBadge.label}
          </Badge>
        )}

        <div className="text-[11px] text-blue-200/60 truncate px-1">
          {user?.email}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          className="w-full justify-start gap-2 text-blue-200/70 hover:text-white hover:bg-white/10"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
