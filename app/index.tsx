import { FixedText } from "@/components/FixedText";
import { Button } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/hooks/auth/useUser";
import { fontWeightStyles } from "@/styles/commonStyles";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const titleStyles = StyleSheet.create({
	pageTitle: {
		zIndex: 0,
		fontFamily: fontWeightStyles.black.fontFamily,
		fontSize: 130,
		textShadowColor: "#aaa",
		textShadowOffset: { width: 5, height: 5 },
		textShadowRadius: 0,
	},
});

export default function Index() {
	const { user, isOffline } = useUser();

	console.log("user", user);
	if (user && !user.gameData)
		return (
			<SafeAreaView>
				<Center className="w-full h-full">
					<Spinner />
				</Center>
			</SafeAreaView>
		);

	return (
		<View style={{ flex: 1, padding: 20, backgroundColor: "#ff0000" }}>
			<Text>Hi</Text>
			<Button
				onPress={() => {
					console.log("Button pressed");
				}}
			>
				<FixedText>Hi</FixedText>
			</Button>
			<FixedText size="5xl">מהן המילים?</FixedText>
		</View>
	);
}
