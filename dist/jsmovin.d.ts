import { JSMovinLayer } from './layer';
export default class JSMovin {
    private root;
    private addProperty;
    /**
     * @param fps number of frames per second
     * @param width width of viewport (px)
     * @param height height of viewport (px)
     */
    constructor(fps?: number, width?: number, height?: number);
    /**
     * @param fps number of frames per second
     */
    setFrameRate(fps: number): void;
    /**
     * @param width width of viewport (px)
     * @param height height of viewport (px)
     */
    setViewport(width: number, height: number): void;
    addLayer(domOrLayer: SVGGraphicsElement | JSMovinLayer): JSMovinLayer;
    addMask(mask: JSMovinLayer, layerRef: JSMovinLayer): void;
    uniform(): void;
    toObject(): any;
    toJSON(): string;
}
export { LayerFactory } from './layer';
export { EasingFactory } from './easing';
