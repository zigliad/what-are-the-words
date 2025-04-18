import { preloadAllSounds, unloadAllSounds } from "@/utils/soundPlayer";
import { useState, useEffect } from "react";

export const usePreloadSounds = () => {
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		(async () => {
			await preloadAllSounds();
			setLoaded(true);
		})();

		return () => {
			unloadAllSounds();
		};
	}, []);

	return { soundsLoaded: loaded };
};
