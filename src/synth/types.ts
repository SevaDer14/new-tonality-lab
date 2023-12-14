export type VoiceAddress = { voiceId: string }

export type OscillatorAddress = { voiceId?: string; oscIndex: number }

export type PartialAddress = { voiceId?: string; oscIndex: number; partialIndex: number }

export type PlayState = 'ready' | 'playing' | 'used'

export type SpectralLayer = {
    partials: PartialArgs[]
}

export type Spectrum = SpectralLayer[]

export type PartialArgs = {
    rate: number
    amplitude: number
    phase: number
}
