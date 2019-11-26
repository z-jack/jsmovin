export type EasingFunction = number[][][]

export class EasingFactory {
    static linear(): EasingFunction {
        return [[[1], [1]], [[0], [0]]]
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
}