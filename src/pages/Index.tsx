import { useState } from "react";
import BlogHeader from "@/components/BlogHeader";
import BlogInputForm from "@/components/BlogInputForm";
import BlogOutput from "@/components/BlogOutput";
import BlogActions from "@/components/BlogActions";
import type { BlogArticle } from "@/types/blog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async (topic: string, tone: string, wordCount: string) => {
    setIsLoading(true);
    setArticle(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-blog", {
        body: { topic, tone, wordCount },
      });

      if (error) throw error;

      setArticle(data as BlogArticle);
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 pb-20">
        <BlogHeader />

        <BlogInputForm onGenerate={handleGenerate} isLoading={isLoading} />

        {article && (
          <div className="mt-10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <BlogOutput article={article} />
            <BlogActions article={article} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
