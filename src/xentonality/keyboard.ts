import type { Note } from "./synth"
import type { Tuning } from "./tuning"

export const KEYBOARD_KEYS = ['a', 'w', 's', 'e', 'd', 'r', 'f', 't', 'g', 'y', 'h', 'u', 'j', 'i', 'k', 'o', 'l', 'p', ';', '[', "'", ']'] as const
export type KeyboardKey = typeof KEYBOARD_KEYS[number]
export type Keys = Map<KeyboardKey, Note & { index: number }>

export class Keyboard {
    private _keys: Keys

    public constructor(tuning: Tuning, baseFrequency: number) {
        this._keys = new Map(KEYBOARD_KEYS.map(
            (key, i) => key === 'a' ? [key, { index: i, frequency: baseFrequency, ratio: "1:1" }] : [key, this.getNote(tuning, i, baseFrequency)]
        ))
    }

    public get keys() {
        return this._keys
    }

    private getNote(tuning: Tuning, index: number, baseFrequency: number) {
        const octaveNumber = Math.floor(index / tuning.intervals.length)
        const octaveMultiplier = tuning.octave === undefined || octaveNumber === 0
            ? 1
            : (tuning.octave.decimal * octaveNumber)
        const interval = tuning.intervals[index % tuning.intervals.length]

        return {
            index,
            frequency: interval.decimal * octaveMultiplier * baseFrequency,
            ratio: interval.ratio,
        }
    }

    update(tuning: Tuning, baseFrequency: number) {
        this._keys.forEach((note, key, keys) => {
            if (key !== 'a') {
                keys.set(key,
                    this.getNote(tuning, note.index, baseFrequency)
                )
            }
        })
    }
}
