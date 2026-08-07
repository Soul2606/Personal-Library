
export type Area2d = string

export function stringify(area:Point[]):Area2d {
	const rows = toRows(area)

	let str:string[] = []

	for (const s of rows) {
		str.push([s.s, s.e, s.y].join(":"))
	}

	return str.join(" ")
}

export function parse(str:string) {
	const parts = str.split(" ")
	const rows = parts.map<Span>(span => {
		const [s,e,y] = span.split(":").map(Number)
		if (s === undefined || !Number.isFinite(s)) throw new Error("");
		if (e === undefined || !Number.isFinite(e)) throw new Error("");
		if (y === undefined || !Number.isFinite(y)) throw new Error("");
		return {s,e,y} satisfies Span
	})
	

	return fromRows(rows)
}




type Point = {x:number, y:number}

type Span = {s:number, e:number, y:number}

function toRows(area:Point[]):Span[]{
	const rows:Span[] = []

	const _area = Array.from(area).sort((a,b)=>a.y-b.y).sort((a,b)=>a.x-b.x)

	for (const p of _area) {
		rows

		let s = rows.find(s => 
			s.e === p.x - 1 && s.y === p.y
		)

		if (s) {
			s.e = p.x
		} else {
			s = {s:p.x, e:p.x, y:p.y} satisfies Span
			rows.push(s)
		}
	}

	return rows
}




function fromRows(rows:Span[]):Point[] {
	const points:Point[] = []
	for (const span of rows) {
		points.push(...spanToPoints(span))
	}
	return points
}




function spanToPoints(span:Span):Point[] {
	const points:Point[] = []
	const y = span.y
	for (let x = span.s; x < span.e + 1; x++) {
		points.push({x,y})
	}
	return points
}
