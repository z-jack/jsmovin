export function calculateBaseTransform(dom: SVGGraphicsElement, root: SVGGraphicsElement) {
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