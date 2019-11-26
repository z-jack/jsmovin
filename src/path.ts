import { PathDef } from './animation'

export class PathMaker {
    public path: PathDef = {
        c: false,
        i: [],
        o: [],
        v: []
    };

    private currentX: number = 0;
    private currentY: number = 0;
    private offsetX: number = Infinity;
    private offsetY: number = Infinity;

    private updateXY(x: number, y: number) {
        this.currentX = x
        this.currentY = y
        this.offsetX = Math.min(this.offsetX, x)
        this.offsetY = Math.min(this.offsetY, x)
    }

    private calculateBezierMinMax(p0: number, p1: number, p2: number, p3: number): [number, number] {
        const a = 3 * (p3 - 3 * p2 + 3 * p1 - p0)
        const b = 2 * (3 * p2 - 6 * p1 + 3 * p0)
        const c = 3 * p1
        let min = Infinity, max = -Infinity
        if (b * b - 4 * a * c >= 0) {
            const sqrt = Math.sqrt(b * b - 4 * a * c)
            const roots = [1, -1].map(multi => (multi * sqrt - b) / 2 / a)
            roots.forEach(root => {
                if (root > 0 && root < 1) {
                    const value = Math.pow(1 - root, 3) * p0 + 3 * Math.pow(1 - root, 2) * root * p1 + 3 * (1 - root) * root * root * p2 + Math.pow(root, 3) * p3
                    min = Math.min(min, value)
                    max = Math.max(max, value)
                }
            })
        }
        min = Math.min(min, p0, p3)
        max = Math.max(max, p0, p3)
        return [min, max]
    }

    public moveTo(x: number, y: number) {
        this.path.c = false
        this.path.i = [[0, 0]]
        this.path.o = []
        this.path.v = [[x, y]]
        this.currentX = x
        this.currentY = y
        this.offsetX = x
        this.offsetY = y
    }
    public lineTo(x: number, y: number) {
        this.path.i!.push([0, 0])
        this.path.o!.push([0, 0])
        this.path.v!.push([x, y])
        this.updateXY(x, y)
    }
    public lineToRelative(x: number, y: number) {
        this.lineTo(this.currentX + x, this.currentY + y)
    }
    public horizontalTo(x: number) {
        this.lineTo(x, this.currentY)
    }
    public horizontalToRelative(x: number) {
        this.horizontalTo(this.currentX + x)
    }
    public verticalTo(y: number) {
        this.lineTo(this.currentX, y)
    }
    public verticalToRelative(y: number) {
        this.verticalTo(this.currentY + y)
    }
    public cubicBezierCurveTo(
        c1x: number,
        c1y: number,
        c2x: number,
        c2y: number,
        x: number,
        y: number
    ) {
        this.path.i!.push([c2x - x, c2y - y])
        this.path.o!.push([c1x - this.currentX, c1y - this.currentY])
        this.path.v!.push([x, y])
        this.offsetX = Math.min(this.offsetX, ...this.calculateBezierMinMax(this.currentX, c1x, c2x, x))
        this.offsetY = Math.min(this.offsetY, ...this.calculateBezierMinMax(this.currentY, c1y, c2y, y))
        this.updateXY(x, y)
    }
    public cubicBezierCurveToRelative(
        c1x: number,
        c1y: number,
        c2x: number,
        c2y: number,
        x: number,
        y: number
    ) {
        this.cubicBezierCurveTo(this.currentX + c1x, this.currentY + c1y, this.currentX + c2x, this.currentY + c2y, this.currentX + x, this.currentY + y)
    }
    public quadraticBezierCurveTo(cx: number, cy: number, x: number, y: number) {
        this.path.i!.push([cx - x, cy - y])
        this.path.o!.push([cx - this.currentX, cy - this.currentY])
        this.path.v!.push([x, y])
        this.offsetX = Math.min(this.offsetX, ...this.calculateBezierMinMax(this.currentX, cx, cx, x))
        this.offsetY = Math.min(this.offsetY, ...this.calculateBezierMinMax(this.currentY, cy, cy, y))
        this.updateXY(x, y)
    }
    public quadraticBezierCurveToRelative(cx: number, cy: number, x: number, y: number) {
        this.quadraticBezierCurveTo(this.currentX + cx, this.currentY + cy, this.currentX + x, this.currentY + y)
    }
    public arcTo(
        rx: number,
        ry: number,
        xAxisRotation: number,
        largeArcFlag: number,
        sweepFlag: number,
        x: number,
        y: number
    ) {
        const cSeries = PathMaker.a2c(this.currentX, this.currentY, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y) as number[]
        while (cSeries.length >= 6) {
            const iovList = cSeries.splice(0, 6)
            this.path.i!.push([iovList[2] - iovList[4], iovList[3] - iovList[5]])
            this.path.o!.push([iovList[0] - this.currentX, iovList[1] - this.currentY])
            this.path.v!.push([iovList[4], iovList[5]])
            this.offsetX = Math.min(this.offsetX, ...this.calculateBezierMinMax(this.currentX, iovList[0], iovList[2], iovList[4]))
            this.offsetY = Math.min(this.offsetY, ...this.calculateBezierMinMax(this.currentY, iovList[1], iovList[3], iovList[5]))
            this.updateXY(iovList[4], iovList[5])
        }
    }
    public arcToRelative(
        rx: number,
        ry: number,
        xAxisRotation: number,
        largeArcFlag: number,
        sweepFlag: number,
        x: number,
        y: number
    ) {
        this.arcTo(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, this.currentX + x, this.currentY + y)
    }

