import { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, RefreshControl, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { supabase } from "@/hooks/supabaseClient";
import { useRouter } from "expo-router";
import { usePremium } from "@/hooks/usePremium";

type Word = {
    id: string;
    word: string;
    meaning: string;
    created_at: string;
};

export default function HistoryScreen() {
    const router = useRouter();
    const [history, setHistory] = useState<Word[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { isPremium, loading: premiumLoading } = usePremium();

    const displayedHistory = isPremium ? history : history.slice(0, 5);

    const fetchHistory = async () => {
        const { data, error } = await supabase
            .from("words")
            .select("*")
            .order("created_at", { ascending: false });
        if (data && !error) setHistory(data);
        setLoading(false);
        setRefreshing(false);
    };

    useEffect(() => { fetchHistory(); }, []);

    const onRefresh = useCallback(() => { setRefreshing(true); fetchHistory(); }, []);

    if (loading) return (
        <View style={styles.center}><ActivityIndicator size="large" /></View>
    );
    if (premiumLoading) return <ActivityIndicator />;
    return (
        <>
            {!isPremium && (
                <View style={styles.promoContainer}>
                    <Text style={styles.promoText}>
                        You're on a free plan. Only the last 5 words are visible. Upgrade to Premium to unlock full history!
                    </Text>
                    <TouchableOpacity
                        style={styles.upgradeButton}
                        onPress={() => router.push("/premium")}
                    >
                        <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                data={displayedHistory}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 20 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => router.push(`/${item.id}`)}
                        style={styles.card}
                    >
                        <Text style={styles.word}>{item.word}</Text>
                        <Text numberOfLines={1} style={styles.meaning}>{item.meaning}</Text>
                    </TouchableOpacity>
                )}
            />
        </>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    word: { fontSize: 18, fontWeight: "bold" },
    meaning: { fontSize: 14, color: "#555" },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    promoContainer: {
        padding: 16,
        backgroundColor: "#fff3cd",
        borderRadius: 12,
        margin: 20,
        alignItems: "center",
    },
    promoText: {
        color: "#856404",
        fontSize: 14,
        textAlign: "center",
        marginBottom: 12,
    },
    upgradeButton: {
        backgroundColor: "#007bff",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    upgradeButtonText: {
        color: "white",
        fontWeight: "bold",
    },
});
