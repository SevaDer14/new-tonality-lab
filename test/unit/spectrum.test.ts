
import { Spectrum, initEmptySpectrum } from '../../src/xentonality';

const emptySpectrum = initEmptySpectrum()


describe('Spectrum.create', () => {
  it('returns harmonic spectrum, with 4 partials and sawtooth amplitude profile', () => {
    const expectedOutcome = new Map([[1, 1], [2, 0.5], [3, 0.3333333333333333], [4, 0.25]])
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

  it('returns empty spectrum if numberOfPartials < 0', () => {
    const expectedOutcome = emptySpectrum
    expect(Spectrum.create({ type: 'harmonic', numberOfPartials: -1 })).toEqual(expectedOutcome);
  });

  it('returns empty spectrum if numberOfPartials > 1000', () => {
    const expectedOutcome = emptySpectrum
    expect(Spectrum.create({ type: 'harmonic', numberOfPartials: 1001 })).toEqual(expectedOutcome);
  });

  it('returns empty spectrum if numberOfPartials is not integer', () => {
    const expectedOutcome = emptySpectrum
    expect(Spectrum.create({ type: 'harmonic', numberOfPartials: 2.5 })).toEqual(expectedOutcome);
  });
})


describe('Spectrum.toLoudness', () => {
  it('returns spectrum with partials amplitues converted to db', () => {
    const spectrum = new Map([[1, 1], [2, 0.5], [3, 0.33], [4, 0.25]])
    const expectedOutcome = new Map([[1, 78.84951607609639], [2, 64], [3, 56.475136032146196], [4, 51.94705311884243]])
    expect(Spectrum.toLoudness({ spectrum: spectrum })).toEqual(expectedOutcome);
  });

  it('returns empty spectrum one of the partials have amplitude > 1', () => {
    const spectrum = new Map([[1, 1], [2, 1.1]])
    expect(Spectrum.toLoudness({ spectrum: spectrum })).toEqual(emptySpectrum);
  });

  it('returns empty spectrum one of the partials have amplitude < 0', () => {
    const spectrum = new Map([[1, 1], [2, -0.5]])
    expect(Spectrum.toLoudness({ spectrum: spectrum })).toEqual(emptySpectrum);
  });

  it('returns empty spectrum if empty spectrum is provided', () => {
    expect(Spectrum.toHz({ spectrum: emptySpectrum, fundamental: 432 })).toEqual(emptySpectrum);
  });
})

describe('Spectrum.toHz', () => {
  it('returns spectrum with partials frequencies converted to Hz and multiplied by fundamental', () => {
    const spectrum = new Map([[1, 1], [2, 0.5], [3, 0.33], [4, 0.25]])

    const expectedOutcome = new Map([[432, 1], [864, 0.5], [1296, 0.33], [1728, 0.25]])
    expect(Spectrum.toHz({ spectrum: spectrum, fundamental: 432 })).toEqual(expectedOutcome);
  });

  it('returns empty spectrum one of the partials have freq < 0', () => {
    const spectrum = new Map([[1, 1], [-1, 0.5]])

    expect(Spectrum.toHz({ spectrum: spectrum, fundamental: 432 })).toEqual(emptySpectrum);
  });

  it('does not include frequencies above 20000 Hz', () => {
    const spectrum = new Map([[1, 1], [400, 0.5]])

    const expectedOutcome = new Map([[432, 1]])
    expect(Spectrum.toHz({ spectrum: spectrum, fundamental: 432 })).toEqual(expectedOutcome);
  });

  it('returns empty spectrum if empty spectrum is provided', () => {
    expect(Spectrum.toHz({ spectrum: emptySpectrum, fundamental: 432 })).toEqual(emptySpectrum);
  });
})

describe('Spectrum.sum', () => {
  it('returns empty spectrum if empty spectrums are provided', () => {
    expect(Spectrum.sum(emptySpectrum, emptySpectrum)).toEqual(emptySpectrum);
  });

  it('returns spectrum with partials from both spectrums sorted by increasing freq', () => {
    const spectrum1 = new Map([[6, 0.5555], [17, 0.17], [30, 0.02]])
    const spectrum2 = new Map([[1, 1], [3, 0.33], [5, 0.2]])
    const spectrum3 = new Map([[2, 0.5], [4, 0.25], [10, 0.1]])

    const expectedOutcome = new Map([[1, 1], [2, 0.5], [3, 0.33], [4, 0.25], [5, 0.2], [6, 0.5555], [10, 0.1], [17, 0.17], [30, 0.02]])
    expect(Spectrum.sum(spectrum1, spectrum2, spectrum3)).toEqual(expectedOutcome);
  });

  it('returns empty spectrum if one of input spectrums has freq < 0', () => {
    const spectrum1 = new Map([[1, 1], [3, 0.33], [5, 0.2]])
    const spectrum2 = new Map([[6, 0.5555], [-17, 0.17], [30, 0.02]])

    expect(Spectrum.sum(spectrum1, spectrum2)).toEqual(emptySpectrum);
  });

  it('returns empty spectrum if one of input spectrums has amplitude < 0', () => {
    const spectrum1 = new Map([[1, 1], [3, 0.33], [5, 0.2]])
    const spectrum2 = new Map([[6, 0.5555], [17, -0.17], [30, 0.02]])

    expect(Spectrum.sum(spectrum1, spectrum2)).toEqual(emptySpectrum);
  });
})
