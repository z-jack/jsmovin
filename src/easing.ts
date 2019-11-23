export type EasingFunction = number[][][]

export class EasingFactory {
    static linear(): EasingFunction {
        return [[[1], [1]], [[0], [0]]]
    }
}