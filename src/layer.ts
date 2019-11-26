import { ShapeLayer, TextLayer, ImageLayer, Transform, Assets, Fonts } from './animation'
import { EasingFunction, EasingFactory } from './easing'
import { renderText, render, renderImage, renderPlainGlyph } from './render';

type SetableKeys = "scaleX" | "scaleY" | "anchorX" | "anchorY" | "x" | "y" | "rotate" | "opacity" | 'shape' | 'fillColor' | 'trim' | 'strokeColor' | 'strokeWidth'

export class JSMovinLayer {
    public readonly root: ShapeLayer | TextLayer | ImageLayer;
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

            default:
                return 0
        }
    }
    private convertToStaticProperty(transform: Transform, key: string) {
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
    private convertToAnimatableProperty(transform: Transform, key: string) {
        if (!transform[key] || transform[key].a == 0) {
            transform[key] = {
                a: 1,
                k: []
            }
        }
    }
    private addKeyframe(transform: Transform, key: string, idx: number = -1, time: number, value: Array<any>, easing?: EasingFunction) {
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

    constructor(ref: ShapeLayer | TextLayer | ImageLayer) {
        this.root = ref
    }

    setStaticProperty(key: SetableKeys, value: any) {
        this.root.op = 1
        switch (key) {
            case 'scaleX':
                this.convertToStaticProperty(this.root.ks!, 's')
                this.root.ks!.s!.k![0] = value
                break
            case 'scaleY':
                this.convertToStaticProperty(this.root.ks!, 's')
                this.root.ks!.s!.k![1] = value
                break
            case 'anchorX':
                this.convertToStaticProperty(this.root.ks!, 'a')
                this.root.ks!.a!.k![0] = value
                break
            case 'anchorY':
                this.convertToStaticProperty(this.root.ks!, 'a')
                this.root.ks!.a!.k![1] = value
                break
            case 'x':
                this.convertToStaticProperty(this.root.ks!, 'p')
                this.root.ks!.p!.k![0] = value
                break
            case 'y':
                this.convertToStaticProperty(this.root.ks!, 'p')
                this.root.ks!.p!.k![1] = value
                break
            // case 'skew':
            //     this.convertToStaticProperty(this.root.ks!, 's')
            //     break
            // case 'skewAxis':
            //     this.convertToStaticProperty(this.root.ks!, 's')
            //     break
            case 'rotate':
                this.convertToStaticProperty(this.root.ks!, 'r')
                this.root.ks!.r!.k = value
                break
            case 'opacity':
                this.convertToStaticProperty(this.root.ks!, 'o')
                this.root.ks!.o!.k = value
                break
            default:
                console.error(key, value)
                throw new Error('Not a valid key.')
        }
    }

    setAnimatableProperty(key: SetableKeys, startFrame: number, endFrame: number, startValue: any, endValue: any, easing?: EasingFunction) {
        if (endFrame <= startFrame) {
            throw new Error('End frame should be larger than start frame.')
        }
        this.root.op = endFrame
        if (!easing) {
            easing = EasingFactory.linear()
        }
        switch (key) {
            case 'scaleX':
                this.convertToAnimatableProperty(this.root.ks!, 's')
                this.addKeyframe(this.root.ks!, 's', 0, startFrame, startValue, easing)
                this.addKeyframe(this.root.ks!, 's', 0, endFrame, endValue)
                break
            case 'scaleY':
                this.convertToAnimatableProperty(this.root.ks!, 's')
                this.addKeyframe(this.root.ks!, 's', 1, startFrame, startValue, easing)
                this.addKeyframe(this.root.ks!, 's', 1, endFrame, endValue)
                break
            case 'anchorX':
                this.convertToAnimatableProperty(this.root.ks!, 'a')
                this.addKeyframe(this.root.ks!, 'a', 0, startFrame, startValue, easing)
                this.addKeyframe(this.root.ks!, 'a', 0, endFrame, endValue)
                break
            case 'anchorY':
                this.convertToAnimatableProperty(this.root.ks!, 'a')
                this.addKeyframe(this.root.ks!, 'a', 1, startFrame, startValue, easing)
                this.addKeyframe(this.root.ks!, 'a', 1, endFrame, endValue)
                break
            case 'x':
                this.convertToAnimatableProperty(this.root.ks!, 'p')
                this.addKeyframe(this.root.ks!, 'p', 0, startFrame, startValue, easing)
                this.addKeyframe(this.root.ks!, 'p', 0, endFrame, endValue)
                break
            case 'y':
                this.convertToAnimatableProperty(this.root.ks!, 'p')
                this.addKeyframe(this.root.ks!, 'p', 1, startFrame, startValue, easing)
                this.addKeyframe(this.root.ks!, 'p', 1, endFrame, endValue)
                break
            // case 'skew':
            //     this.convertToAnimatableProperty(this.root.ks!, 's')
            //     break
            // case 'skewAxis':
            //     this.convertToAnimatableProperty(this.root.ks!, 's')
            //     break
            case 'rotate':
                this.convertToAnimatableProperty(this.root.ks!, 'r')
                this.addKeyframe(this.root.ks!, 'r', -1, startFrame, startValue, easing)
                this.addKeyframe(this.root.ks!, 'r', -1, endFrame, endValue)
                break
            case 'opacity':
                this.convertToAnimatableProperty(this.root.ks!, 'o')
                this.addKeyframe(this.root.ks!, 'o', -1, startFrame, startValue, easing)
                this.addKeyframe(this.root.ks!, 'o', -1, endFrame, endValue)
                break
            default:
                console.error(key, startFrame, endFrame, startValue, endValue, easing)
                throw new Error('Not a valid key.')
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

    private static getBoundingBox(dom: SVGGraphicsElement) {
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
        const coordinate: [number, number, number, number] = [refBBox.left - rootBBox.left, refBBox.top - rootBBox.top, refBBox.width + 1, refBBox.height + 1]
        return coordinate
    }

    static boundingBox(dom: SVGGraphicsElement) {
        const coordinate = this.getBoundingBox(dom)
        return this.rect(...coordinate)
    }

    static shape(dom: SVGPathElement) {
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
                render(dom)
            ]
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
                if (assetList) {
                    const imageLayer = layer as ImageLayer
                    const [refId, asset] = renderImage(dom as SVGImageElement)
                    imageLayer.refId = refId
                    assetList.push(asset)
                }
                break
            case 4:
                const shapeLayer = layer as ShapeLayer
                shapeLayer.shapes = []
                shapeLayer.shapes.push(render(dom))
                break
            case 5:
                const textLayer = layer as TextLayer
                const [textData, font] = renderText(dom as SVGTextElement)
                textLayer.t = textData
                fontList.list!.push(font)
                break
        }

        const movinLayer = new JSMovinLayer(layer)
        return movinLayer
    }
}