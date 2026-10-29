import { Vector2D } from "./vector2d.js";

export type Line = {
	a:Vector2D
	b:Vector2D
}

export const Line = {
	n,
	from,
	length,
	midpoint,
	toVec,
	traceOnPoint,
	orient,
}

function n(a:Vector2D, b:Vector2D):Line {
	return {
		a:Vector2D.from(a), 
		b:Vector2D.from(b),
	}
}

function from(l:Line) {
	return {
		a:Vector2D.from(l.a), 
		b:Vector2D.from(l.b),
	}
}

function length(l:Line):number
function length(l:Line, v:number):Line

function length(l:Line, v?:number) {
	if (v===undefined) {
		return Vector2D.distanceTo(l.a, l.b)
	}
	const center = midpoint(l)
	const dir = toVec(l)

	const half = v / 2

	return {
		a: Vector2D.sub(center, Vector2D.scale(dir, half)),
		b: Vector2D.add(center, Vector2D.scale(dir, half)),
	} satisfies Line
}

function midpoint(l:Line) {
	return Vector2D.scale(Vector2D.add(l.a, l.b), 0.5)
}

function toVec(l:Line) {
	return Vector2D.normalized(Vector2D.sub(l.b, l.a))
}

function traceOnPoint(l:Line, p:Vector2D) {
	const epsilon = 0.0001
	return Math.abs(orient(l, p)) < epsilon
}

/**Read orient on Vector2d to lear more. */
function orient(l:Line, p:Vector2D) {
	return Vector2D.orient(p, l.a, l.b)
}
