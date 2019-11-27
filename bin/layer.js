"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LayerFactory = exports.JSMovinLayer = void 0;

var _easing = require("./easing");

var _render = require("./render");

var _helper = require("./helper");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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

        case 'tm':
          return {
            s: {
              k: [0]
            },
            e: {
              k: [100]
            },
            o: {
              k: [0]
            }
          };

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
  }, {
    key: "findPropertyConfig",
    value: function findPropertyConfig(key) {
      return this.root.shapes[0].it.find(function (shape) {
        return shape.ty == key;
      });
    }
  }, {
    key: "findOrInsertPropertyConfig",
    value: function findOrInsertPropertyConfig(key) {
      var find = this.findPropertyConfig(key);
      if (find) return find;
      var hasTransform = this.findPropertyConfig('tr');

      if (hasTransform) {
        var groupShapes = this.root.shapes[0].it;
        groupShapes.splice(groupShapes.length - 1, 0, _objectSpread({
          ty: key
        }, this.getDefaultProperty(key)));
      } else {
        this.root.shapes[0].it.push(_objectSpread({
          ty: key
        }, this.getDefaultProperty(key)));
      }
    }
  }, {
    key: "commonPropertyMapping",
    value: function commonPropertyMapping(key) {
      var base, k, index;

      switch (key) {
        case 'scaleX':
          base = this.root.ks;
          k = 's';
          index = 0;
          break;

        case 'scaleY':
          base = this.root.ks;
          k = 's';
          index = 1;
          break;

        case 'anchorX':
          base = this.root.ks;
          k = 'a';
          index = 0;
          break;

        case 'anchorY':
          base = this.root.ks;
          k = 'a';
          index = 1;
          break;

        case 'x':
          base = this.root.ks;
          k = 'p';
          index = 0;
          break;

        case 'y':
          base = this.root.ks;
          k = 'p';
          index = 1;
          break;

        case 'rotate':
          base = this.root.ks;
          k = 'r';
          index = -1;
          break;

        case 'opacity':
          base = this.root.ks;
          k = 'o';
          index = -1;
          break;

        case 'trimStart':
          base = this.findOrInsertPropertyConfig('tm');
          k = 's';
          index = -1;
          break;

        case 'trimEnd':
          base = this.findOrInsertPropertyConfig('tm');
          k = 'e';
          index = -1;
          break;

        case 'trimOffset':
          base = this.findOrInsertPropertyConfig('tm');
          k = 'o';
          index = -1;
          break;

        case 'fillColor':
          base = this.findOrInsertPropertyConfig('fl');
          k = 'c';
          index = -1;
          break;

        case 'strokeColor':
          base = this.findOrInsertPropertyConfig('st');
          k = 'c';
          index = -1;
          break;

        case 'strokeWidth':
          base = this.findOrInsertPropertyConfig('st');
          k = 'w';
          index = -1;
          break;

        case 'shape':
          base = this.findOrInsertPropertyConfig('sh');
          k = 'ks';
          index = -1;
          break;
      }

      return [base, k, index];
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
      var base, k, index;

      var _this$commonPropertyM = this.commonPropertyMapping(key);

      var _this$commonPropertyM2 = _slicedToArray(_this$commonPropertyM, 3);

      base = _this$commonPropertyM2[0];
      k = _this$commonPropertyM2[1];
      index = _this$commonPropertyM2[2];

      if (!base || !k || index === undefined) {
        switch (key) {
          case 'text':
            if (this.root.ty == 5) {
              var doc = this.root.t.d;
              doc.k = [doc.k[0]];
              doc.k[0].t = 0;
              doc.k[0].s.t = value;
            }

            break;

          default:
            console.error(key, value);
            throw new Error('Not a valid key.');
        }
      }

      if (base && k && index !== undefined) {
        this.convertToStaticProperty(base, k);
        base[k].k[index] = value;
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

      var base, k, index;

      var _this$commonPropertyM3 = this.commonPropertyMapping(key);

      var _this$commonPropertyM4 = _slicedToArray(_this$commonPropertyM3, 3);

      base = _this$commonPropertyM4[0];
      k = _this$commonPropertyM4[1];
      index = _this$commonPropertyM4[2];

      if (!base || !k || index === undefined) {
        switch (key) {
          case 'text':
            if (this.root.ty == 5) {
              base = this.root.t.d;
              var textProp = base.k[0].s;
              var tmpStartValue = JSON.parse(JSON.stringify(textProp));
              var tmpEndValue = JSON.parse(JSON.stringify(textProp));
              tmpStartValue.t = startValue;
              tmpEndValue.t = endValue;
              startValue = tmpStartValue;
              endValue = tmpEndValue;
              k = 'k';
              index = -1;
            }

            break;

          default:
            console.error(key, startFrame, endFrame, startValue, endValue, easing);
            throw new Error('Not a valid key.');
        }
      }

      if (base && k && index !== undefined) {
        this.convertToAnimatableProperty(base, k);
        this.addKeyframe(base, k, index, startFrame, startValue, easing);
        this.addKeyframe(base, k, index, endFrame, endValue);
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
    key: "boundingBox",
    value: function boundingBox(dom) {
      return this.rect.apply(this, _toConsumableArray((0, _helper.getBoundingBox)(dom)));
    }
  }, {
    key: "shape",
    value: function shape(dom) {
      var coordinate = (0, _helper.getBoundingBox)(dom);
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
        shapes: (0, _render.render)(dom)
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
      var coordinate = (0, _helper.getBoundingBox)(dom);
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
          shapeLayer.shapes = (0, _render.render)(dom);
          break;

        case 5:
          var textLayer = layer; // move textLayer's anchor to left-top

          textLayer.ks.a.k = [0, -coordinate[3], 0];

          var _renderText = (0, _render.renderText)(dom, fontList),
              _renderText2 = _slicedToArray(_renderText, 2),
              textData = _renderText2[0],
              font = _renderText2[1];

          textLayer.t = textData;
          if (!fontList.list.filter(function (f) {
            return f.fName == font.fName;
          }).length) fontList.list.push(font);
          break;
      }

      var movinLayer = new JSMovinLayer(layer);
      return movinLayer;
    }
    /**
     * Render a DOM that may be the mixture of text, images and other glyphs
     * 
     * The rendering order is fixed: glyphs(bottom) - images - text(top)
     * @param dom SVG DOM
     * @param assetList reference of assets
     * @param fontList reference of fonts
     */

  }, {
    key: "hierarchyAll",
    value: function hierarchyAll(dom, assetList, fontList) {
      var _this = this;

      if (dom instanceof SVGTextElement || dom instanceof SVGImageElement) {
        return [this.hierarchy(dom, assetList, fontList)];
      } else {
        var results = [this.hierarchy(dom, assetList, fontList)];
        dom.querySelectorAll('image').forEach(function (dom) {
          return results.unshift(_this.hierarchy(dom, assetList, fontList));
        });
        dom.querySelectorAll('text').forEach(function (dom) {
          return results.unshift(_this.hierarchy(dom, assetList, fontList));
        });
        return results;
      }
    }
  }]);

  return LayerFactory;
}();

