"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LayerFactory = exports.JSMovinLayer = void 0;

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

      if (idx >= 0) {
        readyToSet.s[idx] = value;
      } else {
        readyToSet.s = value;
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

      switch (key) {
        case 'scaleX':
          this.convertToAnimatableProperty(this.root.ks, 's');
          this.addKeyframe(this.root.ks, 's', 0, startFrame, startValue);
          this.addKeyframe(this.root.ks, 's', 0, endFrame, endValue);
          break;

        case 'scaleY':
          this.convertToAnimatableProperty(this.root.ks, 's');
          this.addKeyframe(this.root.ks, 's', 1, startFrame, startValue);
          this.addKeyframe(this.root.ks, 's', 1, endFrame, endValue);
          break;

        case 'anchorX':
          this.convertToAnimatableProperty(this.root.ks, 'a');
          this.addKeyframe(this.root.ks, 'a', 0, startFrame, startValue);
          this.addKeyframe(this.root.ks, 'a', 0, endFrame, endValue);
          break;

        case 'anchorY':
          this.convertToAnimatableProperty(this.root.ks, 'a');
          this.addKeyframe(this.root.ks, 'a', 1, startFrame, startValue);
          this.addKeyframe(this.root.ks, 'a', 1, endFrame, endValue);
          break;

        case 'x':
          this.convertToAnimatableProperty(this.root.ks, 'p');
          this.addKeyframe(this.root.ks, 'p', 0, startFrame, startValue);
          this.addKeyframe(this.root.ks, 'p', 0, endFrame, endValue);
          break;

        case 'y':
          this.convertToAnimatableProperty(this.root.ks, 'p');
          this.addKeyframe(this.root.ks, 'p', 1, startFrame, startValue);
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
          this.addKeyframe(this.root.ks, 'r', -1, startFrame, startValue);
          this.addKeyframe(this.root.ks, 'r', -1, endFrame, endValue);
          break;

        case 'opacity':
          this.convertToAnimatableProperty(this.root.ks, 'o');
          this.addKeyframe(this.root.ks, 'o', -1, startFrame, startValue);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sYXllci50cyJdLCJuYW1lcyI6WyJKU01vdmluTGF5ZXIiLCJrZXkiLCJ0cmFuc2Zvcm0iLCJhIiwiayIsImdldERlZmF1bHRQcm9wZXJ0eSIsInN0YXRpY1ZhbHVlIiwicyIsImlkeCIsInRpbWUiLCJ2YWx1ZSIsImV4aXN0S2V5ZnJhbWUiLCJmaWx0ZXIiLCJ4IiwidCIsInJlYWR5VG9TZXQiLCJsZW5ndGgiLCJwcmV2aW91c0tleWZyYW1lQ291bnQiLCJyZWR1Y2UiLCJwIiwic3BsaWNlIiwicmVmIiwicm9vdCIsImNvbnZlcnRUb1N0YXRpY1Byb3BlcnR5Iiwia3MiLCJyIiwibyIsImNvbnNvbGUiLCJlcnJvciIsIkVycm9yIiwic3RhcnRGcmFtZSIsImVuZEZyYW1lIiwic3RhcnRWYWx1ZSIsImVuZFZhbHVlIiwiZWFzaW5nIiwiY29udmVydFRvQW5pbWF0YWJsZVByb3BlcnR5IiwiYWRkS2V5ZnJhbWUiLCJMYXllckZhY3RvcnkiLCJjb29yZGluYXRlIiwiZG9tIiwic3ZnUm9vdCIsInBhcmVudEVsZW1lbnQiLCJTVkdHcmFwaGljc0VsZW1lbnQiLCJyb290QkJveCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInJlZkJCb3giLCJsZWZ0IiwidG9wIiwid2lkdGgiLCJoZWlnaHQiLCJnZXRCb3VuZGluZ0JveCIsInJlY3QiLCJsYXllciIsInR5IiwiZGRkIiwic3IiLCJhbyIsImdlbmVyYXRlVHJhbnNmb3JtIiwiaXAiLCJvcCIsInN0IiwiYm0iLCJzaGFwZXMiLCJjeCIsImN5IiwicngiLCJyeSIsInJvdGF0ZSIsImFzc2V0TGlzdCIsImZvbnRMaXN0IiwiZG9tVHlwZSIsIlNWR1RleHRFbGVtZW50IiwiU1ZHSW1hZ2VFbGVtZW50IiwiaW1hZ2VMYXllciIsInJlZklkIiwiYXNzZXQiLCJwdXNoIiwic2hhcGVMYXllciIsInRleHRMYXllciIsInRleHREYXRhIiwiZm9udCIsImxpc3QiLCJtb3ZpbkxheWVyIl0sIm1hcHBpbmdzIjoi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QixVQUFQO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTaGFwZUxheWVyLCBUZXh0TGF5ZXIsIEltYWdlTGF5ZXIsIFRyYW5zZm9ybSwgQXNzZXRzLCBGb250cyB9IGZyb20gJy4vYW5pbWF0aW9uJ1xuaW1wb3J0IHsgRWFzaW5nRnVuY3Rpb24gfSBmcm9tICcuL2Vhc2luZydcbmltcG9ydCB7IHJlbmRlclRleHQsIHJlbmRlciwgcmVuZGVySW1hZ2UgfSBmcm9tICcuL3JlbmRlcic7XG5cbnR5cGUgU2V0YWJsZUtleXMgPSBcInNjYWxlWFwiIHwgXCJzY2FsZVlcIiB8IFwiYW5jaG9yWFwiIHwgXCJhbmNob3JZXCIgfCBcInhcIiB8IFwieVwiIHwgXCJyb3RhdGVcIiB8IFwib3BhY2l0eVwiIHwgJ3NoYXBlJ1xuXG5leHBvcnQgY2xhc3MgSlNNb3ZpbkxheWVyIHtcbiAgICBwdWJsaWMgcmVhZG9ubHkgcm9vdDogU2hhcGVMYXllciB8IFRleHRMYXllciB8IEltYWdlTGF5ZXI7XG4gICAgcHJpdmF0ZSBnZXREZWZhdWx0UHJvcGVydHkoa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgIGNhc2UgJ2EnOlxuICAgICAgICAgICAgY2FzZSAncCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFswLCAwLCAwXVxuICAgICAgICAgICAgY2FzZSAncyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsxMDAsIDEwMCwgMTAwXVxuICAgICAgICAgICAgY2FzZSAnbyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIDEwMFxuICAgICAgICAgICAgY2FzZSAncic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIDBcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gMFxuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgY29udmVydFRvU3RhdGljUHJvcGVydHkodHJhbnNmb3JtOiBUcmFuc2Zvcm0sIGtleTogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdHJhbnNmb3JtW2tleV0pIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybVtrZXldID0ge1xuICAgICAgICAgICAgICAgIGE6IDAsXG4gICAgICAgICAgICAgICAgazogdGhpcy5nZXREZWZhdWx0UHJvcGVydHkoa2V5KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0cmFuc2Zvcm1ba2V5XS5hID09IDEpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRpY1ZhbHVlID0gdHJhbnNmb3JtW2tleV0ua1swXS5zXG4gICAgICAgICAgICB0cmFuc2Zvcm1ba2V5XSA9IHtcbiAgICAgICAgICAgICAgICBhOiAwLFxuICAgICAgICAgICAgICAgIGs6IHN0YXRpY1ZhbHVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBjb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkodHJhbnNmb3JtOiBUcmFuc2Zvcm0sIGtleTogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdHJhbnNmb3JtW2tleV0gfHwgdHJhbnNmb3JtW2tleV0uYSA9PSAwKSB7XG4gICAgICAgICAgICB0cmFuc2Zvcm1ba2V5XSA9IHtcbiAgICAgICAgICAgICAgICBhOiAxLFxuICAgICAgICAgICAgICAgIGs6IFtdXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBhZGRLZXlmcmFtZSh0cmFuc2Zvcm06IFRyYW5zZm9ybSwga2V5OiBzdHJpbmcsIGlkeDogbnVtYmVyID0gLTEsIHRpbWU6IG51bWJlciwgdmFsdWU6IGFueSkge1xuICAgICAgICBjb25zdCBleGlzdEtleWZyYW1lID0gdHJhbnNmb3JtW2tleV0uay5maWx0ZXIoKHg6IGFueSkgPT4geC50ID09IHRpbWUpIGFzIGFueVtdXG4gICAgICAgIGxldCByZWFkeVRvU2V0O1xuICAgICAgICBpZiAoZXhpc3RLZXlmcmFtZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJlYWR5VG9TZXQgPSBleGlzdEtleWZyYW1lWzBdXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWFkeVRvU2V0ID0ge1xuICAgICAgICAgICAgICAgIHQ6IHRpbWUsXG4gICAgICAgICAgICAgICAgczogdGhpcy5nZXREZWZhdWx0UHJvcGVydHkoa2V5KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcHJldmlvdXNLZXlmcmFtZUNvdW50ID0gdHJhbnNmb3JtW2tleV0uay5yZWR1Y2UoKHA6IG51bWJlciwgeDogYW55KSA9PiB4LnQgPCB0aW1lID8gcCArIDEgOiBwLCAwKVxuICAgICAgICAgICAgdHJhbnNmb3JtW2tleV0uay5zcGxpY2UocHJldmlvdXNLZXlmcmFtZUNvdW50LCAwLCByZWFkeVRvU2V0KVxuICAgICAgICB9XG4gICAgICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgICAgICAgcmVhZHlUb1NldC5zW2lkeF0gPSB2YWx1ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVhZHlUb1NldC5zID0gdmFsdWVcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKHJlZjogU2hhcGVMYXllciB8IFRleHRMYXllciB8IEltYWdlTGF5ZXIpIHtcbiAgICAgICAgdGhpcy5yb290ID0gcmVmXG4gICAgfVxuXG4gICAgc2V0U3RhdGljUHJvcGVydHkoa2V5OiBTZXRhYmxlS2V5cywgdmFsdWU6IGFueSkge1xuICAgICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICAgICAgY2FzZSAnc2NhbGVYJzpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnZlcnRUb1N0YXRpY1Byb3BlcnR5KHRoaXMucm9vdC5rcyEsICdzJylcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3Qua3MhLnMhLmshWzBdID0gdmFsdWVcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnc2NhbGVZJzpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnZlcnRUb1N0YXRpY1Byb3BlcnR5KHRoaXMucm9vdC5rcyEsICdzJylcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3Qua3MhLnMhLmshWzFdID0gdmFsdWVcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnYW5jaG9yWCc6XG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9TdGF0aWNQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAnYScpXG4gICAgICAgICAgICAgICAgdGhpcy5yb290LmtzIS5hIS5rIVswXSA9IHZhbHVlXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ2FuY2hvclknOlxuICAgICAgICAgICAgICAgIHRoaXMuY29udmVydFRvU3RhdGljUHJvcGVydHkodGhpcy5yb290LmtzISwgJ2EnKVxuICAgICAgICAgICAgICAgIHRoaXMucm9vdC5rcyEuYSEuayFbMV0gPSB2YWx1ZVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICd4JzpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnZlcnRUb1N0YXRpY1Byb3BlcnR5KHRoaXMucm9vdC5rcyEsICdwJylcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3Qua3MhLnAhLmshWzBdID0gdmFsdWVcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAneSc6XG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9TdGF0aWNQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAncCcpXG4gICAgICAgICAgICAgICAgdGhpcy5yb290LmtzIS5wIS5rIVsxXSA9IHZhbHVlXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIC8vIGNhc2UgJ3NrZXcnOlxuICAgICAgICAgICAgLy8gICAgIHRoaXMuY29udmVydFRvU3RhdGljUHJvcGVydHkodGhpcy5yb290LmtzISwgJ3MnKVxuICAgICAgICAgICAgLy8gICAgIGJyZWFrXG4gICAgICAgICAgICAvLyBjYXNlICdza2V3QXhpcyc6XG4gICAgICAgICAgICAvLyAgICAgdGhpcy5jb252ZXJ0VG9TdGF0aWNQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAncycpXG4gICAgICAgICAgICAvLyAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3JvdGF0ZSc6XG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9TdGF0aWNQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAncicpXG4gICAgICAgICAgICAgICAgdGhpcy5yb290LmtzIS5yIS5rID0gdmFsdWVcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnb3BhY2l0eSc6XG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9TdGF0aWNQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAnbycpXG4gICAgICAgICAgICAgICAgdGhpcy5yb290LmtzIS5vIS5rID0gdmFsdWVcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGtleSwgdmFsdWUpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgYSB2YWxpZCBrZXkuJylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldEFuaW1hdGFibGVQcm9wZXJ0eShrZXk6IFNldGFibGVLZXlzLCBzdGFydEZyYW1lOiBudW1iZXIsIGVuZEZyYW1lOiBudW1iZXIsIHN0YXJ0VmFsdWU6IGFueSwgZW5kVmFsdWU6IGFueSwgZWFzaW5nPzogRWFzaW5nRnVuY3Rpb24pIHtcbiAgICAgICAgaWYgKGVuZEZyYW1lIDw9IHN0YXJ0RnJhbWUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRW5kIGZyYW1lIHNob3VsZCBiZSBsYXJnZXIgdGhhbiBzdGFydCBmcmFtZS4nKVxuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgIGNhc2UgJ3NjYWxlWCc6XG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkodGhpcy5yb290LmtzISwgJ3MnKVxuICAgICAgICAgICAgICAgIHRoaXMuYWRkS2V5ZnJhbWUodGhpcy5yb290LmtzISwgJ3MnLCAwLCBzdGFydEZyYW1lLCBzdGFydFZhbHVlKVxuICAgICAgICAgICAgICAgIHRoaXMuYWRkS2V5ZnJhbWUodGhpcy5yb290LmtzISwgJ3MnLCAwLCBlbmRGcmFtZSwgZW5kVmFsdWUpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3NjYWxlWSc6XG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkodGhpcy5yb290LmtzISwgJ3MnKVxuICAgICAgICAgICAgICAgIHRoaXMuYWRkS2V5ZnJhbWUodGhpcy5yb290LmtzISwgJ3MnLCAxLCBzdGFydEZyYW1lLCBzdGFydFZhbHVlKVxuICAgICAgICAgICAgICAgIHRoaXMuYWRkS2V5ZnJhbWUodGhpcy5yb290LmtzISwgJ3MnLCAxLCBlbmRGcmFtZSwgZW5kVmFsdWUpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ2FuY2hvclgnOlxuICAgICAgICAgICAgICAgIHRoaXMuY29udmVydFRvQW5pbWF0YWJsZVByb3BlcnR5KHRoaXMucm9vdC5rcyEsICdhJylcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKHRoaXMucm9vdC5rcyEsICdhJywgMCwgc3RhcnRGcmFtZSwgc3RhcnRWYWx1ZSlcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKHRoaXMucm9vdC5rcyEsICdhJywgMCwgZW5kRnJhbWUsIGVuZFZhbHVlKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdhbmNob3JZJzpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnZlcnRUb0FuaW1hdGFibGVQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAnYScpXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRLZXlmcmFtZSh0aGlzLnJvb3Qua3MhLCAnYScsIDEsIHN0YXJ0RnJhbWUsIHN0YXJ0VmFsdWUpXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRLZXlmcmFtZSh0aGlzLnJvb3Qua3MhLCAnYScsIDEsIGVuZEZyYW1lLCBlbmRWYWx1ZSlcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAneCc6XG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkodGhpcy5yb290LmtzISwgJ3AnKVxuICAgICAgICAgICAgICAgIHRoaXMuYWRkS2V5ZnJhbWUodGhpcy5yb290LmtzISwgJ3AnLCAwLCBzdGFydEZyYW1lLCBzdGFydFZhbHVlKVxuICAgICAgICAgICAgICAgIHRoaXMuYWRkS2V5ZnJhbWUodGhpcy5yb290LmtzISwgJ3AnLCAwLCBlbmRGcmFtZSwgZW5kVmFsdWUpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3knOlxuICAgICAgICAgICAgICAgIHRoaXMuY29udmVydFRvQW5pbWF0YWJsZVByb3BlcnR5KHRoaXMucm9vdC5rcyEsICdwJylcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKHRoaXMucm9vdC5rcyEsICdwJywgMSwgc3RhcnRGcmFtZSwgc3RhcnRWYWx1ZSlcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKHRoaXMucm9vdC5rcyEsICdwJywgMSwgZW5kRnJhbWUsIGVuZFZhbHVlKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAvLyBjYXNlICdza2V3JzpcbiAgICAgICAgICAgIC8vICAgICB0aGlzLmNvbnZlcnRUb0FuaW1hdGFibGVQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAncycpXG4gICAgICAgICAgICAvLyAgICAgYnJlYWtcbiAgICAgICAgICAgIC8vIGNhc2UgJ3NrZXdBeGlzJzpcbiAgICAgICAgICAgIC8vICAgICB0aGlzLmNvbnZlcnRUb0FuaW1hdGFibGVQcm9wZXJ0eSh0aGlzLnJvb3Qua3MhLCAncycpXG4gICAgICAgICAgICAvLyAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3JvdGF0ZSc6XG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkodGhpcy5yb290LmtzISwgJ3InKVxuICAgICAgICAgICAgICAgIHRoaXMuYWRkS2V5ZnJhbWUodGhpcy5yb290LmtzISwgJ3InLCAtMSwgc3RhcnRGcmFtZSwgc3RhcnRWYWx1ZSlcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKHRoaXMucm9vdC5rcyEsICdyJywgLTEsIGVuZEZyYW1lLCBlbmRWYWx1ZSlcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnb3BhY2l0eSc6XG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkodGhpcy5yb290LmtzISwgJ28nKVxuICAgICAgICAgICAgICAgIHRoaXMuYWRkS2V5ZnJhbWUodGhpcy5yb290LmtzISwgJ28nLCAtMSwgc3RhcnRGcmFtZSwgc3RhcnRWYWx1ZSlcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKHRoaXMucm9vdC5rcyEsICdvJywgLTEsIGVuZEZyYW1lLCBlbmRWYWx1ZSlcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGtleSwgc3RhcnRGcmFtZSwgZW5kRnJhbWUsIHN0YXJ0VmFsdWUsIGVuZFZhbHVlLCBlYXNpbmcpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgYSB2YWxpZCBrZXkuJylcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIExheWVyRmFjdG9yeSB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2VuZXJhdGVUcmFuc2Zvcm0oY29vcmRpbmF0ZTogbnVtYmVyW10pOiBUcmFuc2Zvcm0ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbzoge1xuICAgICAgICAgICAgICAgIGE6IDAsXG4gICAgICAgICAgICAgICAgazogMTAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcjoge1xuICAgICAgICAgICAgICAgIGE6IDAsXG4gICAgICAgICAgICAgICAgazogMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHA6IHtcbiAgICAgICAgICAgICAgICBhOiAwLFxuICAgICAgICAgICAgICAgIGs6IFtcbiAgICAgICAgICAgICAgICAgICAgY29vcmRpbmF0ZVswXSxcbiAgICAgICAgICAgICAgICAgICAgY29vcmRpbmF0ZVsxXSxcbiAgICAgICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhOiB7XG4gICAgICAgICAgICAgICAgYTogMCxcbiAgICAgICAgICAgICAgICBrOiBbXG4gICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgIDBcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgczoge1xuICAgICAgICAgICAgICAgIGE6IDAsXG4gICAgICAgICAgICAgICAgazogW1xuICAgICAgICAgICAgICAgICAgICAxMDAsXG4gICAgICAgICAgICAgICAgICAgIDEwMCxcbiAgICAgICAgICAgICAgICAgICAgMTAwXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0Qm91bmRpbmdCb3goZG9tOiBTVkdHcmFwaGljc0VsZW1lbnQpIHtcbiAgICAgICAgbGV0IHN2Z1Jvb3Q6IFNWR0VsZW1lbnQgPSBkb21cbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIGlmIChzdmdSb290LnBhcmVudEVsZW1lbnQgaW5zdGFuY2VvZiBTVkdHcmFwaGljc0VsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBzdmdSb290ID0gc3ZnUm9vdC5wYXJlbnRFbGVtZW50XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgcm9vdEJCb3ggPSBzdmdSb290LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgIGNvbnN0IHJlZkJCb3ggPSBkb20uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICAgY29uc3QgY29vcmRpbmF0ZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbcmVmQkJveC5sZWZ0IC0gcm9vdEJCb3gubGVmdCwgcmVmQkJveC50b3AgLSByb290QkJveC50b3AsIHJlZkJCb3gud2lkdGggKyAxLCByZWZCQm94LmhlaWdodCArIDFdXG4gICAgICAgIHJldHVybiBjb29yZGluYXRlXG4gICAgfVxuXG4gICAgc3RhdGljIGJvdW5kaW5nQm94KGRvbTogU1ZHR3JhcGhpY3NFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IGNvb3JkaW5hdGUgPSB0aGlzLmdldEJvdW5kaW5nQm94KGRvbSlcbiAgICAgICAgcmV0dXJuIHRoaXMucmVjdCguLi5jb29yZGluYXRlKVxuICAgIH1cblxuICAgIHN0YXRpYyBzaGFwZShkb206IFNWR1BhdGhFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IGNvb3JkaW5hdGUgPSB0aGlzLmdldEJvdW5kaW5nQm94KGRvbSlcbiAgICAgICAgY29uc3QgbGF5ZXI6IFNoYXBlTGF5ZXIgPSB7XG4gICAgICAgICAgICB0eTogNCxcbiAgICAgICAgICAgIGRkZDogMCxcbiAgICAgICAgICAgIHNyOiAxLFxuICAgICAgICAgICAgYW86IDAsXG4gICAgICAgICAgICBrczogdGhpcy5nZW5lcmF0ZVRyYW5zZm9ybShjb29yZGluYXRlKSxcbiAgICAgICAgICAgIGlwOiAwLFxuICAgICAgICAgICAgb3A6IDEsXG4gICAgICAgICAgICBzdDogMCxcbiAgICAgICAgICAgIGJtOiAwLFxuICAgICAgICAgICAgc2hhcGVzOiBbXG4gICAgICAgICAgICAgICAgcmVuZGVyKGRvbSlcbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEpTTW92aW5MYXllcihsYXllcilcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVjdChsZWZ0OiBudW1iZXIsIHRvcDogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xuXG4gICAgfVxuXG4gICAgc3RhdGljIGVsbGlwc2UoY3g6IG51bWJlciwgY3k6IG51bWJlciwgcng6IG51bWJlciwgcnk6IG51bWJlciwgcm90YXRlOiBudW1iZXIpIHtcblxuICAgIH1cblxuICAgIHN0YXRpYyBoaWVyYXJjaHkoZG9tOiBTVkdHcmFwaGljc0VsZW1lbnQsIGFzc2V0TGlzdDogQXNzZXRzLCBmb250TGlzdDogRm9udHMpIHtcbiAgICAgICAgY29uc3QgY29vcmRpbmF0ZSA9IHRoaXMuZ2V0Qm91bmRpbmdCb3goZG9tKVxuICAgICAgICBsZXQgZG9tVHlwZTogMiB8IDQgfCA1O1xuICAgICAgICBpZiAoZG9tIGluc3RhbmNlb2YgU1ZHVGV4dEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGRvbVR5cGUgPSA1XG4gICAgICAgIH0gZWxzZSBpZiAoZG9tIGluc3RhbmNlb2YgU1ZHSW1hZ2VFbGVtZW50KSB7XG4gICAgICAgICAgICBkb21UeXBlID0gMlxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG9tVHlwZSA9IDRcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsYXllcjogU2hhcGVMYXllciB8IEltYWdlTGF5ZXIgfCBUZXh0TGF5ZXIgPSB7XG4gICAgICAgICAgICB0eTogZG9tVHlwZSxcbiAgICAgICAgICAgIGRkZDogMCxcbiAgICAgICAgICAgIHNyOiAxLFxuICAgICAgICAgICAgYW86IDAsXG4gICAgICAgICAgICBrczogdGhpcy5nZW5lcmF0ZVRyYW5zZm9ybShjb29yZGluYXRlKSxcbiAgICAgICAgICAgIGlwOiAwLFxuICAgICAgICAgICAgb3A6IDEsXG4gICAgICAgICAgICBzdDogMCxcbiAgICAgICAgICAgIGJtOiAwXG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoIChkb21UeXBlKSB7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgaWYgKGFzc2V0TGlzdCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbWFnZUxheWVyID0gbGF5ZXIgYXMgSW1hZ2VMYXllclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBbcmVmSWQsIGFzc2V0XSA9IHJlbmRlckltYWdlKGRvbSBhcyBTVkdJbWFnZUVsZW1lbnQpXG4gICAgICAgICAgICAgICAgICAgIGltYWdlTGF5ZXIucmVmSWQgPSByZWZJZFxuICAgICAgICAgICAgICAgICAgICBhc3NldExpc3QucHVzaChhc3NldClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICBjb25zdCBzaGFwZUxheWVyID0gbGF5ZXIgYXMgU2hhcGVMYXllclxuICAgICAgICAgICAgICAgIHNoYXBlTGF5ZXIuc2hhcGVzID0gW11cbiAgICAgICAgICAgICAgICBzaGFwZUxheWVyLnNoYXBlcy5wdXNoKHJlbmRlcihkb20pKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dExheWVyID0gbGF5ZXIgYXMgVGV4dExheWVyXG4gICAgICAgICAgICAgICAgY29uc3QgW3RleHREYXRhLCBmb250XSA9IHJlbmRlclRleHQoZG9tIGFzIFNWR1RleHRFbGVtZW50KVxuICAgICAgICAgICAgICAgIHRleHRMYXllci50ID0gdGV4dERhdGFcbiAgICAgICAgICAgICAgICBmb250TGlzdC5saXN0IS5wdXNoKGZvbnQpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1vdmluTGF5ZXIgPSBuZXcgSlNNb3ZpbkxheWVyKGxheWVyKVxuICAgICAgICByZXR1cm4gbW92aW5MYXllclxuICAgIH1cbn0iXX0=