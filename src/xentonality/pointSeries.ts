import { errors } from "./errorMessages";
import { Series, type SeriesValue } from "./series";

export type Point = [number, number]
export type PointSeriesValue = Point[]

export class PointSeries {
    private _value: PointSeriesValue

    constructor(pointSeries?: PointSeriesValue) {
        this._value = pointSeries !== undefined ? structuredClone(pointSeries) : []
    }

    public get value() {
        return this._value;
    }

    public set value(val: PointSeriesValue) {
        this._value = val;
    }

    /**
    * Pushes the point to the end of the series
    */
    push(val: Point) {
        this._value.push(val)

        return this
    }

    /**
    * Includes series and sorts the result. 
    * Mode "partials" will replace point with the same X by choosing the largest value of Y
    * When mode is undefined keeps original point
    */
    include(points: PointSeriesValue, options?: { mode?: "partials" }) {
        for (let i = 0; i < points.length; i++) {
            const indexWithSameX = this.indexOfPointX(points[i])

            if (indexWithSameX === -1) {
                this.push(points[i])
                continue
            }

            if (!options) continue

            if (options.mode === "partials") {
                this._value[indexWithSameX][1] = Math.max(this._value[indexWithSameX][1], points[i][1])
            }
        }

        this.sort()

        return this
    }

    /**
    * Returns index of point with the same X coordinate
    */
    indexOfPointX(point: Point) {
        for (let i = 0; i < this._value.length; i++) {
            if (this._value[i][0] === point[0]) return i
        }

        return -1
    }

    /**
    * Sorts series by x-axis in the ascending order
    */
    sort() {
        this._value.sort((a, b) => a[0] - b[0])

        return this
    }

    /**
    * Fills the series with points generated in callback up to the provided length
    */
    fill(length: number, generator: (i: number) => Point) {
        if (length < 0) throw new Error("Series length must be greater or equal to zero!")
        
        this._value = []

        for (let i = 0; i < length; i++) {
            this._value[i] = generator(i);
        }

        return this
    }

    /**
    * Transforms series value by applying transformation function to every point in series.
    * Transformation function has access to current point and its index and should return a point that will replace the one at current index.
    */
    transform(transformation: (p: Point, i: number) => Point) {
        for (let i = 0; i < this._value.length; i++) {
            this._value[i] = transformation(this._value[i], i);
        }

        return this
    }

    /**
    * Sets a value of point series to be result of merge of two number series
    * -----------------
    * Example: 
    * for seriesX = [1, 2, 3], seriesY = [10, 20, 30]
    * result = [[1, 10], [2, 20], [3, 30]]
    */
    merge(seriesX: SeriesValue, seriesY: SeriesValue): PointSeries {
        const length = seriesX.length === seriesY.length ? seriesX.length : -1

        if (length === -1) throw new Error(errors.series.lengthsAreNotEqual);

        for (let i = 0; i < length; i++) {
            this.push([seriesX[i], seriesY[i]])
        }

        return this
    }

    /**
    * Returns two number series that represent values for X and Y axis of point series
    * -----------------
    * Example: 
    * for pointSeries = [[1, 10], [2, 20], [3, 30]]
    * result = [[1, 2, 3], [10, 20, 30]]
    */
    split(): [Series, Series] {
        let seriesX = new Series
        let seriesY = new Series

        for (let i = 0; i < this._value.length; i++) {
            seriesX.push(this._value[i][0])
            seriesY.push(this._value[i][1])
        }

        return [seriesX, seriesY]
    }

    getX(): Series {
        return this.split()[0]
    }

    getY(): Series {
        return this.split()[1]
    }

    // FINILIZE AND TEST
    // normalize() {
    //     const result = [] as TPlotCurve
    
    //     const mainExtremum = curve.reduce((a, b) => { return Math.abs(a.value) > Math.abs(b.value) ? a : b });
    
    //     for (let i = 0; i < curve.length; i++) {
    //         result.push({ ...curve[i], value: round(curve[i].value / Math.abs(mainExtremum.value), 15) })
    //     }
    
    //     return result
    // }
}