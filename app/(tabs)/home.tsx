import HomeScreen from "@/app/screens/HomeScreen";
import { useEffect } from "react";
import { supabase } from "@/hooks/supabaseClient";
import { router } from "expo-router";

export default function StartScreen() {
    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            if (!session) router.push("/sign-in");
        });
        return () => listener.subscription.unsubscribe();
    }, []);
    return (
        <HomeScreen />
    )
}

