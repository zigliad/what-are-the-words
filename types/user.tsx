import { Nullable } from "@/extra-types/utils/extra";
import { FirebaseDate } from "@/utils/dateUtils";
import { User } from "firebase/auth";

export type UserGameData = {
	id: string;
	createdAt: FirebaseDate;
	nickname: Nullable<string>;
	xp: Record<string, number>; // xp for each mode (artist, pop, etc)
	totalXp: number;
	packs: string[];
	dailyReward: {
		lastRewardDate: string;
		rewardStreak: number;
	};
	currencies: {
		coins: number;
	};
	settings: {
		muteSounds: boolean;
	};
	purchases: {
		adsRemoved: boolean;
	};
	extra: {
		gamesPlayedWithoutAds: number;
		reviewRequestsCount: number;
	};
};

export type FullUser = User & { gameData?: UserGameData };
