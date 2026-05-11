export class Fraction {
	static from(value:number|Fraction){
		if (typeof value === 'number') {
			return new Fraction(value, 1)
		} else if (value instanceof Fraction) {
			return new Fraction(value.num, value.den)
		}
		return new Fraction()
	}

	static sum(fractions:Fraction[]){
		if (fractions.length === 0) {
			return new Fraction()
		}
		const s = new Fraction()
		for (const f of fractions) {
			s.add(f)
		}
		return s
	}

	#LIMIT
	num:number
	den:number

	constructor(num=0, den=1) {
		this.num = num
		this.den = den
		this.#LIMIT = 1e12
	}

	gcd(){
		let a = this.num
		let b = this.den
		a = Math.abs(a);
		b = Math.abs(b);
		while (b !== 0) {
			const t = b;
			b = a % b;
			a = t;
		} 
		return a;
	}

	reduce() {
		if (!Number.isFinite(this.num) && !Number.isFinite(this.den)) {
			this.num = 0;
			this.den = 1;
			return this;
		}

		if (!Number.isFinite(this.num)) {
			this.num = Infinity;
			this.den = 1;
			return this;
		}

		if (!Number.isFinite(this.den)) {
			this.num = 0;
			this.den = 1;
			return this;
		}

		const g = this.gcd();
		this.num /= g;
		this.den /= g;

		if (this.den < 0) {
			this.den = -this.den;
			this.num = -this.num;
		}

		if (this.num > this.#LIMIT && this.den > this.#LIMIT) {
			const f = Math.max(this.num / 10000, this.den / 10000)
			this.num = Math.ceil(this.num / f)
			this.den = Math.ceil(this.den / f)
			return this
		}

		return this;
	}


	add(value:Fraction|number) {
		if (value instanceof Fraction) {
			this.num = this.num * value.den + this.den * value.num;
			this.den = this.den * value.den;
		} else if (typeof value === 'number') {
			this.num = this.num + this.den * value;
		}
		return this;
	}

	subtract(value:Fraction|number){
		if (value instanceof Fraction) {
			this.num -= this.den * value.num
			this.den *= value.den
		} else if (typeof value === 'number') {
			this.num -= this.den * value
		}
		return this
	}

	multiply(value:Fraction|number){
		if (value instanceof Fraction) {
			this.num *= value.num
			this.den *= value.den
		} else if (typeof value === 'number') {
			this.num *= value
		}
		return this
	}

	divide(value:Fraction|number){
		if (value instanceof Fraction) {
			this.num *= value.den
			this.den *= value.num
		} else if (typeof value === 'number') {
			this.den *= value
		}
		return this
	}

	greaterThan(value:Fraction|number){
		const other = Fraction.from(value)
		const thisS  = this.num * other.den
		const otherS = other.num * this.den
		return thisS > otherS
	}

	lessThan(value:Fraction|number){
		const other = Fraction.from(value)
		const thisS  = this.num * other.den
		const otherS = other.num * this.den
		return thisS < otherS
	}

	toStr(){
		return `${this.num}/${this.den}`
	}
}
