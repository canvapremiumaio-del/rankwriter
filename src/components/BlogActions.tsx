import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, FileDown, FileText, Lock, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { BlogArticle } from "@/types/blog";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface BlogActionsProps {
  article: BlogArticle;
  isPro?: boolean;
  onArticleChange?: (updated: BlogArticle) => void;
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

const BlogActions = ({ article, isPro = true, onArticleChange }: BlogActionsProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isHumanizing, setIsHumanizing] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildPlainText(article));
    toast({ title: "Copied!", description: "Article copied to clipboard." });
  };

  const handleUpgradePrompt = () => {
    toast({
      title: "Pro Feature 🔒",
      description: "Upgrade to Pro to unlock this feature.",
    });
    navigate("/pricing");
  };

  const handleHumanize = async () => {
    if (!isPro) return handleUpgradePrompt();
    setIsHumanizing(true);
    try {
      const { data, error } = await supabase.functions.invoke("humanize-article", {
        body: { article: article.article },
      });
      if (error) throw error;
      if (data?.article && onArticleChange) {
        onArticleChange({ ...article, article: data.article });
        toast({
          title: "Article humanized! ✨",
          description: "Your article has been rewritten to sound more natural.",
        });
      }
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

  const handleDownloadPdf = async () => {
    if (!isPro) return handleUpgradePrompt();
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
  };

  const handleDownloadDoc = () => {
    if (!isPro) return handleUpgradePrompt();
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
    </div>
  );
};

export default BlogActions;
