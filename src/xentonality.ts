import { checkNumericParam, checkSpectrum } from "./utils"

export type TSpectrum = Map<number, number>

export interface ISpectrumCreate {
    type: 'harmonic'
    amplitudeProfile?: 'equal' | 'sawtooth'
    numberOfPartials?: number
}

export const initEmptySpectrum = (): TSpectrum => new Map([]) as TSpectrum

export const Spectrum = {
    create: ({ type, amplitudeProfile = 'sawtooth', ...params }: ISpectrumCreate): TSpectrum => {
        const spectrum = initEmptySpectrum()

        const numberOfPartials = checkNumericParam({ param: params.numberOfPartials, fallbackValue: 1000, lowerBound: 0, higherBound: 1000, integer: true })

        if (numberOfPartials === undefined) {
            return spectrum
        }

        const getAmplitude = (amplitudeProfile: string, partialIndex: number) => {
            if (amplitudeProfile === "equal") {
                return 1
            }

            return 1 / partialIndex // --> defaults to harmonic profile
        }

        if (type === 'harmonic') {
            for (let i = 1; i <= numberOfPartials; i++) {
                const freqRatio = i
                const amplitude = getAmplitude(amplitudeProfile, i)
                spectrum.set(freqRatio, amplitude)
            }
        }

        return spectrum
    },

    toLoudness: (params: { spectrum: TSpectrum }): TSpectrum => {

        const spectrum = checkSpectrum({ spectrum: params.spectrum, ampCondition: (amp: number) => amp > 1 || amp < 0 })

        if (spectrum === undefined) {
            return initEmptySpectrum()
        }

        const setharesLoudness = (amplitude: number): number => 0.25 * 2 ** Math.log10(2E8 * amplitude)

        spectrum.forEach((amplitude, freqRatio) => {
            spectrum.set(freqRatio, setharesLoudness(amplitude))
        })

        return spectrum
    },

    toHz: (params: { spectrum: TSpectrum, fundamental: number }): TSpectrum => {
        const newSpectrum = initEmptySpectrum()
        const fundamental = checkNumericParam({ param: params.fundamental, lowerBound: 20, higherBound: 20000 })

        if (fundamental === undefined) {
            return newSpectrum
        }

        const spectrum = checkSpectrum({ spectrum: params.spectrum, freqCondition: (freq: number) => freq < 0 })

        if (spectrum === undefined) {
            return newSpectrum
        }


        spectrum.forEach((amplitude, freqRatio) => {
            const frequency = freqRatio * fundamental
            if (frequency < 20000) {
                newSpectrum.set(frequency, amplitude)
            }
        })

        return newSpectrum
    },

    sum: (...spectrums: TSpectrum[]): TSpectrum => {
        const sum = initEmptySpectrum()

        const allPartials = spectrums.flatMap(spectrum => [...spectrum.entries()]).sort((a, b) => a[0] - b[0])

        allPartials.forEach(([freq, amp]) => sum.set(freq, amp))

        const result = checkSpectrum({ spectrum: sum, freqCondition: (freq: number) => freq < 0, ampCondition: (amp: number) => amp < 0 })

        if (result === undefined) {
            return initEmptySpectrum()
        } else {
            return result
        }
    }
}
