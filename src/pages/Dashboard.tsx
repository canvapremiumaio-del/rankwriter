import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserPlan } from "@/hooks/useUserPlan";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, FileDown, LayoutList, ArrowRight, Loader2, Lock, Crown, Zap, Search, FileText, Wand2, Copy, Globe } from "lucide-react";
import { useEffect, useMemo } from "react";
import { differenceInDays, differenceInHours, differenceInMinutes, format } from "date-fns";

const features = [
  {
    icon: Sparkles,
    title: "AI Blog Generation",
    description: "Generate high-quality articles powered by AI in seconds.",
    basic: "Simple blog structure",
    pro: "Advanced SEO-optimized content with detailed sections",
    proOnly: false,
  },
  {
    icon: Search,
    title: "SEO Keywords & Meta",
    description: "Auto-generated SEO keywords, meta descriptions, and tags.",
    basic: null,
    pro: "Full SEO toolkit with keywords, meta description & tags",
    proOnly: true,
  },
  {
    icon: LayoutList,
    title: "Smart Content Structuring",
    description: "Professional outlines with proper heading hierarchy.",
    basic: "Basic outline",
    pro: "H1, H2, H3 headings with professional structure",
    proOnly: false,
  },
  {
    icon: Zap,
    title: "Extended Word Count",
    description: "Generate longer, more detailed articles up to 2,500 words.",
    basic: "Up to 1,000 words",
    pro: "Up to 2,500 words",
    proOnly: false,
  },
  {
    icon: FileDown,
    title: "Export to PDF",
    description: "Download articles as professionally formatted PDF documents.",
    basic: null,
    pro: "One-click PDF export",
    proOnly: true,
  },
  {
    icon: FileText,
    title: "Export to Word",
    description: "Download articles as Word documents ready for editing.",
    basic: null,
    pro: "One-click Word export",
    proOnly: true,
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { plan, isPro, loading: planLoading, expiresAt } = useUserPlan();

  const expiryInfo = useMemo(() => {
    if (!expiresAt || !isPro) return null;
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
  }, [expiresAt, isPro]);

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

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Beautiful gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(172,50%,95%)] via-[hsl(210,40%,96%)] to-[hsl(260,40%,96%)]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[hsl(172,66%,40%/0.08)] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[hsl(260,60%,60%/0.08)] rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-[hsl(200,70%,60%/0.06)] rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      <NavBar />
      <div className="max-w-4xl mx-auto px-4 pb-20">
        {/* Hero */}
        <section className="text-center py-16 md:py-24">
          <Badge
            variant="secondary"
            className={`mb-4 text-xs font-semibold uppercase ${
              isPro
                ? "bg-amber-500/15 text-amber-600 border border-amber-500/30"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {isPro ? "⭐ Pro Plan" : "Basic Plan"}
          </Badge>
          {expiryInfo && (
            <div className="mb-4 flex flex-col items-center gap-1">
              <Badge className="bg-orange-500/15 text-orange-600 border border-orange-500/30 text-xs font-medium px-3 py-1">
                ⏳ {expiryInfo.label}
              </Badge>
              <span className="text-[11px] text-muted-foreground">
                Expires: {expiryInfo.date}
              </span>
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
            Rank<span className="text-primary">Writer</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto mb-8">
            Generate SEO-optimized articles in seconds. Write smarter, rank higher.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" onClick={() => navigate("/generate")} className="gap-2 h-12 px-8 text-base font-semibold">
              <Sparkles className="w-5 h-5" />
              Start Writing
              <ArrowRight className="w-4 h-4" />
            </Button>
            {!isPro && (
              <Button size="lg" variant="outline" onClick={() => navigate("/pricing")} className="h-12 px-8 text-base gap-2 bg-card/60 backdrop-blur-sm">
                <Crown className="w-5 h-5" />
                Upgrade to Pro
              </Button>
            )}
          </div>
        </section>

        {/* Features comparison */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-6 text-center">
            {isPro ? "Your Pro Features" : "Basic vs Pro Features"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => {
              const locked = f.proOnly && !isPro;
              return (
                <div
                  key={f.title}
                  className={`rounded-2xl border p-5 relative transition-all backdrop-blur-sm ${
                    locked
                      ? "bg-muted/30 border-border opacity-75"
                      : "bg-card/70 border-border shadow-sm hover:shadow-md hover:bg-card/90"
                  }`}
                >
                  {/* Badge */}
                  {f.proOnly && (
                    <Badge
                      className={`absolute top-3 right-3 text-[10px] border-0 ${
                        isPro
                          ? "bg-amber-500/15 text-amber-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {locked ? <Lock className="w-3 h-3 mr-1" /> : null}
                      PRO
                    </Badge>
                  )}

                  <div className={`p-2 rounded-xl w-fit mb-3 ${locked ? "bg-muted" : "bg-primary/10"}`}>
                    <f.icon className={`w-5 h-5 ${locked ? "text-muted-foreground" : "text-primary"}`} />
                  </div>

                  <h3 className={`font-semibold mb-1 ${locked ? "text-muted-foreground" : "text-foreground"}`}>
                    {f.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    {f.description}
                  </p>

                  {/* Plan-specific info */}
                  {!isPro && !f.proOnly && f.basic && (
                    <div className="text-[11px] space-y-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                        Basic: {f.basic}
                      </div>
                      <div className="flex items-center gap-1.5 text-amber-600">
                        <Crown className="w-3 h-3" />
                        Pro: {f.pro}
                      </div>
                    </div>
                  )}

                  {locked && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-primary p-0 h-auto mt-1"
                      onClick={() => navigate("/pricing")}
                    >
                      Upgrade to unlock →
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
