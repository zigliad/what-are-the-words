import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { fontWeightStyles } from "@/styles/commonStyles";
import {
	BadgeInfo,
	Check,
	LucideIcon,
	TriangleAlert,
	X,
} from "lucide-react-native";
import React, { DispatchWithoutAction } from "react";

export type ModalType = "info" | "success" | "error" | "warning";

const modalTypeConfig: Record<
	ModalType,
	{ color?: string; bgTailwindColor?: string; icon: LucideIcon }
> = {
	info: {
		bgTailwindColor: "bg-info-500",
		icon: BadgeInfo,
	},
	success: {
		bgTailwindColor: "bg-success-400",
		icon: Check,
	},
	error: {
		bgTailwindColor: "bg-error-500",
		icon: X,
	},
	warning: {
		bgTailwindColor: "bg-warning-500",
		icon: TriangleAlert,
	},
};

export const AwesomeModalActions = ({
	onResolve,
	type,
	buttonText = "Ok",
	color,
	tailwindColor,
	secondaryOnResolve,
	secondaryButtonText,
	className = "",
}: {
	onResolve?: DispatchWithoutAction;
	type?: ModalType;
	buttonText?: string;
	color?: string;
	tailwindColor?: string;
	secondaryOnResolve?: DispatchWithoutAction;
	secondaryButtonText?: string;
	className?: string;
}) => {
	const computedType = !color && !tailwindColor ? type ?? "info" : "info";
	const computedColor = color ? color : modalTypeConfig[computedType].color;
	const computedTailwindColor = tailwindColor
		? tailwindColor
		: modalTypeConfig[computedType].bgTailwindColor;

	return (
		<HStack space="sm" className={className}>
			{secondaryOnResolve && secondaryButtonText && (
				<Button
					size="md"
					variant="outline"
					className={"flex-1 rounded-lg"}
					onPress={secondaryOnResolve}
				>
					<ButtonText
						style={{
							fontFamily: fontWeightStyles.black.fontFamily,
						}}
					>
						{secondaryButtonText}
					</ButtonText>
				</Button>
			)}
			<Button
				size="md"
				variant="solid"
				className={"flex-1 rounded-lg " + (computedTailwindColor ?? "")}
				onPress={onResolve}
				style={{
					...(computedColor && {
						backgroundColor: computedColor,
					}),
				}}
			>
				<ButtonText
					className="text-white"
					style={{
						fontFamily: fontWeightStyles.black.fontFamily,
					}}
				>
					{buttonText}
				</ButtonText>
			</Button>
		</HStack>
	);
};
