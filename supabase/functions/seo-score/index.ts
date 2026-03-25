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
    const { article, primaryKeyword, secondaryKeywords } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are an SEO analysis expert. Analyze articles for SEO quality." },
          {
            role: "user",
            content: `Analyze this article for SEO quality.

Primary Keyword: ${primaryKeyword || "not specified"}
Secondary Keywords: ${secondaryKeywords || "not specified"}

Article:
${article}

Evaluate:
- Primary keyword usage (in title, intro, headings, throughout)
- Secondary keyword integration
- Heading structure (H1/H2/H3 hierarchy)
- Readability (sentence variety, paragraph length, transitions)
- Meta optimization potential

Give an SEO score out of 100 and exactly 3 specific improvement suggestions.

Return the result using the return_seo_score function.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_seo_score",
              description: "Return SEO analysis results",
              parameters: {
                type: "object",
                properties: {
                  score: { type: "number", description: "SEO score from 0 to 100" },
                  suggestions: {
                    type: "array",
                    items: { type: "string" },
                    description: "Exactly 3 improvement suggestions",
                  },
                },
                required: ["score", "suggestions"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_seo_score" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    const result = toolCall
      ? JSON.parse(toolCall.function.arguments)
      : JSON.parse(data.choices?.[0]?.message?.content || "{}");

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("seo-score error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
