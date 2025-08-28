import { supabase } from "@/hooks/supabaseClient";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import { Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useEffect } from "react";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignInButton() {
    // redirect przez proxy Expo
    const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: "",
        iosClientId: "",
        androidClientId: "",
        webClientId: "",
        redirectUri, // <--- kluczowe
    });

    useEffect(() => {
        if (response?.type === "success") {
            const { authentication } = response;
            if (authentication?.idToken) {
                supabase.auth.signInWithIdToken({
                    provider: "google",
                    token: authentication.idToken,
                });
            }
        }
    }, [response]);

    return (
        <TouchableOpacity
            style={styles.button}
            disabled={!request}
            onPress={() => promptAsync({ useProxy: true })}
        >
            <Image
                source={{
                    uri: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
                }}
                style={styles.logo}
            />
            <Text style={styles.text}>Zaloguj się przez Google</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        marginTop: 16,
    },
    logo: {
        width: 20,
        height: 20,
        marginRight: 8,
    },
    text: {
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
    },
});
