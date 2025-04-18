import { MusicNotesAnimation } from "@/components/MusicNotesAnimation";
import { Center } from "@/components/ui/center";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/hooks/auth/useUser";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
	const { user, isOffline } = useUser();

	// Loading state while user data is being fetched
	if (user && !user.gameData) {
		return (
			<SafeAreaView style={styles.loadingContainer}>
				<Center className="w-full h-full">
					<Spinner />
				</Center>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar style="light" />
			{/* Music notes animation in the background */}
			<MusicNotesAnimation />

			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollViewContent}
				showsVerticalScrollIndicator={false}
			>
				{/* Extra space at the bottom for better scrolling */}
				<View style={styles.bottomSpacer} />
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#6A11CB", // Fallback color
	},
	loadingContainer: {
		flex: 1,
		backgroundColor: "#6A11CB",
	},
	scrollView: {
		flex: 1,
	},
	scrollViewContent: {
		flexGrow: 1,
		paddingBottom: 30,
	},
	logoContainer: {
		alignItems: "center",
		justifyContent: "center",
		marginTop: 10,
		marginBottom: 10,
	},
	bottomSpacer: {
		height: 40,
	},
});
