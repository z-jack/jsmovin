export declare function calculateBaseTransform(dom: SVGGraphicsElement, root: SVGGraphicsElement): DOMMatrix;
export declare function getBoundingBox(dom: SVGGraphicsElement): [number, number, number, number];
export declare function getLeafNodes(master: SVGGraphicsElement): SVGGraphicsElement[];
export declare function getBaselineHeight(dom: SVGTextElement): number;
export declare function encodeLineCap(type?: string | null): number;
export declare function encodeLineJoin(type?: string | null): number;
export declare function encodeTextAnchor(type?: string | null): number;
