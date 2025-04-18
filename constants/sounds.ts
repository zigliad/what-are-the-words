import { AVPlaybackSource } from "expo-av";

const clickSound = require("@/assets/sounds/click.mp3");
const successSound = require("@/assets/sounds/success.wav");
const whooshSound = require("@/assets/sounds/whoosh.wav");
const magicSound = require("@/assets/sounds/magic.wav");
const failSound = require("@/assets/sounds/fail.mp3");
const errorSound = require("@/assets/sounds/error.mp3");
const buySound = require("@/assets/sounds/buy.mp3");
const alreadyFoundSound = require("@/assets/sounds/bubble.mp3");

export enum Sound {
	click = "click",
	setFound = "setFound",
	restart = "restart",
	win = "win",
	lose = "lose",
	error = "error",
	buy = "buy",
	alreadyFound = "alreadyFound",
}

export const sounds: Record<Sound, AVPlaybackSource> = {
	[Sound.click]: clickSound,
	[Sound.setFound]: successSound,
	[Sound.restart]: whooshSound,
	[Sound.win]: magicSound,
	[Sound.lose]: failSound,
	[Sound.error]: errorSound,
	[Sound.buy]: buySound,
	[Sound.alreadyFound]: alreadyFoundSound,
};
