export function isSameDate(date1: Date, date2: Date) {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() && // Months are zero-based
		date1.getDate() === date2.getDate()
	);
}

const MS_IN_A_DAY = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

export function daysDifference(date1: Date, date2: Date) {
	// Get the time difference in milliseconds
	const timeDifference = date2.getTime() - date1.getTime();
	// Convert milliseconds to days
	const daysDifference = timeDifference / MS_IN_A_DAY;
	// Use Math.ceil or Math.round if needed
	return Math.floor(Math.abs(daysDifference));
}

export const getUTCServerDate = async () => {
	const response = await fetch(
		"https://timeapi.io/api/time/current/zone?timeZone=Etc%2FUTC"
	);
	const data = await response.json();
	return response.status === 200 ? new Date(data.dateTime) : undefined;
};

export const formatDate = (date: Date) => {
	// Format to a readable date string (e.g., July 18, 2019)
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(date);
};

export type FirebaseDate = {
	seconds: number;
	nanoseconds: number;
};

export const firebaseDateToDate = (firebaseDate: FirebaseDate): Date => {
	// Convert seconds to milliseconds and add nanoseconds as milliseconds
	const milliseconds =
		firebaseDate.seconds * 1000 +
		Math.floor(firebaseDate.nanoseconds / 1_000_000);
	return new Date(milliseconds);
};
