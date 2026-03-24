import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Template {
  id: string;
  name: string;
  tone: string;
  word_count: string;
  primary_keyword: string;
  secondary_keywords: string;
  outline: string;
  instructions: string;
  created_at: string;
}

export const useTemplates = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("templates")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setTemplates((data as Template[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTemplates();
  }, [user]);

  const saveTemplate = async (template: Omit<Template, "id" | "created_at">) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from("templates")
      .insert({ ...template, user_id: user.id })
      .select()
      .single();
    if (!error && data) {
      setTemplates((prev) => [data as Template, ...prev]);
    }
    return { data, error };
  };

  const deleteTemplate = async (id: string) => {
    const { error } = await supabase.from("templates").delete().eq("id", id);
    if (!error) setTemplates((prev) => prev.filter((t) => t.id !== id));
    return { error };
  };

  return { templates, loading, saveTemplate, deleteTemplate, refetch: fetchTemplates };
};
