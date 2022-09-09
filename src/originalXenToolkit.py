# This is module to work with dissonance
import math
import itertools


# CALCULATING DATA

# DONE
def loudness_sethares(spectrum):
    loudness_coefficient = 200000000

    for i in range(len(spectrum)):
        if spectrum[i][1] != 0:
            spectrum[i][1] = 0.25*2**(math.log(loudness_coefficient*spectrum[i][1], 10))

    return spectrum

# DONE
def calculate_spectrum(mtet, fundamental_frequency, number_of_partials, method):
    spectrum = []
    frequency = []
    amplitude = []

    if number_of_partials == 'all':
        numberofpartials = int(round(20000 / fundamental_frequency, 0))
    else:
        numberofpartials = int(number_of_partials)

    if mtet == 'h':
        # for i in range(numberofpartials):
        #     freq = (i+1) * fundamental_frequency
        #     amp = fundamental_frequency / freq
        #     spectrum.append([freq, amp])
        # Algo for streched spectrum
        stretch = 2.00
        #spectrum.append([fundamental_frequency, 1])
        for i in range(numberofpartials):
            freq = fundamental_frequency * (stretch ** math.log2(i+1))
            frequency.append(round(freq,2))
    else:
        mtet = int(mtet)
        # Full spectrum calculation
        for i in range(numberofpartials):
            freq = 2 ** (round((math.log(i + 1, 2) * mtet), 0) / mtet) * fundamental_frequency
            frequency.append(round(freq,2))

        frequency.sort()
        frequency = list(dict.fromkeys(frequency))

        # "Fracltal" Algorithm
        # base = 6
        #
        # base_ratios = []
        # ratios = []
        # for j in range(base):
        #     ratio = 2 ** (round((math.log(j + 1, 2) * mtet), 0) / mtet)
        #     base_ratios.append(ratio)
        #
        # for base_ratio in base_ratios:
        #     for j in range(base):
        #         ratio = base_ratio*base_ratios[j]
        #         ratios.append(ratio)
        #
        # for ratio in ratios:
        #     for j in range(len(ratios)):
        #         freq = ratio*ratios[j]*fundamental_frequency
        #         frequency.append(round(freq,2))


    for freq in frequency:
        if freq < 20000:
            spectrum.append([freq, frequency[0]/freq])

    return spectrum


def sum_spectrums(*args):
    summed_spectrum = []
    combined_spectrum = []

    for arg in args:
        combined_spectrum.extend(arg)

    combined_spectrum.sort(key=lambda x: x[0])

    # for i in range(len(combined_spectrum)):
    #     if combined_spectrum[i][0] != combined_spectrum[i-1][0]:
    #         summed_spectrum.append([combined_spectrum[i][0], combined_spectrum[i][1]])
    #     else:
    #         summed_spectrum[i][1] += combined_spectrum[i][1]
    # summed_spectrum = combined_spectrum
    return combined_spectrum


def calculate_dissonance(partial_0, partial_1, method):

    if partial_0[1]*partial_1[1] == 0:
        dissonance = 0
    else:
        if partial_0[0] < partial_1[0]:
            fmin = partial_0[0]
            amin = partial_0[1]
            amax = partial_1[1]
        else:
            fmin = partial_1[0]
            amin = partial_1[1]
            amax = partial_0[1]

    if method == 1:
        # Sethares 1
        amplitude_coefficient = amin * amax
    elif method == 2:
        # Sethares 2
        amplitude_coefficient = min(amin, amax)
    else:
        # Vassilakis
        amplitude_coefficient = 0.5 * ((amax * amin) ** 0.1) * (((2 * amin) / (amax + amin)) ** 3.11)

    freqdif = abs(partial_1[0] - partial_0[0])
    dissonance = amplitude_coefficient*(math.exp((-0.84*freqdif)/(0.021*fmin + 19)) - math.exp((-1.38*freqdif)/(0.021*fmin + 19)))

    return dissonance


def calculate_complex_dissonance(fixed_spectrum, sweep_spectrum, method):
    dissonance = 0
    for i in range(len(fixed_spectrum)):
        for j in range(len(sweep_spectrum)):
            dissonance += calculate_dissonance(fixed_spectrum[i], sweep_spectrum[j], method)
    return dissonance


