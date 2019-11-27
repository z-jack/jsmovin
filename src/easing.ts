// parameters extracted from https://easings.net/

export type EasingFunction = number[][][]

export class EasingFactory {
    static linear(): EasingFunction {
        return [[[1], [1]], [[0], [0]]]
    }

    static easeInSine(): EasingFunction {
        return [[[0.47], [0]], [[0.745], [0.715]]]
    }

    static easeOutSine(): EasingFunction {
        return [[[0.39], [0.575]], [[0.565], [1]]]
    }

    static easeInOutSine(): EasingFunction {
        return [[[0.445], [0.05]], [[0.55], [0.95]]]
    }

    static easeInQuad(): EasingFunction {
        return [[[0.55], [0.085]], [[0.68], [0.53]]]
    }

    static easeOutQuad(): EasingFunction {
        return [[[0.25], [0.46]], [[0.45], [0.94]]]
    }

    static easeInOutQuad(): EasingFunction {
        return [[[0.455], [0.03]], [[0.515], [0.955]]]
    }

    static easeInCubic(): EasingFunction {
        return [[[0.55], [0.055]], [[0.675], [0.19]]]
    }

    static easeOutCubic(): EasingFunction {
        return [[[0.215], [0.61]], [[0.355], [1]]]
    }

    static easeInOutCubic(): EasingFunction {
        return [[[0.645], [0.045]], [[0.355], [1]]]
    }

    static easeInQuart(): EasingFunction {
        return [[[0.895], [0.03]], [[0.685], [0.22]]]
    }

    static easeOutQuart(): EasingFunction {
        return [[[0.165], [0.84]], [[0.44], [1]]]
    }

    static easeInOutQuart(): EasingFunction {
        return [[[0.77], [0]], [[0.175], [1]]]
    }

    static easeInQuint(): EasingFunction {
        return [[[0.755], [0.05]], [[0.855], [0.06]]]
    }

    static easeOutQuint(): EasingFunction {
        return [[[0.23], [1]], [[0.32], [1]]]
    }

    static easeInOutQuint(): EasingFunction {
        return [[[0.86], [0]], [[0.07], [1]]]
    }

    static easeInExpo(): EasingFunction {
        return [[[0.95], [0.05]], [[0.795], [0.035]]]
    }

    static easeOutExpo(): EasingFunction {
        return [[[0.19], [1]], [[0.22], [1]]]
    }

    static easeInOutExpo(): EasingFunction {
        return [[[1], [0]], [[0], [1]]]
    }

    static easeInCirc(): EasingFunction {
        return [[[0.6], [0.04]], [[0.98], [0.335]]]
    }

    static easeOutCirc(): EasingFunction {
        return [[[0.075], [0.82]], [[0.165], [1]]]
    }

    static easeInOutCirc(): EasingFunction {
        return [[[0.785], [0.135]], [[0.15], [0.86]]]
    }

    static easeInBack(): EasingFunction {
        return [[[0.6], [-0.28]], [[0.735], [0.045]]]
    }

    static easeOutBack(): EasingFunction {
        return [[[0.175], [0.885]], [[0.32], [1.275]]]
    }

    static easeInOutBack(): EasingFunction {
        return [[[0.68], [-0.55]], [[0.265], [1.55]]]
    }
}