import { ShapeLayer, TextLayer, ImageLayer } from './animation';
import { EasingFunction } from './easing';
declare type SetableKeys = "scaleX" | "scaleY" | "anchorX" | "anchorY" | "x" | "y" | "rotate" | "opacity";
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
    private static getBoundingBox;
    static boundingBox(dom: SVGGraphicsElement): JSMovinLayer;
    static shape(dom: SVGPathElement): JSMovinLayer;
    static rect(left: number, top: number, width: number, height: number): void;
    static ellipse(cx: number, cy: number, rx: number, ry: number, rotate: number): void;
    static hierarchy(dom: SVGGraphicsElement): JSMovinLayer;
}
export {};
