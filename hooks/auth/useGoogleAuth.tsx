import { auth, db } from "@/firebaseConfig";
import { useUser } from "@/hooks/auth/useUser";
import { setNewUserDoc, StorageKey } from "@/utils/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthRequest } from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

WebBrowser.maybeCompleteAuthSession();

// Firebase project credentials
const WEB_CLIENT_ID =
	"497352667057-pgqih8ftkb2c6u9c35m4hlcq01qmag9d.apps.googleusercontent.com";
const IOS_CLIENT_ID =
	"497352667057-hv2qhrskn3bcish094845fnl8a3ibglv.apps.googleusercontent.com";
const ANDROID_CLIENT_ID =
	"497352667057-8tsd53kbvqb2f6ngoj8bh946ipaa2oj3.apps.googleusercontent.com";

export const useGoogleAuth = () => {
	const { refreshUserToken } = useUser();
	const [error, setError] = useState<string>();
	const [request, response, promptAsync] = useAuthRequest({
		webClientId: WEB_CLIENT_ID,
		iosClientId: IOS_CLIENT_ID,
		androidClientId: ANDROID_CLIENT_ID,
	});

	const handleFirebaseSignIn = useCallback(
		async (idToken: string | null) => {
			if (!idToken) {
				setError("No authentication token received from Google");
				return;
			}

			try {
				const credential = GoogleAuthProvider.credential(idToken);
				const userCredential = await signInWithCredential(
					auth,
					credential
				);
				const user = userCredential.user;
				const userDocRef = doc(db, "users", user.uid);
				const userDoc = await getDoc(userDocRef);
				if (!userDoc.exists()) await setNewUserDoc(user, userDocRef);
				AsyncStorage.setItem(StorageKey.user, JSON.stringify(user));
				// Force a refresh of the user token and data
				await refreshUserToken();
				setError(undefined);
			} catch (error: any) {
				setError(
					error.message ?? "An error occurred during Google sign-in"
				);
			}
		},
		[refreshUserToken]
	);

	useEffect(() => {
		if (response?.type === "success" && response.authentication) {
			handleFirebaseSignIn(response.authentication.idToken ?? null);
		} else if (response?.type === "error") {
			setError("Google authentication failed");
		}
	}, [response, handleFirebaseSignIn]);

	const clearError = useCallback(() => {
		setError(undefined);
	}, []);

	const signInWithGoogle = useCallback(() => {
		setError(undefined);
		promptAsync();
	}, [promptAsync]);

	return { signInWithGoogle, error, clearError };
};
