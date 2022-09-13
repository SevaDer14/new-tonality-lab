import type { TPlotCurve } from "../../src/xentonality/types";


export const curvesEqual = (curve1: TPlotCurve, curve2: TPlotCurve): boolean => {
    if (curve1.length !== curve2.length) return false

    for (let i = 0; i < curve1.length; i++) {
        const valuesEqual = Math.abs(curve1[i].value - curve2[i].value) < 1E-12
        const centsEqual = (curve1[i].cents - curve2[i].cents) < 1E-12
        const HzEqual = (curve1[i].Hz - curve2[i].Hz) < 1E-12
        const ratiosEqual = (curve1[i].ratio - curve2[i].ratio) < 1E-12

        if ((valuesEqual && centsEqual && HzEqual && ratiosEqual) === false) return false
    }

    return true
}