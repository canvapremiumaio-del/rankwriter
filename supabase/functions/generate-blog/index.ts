import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, tone, wordCount } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `You are a professional SEO content writer and formatter.

Task: Create a fully optimized blog article.

Topic: ${topic}

Step 1: Generate 5 SEO keywords related to the topic.

Step 2: Create a structured outline:
- Title (SEO optimized)
- H1, H2, H3 headings

Step 3: Write a high-quality article:
- Engaging introduction
- Detailed sections under each heading
- Use bullet points and short paragraphs
- Maintain ${tone} tone
- Word count: ${wordCount} words

Step 4: Add SEO elements:
- Meta description (150–160 characters)
- Keywords used naturally
- Suggested tags

Step 5: Format properly:
- Clean spacing
- Proper headings
- Readable structure

Return the result as a JSON object with these exact keys:
- title (string)
- metaDescription (string)
- keywords (array of strings)
- outline (string with the structured outline)
- article (string with the full article body)
- conclusion (string)

Return ONLY the JSON object, no markdown fences.`;

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
            {
              role: "system",
              content:
                "You are an expert SEO blog writer. Always respond with valid JSON only, no markdown code fences.",
            },
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
      // Fallback: parse from content
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
