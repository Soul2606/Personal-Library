import { Vector2D } from "./vector2d.js";

export class Line {

	static from(l:Line) {
		return new Line(Vector2D.from(l.start), Vector2D.from(l.end))
	}

	static slicePoint(l1: Line, l2: Line):{point:Vector2D, inSegment:boolean} {
		const p = Vector2D.from(l1.start)
		const r = Vector2D.from(l1.end).subtract(l1.start)

		const q = Vector2D.from(l2.start)
		const s = Vector2D.from(l2.end).subtract(l2.start)

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
		const minX = Math.min(l.start.x, l.end.x)
		const maxX = Math.max(l.start.x, l.end.x)

		const minY = Math.min(l.start.y, l.end.y)
		const maxY = Math.max(l.start.y, l.end.y)

		return (
			p.x >= minX &&
			p.x <= maxX &&
			p.y >= minY &&
			p.y <= maxY
		)
	}

	start:Vector2D
	end:Vector2D
	constructor(start:Vector2D, end:Vector2D) {
		this.start = Vector2D.from(start)
		this.end = Vector2D.from(end)
	}

	get length() : number {
		return this.start.distanceTo(this.end)
	}
	
	set length(v: number) {
		const center = this.midpoint()
		const dir = this.toVec()

		const half = v / 2

		this.start = Vector2D.from(center).subtract(dir.scale(half))
		this.end = Vector2D.from(center).add(dir.scale(half))
	}

	midpoint() {
		return Vector2D.from(this.start).add(this.end).divide(2)
	}

	toVec() {
		return Vector2D.from(this.end).subtract(this.start).normalize()
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
		return p.orient(this.start, this.end)
	}
}