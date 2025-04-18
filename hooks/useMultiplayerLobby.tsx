import { Player } from "@/app/multiplayerLobby";
import {
	AwesomeModal,
	ModalType,
} from "@/components/awesome-modal/AwesomeModal";
import { Sound } from "@/constants/sounds";
import { Action1 } from "@/extra-types/utils/functions";
import { db } from "@/firebaseConfig";
import { useUser } from "@/hooks/auth/useUser";
import { usePlaySound } from "@/hooks/usePlaySound";
import { MultiplayerModes } from "@/modes/modes";
import { getDisplayName } from "@/utils/userUtils";
import {
	deleteDoc,
	doc,
	getDoc,
	onSnapshot,
	serverTimestamp,
	setDoc,
	updateDoc,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

type ErrorModalProps = React.ComponentProps<typeof AwesomeModal>;

export const useMultiplayerLobby = (
	mode: MultiplayerModes,
	onGameStart: Action1<string>
) => {
	const [inputGameId, setInputGameId] = useState<string>("");
	const [gameId, setGameId] = useState<string>("");
	const [isCreating, setIsCreating] = useState<boolean>(false);
	const [isJoining, setIsJoining] = useState<boolean>(false);
	const [waitingForPlayers, setWaitingForPlayers] = useState<boolean>(false);
	const [players, setPlayers] = useState<Player<{}>[]>([]);
	const [isRoomOwner, setIsRoomOwner] = useState<boolean>(false);

	const [errorModalProps, setErrorModalProps] = useState<ErrorModalProps>({
		visible: false,
		header: "",
		content: "",
		type: "error",
		buttonText: "Got It",
		onResolve: () =>
			setErrorModalProps((prev) => ({ ...prev, visible: false })),
	});

	const { user } = useUser();
	const { playSound } = usePlaySound();

	const leaveGame = useCallback(
		async (gameIdToLeave: string): Promise<void> => {
			if (!user || !gameIdToLeave) return;

			const gameRef = doc(db, "games", gameIdToLeave);
			const gameSnap = await getDoc(gameRef);
			if (!gameSnap.exists()) return;

			const gameData = gameSnap.data();
			const updatedPlayers = { ...gameData.players };
			delete updatedPlayers[user.uid];

			if (Object.keys(updatedPlayers).length === 0) {
				// No players left, delete the game document
				await deleteDoc(gameRef);
			} else {
				if (gameData.owner === user.uid) {
					const nextOwnerId = Object.keys(updatedPlayers)[0];
					await updateDoc(gameRef, {
						players: updatedPlayers,
						owner: nextOwnerId,
					});
				} else {
					await updateDoc(gameRef, { players: updatedPlayers });
				}
			}

			setGameId("");
			setWaitingForPlayers(false);
		},
		[user]
	);

	useEffect(() => {
		return () => {
			// We send gameId instead of using the state inside leaveGame
			// because it might be empty when leaving the page
			leaveGame(gameId);
		};
	}, [gameId]);

	useEffect(() => {
		if (gameId) {
			const unsubscribe = onSnapshot(
				doc(db, "games", gameId),
				(docSnap) => {
					if (docSnap.exists()) {
						const gameData = docSnap.data();
						setPlayers(
							Object.values(gameData.players) as Player<{}>[]
						);
						setIsRoomOwner(user?.uid === gameData.owner);
						if (gameData.status === "started") {
							onGameStart(gameId);
						}
					}
				}
			);
			return () => unsubscribe();
		}
	}, [gameId, user?.uid]);

	const showErrorModal = useCallback(
		(header: string, content: string, type: ModalType = "error") => {
			setErrorModalProps({
				visible: true,
				header,
				content,
				type,
				buttonText: "Got It",
				onResolve: () =>
					setErrorModalProps((prev) => ({ ...prev, visible: false })),
			});
		},
		[]
	);

	const createGame = useCallback(async (): Promise<void> => {
		playSound(Sound.click);
		if (!user) return;
		setIsCreating(true);

		// Try creating room with increasing number of digits
		for (let digits = 3; digits <= 10; digits++) {
			const min = Math.pow(10, digits - 1);
			const max = Math.pow(10, digits) - 1;
			const newGameId = String(
				Math.floor(min + Math.random() * (max - min + 1))
			);

			try {
				// Check if game ID already exists
				const gameRef = doc(db, "games", newGameId);
				const gameSnap = await getDoc(gameRef);

				if (!gameSnap.exists()) {
					// Create new game if ID is available
					await setDoc(gameRef, {
						mode,
						status: "waiting",
						createdAt: serverTimestamp(),
						owner: user.uid,
						players: {
							[user.uid]: {
								uid: user.uid,
								displayName: getDisplayName(user),
								photoURL: user.photoURL ?? null,
								createdAt: user.gameData?.createdAt ?? null,
								email: user.email ?? null,
								inRoom: true,
							},
						},
					});

					setGameId(newGameId);
					setWaitingForPlayers(true);
					setIsRoomOwner(true);
					setIsCreating(false);
					return;
				}
			} catch (error) {
				showErrorModal("Error", "Failed to create game.");
				setIsCreating(false);
				return;
			}
		}

		// If we get here, we failed to find an available ID
		showErrorModal("Error", "Failed to create game - no IDs available.");
		setIsCreating(false);
	}, [user, playSound]);

	const joinGame = useCallback(async (): Promise<void> => {
		playSound(Sound.click);
		if (!user) return;
		if (inputGameId === "") {
			showErrorModal(
				"Empty Game ID",
				"Please insert a game ID to join.",
				"warning"
			);
			return;
		}

		setIsJoining(true);
		const gameRef = doc(db, "games", inputGameId);
		const gameSnap = await getDoc(gameRef);
		if (gameSnap.exists()) {
			const gameData = gameSnap.data();
			if (gameData.status === "waiting" && gameData.mode === mode) {
				await updateDoc(gameRef, {
					[`players.${user.uid}`]: {
						uid: user.uid,
						displayName: getDisplayName(user),
						photoURL: user.photoURL ?? null,
						createdAt: user.gameData?.createdAt ?? null,
						email: user.email ?? null,
						inRoom: true,
					},
				});
				setWaitingForPlayers(true);
				setGameId(inputGameId);
				setInputGameId("");
			} else {
				showErrorModal(
					"Invalid Game",
					"This game ID is invalid or the game has already started."
				);
			}
		} else {
			showErrorModal(
				"Game Not Found",
				"No game found with this ID.\nPlease check and try again."
			);
		}

		setIsJoining(false);
	}, [user, inputGameId, playSound, mode, showErrorModal]);

	const startGame = useCallback(async (): Promise<void> => {
		// Only allow the room owner to start the game
		if (!isRoomOwner) {
			showErrorModal(
				"Not Authorized",
				"Only the game creator can start the game.",
				"error"
			);
			return;
		}

		await updateDoc(doc(db, "games", gameId), {
			status: "started",
			startedAt: serverTimestamp(),
		});
	}, [gameId, isRoomOwner, showErrorModal]);

	return {
		gameId,
		isCreating,
		isJoining,
		waitingForPlayers,
		players,
		isRoomOwner,
		setInputGameId,
		joinGame,
		createGame,
		startGame,
		errorModalProps,
	};
};
