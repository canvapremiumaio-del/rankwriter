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

      if (!error && data) {
        setPlan(data.plan as PlanType);
      }
      setLoading(false);
    };

    fetchPlan();
  }, [user]);

  const updatePlan = async (newPlan: PlanType) => {
    if (!user) return;
    const { error } = await supabase
      .from("user_plans")
      .update({ plan: newPlan, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);

    if (!error) setPlan(newPlan);
    return error;
  };

  const isPro = plan === "pro";

  return { plan, isPro, loading, updatePlan };
};
