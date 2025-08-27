import { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, RefreshControl, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { supabase } from "@/hooks/supabaseClient";
import { useRouter } from "expo-router";

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

    return (
        <FlatList
            data={history}
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
});
