import { useCallback, useRef, useState } from "react";

// Combo logic - rewards increase with consecutive sets
const COMBO_DECAY_TIME = 4000; // Time in ms before combo resets (4 seconds)
const COMBO_REWARDS = {
	1: 1, // First set: 1 coin
	2: 2, // Second consecutive set: 2 coins
	3: 3, // Third consecutive set: 3 coins
	// Higher combos give 3 coins
};

export const getComboReward = (comboCount: number): number => {
	return (
		COMBO_REWARDS[Math.min(comboCount, 3) as keyof typeof COMBO_REWARDS] ||
		3
	);
};

export const useCombo = () => {
	const [comboCount, setComboCount] = useState(1);
	const comboTimerRef = useRef<NodeJS.Timeout | null>(null);

	// Reset combo after the decay time
	const resetComboAfterDelay = useCallback(() => {
		if (comboTimerRef.current) {
			clearTimeout(comboTimerRef.current);
		}

		comboTimerRef.current = setTimeout(() => {
			setComboCount(1);
		}, COMBO_DECAY_TIME);
	}, []);

	const incrementCombo = useCallback(() => {
		setComboCount((prev) => prev + 1);
		resetComboAfterDelay();
	}, [resetComboAfterDelay]);

	const resetCombo = useCallback(() => {
		setComboCount(1);
		if (comboTimerRef.current) {
			clearTimeout(comboTimerRef.current);
			comboTimerRef.current = null;
		}
	}, []);

	return {
		comboCount,
		incrementCombo,
		resetCombo,
		getComboReward,
		COMBO_DECAY_TIME,
	};
};
