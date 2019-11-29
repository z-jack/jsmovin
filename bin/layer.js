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
      if (!transform[key] || !transform[key].a) {
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
      var wrap = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : true;
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
        readyToSet.s = wrap && !(value instanceof Array) ? [value] : value;
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

      var config = _objectSpread({
        ty: key
      }, this.getDefaultProperty(key));

      if (hasTransform) {
        var groupShapes = this.root.shapes[0].it;
        groupShapes.splice(groupShapes.length - 1, 0, config);
      } else {
        this.root.shapes[0].it.push(config);
      }

      return config;
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

        case 'fillOpacity':
          base = this.findPropertyConfig('fl');
          k = 'o';
          index = -1;
          break;

        case 'strokeOpacity':
          base = this.findPropertyConfig('st');
          k = 'o';
          index = -1;
          break;

        case 'lineCap':
          base = this.findPropertyConfig('st');
          k = 'lc';
          index = -1;
          break;

        case 'lineJoin':
          base = this.findPropertyConfig('st');
          k = 'lj';
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

      if (key === 'lineCap') {
        value = (0, _helper.encodeLineCap)(value);
      } else if (key === 'lineJoin') {
        value = (0, _helper.encodeLineJoin)(value);
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

      var base,
          k,
          index,
          wrap = true;

      var _this$commonPropertyM3 = this.commonPropertyMapping(key);

      var _this$commonPropertyM4 = _slicedToArray(_this$commonPropertyM3, 3);

      base = _this$commonPropertyM4[0];
      k = _this$commonPropertyM4[1];
      index = _this$commonPropertyM4[2];

      if (!k || index === undefined) {
        switch (key) {
          case 'text':
            if (this.root.ty == 5) {
              base = this.root.t;
              var textProp = base.d.k[0].s;
              var tmpStartValue = JSON.parse(JSON.stringify(textProp));
              var tmpEndValue = JSON.parse(JSON.stringify(textProp));
              tmpStartValue.t = startValue;
              tmpEndValue.t = endValue;
              startValue = tmpStartValue;
              endValue = tmpEndValue;
              k = 'd';
              index = -1;
              wrap = false;
            }

            break;

          default:
            console.error(key, startFrame, endFrame, startValue, endValue, easing);
            throw new Error('Not a valid key.');
        }
      }

      if (key === 'lineCap') {
        startValue = (0, _helper.encodeLineCap)(startValue);
        endValue = (0, _helper.encodeLineCap)(endValue);
      } else if (key === 'lineJoin') {
        startValue = (0, _helper.encodeLineJoin)(startValue);
        endValue = (0, _helper.encodeLineJoin)(endValue);
      }

      if (base && k && index !== undefined) {
        this.convertToAnimatableProperty(base, k);
        this.addKeyframe(base, k, index, startFrame, startValue, easing, wrap);
        this.addKeyframe(base, k, index, endFrame, endValue, undefined, wrap);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sYXllci50cyJdLCJuYW1lcyI6WyJKU01vdmluTGF5ZXIiLCJrZXkiLCJzIiwiayIsImUiLCJvIiwidHJhbnNmb3JtIiwiYSIsImdldERlZmF1bHRQcm9wZXJ0eSIsInN0YXRpY1ZhbHVlIiwiaWR4IiwidGltZSIsInZhbHVlIiwiZWFzaW5nIiwid3JhcCIsImV4aXN0S2V5ZnJhbWUiLCJmaWx0ZXIiLCJ4IiwidCIsInJlYWR5VG9TZXQiLCJsZW5ndGgiLCJwcmV2aW91c0tleWZyYW1lQ291bnQiLCJyZWR1Y2UiLCJwIiwic3BsaWNlIiwieSIsImkiLCJBcnJheSIsInJvb3QiLCJzaGFwZXMiLCJpdCIsImZpbmQiLCJzaGFwZSIsInR5IiwiZmluZFByb3BlcnR5Q29uZmlnIiwiaGFzVHJhbnNmb3JtIiwiY29uZmlnIiwiZ3JvdXBTaGFwZXMiLCJwdXNoIiwiYmFzZSIsImluZGV4Iiwia3MiLCJmaW5kT3JJbnNlcnRQcm9wZXJ0eUNvbmZpZyIsInJlZiIsIm9wIiwiY29tbW9uUHJvcGVydHlNYXBwaW5nIiwidW5kZWZpbmVkIiwiZG9jIiwiZCIsImNvbnNvbGUiLCJlcnJvciIsIkVycm9yIiwiY29udmVydFRvU3RhdGljUHJvcGVydHkiLCJzdGFydEZyYW1lIiwiZW5kRnJhbWUiLCJzdGFydFZhbHVlIiwiZW5kVmFsdWUiLCJFYXNpbmdGYWN0b3J5IiwibGluZWFyIiwidGV4dFByb3AiLCJ0bXBTdGFydFZhbHVlIiwiSlNPTiIsInBhcnNlIiwic3RyaW5naWZ5IiwidG1wRW5kVmFsdWUiLCJjb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkiLCJhZGRLZXlmcmFtZSIsIkxheWVyRmFjdG9yeSIsImNvb3JkaW5hdGUiLCJyIiwiZG9tIiwiYm91bmRpbmdCb3giLCJtYXAiLCJ2IiwicmVjdCIsImxheWVyIiwiZGRkIiwic3IiLCJhbyIsImdlbmVyYXRlVHJhbnNmb3JtIiwiaXAiLCJzdCIsImJtIiwibGVmdCIsInRvcCIsIndpZHRoIiwiaGVpZ2h0IiwiY3giLCJjeSIsInJ4IiwicnkiLCJhc3NldExpc3QiLCJmb250TGlzdCIsImRvbVR5cGUiLCJTVkdUZXh0RWxlbWVudCIsIlNWR0ltYWdlRWxlbWVudCIsIlNWR0dFbGVtZW50IiwicHJlY29tcExheWVyIiwiZG9tTGVhdmVzIiwicHJlQ29tcEFzc2V0IiwicHJlQ29tcFJlZklkIiwiZm9yRWFjaCIsIlNWR0dyYXBoaWNzRWxlbWVudCIsInVuc2hpZnQiLCJoaWVyYXJjaHkiLCJ3IiwiaCIsInJlZklkIiwiaWQiLCJsYXllcnMiLCJpbWFnZUxheWVyIiwiaW1hZ2VSZWZJZCIsImltYWdlQXNzZXQiLCJzaGFwZUxheWVyIiwidGV4dExheWVyIiwiYmFzZUxpbmVIZWlnaHQiLCJ0ZXh0RGF0YSIsImZvbnQiLCJsaXN0IiwiZiIsImZOYW1lIiwibW92aW5MYXllciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUlhQSxZOzs7Ozt1Q0FFa0JDLEcsRUFBYTtBQUNwQyxjQUFRQSxHQUFSO0FBQ0ksYUFBSyxHQUFMO0FBQ0EsYUFBSyxHQUFMO0FBQ0ksaUJBQU8sQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsQ0FBUDs7QUFDSixhQUFLLEdBQUw7QUFDSSxpQkFBTyxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxDQUFQOztBQUNKLGFBQUssR0FBTDtBQUNJLGlCQUFPLEdBQVA7O0FBQ0osYUFBSyxHQUFMO0FBQ0ksaUJBQU8sQ0FBUDs7QUFDSixhQUFLLElBQUw7QUFDSSxpQkFBTztBQUNIQyxZQUFBQSxDQUFDLEVBQUU7QUFDQ0MsY0FBQUEsQ0FBQyxFQUFFLENBQUMsQ0FBRDtBQURKLGFBREE7QUFJSEMsWUFBQUEsQ0FBQyxFQUFFO0FBQ0NELGNBQUFBLENBQUMsRUFBRSxDQUFDLEdBQUQ7QUFESixhQUpBO0FBT0hFLFlBQUFBLENBQUMsRUFBRTtBQUNDRixjQUFBQSxDQUFDLEVBQUUsQ0FBQyxD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QUlBLENBQUMsQ0FBQ0MsS0FBRixJQUFXSCxJQUFJLENBQUNHLEtBQXBCO0FBQUEsV0FBdkIsRUFBa0RwRyxNQUF2RCxFQUNJd0UsUUFBUSxDQUFDMEIsSUFBVCxDQUFlaEYsSUFBZixDQUFvQitFLElBQXBCO0FBQ0o7QUE1Q1I7O0FBOENBLFVBQU1JLFVBQVUsR0FBRyxJQUFJekgsWUFBSixDQUFpQjJFLEtBQWpCLENBQW5CO0FBQ0EsYUFBTzhDLFVBQVA7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNoYXBlTGF5ZXIsIFRleHRMYXllciwgSW1hZ2VMYXllciwgVHJhbnNmb3JtLCBBc3NldHMsIEZvbnRzLCBHcm91cFNoYXBlLCBQcmVDb21wTGF5ZXIgfSBmcm9tICcuL2FuaW1hdGlvbidcbmltcG9ydCB7IEVhc2luZ0Z1bmN0aW9uLCBFYXNpbmdGYWN0b3J5IH0gZnJvbSAnLi9lYXNpbmcnXG5pbXBvcnQgeyByZW5kZXJUZXh0LCByZW5kZXIsIHJlbmRlckltYWdlLCByZW5kZXJQbGFpbkdseXBoIH0gZnJvbSAnLi9yZW5kZXInO1xuaW1wb3J0IHsgZ2V0Qm91bmRpbmdCb3gsIGdldExlYWZOb2RlcywgZ2V0QmFzZWxpbmVIZWlnaHQsIGVuY29kZUxpbmVDYXAsIGVuY29kZUxpbmVKb2luIH0gZnJvbSAnLi9oZWxwZXInXG5pbXBvcnQgdXVpZCBmcm9tICd1dWlkL3Y0JztcblxudHlwZSBTZXRhYmxlS2V5cyA9IFwic2NhbGVYXCIgfCBcInNjYWxlWVwiIHwgXCJhbmNob3JYXCIgfCBcImFuY2hvcllcIiB8IFwieFwiIHwgXCJ5XCIgfCBcInJvdGF0ZVwiIHwgXCJvcGFjaXR5XCIgfCAnc2hhcGUnIHwgJ2ZpbGxDb2xvcicgfCAndHJpbVN0YXJ0JyB8ICd0cmltRW5kJyB8ICd0cmltT2Zmc2V0JyB8ICdzdHJva2VDb2xvcicgfCAnc3Ryb2tlV2lkdGgnIHwgJ3RleHQnIHwgJ2ZpbGxPcGFjaXR5JyB8ICdzdHJva2VPcGFjaXR5JyB8ICdsaW5lQ2FwJyB8ICdsaW5lSm9pbidcblxuZXhwb3J0IGNsYXNzIEpTTW92aW5MYXllciB7XG4gICAgcHVibGljIHJlYWRvbmx5IHJvb3Q6IFNoYXBlTGF5ZXIgfCBUZXh0TGF5ZXIgfCBJbWFnZUxheWVyIHwgUHJlQ29tcExheWVyO1xuICAgIHByaXZhdGUgZ2V0RGVmYXVsdFByb3BlcnR5KGtleTogc3RyaW5nKSB7XG4gICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgICAgICBjYXNlICdhJzpcbiAgICAgICAgICAgIGNhc2UgJ3AnOlxuICAgICAgICAgICAgICAgIHJldHVybiBbMCwgMCwgMF1cbiAgICAgICAgICAgIGNhc2UgJ3MnOlxuICAgICAgICAgICAgICAgIHJldHVybiBbMTAwLCAxMDAsIDEwMF1cbiAgICAgICAgICAgIGNhc2UgJ28nOlxuICAgICAgICAgICAgICAgIHJldHVybiAxMDBcbiAgICAgICAgICAgIGNhc2UgJ3InOlxuICAgICAgICAgICAgICAgIHJldHVybiAwXG4gICAgICAgICAgICBjYXNlICd0bSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgazogWzBdXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGs6IFsxMDBdXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG86IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGs6IFswXVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gMFxuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgY29udmVydFRvU3RhdGljUHJvcGVydHkodHJhbnNmb3JtOiBhbnksIGtleTogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdHJhbnNmb3JtW2tleV0pIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybVtrZXldID0ge1xuICAgICAgICAgICAgICAgIGE6IDAsXG4gICAgICAgICAgICAgICAgazogdGhpcy5nZXREZWZhdWx0UHJvcGVydHkoa2V5KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0cmFuc2Zvcm1ba2V5XS5hID09IDEpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRpY1ZhbHVlID0gdHJhbnNmb3JtW2tleV0ua1swXS5zXG4gICAgICAgICAgICB0cmFuc2Zvcm1ba2V5XSA9IHtcbiAgICAgICAgICAgICAgICBhOiAwLFxuICAgICAgICAgICAgICAgIGs6IHN0YXRpY1ZhbHVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBjb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkodHJhbnNmb3JtOiBhbnksIGtleTogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdHJhbnNmb3JtW2tleV0gfHwgIXRyYW5zZm9ybVtrZXldLmEpIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybVtrZXldID0ge1xuICAgICAgICAgICAgICAgIGE6IDEsXG4gICAgICAgICAgICAgICAgazogW11cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGFkZEtleWZyYW1lKHRyYW5zZm9ybTogYW55LCBrZXk6IHN0cmluZywgaWR4OiBudW1iZXIgPSAtMSwgdGltZTogbnVtYmVyLCB2YWx1ZTogQXJyYXk8YW55PiwgZWFzaW5nPzogRWFzaW5nRnVuY3Rpb24sIHdyYXA6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgICAgIGNvbnN0IGV4aXN0S2V5ZnJhbWUgPSB0cmFuc2Zvcm1ba2V5XS5rLmZpbHRlcigoeDogYW55KSA9PiB4LnQgPT0gdGltZSkgYXMgYW55W11cbiAgICAgICAgbGV0IHJlYWR5VG9TZXQ7XG4gICAgICAgIGlmIChleGlzdEtleWZyYW1lLmxlbmd0aCkge1xuICAgICAgICAgICAgcmVhZHlUb1NldCA9IGV4aXN0S2V5ZnJhbWVbMF1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlYWR5VG9TZXQgPSB7XG4gICAgICAgICAgICAgICAgdDogdGltZSxcbiAgICAgICAgICAgICAgICBzOiB0aGlzLmdldERlZmF1bHRQcm9wZXJ0eShrZXkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBwcmV2aW91c0tleWZyYW1lQ291bnQgPSB0cmFuc2Zvcm1ba2V5XS5rLnJlZHVjZSgocDogbnVtYmVyLCB4OiBhbnkpID0+IHgudCA8IHRpbWUgPyBwICsgMSA6IHAsIDApXG4gICAgICAgICAgICB0cmFuc2Zvcm1ba2V5XS5rLnNwbGljZShwcmV2aW91c0tleWZyYW1lQ291bnQsIDAsIHJlYWR5VG9TZXQpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVhc2luZykge1xuICAgICAgICAgICAgcmVhZHlUb1NldC5vID0ge1xuICAgICAgICAgICAgICAgIHg6IGVhc2luZ1swXVswXSxcbiAgICAgICAgICAgICAgICB5OiBlYXNpbmdbMF1bMV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlYWR5VG9TZXQuaSA9IHtcbiAgICAgICAgICAgICAgICB4OiBlYXNpbmdbMV1bMF0sXG4gICAgICAgICAgICAgICAgeTogZWFzaW5nWzFdWzFdXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICAgICAgICByZWFkeVRvU2V0LnNbaWR4XSA9IHZhbHVlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWFkeVRvU2V0LnMgPSB3cmFwICYmICEodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkgPyBbdmFsdWVdIDogdmFsdWVcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGZpbmRQcm9wZXJ0eUNvbmZpZyhrZXk6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gKCh0aGlzLnJvb3QgYXMgU2hhcGVMYXllcikuc2hhcGVzIVswXSBhcyBHcm91cFNoYXBlKS5pdCEuZmluZChzaGFwZSA9PlxuICAgICAgICAgICAgc2hhcGUudHkgPT0ga2V5XG4gICAgICAgIClcbiAgICB9XG4gICAgcHJpdmF0ZSBmaW5kT3JJbnNlcnRQcm9wZXJ0eUNvbmZpZyhrZXk6IHN0cmluZykge1xuICAgICAgICBjb25zdCBmaW5kID0gdGhpcy5maW5kUHJvcGVydHlDb25maWcoa2V5KVxuICAgICAgICBpZiAoZmluZCkgcmV0dXJuIGZpbmRcbiAgICAgICAgY29uc3QgaGFzVHJhbnNmb3JtID0gdGhpcy5maW5kUHJvcGVydHlDb25maWcoJ3RyJylcbiAgICAgICAgY29uc3QgY29uZmlnID0ge1xuICAgICAgICAgICAgdHk6IGtleSxcbiAgICAgICAgICAgIC4uLnRoaXMuZ2V0RGVmYXVsdFByb3BlcnR5KGtleSkgYXMgb2JqZWN0XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhhc1RyYW5zZm9ybSkge1xuICAgICAgICAgICAgY29uc3QgZ3JvdXBTaGFwZXMgPSAoKHRoaXMucm9vdCBhcyBTaGFwZUxheWVyKS5zaGFwZXMhWzBdIGFzIEdyb3VwU2hhcGUpLml0IVxuICAgICAgICAgICAgZ3JvdXBTaGFwZXMuc3BsaWNlKGdyb3VwU2hhcGVzLmxlbmd0aCAtIDEsIDAsIGNvbmZpZylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICgodGhpcy5yb290IGFzIFNoYXBlTGF5ZXIpLnNoYXBlcyFbMF0gYXMgR3JvdXBTaGFwZSkuaXQhLnB1c2goY29uZmlnKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb25maWdcbiAgICB9XG4gICAgcHJpdmF0ZSBjb21tb25Qcm9wZXJ0eU1hcHBpbmcoa2V5OiBTZXRhYmxlS2V5cyk6IFthbnksIHN0cmluZyB8IHVuZGVmaW5lZCwgbnVtYmVyIHwgdW5kZWZpbmVkXSB7XG4gICAgICAgIGxldCBiYXNlOiBhbnksIGs6IHN0cmluZyB8IHVuZGVmaW5lZCwgaW5kZXg6IG51bWJlciB8IHVuZGVmaW5lZFxuICAgICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICAgICAgY2FzZSAnc2NhbGVYJzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXG4gICAgICAgICAgICAgICAgayA9ICdzJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gMFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdzY2FsZVknOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLnJvb3Qua3NcbiAgICAgICAgICAgICAgICBrID0gJ3MnXG4gICAgICAgICAgICAgICAgaW5kZXggPSAxXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ2FuY2hvclgnOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLnJvb3Qua3NcbiAgICAgICAgICAgICAgICBrID0gJ2EnXG4gICAgICAgICAgICAgICAgaW5kZXggPSAwXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ2FuY2hvclknOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLnJvb3Qua3NcbiAgICAgICAgICAgICAgICBrID0gJ2EnXG4gICAgICAgICAgICAgICAgaW5kZXggPSAxXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3gnOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLnJvb3Qua3NcbiAgICAgICAgICAgICAgICBrID0gJ3AnXG4gICAgICAgICAgICAgICAgaW5kZXggPSAwXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3knOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLnJvb3Qua3NcbiAgICAgICAgICAgICAgICBrID0gJ3AnXG4gICAgICAgICAgICAgICAgaW5kZXggPSAxXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3JvdGF0ZSc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMucm9vdC5rc1xuICAgICAgICAgICAgICAgIGsgPSAncidcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ29wYWNpdHknOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLnJvb3Qua3NcbiAgICAgICAgICAgICAgICBrID0gJ28nXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICd0cmltU3RhcnQnOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLmZpbmRPckluc2VydFByb3BlcnR5Q29uZmlnKCd0bScpXG4gICAgICAgICAgICAgICAgayA9ICdzJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAndHJpbUVuZCc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZE9ySW5zZXJ0UHJvcGVydHlDb25maWcoJ3RtJylcbiAgICAgICAgICAgICAgICBrID0gJ2UnXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICd0cmltT2Zmc2V0JzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kT3JJbnNlcnRQcm9wZXJ0eUNvbmZpZygndG0nKVxuICAgICAgICAgICAgICAgIGsgPSAnbydcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ2ZpbGxDb2xvcic6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZFByb3BlcnR5Q29uZmlnKCdmbCcpXG4gICAgICAgICAgICAgICAgayA9ICdjJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnc3Ryb2tlQ29sb3InOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLmZpbmRQcm9wZXJ0eUNvbmZpZygnc3QnKVxuICAgICAgICAgICAgICAgIGsgPSAnYydcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3N0cm9rZVdpZHRoJzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kUHJvcGVydHlDb25maWcoJ3N0JylcbiAgICAgICAgICAgICAgICBrID0gJ3cnXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdzaGFwZSc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZFByb3BlcnR5Q29uZmlnKCdzaCcpXG4gICAgICAgICAgICAgICAgayA9ICdrcydcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ2ZpbGxPcGFjaXR5JzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kUHJvcGVydHlDb25maWcoJ2ZsJylcbiAgICAgICAgICAgICAgICBrID0gJ28nXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdzdHJva2VPcGFjaXR5JzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kUHJvcGVydHlDb25maWcoJ3N0JylcbiAgICAgICAgICAgICAgICBrID0gJ28nXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdsaW5lQ2FwJzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kUHJvcGVydHlDb25maWcoJ3N0JylcbiAgICAgICAgICAgICAgICBrID0gJ2xjJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnbGluZUpvaW4nOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLmZpbmRQcm9wZXJ0eUNvbmZpZygnc3QnKVxuICAgICAgICAgICAgICAgIGsgPSAnbGonXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtiYXNlLCBrLCBpbmRleF1cbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihyZWY6IFNoYXBlTGF5ZXIgfCBUZXh0TGF5ZXIgfCBJbWFnZUxheWVyIHwgUHJlQ29tcExheWVyKSB7XG4gICAgICAgIHRoaXMucm9vdCA9IHJlZlxuICAgIH1cblxuICAgIHNldFN0YXRpY1Byb3BlcnR5KGtleTogU2V0YWJsZUtleXMsIHZhbHVlOiBhbnkpIHtcbiAgICAgICAgdGhpcy5yb290Lm9wID0gMVxuICAgICAgICBsZXQgYmFzZTogYW55LCBrOiBzdHJpbmcgfCB1bmRlZmluZWQsIGluZGV4OiBudW1iZXIgfCB1bmRlZmluZWRcbiAgICAgICAgW2Jhc2UsIGssIGluZGV4XSA9IHRoaXMuY29tbW9uUHJvcGVydHlNYXBwaW5nKGtleSlcbiAgICAgICAgaWYgKCFrIHx8IGluZGV4ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgICAgICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnJvb3QudHkgPT0gNSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZG9jID0gdGhpcy5yb290LnQhLmQhXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2MuayA9IFtkb2MuayFbMF1dXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2Mua1swXS50ID0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jLmtbMF0ucyEudCA9IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGtleSwgdmFsdWUpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGEgdmFsaWQga2V5LicpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGtleSA9PT0gJ2xpbmVDYXAnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGVuY29kZUxpbmVDYXAodmFsdWUpXG4gICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnbGluZUpvaW4nKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGVuY29kZUxpbmVKb2luKHZhbHVlKVxuICAgICAgICB9XG4gICAgICAgIGlmIChiYXNlICYmIGsgJiYgaW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9TdGF0aWNQcm9wZXJ0eShiYXNlLCBrKVxuICAgICAgICAgICAgaWYgKGluZGV4ID49IDApXG4gICAgICAgICAgICAgICAgYmFzZVtrXS5rW2luZGV4XSA9IHZhbHVlXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgYmFzZVtrXS5rID0gdmFsdWVcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldEFuaW1hdGFibGVQcm9wZXJ0eShrZXk6IFNldGFibGVLZXlzLCBzdGFydEZyYW1lOiBudW1iZXIsIGVuZEZyYW1lOiBudW1iZXIsIHN0YXJ0VmFsdWU6IGFueSwgZW5kVmFsdWU6IGFueSwgZWFzaW5nPzogRWFzaW5nRnVuY3Rpb24pIHtcbiAgICAgICAgaWYgKGVuZEZyYW1lIDw9IHN0YXJ0RnJhbWUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRW5kIGZyYW1lIHNob3VsZCBiZSBsYXJnZXIgdGhhbiBzdGFydCBmcmFtZS4nKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucm9vdC5vcCA9IGVuZEZyYW1lICsgMVxuICAgICAgICBpZiAoIWVhc2luZykge1xuICAgICAgICAgICAgZWFzaW5nID0gRWFzaW5nRmFjdG9yeS5saW5lYXIoKVxuICAgICAgICB9XG4gICAgICAgIGxldCBiYXNlOiBhbnksIGs6IHN0cmluZyB8IHVuZGVmaW5lZCwgaW5kZXg6IG51bWJlciB8IHVuZGVmaW5lZCwgd3JhcCA9IHRydWU7XG4gICAgICAgIFtiYXNlLCBrLCBpbmRleF0gPSB0aGlzLmNvbW1vblByb3BlcnR5TWFwcGluZyhrZXkpXG4gICAgICAgIGlmICghayB8fCBpbmRleCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5yb290LnR5ID09IDUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLnJvb3QudFxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRleHRQcm9wID0gYmFzZS5kLmtbMF0uc1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRtcFN0YXJ0VmFsdWUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRleHRQcm9wKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0bXBFbmRWYWx1ZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGV4dFByb3ApKVxuICAgICAgICAgICAgICAgICAgICAgICAgdG1wU3RhcnRWYWx1ZS50ID0gc3RhcnRWYWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgdG1wRW5kVmFsdWUudCA9IGVuZFZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlID0gdG1wU3RhcnRWYWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSB0bXBFbmRWYWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgayA9ICdkJ1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgICAgICAgICAgd3JhcCA9IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGtleSwgc3RhcnRGcmFtZSwgZW5kRnJhbWUsIHN0YXJ0VmFsdWUsIGVuZFZhbHVlLCBlYXNpbmcpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGEgdmFsaWQga2V5LicpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGtleSA9PT0gJ2xpbmVDYXAnKSB7XG4gICAgICAgICAgICBzdGFydFZhbHVlID0gZW5jb2RlTGluZUNhcChzdGFydFZhbHVlKVxuICAgICAgICAgICAgZW5kVmFsdWUgPSBlbmNvZGVMaW5lQ2FwKGVuZFZhbHVlKVxuICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ2xpbmVKb2luJykge1xuICAgICAgICAgICAgc3RhcnRWYWx1ZSA9IGVuY29kZUxpbmVKb2luKHN0YXJ0VmFsdWUpXG4gICAgICAgICAgICBlbmRWYWx1ZSA9IGVuY29kZUxpbmVKb2luKGVuZFZhbHVlKVxuICAgICAgICB9XG4gICAgICAgIGlmIChiYXNlICYmIGsgJiYgaW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkoYmFzZSwgaylcbiAgICAgICAgICAgIHRoaXMuYWRkS2V5ZnJhbWUoYmFzZSwgaywgaW5kZXgsIHN0YXJ0RnJhbWUsIHN0YXJ0VmFsdWUsIGVhc2luZywgd3JhcClcbiAgICAgICAgICAgIHRoaXMuYWRkS2V5ZnJhbWUoYmFzZSwgaywgaW5kZXgsIGVuZEZyYW1lLCBlbmRWYWx1ZSwgdW5kZWZpbmVkLCB3cmFwKVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTGF5ZXJGYWN0b3J5IHtcbiAgICBwcml2YXRlIHN0YXRpYyBnZW5lcmF0ZVRyYW5zZm9ybShjb29yZGluYXRlOiBudW1iZXJbXSk6IFRyYW5zZm9ybSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvOiB7XG4gICAgICAgICAgICAgICAgYTogMCxcbiAgICAgICAgICAgICAgICBrOiAxMDBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByOiB7XG4gICAgICAgICAgICAgICAgYTogMCxcbiAgICAgICAgICAgICAgICBrOiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcDoge1xuICAgICAgICAgICAgICAgIGE6IDAsXG4gICAgICAgICAgICAgICAgazogW1xuICAgICAgICAgICAgICAgICAgICBjb29yZGluYXRlWzBdLFxuICAgICAgICAgICAgICAgICAgICBjb29yZGluYXRlWzFdLFxuICAgICAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGE6IHtcbiAgICAgICAgICAgICAgICBhOiAwLFxuICAgICAgICAgICAgICAgIGs6IFtcbiAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzOiB7XG4gICAgICAgICAgICAgICAgYTogMCxcbiAgICAgICAgICAgICAgICBrOiBbXG4gICAgICAgICAgICAgICAgICAgIDEwMCxcbiAgICAgICAgICAgICAgICAgICAgMTAwLFxuICAgICAgICAgICAgICAgICAgICAxMDBcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgYm91bmRpbmdCb3goZG9tOiBTVkdHcmFwaGljc0VsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgYm91bmRpbmdCb3ggPSBnZXRCb3VuZGluZ0JveChkb20pLm1hcCgodiwgaSkgPT4gaSA8IDIgPyB2IC0gMSA6IHYgKyAxKSBhcyBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXVxuICAgICAgICByZXR1cm4gdGhpcy5yZWN0KC4uLmJvdW5kaW5nQm94KVxuICAgIH1cblxuICAgIHN0YXRpYyBzaGFwZShkb206IFNWR1BhdGhFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IGNvb3JkaW5hdGUgPSBnZXRCb3VuZGluZ0JveChkb20pXG4gICAgICAgIGNvbnN0IGxheWVyOiBTaGFwZUxheWVyID0ge1xuICAgICAgICAgICAgdHk6IDQsXG4gICAgICAgICAgICBkZGQ6IDAsXG4gICAgICAgICAgICBzcjogMSxcbiAgICAgICAgICAgIGFvOiAwLFxuICAgICAgICAgICAga3M6IHRoaXMuZ2VuZXJhdGVUcmFuc2Zvcm0oY29vcmRpbmF0ZSksXG4gICAgICAgICAgICBpcDogMCxcbiAgICAgICAgICAgIG9wOiAxLFxuICAgICAgICAgICAgc3Q6IDAsXG4gICAgICAgICAgICBibTogMCxcbiAgICAgICAgICAgIHNoYXBlczogcmVuZGVyKGRvbSlcblxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgSlNNb3ZpbkxheWVyKGxheWVyKVxuICAgIH1cblxuICAgIHN0YXRpYyByZWN0KGxlZnQ6IG51bWJlciwgdG9wOiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGxheWVyOiBTaGFwZUxheWVyID0ge1xuICAgICAgICAgICAgdHk6IDQsXG4gICAgICAgICAgICBkZGQ6IDAsXG4gICAgICAgICAgICBzcjogMSxcbiAgICAgICAgICAgIGFvOiAwLFxuICAgICAgICAgICAga3M6IHRoaXMuZ2VuZXJhdGVUcmFuc2Zvcm0oW2xlZnQsIHRvcCwgd2lkdGgsIGhlaWdodF0pLFxuICAgICAgICAgICAgaXA6IDAsXG4gICAgICAgICAgICBvcDogMSxcbiAgICAgICAgICAgIHN0OiAwLFxuICAgICAgICAgICAgYm06IDAsXG4gICAgICAgICAgICBzaGFwZXM6IFtcbiAgICAgICAgICAgICAgICByZW5kZXJQbGFpbkdseXBoKCdyZWN0JywgW3dpZHRoLCBoZWlnaHRdKVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgSlNNb3ZpbkxheWVyKGxheWVyKVxuICAgIH1cblxuICAgIHN0YXRpYyBlbGxpcHNlKGN4OiBudW1iZXIsIGN5OiBudW1iZXIsIHJ4OiBudW1iZXIsIHJ5OiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgbGF5ZXI6IFNoYXBlTGF5ZXIgPSB7XG4gICAgICAgICAgICB0eTogNCxcbiAgICAgICAgICAgIGRkZDogMCxcbiAgICAgICAgICAgIHNyOiAxLFxuICAgICAgICAgICAgYW86IDAsXG4gICAgICAgICAgICBrczogdGhpcy5nZW5lcmF0ZVRyYW5zZm9ybShbY3ggLSByeCwgY3kgLSByeSwgMiAqIHJ4LCAyICogcnldKSxcbiAgICAgICAgICAgIGlwOiAwLFxuICAgICAgICAgICAgb3A6IDEsXG4gICAgICAgICAgICBzdDogMCxcbiAgICAgICAgICAgIGJtOiAwLFxuICAgICAgICAgICAgc2hhcGVzOiBbXG4gICAgICAgICAgICAgICAgcmVuZGVyUGxhaW5HbHlwaCgnZWxsaXBzZScsIFtyeCwgcnldKVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgSlNNb3ZpbkxheWVyKGxheWVyKVxuICAgIH1cblxuICAgIHN0YXRpYyBoaWVyYXJjaHkoZG9tOiBTVkdHcmFwaGljc0VsZW1lbnQsIGFzc2V0TGlzdDogQXNzZXRzLCBmb250TGlzdDogRm9udHMpIHtcbiAgICAgICAgY29uc3QgY29vcmRpbmF0ZSA9IGdldEJvdW5kaW5nQm94KGRvbSlcbiAgICAgICAgbGV0IGRvbVR5cGU6IDIgfCA0IHwgNSB8IDA7XG4gICAgICAgIGlmIChkb20gaW5zdGFuY2VvZiBTVkdUZXh0RWxlbWVudCkge1xuICAgICAgICAgICAgZG9tVHlwZSA9IDVcbiAgICAgICAgfSBlbHNlIGlmIChkb20gaW5zdGFuY2VvZiBTVkdJbWFnZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIGRvbVR5cGUgPSAyXG4gICAgICAgIH0gZWxzZSBpZiAoZG9tIGluc3RhbmNlb2YgU1ZHR0VsZW1lbnQpIHtcbiAgICAgICAgICAgIGRvbVR5cGUgPSAwXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb21UeXBlID0gNFxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxheWVyOiBTaGFwZUxheWVyIHwgSW1hZ2VMYXllciB8IFRleHRMYXllciB8IFByZUNvbXBMYXllciA9IHtcbiAgICAgICAgICAgIHR5OiBkb21UeXBlLFxuICAgICAgICAgICAgZGRkOiAwLFxuICAgICAgICAgICAgc3I6IDEsXG4gICAgICAgICAgICBhbzogMCxcbiAgICAgICAgICAgIGtzOiB0aGlzLmdlbmVyYXRlVHJhbnNmb3JtKGRvbVR5cGUgPT0gMCA/IFswLCAwLCAwLCAwXSA6IGNvb3JkaW5hdGUpLFxuICAgICAgICAgICAgaXA6IDAsXG4gICAgICAgICAgICBvcDogMSxcbiAgICAgICAgICAgIHN0OiAwLFxuICAgICAgICAgICAgYm06IDBcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKGRvbVR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBjb25zdCBwcmVjb21wTGF5ZXIgPSBsYXllciBhcyBQcmVDb21wTGF5ZXJcbiAgICAgICAgICAgICAgICBjb25zdCBkb21MZWF2ZXMgPSBnZXRMZWFmTm9kZXMoZG9tKVxuICAgICAgICAgICAgICAgIGNvbnN0IHByZUNvbXBBc3NldDogSlNNb3ZpbkxheWVyW10gPSBbXVxuICAgICAgICAgICAgICAgIGNvbnN0IHByZUNvbXBSZWZJZCA9IHV1aWQoKVxuICAgICAgICAgICAgICAgIGRvbUxlYXZlcy5mb3JFYWNoKGQgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZCBpbnN0YW5jZW9mIFNWR0dyYXBoaWNzRWxlbWVudCAmJiAhKGQgaW5zdGFuY2VvZiBTVkdHRWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZUNvbXBBc3NldC51bnNoaWZ0KHRoaXMuaGllcmFyY2h5KGQsIGFzc2V0TGlzdCwgZm9udExpc3QpKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBwcmVDb21wQXNzZXQuZm9yRWFjaChsYXllciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxheWVyLnJvb3Qub3AgPSA5ZTlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIHByZWNvbXBMYXllci53ID0gY29vcmRpbmF0ZVswXSArIGNvb3JkaW5hdGVbMl0gKyAxXG4gICAgICAgICAgICAgICAgcHJlY29tcExheWVyLmggPSBjb29yZGluYXRlWzFdICsgY29vcmRpbmF0ZVszXSArIDFcbiAgICAgICAgICAgICAgICBwcmVjb21wTGF5ZXIucmVmSWQgPSBwcmVDb21wUmVmSWRcbiAgICAgICAgICAgICAgICBhc3NldExpc3QucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGlkOiBwcmVDb21wUmVmSWQsXG4gICAgICAgICAgICAgICAgICAgIGxheWVyczogcHJlQ29tcEFzc2V0Lm1hcChsYXllciA9PiBsYXllci5yb290KVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBjb25zdCBpbWFnZUxheWVyID0gbGF5ZXIgYXMgSW1hZ2VMYXllclxuICAgICAgICAgICAgICAgIGNvbnN0IFtpbWFnZVJlZklkLCBpbWFnZUFzc2V0XSA9IHJlbmRlckltYWdlKGRvbSBhcyBTVkdJbWFnZUVsZW1lbnQsIGFzc2V0TGlzdClcbiAgICAgICAgICAgICAgICBpbWFnZUxheWVyLnJlZklkID0gaW1hZ2VSZWZJZFxuICAgICAgICAgICAgICAgIGlmICghYXNzZXRMaXN0LmZpbHRlcihhID0+IGEuaWQgPT0gaW1hZ2VSZWZJZCkubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICBhc3NldExpc3QucHVzaChpbWFnZUFzc2V0KVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgY29uc3Qgc2hhcGVMYXllciA9IGxheWVyIGFzIFNoYXBlTGF5ZXJcbiAgICAgICAgICAgICAgICBzaGFwZUxheWVyLnNoYXBlcyA9IHJlbmRlcihkb20pXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0TGF5ZXIgPSBsYXllciBhcyBUZXh0TGF5ZXJcblxuICAgICAgICAgICAgICAgIC8vIG1vdmUgdGV4dExheWVyJ3MgYW5jaG9yIHRvIGxlZnQtdG9wXG4gICAgICAgICAgICAgICAgY29uc3QgYmFzZUxpbmVIZWlnaHQgPSBnZXRCYXNlbGluZUhlaWdodChkb20gYXMgU1ZHVGV4dEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgdGV4dExheWVyLmtzIS5hIS5rID0gWzAsIGJhc2VMaW5lSGVpZ2h0IC0gY29vcmRpbmF0ZVszXSwgMF1cblxuICAgICAgICAgICAgICAgIGNvbnN0IFt0ZXh0RGF0YSwgZm9udF0gPSByZW5kZXJUZXh0KGRvbSBhcyBTVkdUZXh0RWxlbWVudCwgZm9udExpc3QpXG4gICAgICAgICAgICAgICAgdGV4dExheWVyLnQgPSB0ZXh0RGF0YVxuICAgICAgICAgICAgICAgIGlmICghZm9udExpc3QubGlzdCEuZmlsdGVyKGYgPT4gZi5mTmFtZSA9PSBmb250LmZOYW1lKS5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgIGZvbnRMaXN0Lmxpc3QhLnB1c2goZm9udClcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1vdmluTGF5ZXIgPSBuZXcgSlNNb3ZpbkxheWVyKGxheWVyKVxuICAgICAgICByZXR1cm4gbW92aW5MYXllclxuICAgIH1cbn0iXX0=