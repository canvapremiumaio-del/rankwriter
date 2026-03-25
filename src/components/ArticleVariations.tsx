import type { ArticleVariation } from "@/types/blog";
import { Badge } from "@/components/ui/badge";

interface ArticleVariationsProps {
  variations: ArticleVariation[];
}

const ArticleVariations = ({ variations }: ArticleVariationsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-foreground">Article Variations</h3>
        <Badge variant="secondary" className="text-[10px] bg-violet-500/15 text-violet-600 border border-violet-500/30">
          PLUS
        </Badge>
      </div>
      {variations.map((v, i) => (
        <div key={i} className="bg-card rounded-2xl border border-border p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">Version {i + 2}</Badge>
          </div>
          <h4 className="text-xl font-bold text-foreground">{v.title}</h4>
          <div className="prose prose-sm max-w-none text-foreground/90 whitespace-pre-wrap leading-relaxed">
            {v.article}
          </div>
          <div className="prose prose-sm max-w-none text-foreground/90 bg-accent/30 rounded-lg p-4 border border-border whitespace-pre-wrap">
            {v.conclusion}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArticleVariations;
