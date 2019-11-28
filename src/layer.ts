import { ShapeLayer, TextLayer, ImageLayer, Transform, Assets, Fonts, GroupShape, PreCompLayer } from './animation'
import { EasingFunction, EasingFactory } from './easing'
import { renderText, render, renderImage, renderPlainGlyph } from './render';
import { getBoundingBox, getLeafNodes } from './helper'
import uuid from 'uuid/v4';

type SetableKeys = "scaleX" | "scaleY" | "anchorX" | "anchorY" | "x" | "y" | "rotate" | "opacity" | 'shape' | 'fillColor' | 'trimStart' | 'trimEnd' | 'trimOffset' | 'strokeColor' | 'strokeWidth' | 'text'

export class JSMovinLayer {
    public readonly root: ShapeLayer | TextLayer | ImageLayer | PreCompLayer;
    private getDefaultProperty(key: string) {
        switch (key) {
            case 'a':
            case 'p':
                return [0, 0, 0]
            case 's':
                return [100, 100, 100]
            case 'o':
                return 100
            case 'r':
                return 0
            case 'tm':
                return {
                    s: {
                        k: [0]
                    },
                    e: {
                        k: [100]
                    },
                    o: {
                        k: [0]
                    }
                }
            default:
                return 0
        }
    }
    private convertToStaticProperty(transform: any, key: string) {
        if (!transform[key]) {
            transform[key] = {
                a: 0,
                k: this.getDefaultProperty(key)
            }
        }
        if (transform[key].a == 1) {
            const staticValue = transform[key].k[0].s
            transform[key] = {
                a: 0,
                k: staticValue
            }
        }
    }
    private convertToAnimatableProperty(transform: any, key: string) {
        if (!transform[key] || transform[key].a == 0) {
            transform[key] = {
                a: 1,
                k: []
            }
        }
    }
    private addKeyframe(transform: any, key: string, idx: number = -1, time: number, value: Array<any>, easing?: EasingFunction) {
        const existKeyframe = transform[key].k.filter((x: any) => x.t == time) as any[]
        let readyToSet;
        if (existKeyframe.length) {
            readyToSet = existKeyframe[0]
        } else {
            readyToSet = {
                t: time,
                s: this.getDefaultProperty(key)
            }
            const previousKeyframeCount = transform[key].k.reduce((p: number, x: any) => x.t < time ? p + 1 : p, 0)
            transform[key].k.splice(previousKeyframeCount, 0, readyToSet)
        }
        if (easing) {
            readyToSet.o = {
                x: easing[0][0],
                y: easing[0][1]
            }
            readyToSet.i = {
                x: easing[1][0],
                y: easing[1][1]
            }
        }
        if (idx >= 0) {
            readyToSet.s[idx] = value
        } else {
            readyToSet.s = [value]
        }
    }
    private findPropertyConfig(key: string) {
        return ((this.root as ShapeLayer).shapes![0] as GroupShape).it!.find(shape =>
            shape.ty == key
        )
    }
    private findOrInsertPropertyConfig(key: string) {
        const find = this.findPropertyConfig(key)
        if (find) return find
        const hasTransform = this.findPropertyConfig('tr')
        if (hasTransform) {
            const groupShapes = ((this.root as ShapeLayer).shapes![0] as GroupShape).it!
            groupShapes.splice(groupShapes.length - 1, 0, {
                ty: key,
                ...this.getDefaultProperty(key) as object
            })
        } else {
            ((this.root as ShapeLayer).shapes![0] as GroupShape).it!.push({
                ty: key,
                ...this.getDefaultProperty(key) as object
            })
        }
    }
    private commonPropertyMapping(key: SetableKeys): [any, string | undefined, number | undefined] {
        let base: any, k: string | undefined, index: number | undefined
        switch (key) {
            case 'scaleX':
                base = this.root.ks
                k = 's'
                index = 0
                break
            case 'scaleY':
                base = this.root.ks
                k = 's'
                index = 1
                break
            case 'anchorX':
                base = this.root.ks
                k = 'a'
                index = 0
                break
            case 'anchorY':
                base = this.root.ks
                k = 'a'
                index = 1
                break
            case 'x':
                base = this.root.ks
                k = 'p'
                index = 0
                break
            case 'y':
                base = this.root.ks
                k = 'p'
                index = 1
                break
            case 'rotate':
                base = this.root.ks
                k = 'r'
                index = -1
                break
            case 'opacity':
                base = this.root.ks
                k = 'o'
                index = -1
                break
            case 'trimStart':
                base = this.findOrInsertPropertyConfig('tm')
                k = 's'
                index = -1
                break
            case 'trimEnd':
                base = this.findOrInsertPropertyConfig('tm')
                k = 'e'
                index = -1
                break
            case 'trimOffset':
                base = this.findOrInsertPropertyConfig('tm')
                k = 'o'
                index = -1
                break
            case 'fillColor':
                base = this.findPropertyConfig('fl')
                k = 'c'
                index = -1
                break
            case 'strokeColor':
                base = this.findPropertyConfig('st')
                k = 'c'
                index = -1
                break
            case 'strokeWidth':
                base = this.findPropertyConfig('st')
                k = 'w'
                index = -1
                break
            case 'shape':
                base = this.findPropertyConfig('sh')
                k = 'ks'
                index = -1
                break
        }
        return [base, k, index]
    }

