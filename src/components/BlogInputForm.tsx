import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, Crown, Save, FileText, Trash2, Search, Lock } from "lucide-react";
import { useTemplates, type Template } from "@/hooks/useTemplates";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BlogInputFormProps {
  onGenerate: (topic: string, tone: string, wordCount: string, primaryKeyword?: string, secondaryKeywords?: string, outline?: string, instructions?: string) => void;
  isLoading: boolean;
  isPro?: boolean;
  isPlus?: boolean;
}

const BlogInputForm = ({ onGenerate, isLoading, isPro = false, isPlus = false }: BlogInputFormProps) => {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [wordCount, setWordCount] = useState("1000");
  const [customWordCount, setCustomWordCount] = useState("");
  const [primaryKeyword, setPrimaryKeyword] = useState("");
  const [secondaryKeywords, setSecondaryKeywords] = useState("");
  const [outline, setOutline] = useState("");
  const [instructions, setInstructions] = useState("");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [suggestingKeywords, setSuggestingKeywords] = useState(false);

  const { templates, saveTemplate, deleteTemplate } = useTemplates();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    const finalWordCount = customWordCount.trim() || wordCount;
    onGenerate(
      topic.trim(),
      tone,
      finalWordCount,
      isPro ? primaryKeyword.trim() : undefined,
      isPro ? secondaryKeywords.trim() : undefined,
      isPro ? outline.trim() : undefined,
      isPro ? instructions.trim() : undefined
    );
  };

  const loadTemplate = (t: Template) => {
    setTone(t.tone);
    setWordCount(t.word_count);
    setPrimaryKeyword(t.primary_keyword || "");
    setSecondaryKeywords(t.secondary_keywords || "");
    setOutline(t.outline || "");
    setInstructions(t.instructions || "");
    toast({ title: "Template loaded", description: `"${t.name}" applied. Just enter your topic.` });
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) return;
    setSavingTemplate(true);
    const { error } = (await saveTemplate({
      name: templateName.trim(),
      tone,
      word_count: wordCount,
      primary_keyword: primaryKeyword,
      secondary_keywords: secondaryKeywords,
      outline,
      instructions,
    })) || {};
    setSavingTemplate(false);
    if (error) {
      toast({ title: "Error", description: "Failed to save template", variant: "destructive" });
    } else {
      toast({ title: "Template saved! 📄", description: `"${templateName}" saved for future use.` });
      setTemplateName("");
      setSaveDialogOpen(false);
    }
  };

  const handleDeleteTemplate = async (id: string, name: string) => {
    await deleteTemplate(id);
    toast({ title: "Deleted", description: `Template "${name}" removed.` });
  };

  const handleSuggestKeywords = async () => {
    if (!isPlus) {
      toast({ title: "Plus Feature 🔒", description: "Upgrade to Plus to unlock keyword suggestions." });
      navigate("/pricing");
      return;
    }
    if (!topic.trim()) {
      toast({ title: "Enter a topic", description: "Please enter a topic first to get keyword suggestions.", variant: "destructive" });
      return;
    }
    setSuggestingKeywords(true);
    try {
      const { data, error } = await supabase.functions.invoke("suggest-keywords", {
        body: { topic: topic.trim() },
      });
      if (error) throw error;
      if (data?.primaryKeyword) {
        setPrimaryKeyword(data.primaryKeyword);
      }
      if (data?.secondaryKeywords) {
        const allSecondary = [
          ...(data.secondaryKeywords || []),
          ...(data.longTailKeywords || []),
        ].join(", ");
        setSecondaryKeywords(allSecondary);
      }
      toast({ title: "Keywords suggested! 🔍", description: "AI-generated keywords have been filled in." });
    } catch (err: any) {
      toast({ title: "Failed", description: err.message || "Could not generate keyword suggestions.", variant: "destructive" });
    } finally {
      setSuggestingKeywords(false);
    }
  };

  const planLabel = isPlus
    ? "💎 Plus — Advanced SEO + AI"
    : isPro
      ? "⭐ Pro — Advanced SEO"
      : "Basic — Simple Blog";

  const planBadgeClass = isPlus
    ? "bg-violet-500/15 text-violet-600 border border-violet-500/30"
    : isPro
      ? "bg-amber-500/15 text-amber-600 border border-amber-500/30"
      : "bg-muted text-muted-foreground";

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-card rounded-2xl shadow-card p-6 md:p-8 space-y-5 border border-border"
      >
        {/* Plan indicator */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Generation Mode</span>
          <Badge
            variant="secondary"
            className={`text-[10px] font-semibold uppercase ${planBadgeClass}`}
          >
            {planLabel}
          </Badge>
        </div>

        {/* Template selector for Pro+ */}
        {isPro && templates.length > 0 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              Load Template
            </label>
            <div className="flex flex-wrap gap-2">
              {templates.map((t) => (
                <div key={t.id} className="group flex items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => loadTemplate(t)}
                    className="text-xs border-amber-500/30 hover:bg-amber-500/10"
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    {t.name}
                  </Button>
                  <button
                    type="button"
                    onClick={() => handleDeleteTemplate(t.id, t.name)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10"
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Topic / Keyword
          </label>
          <Input
            placeholder="e.g. How to start a SaaS business in 2025"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="h-12 text-base"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tone
            </label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="seo-optimized">
                  SEO Optimized {!isPro && "🔒"}
                </SelectItem>
              </SelectContent>
            </Select>
            {!isPro && tone === "seo-optimized" && (
              <p className="text-[11px] text-amber-600 mt-1 flex items-center gap-1">
                <Crown className="w-3 h-3" /> Pro tone — basic output will be used
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Word Count
            </label>
            <Select value={customWordCount ? "" : wordCount} onValueChange={(v) => { setWordCount(v); setCustomWordCount(""); }}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder={customWordCount ? `Custom: ${customWordCount}` : undefined} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="500">~500 words</SelectItem>
                <SelectItem value="1000">~1,000 words</SelectItem>
                <SelectItem value="1500">
                  ~1,500 words {!isPro && "🔒"}
                </SelectItem>
                {isPro && <SelectItem value="2000">~2,000 words</SelectItem>}
                {isPro && <SelectItem value="2500">~2,500 words</SelectItem>}
              </SelectContent>
            </Select>
            {!isPro && (wordCount === "1500" || wordCount === "2000" || wordCount === "2500") && !customWordCount && (
              <p className="text-[11px] text-amber-600 mt-1 flex items-center gap-1">
                <Crown className="w-3 h-3" /> Pro feature — output limited to ~1,000 words
              </p>
            )}
            <div className="mt-2">
              <Input
                type="number"
                min={100}
                max={5000}
                placeholder="e.g. 600, 750, 1200"
                value={customWordCount}
                onChange={(e) => setCustomWordCount(e.target.value)}
                className="h-10"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Custom Word Count (optional) — overrides the dropdown selection
              </p>
            </div>
          </div>
        </div>

        {/* Pro-only advanced inputs */}
        {isPro && (
          <div className="space-y-4 border border-amber-500/20 rounded-xl p-4 bg-amber-500/5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 flex items-center gap-1">
                <Crown className="w-3 h-3" /> Pro Advanced Inputs
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSaveDialogOpen(true)}
                className="text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-500/10 gap-1"
              >
                <Save className="w-3 h-3" />
                Save as Template
              </Button>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-foreground">
                  Primary Keyword
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSuggestKeywords}
                  disabled={suggestingKeywords}
                  className={`text-xs gap-1 ${isPlus ? "text-violet-600 hover:text-violet-700 hover:bg-violet-500/10" : "text-muted-foreground"}`}
                >
                  {suggestingKeywords ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : isPlus ? (
                    <Search className="w-3 h-3" />
                  ) : (
                    <Lock className="w-3 h-3" />
                  )}
                  {suggestingKeywords ? "Suggesting..." : "Suggest Keywords"}
                  {!isPlus && (
                    <Badge variant="secondary" className="text-[8px] bg-violet-500/15 text-violet-600 border border-violet-500/30 ml-1">
                      PLUS
                    </Badge>
                  )}
                </Button>
              </div>
              <Input
                placeholder="e.g. how to start a SaaS business"
                value={primaryKeyword}
                onChange={(e) => setPrimaryKeyword(e.target.value)}
                className="h-11"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Secondary Keywords <span className="text-muted-foreground font-normal">(comma separated)</span>
              </label>
              <Input
                placeholder="e.g. SaaS startup, business plan, MVP, funding"
                value={secondaryKeywords}
                onChange={(e) => setSecondaryKeywords(e.target.value)}
                className="h-11"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Outline <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <Textarea
                placeholder={"e.g.\nH1: How to Start a SaaS\nH2: Market Research\nH2: Building MVP\nH2: Pricing Strategy"}
                value={outline}
                onChange={(e) => setOutline(e.target.value)}
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Instructions <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <Textarea
                placeholder="e.g. Focus on beginners, include real-world examples, avoid jargon"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Basic plan note */}
        {!isPro && (
          <div className="bg-muted/50 rounded-lg p-3 border border-border">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Basic Plan:</span> Simple blog structure. Upgrade to Pro for SEO keywords, meta descriptions, advanced formatting, and export options. Upgrade to Plus for SEO scoring, keyword suggestions, and article variations.
            </p>
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={isLoading || !topic.trim()}
          className="w-full h-12 text-base font-semibold gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Article
            </>
          )}
        </Button>
      </form>

      {/* Save Template Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Template Name</label>
              <Input
                placeholder="e.g. Tech Blog SEO Template"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              This will save your current tone, word count, keywords, outline, and instructions for future reuse.
            </p>
            <Button onClick={handleSaveTemplate} disabled={!templateName.trim() || savingTemplate} className="w-full">
              {savingTemplate ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BlogInputForm;
