import { Animation, ShapeLayer, ImageLayer, TextLayer, Transform } from "./animation";
import { JSMovinLayer, LayerFactory } from './layer'
import { render, renderImage, renderText } from './render'

export default class JSMovin {
    private root: Animation;
    private addProperty(obj: any, key: string | symbol, value: any) {
        Object.defineProperty(obj, key, { value, writable: true, enumerable: false })
    }

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

    addLayer(domOrLayer: SVGGraphicsElement | JSMovinLayer): JSMovinLayer {
        let layer: JSMovinLayer;
        if (domOrLayer instanceof SVGGraphicsElement) {
            layer = LayerFactory.hierarchy(domOrLayer, this.root.assets!, this.root.fonts!)
        } else {
            layer = domOrLayer
        }
        this.root.layers!.push(layer.root)
        return layer
    }

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
    }

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

    clearLayers() {
        this.root.layers = []
    }

    uniform() {
        let maxTime = this.root.layers!.reduce((p, v) => p < v.op! ? v.op! : p, 0)
        this.root.op = maxTime
        this.root.layers!.forEach(layer => layer.op = maxTime)
    }

    toObject() {
        this.uniform()
        return JSON.parse(this.toJSON())
    }

    toJSON() {
        this.uniform()
        return JSON.stringify(this.root)
    }
}

export { LayerFactory } from './layer'
export { EasingFactory } from './easing'
export enum MaskType {
    Alpha = 1,
    InvertAlpha = 2,
    Luma = 3,
    InvertLuma = 4
}