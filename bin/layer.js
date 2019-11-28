"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LayerFactory = exports.JSMovinLayer = void 0;

var _easing = require("./easing");

var _render = require("./render");

var _helper = require("./helper");

var _v = _interopRequireDefault(require("uuid/v4"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

      if (!k || index === undefined) {
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

      this.root.op = endFrame + 1;

      if (!easing) {
        easing = _easing.EasingFactory.linear();
      }

      var base, k, index;

      var _this$commonPropertyM3 = this.commonPropertyMapping(key);

      var _this$commonPropertyM4 = _slicedToArray(_this$commonPropertyM3, 3);

      base = _this$commonPropertyM4[0];
      k = _this$commonPropertyM4[1];
      index = _this$commonPropertyM4[2];

      if (!k || index === undefined) {
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
      var boundingBox = (0, _helper.getBoundingBox)(dom).map(function (v, i) {
        return i < 2 ? v - 1 : v + 1;
      });
      return this.rect.apply(this, _toConsumableArray(boundingBox));
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
      var _this = this;

      var coordinate = (0, _helper.getBoundingBox)(dom);
      var domType;

      if (dom instanceof SVGTextElement) {
        domType = 5;
      } else if (dom instanceof SVGImageElement) {
        domType = 2;
      } else if (dom instanceof SVGGElement) {
        domType = 0;
      } else {
        domType = 4;
      }

      var layer = {
        ty: domType,
        ddd: 0,
        sr: 1,
        ao: 0,
        ks: this.generateTransform(domType == 0 ? [0, 0, 0, 0] : coordinate),
        ip: 0,
        op: 1,
        st: 0,
        bm: 0
      };

      switch (domType) {
        case 0:
          var precompLayer = layer;
          var domLeaves = (0, _helper.getLeafNodes)(dom);
          var preCompAsset = [];
          var preCompRefId = (0, _v["default"])();
          domLeaves.forEach(function (d) {
            if (d instanceof SVGGraphicsElement) {
              preCompAsset.unshift(_this.hierarchy(d, assetList, fontList));
            }
          });
          preCompAsset.forEach(function (layer) {
            layer.root.op = 9e9;
          });
          precompLayer.w = coordinate[0] + coordinate[2] + 1;
          precompLayer.h = coordinate[1] + coordinate[3] + 1;
          precompLayer.refId = preCompRefId;
          assetList.push({
            id: preCompRefId,
            layers: preCompAsset.map(function (layer) {
              return layer.root;
            })
          });
          break;

        case 2:
          var imageLayer = layer;

          var _renderImage = (0, _render.renderImage)(dom),
              _renderImage2 = _slicedToArray(_renderImage, 2),
              imageRefId = _renderImage2[0],
              imageAsset = _renderImage2[1];

          imageLayer.refId = imageRefId;
          assetList.push(imageAsset);
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
      var _this2 = this;

      if (dom instanceof SVGTextElement || dom instanceof SVGImageElement) {
        return [this.hierarchy(dom, assetList, fontList)];
      } else {
        var results = [this.hierarchy(dom, assetList, fontList)];
        dom.querySelectorAll('image').forEach(function (dom) {
          return results.unshift(_this2.hierarchy(dom, assetList, fontList));
        });
        dom.querySelectorAll('text').forEach(function (dom) {
          return results.unshift(_this2.hierarchy(dom, assetList, fontList));
        });
        return results;
      }
    }
  }]);

  return LayerFactory;
}();

