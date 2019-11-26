"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LayerFactory = exports.JSMovinLayer = void 0;

var _easing = require("./easing");

var _render = require("./render");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var JSMovinLayer =
/*#__PURE__*/
function () {
  _createClass(JSMovinLayer, [{
    key: "getDefaultProperty",
    value: function getDefaultProperty(key) {
      switch (key) {
        case 'a':
        case 'p':
          return [0, 0, 0];

        case 's':
          return [100, 100, 100];

        case 'o':
          return 100;

        case 'r':
          return 0;

        default:
          return 0;
      }
    }
  }, {
    key: "convertToStaticProperty",
    value: function convertToStaticProperty(transform, key) {
      if (!transform[key]) {
        transform[key] = {
          a: 0,
          k: this.getDefaultProperty(key)
        };
      }

      if (transform[key].a == 1) {
        var staticValue = transform[key].k[0].s;
        transform[key] = {
          a: 0,
          k: staticValue
        };
      }
    }
  }, {
    key: "convertToAnimatableProperty",
    value: function convertToAnimatableProperty(transform, key) {
      if (!transform[key] || transform[key].a == 0) {
        transform[key] = {
          a: 1,
          k: []
        };
      }
    }
  }, {
    key: "addKeyframe",
    value: function addKeyframe(transform, key) {
      var idx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;
      var time = arguments.length > 3 ? arguments[3] : undefined;
      var value = arguments.length > 4 ? arguments[4] : undefined;
      var easing = arguments.length > 5 ? arguments[5] : undefined;
      var existKeyframe = transform[key].k.filter(function (x) {
        return x.t == time;
      });
      var readyToSet;

      if (existKeyframe.length) {
        readyToSet = existKeyframe[0];
      } else {
        readyToSet = {
          t: time,
          s: this.getDefaultProperty(key)
        };
        var previousKeyframeCount = transform[key].k.reduce(function (p, x) {
          return x.t < time ? p + 1 : p;
        }, 0);
        transform[key].k.splice(previousKeyframeCount, 0, readyToSet);
      }

      if (easing) {
        readyToSet.o = {
          x: easing[0][0],
          y: easing[0][1]
        };
        readyToSet.i = {
          x: easing[1][0],
          y: easing[1][1]
        };
      }

      if (idx >= 0) {
        readyToSet.s[idx] = value;
      } else {
        readyToSet.s = [value];
      }
    }
  }]);

  function JSMovinLayer(ref) {
    _classCallCheck(this, JSMovinLayer);

    _defineProperty(this, "root", void 0);

    this.root = ref;
  }

  _createClass(JSMovinLayer, [{
    key: "setStaticProperty",
    value: function setStaticProperty(key, value) {
      this.root.op = 1;

      switch (key) {
        case 'scaleX':
          this.convertToStaticProperty(this.root.ks, 's');
          this.root.ks.s.k[0] = value;
          break;

        case 'scaleY':
          this.convertToStaticProperty(this.root.ks, 's');
          this.root.ks.s.k[1] = value;
          break;

        case 'anchorX':
          this.convertToStaticProperty(this.root.ks, 'a');
          this.root.ks.a.k[0] = value;
          break;

        case 'anchorY':
          this.convertToStaticProperty(this.root.ks, 'a');
          this.root.ks.a.k[1] = value;
          break;

        case 'x':
          this.convertToStaticProperty(this.root.ks, 'p');
          this.root.ks.p.k[0] = value;
          break;

        case 'y':
          this.convertToStaticProperty(this.root.ks, 'p');
          this.root.ks.p.k[1] = value;
          break;
        // case 'skew':
        //     this.convertToStaticProperty(this.root.ks!, 's')
        //     break
        // case 'skewAxis':
        //     this.convertToStaticProperty(this.root.ks!, 's')
        //     break

        case 'rotate':
          this.convertToStaticProperty(this.root.ks, 'r');
          this.root.ks.r.k = value;
          break;

        case 'opacity':
          this.convertToStaticProperty(this.root.ks, 'o');
          this.root.ks.o.k = value;
          break;

        default:
          console.error(key, value);
          throw new Error('Not a valid key.');
      }
    }
  }, {
    key: "setAnimatableProperty",
    value: function setAnimatableProperty(key, startFrame, endFrame, startValue, endValue, easing) {
      if (endFrame <= startFrame) {
        throw new Error('End frame should be larger than start frame.');
      }

      this.root.op = endFrame;

      if (!easing) {
        easing = _easing.EasingFactory.linear();
      }

      switch (key) {
        case 'scaleX':
          this.convertToAnimatableProperty(this.root.ks, 's');
          this.addKeyframe(this.root.ks, 's', 0, startFrame, startValue, easing);
          this.addKeyframe(this.root.ks, 's', 0, endFrame, endValue);
          break;

        case 'scaleY':
          this.convertToAnimatableProperty(this.root.ks, 's');
          this.addKeyframe(this.root.ks, 's', 1, startFrame, startValue, easing);
          this.addKeyframe(this.root.ks, 's', 1, endFrame, endValue);
          break;

        case 'anchorX':
          this.convertToAnimatableProperty(this.root.ks, 'a');
          this.addKeyframe(this.root.ks, 'a', 0, startFrame, startValue, easing);
          this.addKeyframe(this.root.ks, 'a', 0, endFrame, endValue);
          break;

        case 'anchorY':
          this.convertToAnimatableProperty(this.root.ks, 'a');
          this.addKeyframe(this.root.ks, 'a', 1, startFrame, startValue, easing);
          this.addKeyframe(this.root.ks, 'a', 1, endFrame, endValue);
          break;

        case 'x':
          this.convertToAnimatableProperty(this.root.ks, 'p');
          this.addKeyframe(this.root.ks, 'p', 0, startFrame, startValue, easing);
          this.addKeyframe(this.root.ks, 'p', 0, endFrame, endValue);
          break;

        case 'y':
          this.convertToAnimatableProperty(this.root.ks, 'p');
          this.addKeyframe(this.root.ks, 'p', 1, startFrame, startValue, easing);
          this.addKeyframe(this.root.ks, 'p', 1, endFrame, endValue);
          break;
        // case 'skew':
        //     this.convertToAnimatableProperty(this.root.ks!, 's')
        //     break
        // case 'skewAxis':
        //     this.convertToAnimatableProperty(this.root.ks!, 's')
        //     break

        case 'rotate':
          this.convertToAnimatableProperty(this.root.ks, 'r');
          this.addKeyframe(this.root.ks, 'r', -1, startFrame, startValue, easing);
          this.addKeyframe(this.root.ks, 'r', -1, endFrame, endValue);
          break;

        case 'opacity':
          this.convertToAnimatableProperty(this.root.ks, 'o');
          this.addKeyframe(this.root.ks, 'o', -1, startFrame, startValue, easing);
          this.addKeyframe(this.root.ks, 'o', -1, endFrame, endValue);
          break;

        default:
          console.error(key, startFrame, endFrame, startValue, endValue, easing);
          throw new Error('Not a valid key.');
      }
    }
  }]);

  return JSMovinLayer;
}();

