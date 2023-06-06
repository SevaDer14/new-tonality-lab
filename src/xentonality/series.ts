import { errors } from "./errorMessages"

export type SeriesValue = number[]

export class Series {
    private _value: SeriesValue

    constructor(numArray?: SeriesValue) {
        this._value = numArray !== undefined ? [...numArray] : []
    }

    public get value() {
        return this._value
    }

    public set value(val: SeriesValue) {
        this._value = val;
    }

    /**
    * Pushes number to the end of series value
    */
    push(val: number) {
        this._value.push(val)

        return this
    }

    /**
    * Fills series value with numbers generated from index up to a given length. Length must be greater or equal to zero. 
    * Callback function has access to current index and should return a value that will be placed in series at that index.
    */
    fill(length: number, generator: (index: number) => number) {
        if (length < 0) throw new Error(errors.series.lengthIsLessThanZero)

        for (let i = 0; i < length; i++) {
            this._value[i] = generator(i);
        }

        return this
    }

    /**
    * Transforms series value by applying transformation function to every number in series.
    * Transformation function has access to current number and its index and should return a number that will replace the one at current index.
    */
    transform(transformation: (n: number, i: number) => number) {
        for (let i = 0; i < this._value.length; i++) {
            this._value[i] = transformation(this._value[i], i);
        }

        return this
    }

    // UNTESTED
    max() {
        return this._value.reduce((a, b) => Math.max(a, b), -Infinity)
    }
}
