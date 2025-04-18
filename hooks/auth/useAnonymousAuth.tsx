import { auth, db } from "@/firebaseConfig";
import { setNewUserDoc, StorageKey } from "@/utils/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInAnonymously } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";

export const useAnonymousAuth = () => {
	const [error, setError] = useState<string>();

	const loginAnonymously = async () => {
		try {
			const userCredential = await signInAnonymously(auth);
			const anonUser = userCredential.user;
			const userDocRef = doc(db, "users", anonUser.uid);
			const userDoc = await getDoc(userDocRef);
			if (!userDoc.exists()) await setNewUserDoc(anonUser, userDocRef);
			await AsyncStorage.setItem(
				StorageKey.user,
				JSON.stringify(anonUser)
			);
		} catch (error: any) {
			console.error("Firebase sign-in error:", error);
			setError(error.message);
		}
	};

	return { loginAnonymously, error };
};
