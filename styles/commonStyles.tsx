import { Platform, StyleSheet } from "react-native";

const iosFontWeightStyles = StyleSheet.create({
	regular: { fontFamily: "PlayfairDisplay-Regular" },
	medium: { fontFamily: "PlayfairDisplay-Medium" },
	bold: { fontFamily: "PlayfairDisplay-Bold" },
	black: {
		fontFamily: "PlayfairDisplay-Black",
	},
});

const androidFontWeightStyles = StyleSheet.create({
	regular: { fontFamily: "PlayfairDisplay_400" },
	medium: { fontFamily: "PlayfairDisplay_500" },
	bold: { fontFamily: "PlayfairDisplay_700" },
	black: {
		fontFamily: "PlayfairDisplay_900",
	},
});

export const fontWeightStyles =
	Platform.OS === "ios" ? iosFontWeightStyles : androidFontWeightStyles;
