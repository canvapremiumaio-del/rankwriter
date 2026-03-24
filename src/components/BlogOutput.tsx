import type { BlogArticle } from "@/types/blog";
import { Badge } from "@/components/ui/badge";

interface BlogOutputProps {
  article: BlogArticle;
}

const Section = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
      {label}
    </h3>
    {children}
  </div>
);

const BlogOutput = ({ article }: BlogOutputProps) => {
  return (
    <div className="bg-card rounded-2xl shadow-card border border-border p-6 md:p-8 space-y-8">
      <Section label="Title">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
          {article.title}
        </h2>
      </Section>

      <Section label="Meta Description">
        <p className="text-muted-foreground text-sm leading-relaxed bg-muted/50 rounded-lg p-4 border border-border">
          {article.metaDescription}
        </p>
      </Section>

      <Section label="Keywords">
        <div className="flex flex-wrap gap-2">
          {article.keywords.map((kw) => (
            <Badge key={kw} variant="secondary" className="text-xs font-medium">
              {kw}
            </Badge>
          ))}
        </div>
      </Section>

      <Section label="Outline">
        <div className="prose prose-sm max-w-none text-foreground/90 bg-muted/30 rounded-lg p-4 border border-border whitespace-pre-wrap">
          {article.outline}
        </div>
      </Section>

      <Section label="Full Article">
        <div className="prose prose-sm md:prose-base max-w-none text-foreground/90 whitespace-pre-wrap leading-relaxed">
          {article.article}
        </div>
      </Section>

      <Section label="Conclusion">
        <div className="prose prose-sm max-w-none text-foreground/90 bg-accent/30 rounded-lg p-4 border border-border whitespace-pre-wrap">
          {article.conclusion}
        </div>
      </Section>
    </div>
  );
};

export default BlogOutput;
