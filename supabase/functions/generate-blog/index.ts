import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function getBasicPrompt(topic: string, tone: string, wordCount: string) {
  return `You are a blog writer.

Write a blog article on: ${topic}

Requirements:
- Natural human-like tone
- Simple and readable
- Include title, intro, headings, and conclusion
- Avoid robotic phrasing
- Use conversational language
- Mix short and long sentences for natural flow
- Add personal touches and relatable examples

Tone: ${tone}
Word count: approximately ${wordCount} words.

Return the result using the return_blog_article function.`;
}

function getProPrompt(topic: string, tone: string, wordCount: string, primaryKeyword?: string, secondaryKeywords?: string, outline?: string, instructions?: string) {
  const primaryBlock = primaryKeyword
    ? `\nPrimary Keyword: ${primaryKeyword}\n- Use the primary keyword in:\n  • Title\n  • Introduction (first paragraph)\n  • At least one H2 heading\n  • Naturally throughout the article`
    : "";

  const secondaryBlock = secondaryKeywords
    ? `\nSecondary Keywords: ${secondaryKeywords}\n- Use secondary keywords naturally where relevant (do not force)`
    : "";

  const outlineBlock = outline
    ? `\nUser-provided Outline:\n${outline}\nFollow this outline strictly. Structure the article based on these headings.`
    : `\nCreate a structured outline with:\n- SEO-optimized title\n- H1, H2, H3 headings`;

  const instructionsBlock = instructions
    ? `\nUser Instructions: ${instructions}\nDo not ignore these instructions.`
    : "";

  return `You are a professional SEO strategist and expert human writer.

Topic: ${topic}
${primaryBlock}
${secondaryBlock}
${outlineBlock}
${instructionsBlock}

Write a high-quality, detailed article:
- Strong introduction with a hook
- Detailed sections under each heading
- Human-like tone throughout
- Mix sentence styles (short, medium, long)
- Add transitions between sections
- Avoid AI-like patterns and robotic phrasing
- Use bullet points where appropriate
- Include relatable examples and anecdotes
- Maintain SEO optimization without keyword stuffing
- Tone: ${tone}
- Word count: approximately ${wordCount} words

Add SEO elements:
- Meta description (150-160 characters)
- Keywords used naturally throughout
- Suggested tags

Format with:
- Clean spacing
- Proper heading hierarchy
- Readable structure

Make it highly professional, SEO optimized, and indistinguishable from human writing.

Return the result using the return_blog_article function.`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, tone, wordCount, plan, primaryKeyword, secondaryKeywords, outline, instructions } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const isPro = plan === "pro";
    const prompt = isPro
      ? getProPrompt(topic, tone, wordCount, primaryKeyword, secondaryKeywords, outline, instructions)
      : getBasicPrompt(topic, tone, wordCount);

    const systemMessage = isPro
      ? "You are an expert SEO content strategist. Produce highly detailed, professionally structured content."
      : "You are a helpful blog writer. Produce clear, readable blog content.";

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: prompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "return_blog_article",
                description: "Return the generated blog article in structured format",
                parameters: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    metaDescription: { type: "string" },
                    keywords: { type: "array", items: { type: "string" } },
                    outline: { type: "string" },
                    article: { type: "string" },
                    conclusion: { type: "string" },
                  },
                  required: ["title", "metaDescription", "keywords", "outline", "article", "conclusion"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "return_blog_article" } },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Credits exhausted. Please add funds in Settings." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    let article;

    if (toolCall) {
      article = JSON.parse(toolCall.function.arguments);
    } else {
      const content = data.choices?.[0]?.message?.content || "";
      const cleaned = content.replace(/```json\n?|```\n?/g, "").trim();
      article = JSON.parse(cleaned);
    }

    return new Response(JSON.stringify(article), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-blog error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
