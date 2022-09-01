export interface ICheckNumericParam {
    param?: number
    lowerBound?: number
    higherBound?: number
    fallbackValue: number
    paramName: string
}
export const checkNumericParam = ({ param, lowerBound, higherBound, fallbackValue, paramName }: ICheckNumericParam): number => {
    if (param === undefined) {
        return fallbackValue
    }
    if (lowerBound !== undefined && param < lowerBound) {
        console.warn(`LowerBoundViolation: In checkNumericParam, param "${paramName}" value is ${param} while min possible value is ${lowerBound}. ${lowerBound} is used as fallback value.`)
        return lowerBound
    }
    if (higherBound !== undefined && param > higherBound) {
        console.warn(`HigherBoundViolation: In checkNumericParam, param "${paramName}" value is ${param} while max possible value is ${higherBound}. ${higherBound} is used as fallback value.`)
        return higherBound
    }

    return param
}