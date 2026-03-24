import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, FileDown, LayoutList, ArrowRight, Star, Zap, Shield, Globe, CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Writing",
    description: "Generate complete, SEO-optimized blog articles in seconds using advanced AI models.",
    bg: "bg-[hsl(var(--accent))]",
    iconColor: "text-[hsl(var(--primary))]",
  },
  {
    icon: FileDown,
    title: "Export Anywhere",
    description: "Download your articles as polished PDF or Word documents, ready to publish.",
    bg: "bg-sky-50",
    iconColor: "text-sky-600",
  },
  {
    icon: LayoutList,
    title: "Smart Structuring",
    description: "Auto-generated outlines, meta descriptions, keywords, and proper heading hierarchy.",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get your first draft in under 30 seconds. No more staring at blank pages.",
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    icon: Shield,
    title: "SEO Optimized",
    description: "Built-in keyword research, meta tags, and search engine best practices.",
    bg: "bg-rose-50",
    iconColor: "text-rose-600",
  },
  {
    icon: Globe,
    title: "Any Topic, Any Niche",
    description: "From tech to travel, finance to food — write about anything with confidence.",
    bg: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Content Strategist",
    text: "RankWriter cut my content creation time by 80%. The SEO optimization is incredible — my articles rank on page one consistently.",
    rating: 5,
    avatar: "SC",
    color: "bg-gradient-to-br from-[hsl(172,66%,40%)] to-[hsl(172,66%,30%)]",
  },
  {
    name: "Marcus Rodriguez",
    role: "Freelance Blogger",
    text: "The export features save me hours of formatting. I generate, tweak, and publish — it's that simple.",
    rating: 5,
    avatar: "MR",
    color: "bg-gradient-to-br from-sky-400 to-blue-500",
  },
  {
    name: "Priya Sharma",
    role: "Marketing Director",
    text: "We replaced three content tools with this one. The quality of output rivals professional copywriters.",
    rating: 5,
    avatar: "PS",
    color: "bg-gradient-to-br from-emerald-400 to-teal-500",
  },
];

const stats = [
  { value: "50K+", label: "Articles Generated" },
  { value: "12K+", label: "Happy Writers" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "< 30s", label: "Generation Time" },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(172,66%,40%)] to-[hsl(172,66%,25%)] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">
              Rank <span className="text-[hsl(172,66%,40%)]">Writer</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")} className="text-gray-600 hover:text-gray-900">
              Sign In
            </Button>
            <Button size="sm" onClick={() => navigate("/auth")} className="bg-gradient-to-r from-[hsl(172,66%,40%)] to-[hsl(172,66%,30%)] hover:from-[hsl(172,66%,35%)] hover:to-[hsl(172,66%,25%)] text-white shadow-lg shadow-[hsl(172,66%,40%/0.3)] gap-1.5">
              Get Started Free <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[hsl(172,50%,80%/0.4)] rounded-full blur-3xl" />
          <div className="absolute top-20 -left-40 w-80 h-80 bg-sky-200/40 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center py-20 md:py-32">
          <Badge className="mb-6 bg-[hsl(172,50%,94%)] text-[hsl(172,66%,30%)] border-[hsl(172,50%,85%)] hover:bg-[hsl(172,50%,94%)] text-sm font-medium px-4 py-1.5">
            ✨ Powered by Advanced AI
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 tracking-tight mb-6 leading-[1.1]" style={{ fontFamily: "var(--font-display)" }}>
            Write & Rank with
            <br />
            <span className="bg-gradient-to-r from-[hsl(172,66%,40%)] via-[hsl(172,66%,35%)] to-[hsl(200,70%,45%)] bg-clip-text text-transparent">
              AI Precision
            </span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Generate professional, SEO-optimized blog posts with AI-powered keyword research,
            structured outlines, and export-ready formatting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-gradient-to-r from-[hsl(172,66%,40%)] to-[hsl(172,66%,30%)] hover:from-[hsl(172,66%,35%)] hover:to-[hsl(172,66%,25%)] text-white shadow-xl shadow-[hsl(172,66%,40%/0.3)] gap-2 h-14 px-10 text-base font-semibold rounded-xl"
            >
              <Sparkles className="w-5 h-5" />
              Start Writing for Free
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/pricing")}
              className="h-14 px-10 text-base rounded-xl border-gray-200 hover:bg-gray-50 text-gray-700"
            >
              View Pricing
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free plan available</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-gray-100 bg-gradient-to-r from-[hsl(172,50%,96%)] via-white to-[hsl(200,50%,96%)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[hsl(172,66%,40%)] to-[hsl(172,66%,30%)] bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-sky-100 text-sky-700 border-sky-200 hover:bg-sky-100 text-sm">
            Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Everything You Need to Create
            <br />
            <span className="bg-gradient-to-r from-[hsl(172,66%,40%)] to-emerald-500 bg-clip-text text-transparent">Great Content</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Powerful tools designed to make content creation effortless and professional.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:shadow-gray-100/80 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`p-3 rounded-xl ${f.bg} w-fit mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon className={`w-6 h-6 ${f.iconColor}`} />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100 text-sm">
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
              Loved by <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Content Creators</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-[hsl(172,66%,40%)] via-[hsl(172,66%,35%)] to-[hsl(200,70%,45%)] rounded-3xl p-12 md:p-16 shadow-2xl shadow-[hsl(172,66%,40%/0.3)] relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
            </div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
                Ready to Write & Rank?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
                Join thousands of creators using Rank Writer to produce high-quality, SEO-optimized content effortlessly.
              </p>
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-white text-[hsl(172,66%,30%)] hover:bg-gray-100 gap-2 h-14 px-10 text-base font-semibold rounded-xl shadow-xl"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-10 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[hsl(172,66%,40%)] to-[hsl(172,66%,25%)] flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">RankWriter</span>
          </div>
          <p className="text-xs text-gray-400">© 2026 RankWriter. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
