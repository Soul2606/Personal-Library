import { Vector2D } from "./vector2d.js";

export class Line {

	static from(l:Line) {
		return new Line(Vector2D.from(l.a), Vector2D.from(l.b))
	}

	a:Vector2D
	b:Vector2D
	constructor(start:Vector2D, end:Vector2D) {
		this.a = Vector2D.from(start)
		this.b = Vector2D.from(end)
	}

	get length() : number {
		return Vector2D.distanceTo(this.a, this.b)
	}
	
	set length(v: number) {
		const center = this.midpoint()
		const dir = this.toVec()

		const half = v / 2

		this.a = Vector2D.sub(center, Vector2D.scale(dir, half))
		this.b = Vector2D.add(center, Vector2D.scale(dir, half))
	}

	midpoint() {
		return Vector2D.scale(Vector2D.add(this.a, this.b), 0.5)
	}

	toVec() {
		return Vector2D.normalized(Vector2D.sub(this.b, this.a))
	}

	traceOnPoint(p:Vector2D) {
		const epsilon = 0.0001
		return Math.abs(this.orient(p)) < epsilon
	}

	/**Read orient on Vector2d to lear more. */
	orient(p:Vector2D) {
		return Vector2D.orient(p, this.a, this.b)
	}
}