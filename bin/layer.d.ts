import { ShapeLayer, TextLayer, ImageLayer, Assets, Fonts } from './animation';
import { EasingFunction } from './easing';
declare type SetableKeys = "scaleX" | "scaleY" | "anchorX" | "anchorY" | "x" | "y" | "rotate" | "opacity" | 'shape' | 'fillColor' | 'trim' | 'strokeColor' | 'strokeWidth';
export declare class JSMovinLayer {
    readonly root: ShapeLayer | TextLayer | ImageLayer;
    private getDefaultProperty;
    private convertToStaticProperty;
    private convertToAnimatableProperty;
    private addKeyframe;
    constructor(ref: ShapeLayer | TextLayer | ImageLayer);
    setStaticProperty(key: SetableKeys, value: any): void;
    setAnimatableProperty(key: SetableKeys, startFrame: number, endFrame: number, startValue: any, endValue: any, easing?: EasingFunction): void;
}
export declare class LayerFactory {
    private static generateTransform;
    private static calculateBaseTransform;
    private static getBoundingBox;
    static boundingBox(dom: SVGGraphicsElement): JSMovinLayer;
    static shape(dom: SVGPathElement): JSMovinLayer;
    static rect(left: number, top: number, width: number, height: number): JSMovinLayer;
    static ellipse(cx: number, cy: number, rx: number, ry: number): JSMovinLayer;
    static hierarchy(dom: SVGGraphicsElement, assetList: Assets, fontList: Fonts): JSMovinLayer;
}
export {};
