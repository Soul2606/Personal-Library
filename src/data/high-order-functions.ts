
export function filterMap<T, U>(arr:T[], fnc:(val:T, idx:number)=>U|undefined) {
	const res:U[] = []
	for (const [idx, val] of arr.entries()) {
		const r = fnc(val, idx)
		if (r !== undefined) res.push(r)
	}
	return res
}

export function mapObj<T extends Record<string, any>, U>(
	obj:T,
	fnc:(key:string, val:T[keyof T], idx:number)=>U
):Record<keyof T, U> {
	let nObj:Record<string, U> = {}
	let idx = 0

	for (const [key, val] of Object.entries(obj)) {
		nObj[key] = fnc(key, val, idx)
		idx++
	}

	return nObj as Record<keyof T, U>
}
