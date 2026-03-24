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
import { Sparkles, Loader2, Crown } from "lucide-react";

interface BlogInputFormProps {
  onGenerate: (topic: string, tone: string, wordCount: string, primaryKeyword?: string, secondaryKeywords?: string, outline?: string, instructions?: string) => void;
  isLoading: boolean;
  isPro?: boolean;
}

const BlogInputForm = ({ onGenerate, isLoading, isPro = false }: BlogInputFormProps) => {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [wordCount, setWordCount] = useState("1000");
  const [primaryKeyword, setPrimaryKeyword] = useState("");
  const [secondaryKeywords, setSecondaryKeywords] = useState("");
  const [outline, setOutline] = useState("");
  const [instructions, setInstructions] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onGenerate(
      topic.trim(),
      tone,
      wordCount,
      isPro ? primaryKeyword.trim() : undefined,
      isPro ? secondaryKeywords.trim() : undefined,
      isPro ? outline.trim() : undefined,
      isPro ? instructions.trim() : undefined
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card rounded-2xl shadow-card p-6 md:p-8 space-y-5 border border-border"
    >
      {/* Plan indicator */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Generation Mode</span>
        <Badge
          variant="secondary"
          className={`text-[10px] font-semibold uppercase ${
            isPro
              ? "bg-amber-500/15 text-amber-600 border border-amber-500/30"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {isPro ? "⭐ Pro — Advanced SEO" : "Basic — Simple Blog"}
        </Badge>
      </div>

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
          <Select value={wordCount} onValueChange={setWordCount}>
            <SelectTrigger className="h-12">
              <SelectValue />
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
          {!isPro && (wordCount === "1500" || wordCount === "2000" || wordCount === "2500") && (
            <p className="text-[11px] text-amber-600 mt-1 flex items-center gap-1">
              <Crown className="w-3 h-3" /> Pro feature — output limited to ~1,000 words
            </p>
          )}
        </div>
      </div>

      {/* Pro-only advanced inputs */}
      {isPro && (
        <div className="space-y-4 border border-amber-500/20 rounded-xl p-4 bg-amber-500/5">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 flex items-center gap-1">
            <Crown className="w-3 h-3" /> Pro Advanced Inputs
          </p>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Keywords <span className="text-muted-foreground font-normal">(comma separated)</span>
            </label>
            <Input
              placeholder="e.g. SaaS, startup, business plan, funding"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
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

      {/* Pro features note */}
      {!isPro && (
        <div className="bg-muted/50 rounded-lg p-3 border border-border">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Basic Plan:</span> Simple blog structure. Upgrade to Pro for SEO keywords, meta descriptions, advanced formatting, and export options.
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
  );
};

export default BlogInputForm;