exports.LayerFactory = LayerFactory;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sYXllci50cyJdLCJuYW1lcyI6WyJKU01vdmluTGF5ZXIiLCJrZXkiLCJzIiwiayIsImUiLCJvIiwidHJhbnNmb3JtIiwiYSIsImdldERlZmF1bHRQcm9wZXJ0eSIsInN0YXRpY1ZhbHVlIiwiaWR4IiwidGltZSIsInZhbHVlIiwiZWFzaW5nIiwiZXhpc3RLZXlmcmFtZSIsImZpbHRlciIsIngiLCJ0IiwicmVhZHlUb1NldCIsImxlbmd0aCIsInByZXZpb3VzS2V5ZnJhbWVDb3VudCIsInJlZHVjZSIsInAiLCJzcGxpY2UiLCJ5IiwiaSIsInJvb3QiLCJzaGFwZXMiLCJpdCIsImZpbmQiLCJzaGFwZSIsInR5IiwiZmluZFByb3BlcnR5Q29uZmlnIiwiaGFzVHJhbnNmb3JtIiwiZ3JvdXBTaGFwZXMiLCJwdXNoIiwiYmFzZSIsImluZGV4Iiwia3MiLCJmaW5kT3JJbnNlcnRQcm9wZXJ0eUNvbmZpZyIsInJlZiIsIm9wIiwiY29tbW9uUHJvcGVydHlNYXBwaW5nIiwidW5kZWZpbmVkIiwiZG9jIiwiZCIsImNvbnNvbGUiLCJlcnJvciIsIkVycm9yIiwiY29udmVydFRvU3RhdGljUHJvcGVydHkiLCJzdGFydEZyYW1lIiwiZW5kRnJhbWUiLCJzdGFydFZhbHVlIiwiZW5kVmFsdWUiLCJFYXNpbmdGYWN0b3J5IiwibGluZWFyIiwidGV4dFByb3AiLCJ0bXBTdGFydFZhbHVlIiwiSlNPTiIsInBhcnNlIiwic3RyaW5naWZ5IiwidG1wRW5kVmFsdWUiLCJjb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkiLCJhZGRLZXlmcmFtZSIsIkxheWVyRmFjdG9yeSIsImNvb3JkaW5hdGUiLCJyIiwiZG9tIiwiYm91bmRpbmdCb3giLCJtYXAiLCJ2IiwicmVjdCIsImxheWVyIiwiZGRkIiwic3IiLCJhbyIsImdlbmVyYXRlVHJhbnNmb3JtIiwiaXAiLCJzdCIsImJtIiwibGVmdCIsInRvcCIsIndpZHRoIiwiaGVpZ2h0IiwiY3giLCJjeSIsInJ4IiwicnkiLCJhc3NldExpc3QiLCJmb250TGlzdCIsImRvbVR5cGUiLCJTVkdUZXh0RWxlbWVudCIsIlNWR0ltYWdlRWxlbWVudCIsIlNWR0dFbGVtZW50IiwicHJlY29tcExheWVyIiwiZG9tTGVhdmVzIiwicHJlQ29tcEFzc2V0IiwicHJlQ29tcFJlZklkIiwiZm9yRWFjaCIsIlNWR0dyYXBoaWNzRWxlbWVudCIsInVuc2hpZnQiLCJoaWVyYXJjaHkiLCJ3IiwiaCIsInJlZklkIiwiaWQiLCJsYXllcnMiLCJpbWFnZUxheWVyIiwiaW1hZ2VSZWZJZCIsImltYWdlQXNzZXQiLCJzaGFwZUxheWVyIiwidGV4dExheWVyIiwidGV4dERhdGEiLCJmb250IiwibGlzdCIsImYiLCJmTmFtZSIsIm1vdmluTGF5ZXIiLCJyZXN1bHRzIiwicXVlcnlTZWxlY3RvckFsbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUlhQSxZOzs7Ozt1Q0FFa0JDLEcsRUFBYTtBQUNwQyxjQUFRQSxHQUFSO0FBQ0ksYUFBSyxHQUFMO0FBQ0EsYUFBSyxHQUFMO0FBQ0ksaUJBQU8sQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsQ0FBUDs7QUFDSixhQUFLLEdBQUw7QUFDSSxpQkFBTyxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxDQUFQOztBQUNKLGFBQUssR0FBTDtBQUNJLGlCQUFPLEdBQVA7O0FBQ0osYUFBSyxHQUFMO0FBQ0ksaUJBQU8sQ0FBUDs7QUFDSixhQUFLLElBQUw7QUFDSSxpQkFBTztBQUNIQyxZQUFBQSxDQUFDLEVBQUU7QUFDQ0MsY0FBQUEsQ0FBQyxFQUFFLENBQUMsQ0FBRDtBQURKLGFBREE7QUFJSEMsWUFBQUEsQ0FBQyxFQUFFO0FBQ0NELGNBQUFBLENBQUMsRUFBRSxDQUFDLEdBQUQ7QUFESixhQUpBO0FBT0hFLFlBQUFBLENBQUMsRUFBRTtBQUNDRixjQUFBQSxDQUFDLEVBQUUsQ0FBQyxDQUFEO0FBREo7QUFQ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QUFxQixPQUFyQixFQUE4QnJCLE9BQTlCLENBQXNDLFVBQUEvQixHQUFHO0FBQUEsaUJBQUltRCxPQUFPLENBQUNsQixPQUFSLENBQWdCLE1BQUksQ0FBQ0MsU0FBTCxDQUFlbEMsR0FBZixFQUFvQnFCLFNBQXBCLEVBQStCQyxRQUEvQixDQUFoQixDQUFKO0FBQUEsU0FBekM7QUFFQXRCLFFBQUFBLEdBQUcsQ0FBQ29ELGdCQUFKLENBQXFCLE1BQXJCLEVBQTZCckIsT0FBN0IsQ0FBcUMsVUFBQS9CLEdBQUc7QUFBQSxpQkFBSW1ELE9BQU8sQ0FBQ2xCLE9BQVIsQ0FBZ0IsTUFBSSxDQUFDQyxTQUFMLENBQWVsQyxHQUFmLEVBQW9CcUIsU0FBcEIsRUFBK0JDLFFBQS9CLENBQWhCLENBQUo7QUFBQSxTQUF4QztBQUVBLGVBQU82QixPQUFQO0FBQ0g7QUFDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNoYXBlTGF5ZXIsIFRleHRMYXllciwgSW1hZ2VMYXllciwgVHJhbnNmb3JtLCBBc3NldHMsIEZvbnRzLCBHcm91cFNoYXBlLCBQcmVDb21wTGF5ZXIgfSBmcm9tICcuL2FuaW1hdGlvbidcbmltcG9ydCB7IEVhc2luZ0Z1bmN0aW9uLCBFYXNpbmdGYWN0b3J5IH0gZnJvbSAnLi9lYXNpbmcnXG5pbXBvcnQgeyByZW5kZXJUZXh0LCByZW5kZXIsIHJlbmRlckltYWdlLCByZW5kZXJQbGFpbkdseXBoIH0gZnJvbSAnLi9yZW5kZXInO1xuaW1wb3J0IHsgZ2V0Qm91bmRpbmdCb3gsIGdldExlYWZOb2RlcyB9IGZyb20gJy4vaGVscGVyJ1xuaW1wb3J0IHV1aWQgZnJvbSAndXVpZC92NCc7XG5cbnR5cGUgU2V0YWJsZUtleXMgPSBcInNjYWxlWFwiIHwgXCJzY2FsZVlcIiB8IFwiYW5jaG9yWFwiIHwgXCJhbmNob3JZXCIgfCBcInhcIiB8IFwieVwiIHwgXCJyb3RhdGVcIiB8IFwib3BhY2l0eVwiIHwgJ3NoYXBlJyB8ICdmaWxsQ29sb3InIHwgJ3RyaW1TdGFydCcgfCAndHJpbUVuZCcgfCAndHJpbU9mZnNldCcgfCAnc3Ryb2tlQ29sb3InIHwgJ3N0cm9rZVdpZHRoJyB8ICd0ZXh0J1xuXG5leHBvcnQgY2xhc3MgSlNNb3ZpbkxheWVyIHtcbiAgICBwdWJsaWMgcmVhZG9ubHkgcm9vdDogU2hhcGVMYXllciB8IFRleHRMYXllciB8IEltYWdlTGF5ZXIgfCBQcmVDb21wTGF5ZXI7XG4gICAgcHJpdmF0ZSBnZXREZWZhdWx0UHJvcGVydHkoa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgIGNhc2UgJ2EnOlxuICAgICAgICAgICAgY2FzZSAncCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFswLCAwLCAwXVxuICAgICAgICAgICAgY2FzZSAncyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsxMDAsIDEwMCwgMTAwXVxuICAgICAgICAgICAgY2FzZSAnbyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIDEwMFxuICAgICAgICAgICAgY2FzZSAncic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIDBcbiAgICAgICAgICAgIGNhc2UgJ3RtJzpcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrOiBbMF1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgazogWzEwMF1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgazogWzBdXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiAwXG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBjb252ZXJ0VG9TdGF0aWNQcm9wZXJ0eSh0cmFuc2Zvcm06IGFueSwga2V5OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0cmFuc2Zvcm1ba2V5XSkge1xuICAgICAgICAgICAgdHJhbnNmb3JtW2tleV0gPSB7XG4gICAgICAgICAgICAgICAgYTogMCxcbiAgICAgICAgICAgICAgICBrOiB0aGlzLmdldERlZmF1bHRQcm9wZXJ0eShrZXkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRyYW5zZm9ybVtrZXldLmEgPT0gMSkge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGljVmFsdWUgPSB0cmFuc2Zvcm1ba2V5XS5rWzBdLnNcbiAgICAgICAgICAgIHRyYW5zZm9ybVtrZXldID0ge1xuICAgICAgICAgICAgICAgIGE6IDAsXG4gICAgICAgICAgICAgICAgazogc3RhdGljVmFsdWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGNvbnZlcnRUb0FuaW1hdGFibGVQcm9wZXJ0eSh0cmFuc2Zvcm06IGFueSwga2V5OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0cmFuc2Zvcm1ba2V5XSB8fCB0cmFuc2Zvcm1ba2V5XS5hID09IDApIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybVtrZXldID0ge1xuICAgICAgICAgICAgICAgIGE6IDEsXG4gICAgICAgICAgICAgICAgazogW11cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGFkZEtleWZyYW1lKHRyYW5zZm9ybTogYW55LCBrZXk6IHN0cmluZywgaWR4OiBudW1iZXIgPSAtMSwgdGltZTogbnVtYmVyLCB2YWx1ZTogQXJyYXk8YW55PiwgZWFzaW5nPzogRWFzaW5nRnVuY3Rpb24pIHtcbiAgICAgICAgY29uc3QgZXhpc3RLZXlmcmFtZSA9IHRyYW5zZm9ybVtrZXldLmsuZmlsdGVyKCh4OiBhbnkpID0+IHgudCA9PSB0aW1lKSBhcyBhbnlbXVxuICAgICAgICBsZXQgcmVhZHlUb1NldDtcbiAgICAgICAgaWYgKGV4aXN0S2V5ZnJhbWUubGVuZ3RoKSB7XG4gICAgICAgICAgICByZWFkeVRvU2V0ID0gZXhpc3RLZXlmcmFtZVswXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVhZHlUb1NldCA9IHtcbiAgICAgICAgICAgICAgICB0OiB0aW1lLFxuICAgICAgICAgICAgICAgIHM6IHRoaXMuZ2V0RGVmYXVsdFByb3BlcnR5KGtleSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzS2V5ZnJhbWVDb3VudCA9IHRyYW5zZm9ybVtrZXldLmsucmVkdWNlKChwOiBudW1iZXIsIHg6IGFueSkgPT4geC50IDwgdGltZSA/IHAgKyAxIDogcCwgMClcbiAgICAgICAgICAgIHRyYW5zZm9ybVtrZXldLmsuc3BsaWNlKHByZXZpb3VzS2V5ZnJhbWVDb3VudCwgMCwgcmVhZHlUb1NldClcbiAgICAgICAgfVxuICAgICAgICBpZiAoZWFzaW5nKSB7XG4gICAgICAgICAgICByZWFkeVRvU2V0Lm8gPSB7XG4gICAgICAgICAgICAgICAgeDogZWFzaW5nWzBdWzBdLFxuICAgICAgICAgICAgICAgIHk6IGVhc2luZ1swXVsxXVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVhZHlUb1NldC5pID0ge1xuICAgICAgICAgICAgICAgIHg6IGVhc2luZ1sxXVswXSxcbiAgICAgICAgICAgICAgICB5OiBlYXNpbmdbMV1bMV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgICAgIHJlYWR5VG9TZXQuc1tpZHhdID0gdmFsdWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlYWR5VG9TZXQucyA9IFt2YWx1ZV1cbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGZpbmRQcm9wZXJ0eUNvbmZpZyhrZXk6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gKCh0aGlzLnJvb3QgYXMgU2hhcGVMYXllcikuc2hhcGVzIVswXSBhcyBHcm91cFNoYXBlKS5pdCEuZmluZChzaGFwZSA9PlxuICAgICAgICAgICAgc2hhcGUudHkgPT0ga2V5XG4gICAgICAgIClcbiAgICB9XG4gICAgcHJpdmF0ZSBmaW5kT3JJbnNlcnRQcm9wZXJ0eUNvbmZpZyhrZXk6IHN0cmluZykge1xuICAgICAgICBjb25zdCBmaW5kID0gdGhpcy5maW5kUHJvcGVydHlDb25maWcoa2V5KVxuICAgICAgICBpZiAoZmluZCkgcmV0dXJuIGZpbmRcbiAgICAgICAgY29uc3QgaGFzVHJhbnNmb3JtID0gdGhpcy5maW5kUHJvcGVydHlDb25maWcoJ3RyJylcbiAgICAgICAgaWYgKGhhc1RyYW5zZm9ybSkge1xuICAgICAgICAgICAgY29uc3QgZ3JvdXBTaGFwZXMgPSAoKHRoaXMucm9vdCBhcyBTaGFwZUxheWVyKS5zaGFwZXMhWzBdIGFzIEdyb3VwU2hhcGUpLml0IVxuICAgICAgICAgICAgZ3JvdXBTaGFwZXMuc3BsaWNlKGdyb3VwU2hhcGVzLmxlbmd0aCAtIDEsIDAsIHtcbiAgICAgICAgICAgICAgICB0eToga2V5LFxuICAgICAgICAgICAgICAgIC4uLnRoaXMuZ2V0RGVmYXVsdFByb3BlcnR5KGtleSkgYXMgb2JqZWN0XG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgKCh0aGlzLnJvb3QgYXMgU2hhcGVMYXllcikuc2hhcGVzIVswXSBhcyBHcm91cFNoYXBlKS5pdCEucHVzaCh7XG4gICAgICAgICAgICAgICAgdHk6IGtleSxcbiAgICAgICAgICAgICAgICAuLi50aGlzLmdldERlZmF1bHRQcm9wZXJ0eShrZXkpIGFzIG9iamVjdFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGNvbW1vblByb3BlcnR5TWFwcGluZyhrZXk6IFNldGFibGVLZXlzKTogW2FueSwgc3RyaW5nIHwgdW5kZWZpbmVkLCBudW1iZXIgfCB1bmRlZmluZWRdIHtcbiAgICAgICAgbGV0IGJhc2U6IGFueSwgazogc3RyaW5nIHwgdW5kZWZpbmVkLCBpbmRleDogbnVtYmVyIHwgdW5kZWZpbmVkXG4gICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgICAgICBjYXNlICdzY2FsZVgnOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLnJvb3Qua3NcbiAgICAgICAgICAgICAgICBrID0gJ3MnXG4gICAgICAgICAgICAgICAgaW5kZXggPSAwXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3NjYWxlWSc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMucm9vdC5rc1xuICAgICAgICAgICAgICAgIGsgPSAncydcbiAgICAgICAgICAgICAgICBpbmRleCA9IDFcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnYW5jaG9yWCc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMucm9vdC5rc1xuICAgICAgICAgICAgICAgIGsgPSAnYSdcbiAgICAgICAgICAgICAgICBpbmRleCA9IDBcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnYW5jaG9yWSc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMucm9vdC5rc1xuICAgICAgICAgICAgICAgIGsgPSAnYSdcbiAgICAgICAgICAgICAgICBpbmRleCA9IDFcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAneCc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMucm9vdC5rc1xuICAgICAgICAgICAgICAgIGsgPSAncCdcbiAgICAgICAgICAgICAgICBpbmRleCA9IDBcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAneSc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMucm9vdC5rc1xuICAgICAgICAgICAgICAgIGsgPSAncCdcbiAgICAgICAgICAgICAgICBpbmRleCA9IDFcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAncm90YXRlJzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXG4gICAgICAgICAgICAgICAgayA9ICdyJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnb3BhY2l0eSc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMucm9vdC5rc1xuICAgICAgICAgICAgICAgIGsgPSAnbydcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3RyaW1TdGFydCc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZE9ySW5zZXJ0UHJvcGVydHlDb25maWcoJ3RtJylcbiAgICAgICAgICAgICAgICBrID0gJ3MnXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICd0cmltRW5kJzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kT3JJbnNlcnRQcm9wZXJ0eUNvbmZpZygndG0nKVxuICAgICAgICAgICAgICAgIGsgPSAnZSdcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3RyaW1PZmZzZXQnOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLmZpbmRPckluc2VydFByb3BlcnR5Q29uZmlnKCd0bScpXG4gICAgICAgICAgICAgICAgayA9ICdvJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnZmlsbENvbG9yJzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kT3JJbnNlcnRQcm9wZXJ0eUNvbmZpZygnZmwnKVxuICAgICAgICAgICAgICAgIGsgPSAnYydcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3N0cm9rZUNvbG9yJzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kT3JJbnNlcnRQcm9wZXJ0eUNvbmZpZygnc3QnKVxuICAgICAgICAgICAgICAgIGsgPSAnYydcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3N0cm9rZVdpZHRoJzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kT3JJbnNlcnRQcm9wZXJ0eUNvbmZpZygnc3QnKVxuICAgICAgICAgICAgICAgIGsgPSAndydcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3NoYXBlJzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kT3JJbnNlcnRQcm9wZXJ0eUNvbmZpZygnc2gnKVxuICAgICAgICAgICAgICAgIGsgPSAna3MnXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtiYXNlLCBrLCBpbmRleF1cbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihyZWY6IFNoYXBlTGF5ZXIgfCBUZXh0TGF5ZXIgfCBJbWFnZUxheWVyIHwgUHJlQ29tcExheWVyKSB7XG4gICAgICAgIHRoaXMucm9vdCA9IHJlZlxuICAgIH1cblxuICAgIHNldFN0YXRpY1Byb3BlcnR5KGtleTogU2V0YWJsZUtleXMsIHZhbHVlOiBhbnkpIHtcbiAgICAgICAgdGhpcy5yb290Lm9wID0gMVxuICAgICAgICBsZXQgYmFzZTogYW55LCBrOiBzdHJpbmcgfCB1bmRlZmluZWQsIGluZGV4OiBudW1iZXIgfCB1bmRlZmluZWRcbiAgICAgICAgW2Jhc2UsIGssIGluZGV4XSA9IHRoaXMuY29tbW9uUHJvcGVydHlNYXBwaW5nKGtleSlcbiAgICAgICAgaWYgKCFrIHx8IGluZGV4ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgICAgICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnJvb3QudHkgPT0gNSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZG9jID0gdGhpcy5yb290LnQhLmQhXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2MuayA9IFtkb2MuayFbMF1dXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2Mua1swXS50ID0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jLmtbMF0ucyEudCA9IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGtleSwgdmFsdWUpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGEgdmFsaWQga2V5LicpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJhc2UgJiYgayAmJiBpbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnZlcnRUb1N0YXRpY1Byb3BlcnR5KGJhc2UsIGspXG4gICAgICAgICAgICBiYXNlW2tdLmtbaW5kZXhdID0gdmFsdWVcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldEFuaW1hdGFibGVQcm9wZXJ0eShrZXk6IFNldGFibGVLZXlzLCBzdGFydEZyYW1lOiBudW1iZXIsIGVuZEZyYW1lOiBudW1iZXIsIHN0YXJ0VmFsdWU6IGFueSwgZW5kVmFsdWU6IGFueSwgZWFzaW5nPzogRWFzaW5nRnVuY3Rpb24pIHtcbiAgICAgICAgaWYgKGVuZEZyYW1lIDw9IHN0YXJ0RnJhbWUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRW5kIGZyYW1lIHNob3VsZCBiZSBsYXJnZXIgdGhhbiBzdGFydCBmcmFtZS4nKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucm9vdC5vcCA9IGVuZEZyYW1lICsgMVxuICAgICAgICBpZiAoIWVhc2luZykge1xuICAgICAgICAgICAgZWFzaW5nID0gRWFzaW5nRmFjdG9yeS5saW5lYXIoKVxuICAgICAgICB9XG4gICAgICAgIGxldCBiYXNlOiBhbnksIGs6IHN0cmluZyB8IHVuZGVmaW5lZCwgaW5kZXg6IG51bWJlciB8IHVuZGVmaW5lZFxuICAgICAgICBbYmFzZSwgaywgaW5kZXhdID0gdGhpcy5jb21tb25Qcm9wZXJ0eU1hcHBpbmcoa2V5KVxuICAgICAgICBpZiAoIWsgfHwgaW5kZXggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICd0ZXh0JzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucm9vdC50eSA9PSA1KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LnQhLmRcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0ZXh0UHJvcCA9IGJhc2Uua1swXS5zXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdG1wU3RhcnRWYWx1ZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGV4dFByb3ApKVxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRtcEVuZFZhbHVlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0ZXh0UHJvcCkpXG4gICAgICAgICAgICAgICAgICAgICAgICB0bXBTdGFydFZhbHVlLnQgPSBzdGFydFZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICB0bXBFbmRWYWx1ZS50ID0gZW5kVmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWUgPSB0bXBTdGFydFZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZSA9IHRtcEVuZFZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICBrID0gJ2snXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IC0xXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGtleSwgc3RhcnRGcmFtZSwgZW5kRnJhbWUsIHN0YXJ0VmFsdWUsIGVuZFZhbHVlLCBlYXNpbmcpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGEgdmFsaWQga2V5LicpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJhc2UgJiYgayAmJiBpbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnZlcnRUb0FuaW1hdGFibGVQcm9wZXJ0eShiYXNlLCBrKVxuICAgICAgICAgICAgdGhpcy5hZGRLZXlmcmFtZShiYXNlLCBrLCBpbmRleCwgc3RhcnRGcmFtZSwgc3RhcnRWYWx1ZSwgZWFzaW5nKVxuICAgICAgICAgICAgdGhpcy5hZGRLZXlmcmFtZShiYXNlLCBrLCBpbmRleCwgZW5kRnJhbWUsIGVuZFZhbHVlKVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTGF5ZXJGYWN0b3J5IHtcbiAgICBwcml2YXRlIHN0YXRpYyBnZW5lcmF0ZVRyYW5zZm9ybShjb29yZGluYXRlOiBudW1iZXJbXSk6IFRyYW5zZm9ybSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvOiB7XG4gICAgICAgICAgICAgICAgYTogMCxcbiAgICAgICAgICAgICAgICBrOiAxMDBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByOiB7XG4gICAgICAgICAgICAgICAgYTogMCxcbiAgICAgICAgICAgICAgICBrOiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcDoge1xuICAgICAgICAgICAgICAgIGE6IDAsXG4gICAgICAgICAgICAgICAgazogW1xuICAgICAgICAgICAgICAgICAgICBjb29yZGluYXRlWzBdLFxuICAgICAgICAgICAgICAgICAgICBjb29yZGluYXRlWzFdLFxuICAgICAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGE6IHtcbiAgICAgICAgICAgICAgICBhOiAwLFxuICAgICAgICAgICAgICAgIGs6IFtcbiAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzOiB7XG4gICAgICAgICAgICAgICAgYTogMCxcbiAgICAgICAgICAgICAgICBrOiBbXG4gICAgICAgICAgICAgICAgICAgIDEwMCxcbiAgICAgICAgICAgICAgICAgICAgMTAwLFxuICAgICAgICAgICAgICAgICAgICAxMDBcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgYm91bmRpbmdCb3goZG9tOiBTVkdHcmFwaGljc0VsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgYm91bmRpbmdCb3ggPSBnZXRCb3VuZGluZ0JveChkb20pLm1hcCgodiwgaSkgPT4gaSA8IDIgPyB2IC0gMSA6IHYgKyAxKSBhcyBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXVxuICAgICAgICByZXR1cm4gdGhpcy5yZWN0KC4uLmJvdW5kaW5nQm94KVxuICAgIH1cblxuICAgIHN0YXRpYyBzaGFwZShkb206IFNWR1BhdGhFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IGNvb3JkaW5hdGUgPSBnZXRCb3VuZGluZ0JveChkb20pXG4gICAgICAgIGNvbnN0IGxheWVyOiBTaGFwZUxheWVyID0ge1xuICAgICAgICAgICAgdHk6IDQsXG4gICAgICAgICAgICBkZGQ6IDAsXG4gICAgICAgICAgICBzcjogMSxcbiAgICAgICAgICAgIGFvOiAwLFxuICAgICAgICAgICAga3M6IHRoaXMuZ2VuZXJhdGVUcmFuc2Zvcm0oY29vcmRpbmF0ZSksXG4gICAgICAgICAgICBpcDogMCxcbiAgICAgICAgICAgIG9wOiAxLFxuICAgICAgICAgICAgc3Q6IDAsXG4gICAgICAgICAgICBibTogMCxcbiAgICAgICAgICAgIHNoYXBlczogcmVuZGVyKGRvbSlcblxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgSlNNb3ZpbkxheWVyKGxheWVyKVxuICAgIH1cblxuICAgIHN0YXRpYyByZWN0KGxlZnQ6IG51bWJlciwgdG9wOiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGxheWVyOiBTaGFwZUxheWVyID0ge1xuICAgICAgICAgICAgdHk6IDQsXG4gICAgICAgICAgICBkZGQ6IDAsXG4gICAgICAgICAgICBzcjogMSxcbiAgICAgICAgICAgIGFvOiAwLFxuICAgICAgICAgICAga3M6IHRoaXMuZ2VuZXJhdGVUcmFuc2Zvcm0oW2xlZnQsIHRvcCwgd2lkdGgsIGhlaWdodF0pLFxuICAgICAgICAgICAgaXA6IDAsXG4gICAgICAgICAgICBvcDogMSxcbiAgICAgICAgICAgIHN0OiAwLFxuICAgICAgICAgICAgYm06IDAsXG4gICAgICAgICAgICBzaGFwZXM6IFtcbiAgICAgICAgICAgICAgICByZW5kZXJQbGFpbkdseXBoKCdyZWN0JywgW3dpZHRoLCBoZWlnaHRdKVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgSlNNb3ZpbkxheWVyKGxheWVyKVxuICAgIH1cblxuICAgIHN0YXRpYyBlbGxpcHNlKGN4OiBudW1iZXIsIGN5OiBudW1iZXIsIHJ4OiBudW1iZXIsIHJ5OiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgbGF5ZXI6IFNoYXBlTGF5ZXIgPSB7XG4gICAgICAgICAgICB0eTogNCxcbiAgICAgICAgICAgIGRkZDogMCxcbiAgICAgICAgICAgIHNyOiAxLFxuICAgICAgICAgICAgYW86IDAsXG4gICAgICAgICAgICBrczogdGhpcy5nZW5lcmF0ZVRyYW5zZm9ybShbY3ggLSByeCwgY3kgLSByeSwgMiAqIHJ4LCAyICogcnldKSxcbiAgICAgICAgICAgIGlwOiAwLFxuICAgICAgICAgICAgb3A6IDEsXG4gICAgICAgICAgICBzdDogMCxcbiAgICAgICAgICAgIGJtOiAwLFxuICAgICAgICAgICAgc2hhcGVzOiBbXG4gICAgICAgICAgICAgICAgcmVuZGVyUGxhaW5HbHlwaCgnZWxsaXBzZScsIFtyeCwgcnldKVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgSlNNb3ZpbkxheWVyKGxheWVyKVxuICAgIH1cblxuICAgIHN0YXRpYyBoaWVyYXJjaHkoZG9tOiBTVkdHcmFwaGljc0VsZW1lbnQsIGFzc2V0TGlzdDogQXNzZXRzLCBmb250TGlzdDogRm9udHMpIHtcbiAgICAgICAgY29uc3QgY29vcmRpbmF0ZSA9IGdldEJvdW5kaW5nQm94KGRvbSlcbiAgICAgICAgbGV0IGRvbVR5cGU6IDIgfCA0IHwgNSB8IDA7XG4gICAgICAgIGlmIChkb20gaW5zdGFuY2VvZiBTVkdUZXh0RWxlbWVudCkge1xuICAgICAgICAgICAgZG9tVHlwZSA9IDVcbiAgICAgICAgfSBlbHNlIGlmIChkb20gaW5zdGFuY2VvZiBTVkdJbWFnZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIGRvbVR5cGUgPSAyXG4gICAgICAgIH0gZWxzZSBpZiAoZG9tIGluc3RhbmNlb2YgU1ZHR0VsZW1lbnQpIHtcbiAgICAgICAgICAgIGRvbVR5cGUgPSAwXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb21UeXBlID0gNFxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxheWVyOiBTaGFwZUxheWVyIHwgSW1hZ2VMYXllciB8IFRleHRMYXllciB8IFByZUNvbXBMYXllciA9IHtcbiAgICAgICAgICAgIHR5OiBkb21UeXBlLFxuICAgICAgICAgICAgZGRkOiAwLFxuICAgICAgICAgICAgc3I6IDEsXG4gICAgICAgICAgICBhbzogMCxcbiAgICAgICAgICAgIGtzOiB0aGlzLmdlbmVyYXRlVHJhbnNmb3JtKGRvbVR5cGUgPT0gMCA/IFswLCAwLCAwLCAwXSA6IGNvb3JkaW5hdGUpLFxuICAgICAgICAgICAgaXA6IDAsXG4gICAgICAgICAgICBvcDogMSxcbiAgICAgICAgICAgIHN0OiAwLFxuICAgICAgICAgICAgYm06IDBcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKGRvbVR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBjb25zdCBwcmVjb21wTGF5ZXIgPSBsYXllciBhcyBQcmVDb21wTGF5ZXJcbiAgICAgICAgICAgICAgICBjb25zdCBkb21MZWF2ZXMgPSBnZXRMZWFmTm9kZXMoZG9tKVxuICAgICAgICAgICAgICAgIGNvbnN0IHByZUNvbXBBc3NldDogSlNNb3ZpbkxheWVyW10gPSBbXVxuICAgICAgICAgICAgICAgIGNvbnN0IHByZUNvbXBSZWZJZCA9IHV1aWQoKVxuICAgICAgICAgICAgICAgIGRvbUxlYXZlcy5mb3JFYWNoKGQgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZCBpbnN0YW5jZW9mIFNWR0dyYXBoaWNzRWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlQ29tcEFzc2V0LnVuc2hpZnQodGhpcy5oaWVyYXJjaHkoZCwgYXNzZXRMaXN0LCBmb250TGlzdCkpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIHByZUNvbXBBc3NldC5mb3JFYWNoKGxheWVyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGF5ZXIucm9vdC5vcCA9IDllOVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgcHJlY29tcExheWVyLncgPSBjb29yZGluYXRlWzBdICsgY29vcmRpbmF0ZVsyXSArIDFcbiAgICAgICAgICAgICAgICBwcmVjb21wTGF5ZXIuaCA9IGNvb3JkaW5hdGVbMV0gKyBjb29yZGluYXRlWzNdICsgMVxuICAgICAgICAgICAgICAgIHByZWNvbXBMYXllci5yZWZJZCA9IHByZUNvbXBSZWZJZFxuICAgICAgICAgICAgICAgIGFzc2V0TGlzdC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHByZUNvbXBSZWZJZCxcbiAgICAgICAgICAgICAgICAgICAgbGF5ZXJzOiBwcmVDb21wQXNzZXQubWFwKGxheWVyID0+IGxheWVyLnJvb3QpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGNvbnN0IGltYWdlTGF5ZXIgPSBsYXllciBhcyBJbWFnZUxheWVyXG4gICAgICAgICAgICAgICAgY29uc3QgW2ltYWdlUmVmSWQsIGltYWdlQXNzZXRdID0gcmVuZGVySW1hZ2UoZG9tIGFzIFNWR0ltYWdlRWxlbWVudClcbiAgICAgICAgICAgICAgICBpbWFnZUxheWVyLnJlZklkID0gaW1hZ2VSZWZJZFxuICAgICAgICAgICAgICAgIGFzc2V0TGlzdC5wdXNoKGltYWdlQXNzZXQpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICBjb25zdCBzaGFwZUxheWVyID0gbGF5ZXIgYXMgU2hhcGVMYXllclxuICAgICAgICAgICAgICAgIHNoYXBlTGF5ZXIuc2hhcGVzID0gcmVuZGVyKGRvbSlcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgIGNvbnN0IHRleHRMYXllciA9IGxheWVyIGFzIFRleHRMYXllclxuXG4gICAgICAgICAgICAgICAgLy8gbW92ZSB0ZXh0TGF5ZXIncyBhbmNob3IgdG8gbGVmdC10b3BcbiAgICAgICAgICAgICAgICB0ZXh0TGF5ZXIua3MhLmEhLmsgPSBbMCwgLWNvb3JkaW5hdGVbM10sIDBdXG5cbiAgICAgICAgICAgICAgICBjb25zdCBbdGV4dERhdGEsIGZvbnRdID0gcmVuZGVyVGV4dChkb20gYXMgU1ZHVGV4dEVsZW1lbnQsIGZvbnRMaXN0KVxuICAgICAgICAgICAgICAgIHRleHRMYXllci50ID0gdGV4dERhdGFcbiAgICAgICAgICAgICAgICBpZiAoIWZvbnRMaXN0Lmxpc3QhLmZpbHRlcihmID0+IGYuZk5hbWUgPT0gZm9udC5mTmFtZSkubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICBmb250TGlzdC5saXN0IS5wdXNoKGZvbnQpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtb3ZpbkxheWVyID0gbmV3IEpTTW92aW5MYXllcihsYXllcilcbiAgICAgICAgcmV0dXJuIG1vdmluTGF5ZXJcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW5kZXIgYSBET00gdGhhdCBtYXkgYmUgdGhlIG1peHR1cmUgb2YgdGV4dCwgaW1hZ2VzIGFuZCBvdGhlciBnbHlwaHNcbiAgICAgKiBcbiAgICAgKiBUaGUgcmVuZGVyaW5nIG9yZGVyIGlzIGZpeGVkOiBnbHlwaHMoYm90dG9tKSAtIGltYWdlcyAtIHRleHQodG9wKVxuICAgICAqIEBwYXJhbSBkb20gU1ZHIERPTVxuICAgICAqIEBwYXJhbSBhc3NldExpc3QgcmVmZXJlbmNlIG9mIGFzc2V0c1xuICAgICAqIEBwYXJhbSBmb250TGlzdCByZWZlcmVuY2Ugb2YgZm9udHNcbiAgICAgKi9cbiAgICBzdGF0aWMgaGllcmFyY2h5QWxsKGRvbTogU1ZHR3JhcGhpY3NFbGVtZW50LCBhc3NldExpc3Q6IEFzc2V0cywgZm9udExpc3Q6IEZvbnRzKSB7XG4gICAgICAgIGlmIChkb20gaW5zdGFuY2VvZiBTVkdUZXh0RWxlbWVudCB8fCBkb20gaW5zdGFuY2VvZiBTVkdJbWFnZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBbdGhpcy5oaWVyYXJjaHkoZG9tLCBhc3NldExpc3QsIGZvbnRMaXN0KV1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdHMgPSBbdGhpcy5oaWVyYXJjaHkoZG9tLCBhc3NldExpc3QsIGZvbnRMaXN0KV1cblxuICAgICAgICAgICAgZG9tLnF1ZXJ5U2VsZWN0b3JBbGwoJ2ltYWdlJykuZm9yRWFjaChkb20gPT4gcmVzdWx0cy51bnNoaWZ0KHRoaXMuaGllcmFyY2h5KGRvbSwgYXNzZXRMaXN0LCBmb250TGlzdCkpKVxuXG4gICAgICAgICAgICBkb20ucXVlcnlTZWxlY3RvckFsbCgndGV4dCcpLmZvckVhY2goZG9tID0+IHJlc3VsdHMudW5zaGlmdCh0aGlzLmhpZXJhcmNoeShkb20sIGFzc2V0TGlzdCwgZm9udExpc3QpKSlcblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICAgICAgfVxuICAgIH1cbn0iXX0=