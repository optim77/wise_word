import { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    ScrollView,
    RefreshControl,
} from "react-native";
import { supabase } from "@/hooks/supabaseClient";


type Word = {
    id: number;
    created_at: string;
    word: string;
    meaning: string;
};

export default function HomeScreen() {
    const [word, setWord] = useState<Word | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchWord = async () => {
        const { data, error } = await supabase
            .from("words")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        if (error) {
            console.error(error);
        } else {
            setWord(data);
        }
        setLoading(false);
        setRefreshing(false);
    };

    useEffect(() => {
        fetchWord();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchWord();
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {word ? (
                <View style={styles.card}>
                    <Text style={styles.word}>{word.word}</Text>
                    <Text style={styles.meaning}>{word.meaning}</Text>
                </View>
            ) : (
                <Text>Brak słowa na dziś</Text>
            )}
        </ScrollView>
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
