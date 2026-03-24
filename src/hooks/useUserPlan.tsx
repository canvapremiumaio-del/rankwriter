import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type PlanType = "basic" | "pro";

export const useUserPlan = () => {
  const { user } = useAuth();
  const [plan, setPlan] = useState<PlanType>("basic");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchPlan = async () => {
      const { data, error } = await supabase
        .from("user_plans")
        .select("plan")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        setLoading(false);
        return;
      }

      if (data?.plan) {
        setPlan(data.plan as PlanType);
        setLoading(false);
        return;
      }

      // Self-heal missing row for older accounts
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

  return { plan, isPro, loading, updatePlan };
};
