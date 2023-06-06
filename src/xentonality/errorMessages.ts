export const errors = {
    series: {
        lengthIsLessThanZero: "Series length must be greater or equal to zero!",
        lengthsAreNotEqual: "Series in PointSeries.merge have to have the same length!",
    },
    partials: {
        negativeNumberOfPartials: "Number of partials cannot be negative!",
        negativeAmplitudeProfile: "Amplitude profile cannot be negative!",
        nonIntegerNumberOfPartials: "Number of partials should be an integer!",
        probableInfiniteLoop: "Number of iterations reached 1 000 000! Probable infinite loop.",
        lessThanOneOctaveRatio: "Octave ratio should be greater than one!",
        tweakRatioLessOrEqualZero: "Value for ratio tweak should be greater than zero!",
        tweakAmplitudeLessZero: "Value for amplitude tweak should be greater or equal zero!",
    },
    spectrum: {
        tweaksShouldHaveTheSameLengthAsSpectrum: "Length of tweaks should be the same as the number of partials!"
    }
}
