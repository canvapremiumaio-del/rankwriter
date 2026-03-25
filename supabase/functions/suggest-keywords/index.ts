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
    const { topic } = await req.json();
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
          { role: "system", content: "You are an SEO keyword research expert." },
          {
            role: "user",
            content: `Generate SEO keyword suggestions for this topic: "${topic}"

Provide:
- 1 best primary keyword (most relevant, high search intent)
- 5-10 secondary keywords (related terms, LSI keywords)
- 3 long-tail keyword variations (specific phrases with 4+ words)

Return the result using the return_keywords function.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_keywords",
              description: "Return keyword suggestions",
              parameters: {
                type: "object",
                properties: {
                  primaryKeyword: { type: "string" },
                  secondaryKeywords: { type: "array", items: { type: "string" } },
                  longTailKeywords: { type: "array", items: { type: "string" } },
                },
                required: ["primaryKeyword", "secondaryKeywords", "longTailKeywords"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_keywords" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
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
    const keywords = toolCall
      ? JSON.parse(toolCall.function.arguments)
      : JSON.parse(data.choices?.[0]?.message?.content || "{}");

    return new Response(JSON.stringify(keywords), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("suggest-keywords error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
