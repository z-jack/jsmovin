import { ShapeLayer, TextLayer, ImageLayer, Assets, Fonts, PreCompLayer, ReferenceID } from './animation';
import { EasingFunction } from './easing';
declare type SetableKeys = "scaleX" | "scaleY" | "anchorX" | "anchorY" | "x" | "y" | "rotate" | "opacity" | 'shape' | 'fillColor' | 'trimStart' | 'trimEnd' | 'trimOffset' | 'strokeColor' | 'strokeWidth' | 'text' | 'fillOpacity' | 'strokeOpacity';
export declare class JSMovinLayer {
    readonly root: ShapeLayer | TextLayer | ImageLayer | PreCompLayer;
    private anchor;
    private position;
    private timeRange;
    private getDefaultProperty;
    private convertToStaticProperty;
    private convertToAnimatableProperty;
    private addKeyframe;
    private findPropertyConfig;
    private findOrInsertPropertyConfig;
    private commonPropertyMapping;
    private updateTimeRange;
    constructor(ref: ShapeLayer | TextLayer | ImageLayer | PreCompLayer);
    /**
     *
     * @param key the name of property to be set
     * @param value the value to be set
     */
    setStaticProperty(key: SetableKeys, value: any): void;
    /**
     *
     * @param key the name of property to be set
     * @param startFrame frame number to start the animation
     * @param endFrame frame number to end the animation
     * @param startValue value to be set in start of animation
     * @param endValue value to be set in end of animation
     * @param easing easing function, default is linear
     */
    setAnimatableProperty(key: SetableKeys, startFrame: number, endFrame: number, startValue: any, endValue: any, easing?: EasingFunction): void;
}
export declare class LayerFactory {
    private static generateTransform;
    /**
     * create the bounding box of svg element
     * @param dom svg element needs to calculate the bounding box
     */
    static boundingBox(dom: SVGGraphicsElement): JSMovinLayer;
    /**
     * create the same shape of svg path
     * @param dom svg path element represent the shape
     */
    static shape(dom: SVGPathElement): JSMovinLayer;
    /**
     * create a rectangle
     * @param left left of rect
     * @param top top of rect
     * @param width width of rect
     * @param height height of rect
     */
    static rect(left: number, top: number, width: number, height: number): JSMovinLayer;
    /**
     * create a ellipse
     * @param cx x center of ellipse
     * @param cy y center of ellipse
     * @param rx x radius of ellipse
     * @param ry y radius of ellipse
     */
    static ellipse(cx: number, cy: number, rx: number, ry: number): JSMovinLayer;
    /**
     * make a layer by asset ID
     * @param id asset reference ID
     */
    static ref(id: ReferenceID): JSMovinLayer;
    /**
     * make a complex layer by an arbitrary svg element
     * @param dom svg element need to be parsed
     * @param assetList a list contains image/layer asset
     * @param fontList a list contains font asset
     */
    static hierarchy(dom: SVGGraphicsElement, assetList: Assets, fontList: Fonts): JSMovinLayer;
}
export {};
