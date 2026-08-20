import type { JSONValue } from "../../types.ts"

type Primitives = "str"|"num"|"bool"|"null"

type Config = {
	option?:boolean
} & (
	{
		type:Primitives
	}|{
		type:"record"
		match:Config
	}|{
		type:"obj",
		match:Record<string, Config>
	}|{
		type:"arr"
		match:Config
	}|{
		type:"tuple"
		match:Config[]
	}
)

function isObj(val:JSONValue): val is {[key:string]: JSONValue} {
	return (typeof val === "object" && val !== null && !Array.isArray(val))
}

function isArr(val:JSONValue): val is JSONValue[] {
	return Array.isArray(val)
}

function checkPrimTypes(str:string, val:JSONValue) {
	switch (str) {
		case "str":
			return typeof val === "string"
		case "num":
			return typeof val === "number"
		case "bool":
			return typeof val === "boolean"
		case "null":
			return val === null
		default:
			return true
	}
}

function recurse(json:JSONValue, config:Config, path:string[]):string[] {
	const errors:string[] = []
	const add = (str:string) => errors.push(str + ` | At "${path.join(".")}"`)
	const conf = config

	if (!checkPrimTypes(conf.type,json)) add("Wrong type")

	switch (conf.type) {
		case "obj":
			if (!isObj(json)) {
				add("wrong type")
				break
			} 
			for (const [key, val] of Object.entries(conf.match)) {
				const item = json[key]
				if (item === undefined) {
					if (!val.option) add(`key "${key}" is missing`)
				} else {
					errors.push(...recurse(item, val, [...path, key]))
				}
			}
			break
		case "record":
			if (!isObj(json)) {
				add("wrong type")
				break
			} 
			for (const [key, val] of Object.entries(json)) {
				if (conf.match.option) continue
				errors.push(...recurse(val, conf.match, [...path, key]))
			}
			break
		case "arr":
			if (!isArr(json)) {
				add("wrong type")
				break
			}
			for (const [idx,val] of json.entries()) {
				if (conf.match.option) continue
				errors.push(...recurse(val, conf.match, [...path, idx.toString()]))
			}
			break
		case "tuple":
			if (!isArr(json)) {
				add("wrong type")
				break
			}
			if (conf.match.length < json.length) add("Too many items")
			for (const [idx, val] of conf.match.entries()) {
				const item = json.at(idx)
				if (item === undefined) {
					if (!val.option) add(`item at index "${idx}" is missing`)
				} else {
					errors.push(...recurse(item, val, [...path, idx.toString()]))
				}
			}
			break
	}
	return errors
}



function validate(json:JSONValue, config:Config):string[] {
	return recurse(json, config, ["$"])
}



const con:Config = {
	type:"obj",
	match:{
		foo:{type:"num"},
		faa:{type:"bool"},
		arr:{
			type:"arr",
			match:{type:"num"}
		},
		tuple:{
			type:"tuple",
			match:[
				{type:"num"},
				{type:"str"},
			]
		}
	}
}

console.log(validate({
	arr:["asd", "a", "", null],
	tuple:[
		"hello",
		0,
		true,
	]
}, con))
