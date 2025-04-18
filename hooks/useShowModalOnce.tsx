import { useUser } from "@/hooks/auth/useUser";
import { useStorageState } from "@/hooks/useStorageState";
import { StorageKey } from "@/utils/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

export const useShowModalOnce = (key: StorageKey) => {
	const { isOffline } = useUser();
	const [visibleModal, setVisibleModal] = useState(false);
	const [seenModal, setSeenModal] = useStorageState<boolean>(
		key,
		isOffline ? true : false
	);

	useEffect(() => {
		if (seenModal === false) setVisibleModal(true);
	}, [seenModal]);

	const closeModal = useCallback(() => {
		setVisibleModal(false);
		setSeenModal(true);
		// save this locally even if the user is signed in
		AsyncStorage.setItem(key, String(true));
	}, [key]);

	return { visibleModal, closeModal };
};
