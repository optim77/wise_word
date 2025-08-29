import { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { supabase } from "@/hooks/supabaseClient";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { WordBar } from "@/components/WordBar";
import { Word } from "@/components/types/Word";

export default function WordDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [word, setWord] = useState<Word | null>(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

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

    useLayoutEffect(() => {
        if (word) {
            navigation.setOptions({
                headerTitle: word.word,
            });
        }
    }, [word]);

    if (loading) return (
        <View style={styles.center}><ActivityIndicator size="large" /></View>
    );

    if (!word) return (
        <View style={styles.center}><Text>Nie znaleziono słowa</Text></View>
    );

    return (
        <View style={styles.container}>
            <WordBar id={word.id} word={word.word} meaning={word.meaning} created_at={word.created_at} />
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    date: {
        fontSize: 14,
        color: "gray",
        textAlign: "center",
        marginTop: '10%'
    },
    card: {
        width: "100%",
        backgroundColor: "white",
        padding: 24,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    word: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#333",
        textAlign: "center",
        textTransform: "capitalize"
    },
    meaning: {
        fontSize: 18,
        color: "#555",
        textAlign: "center",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

