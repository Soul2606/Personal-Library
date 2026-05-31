export class Vector2D {

	static average(points: Vector2D[]) {
		let x = 0
		let y = 0

		for (const p of points) {
			x += p.x
			y += p.y
		}

		return new Vector2D(
			x / points.length,
			y / points.length
		)
	}

	static from(vec:Vector2D){
		return new Vector2D(vec.x, vec.y)
	}

	// ======================= Properties =======================

	x: number
	y: number
	constructor(x:number = 0, y:number = 0){
		this.x = x
		this.y = y
	}

	get length(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	add(value: Vector2D) {
		this.x += value.x,
		this.y += value.y
		return this
		
	}

	subtract(value: Vector2D) {
		this.x -= value.x,
		this.y -= value.y
		return this
		
	}

	multiply(value: number|Vector2D) {
		if (value instanceof Vector2D) {
			this.x *= value.x
			this.y *= value.y
			return this
		}
		this.x *= value
		this.y *= value
		return this
	}

	divide(value: number|Vector2D) {
		if (value instanceof Vector2D) {
			this.x /= value.x
			this.y /= value.y
			return this
		}
		this.x /= value
		this.y /= value
		return this
	}

	normalized() {
		const len = this.length;
		return len === 0 ? new Vector2D() : Vector2D.from(this).multiply(1 / len);
	}

	normalize() {
		const len = this.length;
		len === 0 ? this.multiply(0) : this.multiply(1 / len);
		return this
	}

	distanceTo(vec:Vector2D){
		return Math.sqrt((vec.x - this.x)**2 + (vec.y - this.y)**2)
	}

	cross(vec:Vector2D){
		return this.x * vec.y - this.y * vec.x
	}

	orient(a:Vector2D, b:Vector2D) {
		return Vector2D.from(a).subtract(this).cross(Vector2D.from(b).subtract(this))
	}
};