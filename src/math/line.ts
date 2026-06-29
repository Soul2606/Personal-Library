import { Vector2D } from "./vector2d.js";

export class Line {

	static from(l:Line) {
		return new Line(Vector2D.from(l.a), Vector2D.from(l.b))
	}

	static slicePoint(l1: Line, l2: Line):{point:Vector2D, inSegment:boolean} {
		const p = Vector2D.from(l1.a)
		const r = Vector2D.from(l1.b).subtract(l1.a)

		const q = Vector2D.from(l2.a)
		const s = Vector2D.from(l2.b).subtract(l2.a)

		const denom = r.cross(s)

		if (denom === 0) {
			throw new Error("Lines are parallel")
		}

		const t = q.subtract(p).cross(s) / denom

		const point = p.add(r.scale(t))
		return {
			point,
			inSegment:this.pointOnSegment(point, l1) && this.pointOnSegment(point, l2),
		}
	}

	/**Assuming p is a point on the line between a and b */
	static pointOnSegment(p: Vector2D, l:Line) {
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

	a:Vector2D
	b:Vector2D
	constructor(start:Vector2D, end:Vector2D) {
		this.a = Vector2D.from(start)
		this.b = Vector2D.from(end)
	}

	get length() : number {
		return this.a.distanceTo(this.b)
	}
	
	set length(v: number) {
		const center = this.midpoint()
		const dir = this.toVec()

		const half = v / 2

		this.a = Vector2D.from(center).subtract(dir.scale(half))
		this.b = Vector2D.from(center).add(dir.scale(half))
	}

	midpoint() {
		return Vector2D.from(this.a).add(this.b).divide(2)
	}

	toVec() {
		return Vector2D.from(this.b).subtract(this.a).normalize()
	}

	traceOnPoint(p:Vector2D) {
		const epsilon = 0.0001
		return Math.abs(this.orient(p)) < epsilon
	}

	onPoint(p:Vector2D) {
		return this.traceOnPoint(p) && Line.pointOnSegment(p, this)
	}

	/**Read orient on Vector2d to lear more. */
	orient(p:Vector2D) {
		return p.orient(this.a, this.b)
	}
}