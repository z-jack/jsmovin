import { GroupShape, TextData, ReferenceID, PathShape, FillShape, StrokeShape, TransformShape, ImageAsset, Font1, Fonts, Assets } from './animation'
import { PathMaker } from './path'
import uuid from 'uuid/v4'
import { parseSVG, MoveToCommand, LineToCommand, HorizontalLineToCommand, VerticalLineToCommand, CurveToCommand, QuadraticCurveToCommand, EllipticalArcCommand } from 'svg-path-parser'
import { calculateBaseTransform, encodeLineJoin, encodeLineCap } from './helper'


export function render(dom: SVGGraphicsElement, baseDom?: SVGGraphicsElement): GroupShape[] {
    if (dom instanceof SVGTextElement || dom instanceof SVGImageElement) {
        return []
    } else if (dom instanceof SVGGElement) {
        return renderGroup(dom, baseDom)
    } else {
        return renderGlyph(dom, baseDom)
    }
}

type VisualGroupItem = PathShape | FillShape | StrokeShape | TransformShape

function addVisualEncodings(items: VisualGroupItem[], styles: CSSStyleDeclaration, dom?: SVGGraphicsElement, baseDom?: SVGGraphicsElement) {
    if (styles.stroke && styles.stroke !== 'none') {
        items.push({
            ty: 'st',
            c: {
                k: styles.stroke!.split('(')[1].split(')')[0].split(',').slice(0, 3).map((raw: string) => parseInt(raw) / 255).concat(1)
            },
            o: {
                k: parseFloat(styles.strokeOpacity || '1') * 100
            },
            w: {
                k: parseFloat(styles.strokeWidth || '1')
            },
            lc: encodeLineCap(styles.strokeLinecap),
            lj: encodeLineJoin(styles.strokeLinejoin)
        })
    }
    if (styles.fill && styles.fill !== 'none') {
        items.push({
            ty: 'fl',
            c: {
                k: styles.fill!.split('(')[1].split(')')[0].split(',').slice(0, 3).map((raw: string) => parseInt(raw) / 255).concat(1)
            },
            o: {
                k: parseFloat(styles.fillOpacity || '1') * 100
            }
        })
    }
    let posX = 0, posY = 0
    if (dom && baseDom) {
        const baseTransform = calculateBaseTransform(dom, baseDom)
        const baseBBox = baseDom.getBBox()
        const refBBox = dom.getBBox()
        posX = baseTransform.e + refBBox.x - baseBBox.x
        posY = baseTransform.f + refBBox.y - baseBBox.y
    }
    items.push({
        ty: "tr",
        p: {
            k: [
                posX,
                posY
            ]
        },
        a: {
            k: [
                0,
                0
            ]
        },
        s: {
            k: [
                100,
                100
            ]
        },
        r: {
            k: 0
        },
        o: {
            k: parseFloat(styles.opacity || '1') * 100
        },
        sk: {
            k: 0
        },
        sa: {
            k: 0
        }
    })

}

