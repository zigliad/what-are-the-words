// import { Audio } from "@/constants/sounds";
import { Audio } from "expo-av";

export const preloadedSounds: Partial<Record<string, Audio.Sound>> = {};

export const preloadAllSounds = async () => {
	try {
		// for (const [key, value] of Object.entries(sounds)) {
		// 	const { sound } = await Audio.Sound.createAsync(value);
		// 	preloadedSounds[key as Sound] = sound;
		// }
	} catch (error) {}
};

export const unloadAllSounds = async () => {
	try {
		// for (const [key, value] of Object.entries(preloadedSounds)) {
		// 	await value.unloadAsync();
		// 	delete preloadedSounds[key as Sound];
		// }
	} catch (error) {}
};
