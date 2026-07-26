
export function forever(func:(dt:number)=>void, timeout:number) {
	let then = Date.now()
	function tick() {
		const now = Date.now()
		func((now - then)/1000)
		then = now
		setTimeout(tick, timeout)
	}
	tick()
}
