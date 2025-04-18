import { MyModesContextType } from "@/hooks/useMyModes";
import {
	getData,
	LEGACY_PREMIUM_MODES,
	StorageKey,
	storeData,
	storeObjectData,
} from "@/utils/storage";
import { Primitive } from "firebase/firestore";
import { useCallback, useEffect } from "react";
import { Platform, Settings } from "react-native";

export const useLegacyMigration = ({ setMyModes }: MyModesContextType) => {
	const migrateUserDefaultsToAsyncStorage = useCallback(async () => {
		if (Platform.OS !== "ios") return;

		try {
			// Check if migration has already been done
			const hasMigrated = await getData(
				null,
				StorageKey.hasMigratedLegacyVersion,
				false
			);

			if (hasMigrated) return;

			// Map UserDefaults keys to your StorageKey enum
			const keyMapping: Record<string, StorageKey> = {
				// Key mappings here based on the old Swift app's UserDefaults keys
				time_mode_best: StorageKey.oneMinute,
				six_pack_mode_wins: StorageKey.sixPack,
				eight_pack_mode_wins: StorageKey.eightPack,
				high_five_mode_best: StorageKey.highFive,
				drain_mode_wins: StorageKey.drain,
				sprint_mode_wins: StorageKey.speed,
				levels_mode_current: StorageKey.levels,
				total_sets_found: StorageKey.totalSetsFound,
				unique_sets_found: StorageKey.setsFound,
			};

			// Migrate each value
			for (const [oldKey, newKey] of Object.entries(keyMapping)) {
				const value = Settings.get(oldKey);
				if (value !== null && value !== undefined) {
					if (
						oldKey === "unique_sets_found" &&
						Array.isArray(value)
					) {
						// Convert old format "2020,2121,2222" to new format "2-0-2-0:2-1-2-1:2-2-2-2"
						const newValue = value.map((oldSetFormat: string) =>
							oldSetFormat
								.split(",")
								.map((card: string) => card.split("").join("-"))
								.join(":")
						);
						await storeObjectData(
							null,
							StorageKey.setsFound,
							newValue
						);
					} else if (typeof value === "object") {
						await storeObjectData(null, newKey, value as Object);
					} else {
						if (oldKey === "high_five_mode_best") {
							await storeData(
								null,
								newKey,
								Math.round(value as number)
							);
						} else {
							await storeData(null, newKey, value as Primitive);
						}
					}
				}
			}

			const value = Settings.get("is_premium");
			if ([true, "true", 1].includes(value)) {
				await storeData(null, StorageKey.adsRemoved, true);
				setMyModes(LEGACY_PREMIUM_MODES);
			}

			// Mark migration as complete
			await storeData(null, StorageKey.hasMigratedLegacyVersion, true);
		} catch (error) {
			console.error("Error migrating from UserDefaults:", error);
		}
	}, [setMyModes]);

	useEffect(() => {
		migrateUserDefaultsToAsyncStorage().catch(console.error);
	}, [migrateUserDefaultsToAsyncStorage]);
};
