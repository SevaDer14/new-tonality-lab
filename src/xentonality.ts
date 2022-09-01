import { checkNumericParam } from "./utils"

export type TSpectrum = Map<number, number>

export interface ISpectrumCreate {
    type: 'harmonic'
    amplitudeProfile?: 'equal' | 'sawtooth'
    precision?: number
    numberOfPartials?: number
    // if changing don't forget to update function description
}

export const Spectrum = {
    /**
    * Returns spectrum generated from given params. Spectrum is a map of frequency ratio and corresponding amplitude. Should be multiplied on fundamental frequency in Hz to get audible spectrum.
    * 
    * @param type (mandatory) - type of spectrum, affects partial frequencie ratios. Harmonic - partial frequencies are integers [1, 2, 3, ...]).
    * @param amplitudeProfile (default: "sawtooth") - Affects generated amplitudes. "equal" all partials have equal amplitudes; "sawtooth" - every next patrial has half of amplitude of previous, like in sawtooth wave (ex. [1, 0.5, 0.25, ...])
    * @param precision (default: 5, max: 16, should be >= 0) - number of decimal points in frequency and amplitude
    * @param numberOfPartials (default: 1000, max: 1000, should be >= 0) - number of partials in spectrum. if decimal -> rounds down to integer, if <= 0 returns zero spectrum Map([[0, 0]])
    * @returns spectrum of type TSpectrum = Map<number, number>. Each entry represents a partial with first number for frequency ratio (in range (0, 1000] )) and second for amplitude (in range (0, 1] )
    */
    create: ({ type, amplitudeProfile = 'sawtooth', ...params }: ISpectrumCreate): TSpectrum => {
        const spectrum = new Map([]) as Map<number, number>

        const getAmplitude = (amplitudeProfile: string, partialIndex: number) => {
            if (amplitudeProfile === "equal") {
                return 1
            }

            return 1 / partialIndex // --> defaults to harmonic profile
        }

        const numberOfPartials = checkNumericParam({ paramName: 'numberOfPartials', fallbackValue: 1000, param: params.numberOfPartials, lowerBound: 0, higherBound: 1000 })
        const precision = checkNumericParam({ paramName: 'precision', fallbackValue: 2, param: params.precision, lowerBound: 0, higherBound: 16 })
        
        if (numberOfPartials === undefined || precision === undefined) {
            return spectrum
        }


        if (type === 'harmonic') {
            for (let i = 1; i <= numberOfPartials; i++) {
                const freqRatio = Number(i.toFixed(precision))
                const amplitude = Number(getAmplitude(amplitudeProfile, i).toFixed(precision))
                spectrum.set(freqRatio, amplitude)
            }
        }

        return spectrum
    }
}
