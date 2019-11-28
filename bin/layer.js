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
          base = this.findPropertyConfig('fl');
          k = 'c';
          index = -1;
          break;

        case 'strokeColor':
          base = this.findPropertyConfig('st');
          k = 'c';
          index = -1;
          break;

        case 'strokeWidth':
          base = this.findPropertyConfig('st');
          k = 'w';
          index = -1;
          break;

        case 'shape':
          base = this.findPropertyConfig('sh');
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
        if (index >= 0) base[k].k[index] = value;else base[k].k = value;
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
            if (d instanceof SVGGraphicsElement && !(d instanceof SVGGElement)) {
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

          var _renderImage = (0, _render.renderImage)(dom, assetList),
              _renderImage2 = _slicedToArray(_renderImage, 2),
              imageRefId = _renderImage2[0],
              imageAsset = _renderImage2[1];

          imageLayer.refId = imageRefId;
          if (!assetList.filter(function (a) {
            return a.id == imageRefId;
          }).length) assetList.push(imageAsset);
          break;

        case 4:
          var shapeLayer = layer;
          shapeLayer.shapes = (0, _render.render)(dom);
          break;

        case 5:
          var textLayer = layer; // move textLayer's anchor to left-top

          var baseLineHeight = (0, _helper.getBaselineHeight)(dom);
          textLayer.ks.a.k = [0, baseLineHeight - coordinate[3], 0];

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
  }]);

  return LayerFactory;
}();

