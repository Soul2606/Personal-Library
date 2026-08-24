
/**Mutates array */
export function shuffle<T>(array:T[]) {
	const shuffled = array; 
	
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		
		// Swap elements using destructuring assignment
		[shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
	}
	
	return shuffled;
}



/** Returns a random element from the array. Throws if length is zero */
export function pickRandom<T>(a:T[]):T {
	const l = a.length
	if (l === 0) throw new Error("Cannot initialize with an array of length 0");
	return a[
		Math.floor(Math.random() * l)
	]!
}
