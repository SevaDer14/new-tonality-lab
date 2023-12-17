export type VoiceAddress = { voiceId: string }

export type OscillatorAddress = { voiceId?: string; oscIndex: number }

export type PartialAddress = { voiceId?: string; oscIndex: number; partialIndex: number }

export type PlayState = 'ready' | 'playing' | 'used'

export type Partial = {
    rate: number
    amplitude: number
    phase?: number
}

export type SpectralLayer = {
    partials: Partial[]
}

export type Spectrum = SpectralLayer[]
