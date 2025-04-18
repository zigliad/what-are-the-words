import { Platform } from "react-native";
import { TestIds } from "react-native-google-mobile-ads";

export const GAMES_UNTIL_AD = 2;

// real
export const interstitialAdUnitId = __DEV__
	? TestIds.INTERSTITIAL
	: Platform.OS === "ios"
	? "ca-app-pub-4427652774441300/9506461522"
	: "ca-app-pub-4427652774441300/1833777646";

export const rewardedAdUnitId = __DEV__
	? TestIds.REWARDED
	: Platform.OS === "ios"
	? "ca-app-pub-4427652774441300/8541804224"
	: "ca-app-pub-4427652774441300/6230529757";
