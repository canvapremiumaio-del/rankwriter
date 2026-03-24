import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, FileDown, LayoutList, ArrowRight, Star, Quote } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Writing",
    description: "Generate complete, SEO-optimized blog articles in seconds using advanced AI models.",
  },
  {
    icon: FileDown,
    title: "Export Anywhere",
    description: "Download your articles as polished PDF or Word documents, ready to publish.",
  },
  {
    icon: LayoutList,
    title: "Smart Structuring",
    description: "Auto-generated outlines, meta descriptions, keywords, and proper heading hierarchy.",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Content Strategist",
    text: "AI Blog Writer Pro cut my content creation time by 80%. The SEO optimization is incredible — my articles rank on page one consistently.",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Freelance Blogger",
    text: "The export features save me hours of formatting. I generate, tweak, and publish — it's that simple.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Marketing Director",
    text: "We replaced three content tools with this one. The quality of output rivals professional copywriters.",
    rating: 5,
  },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-foreground text-lg tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            AI Blog Writer Pro
          </span>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
            <Button size="sm" onClick={() => navigate("/auth")} className="gap-1.5">
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-20 md:py-32 px-4">
        <Badge variant="secondary" className="mb-5 text-xs font-medium">
          Powered by Advanced AI
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight mb-5 max-w-3xl mx-auto leading-[1.1]">
          Write SEO-Optimized Articles in Seconds
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Generate professional blog posts with AI-powered keyword research, structured outlines, and export-ready formatting. No writing experience needed.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" onClick={() => navigate("/auth")} className="gap-2 h-13 px-10 text-base font-semibold">
            <Sparkles className="w-5 h-5" />
            Start Writing for Free
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/auth")} className="h-13 px-10 text-base">
            View Pricing
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
          Everything You Need to Create Great Content
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-2.5 rounded-xl bg-primary/10 w-fit mb-4">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/40 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
            Loved by Content Creators
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <Quote className="w-8 h-8 text-primary/20 mb-3" />
                <p className="text-sm text-foreground/80 leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="font-semibold text-foreground text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-20 md:py-28 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Ready to Write Smarter?
        </h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
          Join thousands of creators using AI Blog Writer Pro to produce high-quality content effortlessly.
        </p>
        <Button size="lg" onClick={() => navigate("/auth")} className="gap-2 h-13 px-10 text-base font-semibold">
          Get Started Free <ArrowRight className="w-4 h-4" />
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center">
        <p className="text-xs text-muted-foreground">© 2026 AI Blog Writer Pro. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
