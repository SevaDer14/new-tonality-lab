import * as Spectrum from '../../src/xentonality/spectrum';
import * as Factory from './factories'
import * as Fixture from './fixtures/spectrum'


describe('Xentonality.Spectrum.generatePartials', () => {
  it('returns default value of 100 partials', () => {
    const partials = Spectrum.generatePartials({ type: 'harmonic' })
    expect(partials.length).toEqual(100);
  });

  it('returns empty partials if number = 0', () => {
    const expectedOutcome = Factory.noPartals
    expect(Spectrum.generatePartials({ type: 'harmonic', number: 0 })).toEqual(expectedOutcome);
  });

  it('returns empty array of partials if number < 0', () => {
    const expectedOutcome = Factory.noPartals
    expect(Spectrum.generatePartials({ type: 'harmonic', number: -1 })).toEqual(expectedOutcome);
  });

  it('returns empty array of partials if number is not integer', () => {
    const expectedOutcome = Factory.noPartals
    expect(Spectrum.generatePartials({ type: 'harmonic', number: 2.5 })).toEqual(expectedOutcome);
  });

  it('returns 4 harmonic partials with harmonic amplitude profile', () => {
    const expectedOutcome = Factory.partials({ ratios: [1, 2, 3, 4] })
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

  it('returns 3 partials of stretched spectrum with pseudoOctave of 2400 and harmonic amplitude profile', () => {
    const partial1 = Factory.partials({ ratios: [1], amplitude: 1 })
    const partial2 = Factory.partials({ ratios: [4], amplitude: 0.25 })
    const partial3 = Factory.partials({ ratios: [9], amplitude: 0.1111111111111111 })

    const expectedOutcome = [partial1, partial2, partial3].flat()

    expect(Spectrum.generatePartials({ type: 'harmonic', number: 3, pseudoOctave: 2400 })).toEqual(expectedOutcome);
  });

  it('returns 10 partials of default 12 edo spectrum and harmonic amplitude profile', () => {
    const expectedOutcome = Fixture.edo12_1200PseudoOct_harmonicAmpProfile
    expect(Spectrum.generatePartials({ type: 'edo', number: 10 })).toEqual(expectedOutcome);
  });

  it('returns 10 partials of 7 edo spectrum and equal amplitude profile', () => {
    const expectedOutcome = Fixture.edo7_fund100_2400PseudoOct_equalAmpProfile
    expect(Spectrum.generatePartials({ type: 'edo', fundamental: 100, edo: 7, number: 10, profile: 'equal', pseudoOctave: 2400 })).toEqual(expectedOutcome);
  });

  it('returns 8 partials of 3 edo spectrum with no duplicates and harmonic amplitude profile', () => {
    const expectedOutcome = Fixture.edo3_fund100_harmAmpProfile
    expect(Spectrum.generatePartials({ type: 'edo', edo: 3, number: 8, fundamental: 100 })).toEqual(expectedOutcome);
  });
})



describe('Xentonality.Spectrum.changeFundamental', () => {
  it('recalculates all the partials frequencies with new provided fundamental and does not change input spectrum', () => {
    const partials = Factory.partials({ ratios: [1, 2, 3, 4] })

    const expectedOutcome = Factory.partials({ ratios: [1, 2, 3, 4], fundamental: 432 })
    expect(Spectrum.changeFundamental({ partials: partials, fundamental: 432 })).toEqual(expectedOutcome);
    expect(partials).toEqual(Factory.partials({ ratios: [1, 2, 3, 4] }));
  });

  it('returns 0 partials if provided fundamental < 0', () => {
    const partials = Factory.partials({ ratios: [1, 2, 3, 4] })

    const expectedOutcome = Factory.noPartals
    expect(Spectrum.changeFundamental({ partials: partials, fundamental: -440 })).toEqual(expectedOutcome);
  });

  it('returns 0 partials if 0 partials is provided', () => {
    expect(Spectrum.changeFundamental({ partials: Factory.noPartals, fundamental: 432 })).toEqual(Factory.noPartals);
  });
})



describe('Xentonality.Spectrum.sumPartials', () => {
  it('returns empty spectrum if empty spectrums are provided', () => {
    expect(Spectrum.sumPartials(Factory.noPartals, Factory.noPartals)).toEqual(Factory.noPartals);
  });

  it('combines non-overlaping spectrums sorted by increasing freq and doesnt change input spectrums', () => {
    const spectrum1 = Factory.partials({ ratios: [5, 6] })
    const spectrum2 = Factory.partials({ ratios: [1, 2] })
    const spectrum3 = Factory.partials({ ratios: [10, 20] })
    const summed = Spectrum.sumPartials(spectrum1, spectrum2, spectrum3)

    const expectedOutcome = [
      { ratio: 1, frequency: 440, amplitude: 1, loudness: 78.84951607609639 },
      { ratio: 2, frequency: 880, amplitude: 0.5, loudness: 64 },
      { ratio: 5, frequency: 2200, amplitude: 1, loudness: 78.84951607609639 },
      { ratio: 6, frequency: 2640, amplitude: 0.5, loudness: 64 },
      { ratio: 10, frequency: 4400, amplitude: 1, loudness: 78.84951607609639 },
      { ratio: 20, frequency: 8800, amplitude: 0.5, loudness: 64 }
    ]

    expect(spectrum1).toEqual(Factory.partials({ ratios: [5, 6] }));
    expect(spectrum2).toEqual(Factory.partials({ ratios: [1, 2] }));
    expect(spectrum3).toEqual(Factory.partials({ ratios: [10, 20] }));
    expect(summed.length).toEqual(6)
    expect(summed).toEqual(expectedOutcome);
  });

  it('combines close overlaping spectrums, sums overlaping amplitudes and doesnt change input spectrums', () => {
    const spectrum1 = Factory.partials({ ratios: [1, 2] })
    const spectrum2 = Factory.partials({ ratios: [1, 2], fundamental: 440.01 })
    const spectrumOverlap = Factory.partials({ ratios: [1], fundamental: 880 })
    const summed = Spectrum.sumPartials(spectrum1, spectrum2, spectrumOverlap)

    const expectedOutcome = [
      { ratio: 1, frequency: 440, amplitude: 1, loudness: 78.84951607609639 },
      { ratio: 1.0000227272727273, frequency: 440.01, amplitude: 1, loudness: 78.84951607609639 },
      { ratio: 2, frequency: 880, amplitude: 1.5, loudness: 89.08565617739539 },
      { ratio: 2.0000454545454547, frequency: 880.02, amplitude: 0.5, loudness: 64 }
    ]

    expect(spectrum1).toEqual(Factory.partials({ ratios: [1, 2] }));
    expect(spectrum2).toEqual(Factory.partials({ ratios: [1, 2], fundamental: 440.01 }));
    expect(summed).toEqual(expectedOutcome);
  });

  it('sums amplitudes of equal spectrums and doesnt change input spectrums', () => {
    const spectrum1 = Factory.partials({ ratios: [1, 2, 3, 4], amplitude: 1 })
    const spectrum2 = Factory.partials({ ratios: [1, 2, 3, 4], amplitude: 1 })
    const spectrum3 = Factory.partials({ ratios: [1, 2, 3, 4], amplitude: 1 })
    const summed = Spectrum.sumPartials(spectrum1, spectrum2, spectrum3)

    const expectedOutcome = [
      { ratio: 1, frequency: 440, amplitude: 3, loudness: 109.75563873295522 },
      { ratio: 2, frequency: 880, amplitude: 3, loudness: 109.75563873295522 },
      { ratio: 3, frequency: 1320, amplitude: 3, loudness: 109.75563873295522 },
      { ratio: 4, frequency: 1760, amplitude: 3, loudness: 109.75563873295522 }
    ]

    expect(spectrum1).toEqual(Factory.partials({ ratios: [1, 2, 3, 4], amplitude: 1 }));
    expect(spectrum2).toEqual(Factory.partials({ ratios: [1, 2, 3, 4], amplitude: 1 }));
    expect(spectrum3).toEqual(Factory.partials({ ratios: [1, 2, 3, 4], amplitude: 1 }));
    expect(summed.length).toEqual(4);
    expect(summed).toEqual(expectedOutcome);
  });
})



describe('Xentonality.Spectrum.combinePartials', () => {
  it('returns empty spectrum if empty spectrums are provided', () => {
    expect(Spectrum.combinePartials(Factory.noPartals, Factory.noPartals)).toEqual(Factory.noPartals);
  });

  it('combines non-overlaping spectrums sorted by increasing freq and doesnt change input spectrums', () => {
    const spectrum1 = Factory.partials({ ratios: [5, 6] })
    const spectrum2 = Factory.partials({ ratios: [1, 2] })
    const spectrum3 = Factory.partials({ ratios: [10, 20] })
    const combined = Spectrum.combinePartials(spectrum1, spectrum2, spectrum3)

    const expectedOutcome = [
      { ratio: 1, frequency: 440, amplitude: 1, loudness: 78.84951607609639 },
      { ratio: 2, frequency: 880, amplitude: 0.5, loudness: 64 },
      { ratio: 5, frequency: 2200, amplitude: 1, loudness: 78.84951607609639 },
      { ratio: 6, frequency: 2640, amplitude: 0.5, loudness: 64 },
      { ratio: 10, frequency: 4400, amplitude: 1, loudness: 78.84951607609639 },
      { ratio: 20, frequency: 8800, amplitude: 0.5, loudness: 64 },
    ]

    expect(spectrum1).toEqual(Factory.partials({ ratios: [5, 6] }));
    expect(spectrum2).toEqual(Factory.partials({ ratios: [1, 2] }));
    expect(spectrum3).toEqual(Factory.partials({ ratios: [10, 20] }));
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
      { ratio: 2, frequency: 880, amplitude: 0.5, loudness: 64 },
      { ratio: 2, frequency: 880, amplitude: 1, loudness: 78.84951607609639 },
      { ratio: 2.0000454545454547, frequency: 880.02, amplitude: 0.5, loudness: 64 },
    ]

    expect(spectrum1).toEqual(Factory.partials({ ratios: [1, 2] }));
    expect(spectrum2).toEqual(Factory.partials({ ratios: [1, 2], fundamental: 440.01 }));
    expect(combined.length).toEqual(5)
    expect(combined).toEqual(expectedOutcome);
  });

  it('sums amplitudes of equal spectrums and doesnt change input spectrums', () => {
    const spectrum1 = Factory.partials({ ratios: [1, 2, 3], amplitude: 1 })
    const spectrum2 = Factory.partials({ ratios: [1, 2, 3], amplitude: 1 })
    const spectrum3 = Factory.partials({ ratios: [1, 2, 3], amplitude: 1 })
    const combined = Spectrum.combinePartials(spectrum1, spectrum2, spectrum3)

    const expectedOutcome = [
      { ratio: 1, frequency: 440, amplitude: 1, loudness: 78.84951607609639 },
      { ratio: 1, frequency: 440, amplitude: 1, loudness: 78.84951607609639 },
      { ratio: 1, frequency: 440, amplitude: 1, loudness: 78.84951607609639 },
      { ratio: 2, frequency: 880, amplitude: 1, loudness: 78.84951607609639 },
      { ratio: 2, frequency: 880, amplitude: 1, loudness: 78.84951607609639 },
      { ratio: 2, frequency: 880, amplitude: 1, loudness: 78.84951607609639 },
      { ratio: 3, frequency: 1320, amplitude: 1, loudness: 78.84951607609639 },
      { ratio: 3, frequency: 1320, amplitude: 1, loudness: 78.84951607609639 },
      { ratio: 3, frequency: 1320, amplitude: 1, loudness: 78.84951607609639 },
    ]

    expect(spectrum1).toEqual(Factory.partials({ ratios: [1, 2, 3], amplitude: 1 }));
    expect(spectrum2).toEqual(Factory.partials({ ratios: [1, 2, 3], amplitude: 1 }));
    expect(spectrum3).toEqual(Factory.partials({ ratios: [1, 2, 3], amplitude: 1 }));
    expect(combined.length).toEqual(9);
    expect(combined).toEqual(expectedOutcome);
  });
})
