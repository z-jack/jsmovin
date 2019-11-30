import { Animation, ShapeLayer, ReferenceID } from "./animation";
import { JSMovinLayer, LayerFactory } from './layer'
import uuid from 'uuid/v4';

export default class JSMovin {
    private root: Animation;

    /**
     * @param fps number of frames per second
     * @param width width of viewport (px)
     * @param height height of viewport (px)
     */
    constructor(fps: number = 30, width: number = 800, height: number = 600) {
        this.root = {
            fr: fps,
            w: width,
            h: height,
            ddd: 0,
            layers: [],
            assets: [],
            fonts: {
                list: []
            },
            ip: 0,
            op: 0
        }
    }

    /**
     * @param fps number of frames per second
     */
    setFrameRate(fps: number) {
        this.root.fr = fps
    }

    /**
     * @param width width of viewport (px)
     * @param height height of viewport (px)
     */
    setViewport(width: number, height: number) {
        this.root.w = width
        this.root.h = height
    }

    /**
     * add a simple graphical layer
     * @param domLayerOrAssetId a SVG element DOM or JSMovinLayer or asset ID needs to be inserted
     */
    addLayer(domLayerOrAssetId: SVGGraphicsElement | JSMovinLayer | ReferenceID): JSMovinLayer {
        let layer: JSMovinLayer;
        if (domLayerOrAssetId instanceof SVGGraphicsElement) {
            layer = LayerFactory.hierarchy(domLayerOrAssetId, this.root.assets!, this.root.fonts!)
        } else if (typeof (domLayerOrAssetId) === 'string') {
            layer = LayerFactory.ref(domLayerOrAssetId)
        }
        else {
            layer = domLayerOrAssetId
        }
        this.root.layers!.splice(0, 0, layer.root)
        return layer
    }

    /**
     * @param maskOrDom a SVG element DOM or JSMovinLayer to be the mask
     * @param layerRefOrIndex a JSMovinLayer or index of layer to be the masked layer
     * @param maskType which type of mask to use, use `MaskType.*` to specify
     */
    addMask(maskOrDom: JSMovinLayer | SVGGraphicsElement, layerRefOrIndex: number | JSMovinLayer, maskType: MaskType = MaskType.Alpha) {
        let layerRef: JSMovinLayer
        let layerIndex: number
        if (layerRefOrIndex instanceof JSMovinLayer) {
            layerRef = layerRefOrIndex
            layerIndex = this.root.layers!.indexOf(layerRef.root)
            layerRef.root.tt = maskType
        } else {
            layerIndex = layerRefOrIndex
            this.root.layers![layerIndex].tt = maskType
        }
        if (layerIndex < 0) {
            throw new Error('Given layer is not a member of this JSMovin.')
        }
        let maskLayer: JSMovinLayer
        if (maskOrDom instanceof SVGGraphicsElement) {
            maskLayer = LayerFactory.hierarchy(maskOrDom, this.root.assets!, this.root.fonts!)
        } else {
            maskLayer = maskOrDom
        }
        this.root.layers!.splice(layerIndex, 0, maskLayer.root)
        return maskLayer
    }

    /**
     * @param layerRefs a set of layers to be packed as an asset
     */
    makeAsset(layerRefs: JSMovinLayer[]): ReferenceID {
        layerRefs.forEach((layer, innerIndex) => {
            if (layer.root.tt == 1) {
                const layerIndex = this.root.layers!.indexOf(layer.root)
                if (layerIndex > 0) {
                    const mask = this.root.layers![layerIndex - 1]
                    if (innerIndex == 0 || layerRefs[innerIndex - 1].root != mask) {
                        layerRefs.splice(innerIndex, 0, new JSMovinLayer(mask as ShapeLayer))
                    }
                }
            }
        })
        layerRefs = layerRefs.map((layer, innerIndex) => {
            return {
                layer,
                innerIndex
            }
        }).sort((a, b) => {
            const aIndex = this.root.layers!.indexOf(a.layer.root)
            const bIndex = this.root.layers!.indexOf(b.layer.root)
            return (aIndex - bIndex) || (a.innerIndex - b.innerIndex)
        }).map(layerWrapper => layerWrapper.layer)
        layerRefs.forEach(layer => {
            const layerIndex = this.root.layers!.indexOf(layer.root)
            if (layerIndex > 0) {
                this.root.layers!.splice(layerIndex, 1)
            }
            layer.root.op = 9e9
        })
        const refId = uuid()
        this.root.assets!.push({
            id: refId,
            layers: layerRefs.map(layerRef => layerRef.root)
        })
        return refId
    }

    /**
     * @param layerRefOrIndex a JSMovinLayer or index of layer to remove
     */
    removeLayer(layerRefOrIndex: number | JSMovinLayer) {
        let layerRef: JSMovinLayer
        let layerIndex: number
        if (layerRefOrIndex instanceof JSMovinLayer) {
            layerRef = layerRefOrIndex
            layerIndex = this.root.layers!.indexOf(layerRef.root)
        } else {
            layerIndex = layerRefOrIndex
        }
        this.root.layers!.splice(layerIndex, 1)
    }

    /**
     * @param layerRefOrIndex a JSMovinLayer or index of mask or masked layer to remove
     */
    removeMask(layerRefOrIndex: number | JSMovinLayer) {
        let layerRef: JSMovinLayer
        let layerIndex: number
        if (layerRefOrIndex instanceof JSMovinLayer) {
            layerRef = layerRefOrIndex
            layerIndex = this.root.layers!.indexOf(layerRef.root)
        } else {
            layerIndex = layerRefOrIndex
            layerRef = new JSMovinLayer(this.root.layers![layerIndex] as ShapeLayer)
        }
        if (layerRef.root.tt) {
            layerRef.root.tt = 0
            this.root.layers!.splice(layerIndex - 1, 1)
        } else if (this.root.layers![layerIndex + 1].tt) {
            this.root.layers![layerIndex + 1].tt = 0
            this.root.layers!.splice(layerIndex, 1)
        } else {
            throw new Error('The input layer is not a mask or a masked layer.')
        }
    }

    /**
     * clear all layers
     */
    clearLayers() {
        this.root.layers = []
    }

    /**
     * make all layers end at same time
     */
    uniform() {
        let maxTime = this.root.layers!.reduce((p, v) => p < v.op! ? v.op! : p, 0)
        this.root.op = maxTime
        this.root.layers!.forEach(layer => layer.op = maxTime)
    }

    /**
     * export Lottie as JavaScript Object 
     */
    toObject() {
        this.uniform()
        return JSON.parse(this.toJSON())
    }

    /**
     * export Lottie as JSON text
     */
    toJSON() {
        this.uniform()
        return JSON.stringify(this.root)
    }
}

export { LayerFactory } from './layer'
export { EasingFactory } from './easing'
export { PathMaker } from './path'
export enum MaskType {
    Alpha = 1,
    InvertAlpha = 2,
    Luma = 3,
    InvertLuma = 4
}