function renderGlyph(dom: SVGGraphicsElement, baseDom?: SVGGraphicsElement): GroupShape[] {
    const group: GroupShape = {
        ty: "gr",
        it: [],
        bm: 0,
        hd: false
    }
    const postActions = (pathMaker: PathMaker) => {
        pathMaker.uniform()
        group.it!.push({
            ty: 'sh',
            ks: {
                k: pathMaker.path,
                a: 0
            },
            nm: dom.id,
            hd: false
        })
        const styles = window.getComputedStyle(dom)
        addVisualEncodings(group.it! as VisualGroupItem[], styles, dom, baseDom)
    }
    if (dom instanceof SVGCircleElement) {
        const svgLength = dom.r.baseVal
        svgLength.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX)
        const r = svgLength.valueInSpecifiedUnits
        const pathMaker = new PathMaker()
        pathMaker.moveTo(r, 0)
        pathMaker.arcTo(r, r, 0, 1, 0, r, 2 * r)
        pathMaker.arcTo(r, r, 0, 1, 0, r, 0)
        pathMaker.closePath()
        postActions(pathMaker)
    } else if (dom instanceof SVGEllipseElement) {
        const mapKey: ('rx' | 'ry')[] = ['rx', 'ry']
        const [rx, ry] = mapKey.map(key => {
            const svgLength = dom[key].baseVal
            svgLength.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX)
            return svgLength.valueInSpecifiedUnits
        })
        const pathMaker = new PathMaker()
        pathMaker.moveTo(rx, 0)
        pathMaker.arcTo(rx, ry, 0, 1, 0, rx, 2 * ry)
        pathMaker.arcTo(rx, ry, 0, 1, 0, rx, 0)
        pathMaker.closePath()
        postActions(pathMaker)
    } else if (dom instanceof SVGLineElement) {
        const mapKey: ('x1' | 'x2' | 'y1' | 'y2')[] = ['x1', 'x2', 'y1', 'y2']
        const [x1, x2, y1, y2] = mapKey.map(key => {
            const svgLength = dom[key].baseVal
            svgLength.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX)
            return svgLength.valueInSpecifiedUnits
        })
        const offsetX = Math.min(x1, x2)
        const offsetY = Math.min(y1, y2)
        const pathMaker = new PathMaker()
        pathMaker.moveTo(x1 - offsetX, y1 - offsetY)
        pathMaker.lineTo(x2 - offsetX, y2 - offsetY)
        postActions(pathMaker)
    } else if (dom instanceof SVGPathElement) {
        const pathData = dom.getAttribute('d') || ''
        const pathDataSeries = parseSVG(pathData)
        const pathMaker = new PathMaker()
        let pathDataWithType;
        pathDataSeries.forEach(pathDataItem => {
            switch (pathDataItem.code) {
                case 'M':
                    pathDataWithType = pathDataItem as MoveToCommand
                    pathMaker.moveTo(pathDataWithType.x, pathDataWithType.y)
                    break
                case 'L':
                    pathDataWithType = pathDataItem as LineToCommand
                    pathMaker.lineTo(pathDataWithType.x, pathDataWithType.y)
                    break
                case 'l':
                    pathDataWithType = pathDataItem as LineToCommand
                    pathMaker.lineToRelative(pathDataWithType.x, pathDataWithType.y)
                    break
                case 'H':
                    pathDataWithType = pathDataItem as HorizontalLineToCommand
                    pathMaker.horizontalTo(pathDataWithType.x)
                    break
                case 'h':
                    pathDataWithType = pathDataItem as HorizontalLineToCommand
                    pathMaker.horizontalToRelative(pathDataWithType.x)
                    break
                case 'V':
                    pathDataWithType = pathDataItem as VerticalLineToCommand
                    pathMaker.verticalTo(pathDataWithType.y)
                    break
                case 'v':
                    pathDataWithType = pathDataItem as VerticalLineToCommand
                    pathMaker.verticalToRelative(pathDataWithType.y)
                    break
                case 'C':
                    pathDataWithType = pathDataItem as CurveToCommand
                    pathMaker.cubicBezierCurveTo(pathDataWithType.x1, pathDataWithType.y1, pathDataWithType.x2, pathDataWithType.y2, pathDataWithType.x, pathDataWithType.y)
                    break
                case 'c':
                    pathDataWithType = pathDataItem as CurveToCommand
                    pathMaker.cubicBezierCurveToRelative(pathDataWithType.x1, pathDataWithType.y1, pathDataWithType.x2, pathDataWithType.y2, pathDataWithType.x, pathDataWithType.y)
                    break
                case 'Q':
                    pathDataWithType = pathDataItem as QuadraticCurveToCommand
                    pathMaker.quadraticBezierCurveTo(pathDataWithType.x1, pathDataWithType.y1, pathDataWithType.x, pathDataWithType.y)
                    break
                case 'q':
                    pathDataWithType = pathDataItem as QuadraticCurveToCommand
                    pathMaker.quadraticBezierCurveToRelative(pathDataWithType.x1, pathDataWithType.y1, pathDataWithType.x, pathDataWithType.y)
                    break
                case 'A':
                    pathDataWithType = pathDataItem as EllipticalArcCommand
                    pathMaker.arcTo(pathDataWithType.rx, pathDataWithType.ry, pathDataWithType.xAxisRotation, ~~pathDataWithType.largeArc, ~~pathDataWithType.sweep, pathDataWithType.x, pathDataWithType.y)
                    break
                case 'a':
                    pathDataWithType = pathDataItem as EllipticalArcCommand
                    pathMaker.arcToRelative(pathDataWithType.rx, pathDataWithType.ry, pathDataWithType.xAxisRotation, ~~pathDataWithType.largeArc, ~~pathDataWithType.sweep, pathDataWithType.x, pathDataWithType.y)
                    break
                case 'Z':
                case 'z':
                    pathMaker.closePath()
                    break
                default:
                    console.error(pathDataItem)
                    throw new Error('No implementation found for this path command.')
            }
        })
        postActions(pathMaker)
    } else if (dom instanceof SVGPolygonElement || dom instanceof SVGPolylineElement) {
        const points = dom.points
        if (points.length) {
            const iterablePoints: DOMPoint[] = Array.prototype.slice.call(points)
            const offsetX = iterablePoints.reduce((p, v) => Math.min(p, v.x), 0)
            const offsetY = iterablePoints.reduce((p, v) => Math.min(p, v.y), 0)
            const pathMaker = new PathMaker()
            pathMaker.moveTo(points[0].x - offsetX, points[0].y - offsetY)
            iterablePoints.forEach((v, i) => {
                if (i <= 0) return
                pathMaker.lineTo(v.x - offsetX, v.y - offsetY)
            })
            if (dom instanceof SVGPolygonElement) {
                pathMaker.closePath()
            }
            postActions(pathMaker)
        }
    } else if (dom instanceof SVGRectElement) {
        const mapKey: ('width' | 'height')[] = ['width', 'height']
        const [width, height] = mapKey.map(key => {
            const svgLength = dom[key].baseVal
            svgLength.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX)
            return svgLength.valueInSpecifiedUnits
        })
        const pathMaker = new PathMaker()
        pathMaker.moveTo(0, 0)
        pathMaker.lineTo(width, 0)
        pathMaker.lineTo(width, height)
        pathMaker.lineTo(0, height)
        pathMaker.closePath()
        postActions(pathMaker)
    } else {
        console.error(dom)
        throw new Error('No implementation found for svg graphics element.')
    }
    return [group]
}

