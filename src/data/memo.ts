
export function memo<T extends (...args: number[]) => any>(fnc: T) {
	type P = Parameters<T>;
	type R = ReturnType<T>;
	const cache = new Map<string, R>()
	return (...args: P): R => {
		const key = args.join(",")
		const exists = cache.get(key)
		if (exists) return exists;
		const m = fnc(...args)
		cache.set(key,m)
		return m;
	};
}
