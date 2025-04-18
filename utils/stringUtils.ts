export const toHumanCase = (str: string) => {
	return (
		str
			// Replace non-alphanumeric characters or camelCase with spaces
			.replace(/([a-z])([A-Z])/g, "$1 $2") // Handle camelCase
			.replace(/[_-]+/g, " ") // Replace _ or - with space
			// Capitalize the first letter of each word
			.replace(/\b\w/g, (char) => char.toUpperCase())
	);
};

export const isFalse = (val: string | boolean) => {
	return ["false", "False", false].includes(val);
};

export const generateBase3String = (uid: string) => {
	let base3String = "";

	for (let i = 0; i < 3; i++) {
		// Use the first 4 significant characters of the UUID
		const charCode = uid.charCodeAt(i) || 0; // Ensure fallback if index is out of range
		base3String += (charCode % 3) + 1; // Map to 0, 1, or 2
	}

	return base3String;
};

export const emojiMedals = ["🥇 ", "🥈 ", "🥉 "];
