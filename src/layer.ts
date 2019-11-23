import { ShapeLayer, TextLayer, ImageLayer, Transform } from './animation'
import { EasingFunction } from './easing'
import { renderText, render, renderImage } from './render';

type SetableKeys = "width" | "height" | "anchorX" | "anchorY" | "x" | "y" | "skewX" | "skewY" | "rotate" | "opacity" | "value"

export class JSMovinLayer {
    public readonly root: ShapeLayer | TextLayer | ImageLayer;

    constructor(ref: ShapeLayer | TextLayer | ImageLayer) {
        this.root = ref
    }

    setStaticProperty(key: SetableKeys, value: any) {

    }

    setAnimatableProperty(key: SetableKeys, startFrame: number, endFrame: number, startValue: any, endValue: any, easing?: EasingFunction) {

    }
}

export class LayerFactory {
    private static generateTransform(coordinate: number[]): Transform {
        return {
            o: {
                a: 0,
                k: 100
            },
            r: {
                a: 0,
                k: 0
            },
            p: {
                a: 0,
                k: [
                    coordinate[0],
                    coordinate[1],
                    0
                ]
            },
            a: {
                a: 0,
                k: [
                    0,
                    0,
                    0
                ]
            },
            s: {
                a: 0,
                k: [
                    100,
                    100,
                    100
                ]
            }
        }
    }

    private static getBoundingBox(dom:SVGGraphicsElement){
        let svgRoot: SVGElement = dom
        while (true) {
            if (svgRoot.parentElement instanceof SVGGraphicsElement) {
                svgRoot = svgRoot.parentElement
            } else {
                break
            }
        }
        const rootBBox = svgRoot.getBoundingClientRect()
        const refBBox = dom.getBoundingClientRect()
        const coordinate = [refBBox.left - rootBBox.left, refBBox.top - rootBBox.top, refBBox.width + 1, refBBox.height + 1]
        return coordinate
    }

    static boundingBox(dom: SVGGraphicsElement) {
        const coordinate = this.getBoundingBox(dom)
        const layer: ShapeLayer = {
            ty: 4,
            ddd: 0,
            sr: 1,
            ao: 0,
            ks: this.generateTransform(coordinate),
            ip: 0,
            op: 1,
            st: 0,
            bm: 0,
            shapes: [
                
            ]
        }
        return new JSMovinLayer({})
    }

    static shape(dom: SVGPathElement) {
        return new JSMovinLayer({})
    }

    static rect(left: number, top: number, width: number, height: number) {

    }

    static ellipse(cx: number, cy: number, rx: number, ry: number, rotate: number) {

    }

    static hierarchy(dom: SVGGraphicsElement) {
        const coordinate = this.getBoundingBox(dom)
        let domType: 2 | 4 | 5;
        if (dom instanceof SVGTextElement) {
            domType = 5
        } else if (dom instanceof SVGImageElement) {
            domType = 2
        } else {
            domType = 4
        }
        const layer: ShapeLayer | ImageLayer | TextLayer = {
            ty: domType,
            ddd: 0,
            sr: 1,
            ao: 0,
            ks: this.generateTransform(coordinate),
            ip: 0,
            op: 1,
            st: 0,
            bm: 0
        }
        switch (domType) {
            case 2:
                const imageLayer = layer as ImageLayer
                imageLayer.refId = renderImage(dom as SVGImageElement)
                break
            case 4:
                const shapeLayer = layer as ShapeLayer
                shapeLayer.shapes = []
                shapeLayer.shapes.push(render(dom))
                break
            case 5:
                const textLayer = layer as TextLayer
                textLayer.t = renderText(dom as SVGTextElement)
                break
        }
        
        const movinLayer = new JSMovinLayer(layer)
        return movinLayer
    }
}