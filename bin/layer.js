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
    key: "calculateBaseTransform",
    value: function calculateBaseTransform(dom, root) {
      return root.getScreenCTM().inverse().multiply(dom.getScreenCTM());
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

      var baseBox = this.calculateBaseTransform(dom, svgRoot);
      var refBBox = dom.getBBox();
      var coordinate = [baseBox.e + refBBox.x, baseBox.f + refBBox.y, refBBox.width + 2, refBBox.height + 2];
      return coordinate;
    }
  }, {
    key: "boundingBox",
    value: function boundingBox(dom) {
      return this.rect.apply(this, _toConsumableArray(this.getBoundingBox(dom)));
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
    value: function rect(left, top, width, height) {
      var layer = {
        ty: 4,
        ddd: 0,
        sr: 1,
        ao: 0,
        ks: this.generateTransform([left, top, width, height]),
        ip: 0,
        op: 1,
        st: 0,
        bm: 0,
        shapes: [(0, _render.renderPlainGlyph)('rect', [width, height])]
      };
      return new JSMovinLayer(layer);
    }
  }, {
    key: "ellipse",
    value: function ellipse(cx, cy, rx, ry) {
      var layer = {
        ty: 4,
        ddd: 0,
        sr: 1,
        ao: 0,
        ks: this.generateTransform([cx - rx, cy - ry, 2 * rx, 2 * ry]),
        ip: 0,
        op: 1,
        st: 0,
        bm: 0,
        shapes: [(0, _render.renderPlainGlyph)('ellipse', [rx, ry])]
      };
      return new JSMovinLayer(layer);
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sYXllci50cyJdLCJuYW1lcyI6WyJKU01vdmluTGF5ZXIiLCJrZXkiLCJ0cmFuc2Zvcm0iLCJhIiwiayIsImdldERlZmF1bHRQcm9wZXJ0eSIsInN0YXRpY1ZhbHVlIiwicyIsImlkeCIsInRpbWUiLCJ2YWx1ZSIsImVhc2luZyIsImV4aXN0S2V5ZnJhbWUiLCJmaWx0ZXIiLCJ4IiwidCIsInJlYWR5VG9TZXQiLCJsZW5ndGgiLCJwcmV2aW91c0tleWZyYW1lQ291bnQiLCJyZWR1Y2UiLCJwIiwic3BsaWNlIiwibyIsInkiLCJpIiwicmVmIiwicm9vdCIsIm9wIiwiY29udmVydFRvU3RhdGljUHJvcGVydHkiLCJrcyIsInIiLCJjb25zb2xlIiwiZXJyb3IiLCJFcnJvciIsInN0YXJ0RnJhbWUiLCJlbmRGcmFtZSIsInN0YXJ0VmFsdWUiLCJlbmRWYWx1ZSIsIkVhc2luZ0ZhY3RvcnkiLCJsaW5lYXIiLCJjb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkiLCJhZGRLZXlmcmFtZSIsIkxheWVyRmFjdG9yeSIsImNvb3JkaW5hdGUiLCJkb20iLCJnZXRTY3JlZW5DVE0iLCJpbnZlcnNlIiwibXVsdGlwbHkiLCJzdmdSb290IiwicGFyZW50RWxlbWVudCIsIlNWR0dyYXBoaWNzRWxlbWVudCIsImJhc2VCb3giLCJjYWxjdWxhdGVCYXNlVHJhbnNmb3JtIiwicmVmQkJveCIsImdldEJCb3giLCJlIiwiZiIsIndpZHRoIiwiaGVpZ2h0IiwicmVjdCIsImdldEJvdW5kaW5nQm94IiwibGF5ZXIiLCJ0eSIsImRkZCIsInNyIiwiYW8iLCJnZW5lcmF0ZVRyYW5zZm9ybSIsImlwIiwic3QiLCJibSIsInNoYXBlcyIsImxlZnQiLCJ0b3AiLCJjeCIsImN5IiwicngiLCJyeSIsImFzc2V0TGlzdCIsImZvbnRMaXN0IiwiZG9tVHlwZSIsIlNWR1RleHRFbGVtZW50IiwiU1ZHSW1hZ2VFbGVtZW50IiwiaW1hZ2VMYXllciIsInJlZklkIiwiYXNzZXQiLCJwdXNoIiwic2hhcGVMYXllciIsInRleHRMYXllciIsInRleHREYXRhIiwiZm9udCIsImxpc3QiLCJtb3ZpbkxheWVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBSWFBLFk7Ozs7O3VDQUVrQkMsRyxFQUFhO0FBQ3BDLGNBQVFBLEdBQVI7QUFDSSxhQUFLLEdBQUw7QUFDQSxhQUFLLEdBQUw7QUFDSSxpQkFBTyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxDQUFQOztBQUNKLGFBQUssR0FBTDtBQUNJLGlCQUFPLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxHQUFYLENBQVA7O0FBQ0osYUFBSyxHQUFMO0FBQ0ksaUJBQU8sR0FBUDs7QUFDSixhQUFLLEdBQUw7QUFDSSxpQkFBTyxDQUFQOztBQUVKO0FBQ0ksaUJBQU8sQ0FBUDtBQVpSO0FBY0g7Ozs0Q0FDK0JDLFMsRUFBc0JELEcsRUFBYTtBQUMvRCxVQUFJLENBQUNDLFNBQVMsQ0FBQ0QsR0FBRCxDQUFkLEVBQXFCO0FBQ2pCQyxRQUFBQSxTQUFTLENBQUNELEdBQUQsQ0FBVCxHQUFpQjtBQUNiRSxVQUFBQSxDQUFDLEVBQUUsQ0FEVTtBQUViQyxVQUFBQSxDQUFDLEVBQUUsS0FBS0Msa0JBQUwsQ0FBd0JKLEdBQXhCO0FBRlUsU0FBakI7QUFJSDs7QUFDRCxVQUFJQyxTQUFTLENBQUNELEdBQUQsQ0FBVCxDQUFlRSxDQUFmLElBQW9CLENBQXhCLEVBQTJCO0FBQ3ZCLFlBQU1HLFdBQVcsR0FBR0osU0FBUyxDQUFDRCxHQUFELENBQVQsQ0FBZUcsQ0FBZixDQUFpQixDQUFqQixFQUFvQkcsQ0FBeEM7QUFDQUwsUUFBQUEsU0FBUyxDQUFDRCxHQUFELENBQVQsR0FBaUI7QUFDYkUsVUFBQUEsQ0FBQyxFQUFFLENBRFU7QUFFYkMsVUFBQUEsQ0FBQyxFQUFFRTtBQUZVLFNBQWpCO0FBSUg7QUFDSjs7O2dEQUNtQ0osUyxFQUFzQkQsRyxFQUFhO0FBQ25FLFVBQUksQ0FBQ0MsU0FBUyxD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QTtBQW5CUjs7QUFzQkEsVUFBTUUsVUFBVSxHQUFHLElBQUkzRixZQUFKLENBQWlCNkQsS0FBakIsQ0FBbkI7QUFDQSxhQUFPOEIsVUFBUDtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2hhcGVMYXllciwgVGV4dExheWVyLCBJbWFnZUxheWVyLCBUcmFuc2Zvcm0sIEFzc2V0cywgRm9udHMgfSBmcm9tICcuL2FuaW1hdGlvbidcbmltcG9ydCB7IEVhc2luZ0Z1bmN0aW9uLCBFYXNpbmdGYWN0b3J5IH0gZnJvbSAnLi9lYXNpbmcnXG5pbXBvcnQgeyByZW5kZXJUZXh0LCByZW5kZXIsIHJlbmRlckltYWdlLCByZW5kZXJQbGFpbkdseXBoIH0gZnJvbSAnLi9yZW5kZXInO1xuXG50eXBlIFNldGFibGVLZXlzID0gXCJzY2FsZVhcIiB8IFwic2NhbGVZXCIgfCBcImFuY2hvclhcIiB8IFwiYW5jaG9yWVwiIHwgXCJ4XCIgfCBcInlcIiB8IFwicm90YXRlXCIgfCBcIm9wYWNpdHlcIiB8ICdzaGFwZScgfCAnZmlsbENvbG9yJyB8ICd0cmltJyB8ICdzdHJva2VDb2xvcicgfCAnc3Ryb2tlV2lkdGgnXG5cbmV4cG9ydCBjbGFzcyBKU01vdmluTGF5ZXIge1xuICAgIHB1YmxpYyByZWFkb25seSByb290OiBTaGFwZUxheWVyIHwgVGV4dExheWVyIHwgSW1hZ2VMYXllcjtcbiAgICBwcml2YXRlIGdldERlZmF1bHRQcm9wZXJ0eShrZXk6IHN0cmluZykge1xuICAgICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICAgICAgY2FzZSAnYSc6XG4gICAgICAgICAgICBjYXNlICdwJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gWzAsIDAsIDBdXG4gICAgICAgICAgICBjYXNlICdzJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gWzEwMCwgMTAwLCAxMDBdXG4gICAgICAgICAgICBjYXNlICdvJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gMTAwXG4gICAgICAgICAgICBjYXNlICdyJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gMFxuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiAwXG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBjb252ZXJ0VG9TdGF0aWNQcm9wZXJ0eSh0cmFuc2Zvcm06IFRyYW5zZm9ybSwga2V5OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0cmFuc2Zvcm1ba2V5XSkge1xuICAgICAgICAgICAgdHJhbnNmb3JtW2tleV0gPSB7XG4gICAgICAgICAgICAgICAgYTogMCxcbiAgICAgICAgICAgICAgICBrOiB0aGlzLmdldERlZmF1bHRQcm9wZXJ0eShrZXkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRyYW5zZm9ybVtrZXldLmEgPT0gMSkge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGljVmFsdWUgPSB0cmFuc2Zvcm1ba2V5XS5rWzBdLnNcbiAgICAgICAgICAgIHRyYW5zZm9ybVtrZXldID0ge1xuICAgICAgICAgICAgICAgIGE6IDAsXG4gICAgICAgICAgICAgICAgazogc3RhdGljVmFsdWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGNvbnZlcnRUb0FuaW1hdGFibGVQcm9wZXJ0eSh0cmFuc2Zvcm06IFRyYW5zZm9ybSwga2V5OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0cmFuc2Zvcm1ba2V5XSB8fCB0cmFuc2Zvcm1ba2V5XS5hID09IDApIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybVtrZXldID0ge1xuICAgICAgICAgICAgICAgIGE6IDEsXG4gICAgICAgICAgICAgICAgazogW11cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGFkZEtleWZyYW1lKHRyYW5zZm9ybTogVHJhbnNmb3JtLCBrZXk6IHN0cmluZywgaWR4OiBudW1iZXIgPSAtMSwgdGltZTogbnVtYmVyLCB2YWx1ZTogQXJyYXk8YW55PiwgZWFzaW5nPzogRWFzaW5nRnVuY3Rpb24pIHtcbiAgICAgICAgY29uc3QgZXhpc3RLZXlmcmFtZSA9IHRyYW5zZm9ybVtrZXldLmsuZmlsdGVyKCh4OiBhbnkpID0+IHgudCA9PSB0aW1lKSBhcyBhbnlbXVxuICAgICAgICBsZXQgcmVhZHlUb1NldDtcbiAgICAgICAgaWYgKGV4aXN0S2V5ZnJhbWUubGVuZ3RoKSB7XG4gICAgICAgICAgICByZWFkeVRvU2V0ID0gZXhpc3RLZXlmcmFtZVswXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVhZHlUb1NldCA9IHtcbiAgICAgICAgICAgICAgICB0OiB0aW1lLFxuICAgICAgICAgICAgICAgIHM6IHRoaXMuZ2V0RGVmYXVsdFByb3BlcnR5KGtleSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzS2V5ZnJhbWVDb3VudCA9IHRyYW5zZm9ybVtrZXldLmsucmVkdWNlKChwOiBudW1iZXIsIHg6IGFueSkgPT4geC50IDwgdGltZSA/IHAgKyAxIDogcCwgMClcbiAgICAgICAgICAgIHRyYW5zZm9ybVtrZXldLmsuc3BsaWNlKHByZXZpb3VzS2V5ZnJhbWVDb3VudCwgMCwgcmVhZHlUb1NldClcbiAgICAgICAgfVxuICAgICAgICBpZiAoZWFzaW5nKSB7XG4gICAgICAgICAgICByZWFkeVRvU2V0Lm8gPSB7XG4gICAgICAgICAgICAgICAgeDogZWFzaW5nWzBdWzBdLFxuICAgICAgICAgICAgICAgIHk6IGVhc2luZ1swXVsxXVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVhZHlUb1NldC5pID0ge1xuICAgICAgICAgICAgICAgIHg6IGVhc2luZ1sxXVswXSxcbiAgICAgICAgICAgICAgICB5OiBlYXNpbmdbMV1bMV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgICAgIHJlYWR5VG9TZXQuc1tpZHhdID0gdmFsdWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlYWR5VG9TZXQucyA9IFt2YWx1ZV1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKHJlZjogU2hhcGVMYXllciB8IFRleHRMYXllciB8IEltYWdlTGF5ZXIpIHtcbiAgICAgICAgdGhpcy5yb290ID0gcmVmXG4gICAgfVxuXG4gICAgc2V0U3RhdGljUHJvcGVydHkoa2V5OiBTZXRhYmxlS2V5cywgdmFsdWU6IGFueSkge1xuICAgICAgICB0aGlzLnJvb3Qub3AgPSAxXG4gICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgICAgICBjYXNlICdzY2FsZVgnOlxuICAgICAgICAgICAgICAgIHRoaXMuY29udmVydFRvU3RhdGljUHJvcGVydHkodGhpcy5yb290LmtzISwgJ3MnKVxuICAgICAgICAgICAgICAgIHRoaXMucm9vdC5rcyEucyEuayFbMF0gPSB2YWx1ZVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdzY2FsZVknOlxuICAgICAgICAgICAgICAgIHRoaXMuY29udmVydFRvU3RhdGljUHJvcGVydHkodGhpcy5yb290LmtzISwgJ3MnKVxuICAgICAgICAgICAgICAgIHRoaXMucm9vdC5rcyEucyEuayFbMV0gPSB2YWx1ZVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdhbmNob3JYJzpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnZlcnRUb1N0YXRpY1Byb3BlcnR5KHRoaXMucm9vdC5rcyEsICdhJylcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3Qua3MhLmEhLmshWzBdID0gdmFsdWVcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnYW5jaG9yWSc6XG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9TdGF0aWNQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAnYScpXG4gICAgICAgICAgICAgICAgdGhpcy5yb290LmtzIS5hIS5rIVsxXSA9IHZhbHVlXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3gnOlxuICAgICAgICAgICAgICAgIHRoaXMuY29udmVydFRvU3RhdGljUHJvcGVydHkodGhpcy5yb290LmtzISwgJ3AnKVxuICAgICAgICAgICAgICAgIHRoaXMucm9vdC5rcyEucCEuayFbMF0gPSB2YWx1ZVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICd5JzpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnZlcnRUb1N0YXRpY1Byb3BlcnR5KHRoaXMucm9vdC5rcyEsICdwJylcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3Qua3MhLnAhLmshWzFdID0gdmFsdWVcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgLy8gY2FzZSAnc2tldyc6XG4gICAgICAgICAgICAvLyAgICAgdGhpcy5jb252ZXJ0VG9TdGF0aWNQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAncycpXG4gICAgICAgICAgICAvLyAgICAgYnJlYWtcbiAgICAgICAgICAgIC8vIGNhc2UgJ3NrZXdBeGlzJzpcbiAgICAgICAgICAgIC8vICAgICB0aGlzLmNvbnZlcnRUb1N0YXRpY1Byb3BlcnR5KHRoaXMucm9vdC5rcyEsICdzJylcbiAgICAgICAgICAgIC8vICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAncm90YXRlJzpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnZlcnRUb1N0YXRpY1Byb3BlcnR5KHRoaXMucm9vdC5rcyEsICdyJylcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3Qua3MhLnIhLmsgPSB2YWx1ZVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdvcGFjaXR5JzpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnZlcnRUb1N0YXRpY1Byb3BlcnR5KHRoaXMucm9vdC5rcyEsICdvJylcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3Qua3MhLm8hLmsgPSB2YWx1ZVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3Ioa2V5LCB2YWx1ZSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBhIHZhbGlkIGtleS4nKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0QW5pbWF0YWJsZVByb3BlcnR5KGtleTogU2V0YWJsZUtleXMsIHN0YXJ0RnJhbWU6IG51bWJlciwgZW5kRnJhbWU6IG51bWJlciwgc3RhcnRWYWx1ZTogYW55LCBlbmRWYWx1ZTogYW55LCBlYXNpbmc/OiBFYXNpbmdGdW5jdGlvbikge1xuICAgICAgICBpZiAoZW5kRnJhbWUgPD0gc3RhcnRGcmFtZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFbmQgZnJhbWUgc2hvdWxkIGJlIGxhcmdlciB0aGFuIHN0YXJ0IGZyYW1lLicpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yb290Lm9wID0gZW5kRnJhbWVcbiAgICAgICAgaWYgKCFlYXNpbmcpIHtcbiAgICAgICAgICAgIGVhc2luZyA9IEVhc2luZ0ZhY3RvcnkubGluZWFyKClcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICAgICAgY2FzZSAnc2NhbGVYJzpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnZlcnRUb0FuaW1hdGFibGVQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAncycpXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRLZXlmcmFtZSh0aGlzLnJvb3Qua3MhLCAncycsIDAsIHN0YXJ0RnJhbWUsIHN0YXJ0VmFsdWUsIGVhc2luZylcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKHRoaXMucm9vdC5rcyEsICdzJywgMCwgZW5kRnJhbWUsIGVuZFZhbHVlKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdzY2FsZVknOlxuICAgICAgICAgICAgICAgIHRoaXMuY29udmVydFRvQW5pbWF0YWJsZVByb3BlcnR5KHRoaXMucm9vdC5rcyEsICdzJylcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKHRoaXMucm9vdC5rcyEsICdzJywgMSwgc3RhcnRGcmFtZSwgc3RhcnRWYWx1ZSwgZWFzaW5nKVxuICAgICAgICAgICAgICAgIHRoaXMuYWRkS2V5ZnJhbWUodGhpcy5yb290LmtzISwgJ3MnLCAxLCBlbmRGcmFtZSwgZW5kVmFsdWUpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ2FuY2hvclgnOlxuICAgICAgICAgICAgICAgIHRoaXMuY29udmVydFRvQW5pbWF0YWJsZVByb3BlcnR5KHRoaXMucm9vdC5rcyEsICdhJylcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKHRoaXMucm9vdC5rcyEsICdhJywgMCwgc3RhcnRGcmFtZSwgc3RhcnRWYWx1ZSwgZWFzaW5nKVxuICAgICAgICAgICAgICAgIHRoaXMuYWRkS2V5ZnJhbWUodGhpcy5yb290LmtzISwgJ2EnLCAwLCBlbmRGcmFtZSwgZW5kVmFsdWUpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ2FuY2hvclknOlxuICAgICAgICAgICAgICAgIHRoaXMuY29udmVydFRvQW5pbWF0YWJsZVByb3BlcnR5KHRoaXMucm9vdC5rcyEsICdhJylcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKHRoaXMucm9vdC5rcyEsICdhJywgMSwgc3RhcnRGcmFtZSwgc3RhcnRWYWx1ZSwgZWFzaW5nKVxuICAgICAgICAgICAgICAgIHRoaXMuYWRkS2V5ZnJhbWUodGhpcy5yb290LmtzISwgJ2EnLCAxLCBlbmRGcmFtZSwgZW5kVmFsdWUpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3gnOlxuICAgICAgICAgICAgICAgIHRoaXMuY29udmVydFRvQW5pbWF0YWJsZVByb3BlcnR5KHRoaXMucm9vdC5rcyEsICdwJylcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKHRoaXMucm9vdC5rcyEsICdwJywgMCwgc3RhcnRGcmFtZSwgc3RhcnRWYWx1ZSwgZWFzaW5nKVxuICAgICAgICAgICAgICAgIHRoaXMuYWRkS2V5ZnJhbWUodGhpcy5yb290LmtzISwgJ3AnLCAwLCBlbmRGcmFtZSwgZW5kVmFsdWUpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3knOlxuICAgICAgICAgICAgICAgIHRoaXMuY29udmVydFRvQW5pbWF0YWJsZVByb3BlcnR5KHRoaXMucm9vdC5rcyEsICdwJylcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKHRoaXMucm9vdC5rcyEsICdwJywgMSwgc3RhcnRGcmFtZSwgc3RhcnRWYWx1ZSwgZWFzaW5nKVxuICAgICAgICAgICAgICAgIHRoaXMuYWRkS2V5ZnJhbWUodGhpcy5yb290LmtzISwgJ3AnLCAxLCBlbmRGcmFtZSwgZW5kVmFsdWUpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIC8vIGNhc2UgJ3NrZXcnOlxuICAgICAgICAgICAgLy8gICAgIHRoaXMuY29udmVydFRvQW5pbWF0YWJsZVByb3BlcnR5KHRoaXMucm9vdC5rcyEsICdzJylcbiAgICAgICAgICAgIC8vICAgICBicmVha1xuICAgICAgICAgICAgLy8gY2FzZSAnc2tld0F4aXMnOlxuICAgICAgICAgICAgLy8gICAgIHRoaXMuY29udmVydFRvQW5pbWF0YWJsZVByb3BlcnR5KHRoaXMucm9vdC5rcyEsICdzJylcbiAgICAgICAgICAgIC8vICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAncm90YXRlJzpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnZlcnRUb0FuaW1hdGFibGVQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAncicpXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRLZXlmcmFtZSh0aGlzLnJvb3Qua3MhLCAncicsIC0xLCBzdGFydEZyYW1lLCBzdGFydFZhbHVlLCBlYXNpbmcpXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRLZXlmcmFtZSh0aGlzLnJvb3Qua3MhLCAncicsIC0xLCBlbmRGcmFtZSwgZW5kVmFsdWUpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ29wYWNpdHknOlxuICAgICAgICAgICAgICAgIHRoaXMuY29udmVydFRvQW5pbWF0YWJsZVByb3BlcnR5KHRoaXMucm9vdC5rcyEsICdvJylcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKHRoaXMucm9vdC5rcyEsICdvJywgLTEsIHN0YXJ0RnJhbWUsIHN0YXJ0VmFsdWUsIGVhc2luZylcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKHRoaXMucm9vdC5rcyEsICdvJywgLTEsIGVuZEZyYW1lLCBlbmRWYWx1ZSlcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGtleSwgc3RhcnRGcmFtZSwgZW5kRnJhbWUsIHN0YXJ0VmFsdWUsIGVuZFZhbHVlLCBlYXNpbmcpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgYSB2YWxpZCBrZXkuJylcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIExheWVyRmFjdG9yeSB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2VuZXJhdGVUcmFuc2Zvcm0oY29vcmRpbmF0ZTogbnVtYmVyW10pOiBUcmFuc2Zvcm0ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbzoge1xuICAgICAgICAgICAgICAgIGE6IDAsXG4gICAgICAgICAgICAgICAgazogMTAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcjoge1xuICAgICAgICAgICAgICAgIGE6IDAsXG4gICAgICAgICAgICAgICAgazogMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHA6IHtcbiAgICAgICAgICAgICAgICBhOiAwLFxuICAgICAgICAgICAgICAgIGs6IFtcbiAgICAgICAgICAgICAgICAgICAgY29vcmRpbmF0ZVswXSxcbiAgICAgICAgICAgICAgICAgICAgY29vcmRpbmF0ZVsxXSxcbiAgICAgICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhOiB7XG4gICAgICAgICAgICAgICAgYTogMCxcbiAgICAgICAgICAgICAgICBrOiBbXG4gICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgIDBcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgczoge1xuICAgICAgICAgICAgICAgIGE6IDAsXG4gICAgICAgICAgICAgICAgazogW1xuICAgICAgICAgICAgICAgICAgICAxMDAsXG4gICAgICAgICAgICAgICAgICAgIDEwMCxcbiAgICAgICAgICAgICAgICAgICAgMTAwXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgY2FsY3VsYXRlQmFzZVRyYW5zZm9ybShkb206IFNWR0dyYXBoaWNzRWxlbWVudCwgcm9vdDogU1ZHR3JhcGhpY3NFbGVtZW50KSB7XG4gICAgICAgIHJldHVybiByb290LmdldFNjcmVlbkNUTSgpIS5pbnZlcnNlKCkubXVsdGlwbHkoZG9tLmdldFNjcmVlbkNUTSgpISlcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBnZXRCb3VuZGluZ0JveChkb206IFNWR0dyYXBoaWNzRWxlbWVudCkge1xuICAgICAgICBsZXQgc3ZnUm9vdDogU1ZHR3JhcGhpY3NFbGVtZW50ID0gZG9tXG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICBpZiAoc3ZnUm9vdC5wYXJlbnRFbGVtZW50IGluc3RhbmNlb2YgU1ZHR3JhcGhpY3NFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgc3ZnUm9vdCA9IHN2Z1Jvb3QucGFyZW50RWxlbWVudFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGJhc2VCb3ggPSB0aGlzLmNhbGN1bGF0ZUJhc2VUcmFuc2Zvcm0oZG9tLCBzdmdSb290KVxuICAgICAgICBjb25zdCByZWZCQm94ID0gZG9tLmdldEJCb3goKVxuICAgICAgICBjb25zdCBjb29yZGluYXRlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFtiYXNlQm94LmUgKyByZWZCQm94LngsIGJhc2VCb3guZiArIHJlZkJCb3gueSwgcmVmQkJveC53aWR0aCArIDIsIHJlZkJCb3guaGVpZ2h0ICsgMl1cbiAgICAgICAgcmV0dXJuIGNvb3JkaW5hdGVcbiAgICB9XG5cbiAgICBzdGF0aWMgYm91bmRpbmdCb3goZG9tOiBTVkdHcmFwaGljc0VsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVjdCguLi50aGlzLmdldEJvdW5kaW5nQm94KGRvbSkpXG4gICAgfVxuXG4gICAgc3RhdGljIHNoYXBlKGRvbTogU1ZHUGF0aEVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgY29vcmRpbmF0ZSA9IHRoaXMuZ2V0Qm91bmRpbmdCb3goZG9tKVxuICAgICAgICBjb25zdCBsYXllcjogU2hhcGVMYXllciA9IHtcbiAgICAgICAgICAgIHR5OiA0LFxuICAgICAgICAgICAgZGRkOiAwLFxuICAgICAgICAgICAgc3I6IDEsXG4gICAgICAgICAgICBhbzogMCxcbiAgICAgICAgICAgIGtzOiB0aGlzLmdlbmVyYXRlVHJhbnNmb3JtKGNvb3JkaW5hdGUpLFxuICAgICAgICAgICAgaXA6IDAsXG4gICAgICAgICAgICBvcDogMSxcbiAgICAgICAgICAgIHN0OiAwLFxuICAgICAgICAgICAgYm06IDAsXG4gICAgICAgICAgICBzaGFwZXM6IFtcbiAgICAgICAgICAgICAgICByZW5kZXIoZG9tKVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgSlNNb3ZpbkxheWVyKGxheWVyKVxuICAgIH1cblxuICAgIHN0YXRpYyByZWN0KGxlZnQ6IG51bWJlciwgdG9wOiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGxheWVyOiBTaGFwZUxheWVyID0ge1xuICAgICAgICAgICAgdHk6IDQsXG4gICAgICAgICAgICBkZGQ6IDAsXG4gICAgICAgICAgICBzcjogMSxcbiAgICAgICAgICAgIGFvOiAwLFxuICAgICAgICAgICAga3M6IHRoaXMuZ2VuZXJhdGVUcmFuc2Zvcm0oW2xlZnQsIHRvcCwgd2lkdGgsIGhlaWdodF0pLFxuICAgICAgICAgICAgaXA6IDAsXG4gICAgICAgICAgICBvcDogMSxcbiAgICAgICAgICAgIHN0OiAwLFxuICAgICAgICAgICAgYm06IDAsXG4gICAgICAgICAgICBzaGFwZXM6IFtcbiAgICAgICAgICAgICAgICByZW5kZXJQbGFpbkdseXBoKCdyZWN0JywgW3dpZHRoLCBoZWlnaHRdKVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgSlNNb3ZpbkxheWVyKGxheWVyKVxuICAgIH1cblxuICAgIHN0YXRpYyBlbGxpcHNlKGN4OiBudW1iZXIsIGN5OiBudW1iZXIsIHJ4OiBudW1iZXIsIHJ5OiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgbGF5ZXI6IFNoYXBlTGF5ZXIgPSB7XG4gICAgICAgICAgICB0eTogNCxcbiAgICAgICAgICAgIGRkZDogMCxcbiAgICAgICAgICAgIHNyOiAxLFxuICAgICAgICAgICAgYW86IDAsXG4gICAgICAgICAgICBrczogdGhpcy5nZW5lcmF0ZVRyYW5zZm9ybShbY3ggLSByeCwgY3kgLSByeSwgMiAqIHJ4LCAyICogcnldKSxcbiAgICAgICAgICAgIGlwOiAwLFxuICAgICAgICAgICAgb3A6IDEsXG4gICAgICAgICAgICBzdDogMCxcbiAgICAgICAgICAgIGJtOiAwLFxuICAgICAgICAgICAgc2hhcGVzOiBbXG4gICAgICAgICAgICAgICAgcmVuZGVyUGxhaW5HbHlwaCgnZWxsaXBzZScsIFtyeCwgcnldKVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgSlNNb3ZpbkxheWVyKGxheWVyKVxuICAgIH1cblxuICAgIHN0YXRpYyBoaWVyYXJjaHkoZG9tOiBTVkdHcmFwaGljc0VsZW1lbnQsIGFzc2V0TGlzdDogQXNzZXRzLCBmb250TGlzdDogRm9udHMpIHtcbiAgICAgICAgY29uc3QgY29vcmRpbmF0ZSA9IHRoaXMuZ2V0Qm91bmRpbmdCb3goZG9tKVxuICAgICAgICBsZXQgZG9tVHlwZTogMiB8IDQgfCA1O1xuICAgICAgICBpZiAoZG9tIGluc3RhbmNlb2YgU1ZHVGV4dEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGRvbVR5cGUgPSA1XG4gICAgICAgIH0gZWxzZSBpZiAoZG9tIGluc3RhbmNlb2YgU1ZHSW1hZ2VFbGVtZW50KSB7XG4gICAgICAgICAgICBkb21UeXBlID0gMlxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG9tVHlwZSA9IDRcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsYXllcjogU2hhcGVMYXllciB8IEltYWdlTGF5ZXIgfCBUZXh0TGF5ZXIgPSB7XG4gICAgICAgICAgICB0eTogZG9tVHlwZSxcbiAgICAgICAgICAgIGRkZDogMCxcbiAgICAgICAgICAgIHNyOiAxLFxuICAgICAgICAgICAgYW86IDAsXG4gICAgICAgICAgICBrczogdGhpcy5nZW5lcmF0ZVRyYW5zZm9ybShjb29yZGluYXRlKSxcbiAgICAgICAgICAgIGlwOiAwLFxuICAgICAgICAgICAgb3A6IDEsXG4gICAgICAgICAgICBzdDogMCxcbiAgICAgICAgICAgIGJtOiAwXG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoIChkb21UeXBlKSB7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgaWYgKGFzc2V0TGlzdCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbWFnZUxheWVyID0gbGF5ZXIgYXMgSW1hZ2VMYXllclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBbcmVmSWQsIGFzc2V0XSA9IHJlbmRlckltYWdlKGRvbSBhcyBTVkdJbWFnZUVsZW1lbnQpXG4gICAgICAgICAgICAgICAgICAgIGltYWdlTGF5ZXIucmVmSWQgPSByZWZJZFxuICAgICAgICAgICAgICAgICAgICBhc3NldExpc3QucHVzaChhc3NldClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICBjb25zdCBzaGFwZUxheWVyID0gbGF5ZXIgYXMgU2hhcGVMYXllclxuICAgICAgICAgICAgICAgIHNoYXBlTGF5ZXIuc2hhcGVzID0gW11cbiAgICAgICAgICAgICAgICBzaGFwZUxheWVyLnNoYXBlcy5wdXNoKHJlbmRlcihkb20pKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dExheWVyID0gbGF5ZXIgYXMgVGV4dExheWVyXG4gICAgICAgICAgICAgICAgY29uc3QgW3RleHREYXRhLCBmb250XSA9IHJlbmRlclRleHQoZG9tIGFzIFNWR1RleHRFbGVtZW50KVxuICAgICAgICAgICAgICAgIHRleHRMYXllci50ID0gdGV4dERhdGFcbiAgICAgICAgICAgICAgICBmb250TGlzdC5saXN0IS5wdXNoKGZvbnQpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1vdmluTGF5ZXIgPSBuZXcgSlNNb3ZpbkxheWVyKGxheWVyKVxuICAgICAgICByZXR1cm4gbW92aW5MYXllclxuICAgIH1cbn0iXX0=