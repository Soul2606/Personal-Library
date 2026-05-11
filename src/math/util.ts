export function relu(x: number) {
	return Math.max(x, 0)
}




export function clamp(val: number, min: number = 0, max: number = 1) {
	const validate = (n: number) => {
		if (Number.isNaN(n)) throw new Error("type error. value must be a number")
		if (typeof n !== 'number') throw new Error("type error. value must be a number")
	}
	validate(val)
	validate(min)
	validate(max)
	return Math.max(min, Math.min(max, val))
}




/**
 * Distributes an integer evenly across an array without exceeding per-cell limits.
 * @param n integer to be distributed
 * @param limits limit of each cell that must not be exceeded
 */
export function distributeIntEvenly(n: number, limits: readonly number[]): number[] {
	if (!Number.isInteger(n) || n < 0) {
		throw new Error("n must be a non-negative integer");
	}

	const result = new Array(limits.length).fill(0);
	const remainingCaps = Array.from(limits);

	let remaining = Math.min(n, limits.reduce((a, b) => a + b, 0));

	while (remaining > 0) {
		let progressed = false;

		for (let i = 0; i < remainingCaps.length && remaining > 0; i++) {
			if (remainingCaps[i]! > 0) {
				result[i]++;
				remainingCaps[i]!--;
				remaining--;
				progressed = true;
			}
		}

		if (!progressed) break; // no capacity left anywhere
	}

	return result;
}