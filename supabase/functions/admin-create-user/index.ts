import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization header");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify caller is admin
    const callerClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller } } = await callerClient.auth.getUser();
    if (!caller) throw new Error("Not authenticated");

    const { data: roleCheck } = await callerClient
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleCheck) throw new Error("Admin access required");

    const { email, password, plan } = await req.json();
    if (!email || !password) throw new Error("Email and password are required");
    if (String(password).length < 6) throw new Error("Password must be at least 6 characters");

    const selectedPlan = plan === "pro" || plan === "plus" ? plan : "basic";

    // Create user with service role
    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    let userId = newUser.user?.id;
    let alreadyExisted = false;

    if (createError) {
      if (createError.code !== "email_exists") throw createError;

      const { data: listedUsers, error: listError } = await adminClient.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });
      if (listError) throw listError;

      const existingUser = listedUsers.users.find(
        (u) => u.email?.toLowerCase() === String(email).toLowerCase()
      );
      if (!existingUser) throw createError;

      userId = existingUser.id;
      alreadyExisted = true;
    }

    if (!userId) throw new Error("Failed to resolve user account");

    const now = new Date().toISOString();

    const [profileRes, roleLookupRes, planLookupRes] = await Promise.all([
      adminClient
        .from("profiles")
        .upsert({ id: userId, email: String(email) }, { onConflict: "id" }),
      adminClient
        .from("user_roles")
        .select("id")
        .eq("user_id", userId)
        .eq("role", "user")
        .maybeSingle(),
      adminClient
        .from("user_plans")
        .select("id")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1),
    ]);

    if (profileRes.error) throw profileRes.error;
    if (roleLookupRes.error) throw roleLookupRes.error;
    if (planLookupRes.error) throw planLookupRes.error;

    if (!roleLookupRes.data) {
      const { error: roleInsertError } = await adminClient
        .from("user_roles")
        .insert({ user_id: userId, role: "user" });

      if (roleInsertError && roleInsertError.code !== "23505") throw roleInsertError;
    }

    if (planLookupRes.data.length > 0) {
      const { error: planUpdateError } = await adminClient
        .from("user_plans")
        .update({ plan: selectedPlan, updated_at: now })
        .eq("id", planLookupRes.data[0].id);

      if (planUpdateError) throw planUpdateError;
    } else {
      const { error: planInsertError } = await adminClient
        .from("user_plans")
        .insert({ user_id: userId, plan: selectedPlan, updated_at: now });

      if (planInsertError) throw planInsertError;
    }

    return new Response(
      JSON.stringify({ success: true, existing: alreadyExisted, user: { id: userId, email } }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("admin-create-user error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
