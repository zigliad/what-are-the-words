import { Price } from "@/types/price";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import Purchases, { PRODUCT_CATEGORY, PurchasesStoreProduct } from "react-native-purchases";

export const APIKeys = {
	apple: "appl_emsJrqniTudiHIFlRjHRJMyvoFv",
	google: "goog_qqvbIyrVnAblmIgwksYsTncikQw",
};

export const LEGACY_PREMIUM_PRODUCT_ID = "com.zigdonliad.Sets.premium";
export const REMOVE_ADS_PRODUCT_ID = "remove_ads";

export const NON_CONSUMABLE_PRODUCT_IDS = [
	LEGACY_PREMIUM_PRODUCT_ID,
	REMOVE_ADS_PRODUCT_ID,
];

export const CONSUMABLE_PRODUCTS: Record<
	string,
	Price & { index: number; badge?: string }
> = {
	coins_tier_1: { coins: 1000, index: 0 }, // 1$
	coins_tier_2: { coins: 3300, badge: "10% Bonus", index: 20 }, // 3$, +10%
	coins_tier_3: { coins: 6000, badge: "20% Bonus", index: 40 }, // 5$, +20%
	coins_tier_4: { coins: 13000, badge: "30% Bonus", index: 60 }, // 10$, +30%
	gems_tier_1: { gems: 7, index: 10 }, // 1$
	gems_tier_2: { gems: 23, badge: "10% Bonus", index: 30 }, // 3$, +10%
	gems_tier_3: { gems: 42, badge: "20% Bonus", index: 50 }, // 5$, +20%
	gems_tier_4: { gems: 91, badge: "30% Bonus", index: 70 }, // 10$, +30%
	coins_and_gems_tier_1: {
		coins: 3300,
		gems: 15,
		badge: "10% Bonus",
		index: 80,
	}, // 5$, +10%
	coins_and_gems_tier_2: {
		coins: 7200,
		gems: 33,
		badge: "20% Bonus",
		index: 90,
	}, // 10$, +20%
};

export const CONSUMABLE_PRODUCT_IDS = Object.keys(CONSUMABLE_PRODUCTS);

const COINS_AND_GEMS_OFFER_ID = "offer_1";
const REMOVE_ADS_OFFER_ID = "offer_remove_ads";

const REDUNDANT_SUFFIX = " (SET - a Twisted Classic)";

export const useProducts = (identifiers: string[]) => {
	const [products, setProducts] = useState<PurchasesStoreProduct[]>();

	useEffect(() => {
		const setup = async () => {
			Purchases.configure({
				apiKey: Platform.OS === "ios" ? APIKeys.apple : APIKeys.google,
			});
			const fetchedProducts = await Purchases.getProducts(
				identifiers,
				PRODUCT_CATEGORY.NON_SUBSCRIPTION
			);

			setProducts(fetchedProducts);
		};

		setup().catch(console.error);
	}, [identifiers]);

	return { products };
};

const renamedProduct = (p: PurchasesStoreProduct) => ({
	...p,
	title: p.title.replaceAll(REDUNDANT_SUFFIX, ""),
});

export const useRemoveAdsProduct = () => {
	const [product, setProduct] = useState<PurchasesStoreProduct>();

	useEffect(() => {
		const setup = async () => {
			Purchases.configure({
				apiKey: Platform.OS === "ios" ? APIKeys.apple : APIKeys.google,
			});
			// const _products = await Purchases.getProducts(
			// 	CONSUMABLE_PRODUCT_IDS
			// );
			const offers = await Purchases.getOfferings();
			const _products = offers.all[
				REMOVE_ADS_OFFER_ID
			].availablePackages.map((pack) => pack.product);

			const _product = _products.find(
				(p) => p.identifier === REMOVE_ADS_PRODUCT_ID
			);

			if (_product) setProduct(renamedProduct(_product));
		};

		setup().catch(console.error);
	}, []);

	return product;
};

export const useCoinsAndGemsProducts = () => {
	const [products, setProducts] = useState<PurchasesStoreProduct[]>();

	useEffect(() => {
		const setup = async () => {
			Purchases.configure({
				apiKey: Platform.OS === "ios" ? APIKeys.apple : APIKeys.google,
			});
			// const _products = await Purchases.getProducts(
			// 	CONSUMABLE_PRODUCT_IDS
			// );
			const offers = await Purchases.getOfferings();
			const _products = offers.all[
				COINS_AND_GEMS_OFFER_ID
			].availablePackages.map((pack) => pack.product);

			setProducts(
				_products
					.map(renamedProduct)
					.sort(
						(p1, p2) =>
							CONSUMABLE_PRODUCTS[p1.identifier].index -
							CONSUMABLE_PRODUCTS[p2.identifier].index
					)
			);
		};

		setup().catch(console.error);
	}, []);

	return { products };
};
