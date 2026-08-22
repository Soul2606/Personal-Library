type Point = {x:number, y:number}

export class Area2d {

	static clone(a:Area2d) {
		const n = new Area2d()
		n.area = new Set(a.area.values())
		n.x = a.x
		n.width = a.width
		return n
	}

	private static widthCalc(pixels:Point[]) {
		let lowest = Infinity
		let highest = -Infinity
		for (const p of pixels) {
			if (p.x < lowest) lowest = p.x
			if (p.x > highest) highest = p.x
		}
		return {
			lowest,
			highest
		}
	}

	private area:Set<number>
	private width:number
	private x:number

	constructor(pixels:Point[] = []) {
		const {lowest, highest} = Area2d.widthCalc(pixels)
		const width = highest - lowest + 1
		
		this.width = width
		this.x = lowest
		
		this.area = new Set(pixels.map(p => this.index(p.x, p.y)))
	}

	private index(x:number, y:number) {
		isInt(x, y)
		return y * this.width + x - this.x
	}

	private pointX(idx:number) {
		isInt(idx)
		return idx % this.width + this.x
	}

	private pointY(idx:number) {
		isInt(idx)
		return Math.floor(idx / this.width)
	}

	private point(idx:number):Point {
		return {
			x:this.pointX(idx),
			y:this.pointY(idx),
		}
	}

	public inBounds(x:number, y:number) {
		return x >= this.x && x < this.x + this.width
	}

	/**
	 * Adds the point to the area. Mutates this area. Will throw if out of bounds.
	 */
	public append(x:number, y:number) {
		if (!this.inBounds(x, y)) throw new Error("Out of bounds");
		this.area.add(this.index(x, y))
		return this
	}

	/**
	 * Returns every point as an array from left to right and top to bottom.
	 */
	public values():Point[] {
		return [...this.area]
		.sort((a,b)=>a-b)
		.map(i => this.point(i))
	}

	public get length() : number {
		return this.area.size
	}

	/**
	 * Adds the point to the area. Mutates this area.
	 */
	public add(x:number, y:number) {
		if (this.inBounds(x, y)) {
			this.append(x, y)
			return this
		}
		const pixels = this.values()
		pixels.push({x, y})
		const n = new Area2d(pixels)
		this.area = n.area
		this.width = n.width
		this.x = n.x
		
		return this
	}

	/**
	 * Deletes the point from the area. Mutates this area.
	 * @returns true if success, false if fail or out of bounds.
	 */
	public delete(x:number, y:number) {
		if (!this.inBounds(x, y)) return false
		return this.area.delete(this.index(x, y))
	}

	public has(x:number, y:number) {
		return this.area.has(this.index(x, y))
	}

	/**
	 * Synchronizes the two areas x offset and width without changing the areas.
	 */
	private static sync(a0:Area2d, a1:Area2d) {
		const left = Math.min(a0.x, a1.x)
		const right = Math.max(left + a0.width, left + a1.width)
		const x = left
		const width = right - left

		console.log("x", x, "width", width);
		
		
		const na0 = new Area2d()
		na0.x = x
		na0.width = width
		a0.values().forEach(p => na0.append(p.x, p.y))

		const na1 = new Area2d()
		na1.x = x
		na1.width = width
		a1.values().forEach(p => na1.append(p.x, p.y))

		if (na0.x !== na1.x || na0.width !== na1.width) throw new Error("This algorithm does not work (:");
		
		return {a0, a1} as const
	}

	static union(a0: Area2d, a1: Area2d) {
		const s = Area2d.sync(a0, a1)
		for (const i of s.a1.area) {
			s.a0.area.add(i)
		}
		return s.a0
	}

	static intersection(a0:Area2d, a1:Area2d) {
		const s = Area2d.sync(a0, a1)
		const n = Area2d.clone(s.a0)
		n.area = new Set(
			[...s.a0.area].filter(i => s.a1.area.has(i))
		)
		return n
	}

	static difference(a0:Area2d, a1:Area2d) {
		const s = Area2d.sync(a0, a1)
		const n = Area2d.clone(s.a0)
		n.area = new Set(
			[...s.a0.area].filter(i => !s.a1.area.has(i))
		)
		return n
	}

	public equal(a:Area2d) {
		const s = Area2d.sync(this, a)
		if (s.a0.length !== s.a1.length) return false

		for (const i of s.a0.area) {
			if (!s.a1.area.has(i)) return false
		}

		return true
	}

	public cut(c:Area2d) {
		const s = Area2d.sync(this, c)
		for (const i of s.a1.area) {
			s.a0.area.delete(i)
		}
		return s.a0
	}

	public array2d<T>(v: T): T[][] {
		const arr: T[][] = []
		for (const i of this.area) {
			const row = arr[this.pointY(i)] ??= []
			row[this.pointX(i)] = v
		}
		return arr
	}

	/**
	 * Removes all points outside the bonds of the box.
	 * @param x pos
	 * @param y pos
	 * @param w width
	 * @param h height
	 */
	public clip(x:number, y:number, w:number, h:number) {
		isInt(x, y, w, h)
		const right = x + w
		const bottom = y + h
		for (const i of this.area) {
			const px = this.pointX(i)
			const py = this.pointY(i)
				
			if (
				px < x ||
				py < y ||
				px >= right ||
				py >= bottom
			) this.area.delete(i)
		}
		return this
	}

	/**
	 * Moves every point in the area by delta. Only works with integers.
	 */
	public translate(dx:number, dy:number) {
		isInt(dx, dy)
		this.x += dx
		if (dy === 0) return this
		for (const idx of [...this.area]) {
			this.area.delete(idx)
			this.area.add(idx + this.width * dy)
		}
		return this
	}

	private expandWidth(right:number, left=0) {
		isInt(right, left)
		if (right < 0) return this
		if (left < 0) return this
		
		const area = new Set<number>()
		for (const index of this.area) {
			const y = this.pointY(index)
			area.add(index + y * right + left)
		}

		this.area = area
		this.width += right + left

		return this
	}
}




function isInt(...n:number[]) {
	for (const _n of n) {
		if (!Number.isInteger(_n)) throw new Error("number is not an integer");
	}
}