def calculate_dissonance_curve(spectrum, method, precision, octave, SweepMethod, sweepnumberofpartials):
    dissonance_curve = []
    dissonance_curve_ratio = []
    harmonicTemplate = []
    numberofsteps = int(round((precision*300), 0))
    step = (2)/numberofsteps

    # convertion to loudness for Sethares 2
    if method == 2:
        static_spectrum = loudness_sethares(spectrum)
    else:
        static_spectrum = spectrum


    if SweepMethod == 1:
        for i in range(numberofsteps + 1):
            sweep_spectrum = []
            interval = 0.4 + i * step
            for j in range(len(static_spectrum)):
                sweep_spectrum.append([(interval * static_spectrum[j][0]), static_spectrum[j][1]])
            dissonance = calculate_complex_dissonance(static_spectrum, sweep_spectrum, method)
            dissonance_curve_ratio.append([interval, dissonance])
    else:
        fundamental_frequency = spectrum[0][0]
        for i in range(sweepnumberofpartials):
            freq = fundamental_frequency * (i+1)
            amp = 1 / (i+1)
            harmonicTemplate.append([freq, amp])
        if method == 2:
            harmonicTemplate = loudness_sethares(harmonicTemplate)

        for i in range(numberofsteps + 1):
            sweep_spectrum = []
            interval = 0.4 + i * step
            for j in range(len(harmonicTemplate)):
                sweep_spectrum.append([(interval * harmonicTemplate[j][0]), harmonicTemplate[j][1]])
            dissonance = calculate_complex_dissonance(static_spectrum, sweep_spectrum, method)
            dissonance_curve_ratio.append([interval, dissonance])

    # Conversion to cents
    for point in dissonance_curve_ratio:
        dissonance_curve.append([1200*math.log2(point[0]), point[1]])

    return dissonance_curve


def normalization(dissonance_curve):
    percieved_dissonance = []
    corrected_dissonance_curve = []
    normalized_dissonance_curve = []

    # Algo for normalizing to line connecting diss at unison and general-octave
    # can produce negative values if diss-curve is calculated for 2 different spectrums

    intrinsic_dissonance = float(dissonance_curve[0][1])
    octave_correction = dissonance_curve[-1][1]

    # Correcting on line (unison and octave = 0 dissonance)
    tang = octave_correction - intrinsic_dissonance

    for point in dissonance_curve:
        correcting_line = tang*point[0] - tang + intrinsic_dissonance
        corrected_value = point[1] - correcting_line
        corrected_dissonance_curve.append([point[0], corrected_value])
        percieved_dissonance.append(corrected_value)

    max_dissonance = max(percieved_dissonance)

    for point in corrected_dissonance_curve:
        normalized_dissonance_curve.append([point[0], (point[1]/max_dissonance)])

    return normalized_dissonance_curve


def normalization_to_one(dissonance_curve):
    # Normalization of max dissonance to 1
    percieved_dissonance = []
    normalized_dissonance_curve = []

    for point in dissonance_curve:
         percieved_dissonance.append(point[1])

    max_dissonance = max(percieved_dissonance)
    for point in dissonance_curve:
        normalized_dissonance_curve.append([point[0], (point[1]/max_dissonance)])

    return normalized_dissonance_curve

# SKIP
def calculate_intrinsic_dissonance(spectrum, method):
    dissonance = 0
    partial_number = []

    for i in range(len(spectrum)):
        partial_number.append(i)

    all_partial_combinations = list(itertools.combinations(partial_number, 2))

    for combination in all_partial_combinations:
        dissonance += calculate_dissonance(spectrum[combination[0]], spectrum[combination[1]], method)

    # for i in range(len(spectrum)):
    #     for j in range(len(spectrum)-i-1):
    #         dissonance += calculate_dissonance(spectrum[i], spectrum[j+1], method)

    return dissonance

