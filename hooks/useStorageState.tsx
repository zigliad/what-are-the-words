import { useUser } from "@/hooks/auth/useUser";
import {
	getData,
	getObjectData,
	StorageKey,
	storeData,
	storeObjectData,
} from "@/utils/storage";
import { Primitive } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

export const useStorageState = <T extends Primitive>(
	storageKey: StorageKey,
	defaultValue: T,
	onLoad?: (value: T) => void
) => {
	const [value, _setValue] = useState<T>();
	const { user, isOffline } = useUser();

	useEffect(() => {
		(async () => {
			let loadedValue = await getData(user, storageKey, defaultValue);
			if (loadedValue === null) {
				storeData(user, storageKey, defaultValue, isOffline);
				_setValue(defaultValue);
				loadedValue = defaultValue;
			} else {
				_setValue(loadedValue);
			}
			onLoad?.(loadedValue);
		})();
	}, [user, storageKey, defaultValue, onLoad, isOffline]);

	const setValue = useCallback(
		async (newValue: T) => {
			_setValue(newValue);
			storeData(user, storageKey, newValue, isOffline);
		},
		[user, storageKey, isOffline]
	);

	return [value, setValue] as [T, (newValue: T) => Promise<void>];
};

export const useStorageObjectState = <T extends {} | []>(
	storageKey: StorageKey,
	defaultValue: T
) => {
	const [value, _setValue] = useState<T>();
	const { user, isOffline } = useUser();

	const setValue = useCallback(
		async (newValue: T) => {
			storeObjectData(user, storageKey, newValue, isOffline);
			_setValue(newValue);
		},
		[user, storageKey, isOffline]
	);

	useEffect(() => {
		(async () => {
			const loadedValue = await getObjectData(user, storageKey);
			if (loadedValue === null) {
				storeObjectData(user, storageKey, defaultValue, isOffline);
				_setValue(defaultValue);
			} else {
				_setValue(loadedValue);
			}
		})();
	}, [user, storageKey, defaultValue, isOffline]);

	return [value, setValue] as [T, (newValue: T) => Promise<void>];
};
