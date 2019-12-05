"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PathMaker = void 0;

var _svgPathParser = require("svg-path-parser");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var PathMaker =
/*#__PURE__*/
function () {
  // for discontinuous paths
  function PathMaker(pathData) {
    _classCallCheck(this, PathMaker);

    _defineProperty(this, "path", {
      c: false,
      i: [],
      o: [],
      v: []
    });

    _defineProperty(this, "currentX", 0);

    _defineProperty(this, "currentY", 0);

    _defineProperty(this, "offsetX", Infinity);

    _defineProperty(this, "offsetY", Infinity);

    _defineProperty(this, "pathReady", false);

    _defineProperty(this, "pathStart", [0, 0]);

    _defineProperty(this, "pathChain", []);

    if (pathData) {
      this.parse(pathData);
    }
  }

  _createClass(PathMaker, [{
    key: "updateXY",
    value: function updateXY(x, y) {
      this.currentX = x;
      this.currentY = y;
      this.offsetX = Math.min(this.offsetX, x);
      this.offsetY = Math.min(this.offsetY, y);
    }
  }, {
    key: "calculateBezierMinMax",
    value: function calculateBezierMinMax(p0, p1, p2, p3) {
      var a = 3 * (p3 - 3 * p2 + 3 * p1 - p0);
      var b = 6 * (p2 - 2 * p1 + p0);
      var c = 3 * (p1 - p0);
      var min = Infinity,
          max = -Infinity;

      if (b * b - 4 * a * c >= 0) {
        var sqrt = Math.sqrt(b * b - 4 * a * c);
        var roots = [1, -1].map(function (multi) {
          return (multi * sqrt - b) / 2 / a;
        });
        roots.forEach(function (root) {
          if (root > 0 && root < 1) {
            var value = Math.pow(1 - root, 3) * p0 + 3 * Math.pow(1 - root, 2) * root * p1 + 3 * (1 - root) * root * root * p2 + Math.pow(root, 3) * p3;
            min = Math.min(min, value);
            max = Math.max(max, value);
          }
        });
      }

      min = Math.min(min, p0, p3);
      max = Math.max(max, p0, p3);
      return [min, max];
    }
  }, {
    key: "calculateHighlyOrder",
    value: function calculateHighlyOrder(arr, ratio) {
      var result = [];
      arr.forEach(function (v, i, a) {
        if (i >= a.length - 1) return;
        result.push(v * (1 - ratio) + a[i + 1] * ratio);
      });
      return result;
    }
  }, {
    key: "calculateBezierSplit",
    value: function calculateBezierSplit(ratio) {
      for (var _len = arguments.length, order0 = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        order0[_key - 1] = arguments[_key];
      }

      var order1 = this.calculateHighlyOrder(order0, ratio);
      var order2 = this.calculateHighlyOrder(order1, ratio);
      var order3 = this.calculateHighlyOrder(order2, ratio);
      return [order1[0], order2[0], order3[0], order2[1], order1[2], order0[3]];
    }
  }, {
    key: "moveTo",
    value: function moveTo(x, y) {
      if (!this.pathReady) {
        this.path.c = false;
        this.path.i = [[0, 0]];
        this.path.o = [];
        this.path.v = [[x, y]];
        this.currentX = x;
        this.currentY = y;
        this.offsetX = x;
        this.offsetY = y;
        this.pathReady = true;
      } else {
        this.lineTo.apply(this, _toConsumableArray(this.pathStart));
        this.lineTo(x, y);
        this.pathChain.push(this.pathStart);
      }

      this.pathStart = [x, y];
    }
  }, {
    key: "moveToRelative",
    value: function moveToRelative(x, y) {
      this.moveTo(this.currentX + x, this.currentY + y);
    }
  }, {
    key: "lineTo",
    value: function lineTo(x, y) {
      this.path.i.push([0, 0]);
      this.path.o.push([0, 0]);
      this.path.v.push([x, y]);
      this.updateXY(x, y);
    }
  }, {
    key: "lineToRelative",
    value: function lineToRelative(x, y) {
      this.lineTo(this.currentX + x, this.currentY + y);
    }
  }, {
    key: "horizontalTo",
    value: function horizontalTo(x) {
      this.lineTo(x, this.currentY);
    }
  }, {
    key: "horizontalToRelative",
    value: function horizontalToRelative(x) {
      this.horizontalTo(this.currentX + x);
    }
  }, {
    key: "verticalTo",
    value: function verticalTo(y) {
      this.lineTo(this.currentX, y);
    }
  }, {
    key: "verticalToRelative",
    value: function verticalToRelative(y) {
      this.verticalTo(this.currentY + y);
    }
  }, {
    key: "cubicBezierCurveTo",
    value: function cubicBezierCurveTo(c1x, c1y, c2x, c2y, x, y) {
      this.path.i.push([c2x - x, c2y - y]);
      this.path.o.push([c1x - this.currentX, c1y - this.currentY]);
      this.path.v.push([x, y]);
      this.offsetX = Math.min.apply(Math, [this.offsetX].concat(_toConsumableArray(this.calculateBezierMinMax(this.currentX, c1x, c2x, x))));
      this.offsetY = Math.min.apply(Math, [this.offsetY].concat(_toConsumableArray(this.calculateBezierMinMax(this.currentY, c1y, c2y, y))));
      this.updateXY(x, y);
    }
  }, {
    key: "cubicBezierCurveToRelative",
    value: function cubicBezierCurveToRelative(c1x, c1y, c2x, c2y, x, y) {
      this.cubicBezierCurveTo(this.currentX + c1x, this.currentY + c1y, this.currentX + c2x, this.currentY + c2y, this.currentX + x, this.currentY + y);
    }
  }, {
    key: "quadraticBezierCurveTo",
    value: function quadraticBezierCurveTo(cx, cy, x, y) {
      this.path.i.push([cx - x, cy - y]);
      this.path.o.push([cx - this.currentX, cy - this.currentY]);
      this.path.v.push([x, y]);
      this.offsetX = Math.min.apply(Math, [this.offsetX].concat(_toConsumableArray(this.calculateBezierMinMax(this.currentX, cx, cx, x))));
      this.offsetY = Math.min.apply(Math, [this.offsetY].concat(_toConsumableArray(this.calculateBezierMinMax(this.currentY, cy, cy, y))));
      this.updateXY(x, y);
    }
  }, {
    key: "quadraticBezierCurveToRelative",
    value: function quadraticBezierCurveToRelative(cx, cy, x, y) {
      this.quadraticBezierCurveTo(this.currentX + cx, this.currentY + cy, this.currentX + x, this.currentY + y);
    }
  }, {
    key: "arcTo",
    value: function arcTo(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y) {
      var cSeries = PathMaker.a2c(this.currentX, this.currentY, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y);

      while (cSeries.length >= 6) {
        var iovList = cSeries.splice(0, 6);
        this.path.i.push([iovList[2] - iovList[4], iovList[3] - iovList[5]]);
        this.path.o.push([iovList[0] - this.currentX, iovList[1] - this.currentY]);
        this.path.v.push([iovList[4], iovList[5]]);
        this.offsetX = Math.min.apply(Math, [this.offsetX].concat(_toConsumableArray(this.calculateBezierMinMax(this.currentX, iovList[0], iovList[2], iovList[4]))));
        this.offsetY = Math.min.apply(Math, [this.offsetY].concat(_toConsumableArray(this.calculateBezierMinMax(this.currentY, iovList[1], iovList[3], iovList[5]))));
        this.updateXY(iovList[4], iovList[5]);
      }
    }
  }, {
    key: "arcToRelative",
    value: function arcToRelative(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y) {
      this.arcTo(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, this.currentX + x, this.currentY + y);
    }
  }, {
    key: "closePath",
    value: function closePath() {
      this.path.c = true;
    }
  }, {
    key: "uniform",
    value: function uniform() {
      var _this = this;

      if (this.pathChain.length && !(this.currentX == this.pathStart[0] && this.currentY == this.pathStart[1])) {
        this.lineTo.apply(this, _toConsumableArray(this.pathStart));
      }

      while (this.pathChain.length) {
        var pathRef = this.pathChain.pop();
        this.lineTo.apply(this, _toConsumableArray(pathRef));
      }

      while (this.path.o.length < this.path.i.length) {
        this.path.o.push([0, 0]);
      }

      this.path.v.forEach(function (value) {
        value[0] -= _this.offsetX;
        value[1] -= _this.offsetY;
      });
      this.offsetX = 0;
      this.offsetY = 0;
    }
  }, {
    key: "parse",
    value: function parse(pathData) {
      var _this2 = this;

      var pathDataSeries = (0, _svgPathParser.parseSVG)(pathData);
      var pathDataWithType;
      pathDataSeries.forEach(function (pathDataItem) {
        switch (pathDataItem.code) {
          case 'M':
            pathDataWithType = pathDataItem;

            _this2.moveTo(pathDataWithType.x, pathDataWithType.y);

            break;

          case 'm':
            pathDataWithType = pathDataItem;

            _this2.moveToRelative(pathDataWithType.x, pathDataWithType.y);

          case 'L':
            pathDataWithType = pathDataItem;

            _this2.lineTo(pathDataWithType.x, pathDataWithType.y);

            break;

          case 'l':
            pathDataWithType = pathDataItem;

            _this2.lineToRelative(pathDataWithType.x, pathDataWithType.y);

            break;

          case 'H':
            pathDataWithType = pathDataItem;

            _this2.horizontalTo(pathDataWithType.x);

            break;

          case 'h':
            pathDataWithType = pathDataItem;

            _this2.horizontalToRelative(pathDataWithType.x);

            break;

          case 'V':
            pathDataWithType = pathDataItem;

            _this2.verticalTo(pathDataWithType.y);

            break;

          case 'v':
            pathDataWithType = pathDataItem;

            _this2.verticalToRelative(pathDataWithType.y);

            break;

          case 'C':
            pathDataWithType = pathDataItem;

            _this2.cubicBezierCurveTo(pathDataWithType.x1, pathDataWithType.y1, pathDataWithType.x2, pathDataWithType.y2, pathDataWithType.x, pathDataWithType.y);

            break;

          case 'c':
            pathDataWithType = pathDataItem;

            _this2.cubicBezierCurveToRelative(pathDataWithType.x1, pathDataWithType.y1, pathDataWithType.x2, pathDataWithType.y2, pathDataWithType.x, pathDataWithType.y);

            break;

          case 'Q':
            pathDataWithType = pathDataItem;

            _this2.quadraticBezierCurveTo(pathDataWithType.x1, pathDataWithType.y1, pathDataWithType.x, pathDataWithType.y);

            break;

          case 'q':
            pathDataWithType = pathDataItem;

            _this2.quadraticBezierCurveToRelative(pathDataWithType.x1, pathDataWithType.y1, pathDataWithType.x, pathDataWithType.y);

            break;

          case 'A':
            pathDataWithType = pathDataItem;

            _this2.arcTo(pathDataWithType.rx, pathDataWithType.ry, pathDataWithType.xAxisRotation, ~~pathDataWithType.largeArc, ~~pathDataWithType.sweep, pathDataWithType.x, pathDataWithType.y);

            break;

          case 'a':
            pathDataWithType = pathDataItem;

            _this2.arcToRelative(pathDataWithType.rx, pathDataWithType.ry, pathDataWithType.xAxisRotation, ~~pathDataWithType.largeArc, ~~pathDataWithType.sweep, pathDataWithType.x, pathDataWithType.y);

            break;

          case 'Z':
          case 'z':
            _this2.closePath();

            break;

          default:
            console.error(pathDataItem);
            throw new Error('No implementation found for this path command.');
        }
      });
    }
  }, {
    key: "upsample",
    value: function upsample(ratio) {
      var _this3 = this;

      // use De Casteljau's algorithm to do the upsampling
      // Reference: https://en.wikipedia.org/wiki/De_Casteljau%27s_algorithm
      if (!Number.isInteger(ratio)) {
        throw new Error('The upsampling ratio should be an integer.');
      }

      this.uniform();
      if (ratio <= 1) return;
      var copyPath = {
        c: this.path.c,
        i: [],
        o: [],
        v: []
      };
      this.path.v.forEach(function (v, i, a) {
        if (i <= 0) {
          copyPath.v.push(v);
          copyPath.i.push(_this3.path.i[i]);
          return;
        }

        var oArray = _this3.path.o;
        var iArray = _this3.path.i;
        var xArray = [a[i - 1][0], oArray[i - 1][0] + a[i - 1][0], iArray[i][0] + v[0], v[0]];
        var yArray = [a[i - 1][1], oArray[i - 1][1] + a[i - 1][1], iArray[i][1] + v[1], v[1]];

        for (var index = 1; index < ratio; index++) {
          var stepRatio = 1 / (ratio - index + 1);

          var xSplitArray = _this3.calculateBezierSplit.apply(_this3, [stepRatio].concat(_toConsumableArray(xArray)));

          var ySplitArray = _this3.calculateBezierSplit.apply(_this3, [stepRatio].concat(_toConsumableArray(yArray)));

          var _p0x = xArray[0],
              _p1x = xSplitArray.shift() - _p0x,
              _p3x = xSplitArray[1],
              _p2x = xSplitArray.shift() - _p3x,
              _p0y = yArray[0],
              _p1y = ySplitArray.shift() - _p0y,
              _p3y = ySplitArray[1],
              _p2y = ySplitArray.shift() - _p3y;

          copyPath.o.push([_p1x, _p1y]);
          copyPath.i.push([_p2x, _p2y]);
          copyPath.v.push([_p3x, _p3y]);
          xArray = xSplitArray;
          yArray = ySplitArray;
        }

        var p0x = xArray.shift(),
            p1x = xArray.shift() - p0x,
            p3x = xArray[1],
            p2x = xArray.shift() - p3x,
            p0y = yArray.shift(),
            p1y = yArray.shift() - p0y,
            p3y = yArray[1],
            p2y = yArray.shift() - p3y;
        copyPath.o.push([p1x, p1y]);
        copyPath.i.push([p2x, p2y]);
        copyPath.v.push([p3x, p3y]);
      });
      this.path = copyPath;
      this.uniform();
    }
  }], [{
    key: "a2c",
    value: function a2c(x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
      // for more information of where this Math came from visit:
      // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
      var _120 = Math.PI * 120 / 180,
          rad = Math.PI / 180 * (+angle || 0),
          res = [],
          xy,
          rotate = function rotate(x, y, rad) {
        var X = x * Math.cos(rad) - y * Math.sin(rad),
            Y = x * Math.sin(rad) + y * Math.cos(rad);
        return {
          x: X,
          y: Y
        };
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
            k = (large_arc_flag == sweep_flag ? -1 : 1) * Math.sqrt(Math.abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x))),
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
        res = this.a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]);
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
        res = [m2, m3, m4].concat(res).join().split(",").map(function (x) {
          return parseFloat(x);
        });
        var newres = [];

        for (var i = 0, ii = res.length; i < ii; i++) {
          newres[i] = i % 2 ? rotate(res[i - 1], res[i], rad).y : rotate(res[i], res[i + 1], rad).x;
        }

        return newres;
      }
    }
  }]);

  return PathMaker;
}();

