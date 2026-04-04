import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserPlan } from "@/hooks/useUserPlan";
import { supabase } from "@/integrations/supabase/client";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Check, X, Loader2, MessageCircle, Tag, Crown, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

const plans = [
  {
    id: "basic" as const,
    name: "Basic",
    price: "$5",
    description: "Great for getting started with AI blog writing.",
    features: [
      { text: "AI blog generation", included: true },
      { text: "Natural human-like writing", included: true },
      { text: "Copy article to clipboard", included: true },
      { text: "Simple content structure", included: true },
      { text: "Up to 1,000 words", included: true },
      { text: "Primary & secondary keywords", included: false },
      { text: "Custom outline & instructions", included: false },
      { text: "Save & reuse templates", included: false },
      { text: "Humanize article", included: false },
      { text: "SEO keywords & meta", included: false },
      { text: "Export to PDF & Word", included: false },
      { text: "SEO Score analysis", included: false },
      { text: "Keyword suggestions", included: false },
      { text: "Multiple article variations", included: false },
    ],
  },
  {
    id: "pro" as const,
    name: "Pro",
    price: "$10",
    description: "Full SEO toolkit for professional content creators.",
    features: [
      { text: "Everything in Basic", included: true, bold: true },
      { text: "Advanced writing quality", included: true },
      { text: "Primary + secondary keywords", included: true },
      { text: "SEO meta description", included: true },
      { text: "H1/H2/H3 structure", included: true },
      { text: "Custom outline", included: true },
      { text: "Save & reuse templates", included: true },
      { text: "Up to 2,500 words", included: true },
      { text: "AI rewrite (humanize)", included: true },
      { text: "Export to PDF & Word", included: true },
      { text: "SEO Score analysis", included: false },
      { text: "Keyword suggestions", included: false },
      { text: "Multiple article variations", included: false },
      { text: "Templates system (5 types)", included: false },
      { text: "Simple/Advanced mode", included: false },
    ],
  },
  {
    id: "plus" as const,
    name: "Plus",
    price: "$15",
    recommended: true,
    description: "Full AI writing system with all advanced features. Best for freelancers & agencies.",
    features: [
      { text: "Everything in Pro", included: true, bold: true },
      { text: "SEO Score (content grading 0–100)", included: true },
      { text: "AI Keyword Suggestions", included: true },
      { text: "Multiple article variations (2–3)", included: true },
      { text: "Templates system (Blog, Ads, Email, Product, LinkedIn)", included: true },
      { text: "Simple/Advanced mode toggle", included: true },
      { text: "Result preview section", included: true },
      { text: "Optimized prompt system (better quality)", included: true },
      { text: "Priority output quality", included: true },
      { text: "Up to 2,500 words", included: true },
      { text: "Humanize article (AI rewrite)", included: true },
      { text: "Export to PDF & Word", included: true },
    ],
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { plan: currentPlan, loading: planLoading } = useUserPlan();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "pro" | "plus" | null>(null);
  const [coupon, setCoupon] = useState("");
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { replace: true });
  }, [user, authLoading, navigate]);

  const handleSelect = (planId: "basic" | "pro" | "plus") => {
    if (planId === currentPlan) return;
    setSelectedPlan(planId);
    setCoupon("");
    setDialogOpen(true);
  };

  const handleCouponSubmit = async () => {
    if (!coupon.trim()) return;
    setRedeeming(true);
    try {
      const { data, error } = await supabase.functions.invoke("redeem-coupon", { body: { code: coupon.trim() } });
      if (error || data?.error) {
        toast({ title: "Error", description: data?.error || "Failed to redeem coupon", variant: "destructive" });
      } else {
        toast({ title: "Plan Activated! 🎉", description: `Your plan has been upgraded to ${data.plan}.` });
        setDialogOpen(false);
        setCoupon("");
        window.location.reload();
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    }
    setRedeeming(false);
  };

  if (authLoading || planLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center justify-center px-8 border-b border-slate-200 bg-white/80 backdrop-blur-sm shrink-0">
          <div className="text-center">
            <h1 className="text-xl font-bold text-slate-800 font-display">Choose Your Plan</h1>
            <p className="text-xs text-slate-500">Unlock premium features to supercharge your content.</p>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {plans.map((p) => {
              const isActive = currentPlan === p.id;
              return (
                <div
                  key={p.id}
                  className={`bg-white rounded-2xl border-2 p-5 relative transition-shadow ${
                    p.recommended
                      ? "border-pink-500 shadow-xl shadow-pink-500/15 scale-[1.02]"
                      : "border-slate-200 shadow-sm"
                  }`}
                >
                  {p.recommended && (
                    <>
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 border-0 gap-1">
                        <Sparkles className="w-3 h-3" /> Most Popular
                      </Badge>
                    </>
                  )}
                  {isActive && (
                    <Badge className="absolute -top-3 right-4 bg-emerald-500 text-white px-3 border-0">Active</Badge>
                  )}
                  <h2 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
                    {p.name}
                    {p.recommended && <Crown className="w-4 h-4 text-pink-500" />}
                  </h2>
                  <p className="text-xs text-slate-500 mb-3">{p.description}</p>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-bold text-slate-800">{p.price}</span>
                    <span className="text-slate-400 text-sm">/month</span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {p.features.map((f) => (
                      <li key={f.text} className="flex items-center gap-2 text-xs">
                        {f.included ? (
                          <Check className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        )}
                        <span className={`${f.included ? "text-slate-700" : "text-slate-400"} ${"bold" in f && f.bold ? "font-semibold" : ""}`}>
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full h-10 text-sm ${p.recommended && !isActive ? "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0" : ""}`}
                    variant={isActive ? "secondary" : p.recommended ? "default" : "outline"}
                    disabled={isActive}
                    onClick={() => handleSelect(p.id)}
                  >
                    {isActive ? "✓ Current Plan" : `Get ${p.name}`}
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-center bg-white rounded-xl border border-slate-200 p-4 max-w-md mx-auto">
            <MessageCircle className="w-5 h-5 text-pink-500 mx-auto mb-1" />
            <p className="text-xs text-slate-500">
              Contact us on WhatsApp:{" "}
              <a href="https://wa.me/923059694651" target="_blank" rel="noopener noreferrer" className="text-pink-500 font-medium hover:underline">
                +92 305 9694651
              </a>
            </p>
          </div>
        </main>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Activate {selectedPlan === "plus" ? "Plus" : selectedPlan === "pro" ? "Pro" : "Basic"} Plan</DialogTitle>
            <DialogDescription>Enter a coupon code to activate this plan, or contact the admin to get one.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2"><Tag className="w-4 h-4" /> Coupon Code</label>
              <div className="flex gap-2">
                <Input placeholder="Enter coupon code..." value={coupon} onChange={(e) => setCoupon(e.target.value)} className="flex-1" />
                <Button onClick={handleCouponSubmit} disabled={!coupon.trim() || redeeming}>
                  {redeeming ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">Don't have a coupon? Contact us on WhatsApp.</p>
              <Button variant="outline" asChild>
                <a href="https://wa.me/923059694651" target="_blank" rel="noopener noreferrer" className="gap-2">
                  <MessageCircle className="w-4 h-4" /> WhatsApp: +92 305 9694651
                </a>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pricing;
