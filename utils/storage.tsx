import { Nullable } from "@/extra-types/utils/extra";
import { db } from "@/firebaseConfig";
import { FullUser } from "@/types/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserCredential } from "firebase/auth";
import { doc, Primitive, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { get } from "lodash";

export enum StorageKey {
	user = "user",
	gameData = "gameData",
	persistentUserData = "persistentUserData",

	oneMinute = "oneMinute",
	sixPack = "sixPack",
	eightPack = "eightPack",
	highFive = "highFive",
	drain = "drain",
	survival = "survival",
	deck = "deck",
	disco = "disco",
	speed = "speed",
	levels = "levels",
	mania = "mania",
	expert = "expert",

	totalSetsFound = "totalSetsFound",
	setsFound = "setsFound", // concrete (unique) sets values

	currentPaletteId = "currentPaletteId",
	muteSounds = "muteSounds",

	myPalettes = "myPalettes",
	myModes = "myModes",
	adsRemoved = "adsRemoved",

	coins = "coins",
	gems = "gems",

	lastRewardDate = "lastRewardDate",
	rewardStreak = "rewardStreak",

	seenOnboarding = "seenOnboarding",
	gamePageOnboarding = "gamePageOnboarding",
	gamesPlayedWithoutAds = "gamesPlayedWithoutAds",
	reviewRequestsCount = "reviewRequestsCount",
	scrollIndicatorCount = "scrollIndicatorCount",

	hasMigratedLegacyVersion = "hasMigratedLegacyVersion",
}

export const storageKeyToGameDataPath: Record<StorageKey, string> = {
	[StorageKey.user]: "",
	[StorageKey.gameData]: "",
	[StorageKey.persistentUserData]: "",

	[StorageKey.oneMinute]: "bestScores.oneMinute",
	[StorageKey.sixPack]: "bestScores.sixPack",
	[StorageKey.eightPack]: "bestScores.eightPack",
	[StorageKey.highFive]: "bestScores.highFive",
	[StorageKey.drain]: "bestScores.drain",
	[StorageKey.survival]: "bestScores.survival",
	[StorageKey.deck]: "bestScores.deck",
	[StorageKey.disco]: "bestScores.disco",
	[StorageKey.speed]: "bestScores.speed",
	[StorageKey.levels]: "bestScores.levels",
	[StorageKey.mania]: "bestScores.mania",
	[StorageKey.expert]: "bestScores.expert",

	[StorageKey.totalSetsFound]: "sets.totalSetsFound",
	[StorageKey.setsFound]: "sets.uniqueSetsFound",

	[StorageKey.currentPaletteId]: "settings.currentPaletteId",
	[StorageKey.muteSounds]: "settings.muteSounds",

	[StorageKey.myPalettes]: "purchases.palettes",
	[StorageKey.myModes]: "purchases.modes",
	[StorageKey.adsRemoved]: "purchases.adsRemoved",

	[StorageKey.coins]: "currencies.coins",
	[StorageKey.gems]: "currencies.gems",

	[StorageKey.lastRewardDate]: "dailyReward.lastRewardDate",
	[StorageKey.rewardStreak]: "dailyReward.rewardStreak",

	[StorageKey.seenOnboarding]: "extra.seenOnboarding",
	[StorageKey.gamePageOnboarding]: "extra.gamePageOnboarding",
	[StorageKey.gamesPlayedWithoutAds]: "extra.gamesPlayedWithoutAds",
	[StorageKey.reviewRequestsCount]: "extra.reviewRequestsCount",
	[StorageKey.scrollIndicatorCount]: "extra.scrollIndicatorCount",
	[StorageKey.hasMigratedLegacyVersion]: "extra.hasMigratedLegacyVersion",
};

export const storeData = async <T extends Primitive>(
	user: Nullable<FullUser>,
	key: StorageKey,
	value: T,
	isOffline: boolean = false
) => {
	if (isOffline) return;

	try {
		if (user) {
			const userDocRef = doc(db, "users", user.uid);
			await updateDoc(userDocRef, {
				[storageKeyToGameDataPath[key]]: value,
			});
		} else {
			await AsyncStorage.setItem(key, String(value));
		}
	} catch (e) {
		// saving error
	}
};

export const storeObjectData = async (
	user: Nullable<FullUser>,
	key: StorageKey,
	value: Object,
	isOffline: boolean = false
) => {
	if (isOffline) return;

	try {
		if (user) {
			const userDocRef = doc(db, "users", user.uid);
			await updateDoc(userDocRef, {
				[storageKeyToGameDataPath[key]]: value,
			});
		} else {
			const jsonValue = JSON.stringify(value);
			await AsyncStorage.setItem(key, jsonValue);
		}
	} catch (e) {
		// saving error
	}
};

export const getData = async <T extends Primitive>(
	user: Nullable<FullUser>,
	key: StorageKey,
	defaultValue: T
) => {
	try {
		if (user) {
			return get(
				user.gameData,
				storageKeyToGameDataPath[key],
				defaultValue
			);
		}

		const value = await AsyncStorage.getItem(key);
		if (value === null) return defaultValue;

		try {
			return JSON.parse(value) as T;
		} catch {
			return value as T;
		}
	} catch (e) {
		// error reading value
		return defaultValue as T;
	}
};

export const getObjectData = async (
	user: Nullable<FullUser>,
	key: StorageKey
) => {
	try {
		if (user) {
			return get(user.gameData, storageKeyToGameDataPath[key], null);
			// const userDocRef = doc(db, "users", user.uid);
			// const docSnap = await getDoc(userDocRef);
			// const data = docSnap.data() as UserGameData;
			// return get(data, storageKeyToGameDataPath[key], null);
		}

		const jsonValue = await AsyncStorage.getItem(key);
		return jsonValue != null ? JSON.parse(jsonValue) : null;
	} catch (e) {
		// error reading value
	}
};

export const CLASSIC_PALETTE_ID = "classic";
export const DEFAULT_MY_PALETTES = [CLASSIC_PALETTE_ID];

export const setNewUserDoc = async (
	user: UserCredential["user"],
	userDocRef: ReturnType<typeof doc>
) => {
	await setDoc(userDocRef, {
		id: user.uid,
		createdAt: serverTimestamp(),
		nickname: null,
		bestScores: {
			oneMinute: await getData(null, StorageKey.oneMinute, 0),
			sixPack: await getData(null, StorageKey.sixPack, 0),
			eightPack: await getData(null, StorageKey.eightPack, 0),
			highFive: await getData(null, StorageKey.highFive, null),
			drain: await getData(null, StorageKey.drain, 0),
			survival: await getData(null, StorageKey.survival, 0),
			deck: await getData(null, StorageKey.deck, 0),
			disco: await getData(null, StorageKey.disco, 0),
			speed: await getData(null, StorageKey.speed, 0),
			levels: await getData(null, StorageKey.levels, 1),
			mania: await getData(null, StorageKey.mania, 0),
			expert: await getData(null, StorageKey.expert, 0),
		},
		sets: {
			totalSetsFound: await getData(null, StorageKey.totalSetsFound, 0),
			uniqueSetsFound:
				(await getObjectData(null, StorageKey.setsFound)) ?? [],
		},
		dailyReward: {
			lastRewardDate: await getData(
				null,
				StorageKey.lastRewardDate,
				String(new Date(0))
			),
			rewardStreak: await getData(null, StorageKey.rewardStreak, 0),
		},
		currencies: {
			gems: await getData(null, StorageKey.gems, 0),
			coins: await getData(null, StorageKey.coins, 0),
		},
		settings: {
			currentPaletteId: await getData(
				null,
				StorageKey.currentPaletteId,
				CLASSIC_PALETTE_ID
			),
			muteSounds: await getData(null, StorageKey.muteSounds, false),
		},
		purchases: {
			adsRemoved: await getData(null, StorageKey.adsRemoved, false),
		},
		extra: {
			gamesPlayedWithoutAds: await getData(
				null,
				StorageKey.gamesPlayedWithoutAds,
				0
			),
			reviewRequestsCount: await getData(
				null,
				StorageKey.reviewRequestsCount,
				0
			),
			seenOnboarding: true,
			seenGamePageOnboarding: true,
			scrollIndicatorCount: await getData(
				null,
				StorageKey.scrollIndicatorCount,
				0
			),
			hasMigratedLegacyVersion: await getData(
				null,
				StorageKey.hasMigratedLegacyVersion,
				false
			),
		},
	});

	// Clear local storage so that it doesn't get re-imported on next login
	await AsyncStorage.multiRemove([
		StorageKey.oneMinute,
		StorageKey.sixPack,
		StorageKey.eightPack,
		StorageKey.highFive,
		StorageKey.drain,
		StorageKey.survival,
		StorageKey.deck,
		StorageKey.disco,
		StorageKey.speed,
		StorageKey.levels,
		StorageKey.mania,
		StorageKey.expert,
		StorageKey.totalSetsFound,
		StorageKey.setsFound,
		StorageKey.currentPaletteId,
		StorageKey.myPalettes,
		StorageKey.myModes,
		StorageKey.coins,
		StorageKey.gems,
		StorageKey.adsRemoved,
		StorageKey.rewardStreak,
		StorageKey.muteSounds,
		StorageKey.gamesPlayedWithoutAds,
		StorageKey.reviewRequestsCount,
	]);
};

export const createOfflineUserData = async () => {
	try {
		// Get the cached user
		const storedUser = await AsyncStorage.getItem(StorageKey.user);
		if (!storedUser) return null;

		const storedUserData = await AsyncStorage.getItem(
			StorageKey.persistentUserData
		);
		const userData = storedUserData
			? JSON.parse(storedUserData)
			: {
					purchases: {
						adsRemoved: false,
						palettes: DEFAULT_MY_PALETTES,
					},
					settings: {
						currentPaletteId: CLASSIC_PALETTE_ID,
						muteSounds: false,
					},
			  };

		// Parse the stored user
		const parsedUser = JSON.parse(storedUser);

		// Create a fake UserGameData with the cached data
		const fakeUserData = {
			purchases: userData.purchases,
			settings: userData.settings,
			// Add minimal required properties for offline play
			id: parsedUser.uid,
			createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
			nickname: null,
			xp: {
				shlomo_artzi: 0,
			},
			dailyReward: {
				lastRewardDate: String(new Date()),
				rewardStreak: 0,
			},
			currencies: {
				coins: 0,
			},
			extra: {
				gamesPlayedWithoutAds: 0,
				reviewRequestsCount: 0,
			},
		};

		return { parsedUser, fakeUserData };
	} catch (error) {
		console.error("Failed to create offline user data:", error);
		return null;
	}
};
