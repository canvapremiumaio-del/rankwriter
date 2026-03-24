import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BlogHeader from "@/components/BlogHeader";
import BlogInputForm from "@/components/BlogInputForm";
import BlogOutput from "@/components/BlogOutput";
import BlogActions from "@/components/BlogActions";
import NavBar from "@/components/NavBar";
import type { BlogArticle } from "@/types/blog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useUserPlan } from "@/hooks/useUserPlan";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Generator = () => {
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { plan, isPro, loading: planLoading } = useUserPlan();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { replace: true });
  }, [user, authLoading, navigate]);

  const handleGenerate = async (topic: string, tone: string, wordCount: string, primaryKeyword?: string, secondaryKeywords?: string, outline?: string, instructions?: string) => {
    setIsLoading(true);
    setArticle(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-blog", {
        body: { topic, tone, wordCount, plan, primaryKeyword, secondaryKeywords, outline, instructions },
      });

      if (error) throw error;

      const generated = data as BlogArticle;
      setArticle(generated);

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
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="max-w-3xl mx-auto px-4 pb-20">
        <BlogHeader />
        <BlogInputForm onGenerate={handleGenerate} isLoading={isLoading} isPro={isPro} />

        {article && (
          <div className="mt-10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <BlogOutput article={article} onArticleChange={setArticle} editable isPro={isPro} />
            <BlogActions article={article} isPro={isPro} onArticleChange={setArticle} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Generator;
