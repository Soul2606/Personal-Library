export type Vector2D = {
	x:number
	y:number
}

export const Vector2D = {
	from,
	n,
	add,
	sub,
	mul,
	scale,
	length,
	normalized,
	distanceTo,
	cross,
	orient,
	rotated,
}

/**
 * Creates a new vector. Both components default to 0.
 */
function n(x = 0, y = 0):Vector2D {
	return {x, y}
}

/**
 * Returns a copy of `vec`. Only `x` and `y` are copied,
 * so passing a bigger object (like an entity) is safe.
 */
function from(vec:Vector2D):Vector2D {
	return n(vec.x, vec.y)
}

/**
 * Returns a new vector: `vecA + vecB`.
 */
function add(vecA:Vector2D, vecB:Vector2D) {
	return n(vecA.x + vecB.x, vecA.y + vecB.y)
}

/**
 * Returns a new vector: `vecA - vecB`.
 *
 * Tip: `sub(target, start)` is the direction from `start` to `target`.
 *
 * @example
 * Vector2D.sub({ x: 5, y: 5 }, { x: 1, y: 2 }) // { x: 4, y: 3 }
 */
function sub(vecA:Vector2D, vecB:Vector2D) {
	return n(vecA.x - vecB.x, vecA.y - vecB.y)
}

/**
 * Returns a new vector with each component multiplied separately:
 * `(vecA.x * vecB.x, vecA.y * vecB.y)`.
 */
function mul(vecA:Vector2D, vecB:Vector2D) {
	return n(vecA.x * vecB.x, vecA.y * vecB.y)
}

/**
 * Returns a new vector with both components multiplied by `value`.
 */
function scale(vec:Vector2D, value:number){
	return n(vec.x * value, vec.y * value)
}

/**
 * Length (magnitude) of the vector.
 */
function length(vec:Vector2D): number {
	return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
}

/**
 * Returns a new vector pointing the same way with length 1.
 * A zero vector returns `{ x: 0, y: 0 }`.
 */
function normalized(vec:Vector2D) {
	const len = length(vec);
	return len === 0 ? n() : scale(vec, 1 / len);
}

/**
 * Distance between two points.
 *
 * @example
 * Vector2D.distanceTo({ x: 0, y: 0 }, { x: 3, y: 4 }) // 5
 */
function distanceTo(vecA:Vector2D, vecB:Vector2D){
	return Math.sqrt((vecB.x - vecA.x)**2 + (vecB.y - vecA.y)**2)
}

/**
 * Which way do you turn to go from direction `vecA` to direction `vecB`?
 *
 * Imagine facing along `vecA`, then turning to face `vecB`.
 * Uses screen coordinates (+y is down).
 *
 * - **Positive** → you turned clockwise
 * - **Negative** → you turned counterclockwise
 * - **Zero** → no turn (same direction or exactly opposite)
 *
 * Usually only the sign matters. The size grows with the vectors'
 * lengths and with how sharp the turn is (largest at 90°).
 *
 * ```
 *  up (0,-1)
 *      ▲
 *      │
 *      └──► right (1,0)
 *      │
 *      ▼
 *  down (0,1)
 * ```
 *
 * @example
 * const right = { x: 1, y: 0 }
 * Vector2D.cross(right, { x: 0, y: 1 })  //  1  right → down: clockwise
 * Vector2D.cross(right, { x: 0, y: -1 }) // -1  right → up: counterclockwise
 * Vector2D.cross(right, { x: 5, y: 0 })  //  0  same direction
 * Vector2D.cross(right, { x: -1, y: 0 }) //  0  opposite direction
 */
function cross(vecA:Vector2D, vecB: Vector2D) {
	return vecA.x * vecB.y - vecA.y * vecB.x
}

/**
 * Is `point` to the left or right of the line from `a` to `b`?
 *
 * Imagine standing at `a` and walking toward `b`.
 * Uses screen coordinates (+y is down).
 *
 * - **Positive** → `point` is on your right
 * - **Negative** → `point` is on your left
 * - **Zero** → `point` is exactly on the line
 *   (the line continues past `a` and `b`)
 *
 * Same sign meaning as `cross`: "right" means you would turn
 * clockwise from your walking direction to face the point.
 *
 * ```
 *            • (5,-5)  left  → -50
 *
 *   a (0,0) ──────────► b (10,0)       • (20,0)  on line → 0
 *
 *            • (5,5)   right → 50
 * ```
 *
 * @example
 * const a = { x: 0, y: 0 }
 * const b = { x: 10, y: 0 }
 * Vector2D.orient({ x: 5, y: 5 }, a, b)  //  50  right (below on screen)
 * Vector2D.orient({ x: 5, y: -5 }, a, b) // -50  left (above on screen)
 * Vector2D.orient({ x: 20, y: 0 }, a, b) //   0  on the line
 */
function orient(point:Vector2D, a: Vector2D, b: Vector2D) {
	const walkX = b.x - a.x
	const walkY = b.y - a.y
	const toPointX = point.x - a.x
	const toPointY = point.y - a.y
	return walkX * toPointY - walkY * toPointX
}

/**
 * Returns a new vector rotated by `deg` degrees.
 * Positive angles rotate clockwise on screen (+y is down).
 *
 * Results can have tiny rounding errors, like `6e-17` instead of `0`.
 *
 * @example
 * Vector2D.rotated({ x: 1, y: 0 }, 90)  // ≈ { x: 0, y: 1 }   right → down
 * Vector2D.rotated({ x: 1, y: 0 }, -90) // ≈ { x: 0, y: -1 }  right → up
 * Vector2D.rotated({ x: 1, y: 0 }, 180) // ≈ { x: -1, y: 0 }  right → left
 */
function rotated(vec:Vector2D, deg:number) {
	const rad = deg / 180 * Math.PI
	const cos = Math.cos(rad)
	const sin = Math.sin(rad)
	
	const nx = vec.x * cos - vec.y * sin
	const ny = vec.x * sin + vec.y * cos
	
	return n(nx, ny)
}