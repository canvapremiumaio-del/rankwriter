import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BlogHeader from "@/components/BlogHeader";
import BlogInputForm from "@/components/BlogInputForm";
import BlogOutput from "@/components/BlogOutput";
import BlogActions from "@/components/BlogActions";
import DashboardSidebar from "@/components/DashboardSidebar";
import type { BlogArticle, SeoScore, ArticleVariation } from "@/types/blog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useUserPlan } from "@/hooks/useUserPlan";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import SeoScoreCard from "@/components/SeoScoreCard";
import ArticleVariations from "@/components/ArticleVariations";

const Generator = () => {
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [seoScore, setSeoScore] = useState<SeoScore | null>(null);
  const [variations, setVariations] = useState<ArticleVariation[]>([]);
  const [lastGenParams, setLastGenParams] = useState<{ topic: string; primaryKeyword: string; secondaryKeywords: string }>({
    topic: "", primaryKeyword: "", secondaryKeywords: "",
  });
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { plan, isPro, isPlus, loading: planLoading } = useUserPlan();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { replace: true });
  }, [user, authLoading, navigate]);

  const handleGenerate = async (topic: string, tone: string, wordCount: string, primaryKeyword?: string, secondaryKeywords?: string, outline?: string, instructions?: string) => {
    setIsLoading(true);
    setArticle(null);
    setSeoScore(null);
    setVariations([]);

    try {
      const { data, error } = await supabase.functions.invoke("generate-blog", {
        body: { topic, tone, wordCount, plan, primaryKeyword, secondaryKeywords, outline, instructions },
      });

      if (error) throw error;

      const generated = data as BlogArticle;
      setArticle(generated);
      setLastGenParams({ topic, primaryKeyword: primaryKeyword || "", secondaryKeywords: secondaryKeywords || "" });

      toast({
        title: "Article generated! ✨",
        description: "Your article is ready. Scroll down to view it.",
      });

      if (user) {
        const { error: saveError } = await supabase.from("articles").insert({
          user_id: user.id,
          topic,
          tone,
          word_count: wordCount,
          title: generated.title,
          meta_description: generated.metaDescription,
          keywords: generated.keywords,
          outline: generated.outline,
          article: generated.article,
          conclusion: generated.conclusion,
        });
        if (saveError) console.error("Failed to save article:", saveError);
      }
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Generation failed",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="max-w-3xl mx-auto px-6 py-8 w-full">
          <BlogHeader />
          <BlogInputForm onGenerate={handleGenerate} isLoading={isLoading} isPro={isPro} isPlus={isPlus} />

          {article && (
            <div className="mt-10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <BlogOutput article={article} onArticleChange={setArticle} editable isPro={isPro} />
              
              <SeoScoreCard
                article={article}
                isPlus={isPlus}
                seoScore={seoScore}
                onSeoScoreChange={setSeoScore}
                primaryKeyword={lastGenParams.primaryKeyword}
                secondaryKeywords={lastGenParams.secondaryKeywords}
              />

              <BlogActions
                article={article}
                isPro={isPro}
                isPlus={isPlus}
                onArticleChange={setArticle}
                topic={lastGenParams.topic}
                primaryKeyword={lastGenParams.primaryKeyword}
                secondaryKeywords={lastGenParams.secondaryKeywords}
                variations={variations}
                onVariationsChange={setVariations}
              />

              {variations.length > 0 && (
                <ArticleVariations variations={variations} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Generator;
