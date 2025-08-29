import { useEffect, useState } from "react";
import { supabase } from "@/hooks/supabaseClient";

export function usePremium() {
    const [isPremium, setIsPremium] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscription = async () => {
            const userRes = await supabase.auth.getUser();
            const userId = userRes.data.user?.id;

            if (!userId) {
                setIsPremium(false);
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from("subscriptions")
                .select("*")
                .eq("user_id", userId)
                .eq("status", "active")
                .gt("ends_at", new Date().toISOString())
                .single();

            setIsPremium(!!data);
            setLoading(false);
        };

        fetchSubscription();
    }, []);

    return { isPremium, loading };
}
