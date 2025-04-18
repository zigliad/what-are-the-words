import { interstitialAdUnitId } from "@/constants/ads";
import { useCallback, useEffect, useState } from "react";
import { AdEventType, InterstitialAd } from "react-native-google-mobile-ads";

export const useInterstitialAd = () => {
	const [interstitial, setInterstitial] = useState(() =>
		InterstitialAd.createForAdRequest(interstitialAdUnitId)
	);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		const adInstance =
			InterstitialAd.createForAdRequest(interstitialAdUnitId);
		setInterstitial(adInstance);

		const unsubscribeLoaded = adInstance.addAdEventListener(
			AdEventType.LOADED,
			() => {
				setLoaded(true);
			}
		);

		const unsubscribeClosed = adInstance.addAdEventListener(
			AdEventType.CLOSED,
			() => {
				setLoaded(false);
				adInstance.load();
			}
		);

		adInstance.load();

		return () => {
			unsubscribeLoaded();
			unsubscribeClosed();
		};
	}, []);

	const showAdIfLoaded = useCallback(() => {
		if (loaded) {
			interstitial.show();
			return true;
		}
		return false;
	}, [loaded, interstitial]);

	return { showAdIfLoaded, loaded };
};
