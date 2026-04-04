import { PenLine } from "lucide-react";

const BlogHeader = () => {
  return (
    <header className="text-center py-8 md:py-10">
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="p-2.5 rounded-xl bg-primary/10">
          <PenLine className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
          Rank Writer
        </h1>
      </div>
      <p className="text-muted-foreground text-lg max-w-md mx-auto">
        Create SEO-optimized blog articles instantly
      </p>
    </header>
  );
};

export default BlogHeader;
