import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Dimensions, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const NOTES_COUNT = 15;
const NOTES_ICONS = ["musical-note", "musical-notes"];

interface Note {
	position: Animated.ValueXY;
	opacity: Animated.Value;
	scale: Animated.Value;
	rotation: Animated.Value;
	icon: string;
	duration: number;
	delay: number;
}

export const MusicNotesAnimation = () => {
	// Create an array to hold all our animated notes
	const notesRef = useRef<Note[]>([]);

	// Initialize the notes once on mount
	useEffect(() => {
		// Create an array with the specified number of notes
		notesRef.current = Array(NOTES_COUNT)
			.fill(0)
			.map(() => {
				// Random position, ensuring notes start from the bottom of the screen
				const startX = Math.random() * width;
				const startY = height + Math.random() * 100;
				const endY = -100 - Math.random() * 100;

				// Create animated values for each property
				const position = new Animated.ValueXY({ x: startX, y: startY });
				const opacity = new Animated.Value(0);
				const scale = new Animated.Value(0.5 + Math.random() * 0.5);
				const rotation = new Animated.Value(0);

				// Random animation duration and delay for more natural movement
				const duration = 10000 + Math.random() * 15000;
				const delay = Math.random() * 10000;

				// Randomly select an icon
				const icon =
					NOTES_ICONS[Math.floor(Math.random() * NOTES_ICONS.length)];

				return {
					position,
					opacity,
					scale,
					rotation,
					icon,
					duration,
					delay,
				};
			});

		// Start the animation for each note
		notesRef.current.forEach((note) => {
			const { position, opacity, rotation, duration, delay } = note;

			// Position animation
			Animated.timing(position, {
				toValue: { x: position.x._value, y: -100 },
				duration,
				delay,
				easing: Easing.linear,
				useNativeDriver: true,
			}).start(() => resetNote(note));

			// Fade in and out
			Animated.sequence([
				Animated.timing(opacity, {
					toValue: 0.7,
					duration: 1000,
					delay,
					useNativeDriver: true,
				}),
				Animated.timing(opacity, {
					toValue: 0,
					duration: duration - 1000,
					delay: 0,
					useNativeDriver: true,
				}),
			]).start();

			// Rotation animation
			Animated.loop(
				Animated.timing(rotation, {
					toValue: 1,
					duration: 3000 + Math.random() * 3000,
					easing: Easing.linear,
					useNativeDriver: true,
				})
			).start();
		});

		// Cleanup animation
		return () => {
			notesRef.current.forEach((note) => {
				note.position.stopAnimation();
				note.opacity.stopAnimation();
				note.rotation.stopAnimation();
			});
		};
	}, []);

	// Function to reset a note when it goes off-screen
	const resetNote = (note: Note) => {
		const { position, opacity, duration } = note;

		// Reset position
		position.setValue({
			x: Math.random() * width,
			y: height + Math.random() * 100,
		});

		// Reset opacity
		opacity.setValue(0);

		// Start animations again
		Animated.timing(position, {
			toValue: { x: position.x._value, y: -100 },
			duration,
			easing: Easing.linear,
			useNativeDriver: true,
		}).start(() => resetNote(note));

		Animated.sequence([
			Animated.timing(opacity, {
				toValue: 0.7,
				duration: 1000,
				useNativeDriver: true,
			}),
			Animated.timing(opacity, {
				toValue: 0,
				duration: duration - 1000,
				useNativeDriver: true,
			}),
		]).start();
	};

	return (
		<View style={styles.container} pointerEvents="none">
			{notesRef.current.map((note, index) => {
				const spin = note.rotation.interpolate({
					inputRange: [0, 1],
					outputRange: ["0deg", "360deg"],
				});

				return (
					<Animated.View
						key={index}
						style={[
							styles.noteContainer,
							{
								transform: [
									{ translateX: note.position.x },
									{ translateY: note.position.y },
									{ scale: note.scale },
									{ rotate: spin },
								],
								opacity: note.opacity,
							},
						]}
					>
						<Ionicons
							name={note.icon as any}
							size={30}
							color="rgba(255, 255, 255, 0.8)"
						/>
					</Animated.View>
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject,
		zIndex: 0,
	},
	noteContainer: {
		position: "absolute",
	},
});
