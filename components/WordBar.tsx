import { StyleSheet, Text, View } from "react-native";
import { Word } from "@/components/types/Word";

export const WordBar = ({id, word, meaning, created_at}: Word) => {
    return (
        <View style={styles.card}>
            <Text style={styles.word}>{word}</Text>
            <Text style={styles.meaning}>{meaning}</Text>
            <Text style={styles.date}>{new Date(created_at).toLocaleDateString()}</Text>
        </View>
    )
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