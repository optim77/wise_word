import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { supabase } from "@/hooks/supabaseClient";
import { useRouter } from "expo-router";
import { Card } from "@/components/Card";

export default function SignIn() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (error) return Alert.alert("Błąd", error.message);
        router.push("/"); // Home
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign in</Text>
            <Card style={styles.card}>
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                />
                <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? "Loading..." : "Sign in"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.googleButton]}
                    onPress={() => supabase.auth.signInWithOAuth({ provider: "google" })}
                >
                    <Text style={styles.buttonText}>Zaloguj się przez Google</Text>
                </TouchableOpacity>

                <Text>
                    Don't have an account?{" "}
                    <Text style={{ color: "blue" }} onPress={() => router.push("/sign-up")}>
                        Sign up
                    </Text>
                </Text>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#f0f4f8" },
    title: { fontSize: 28, fontWeight: "bold", marginBottom: 24 },
    card: { width: "100%", maxWidth: 400 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
        fontSize: 16,
    },
    button: {
        backgroundColor: "#4f46e5",
        padding: 14,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: "center",
    },
    googleButton: {
        backgroundColor: "#db4437",
    },
    buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
