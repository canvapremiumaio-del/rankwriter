import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, FileDown, FileText, Lock, Sparkles, Loader2, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { BlogArticle, ArticleVariation } from "@/types/blog";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface BlogActionsProps {
  article: BlogArticle;
  isPro?: boolean;
  isPlus?: boolean;
  onArticleChange?: (updated: BlogArticle) => void;
  topic?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string;
  variations?: ArticleVariation[];
  onVariationsChange?: (v: ArticleVariation[]) => void;
}

function buildPlainText(article: BlogArticle): string {
  return [
    article.title,
    "",
    "Meta Description:",
    article.metaDescription,
    "",
    "Keywords: " + article.keywords.join(", "),
    "",
    "Outline:",
    article.outline,
    "",
    article.article,
    "",
    "Conclusion:",
    article.conclusion,
  ].join("\n");
}

const BlogActions = ({
  article,
  isPro = true,
  isPlus = false,
  onArticleChange,
  topic,
  primaryKeyword,
  secondaryKeywords,
  onVariationsChange,
}: BlogActionsProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isHumanizing, setIsHumanizing] = useState(false);
  const [isGeneratingVariations, setIsGeneratingVariations] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildPlainText(article));
    toast({ title: "Copied!", description: "Article copied to clipboard." });
  };

  const handleUpgradePrompt = (feature: string = "Pro") => {
    toast({
      title: `${feature} Feature 🔒`,
      description: `Upgrade to ${feature} to unlock this feature.`,
    });
    navigate("/pricing");
  };

  const handleHumanize = async () => {
    if (!isPro) return handleUpgradePrompt("Pro");
    setIsHumanizing(true);
    try {
      const { data, error } = await supabase.functions.invoke("humanize-article", {
        body: { article: article.article },
      });
      if (error) {
        console.error("humanize invoke error:", error);
        throw new Error(typeof error === "object" && error.message ? error.message : "Humanize request failed");
      }
      if (!data?.article) {
        throw new Error("No humanized content received. Please try again.");
      }
      if (onArticleChange) {
        onArticleChange({ ...article, article: data.article });
      }
      toast({
        title: "Article humanized! ✨",
        description: "Your article has been rewritten to sound more natural.",
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Humanize failed",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsHumanizing(false);
    }
  };

  const handleGenerateVariations = async () => {
    console.log("Generate Variations clicked. isPlus:", isPlus, "plan check passed");
    if (!isPlus) {
      console.log("User is not Plus, redirecting to pricing");
      return handleUpgradePrompt("Plus");
    }
    setIsGeneratingVariations(true);
    try {
      console.log("Calling generate-variations edge function...");
      const { data, error } = await supabase.functions.invoke("generate-variations", {
        body: { article: article.article, topic, primaryKeyword, secondaryKeywords },
      });
      console.log("generate-variations response:", { data, error });
      if (error) {
        console.error("variations invoke error:", error);
        throw new Error(typeof error === "object" && error.message ? error.message : "Variations request failed");
      }
      if (!data?.variations || !Array.isArray(data.variations) || data.variations.length === 0) {
        throw new Error("No variations received. Please try again.");
      }
      if (onVariationsChange) {
        onVariationsChange(data.variations);
      }
      toast({ title: "Variations ready! 🎯", description: `${data.variations.length} alternative versions generated.` });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Failed", description: err.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setIsGeneratingVariations(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!isPro) return handleUpgradePrompt("Pro");
    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      const margin = 15;
      const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
      let y = margin;

      const addText = (text: string, fontSize: number, bold = false) => {
        doc.setFontSize(fontSize);
        doc.setFont("helvetica", bold ? "bold" : "normal");
        const lines = doc.splitTextToSize(text, pageWidth);
        for (const line of lines) {
          if (y > 280) {
            doc.addPage();
            y = margin;
          }
          doc.text(line, margin, y);
          y += fontSize * 0.5;
        }
        y += 4;
      };

      addText(article.title, 18, true);
      addText("Meta Description:", 10, true);
      addText(article.metaDescription, 10);
      addText("Keywords: " + article.keywords.join(", "), 10);
      addText("Outline:", 12, true);
      addText(article.outline, 10);
      addText(article.article, 11);
      addText("Conclusion:", 12, true);
      addText(article.conclusion, 11);

      doc.save(`${article.title.slice(0, 40)}.pdf`);
      toast({ title: "PDF downloaded! 📄", description: "Your article has been saved as PDF." });
    } catch (err: any) {
      console.error("PDF download error:", err);
      toast({ title: "PDF download failed", description: err.message || "Something went wrong.", variant: "destructive" });
    }
  };

  const handleDownloadDoc = () => {
    if (!isPro) return handleUpgradePrompt("Pro");
    const html = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>${article.title}</title></head>
<body style="font-family:Arial,sans-serif;">
<h1>${article.title}</h1>
<h3>Meta Description</h3><p>${article.metaDescription}</p>
<h3>Keywords</h3><p>${article.keywords.join(", ")}</p>
<h3>Outline</h3><pre style="white-space:pre-wrap;">${article.outline}</pre>
<h3>Article</h3><div style="white-space:pre-wrap;">${article.article}</div>
<h3>Conclusion</h3><p style="white-space:pre-wrap;">${article.conclusion}</p>
</body></html>`;
    const blob = new Blob([html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${article.title.slice(0, 40)}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <Button variant="outline" onClick={handleCopy} className="gap-2">
        <Copy className="w-4 h-4" />
        Copy Article
      </Button>
      <Button
        variant="outline"
        onClick={handleHumanize}
        disabled={isHumanizing}
        className="gap-2"
      >
        {isHumanizing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isPro ? (
          <Sparkles className="w-4 h-4" />
        ) : (
          <Lock className="w-4 h-4" />
        )}
        {isHumanizing ? "Improving content..." : "Humanize Article"}
      </Button>
      <Button variant="outline" onClick={handleDownloadPdf} className="gap-2">
        {isPro ? <FileDown className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
        Download PDF
      </Button>
      <Button variant="outline" onClick={handleDownloadDoc} className="gap-2">
        {isPro ? <FileText className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
        Download Word
      </Button>
      <Button
        variant="outline"
        onClick={handleGenerateVariations}
        disabled={isGeneratingVariations}
        className="gap-2"
      >
        {isGeneratingVariations ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isPlus ? (
          <Layers className="w-4 h-4" />
        ) : (
          <Lock className="w-4 h-4" />
        )}
        {isGeneratingVariations ? "Generating..." : "Generate Variations"}
      </Button>
    </div>
  );
};

export default BlogActions;