    constructor(ref: ShapeLayer | TextLayer | ImageLayer | PreCompLayer) {
        this.root = ref
    }

    setStaticProperty(key: SetableKeys, value: any) {
        this.root.op = 1
        let base: any, k: string | undefined, index: number | undefined
        [base, k, index] = this.commonPropertyMapping(key)
        if (!k || index === undefined) {
            switch (key) {
                case 'text':
                    if (this.root.ty == 5) {
                        const doc = this.root.t!.d!
                        doc.k = [doc.k![0]]
                        doc.k[0].t = 0
                        doc.k[0].s!.t = value
                    }
                    break
                default:
                    console.error(key, value)
                    throw new Error('Not a valid key.')
            }
        }
        if (base && k && index !== undefined) {
            this.convertToStaticProperty(base, k)
            if (index >= 0)
                base[k].k[index] = value
            else
                base[k].k = value
        }
    }

    setAnimatableProperty(key: SetableKeys, startFrame: number, endFrame: number, startValue: any, endValue: any, easing?: EasingFunction) {
        if (endFrame <= startFrame) {
            throw new Error('End frame should be larger than start frame.')
        }
        this.root.op = endFrame + 1
        if (!easing) {
            easing = EasingFactory.linear()
        }
        let base: any, k: string | undefined, index: number | undefined
        [base, k, index] = this.commonPropertyMapping(key)
        if (!k || index === undefined) {
            switch (key) {
                case 'text':
                    if (this.root.ty == 5) {
                        base = this.root.t!.d
                        let textProp = base.k[0].s
                        let tmpStartValue = JSON.parse(JSON.stringify(textProp))
                        let tmpEndValue = JSON.parse(JSON.stringify(textProp))
                        tmpStartValue.t = startValue
                        tmpEndValue.t = endValue
                        startValue = tmpStartValue
                        endValue = tmpEndValue
                        k = 'k'
                        index = -1
                    }
                    break
                default:
                    console.error(key, startFrame, endFrame, startValue, endValue, easing)
                    throw new Error('Not a valid key.')
            }
        }
        if (base && k && index !== undefined) {
            this.convertToAnimatableProperty(base, k)
            this.addKeyframe(base, k, index, startFrame, startValue, easing)
            this.addKeyframe(base, k, index, endFrame, endValue)
        }
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

    static boundingBox(dom: SVGGraphicsElement) {
        const boundingBox = getBoundingBox(dom).map((v, i) => i < 2 ? v - 1 : v + 1) as [number, number, number, number]
        return this.rect(...boundingBox)
    }

    static shape(dom: SVGPathElement) {
        const coordinate = getBoundingBox(dom)
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
            shapes: render(dom)

        }
        return new JSMovinLayer(layer)
    }

