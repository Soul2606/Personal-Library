import { Vector2D } from "./vector2d.js";

export class Area2d {

	static clone(a:Area2d) {
		const n = new Area2d()
		n.area = new Set(a.area.values())
		n.x = a.x
		n.width = a.width
		return n
	}

	private static widthCalc(pixels:Vector2D[]) {
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

	constructor(pixels:Vector2D[] = []) {
		const {lowest, highest} = Area2d.widthCalc(pixels)
		const width = highest - lowest + 1
		
		this.width = width
		this.x = lowest
		
		this.area = new Set(pixels.map(p => this.index(p)))
	}

	private index(p:Vector2D) {
		return p.y * this.width + p.x - this.x
	}

	private point(key:number):Vector2D {
		return new Vector2D(Math.floor(key / this.width), key % this.width + this.x)
	}

	public inBounds(p:Vector2D) {
		return p.x >= this.x && p.x < this.x + this.width
	}

	/**
	 * Adds the point to the area. Mutates this area. Will throw if out of bounds.
	 */
	public append(p:Vector2D) {
		if (!this.inBounds(p)) throw new Error("Out of bounds");
		this.area.add(this.index(p))
		return this
	}

	/**
	 * Returns every point as an array from topleft to right.
	 */
	public values():Vector2D[] {
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
	public add(p:Vector2D) {
		if (this.inBounds(p)) {
			this.append(p)
			return this
		}
		const pixels = this.values()
		pixels.push(p)
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
	public delete(p:Vector2D) {
		if (!this.inBounds(p)) return false
		return this.area.delete(this.index(p))
	}

	public has(p:Vector2D) {
		return this.area.has(this.index(p))
	}

	/**
	 * Synchronizes the two areas x offset and width without hanging the areas.
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
		a0.values().forEach(p => na0.append(p))

		const na1 = new Area2d()
		na1.x = x
		na1.width = width
		a1.values().forEach(p => na1.append(p))

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
			const p = this.point(i)
			const row = arr[p.y] ??= []
			row[p.x] = v
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
		const right = x + w
		const bottom = y + h
		for (const i of this.area) {
			const p = this.point(i)
			if (
				p.x < x ||
				p.y < y ||
				p.x >= right ||
				p.y >= bottom
			) this.area.delete(i)
		}
		return this
	}
}




