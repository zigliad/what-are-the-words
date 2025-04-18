import { rewardedAdUnitId } from "@/constants/ads";
import { useCallback, useEffect, useState } from "react";
import {
	RewardedAd,
	RewardedAdEventType,
	RewardedAdReward,
} from "react-native-google-mobile-ads";

export const useRewardedAd = (onReward: (reward: RewardedAdReward) => void) => {
	const [rewarded, setRewarded] = useState(() =>
		RewardedAd.createForAdRequest(rewardedAdUnitId)
	);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		const adInstance = RewardedAd.createForAdRequest(rewardedAdUnitId);
		setRewarded(adInstance);

		const unsubscribeLoaded = adInstance.addAdEventListener(
			RewardedAdEventType.LOADED,
			() => {
				setLoaded(true);
			}
		);

		const unsubscribeEarned = adInstance.addAdEventListener(
			RewardedAdEventType.EARNED_REWARD,
			(reward) => {
				onReward(reward);
				setLoaded(false);
				adInstance.load();
			}
		);

		// Start loading the rewarded ad immediately
		adInstance.load();

		// Cleanup listeners when the component unmounts
		return () => {
			unsubscribeLoaded();
			unsubscribeEarned();
		};
	}, [onReward]);

	const showAdIfLoaded = useCallback(() => {
		if (loaded) {
			rewarded.show();
		}
	}, [loaded, rewarded]);

	return { showAdIfLoaded, loaded };
};
