export interface BlogArticle {
  title: string;
  metaDescription: string;
  keywords: string[];
  outline: string;
  article: string;
  conclusion: string;
}

export interface SeoScore {
  score: number;
  suggestions: string[];
}

export interface ArticleVariation {
  title: string;
  article: string;
  conclusion: string;
}
