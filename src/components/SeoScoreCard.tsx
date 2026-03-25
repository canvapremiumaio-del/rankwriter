import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, BarChart3, Lock, Crown, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import type { BlogArticle, SeoScore } from "@/types/blog";

interface SeoScoreCardProps {
  article: BlogArticle;
  isPlus: boolean;
  seoScore: SeoScore | null;
  onSeoScoreChange: (score: SeoScore | null) => void;
  primaryKeyword: string;
  secondaryKeywords: string;
}

const SeoScoreCard = ({ article, isPlus, seoScore, onSeoScoreChange, primaryKeyword, secondaryKeywords }: SeoScoreCardProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!isPlus) {
      toast({ title: "Plus Feature 🔒", description: "Upgrade to Plus to unlock SEO Score." });
      navigate("/pricing");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("seo-score", {
        body: { article: article.article, primaryKeyword, secondaryKeywords },
      });
      if (error) throw error;
      onSeoScoreChange(data as SeoScore);
    } catch (err: any) {
      toast({ title: "Analysis failed", description: err.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-500/10 border-emerald-500/30";
    if (score >= 60) return "bg-amber-500/10 border-amber-500/30";
    return "bg-red-500/10 border-red-500/30";
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-violet-500" />
          <h3 className="font-semibold text-foreground">SEO Score</h3>
          <Badge variant="secondary" className="text-[10px] bg-violet-500/15 text-violet-600 border border-violet-500/30">
            PLUS
          </Badge>
        </div>
        {!seoScore && (
          <Button onClick={handleAnalyze} disabled={loading} size="sm" variant="outline" className="gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isPlus ? <BarChart3 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            {loading ? "Analyzing..." : "Analyze SEO"}
          </Button>
        )}
      </div>

      {seoScore ? (
        <div className="space-y-4">
          <div className={`rounded-xl border p-4 text-center ${getScoreBg(seoScore.score)}`}>
            <div className={`text-4xl font-bold ${getScoreColor(seoScore.score)}`}>
              {seoScore.score}/100
            </div>
            <p className="text-sm text-muted-foreground mt-1">SEO Score</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
              <Lightbulb className="w-3 h-3" /> Suggestions
            </p>
            <ul className="space-y-2">
              {seoScore.suggestions.map((s, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-violet-500 font-bold mt-0.5">•</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        !isPlus && (
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Upgrade to Plus to get AI-powered SEO analysis.
            <Button variant="ghost" size="sm" className="text-xs text-primary gap-1 ml-auto" onClick={() => navigate("/pricing")}>
              <Crown className="w-3 h-3" /> Upgrade
            </Button>
          </p>
        )
      )}
    </div>
  );
};

export default SeoScoreCard;