exports.JSMovinLayer = JSMovinLayer;

var LayerFactory =
/*#__PURE__*/
function () {
  function LayerFactory() {
    _classCallCheck(this, LayerFactory);
  }

  _createClass(LayerFactory, null, [{
    key: "generateTransform",
    value: function generateTransform(coordinate) {
      return {
        o: {
          a: 0,
          k: 100
        },
        r: {
          a: 0,
          k: 0
        },
        p: {
          a: 0,
          k: [coordinate[0], coordinate[1], 0]
        },
        a: {
          a: 0,
          k: [0, 0, 0]
        },
        s: {
          a: 0,
          k: [100, 100, 100]
        }
      };
    }
  }, {
    key: "getBoundingBox",
    value: function getBoundingBox(dom) {
      var svgRoot = dom;

      while (true) {
        if (svgRoot.parentElement instanceof SVGGraphicsElement) {
          svgRoot = svgRoot.parentElement;
        } else {
          break;
        }
      }

      var rootBBox = svgRoot.getBoundingClientRect();
      var refBBox = dom.getBoundingClientRect();
      var coordinate = [refBBox.left - rootBBox.left, refBBox.top - rootBBox.top, refBBox.width + 1, refBBox.height + 1];
      return coordinate;
    }
  }, {
    key: "boundingBox",
    value: function boundingBox(dom) {
      var coordinate = this.getBoundingBox(dom);
      return this.rect.apply(this, _toConsumableArray(coordinate));
    }
  }, {
    key: "shape",
    value: function shape(dom) {
      var coordinate = this.getBoundingBox(dom);
      var layer = {
        ty: 4,
        ddd: 0,
        sr: 1,
        ao: 0,
        ks: this.generateTransform(coordinate),
        ip: 0,
        op: 1,
        st: 0,
        bm: 0,
        shapes: [(0, _render.render)(dom)]
      };
      return new JSMovinLayer(layer);
    }
  }, {
    key: "rect",
    value: function rect(left, top, width, height) {}
  }, {
    key: "ellipse",
    value: function ellipse(cx, cy, rx, ry, rotate) {}
  }, {
    key: "hierarchy",
    value: function hierarchy(dom, assetList, fontList) {
      var coordinate = this.getBoundingBox(dom);
      var domType;

      if (dom instanceof SVGTextElement) {
        domType = 5;
      } else if (dom instanceof SVGImageElement) {
        domType = 2;
      } else {
        domType = 4;
      }

      var layer = {
        ty: domType,
        ddd: 0,
        sr: 1,
        ao: 0,
        ks: this.generateTransform(coordinate),
        ip: 0,
        op: 1,
        st: 0,
        bm: 0
      };

      switch (domType) {
        case 2:
          if (assetList) {
            var imageLayer = layer;

            var _renderImage = (0, _render.renderImage)(dom),
                _renderImage2 = _slicedToArray(_renderImage, 2),
                refId = _renderImage2[0],
                asset = _renderImage2[1];

            imageLayer.refId = refId;
            assetList.push(asset);
          }

          break;

        case 4:
          var shapeLayer = layer;
          shapeLayer.shapes = [];
          shapeLayer.shapes.push((0, _render.render)(dom));
          break;

        case 5:
          var textLayer = layer;

          var _renderText = (0, _render.renderText)(dom),
              _renderText2 = _slicedToArray(_renderText, 2),
              textData = _renderText2[0],
              font = _renderText2[1];

          textLayer.t = textData;
          fontList.list.push(font);
          break;
      }

      var movinLayer = new JSMovinLayer(layer);
      return movinLayer;
    }
  }]);

  return LayerFactory;
}();

