## Partials

The goal is to have a step by step process of creating spectrum to feed to synth
Ideally the process should be a chain of simple pure functions

```ts
const rates = getHarmonicRates({ length: 3 }) // [{rate: 1}, {rate: 2}, {rate: 3}]
const edoRates = getEdoRates({ length: 5, edo: 12, steps: [1, 3, 5, 6, 8, 10, 11], strength: 1 }) // major scale
const stretchedRates = stretchRates({ rates, stretch: 2 }) // [{rate: 1}, {rate: 4}, {rate: 9}]
const withAmplitudes = attachReciprocalAmplitudes({ rates, slope: 1 })
const partials = attachRandomPhases(withAmplitudes)
const tweakedPartials = tweak({ partials, tweaks: [{ rate: 0.3, amplitude: 1.4, phase: 0.2 }] }) // multiplicative
```

this way I can add other functions to get rates, amplitudes, etc.

In store it will look like:

```ts
length = 6
derivedRates = [...]

stretch = 1
derivedStretchedRates = [...]

slope = 1
derivedPartials = [...]

tweaks = []
tweakedPartials = [...]

```

## Spectrum

The same process has to be done several times to support layers
Thus it makes sense to do calculations in DOM components and only keep spectrum in store

## Other

From the spectrum we can derive dissonance curve and tuning using pure functions!!
We can also record sample separately from synth and audio context
