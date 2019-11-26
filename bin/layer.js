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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sYXllci50cyJdLCJuYW1lcyI6WyJKU01vdmluTGF5ZXIiLCJrZXkiLCJ0cmFuc2Zvcm0iLCJhIiwiayIsImdldERlZmF1bHRQcm9wZXJ0eSIsInN0YXRpY1ZhbHVlIiwicyIsImlkeCIsInRpbWUiLCJ2YWx1ZSIsImVhc2luZyIsImV4aXN0S2V5ZnJhbWUiLCJmaWx0ZXIiLCJ4IiwidCIsInJlYWR5VG9TZXQiLCJsZW5ndGgiLCJwcmV2aW91c0tleWZyYW1lQ291bnQiLCJyZWR1Y2UiLCJwIiwic3BsaWNlIiwibyIsInkiLCJpIiwicmVmIiwicm9vdCIsIm9wIiwiY29udmVydFRvU3RhdGljUHJvcGVydHkiLCJrcyIsInIiLCJjb25zb2xlIiwiZXJyb3IiLCJFcnJvciIsInN0YXJ0RnJhbWUiLCJlbmRGcmFtZSIsInN0YXJ0VmFsdWUiLCJlbmRWYWx1ZSIsIkVhc2luZ0ZhY3RvcnkiLCJsaW5lYXIiLCJjb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkiLCJhZGRLZXlmcmFtZSIsIkxheWVyRmFjdG9yeSIsImNvb3JkaW5hdGUiLCJkb20iLCJzdmdSb290IiwicGFyZW50RWxlbWVudCIsIlNWR0dyYXBoaWNzRWxlbWVudCIsInJvb3RCQm94IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwicmVmQkJveCIsImxlZnQiLCJ0b3AiLCJ3aWR0aCIsImhlaWdodCIsImdldEJvdW5kaW5nQm94IiwicmVjdCIsImxheWVyIiwidHkiLCJkZGQiLCJzciIsImFvIiwiZ2VuZXJhdGVUcmFuc2Zvcm0iLCJpcCIsInN0IiwiYm0iLCJzaGFwZXMiLCJjeCIsImN5IiwicngiLCJyeSIsImFzc2V0TGlzdCIsImZvbnRMaXN0IiwiZG9tVHlwZSIsIlNWR1RleHRFbGVtZW50IiwiU1ZHSW1hZ2VFbGVtZW50IiwiaW1hZ2VMYXllciIsInJlZklkIiwiYXNzZXQiLCJwdXNoIiwic2hhcGVMYXllciIsInRleHRMYXllciIsInRleHREYXRhIiwiZm9udCIsImxpc3QiLCJt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QU4yQztBQU8vQ3BDLFFBQUFBLEVBQUUsRUFBRSxDQVAyQztBQVEvQ3FDLFFBQUFBLEVBQUUsRUFBRSxDQVIyQztBQVMvQ0MsUUFBQUEsRUFBRSxFQUFFO0FBVDJDLE9BQW5EOztBQVdBLGNBQVFRLE9BQVI7QUFDSSxhQUFLLENBQUw7QUFDSSxjQUFJRixTQUFKLEVBQWU7QUFDWCxnQkFBTUssVUFBVSxHQUFHbkIsS0FBbkI7O0FBRFcsK0JBRVkseUJBQVliLEdBQVosQ0FGWjtBQUFBO0FBQUEsZ0JBRUppQyxLQUZJO0FBQUEsZ0JBRUdDLEtBRkg7O0FBR1hGLFlBQUFBLFVBQVUsQ0FBQ0MsS0FBWCxHQUFtQkEsS0FBbkI7QUFDQU4sWUFBQUEsU0FBUyxDQUFDUSxJQUFWLENBQWVELEtBQWY7QUFDSDs7QUFDRDs7QUFDSixhQUFLLENBQUw7QUFDSSxjQUFNRSxVQUFVLEdBQUd2QixLQUFuQjtBQUNBdUIsVUFBQUEsVUFBVSxDQUFDZCxNQUFYLEdBQW9CLEVBQXBCO0FBQ0FjLFVBQUFBLFVBQVUsQ0FBQ2QsTUFBWCxDQUFrQmEsSUFBbEIsQ0FBdUIsb0JBQU9uQyxHQUFQLENBQXZCO0FBQ0E7O0FBQ0osYUFBSyxDQUFMO0FBQ0ksY0FBTXFDLFNBQVMsR0FBR3hCLEtBQWxCOztBQURKLDRCQUU2Qix3QkFBV2IsR0FBWCxDQUY3QjtBQUFBO0FBQUEsY0FFV3NDLFFBRlg7QUFBQSxjQUVxQkMsSUFGckI7O0FBR0lGLFVBQUFBLFNBQVMsQ0FBQ2xFLENBQVYsR0FBY21FLFFBQWQ7QUFDQVYsVUFBQUEsUUFBUSxDQUFDWSxJQUFULENBQWVMLElBQWYsQ0FBb0JJLElBQXBCO0FBQ0E7QUFuQlI7O0FBc0JBLFVBQU1FLFVBQVUsR0FBRyxJQUFJckYsWUFBSixDQUFpQnlELEtBQWpCLENBQW5CO0FBQ0EsYUFBTzRCLFVBQVA7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNoYXBlTGF5ZXIsIFRleHRMYXllciwgSW1hZ2VMYXllciwgVHJhbnNmb3JtLCBBc3NldHMsIEZvbnRzIH0gZnJvbSAnLi9hbmltYXRpb24nXG5pbXBvcnQgeyBFYXNpbmdGdW5jdGlvbiwgRWFzaW5nRmFjdG9yeSB9IGZyb20gJy4vZWFzaW5nJ1xuaW1wb3J0IHsgcmVuZGVyVGV4dCwgcmVuZGVyLCByZW5kZXJJbWFnZSwgcmVuZGVyUGxhaW5HbHlwaCB9IGZyb20gJy4vcmVuZGVyJztcblxudHlwZSBTZXRhYmxlS2V5cyA9IFwic2NhbGVYXCIgfCBcInNjYWxlWVwiIHwgXCJhbmNob3JYXCIgfCBcImFuY2hvcllcIiB8IFwieFwiIHwgXCJ5XCIgfCBcInJvdGF0ZVwiIHwgXCJvcGFjaXR5XCIgfCAnc2hhcGUnIHwgJ2ZpbGxDb2xvcicgfCAndHJpbScgfCAnc3Ryb2tlQ29sb3InIHwgJ3N0cm9rZVdpZHRoJ1xuXG5leHBvcnQgY2xhc3MgSlNNb3ZpbkxheWVyIHtcbiAgICBwdWJsaWMgcmVhZG9ubHkgcm9vdDogU2hhcGVMYXllciB8IFRleHRMYXllciB8IEltYWdlTGF5ZXI7XG4gICAgcHJpdmF0ZSBnZXREZWZhdWx0UHJvcGVydHkoa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgIGNhc2UgJ2EnOlxuICAgICAgICAgICAgY2FzZSAncCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFswLCAwLCAwXVxuICAgICAgICAgICAgY2FzZSAncyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsxMDAsIDEwMCwgMTAwXVxuICAgICAgICAgICAgY2FzZSAnbyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIDEwMFxuICAgICAgICAgICAgY2FzZSAncic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIDBcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gMFxuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgY29udmVydFRvU3RhdGljUHJvcGVydHkodHJhbnNmb3JtOiBUcmFuc2Zvcm0sIGtleTogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdHJhbnNmb3JtW2tleV0pIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybVtrZXldID0ge1xuICAgICAgICAgICAgICAgIGE6IDAsXG4gICAgICAgICAgICAgICAgazogdGhpcy5nZXREZWZhdWx0UHJvcGVydHkoa2V5KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0cmFuc2Zvcm1ba2V5XS5hID09IDEpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRpY1ZhbHVlID0gdHJhbnNmb3JtW2tleV0ua1swXS5zXG4gICAgICAgICAgICB0cmFuc2Zvcm1ba2V5XSA9IHtcbiAgICAgICAgICAgICAgICBhOiAwLFxuICAgICAgICAgICAgICAgIGs6IHN0YXRpY1ZhbHVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBjb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkodHJhbnNmb3JtOiBUcmFuc2Zvcm0sIGtleTogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdHJhbnNmb3JtW2tleV0gfHwgdHJhbnNmb3JtW2tleV0uYSA9PSAwKSB7XG4gICAgICAgICAgICB0cmFuc2Zvcm1ba2V5XSA9IHtcbiAgICAgICAgICAgICAgICBhOiAxLFxuICAgICAgICAgICAgICAgIGs6IFtdXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBhZGRLZXlmcmFtZSh0cmFuc2Zvcm06IFRyYW5zZm9ybSwga2V5OiBzdHJpbmcsIGlkeDogbnVtYmVyID0gLTEsIHRpbWU6IG51bWJlciwgdmFsdWU6IEFycmF5PGFueT4sIGVhc2luZz86IEVhc2luZ0Z1bmN0aW9uKSB7XG4gICAgICAgIGNvbnN0IGV4aXN0S2V5ZnJhbWUgPSB0cmFuc2Zvcm1ba2V5XS5rLmZpbHRlcigoeDogYW55KSA9PiB4LnQgPT0gdGltZSkgYXMgYW55W11cbiAgICAgICAgbGV0IHJlYWR5VG9TZXQ7XG4gICAgICAgIGlmIChleGlzdEtleWZyYW1lLmxlbmd0aCkge1xuICAgICAgICAgICAgcmVhZHlUb1NldCA9IGV4aXN0S2V5ZnJhbWVbMF1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlYWR5VG9TZXQgPSB7XG4gICAgICAgICAgICAgICAgdDogdGltZSxcbiAgICAgICAgICAgICAgICBzOiB0aGlzLmdldERlZmF1bHRQcm9wZXJ0eShrZXkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBwcmV2aW91c0tleWZyYW1lQ291bnQgPSB0cmFuc2Zvcm1ba2V5XS5rLnJlZHVjZSgocDogbnVtYmVyLCB4OiBhbnkpID0+IHgudCA8IHRpbWUgPyBwICsgMSA6IHAsIDApXG4gICAgICAgICAgICB0cmFuc2Zvcm1ba2V5XS5rLnNwbGljZShwcmV2aW91c0tleWZyYW1lQ291bnQsIDAsIHJlYWR5VG9TZXQpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVhc2luZykge1xuICAgICAgICAgICAgcmVhZHlUb1NldC5vID0ge1xuICAgICAgICAgICAgICAgIHg6IGVhc2luZ1swXVswXSxcbiAgICAgICAgICAgICAgICB5OiBlYXNpbmdbMF1bMV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlYWR5VG9TZXQuaSA9IHtcbiAgICAgICAgICAgICAgICB4OiBlYXNpbmdbMV1bMF0sXG4gICAgICAgICAgICAgICAgeTogZWFzaW5nWzFdWzFdXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICAgICAgICByZWFkeVRvU2V0LnNbaWR4XSA9IHZhbHVlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWFkeVRvU2V0LnMgPSBbdmFsdWVdXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihyZWY6IFNoYXBlTGF5ZXIgfCBUZXh0TGF5ZXIgfCBJbWFnZUxheWVyKSB7XG4gICAgICAgIHRoaXMucm9vdCA9IHJlZlxuICAgIH1cblxuICAgIHNldFN0YXRpY1Byb3BlcnR5KGtleTogU2V0YWJsZUtleXMsIHZhbHVlOiBhbnkpIHtcbiAgICAgICAgdGhpcy5yb290Lm9wID0gMVxuICAgICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICAgICAgY2FzZSAnc2NhbGVYJzpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnZlcnRUb1N0YXRpY1Byb3BlcnR5KHRoaXMucm9vdC5rcyEsICdzJylcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3Qua3MhLnMhLmshWzBdID0gdmFsdWVcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnc2NhbGVZJzpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnZlcnRUb1N0YXRpY1Byb3BlcnR5KHRoaXMucm9vdC5rcyEsICdzJylcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3Qua3MhLnMhLmshWzFdID0gdmFsdWVcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnYW5jaG9yWCc6XG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9TdGF0aWNQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAnYScpXG4gICAgICAgICAgICAgICAgdGhpcy5yb290LmtzIS5hIS5rIVswXSA9IHZhbHVlXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ2FuY2hvclknOlxuICAgICAgICAgICAgICAgIHRoaXMuY29udmVydFRvU3RhdGljUHJvcGVydHkodGhpcy5yb290LmtzISwgJ2EnKVxuICAgICAgICAgICAgICAgIHRoaXMucm9vdC5rcyEuYSEuayFbMV0gPSB2YWx1ZVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICd4JzpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnZlcnRUb1N0YXRpY1Byb3BlcnR5KHRoaXMucm9vdC5rcyEsICdwJylcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3Qua3MhLnAhLmshWzBdID0gdmFsdWVcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAneSc6XG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9TdGF0aWNQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAncCcpXG4gICAgICAgICAgICAgICAgdGhpcy5yb290LmtzIS5wIS5rIVsxXSA9IHZhbHVlXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIC8vIGNhc2UgJ3NrZXcnOlxuICAgICAgICAgICAgLy8gICAgIHRoaXMuY29udmVydFRvU3RhdGljUHJvcGVydHkodGhpcy5yb290LmtzISwgJ3MnKVxuICAgICAgICAgICAgLy8gICAgIGJyZWFrXG4gICAgICAgICAgICAvLyBjYXNlICdza2V3QXhpcyc6XG4gICAgICAgICAgICAvLyAgICAgdGhpcy5jb252ZXJ0VG9TdGF0aWNQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAncycpXG4gICAgICAgICAgICAvLyAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3JvdGF0ZSc6XG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9TdGF0aWNQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAncicpXG4gICAgICAgICAgICAgICAgdGhpcy5yb290LmtzIS5yIS5rID0gdmFsdWVcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnb3BhY2l0eSc6XG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9TdGF0aWNQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAnbycpXG4gICAgICAgICAgICAgICAgdGhpcy5yb290LmtzIS5vIS5rID0gdmFsdWVcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGtleSwgdmFsdWUpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgYSB2YWxpZCBrZXkuJylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldEFuaW1hdGFibGVQcm9wZXJ0eShrZXk6IFNldGFibGVLZXlzLCBzdGFydEZyYW1lOiBudW1iZXIsIGVuZEZyYW1lOiBudW1iZXIsIHN0YXJ0VmFsdWU6IGFueSwgZW5kVmFsdWU6IGFueSwgZWFzaW5nPzogRWFzaW5nRnVuY3Rpb24pIHtcbiAgICAgICAgaWYgKGVuZEZyYW1lIDw9IHN0YXJ0RnJhbWUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRW5kIGZyYW1lIHNob3VsZCBiZSBsYXJnZXIgdGhhbiBzdGFydCBmcmFtZS4nKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucm9vdC5vcCA9IGVuZEZyYW1lXG4gICAgICAgIGlmICghZWFzaW5nKSB7XG4gICAgICAgICAgICBlYXNpbmcgPSBFYXNpbmdGYWN0b3J5LmxpbmVhcigpXG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgIGNhc2UgJ3NjYWxlWCc6XG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkodGhpcy5yb290LmtzISwgJ3MnKVxuICAgICAgICAgICAgICAgIHRoaXMuYWRkS2V5ZnJhbWUodGhpcy5yb290LmtzISwgJ3MnLCAwLCBzdGFydEZyYW1lLCBzdGFydFZhbHVlLCBlYXNpbmcpXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRLZXlmcmFtZSh0aGlzLnJvb3Qua3MhLCAncycsIDAsIGVuZEZyYW1lLCBlbmRWYWx1ZSlcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnc2NhbGVZJzpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnZlcnRUb0FuaW1hdGFibGVQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAncycpXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRLZXlmcmFtZSh0aGlzLnJvb3Qua3MhLCAncycsIDEsIHN0YXJ0RnJhbWUsIHN0YXJ0VmFsdWUsIGVhc2luZylcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKHRoaXMucm9vdC5rcyEsICdzJywgMSwgZW5kRnJhbWUsIGVuZFZhbHVlKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdhbmNob3JYJzpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnZlcnRUb0FuaW1hdGFibGVQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAnYScpXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRLZXlmcmFtZSh0aGlzLnJvb3Qua3MhLCAnYScsIDAsIHN0YXJ0RnJhbWUsIHN0YXJ0VmFsdWUsIGVhc2luZylcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKHRoaXMucm9vdC5rcyEsICdhJywgMCwgZW5kRnJhbWUsIGVuZFZhbHVlKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdhbmNob3JZJzpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnZlcnRUb0FuaW1hdGFibGVQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAnYScpXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRLZXlmcmFtZSh0aGlzLnJvb3Qua3MhLCAnYScsIDEsIHN0YXJ0RnJhbWUsIHN0YXJ0VmFsdWUsIGVhc2luZylcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKHRoaXMucm9vdC5rcyEsICdhJywgMSwgZW5kRnJhbWUsIGVuZFZhbHVlKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICd4JzpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnZlcnRUb0FuaW1hdGFibGVQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAncCcpXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRLZXlmcmFtZSh0aGlzLnJvb3Qua3MhLCAncCcsIDAsIHN0YXJ0RnJhbWUsIHN0YXJ0VmFsdWUsIGVhc2luZylcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKHRoaXMucm9vdC5rcyEsICdwJywgMCwgZW5kRnJhbWUsIGVuZFZhbHVlKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICd5JzpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnZlcnRUb0FuaW1hdGFibGVQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAncCcpXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRLZXlmcmFtZSh0aGlzLnJvb3Qua3MhLCAncCcsIDEsIHN0YXJ0RnJhbWUsIHN0YXJ0VmFsdWUsIGVhc2luZylcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKHRoaXMucm9vdC5rcyEsICdwJywgMSwgZW5kRnJhbWUsIGVuZFZhbHVlKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAvLyBjYXNlICdza2V3JzpcbiAgICAgICAgICAgIC8vICAgICB0aGlzLmNvbnZlcnRUb0FuaW1hdGFibGVQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAncycpXG4gICAgICAgICAgICAvLyAgICAgYnJlYWtcbiAgICAgICAgICAgIC8vIGNhc2UgJ3NrZXdBeGlzJzpcbiAgICAgICAgICAgIC8vICAgICB0aGlzLmNvbnZlcnRUb0FuaW1hdGFibGVQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAncycpXG4gICAgICAgICAgICAvLyAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3JvdGF0ZSc6XG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkodGhpcy5yb290LmtzISwgJ3InKVxuICAgICAgICAgICAgICAgIHRoaXMuYWRkS2V5ZnJhbWUodGhpcy5yb290LmtzISwgJ3InLCAtMSwgc3RhcnRGcmFtZSwgc3RhcnRWYWx1ZSwgZWFzaW5nKVxuICAgICAgICAgICAgICAgIHRoaXMuYWRkS2V5ZnJhbWUodGhpcy5yb290LmtzISwgJ3InLCAtMSwgZW5kRnJhbWUsIGVuZFZhbHVlKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdvcGFjaXR5JzpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnZlcnRUb0FuaW1hdGFibGVQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAnbycpXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRLZXlmcmFtZSh0aGlzLnJvb3Qua3MhLCAnbycsIC0xLCBzdGFydEZyYW1lLCBzdGFydFZhbHVlLCBlYXNpbmcpXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRLZXlmcmFtZSh0aGlzLnJvb3Qua3MhLCAnbycsIC0xLCBlbmRGcmFtZSwgZW5kVmFsdWUpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihrZXksIHN0YXJ0RnJhbWUsIGVuZEZyYW1lLCBzdGFydFZhbHVlLCBlbmRWYWx1ZSwgZWFzaW5nKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGEgdmFsaWQga2V5LicpXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMYXllckZhY3Rvcnkge1xuICAgIHByaXZhdGUgc3RhdGljIGdlbmVyYXRlVHJhbnNmb3JtKGNvb3JkaW5hdGU6IG51bWJlcltdKTogVHJhbnNmb3JtIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG86IHtcbiAgICAgICAgICAgICAgICBhOiAwLFxuICAgICAgICAgICAgICAgIGs6IDEwMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHI6IHtcbiAgICAgICAgICAgICAgICBhOiAwLFxuICAgICAgICAgICAgICAgIGs6IDBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwOiB7XG4gICAgICAgICAgICAgICAgYTogMCxcbiAgICAgICAgICAgICAgICBrOiBbXG4gICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVbMF0sXG4gICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVbMV0sXG4gICAgICAgICAgICAgICAgICAgIDBcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYToge1xuICAgICAgICAgICAgICAgIGE6IDAsXG4gICAgICAgICAgICAgICAgazogW1xuICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHM6IHtcbiAgICAgICAgICAgICAgICBhOiAwLFxuICAgICAgICAgICAgICAgIGs6IFtcbiAgICAgICAgICAgICAgICAgICAgMTAwLFxuICAgICAgICAgICAgICAgICAgICAxMDAsXG4gICAgICAgICAgICAgICAgICAgIDEwMFxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIGdldEJvdW5kaW5nQm94KGRvbTogU1ZHR3JhcGhpY3NFbGVtZW50KSB7XG4gICAgICAgIGxldCBzdmdSb290OiBTVkdFbGVtZW50ID0gZG9tXG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICBpZiAoc3ZnUm9vdC5wYXJlbnRFbGVtZW50IGluc3RhbmNlb2YgU1ZHR3JhcGhpY3NFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgc3ZnUm9vdCA9IHN2Z1Jvb3QucGFyZW50RWxlbWVudFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJvb3RCQm94ID0gc3ZnUm9vdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgICBjb25zdCByZWZCQm94ID0gZG9tLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgIGNvbnN0IGNvb3JkaW5hdGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gW3JlZkJCb3gubGVmdCAtIHJvb3RCQm94LmxlZnQsIHJlZkJCb3gudG9wIC0gcm9vdEJCb3gudG9wLCByZWZCQm94LndpZHRoICsgMSwgcmVmQkJveC5oZWlnaHQgKyAxXVxuICAgICAgICByZXR1cm4gY29vcmRpbmF0ZVxuICAgIH1cblxuICAgIHN0YXRpYyBib3VuZGluZ0JveChkb206IFNWR0dyYXBoaWNzRWxlbWVudCkge1xuICAgICAgICBjb25zdCBjb29yZGluYXRlID0gdGhpcy5nZXRCb3VuZGluZ0JveChkb20pXG4gICAgICAgIHJldHVybiB0aGlzLnJlY3QoLi4uY29vcmRpbmF0ZSlcbiAgICB9XG5cbiAgICBzdGF0aWMgc2hhcGUoZG9tOiBTVkdQYXRoRWxlbWVudCkge1xuICAgICAgICBjb25zdCBjb29yZGluYXRlID0gdGhpcy5nZXRCb3VuZGluZ0JveChkb20pXG4gICAgICAgIGNvbnN0IGxheWVyOiBTaGFwZUxheWVyID0ge1xuICAgICAgICAgICAgdHk6IDQsXG4gICAgICAgICAgICBkZGQ6IDAsXG4gICAgICAgICAgICBzcjogMSxcbiAgICAgICAgICAgIGFvOiAwLFxuICAgICAgICAgICAga3M6IHRoaXMuZ2VuZXJhdGVUcmFuc2Zvcm0oY29vcmRpbmF0ZSksXG4gICAgICAgICAgICBpcDogMCxcbiAgICAgICAgICAgIG9wOiAxLFxuICAgICAgICAgICAgc3Q6IDAsXG4gICAgICAgICAgICBibTogMCxcbiAgICAgICAgICAgIHNoYXBlczogW1xuICAgICAgICAgICAgICAgIHJlbmRlcihkb20pXG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBKU01vdmluTGF5ZXIobGF5ZXIpXG4gICAgfVxuXG4gICAgc3RhdGljIHJlY3QobGVmdDogbnVtYmVyLCB0b3A6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgbGF5ZXI6IFNoYXBlTGF5ZXIgPSB7XG4gICAgICAgICAgICB0eTogNCxcbiAgICAgICAgICAgIGRkZDogMCxcbiAgICAgICAgICAgIHNyOiAxLFxuICAgICAgICAgICAgYW86IDAsXG4gICAgICAgICAgICBrczogdGhpcy5nZW5lcmF0ZVRyYW5zZm9ybShbbGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0XSksXG4gICAgICAgICAgICBpcDogMCxcbiAgICAgICAgICAgIG9wOiAxLFxuICAgICAgICAgICAgc3Q6IDAsXG4gICAgICAgICAgICBibTogMCxcbiAgICAgICAgICAgIHNoYXBlczogW1xuICAgICAgICAgICAgICAgIHJlbmRlclBsYWluR2x5cGgoJ3JlY3QnLCBbd2lkdGgsIGhlaWdodF0pXG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBKU01vdmluTGF5ZXIobGF5ZXIpXG4gICAgfVxuXG4gICAgc3RhdGljIGVsbGlwc2UoY3g6IG51bWJlciwgY3k6IG51bWJlciwgcng6IG51bWJlciwgcnk6IG51bWJlcikge1xuICAgICAgICBjb25zdCBsYXllcjogU2hhcGVMYXllciA9IHtcbiAgICAgICAgICAgIHR5OiA0LFxuICAgICAgICAgICAgZGRkOiAwLFxuICAgICAgICAgICAgc3I6IDEsXG4gICAgICAgICAgICBhbzogMCxcbiAgICAgICAgICAgIGtzOiB0aGlzLmdlbmVyYXRlVHJhbnNmb3JtKFtjeCAtIHJ4LCBjeSAtIHJ5LCAyICogcngsIDIgKiByeV0pLFxuICAgICAgICAgICAgaXA6IDAsXG4gICAgICAgICAgICBvcDogMSxcbiAgICAgICAgICAgIHN0OiAwLFxuICAgICAgICAgICAgYm06IDAsXG4gICAgICAgICAgICBzaGFwZXM6IFtcbiAgICAgICAgICAgICAgICByZW5kZXJQbGFpbkdseXBoKCdlbGxpcHNlJywgW3J4LCByeV0pXG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBKU01vdmluTGF5ZXIobGF5ZXIpXG4gICAgfVxuXG4gICAgc3RhdGljIGhpZXJhcmNoeShkb206IFNWR0dyYXBoaWNzRWxlbWVudCwgYXNzZXRMaXN0OiBBc3NldHMsIGZvbnRMaXN0OiBGb250cykge1xuICAgICAgICBjb25zdCBjb29yZGluYXRlID0gdGhpcy5nZXRCb3VuZGluZ0JveChkb20pXG4gICAgICAgIGxldCBkb21UeXBlOiAyIHwgNCB8IDU7XG4gICAgICAgIGlmIChkb20gaW5zdGFuY2VvZiBTVkdUZXh0RWxlbWVudCkge1xuICAgICAgICAgICAgZG9tVHlwZSA9IDVcbiAgICAgICAgfSBlbHNlIGlmIChkb20gaW5zdGFuY2VvZiBTVkdJbWFnZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIGRvbVR5cGUgPSAyXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb21UeXBlID0gNFxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxheWVyOiBTaGFwZUxheWVyIHwgSW1hZ2VMYXllciB8IFRleHRMYXllciA9IHtcbiAgICAgICAgICAgIHR5OiBkb21UeXBlLFxuICAgICAgICAgICAgZGRkOiAwLFxuICAgICAgICAgICAgc3I6IDEsXG4gICAgICAgICAgICBhbzogMCxcbiAgICAgICAgICAgIGtzOiB0aGlzLmdlbmVyYXRlVHJhbnNmb3JtKGNvb3JkaW5hdGUpLFxuICAgICAgICAgICAgaXA6IDAsXG4gICAgICAgICAgICBvcDogMSxcbiAgICAgICAgICAgIHN0OiAwLFxuICAgICAgICAgICAgYm06IDBcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKGRvbVR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBpZiAoYXNzZXRMaXN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGltYWdlTGF5ZXIgPSBsYXllciBhcyBJbWFnZUxheWVyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFtyZWZJZCwgYXNzZXRdID0gcmVuZGVySW1hZ2UoZG9tIGFzIFNWR0ltYWdlRWxlbWVudClcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VMYXllci5yZWZJZCA9IHJlZklkXG4gICAgICAgICAgICAgICAgICAgIGFzc2V0TGlzdC5wdXNoKGFzc2V0KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIGNvbnN0IHNoYXBlTGF5ZXIgPSBsYXllciBhcyBTaGFwZUxheWVyXG4gICAgICAgICAgICAgICAgc2hhcGVMYXllci5zaGFwZXMgPSBbXVxuICAgICAgICAgICAgICAgIHNoYXBlTGF5ZXIuc2hhcGVzLnB1c2gocmVuZGVyKGRvbSkpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0TGF5ZXIgPSBsYXllciBhcyBUZXh0TGF5ZXJcbiAgICAgICAgICAgICAgICBjb25zdCBbdGV4dERhdGEsIGZvbnRdID0gcmVuZGVyVGV4dChkb20gYXMgU1ZHVGV4dEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgdGV4dExheWVyLnQgPSB0ZXh0RGF0YVxuICAgICAgICAgICAgICAgIGZvbnRMaXN0Lmxpc3QhLnB1c2goZm9udClcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbW92aW5MYXllciA9IG5ldyBKU01vdmluTGF5ZXIobGF5ZXIpXG4gICAgICAgIHJldHVybiBtb3ZpbkxheWVyXG4gICAgfVxufSJdfQ==