exports.LayerFactory = LayerFactory;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sYXllci50cyJdLCJuYW1lcyI6WyJKU01vdmluTGF5ZXIiLCJrZXkiLCJzIiwiayIsImUiLCJvIiwidHJhbnNmb3JtIiwiYSIsImdldERlZmF1bHRQcm9wZXJ0eSIsInN0YXRpY1ZhbHVlIiwiaWR4IiwidGltZSIsInZhbHVlIiwiZWFzaW5nIiwiZXhpc3RLZXlmcmFtZSIsImZpbHRlciIsIngiLCJ0IiwicmVhZHlUb1NldCIsImxlbmd0aCIsInByZXZpb3VzS2V5ZnJhbWVDb3VudCIsInJlZHVjZSIsInAiLCJzcGxpY2UiLCJ5IiwiaSIsInJvb3QiLCJzaGFwZXMiLCJpdCIsImZpbmQiLCJzaGFwZSIsInR5IiwiZmluZFByb3BlcnR5Q29uZmlnIiwiaGFzVHJhbnNmb3JtIiwiZ3JvdXBTaGFwZXMiLCJwdXNoIiwiYmFzZSIsImluZGV4Iiwia3MiLCJmaW5kT3JJbnNlcnRQcm9wZXJ0eUNvbmZpZyIsInJlZiIsIm9wIiwiY29tbW9uUHJvcGVydHlNYXBwaW5nIiwidW5kZWZpbmVkIiwiZG9jIiwiZCIsImNvbnNvbGUiLCJlcnJvciIsIkVycm9yIiwiY29udmVydFRvU3RhdGljUHJvcGVydHkiLCJzdGFydEZyYW1lIiwiZW5kRnJhbWUiLCJzdGFydFZhbHVlIiwiZW5kVmFsdWUiLCJFYXNpbmdGYWN0b3J5IiwibGluZWFyIiwidGV4dFByb3AiLCJ0bXBTdGFydFZhbHVlIiwiSlNPTiIsInBhcnNlIiwic3RyaW5naWZ5IiwidG1wRW5kVmFsdWUiLCJjb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkiLCJhZGRLZXlmcmFtZSIsIkxheWVyRmFjdG9yeSIsImNvb3JkaW5hdGUiLCJyIiwiZG9tIiwiYm91bmRpbmdCb3giLCJtYXAiLCJ2IiwicmVjdCIsImxheWVyIiwiZGRkIiwic3IiLCJhbyIsImdlbmVyYXRlVHJhbnNmb3JtIiwiaXAiLCJzdCIsImJtIiwibGVmdCIsInRvcCIsIndpZHRoIiwiaGVpZ2h0IiwiY3giLCJjeSIsInJ4IiwicnkiLCJhc3NldExpc3QiLCJmb250TGlzdCIsImRvbVR5cGUiLCJTVkdUZXh0RWxlbWVudCIsIlNWR0ltYWdlRWxlbWVudCIsIlNWR0dFbGVtZW50IiwicHJlY29tcExheWVyIiwiZG9tTGVhdmVzIiwicHJlQ29tcEFzc2V0IiwicHJlQ29tcFJlZklkIiwiZm9yRWFjaCIsIlNWR0dyYXBoaWNzRWxlbWVudCIsInVuc2hpZnQiLCJoaWVyYXJjaHkiLCJ3IiwiaCIsInJlZklkIiwiaWQiLCJsYXllcnMiLCJpbWFnZUxheWVyIiwiaW1hZ2VSZWZJZCIsImltYWdlQXNzZXQiLCJzaGFwZUxheWVyIiwidGV4dExheWVyIiwiYmFzZUxpbmVIZWlnaHQiLCJ0ZXh0RGF0YSIsImZvbnQiLCJsaXN0IiwiZiIsImZOYW1lIiwibW92aW5MYXllciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUlhQSxZOzs7Ozt1Q0FFa0JDLEcsRUFBYTtBQUNwQyxjQUFRQSxHQUFSO0FBQ0ksYUFBSyxHQUFMO0FBQ0EsYUFBSyxHQUFMO0FBQ0ksaUJBQU8sQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsQ0FBUDs7QUFDSixhQUFLLEdBQUw7QUFDSSxpQkFBTyxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxDQUFQOztBQUNKLGFBQUssR0FBTDtBQUNJLGlCQUFPLEdBQVA7O0FBQ0osYUFBSyxHQUFMO0FBQ0ksaUJBQU8sQ0FBUDs7QUFDSixhQUFLLElBQUw7QUFDSSxpQkFBTztBQUNIQyxZQUFBQSxDQUFDLEVBQUU7QUFDQ0MsY0FBQUEsQ0FBQyxFQUFFLENBQUMsQ0FBRDtBQURKLGFBREE7QUFJSEMsWUFBQUEsQ0FBQyxFQUFFO0FBQ0NELGNBQUFBLENBQUMsRUFBRSxDQUFDLEdBQUQ7QUFESixhQUpBO0FBT0hFLFlBQUFBLENBQUMsRUFBRTtBQUNDRixjQUFBQSxDQUFDLEVBQUUsQ0FBQyxDQUFEO0FBREo7QUFQQSxXQUFQOztBQVdK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TGF5ZXIsIFRyYW5zZm9ybSwgQXNzZXRzLCBGb250cywgR3JvdXBTaGFwZSwgUHJlQ29tcExheWVyIH0gZnJvbSAnLi9hbmltYXRpb24nXG5pbXBvcnQgeyBFYXNpbmdGdW5jdGlvbiwgRWFzaW5nRmFjdG9yeSB9IGZyb20gJy4vZWFzaW5nJ1xuaW1wb3J0IHsgcmVuZGVyVGV4dCwgcmVuZGVyLCByZW5kZXJJbWFnZSwgcmVuZGVyUGxhaW5HbHlwaCB9IGZyb20gJy4vcmVuZGVyJztcbmltcG9ydCB7IGdldEJvdW5kaW5nQm94LCBnZXRMZWFmTm9kZXMsIGdldEJhc2VsaW5lSGVpZ2h0IH0gZnJvbSAnLi9oZWxwZXInXG5pbXBvcnQgdXVpZCBmcm9tICd1dWlkL3Y0JztcblxudHlwZSBTZXRhYmxlS2V5cyA9IFwic2NhbGVYXCIgfCBcInNjYWxlWVwiIHwgXCJhbmNob3JYXCIgfCBcImFuY2hvcllcIiB8IFwieFwiIHwgXCJ5XCIgfCBcInJvdGF0ZVwiIHwgXCJvcGFjaXR5XCIgfCAnc2hhcGUnIHwgJ2ZpbGxDb2xvcicgfCAndHJpbVN0YXJ0JyB8ICd0cmltRW5kJyB8ICd0cmltT2Zmc2V0JyB8ICdzdHJva2VDb2xvcicgfCAnc3Ryb2tlV2lkdGgnIHwgJ3RleHQnXG5cbmV4cG9ydCBjbGFzcyBKU01vdmluTGF5ZXIge1xuICAgIHB1YmxpYyByZWFkb25seSByb290OiBTaGFwZUxheWVyIHwgVGV4dExheWVyIHwgSW1hZ2VMYXllciB8IFByZUNvbXBMYXllcjtcbiAgICBwcml2YXRlIGdldERlZmF1bHRQcm9wZXJ0eShrZXk6IHN0cmluZykge1xuICAgICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICAgICAgY2FzZSAnYSc6XG4gICAgICAgICAgICBjYXNlICdwJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gWzAsIDAsIDBdXG4gICAgICAgICAgICBjYXNlICdzJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gWzEwMCwgMTAwLCAxMDBdXG4gICAgICAgICAgICBjYXNlICdvJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gMTAwXG4gICAgICAgICAgICBjYXNlICdyJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gMFxuICAgICAgICAgICAgY2FzZSAndG0nOlxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGs6IFswXVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrOiBbMTAwXVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBvOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrOiBbMF1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIDBcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGNvbnZlcnRUb1N0YXRpY1Byb3BlcnR5KHRyYW5zZm9ybTogYW55LCBrZXk6IHN0cmluZykge1xuICAgICAgICBpZiAoIXRyYW5zZm9ybVtrZXldKSB7XG4gICAgICAgICAgICB0cmFuc2Zvcm1ba2V5XSA9IHtcbiAgICAgICAgICAgICAgICBhOiAwLFxuICAgICAgICAgICAgICAgIGs6IHRoaXMuZ2V0RGVmYXVsdFByb3BlcnR5KGtleSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodHJhbnNmb3JtW2tleV0uYSA9PSAxKSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0aWNWYWx1ZSA9IHRyYW5zZm9ybVtrZXldLmtbMF0uc1xuICAgICAgICAgICAgdHJhbnNmb3JtW2tleV0gPSB7XG4gICAgICAgICAgICAgICAgYTogMCxcbiAgICAgICAgICAgICAgICBrOiBzdGF0aWNWYWx1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgY29udmVydFRvQW5pbWF0YWJsZVByb3BlcnR5KHRyYW5zZm9ybTogYW55LCBrZXk6IHN0cmluZykge1xuICAgICAgICBpZiAoIXRyYW5zZm9ybVtrZXldIHx8IHRyYW5zZm9ybVtrZXldLmEgPT0gMCkge1xuICAgICAgICAgICAgdHJhbnNmb3JtW2tleV0gPSB7XG4gICAgICAgICAgICAgICAgYTogMSxcbiAgICAgICAgICAgICAgICBrOiBbXVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgYWRkS2V5ZnJhbWUodHJhbnNmb3JtOiBhbnksIGtleTogc3RyaW5nLCBpZHg6IG51bWJlciA9IC0xLCB0aW1lOiBudW1iZXIsIHZhbHVlOiBBcnJheTxhbnk+LCBlYXNpbmc/OiBFYXNpbmdGdW5jdGlvbikge1xuICAgICAgICBjb25zdCBleGlzdEtleWZyYW1lID0gdHJhbnNmb3JtW2tleV0uay5maWx0ZXIoKHg6IGFueSkgPT4geC50ID09IHRpbWUpIGFzIGFueVtdXG4gICAgICAgIGxldCByZWFkeVRvU2V0O1xuICAgICAgICBpZiAoZXhpc3RLZXlmcmFtZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJlYWR5VG9TZXQgPSBleGlzdEtleWZyYW1lWzBdXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWFkeVRvU2V0ID0ge1xuICAgICAgICAgICAgICAgIHQ6IHRpbWUsXG4gICAgICAgICAgICAgICAgczogdGhpcy5nZXREZWZhdWx0UHJvcGVydHkoa2V5KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcHJldmlvdXNLZXlmcmFtZUNvdW50ID0gdHJhbnNmb3JtW2tleV0uay5yZWR1Y2UoKHA6IG51bWJlciwgeDogYW55KSA9PiB4LnQgPCB0aW1lID8gcCArIDEgOiBwLCAwKVxuICAgICAgICAgICAgdHJhbnNmb3JtW2tleV0uay5zcGxpY2UocHJldmlvdXNLZXlmcmFtZUNvdW50LCAwLCByZWFkeVRvU2V0KVxuICAgICAgICB9XG4gICAgICAgIGlmIChlYXNpbmcpIHtcbiAgICAgICAgICAgIHJlYWR5VG9TZXQubyA9IHtcbiAgICAgICAgICAgICAgICB4OiBlYXNpbmdbMF1bMF0sXG4gICAgICAgICAgICAgICAgeTogZWFzaW5nWzBdWzFdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZWFkeVRvU2V0LmkgPSB7XG4gICAgICAgICAgICAgICAgeDogZWFzaW5nWzFdWzBdLFxuICAgICAgICAgICAgICAgIHk6IGVhc2luZ1sxXVsxXVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgICAgICAgcmVhZHlUb1NldC5zW2lkeF0gPSB2YWx1ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVhZHlUb1NldC5zID0gW3ZhbHVlXVxuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgZmluZFByb3BlcnR5Q29uZmlnKGtleTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiAoKHRoaXMucm9vdCBhcyBTaGFwZUxheWVyKS5zaGFwZXMhWzBdIGFzIEdyb3VwU2hhcGUpLml0IS5maW5kKHNoYXBlID0+XG4gICAgICAgICAgICBzaGFwZS50eSA9PSBrZXlcbiAgICAgICAgKVxuICAgIH1cbiAgICBwcml2YXRlIGZpbmRPckluc2VydFByb3BlcnR5Q29uZmlnKGtleTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGZpbmQgPSB0aGlzLmZpbmRQcm9wZXJ0eUNvbmZpZyhrZXkpXG4gICAgICAgIGlmIChmaW5kKSByZXR1cm4gZmluZFxuICAgICAgICBjb25zdCBoYXNUcmFuc2Zvcm0gPSB0aGlzLmZpbmRQcm9wZXJ0eUNvbmZpZygndHInKVxuICAgICAgICBpZiAoaGFzVHJhbnNmb3JtKSB7XG4gICAgICAgICAgICBjb25zdCBncm91cFNoYXBlcyA9ICgodGhpcy5yb290IGFzIFNoYXBlTGF5ZXIpLnNoYXBlcyFbMF0gYXMgR3JvdXBTaGFwZSkuaXQhXG4gICAgICAgICAgICBncm91cFNoYXBlcy5zcGxpY2UoZ3JvdXBTaGFwZXMubGVuZ3RoIC0gMSwgMCwge1xuICAgICAgICAgICAgICAgIHR5OiBrZXksXG4gICAgICAgICAgICAgICAgLi4udGhpcy5nZXREZWZhdWx0UHJvcGVydHkoa2V5KSBhcyBvYmplY3RcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAoKHRoaXMucm9vdCBhcyBTaGFwZUxheWVyKS5zaGFwZXMhWzBdIGFzIEdyb3VwU2hhcGUpLml0IS5wdXNoKHtcbiAgICAgICAgICAgICAgICB0eToga2V5LFxuICAgICAgICAgICAgICAgIC4uLnRoaXMuZ2V0RGVmYXVsdFByb3BlcnR5KGtleSkgYXMgb2JqZWN0XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgY29tbW9uUHJvcGVydHlNYXBwaW5nKGtleTogU2V0YWJsZUtleXMpOiBbYW55LCBzdHJpbmcgfCB1bmRlZmluZWQsIG51bWJlciB8IHVuZGVmaW5lZF0ge1xuICAgICAgICBsZXQgYmFzZTogYW55LCBrOiBzdHJpbmcgfCB1bmRlZmluZWQsIGluZGV4OiBudW1iZXIgfCB1bmRlZmluZWRcbiAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgIGNhc2UgJ3NjYWxlWCc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMucm9vdC5rc1xuICAgICAgICAgICAgICAgIGsgPSAncydcbiAgICAgICAgICAgICAgICBpbmRleCA9IDBcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnc2NhbGVZJzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXG4gICAgICAgICAgICAgICAgayA9ICdzJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdhbmNob3JYJzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXG4gICAgICAgICAgICAgICAgayA9ICdhJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gMFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdhbmNob3JZJzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXG4gICAgICAgICAgICAgICAgayA9ICdhJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICd4JzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXG4gICAgICAgICAgICAgICAgayA9ICdwJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gMFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICd5JzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXG4gICAgICAgICAgICAgICAgayA9ICdwJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdyb3RhdGUnOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLnJvb3Qua3NcbiAgICAgICAgICAgICAgICBrID0gJ3InXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdvcGFjaXR5JzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXG4gICAgICAgICAgICAgICAgayA9ICdvJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAndHJpbVN0YXJ0JzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kT3JJbnNlcnRQcm9wZXJ0eUNvbmZpZygndG0nKVxuICAgICAgICAgICAgICAgIGsgPSAncydcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3RyaW1FbmQnOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLmZpbmRPckluc2VydFByb3BlcnR5Q29uZmlnKCd0bScpXG4gICAgICAgICAgICAgICAgayA9ICdlJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAndHJpbU9mZnNldCc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZE9ySW5zZXJ0UHJvcGVydHlDb25maWcoJ3RtJylcbiAgICAgICAgICAgICAgICBrID0gJ28nXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdmaWxsQ29sb3InOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLmZpbmRQcm9wZXJ0eUNvbmZpZygnZmwnKVxuICAgICAgICAgICAgICAgIGsgPSAnYydcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3N0cm9rZUNvbG9yJzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kUHJvcGVydHlDb25maWcoJ3N0JylcbiAgICAgICAgICAgICAgICBrID0gJ2MnXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdzdHJva2VXaWR0aCc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZFByb3BlcnR5Q29uZmlnKCdzdCcpXG4gICAgICAgICAgICAgICAgayA9ICd3J1xuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnc2hhcGUnOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLmZpbmRQcm9wZXJ0eUNvbmZpZygnc2gnKVxuICAgICAgICAgICAgICAgIGsgPSAna3MnXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtiYXNlLCBrLCBpbmRleF1cbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihyZWY6IFNoYXBlTGF5ZXIgfCBUZXh0TGF5ZXIgfCBJbWFnZUxheWVyIHwgUHJlQ29tcExheWVyKSB7XG4gICAgICAgIHRoaXMucm9vdCA9IHJlZlxuICAgIH1cblxuICAgIHNldFN0YXRpY1Byb3BlcnR5KGtleTogU2V0YWJsZUtleXMsIHZhbHVlOiBhbnkpIHtcbiAgICAgICAgdGhpcy5yb290Lm9wID0gMVxuICAgICAgICBsZXQgYmFzZTogYW55LCBrOiBzdHJpbmcgfCB1bmRlZmluZWQsIGluZGV4OiBudW1iZXIgfCB1bmRlZmluZWRcbiAgICAgICAgW2Jhc2UsIGssIGluZGV4XSA9IHRoaXMuY29tbW9uUHJvcGVydHlNYXBwaW5nKGtleSlcbiAgICAgICAgaWYgKCFrIHx8IGluZGV4ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgICAgICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnJvb3QudHkgPT0gNSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZG9jID0gdGhpcy5yb290LnQhLmQhXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2MuayA9IFtkb2MuayFbMF1dXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2Mua1swXS50ID0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jLmtbMF0ucyEudCA9IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGtleSwgdmFsdWUpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGEgdmFsaWQga2V5LicpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJhc2UgJiYgayAmJiBpbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnZlcnRUb1N0YXRpY1Byb3BlcnR5KGJhc2UsIGspXG4gICAgICAgICAgICBpZiAoaW5kZXggPj0gMClcbiAgICAgICAgICAgICAgICBiYXNlW2tdLmtbaW5kZXhdID0gdmFsdWVcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBiYXNlW2tdLmsgPSB2YWx1ZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0QW5pbWF0YWJsZVByb3BlcnR5KGtleTogU2V0YWJsZUtleXMsIHN0YXJ0RnJhbWU6IG51bWJlciwgZW5kRnJhbWU6IG51bWJlciwgc3RhcnRWYWx1ZTogYW55LCBlbmRWYWx1ZTogYW55LCBlYXNpbmc/OiBFYXNpbmdGdW5jdGlvbikge1xuICAgICAgICBpZiAoZW5kRnJhbWUgPD0gc3RhcnRGcmFtZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFbmQgZnJhbWUgc2hvdWxkIGJlIGxhcmdlciB0aGFuIHN0YXJ0IGZyYW1lLicpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yb290Lm9wID0gZW5kRnJhbWUgKyAxXG4gICAgICAgIGlmICghZWFzaW5nKSB7XG4gICAgICAgICAgICBlYXNpbmcgPSBFYXNpbmdGYWN0b3J5LmxpbmVhcigpXG4gICAgICAgIH1cbiAgICAgICAgbGV0IGJhc2U6IGFueSwgazogc3RyaW5nIHwgdW5kZWZpbmVkLCBpbmRleDogbnVtYmVyIHwgdW5kZWZpbmVkXG4gICAgICAgIFtiYXNlLCBrLCBpbmRleF0gPSB0aGlzLmNvbW1vblByb3BlcnR5TWFwcGluZyhrZXkpXG4gICAgICAgIGlmICghayB8fCBpbmRleCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5yb290LnR5ID09IDUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLnJvb3QudCEuZFxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRleHRQcm9wID0gYmFzZS5rWzBdLnNcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0bXBTdGFydFZhbHVlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0ZXh0UHJvcCkpXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdG1wRW5kVmFsdWUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRleHRQcm9wKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRtcFN0YXJ0VmFsdWUudCA9IHN0YXJ0VmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIHRtcEVuZFZhbHVlLnQgPSBlbmRWYWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZSA9IHRtcFN0YXJ0VmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlID0gdG1wRW5kVmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGsgPSAnaydcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3Ioa2V5LCBzdGFydEZyYW1lLCBlbmRGcmFtZSwgc3RhcnRWYWx1ZSwgZW5kVmFsdWUsIGVhc2luZylcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgYSB2YWxpZCBrZXkuJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoYmFzZSAmJiBrICYmIGluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY29udmVydFRvQW5pbWF0YWJsZVByb3BlcnR5KGJhc2UsIGspXG4gICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKGJhc2UsIGssIGluZGV4LCBzdGFydEZyYW1lLCBzdGFydFZhbHVlLCBlYXNpbmcpXG4gICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKGJhc2UsIGssIGluZGV4LCBlbmRGcmFtZSwgZW5kVmFsdWUpXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMYXllckZhY3Rvcnkge1xuICAgIHByaXZhdGUgc3RhdGljIGdlbmVyYXRlVHJhbnNmb3JtKGNvb3JkaW5hdGU6IG51bWJlcltdKTogVHJhbnNmb3JtIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG86IHtcbiAgICAgICAgICAgICAgICBhOiAwLFxuICAgICAgICAgICAgICAgIGs6IDEwMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHI6IHtcbiAgICAgICAgICAgICAgICBhOiAwLFxuICAgICAgICAgICAgICAgIGs6IDBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwOiB7XG4gICAgICAgICAgICAgICAgYTogMCxcbiAgICAgICAgICAgICAgICBrOiBbXG4gICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVbMF0sXG4gICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVbMV0sXG4gICAgICAgICAgICAgICAgICAgIDBcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYToge1xuICAgICAgICAgICAgICAgIGE6IDAsXG4gICAgICAgICAgICAgICAgazogW1xuICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHM6IHtcbiAgICAgICAgICAgICAgICBhOiAwLFxuICAgICAgICAgICAgICAgIGs6IFtcbiAgICAgICAgICAgICAgICAgICAgMTAwLFxuICAgICAgICAgICAgICAgICAgICAxMDAsXG4gICAgICAgICAgICAgICAgICAgIDEwMFxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBib3VuZGluZ0JveChkb206IFNWR0dyYXBoaWNzRWxlbWVudCkge1xuICAgICAgICBjb25zdCBib3VuZGluZ0JveCA9IGdldEJvdW5kaW5nQm94KGRvbSkubWFwKCh2LCBpKSA9PiBpIDwgMiA/IHYgLSAxIDogdiArIDEpIGFzIFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdXG4gICAgICAgIHJldHVybiB0aGlzLnJlY3QoLi4uYm91bmRpbmdCb3gpXG4gICAgfVxuXG4gICAgc3RhdGljIHNoYXBlKGRvbTogU1ZHUGF0aEVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgY29vcmRpbmF0ZSA9IGdldEJvdW5kaW5nQm94KGRvbSlcbiAgICAgICAgY29uc3QgbGF5ZXI6IFNoYXBlTGF5ZXIgPSB7XG4gICAgICAgICAgICB0eTogNCxcbiAgICAgICAgICAgIGRkZDogMCxcbiAgICAgICAgICAgIHNyOiAxLFxuICAgICAgICAgICAgYW86IDAsXG4gICAgICAgICAgICBrczogdGhpcy5nZW5lcmF0ZVRyYW5zZm9ybShjb29yZGluYXRlKSxcbiAgICAgICAgICAgIGlwOiAwLFxuICAgICAgICAgICAgb3A6IDEsXG4gICAgICAgICAgICBzdDogMCxcbiAgICAgICAgICAgIGJtOiAwLFxuICAgICAgICAgICAgc2hhcGVzOiByZW5kZXIoZG9tKVxuXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBKU01vdmluTGF5ZXIobGF5ZXIpXG4gICAgfVxuXG4gICAgc3RhdGljIHJlY3QobGVmdDogbnVtYmVyLCB0b3A6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgbGF5ZXI6IFNoYXBlTGF5ZXIgPSB7XG4gICAgICAgICAgICB0eTogNCxcbiAgICAgICAgICAgIGRkZDogMCxcbiAgICAgICAgICAgIHNyOiAxLFxuICAgICAgICAgICAgYW86IDAsXG4gICAgICAgICAgICBrczogdGhpcy5nZW5lcmF0ZVRyYW5zZm9ybShbbGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0XSksXG4gICAgICAgICAgICBpcDogMCxcbiAgICAgICAgICAgIG9wOiAxLFxuICAgICAgICAgICAgc3Q6IDAsXG4gICAgICAgICAgICBibTogMCxcbiAgICAgICAgICAgIHNoYXBlczogW1xuICAgICAgICAgICAgICAgIHJlbmRlclBsYWluR2x5cGgoJ3JlY3QnLCBbd2lkdGgsIGhlaWdodF0pXG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBKU01vdmluTGF5ZXIobGF5ZXIpXG4gICAgfVxuXG4gICAgc3RhdGljIGVsbGlwc2UoY3g6IG51bWJlciwgY3k6IG51bWJlciwgcng6IG51bWJlciwgcnk6IG51bWJlcikge1xuICAgICAgICBjb25zdCBsYXllcjogU2hhcGVMYXllciA9IHtcbiAgICAgICAgICAgIHR5OiA0LFxuICAgICAgICAgICAgZGRkOiAwLFxuICAgICAgICAgICAgc3I6IDEsXG4gICAgICAgICAgICBhbzogMCxcbiAgICAgICAgICAgIGtzOiB0aGlzLmdlbmVyYXRlVHJhbnNmb3JtKFtjeCAtIHJ4LCBjeSAtIHJ5LCAyICogcngsIDIgKiByeV0pLFxuICAgICAgICAgICAgaXA6IDAsXG4gICAgICAgICAgICBvcDogMSxcbiAgICAgICAgICAgIHN0OiAwLFxuICAgICAgICAgICAgYm06IDAsXG4gICAgICAgICAgICBzaGFwZXM6IFtcbiAgICAgICAgICAgICAgICByZW5kZXJQbGFpbkdseXBoKCdlbGxpcHNlJywgW3J4LCByeV0pXG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBKU01vdmluTGF5ZXIobGF5ZXIpXG4gICAgfVxuXG4gICAgc3RhdGljIGhpZXJhcmNoeShkb206IFNWR0dyYXBoaWNzRWxlbWVudCwgYXNzZXRMaXN0OiBBc3NldHMsIGZvbnRMaXN0OiBGb250cykge1xuICAgICAgICBjb25zdCBjb29yZGluYXRlID0gZ2V0Qm91bmRpbmdCb3goZG9tKVxuICAgICAgICBsZXQgZG9tVHlwZTogMiB8IDQgfCA1IHwgMDtcbiAgICAgICAgaWYgKGRvbSBpbnN0YW5jZW9mIFNWR1RleHRFbGVtZW50KSB7XG4gICAgICAgICAgICBkb21UeXBlID0gNVxuICAgICAgICB9IGVsc2UgaWYgKGRvbSBpbnN0YW5jZW9mIFNWR0ltYWdlRWxlbWVudCkge1xuICAgICAgICAgICAgZG9tVHlwZSA9IDJcbiAgICAgICAgfSBlbHNlIGlmIChkb20gaW5zdGFuY2VvZiBTVkdHRWxlbWVudCkge1xuICAgICAgICAgICAgZG9tVHlwZSA9IDBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRvbVR5cGUgPSA0XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbGF5ZXI6IFNoYXBlTGF5ZXIgfCBJbWFnZUxheWVyIHwgVGV4dExheWVyIHwgUHJlQ29tcExheWVyID0ge1xuICAgICAgICAgICAgdHk6IGRvbVR5cGUsXG4gICAgICAgICAgICBkZGQ6IDAsXG4gICAgICAgICAgICBzcjogMSxcbiAgICAgICAgICAgIGFvOiAwLFxuICAgICAgICAgICAga3M6IHRoaXMuZ2VuZXJhdGVUcmFuc2Zvcm0oZG9tVHlwZSA9PSAwID8gWzAsIDAsIDAsIDBdIDogY29vcmRpbmF0ZSksXG4gICAgICAgICAgICBpcDogMCxcbiAgICAgICAgICAgIG9wOiAxLFxuICAgICAgICAgICAgc3Q6IDAsXG4gICAgICAgICAgICBibTogMFxuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAoZG9tVHlwZSkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIGNvbnN0IHByZWNvbXBMYXllciA9IGxheWVyIGFzIFByZUNvbXBMYXllclxuICAgICAgICAgICAgICAgIGNvbnN0IGRvbUxlYXZlcyA9IGdldExlYWZOb2Rlcyhkb20pXG4gICAgICAgICAgICAgICAgY29uc3QgcHJlQ29tcEFzc2V0OiBKU01vdmluTGF5ZXJbXSA9IFtdXG4gICAgICAgICAgICAgICAgY29uc3QgcHJlQ29tcFJlZklkID0gdXVpZCgpXG4gICAgICAgICAgICAgICAgZG9tTGVhdmVzLmZvckVhY2goZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkIGluc3RhbmNlb2YgU1ZHR3JhcGhpY3NFbGVtZW50ICYmICEoZCBpbnN0YW5jZW9mIFNWR0dFbGVtZW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlQ29tcEFzc2V0LnVuc2hpZnQodGhpcy5oaWVyYXJjaHkoZCwgYXNzZXRMaXN0LCBmb250TGlzdCkpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIHByZUNvbXBBc3NldC5mb3JFYWNoKGxheWVyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGF5ZXIucm9vdC5vcCA9IDllOVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgcHJlY29tcExheWVyLncgPSBjb29yZGluYXRlWzBdICsgY29vcmRpbmF0ZVsyXSArIDFcbiAgICAgICAgICAgICAgICBwcmVjb21wTGF5ZXIuaCA9IGNvb3JkaW5hdGVbMV0gKyBjb29yZGluYXRlWzNdICsgMVxuICAgICAgICAgICAgICAgIHByZWNvbXBMYXllci5yZWZJZCA9IHByZUNvbXBSZWZJZFxuICAgICAgICAgICAgICAgIGFzc2V0TGlzdC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHByZUNvbXBSZWZJZCxcbiAgICAgICAgICAgICAgICAgICAgbGF5ZXJzOiBwcmVDb21wQXNzZXQubWFwKGxheWVyID0+IGxheWVyLnJvb3QpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGNvbnN0IGltYWdlTGF5ZXIgPSBsYXllciBhcyBJbWFnZUxheWVyXG4gICAgICAgICAgICAgICAgY29uc3QgW2ltYWdlUmVmSWQsIGltYWdlQXNzZXRdID0gcmVuZGVySW1hZ2UoZG9tIGFzIFNWR0ltYWdlRWxlbWVudCwgYXNzZXRMaXN0KVxuICAgICAgICAgICAgICAgIGltYWdlTGF5ZXIucmVmSWQgPSBpbWFnZVJlZklkXG4gICAgICAgICAgICAgICAgaWYgKCFhc3NldExpc3QuZmlsdGVyKGEgPT4gYS5pZCA9PSBpbWFnZVJlZklkKS5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgIGFzc2V0TGlzdC5wdXNoKGltYWdlQXNzZXQpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICBjb25zdCBzaGFwZUxheWVyID0gbGF5ZXIgYXMgU2hhcGVMYXllclxuICAgICAgICAgICAgICAgIHNoYXBlTGF5ZXIuc2hhcGVzID0gcmVuZGVyKGRvbSlcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgIGNvbnN0IHRleHRMYXllciA9IGxheWVyIGFzIFRleHRMYXllclxuXG4gICAgICAgICAgICAgICAgLy8gbW92ZSB0ZXh0TGF5ZXIncyBhbmNob3IgdG8gbGVmdC10b3BcbiAgICAgICAgICAgICAgICBjb25zdCBiYXNlTGluZUhlaWdodCA9IGdldEJhc2VsaW5lSGVpZ2h0KGRvbSBhcyBTVkdUZXh0RWxlbWVudClcbiAgICAgICAgICAgICAgICB0ZXh0TGF5ZXIua3MhLmEhLmsgPSBbMCwgYmFzZUxpbmVIZWlnaHQgLSBjb29yZGluYXRlWzNdLCAwXVxuXG4gICAgICAgICAgICAgICAgY29uc3QgW3RleHREYXRhLCBmb250XSA9IHJlbmRlclRleHQoZG9tIGFzIFNWR1RleHRFbGVtZW50LCBmb250TGlzdClcbiAgICAgICAgICAgICAgICB0ZXh0TGF5ZXIudCA9IHRleHREYXRhXG4gICAgICAgICAgICAgICAgaWYgKCFmb250TGlzdC5saXN0IS5maWx0ZXIoZiA9PiBmLmZOYW1lID09IGZvbnQuZk5hbWUpLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgZm9udExpc3QubGlzdCEucHVzaChmb250KVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbW92aW5MYXllciA9IG5ldyBKU01vdmluTGF5ZXIobGF5ZXIpXG4gICAgICAgIHJldHVybiBtb3ZpbkxheWVyXG4gICAgfVxufSJdfQ==