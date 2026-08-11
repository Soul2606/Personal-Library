import { Vector2D } from "./vector2d.js";

export class Area2d {

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
		return p.x < this.x || p.x > this.x + this.width
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
	 * Returns every point as an array.
	 */
	public values():Vector2D[] {
		return Array.from(this.area.values().map(i => this.point(i)))
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
}
