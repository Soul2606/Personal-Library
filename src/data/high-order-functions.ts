
export function filterMap<T, U>(arr:T[], fnc:(arg:T)=>U|undefined) {
	const res:U[] = []
	for (const el of arr) {
		const r = fnc(el)
		if (r !== undefined) res.push(r)
	}
return res
}
