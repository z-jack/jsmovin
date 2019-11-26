export declare type EasingFunction = number[][][];
export declare class EasingFactory {
    static linear(): EasingFunction;
    static easeInQuad(): EasingFunction;
    static easeOutQuad(): EasingFunction;
    static easeInOutQuad(): EasingFunction;
    static easeInCubic(): EasingFunction;
    static easeOutCubic(): EasingFunction;
    static easeInOutCubic(): EasingFunction;
}
