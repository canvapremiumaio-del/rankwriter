import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type PlanType = "basic" | "pro";

export const useUserPlan = () => {
  const { user } = useAuth();
  const [plan, setPlan] = useState<PlanType>("basic");
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchPlan = async () => {
      const { data, error } = await supabase
        .from("user_plans")
        .select("plan, expires_at")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        setLoading(false);
        return;
      }

      if (data?.plan) {
        // Check if plan has expired
        const expired = data.expires_at && new Date(data.expires_at) < new Date();
        if (expired && data.plan === "pro") {
          // Auto-downgrade to basic
          await supabase
            .from("user_plans")
            .update({ plan: "basic", expires_at: null, updated_at: new Date().toISOString() })
            .eq("user_id", user.id);
          setPlan("basic");
          setExpiresAt(null);
        } else {
          setPlan(data.plan as PlanType);
          setExpiresAt(data.expires_at || null);
        }
        setLoading(false);
        return;
      }

      // Self-heal missing row
      await supabase
        .from("user_plans")
        .upsert(
          { user_id: user.id, plan: "basic", updated_at: new Date().toISOString() },
          { onConflict: "user_id" }
        );

      setPlan("basic");
      setLoading(false);
    };

    fetchPlan();
  }, [user]);

  const updatePlan = async (newPlan: PlanType) => {
    if (!user) return;

    const { error } = await supabase
      .from("user_plans")
      .upsert(
        { user_id: user.id, plan: newPlan, updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );

    if (!error) setPlan(newPlan);
    return error;
  };

  const isPro = plan === "pro";

  return { plan, isPro, loading, updatePlan, expiresAt };
};
