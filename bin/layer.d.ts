import { ShapeLayer, TextLayer, ImageLayer, Assets, Fonts, PreCompLayer } from './animation';
import { EasingFunction } from './easing';
declare type SetableKeys = "scaleX" | "scaleY" | "anchorX" | "anchorY" | "x" | "y" | "rotate" | "opacity" | 'shape' | 'fillColor' | 'trimStart' | 'trimEnd' | 'trimOffset' | 'strokeColor' | 'strokeWidth' | 'text' | 'fillOpacity' | 'strokeOpacity' | 'lineCap' | 'lineJoin';
export declare class JSMovinLayer {
    readonly root: ShapeLayer | TextLayer | ImageLayer | PreCompLayer;
    private getDefaultProperty;
    private convertToStaticProperty;
    private convertToAnimatableProperty;
    private addKeyframe;
    private findPropertyConfig;
    private findOrInsertPropertyConfig;
    private commonPropertyMapping;
    constructor(ref: ShapeLayer | TextLayer | ImageLayer | PreCompLayer);
    setStaticProperty(key: SetableKeys, value: any): void;
    setAnimatableProperty(key: SetableKeys, startFrame: number, endFrame: number, startValue: any, endValue: any, easing?: EasingFunction): void;
}
export declare class LayerFactory {
    private static generateTransform;
    static boundingBox(dom: SVGGraphicsElement): JSMovinLayer;
    static shape(dom: SVGPathElement): JSMovinLayer;
    static rect(left: number, top: number, width: number, height: number): JSMovinLayer;
    static ellipse(cx: number, cy: number, rx: number, ry: number): JSMovinLayer;
    static hierarchy(dom: SVGGraphicsElement, assetList: Assets, fontList: Fonts): JSMovinLayer;
}
export {};
