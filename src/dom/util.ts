export function get<T extends HTMLElement = HTMLElement>(id:string) {
	const el = document.getElementById(id)
	if (!el) {
		throw new Error(`Cannot get element from id: ${id}`);
	}
	return el as T
}




export function getAll<T extends HTMLElement = HTMLElement>(className:string) {
	return Array.from(document.querySelectorAll<T>("."+className))
}




export function create<K extends keyof HTMLElementTagNameMap>(
	element: K,
	ns?: string
): HTMLElementTagNameMap[K] {
	if (ns) return document.createElementNS(ns, element) as HTMLElementTagNameMap[K]
	return document.createElement(element)
}




export function removeAllChildren(element:HTMLElement) {
	while (element.hasChildNodes()) {
		element.firstChild?.remove()
	}
}