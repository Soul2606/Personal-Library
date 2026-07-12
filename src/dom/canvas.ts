
type View = {
	left: number;
	right: number;
	top: number;
	bottom: number;
	center: {
		x: number;
		y: number;
	};
}

/**
 * @param canvas The canvas that is tracked.
 * @param cameraPos Camera position is shared reference for easy mutability.
 * @param scale 1 by default. Smaller number is zoom out, bigger is in, zero and negative gives buggy results.
 */
class Canvas {
	map:HTMLCanvasElement
	scale:number
	cameraPos:{x:number, y:number}
	constructor(canvas:HTMLCanvasElement, cameraPos:{x:number, y:number}, scale = 1) {
		this.map = canvas
		this.cameraPos = cameraPos
		this.scale = scale
	}

	screenCenter() {
		return{
			x: this.map.width / 2,
			y: this.map.height / 2,
		}
	}

	worldToScreen(x = 0, y = 0) {
		const c = this.screenCenter()
		return {
			x: (x - this.cameraPos.x) * this.scale + c.x,
			y: (y - this.cameraPos.y) * this.scale + c.y,
		}
	}

	screenToWorld(x = 0, y = 0) {
		const c = this.screenCenter()
		return {
			x: (x - c.x) / this.scale + this.cameraPos.x,
			y: (y - c.y) / this.scale + this.cameraPos.y,
		}
	}

	view():View {
		const center = this.screenCenter()
		return {
			left:  this.cameraPos.x - center.x / this.scale,
			right: this.cameraPos.x + center.x / this.scale,
			top:   this.cameraPos.y - center.y / this.scale,
			bottom:this.cameraPos.y + center.y / this.scale,
			center:{...this.cameraPos},
		}
	}
}
