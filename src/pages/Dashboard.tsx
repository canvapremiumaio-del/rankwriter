import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserPlan } from "@/hooks/useUserPlan";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles, FileDown, LayoutList, ArrowRight, Loader2, Lock, Crown, Zap,
  Search, FileText, Wand2, Copy, Globe, BarChart3, Layers,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { differenceInDays, differenceInHours, differenceInMinutes, format } from "date-fns";

const features = [
  { icon: Sparkles, title: "Smart Blog Writing", description: "Create complete, professional blog articles in seconds.", tier: "basic" },
  { icon: Search, title: "SEO Keywords & Meta", description: "Built-in keyword research, meta descriptions, and tags.", tier: "pro" },
  { icon: LayoutList, title: "Smart Structuring", description: "Professional H1–H3 heading hierarchy with clean formatting.", tier: "basic" },
  { icon: Wand2, title: "Content Enhancer", description: "One-click rewrite to make articles more natural and polished.", tier: "pro" },
  { icon: Zap, title: "Extended Word Count", description: "Create longer, more detailed articles up to 2,500 words.", tier: "basic" },
  { icon: FileDown, title: "Export to PDF", description: "Download articles as professionally formatted PDFs.", tier: "pro" },
  { icon: FileText, title: "Export to Word", description: "Download articles as Word documents ready for editing.", tier: "pro" },
  { icon: Copy, title: "Copy & Share", description: "Instantly copy your article to clipboard.", tier: "basic" },
  { icon: Globe, title: "Any Topic, Any Niche", description: "From tech to travel — write about anything.", tier: "basic" },
  { icon: BarChart3, title: "SEO Score Analysis", description: "AI-powered SEO scoring (0–100) with suggestions.", tier: "plus" },
  { icon: Search, title: "AI Keyword Suggestions", description: "Auto-generate primary, secondary & long-tail keywords.", tier: "plus" },
  { icon: Layers, title: "Multiple Variations", description: "Generate 2–3 different versions of every article.", tier: "plus" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { plan, isPro, isPlus, loading: planLoading, expiresAt } = useUserPlan();

  const expiryInfo = useMemo(() => {
    if (!expiresAt || (!isPro && !isPlus)) return null;
    const expDate = new Date(expiresAt);
    const now = new Date();
    if (expDate <= now) return null;
    const days = differenceInDays(expDate, now);
    const hours = differenceInHours(expDate, now) % 24;
    const mins = differenceInMinutes(expDate, now) % 60;
    let label = "";
    if (days > 0) label = `${days}d ${hours}h remaining`;
    else if (hours > 0) label = `${hours}h ${mins}m remaining`;
    else label = `${mins}m remaining`;
    return { label, date: format(expDate, "MMM d, yyyy h:mm a") };
  }, [expiresAt, isPro, isPlus]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/landing", { replace: true });
  }, [user, authLoading, navigate]);

  if (authLoading || planLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const isFeatureUnlocked = (tier: string) => {
    if (tier === "basic") return true;
    if (tier === "pro") return isPro || isPlus;
    if (tier === "plus") return isPlus;
    return false;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <DashboardSidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200 bg-white/80 backdrop-blur-sm shrink-0">
          <div>
            <h1 className="text-xl font-bold text-slate-800 font-display">
              Welcome back 👋
            </h1>
            <p className="text-xs text-slate-500">Ready to create amazing content?</p>
          </div>
          <div className="flex items-center gap-3">
            {expiryInfo && (
              <Badge className="bg-orange-100 text-orange-700 border border-orange-200 text-[10px]">
                ⏳ {expiryInfo.label}
              </Badge>
            )}
            <Button size="sm" onClick={() => navigate("/generate")} className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0">
              <Sparkles className="w-4 h-4" />
              Start Writing
              <ArrowRight className="w-3 h-3" />
            </Button>
            {!isPlus && (
              <Button size="sm" variant="outline" onClick={() => navigate("/pricing")} className="gap-2 border-blue-200 text-blue-600 hover:bg-blue-50">
                <Crown className="w-4 h-4" />
                {isPro ? "Upgrade to Plus" : "Upgrade Plan"}
              </Button>
            )}
          </div>
        </header>

        {/* Content area - no scroll */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Stats cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="rounded-2xl p-5 bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/20">
              <p className="text-blue-100 text-xs font-medium mb-1">Current Plan</p>
              <p className="text-2xl font-bold">{isPlus ? "💎 Plus" : isPro ? "⭐ Pro" : "Basic"}</p>
            </div>
            <div className="rounded-2xl p-5 bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/20">
              <p className="text-cyan-100 text-xs font-medium mb-1">Features Available</p>
              <p className="text-2xl font-bold">{features.filter(f => isFeatureUnlocked(f.tier)).length}/{features.length}</p>
            </div>
            <div className="rounded-2xl p-5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
              <p className="text-indigo-100 text-xs font-medium mb-1">Plan Status</p>
              <p className="text-2xl font-bold">{expiryInfo ? expiryInfo.label : "Active"}</p>
            </div>
          </div>

          {/* Features grid */}
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Your Features</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {features.map((f) => {
              const unlocked = isFeatureUnlocked(f.tier);
              return (
                <div
                  key={f.title}
                  className={`rounded-xl border p-4 relative transition-all ${
                    unlocked
                      ? "bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200"
                      : "bg-slate-100/50 border-slate-200/50 opacity-60"
                  }`}
                >
                  {f.tier !== "basic" && (
                    <Badge
                      className={`absolute top-2.5 right-2.5 text-[9px] border-0 ${
                        f.tier === "plus"
                          ? unlocked ? "bg-violet-100 text-violet-600" : "bg-slate-200 text-slate-500"
                          : unlocked ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {!unlocked && <Lock className="w-2.5 h-2.5 mr-0.5" />}
                      {f.tier === "plus" ? "PLUS" : "PRO"}
                    </Badge>
                  )}

                  <div className={`p-2 rounded-lg w-fit mb-2 ${
                    unlocked ? "bg-gradient-to-br from-blue-100 to-cyan-100" : "bg-slate-200"
                  }`}>
                    <f.icon className={`w-4 h-4 ${unlocked ? "text-blue-600" : "text-slate-400"}`} />
                  </div>

                  <h3 className={`text-sm font-semibold mb-1 ${unlocked ? "text-slate-800" : "text-slate-400"}`}>
                    {f.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{f.description}</p>

                  {!unlocked && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[11px] text-blue-500 p-0 h-auto mt-1.5 hover:text-blue-700"
                      onClick={() => navigate("/pricing")}
                    >
                      Upgrade to unlock →
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
