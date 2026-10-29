
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

function n(x = 0, y = 0):Vector2D {
	return {x, y}
}

function from(vec:Vector2D) {
	return {x:vec.x, y:vec.y}
}

function add(vecA:Vector2D, vecB:Vector2D) {
	return n(vecA.x + vecB.x, vecA.y + vecB.y)
}

function sub(vecA:Vector2D, vecB:Vector2D) {
	return n(vecA.x - vecB.x, vecA.y - vecB.y)
}

function mul(vecA:Vector2D, vecB:Vector2D) {
	return n(vecA.x * vecB.x, vecA.y * vecB.y)
}

function scale(vec:Vector2D, value:number){
	return n(vec.x * value, vec.y * value)
}

function length(vec:Vector2D): number {
	return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
}

function normalized(vec:Vector2D) {
	const len = length(vec);
	return len === 0 ? {x:0, y:0} : scale(vec, 1 / len);
}

function distanceTo(vecA:Vector2D, vecB:Vector2D){
	return Math.sqrt((vecB.x - vecA.x)**2 + (vecB.y - vecA.y)**2)
}

/**
 * Which way do you turn to go from this direction to `vec`?
 *
 * Imagine facing along this vector, then turning to face `vec`.
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
 * Vector2D.fnc(right).cross({ x: 0, y: 1 })  //  1  right → down: clockwise
 * Vector2D.fnc(right).cross({ x: 0, y: -1 }) // -1  right → up: counterclockwise
 * Vector2D.fnc(right).cross({ x: 5, y: 0 })  //  0  same direction
 * Vector2D.fnc(right).cross({ x: -1, y: 0 }) //  0  opposite direction
 */
function cross(vecA:Vector2D, vecB: Vector2D) {
	return vecA.x * vecB.y - vecA.y * vecB.x
}

/**
 * Is this point to the left or right of the line from `a` to `b`?
 *
 * Imagine standing at `a` and walking toward `b`.
 * Uses screen coordinates (+y is down).
 *
 * - **Positive** → the point is on your right
 * - **Negative** → the point is on your left
 * - **Zero** → the point is exactly on the line
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
 * Vector2D.fnc({ x: 5, y: 5 }).orient(a, b)  //  50  right (below on screen)
 * Vector2D.fnc({ x: 5, y: -5 }).orient(a, b) // -50  left (above on screen)
 * Vector2D.fnc({ x: 20, y: 0 }).orient(a, b) //   0  on the line
 */
function orient(vec:Vector2D, a: Vector2D, b: Vector2D) {
	const walkX = b.x - a.x
	const walkY = b.y - a.y
	const toPointX = vec.x - a.x
	const toPointY = vec.y - a.y
	return walkX * toPointY - walkY * toPointX
}

/**
 * Positive angles rotate clockwise.
 */
function rotated(vec:Vector2D, deg:number) {
	const rad = deg / 180 * Math.PI
	const cos = Math.cos(rad)
	const sin = Math.sin(rad)
	
	const nx = vec.x * cos - vec.y * sin
	const ny = vec.x * sin + vec.y * cos
	
	return n(nx, ny)
}
