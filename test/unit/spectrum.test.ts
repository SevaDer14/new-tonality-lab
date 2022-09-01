
import { Spectrum } from '../../src/xentonality';


const getNumberOfDecimalPlaces = (number: number) => {
  const decimalPlaces = number.toString().split('.')[1]
  return decimalPlaces ? decimalPlaces.length : 0
}

// TODO: I don't test frequency precision with harmonic spectrum as freq ratios are always integer, test it with edo

describe('Spectrum.create', () => {
  const emptySpectrum = new Map([])

  it('returns harmonic spectrum, with 4 partials and sawtooth amplitude profile', () => {
    const expectedOutcome = new Map([[1, 1], [2, 0.5], [3, 0.33], [4, 0.25]])
    expect(Spectrum.create({ type: 'harmonic', numberOfPartials: 4 })).toEqual(expectedOutcome);
  });

  it('returns harmonic spectrum, with 4 partials and equal amplitude profile', () => {
    const expectedOutcome = new Map([[1, 1], [2, 1], [3, 1], [4, 1]])
    expect(Spectrum.create({ type: 'harmonic', numberOfPartials: 4, amplitudeProfile: 'equal' })).toEqual(expectedOutcome);
  });

  it('returns harmonic spectrum, with 6 partials and equal amplitude profile', () => {
    const expectedOutcome = new Map([[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1]])
    expect(Spectrum.create({ type: 'harmonic', numberOfPartials: 6, amplitudeProfile: 'equal' })).toEqual(expectedOutcome);
  });

  it('returns full spectrum with 1000 partials', () => {
    const spectrum = Spectrum.create({ type: 'harmonic' })
    expect(spectrum.size).toEqual(1000);
  });

  it('returns empty spectrum if numberOfPartials = 0', () => {
    const expectedOutcome = emptySpectrum
    expect(Spectrum.create({ type: 'harmonic', numberOfPartials: 0 })).toEqual(expectedOutcome);
  });

  it('returns spectrum with default precision of 2 decimal places', () => {
    const expectedOutcome = 2
    const spectrum = Spectrum.create({ type: 'harmonic', numberOfPartials: 3 })
    const partial = [...spectrum.entries()][2]
    expect(getNumberOfDecimalPlaces(partial[1])).toEqual(expectedOutcome);
  });

  it('returns spectrum with precision of 6 decimal places', () => {
    const expectedOutcome = 6
    const spectrum = Spectrum.create({ type: 'harmonic', numberOfPartials: 3, precision: 6 })
    const partial = [...spectrum.entries()][2]

    expect(getNumberOfDecimalPlaces(partial[1])).toEqual(expectedOutcome);
  });

  it('fallbacks to lowerBound value of 0 for numberOfPartials if numberOfPartials < 0', () => {
    const expectedOutcome = emptySpectrum
    expect(Spectrum.create({ type: 'harmonic', numberOfPartials: -1, precision: 2 })).toEqual(expectedOutcome);
  });

  it('fallbacks to higherBound value of 1000 for numberOfPartials if numberOfPartials > 1000', () => {
    const spectrum = Spectrum.create({ type: 'harmonic', numberOfPartials: 1001, precision: 2 })
    expect(spectrum.size).toEqual(1000);
  });

  it('fallbacks to lowerBound value of 0 for precision if precision < 0', () => {
    const expectedOutcome = 0
    const spectrum = Spectrum.create({ type: 'harmonic', numberOfPartials: 3, precision: -1 })
    const partial = [...spectrum][2]

    expect(getNumberOfDecimalPlaces(partial[1])).toEqual(expectedOutcome);
  });

  it('fallbacks to higherBound value of 16 for precision if precision > 16', () => {
    const expectedOutcome = 16
    const spectrum = Spectrum.create({ type: 'harmonic', numberOfPartials: 3, precision: 20 })
    const partial = [...spectrum][2]

    expect(getNumberOfDecimalPlaces(partial[1])).toEqual(expectedOutcome);
  });
})
