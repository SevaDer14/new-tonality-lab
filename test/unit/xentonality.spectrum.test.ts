import * as Spectrum from '../../src/xentonality/spectrum';
import * as Factory from './factories'


describe('Xentonality.Spectrum.generatePartials', () => {
  it('returns 4 harmonic partials with harmonic amplitude profile', () => {
    const expectedOutcome = Factory.partials({})
    expect(Spectrum.generatePartials({ type: 'harmonic', number: 4 })).toEqual(expectedOutcome);
  });

  it('returns 6 harmonic partials with equal amplitude profile', () => {
    const expectedOutcome = Factory.partials({ ratios: [1, 2, 3, 4, 5, 6], amplitude: 1 })
    expect(Spectrum.generatePartials({ type: 'harmonic', number: 6, profile: 'equal' })).toEqual(expectedOutcome);
  });

  it('returns 4 harmonic partials with fundamental at 100Hz', () => {
    const expectedOutcome = 100
    expect(Spectrum.generatePartials({ type: 'harmonic', fundamental: 100, number: 4 })[0].frequency).toEqual(expectedOutcome);
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
  it('recalculates all the partials frequencies with new provided fundamental and does not change input spectrum', () => {
    const partials = Factory.partials({})

    const expectedOutcome = Factory.partials({ fundamental: 432 })
    expect(Spectrum.changeFundamental({ partials: partials, fundamental: 432 })).toEqual(expectedOutcome);
    expect(partials).toEqual(Factory.partials({}));
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

  it('combines non-overlaping spectrums sorted by increasing freq and doesnt change input spectrums', () => {
    const spectrum1 = Factory.partials({ ratios: [5, 6, 7, 8] })
    const spectrum2 = Factory.partials({})
    const spectrum3 = Factory.partials({ ratios: [10, 20, 30, 40] })
    const combined = Spectrum.combinePartials(spectrum1, spectrum2, spectrum3)

    const expectedOutcome = Factory.partials({ ratios: [1, 2, 3, 4, 5, 6, 7, 8, 10, 20, 30, 40] })

    expect(spectrum1).toEqual(Factory.partials({ ratios: [5, 6, 7, 8] }));
    expect(spectrum3).toEqual(Factory.partials({ ratios: [10, 20, 30, 40] }));
    expect(combined).toEqual(expectedOutcome);
  });

  it('combines close overlaping spectrums, sums overlaping amplitudes and doesnt change input spectrums', () => {
    const spectrum1 = Factory.partials({ ratios: [1, 2] })
    const spectrum2 = Factory.partials({ ratios: [1, 2], fundamental: 440.01 })
    const spectrumOverlap = Factory.partials({ ratios: [1], fundamental: 880 })
    const combined = Spectrum.combinePartials(spectrum1, spectrum2, spectrumOverlap)

    const expectedOutcome = [
      { ratio: 1, frequency: 440, amplitude: 1, loudness: 78.84951607609639 },
      { ratio: 1.0000227272727273, frequency: 440.01, amplitude: 1, loudness: 78.84951607609639 },
      { ratio: 2, frequency: 880, amplitude: 1.5, loudness: 89.08565617739539 },
      { ratio: 2.0000454545454547, frequency: 880.02, amplitude: 0.5, loudness: 64 }
    ]

    expect(spectrum1).toEqual(Factory.partials({ ratios: [1, 2] }));
    expect(spectrum2).toEqual(Factory.partials({ ratios: [1, 2], fundamental: 440.01 }));
    expect(combined).toEqual(expectedOutcome);
  });

  it('sums amplitudes of equal spectrums and doesnt change input spectrums', () => {
    const spectrum1 = Factory.partials({ amplitude: 1 })
    const spectrum2 = Factory.partials({ amplitude: 1 })
    const spectrum3 = Factory.partials({ amplitude: 1 })
    const combined = Spectrum.combinePartials(spectrum1, spectrum2, spectrum3)

    const expectedOutcome = Factory.partials({ amplitude: 3 })

    expect(spectrum1).toEqual(Factory.partials({ amplitude: 1 }));
    expect(spectrum2).toEqual(Factory.partials({ amplitude: 1 }));
    expect(combined).toEqual(expectedOutcome);
  });
})
