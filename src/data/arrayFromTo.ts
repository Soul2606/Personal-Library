
export function fromTo<T>(array:T[], from:number, to:number) {
	const copy = Array.from(array)
	if (from < 0 || to < 0) return []
	if (from >= array.length || to >= array.length) return []

	if (from > to) {
		[from, to] = [to, from]
		copy.reverse()
	}
	
	const res:T[] = []
	for (let i = from; i < to; i++) {
		res.push(copy[i]!)
	}

	return res
}
