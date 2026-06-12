
export function filterMap<T, U>(arr:T[], fnc:(val:T, idx:number)=>U|undefined) {
	const res:U[] = []
	for (const [idx, val] of arr.entries()) {
		const r = fnc(val, idx)
		if (r !== undefined) res.push(r)
	}
	return res
}
