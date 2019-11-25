import { GroupShape, TextData, ReferenceID, PathShape, FillShape, StrokeShape, TransformShape, ImageAsset, Font1 } from './animation'
import { PathMaker } from './path'
import uuid from 'uuid/v4'
import { parseSVG, MoveToCommand, LineToCommand, HorizontalLineToCommand, VerticalLineToCommand, CurveToCommand, QuadraticCurveToCommand, EllipticalArcCommand } from 'svg-path-parser'


export function render(dom: SVGGraphicsElement): GroupShape {
    if (dom instanceof SVGTextElement || dom instanceof SVGImageElement) {
        return {}
    } else if (dom instanceof SVGGElement) {
        return renderGroup(dom)
    } else {
        return renderGlyph(dom)
    }
}

function encodeLineCap(type?: string | null): number {
    switch (type) {
        case 'square':
            return 3
        case 'butt':
            return 1
        default:
            return 2
    }
}

function encodeLineJoin(type?: string | null): number {
    switch (type) {
        case 'miter':
            return 1
        case 'bevel':
            return 3
        default:
            return 2
    }
}

type VisualGroupItem = PathShape | FillShape | StrokeShape | TransformShape

function addVisualEncodings(items: VisualGroupItem[], styles: CSSStyleDeclaration) {
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
    items.push({
        ty: "tr",
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
    })
}

function renderGlyph(dom: SVGGraphicsElement): GroupShape {
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
        addVisualEncodings(group.it! as VisualGroupItem[], styles)
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
    return group
}

function renderGroup(dom: SVGGElement): GroupShape {
    let group: GroupShape = {
        ty: 'gr',
        it: [],
        nm: dom.id,
        bm: 0,
        hd: false
    }
    dom.childNodes.forEach(node => {
        if (node instanceof SVGGraphicsElement) {
            let child = render(node)
            if (child.ty) {
                group.it!.push(child)
            }
        }
    })
    return group
}

export function renderText(dom: SVGTextElement): [TextData, Font1] {
    const computedStyle = getComputedStyle(dom)
    const fontSize = parseFloat(computedStyle.fontSize),
        fontFamily = computedStyle.fontFamily.split(',')[0].trim(),
        fontStyle = computedStyle.fontStyle,
        fontName = `${fontFamily}-${fontStyle}`,
        fontAscent = parseFloat(computedStyle.lineHeight || `${fontSize}`),
        fontColor = (computedStyle.color || 'rgb(0,0,0)').split('(')[1].split(')')[0].split(',').map(i => parseInt(i) / 255)
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
                        lh: fontAscent,
                        ls: 0,
                        fc: fontColor
                    }
                }
            ]
        },
        p: {},
        m: {},
        a: []
    }
    const fontDef: Font1 = {
        origin: 0,
        fPath: '',
        fClass: '',
        fFamily: fontFamily,
        fWeight: '',
        fStyle: fontStyle,
        fName: fontName,
        ascent: fontAscent
    }
    return [textData, fontDef]
}

export function renderImage(dom: SVGImageElement): [ReferenceID, ImageAsset] {
    const id = uuid()
    const domHeightVal = dom.height.baseVal
    domHeightVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX)
    const domWidthVal = dom.width.baseVal
    domWidthVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = domWidthVal.valueInSpecifiedUnits
    canvas.height = domHeightVal.valueInSpecifiedUnits
    ctx!.drawImage(dom, 0, 0)

    const dataUrl = canvas.toDataURL()
    const asset = {
        h: domHeightVal.valueInSpecifiedUnits,
        w: domWidthVal.valueInSpecifiedUnits,
        id: uuid(),
        u: dataUrl,
        e: 1
    }
    return [id, asset]
}