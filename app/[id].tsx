import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { supabase } from "@/hooks/supabaseClient";
import { useLocalSearchParams } from "expo-router";

type Word = {
    id: string;
    word: string;
    meaning: string;
    created_at: string;
};

export default function WordDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [word, setWord] = useState<Word | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWord = async () => {
            const { data, error } = await supabase
                .from("words")
                .select("*")
                .eq("id", id)
                .single();
            if (data && !error) setWord(data);
            setLoading(false);
        };
        fetchWord();
    }, [id]);

    if (loading) return (
        <View style={styles.center}><ActivityIndicator size="large" /></View>
    );

    if (!word) return (
        <View style={styles.center}><Text>Nie znaleziono słowa</Text></View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.word}>{word.word}</Text>
            <Text style={styles.meaning}>{word.meaning}</Text>
            <Text style={styles.date}>Dodane: {new Date(word.created_at).toLocaleDateString()}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#f5f5f5" },
    word: { fontSize: 28, fontWeight: "bold", marginBottom: 16 },
    meaning: { fontSize: 18, color: "#555", marginBottom: 12, textAlign: "center" },
    date: { fontSize: 14, color: "gray" },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
