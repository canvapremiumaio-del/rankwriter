import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserPlan } from "@/hooks/useUserPlan";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const plans = [
  {
    id: "basic" as const,
    name: "Basic",
    price: "$5",
    description: "Great for getting started with AI blog writing.",
    features: [
      { text: "Blog generation", included: true },
      { text: "Simple structure", included: true },
      { text: "Standard quality output", included: true },
      { text: "Export to PDF", included: false },
      { text: "Export to Word", included: false },
      { text: "SEO keywords & meta", included: false },
    ],
  },
  {
    id: "pro" as const,
    name: "Pro",
    price: "$10",
    recommended: true,
    description: "Full SEO toolkit for professional content creators.",
    features: [
      { text: "SEO-optimized articles", included: true },
      { text: "Keywords + meta description", included: true },
      { text: "Advanced formatting", included: true },
      { text: "Export to PDF", included: true },
      { text: "Export to Word", included: true },
      { text: "Higher quality output", included: true },
    ],
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { plan: currentPlan, updatePlan, loading: planLoading } = useUserPlan();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { replace: true });
  }, [user, authLoading, navigate]);

  const handleSelect = async (planId: "basic" | "pro") => {
    if (planId === currentPlan) return;
    const error = await updatePlan(planId);
    if (error) {
      toast({ title: "Error", description: "Failed to update plan.", variant: "destructive" });
    } else {
      toast({
        title: planId === "pro" ? "Welcome to Pro! 🎉" : "Plan changed",
        description: planId === "pro"
          ? "You now have access to all premium features."
          : "You've switched to the Basic plan.",
      });
    }
  };

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
      <div className="max-w-3xl mx-auto px-4 pb-20 pt-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Choose Your Plan
          </h1>
          <p className="text-muted-foreground text-lg">
            Unlock premium features to supercharge your content creation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((p) => {
            const isActive = currentPlan === p.id;
            return (
              <div
                key={p.id}
                className={`bg-card rounded-2xl border-2 p-6 md:p-8 relative transition-shadow ${
                  p.recommended
                    ? "border-primary shadow-md"
                    : "border-border shadow-sm"
                }`}
              >
                {p.recommended && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3">
                    Recommended
                  </Badge>
                )}
                <h2 className="text-xl font-bold text-foreground mb-1">{p.name}</h2>
                <p className="text-sm text-muted-foreground mb-4">{p.description}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-foreground">{p.price}</span>
                  <span className="text-muted-foreground text-sm">/month</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {p.features.map((f) => (
                    <li key={f.text} className="flex items-center gap-2.5 text-sm">
                      {f.included ? (
                        <Check className="w-4 h-4 text-primary shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                      )}
                      <span className={f.included ? "text-foreground" : "text-muted-foreground"}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full h-11"
                  variant={isActive ? "secondary" : p.recommended ? "default" : "outline"}
                  disabled={isActive}
                  onClick={() => handleSelect(p.id)}
                >
                  {isActive ? "Current Plan" : `Select ${p.name}`}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
