import { View, Text, Button } from "react-native"
import { supabase } from "@/hooks/supabaseClient";


export default function SettingsScreen() {
    async function handleSignOut() {
        await supabase.auth.signOut()
    }

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 20, marginBottom: 20 }}>Settings ⚙️</Text>
            <Button title="Wyloguj się" onPress={handleSignOut} />
        </View>
    )
}
