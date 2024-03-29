// integrate with tailwind config

export const colors = {
    transparent: 'rgba(255, 255, 255, 0)',
    white: {
        DEFAULT: 'rgba(255, 255, 255, 1)',
        '65': 'rgba(255, 255, 255, 0.65)',
        '25': 'rgba(255, 255, 255, 0.25)',
        '5': 'rgba(255, 255, 255, 0.05)',
    },
    blue: {
        DEFAULT: 'rgba(0, 189, 249, 1)',
        '65': 'rgba(0, 189, 249, 0.65)',
        '25': 'rgba(0, 189, 249, 0.25)',
        '5': 'rgba(0, 189, 249, 0.05)',
    },
    green: {
        DEFAULT: 'rgba(105, 255, 111, 1)',
        '65': 'rgba(105, 255, 111, 0.65)',
        '25': 'rgba(105, 255, 111, 0.25)',
        '5': 'rgba(105, 255, 111, 0.05)',
    },
    yellow: {
        DEFAULT: 'rgba(255, 230, 0, 1)',
        '65': 'rgba(255, 230, 0, 0.65)',
        '25': 'rgba(255, 230, 0, 0.25)',
        '5': 'rgba(255, 230, 0, 0.05)',
    },
    orange: {
        DEFAULT: 'rgba(255, 177, 61, 1)',
        '65': 'rgba(255, 177, 61, 0.65)',
        '25': 'rgba(255, 177, 61, 0.25)',
        '5': 'rgba(255, 177, 61, 0.05)',
    },
    pink: {
        DEFAULT: 'rgba(255, 61, 177, 1)',
        '65': 'rgba(255, 61, 177, 0.65)',
        '25': 'rgba(255, 61, 177, 0.25)',
        '5': 'rgba(255, 61, 177, 0.05)',
    },
}

export const colorSeries = ['green', 'orange', 'yellow', 'pink', 'blue', 'white'] as const
