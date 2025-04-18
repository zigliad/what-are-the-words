export const retryWithExponentialBackoff = async (
	operation: () => Promise<void> | void,
	maxRetries: number,
	onError: (error: unknown) => void
) => {
	let attempt = 0;

	const execute = async () => {
		try {
			await operation();
		} catch (error) {
			if (attempt < maxRetries) {
				attempt++;
				const delay = Math.pow(2, attempt) * 1000;
				setTimeout(execute, delay);
			} else {
				onError(error);
			}
		}
	};

	await execute();
};

export const retryWithConstantBackoff = async (
	operation: () => Promise<void> | void,
	maxRetries: number,
	seconds: number,
	onError: (error: unknown) => void
) => {
	let attempt = 0;

	const execute = async () => {
		try {
			await operation();
		} catch (error) {
			if (attempt < maxRetries) {
				attempt++;
				setTimeout(execute, seconds * 1000);
			} else {
				onError(error);
			}
		}
	};

	await execute();
};
