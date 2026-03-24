import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Loader2 } from "lucide-react";

interface BlogInputFormProps {
  onGenerate: (topic: string, tone: string, wordCount: string) => void;
  isLoading: boolean;
}

const BlogInputForm = ({ onGenerate, isLoading }: BlogInputFormProps) => {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [wordCount, setWordCount] = useState("1000");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onGenerate(topic.trim(), tone, wordCount);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card rounded-2xl shadow-card p-6 md:p-8 space-y-5 border border-border"
    >
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
              <SelectItem value="seo-optimized">SEO Optimized</SelectItem>
            </SelectContent>
          </Select>
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
              <SelectItem value="1500">~1,500 words</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
