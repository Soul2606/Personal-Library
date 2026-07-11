export function rand(seed: string) {
	const f = mulberry32(hash(seed))
	return {
		float () {
			return f() / 2 ** 32
		},
		int () {
			return f()
		},
		range (min:number, max:number) {
			const _min = Math.min(min, max);
			const _max = Math.max(min, max);
			const s = _max - _min
			return this.float() * s + _min
		}
	}
}

function hash(seed: string): number {
	let h = 0;

	for (const s of seed.split("-")) {
		const n = Number(s);

		if (!Number.isFinite(n)) {
			throw new Error("Invalid string seed");
		}

		h ^= n;
		h = Math.imul(h, 0x9E3779B1);
		h ^= h >>> 16;
	}

	return h >>> 0;
}

function mulberry32(seed: number) {
	return () => {
		seed += 0x6D2B79F5;

		let t = seed;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

		return ((t ^ (t >>> 14)) >>> 0);
	};
}
