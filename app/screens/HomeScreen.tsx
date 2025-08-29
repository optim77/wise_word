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
import { Word } from "@/components/types/Word";
import { WordBar } from "@/components/WordBar";


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
                <WordBar id={word.id} word={word.word} meaning={word.meaning} created_at={word.created_at} />
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
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
