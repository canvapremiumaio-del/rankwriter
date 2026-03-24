import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserPlan } from "@/hooks/useUserPlan";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, ArrowLeft, Loader2, ExternalLink, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { BlogArticle } from "@/types/blog";
import NavBar from "@/components/NavBar";

interface SavedArticle {
  id: string;
  topic: string;
  tone: string;
  word_count: string;
  title: string;
  meta_description: string;
  keywords: string[];
  outline: string;
  article: string;
  conclusion: string;
  created_at: string;
}

const History = () => {
  const { user, loading: authLoading } = useAuth();
  const { isPro } = useUserPlan();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [articles, setArticles] = useState<SavedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { replace: true });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      else setArticles(data || []);
      setLoading(false);
    };
    fetchArticles();
  }, [user]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setArticles((prev) => prev.filter((a) => a.id !== id));
      toast({ title: "Deleted", description: "Article removed from history." });
    }
  };

  const handleRegenerate = async (a: SavedArticle) => {
    setRegeneratingId(a.id);
    try {
      const { data, error } = await supabase.functions.invoke("generate-blog", {
        body: { topic: a.topic, tone: a.tone, wordCount: a.word_count, plan: isPro ? "pro" : "basic" },
      });
      if (error) throw error;

      const generated = data as BlogArticle;
      if (user) {
        await supabase.from("articles").insert({
          user_id: user.id,
          topic: a.topic,
          tone: a.tone,
          word_count: a.word_count,
          title: generated.title,
          meta_description: generated.metaDescription,
          keywords: generated.keywords,
          outline: generated.outline,
          article: generated.article,
          conclusion: generated.conclusion,
        });
      }

      // Refresh the list
      const { data: refreshed } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });
      if (refreshed) setArticles(refreshed);

      toast({ title: "Regenerated! ✨", description: "A new version has been created." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to regenerate.", variant: "destructive" });
    } finally {
      setRegeneratingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="max-w-3xl mx-auto px-4 pb-20 pt-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Article History</h2>

        {articles.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No articles yet.</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate("/generate")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Generate your first article
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {articles.map((a) => (
              <div
                key={a.id}
                className="bg-card rounded-2xl border border-border p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3
                      className="font-semibold text-foreground truncate cursor-pointer hover:text-primary transition-colors"
                      onClick={() => navigate(`/article/${a.id}`)}
                    >
                      {a.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">{a.tone}</Badge>
                      <Badge variant="secondary" className="text-xs">{a.word_count} words</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(a.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/article/${a.id}`)}
                      title="View article"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRegenerate(a)}
                      disabled={regeneratingId === a.id}
                      title="Regenerate"
                    >
                      <RefreshCw className={`w-4 h-4 ${regeneratingId === a.id ? "animate-spin" : ""}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(a.id)}
                      title="Delete"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
