import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserPlan } from "@/hooks/useUserPlan";
import NavBar from "@/components/NavBar";
import BlogOutput from "@/components/BlogOutput";
import BlogActions from "@/components/BlogActions";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { BlogArticle } from "@/types/blog";

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const { isPro, loading: planLoading } = useUserPlan();
  const navigate = useNavigate();
  const [article, setArticle] = useState<(BlogArticle & { topic: string; tone: string; word_count: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { replace: true });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user || !id) return;
    const fetch = async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        navigate("/history", { replace: true });
        return;
      }
      setArticle({
        title: data.title,
        metaDescription: data.meta_description,
        keywords: data.keywords,
        outline: data.outline,
        article: data.article,
        conclusion: data.conclusion,
        topic: data.topic,
        tone: data.tone,
        word_count: data.word_count,
      });
      setLoading(false);
    };
    fetch();
  }, [user, id, navigate]);

  if (authLoading || planLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="max-w-3xl mx-auto px-4 pb-20 pt-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="space-y-6">
          <BlogOutput article={article} onArticleChange={(updated) => setArticle({ ...article, ...updated })} editable />
          <BlogActions article={article} isPro={isPro} />
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
