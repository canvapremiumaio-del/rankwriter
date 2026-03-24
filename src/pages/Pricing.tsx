import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserPlan } from "@/hooks/useUserPlan";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Check, X, Loader2, MessageCircle, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
  const { plan: currentPlan, loading: planLoading } = useUserPlan();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "pro" | null>(null);
  const [coupon, setCoupon] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { replace: true });
  }, [user, authLoading, navigate]);

  const handleSelect = (planId: "basic" | "pro") => {
    if (planId === currentPlan) return;
    setSelectedPlan(planId);
    setCoupon("");
    setDialogOpen(true);
  };

  const handleCouponSubmit = () => {
    toast({
      title: "Coupon Submitted",
      description: "Your coupon code has been submitted. Our team will verify and activate your plan shortly.",
    });
    setDialogOpen(false);
    setCoupon("");
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
                {isActive && (
                  <Badge className="absolute -top-3 right-4 bg-emerald-500 text-white px-3">
                    Active
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
                  {isActive ? "✓ Current Plan" : `Get ${p.name}`}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Contact info */}
        <div className="mt-10 text-center bg-muted/50 rounded-xl border border-border p-6">
          <MessageCircle className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            To upgrade or change your plan, enter a coupon code or contact the admin at{" "}
            <a href="mailto:admin@aiblogwriter.pro" className="text-primary font-medium hover:underline">
              admin@aiblogwriter.pro
            </a>
          </p>
        </div>
      </div>

      {/* Coupon / Contact Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Activate {selectedPlan === "pro" ? "Pro" : "Basic"} Plan</DialogTitle>
            <DialogDescription>
              Enter a coupon code to activate this plan, or contact the admin to get one.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Coupon input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Coupon Code
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter coupon code..."
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleCouponSubmit} disabled={!coupon.trim()}>
                  Apply
                </Button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Contact admin */}
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Don't have a coupon? Contact admin to get started.
              </p>
              <Button variant="outline" asChild>
                <a href="mailto:admin@aiblogwriter.pro" className="gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Contact Admin
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
