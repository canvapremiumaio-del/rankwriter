import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import BlogHeader from "@/components/BlogHeader";
import BlogOutput from "@/components/BlogOutput";
import BlogActions from "@/components/BlogActions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, ArrowLeft, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
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
  const navigate = useNavigate();
  const { toast } = useToast();
  const [articles, setArticles] = useState<SavedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

      if (error) {
        console.error(error);
      } else {
        setArticles(data || []);
      }
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

  const toBlogArticle = (a: SavedArticle): BlogArticle => ({
    title: a.title,
    metaDescription: a.meta_description,
    keywords: a.keywords,
    outline: a.outline,
    article: a.article,
    conclusion: a.conclusion,
  });

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
            <Button variant="outline" className="mt-4" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Generate your first article
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((a) => (
              <div
                key={a.id}
                className="bg-card rounded-2xl shadow-card border border-border overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                  className="w-full p-5 text-left flex items-start justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground truncate">{a.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">{a.tone}</Badge>
                      <Badge variant="secondary" className="text-xs">{a.word_count} words</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(a.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {expandedId === a.id ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0 mt-1" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0 mt-1" />
                  )}
                </button>

                {expandedId === a.id && (
                  <div className="px-5 pb-5 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <BlogOutput article={toBlogArticle(a)} />
                    <BlogActions article={toBlogArticle(a)} />
                    <div className="flex justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(a.id)}
                        className="gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
