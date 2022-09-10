
import type { TPartials } from '../../src/xentonality/types';
import { generatePartials, changeFundamental, combinePartials } from '../../src/xentonality/spectrum';
import { setharesLoudness } from '../../src/xentonality/utils';

export const partialFactory = ({ indexes = [1, 2, 3, 4], fundamental = 440, amplitude }: { indexes?: number[], fundamental?: number, amplitude?: number }) => indexes.map(i => { return { ratio: i, frequency: i * fundamental, amplitude: amplitude ? amplitude : 1 / i, loudness: setharesLoudness(amplitude ? amplitude : 1 / i) } }) as TPartials
export const noPartals = partialFactory({ indexes: [] })

describe('Xentonality.Spectrum.generatePartials', () => {
  it('returns 4 harmonic partials with harmonic amplitude profile', () => {
    const expectedOutcome = partialFactory({})
    expect(generatePartials({ type: 'harmonic', number: 4 })).toEqual(expectedOutcome);
  });

  it('returns 6 harmonic partials with equal amplitude profile', () => {
    const expectedOutcome = partialFactory({ indexes: [1, 2, 3, 4, 5, 6], amplitude: 1 })
    expect(generatePartials({ type: 'harmonic', number: 6, amplitudeProfile: 'equal' })).toEqual(expectedOutcome);
  });

  it('returns default value of 1000 partials', () => {
    const partials = generatePartials({ type: 'harmonic' })
    expect(partials.length).toEqual(1000);
  });

  it('returns empty partials if number = 0', () => {
    const expectedOutcome = noPartals
    expect(generatePartials({ type: 'harmonic', number: 0 })).toEqual(expectedOutcome);
  });

  it('returns empty partials if number < 0', () => {
    const expectedOutcome = noPartals
    expect(generatePartials({ type: 'harmonic', number: -1 })).toEqual(expectedOutcome);
  });

  it('returns empty partials if number is not integer', () => {
    const expectedOutcome = noPartals
    expect(generatePartials({ type: 'harmonic', number: 2.5 })).toEqual(expectedOutcome);
  });
})

describe('Xentonality.Spectrum.changeFundamental', () => {
  it('recalculates all the partials frequencies with new provided fundamental', () => {
    const partials = partialFactory({})

    const expectedOutcome = partialFactory({ fundamental: 432 })
    expect(changeFundamental({ partials: partials, fundamental: 432 })).toEqual(expectedOutcome);
  });

  it('returns 0 partials if provided fundamental < 0', () => {
    const partials = partialFactory({})

    const expectedOutcome = noPartals
    expect(changeFundamental({ partials: partials, fundamental: -440 })).toEqual(expectedOutcome);
  });

  it('returns 0 partials if 0 partials is provided', () => {
    expect(changeFundamental({ partials: noPartals, fundamental: 432 })).toEqual(noPartals);
  });
})

describe('Xentonality.Spectrum.combinePartials', () => {
  it('returns empty spectrum if empty spectrums are provided', () => {
    expect(combinePartials(noPartals, noPartals)).toEqual(noPartals);
  });

  it('returns spectrum with partials from both spectrums sorted by increasing freq', () => {
    const spectrum1 = partialFactory({ indexes: [5, 6, 7, 8] })
    const spectrum2 = partialFactory({})
    const spectrum3 = partialFactory({ indexes: [10, 20, 30, 40] })

    const expectedOutcome = partialFactory({ indexes: [1, 2, 3, 4, 5, 6, 7, 8, 10, 20, 30, 40] })
    expect(combinePartials(spectrum1, spectrum2, spectrum3)).toEqual(expectedOutcome);
  });
})
