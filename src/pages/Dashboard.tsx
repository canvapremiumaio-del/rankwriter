import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserPlan } from "@/hooks/useUserPlan";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, FileDown, LayoutList, ArrowRight, Loader2 } from "lucide-react";
import { useEffect } from "react";

const features = [
  {
    icon: Sparkles,
    title: "SEO Blog Generation",
    description: "Generate high-quality, SEO-optimized articles powered by AI in seconds.",
  },
  {
    icon: FileDown,
    title: "Export (PDF & Word)",
    description: "Download your articles as professionally formatted PDF or Word documents.",
    pro: true,
  },
  {
    icon: LayoutList,
    title: "Smart Content Structuring",
    description: "Auto-generated outlines, meta descriptions, keywords, and proper headings.",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { plan, loading: planLoading } = useUserPlan();

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { replace: true });
  }, [user, authLoading, navigate]);

  if (authLoading || planLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="max-w-4xl mx-auto px-4 pb-20">
        {/* Hero */}
        <section className="text-center py-16 md:py-24">
          <Badge variant="secondary" className="mb-4 text-xs font-medium">
            {plan === "pro" ? "Pro Plan" : "Basic Plan"}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
            AI Blog Writer Pro
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto mb-8">
            Generate SEO-optimized articles in seconds. Write smarter, publish faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" onClick={() => navigate("/generate")} className="gap-2 h-12 px-8 text-base font-semibold">
              <Sparkles className="w-5 h-5" />
              Start Writing
              <ArrowRight className="w-4 h-4" />
            </Button>
            {plan === "basic" && (
              <Button size="lg" variant="outline" onClick={() => navigate("/pricing")} className="h-12 px-8 text-base">
                Upgrade to Pro
              </Button>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow relative"
            >
              {f.pro && (
                <Badge className="absolute top-4 right-4 text-[10px] bg-primary/10 text-primary border-0">
                  PRO
                </Badge>
              )}
              <div className="p-2.5 rounded-xl bg-primary/10 w-fit mb-4">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
