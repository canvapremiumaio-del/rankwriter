import { useState, useCallback } from "react";
import type { BlogArticle } from "@/types/blog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Check, Lock, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BlogOutputProps {
  article: BlogArticle;
  onArticleChange?: (updated: BlogArticle) => void;
  editable?: boolean;
  isPro?: boolean;
}

const Section = ({
  label,
  editing,
  onToggleEdit,
  editable,
  children,
}: {
  label: string;
  editing?: boolean;
  onToggleEdit?: () => void;
  editable?: boolean;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </h3>
      {editable && onToggleEdit && (
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onToggleEdit}>
          {editing ? <Check className="w-3.5 h-3.5 text-primary" /> : <Pencil className="w-3.5 h-3.5" />}
        </Button>
      )}
    </div>
    {children}
  </div>
);

const LockedSection = ({ label }: { label: string }) => {
  const navigate = useNavigate();
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </h3>
      <div className="bg-muted/40 rounded-lg p-4 border border-border border-dashed flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Lock className="w-4 h-4" />
          <span>Upgrade to Pro to unlock {label.toLowerCase()}</span>
        </div>
        <Button variant="ghost" size="sm" className="text-xs text-primary gap-1" onClick={() => navigate("/pricing")}>
          <Crown className="w-3 h-3" /> Upgrade
        </Button>
      </div>
    </div>
  );
};

const BlogOutput = ({ article, onArticleChange, editable = false, isPro = true }: BlogOutputProps) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [keywordInput, setKeywordInput] = useState("");

  const toggleEdit = useCallback((field: string) => {
    setEditingField((prev) => (prev === field ? null : field));
    if (field === "keywords") setKeywordInput(article.keywords.join(", "));
  }, [article.keywords]);

  const update = useCallback(
    (field: keyof BlogArticle, value: string | string[]) => {
      onArticleChange?.({ ...article, [field]: value });
    },
    [article, onArticleChange]
  );

  const saveKeywords = useCallback(() => {
    update("keywords", keywordInput.split(",").map((k) => k.trim()).filter(Boolean));
    setEditingField(null);
  }, [keywordInput, update]);

  return (
    <div className="bg-card rounded-2xl shadow-card border border-border p-6 md:p-8 space-y-8">
      <Section label="Title" editing={editingField === "title"} onToggleEdit={() => toggleEdit("title")} editable={editable}>
        {editingField === "title" ? (
          <Input
            value={article.title}
            onChange={(e) => update("title", e.target.value)}
            className="text-xl font-bold"
          />
        ) : (
          <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">{article.title}</h2>
        )}
      </Section>

      {isPro ? (
        <Section label="Meta Description" editing={editingField === "metaDescription"} onToggleEdit={() => toggleEdit("metaDescription")} editable={editable}>
          {editingField === "metaDescription" ? (
            <Textarea
              value={article.metaDescription}
              onChange={(e) => update("metaDescription", e.target.value)}
              rows={3}
            />
          ) : (
            <p className="text-muted-foreground text-sm leading-relaxed bg-muted/50 rounded-lg p-4 border border-border">
              {article.metaDescription}
            </p>
          )}
        </Section>
      ) : (
        <LockedSection label="Meta Description" />
      )}

      {isPro ? (
        <Section label="Keywords" editing={editingField === "keywords"} onToggleEdit={() => (editingField === "keywords" ? saveKeywords() : toggleEdit("keywords"))} editable={editable}>
          {editingField === "keywords" ? (
            <Input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="keyword1, keyword2, keyword3"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {article.keywords.map((kw) => (
                <Badge key={kw} variant="secondary" className="text-xs font-medium">{kw}</Badge>
              ))}
            </div>
          )}
        </Section>
      ) : (
        <LockedSection label="SEO Keywords" />
      )}

      <Section label="Outline" editing={editingField === "outline"} onToggleEdit={() => toggleEdit("outline")} editable={editable}>
        {editingField === "outline" ? (
          <Textarea
            value={article.outline}
            onChange={(e) => update("outline", e.target.value)}
            rows={8}
          />
        ) : (
          <div className="prose prose-sm max-w-none text-foreground/90 bg-muted/30 rounded-lg p-4 border border-border whitespace-pre-wrap">
            {article.outline}
          </div>
        )}
      </Section>

      <Section label="Full Article" editing={editingField === "article"} onToggleEdit={() => toggleEdit("article")} editable={editable}>
        {editingField === "article" ? (
          <Textarea
            value={article.article}
            onChange={(e) => update("article", e.target.value)}
            rows={20}
            className="min-h-[300px]"
          />
        ) : (
          <div className="prose prose-sm md:prose-base max-w-none text-foreground/90 whitespace-pre-wrap leading-relaxed">
            {article.article}
          </div>
        )}
      </Section>

      <Section label="Conclusion" editing={editingField === "conclusion"} onToggleEdit={() => toggleEdit("conclusion")} editable={editable}>
        {editingField === "conclusion" ? (
          <Textarea
            value={article.conclusion}
            onChange={(e) => update("conclusion", e.target.value)}
            rows={6}
          />
        ) : (
          <div className="prose prose-sm max-w-none text-foreground/90 bg-accent/30 rounded-lg p-4 border border-border whitespace-pre-wrap">
            {article.conclusion}
          </div>
        )}
      </Section>
    </div>
  );
};

export default BlogOutput;