    private static a2c(x1: number, y1: number, rx: number, ry: number, angle: number, large_arc_flag: number, sweep_flag: number, x2: number, y2: number, recursive?: number[]): number[] | number[][] {
        // for more information of where this Math came from visit:
        // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
        var _120 = Math.PI * 120 / 180,
            rad = Math.PI / 180 * (+angle || 0),
            res: number[] = [],
            xy,
            rotate = (x: number, y: number, rad: number) => {
                var X = x * Math.cos(rad) - y * Math.sin(rad),
                    Y = x * Math.sin(rad) + y * Math.cos(rad);
                return { x: X, y: Y };
            };
        if (!rx || !ry) {
            return [x1, y1, x2, y2, x2, y2];
        }
        if (!recursive) {
            xy = rotate(x1, y1, -rad);
            x1 = xy.x;
            y1 = xy.y;
            xy = rotate(x2, y2, -rad);
            x2 = xy.x;
            y2 = xy.y;
            var cos = Math.cos(Math.PI / 180 * angle),
                sin = Math.sin(Math.PI / 180 * angle),
                x = (x1 - x2) / 2,
                y = (y1 - y2) / 2;
            var h = x * x / (rx * rx) + y * y / (ry * ry);
            if (h > 1) {
                h = Math.sqrt(h);
                rx = h * rx;
                ry = h * ry;
            }
            var rx2 = rx * rx,
                ry2 = ry * ry,
                k = (large_arc_flag == sweep_flag ? -1 : 1) *
                    Math.sqrt(Math.abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x))),
                cx = k * rx * y / ry + (x1 + x2) / 2,
                cy = k * -ry * x / rx + (y1 + y2) / 2,
                f1 = Math.asin((y1 - cy) / ry),
                f2 = Math.asin((y2 - cy) / ry);

            f1 = x1 < cx ? Math.PI - f1 : f1;
            f2 = x2 < cx ? Math.PI - f2 : f2;
            f1 < 0 && (f1 = Math.PI * 2 + f1);
            f2 < 0 && (f2 = Math.PI * 2 + f2);
            if (sweep_flag && f1 > f2) {
                f1 = f1 - Math.PI * 2;
            }
            if (!sweep_flag && f2 > f1) {
                f2 = f2 - Math.PI * 2;
            }
        } else {
            f1 = recursive[0];
            f2 = recursive[1];
            cx = recursive[2];
            cy = recursive[3];
        }
        var df = f2 - f1;
        if (Math.abs(df) > _120) {
            var f2old = f2,
                x2old = x2,
                y2old = y2;
            f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
            x2 = cx + rx * Math.cos(f2);
            y2 = cy + ry * Math.sin(f2);
            res = this.a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]) as number[];
        }
        df = f2 - f1;
        var c1 = Math.cos(f1),
            s1 = Math.sin(f1),
            c2 = Math.cos(f2),
            s2 = Math.sin(f2),
            t = Math.tan(df / 4),
            hx = 4 / 3 * rx * t,
            hy = 4 / 3 * ry * t,
            m1 = [x1, y1],
            m2 = [x1 + hx * s1, y1 - hy * c1],
            m3 = [x2 + hx * s2, y2 - hy * c2],
            m4 = [x2, y2];
        m2[0] = 2 * m1[0] - m2[0];
        m2[1] = 2 * m1[1] - m2[1];
        if (recursive) {
            return [m2, m3, m4].concat(res);
        } else {
            res = [m2, m3, m4].concat(res).join().split(",").map(x => parseFloat(x));
            var newres = [];
            for (var i = 0, ii = res.length; i < ii; i++) {
                newres[i] = i % 2 ? rotate(res[i - 1], res[i], rad).y : rotate(res[i], res[i + 1], rad).x;
            }
            return newres;
        }
    }

    public closePath() {
        this.path.c = true
    }

    public uniform() {
        while (this.path.o!.length < this.path.i!.length)
            this.path.o!.push([0, 0])
        this.path.v!.forEach(value => {
            value[0] -= this.offsetX
            value[1] -= this.offsetY
        })
        this.offsetX = 0
        this.offsetY = 0
    }
}