import { AwesomeModal } from "@/components/awesome-modal/AwesomeModal";
import { Center } from "@/components/ui/center";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Spinner } from "@/components/ui/spinner";
import { useInitUserContext, UserContext } from "@/hooks/auth/useUser";
import { usePreloadSounds } from "@/hooks/usePreloadSounds";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { I18nManager, useColorScheme, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import mobileAds from "react-native-google-mobile-ads";
import { SafeAreaView } from "react-native-safe-area-context";
import useMount from "react-use/lib/useMount";

import "@/global.css";
import "react-native-reanimated";

I18nManager.forceRTL(false);
I18nManager.allowRTL(false);

const App = () => {
	const currentScheme = useColorScheme();

	return (
		<View style={{ flex: 1 }}>
			<StatusBar hidden />
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: {
						backgroundColor:
							currentScheme === "dark" ? "#1c1c1e" : "#f2f2f6",
						flex: 1,
					},
				}}
			>
				<Stack.Screen name="index" />
			</Stack>
		</View>
	);
};

export default function RootLayout() {
	const userContextValue = useInitUserContext();
	const user = userContextValue.user;
	const loadingError = userContextValue.loadingError;
	const [showConnectionErrorModal, setShowConnectionErrorModal] =
		useState(false);

	usePreloadSounds();
	useMount(() => {
		mobileAds().initialize().catch(console.error);
	});

	useEffect(() => {
		if (loadingError !== undefined) setShowConnectionErrorModal(true);
	}, [loadingError]);

	return (
		<GluestackUIProvider mode="system">
			<GestureHandlerRootView style={{ flex: 1 }}>
				<UserContext.Provider value={userContextValue}>
					{!user || (user && user.gameData) ? (
						<App />
					) : (
						<SafeAreaView style={{ flex: 1 }}>
							<Center className="w-full h-full">
								<Spinner />
							</Center>
						</SafeAreaView>
					)}

					<AwesomeModal
						visible={showConnectionErrorModal}
						type="error"
						header="Connection Issue"
						content={`We couldn't connect to the Set game servers. You can continue playing offline with your purchased modes and palettes, but your progress won't be saved to the cloud.\n\n${
							loadingError ?? ""
						}`}
						buttonText="Got It"
						onResolve={() => {
							setShowConnectionErrorModal(false);
						}}
					/>
				</UserContext.Provider>
			</GestureHandlerRootView>
		</GluestackUIProvider>
	);
}
