import { Player } from "@/app/multiplayerLobby";
import { MultiplayerModes } from "@/modes/modes";
import { FirebaseDate } from "@/utils/dateUtils";

export type MultiplayerGameData<T> = {
	id: string;
	status: "waiting" | "started" | "ended";
	startedAt: FirebaseDate;
	createdAt: FirebaseDate;
	players: Record<string, Player<T>>;
	mode: MultiplayerModes;
	cards: string[];
};
