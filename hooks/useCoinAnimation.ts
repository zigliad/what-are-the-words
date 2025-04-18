import { useCallback, useRef, useState } from "react";
import { Animated, Easing } from "react-native";

export const useCoinAnimation = (comboCount: number) => {
	const [showCoinAnimation, setShowCoinAnimation] = useState(false);
	const coinOpacity = useRef(new Animated.Value(0)).current;
	const coinScale = useRef(new Animated.Value(0.5)).current;
	const coinTranslateY = useRef(new Animated.Value(0)).current;
	const coinRotation = useRef(new Animated.Value(0)).current;

	// Create a rotation interpolation for the coin
	const spin = coinRotation.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "360deg"],
	});

	const animateCoinReward = useCallback(
		(reward: number) => {
			// Reset animation values
			coinOpacity.setValue(0);
			coinScale.setValue(0.5);
			coinTranslateY.setValue(0);
			coinRotation.setValue(0);

			setShowCoinAnimation(true);

			// Run animation sequence with subtler parameters
			Animated.parallel([
				Animated.timing(coinOpacity, {
					toValue: 0.9, // Less opaque
					duration: 200, // Faster fade-in
					useNativeDriver: true,
					easing: Easing.out(Easing.ease),
				}),
				Animated.timing(coinScale, {
					toValue: 1.0, // Smaller size
					duration: 300, // Faster scaling
					useNativeDriver: true,
					easing: Easing.out(Easing.back(1.2)),
				}),
				Animated.sequence([
					Animated.timing(coinTranslateY, {
						toValue: -30, // Move up less distance
						duration: 500, // Faster movement
						useNativeDriver: true,
						easing: Easing.out(Easing.ease),
					}),
					Animated.timing(coinTranslateY, {
						toValue: -25, // Smaller bounce
						duration: 100,
						useNativeDriver: true,
						easing: Easing.inOut(Easing.ease),
					}),
				]),
				// Only rotate if combo is high enough to draw attention to big rewards
				...(comboCount > 2
					? [
							Animated.timing(coinRotation, {
								toValue: 1,
								duration: 800,
								useNativeDriver: true,
								easing: Easing.inOut(Easing.ease),
							}),
						]
					: []),
			]).start(() => {
				// Faster fade out
				Animated.timing(coinOpacity, {
					toValue: 0,
					duration: 200,
					delay: 200,
					useNativeDriver: true,
					easing: Easing.in(Easing.ease),
				}).start(() => {
					setShowCoinAnimation(false);
				});
			});
		},
		[coinOpacity, coinScale, coinTranslateY, coinRotation, comboCount]
	);

	return {
		showCoinAnimation,
		coinOpacity,
		coinScale,
		coinTranslateY,
		spin,
		animateCoinReward,
	};
};
