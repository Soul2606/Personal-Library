import { Line } from "./line"
import { Vector2D } from "./vector2d"


export function slicePoint(l1: Line, l2: Line):{point:Vector2D, inSegment:boolean}|null {
	const p = l1.a
	const r = Vector2D.from(l1.b).subtract(l1.a)

	const q = l2.a
	const s = Vector2D.from(l2.b).subtract(l2.a)

	const denom = r.cross(s)

   if (Math.abs(denom) < 1e-9) return null

	const t = q.subtract(p).cross(s) / denom

	const point = p.add(r.scale(t))
	return {
		point,
		inSegment:inLineRect(point, l1) && inLineRect(point, l2),
	}
}




/**Is true if p is within the rectangle encompassing ab (line) */
function inLineRect(p: Vector2D, l:Line) {
	const minX = Math.min(l.a.x, l.b.x)
	const maxX = Math.max(l.a.x, l.b.x)

	const minY = Math.min(l.a.y, l.b.y)
	const maxY = Math.max(l.a.y, l.b.y)

	return (
		p.x >= minX &&
		p.x <= maxX &&
		p.y >= minY &&
		p.y <= maxY
	)
}




/**Returns every edge from a polygon / closed path of points */
export function getEdges(polygon:readonly Vector2D[]):Line[] {
	if (polygon.length < 2) return []
	return polygon.map((p,i) => new Line(
		p,
		polygon[(i+1) % polygon.length]!
	))
}