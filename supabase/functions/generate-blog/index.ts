import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function getBasicPrompt(topic: string, tone: string, wordCount: string) {
  return `You are an SEO blog writer.

Write a blog on: ${topic}

Include:
- A clear, engaging title
- An introduction
- 3-4 sections with headings
- A conclusion

Keep it simple and readable.
Tone: ${tone}
Word count: approximately ${wordCount} words.

Return the result using the return_blog_article function.`;
}

function getProPrompt(topic: string, tone: string, wordCount: string) {
  return `You are a professional SEO content strategist.

Topic: ${topic}

Step 1: Generate 5-8 SEO keywords related to the topic.

Step 2: Create a structured outline with:
- SEO-optimized title
- H1, H2, H3 headings

Step 3: Write a high-quality, detailed article:
- Engaging introduction with hook
- Detailed sections under each heading
- Use bullet points, short paragraphs, and data where relevant
- Maintain ${tone} tone
- Word count: approximately ${wordCount} words

Step 4: Add SEO elements:
- Meta description (150-160 characters)
- Keywords used naturally throughout
- Suggested tags

Step 5: Format with:
- Clean spacing
- Proper heading hierarchy
- Readable structure

Make it highly professional and SEO optimized.

Return the result using the return_blog_article function.`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, tone, wordCount, plan } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const isPro = plan === "pro";
    const prompt = isPro
      ? getProPrompt(topic, tone, wordCount)
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
