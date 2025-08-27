import { router, Tabs, useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { Pressable } from "react-native"
import { useEffect } from "react";
import { supabase } from "@/hooks/supabaseClient";

export default function TabsLayout() {
    const router = useRouter()

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            if (!session) router.push("/sign-in");
        });
        return () => listener.subscription.unsubscribe();
    }, []);

    return (
        <Tabs
            screenOptions={{
                headerRight: () => (
                    <Pressable
                        onPress={() => router.push("/settings")}
                        style={{ marginRight: 15 }}
                    >
                        <Ionicons name="settings-outline" size={24} color="black" />
                    </Pressable>
                ),
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: "History",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="time-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    )
}
