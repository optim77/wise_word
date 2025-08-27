import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useEffect, useState } from "react";
import { supabase } from "@/hooks/supabaseClient";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    const [loadingUser, setLoadingUser] = useState(true);
    const [user, setUser] = useState<any>(null);
    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data, error } = await supabase.auth.getUser();
                if (error) throw error;
                setUser(data?.user ?? null);
                setLoadingUser(false);
                if (!data?.user) router.replace("/sign-in");
            } catch (err) {
                console.error("Auth error:", err);
                setUser(null);
                setLoadingUser(false);
                router.replace("/sign-in");
            }
        };
        checkUser();

        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            if (!session?.user) router.replace("/sign-in");
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    if (!loaded || loadingUser) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