exports.LayerFactory = LayerFactory;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sYXllci50cyJdLCJuYW1lcyI6WyJKU01vdmluTGF5ZXIiLCJrZXkiLCJ0cmFuc2Zvcm0iLCJhIiwiayIsImdldERlZmF1bHRQcm9wZXJ0eSIsInN0YXRpY1ZhbHVlIiwicyIsImlkeCIsInRpbWUiLCJ2YWx1ZSIsImVhc2luZyIsImV4aXN0S2V5ZnJhbWUiLCJmaWx0ZXIiLCJ4IiwidCIsInJlYWR5VG9TZXQiLCJsZW5ndGgiLCJwcmV2aW91c0tleWZyYW1lQ291bnQiLCJyZWR1Y2UiLCJwIiwic3BsaWNlIiwibyIsInkiLCJpIiwicmVmIiwicm9vdCIsIm9wIiwiY29udmVydFRvU3RhdGljUHJvcGVydHkiLCJrcyIsInIiLCJjb25zb2xlIiwiZXJyb3IiLCJFcnJvciIsInN0YXJ0RnJhbWUiLCJlbmRGcmFtZSIsInN0YXJ0VmFsdWUiLCJlbmRWYWx1ZSIsIkVhc2luZ0ZhY3RvcnkiLCJsaW5lYXIiLCJjb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkiLCJhZGRLZXlmcmFtZSIsIkxheWVyRmFjdG9yeSIsImNvb3JkaW5hdGUiLCJkb20iLCJzdmdSb290IiwicGFyZW50RWxlbWVudCIsIlNWR0dyYXBoaWNzRWxlbWVudCIsInJvb3RCQm94IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwicmVmQkJveCIsImxlZnQiLCJ0b3AiLCJ3aWR0aCIsImhlaWdodCIsImdldEJvdW5kaW5nQm94IiwicmVjdCIsImxheWVyIiwidHkiLCJkZGQiLCJzciIsImFvIiwiZ2VuZXJhdGVUcmFuc2Zvcm0iLCJpcCIsInN0IiwiYm0iLCJzaGFwZXMiLCJjeCIsImN5IiwicngiLCJyeSIsInJvdGF0ZSIsImFzc2V0TGlzdCIsImZvbnRMaXN0IiwiZG9tVHlwZSIsIlNWR1RleHRFbGVtZW50IiwiU1ZHSW1hZ2VFbGVtZW50IiwiaW1hZ2VMYXllciIsInJlZklkIiwiYXNzZXQiLCJwdXNoIiwic2hhcGVMYXllciIsInRleHRMYXllciIsInRleHREYXRhIiwiZm9udCIs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QyxPQUFuRDs7QUFXQSxjQUFRUyxPQUFSO0FBQ0ksYUFBSyxDQUFMO0FBQ0ksY0FBSUYsU0FBSixFQUFlO0FBQ1gsZ0JBQU1LLFVBQVUsR0FBR3BCLEtBQW5COztBQURXLCtCQUVZLHlCQUFZYixHQUFaLENBRlo7QUFBQTtBQUFBLGdCQUVKa0MsS0FGSTtBQUFBLGdCQUVHQyxLQUZIOztBQUdYRixZQUFBQSxVQUFVLENBQUNDLEtBQVgsR0FBbUJBLEtBQW5CO0FBQ0FOLFlBQUFBLFNBQVMsQ0FBQ1EsSUFBVixDQUFlRCxLQUFmO0FBQ0g7O0FBQ0Q7O0FBQ0osYUFBSyxDQUFMO0FBQ0ksY0FBTUUsVUFBVSxHQUFHeEIsS0FBbkI7QUFDQXdCLFVBQUFBLFVBQVUsQ0FBQ2YsTUFBWCxHQUFvQixFQUFwQjtBQUNBZSxVQUFBQSxVQUFVLENBQUNmLE1BQVgsQ0FBa0JjLElBQWxCLENBQXVCLG9CQUFPcEMsR0FBUCxDQUF2QjtBQUNBOztBQUNKLGFBQUssQ0FBTDtBQUNJLGNBQU1zQyxTQUFTLEdBQUd6QixLQUFsQjs7QUFESiw0QkFFNkIsd0JBQVdiLEdBQVgsQ0FGN0I7QUFBQTtBQUFBLGNBRVd1QyxRQUZYO0FBQUEsY0FFcUJDLElBRnJCOztBQUdJRixVQUFBQSxTQUFTLENBQUNuRSxDQUFWLEdBQWNvRSxRQUFkO0FBQ0FWLFVBQUFBLFFBQVEsQ0FBQ1ksSUFBVCxDQUFlTCxJQUFmLENBQW9CSSxJQUFwQjtBQUNBO0FBbkJSOztBQXNCQSxVQUFNRSxVQUFVLEdBQUcsSUFBSXRGLFlBQUosQ0FBaUJ5RCxLQUFqQixDQUFuQjtBQUNBLGFBQU82QixVQUFQO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTaGFwZUxheWVyLCBUZXh0TGF5ZXIsIEltYWdlTGF5ZXIsIFRyYW5zZm9ybSwgQXNzZXRzLCBGb250cyB9IGZyb20gJy4vYW5pbWF0aW9uJ1xyXG5pbXBvcnQgeyBFYXNpbmdGdW5jdGlvbiwgRWFzaW5nRmFjdG9yeSB9IGZyb20gJy4vZWFzaW5nJ1xyXG5pbXBvcnQgeyByZW5kZXJUZXh0LCByZW5kZXIsIHJlbmRlckltYWdlIH0gZnJvbSAnLi9yZW5kZXInO1xyXG5cclxudHlwZSBTZXRhYmxlS2V5cyA9IFwic2NhbGVYXCIgfCBcInNjYWxlWVwiIHwgXCJhbmNob3JYXCIgfCBcImFuY2hvcllcIiB8IFwieFwiIHwgXCJ5XCIgfCBcInJvdGF0ZVwiIHwgXCJvcGFjaXR5XCIgfCAnc2hhcGUnXHJcblxyXG5leHBvcnQgY2xhc3MgSlNNb3ZpbkxheWVyIHtcclxuICAgIHB1YmxpYyByZWFkb25seSByb290OiBTaGFwZUxheWVyIHwgVGV4dExheWVyIHwgSW1hZ2VMYXllcjtcclxuICAgIHByaXZhdGUgZ2V0RGVmYXVsdFByb3BlcnR5KGtleTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3dpdGNoIChrZXkpIHtcclxuICAgICAgICAgICAgY2FzZSAnYSc6XHJcbiAgICAgICAgICAgIGNhc2UgJ3AnOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFswLCAwLCAwXVxyXG4gICAgICAgICAgICBjYXNlICdzJzpcclxuICAgICAgICAgICAgICAgIHJldHVybiBbMTAwLCAxMDAsIDEwMF1cclxuICAgICAgICAgICAgY2FzZSAnbyc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMTAwXHJcbiAgICAgICAgICAgIGNhc2UgJ3InOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDBcclxuXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgY29udmVydFRvU3RhdGljUHJvcGVydHkodHJhbnNmb3JtOiBUcmFuc2Zvcm0sIGtleTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKCF0cmFuc2Zvcm1ba2V5XSkge1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm1ba2V5XSA9IHtcclxuICAgICAgICAgICAgICAgIGE6IDAsXHJcbiAgICAgICAgICAgICAgICBrOiB0aGlzLmdldERlZmF1bHRQcm9wZXJ0eShrZXkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRyYW5zZm9ybVtrZXldLmEgPT0gMSkge1xyXG4gICAgICAgICAgICBjb25zdCBzdGF0aWNWYWx1ZSA9IHRyYW5zZm9ybVtrZXldLmtbMF0uc1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm1ba2V5XSA9IHtcclxuICAgICAgICAgICAgICAgIGE6IDAsXHJcbiAgICAgICAgICAgICAgICBrOiBzdGF0aWNWYWx1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkodHJhbnNmb3JtOiBUcmFuc2Zvcm0sIGtleTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKCF0cmFuc2Zvcm1ba2V5XSB8fCB0cmFuc2Zvcm1ba2V5XS5hID09IDApIHtcclxuICAgICAgICAgICAgdHJhbnNmb3JtW2tleV0gPSB7XHJcbiAgICAgICAgICAgICAgICBhOiAxLFxyXG4gICAgICAgICAgICAgICAgazogW11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgYWRkS2V5ZnJhbWUodHJhbnNmb3JtOiBUcmFuc2Zvcm0sIGtleTogc3RyaW5nLCBpZHg6IG51bWJlciA9IC0xLCB0aW1lOiBudW1iZXIsIHZhbHVlOiBBcnJheTxhbnk+LCBlYXNpbmc/OiBFYXNpbmdGdW5jdGlvbikge1xyXG4gICAgICAgIGNvbnN0IGV4aXN0S2V5ZnJhbWUgPSB0cmFuc2Zvcm1ba2V5XS5rLmZpbHRlcigoeDogYW55KSA9PiB4LnQgPT0gdGltZSkgYXMgYW55W11cclxuICAgICAgICBsZXQgcmVhZHlUb1NldDtcclxuICAgICAgICBpZiAoZXhpc3RLZXlmcmFtZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmVhZHlUb1NldCA9IGV4aXN0S2V5ZnJhbWVbMF1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZWFkeVRvU2V0ID0ge1xyXG4gICAgICAgICAgICAgICAgdDogdGltZSxcclxuICAgICAgICAgICAgICAgIHM6IHRoaXMuZ2V0RGVmYXVsdFByb3BlcnR5KGtleSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBwcmV2aW91c0tleWZyYW1lQ291bnQgPSB0cmFuc2Zvcm1ba2V5XS5rLnJlZHVjZSgocDogbnVtYmVyLCB4OiBhbnkpID0+IHgudCA8IHRpbWUgPyBwICsgMSA6IHAsIDApXHJcbiAgICAgICAgICAgIHRyYW5zZm9ybVtrZXldLmsuc3BsaWNlKHByZXZpb3VzS2V5ZnJhbWVDb3VudCwgMCwgcmVhZHlUb1NldClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGVhc2luZykge1xyXG4gICAgICAgICAgICByZWFkeVRvU2V0Lm8gPSB7XHJcbiAgICAgICAgICAgICAgICB4OiBlYXNpbmdbMF1bMF0sXHJcbiAgICAgICAgICAgICAgICB5OiBlYXNpbmdbMF1bMV1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZWFkeVRvU2V0LmkgPSB7XHJcbiAgICAgICAgICAgICAgICB4OiBlYXNpbmdbMV1bMF0sXHJcbiAgICAgICAgICAgICAgICB5OiBlYXNpbmdbMV1bMV1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaWR4ID49IDApIHtcclxuICAgICAgICAgICAgcmVhZHlUb1NldC5zW2lkeF0gPSB2YWx1ZVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlYWR5VG9TZXQucyA9IFt2YWx1ZV1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IocmVmOiBTaGFwZUxheWVyIHwgVGV4dExheWVyIHwgSW1hZ2VMYXllcikge1xyXG4gICAgICAgIHRoaXMucm9vdCA9IHJlZlxyXG4gICAgfVxyXG5cclxuICAgIHNldFN0YXRpY1Byb3BlcnR5KGtleTogU2V0YWJsZUtleXMsIHZhbHVlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnJvb3Qub3AgPSAxXHJcbiAgICAgICAgc3dpdGNoIChrZXkpIHtcclxuICAgICAgICAgICAgY2FzZSAnc2NhbGVYJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udmVydFRvU3RhdGljUHJvcGVydHkodGhpcy5yb290LmtzISwgJ3MnKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5yb290LmtzIS5zIS5rIVswXSA9IHZhbHVlXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlICdzY2FsZVknOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9TdGF0aWNQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAncycpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3Qua3MhLnMhLmshWzFdID0gdmFsdWVcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ2FuY2hvclgnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9TdGF0aWNQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAnYScpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3Qua3MhLmEhLmshWzBdID0gdmFsdWVcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ2FuY2hvclknOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9TdGF0aWNQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAnYScpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3Qua3MhLmEhLmshWzFdID0gdmFsdWVcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ3gnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9TdGF0aWNQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAncCcpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3Qua3MhLnAhLmshWzBdID0gdmFsdWVcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ3knOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9TdGF0aWNQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAncCcpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3Qua3MhLnAhLmshWzFdID0gdmFsdWVcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIC8vIGNhc2UgJ3NrZXcnOlxyXG4gICAgICAgICAgICAvLyAgICAgdGhpcy5jb252ZXJ0VG9TdGF0aWNQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAncycpXHJcbiAgICAgICAgICAgIC8vICAgICBicmVha1xyXG4gICAgICAgICAgICAvLyBjYXNlICdza2V3QXhpcyc6XHJcbiAgICAgICAgICAgIC8vICAgICB0aGlzLmNvbnZlcnRUb1N0YXRpY1Byb3BlcnR5KHRoaXMucm9vdC5rcyEsICdzJylcclxuICAgICAgICAgICAgLy8gICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ3JvdGF0ZSc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnZlcnRUb1N0YXRpY1Byb3BlcnR5KHRoaXMucm9vdC5rcyEsICdyJylcclxuICAgICAgICAgICAgICAgIHRoaXMucm9vdC5rcyEuciEuayA9IHZhbHVlXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlICdvcGFjaXR5JzpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udmVydFRvU3RhdGljUHJvcGVydHkodGhpcy5yb290LmtzISwgJ28nKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5yb290LmtzIS5vIS5rID0gdmFsdWVcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGtleSwgdmFsdWUpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBhIHZhbGlkIGtleS4nKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXRBbmltYXRhYmxlUHJvcGVydHkoa2V5OiBTZXRhYmxlS2V5cywgc3RhcnRGcmFtZTogbnVtYmVyLCBlbmRGcmFtZTogbnVtYmVyLCBzdGFydFZhbHVlOiBhbnksIGVuZFZhbHVlOiBhbnksIGVhc2luZz86IEVhc2luZ0Z1bmN0aW9uKSB7XHJcbiAgICAgICAgaWYgKGVuZEZyYW1lIDw9IHN0YXJ0RnJhbWUpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFbmQgZnJhbWUgc2hvdWxkIGJlIGxhcmdlciB0aGFuIHN0YXJ0IGZyYW1lLicpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucm9vdC5vcCA9IGVuZEZyYW1lXHJcbiAgICAgICAgaWYgKCFlYXNpbmcpIHtcclxuICAgICAgICAgICAgZWFzaW5nID0gRWFzaW5nRmFjdG9yeS5saW5lYXIoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBzd2l0Y2ggKGtleSkge1xyXG4gICAgICAgICAgICBjYXNlICdzY2FsZVgnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkodGhpcy5yb290LmtzISwgJ3MnKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRLZXlmcmFtZSh0aGlzLnJvb3Qua3MhLCAncycsIDAsIHN0YXJ0RnJhbWUsIHN0YXJ0VmFsdWUsIGVhc2luZylcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkS2V5ZnJhbWUodGhpcy5yb290LmtzISwgJ3MnLCAwLCBlbmRGcmFtZSwgZW5kVmFsdWUpXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlICdzY2FsZVknOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkodGhpcy5yb290LmtzISwgJ3MnKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRLZXlmcmFtZSh0aGlzLnJvb3Qua3MhLCAncycsIDEsIHN0YXJ0RnJhbWUsIHN0YXJ0VmFsdWUsIGVhc2luZylcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkS2V5ZnJhbWUodGhpcy5yb290LmtzISwgJ3MnLCAxLCBlbmRGcmFtZSwgZW5kVmFsdWUpXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlICdhbmNob3JYJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udmVydFRvQW5pbWF0YWJsZVByb3BlcnR5KHRoaXMucm9vdC5rcyEsICdhJylcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkS2V5ZnJhbWUodGhpcy5yb290LmtzISwgJ2EnLCAwLCBzdGFydEZyYW1lLCBzdGFydFZhbHVlLCBlYXNpbmcpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKHRoaXMucm9vdC5rcyEsICdhJywgMCwgZW5kRnJhbWUsIGVuZFZhbHVlKVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAnYW5jaG9yWSc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnZlcnRUb0FuaW1hdGFibGVQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAnYScpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKHRoaXMucm9vdC5rcyEsICdhJywgMSwgc3RhcnRGcmFtZSwgc3RhcnRWYWx1ZSwgZWFzaW5nKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRLZXlmcmFtZSh0aGlzLnJvb3Qua3MhLCAnYScsIDEsIGVuZEZyYW1lLCBlbmRWYWx1ZSlcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ3gnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkodGhpcy5yb290LmtzISwgJ3AnKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRLZXlmcmFtZSh0aGlzLnJvb3Qua3MhLCAncCcsIDAsIHN0YXJ0RnJhbWUsIHN0YXJ0VmFsdWUsIGVhc2luZylcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkS2V5ZnJhbWUodGhpcy5yb290LmtzISwgJ3AnLCAwLCBlbmRGcmFtZSwgZW5kVmFsdWUpXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlICd5JzpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udmVydFRvQW5pbWF0YWJsZVByb3BlcnR5KHRoaXMucm9vdC5rcyEsICdwJylcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkS2V5ZnJhbWUodGhpcy5yb290LmtzISwgJ3AnLCAxLCBzdGFydEZyYW1lLCBzdGFydFZhbHVlLCBlYXNpbmcpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKHRoaXMucm9vdC5rcyEsICdwJywgMSwgZW5kRnJhbWUsIGVuZFZhbHVlKVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgLy8gY2FzZSAnc2tldyc6XHJcbiAgICAgICAgICAgIC8vICAgICB0aGlzLmNvbnZlcnRUb0FuaW1hdGFibGVQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAncycpXHJcbiAgICAgICAgICAgIC8vICAgICBicmVha1xyXG4gICAgICAgICAgICAvLyBjYXNlICdza2V3QXhpcyc6XHJcbiAgICAgICAgICAgIC8vICAgICB0aGlzLmNvbnZlcnRUb0FuaW1hdGFibGVQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAncycpXHJcbiAgICAgICAgICAgIC8vICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlICdyb3RhdGUnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkodGhpcy5yb290LmtzISwgJ3InKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRLZXlmcmFtZSh0aGlzLnJvb3Qua3MhLCAncicsIC0xLCBzdGFydEZyYW1lLCBzdGFydFZhbHVlLCBlYXNpbmcpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKHRoaXMucm9vdC5rcyEsICdyJywgLTEsIGVuZEZyYW1lLCBlbmRWYWx1ZSlcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ29wYWNpdHknOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkodGhpcy5yb290LmtzISwgJ28nKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRLZXlmcmFtZSh0aGlzLnJvb3Qua3MhLCAnbycsIC0xLCBzdGFydEZyYW1lLCBzdGFydFZhbHVlLCBlYXNpbmcpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKHRoaXMucm9vdC5rcyEsICdvJywgLTEsIGVuZEZyYW1lLCBlbmRWYWx1ZSlcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGtleSwgc3RhcnRGcmFtZSwgZW5kRnJhbWUsIHN0YXJ0VmFsdWUsIGVuZFZhbHVlLCBlYXNpbmcpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBhIHZhbGlkIGtleS4nKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIExheWVyRmFjdG9yeSB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZW5lcmF0ZVRyYW5zZm9ybShjb29yZGluYXRlOiBudW1iZXJbXSk6IFRyYW5zZm9ybSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbzoge1xyXG4gICAgICAgICAgICAgICAgYTogMCxcclxuICAgICAgICAgICAgICAgIGs6IDEwMFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByOiB7XHJcbiAgICAgICAgICAgICAgICBhOiAwLFxyXG4gICAgICAgICAgICAgICAgazogMFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwOiB7XHJcbiAgICAgICAgICAgICAgICBhOiAwLFxyXG4gICAgICAgICAgICAgICAgazogW1xyXG4gICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgY29vcmRpbmF0ZVsxXSxcclxuICAgICAgICAgICAgICAgICAgICAwXHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGE6IHtcclxuICAgICAgICAgICAgICAgIGE6IDAsXHJcbiAgICAgICAgICAgICAgICBrOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAgICAgICAgIDBcclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgczoge1xyXG4gICAgICAgICAgICAgICAgYTogMCxcclxuICAgICAgICAgICAgICAgIGs6IFtcclxuICAgICAgICAgICAgICAgICAgICAxMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgMTAwLFxyXG4gICAgICAgICAgICAgICAgICAgIDEwMFxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGdldEJvdW5kaW5nQm94KGRvbTogU1ZHR3JhcGhpY3NFbGVtZW50KSB7XHJcbiAgICAgICAgbGV0IHN2Z1Jvb3Q6IFNWR0VsZW1lbnQgPSBkb21cclxuICAgICAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgICAgICBpZiAoc3ZnUm9vdC5wYXJlbnRFbGVtZW50IGluc3RhbmNlb2YgU1ZHR3JhcGhpY3NFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICBzdmdSb290ID0gc3ZnUm9vdC5wYXJlbnRFbGVtZW50XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHJvb3RCQm94ID0gc3ZnUm9vdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG4gICAgICAgIGNvbnN0IHJlZkJCb3ggPSBkb20uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcclxuICAgICAgICBjb25zdCBjb29yZGluYXRlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFtyZWZCQm94LmxlZnQgLSByb290QkJveC5sZWZ0LCByZWZCQm94LnRvcCAtIHJvb3RCQm94LnRvcCwgcmVmQkJveC53aWR0aCArIDEsIHJlZkJCb3guaGVpZ2h0ICsgMV1cclxuICAgICAgICByZXR1cm4gY29vcmRpbmF0ZVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBib3VuZGluZ0JveChkb206IFNWR0dyYXBoaWNzRWxlbWVudCkge1xyXG4gICAgICAgIGNvbnN0IGNvb3JkaW5hdGUgPSB0aGlzLmdldEJvdW5kaW5nQm94KGRvbSlcclxuICAgICAgICByZXR1cm4gdGhpcy5yZWN0KC4uLmNvb3JkaW5hdGUpXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNoYXBlKGRvbTogU1ZHUGF0aEVsZW1lbnQpIHtcclxuICAgICAgICBjb25zdCBjb29yZGluYXRlID0gdGhpcy5nZXRCb3VuZGluZ0JveChkb20pXHJcbiAgICAgICAgY29uc3QgbGF5ZXI6IFNoYXBlTGF5ZXIgPSB7XHJcbiAgICAgICAgICAgIHR5OiA0LFxyXG4gICAgICAgICAgICBkZGQ6IDAsXHJcbiAgICAgICAgICAgIHNyOiAxLFxyXG4gICAgICAgICAgICBhbzogMCxcclxuICAgICAgICAgICAga3M6IHRoaXMuZ2VuZXJhdGVUcmFuc2Zvcm0oY29vcmRpbmF0ZSksXHJcbiAgICAgICAgICAgIGlwOiAwLFxyXG4gICAgICAgICAgICBvcDogMSxcclxuICAgICAgICAgICAgc3Q6IDAsXHJcbiAgICAgICAgICAgIGJtOiAwLFxyXG4gICAgICAgICAgICBzaGFwZXM6IFtcclxuICAgICAgICAgICAgICAgIHJlbmRlcihkb20pXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBKU01vdmluTGF5ZXIobGF5ZXIpXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHJlY3QobGVmdDogbnVtYmVyLCB0b3A6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGVsbGlwc2UoY3g6IG51bWJlciwgY3k6IG51bWJlciwgcng6IG51bWJlciwgcnk6IG51bWJlciwgcm90YXRlOiBudW1iZXIpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGhpZXJhcmNoeShkb206IFNWR0dyYXBoaWNzRWxlbWVudCwgYXNzZXRMaXN0OiBBc3NldHMsIGZvbnRMaXN0OiBGb250cykge1xyXG4gICAgICAgIGNvbnN0IGNvb3JkaW5hdGUgPSB0aGlzLmdldEJvdW5kaW5nQm94KGRvbSlcclxuICAgICAgICBsZXQgZG9tVHlwZTogMiB8IDQgfCA1O1xyXG4gICAgICAgIGlmIChkb20gaW5zdGFuY2VvZiBTVkdUZXh0RWxlbWVudCkge1xyXG4gICAgICAgICAgICBkb21UeXBlID0gNVxyXG4gICAgICAgIH0gZWxzZSBpZiAoZG9tIGluc3RhbmNlb2YgU1ZHSW1hZ2VFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGRvbVR5cGUgPSAyXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZG9tVHlwZSA9IDRcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgbGF5ZXI6IFNoYXBlTGF5ZXIgfCBJbWFnZUxheWVyIHwgVGV4dExheWVyID0ge1xyXG4gICAgICAgICAgICB0eTogZG9tVHlwZSxcclxuICAgICAgICAgICAgZGRkOiAwLFxyXG4gICAgICAgICAgICBzcjogMSxcclxuICAgICAgICAgICAgYW86IDAsXHJcbiAgICAgICAgICAgIGtzOiB0aGlzLmdlbmVyYXRlVHJhbnNmb3JtKGNvb3JkaW5hdGUpLFxyXG4gICAgICAgICAgICBpcDogMCxcclxuICAgICAgICAgICAgb3A6IDEsXHJcbiAgICAgICAgICAgIHN0OiAwLFxyXG4gICAgICAgICAgICBibTogMFxyXG4gICAgICAgIH1cclxuICAgICAgICBzd2l0Y2ggKGRvbVR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgaWYgKGFzc2V0TGlzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGltYWdlTGF5ZXIgPSBsYXllciBhcyBJbWFnZUxheWVyXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW3JlZklkLCBhc3NldF0gPSByZW5kZXJJbWFnZShkb20gYXMgU1ZHSW1hZ2VFbGVtZW50KVxyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlTGF5ZXIucmVmSWQgPSByZWZJZFxyXG4gICAgICAgICAgICAgICAgICAgIGFzc2V0TGlzdC5wdXNoKGFzc2V0KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hhcGVMYXllciA9IGxheWVyIGFzIFNoYXBlTGF5ZXJcclxuICAgICAgICAgICAgICAgIHNoYXBlTGF5ZXIuc2hhcGVzID0gW11cclxuICAgICAgICAgICAgICAgIHNoYXBlTGF5ZXIuc2hhcGVzLnB1c2gocmVuZGVyKGRvbSkpXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlIDU6XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0TGF5ZXIgPSBsYXllciBhcyBUZXh0TGF5ZXJcclxuICAgICAgICAgICAgICAgIGNvbnN0IFt0ZXh0RGF0YSwgZm9udF0gPSByZW5kZXJUZXh0KGRvbSBhcyBTVkdUZXh0RWxlbWVudClcclxuICAgICAgICAgICAgICAgIHRleHRMYXllci50ID0gdGV4dERhdGFcclxuICAgICAgICAgICAgICAgIGZvbnRMaXN0Lmxpc3QhLnB1c2goZm9udClcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBtb3ZpbkxheWVyID0gbmV3IEpTTW92aW5MYXllcihsYXllcilcclxuICAgICAgICByZXR1cm4gbW92aW5MYXllclxyXG4gICAgfVxyXG59Il19