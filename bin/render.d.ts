import { GroupShape, TextData, ReferenceID, ImageAsset, Font1 } from './animation';
export declare function render(dom: SVGGraphicsElement): GroupShape;
export declare function renderPlainGlyph(type: 'rect' | 'ellipse', args: number[]): GroupShape;
export declare function renderText(dom: SVGTextElement): [TextData, Font1];
export declare function renderImage(dom: SVGImageElement): [ReferenceID, ImageAsset];