# SKIP
def calculate_chord_table(mtet, spectrum, method):

    # Generate Spectrums for each step in tuning
    steps = []
    chord_table = []
    note_spectrums = []
    numberofnotes = 3
    # note_spectrums.append(spectrum)
    note_step = 2 ** (1 / 12)
    for i in range(mtet):
        step = note_step ** i
        steps.append(step)

    for step in steps:
        step_spectrum = []
        for partial in spectrum:
            step_spectrum.append([step*partial[0], partial[1]])
        # convertion to loudness for Sethares 2
        # if method == 2:
        #     step_spectrum = loudness_sethares(step_spectrum)
        note_spectrums.append(step_spectrum)



    # Generate all possible chords from step 1
    all_note_combinations = []
    chords = []
    step_number = []
    for i in range(mtet):
        step_number.append(i)

    all_note_combinations = list(itertools.combinations(step_number, numberofnotes))

    i = 0
    while all_note_combinations[i][0] == 0:
        chords.append(all_note_combinations[i])
        i = i + 1


    # Compactify chords (triads only)
    compact_chords = []
    for chord in chords:
        chord_size = chord[2]
        compact_chord = chord
        compact_check = ((chord[2]-12), chord[0], chord[1])
        compact_check_size = compact_check[2] - compact_check[0]
        if compact_check_size < chord_size:
            chord_size = compact_check_size
            compact_chord = ((compact_check[0]-compact_check[0]), (compact_check[1]-compact_check[0]), (compact_check[2]-compact_check[0]))
            compact_check = ((chord[1] - 12), (chord[2]-12), chord[0])
            compact_check_size = -compact_check[0]
            if compact_check_size < chord_size:
                compact_chord = ((compact_check[0] - compact_check[0]), (compact_check[1] - compact_check[0]),
                                 (compact_check[2] - compact_check[0]))
                compact_chords.append(compact_chord)
            else:
                compact_chords.append(compact_chord)
        else:
            compact_check = (chord[1],chord[2],12)
            compact_check_size = compact_check[2] - compact_check[0]
            if compact_check_size < chord_size:
                compact_chord = ((compact_check[0] - compact_check[0]), (compact_check[1] - compact_check[0]),
                                 (compact_check[2] - compact_check[0]))
                compact_chords.append(compact_chord)
            else:
                compact_chords.append(compact_chord)
    compact_chords = list(dict.fromkeys(compact_chords))

    # Find spectrum of chords and calculate intrinsic dissonance
    # Method using dissonance curve
    # dissonance_curve_interval = []
    # for point in dissonance_curve:
    #     dissonance_curve_interval.append(point[0])
    #
    # steps_dissonance = []
    # for step in steps:
    #     step_index = dissonance_curve_interval.index(min(dissonance_curve_interval, key=lambda x: abs(x - step)))
    #     steps_dissonance.append(dissonance_curve[step_index][1])
    #
    # for chord in compact_chords:
    #     chord_dissonance = steps_dissonance[chord[1]] + steps_dissonance[chord[2]] + steps_dissonance[(chord[2]-chord[1])]
    #     chord_table.append([chord, chord_dissonance])

    # Method using intrinsic dissonance
    for chord in compact_chords:
        chord_dissonance = 0
        note_1 = note_spectrums[chord[0]]
        note_2 = note_spectrums[chord[1]]
        note_3 = note_spectrums[chord[2]]
        chord_spectrum = sum_spectrums(note_1, note_2, note_3)
        chord_dissonance = calculate_intrinsic_dissonance(chord_spectrum, method)
        chord_table.append([chord, chord_dissonance])

    chord_table.sort(key=lambda x: x[1])
    print(chord_table)

    # note_1 = note_spectrums[0]
    # note_2 = note_spectrums[4]
    # note_3 = note_spectrums[7]
    # chord_spectrum = sum_spectrums(note_1, note_2, note_3)
    # plot_spectrum(chord_spectrum)
    #
    # note_1 = note_spectrums[0]
    # note_2 = note_spectrums[3]
    # note_3 = note_spectrums[7]
    # chord_spectrum = sum_spectrums(note_1, note_2, note_3)
    # plot_spectrum(chord_spectrum)
    #
    # note_1 = note_spectrums[0]
    # note_2 = note_spectrums[5]
    # note_3 = note_spectrums[7]
    # chord_spectrum = sum_spectrums(note_1, note_2, note_3)
    # plot_spectrum(chord_spectrum)