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
              k: 0
            },
            e: {
              k: 100
            },
            o: {
              k: 0
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
    key: "ref",
    value: function ref(id) {
      var layer = new JSMovinLayer({
        ty: 0,
        ddd: 0,
        sr: 1,
        ao: 0,
        ks: this.generateTransform([0, 0, 0, 0]),
        ip: 0,
        op: 1,
        st: 0,
        bm: 0,
        w: 9e9,
        h: 9e9,
        refId: id
      });
      return layer;
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
          var domLeaves = (0, _helper.getLeafNodes)(dom);

          if (domLeaves.filter(function (dom) {
            return dom instanceof SVGTextElement || dom instanceof SVGImageElement;
          }).length) {
            var precompLayer = layer;
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
          } else {
            var _shapeLayer = layer;
            _shapeLayer.ty = 4;
            _shapeLayer.ks = this.generateTransform(coordinate);
            _shapeLayer.shapes = (0, _render.render)(dom);
          }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sYXllci50cyJdLCJuYW1lcyI6WyJKU01vdmluTGF5ZXIiLCJrZXkiLCJzIiwiayIsImUiLCJvIiwidHJhbnNmb3JtIiwiYSIsImdldERlZmF1bHRQcm9wZXJ0eSIsInN0YXRpY1ZhbHVlIiwiaWR4IiwidGltZSIsInZhbHVlIiwiZWFzaW5nIiwid3JhcCIsImV4aXN0S2V5ZnJhbWUiLCJmaWx0ZXIiLCJ4IiwidCIsInJlYWR5VG9TZXQiLCJsZW5ndGgiLCJwcmV2aW91c0tleWZyYW1lQ291bnQiLCJyZWR1Y2UiLCJwIiwic3BsaWNlIiwieSIsImkiLCJBcnJheSIsInJvb3QiLCJzaGFwZXMiLCJpdCIsImZpbmQiLCJzaGFwZSIsInR5IiwiZmluZFByb3BlcnR5Q29uZmlnIiwiaGFzVHJhbnNmb3JtIiwiY29uZmlnIiwiZ3JvdXBTaGFwZXMiLCJwdXNoIiwiYmFzZSIsImluZGV4Iiwia3MiLCJmaW5kT3JJbnNlcnRQcm9wZXJ0eUNvbmZpZyIsInJlZiIsIm9wIiwiY29tbW9uUHJvcGVydHlNYXBwaW5nIiwidW5kZWZpbmVkIiwiZG9jIiwiZCIsImNvbnNvbGUiLCJlcnJvciIsIkVycm9yIiwiY29udmVydFRvU3RhdGljUHJvcGVydHkiLCJzdGFydEZyYW1lIiwiZW5kRnJhbWUiLCJzdGFydFZhbHVlIiwiZW5kVmFsdWUiLCJFYXNpbmdGYWN0b3J5IiwibGluZWFyIiwidGV4dFByb3AiLCJ0bXBTdGFydFZhbHVlIiwiSlNPTiIsInBhcnNlIiwic3RyaW5naWZ5IiwidG1wRW5kVmFsdWUiLCJjb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkiLCJhZGRLZXlmcmFtZSIsIkxheWVyRmFjdG9yeSIsImNvb3JkaW5hdGUiLCJyIiwiZG9tIiwiYm91bmRpbmdCb3giLCJtYXAiLCJ2IiwicmVjdCIsImxheWVyIiwiZGRkIiwic3IiLCJhbyIsImdlbmVyYXRlVHJhbnNmb3JtIiwiaXAiLCJzdCIsImJtIiwibGVmdCIsInRvcCIsIndpZHRoIiwiaGVpZ2h0IiwiY3giLCJjeSIsInJ4IiwicnkiLCJpZCIsInciLCJoIiwicmVmSWQiLCJhc3NldExpc3QiLCJmb250TGlzdCIsImRvbVR5cGUiLCJTVkdUZXh0RWxlbWVudCIsIlNWR0ltYWdlRWxlbWVudCIsIlNWR0dFbGVtZW50IiwiZG9tTGVhdmVzIiwicHJlY29tcExheWVyIiwicHJlQ29tcEFzc2V0IiwicHJlQ29tcFJlZklkIiwiZm9yRWFjaCIsIlNWR0dyYXBoaWNzRWxlbWVudCIsInVuc2hpZnQiLCJoaWVyYXJjaHkiLCJsYXllcnMiLCJzaGFwZUxheWVyIiwiaW1hZ2VMYXllciIsImltYWdlUmVmSWQiLCJpbWFnZUFzc2V0IiwidGV4dExheWVyIiwiYmFzZUxpbmVIZWlnaHQiLCJ0ZXh0RGF0YSIsImZvbnQiLCJsaXN0IiwiZiIsImZOYW1lIiwibW92aW5MYXllciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUlhQSxZOzs7Ozt1Q0FFa0JDLEcsRUFBYTtBQUNwQyxjQUFRQSxHQUFSO0FBQ0ksYUFBSyxHQUFMO0FBQ0EsYUFBSyxHQUFMO0FBQ0ksaUJBQU8sQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsQ0FBUDs7QUFDSixhQUFLLEdBQUw7QUFDSSxpQkFBTyxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxDQUFQOztBQUNKLGFBQUssR0FBTDtBQUNJLGlCQUFPLEdBQVA7O0FBQ0osYUFBSyxHQUFMO0FBQ0ksaUJBQU8sQ0FBUDs7QUFDSixhQUFLLElBQUw7QUFDSSxpQkFBTztBQUNIQyxZQUFBQSxDQUFDLEVBQUU7QUFDQ0MsY0FBQUEsQ0FBQyxFQUFFO0FBREosYUFEQTtBQUlIQyxZQUFBQSxDQUFDLEVBQUU7QUFDQ0QsY0FBQUEsQ0FBQyxFQUFFO0FBREosYUFKQTtBQU9IRSxZQUFBQSxDQUFDLEVBQUU7QUFDQ0YsY0FBQUEsQ0FBQyxFQUFFO0FBREo7QUFQQSxXQUFQOztBQVdKO0FBQ0ks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QWtDMEIsUUFBbEMsQ0FQN0I7QUFBQTtBQUFBLGNBT1dvQixRQVBYO0FBQUEsY0FPcUJDLElBUHJCOztBQVFJSCxVQUFBQSxTQUFTLENBQUNoRyxDQUFWLEdBQWNrRyxRQUFkO0FBQ0EsY0FBSSxDQUFDcEIsUUFBUSxDQUFDc0IsSUFBVCxDQUFldEcsTUFBZixDQUFzQixVQUFBdUcsQ0FBQztBQUFBLG1CQUFJQSxDQUFDLENBQUNDLEtBQUYsSUFBV0gsSUFBSSxDQUFDRyxLQUFwQjtBQUFBLFdBQXZCLEVBQWtEcEcsTUFBdkQsRUFDSTRFLFFBQVEsQ0FBQ3NCLElBQVQsQ0FBZWhGLElBQWYsQ0FBb0IrRSxJQUFwQjtBQUNKO0FBbkRSOztBQXFEQSxVQUFNSSxVQUFVLEdBQUcsSUFBSXpILFlBQUosQ0FBaUIyRSxLQUFqQixDQUFuQjtBQUNBLGFBQU84QyxVQUFQO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTaGFwZUxheWVyLCBUZXh0TGF5ZXIsIEltYWdlTGF5ZXIsIFRyYW5zZm9ybSwgQXNzZXRzLCBGb250cywgR3JvdXBTaGFwZSwgUHJlQ29tcExheWVyLCBSZWZlcmVuY2VJRCB9IGZyb20gJy4vYW5pbWF0aW9uJ1xyXG5pbXBvcnQgeyBFYXNpbmdGdW5jdGlvbiwgRWFzaW5nRmFjdG9yeSB9IGZyb20gJy4vZWFzaW5nJ1xyXG5pbXBvcnQgeyByZW5kZXJUZXh0LCByZW5kZXIsIHJlbmRlckltYWdlLCByZW5kZXJQbGFpbkdseXBoIH0gZnJvbSAnLi9yZW5kZXInO1xyXG5pbXBvcnQgeyBnZXRCb3VuZGluZ0JveCwgZ2V0TGVhZk5vZGVzLCBnZXRCYXNlbGluZUhlaWdodCB9IGZyb20gJy4vaGVscGVyJ1xyXG5pbXBvcnQgdXVpZCBmcm9tICd1dWlkL3Y0JztcclxuXHJcbnR5cGUgU2V0YWJsZUtleXMgPSBcInNjYWxlWFwiIHwgXCJzY2FsZVlcIiB8IFwiYW5jaG9yWFwiIHwgXCJhbmNob3JZXCIgfCBcInhcIiB8IFwieVwiIHwgXCJyb3RhdGVcIiB8IFwib3BhY2l0eVwiIHwgJ3NoYXBlJyB8ICdmaWxsQ29sb3InIHwgJ3RyaW1TdGFydCcgfCAndHJpbUVuZCcgfCAndHJpbU9mZnNldCcgfCAnc3Ryb2tlQ29sb3InIHwgJ3N0cm9rZVdpZHRoJyB8ICd0ZXh0JyB8ICdmaWxsT3BhY2l0eScgfCAnc3Ryb2tlT3BhY2l0eSdcclxuXHJcbmV4cG9ydCBjbGFzcyBKU01vdmluTGF5ZXIge1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHJvb3Q6IFNoYXBlTGF5ZXIgfCBUZXh0TGF5ZXIgfCBJbWFnZUxheWVyIHwgUHJlQ29tcExheWVyO1xyXG4gICAgcHJpdmF0ZSBnZXREZWZhdWx0UHJvcGVydHkoa2V5OiBzdHJpbmcpIHtcclxuICAgICAgICBzd2l0Y2ggKGtleSkge1xyXG4gICAgICAgICAgICBjYXNlICdhJzpcclxuICAgICAgICAgICAgY2FzZSAncCc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gWzAsIDAsIDBdXHJcbiAgICAgICAgICAgIGNhc2UgJ3MnOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFsxMDAsIDEwMCwgMTAwXVxyXG4gICAgICAgICAgICBjYXNlICdvJzpcclxuICAgICAgICAgICAgICAgIHJldHVybiAxMDBcclxuICAgICAgICAgICAgY2FzZSAncic6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMFxyXG4gICAgICAgICAgICBjYXNlICd0bSc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgazogMFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBrOiAxMDBcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG86IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgazogMFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHJldHVybiAwXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjb252ZXJ0VG9TdGF0aWNQcm9wZXJ0eSh0cmFuc2Zvcm06IGFueSwga2V5OiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoIXRyYW5zZm9ybVtrZXldKSB7XHJcbiAgICAgICAgICAgIHRyYW5zZm9ybVtrZXldID0ge1xyXG4gICAgICAgICAgICAgICAgYTogMCxcclxuICAgICAgICAgICAgICAgIGs6IHRoaXMuZ2V0RGVmYXVsdFByb3BlcnR5KGtleSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHJhbnNmb3JtW2tleV0uYSA9PSAxKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0YXRpY1ZhbHVlID0gdHJhbnNmb3JtW2tleV0ua1swXS5zXHJcbiAgICAgICAgICAgIHRyYW5zZm9ybVtrZXldID0ge1xyXG4gICAgICAgICAgICAgICAgYTogMCxcclxuICAgICAgICAgICAgICAgIGs6IHN0YXRpY1ZhbHVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNvbnZlcnRUb0FuaW1hdGFibGVQcm9wZXJ0eSh0cmFuc2Zvcm06IGFueSwga2V5OiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoIXRyYW5zZm9ybVtrZXldIHx8ICF0cmFuc2Zvcm1ba2V5XS5hKSB7XHJcbiAgICAgICAgICAgIHRyYW5zZm9ybVtrZXldID0ge1xyXG4gICAgICAgICAgICAgICAgYTogMSxcclxuICAgICAgICAgICAgICAgIGs6IFtdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGFkZEtleWZyYW1lKHRyYW5zZm9ybTogYW55LCBrZXk6IHN0cmluZywgaWR4OiBudW1iZXIgPSAtMSwgdGltZTogbnVtYmVyLCB2YWx1ZTogQXJyYXk8YW55PiwgZWFzaW5nPzogRWFzaW5nRnVuY3Rpb24sIHdyYXA6IGJvb2xlYW4gPSB0cnVlKSB7XHJcbiAgICAgICAgY29uc3QgZXhpc3RLZXlmcmFtZSA9IHRyYW5zZm9ybVtrZXldLmsuZmlsdGVyKCh4OiBhbnkpID0+IHgudCA9PSB0aW1lKSBhcyBhbnlbXVxyXG4gICAgICAgIGxldCByZWFkeVRvU2V0O1xyXG4gICAgICAgIGlmIChleGlzdEtleWZyYW1lLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZWFkeVRvU2V0ID0gZXhpc3RLZXlmcmFtZVswXVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlYWR5VG9TZXQgPSB7XHJcbiAgICAgICAgICAgICAgICB0OiB0aW1lLFxyXG4gICAgICAgICAgICAgICAgczogdGhpcy5nZXREZWZhdWx0UHJvcGVydHkoa2V5KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzS2V5ZnJhbWVDb3VudCA9IHRyYW5zZm9ybVtrZXldLmsucmVkdWNlKChwOiBudW1iZXIsIHg6IGFueSkgPT4geC50IDwgdGltZSA/IHAgKyAxIDogcCwgMClcclxuICAgICAgICAgICAgdHJhbnNmb3JtW2tleV0uay5zcGxpY2UocHJldmlvdXNLZXlmcmFtZUNvdW50LCAwLCByZWFkeVRvU2V0KVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZWFzaW5nKSB7XHJcbiAgICAgICAgICAgIHJlYWR5VG9TZXQubyA9IHtcclxuICAgICAgICAgICAgICAgIHg6IGVhc2luZ1swXVswXSxcclxuICAgICAgICAgICAgICAgIHk6IGVhc2luZ1swXVsxXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlYWR5VG9TZXQuaSA9IHtcclxuICAgICAgICAgICAgICAgIHg6IGVhc2luZ1sxXVswXSxcclxuICAgICAgICAgICAgICAgIHk6IGVhc2luZ1sxXVsxXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpZHggPj0gMCkge1xyXG4gICAgICAgICAgICByZWFkeVRvU2V0LnNbaWR4XSA9IHZhbHVlXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVhZHlUb1NldC5zID0gd3JhcCAmJiAhKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpID8gW3ZhbHVlXSA6IHZhbHVlXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBmaW5kUHJvcGVydHlDb25maWcoa2V5OiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gKCh0aGlzLnJvb3QgYXMgU2hhcGVMYXllcikuc2hhcGVzIVswXSBhcyBHcm91cFNoYXBlKS5pdCEuZmluZChzaGFwZSA9PlxyXG4gICAgICAgICAgICBzaGFwZS50eSA9PSBrZXlcclxuICAgICAgICApXHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGZpbmRPckluc2VydFByb3BlcnR5Q29uZmlnKGtleTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgZmluZCA9IHRoaXMuZmluZFByb3BlcnR5Q29uZmlnKGtleSlcclxuICAgICAgICBpZiAoZmluZCkgcmV0dXJuIGZpbmRcclxuICAgICAgICBjb25zdCBoYXNUcmFuc2Zvcm0gPSB0aGlzLmZpbmRQcm9wZXJ0eUNvbmZpZygndHInKVxyXG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IHtcclxuICAgICAgICAgICAgdHk6IGtleSxcclxuICAgICAgICAgICAgLi4udGhpcy5nZXREZWZhdWx0UHJvcGVydHkoa2V5KSBhcyBvYmplY3RcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGhhc1RyYW5zZm9ybSkge1xyXG4gICAgICAgICAgICBjb25zdCBncm91cFNoYXBlcyA9ICgodGhpcy5yb290IGFzIFNoYXBlTGF5ZXIpLnNoYXBlcyFbMF0gYXMgR3JvdXBTaGFwZSkuaXQhXHJcbiAgICAgICAgICAgIGdyb3VwU2hhcGVzLnNwbGljZShncm91cFNoYXBlcy5sZW5ndGggLSAxLCAwLCBjb25maWcpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgKCh0aGlzLnJvb3QgYXMgU2hhcGVMYXllcikuc2hhcGVzIVswXSBhcyBHcm91cFNoYXBlKS5pdCEucHVzaChjb25maWcpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb25maWdcclxuICAgIH1cclxuICAgIHByaXZhdGUgY29tbW9uUHJvcGVydHlNYXBwaW5nKGtleTogU2V0YWJsZUtleXMpOiBbYW55LCBzdHJpbmcgfCB1bmRlZmluZWQsIG51bWJlciB8IHVuZGVmaW5lZF0ge1xyXG4gICAgICAgIGxldCBiYXNlOiBhbnksIGs6IHN0cmluZyB8IHVuZGVmaW5lZCwgaW5kZXg6IG51bWJlciB8IHVuZGVmaW5lZFxyXG4gICAgICAgIHN3aXRjaCAoa2V5KSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ3NjYWxlWCc6XHJcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXHJcbiAgICAgICAgICAgICAgICBrID0gJ3MnXHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IDBcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ3NjYWxlWSc6XHJcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXHJcbiAgICAgICAgICAgICAgICBrID0gJ3MnXHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IDFcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ2FuY2hvclgnOlxyXG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMucm9vdC5rc1xyXG4gICAgICAgICAgICAgICAgayA9ICdhJ1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSAwXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlICdhbmNob3JZJzpcclxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLnJvb3Qua3NcclxuICAgICAgICAgICAgICAgIGsgPSAnYSdcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gMVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAneCc6XHJcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXHJcbiAgICAgICAgICAgICAgICBrID0gJ3AnXHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IDBcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ3knOlxyXG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMucm9vdC5rc1xyXG4gICAgICAgICAgICAgICAgayA9ICdwJ1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSAxXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlICdyb3RhdGUnOlxyXG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMucm9vdC5rc1xyXG4gICAgICAgICAgICAgICAgayA9ICdyJ1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAnb3BhY2l0eSc6XHJcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXHJcbiAgICAgICAgICAgICAgICBrID0gJ28nXHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlICd0cmltU3RhcnQnOlxyXG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZE9ySW5zZXJ0UHJvcGVydHlDb25maWcoJ3RtJylcclxuICAgICAgICAgICAgICAgIGsgPSAncydcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ3RyaW1FbmQnOlxyXG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZE9ySW5zZXJ0UHJvcGVydHlDb25maWcoJ3RtJylcclxuICAgICAgICAgICAgICAgIGsgPSAnZSdcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ3RyaW1PZmZzZXQnOlxyXG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZE9ySW5zZXJ0UHJvcGVydHlDb25maWcoJ3RtJylcclxuICAgICAgICAgICAgICAgIGsgPSAnbydcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ2ZpbGxDb2xvcic6XHJcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kUHJvcGVydHlDb25maWcoJ2ZsJylcclxuICAgICAgICAgICAgICAgIGsgPSAnYydcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ3N0cm9rZUNvbG9yJzpcclxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLmZpbmRQcm9wZXJ0eUNvbmZpZygnc3QnKVxyXG4gICAgICAgICAgICAgICAgayA9ICdjJ1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAnc3Ryb2tlV2lkdGgnOlxyXG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZFByb3BlcnR5Q29uZmlnKCdzdCcpXHJcbiAgICAgICAgICAgICAgICBrID0gJ3cnXHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlICdzaGFwZSc6XHJcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kUHJvcGVydHlDb25maWcoJ3NoJylcclxuICAgICAgICAgICAgICAgIGsgPSAna3MnXHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlICdmaWxsT3BhY2l0eSc6XHJcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kUHJvcGVydHlDb25maWcoJ2ZsJylcclxuICAgICAgICAgICAgICAgIGsgPSAnbydcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ3N0cm9rZU9wYWNpdHknOlxyXG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZFByb3BlcnR5Q29uZmlnKCdzdCcpXHJcbiAgICAgICAgICAgICAgICBrID0gJ28nXHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW2Jhc2UsIGssIGluZGV4XVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHJlZjogU2hhcGVMYXllciB8IFRleHRMYXllciB8IEltYWdlTGF5ZXIgfCBQcmVDb21wTGF5ZXIpIHtcclxuICAgICAgICB0aGlzLnJvb3QgPSByZWZcclxuICAgIH1cclxuXHJcbiAgICBzZXRTdGF0aWNQcm9wZXJ0eShrZXk6IFNldGFibGVLZXlzLCB2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5yb290Lm9wID0gMVxyXG4gICAgICAgIGxldCBiYXNlOiBhbnksIGs6IHN0cmluZyB8IHVuZGVmaW5lZCwgaW5kZXg6IG51bWJlciB8IHVuZGVmaW5lZFxyXG4gICAgICAgIFtiYXNlLCBrLCBpbmRleF0gPSB0aGlzLmNvbW1vblByb3BlcnR5TWFwcGluZyhrZXkpXHJcbiAgICAgICAgaWYgKCFrIHx8IGluZGV4ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgc3dpdGNoIChrZXkpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3RleHQnOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnJvb3QudHkgPT0gNSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkb2MgPSB0aGlzLnJvb3QudCEuZCFcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jLmsgPSBbZG9jLmshWzBdXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2Mua1swXS50ID0gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2Mua1swXS5zIS50ID0gdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihrZXksIHZhbHVlKVxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGEgdmFsaWQga2V5LicpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGJhc2UgJiYgayAmJiBpbmRleCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udmVydFRvU3RhdGljUHJvcGVydHkoYmFzZSwgaylcclxuICAgICAgICAgICAgaWYgKGluZGV4ID49IDApXHJcbiAgICAgICAgICAgICAgICBiYXNlW2tdLmtbaW5kZXhdID0gdmFsdWVcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgYmFzZVtrXS5rID0gdmFsdWVcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0QW5pbWF0YWJsZVByb3BlcnR5KGtleTogU2V0YWJsZUtleXMsIHN0YXJ0RnJhbWU6IG51bWJlciwgZW5kRnJhbWU6IG51bWJlciwgc3RhcnRWYWx1ZTogYW55LCBlbmRWYWx1ZTogYW55LCBlYXNpbmc/OiBFYXNpbmdGdW5jdGlvbikge1xyXG4gICAgICAgIGlmIChlbmRGcmFtZSA8PSBzdGFydEZyYW1lKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRW5kIGZyYW1lIHNob3VsZCBiZSBsYXJnZXIgdGhhbiBzdGFydCBmcmFtZS4nKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJvb3Qub3AgPSBlbmRGcmFtZSArIDFcclxuICAgICAgICBpZiAoIWVhc2luZykge1xyXG4gICAgICAgICAgICBlYXNpbmcgPSBFYXNpbmdGYWN0b3J5LmxpbmVhcigpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBiYXNlOiBhbnksIGs6IHN0cmluZyB8IHVuZGVmaW5lZCwgaW5kZXg6IG51bWJlciB8IHVuZGVmaW5lZCwgd3JhcCA9IHRydWU7XHJcbiAgICAgICAgW2Jhc2UsIGssIGluZGV4XSA9IHRoaXMuY29tbW9uUHJvcGVydHlNYXBwaW5nKGtleSlcclxuICAgICAgICBpZiAoIWsgfHwgaW5kZXggPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGtleSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAndGV4dCc6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucm9vdC50eSA9PSA1KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLnJvb3QudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGV4dFByb3AgPSBiYXNlLmQua1swXS5zXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0bXBTdGFydFZhbHVlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0ZXh0UHJvcCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0bXBFbmRWYWx1ZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGV4dFByb3ApKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0bXBTdGFydFZhbHVlLnQgPSBzdGFydFZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRtcEVuZFZhbHVlLnQgPSBlbmRWYWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlID0gdG1wU3RhcnRWYWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZSA9IHRtcEVuZFZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGsgPSAnZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAtMVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3cmFwID0gZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihrZXksIHN0YXJ0RnJhbWUsIGVuZEZyYW1lLCBzdGFydFZhbHVlLCBlbmRWYWx1ZSwgZWFzaW5nKVxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGEgdmFsaWQga2V5LicpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGJhc2UgJiYgayAmJiBpbmRleCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udmVydFRvQW5pbWF0YWJsZVByb3BlcnR5KGJhc2UsIGspXHJcbiAgICAgICAgICAgIHRoaXMuYWRkS2V5ZnJhbWUoYmFzZSwgaywgaW5kZXgsIHN0YXJ0RnJhbWUsIHN0YXJ0VmFsdWUsIGVhc2luZywgd3JhcClcclxuICAgICAgICAgICAgdGhpcy5hZGRLZXlmcmFtZShiYXNlLCBrLCBpbmRleCwgZW5kRnJhbWUsIGVuZFZhbHVlLCB1bmRlZmluZWQsIHdyYXApXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTGF5ZXJGYWN0b3J5IHtcclxuICAgIHByaXZhdGUgc3RhdGljIGdlbmVyYXRlVHJhbnNmb3JtKGNvb3JkaW5hdGU6IG51bWJlcltdKTogVHJhbnNmb3JtIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBvOiB7XHJcbiAgICAgICAgICAgICAgICBhOiAwLFxyXG4gICAgICAgICAgICAgICAgazogMTAwXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHI6IHtcclxuICAgICAgICAgICAgICAgIGE6IDAsXHJcbiAgICAgICAgICAgICAgICBrOiAwXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHA6IHtcclxuICAgICAgICAgICAgICAgIGE6IDAsXHJcbiAgICAgICAgICAgICAgICBrOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgY29vcmRpbmF0ZVswXSxcclxuICAgICAgICAgICAgICAgICAgICBjb29yZGluYXRlWzFdLFxyXG4gICAgICAgICAgICAgICAgICAgIDBcclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYToge1xyXG4gICAgICAgICAgICAgICAgYTogMCxcclxuICAgICAgICAgICAgICAgIGs6IFtcclxuICAgICAgICAgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgMFxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzOiB7XHJcbiAgICAgICAgICAgICAgICBhOiAwLFxyXG4gICAgICAgICAgICAgICAgazogW1xyXG4gICAgICAgICAgICAgICAgICAgIDEwMCxcclxuICAgICAgICAgICAgICAgICAgICAxMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgMTAwXHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGJvdW5kaW5nQm94KGRvbTogU1ZHR3JhcGhpY3NFbGVtZW50KSB7XHJcbiAgICAgICAgY29uc3QgYm91bmRpbmdCb3ggPSBnZXRCb3VuZGluZ0JveChkb20pLm1hcCgodiwgaSkgPT4gaSA8IDIgPyB2IC0gMSA6IHYgKyAxKSBhcyBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXVxyXG4gICAgICAgIHJldHVybiB0aGlzLnJlY3QoLi4uYm91bmRpbmdCb3gpXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNoYXBlKGRvbTogU1ZHUGF0aEVsZW1lbnQpIHtcclxuICAgICAgICBjb25zdCBjb29yZGluYXRlID0gZ2V0Qm91bmRpbmdCb3goZG9tKVxyXG4gICAgICAgIGNvbnN0IGxheWVyOiBTaGFwZUxheWVyID0ge1xyXG4gICAgICAgICAgICB0eTogNCxcclxuICAgICAgICAgICAgZGRkOiAwLFxyXG4gICAgICAgICAgICBzcjogMSxcclxuICAgICAgICAgICAgYW86IDAsXHJcbiAgICAgICAgICAgIGtzOiB0aGlzLmdlbmVyYXRlVHJhbnNmb3JtKGNvb3JkaW5hdGUpLFxyXG4gICAgICAgICAgICBpcDogMCxcclxuICAgICAgICAgICAgb3A6IDEsXHJcbiAgICAgICAgICAgIHN0OiAwLFxyXG4gICAgICAgICAgICBibTogMCxcclxuICAgICAgICAgICAgc2hhcGVzOiByZW5kZXIoZG9tKVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBKU01vdmluTGF5ZXIobGF5ZXIpXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHJlY3QobGVmdDogbnVtYmVyLCB0b3A6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBsYXllcjogU2hhcGVMYXllciA9IHtcclxuICAgICAgICAgICAgdHk6IDQsXHJcbiAgICAgICAgICAgIGRkZDogMCxcclxuICAgICAgICAgICAgc3I6IDEsXHJcbiAgICAgICAgICAgIGFvOiAwLFxyXG4gICAgICAgICAgICBrczogdGhpcy5nZW5lcmF0ZVRyYW5zZm9ybShbbGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0XSksXHJcbiAgICAgICAgICAgIGlwOiAwLFxyXG4gICAgICAgICAgICBvcDogMSxcclxuICAgICAgICAgICAgc3Q6IDAsXHJcbiAgICAgICAgICAgIGJtOiAwLFxyXG4gICAgICAgICAgICBzaGFwZXM6IFtcclxuICAgICAgICAgICAgICAgIHJlbmRlclBsYWluR2x5cGgoJ3JlY3QnLCBbd2lkdGgsIGhlaWdodF0pXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBKU01vdmluTGF5ZXIobGF5ZXIpXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGVsbGlwc2UoY3g6IG51bWJlciwgY3k6IG51bWJlciwgcng6IG51bWJlciwgcnk6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGxheWVyOiBTaGFwZUxheWVyID0ge1xyXG4gICAgICAgICAgICB0eTogNCxcclxuICAgICAgICAgICAgZGRkOiAwLFxyXG4gICAgICAgICAgICBzcjogMSxcclxuICAgICAgICAgICAgYW86IDAsXHJcbiAgICAgICAgICAgIGtzOiB0aGlzLmdlbmVyYXRlVHJhbnNmb3JtKFtjeCAtIHJ4LCBjeSAtIHJ5LCAyICogcngsIDIgKiByeV0pLFxyXG4gICAgICAgICAgICBpcDogMCxcclxuICAgICAgICAgICAgb3A6IDEsXHJcbiAgICAgICAgICAgIHN0OiAwLFxyXG4gICAgICAgICAgICBibTogMCxcclxuICAgICAgICAgICAgc2hhcGVzOiBbXHJcbiAgICAgICAgICAgICAgICByZW5kZXJQbGFpbkdseXBoKCdlbGxpcHNlJywgW3J4LCByeV0pXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBKU01vdmluTGF5ZXIobGF5ZXIpXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHJlZihpZDogUmVmZXJlbmNlSUQpIHtcclxuICAgICAgICBjb25zdCBsYXllciA9IG5ldyBKU01vdmluTGF5ZXIoe1xyXG4gICAgICAgICAgICB0eTogMCxcclxuICAgICAgICAgICAgZGRkOiAwLFxyXG4gICAgICAgICAgICBzcjogMSxcclxuICAgICAgICAgICAgYW86IDAsXHJcbiAgICAgICAgICAgIGtzOiB0aGlzLmdlbmVyYXRlVHJhbnNmb3JtKFswLCAwLCAwLCAwXSksXHJcbiAgICAgICAgICAgIGlwOiAwLFxyXG4gICAgICAgICAgICBvcDogMSxcclxuICAgICAgICAgICAgc3Q6IDAsXHJcbiAgICAgICAgICAgIGJtOiAwLFxyXG4gICAgICAgICAgICB3OiA5ZTksXHJcbiAgICAgICAgICAgIGg6IDllOSxcclxuICAgICAgICAgICAgcmVmSWQ6IGlkXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gbGF5ZXJcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaGllcmFyY2h5KGRvbTogU1ZHR3JhcGhpY3NFbGVtZW50LCBhc3NldExpc3Q6IEFzc2V0cywgZm9udExpc3Q6IEZvbnRzKSB7XHJcbiAgICAgICAgY29uc3QgY29vcmRpbmF0ZSA9IGdldEJvdW5kaW5nQm94KGRvbSlcclxuICAgICAgICBsZXQgZG9tVHlwZTogMiB8IDQgfCA1IHwgMDtcclxuICAgICAgICBpZiAoZG9tIGluc3RhbmNlb2YgU1ZHVGV4dEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgZG9tVHlwZSA9IDVcclxuICAgICAgICB9IGVsc2UgaWYgKGRvbSBpbnN0YW5jZW9mIFNWR0ltYWdlRWxlbWVudCkge1xyXG4gICAgICAgICAgICBkb21UeXBlID0gMlxyXG4gICAgICAgIH0gZWxzZSBpZiAoZG9tIGluc3RhbmNlb2YgU1ZHR0VsZW1lbnQpIHtcclxuICAgICAgICAgICAgZG9tVHlwZSA9IDBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkb21UeXBlID0gNFxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBsYXllcjogU2hhcGVMYXllciB8IEltYWdlTGF5ZXIgfCBUZXh0TGF5ZXIgfCBQcmVDb21wTGF5ZXIgPSB7XHJcbiAgICAgICAgICAgIHR5OiBkb21UeXBlLFxyXG4gICAgICAgICAgICBkZGQ6IDAsXHJcbiAgICAgICAgICAgIHNyOiAxLFxyXG4gICAgICAgICAgICBhbzogMCxcclxuICAgICAgICAgICAga3M6IHRoaXMuZ2VuZXJhdGVUcmFuc2Zvcm0oZG9tVHlwZSA9PSAwID8gWzAsIDAsIDAsIDBdIDogY29vcmRpbmF0ZSksXHJcbiAgICAgICAgICAgIGlwOiAwLFxyXG4gICAgICAgICAgICBvcDogMSxcclxuICAgICAgICAgICAgc3Q6IDAsXHJcbiAgICAgICAgICAgIGJtOiAwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN3aXRjaCAoZG9tVHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkb21MZWF2ZXMgPSBnZXRMZWFmTm9kZXMoZG9tKVxyXG4gICAgICAgICAgICAgICAgaWYgKGRvbUxlYXZlcy5maWx0ZXIoZG9tID0+IGRvbSBpbnN0YW5jZW9mIFNWR1RleHRFbGVtZW50IHx8IGRvbSBpbnN0YW5jZW9mIFNWR0ltYWdlRWxlbWVudCkubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJlY29tcExheWVyID0gbGF5ZXIgYXMgUHJlQ29tcExheWVyXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJlQ29tcEFzc2V0OiBKU01vdmluTGF5ZXJbXSA9IFtdXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJlQ29tcFJlZklkID0gdXVpZCgpXHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTGVhdmVzLmZvckVhY2goZCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkIGluc3RhbmNlb2YgU1ZHR3JhcGhpY3NFbGVtZW50ICYmICEoZCBpbnN0YW5jZW9mIFNWR0dFbGVtZW50KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlQ29tcEFzc2V0LnVuc2hpZnQodGhpcy5oaWVyYXJjaHkoZCwgYXNzZXRMaXN0LCBmb250TGlzdCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIHByZUNvbXBBc3NldC5mb3JFYWNoKGxheWVyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGF5ZXIucm9vdC5vcCA9IDllOVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgcHJlY29tcExheWVyLncgPSBjb29yZGluYXRlWzBdICsgY29vcmRpbmF0ZVsyXSArIDFcclxuICAgICAgICAgICAgICAgICAgICBwcmVjb21wTGF5ZXIuaCA9IGNvb3JkaW5hdGVbMV0gKyBjb29yZGluYXRlWzNdICsgMVxyXG4gICAgICAgICAgICAgICAgICAgIHByZWNvbXBMYXllci5yZWZJZCA9IHByZUNvbXBSZWZJZFxyXG4gICAgICAgICAgICAgICAgICAgIGFzc2V0TGlzdC5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHByZUNvbXBSZWZJZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGF5ZXJzOiBwcmVDb21wQXNzZXQubWFwKGxheWVyID0+IGxheWVyLnJvb3QpXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2hhcGVMYXllciA9IGxheWVyIGFzIFNoYXBlTGF5ZXJcclxuICAgICAgICAgICAgICAgICAgICBzaGFwZUxheWVyLnR5ID0gNFxyXG4gICAgICAgICAgICAgICAgICAgIHNoYXBlTGF5ZXIua3MgPSB0aGlzLmdlbmVyYXRlVHJhbnNmb3JtKGNvb3JkaW5hdGUpXHJcbiAgICAgICAgICAgICAgICAgICAgc2hhcGVMYXllci5zaGFwZXMgPSByZW5kZXIoZG9tKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgY29uc3QgaW1hZ2VMYXllciA9IGxheWVyIGFzIEltYWdlTGF5ZXJcclxuICAgICAgICAgICAgICAgIGNvbnN0IFtpbWFnZVJlZklkLCBpbWFnZUFzc2V0XSA9IHJlbmRlckltYWdlKGRvbSBhcyBTVkdJbWFnZUVsZW1lbnQsIGFzc2V0TGlzdClcclxuICAgICAgICAgICAgICAgIGltYWdlTGF5ZXIucmVmSWQgPSBpbWFnZVJlZklkXHJcbiAgICAgICAgICAgICAgICBpZiAoIWFzc2V0TGlzdC5maWx0ZXIoYSA9PiBhLmlkID09IGltYWdlUmVmSWQpLmxlbmd0aClcclxuICAgICAgICAgICAgICAgICAgICBhc3NldExpc3QucHVzaChpbWFnZUFzc2V0KVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hhcGVMYXllciA9IGxheWVyIGFzIFNoYXBlTGF5ZXJcclxuICAgICAgICAgICAgICAgIHNoYXBlTGF5ZXIuc2hhcGVzID0gcmVuZGVyKGRvbSlcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgNTpcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRleHRMYXllciA9IGxheWVyIGFzIFRleHRMYXllclxyXG5cclxuICAgICAgICAgICAgICAgIC8vIG1vdmUgdGV4dExheWVyJ3MgYW5jaG9yIHRvIGxlZnQtdG9wXHJcbiAgICAgICAgICAgICAgICBjb25zdCBiYXNlTGluZUhlaWdodCA9IGdldEJhc2VsaW5lSGVpZ2h0KGRvbSBhcyBTVkdUZXh0RWxlbWVudClcclxuICAgICAgICAgICAgICAgIHRleHRMYXllci5rcyEuYSEuayA9IFswLCBiYXNlTGluZUhlaWdodCAtIGNvb3JkaW5hdGVbM10sIDBdXHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgW3RleHREYXRhLCBmb250XSA9IHJlbmRlclRleHQoZG9tIGFzIFNWR1RleHRFbGVtZW50LCBmb250TGlzdClcclxuICAgICAgICAgICAgICAgIHRleHRMYXllci50ID0gdGV4dERhdGFcclxuICAgICAgICAgICAgICAgIGlmICghZm9udExpc3QubGlzdCEuZmlsdGVyKGYgPT4gZi5mTmFtZSA9PSBmb250LmZOYW1lKS5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICAgICAgZm9udExpc3QubGlzdCEucHVzaChmb250KVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgbW92aW5MYXllciA9IG5ldyBKU01vdmluTGF5ZXIobGF5ZXIpXHJcbiAgICAgICAgcmV0dXJuIG1vdmluTGF5ZXJcclxuICAgIH1cclxufSJdfQ==