exports.LayerFactory = LayerFactory;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sYXllci50cyJdLCJuYW1lcyI6WyJKU01vdmluTGF5ZXIiLCJrZXkiLCJzIiwiayIsImUiLCJvIiwidHJhbnNmb3JtIiwiYSIsImdldERlZmF1bHRQcm9wZXJ0eSIsInN0YXRpY1ZhbHVlIiwiaWR4IiwidGltZSIsInZhbHVlIiwiZWFzaW5nIiwiZXhpc3RLZXlmcmFtZSIsImZpbHRlciIsIngiLCJ0IiwicmVhZHlUb1NldCIsImxlbmd0aCIsInByZXZpb3VzS2V5ZnJhbWVDb3VudCIsInJlZHVjZSIsInAiLCJzcGxpY2UiLCJ5IiwiaSIsInJvb3QiLCJzaGFwZXMiLCJpdCIsImZpbmQiLCJzaGFwZSIsInR5IiwiZmluZFByb3BlcnR5Q29uZmlnIiwiaGFzVHJhbnNmb3JtIiwiZ3JvdXBTaGFwZXMiLCJwdXNoIiwiYmFzZSIsImluZGV4Iiwia3MiLCJmaW5kT3JJbnNlcnRQcm9wZXJ0eUNvbmZpZyIsInJlZiIsIm9wIiwiY29tbW9uUHJvcGVydHlNYXBwaW5nIiwidW5kZWZpbmVkIiwiZG9jIiwiZCIsImNvbnNvbGUiLCJlcnJvciIsIkVycm9yIiwiY29udmVydFRvU3RhdGljUHJvcGVydHkiLCJzdGFydEZyYW1lIiwiZW5kRnJhbWUiLCJzdGFydFZhbHVlIiwiZW5kVmFsdWUiLCJFYXNpbmdGYWN0b3J5IiwibGluZWFyIiwidGV4dFByb3AiLCJ0bXBTdGFydFZhbHVlIiwiSlNPTiIsInBhcnNlIiwic3RyaW5naWZ5IiwidG1wRW5kVmFsdWUiLCJjb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkiLCJhZGRLZXlmcmFtZSIsIkxheWVyRmFjdG9yeSIsImNvb3JkaW5hdGUiLCJyIiwiZG9tIiwicmVjdCIsImxheWVyIiwiZGRkIiwic3IiLCJhbyIsImdlbmVyYXRlVHJhbnNmb3JtIiwiaXAiLCJzdCIsImJtIiwibGVmdCIsInRvcCIsIndpZHRoIiwiaGVpZ2h0IiwiY3giLCJjeSIsInJ4IiwicnkiLCJhc3NldExpc3QiLCJmb250TGlzdCIsImRvbVR5cGUiLCJTVkdUZXh0RWxlbWVudCIsIlNWR0ltYWdlRWxlbWVudCIsImltYWdlTGF5ZXIiLCJyZWZJZCIsImFzc2V0Iiwic2hhcGVMYXllciIsInRleHRMYXllciIsInRleHREYXRhIiwiZm9udCIsImxpc3QiLCJmIiwiZk5hbWUiLCJtb3ZpbkxheWVyIiwiaGllcmFyY2h5IiwicmVzdWx0cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmb3JFYWNoIiwidW5zaGlmdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFJYUEsWTs7Ozs7dUNBRWtCQyxHLEVBQWE7QUFDcEMsY0FBUUEsR0FBUjtBQUNJLGFBQUssR0FBTDtBQUNBLGFBQUssR0FBTDtBQUNJLGlCQUFPLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLENBQVA7O0FBQ0osYUFBSyxHQUFMO0FBQ0ksaUJBQU8sQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEdBQVgsQ0FBUDs7QUFDSixhQUFLLEdBQUw7QUFDSSxpQkFBTyxHQUFQOztBQUNKLGFBQUssR0FBTDtBQUNJLGlCQUFPLENBQVA7O0FBQ0osYUFBSyxJQUFMO0FBQ0ksaUJBQU87QUFDSEMsWUFBQUEsQ0FBQyxFQUFFO0FBQ0NDLGNBQUFBLENBQUMsRUFBRSxDQUFDLENBQUQ7QUFESixhQURBO0FBSUhDLFlBQUFBLENBQUMsRUFBRTtBQUNDRCxjQUFBQSxDQUFDLEVBQUUsQ0FBQyxHQUFEO0FBREosYUFKQTtBQU9IRSxZQUFBQSxDQUFDLEVBQUU7QUFDQ0YsY0FBQUEsQ0FBQyxFQUFFLENBQUMsQ0FBRDtBQURKO0FBUEEsV0FBUDs7QUFXSjtBQUNJLGlCQUFPLENBQVA7QUF2QlI7QUF5Qkg7Ozs0Q0FDK0JHLFMsRUFBZ0JMLEcsRUFBYTtBQUN6RCxVQUFJLENBQUNLLFNBQVMsQ0FBQ0wsR0FBRCxDQUFkLEVBQXFCO0FBQ2pCSyxRQUFBQSxTQUFTLENBQUNMLEdBQUQsQ0FBVCxHQUFpQjtBQUNiTSxVQUFBQSxD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aGFwZUxheWVyLCBUZXh0TGF5ZXIsIEltYWdlTGF5ZXIsIFRyYW5zZm9ybSwgQXNzZXRzLCBGb250cywgR3JvdXBTaGFwZSwgRmlsbFNoYXBlLCBTdHJva2VTaGFwZSwgUGF0aFNoYXBlIH0gZnJvbSAnLi9hbmltYXRpb24nXG5pbXBvcnQgeyBFYXNpbmdGdW5jdGlvbiwgRWFzaW5nRmFjdG9yeSB9IGZyb20gJy4vZWFzaW5nJ1xuaW1wb3J0IHsgcmVuZGVyVGV4dCwgcmVuZGVyLCByZW5kZXJJbWFnZSwgcmVuZGVyUGxhaW5HbHlwaCB9IGZyb20gJy4vcmVuZGVyJztcbmltcG9ydCB7IGdldEJvdW5kaW5nQm94IH0gZnJvbSAnLi9oZWxwZXInXG5cbnR5cGUgU2V0YWJsZUtleXMgPSBcInNjYWxlWFwiIHwgXCJzY2FsZVlcIiB8IFwiYW5jaG9yWFwiIHwgXCJhbmNob3JZXCIgfCBcInhcIiB8IFwieVwiIHwgXCJyb3RhdGVcIiB8IFwib3BhY2l0eVwiIHwgJ3NoYXBlJyB8ICdmaWxsQ29sb3InIHwgJ3RyaW1TdGFydCcgfCAndHJpbUVuZCcgfCAndHJpbU9mZnNldCcgfCAnc3Ryb2tlQ29sb3InIHwgJ3N0cm9rZVdpZHRoJyB8ICd0ZXh0J1xuXG5leHBvcnQgY2xhc3MgSlNNb3ZpbkxheWVyIHtcbiAgICBwdWJsaWMgcmVhZG9ubHkgcm9vdDogU2hhcGVMYXllciB8IFRleHRMYXllciB8IEltYWdlTGF5ZXI7XG4gICAgcHJpdmF0ZSBnZXREZWZhdWx0UHJvcGVydHkoa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgIGNhc2UgJ2EnOlxuICAgICAgICAgICAgY2FzZSAncCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFswLCAwLCAwXVxuICAgICAgICAgICAgY2FzZSAncyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsxMDAsIDEwMCwgMTAwXVxuICAgICAgICAgICAgY2FzZSAnbyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIDEwMFxuICAgICAgICAgICAgY2FzZSAncic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIDBcbiAgICAgICAgICAgIGNhc2UgJ3RtJzpcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrOiBbMF1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgazogWzEwMF1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgazogWzBdXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiAwXG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBjb252ZXJ0VG9TdGF0aWNQcm9wZXJ0eSh0cmFuc2Zvcm06IGFueSwga2V5OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0cmFuc2Zvcm1ba2V5XSkge1xuICAgICAgICAgICAgdHJhbnNmb3JtW2tleV0gPSB7XG4gICAgICAgICAgICAgICAgYTogMCxcbiAgICAgICAgICAgICAgICBrOiB0aGlzLmdldERlZmF1bHRQcm9wZXJ0eShrZXkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRyYW5zZm9ybVtrZXldLmEgPT0gMSkge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGljVmFsdWUgPSB0cmFuc2Zvcm1ba2V5XS5rWzBdLnNcbiAgICAgICAgICAgIHRyYW5zZm9ybVtrZXldID0ge1xuICAgICAgICAgICAgICAgIGE6IDAsXG4gICAgICAgICAgICAgICAgazogc3RhdGljVmFsdWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGNvbnZlcnRUb0FuaW1hdGFibGVQcm9wZXJ0eSh0cmFuc2Zvcm06IGFueSwga2V5OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0cmFuc2Zvcm1ba2V5XSB8fCB0cmFuc2Zvcm1ba2V5XS5hID09IDApIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybVtrZXldID0ge1xuICAgICAgICAgICAgICAgIGE6IDEsXG4gICAgICAgICAgICAgICAgazogW11cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGFkZEtleWZyYW1lKHRyYW5zZm9ybTogYW55LCBrZXk6IHN0cmluZywgaWR4OiBudW1iZXIgPSAtMSwgdGltZTogbnVtYmVyLCB2YWx1ZTogQXJyYXk8YW55PiwgZWFzaW5nPzogRWFzaW5nRnVuY3Rpb24pIHtcbiAgICAgICAgY29uc3QgZXhpc3RLZXlmcmFtZSA9IHRyYW5zZm9ybVtrZXldLmsuZmlsdGVyKCh4OiBhbnkpID0+IHgudCA9PSB0aW1lKSBhcyBhbnlbXVxuICAgICAgICBsZXQgcmVhZHlUb1NldDtcbiAgICAgICAgaWYgKGV4aXN0S2V5ZnJhbWUubGVuZ3RoKSB7XG4gICAgICAgICAgICByZWFkeVRvU2V0ID0gZXhpc3RLZXlmcmFtZVswXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVhZHlUb1NldCA9IHtcbiAgICAgICAgICAgICAgICB0OiB0aW1lLFxuICAgICAgICAgICAgICAgIHM6IHRoaXMuZ2V0RGVmYXVsdFByb3BlcnR5KGtleSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzS2V5ZnJhbWVDb3VudCA9IHRyYW5zZm9ybVtrZXldLmsucmVkdWNlKChwOiBudW1iZXIsIHg6IGFueSkgPT4geC50IDwgdGltZSA/IHAgKyAxIDogcCwgMClcbiAgICAgICAgICAgIHRyYW5zZm9ybVtrZXldLmsuc3BsaWNlKHByZXZpb3VzS2V5ZnJhbWVDb3VudCwgMCwgcmVhZHlUb1NldClcbiAgICAgICAgfVxuICAgICAgICBpZiAoZWFzaW5nKSB7XG4gICAgICAgICAgICByZWFkeVRvU2V0Lm8gPSB7XG4gICAgICAgICAgICAgICAgeDogZWFzaW5nWzBdWzBdLFxuICAgICAgICAgICAgICAgIHk6IGVhc2luZ1swXVsxXVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVhZHlUb1NldC5pID0ge1xuICAgICAgICAgICAgICAgIHg6IGVhc2luZ1sxXVswXSxcbiAgICAgICAgICAgICAgICB5OiBlYXNpbmdbMV1bMV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgICAgIHJlYWR5VG9TZXQuc1tpZHhdID0gdmFsdWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlYWR5VG9TZXQucyA9IFt2YWx1ZV1cbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGZpbmRQcm9wZXJ0eUNvbmZpZyhrZXk6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gKCh0aGlzLnJvb3QgYXMgU2hhcGVMYXllcikuc2hhcGVzIVswXSBhcyBHcm91cFNoYXBlKS5pdCEuZmluZChzaGFwZSA9PlxuICAgICAgICAgICAgc2hhcGUudHkgPT0ga2V5XG4gICAgICAgIClcbiAgICB9XG4gICAgcHJpdmF0ZSBmaW5kT3JJbnNlcnRQcm9wZXJ0eUNvbmZpZyhrZXk6IHN0cmluZykge1xuICAgICAgICBjb25zdCBmaW5kID0gdGhpcy5maW5kUHJvcGVydHlDb25maWcoa2V5KVxuICAgICAgICBpZiAoZmluZCkgcmV0dXJuIGZpbmRcbiAgICAgICAgY29uc3QgaGFzVHJhbnNmb3JtID0gdGhpcy5maW5kUHJvcGVydHlDb25maWcoJ3RyJylcbiAgICAgICAgaWYgKGhhc1RyYW5zZm9ybSkge1xuICAgICAgICAgICAgY29uc3QgZ3JvdXBTaGFwZXMgPSAoKHRoaXMucm9vdCBhcyBTaGFwZUxheWVyKS5zaGFwZXMhWzBdIGFzIEdyb3VwU2hhcGUpLml0IVxuICAgICAgICAgICAgZ3JvdXBTaGFwZXMuc3BsaWNlKGdyb3VwU2hhcGVzLmxlbmd0aCAtIDEsIDAsIHtcbiAgICAgICAgICAgICAgICB0eToga2V5LFxuICAgICAgICAgICAgICAgIC4uLnRoaXMuZ2V0RGVmYXVsdFByb3BlcnR5KGtleSkgYXMgb2JqZWN0XG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgKCh0aGlzLnJvb3QgYXMgU2hhcGVMYXllcikuc2hhcGVzIVswXSBhcyBHcm91cFNoYXBlKS5pdCEucHVzaCh7XG4gICAgICAgICAgICAgICAgdHk6IGtleSxcbiAgICAgICAgICAgICAgICAuLi50aGlzLmdldERlZmF1bHRQcm9wZXJ0eShrZXkpIGFzIG9iamVjdFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGNvbW1vblByb3BlcnR5TWFwcGluZyhrZXk6IFNldGFibGVLZXlzKTogW2FueSwgc3RyaW5nIHwgdW5kZWZpbmVkLCBudW1iZXIgfCB1bmRlZmluZWRdIHtcbiAgICAgICAgbGV0IGJhc2U6IGFueSwgazogc3RyaW5nIHwgdW5kZWZpbmVkLCBpbmRleDogbnVtYmVyIHwgdW5kZWZpbmVkXG4gICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgICAgICBjYXNlICdzY2FsZVgnOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLnJvb3Qua3NcbiAgICAgICAgICAgICAgICBrID0gJ3MnXG4gICAgICAgICAgICAgICAgaW5kZXggPSAwXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3NjYWxlWSc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMucm9vdC5rc1xuICAgICAgICAgICAgICAgIGsgPSAncydcbiAgICAgICAgICAgICAgICBpbmRleCA9IDFcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnYW5jaG9yWCc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMucm9vdC5rc1xuICAgICAgICAgICAgICAgIGsgPSAnYSdcbiAgICAgICAgICAgICAgICBpbmRleCA9IDBcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnYW5jaG9yWSc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMucm9vdC5rc1xuICAgICAgICAgICAgICAgIGsgPSAnYSdcbiAgICAgICAgICAgICAgICBpbmRleCA9IDFcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAneCc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMucm9vdC5rc1xuICAgICAgICAgICAgICAgIGsgPSAncCdcbiAgICAgICAgICAgICAgICBpbmRleCA9IDBcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAneSc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMucm9vdC5rc1xuICAgICAgICAgICAgICAgIGsgPSAncCdcbiAgICAgICAgICAgICAgICBpbmRleCA9IDFcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAncm90YXRlJzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXG4gICAgICAgICAgICAgICAgayA9ICdyJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnb3BhY2l0eSc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMucm9vdC5rc1xuICAgICAgICAgICAgICAgIGsgPSAnbydcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3RyaW1TdGFydCc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZE9ySW5zZXJ0UHJvcGVydHlDb25maWcoJ3RtJylcbiAgICAgICAgICAgICAgICBrID0gJ3MnXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICd0cmltRW5kJzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kT3JJbnNlcnRQcm9wZXJ0eUNvbmZpZygndG0nKVxuICAgICAgICAgICAgICAgIGsgPSAnZSdcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3RyaW1PZmZzZXQnOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLmZpbmRPckluc2VydFByb3BlcnR5Q29uZmlnKCd0bScpXG4gICAgICAgICAgICAgICAgayA9ICdvJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnZmlsbENvbG9yJzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kT3JJbnNlcnRQcm9wZXJ0eUNvbmZpZygnZmwnKVxuICAgICAgICAgICAgICAgIGsgPSAnYydcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3N0cm9rZUNvbG9yJzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kT3JJbnNlcnRQcm9wZXJ0eUNvbmZpZygnc3QnKVxuICAgICAgICAgICAgICAgIGsgPSAnYydcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3N0cm9rZVdpZHRoJzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kT3JJbnNlcnRQcm9wZXJ0eUNvbmZpZygnc3QnKVxuICAgICAgICAgICAgICAgIGsgPSAndydcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3NoYXBlJzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kT3JJbnNlcnRQcm9wZXJ0eUNvbmZpZygnc2gnKVxuICAgICAgICAgICAgICAgIGsgPSAna3MnXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtiYXNlLCBrLCBpbmRleF1cbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihyZWY6IFNoYXBlTGF5ZXIgfCBUZXh0TGF5ZXIgfCBJbWFnZUxheWVyKSB7XG4gICAgICAgIHRoaXMucm9vdCA9IHJlZlxuICAgIH1cblxuICAgIHNldFN0YXRpY1Byb3BlcnR5KGtleTogU2V0YWJsZUtleXMsIHZhbHVlOiBhbnkpIHtcbiAgICAgICAgdGhpcy5yb290Lm9wID0gMVxuICAgICAgICBsZXQgYmFzZTogYW55LCBrOiBzdHJpbmcgfCB1bmRlZmluZWQsIGluZGV4OiBudW1iZXIgfCB1bmRlZmluZWRcbiAgICAgICAgW2Jhc2UsIGssIGluZGV4XSA9IHRoaXMuY29tbW9uUHJvcGVydHlNYXBwaW5nKGtleSlcbiAgICAgICAgaWYgKCFiYXNlIHx8ICFrIHx8IGluZGV4ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgICAgICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnJvb3QudHkgPT0gNSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZG9jID0gdGhpcy5yb290LnQhLmQhXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2MuayA9IFtkb2MuayFbMF1dXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2Mua1swXS50ID0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jLmtbMF0ucyEudCA9IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGtleSwgdmFsdWUpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGEgdmFsaWQga2V5LicpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJhc2UgJiYgayAmJiBpbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnZlcnRUb1N0YXRpY1Byb3BlcnR5KGJhc2UsIGspXG4gICAgICAgICAgICBiYXNlW2tdLmtbaW5kZXhdID0gdmFsdWVcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldEFuaW1hdGFibGVQcm9wZXJ0eShrZXk6IFNldGFibGVLZXlzLCBzdGFydEZyYW1lOiBudW1iZXIsIGVuZEZyYW1lOiBudW1iZXIsIHN0YXJ0VmFsdWU6IGFueSwgZW5kVmFsdWU6IGFueSwgZWFzaW5nPzogRWFzaW5nRnVuY3Rpb24pIHtcbiAgICAgICAgaWYgKGVuZEZyYW1lIDw9IHN0YXJ0RnJhbWUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRW5kIGZyYW1lIHNob3VsZCBiZSBsYXJnZXIgdGhhbiBzdGFydCBmcmFtZS4nKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucm9vdC5vcCA9IGVuZEZyYW1lXG4gICAgICAgIGlmICghZWFzaW5nKSB7XG4gICAgICAgICAgICBlYXNpbmcgPSBFYXNpbmdGYWN0b3J5LmxpbmVhcigpXG4gICAgICAgIH1cbiAgICAgICAgbGV0IGJhc2U6IGFueSwgazogc3RyaW5nIHwgdW5kZWZpbmVkLCBpbmRleDogbnVtYmVyIHwgdW5kZWZpbmVkXG4gICAgICAgIFtiYXNlLCBrLCBpbmRleF0gPSB0aGlzLmNvbW1vblByb3BlcnR5TWFwcGluZyhrZXkpXG4gICAgICAgIGlmICghYmFzZSB8fCAhayB8fCBpbmRleCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5yb290LnR5ID09IDUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLnJvb3QudCEuZFxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRleHRQcm9wID0gYmFzZS5rWzBdLnNcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0bXBTdGFydFZhbHVlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0ZXh0UHJvcCkpXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdG1wRW5kVmFsdWUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRleHRQcm9wKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRtcFN0YXJ0VmFsdWUudCA9IHN0YXJ0VmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIHRtcEVuZFZhbHVlLnQgPSBlbmRWYWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZSA9IHRtcFN0YXJ0VmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlID0gdG1wRW5kVmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGsgPSAnaydcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3Ioa2V5LCBzdGFydEZyYW1lLCBlbmRGcmFtZSwgc3RhcnRWYWx1ZSwgZW5kVmFsdWUsIGVhc2luZylcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgYSB2YWxpZCBrZXkuJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoYmFzZSAmJiBrICYmIGluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY29udmVydFRvQW5pbWF0YWJsZVByb3BlcnR5KGJhc2UsIGspXG4gICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKGJhc2UsIGssIGluZGV4LCBzdGFydEZyYW1lLCBzdGFydFZhbHVlLCBlYXNpbmcpXG4gICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKGJhc2UsIGssIGluZGV4LCBlbmRGcmFtZSwgZW5kVmFsdWUpXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMYXllckZhY3Rvcnkge1xuICAgIHByaXZhdGUgc3RhdGljIGdlbmVyYXRlVHJhbnNmb3JtKGNvb3JkaW5hdGU6IG51bWJlcltdKTogVHJhbnNmb3JtIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG86IHtcbiAgICAgICAgICAgICAgICBhOiAwLFxuICAgICAgICAgICAgICAgIGs6IDEwMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHI6IHtcbiAgICAgICAgICAgICAgICBhOiAwLFxuICAgICAgICAgICAgICAgIGs6IDBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwOiB7XG4gICAgICAgICAgICAgICAgYTogMCxcbiAgICAgICAgICAgICAgICBrOiBbXG4gICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVbMF0sXG4gICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVbMV0sXG4gICAgICAgICAgICAgICAgICAgIDBcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYToge1xuICAgICAgICAgICAgICAgIGE6IDAsXG4gICAgICAgICAgICAgICAgazogW1xuICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHM6IHtcbiAgICAgICAgICAgICAgICBhOiAwLFxuICAgICAgICAgICAgICAgIGs6IFtcbiAgICAgICAgICAgICAgICAgICAgMTAwLFxuICAgICAgICAgICAgICAgICAgICAxMDAsXG4gICAgICAgICAgICAgICAgICAgIDEwMFxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBib3VuZGluZ0JveChkb206IFNWR0dyYXBoaWNzRWxlbWVudCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWN0KC4uLmdldEJvdW5kaW5nQm94KGRvbSkpXG4gICAgfVxuXG4gICAgc3RhdGljIHNoYXBlKGRvbTogU1ZHUGF0aEVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgY29vcmRpbmF0ZSA9IGdldEJvdW5kaW5nQm94KGRvbSlcbiAgICAgICAgY29uc3QgbGF5ZXI6IFNoYXBlTGF5ZXIgPSB7XG4gICAgICAgICAgICB0eTogNCxcbiAgICAgICAgICAgIGRkZDogMCxcbiAgICAgICAgICAgIHNyOiAxLFxuICAgICAgICAgICAgYW86IDAsXG4gICAgICAgICAgICBrczogdGhpcy5nZW5lcmF0ZVRyYW5zZm9ybShjb29yZGluYXRlKSxcbiAgICAgICAgICAgIGlwOiAwLFxuICAgICAgICAgICAgb3A6IDEsXG4gICAgICAgICAgICBzdDogMCxcbiAgICAgICAgICAgIGJtOiAwLFxuICAgICAgICAgICAgc2hhcGVzOiByZW5kZXIoZG9tKVxuXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBKU01vdmluTGF5ZXIobGF5ZXIpXG4gICAgfVxuXG4gICAgc3RhdGljIHJlY3QobGVmdDogbnVtYmVyLCB0b3A6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgbGF5ZXI6IFNoYXBlTGF5ZXIgPSB7XG4gICAgICAgICAgICB0eTogNCxcbiAgICAgICAgICAgIGRkZDogMCxcbiAgICAgICAgICAgIHNyOiAxLFxuICAgICAgICAgICAgYW86IDAsXG4gICAgICAgICAgICBrczogdGhpcy5nZW5lcmF0ZVRyYW5zZm9ybShbbGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0XSksXG4gICAgICAgICAgICBpcDogMCxcbiAgICAgICAgICAgIG9wOiAxLFxuICAgICAgICAgICAgc3Q6IDAsXG4gICAgICAgICAgICBibTogMCxcbiAgICAgICAgICAgIHNoYXBlczogW1xuICAgICAgICAgICAgICAgIHJlbmRlclBsYWluR2x5cGgoJ3JlY3QnLCBbd2lkdGgsIGhlaWdodF0pXG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBKU01vdmluTGF5ZXIobGF5ZXIpXG4gICAgfVxuXG4gICAgc3RhdGljIGVsbGlwc2UoY3g6IG51bWJlciwgY3k6IG51bWJlciwgcng6IG51bWJlciwgcnk6IG51bWJlcikge1xuICAgICAgICBjb25zdCBsYXllcjogU2hhcGVMYXllciA9IHtcbiAgICAgICAgICAgIHR5OiA0LFxuICAgICAgICAgICAgZGRkOiAwLFxuICAgICAgICAgICAgc3I6IDEsXG4gICAgICAgICAgICBhbzogMCxcbiAgICAgICAgICAgIGtzOiB0aGlzLmdlbmVyYXRlVHJhbnNmb3JtKFtjeCAtIHJ4LCBjeSAtIHJ5LCAyICogcngsIDIgKiByeV0pLFxuICAgICAgICAgICAgaXA6IDAsXG4gICAgICAgICAgICBvcDogMSxcbiAgICAgICAgICAgIHN0OiAwLFxuICAgICAgICAgICAgYm06IDAsXG4gICAgICAgICAgICBzaGFwZXM6IFtcbiAgICAgICAgICAgICAgICByZW5kZXJQbGFpbkdseXBoKCdlbGxpcHNlJywgW3J4LCByeV0pXG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBKU01vdmluTGF5ZXIobGF5ZXIpXG4gICAgfVxuXG4gICAgc3RhdGljIGhpZXJhcmNoeShkb206IFNWR0dyYXBoaWNzRWxlbWVudCwgYXNzZXRMaXN0OiBBc3NldHMsIGZvbnRMaXN0OiBGb250cykge1xuICAgICAgICBjb25zdCBjb29yZGluYXRlID0gZ2V0Qm91bmRpbmdCb3goZG9tKVxuICAgICAgICBsZXQgZG9tVHlwZTogMiB8IDQgfCA1O1xuICAgICAgICBpZiAoZG9tIGluc3RhbmNlb2YgU1ZHVGV4dEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGRvbVR5cGUgPSA1XG4gICAgICAgIH0gZWxzZSBpZiAoZG9tIGluc3RhbmNlb2YgU1ZHSW1hZ2VFbGVtZW50KSB7XG4gICAgICAgICAgICBkb21UeXBlID0gMlxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG9tVHlwZSA9IDRcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsYXllcjogU2hhcGVMYXllciB8IEltYWdlTGF5ZXIgfCBUZXh0TGF5ZXIgPSB7XG4gICAgICAgICAgICB0eTogZG9tVHlwZSxcbiAgICAgICAgICAgIGRkZDogMCxcbiAgICAgICAgICAgIHNyOiAxLFxuICAgICAgICAgICAgYW86IDAsXG4gICAgICAgICAgICBrczogdGhpcy5nZW5lcmF0ZVRyYW5zZm9ybShjb29yZGluYXRlKSxcbiAgICAgICAgICAgIGlwOiAwLFxuICAgICAgICAgICAgb3A6IDEsXG4gICAgICAgICAgICBzdDogMCxcbiAgICAgICAgICAgIGJtOiAwXG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoIChkb21UeXBlKSB7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgaWYgKGFzc2V0TGlzdCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbWFnZUxheWVyID0gbGF5ZXIgYXMgSW1hZ2VMYXllclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBbcmVmSWQsIGFzc2V0XSA9IHJlbmRlckltYWdlKGRvbSBhcyBTVkdJbWFnZUVsZW1lbnQpXG4gICAgICAgICAgICAgICAgICAgIGltYWdlTGF5ZXIucmVmSWQgPSByZWZJZFxuICAgICAgICAgICAgICAgICAgICBhc3NldExpc3QucHVzaChhc3NldClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICBjb25zdCBzaGFwZUxheWVyID0gbGF5ZXIgYXMgU2hhcGVMYXllclxuICAgICAgICAgICAgICAgIHNoYXBlTGF5ZXIuc2hhcGVzID0gcmVuZGVyKGRvbSlcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgIGNvbnN0IHRleHRMYXllciA9IGxheWVyIGFzIFRleHRMYXllclxuXG4gICAgICAgICAgICAgICAgLy8gbW92ZSB0ZXh0TGF5ZXIncyBhbmNob3IgdG8gbGVmdC10b3BcbiAgICAgICAgICAgICAgICB0ZXh0TGF5ZXIua3MhLmEhLmsgPSBbMCwgLWNvb3JkaW5hdGVbM10sIDBdXG5cbiAgICAgICAgICAgICAgICBjb25zdCBbdGV4dERhdGEsIGZvbnRdID0gcmVuZGVyVGV4dChkb20gYXMgU1ZHVGV4dEVsZW1lbnQsIGZvbnRMaXN0KVxuICAgICAgICAgICAgICAgIHRleHRMYXllci50ID0gdGV4dERhdGFcbiAgICAgICAgICAgICAgICBpZiAoIWZvbnRMaXN0Lmxpc3QhLmZpbHRlcihmID0+IGYuZk5hbWUgPT0gZm9udC5mTmFtZSkubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICBmb250TGlzdC5saXN0IS5wdXNoKGZvbnQpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtb3ZpbkxheWVyID0gbmV3IEpTTW92aW5MYXllcihsYXllcilcbiAgICAgICAgcmV0dXJuIG1vdmluTGF5ZXJcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW5kZXIgYSBET00gdGhhdCBtYXkgYmUgdGhlIG1peHR1cmUgb2YgdGV4dCwgaW1hZ2VzIGFuZCBvdGhlciBnbHlwaHNcbiAgICAgKiBcbiAgICAgKiBUaGUgcmVuZGVyaW5nIG9yZGVyIGlzIGZpeGVkOiBnbHlwaHMoYm90dG9tKSAtIGltYWdlcyAtIHRleHQodG9wKVxuICAgICAqIEBwYXJhbSBkb20gU1ZHIERPTVxuICAgICAqIEBwYXJhbSBhc3NldExpc3QgcmVmZXJlbmNlIG9mIGFzc2V0c1xuICAgICAqIEBwYXJhbSBmb250TGlzdCByZWZlcmVuY2Ugb2YgZm9udHNcbiAgICAgKi9cbiAgICBzdGF0aWMgaGllcmFyY2h5QWxsKGRvbTogU1ZHR3JhcGhpY3NFbGVtZW50LCBhc3NldExpc3Q6IEFzc2V0cywgZm9udExpc3Q6IEZvbnRzKSB7XG4gICAgICAgIGlmIChkb20gaW5zdGFuY2VvZiBTVkdUZXh0RWxlbWVudCB8fCBkb20gaW5zdGFuY2VvZiBTVkdJbWFnZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBbdGhpcy5oaWVyYXJjaHkoZG9tLCBhc3NldExpc3QsIGZvbnRMaXN0KV1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdHMgPSBbdGhpcy5oaWVyYXJjaHkoZG9tLCBhc3NldExpc3QsIGZvbnRMaXN0KV1cblxuICAgICAgICAgICAgZG9tLnF1ZXJ5U2VsZWN0b3JBbGwoJ2ltYWdlJykuZm9yRWFjaChkb20gPT4gcmVzdWx0cy51bnNoaWZ0KHRoaXMuaGllcmFyY2h5KGRvbSwgYXNzZXRMaXN0LCBmb250TGlzdCkpKVxuXG4gICAgICAgICAgICBkb20ucXVlcnlTZWxlY3RvckFsbCgndGV4dCcpLmZvckVhY2goZG9tID0+IHJlc3VsdHMudW5zaGlmdCh0aGlzLmhpZXJhcmNoeShkb20sIGFzc2V0TGlzdCwgZm9udExpc3QpKSlcblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICAgICAgfVxuICAgIH1cbn0iXX0=