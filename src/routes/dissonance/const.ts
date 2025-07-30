export const TUTORIAL_KEY = 'nt-dissonance-tutorial-1-finished' 
export const TUTORIAL_STEP_START = {
    finished: false,
    step: 0,
    complementHint: '',
    contextHint: '',
}

export const TUTORIAL_STEP_1 = {
    finished: false,
    step: 1,
    complementHint: 'Listen to partilas by pressing the speaker button',
    contextHint: '',
}

export const TUTORIAL_STEP_2 = {
    finished: false,
    step: 2,
    complementHint: '',
    contextHint: "Copy the complement partials here, by pressing the '=>' button",
}

export const TUTORIAL_STEP_3 = {
    finished: false,
    step: 3,
    complementHint: 'Drag transpose up and down to change the pitch of compoement partials',
    contextHint: '',
}

export const TUTORIAL_STEP_END = {
    finished: false,
    step: 4,
    complementHint: '',
    contextHint: '',
}

export const DISSONANCE_PARAMS = {
    rangeMin: 0,
    rangeMax: 1200,
    step: 1,
    s1: 0.021,
    s2: 19,
    b1: 3.5,
    b2: 5.75,
    x_star: 0.24,
}

export default {
    TUTORIAL_KEY,
    TUTORIAL_STEP_START,
    TUTORIAL_STEP_1,
    TUTORIAL_STEP_2,
    TUTORIAL_STEP_3,
    TUTORIAL_STEP_END,
    DISSONANCE_PARAMS,
}
