export type Matrix = number[][]

/**
 * Returns length of matrix row if all rows have the same length
 * Returns -1 if otherwise or if matrix has no rows
 * @param matrix - number[][]
 */
export const validMatrixRowLength = (matrix: Matrix): number => {
    return matrix.length === 0
        ? -1
        : matrix.reduce(
            (seriesLength, currentSeries) => currentSeries.length === seriesLength ? seriesLength : -1,
            matrix[0].length
        )
}


/**
 * Transposes 2D matrix. Matrix rows have to have the same length or matrix cannot equal []!
 * @param matrix - number[][]
 */
export const transposeMatrix = (matrix: Matrix): Matrix => {
    if (matrix.length === 0) return []

    const rowLength = validMatrixRowLength(matrix)
    if (rowLength === -1) throw new Error('Matrix rows have to have the same length or matrix cannot equal []!');

    return matrix[0].map((col, i) => matrix.map(row => row[i]))
}


/**
 * Reduces matrix by performing an expression on numbers at the same index for all rows.
 * Rows have to have the same length or matrix cannot equal []!
 * 
 * Example: you can use that to get a series which elements are products of summation of numbers in two series.
 * _______________________________
 * For two series = [ [ 1, 1, 1 ] , [ 2, 2, 2 ] ]
 * 
 * and reducer = ( acc, n ) => acc + n, 
 * 
 * result will be [ 3, 3, 3 ]
 * @param series - series to be reduced
 * @param reducer - (acc: number, curr: number) => number
 */
export const reduceMatrixToSeries = (matrix: Matrix, reducer: (acc: number, curr: number) => number): SeriesValue => {
    if (matrix.length < 2) return matrix.flat()
    const transposedSeries = transposeMatrix(matrix) as Matrix

    let result = []

    for (let i = 0; i < transposedSeries.length; i += 1) {
        result[i] = transposedSeries[i].reduce(reducer)
    }

    return result
}


/**
 * Merges matrix rows into single series so numbers are in ascending order.
 * @param removeDuplicates - if set to true will remove duplicates in resulting series, default value is false 
 */
export const mergeRows = (matrix: Matrix, options?: { removeDuplicates: boolean }): SeriesValue => {
    const removeDuplicates = options ? options.removeDuplicates : false

    if (matrix.length === 0) return [] as SeriesValue

    const result = matrix.flat().sort((a, b) => a - b)

    return removeDuplicates === true ? result.filter((n, i, arr) => n !== arr[i - 1]) : result
}

/**
 * Adds column to the matrix. Column has to have the same length as other columns in the matrix!
 * @param matrix - matrix (of type number[][]) to add column to
 * @param column - column (of type number[]) to add to the matrix 
*/
export const addColumn = (matrix: Matrix, column: SeriesValue): Matrix => {
    if (column.length === 0) return matrix

    if (column.length !== matrix.length) throw new Error('Column has to have the same length as other columns in the matrix!');

    return matrix.map((col, i) => [...col, column[i]])
}
