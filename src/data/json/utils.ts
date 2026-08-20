import type { JSONValue } from "../../types"

type WalkJsonArgs = { 
	key: string|number|null
	value: JSONValue 
	parent: null|Record<string,JSONValue>|JSONValue[]
	path: readonly (string | number)[] 
	isLeaf: false
	mutateValue: (newValue: JSONValue)=>void
	mutateKey: (newKey: string|number)=>void
} | { 
	key: string|number|null
	value: string|number|null|boolean
	parent: null|Record<string,JSONValue>|JSONValue[]
	path: readonly (string | number)[] 
	isLeaf: true
	mutateValue: (newValue: JSONValue)=>void
	mutateKey: (newKey: string|number)=>void
}

export function walkJson(obj: JSONValue, fnc: (args:WalkJsonArgs)=>void): void {
	type Parental = null|
	{readonly kind:"object", readonly key: string, readonly value: Record<string, JSONValue>}|
	{readonly kind:"array", readonly key: number, readonly value: JSONValue[]}

	const recurse = (
		current:JSONValue, 
		parent: Parental = null, 
		path:   Array<string | number> = []
	) => {
		const mutateValue = (newValue: JSONValue)=>{
			if (parent === null) return false
			if (parent.kind === "object"){
				parent.value[parent.key] = newValue
			} else {
				parent.value[parent.key] = newValue
			}
			return true
		}

		const mutateKey = (newKey: string|number)=>{
			if (parent === null) return false
			if (parent.kind === "object") {
				if (typeof newKey === "number") return false
				delete parent.value[parent.key]
			}
			if (parent.kind === "array") {
				if (typeof newKey === "string") return false
				parent.value.splice(parent.key, 1)
			}
			//@ts-ignore
			parent.value[newKey] = current
			return true
		}

		const isLeaf = current === null || typeof current === "number" || typeof current === "boolean" || typeof current === "string"
		fnc({
			key: parent ? parent.key : null,
			value: current as any,
			parent: parent ? parent.value : null,
			path,
			isLeaf,
			mutateValue,
			mutateKey
		})

		// Recurse into children if object/array
		if (Array.isArray(current)) {
			current.forEach((val, idx) => recurse(val, {value:current, key:idx, kind:"array"}, [...path, idx]))
		} else if (typeof current === 'object') {
			for (const key in current) {
				const next = current[key]
				if (next === undefined) continue
				recurse(next, {value:current, key, kind:"object"}, [...path, key])
			}
		}
	}

	return recurse(obj, null, [])
}




export function JSONEquals(obj1:JSONValue, obj2:JSONValue): boolean {
	function tupleToString(arr: readonly (string | number)[]): string {
		return arr
		.map(v => typeof v === "string" ? `'${v}'` : String(v))
		.join(",");
	}

	function setEquals(a: Set<string>, b: Set<string>): boolean {
		if (a.size !== b.size) return false;
		for (const v of a) {
			if (!b.has(v)) return false;
		}
		return true;
	}


	const pathMap = new Map<string, unknown>()
	const paths = new Set<string>()

	walkJson(obj1, ({value, path})=>{
		pathMap.set(tupleToString(path), value)
	})

	let mismatch = false
	walkJson(obj2, ({value, path})=>{
		paths.add(tupleToString(path))
		const value2 = pathMap.get(tupleToString(path))
		if (!pathMap.has(tupleToString(path))) mismatch = true
		if (value2 !== value && typeof value !== 'object' && typeof value2 !== 'object') mismatch = true
	})
	if (mismatch) return false

	return setEquals(new Set(pathMap.keys()), paths)
}



/**
 * Traverses down a json structure using a string path.
 * The path uses a simple notation with each key being separated by a dot:
 * example "$.users.0.privileges.admin".
 * Works with arrays, use numbers to travel by index.
 */
export function getJSONFromPath(obj:JSONValue, path:string) {
	const keys = path.split(".")
	if (keys.at(0) === "$") keys.shift()
	let current:JSONValue = obj
	const legend:JSONValue[] = [current]

	for (const key of keys) {
		if (typeof current !== "object" || current === null) throw new Error("current is not an object");
		const item = Array.isArray(current) ? current.at(Number(key)) : current[key]
		if (item === undefined) throw new Error("item does not exist");
		legend.push(item)
		current = item
	}

	return {
		val:current,
		legend
	}
}
