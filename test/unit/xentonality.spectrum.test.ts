import * as Spectrum from '../../src/xentonality/spectrum';
import * as Factory from './factories'


describe('Xentonality.Spectrum.generatePartials', () => {
  it('returns 4 harmonic partials with harmonic amplitude profile', () => {
    const expectedOutcome = Factory.partials({})
    expect(Spectrum.generatePartials({ type: 'harmonic', number: 4 })).toEqual(expectedOutcome);
  });

  it('returns 6 harmonic partials with equal amplitude profile', () => {
    const expectedOutcome = Factory.partials({ indexes: [1, 2, 3, 4, 5, 6], amplitude: 1 })
    expect(Spectrum.generatePartials({ type: 'harmonic', number: 6, profile: 'equal' })).toEqual(expectedOutcome);
  });

  it('returns default value of 1000 partials', () => {
    const partials = Spectrum.generatePartials({ type: 'harmonic' })
    expect(partials.length).toEqual(1000);
  });

  it('returns empty partials if number = 0', () => {
    const expectedOutcome = Factory.noPartals
    expect(Spectrum.generatePartials({ type: 'harmonic', number: 0 })).toEqual(expectedOutcome);
  });

  it('returns empty partials if number < 0', () => {
    const expectedOutcome = Factory.noPartals
    expect(Spectrum.generatePartials({ type: 'harmonic', number: -1 })).toEqual(expectedOutcome);
  });

  it('returns empty partials if number is not integer', () => {
    const expectedOutcome = Factory.noPartals
    expect(Spectrum.generatePartials({ type: 'harmonic', number: 2.5 })).toEqual(expectedOutcome);
  });
})



describe('Xentonality.Spectrum.changeFundamental', () => {
  it('recalculates all the partials frequencies with new provided fundamental', () => {
    const partials = Factory.partials({})

    const expectedOutcome = Factory.partials({ fundamental: 432 })
    expect(Spectrum.changeFundamental({ partials: partials, fundamental: 432 })).toEqual(expectedOutcome);
  });

  it('returns 0 partials if provided fundamental < 0', () => {
    const partials = Factory.partials({})

    const expectedOutcome = Factory.noPartals
    expect(Spectrum.changeFundamental({ partials: partials, fundamental: -440 })).toEqual(expectedOutcome);
  });

  it('returns 0 partials if 0 partials is provided', () => {
    expect(Spectrum.changeFundamental({ partials: Factory.noPartals, fundamental: 432 })).toEqual(Factory.noPartals);
  });
})



describe('Xentonality.Spectrum.combinePartials', () => {
  it('returns empty spectrum if empty spectrums are provided', () => {
    expect(Spectrum.combinePartials(Factory.noPartals, Factory.noPartals)).toEqual(Factory.noPartals);
  });

  it('returns spectrum with partials from both spectrums sorted by increasing freq', () => {
    const spectrum1 = Factory.partials({ indexes: [5, 6, 7, 8] })
    const spectrum2 = Factory.partials({})
    const spectrum3 = Factory.partials({ indexes: [10, 20, 30, 40] })

    const expectedOutcome = Factory.partials({ indexes: [1, 2, 3, 4, 5, 6, 7, 8, 10, 20, 30, 40] })
    expect(Spectrum.combinePartials(spectrum1, spectrum2, spectrum3)).toEqual(expectedOutcome);
  });
})
