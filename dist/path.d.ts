import { PathDef } from './animation';
export declare class PathMaker {
    path: PathDef;
    currentX: number;
    currentY: number;
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    lineToRelative(x: number, y: number): void;
    horizontalTo(x: number): void;
    horizontalToRelative(x: number): void;
    verticalTo(y: number): void;
    verticalToRelative(y: number): void;
    cubicBezierCurveTo(c1x: number, c1y: number, c2x: number, c2y: number, x: number, y: number): void;
    cubicBezierCurveToRelative(c1x: number, c1y: number, c2x: number, c2y: number, x: number, y: number): void;
    quadraticBezierCurveTo(cx: number, cy: number, x: number, y: number): void;
    quadraticBezierCurveToRelative(cx: number, cy: number, x: number, y: number): void;
    arcTo(rx: number, ry: number, xAxisRotation: number, largeArcFlag: number, sweepFlag: number, x: number, y: number): void;
    arcToRelative(rx: number, ry: number, xAxisRotation: number, largeArcFlag: number, sweepFlag: number, x: number, y: number): void;
    private static a2c;
    closePath(): void;
    uniform(): void;
}
