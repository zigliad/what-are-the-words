import { Sound } from "@/constants/sounds";
import { useUser } from "@/hooks/auth/useUser";
import { preloadedSounds } from "@/utils/soundPlayer";
import { getData, StorageKey } from "@/utils/storage";
import React, { useCallback } from "react";

export const usePlaySound = () => {
	const { user } = useUser();

	const playSound = useCallback(
		async (key: Sound) => {
			try {
				const muteSounds = await getData<boolean>(
					user,
					StorageKey.muteSounds,
					false
				);

				if (muteSounds || !preloadedSounds[key]) return;

				const sound = preloadedSounds[key];
				await sound.replayAsync(); // `replayAsync` plays the sound from the beginning
			} catch (error) {}
		},
		[user]
	);

	return { playSound };
};