    static rect(left: number, top: number, width: number, height: number) {
        const layer: ShapeLayer = {
            ty: 4,
            ddd: 0,
            sr: 1,
            ao: 0,
            ks: this.generateTransform([left, top, width, height]),
            ip: 0,
            op: 1,
            st: 0,
            bm: 0,
            shapes: [
                renderPlainGlyph('rect', [width, height])
            ]
        }
        return new JSMovinLayer(layer)
    }

    static ellipse(cx: number, cy: number, rx: number, ry: number) {
        const layer: ShapeLayer = {
            ty: 4,
            ddd: 0,
            sr: 1,
            ao: 0,
            ks: this.generateTransform([cx - rx, cy - ry, 2 * rx, 2 * ry]),
            ip: 0,
            op: 1,
            st: 0,
            bm: 0,
            shapes: [
                renderPlainGlyph('ellipse', [rx, ry])
            ]
        }
        return new JSMovinLayer(layer)
    }

    static hierarchy(dom: SVGGraphicsElement, assetList: Assets, fontList: Fonts) {
        const coordinate = getBoundingBox(dom)
        let domType: 2 | 4 | 5 | 0;
        if (dom instanceof SVGTextElement) {
            domType = 5
        } else if (dom instanceof SVGImageElement) {
            domType = 2
        } else if (dom instanceof SVGGElement) {
            domType = 0
        } else {
            domType = 4
        }
        const layer: ShapeLayer | ImageLayer | TextLayer | PreCompLayer = {
            ty: domType,
            ddd: 0,
            sr: 1,
            ao: 0,
            ks: this.generateTransform(domType == 0 ? [0, 0, 0, 0] : coordinate),
            ip: 0,
            op: 1,
            st: 0,
            bm: 0
        }
        switch (domType) {
            case 0:
                const precompLayer = layer as PreCompLayer
                const domLeaves = getLeafNodes(dom)
                const preCompAsset: JSMovinLayer[] = []
                const preCompRefId = uuid()
                domLeaves.forEach(d => {
                    if (d instanceof SVGGraphicsElement && !(d instanceof SVGGElement)) {
                        preCompAsset.unshift(this.hierarchy(d, assetList, fontList))
                    }
                })
                preCompAsset.forEach(layer => {
                    layer.root.op = 9e9
                })
                precompLayer.w = coordinate[0] + coordinate[2] + 1
                precompLayer.h = coordinate[1] + coordinate[3] + 1
                precompLayer.refId = preCompRefId
                assetList.push({
                    id: preCompRefId,
                    layers: preCompAsset.map(layer => layer.root)
                })
                break
            case 2:
                const imageLayer = layer as ImageLayer
                const [imageRefId, imageAsset] = renderImage(dom as SVGImageElement, assetList)
                imageLayer.refId = imageRefId
                if (!assetList.filter(a => a.id == imageRefId).length)
                    assetList.push(imageAsset)
                break
            case 4:
                const shapeLayer = layer as ShapeLayer
                shapeLayer.shapes = render(dom)
                break
            case 5:
                const textLayer = layer as TextLayer

                // move textLayer's anchor to left-top
                textLayer.ks!.a!.k = [0, -coordinate[3], 0]

                const [textData, font] = renderText(dom as SVGTextElement, fontList)
                textLayer.t = textData
                if (!fontList.list!.filter(f => f.fName == font.fName).length)
                    fontList.list!.push(font)
                break
        }
        const movinLayer = new JSMovinLayer(layer)
        return movinLayer
    }
}