import { Vector2D } from "./vector2d.js";

export type Area2d = string

export function stringify(area:Point[]):Area2d {
	const areas = greedyMesh(area)

	return areas.map(a =>
		`${a.x}:${a.y}:${a.w}:${a.h}`
	).join(" ")
}

export function parse(str:string):Point[] {
	if (str === "") return []
	const areas = str.split(" ")
	const rects = areas.map<Rect>(str => {
		const arr = str.split(":").map(Number)
		if (arr.length !== 4) throw new Error("Invalid string");
		const [x,y,w,h] = arr
		if (x === undefined || !Number.isFinite(x)) throw new Error("Invalid string");
		if (w === undefined || !Number.isFinite(w)) throw new Error("Invalid string");
		if (y === undefined || !Number.isFinite(y)) throw new Error("Invalid string");
		if (h === undefined || !Number.isFinite(h)) throw new Error("Invalid string");
		return {x, y, w, h} satisfies Rect
	})
	
	return rects.flatMap(rectToPoints)
}




type Point = Vector2D

type Rect = {x:number, y:number, w:number, h:number}

/**Mutates area. Returns an area rect and the remaining pixels that is not covered by the rect. */
function greedyArea(area:Set<string>):Rect {
	
	const first = Array.from(area)[0]
	if (first === undefined) throw new Error("Size 0 area provided");
	

	area.delete(first)

	const fVec = Vector2D.fromKey(first)
	if (fVec === undefined) throw new Error("Cannot convert from key");
	
	const rect:Rect = {
		x:fVec.x,
		y:fVec.y,
		w:1,
		h:1,
	}

	/**Fast lookup area remaining keys*/
	const farKeys = area

	while (true) {
		/**Next point key*/
		const npk = Vector2D.toKey(new Vector2D(rect.x + rect.w, rect.y))
		if (farKeys.has(npk)) {
			farKeys.delete(npk)
			rect.w++
		} else {
			break
		}
	}

	while (true) {
		const nRect:Rect = {
			x:rect.x,
			y:rect.y + rect.h,
			h:1,
			w:rect.w
		}
		/**Next point keys */
		const npKeys = rectToPoints(nRect).map(Vector2D.toKey)
		if (npKeys.every(k => farKeys.has(k))) {
			npKeys.forEach(k => farKeys.delete(k))
			rect.h++
		} else {
			break
		}
	}

	return rect
}




function rectToPoints(rect:Rect):Point[] {
	const points:Point[] = []
	for (let i = 0; i < rect.w * rect.h; i++) {
		const x = (i % rect.w) + rect.x
		const y = Math.floor(i / rect.w) + rect.y
		points.push(new Vector2D(x,y))
	}
	return points
}




function greedyMesh(points:Point[]):Rect[] {
	const rects:Rect[] = []
	let current = new Set(Array.from(points)
	.sort((a, b) =>
		a.y === b.y
			? a.x - b.x
			: a.y - b.y
	).map(Vector2D.toKey))

	while (current.size > 0) {
		const rect = greedyArea(current)
		rects.push(rect)
	}

	return rects
}
