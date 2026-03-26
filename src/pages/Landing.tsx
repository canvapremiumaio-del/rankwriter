import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, FileDown, LayoutList, ArrowRight, Star, Zap, Shield, Globe, CheckCircle2, FileText, Wand2, Copy, Search, BarChart3, Layers } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Smart Blog Writing",
    description: "Create complete, professional blog articles in seconds — natural tone, engaging style.",
    bg: "bg-pink-500/20",
    iconColor: "text-pink-400",
  },
  {
    icon: Search,
    title: "Primary & Secondary Keywords",
    description: "Target exact keywords with smart placement in titles, headings, and throughout your content.",
    bg: "bg-violet-500/20",
    iconColor: "text-violet-400",
  },
  {
    icon: LayoutList,
    title: "Custom Outline & Structure",
    description: "Provide your own outline with H1/H2/H3 headings — the AI follows it strictly.",
    bg: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
  },
  {
    icon: Wand2,
    title: "Content Enhancer",
    description: "One-click rewrite to make any article sound more natural, engaging, and polished.",
    bg: "bg-rose-500/20",
    iconColor: "text-rose-400",
  },
  {
    icon: FileText,
    title: "Save & Reuse Templates",
    description: "Save your writing style, keywords, and instructions as templates for consistent content.",
    bg: "bg-amber-500/20",
    iconColor: "text-amber-400",
  },
  {
    icon: FileDown,
    title: "Export to PDF & Word",
    description: "Download articles as professionally formatted PDF or Word documents, ready to publish.",
    bg: "bg-sky-500/20",
    iconColor: "text-sky-400",
  },
  {
    icon: BarChart3,
    title: "SEO Score Analysis",
    description: "Get AI-powered SEO scoring (0–100) with actionable improvement suggestions for every article.",
    bg: "bg-violet-500/20",
    iconColor: "text-violet-400",
    badge: "PLUS",
  },
  {
    icon: Search,
    title: "AI Keyword Suggestions",
    description: "Auto-generate primary, secondary, and long-tail keywords before writing your article.",
    bg: "bg-purple-500/20",
    iconColor: "text-purple-400",
    badge: "PLUS",
  },
  {
    icon: Layers,
    title: "Multiple Article Variations",
    description: "Generate 2–3 different versions of every article with unique wording and structure.",
    bg: "bg-fuchsia-500/20",
    iconColor: "text-fuchsia-400",
    badge: "PLUS",
  },
  {
    icon: Zap,
    title: "Up to 2,500 Words",
    description: "Create longer, more detailed articles with extended word counts on the Pro plan.",
    bg: "bg-orange-500/20",
    iconColor: "text-orange-400",
  },
  {
    icon: Copy,
    title: "Copy & Share",
    description: "Instantly copy your article to clipboard — paste anywhere, anytime.",
    bg: "bg-teal-500/20",
    iconColor: "text-teal-400",
  },
  {
    icon: Globe,
    title: "Any Topic, Any Niche",
    description: "From tech to travel, finance to food — write about anything with confidence.",
    bg: "bg-indigo-500/20",
    iconColor: "text-indigo-400",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Content Strategist",
    text: "Rank Writer cut my content creation time by 80%. The SEO optimization is incredible — my articles rank on page one consistently.",
    rating: 5,
    avatar: "SC",
    color: "bg-gradient-to-br from-pink-500 to-fuchsia-600",
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
  { value: "50K+", label: "Articles Created" },
  { value: "12K+", label: "Happy Writers" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "< 30s", label: "Creation Time" },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #0f0a2e 0%, #1a1145 15%, #2d1b69 30%, #4c1d95 45%, #7e22ce 55%, #be185d 70%, #ec4899 82%, #4c1d95 92%, #0f0a2e 100%)" }}>
      {/* Nav */}
      <nav className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              Rank <span className="bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">Writer</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")} className="text-white/70 hover:text-white hover:bg-white/10">
              Sign In
            </Button>
            <Button size="sm" onClick={() => navigate("/auth")} className="bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white shadow-lg shadow-pink-500/30 gap-1.5">
              Get Started Free <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-20 -left-40 w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center py-20 md:py-32">
          <Badge className="mb-6 bg-white/10 text-pink-300 border-pink-400/30 hover:bg-white/10 text-sm font-medium px-4 py-1.5 backdrop-blur-sm">
            ✨ Smart SEO Content Platform
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-[1.1]" style={{ fontFamily: "var(--font-display)" }}>
            Write & Rank with
            <br />
            <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
              SEO Precision
            </span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Create professional, SEO-optimized blog posts with built-in keyword research,
            structured outlines, and export-ready formatting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white shadow-xl shadow-pink-500/30 gap-2 h-14 px-10 text-base font-semibold rounded-xl"
            >
              <Sparkles className="w-5 h-5" />
              Start Writing for Free
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/auth?redirect=/pricing")}
              className="h-14 px-10 text-base rounded-xl border-white/20 hover:bg-white/10 text-white"
            >
              View Pricing
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-white/50">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-pink-400" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-pink-400" /> Free plan available</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-pink-400" /> Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div className="text-sm text-white/50 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-indigo-500/20 text-indigo-300 border-indigo-400/30 hover:bg-indigo-500/20 text-sm">
            Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Everything You Need to Create
            <br />
            <span className="bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">Great Content</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Powerful tools designed to make content creation effortless and professional.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${f.bg} w-fit group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-6 h-6 ${f.iconColor}`} />
                </div>
                {"badge" in f && f.badge && (
                  <Badge className="bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/30 hover:bg-fuchsia-500/20 text-[10px]">
                    {f.badge}
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-white text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-transparent via-purple-950/30 to-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/30 hover:bg-fuchsia-500/20 text-sm">
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
              Loved by <span className="bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">Content Creators</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-white/70 leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{t.name}</p>
                    <p className="text-xs text-white/50">{t.role}</p>
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
          <div className="bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-pink-500 rounded-3xl p-12 md:p-16 shadow-2xl shadow-pink-500/30 relative overflow-hidden">
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
                className="bg-white text-indigo-700 hover:bg-gray-100 gap-2 h-14 px-10 text-base font-semibold rounded-xl shadow-xl"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 bg-black/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-pink-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-white/80">Rank Writer</span>
          </div>
          <p className="text-xs text-white/40">© 2026 Rank Writer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