function renderGroup(dom: SVGGElement, baseDom?: SVGGraphicsElement): GroupShape[] {
    let items: GroupShape[] = []
    dom.childNodes.forEach(node => {
        if (node instanceof SVGGraphicsElement) {
            items = render(node, baseDom || dom).concat(items)
        }
    })
    return items
}

export function renderPlainGlyph(type: 'rect' | 'ellipse', args: number[]): GroupShape {
    const group: GroupShape = {
        ty: "gr",
        it: [
            {
                ty: 'sh',
                ks: {
                    k: null,
                    a: 0
                },
                hd: false
            },
            {
                ty: 'st',
                c: {
                    k: [1, 1, 1, 1]
                },
                w: {
                    k: 1
                },
                o: {
                    k: 100
                },
                lc: {
                    k: encodeLineCap('butt')
                },
                lj: {
                    k: encodeLineJoin('miter')
                }
            },
            {
                ty: 'fl',
                c: {
                    k: [1, 1, 1, 1]
                },
                o: {
                    k: 100
                }
            },
            {
                ty: 'tr',
                p: {
                    k: [
                        0,
                        0
                    ]
                },
                a: {
                    k: [
                        0,
                        0
                    ]
                },
                s: {
                    k: [
                        100,
                        100
                    ]
                },
                r: {
                    k: 0
                },
                o: {
                    k: 100
                },
                sk: {
                    k: 0
                },
                sa: {
                    k: 0
                }
            }
        ],
        bm: 0,
        hd: false
    }
    const pathMaker = new PathMaker()
    switch (type) {
        case 'rect':
            pathMaker.moveTo(0, 0)
            pathMaker.lineTo(args[0], 0)
            pathMaker.lineTo(args[0], args[1])
            pathMaker.lineTo(0, args[1])
            pathMaker.closePath()
            break
        case 'ellipse':
            pathMaker.moveTo(args[0], 0)
            pathMaker.arcTo(args[0], args[1], 0, 1, 0, args[0], 2 * args[1])
            pathMaker.arcTo(args[0], args[1], 0, 1, 0, args[0], 0)
            pathMaker.closePath()
    }
    pathMaker.uniform();
    (group.it![0] as PathShape).ks!.k = pathMaker.path
    return group
}

export function renderText(dom: SVGTextElement, fontList?: Fonts): [TextData, Font1] {
    const computedStyle = getComputedStyle(dom)
    const fontSize = parseFloat(computedStyle.fontSize),
        fontFamily = computedStyle.fontFamily.split(',')[0].trim(),
        fontStyle = computedStyle.fontStyle,
        fontWeight = computedStyle.fontWeight,
        fontColor = (computedStyle.color || 'rgb(0,0,0)').split('(')[1].split(')')[0].split(',').map(i => parseInt(i) / 255)
    let fontName = uuid()
    if (fontList) {
        const fontExist = fontList.list!.filter(font => font.fFamily == fontFamily && font.fStyle == fontStyle && font.fWeight == fontWeight)
        if (fontExist.length)
            fontName = fontExist[0].fName!
    }
    const textData: TextData = {
        d: {
            k: [
                {
                    t: 0,
                    s: {
                        s: fontSize,
                        f: fontName,
                        t: dom.innerHTML,
                        j: 0,
                        tr: 0,
                        ls: 0,
                        fc: fontColor
                    }
                }
            ]
        },
        p: {},
        m: {
            a: {
                k: [
                    0,
                    0
                ]
            }
        },
        a: []
    }
    const fontDef: Font1 = {
        fFamily: fontFamily,
        fWeight: `${fontWeight}`,
        fStyle: fontStyle,
        fName: fontName
    }
    return [textData, fontDef]
}

export function renderImage(dom: SVGImageElement, assetList?: Assets): [ReferenceID, ImageAsset] {
    let id = uuid()
    const domHeightVal = dom.height.baseVal
    domHeightVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX)
    const domWidthVal = dom.width.baseVal
    domWidthVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = domWidthVal.valueInSpecifiedUnits * 3
    canvas.height = domHeightVal.valueInSpecifiedUnits * 3
    ctx!.drawImage(dom, 0, 0, canvas.width, canvas.height)

    const dataUrl = canvas.toDataURL()
    if (assetList) {
        const assetExist = assetList!.filter(asset => asset.p == dataUrl)
        if (assetExist.length)
            id = assetExist[0].id!
    }
    const asset = {
        h: domHeightVal.valueInSpecifiedUnits,
        w: domWidthVal.valueInSpecifiedUnits,
        id,
        p: dataUrl,
        e: 1
    }
    return [id, asset]
}