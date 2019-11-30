import { ReferenceID } from "./animation";
import { JSMovinLayer } from './layer';
export default class JSMovin {
    private root;
    /**
     * @param fps number of frames per second
     * @param width width of viewport (px)
     * @param height height of viewport (px)
     */
    constructor(fps?: number, width?: number, height?: number);
    /**
     * @param fps number of frames per second
     */
    setFrameRate(fps: number): void;
    /**
     * @param width width of viewport (px)
     * @param height height of viewport (px)
     */
    setViewport(width: number, height: number): void;
    /**
     * add a simple graphical layer
     * @param domLayerOrAssetId a SVG element DOM or JSMovinLayer or asset ID needs to be inserted
     */
    addLayer(domLayerOrAssetId: SVGGraphicsElement | JSMovinLayer | ReferenceID): JSMovinLayer;
    /**
     * @param maskOrDom a SVG element DOM or JSMovinLayer to be the mask
     * @param layerRefOrIndex a JSMovinLayer or index of layer to be the masked layer
     * @param maskType which type of mask to use, use `MaskType.*` to specify
     */
    addMask(maskOrDom: JSMovinLayer | SVGGraphicsElement, layerRefOrIndex: number | JSMovinLayer, maskType?: MaskType): JSMovinLayer;
    /**
     * @param layerRefs a set of layers to be packed as an asset
     */
    makeAsset(layerRefs: JSMovinLayer[]): ReferenceID;
    /**
     * @param layerRefOrIndex a JSMovinLayer or index of layer to remove
     */
    removeLayer(layerRefOrIndex: number | JSMovinLayer): void;
    /**
     * @param layerRefOrIndex a JSMovinLayer or index of mask or masked layer to remove
     */
    removeMask(layerRefOrIndex: number | JSMovinLayer): void;
    /**
     * clear all layers
     */
    clearLayers(): void;
    /**
     * make all layers end at same time
     */
    uniform(): void;
    /**
     * export Lottie as JavaScript Object
     */
    toObject(): any;
    /**
     * export Lottie as JSON text
     */
    toJSON(): string;
}
export { LayerFactory } from './layer';
export { EasingFactory } from './easing';
export { PathMaker } from './path';
export declare enum MaskType {
    Alpha = 1,
    InvertAlpha = 2,
    Luma = 3,
    InvertLuma = 4
}
