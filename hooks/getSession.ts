import { supabase } from "@/hooks/supabaseClient";

export async function getSession() {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
}