import { toHumanCase } from "@/utils/stringUtils";
import { User } from "firebase/auth";

export const getDisplayName = (
	user: Pick<User, "uid" | "displayName" | "photoURL" | "email"> & {
		gameData?: { nickname: string | null };
	}
) => {
	return (
		// First check if there's a custom nickname in gameData
		user.gameData?.nickname ||
		// Then check the auth displayName
		user.displayName ||
		// Fallback to email or user ID
		(user.email
			? toHumanCase(user.email.split("@")[0])
			: `User ${user.uid.substring(0, 6)}...`)
	);
};
