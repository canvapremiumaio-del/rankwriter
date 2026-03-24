import { PenLine } from "lucide-react";

const BlogHeader = () => {
  return (
    <header className="text-center py-12 md:py-16">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-primary/10">
          <PenLine className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
          Rank Writer
        </h1>
      </div>
      <p className="text-muted-foreground text-lg max-w-md mx-auto">
        Generate SEO-optimized blog articles instantly
      </p>
    </header>
  );
};

export default BlogHeader;
