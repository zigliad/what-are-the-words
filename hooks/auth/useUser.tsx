import { Nullable, SetState } from "@/extra-types/utils/extra";
import { auth, db } from "@/firebaseConfig";
import { FullUser, UserGameData } from "@/types/user";
import { retryWithConstantBackoff } from "@/utils/functionUtils";
import { StorageKey } from "@/utils/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import useMount from "react-use/lib/useMount";

export type UserContextType = {
	user: Nullable<FullUser>;
	setUser: SetState<Nullable<User>>;
	signOutUser: () => Promise<void>;
	loadingError?: string;
	refreshUserToken: () => Promise<void>;
	isOffline: boolean;
};

export const UserContext = createContext<UserContextType>(
	{} as UserContextType
);

export const useInitUserContext = () => {
	const [user, setUser] = useState<Nullable<User>>(null);
	const [userGameData, setUserGameData] = useState<UserGameData>();
	const [loadingError, setLoadingError] = useState<string>();
	const [isOffline, setIsOffline] = useState(false);

	const _setLoadingError = useCallback(async (error: string) => {
		setLoadingError(error);
		setIsOffline(true);

		// When going offline, create a fake user with cached data
		// const result = await createOfflineUserData();
		// if (result) {
		// 	const { parsedUser, fakeUserData } = result;
		// 	setUser(parsedUser);
		// 	setUserGameData(fakeUserData);
		// }
	}, []);

	const refreshUserToken = useCallback(async () => {
		try {
			// If we have a current user, force a token refresh
			if (auth.currentUser) {
				await auth.currentUser.getIdToken(true);
				setUser(auth.currentUser);
				AsyncStorage.setItem(
					StorageKey.user,
					JSON.stringify(auth.currentUser)
				);
			}
		} catch (error) {
			_setLoadingError(
				`Failed to refresh user token: ${
					error instanceof Error ? error.message : String(error)
				}`
			);
		}
	}, [_setLoadingError]);

	useEffect(() => {
		if (user) {
			retryWithConstantBackoff(
				async () => {
					const userDocRef = doc(db, "users", user.uid);
					const userDoc = await getDoc(userDocRef);
					if (userDoc.exists()) {
						const userData = userDoc.data() as UserGameData;
						setUserGameData(userData);
						// if (userData.purchases && userData.settings) {
						// 	AsyncStorage.setItem(
						// 		StorageKey.persistentUserData,
						// 		JSON.stringify({
						// 			purchases: userData.purchases,
						// 			settings: userData.settings,
						// 		})
						// 	);
						// }
					} else throw new Error("User document not found");
				},
				2,
				2,
				(error) =>
					_setLoadingError(
						`Failed to load user data after multiple attempts: ${
							error instanceof Error
								? error.message
								: String(error)
						}`
					)
			);
		}
	}, [user, _setLoadingError]);

	const signOutUser = useCallback(async () => {
		try {
			await signOut(auth);
			await AsyncStorage.removeItem(StorageKey.user);
			// await AsyncStorage.removeItem(StorageKey.persistentUserData);
			setUser(null);
			setUserGameData(undefined);
			setLoadingError(undefined);
			setIsOffline(false);
		} catch (error) {
			_setLoadingError(
				`Failed to sign out: ${
					error instanceof Error ? error.message : String(error)
				}`
			);
		}
	}, [_setLoadingError]);

	const restoreUser = useCallback(async () => {
		try {
			const storedUser = await AsyncStorage.getItem(StorageKey.user);
			if (storedUser) setUser(JSON.parse(storedUser) as User);
		} catch (error) {
			_setLoadingError(
				`Failed to restore user: ${
					error instanceof Error ? error.message : String(error)
				}`
			);
		}
	}, [_setLoadingError]);

	useMount(restoreUser);

	// Listen for auth state changes
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
		});

		return () => unsubscribe();
	}, []);

	useEffect(() => {
		if (user?.uid) {
			const userDocRef = doc(db, "users", user.uid);

			// Attach a listener
			const unsubscribe = onSnapshot(
				userDocRef,
				(snapshot) => {
					if (snapshot.exists())
						setUserGameData(snapshot.data() as UserGameData);
				},
				(error) => {
					_setLoadingError(
						`Failed to listen to user document: ${
							error instanceof Error
								? error.message
								: String(error)
						}`
					);
				}
			);
			return () => unsubscribe();
		}
	}, [user?.uid, _setLoadingError]);

	return {
		user: user ? { ...user, gameData: userGameData } : null,
		setUser,
		signOutUser,
		loadingError,
		refreshUserToken,
		isOffline,
	};
};

export const useUser = () => useContext(UserContext);
