import { AwesomeModalActions } from "@/components/awesome-modal/AwesomeModalActions";
import { FixedText } from "@/components/FixedText";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Icon } from "@/components/ui/icon";
import { Modal, ModalBackdrop, ModalContent } from "@/components/ui/modal";
import { fontWeightStyles } from "@/styles/commonStyles";
import { BadgeInfo, Check, LucideIcon, TriangleAlert, X } from "lucide-react-native";
import React, { DispatchWithoutAction } from "react";
import { ScrollView } from "react-native";

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

export const AwesomeModal = ({
	visible = false,
	onResolve,
	header,
	content,
	type,
	buttonText = "Ok",
	color,
	tailwindColor,
	icon,
	backdropOnResolve = false,
	backdropSecondaryOnResolve = false,
	secondaryOnResolve,
	secondaryButtonText,
}: {
	visible?: boolean;
	onResolve?: DispatchWithoutAction;
	header: string;
	content: string;
	type?: ModalType;
	buttonText?: string;
	color?: string;
	tailwindColor?: string;
	icon?: LucideIcon;
	backdropOnResolve?: boolean;
	backdropSecondaryOnResolve?: boolean;
	secondaryOnResolve?: DispatchWithoutAction;
	secondaryButtonText?: string;
}) => {
	const computedType = !color && !tailwindColor ? type ?? "info" : "info";
	const computedColor = color ? color : modalTypeConfig[computedType].color;
	const computedTailwindColor = tailwindColor
		? tailwindColor
		: modalTypeConfig[computedType].bgTailwindColor;
	const computedIcon = icon ? icon : modalTypeConfig[computedType].icon;

	return (
		<Modal isOpen={visible}>
			<ModalBackdrop
				onPress={
					backdropOnResolve
						? onResolve
						: backdropSecondaryOnResolve
						? secondaryOnResolve
						: undefined
				}
			/>
			<ModalContent
				className="relative overflow-visible bg-background-card p-2 rounded-xl"
				style={{ borderWidth: 0, maxWidth: 280 }}
			>
				<Center>
					<Box
						className="absolute rounded-full w-22 h-22 -top-14 p-1 bg-background-card"
						style={{ backgroundColor: "#0f0" }}
					>
						<Center
							className={
								"w-20 h-20 rounded-full " +
								(computedTailwindColor ?? "")
							}
							style={{
								...(computedColor && {
									backgroundColor: computedColor,
								}),
							}}
						>
							<Icon
								as={computedIcon}
								className={"w-8 h-8 text-white"}
							/>
						</Center>
					</Box>
					<Center className="mt-12 w-full">
						<FixedText
							size="2xl"
							style={{
								fontFamily: fontWeightStyles.black.fontFamily,
							}}
						>
							{header}
						</FixedText>
						<ScrollView
							style={{ maxHeight: 140 }}
							className="px-4 w-full"
						>
							<FixedText
								className="text-center mt-2"
								style={{
									fontFamily:
										fontWeightStyles.medium.fontFamily,
								}}
							>
								{content}
							</FixedText>
						</ScrollView>
						<AwesomeModalActions
							className="mt-6"
							{...{
								onResolve,
								type,
								buttonText,
								color,
								tailwindColor,
								secondaryOnResolve,
								secondaryButtonText,
							}}
						/>
					</Center>
				</Center>
			</ModalContent>
		</Modal>
	);
};
