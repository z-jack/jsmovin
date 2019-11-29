export function calculateBaseTransform(dom: SVGGraphicsElement, root: SVGGraphicsElement) {
    // https://github.com/dagrejs/dagre-d3/issues/202

    return root.getScreenCTM()!.inverse().multiply(dom.getScreenCTM()!)
}

export function getBoundingBox(dom: SVGGraphicsElement) {
    let svgRoot: SVGGraphicsElement = dom
    while (true) {
        if (svgRoot.parentElement instanceof SVGGraphicsElement) {
            svgRoot = svgRoot.parentElement
        } else {
            break
        }
    }
    const baseBox = calculateBaseTransform(dom, svgRoot)
    const refBBox = dom.getBBox()
    const coordinate: [number, number, number, number] = [baseBox.e + refBBox.x, baseBox.f + refBBox.y, refBBox.width + 1, refBBox.height + 1]
    return coordinate
}

export function getLeafNodes(master: SVGGraphicsElement) {
    // https://stackoverflow.com/questions/22289391/how-to-create-an-array-of-leaf-nodes-of-an-html-dom-using-javascript

    var nodes = Array.prototype.slice.call(master.getElementsByTagName("*"), 0);
    var leafNodes = nodes.filter(function (elem) {
        if (elem.hasChildNodes()) {
            // see if any of the child nodes are elements
            for (var i = 0; i < elem.childNodes.length; i++) {
                if (elem.childNodes[i].nodeType == 1) {
                    // there is a child element, so return false to not include
                    // this parent element
                    return false;
                }
            }
        }
        return true;
    });
    return leafNodes;
}

export function getBaselineHeight(dom: SVGTextElement) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const computedStyle = getComputedStyle(dom)
    const fontSettings = computedStyle.font

    ctx.font = fontSettings
    const textMetrix = ctx.measureText('ypfgj█')
    return textMetrix.actualBoundingBoxDescent || 0
}

export function encodeLineCap(type?: string | null): number {
    switch (type) {
        case 'square':
            return 3
        case 'butt':
            return 1
        default:
            return 2
    }
}

export function encodeLineJoin(type?: string | null): number {
    switch (type) {
        case 'miter':
            return 1
        case 'bevel':
            return 3
        default:
            return 2
    }
}