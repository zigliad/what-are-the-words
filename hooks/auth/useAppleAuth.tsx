import { auth, db } from "@/firebaseConfig";
import { useUser } from "@/hooks/auth/useUser";
import { setNewUserDoc, StorageKey } from "@/utils/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AppleAuthentication from "expo-apple-authentication";
import { OAuthProvider, signInWithCredential, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useState } from "react";

export const useAppleAuth = () => {
	const { refreshUserToken } = useUser();
	const [error, setError] = useState<string>();

	const handleFirebaseSignIn = useCallback(
		async (user: User) => {
			try {
				const userDocRef = doc(db, "users", user.uid);
				const userDoc = await getDoc(userDocRef);
				if (!userDoc.exists()) await setNewUserDoc(user, userDocRef);
				AsyncStorage.setItem(StorageKey.user, JSON.stringify(user));
				// Force a refresh of the user token and data
				await refreshUserToken();
				setError(undefined);
			} catch (error: any) {
				setError(
					error.message || "An error occurred during Firebase sign-in"
				);
			}
		},
		[refreshUserToken]
	);

	const signInWithApple = useCallback(async () => {
		try {
			const credential = await AppleAuthentication.signInAsync({
				requestedScopes: [
					AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
					AppleAuthentication.AppleAuthenticationScope.EMAIL,
				],
			});

			if (!credential.identityToken) {
				throw new Error("Apple authentication failed");
			}
			const provider = new OAuthProvider("apple.com");
			const firebaseCredential = provider.credential({
				idToken: credential.identityToken,
			});

			// Sign in to Firebase
			const userCredential = await signInWithCredential(
				auth,
				firebaseCredential
			);
			await handleFirebaseSignIn(userCredential.user);
		} catch (error: any) {
			setError(error.message ?? "An error occurred during Apple sign-in");
		}
	}, [handleFirebaseSignIn]);

	const clearError = useCallback(() => {
		setError(undefined);
	}, []);

	return { signInWithApple, error, clearError };
};