exports.PathMaker = PathMaker;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXRoLnRzIl0sIm5hbWVzIjpbIlBhdGhNYWtlciIsInBhdGhEYXRhIiwiYyIsImkiLCJvIiwidiIsIkluZmluaXR5IiwicGFyc2UiLCJ4IiwieSIsImN1cnJlbnRYIiwiY3VycmVudFkiLCJvZmZzZXRYIiwiTWF0aCIsIm1pbiIsIm9mZnNldFkiLCJwMCIsInAxIiwicDIiLCJwMyIsImEiLCJiIiwibWF4Iiwic3FydCIsInJvb3RzIiwibWFwIiwibXVsdGkiLCJmb3JFYWNoIiwicm9vdCIsInZhbHVlIiwicG93IiwiYXJyIiwicmF0aW8iLCJyZXN1bHQiLCJsZW5ndGgiLCJwdXNoIiwib3JkZXIwIiwib3JkZXIxIiwiY2FsY3VsYXRlSGlnaGx5T3JkZXIiLCJvcmRlcjIiLCJvcmRlcjMiLCJwYXRoUmVhZHkiLCJwYXRoIiwibGluZVRvIiwicGF0aFN0YXJ0IiwicGF0aENoYWluIiwibW92ZVRvIiwidXBkYXRlWFkiLCJob3Jpem9udGFsVG8iLCJ2ZXJ0aWNhbFRvIiwiYzF4IiwiYzF5IiwiYzJ4IiwiYzJ5IiwiY2FsY3VsYXRlQmV6aWVyTWluTWF4IiwiY3ViaWNCZXppZXJDdXJ2ZVRvIiwiY3giLCJjeSIsInF1YWRyYXRpY0JlemllckN1cnZlVG8iLCJyeCIsInJ5IiwieEF4aXNSb3RhdGlvbiIsImxhcmdlQXJjRmxhZyIsInN3ZWVwRmxhZyIsImNTZXJpZXMiLCJhMmMiLCJpb3ZMaXN0Iiwic3BsaWNlIiwiYXJjVG8iLCJwYXRoUmVmIiwicG9wIiwicGF0aERhdGFTZXJpZXMiLCJwYXRoRGF0YVdpdGhUeXBlIiwicGF0aERhdGFJdGVtIiwiY29kZSIsIm1vdmVUb1JlbGF0aXZlIiwibGluZVRvUmVsYXRpdmUiLCJob3Jpem9udGFsVG9SZWxhdGl2ZSIsInZlcnRpY2FsVG9SZWxhdGl2ZSIsIngxIiwieTEiLCJ4MiIsInkyIiwiY3ViaWNCZXppZXJDdXJ2ZVRvUmVsYXRpdmUiLCJxdWFkcmF0aWNCZXppZXJDdXJ2ZVRvUmVsYXRpdmUiLCJsYXJnZUFyYyIsInN3ZWVwIiwiYXJjVG9SZWxhdGl2ZSIsImNsb3NlUGF0aCIsImNvbnNvbGUiLCJlcnJvciIsIkVycm9yIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwidW5pZm9ybSIsImNvcHlQYXRoIiwib0FycmF5IiwiaUFycmF5IiwieEFycmF5IiwieUFycmF5IiwiaW5kZXgiLCJzdGVwUmF0aW8iLCJ4U3BsaXRBcnJheSIsImNhbGN1bGF0ZUJlemllclNwbGl0IiwieVNwbGl0QXJyYXkiLCJwMHgiLCJwMXgiLCJzaGlmdCIsInAzeCIsInAyeCIsInAweSIsInAxeSIsInAzeSIsInAyeSIsImFuZ2xlIiwibGFyZ2VfYXJjX2ZsYWciLCJzd2VlcF9mbGFnIiwicmVjdXJzaXZlIiwiXzEyMCIsIlBJIiwicmFkIiwicmVzIiwieHkiLCJyb3RhdGUiLCJYIiwiY29zIiwic2luIiwiWSIsImgiLCJyeDIiLCJyeTIiLCJrIiwiYWJzIiwiZjEiLCJhc2luIiwiZjIiLCJkZiIsImYyb2xkIiwieDJvbGQiLCJ5Mm9sZCIsImMxIiwiczEiLCJjMiIsInMyIiwidCIsInRhbiIsImh4IiwiaHkiLCJtMSIsIm0yIiwibTMiLCJtNCIsImNvbmNhdCIsImpvaW4iLCJzcGxpdCIsInBhcnNlRmxvYXQiLCJuZXdyZXMiLCJpaSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFYUEsUzs7O0FBYVQ7QUFLQSxxQkFBWUMsUUFBWixFQUErQjtBQUFBOztBQUFBLGtDQWpCUjtBQUNuQkMsTUFBQUEsQ0FBQyxFQUFFLEtBRGdCO0FBRW5CQyxNQUFBQSxDQUFDLEVBQUUsRUFGZ0I7QUFHbkJDLE1BQUFBLENBQUMsRUFBRSxFQUhnQjtBQUluQkMsTUFBQUEsQ0FBQyxFQUFFO0FBSmdCLEtBaUJROztBQUFBLHNDQVZKLENBVUk7O0FBQUEsc0NBVEosQ0FTSTs7QUFBQSxxQ0FSTEMsUUFRSzs7QUFBQSxxQ0FQTEEsUUFPSzs7QUFBQSx1Q0FKWCxLQUlXOztBQUFBLHVDQUhPLENBQUMsQ0FBRCxFQUFJ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akIsQ0FBQztBQUFBLGlCQUFJbUosVUFBVSxDQUFDbkosQ0FBRCxDQUFkO0FBQUEsU0FBaEQsQ0FBTjtBQUNBLFlBQUlvSixNQUFNLEdBQUcsRUFBYjs7QUFDQSxhQUFLLElBQUl6SixDQUFDLEdBQUcsQ0FBUixFQUFXMEosRUFBRSxHQUFHcEMsR0FBRyxDQUFDdkYsTUFBekIsRUFBaUMvQixDQUFDLEdBQUcwSixFQUFyQyxFQUF5QzFKLENBQUMsRUFBMUMsRUFBOEM7QUFDMUN5SixVQUFBQSxNQUFNLENBQUN6SixDQUFELENBQU4sR0FBWUEsQ0FBQyxHQUFHLENBQUosR0FBUXdILE1BQU0sQ0FBQ0YsR0FBRyxDQUFDdEgsQ0FBQyxHQUFHLENBQUwsQ0FBSixFQUFhc0gsR0FBRyxDQUFDdEgsQ0FBRCxDQUFoQixFQUFxQnFILEdBQXJCLENBQU4sQ0FBZ0MvRyxDQUF4QyxHQUE0Q2tILE1BQU0sQ0FBQ0YsR0FBRyxDQUFDdEgsQ0FBRCxDQUFKLEVBQVNzSCxHQUFHLENBQUN0SCxDQUFDLEdBQUcsQ0FBTCxDQUFaLEVBQXFCcUgsR0FBckIsQ0FBTixDQUFnQ2hILENBQXhGO0FBQ0g7O0FBQ0QsZUFBT29KLE1BQVA7QUFDSDtBQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGF0aERlZiB9IGZyb20gJy4vYW5pbWF0aW9uJ1xyXG5pbXBvcnQgeyBwYXJzZVNWRywgTW92ZVRvQ29tbWFuZCwgTGluZVRvQ29tbWFuZCwgSG9yaXpvbnRhbExpbmVUb0NvbW1hbmQsIFZlcnRpY2FsTGluZVRvQ29tbWFuZCwgQ3VydmVUb0NvbW1hbmQsIFF1YWRyYXRpY0N1cnZlVG9Db21tYW5kLCBFbGxpcHRpY2FsQXJjQ29tbWFuZCB9IGZyb20gJ3N2Zy1wYXRoLXBhcnNlcic7XHJcblxyXG5leHBvcnQgY2xhc3MgUGF0aE1ha2VyIHtcclxuICAgIHB1YmxpYyBwYXRoOiBQYXRoRGVmID0ge1xyXG4gICAgICAgIGM6IGZhbHNlLFxyXG4gICAgICAgIGk6IFtdLFxyXG4gICAgICAgIG86IFtdLFxyXG4gICAgICAgIHY6IFtdXHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgY3VycmVudFg6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIGN1cnJlbnRZOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBvZmZzZXRYOiBudW1iZXIgPSBJbmZpbml0eTtcclxuICAgIHByaXZhdGUgb2Zmc2V0WTogbnVtYmVyID0gSW5maW5pdHk7XHJcblxyXG4gICAgLy8gZm9yIGRpc2NvbnRpbnVvdXMgcGF0aHNcclxuICAgIHByaXZhdGUgcGF0aFJlYWR5ID0gZmFsc2VcclxuICAgIHByaXZhdGUgcGF0aFN0YXJ0OiBbbnVtYmVyLCBudW1iZXJdID0gWzAsIDBdXHJcbiAgICBwcml2YXRlIHBhdGhDaGFpbjogW251bWJlciwgbnVtYmVyXVtdID0gW11cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXRoRGF0YT86IHN0cmluZykge1xyXG4gICAgICAgIGlmIChwYXRoRGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnBhcnNlKHBhdGhEYXRhKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVhZKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50WCA9IHhcclxuICAgICAgICB0aGlzLmN1cnJlbnRZID0geVxyXG4gICAgICAgIHRoaXMub2Zmc2V0WCA9IE1hdGgubWluKHRoaXMub2Zmc2V0WCwgeClcclxuICAgICAgICB0aGlzLm9mZnNldFkgPSBNYXRoLm1pbih0aGlzLm9mZnNldFksIHkpXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjYWxjdWxhdGVCZXppZXJNaW5NYXgocDA6IG51bWJlciwgcDE6IG51bWJlciwgcDI6IG51bWJlciwgcDM6IG51bWJlcik6IFtudW1iZXIsIG51bWJlcl0ge1xyXG4gICAgICAgIGNvbnN0IGEgPSAzICogKHAzIC0gMyAqIHAyICsgMyAqIHAxIC0gcDApXHJcbiAgICAgICAgY29uc3QgYiA9IDYgKiAocDIgLSAyICogcDEgKyBwMClcclxuICAgICAgICBjb25zdCBjID0gMyAqIChwMSAtIHAwKVxyXG4gICAgICAgIGxldCBtaW4gPSBJbmZpbml0eSwgbWF4ID0gLUluZmluaXR5XHJcbiAgICAgICAgaWYgKGIgKiBiIC0gNCAqIGEgKiBjID49IDApIHtcclxuICAgICAgICAgICAgY29uc3Qgc3FydCA9IE1hdGguc3FydChiICogYiAtIDQgKiBhICogYylcclxuICAgICAgICAgICAgY29uc3Qgcm9vdHMgPSBbMSwgLTFdLm1hcChtdWx0aSA9PiAobXVsdGkgKiBzcXJ0IC0gYikgLyAyIC8gYSlcclxuICAgICAgICAgICAgcm9vdHMuZm9yRWFjaChyb290ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChyb290ID4gMCAmJiByb290IDwgMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gTWF0aC5wb3coMSAtIHJvb3QsIDMpICogcDAgKyAzICogTWF0aC5wb3coMSAtIHJvb3QsIDIpICogcm9vdCAqIHAxICsgMyAqICgxIC0gcm9vdCkgKiByb290ICogcm9vdCAqIHAyICsgTWF0aC5wb3cocm9vdCwgMykgKiBwM1xyXG4gICAgICAgICAgICAgICAgICAgIG1pbiA9IE1hdGgubWluKG1pbiwgdmFsdWUpXHJcbiAgICAgICAgICAgICAgICAgICAgbWF4ID0gTWF0aC5tYXgobWF4LCB2YWx1ZSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgbWluID0gTWF0aC5taW4obWluLCBwMCwgcDMpXHJcbiAgICAgICAgbWF4ID0gTWF0aC5tYXgobWF4LCBwMCwgcDMpXHJcbiAgICAgICAgcmV0dXJuIFttaW4sIG1heF1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNhbGN1bGF0ZUhpZ2hseU9yZGVyKGFycjogbnVtYmVyW10sIHJhdGlvOiBudW1iZXIpOiBudW1iZXJbXSB7XHJcbiAgICAgICAgbGV0IHJlc3VsdDogbnVtYmVyW10gPSBbXVxyXG4gICAgICAgIGFyci5mb3JFYWNoKCh2LCBpLCBhKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpID49IGEubGVuZ3RoIC0gMSkgcmV0dXJuXHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHYgKiAoMSAtIHJhdGlvKSArIGFbaSArIDFdICogcmF0aW8pXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gcmVzdWx0XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjYWxjdWxhdGVCZXppZXJTcGxpdChyYXRpbzogbnVtYmVyLCAuLi5vcmRlcjA6IG51bWJlcltdKTogbnVtYmVyW10ge1xyXG4gICAgICAgIGxldCBvcmRlcjEgPSB0aGlzLmNhbGN1bGF0ZUhpZ2hseU9yZGVyKG9yZGVyMCwgcmF0aW8pXHJcbiAgICAgICAgbGV0IG9yZGVyMiA9IHRoaXMuY2FsY3VsYXRlSGlnaGx5T3JkZXIob3JkZXIxLCByYXRpbylcclxuICAgICAgICBsZXQgb3JkZXIzID0gdGhpcy5jYWxjdWxhdGVIaWdobHlPcmRlcihvcmRlcjIsIHJhdGlvKVxyXG4gICAgICAgIHJldHVybiBbb3JkZXIxWzBdLCBvcmRlcjJbMF0sIG9yZGVyM1swXSwgb3JkZXIyWzFdLCBvcmRlcjFbMl0sIG9yZGVyMFszXV1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbW92ZVRvKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnBhdGhSZWFkeSkge1xyXG4gICAgICAgICAgICB0aGlzLnBhdGguYyA9IGZhbHNlXHJcbiAgICAgICAgICAgIHRoaXMucGF0aC5pID0gW1swLCAwXV1cclxuICAgICAgICAgICAgdGhpcy5wYXRoLm8gPSBbXVxyXG4gICAgICAgICAgICB0aGlzLnBhdGgudiA9IFtbeCwgeV1dXHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFggPSB4XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFkgPSB5XHJcbiAgICAgICAgICAgIHRoaXMub2Zmc2V0WCA9IHhcclxuICAgICAgICAgICAgdGhpcy5vZmZzZXRZID0geVxyXG4gICAgICAgICAgICB0aGlzLnBhdGhSZWFkeSA9IHRydWVcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmxpbmVUbyguLi50aGlzLnBhdGhTdGFydClcclxuICAgICAgICAgICAgdGhpcy5saW5lVG8oeCwgeSlcclxuICAgICAgICAgICAgdGhpcy5wYXRoQ2hhaW4ucHVzaCh0aGlzLnBhdGhTdGFydClcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wYXRoU3RhcnQgPSBbeCwgeV1cclxuICAgIH1cclxuICAgIHB1YmxpYyBtb3ZlVG9SZWxhdGl2ZSh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMubW92ZVRvKHRoaXMuY3VycmVudFggKyB4LCB0aGlzLmN1cnJlbnRZICsgeSlcclxuICAgIH1cclxuICAgIHB1YmxpYyBsaW5lVG8oeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnBhdGguaSEucHVzaChbMCwgMF0pXHJcbiAgICAgICAgdGhpcy5wYXRoLm8hLnB1c2goWzAsIDBdKVxyXG4gICAgICAgIHRoaXMucGF0aC52IS5wdXNoKFt4LCB5XSlcclxuICAgICAgICB0aGlzLnVwZGF0ZVhZKHgsIHkpXHJcbiAgICB9XHJcbiAgICBwdWJsaWMgbGluZVRvUmVsYXRpdmUoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmxpbmVUbyh0aGlzLmN1cnJlbnRYICsgeCwgdGhpcy5jdXJyZW50WSArIHkpXHJcbiAgICB9XHJcbiAgICBwdWJsaWMgaG9yaXpvbnRhbFRvKHg6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMubGluZVRvKHgsIHRoaXMuY3VycmVudFkpXHJcbiAgICB9XHJcbiAgICBwdWJsaWMgaG9yaXpvbnRhbFRvUmVsYXRpdmUoeDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5ob3Jpem9udGFsVG8odGhpcy5jdXJyZW50WCArIHgpXHJcbiAgICB9XHJcbiAgICBwdWJsaWMgdmVydGljYWxUbyh5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmxpbmVUbyh0aGlzLmN1cnJlbnRYLCB5KVxyXG4gICAgfVxyXG4gICAgcHVibGljIHZlcnRpY2FsVG9SZWxhdGl2ZSh5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnZlcnRpY2FsVG8odGhpcy5jdXJyZW50WSArIHkpXHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY3ViaWNCZXppZXJDdXJ2ZVRvKFxyXG4gICAgICAgIGMxeDogbnVtYmVyLFxyXG4gICAgICAgIGMxeTogbnVtYmVyLFxyXG4gICAgICAgIGMyeDogbnVtYmVyLFxyXG4gICAgICAgIGMyeTogbnVtYmVyLFxyXG4gICAgICAgIHg6IG51bWJlcixcclxuICAgICAgICB5OiBudW1iZXJcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMucGF0aC5pIS5wdXNoKFtjMnggLSB4LCBjMnkgLSB5XSlcclxuICAgICAgICB0aGlzLnBhdGgubyEucHVzaChbYzF4IC0gdGhpcy5jdXJyZW50WCwgYzF5IC0gdGhpcy5jdXJyZW50WV0pXHJcbiAgICAgICAgdGhpcy5wYXRoLnYhLnB1c2goW3gsIHldKVxyXG4gICAgICAgIHRoaXMub2Zmc2V0WCA9IE1hdGgubWluKHRoaXMub2Zmc2V0WCwgLi4udGhpcy5jYWxjdWxhdGVCZXppZXJNaW5NYXgodGhpcy5jdXJyZW50WCwgYzF4LCBjMngsIHgpKVxyXG4gICAgICAgIHRoaXMub2Zmc2V0WSA9IE1hdGgubWluKHRoaXMub2Zmc2V0WSwgLi4udGhpcy5jYWxjdWxhdGVCZXppZXJNaW5NYXgodGhpcy5jdXJyZW50WSwgYzF5LCBjMnksIHkpKVxyXG4gICAgICAgIHRoaXMudXBkYXRlWFkoeCwgeSlcclxuICAgIH1cclxuICAgIHB1YmxpYyBjdWJpY0JlemllckN1cnZlVG9SZWxhdGl2ZShcclxuICAgICAgICBjMXg6IG51bWJlcixcclxuICAgICAgICBjMXk6IG51bWJlcixcclxuICAgICAgICBjMng6IG51bWJlcixcclxuICAgICAgICBjMnk6IG51bWJlcixcclxuICAgICAgICB4OiBudW1iZXIsXHJcbiAgICAgICAgeTogbnVtYmVyXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLmN1YmljQmV6aWVyQ3VydmVUbyh0aGlzLmN1cnJlbnRYICsgYzF4LCB0aGlzLmN1cnJlbnRZICsgYzF5LCB0aGlzLmN1cnJlbnRYICsgYzJ4LCB0aGlzLmN1cnJlbnRZICsgYzJ5LCB0aGlzLmN1cnJlbnRYICsgeCwgdGhpcy5jdXJyZW50WSArIHkpXHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcXVhZHJhdGljQmV6aWVyQ3VydmVUbyhjeDogbnVtYmVyLCBjeTogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMucGF0aC5pIS5wdXNoKFtjeCAtIHgsIGN5IC0geV0pXHJcbiAgICAgICAgdGhpcy5wYXRoLm8hLnB1c2goW2N4IC0gdGhpcy5jdXJyZW50WCwgY3kgLSB0aGlzLmN1cnJlbnRZXSlcclxuICAgICAgICB0aGlzLnBhdGgudiEucHVzaChbeCwgeV0pXHJcbiAgICAgICAgdGhpcy5vZmZzZXRYID0gTWF0aC5taW4odGhpcy5vZmZzZXRYLCAuLi50aGlzLmNhbGN1bGF0ZUJlemllck1pbk1heCh0aGlzLmN1cnJlbnRYLCBjeCwgY3gsIHgpKVxyXG4gICAgICAgIHRoaXMub2Zmc2V0WSA9IE1hdGgubWluKHRoaXMub2Zmc2V0WSwgLi4udGhpcy5jYWxjdWxhdGVCZXppZXJNaW5NYXgodGhpcy5jdXJyZW50WSwgY3ksIGN5LCB5KSlcclxuICAgICAgICB0aGlzLnVwZGF0ZVhZKHgsIHkpXHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcXVhZHJhdGljQmV6aWVyQ3VydmVUb1JlbGF0aXZlKGN4OiBudW1iZXIsIGN5OiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5xdWFkcmF0aWNCZXppZXJDdXJ2ZVRvKHRoaXMuY3VycmVudFggKyBjeCwgdGhpcy5jdXJyZW50WSArIGN5LCB0aGlzLmN1cnJlbnRYICsgeCwgdGhpcy5jdXJyZW50WSArIHkpXHJcbiAgICB9XHJcbiAgICBwdWJsaWMgYXJjVG8oXHJcbiAgICAgICAgcng6IG51bWJlcixcclxuICAgICAgICByeTogbnVtYmVyLFxyXG4gICAgICAgIHhBeGlzUm90YXRpb246IG51bWJlcixcclxuICAgICAgICBsYXJnZUFyY0ZsYWc6IG51bWJlcixcclxuICAgICAgICBzd2VlcEZsYWc6IG51bWJlcixcclxuICAgICAgICB4OiBudW1iZXIsXHJcbiAgICAgICAgeTogbnVtYmVyXHJcbiAgICApIHtcclxuICAgICAgICBjb25zdCBjU2VyaWVzID0gUGF0aE1ha2VyLmEyYyh0aGlzLmN1cnJlbnRYLCB0aGlzLmN1cnJlbnRZLCByeCwgcnksIHhBeGlzUm90YXRpb24sIGxhcmdlQXJjRmxhZywgc3dlZXBGbGFnLCB4LCB5KSBhcyBudW1iZXJbXVxyXG4gICAgICAgIHdoaWxlIChjU2VyaWVzLmxlbmd0aCA+PSA2KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlvdkxpc3QgPSBjU2VyaWVzLnNwbGljZSgwLCA2KVxyXG4gICAgICAgICAgICB0aGlzLnBhdGguaSEucHVzaChbaW92TGlzdFsyXSAtIGlvdkxpc3RbNF0sIGlvdkxpc3RbM10gLSBpb3ZMaXN0WzVdXSlcclxuICAgICAgICAgICAgdGhpcy5wYXRoLm8hLnB1c2goW2lvdkxpc3RbMF0gLSB0aGlzLmN1cnJlbnRYLCBpb3ZMaXN0WzFdIC0gdGhpcy5jdXJyZW50WV0pXHJcbiAgICAgICAgICAgIHRoaXMucGF0aC52IS5wdXNoKFtpb3ZMaXN0WzRdLCBpb3ZMaXN0WzVdXSlcclxuICAgICAgICAgICAgdGhpcy5vZmZzZXRYID0gTWF0aC5taW4odGhpcy5vZmZzZXRYLCAuLi50aGlzLmNhbGN1bGF0ZUJlemllck1pbk1heCh0aGlzLmN1cnJlbnRYLCBpb3ZMaXN0WzBdLCBpb3ZMaXN0WzJdLCBpb3ZMaXN0WzRdKSlcclxuICAgICAgICAgICAgdGhpcy5vZmZzZXRZID0gTWF0aC5taW4odGhpcy5vZmZzZXRZLCAuLi50aGlzLmNhbGN1bGF0ZUJlemllck1pbk1heCh0aGlzLmN1cnJlbnRZLCBpb3ZMaXN0WzFdLCBpb3ZMaXN0WzNdLCBpb3ZMaXN0WzVdKSlcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVYWShpb3ZMaXN0WzRdLCBpb3ZMaXN0WzVdKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBhcmNUb1JlbGF0aXZlKFxyXG4gICAgICAgIHJ4OiBudW1iZXIsXHJcbiAgICAgICAgcnk6IG51bWJlcixcclxuICAgICAgICB4QXhpc1JvdGF0aW9uOiBudW1iZXIsXHJcbiAgICAgICAgbGFyZ2VBcmNGbGFnOiBudW1iZXIsXHJcbiAgICAgICAgc3dlZXBGbGFnOiBudW1iZXIsXHJcbiAgICAgICAgeDogbnVtYmVyLFxyXG4gICAgICAgIHk6IG51bWJlclxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5hcmNUbyhyeCwgcnksIHhBeGlzUm90YXRpb24sIGxhcmdlQXJjRmxhZywgc3dlZXBGbGFnLCB0aGlzLmN1cnJlbnRYICsgeCwgdGhpcy5jdXJyZW50WSArIHkpXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgYTJjKHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIHJ4OiBudW1iZXIsIHJ5OiBudW1iZXIsIGFuZ2xlOiBudW1iZXIsIGxhcmdlX2FyY19mbGFnOiBudW1iZXIsIHN3ZWVwX2ZsYWc6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlciwgcmVjdXJzaXZlPzogbnVtYmVyW10pOiBudW1iZXJbXSB8IG51bWJlcltdW10ge1xyXG4gICAgICAgIC8vIGZvciBtb3JlIGluZm9ybWF0aW9uIG9mIHdoZXJlIHRoaXMgTWF0aCBjYW1lIGZyb20gdmlzaXQ6XHJcbiAgICAgICAgLy8gaHR0cDovL3d3dy53My5vcmcvVFIvU1ZHMTEvaW1wbG5vdGUuaHRtbCNBcmNJbXBsZW1lbnRhdGlvbk5vdGVzXHJcbiAgICAgICAgdmFyIF8xMjAgPSBNYXRoLlBJICogMTIwIC8gMTgwLFxyXG4gICAgICAgICAgICByYWQgPSBNYXRoLlBJIC8gMTgwICogKCthbmdsZSB8fCAwKSxcclxuICAgICAgICAgICAgcmVzOiBudW1iZXJbXSA9IFtdLFxyXG4gICAgICAgICAgICB4eSxcclxuICAgICAgICAgICAgcm90YXRlID0gKHg6IG51bWJlciwgeTogbnVtYmVyLCByYWQ6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIFggPSB4ICogTWF0aC5jb3MocmFkKSAtIHkgKiBNYXRoLnNpbihyYWQpLFxyXG4gICAgICAgICAgICAgICAgICAgIFkgPSB4ICogTWF0aC5zaW4ocmFkKSArIHkgKiBNYXRoLmNvcyhyYWQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgeDogWCwgeTogWSB9O1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIGlmICghcnggfHwgIXJ5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBbeDEsIHkxLCB4MiwgeTIsIHgyLCB5Ml07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghcmVjdXJzaXZlKSB7XHJcbiAgICAgICAgICAgIHh5ID0gcm90YXRlKHgxLCB5MSwgLXJhZCk7XHJcbiAgICAgICAgICAgIHgxID0geHkueDtcclxuICAgICAgICAgICAgeTEgPSB4eS55O1xyXG4gICAgICAgICAgICB4eSA9IHJvdGF0ZSh4MiwgeTIsIC1yYWQpO1xyXG4gICAgICAgICAgICB4MiA9IHh5Lng7XHJcbiAgICAgICAgICAgIHkyID0geHkueTtcclxuICAgICAgICAgICAgdmFyIGNvcyA9IE1hdGguY29zKE1hdGguUEkgLyAxODAgKiBhbmdsZSksXHJcbiAgICAgICAgICAgICAgICBzaW4gPSBNYXRoLnNpbihNYXRoLlBJIC8gMTgwICogYW5nbGUpLFxyXG4gICAgICAgICAgICAgICAgeCA9ICh4MSAtIHgyKSAvIDIsXHJcbiAgICAgICAgICAgICAgICB5ID0gKHkxIC0geTIpIC8gMjtcclxuICAgICAgICAgICAgdmFyIGggPSB4ICogeCAvIChyeCAqIHJ4KSArIHkgKiB5IC8gKHJ5ICogcnkpO1xyXG4gICAgICAgICAgICBpZiAoaCA+IDEpIHtcclxuICAgICAgICAgICAgICAgIGggPSBNYXRoLnNxcnQoaCk7XHJcbiAgICAgICAgICAgICAgICByeCA9IGggKiByeDtcclxuICAgICAgICAgICAgICAgIHJ5ID0gaCAqIHJ5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciByeDIgPSByeCAqIHJ4LFxyXG4gICAgICAgICAgICAgICAgcnkyID0gcnkgKiByeSxcclxuICAgICAgICAgICAgICAgIGsgPSAobGFyZ2VfYXJjX2ZsYWcgPT0gc3dlZXBfZmxhZyA/IC0xIDogMSkgKlxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguc3FydChNYXRoLmFicygocngyICogcnkyIC0gcngyICogeSAqIHkgLSByeTIgKiB4ICogeCkgLyAocngyICogeSAqIHkgKyByeTIgKiB4ICogeCkpKSxcclxuICAgICAgICAgICAgICAgIGN4ID0gayAqIHJ4ICogeSAvIHJ5ICsgKHgxICsgeDIpIC8gMixcclxuICAgICAgICAgICAgICAgIGN5ID0gayAqIC1yeSAqIHggLyByeCArICh5MSArIHkyKSAvIDIsXHJcbiAgICAgICAgICAgICAgICBmMSA9IE1hdGguYXNpbigoeTEgLSBjeSkgLyByeSksXHJcbiAgICAgICAgICAgICAgICBmMiA9IE1hdGguYXNpbigoeTIgLSBjeSkgLyByeSk7XHJcblxyXG4gICAgICAgICAgICBmMSA9IHgxIDwgY3ggPyBNYXRoLlBJIC0gZjEgOiBmMTtcclxuICAgICAgICAgICAgZjIgPSB4MiA8IGN4ID8gTWF0aC5QSSAtIGYyIDogZjI7XHJcbiAgICAgICAgICAgIGYxIDwgMCAmJiAoZjEgPSBNYXRoLlBJICogMiArIGYxKTtcclxuICAgICAgICAgICAgZjIgPCAwICYmIChmMiA9IE1hdGguUEkgKiAyICsgZjIpO1xyXG4gICAgICAgICAgICBpZiAoc3dlZXBfZmxhZyAmJiBmMSA+IGYyKSB7XHJcbiAgICAgICAgICAgICAgICBmMSA9IGYxIC0gTWF0aC5QSSAqIDI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFzd2VlcF9mbGFnICYmIGYyID4gZjEpIHtcclxuICAgICAgICAgICAgICAgIGYyID0gZjIgLSBNYXRoLlBJICogMjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGYxID0gcmVjdXJzaXZlWzBdO1xyXG4gICAgICAgICAgICBmMiA9IHJlY3Vyc2l2ZVsxXTtcclxuICAgICAgICAgICAgY3ggPSByZWN1cnNpdmVbMl07XHJcbiAgICAgICAgICAgIGN5ID0gcmVjdXJzaXZlWzNdO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZGYgPSBmMiAtIGYxO1xyXG4gICAgICAgIGlmIChNYXRoLmFicyhkZikgPiBfMTIwKSB7XHJcbiAgICAgICAgICAgIHZhciBmMm9sZCA9IGYyLFxyXG4gICAgICAgICAgICAgICAgeDJvbGQgPSB4MixcclxuICAgICAgICAgICAgICAgIHkyb2xkID0geTI7XHJcbiAgICAgICAgICAgIGYyID0gZjEgKyBfMTIwICogKHN3ZWVwX2ZsYWcgJiYgZjIgPiBmMSA/IDEgOiAtMSk7XHJcbiAgICAgICAgICAgIHgyID0gY3ggKyByeCAqIE1hdGguY29zKGYyKTtcclxuICAgICAgICAgICAgeTIgPSBjeSArIHJ5ICogTWF0aC5zaW4oZjIpO1xyXG4gICAgICAgICAgICByZXMgPSB0aGlzLmEyYyh4MiwgeTIsIHJ4LCByeSwgYW5nbGUsIDAsIHN3ZWVwX2ZsYWcsIHgyb2xkLCB5Mm9sZCwgW2YyLCBmMm9sZCwgY3gsIGN5XSkgYXMgbnVtYmVyW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRmID0gZjIgLSBmMTtcclxuICAgICAgICB2YXIgYzEgPSBNYXRoLmNvcyhmMSksXHJcbiAgICAgICAgICAgIHMxID0gTWF0aC5zaW4oZjEpLFxyXG4gICAgICAgICAgICBjMiA9IE1hdGguY29zKGYyKSxcclxuICAgICAgICAgICAgczIgPSBNYXRoLnNpbihmMiksXHJcbiAgICAgICAgICAgIHQgPSBNYXRoLnRhbihkZiAvIDQpLFxyXG4gICAgICAgICAgICBoeCA9IDQgLyAzICogcnggKiB0LFxyXG4gICAgICAgICAgICBoeSA9IDQgLyAzICogcnkgKiB0LFxyXG4gICAgICAgICAgICBtMSA9IFt4MSwgeTFdLFxyXG4gICAgICAgICAgICBtMiA9IFt4MSArIGh4ICogczEsIHkxIC0gaHkgKiBjMV0sXHJcbiAgICAgICAgICAgIG0zID0gW3gyICsgaHggKiBzMiwgeTIgLSBoeSAqIGMyXSxcclxuICAgICAgICAgICAgbTQgPSBbeDIsIHkyXTtcclxuICAgICAgICBtMlswXSA9IDIgKiBtMVswXSAtIG0yWzBdO1xyXG4gICAgICAgIG0yWzFdID0gMiAqIG0xWzFdIC0gbTJbMV07XHJcbiAgICAgICAgaWYgKHJlY3Vyc2l2ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gW20yLCBtMywgbTRdLmNvbmNhdChyZXMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlcyA9IFttMiwgbTMsIG00XS5jb25jYXQocmVzKS5qb2luKCkuc3BsaXQoXCIsXCIpLm1hcCh4ID0+IHBhcnNlRmxvYXQoeCkpO1xyXG4gICAgICAgICAgICB2YXIgbmV3cmVzID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IHJlcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdyZXNbaV0gPSBpICUgMiA/IHJvdGF0ZShyZXNbaSAtIDFdLCByZXNbaV0sIHJhZCkueSA6IHJvdGF0ZShyZXNbaV0sIHJlc1tpICsgMV0sIHJhZCkueDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3cmVzO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xvc2VQYXRoKCkge1xyXG4gICAgICAgIHRoaXMucGF0aC5jID0gdHJ1ZVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1bmlmb3JtKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnBhdGhDaGFpbi5sZW5ndGggJiYgISh0aGlzLmN1cnJlbnRYID09IHRoaXMucGF0aFN0YXJ0WzBdICYmIHRoaXMuY3VycmVudFkgPT0gdGhpcy5wYXRoU3RhcnRbMV0pKSB7XHJcbiAgICAgICAgICAgIHRoaXMubGluZVRvKC4uLnRoaXMucGF0aFN0YXJ0KVxyXG4gICAgICAgIH1cclxuICAgICAgICB3aGlsZSAodGhpcy5wYXRoQ2hhaW4ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhdGhSZWYgPSB0aGlzLnBhdGhDaGFpbi5wb3AoKSFcclxuICAgICAgICAgICAgdGhpcy5saW5lVG8oLi4ucGF0aFJlZilcclxuICAgICAgICB9XHJcbiAgICAgICAgd2hpbGUgKHRoaXMucGF0aC5vIS5sZW5ndGggPCB0aGlzLnBhdGguaSEubGVuZ3RoKVxyXG4gICAgICAgICAgICB0aGlzLnBhdGgubyEucHVzaChbMCwgMF0pXHJcbiAgICAgICAgdGhpcy5wYXRoLnYhLmZvckVhY2godmFsdWUgPT4ge1xyXG4gICAgICAgICAgICB2YWx1ZVswXSAtPSB0aGlzLm9mZnNldFhcclxuICAgICAgICAgICAgdmFsdWVbMV0gLT0gdGhpcy5vZmZzZXRZXHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLm9mZnNldFggPSAwXHJcbiAgICAgICAgdGhpcy5vZmZzZXRZID0gMFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwYXJzZShwYXRoRGF0YTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgcGF0aERhdGFTZXJpZXMgPSBwYXJzZVNWRyhwYXRoRGF0YSlcclxuICAgICAgICBsZXQgcGF0aERhdGFXaXRoVHlwZTtcclxuICAgICAgICBwYXRoRGF0YVNlcmllcy5mb3JFYWNoKHBhdGhEYXRhSXRlbSA9PiB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAocGF0aERhdGFJdGVtLmNvZGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ00nOlxyXG4gICAgICAgICAgICAgICAgICAgIHBhdGhEYXRhV2l0aFR5cGUgPSBwYXRoRGF0YUl0ZW0gYXMgTW92ZVRvQ29tbWFuZFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZVRvKHBhdGhEYXRhV2l0aFR5cGUueCwgcGF0aERhdGFXaXRoVHlwZS55KVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICBjYXNlICdtJzpcclxuICAgICAgICAgICAgICAgICAgICBwYXRoRGF0YVdpdGhUeXBlID0gcGF0aERhdGFJdGVtIGFzIE1vdmVUb0NvbW1hbmRcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVUb1JlbGF0aXZlKHBhdGhEYXRhV2l0aFR5cGUueCwgcGF0aERhdGFXaXRoVHlwZS55KVxyXG4gICAgICAgICAgICAgICAgY2FzZSAnTCc6XHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aERhdGFXaXRoVHlwZSA9IHBhdGhEYXRhSXRlbSBhcyBMaW5lVG9Db21tYW5kXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5saW5lVG8ocGF0aERhdGFXaXRoVHlwZS54LCBwYXRoRGF0YVdpdGhUeXBlLnkpXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2wnOlxyXG4gICAgICAgICAgICAgICAgICAgIHBhdGhEYXRhV2l0aFR5cGUgPSBwYXRoRGF0YUl0ZW0gYXMgTGluZVRvQ29tbWFuZFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGluZVRvUmVsYXRpdmUocGF0aERhdGFXaXRoVHlwZS54LCBwYXRoRGF0YVdpdGhUeXBlLnkpXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ0gnOlxyXG4gICAgICAgICAgICAgICAgICAgIHBhdGhEYXRhV2l0aFR5cGUgPSBwYXRoRGF0YUl0ZW0gYXMgSG9yaXpvbnRhbExpbmVUb0NvbW1hbmRcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhvcml6b250YWxUbyhwYXRoRGF0YVdpdGhUeXBlLngpXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2gnOlxyXG4gICAgICAgICAgICAgICAgICAgIHBhdGhEYXRhV2l0aFR5cGUgPSBwYXRoRGF0YUl0ZW0gYXMgSG9yaXpvbnRhbExpbmVUb0NvbW1hbmRcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhvcml6b250YWxUb1JlbGF0aXZlKHBhdGhEYXRhV2l0aFR5cGUueClcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnVic6XHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aERhdGFXaXRoVHlwZSA9IHBhdGhEYXRhSXRlbSBhcyBWZXJ0aWNhbExpbmVUb0NvbW1hbmRcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZlcnRpY2FsVG8ocGF0aERhdGFXaXRoVHlwZS55KVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICBjYXNlICd2JzpcclxuICAgICAgICAgICAgICAgICAgICBwYXRoRGF0YVdpdGhUeXBlID0gcGF0aERhdGFJdGVtIGFzIFZlcnRpY2FsTGluZVRvQ29tbWFuZFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGljYWxUb1JlbGF0aXZlKHBhdGhEYXRhV2l0aFR5cGUueSlcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnQyc6XHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aERhdGFXaXRoVHlwZSA9IHBhdGhEYXRhSXRlbSBhcyBDdXJ2ZVRvQ29tbWFuZFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3ViaWNCZXppZXJDdXJ2ZVRvKHBhdGhEYXRhV2l0aFR5cGUueDEsIHBhdGhEYXRhV2l0aFR5cGUueTEsIHBhdGhEYXRhV2l0aFR5cGUueDIsIHBhdGhEYXRhV2l0aFR5cGUueTIsIHBhdGhEYXRhV2l0aFR5cGUueCwgcGF0aERhdGFXaXRoVHlwZS55KVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICBjYXNlICdjJzpcclxuICAgICAgICAgICAgICAgICAgICBwYXRoRGF0YVdpdGhUeXBlID0gcGF0aERhdGFJdGVtIGFzIEN1cnZlVG9Db21tYW5kXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdWJpY0JlemllckN1cnZlVG9SZWxhdGl2ZShwYXRoRGF0YVdpdGhUeXBlLngxLCBwYXRoRGF0YVdpdGhUeXBlLnkxLCBwYXRoRGF0YVdpdGhUeXBlLngyLCBwYXRoRGF0YVdpdGhUeXBlLnkyLCBwYXRoRGF0YVdpdGhUeXBlLngsIHBhdGhEYXRhV2l0aFR5cGUueSlcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnUSc6XHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aERhdGFXaXRoVHlwZSA9IHBhdGhEYXRhSXRlbSBhcyBRdWFkcmF0aWNDdXJ2ZVRvQ29tbWFuZFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVhZHJhdGljQmV6aWVyQ3VydmVUbyhwYXRoRGF0YVdpdGhUeXBlLngxLCBwYXRoRGF0YVdpdGhUeXBlLnkxLCBwYXRoRGF0YVdpdGhUeXBlLngsIHBhdGhEYXRhV2l0aFR5cGUueSlcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgY2FzZSAncSc6XHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aERhdGFXaXRoVHlwZSA9IHBhdGhEYXRhSXRlbSBhcyBRdWFkcmF0aWNDdXJ2ZVRvQ29tbWFuZFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVhZHJhdGljQmV6aWVyQ3VydmVUb1JlbGF0aXZlKHBhdGhEYXRhV2l0aFR5cGUueDEsIHBhdGhEYXRhV2l0aFR5cGUueTEsIHBhdGhEYXRhV2l0aFR5cGUueCwgcGF0aERhdGFXaXRoVHlwZS55KVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICBjYXNlICdBJzpcclxuICAgICAgICAgICAgICAgICAgICBwYXRoRGF0YVdpdGhUeXBlID0gcGF0aERhdGFJdGVtIGFzIEVsbGlwdGljYWxBcmNDb21tYW5kXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcmNUbyhwYXRoRGF0YVdpdGhUeXBlLnJ4LCBwYXRoRGF0YVdpdGhUeXBlLnJ5LCBwYXRoRGF0YVdpdGhUeXBlLnhBeGlzUm90YXRpb24sIH5+cGF0aERhdGFXaXRoVHlwZS5sYXJnZUFyYywgfn5wYXRoRGF0YVdpdGhUeXBlLnN3ZWVwLCBwYXRoRGF0YVdpdGhUeXBlLngsIHBhdGhEYXRhV2l0aFR5cGUueSlcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnYSc6XHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aERhdGFXaXRoVHlwZSA9IHBhdGhEYXRhSXRlbSBhcyBFbGxpcHRpY2FsQXJjQ29tbWFuZFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXJjVG9SZWxhdGl2ZShwYXRoRGF0YVdpdGhUeXBlLnJ4LCBwYXRoRGF0YVdpdGhUeXBlLnJ5LCBwYXRoRGF0YVdpdGhUeXBlLnhBeGlzUm90YXRpb24sIH5+cGF0aERhdGFXaXRoVHlwZS5sYXJnZUFyYywgfn5wYXRoRGF0YVdpdGhUeXBlLnN3ZWVwLCBwYXRoRGF0YVdpdGhUeXBlLngsIHBhdGhEYXRhV2l0aFR5cGUueSlcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnWic6XHJcbiAgICAgICAgICAgICAgICBjYXNlICd6JzpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlUGF0aCgpXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihwYXRoRGF0YUl0ZW0pXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBpbXBsZW1lbnRhdGlvbiBmb3VuZCBmb3IgdGhpcyBwYXRoIGNvbW1hbmQuJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwc2FtcGxlKHJhdGlvOiBudW1iZXIpIHtcclxuICAgICAgICAvLyB1c2UgRGUgQ2FzdGVsamF1J3MgYWxnb3JpdGhtIHRvIGRvIHRoZSB1cHNhbXBsaW5nXHJcbiAgICAgICAgLy8gUmVmZXJlbmNlOiBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9EZV9DYXN0ZWxqYXUlMjdzX2FsZ29yaXRobVxyXG5cclxuICAgICAgICBpZiAoIU51bWJlci5pc0ludGVnZXIocmF0aW8pKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHVwc2FtcGxpbmcgcmF0aW8gc2hvdWxkIGJlIGFuIGludGVnZXIuJylcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy51bmlmb3JtKClcclxuICAgICAgICBpZiAocmF0aW8gPD0gMSkgcmV0dXJuXHJcbiAgICAgICAgY29uc3QgY29weVBhdGg6IFBhdGhEZWYgPSB7XHJcbiAgICAgICAgICAgIGM6IHRoaXMucGF0aC5jLFxyXG4gICAgICAgICAgICBpOiBbXSxcclxuICAgICAgICAgICAgbzogW10sXHJcbiAgICAgICAgICAgIHY6IFtdXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGF0aC52IS5mb3JFYWNoKCh2LCBpLCBhKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpIDw9IDApIHtcclxuICAgICAgICAgICAgICAgIGNvcHlQYXRoLnYhLnB1c2godilcclxuICAgICAgICAgICAgICAgIGNvcHlQYXRoLmkhLnB1c2godGhpcy5wYXRoLmkhW2ldKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3Qgb0FycmF5ID0gdGhpcy5wYXRoLm8hXHJcbiAgICAgICAgICAgIGNvbnN0IGlBcnJheSA9IHRoaXMucGF0aC5pIVxyXG4gICAgICAgICAgICBsZXQgeEFycmF5ID0gW2FbaSAtIDFdWzBdLCBvQXJyYXlbaSAtIDFdWzBdICsgYVtpIC0gMV1bMF0sIGlBcnJheVtpXVswXSArIHZbMF0sIHZbMF1dXHJcbiAgICAgICAgICAgIGxldCB5QXJyYXkgPSBbYVtpIC0gMV1bMV0sIG9BcnJheVtpIC0gMV1bMV0gKyBhW2kgLSAxXVsxXSwgaUFycmF5W2ldWzFdICsgdlsxXSwgdlsxXV1cclxuICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAxOyBpbmRleCA8IHJhdGlvOyBpbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdGVwUmF0aW8gPSAxIC8gKHJhdGlvIC0gaW5kZXggKyAxKVxyXG4gICAgICAgICAgICAgICAgY29uc3QgeFNwbGl0QXJyYXkgPSB0aGlzLmNhbGN1bGF0ZUJlemllclNwbGl0KHN0ZXBSYXRpbywgLi4ueEFycmF5KVxyXG4gICAgICAgICAgICAgICAgY29uc3QgeVNwbGl0QXJyYXkgPSB0aGlzLmNhbGN1bGF0ZUJlemllclNwbGl0KHN0ZXBSYXRpbywgLi4ueUFycmF5KVxyXG4gICAgICAgICAgICAgICAgY29uc3QgcDB4ID0geEFycmF5WzBdLCBwMXggPSB4U3BsaXRBcnJheS5zaGlmdCgpISAtIHAweCwgcDN4ID0geFNwbGl0QXJyYXlbMV0sIHAyeCA9IHhTcGxpdEFycmF5LnNoaWZ0KCkhIC0gcDN4LFxyXG4gICAgICAgICAgICAgICAgICAgIHAweSA9IHlBcnJheVswXSwgcDF5ID0geVNwbGl0QXJyYXkuc2hpZnQoKSEgLSBwMHksIHAzeSA9IHlTcGxpdEFycmF5WzFdLCBwMnkgPSB5U3BsaXRBcnJheS5zaGlmdCgpISAtIHAzeVxyXG4gICAgICAgICAgICAgICAgY29weVBhdGgubyEucHVzaChbcDF4LCBwMXldKVxyXG4gICAgICAgICAgICAgICAgY29weVBhdGguaSEucHVzaChbcDJ4LCBwMnldKVxyXG4gICAgICAgICAgICAgICAgY29weVBhdGgudiEucHVzaChbcDN4LCBwM3ldKVxyXG4gICAgICAgICAgICAgICAgeEFycmF5ID0geFNwbGl0QXJyYXlcclxuICAgICAgICAgICAgICAgIHlBcnJheSA9IHlTcGxpdEFycmF5XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgcDB4ID0geEFycmF5LnNoaWZ0KCkhLCBwMXggPSB4QXJyYXkuc2hpZnQoKSEgLSBwMHgsIHAzeCA9IHhBcnJheVsxXSwgcDJ4ID0geEFycmF5LnNoaWZ0KCkhIC0gcDN4LFxyXG4gICAgICAgICAgICAgICAgcDB5ID0geUFycmF5LnNoaWZ0KCkhLCBwMXkgPSB5QXJyYXkuc2hpZnQoKSEgLSBwMHksIHAzeSA9IHlBcnJheVsxXSwgcDJ5ID0geUFycmF5LnNoaWZ0KCkhIC0gcDN5XHJcbiAgICAgICAgICAgIGNvcHlQYXRoLm8hLnB1c2goW3AxeCwgcDF5XSlcclxuICAgICAgICAgICAgY29weVBhdGguaSEucHVzaChbcDJ4LCBwMnldKVxyXG4gICAgICAgICAgICBjb3B5UGF0aC52IS5wdXNoKFtwM3gsIHAzeV0pXHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLnBhdGggPSBjb3B5UGF0aFxyXG4gICAgICAgIHRoaXMudW5pZm9ybSgpXHJcbiAgICB9XHJcblxyXG59Il19