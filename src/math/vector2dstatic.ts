
export type Vector2D = {
	x:number
	y:number
}

export const Vector2D = {
	from,
	fnc
}

/**
 * Returns the methods on a clone of this vector
 */
function from(vec:Vector2D) {
	return fnc(structuredClone(vec))
}

/**
 * Returns the methods on this vector
 */
function fnc(data:Vector2D) {

	function add(vec2:Vector2D) {
		data.x += vec2.x
		data.y += vec2.y
		return methods
	}

	function sub(vec2:Vector2D) {
		data.x -= vec2.x
		data.y -= vec2.y
		return methods
	}

	function mul(vec2:Vector2D) {
		data.x *= vec2.x
		data.y *= vec2.y
		return methods
	}

	function scale(value:number){
		data.x *= value
		data.y *= value
		return methods
	}

	function length(): number {
		return Math.sqrt(data.x * data.x + data.y * data.y);
	}

	function normalized() {
		const len = length();
		return len === 0 ? Vector2D.from({x:0, y:0}) : Vector2D.from(data).scale(1 / len);
	}

	function normalize() {
		const len = length();
		len === 0 ? Vector2D.fnc(data).scale(0) : Vector2D.fnc(data).scale(1 / len);
		return methods
	}

	function distanceTo(vec:Vector2D){
		return Math.sqrt((vec.x - data.x)**2 + (vec.y - data.y)**2)
	}

	/**
	 * The result is:
	 * - Positive if v is clockwise from u.
	 * - Negative if v is counterclockwise from u.
	 * - Zero if they are parallel.
	 * 
	 * Example:
	 * 
	 * u = (1,0) right
	 * v = (0,1) down
	 * 
	 * Positive ⇒ turning clockwise from u to v.
	 * 
	 * u = (1,0) right
	 * v = (0,-1) up
	 * 
	 * Negative ⇒ turning counterclockwise.
	 */
	function cross(vec:Vector2D){
		return data.x * vec.y - data.y * vec.x
	}

	/**
	 * p.orient(a, b)
	 *
	 * Returns the orientation of point p relative to
	 * the directed line a → b.
	 *
	 * > If I stand at a and look toward b,
	 * > is p to the left or right?
	 *
	 * Positive  => p is on one side.
	 * 
	 * Negative  => p is on the other side.
	 * 
	 * Zero      => p lies on the line.
	 */
	function orient(a:Vector2D, b:Vector2D) {
		return Vector2D.from(a).sub(b).cross(Vector2D.from(data).sub(b).data)
	}

	/**
	 * Positive angles rotate clockwise.
	 */
	function rotate(deg:number) {
		const rad = deg / 180 * Math.PI
		const cos = Math.cos(rad)
		const sin = Math.sin(rad)
		
		const nx = data.x * cos - data.y * sin
		data.y = data.x * sin + data.y * cos
		data.x = nx
		
		return methods
	}

	/**
	 * Returns a rotated copy of data vector.
	 *
	 * Positive angles rotate clockwise.
	 */
	function rotated(deg:number) {
		return Vector2D.from(data).rotate(deg)
	}

	const methods = {
		data,
		length,
		add,
		sub,
		mul,
		scale,
		normalized,
		normalize,
		distanceTo,
		cross,
		orient,
		rotate,
		rotated,
	} as const

	return methods
}
