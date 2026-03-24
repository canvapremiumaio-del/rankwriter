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
      setPlan("basic");
      setExpiresAt(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchPlan = async () => {
      try {
        const { data, error } = await supabase
          .from("user_plans")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (cancelled) return;

        if (error) {
          setLoading(false);
          return;
        }

        if (data) {
          const planExpiry = (data as any).expires_at as string | null;
          const expired = planExpiry && new Date(planExpiry) < new Date();

          if (expired && data.plan === "pro") {
            await supabase
              .from("user_plans")
              .update({ plan: "basic", updated_at: new Date().toISOString() } as any)
              .eq("user_id", user.id);
            if (!cancelled) {
              setPlan("basic");
              setExpiresAt(null);
            }
          } else {
            if (!cancelled) {
              setPlan(data.plan as PlanType);
              setExpiresAt(planExpiry || null);
            }
          }
        } else {
          // Self-heal missing row
          await supabase
            .from("user_plans")
            .upsert(
              { user_id: user.id, plan: "basic", updated_at: new Date().toISOString() },
              { onConflict: "user_id" }
            );
          if (!cancelled) setPlan("basic");
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPlan();

    return () => {
      cancelled = true;
    };
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
