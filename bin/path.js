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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXRoLnRzIl0sIm5hbWVzIjpbIlBhdGhNYWtlciIsInBhdGhEYXRhIiwiYyIsImkiLCJvIiwidiIsIkluZmluaXR5IiwicGFyc2UiLCJ4IiwieSIsImN1cnJlbnRYIiwiY3VycmVudFkiLCJvZmZzZXRYIiwiTWF0aCIsIm1pbiIsIm9mZnNldFkiLCJwMCIsInAxIiwicDIiLCJwMyIsImEiLCJiIiwibWF4Iiwic3FydCIsInJvb3RzIiwibWFwIiwibXVsdGkiLCJmb3JFYWNoIiwicm9vdCIsInZhbHVlIiwicG93IiwiYXJyIiwicmF0aW8iLCJyZXN1bHQiLCJsZW5ndGgiLCJwdXNoIiwib3JkZXIwIiwib3JkZXIxIiwiY2FsY3VsYXRlSGlnaGx5T3JkZXIiLCJvcmRlcjIiLCJvcmRlcjMiLCJwYXRoUmVhZHkiLCJwYXRoIiwibGluZVRvIiwicGF0aFN0YXJ0IiwicGF0aENoYWluIiwibW92ZVRvIiwidXBkYXRlWFkiLCJob3Jpem9udGFsVG8iLCJ2ZXJ0aWNhbFRvIiwiYzF4IiwiYzF5IiwiYzJ4IiwiYzJ5IiwiY2FsY3VsYXRlQmV6aWVyTWluTWF4IiwiY3ViaWNCZXppZXJDdXJ2ZVRvIiwiY3giLCJjeSIsInF1YWRyYXRpY0JlemllckN1cnZlVG8iLCJyeCIsInJ5IiwieEF4aXNSb3RhdGlvbiIsImxhcmdlQXJjRmxhZyIsInN3ZWVwRmxhZyIsImNTZXJpZXMiLCJhMmMiLCJpb3ZMaXN0Iiwic3BsaWNlIiwiYXJjVG8iLCJwYXRoUmVmIiwicG9wIiwicGF0aERhdGFTZXJpZXMiLCJwYXRoRGF0YVdpdGhUeXBlIiwicGF0aERhdGFJdGVtIiwiY29kZSIsIm1vdmVUb1JlbGF0aXZlIiwibGluZVRvUmVsYXRpdmUiLCJob3Jpem9udGFsVG9SZWxhdGl2ZSIsInZlcnRpY2FsVG9SZWxhdGl2ZSIsIngxIiwieTEiLCJ4MiIsInkyIiwiY3ViaWNCZXppZXJDdXJ2ZVRvUmVsYXRpdmUiLCJxdWFkcmF0aWNCZXppZXJDdXJ2ZVRvUmVsYXRpdmUiLCJsYXJnZUFyYyIsInN3ZWVwIiwiYXJjVG9SZWxhdGl2ZSIsImNsb3NlUGF0aCIsImNvbnNvbGUiLCJlcnJvciIsIkVycm9yIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwidW5pZm9ybSIsImNvcHlQYXRoIiwib0FycmF5IiwiaUFycmF5IiwieEFycmF5IiwieUFycmF5IiwiaW5kZXgiLCJzdGVwUmF0aW8iLCJ4U3BsaXRBcnJheSIsImNhbGN1bGF0ZUJlemllclNwbGl0IiwieVNwbGl0QXJyYXkiLCJwMHgiLCJwMXgiLCJzaGlmdCIsInAzeCIsInAyeCIsInAweSIsInAxeSIsInAzeSIsInAyeSIsImFuZ2xlIiwibGFyZ2VfYXJjX2ZsYWciLCJzd2VlcF9mbGFnIiwicmVjdXJzaXZlIiwiXzEyMCIsIlBJIiwicmFkIiwicmVzIiwieHkiLCJyb3RhdGUiLCJYIiwiY29zIiwic2luIiwiWSIsImgiLCJyeDIiLCJyeTIiLCJrIiwiYWJzIiwiZjEiLCJhc2luIiwiZjIiLCJkZiIsImYyb2xkIiwieDJvbGQiLCJ5Mm9sZCIsImMxIiwiczEiLCJjMiIsInMyIiwidCIsInRhbiIsImh4IiwiaHkiLCJtMSIsIm0yIiwibTMiLCJtNCIsImNvbmNhdCIsImpvaW4iLCJzcGxpdCIsInBhcnNlRmxvYXQiLCJuZXdyZXMiLCJpaSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFYUEsUzs7O0FBYVQ7QUFLQSxxQkFBWUMsUUFBWixFQUErQjtBQUFBOztBQUFBLGtDQWpCUjtBQUNuQkMsTUFBQUEsQ0FBQyxFQUFFLEtBRGdCO0FBRW5CQyxNQUFBQSxDQUFDLEVBQUUsRUFGZ0I7QUFHbkJDLE1BQUFBLENBQUMsRUFBRSxFQUhnQjtBQUluQkMsTUFBQUEsQ0FBQyxFQUFFO0FBSmdCLEtBaUJROztBQUFBLHNDQVZKLENBVUk7O0FBQUEsc0NBVEosQ0FTSTs7QUFBQSxxQ0FSTEMsUUFRSzs7QUFBQSxxQ0FQTEEsUUFPSzs7QUFBQSx1Q0FKWCxLQUlXOztBQUFBLHVDQUhPLENBQUMsQ0FBRCxFQUFJ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akIsQ0FBQztBQUFBLGlCQUFJbUosVUFBVSxDQUFDbkosQ0FBRCxDQUFkO0FBQUEsU0FBaEQsQ0FBTjtBQUNBLFlBQUlvSixNQUFNLEdBQUcsRUFBYjs7QUFDQSxhQUFLLElBQUl6SixDQUFDLEdBQUcsQ0FBUixFQUFXMEosRUFBRSxHQUFHcEMsR0FBRyxDQUFDdkYsTUFBekIsRUFBaUMvQixDQUFDLEdBQUcwSixFQUFyQyxFQUF5QzFKLENBQUMsRUFBMUMsRUFBOEM7QUFDMUN5SixVQUFBQSxNQUFNLENBQUN6SixDQUFELENBQU4sR0FBWUEsQ0FBQyxHQUFHLENBQUosR0FBUXdILE1BQU0sQ0FBQ0YsR0FBRyxDQUFDdEgsQ0FBQyxHQUFHLENBQUwsQ0FBSixFQUFhc0gsR0FBRyxDQUFDdEgsQ0FBRCxDQUFoQixFQUFxQnFILEdBQXJCLENBQU4sQ0FBZ0MvRyxDQUF4QyxHQUE0Q2tILE1BQU0sQ0FBQ0YsR0FBRyxDQUFDdEgsQ0FBRCxDQUFKLEVBQVNzSCxHQUFHLENBQUN0SCxDQUFDLEdBQUcsQ0FBTCxDQUFaLEVBQXFCcUgsR0FBckIsQ0FBTixDQUFnQ2hILENBQXhGO0FBQ0g7O0FBQ0QsZUFBT29KLE1BQVA7QUFDSDtBQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGF0aERlZiB9IGZyb20gJy4vYW5pbWF0aW9uJ1xuaW1wb3J0IHsgcGFyc2VTVkcsIE1vdmVUb0NvbW1hbmQsIExpbmVUb0NvbW1hbmQsIEhvcml6b250YWxMaW5lVG9Db21tYW5kLCBWZXJ0aWNhbExpbmVUb0NvbW1hbmQsIEN1cnZlVG9Db21tYW5kLCBRdWFkcmF0aWNDdXJ2ZVRvQ29tbWFuZCwgRWxsaXB0aWNhbEFyY0NvbW1hbmQgfSBmcm9tICdzdmctcGF0aC1wYXJzZXInO1xuXG5leHBvcnQgY2xhc3MgUGF0aE1ha2VyIHtcbiAgICBwdWJsaWMgcGF0aDogUGF0aERlZiA9IHtcbiAgICAgICAgYzogZmFsc2UsXG4gICAgICAgIGk6IFtdLFxuICAgICAgICBvOiBbXSxcbiAgICAgICAgdjogW11cbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBjdXJyZW50WDogbnVtYmVyID0gMDtcbiAgICBwcml2YXRlIGN1cnJlbnRZOiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgb2Zmc2V0WDogbnVtYmVyID0gSW5maW5pdHk7XG4gICAgcHJpdmF0ZSBvZmZzZXRZOiBudW1iZXIgPSBJbmZpbml0eTtcblxuICAgIC8vIGZvciBkaXNjb250aW51b3VzIHBhdGhzXG4gICAgcHJpdmF0ZSBwYXRoUmVhZHkgPSBmYWxzZVxuICAgIHByaXZhdGUgcGF0aFN0YXJ0OiBbbnVtYmVyLCBudW1iZXJdID0gWzAsIDBdXG4gICAgcHJpdmF0ZSBwYXRoQ2hhaW46IFtudW1iZXIsIG51bWJlcl1bXSA9IFtdXG5cbiAgICBjb25zdHJ1Y3RvcihwYXRoRGF0YT86IHN0cmluZykge1xuICAgICAgICBpZiAocGF0aERhdGEpIHtcbiAgICAgICAgICAgIHRoaXMucGFyc2UocGF0aERhdGEpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVhZKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFggPSB4XG4gICAgICAgIHRoaXMuY3VycmVudFkgPSB5XG4gICAgICAgIHRoaXMub2Zmc2V0WCA9IE1hdGgubWluKHRoaXMub2Zmc2V0WCwgeClcbiAgICAgICAgdGhpcy5vZmZzZXRZID0gTWF0aC5taW4odGhpcy5vZmZzZXRZLCB5KVxuICAgIH1cblxuICAgIHByaXZhdGUgY2FsY3VsYXRlQmV6aWVyTWluTWF4KHAwOiBudW1iZXIsIHAxOiBudW1iZXIsIHAyOiBudW1iZXIsIHAzOiBudW1iZXIpOiBbbnVtYmVyLCBudW1iZXJdIHtcbiAgICAgICAgY29uc3QgYSA9IDMgKiAocDMgLSAzICogcDIgKyAzICogcDEgLSBwMClcbiAgICAgICAgY29uc3QgYiA9IDYgKiAocDIgLSAyICogcDEgKyBwMClcbiAgICAgICAgY29uc3QgYyA9IDMgKiAocDEgLSBwMClcbiAgICAgICAgbGV0IG1pbiA9IEluZmluaXR5LCBtYXggPSAtSW5maW5pdHlcbiAgICAgICAgaWYgKGIgKiBiIC0gNCAqIGEgKiBjID49IDApIHtcbiAgICAgICAgICAgIGNvbnN0IHNxcnQgPSBNYXRoLnNxcnQoYiAqIGIgLSA0ICogYSAqIGMpXG4gICAgICAgICAgICBjb25zdCByb290cyA9IFsxLCAtMV0ubWFwKG11bHRpID0+IChtdWx0aSAqIHNxcnQgLSBiKSAvIDIgLyBhKVxuICAgICAgICAgICAgcm9vdHMuZm9yRWFjaChyb290ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocm9vdCA+IDAgJiYgcm9vdCA8IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBNYXRoLnBvdygxIC0gcm9vdCwgMykgKiBwMCArIDMgKiBNYXRoLnBvdygxIC0gcm9vdCwgMikgKiByb290ICogcDEgKyAzICogKDEgLSByb290KSAqIHJvb3QgKiByb290ICogcDIgKyBNYXRoLnBvdyhyb290LCAzKSAqIHAzXG4gICAgICAgICAgICAgICAgICAgIG1pbiA9IE1hdGgubWluKG1pbiwgdmFsdWUpXG4gICAgICAgICAgICAgICAgICAgIG1heCA9IE1hdGgubWF4KG1heCwgdmFsdWUpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBtaW4gPSBNYXRoLm1pbihtaW4sIHAwLCBwMylcbiAgICAgICAgbWF4ID0gTWF0aC5tYXgobWF4LCBwMCwgcDMpXG4gICAgICAgIHJldHVybiBbbWluLCBtYXhdXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjYWxjdWxhdGVIaWdobHlPcmRlcihhcnI6IG51bWJlcltdLCByYXRpbzogbnVtYmVyKTogbnVtYmVyW10ge1xuICAgICAgICBsZXQgcmVzdWx0OiBudW1iZXJbXSA9IFtdXG4gICAgICAgIGFyci5mb3JFYWNoKCh2LCBpLCBhKSA9PiB7XG4gICAgICAgICAgICBpZiAoaSA+PSBhLmxlbmd0aCAtIDEpIHJldHVyblxuICAgICAgICAgICAgcmVzdWx0LnB1c2godiAqICgxIC0gcmF0aW8pICsgYVtpICsgMV0gKiByYXRpbylcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cblxuICAgIHByaXZhdGUgY2FsY3VsYXRlQmV6aWVyU3BsaXQocmF0aW86IG51bWJlciwgLi4ub3JkZXIwOiBudW1iZXJbXSk6IG51bWJlcltdIHtcbiAgICAgICAgbGV0IG9yZGVyMSA9IHRoaXMuY2FsY3VsYXRlSGlnaGx5T3JkZXIob3JkZXIwLCByYXRpbylcbiAgICAgICAgbGV0IG9yZGVyMiA9IHRoaXMuY2FsY3VsYXRlSGlnaGx5T3JkZXIob3JkZXIxLCByYXRpbylcbiAgICAgICAgbGV0IG9yZGVyMyA9IHRoaXMuY2FsY3VsYXRlSGlnaGx5T3JkZXIob3JkZXIyLCByYXRpbylcbiAgICAgICAgcmV0dXJuIFtvcmRlcjFbMF0sIG9yZGVyMlswXSwgb3JkZXIzWzBdLCBvcmRlcjJbMV0sIG9yZGVyMVsyXSwgb3JkZXIwWzNdXVxuICAgIH1cblxuICAgIHB1YmxpYyBtb3ZlVG8oeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKCF0aGlzLnBhdGhSZWFkeSkge1xuICAgICAgICAgICAgdGhpcy5wYXRoLmMgPSBmYWxzZVxuICAgICAgICAgICAgdGhpcy5wYXRoLmkgPSBbWzAsIDBdXVxuICAgICAgICAgICAgdGhpcy5wYXRoLm8gPSBbXVxuICAgICAgICAgICAgdGhpcy5wYXRoLnYgPSBbW3gsIHldXVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50WCA9IHhcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFkgPSB5XG4gICAgICAgICAgICB0aGlzLm9mZnNldFggPSB4XG4gICAgICAgICAgICB0aGlzLm9mZnNldFkgPSB5XG4gICAgICAgICAgICB0aGlzLnBhdGhSZWFkeSA9IHRydWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubGluZVRvKC4uLnRoaXMucGF0aFN0YXJ0KVxuICAgICAgICAgICAgdGhpcy5saW5lVG8oeCwgeSlcbiAgICAgICAgICAgIHRoaXMucGF0aENoYWluLnB1c2godGhpcy5wYXRoU3RhcnQpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYXRoU3RhcnQgPSBbeCwgeV1cbiAgICB9XG4gICAgcHVibGljIG1vdmVUb1JlbGF0aXZlKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMubW92ZVRvKHRoaXMuY3VycmVudFggKyB4LCB0aGlzLmN1cnJlbnRZICsgeSlcbiAgICB9XG4gICAgcHVibGljIGxpbmVUbyh4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgICAgICB0aGlzLnBhdGguaSEucHVzaChbMCwgMF0pXG4gICAgICAgIHRoaXMucGF0aC5vIS5wdXNoKFswLCAwXSlcbiAgICAgICAgdGhpcy5wYXRoLnYhLnB1c2goW3gsIHldKVxuICAgICAgICB0aGlzLnVwZGF0ZVhZKHgsIHkpXG4gICAgfVxuICAgIHB1YmxpYyBsaW5lVG9SZWxhdGl2ZSh4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgICAgICB0aGlzLmxpbmVUbyh0aGlzLmN1cnJlbnRYICsgeCwgdGhpcy5jdXJyZW50WSArIHkpXG4gICAgfVxuICAgIHB1YmxpYyBob3Jpem9udGFsVG8oeDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMubGluZVRvKHgsIHRoaXMuY3VycmVudFkpXG4gICAgfVxuICAgIHB1YmxpYyBob3Jpem9udGFsVG9SZWxhdGl2ZSh4OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5ob3Jpem9udGFsVG8odGhpcy5jdXJyZW50WCArIHgpXG4gICAgfVxuICAgIHB1YmxpYyB2ZXJ0aWNhbFRvKHk6IG51bWJlcikge1xuICAgICAgICB0aGlzLmxpbmVUbyh0aGlzLmN1cnJlbnRYLCB5KVxuICAgIH1cbiAgICBwdWJsaWMgdmVydGljYWxUb1JlbGF0aXZlKHk6IG51bWJlcikge1xuICAgICAgICB0aGlzLnZlcnRpY2FsVG8odGhpcy5jdXJyZW50WSArIHkpXG4gICAgfVxuICAgIHB1YmxpYyBjdWJpY0JlemllckN1cnZlVG8oXG4gICAgICAgIGMxeDogbnVtYmVyLFxuICAgICAgICBjMXk6IG51bWJlcixcbiAgICAgICAgYzJ4OiBudW1iZXIsXG4gICAgICAgIGMyeTogbnVtYmVyLFxuICAgICAgICB4OiBudW1iZXIsXG4gICAgICAgIHk6IG51bWJlclxuICAgICkge1xuICAgICAgICB0aGlzLnBhdGguaSEucHVzaChbYzJ4IC0geCwgYzJ5IC0geV0pXG4gICAgICAgIHRoaXMucGF0aC5vIS5wdXNoKFtjMXggLSB0aGlzLmN1cnJlbnRYLCBjMXkgLSB0aGlzLmN1cnJlbnRZXSlcbiAgICAgICAgdGhpcy5wYXRoLnYhLnB1c2goW3gsIHldKVxuICAgICAgICB0aGlzLm9mZnNldFggPSBNYXRoLm1pbih0aGlzLm9mZnNldFgsIC4uLnRoaXMuY2FsY3VsYXRlQmV6aWVyTWluTWF4KHRoaXMuY3VycmVudFgsIGMxeCwgYzJ4LCB4KSlcbiAgICAgICAgdGhpcy5vZmZzZXRZID0gTWF0aC5taW4odGhpcy5vZmZzZXRZLCAuLi50aGlzLmNhbGN1bGF0ZUJlemllck1pbk1heCh0aGlzLmN1cnJlbnRZLCBjMXksIGMyeSwgeSkpXG4gICAgICAgIHRoaXMudXBkYXRlWFkoeCwgeSlcbiAgICB9XG4gICAgcHVibGljIGN1YmljQmV6aWVyQ3VydmVUb1JlbGF0aXZlKFxuICAgICAgICBjMXg6IG51bWJlcixcbiAgICAgICAgYzF5OiBudW1iZXIsXG4gICAgICAgIGMyeDogbnVtYmVyLFxuICAgICAgICBjMnk6IG51bWJlcixcbiAgICAgICAgeDogbnVtYmVyLFxuICAgICAgICB5OiBudW1iZXJcbiAgICApIHtcbiAgICAgICAgdGhpcy5jdWJpY0JlemllckN1cnZlVG8odGhpcy5jdXJyZW50WCArIGMxeCwgdGhpcy5jdXJyZW50WSArIGMxeSwgdGhpcy5jdXJyZW50WCArIGMyeCwgdGhpcy5jdXJyZW50WSArIGMyeSwgdGhpcy5jdXJyZW50WCArIHgsIHRoaXMuY3VycmVudFkgKyB5KVxuICAgIH1cbiAgICBwdWJsaWMgcXVhZHJhdGljQmV6aWVyQ3VydmVUbyhjeDogbnVtYmVyLCBjeTogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgICAgICB0aGlzLnBhdGguaSEucHVzaChbY3ggLSB4LCBjeSAtIHldKVxuICAgICAgICB0aGlzLnBhdGgubyEucHVzaChbY3ggLSB0aGlzLmN1cnJlbnRYLCBjeSAtIHRoaXMuY3VycmVudFldKVxuICAgICAgICB0aGlzLnBhdGgudiEucHVzaChbeCwgeV0pXG4gICAgICAgIHRoaXMub2Zmc2V0WCA9IE1hdGgubWluKHRoaXMub2Zmc2V0WCwgLi4udGhpcy5jYWxjdWxhdGVCZXppZXJNaW5NYXgodGhpcy5jdXJyZW50WCwgY3gsIGN4LCB4KSlcbiAgICAgICAgdGhpcy5vZmZzZXRZID0gTWF0aC5taW4odGhpcy5vZmZzZXRZLCAuLi50aGlzLmNhbGN1bGF0ZUJlemllck1pbk1heCh0aGlzLmN1cnJlbnRZLCBjeSwgY3ksIHkpKVxuICAgICAgICB0aGlzLnVwZGF0ZVhZKHgsIHkpXG4gICAgfVxuICAgIHB1YmxpYyBxdWFkcmF0aWNCZXppZXJDdXJ2ZVRvUmVsYXRpdmUoY3g6IG51bWJlciwgY3k6IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5xdWFkcmF0aWNCZXppZXJDdXJ2ZVRvKHRoaXMuY3VycmVudFggKyBjeCwgdGhpcy5jdXJyZW50WSArIGN5LCB0aGlzLmN1cnJlbnRYICsgeCwgdGhpcy5jdXJyZW50WSArIHkpXG4gICAgfVxuICAgIHB1YmxpYyBhcmNUbyhcbiAgICAgICAgcng6IG51bWJlcixcbiAgICAgICAgcnk6IG51bWJlcixcbiAgICAgICAgeEF4aXNSb3RhdGlvbjogbnVtYmVyLFxuICAgICAgICBsYXJnZUFyY0ZsYWc6IG51bWJlcixcbiAgICAgICAgc3dlZXBGbGFnOiBudW1iZXIsXG4gICAgICAgIHg6IG51bWJlcixcbiAgICAgICAgeTogbnVtYmVyXG4gICAgKSB7XG4gICAgICAgIGNvbnN0IGNTZXJpZXMgPSBQYXRoTWFrZXIuYTJjKHRoaXMuY3VycmVudFgsIHRoaXMuY3VycmVudFksIHJ4LCByeSwgeEF4aXNSb3RhdGlvbiwgbGFyZ2VBcmNGbGFnLCBzd2VlcEZsYWcsIHgsIHkpIGFzIG51bWJlcltdXG4gICAgICAgIHdoaWxlIChjU2VyaWVzLmxlbmd0aCA+PSA2KSB7XG4gICAgICAgICAgICBjb25zdCBpb3ZMaXN0ID0gY1Nlcmllcy5zcGxpY2UoMCwgNilcbiAgICAgICAgICAgIHRoaXMucGF0aC5pIS5wdXNoKFtpb3ZMaXN0WzJdIC0gaW92TGlzdFs0XSwgaW92TGlzdFszXSAtIGlvdkxpc3RbNV1dKVxuICAgICAgICAgICAgdGhpcy5wYXRoLm8hLnB1c2goW2lvdkxpc3RbMF0gLSB0aGlzLmN1cnJlbnRYLCBpb3ZMaXN0WzFdIC0gdGhpcy5jdXJyZW50WV0pXG4gICAgICAgICAgICB0aGlzLnBhdGgudiEucHVzaChbaW92TGlzdFs0XSwgaW92TGlzdFs1XV0pXG4gICAgICAgICAgICB0aGlzLm9mZnNldFggPSBNYXRoLm1pbih0aGlzLm9mZnNldFgsIC4uLnRoaXMuY2FsY3VsYXRlQmV6aWVyTWluTWF4KHRoaXMuY3VycmVudFgsIGlvdkxpc3RbMF0sIGlvdkxpc3RbMl0sIGlvdkxpc3RbNF0pKVxuICAgICAgICAgICAgdGhpcy5vZmZzZXRZID0gTWF0aC5taW4odGhpcy5vZmZzZXRZLCAuLi50aGlzLmNhbGN1bGF0ZUJlemllck1pbk1heCh0aGlzLmN1cnJlbnRZLCBpb3ZMaXN0WzFdLCBpb3ZMaXN0WzNdLCBpb3ZMaXN0WzVdKSlcbiAgICAgICAgICAgIHRoaXMudXBkYXRlWFkoaW92TGlzdFs0XSwgaW92TGlzdFs1XSlcbiAgICAgICAgfVxuICAgIH1cbiAgICBwdWJsaWMgYXJjVG9SZWxhdGl2ZShcbiAgICAgICAgcng6IG51bWJlcixcbiAgICAgICAgcnk6IG51bWJlcixcbiAgICAgICAgeEF4aXNSb3RhdGlvbjogbnVtYmVyLFxuICAgICAgICBsYXJnZUFyY0ZsYWc6IG51bWJlcixcbiAgICAgICAgc3dlZXBGbGFnOiBudW1iZXIsXG4gICAgICAgIHg6IG51bWJlcixcbiAgICAgICAgeTogbnVtYmVyXG4gICAgKSB7XG4gICAgICAgIHRoaXMuYXJjVG8ocngsIHJ5LCB4QXhpc1JvdGF0aW9uLCBsYXJnZUFyY0ZsYWcsIHN3ZWVwRmxhZywgdGhpcy5jdXJyZW50WCArIHgsIHRoaXMuY3VycmVudFkgKyB5KVxuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIGEyYyh4MTogbnVtYmVyLCB5MTogbnVtYmVyLCByeDogbnVtYmVyLCByeTogbnVtYmVyLCBhbmdsZTogbnVtYmVyLCBsYXJnZV9hcmNfZmxhZzogbnVtYmVyLCBzd2VlcF9mbGFnOiBudW1iZXIsIHgyOiBudW1iZXIsIHkyOiBudW1iZXIsIHJlY3Vyc2l2ZT86IG51bWJlcltdKTogbnVtYmVyW10gfCBudW1iZXJbXVtdIHtcbiAgICAgICAgLy8gZm9yIG1vcmUgaW5mb3JtYXRpb24gb2Ygd2hlcmUgdGhpcyBNYXRoIGNhbWUgZnJvbSB2aXNpdDpcbiAgICAgICAgLy8gaHR0cDovL3d3dy53My5vcmcvVFIvU1ZHMTEvaW1wbG5vdGUuaHRtbCNBcmNJbXBsZW1lbnRhdGlvbk5vdGVzXG4gICAgICAgIHZhciBfMTIwID0gTWF0aC5QSSAqIDEyMCAvIDE4MCxcbiAgICAgICAgICAgIHJhZCA9IE1hdGguUEkgLyAxODAgKiAoK2FuZ2xlIHx8IDApLFxuICAgICAgICAgICAgcmVzOiBudW1iZXJbXSA9IFtdLFxuICAgICAgICAgICAgeHksXG4gICAgICAgICAgICByb3RhdGUgPSAoeDogbnVtYmVyLCB5OiBudW1iZXIsIHJhZDogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIFggPSB4ICogTWF0aC5jb3MocmFkKSAtIHkgKiBNYXRoLnNpbihyYWQpLFxuICAgICAgICAgICAgICAgICAgICBZID0geCAqIE1hdGguc2luKHJhZCkgKyB5ICogTWF0aC5jb3MocmFkKTtcbiAgICAgICAgICAgICAgICByZXR1cm4geyB4OiBYLCB5OiBZIH07XG4gICAgICAgICAgICB9O1xuICAgICAgICBpZiAoIXJ4IHx8ICFyeSkge1xuICAgICAgICAgICAgcmV0dXJuIFt4MSwgeTEsIHgyLCB5MiwgeDIsIHkyXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXJlY3Vyc2l2ZSkge1xuICAgICAgICAgICAgeHkgPSByb3RhdGUoeDEsIHkxLCAtcmFkKTtcbiAgICAgICAgICAgIHgxID0geHkueDtcbiAgICAgICAgICAgIHkxID0geHkueTtcbiAgICAgICAgICAgIHh5ID0gcm90YXRlKHgyLCB5MiwgLXJhZCk7XG4gICAgICAgICAgICB4MiA9IHh5Lng7XG4gICAgICAgICAgICB5MiA9IHh5Lnk7XG4gICAgICAgICAgICB2YXIgY29zID0gTWF0aC5jb3MoTWF0aC5QSSAvIDE4MCAqIGFuZ2xlKSxcbiAgICAgICAgICAgICAgICBzaW4gPSBNYXRoLnNpbihNYXRoLlBJIC8gMTgwICogYW5nbGUpLFxuICAgICAgICAgICAgICAgIHggPSAoeDEgLSB4MikgLyAyLFxuICAgICAgICAgICAgICAgIHkgPSAoeTEgLSB5MikgLyAyO1xuICAgICAgICAgICAgdmFyIGggPSB4ICogeCAvIChyeCAqIHJ4KSArIHkgKiB5IC8gKHJ5ICogcnkpO1xuICAgICAgICAgICAgaWYgKGggPiAxKSB7XG4gICAgICAgICAgICAgICAgaCA9IE1hdGguc3FydChoKTtcbiAgICAgICAgICAgICAgICByeCA9IGggKiByeDtcbiAgICAgICAgICAgICAgICByeSA9IGggKiByeTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciByeDIgPSByeCAqIHJ4LFxuICAgICAgICAgICAgICAgIHJ5MiA9IHJ5ICogcnksXG4gICAgICAgICAgICAgICAgayA9IChsYXJnZV9hcmNfZmxhZyA9PSBzd2VlcF9mbGFnID8gLTEgOiAxKSAqXG4gICAgICAgICAgICAgICAgICAgIE1hdGguc3FydChNYXRoLmFicygocngyICogcnkyIC0gcngyICogeSAqIHkgLSByeTIgKiB4ICogeCkgLyAocngyICogeSAqIHkgKyByeTIgKiB4ICogeCkpKSxcbiAgICAgICAgICAgICAgICBjeCA9IGsgKiByeCAqIHkgLyByeSArICh4MSArIHgyKSAvIDIsXG4gICAgICAgICAgICAgICAgY3kgPSBrICogLXJ5ICogeCAvIHJ4ICsgKHkxICsgeTIpIC8gMixcbiAgICAgICAgICAgICAgICBmMSA9IE1hdGguYXNpbigoeTEgLSBjeSkgLyByeSksXG4gICAgICAgICAgICAgICAgZjIgPSBNYXRoLmFzaW4oKHkyIC0gY3kpIC8gcnkpO1xuXG4gICAgICAgICAgICBmMSA9IHgxIDwgY3ggPyBNYXRoLlBJIC0gZjEgOiBmMTtcbiAgICAgICAgICAgIGYyID0geDIgPCBjeCA/IE1hdGguUEkgLSBmMiA6IGYyO1xuICAgICAgICAgICAgZjEgPCAwICYmIChmMSA9IE1hdGguUEkgKiAyICsgZjEpO1xuICAgICAgICAgICAgZjIgPCAwICYmIChmMiA9IE1hdGguUEkgKiAyICsgZjIpO1xuICAgICAgICAgICAgaWYgKHN3ZWVwX2ZsYWcgJiYgZjEgPiBmMikge1xuICAgICAgICAgICAgICAgIGYxID0gZjEgLSBNYXRoLlBJICogMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghc3dlZXBfZmxhZyAmJiBmMiA+IGYxKSB7XG4gICAgICAgICAgICAgICAgZjIgPSBmMiAtIE1hdGguUEkgKiAyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZjEgPSByZWN1cnNpdmVbMF07XG4gICAgICAgICAgICBmMiA9IHJlY3Vyc2l2ZVsxXTtcbiAgICAgICAgICAgIGN4ID0gcmVjdXJzaXZlWzJdO1xuICAgICAgICAgICAgY3kgPSByZWN1cnNpdmVbM107XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRmID0gZjIgLSBmMTtcbiAgICAgICAgaWYgKE1hdGguYWJzKGRmKSA+IF8xMjApIHtcbiAgICAgICAgICAgIHZhciBmMm9sZCA9IGYyLFxuICAgICAgICAgICAgICAgIHgyb2xkID0geDIsXG4gICAgICAgICAgICAgICAgeTJvbGQgPSB5MjtcbiAgICAgICAgICAgIGYyID0gZjEgKyBfMTIwICogKHN3ZWVwX2ZsYWcgJiYgZjIgPiBmMSA/IDEgOiAtMSk7XG4gICAgICAgICAgICB4MiA9IGN4ICsgcnggKiBNYXRoLmNvcyhmMik7XG4gICAgICAgICAgICB5MiA9IGN5ICsgcnkgKiBNYXRoLnNpbihmMik7XG4gICAgICAgICAgICByZXMgPSB0aGlzLmEyYyh4MiwgeTIsIHJ4LCByeSwgYW5nbGUsIDAsIHN3ZWVwX2ZsYWcsIHgyb2xkLCB5Mm9sZCwgW2YyLCBmMm9sZCwgY3gsIGN5XSkgYXMgbnVtYmVyW107XG4gICAgICAgIH1cbiAgICAgICAgZGYgPSBmMiAtIGYxO1xuICAgICAgICB2YXIgYzEgPSBNYXRoLmNvcyhmMSksXG4gICAgICAgICAgICBzMSA9IE1hdGguc2luKGYxKSxcbiAgICAgICAgICAgIGMyID0gTWF0aC5jb3MoZjIpLFxuICAgICAgICAgICAgczIgPSBNYXRoLnNpbihmMiksXG4gICAgICAgICAgICB0ID0gTWF0aC50YW4oZGYgLyA0KSxcbiAgICAgICAgICAgIGh4ID0gNCAvIDMgKiByeCAqIHQsXG4gICAgICAgICAgICBoeSA9IDQgLyAzICogcnkgKiB0LFxuICAgICAgICAgICAgbTEgPSBbeDEsIHkxXSxcbiAgICAgICAgICAgIG0yID0gW3gxICsgaHggKiBzMSwgeTEgLSBoeSAqIGMxXSxcbiAgICAgICAgICAgIG0zID0gW3gyICsgaHggKiBzMiwgeTIgLSBoeSAqIGMyXSxcbiAgICAgICAgICAgIG00ID0gW3gyLCB5Ml07XG4gICAgICAgIG0yWzBdID0gMiAqIG0xWzBdIC0gbTJbMF07XG4gICAgICAgIG0yWzFdID0gMiAqIG0xWzFdIC0gbTJbMV07XG4gICAgICAgIGlmIChyZWN1cnNpdmUpIHtcbiAgICAgICAgICAgIHJldHVybiBbbTIsIG0zLCBtNF0uY29uY2F0KHJlcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXMgPSBbbTIsIG0zLCBtNF0uY29uY2F0KHJlcykuam9pbigpLnNwbGl0KFwiLFwiKS5tYXAoeCA9PiBwYXJzZUZsb2F0KHgpKTtcbiAgICAgICAgICAgIHZhciBuZXdyZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IHJlcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbmV3cmVzW2ldID0gaSAlIDIgPyByb3RhdGUocmVzW2kgLSAxXSwgcmVzW2ldLCByYWQpLnkgOiByb3RhdGUocmVzW2ldLCByZXNbaSArIDFdLCByYWQpLng7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmV3cmVzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGNsb3NlUGF0aCgpIHtcbiAgICAgICAgdGhpcy5wYXRoLmMgPSB0cnVlXG4gICAgfVxuXG4gICAgcHVibGljIHVuaWZvcm0oKSB7XG4gICAgICAgIGlmICh0aGlzLnBhdGhDaGFpbi5sZW5ndGggJiYgISh0aGlzLmN1cnJlbnRYID09IHRoaXMucGF0aFN0YXJ0WzBdICYmIHRoaXMuY3VycmVudFkgPT0gdGhpcy5wYXRoU3RhcnRbMV0pKSB7XG4gICAgICAgICAgICB0aGlzLmxpbmVUbyguLi50aGlzLnBhdGhTdGFydClcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAodGhpcy5wYXRoQ2hhaW4ubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBwYXRoUmVmID0gdGhpcy5wYXRoQ2hhaW4ucG9wKCkhXG4gICAgICAgICAgICB0aGlzLmxpbmVUbyguLi5wYXRoUmVmKVxuICAgICAgICB9XG4gICAgICAgIHdoaWxlICh0aGlzLnBhdGgubyEubGVuZ3RoIDwgdGhpcy5wYXRoLmkhLmxlbmd0aClcbiAgICAgICAgICAgIHRoaXMucGF0aC5vIS5wdXNoKFswLCAwXSlcbiAgICAgICAgdGhpcy5wYXRoLnYhLmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgICAgICAgdmFsdWVbMF0gLT0gdGhpcy5vZmZzZXRYXG4gICAgICAgICAgICB2YWx1ZVsxXSAtPSB0aGlzLm9mZnNldFlcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5vZmZzZXRYID0gMFxuICAgICAgICB0aGlzLm9mZnNldFkgPSAwXG4gICAgfVxuXG4gICAgcHVibGljIHBhcnNlKHBhdGhEYXRhOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgcGF0aERhdGFTZXJpZXMgPSBwYXJzZVNWRyhwYXRoRGF0YSlcbiAgICAgICAgbGV0IHBhdGhEYXRhV2l0aFR5cGU7XG4gICAgICAgIHBhdGhEYXRhU2VyaWVzLmZvckVhY2gocGF0aERhdGFJdGVtID0+IHtcbiAgICAgICAgICAgIHN3aXRjaCAocGF0aERhdGFJdGVtLmNvZGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdNJzpcbiAgICAgICAgICAgICAgICAgICAgcGF0aERhdGFXaXRoVHlwZSA9IHBhdGhEYXRhSXRlbSBhcyBNb3ZlVG9Db21tYW5kXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZVRvKHBhdGhEYXRhV2l0aFR5cGUueCwgcGF0aERhdGFXaXRoVHlwZS55KVxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIGNhc2UgJ20nOlxuICAgICAgICAgICAgICAgICAgICBwYXRoRGF0YVdpdGhUeXBlID0gcGF0aERhdGFJdGVtIGFzIE1vdmVUb0NvbW1hbmRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlVG9SZWxhdGl2ZShwYXRoRGF0YVdpdGhUeXBlLngsIHBhdGhEYXRhV2l0aFR5cGUueSlcbiAgICAgICAgICAgICAgICBjYXNlICdMJzpcbiAgICAgICAgICAgICAgICAgICAgcGF0aERhdGFXaXRoVHlwZSA9IHBhdGhEYXRhSXRlbSBhcyBMaW5lVG9Db21tYW5kXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGluZVRvKHBhdGhEYXRhV2l0aFR5cGUueCwgcGF0aERhdGFXaXRoVHlwZS55KVxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIGNhc2UgJ2wnOlxuICAgICAgICAgICAgICAgICAgICBwYXRoRGF0YVdpdGhUeXBlID0gcGF0aERhdGFJdGVtIGFzIExpbmVUb0NvbW1hbmRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5saW5lVG9SZWxhdGl2ZShwYXRoRGF0YVdpdGhUeXBlLngsIHBhdGhEYXRhV2l0aFR5cGUueSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBjYXNlICdIJzpcbiAgICAgICAgICAgICAgICAgICAgcGF0aERhdGFXaXRoVHlwZSA9IHBhdGhEYXRhSXRlbSBhcyBIb3Jpem9udGFsTGluZVRvQ29tbWFuZFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhvcml6b250YWxUbyhwYXRoRGF0YVdpdGhUeXBlLngpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgY2FzZSAnaCc6XG4gICAgICAgICAgICAgICAgICAgIHBhdGhEYXRhV2l0aFR5cGUgPSBwYXRoRGF0YUl0ZW0gYXMgSG9yaXpvbnRhbExpbmVUb0NvbW1hbmRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ob3Jpem9udGFsVG9SZWxhdGl2ZShwYXRoRGF0YVdpdGhUeXBlLngpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgY2FzZSAnVic6XG4gICAgICAgICAgICAgICAgICAgIHBhdGhEYXRhV2l0aFR5cGUgPSBwYXRoRGF0YUl0ZW0gYXMgVmVydGljYWxMaW5lVG9Db21tYW5kXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGljYWxUbyhwYXRoRGF0YVdpdGhUeXBlLnkpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgY2FzZSAndic6XG4gICAgICAgICAgICAgICAgICAgIHBhdGhEYXRhV2l0aFR5cGUgPSBwYXRoRGF0YUl0ZW0gYXMgVmVydGljYWxMaW5lVG9Db21tYW5kXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGljYWxUb1JlbGF0aXZlKHBhdGhEYXRhV2l0aFR5cGUueSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBjYXNlICdDJzpcbiAgICAgICAgICAgICAgICAgICAgcGF0aERhdGFXaXRoVHlwZSA9IHBhdGhEYXRhSXRlbSBhcyBDdXJ2ZVRvQ29tbWFuZFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1YmljQmV6aWVyQ3VydmVUbyhwYXRoRGF0YVdpdGhUeXBlLngxLCBwYXRoRGF0YVdpdGhUeXBlLnkxLCBwYXRoRGF0YVdpdGhUeXBlLngyLCBwYXRoRGF0YVdpdGhUeXBlLnkyLCBwYXRoRGF0YVdpdGhUeXBlLngsIHBhdGhEYXRhV2l0aFR5cGUueSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBjYXNlICdjJzpcbiAgICAgICAgICAgICAgICAgICAgcGF0aERhdGFXaXRoVHlwZSA9IHBhdGhEYXRhSXRlbSBhcyBDdXJ2ZVRvQ29tbWFuZFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1YmljQmV6aWVyQ3VydmVUb1JlbGF0aXZlKHBhdGhEYXRhV2l0aFR5cGUueDEsIHBhdGhEYXRhV2l0aFR5cGUueTEsIHBhdGhEYXRhV2l0aFR5cGUueDIsIHBhdGhEYXRhV2l0aFR5cGUueTIsIHBhdGhEYXRhV2l0aFR5cGUueCwgcGF0aERhdGFXaXRoVHlwZS55KVxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIGNhc2UgJ1EnOlxuICAgICAgICAgICAgICAgICAgICBwYXRoRGF0YVdpdGhUeXBlID0gcGF0aERhdGFJdGVtIGFzIFF1YWRyYXRpY0N1cnZlVG9Db21tYW5kXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVhZHJhdGljQmV6aWVyQ3VydmVUbyhwYXRoRGF0YVdpdGhUeXBlLngxLCBwYXRoRGF0YVdpdGhUeXBlLnkxLCBwYXRoRGF0YVdpdGhUeXBlLngsIHBhdGhEYXRhV2l0aFR5cGUueSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBjYXNlICdxJzpcbiAgICAgICAgICAgICAgICAgICAgcGF0aERhdGFXaXRoVHlwZSA9IHBhdGhEYXRhSXRlbSBhcyBRdWFkcmF0aWNDdXJ2ZVRvQ29tbWFuZFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1YWRyYXRpY0JlemllckN1cnZlVG9SZWxhdGl2ZShwYXRoRGF0YVdpdGhUeXBlLngxLCBwYXRoRGF0YVdpdGhUeXBlLnkxLCBwYXRoRGF0YVdpdGhUeXBlLngsIHBhdGhEYXRhV2l0aFR5cGUueSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBjYXNlICdBJzpcbiAgICAgICAgICAgICAgICAgICAgcGF0aERhdGFXaXRoVHlwZSA9IHBhdGhEYXRhSXRlbSBhcyBFbGxpcHRpY2FsQXJjQ29tbWFuZFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFyY1RvKHBhdGhEYXRhV2l0aFR5cGUucngsIHBhdGhEYXRhV2l0aFR5cGUucnksIHBhdGhEYXRhV2l0aFR5cGUueEF4aXNSb3RhdGlvbiwgfn5wYXRoRGF0YVdpdGhUeXBlLmxhcmdlQXJjLCB+fnBhdGhEYXRhV2l0aFR5cGUuc3dlZXAsIHBhdGhEYXRhV2l0aFR5cGUueCwgcGF0aERhdGFXaXRoVHlwZS55KVxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIGNhc2UgJ2EnOlxuICAgICAgICAgICAgICAgICAgICBwYXRoRGF0YVdpdGhUeXBlID0gcGF0aERhdGFJdGVtIGFzIEVsbGlwdGljYWxBcmNDb21tYW5kXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXJjVG9SZWxhdGl2ZShwYXRoRGF0YVdpdGhUeXBlLnJ4LCBwYXRoRGF0YVdpdGhUeXBlLnJ5LCBwYXRoRGF0YVdpdGhUeXBlLnhBeGlzUm90YXRpb24sIH5+cGF0aERhdGFXaXRoVHlwZS5sYXJnZUFyYywgfn5wYXRoRGF0YVdpdGhUeXBlLnN3ZWVwLCBwYXRoRGF0YVdpdGhUeXBlLngsIHBhdGhEYXRhV2l0aFR5cGUueSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBjYXNlICdaJzpcbiAgICAgICAgICAgICAgICBjYXNlICd6JzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZVBhdGgoKVxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IocGF0aERhdGFJdGVtKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGltcGxlbWVudGF0aW9uIGZvdW5kIGZvciB0aGlzIHBhdGggY29tbWFuZC4nKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHB1YmxpYyB1cHNhbXBsZShyYXRpbzogbnVtYmVyKSB7XG4gICAgICAgIC8vIHVzZSBEZSBDYXN0ZWxqYXUncyBhbGdvcml0aG0gdG8gZG8gdGhlIHVwc2FtcGxpbmdcbiAgICAgICAgLy8gUmVmZXJlbmNlOiBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9EZV9DYXN0ZWxqYXUlMjdzX2FsZ29yaXRobVxuXG4gICAgICAgIGlmICghTnVtYmVyLmlzSW50ZWdlcihyYXRpbykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHVwc2FtcGxpbmcgcmF0aW8gc2hvdWxkIGJlIGFuIGludGVnZXIuJylcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVuaWZvcm0oKVxuICAgICAgICBpZiAocmF0aW8gPD0gMSkgcmV0dXJuXG4gICAgICAgIGNvbnN0IGNvcHlQYXRoOiBQYXRoRGVmID0ge1xuICAgICAgICAgICAgYzogdGhpcy5wYXRoLmMsXG4gICAgICAgICAgICBpOiBbXSxcbiAgICAgICAgICAgIG86IFtdLFxuICAgICAgICAgICAgdjogW11cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhdGgudiEuZm9yRWFjaCgodiwgaSwgYSkgPT4ge1xuICAgICAgICAgICAgaWYgKGkgPD0gMCkge1xuICAgICAgICAgICAgICAgIGNvcHlQYXRoLnYhLnB1c2godilcbiAgICAgICAgICAgICAgICBjb3B5UGF0aC5pIS5wdXNoKHRoaXMucGF0aC5pIVtpXSlcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG9BcnJheSA9IHRoaXMucGF0aC5vIVxuICAgICAgICAgICAgY29uc3QgaUFycmF5ID0gdGhpcy5wYXRoLmkhXG4gICAgICAgICAgICBsZXQgeEFycmF5ID0gW2FbaSAtIDFdWzBdLCBvQXJyYXlbaSAtIDFdWzBdICsgYVtpIC0gMV1bMF0sIGlBcnJheVtpXVswXSArIHZbMF0sIHZbMF1dXG4gICAgICAgICAgICBsZXQgeUFycmF5ID0gW2FbaSAtIDFdWzFdLCBvQXJyYXlbaSAtIDFdWzFdICsgYVtpIC0gMV1bMV0sIGlBcnJheVtpXVsxXSArIHZbMV0sIHZbMV1dXG4gICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDE7IGluZGV4IDwgcmF0aW87IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGVwUmF0aW8gPSAxIC8gKHJhdGlvIC0gaW5kZXggKyAxKVxuICAgICAgICAgICAgICAgIGNvbnN0IHhTcGxpdEFycmF5ID0gdGhpcy5jYWxjdWxhdGVCZXppZXJTcGxpdChzdGVwUmF0aW8sIC4uLnhBcnJheSlcbiAgICAgICAgICAgICAgICBjb25zdCB5U3BsaXRBcnJheSA9IHRoaXMuY2FsY3VsYXRlQmV6aWVyU3BsaXQoc3RlcFJhdGlvLCAuLi55QXJyYXkpXG4gICAgICAgICAgICAgICAgY29uc3QgcDB4ID0geEFycmF5WzBdLCBwMXggPSB4U3BsaXRBcnJheS5zaGlmdCgpISAtIHAweCwgcDN4ID0geFNwbGl0QXJyYXlbMV0sIHAyeCA9IHhTcGxpdEFycmF5LnNoaWZ0KCkhIC0gcDN4LFxuICAgICAgICAgICAgICAgICAgICBwMHkgPSB5QXJyYXlbMF0sIHAxeSA9IHlTcGxpdEFycmF5LnNoaWZ0KCkhIC0gcDB5LCBwM3kgPSB5U3BsaXRBcnJheVsxXSwgcDJ5ID0geVNwbGl0QXJyYXkuc2hpZnQoKSEgLSBwM3lcbiAgICAgICAgICAgICAgICBjb3B5UGF0aC5vIS5wdXNoKFtwMXgsIHAxeV0pXG4gICAgICAgICAgICAgICAgY29weVBhdGguaSEucHVzaChbcDJ4LCBwMnldKVxuICAgICAgICAgICAgICAgIGNvcHlQYXRoLnYhLnB1c2goW3AzeCwgcDN5XSlcbiAgICAgICAgICAgICAgICB4QXJyYXkgPSB4U3BsaXRBcnJheVxuICAgICAgICAgICAgICAgIHlBcnJheSA9IHlTcGxpdEFycmF5XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBwMHggPSB4QXJyYXkuc2hpZnQoKSEsIHAxeCA9IHhBcnJheS5zaGlmdCgpISAtIHAweCwgcDN4ID0geEFycmF5WzFdLCBwMnggPSB4QXJyYXkuc2hpZnQoKSEgLSBwM3gsXG4gICAgICAgICAgICAgICAgcDB5ID0geUFycmF5LnNoaWZ0KCkhLCBwMXkgPSB5QXJyYXkuc2hpZnQoKSEgLSBwMHksIHAzeSA9IHlBcnJheVsxXSwgcDJ5ID0geUFycmF5LnNoaWZ0KCkhIC0gcDN5XG4gICAgICAgICAgICBjb3B5UGF0aC5vIS5wdXNoKFtwMXgsIHAxeV0pXG4gICAgICAgICAgICBjb3B5UGF0aC5pIS5wdXNoKFtwMngsIHAyeV0pXG4gICAgICAgICAgICBjb3B5UGF0aC52IS5wdXNoKFtwM3gsIHAzeV0pXG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMucGF0aCA9IGNvcHlQYXRoXG4gICAgICAgIHRoaXMudW5pZm9ybSgpXG4gICAgfVxuXG59Il19