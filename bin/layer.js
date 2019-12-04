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

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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
          return JSON.parse(JSON.stringify(key == 'a' ? this.anchor : this.position));

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
        if (key == 'a') {
          this.anchor = transform[key] ? transform[key].k : [0, 0, 0];
        }

        if (key == 'p') {
          this.position = transform[key] ? transform[key].k : [0, 0, 0];
        }

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
  }, {
    key: "updateTimeRange",
    value: function updateTimeRange() {
      this.root.op = Math.max.apply(Math, _toConsumableArray(Object.values(this.timeRange)).concat([1]));
    }
  }]);

  function JSMovinLayer(ref) {
    _classCallCheck(this, JSMovinLayer);

    _defineProperty(this, "root", void 0);

    _defineProperty(this, "anchor", void 0);

    _defineProperty(this, "position", void 0);

    _defineProperty(this, "timeRange", {});

    this.root = ref;
    this.anchor = [0, 0, 0];
    this.position = [0, 0, 0];
  }
  /**
   * 
   * @param key the name of property to be set
   * @param value the value to be set
   */


  _createClass(JSMovinLayer, [{
    key: "setStaticProperty",
    value: function setStaticProperty(key, value) {
      this.timeRange[key] = 1;
      this.updateTimeRange();
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
    /**
     * 
     * @param key the name of property to be set
     * @param startFrame frame number to start the animation
     * @param endFrame frame number to end the animation
     * @param startValue value to be set in start of animation
     * @param endValue value to be set in end of animation
     * @param easing easing function, default is linear
     */

  }, {
    key: "setAnimatableProperty",
    value: function setAnimatableProperty(key, startFrame, endFrame, startValue, endValue, easing) {
      if (endFrame <= startFrame) {
        throw new Error('End frame should be larger than start frame.');
      }

      this.timeRange[key] = endFrame + 1;
      this.updateTimeRange();

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
    /**
     * create the bounding box of svg element
     * @param dom svg element needs to calculate the bounding box
     */

  }, {
    key: "boundingBox",
    value: function boundingBox(dom) {
      var boundingBox = (0, _helper.getBoundingBox)(dom).map(function (v, i) {
        return i < 2 ? v - 1 : v + 1;
      });
      return this.rect.apply(this, _toConsumableArray(boundingBox));
    }
    /**
     * create the same shape of svg path
     * @param dom svg path element represent the shape
     */

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
    /**
     * create a rectangle
     * @param left left of rect
     * @param top top of rect
     * @param width width of rect
     * @param height height of rect
     */

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
    /**
     * create a ellipse
     * @param cx x center of ellipse
     * @param cy y center of ellipse
     * @param rx x radius of ellipse
     * @param ry y radius of ellipse
     */

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
    /**
     * make a layer by asset ID
     * @param id asset reference ID
     */

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
    /**
     * make a complex layer by an arbitrary svg element
     * @param dom svg element need to be parsed
     * @param assetList a list contains image/layer asset
     * @param fontList a list contains font asset
     */

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
          var textLayer = layer; // move textLayer's position to text-anchor-related

          var baseLineHeight = (0, _helper.getBaselineHeight)(dom);
          var textAnchor = (0, _helper.encodeTextAnchor)(getComputedStyle(dom).textAnchor);
          var textAnchorWeight = [0, 1, 0.5][textAnchor];
          textLayer.ks.p.k = [coordinate[0] + coordinate[2] * textAnchorWeight, coordinate[1] + coordinate[3] - baseLineHeight, 0];
          textLayer.ks.o.k = ~~(parseFloat(getComputedStyle(dom).fillOpacity || '1') * 100);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sYXllci50cyJdLCJuYW1lcyI6WyJKU01vdmluTGF5ZXIiLCJrZXkiLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJhbmNob3IiLCJwb3NpdGlvbiIsInMiLCJrIiwiZSIsIm8iLCJ0cmFuc2Zvcm0iLCJhIiwiZ2V0RGVmYXVsdFByb3BlcnR5Iiwic3RhdGljVmFsdWUiLCJpZHgiLCJ0aW1lIiwidmFsdWUiLCJlYXNpbmciLCJ3cmFwIiwiZXhpc3RLZXlmcmFtZSIsImZpbHRlciIsIngiLCJ0IiwicmVhZHlUb1NldCIsImxlbmd0aCIsInByZXZpb3VzS2V5ZnJhbWVDb3VudCIsInJlZHVjZSIsInAiLCJzcGxpY2UiLCJ5IiwiaSIsIkFycmF5Iiwicm9vdCIsInNoYXBlcyIsIml0IiwiZmluZCIsInNoYXBlIiwidHkiLCJmaW5kUHJvcGVydHlDb25maWciLCJoYXNUcmFuc2Zvcm0iLCJjb25maWciLCJncm91cFNoYXBlcyIsInB1c2giLCJiYXNlIiwiaW5kZXgiLCJrcyIsImZpbmRPckluc2VydFByb3BlcnR5Q29uZmlnIiwib3AiLCJNYXRoIiwibWF4IiwiT2JqZWN0IiwidmFsdWVzIiwidGltZVJhbmdlIiwicmVmIiwidXBkYXRlVGltZVJhbmdlIiwiY29tbW9uUHJvcGVydHlNYXBwaW5nIiwidW5kZWZpbmVkIiwiZG9jIiwiZCIsImNvbnNvbGUiLCJlcnJvciIsIkVycm9yIiwiY29udmVydFRvU3RhdGljUHJvcGVydHkiLCJzdGFydEZyYW1lIiwiZW5kRnJhbWUiLCJzdGFydFZhbHVlIiwiZW5kVmFsdWUiLCJFYXNpbmdGYWN0b3J5IiwibGluZWFyIiwidGV4dFByb3AiLCJ0bXBTdGFydFZhbHVlIiwidG1wRW5kVmFsdWUiLCJjb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkiLCJhZGRLZXlmcmFtZSIsIkxheWVyRmFjdG9yeSIsImNvb3JkaW5hdGUiLCJyIiwiZG9tIiwiYm91bmRpbmdCb3giLCJtYXAiLCJ2IiwicmVjdCIsImxheWVyIiwiZGRkIiwic3IiLCJhbyIsImdlbmVyYXRlVHJhbnNmb3JtIiwiaXAiLCJzdCIsImJtIiwibGVmdCIsInRvcCIsIndpZHRoIiwiaGVpZ2h0IiwiY3giLCJjeSIsInJ4IiwicnkiLCJpZCIsInciLCJoIiwicmVmSWQiLCJhc3NldExpc3QiLCJmb250TGlzdCIsImRvbVR5cGUiLCJTVkdUZXh0RWxlbWVudCIsIlNWR0ltYWdlRWxlbWVudCIsIlNWR0dFbGVtZW50IiwiZG9tTGVhdmVzIiwicHJlY29tcExheWVyIiwicHJlQ29tcEFzc2V0IiwicHJlQ29tcFJlZklkIiwiZm9yRWFjaCIsIlNWR0dyYXBoaWNzRWxlbWVudCIsInVuc2hpZnQiLCJoaWVyYXJjaHkiLCJsYXllcnMiLCJzaGFwZUxheWVyIiwiaW1hZ2VMYXllciIsImltYWdlUmVmSWQiLCJpbWFnZUFzc2V0IiwidGV4dExheWVyIiwiYmFzZUxpbmVIZWlnaHQiLCJ0ZXh0QW5jaG9yIiwiZ2V0Q29tcHV0ZWRTdHlsZSIsInRleHRBbmNob3JXZWlnaHQiLCJwYXJzZUZsb2F0IiwiZmlsbE9wYWNpdHkiLCJ0ZXh0RGF0YSIsImZvbnQiLCJsaXN0IiwiZiIsImZOYW1lIiwibW92aW5MYXllciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUlhQSxZOzs7Ozt1Q0FLa0JDLEcsRUFBYTtBQUNwQyxjQUFRQSxHQUFSO0FBQ0ksYUFBSyxHQUFMO0FBQ0EsYUFBSyxHQUFMO0FBQ0ksaUJBQU9DLElBQUksQ0FBQ0MsS0FBTCxDQUFXRCxJQUFJLENBQUNFLFNBQUwsQ0FBZUgsR0FBRyxJQUFJLEdBQVAsR0FBYSxLQUFLSSxNQUFsQixHQUEyQixLQUFLQyxRQUEvQyxDQUFYLENBQVA7O0FBQ0osYUFBSyxHQUFMO0FBQ0ksaUJBQU8sQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEdBQVgsQ0FBUDs7QUFDSixhQUFLLEdBQUw7QUFDSSxpQkFBTyxHQUFQOztBQUNKLGFB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SW1hZ2VMYXllciwgVHJhbnNmb3JtLCBBc3NldHMsIEZvbnRzLCBHcm91cFNoYXBlLCBQcmVDb21wTGF5ZXIsIFJlZmVyZW5jZUlEIH0gZnJvbSAnLi9hbmltYXRpb24nXHJcbmltcG9ydCB7IEVhc2luZ0Z1bmN0aW9uLCBFYXNpbmdGYWN0b3J5IH0gZnJvbSAnLi9lYXNpbmcnXHJcbmltcG9ydCB7IHJlbmRlclRleHQsIHJlbmRlciwgcmVuZGVySW1hZ2UsIHJlbmRlclBsYWluR2x5cGggfSBmcm9tICcuL3JlbmRlcic7XHJcbmltcG9ydCB7IGdldEJvdW5kaW5nQm94LCBnZXRMZWFmTm9kZXMsIGdldEJhc2VsaW5lSGVpZ2h0LCBlbmNvZGVUZXh0QW5jaG9yIH0gZnJvbSAnLi9oZWxwZXInXHJcbmltcG9ydCB1dWlkIGZyb20gJ3V1aWQvdjQnO1xyXG5cclxudHlwZSBTZXRhYmxlS2V5cyA9IFwic2NhbGVYXCIgfCBcInNjYWxlWVwiIHwgXCJhbmNob3JYXCIgfCBcImFuY2hvcllcIiB8IFwieFwiIHwgXCJ5XCIgfCBcInJvdGF0ZVwiIHwgXCJvcGFjaXR5XCIgfCAnc2hhcGUnIHwgJ2ZpbGxDb2xvcicgfCAndHJpbVN0YXJ0JyB8ICd0cmltRW5kJyB8ICd0cmltT2Zmc2V0JyB8ICdzdHJva2VDb2xvcicgfCAnc3Ryb2tlV2lkdGgnIHwgJ3RleHQnIHwgJ2ZpbGxPcGFjaXR5JyB8ICdzdHJva2VPcGFjaXR5J1xyXG5cclxuZXhwb3J0IGNsYXNzIEpTTW92aW5MYXllciB7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgcm9vdDogU2hhcGVMYXllciB8IFRleHRMYXllciB8IEltYWdlTGF5ZXIgfCBQcmVDb21wTGF5ZXI7XHJcbiAgICBwcml2YXRlIGFuY2hvcjogbnVtYmVyW11cclxuICAgIHByaXZhdGUgcG9zaXRpb246IG51bWJlcltdXHJcbiAgICBwcml2YXRlIHRpbWVSYW5nZTogeyBba2V5OiBzdHJpbmddOiBudW1iZXIgfSA9IHt9XHJcbiAgICBwcml2YXRlIGdldERlZmF1bHRQcm9wZXJ0eShrZXk6IHN0cmluZykge1xyXG4gICAgICAgIHN3aXRjaCAoa2V5KSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2EnOlxyXG4gICAgICAgICAgICBjYXNlICdwJzpcclxuICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGtleSA9PSAnYScgPyB0aGlzLmFuY2hvciA6IHRoaXMucG9zaXRpb24pKVxyXG4gICAgICAgICAgICBjYXNlICdzJzpcclxuICAgICAgICAgICAgICAgIHJldHVybiBbMTAwLCAxMDAsIDEwMF1cclxuICAgICAgICAgICAgY2FzZSAnbyc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMTAwXHJcbiAgICAgICAgICAgIGNhc2UgJ3InOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDBcclxuICAgICAgICAgICAgY2FzZSAndG0nOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGs6IDBcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgazogMTAwXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBvOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGs6IDBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgY29udmVydFRvU3RhdGljUHJvcGVydHkodHJhbnNmb3JtOiBhbnksIGtleTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKCF0cmFuc2Zvcm1ba2V5XSkge1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm1ba2V5XSA9IHtcclxuICAgICAgICAgICAgICAgIGE6IDAsXHJcbiAgICAgICAgICAgICAgICBrOiB0aGlzLmdldERlZmF1bHRQcm9wZXJ0eShrZXkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRyYW5zZm9ybVtrZXldLmEgPT0gMSkge1xyXG4gICAgICAgICAgICBjb25zdCBzdGF0aWNWYWx1ZSA9IHRyYW5zZm9ybVtrZXldLmtbMF0uc1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm1ba2V5XSA9IHtcclxuICAgICAgICAgICAgICAgIGE6IDAsXHJcbiAgICAgICAgICAgICAgICBrOiBzdGF0aWNWYWx1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkodHJhbnNmb3JtOiBhbnksIGtleTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKCF0cmFuc2Zvcm1ba2V5XSB8fCAhdHJhbnNmb3JtW2tleV0uYSkge1xyXG4gICAgICAgICAgICBpZiAoa2V5ID09ICdhJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmNob3IgPSB0cmFuc2Zvcm1ba2V5XSA/IHRyYW5zZm9ybVtrZXldLmsgOiBbMCwgMCwgMF1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoa2V5ID09ICdwJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHRyYW5zZm9ybVtrZXldID8gdHJhbnNmb3JtW2tleV0uayA6IFswLCAwLCAwXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRyYW5zZm9ybVtrZXldID0ge1xyXG4gICAgICAgICAgICAgICAgYTogMSxcclxuICAgICAgICAgICAgICAgIGs6IFtdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGFkZEtleWZyYW1lKHRyYW5zZm9ybTogYW55LCBrZXk6IHN0cmluZywgaWR4OiBudW1iZXIgPSAtMSwgdGltZTogbnVtYmVyLCB2YWx1ZTogQXJyYXk8YW55PiwgZWFzaW5nPzogRWFzaW5nRnVuY3Rpb24sIHdyYXA6IGJvb2xlYW4gPSB0cnVlKSB7XHJcbiAgICAgICAgY29uc3QgZXhpc3RLZXlmcmFtZSA9IHRyYW5zZm9ybVtrZXldLmsuZmlsdGVyKCh4OiBhbnkpID0+IHgudCA9PSB0aW1lKSBhcyBhbnlbXVxyXG4gICAgICAgIGxldCByZWFkeVRvU2V0O1xyXG4gICAgICAgIGlmIChleGlzdEtleWZyYW1lLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZWFkeVRvU2V0ID0gZXhpc3RLZXlmcmFtZVswXVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlYWR5VG9TZXQgPSB7XHJcbiAgICAgICAgICAgICAgICB0OiB0aW1lLFxyXG4gICAgICAgICAgICAgICAgczogdGhpcy5nZXREZWZhdWx0UHJvcGVydHkoa2V5KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzS2V5ZnJhbWVDb3VudCA9IHRyYW5zZm9ybVtrZXldLmsucmVkdWNlKChwOiBudW1iZXIsIHg6IGFueSkgPT4geC50IDwgdGltZSA/IHAgKyAxIDogcCwgMClcclxuICAgICAgICAgICAgdHJhbnNmb3JtW2tleV0uay5zcGxpY2UocHJldmlvdXNLZXlmcmFtZUNvdW50LCAwLCByZWFkeVRvU2V0KVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZWFzaW5nKSB7XHJcbiAgICAgICAgICAgIHJlYWR5VG9TZXQubyA9IHtcclxuICAgICAgICAgICAgICAgIHg6IGVhc2luZ1swXVswXSxcclxuICAgICAgICAgICAgICAgIHk6IGVhc2luZ1swXVsxXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlYWR5VG9TZXQuaSA9IHtcclxuICAgICAgICAgICAgICAgIHg6IGVhc2luZ1sxXVswXSxcclxuICAgICAgICAgICAgICAgIHk6IGVhc2luZ1sxXVsxXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpZHggPj0gMCkge1xyXG4gICAgICAgICAgICByZWFkeVRvU2V0LnNbaWR4XSA9IHZhbHVlXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVhZHlUb1NldC5zID0gd3JhcCAmJiAhKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpID8gW3ZhbHVlXSA6IHZhbHVlXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBmaW5kUHJvcGVydHlDb25maWcoa2V5OiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gKCh0aGlzLnJvb3QgYXMgU2hhcGVMYXllcikuc2hhcGVzIVswXSBhcyBHcm91cFNoYXBlKS5pdCEuZmluZChzaGFwZSA9PlxyXG4gICAgICAgICAgICBzaGFwZS50eSA9PSBrZXlcclxuICAgICAgICApXHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGZpbmRPckluc2VydFByb3BlcnR5Q29uZmlnKGtleTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgZmluZCA9IHRoaXMuZmluZFByb3BlcnR5Q29uZmlnKGtleSlcclxuICAgICAgICBpZiAoZmluZCkgcmV0dXJuIGZpbmRcclxuICAgICAgICBjb25zdCBoYXNUcmFuc2Zvcm0gPSB0aGlzLmZpbmRQcm9wZXJ0eUNvbmZpZygndHInKVxyXG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IHtcclxuICAgICAgICAgICAgdHk6IGtleSxcclxuICAgICAgICAgICAgLi4udGhpcy5nZXREZWZhdWx0UHJvcGVydHkoa2V5KSBhcyBvYmplY3RcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGhhc1RyYW5zZm9ybSkge1xyXG4gICAgICAgICAgICBjb25zdCBncm91cFNoYXBlcyA9ICgodGhpcy5yb290IGFzIFNoYXBlTGF5ZXIpLnNoYXBlcyFbMF0gYXMgR3JvdXBTaGFwZSkuaXQhXHJcbiAgICAgICAgICAgIGdyb3VwU2hhcGVzLnNwbGljZShncm91cFNoYXBlcy5sZW5ndGggLSAxLCAwLCBjb25maWcpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgKCh0aGlzLnJvb3QgYXMgU2hhcGVMYXllcikuc2hhcGVzIVswXSBhcyBHcm91cFNoYXBlKS5pdCEucHVzaChjb25maWcpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb25maWdcclxuICAgIH1cclxuICAgIHByaXZhdGUgY29tbW9uUHJvcGVydHlNYXBwaW5nKGtleTogU2V0YWJsZUtleXMpOiBbYW55LCBzdHJpbmcgfCB1bmRlZmluZWQsIG51bWJlciB8IHVuZGVmaW5lZF0ge1xyXG4gICAgICAgIGxldCBiYXNlOiBhbnksIGs6IHN0cmluZyB8IHVuZGVmaW5lZCwgaW5kZXg6IG51bWJlciB8IHVuZGVmaW5lZFxyXG4gICAgICAgIHN3aXRjaCAoa2V5KSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ3NjYWxlWCc6XHJcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXHJcbiAgICAgICAgICAgICAgICBrID0gJ3MnXHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IDBcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ3NjYWxlWSc6XHJcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXHJcbiAgICAgICAgICAgICAgICBrID0gJ3MnXHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IDFcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ2FuY2hvclgnOlxyXG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMucm9vdC5rc1xyXG4gICAgICAgICAgICAgICAgayA9ICdhJ1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSAwXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlICdhbmNob3JZJzpcclxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLnJvb3Qua3NcclxuICAgICAgICAgICAgICAgIGsgPSAnYSdcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gMVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAneCc6XHJcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXHJcbiAgICAgICAgICAgICAgICBrID0gJ3AnXHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IDBcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ3knOlxyXG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMucm9vdC5rc1xyXG4gICAgICAgICAgICAgICAgayA9ICdwJ1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSAxXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlICdyb3RhdGUnOlxyXG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMucm9vdC5rc1xyXG4gICAgICAgICAgICAgICAgayA9ICdyJ1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAnb3BhY2l0eSc6XHJcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXHJcbiAgICAgICAgICAgICAgICBrID0gJ28nXHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlICd0cmltU3RhcnQnOlxyXG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZE9ySW5zZXJ0UHJvcGVydHlDb25maWcoJ3RtJylcclxuICAgICAgICAgICAgICAgIGsgPSAncydcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ3RyaW1FbmQnOlxyXG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZE9ySW5zZXJ0UHJvcGVydHlDb25maWcoJ3RtJylcclxuICAgICAgICAgICAgICAgIGsgPSAnZSdcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ3RyaW1PZmZzZXQnOlxyXG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZE9ySW5zZXJ0UHJvcGVydHlDb25maWcoJ3RtJylcclxuICAgICAgICAgICAgICAgIGsgPSAnbydcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ2ZpbGxDb2xvcic6XHJcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kUHJvcGVydHlDb25maWcoJ2ZsJylcclxuICAgICAgICAgICAgICAgIGsgPSAnYydcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ3N0cm9rZUNvbG9yJzpcclxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLmZpbmRQcm9wZXJ0eUNvbmZpZygnc3QnKVxyXG4gICAgICAgICAgICAgICAgayA9ICdjJ1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAnc3Ryb2tlV2lkdGgnOlxyXG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZFByb3BlcnR5Q29uZmlnKCdzdCcpXHJcbiAgICAgICAgICAgICAgICBrID0gJ3cnXHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlICdzaGFwZSc6XHJcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kUHJvcGVydHlDb25maWcoJ3NoJylcclxuICAgICAgICAgICAgICAgIGsgPSAna3MnXHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlICdmaWxsT3BhY2l0eSc6XHJcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kUHJvcGVydHlDb25maWcoJ2ZsJylcclxuICAgICAgICAgICAgICAgIGsgPSAnbydcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ3N0cm9rZU9wYWNpdHknOlxyXG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZFByb3BlcnR5Q29uZmlnKCdzdCcpXHJcbiAgICAgICAgICAgICAgICBrID0gJ28nXHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW2Jhc2UsIGssIGluZGV4XVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSB1cGRhdGVUaW1lUmFuZ2UoKSB7XHJcbiAgICAgICAgdGhpcy5yb290Lm9wID0gTWF0aC5tYXgoLi4uT2JqZWN0LnZhbHVlcyh0aGlzLnRpbWVSYW5nZSksIDEpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IocmVmOiBTaGFwZUxheWVyIHwgVGV4dExheWVyIHwgSW1hZ2VMYXllciB8IFByZUNvbXBMYXllcikge1xyXG4gICAgICAgIHRoaXMucm9vdCA9IHJlZlxyXG4gICAgICAgIHRoaXMuYW5jaG9yID0gWzAsIDAsIDBdXHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IFswLCAwLCAwXVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0ga2V5IHRoZSBuYW1lIG9mIHByb3BlcnR5IHRvIGJlIHNldFxyXG4gICAgICogQHBhcmFtIHZhbHVlIHRoZSB2YWx1ZSB0byBiZSBzZXRcclxuICAgICAqL1xyXG4gICAgc2V0U3RhdGljUHJvcGVydHkoa2V5OiBTZXRhYmxlS2V5cywgdmFsdWU6IGFueSkge1xyXG4gICAgICAgIHRoaXMudGltZVJhbmdlW2tleV0gPSAxXHJcbiAgICAgICAgdGhpcy51cGRhdGVUaW1lUmFuZ2UoKVxyXG4gICAgICAgIGxldCBiYXNlOiBhbnksIGs6IHN0cmluZyB8IHVuZGVmaW5lZCwgaW5kZXg6IG51bWJlciB8IHVuZGVmaW5lZFxyXG4gICAgICAgIFtiYXNlLCBrLCBpbmRleF0gPSB0aGlzLmNvbW1vblByb3BlcnR5TWFwcGluZyhrZXkpXHJcbiAgICAgICAgaWYgKCFrIHx8IGluZGV4ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgc3dpdGNoIChrZXkpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3RleHQnOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnJvb3QudHkgPT0gNSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkb2MgPSB0aGlzLnJvb3QudCEuZCFcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jLmsgPSBbZG9jLmshWzBdXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2Mua1swXS50ID0gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2Mua1swXS5zIS50ID0gdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihrZXksIHZhbHVlKVxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGEgdmFsaWQga2V5LicpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGJhc2UgJiYgayAmJiBpbmRleCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udmVydFRvU3RhdGljUHJvcGVydHkoYmFzZSwgaylcclxuICAgICAgICAgICAgaWYgKGluZGV4ID49IDApXHJcbiAgICAgICAgICAgICAgICBiYXNlW2tdLmtbaW5kZXhdID0gdmFsdWVcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgYmFzZVtrXS5rID0gdmFsdWVcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBrZXkgdGhlIG5hbWUgb2YgcHJvcGVydHkgdG8gYmUgc2V0XHJcbiAgICAgKiBAcGFyYW0gc3RhcnRGcmFtZSBmcmFtZSBudW1iZXIgdG8gc3RhcnQgdGhlIGFuaW1hdGlvblxyXG4gICAgICogQHBhcmFtIGVuZEZyYW1lIGZyYW1lIG51bWJlciB0byBlbmQgdGhlIGFuaW1hdGlvblxyXG4gICAgICogQHBhcmFtIHN0YXJ0VmFsdWUgdmFsdWUgdG8gYmUgc2V0IGluIHN0YXJ0IG9mIGFuaW1hdGlvblxyXG4gICAgICogQHBhcmFtIGVuZFZhbHVlIHZhbHVlIHRvIGJlIHNldCBpbiBlbmQgb2YgYW5pbWF0aW9uXHJcbiAgICAgKiBAcGFyYW0gZWFzaW5nIGVhc2luZyBmdW5jdGlvbiwgZGVmYXVsdCBpcyBsaW5lYXJcclxuICAgICAqL1xyXG4gICAgc2V0QW5pbWF0YWJsZVByb3BlcnR5KGtleTogU2V0YWJsZUtleXMsIHN0YXJ0RnJhbWU6IG51bWJlciwgZW5kRnJhbWU6IG51bWJlciwgc3RhcnRWYWx1ZTogYW55LCBlbmRWYWx1ZTogYW55LCBlYXNpbmc/OiBFYXNpbmdGdW5jdGlvbikge1xyXG4gICAgICAgIGlmIChlbmRGcmFtZSA8PSBzdGFydEZyYW1lKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRW5kIGZyYW1lIHNob3VsZCBiZSBsYXJnZXIgdGhhbiBzdGFydCBmcmFtZS4nKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnRpbWVSYW5nZVtrZXldID0gZW5kRnJhbWUgKyAxXHJcbiAgICAgICAgdGhpcy51cGRhdGVUaW1lUmFuZ2UoKVxyXG4gICAgICAgIGlmICghZWFzaW5nKSB7XHJcbiAgICAgICAgICAgIGVhc2luZyA9IEVhc2luZ0ZhY3RvcnkubGluZWFyKClcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGJhc2U6IGFueSwgazogc3RyaW5nIHwgdW5kZWZpbmVkLCBpbmRleDogbnVtYmVyIHwgdW5kZWZpbmVkLCB3cmFwID0gdHJ1ZTtcclxuICAgICAgICBbYmFzZSwgaywgaW5kZXhdID0gdGhpcy5jb21tb25Qcm9wZXJ0eU1hcHBpbmcoa2V5KVxyXG4gICAgICAgIGlmICghayB8fCBpbmRleCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoa2V5KSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICd0ZXh0JzpcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5yb290LnR5ID09IDUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMucm9vdC50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0ZXh0UHJvcCA9IGJhc2UuZC5rWzBdLnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRtcFN0YXJ0VmFsdWUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRleHRQcm9wKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRtcEVuZFZhbHVlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0ZXh0UHJvcCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRtcFN0YXJ0VmFsdWUudCA9IHN0YXJ0VmFsdWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG1wRW5kVmFsdWUudCA9IGVuZFZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWUgPSB0bXBTdGFydFZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlID0gdG1wRW5kVmFsdWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgayA9ICdkJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IC0xXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdyYXAgPSBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGtleSwgc3RhcnRGcmFtZSwgZW5kRnJhbWUsIHN0YXJ0VmFsdWUsIGVuZFZhbHVlLCBlYXNpbmcpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgYSB2YWxpZCBrZXkuJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYmFzZSAmJiBrICYmIGluZGV4ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkoYmFzZSwgaylcclxuICAgICAgICAgICAgdGhpcy5hZGRLZXlmcmFtZShiYXNlLCBrLCBpbmRleCwgc3RhcnRGcmFtZSwgc3RhcnRWYWx1ZSwgZWFzaW5nLCB3cmFwKVxyXG4gICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKGJhc2UsIGssIGluZGV4LCBlbmRGcmFtZSwgZW5kVmFsdWUsIHVuZGVmaW5lZCwgd3JhcClcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBMYXllckZhY3Rvcnkge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2VuZXJhdGVUcmFuc2Zvcm0oY29vcmRpbmF0ZTogbnVtYmVyW10pOiBUcmFuc2Zvcm0ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG86IHtcclxuICAgICAgICAgICAgICAgIGE6IDAsXHJcbiAgICAgICAgICAgICAgICBrOiAxMDBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcjoge1xyXG4gICAgICAgICAgICAgICAgYTogMCxcclxuICAgICAgICAgICAgICAgIGs6IDBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcDoge1xyXG4gICAgICAgICAgICAgICAgYTogMCxcclxuICAgICAgICAgICAgICAgIGs6IFtcclxuICAgICAgICAgICAgICAgICAgICBjb29yZGluYXRlWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVbMV0sXHJcbiAgICAgICAgICAgICAgICAgICAgMFxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhOiB7XHJcbiAgICAgICAgICAgICAgICBhOiAwLFxyXG4gICAgICAgICAgICAgICAgazogW1xyXG4gICAgICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgICAgICAgICAwXHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHM6IHtcclxuICAgICAgICAgICAgICAgIGE6IDAsXHJcbiAgICAgICAgICAgICAgICBrOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgMTAwLFxyXG4gICAgICAgICAgICAgICAgICAgIDEwMCxcclxuICAgICAgICAgICAgICAgICAgICAxMDBcclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGNyZWF0ZSB0aGUgYm91bmRpbmcgYm94IG9mIHN2ZyBlbGVtZW50XHJcbiAgICAgKiBAcGFyYW0gZG9tIHN2ZyBlbGVtZW50IG5lZWRzIHRvIGNhbGN1bGF0ZSB0aGUgYm91bmRpbmcgYm94XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBib3VuZGluZ0JveChkb206IFNWR0dyYXBoaWNzRWxlbWVudCkge1xyXG4gICAgICAgIGNvbnN0IGJvdW5kaW5nQm94ID0gZ2V0Qm91bmRpbmdCb3goZG9tKS5tYXAoKHYsIGkpID0+IGkgPCAyID8gdiAtIDEgOiB2ICsgMSkgYXMgW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl1cclxuICAgICAgICByZXR1cm4gdGhpcy5yZWN0KC4uLmJvdW5kaW5nQm94KVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogY3JlYXRlIHRoZSBzYW1lIHNoYXBlIG9mIHN2ZyBwYXRoXHJcbiAgICAgKiBAcGFyYW0gZG9tIHN2ZyBwYXRoIGVsZW1lbnQgcmVwcmVzZW50IHRoZSBzaGFwZVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgc2hhcGUoZG9tOiBTVkdQYXRoRWxlbWVudCkge1xyXG4gICAgICAgIGNvbnN0IGNvb3JkaW5hdGUgPSBnZXRCb3VuZGluZ0JveChkb20pXHJcbiAgICAgICAgY29uc3QgbGF5ZXI6IFNoYXBlTGF5ZXIgPSB7XHJcbiAgICAgICAgICAgIHR5OiA0LFxyXG4gICAgICAgICAgICBkZGQ6IDAsXHJcbiAgICAgICAgICAgIHNyOiAxLFxyXG4gICAgICAgICAgICBhbzogMCxcclxuICAgICAgICAgICAga3M6IHRoaXMuZ2VuZXJhdGVUcmFuc2Zvcm0oY29vcmRpbmF0ZSksXHJcbiAgICAgICAgICAgIGlwOiAwLFxyXG4gICAgICAgICAgICBvcDogMSxcclxuICAgICAgICAgICAgc3Q6IDAsXHJcbiAgICAgICAgICAgIGJtOiAwLFxyXG4gICAgICAgICAgICBzaGFwZXM6IHJlbmRlcihkb20pXHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IEpTTW92aW5MYXllcihsYXllcilcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGNyZWF0ZSBhIHJlY3RhbmdsZVxyXG4gICAgICogQHBhcmFtIGxlZnQgbGVmdCBvZiByZWN0XHJcbiAgICAgKiBAcGFyYW0gdG9wIHRvcCBvZiByZWN0XHJcbiAgICAgKiBAcGFyYW0gd2lkdGggd2lkdGggb2YgcmVjdFxyXG4gICAgICogQHBhcmFtIGhlaWdodCBoZWlnaHQgb2YgcmVjdFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVjdChsZWZ0OiBudW1iZXIsIHRvcDogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGxheWVyOiBTaGFwZUxheWVyID0ge1xyXG4gICAgICAgICAgICB0eTogNCxcclxuICAgICAgICAgICAgZGRkOiAwLFxyXG4gICAgICAgICAgICBzcjogMSxcclxuICAgICAgICAgICAgYW86IDAsXHJcbiAgICAgICAgICAgIGtzOiB0aGlzLmdlbmVyYXRlVHJhbnNmb3JtKFtsZWZ0LCB0b3AsIHdpZHRoLCBoZWlnaHRdKSxcclxuICAgICAgICAgICAgaXA6IDAsXHJcbiAgICAgICAgICAgIG9wOiAxLFxyXG4gICAgICAgICAgICBzdDogMCxcclxuICAgICAgICAgICAgYm06IDAsXHJcbiAgICAgICAgICAgIHNoYXBlczogW1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyUGxhaW5HbHlwaCgncmVjdCcsIFt3aWR0aCwgaGVpZ2h0XSlcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IEpTTW92aW5MYXllcihsYXllcilcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGNyZWF0ZSBhIGVsbGlwc2VcclxuICAgICAqIEBwYXJhbSBjeCB4IGNlbnRlciBvZiBlbGxpcHNlXHJcbiAgICAgKiBAcGFyYW0gY3kgeSBjZW50ZXIgb2YgZWxsaXBzZVxyXG4gICAgICogQHBhcmFtIHJ4IHggcmFkaXVzIG9mIGVsbGlwc2VcclxuICAgICAqIEBwYXJhbSByeSB5IHJhZGl1cyBvZiBlbGxpcHNlXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBlbGxpcHNlKGN4OiBudW1iZXIsIGN5OiBudW1iZXIsIHJ4OiBudW1iZXIsIHJ5OiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBsYXllcjogU2hhcGVMYXllciA9IHtcclxuICAgICAgICAgICAgdHk6IDQsXHJcbiAgICAgICAgICAgIGRkZDogMCxcclxuICAgICAgICAgICAgc3I6IDEsXHJcbiAgICAgICAgICAgIGFvOiAwLFxyXG4gICAgICAgICAgICBrczogdGhpcy5nZW5lcmF0ZVRyYW5zZm9ybShbY3ggLSByeCwgY3kgLSByeSwgMiAqIHJ4LCAyICogcnldKSxcclxuICAgICAgICAgICAgaXA6IDAsXHJcbiAgICAgICAgICAgIG9wOiAxLFxyXG4gICAgICAgICAgICBzdDogMCxcclxuICAgICAgICAgICAgYm06IDAsXHJcbiAgICAgICAgICAgIHNoYXBlczogW1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyUGxhaW5HbHlwaCgnZWxsaXBzZScsIFtyeCwgcnldKVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgSlNNb3ZpbkxheWVyKGxheWVyKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogbWFrZSBhIGxheWVyIGJ5IGFzc2V0IElEXHJcbiAgICAgKiBAcGFyYW0gaWQgYXNzZXQgcmVmZXJlbmNlIElEXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZWYoaWQ6IFJlZmVyZW5jZUlEKSB7XHJcbiAgICAgICAgY29uc3QgbGF5ZXIgPSBuZXcgSlNNb3ZpbkxheWVyKHtcclxuICAgICAgICAgICAgdHk6IDAsXHJcbiAgICAgICAgICAgIGRkZDogMCxcclxuICAgICAgICAgICAgc3I6IDEsXHJcbiAgICAgICAgICAgIGFvOiAwLFxyXG4gICAgICAgICAgICBrczogdGhpcy5nZW5lcmF0ZVRyYW5zZm9ybShbMCwgMCwgMCwgMF0pLFxyXG4gICAgICAgICAgICBpcDogMCxcclxuICAgICAgICAgICAgb3A6IDEsXHJcbiAgICAgICAgICAgIHN0OiAwLFxyXG4gICAgICAgICAgICBibTogMCxcclxuICAgICAgICAgICAgdzogOWU5LFxyXG4gICAgICAgICAgICBoOiA5ZTksXHJcbiAgICAgICAgICAgIHJlZklkOiBpZFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIGxheWVyXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBtYWtlIGEgY29tcGxleCBsYXllciBieSBhbiBhcmJpdHJhcnkgc3ZnIGVsZW1lbnRcclxuICAgICAqIEBwYXJhbSBkb20gc3ZnIGVsZW1lbnQgbmVlZCB0byBiZSBwYXJzZWRcclxuICAgICAqIEBwYXJhbSBhc3NldExpc3QgYSBsaXN0IGNvbnRhaW5zIGltYWdlL2xheWVyIGFzc2V0XHJcbiAgICAgKiBAcGFyYW0gZm9udExpc3QgYSBsaXN0IGNvbnRhaW5zIGZvbnQgYXNzZXRcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGhpZXJhcmNoeShkb206IFNWR0dyYXBoaWNzRWxlbWVudCwgYXNzZXRMaXN0OiBBc3NldHMsIGZvbnRMaXN0OiBGb250cykge1xyXG4gICAgICAgIGNvbnN0IGNvb3JkaW5hdGUgPSBnZXRCb3VuZGluZ0JveChkb20pXHJcbiAgICAgICAgbGV0IGRvbVR5cGU6IDIgfCA0IHwgNSB8IDA7XHJcbiAgICAgICAgaWYgKGRvbSBpbnN0YW5jZW9mIFNWR1RleHRFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGRvbVR5cGUgPSA1XHJcbiAgICAgICAgfSBlbHNlIGlmIChkb20gaW5zdGFuY2VvZiBTVkdJbWFnZUVsZW1lbnQpIHtcclxuICAgICAgICAgICAgZG9tVHlwZSA9IDJcclxuICAgICAgICB9IGVsc2UgaWYgKGRvbSBpbnN0YW5jZW9mIFNWR0dFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGRvbVR5cGUgPSAwXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZG9tVHlwZSA9IDRcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgbGF5ZXI6IFNoYXBlTGF5ZXIgfCBJbWFnZUxheWVyIHwgVGV4dExheWVyIHwgUHJlQ29tcExheWVyID0ge1xyXG4gICAgICAgICAgICB0eTogZG9tVHlwZSxcclxuICAgICAgICAgICAgZGRkOiAwLFxyXG4gICAgICAgICAgICBzcjogMSxcclxuICAgICAgICAgICAgYW86IDAsXHJcbiAgICAgICAgICAgIGtzOiB0aGlzLmdlbmVyYXRlVHJhbnNmb3JtKGRvbVR5cGUgPT0gMCA/IFswLCAwLCAwLCAwXSA6IGNvb3JkaW5hdGUpLFxyXG4gICAgICAgICAgICBpcDogMCxcclxuICAgICAgICAgICAgb3A6IDEsXHJcbiAgICAgICAgICAgIHN0OiAwLFxyXG4gICAgICAgICAgICBibTogMFxyXG4gICAgICAgIH1cclxuICAgICAgICBzd2l0Y2ggKGRvbVR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgY29uc3QgZG9tTGVhdmVzID0gZ2V0TGVhZk5vZGVzKGRvbSlcclxuICAgICAgICAgICAgICAgIGlmIChkb21MZWF2ZXMuZmlsdGVyKGRvbSA9PiBkb20gaW5zdGFuY2VvZiBTVkdUZXh0RWxlbWVudCB8fCBkb20gaW5zdGFuY2VvZiBTVkdJbWFnZUVsZW1lbnQpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByZWNvbXBMYXllciA9IGxheWVyIGFzIFByZUNvbXBMYXllclxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByZUNvbXBBc3NldDogSlNNb3ZpbkxheWVyW10gPSBbXVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByZUNvbXBSZWZJZCA9IHV1aWQoKVxyXG4gICAgICAgICAgICAgICAgICAgIGRvbUxlYXZlcy5mb3JFYWNoKGQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZCBpbnN0YW5jZW9mIFNWR0dyYXBoaWNzRWxlbWVudCAmJiAhKGQgaW5zdGFuY2VvZiBTVkdHRWxlbWVudCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZUNvbXBBc3NldC51bnNoaWZ0KHRoaXMuaGllcmFyY2h5KGQsIGFzc2V0TGlzdCwgZm9udExpc3QpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICBwcmVDb21wQXNzZXQuZm9yRWFjaChsYXllciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxheWVyLnJvb3Qub3AgPSA5ZTlcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIHByZWNvbXBMYXllci53ID0gY29vcmRpbmF0ZVswXSArIGNvb3JkaW5hdGVbMl0gKyAxXHJcbiAgICAgICAgICAgICAgICAgICAgcHJlY29tcExheWVyLmggPSBjb29yZGluYXRlWzFdICsgY29vcmRpbmF0ZVszXSArIDFcclxuICAgICAgICAgICAgICAgICAgICBwcmVjb21wTGF5ZXIucmVmSWQgPSBwcmVDb21wUmVmSWRcclxuICAgICAgICAgICAgICAgICAgICBhc3NldExpc3QucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBwcmVDb21wUmVmSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxheWVyczogcHJlQ29tcEFzc2V0Lm1hcChsYXllciA9PiBsYXllci5yb290KVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNoYXBlTGF5ZXIgPSBsYXllciBhcyBTaGFwZUxheWVyXHJcbiAgICAgICAgICAgICAgICAgICAgc2hhcGVMYXllci50eSA9IDRcclxuICAgICAgICAgICAgICAgICAgICBzaGFwZUxheWVyLmtzID0gdGhpcy5nZW5lcmF0ZVRyYW5zZm9ybShjb29yZGluYXRlKVxyXG4gICAgICAgICAgICAgICAgICAgIHNoYXBlTGF5ZXIuc2hhcGVzID0gcmVuZGVyKGRvbSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgIGNvbnN0IGltYWdlTGF5ZXIgPSBsYXllciBhcyBJbWFnZUxheWVyXHJcbiAgICAgICAgICAgICAgICBjb25zdCBbaW1hZ2VSZWZJZCwgaW1hZ2VBc3NldF0gPSByZW5kZXJJbWFnZShkb20gYXMgU1ZHSW1hZ2VFbGVtZW50LCBhc3NldExpc3QpXHJcbiAgICAgICAgICAgICAgICBpbWFnZUxheWVyLnJlZklkID0gaW1hZ2VSZWZJZFxyXG4gICAgICAgICAgICAgICAgaWYgKCFhc3NldExpc3QuZmlsdGVyKGEgPT4gYS5pZCA9PSBpbWFnZVJlZklkKS5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICAgICAgYXNzZXRMaXN0LnB1c2goaW1hZ2VBc3NldClcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNoYXBlTGF5ZXIgPSBsYXllciBhcyBTaGFwZUxheWVyXHJcbiAgICAgICAgICAgICAgICBzaGFwZUxheWVyLnNoYXBlcyA9IHJlbmRlcihkb20pXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlIDU6XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0TGF5ZXIgPSBsYXllciBhcyBUZXh0TGF5ZXJcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBtb3ZlIHRleHRMYXllcidzIHBvc2l0aW9uIHRvIHRleHQtYW5jaG9yLXJlbGF0ZWRcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJhc2VMaW5lSGVpZ2h0ID0gZ2V0QmFzZWxpbmVIZWlnaHQoZG9tIGFzIFNWR1RleHRFbGVtZW50KVxyXG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dEFuY2hvciA9IGVuY29kZVRleHRBbmNob3IoZ2V0Q29tcHV0ZWRTdHlsZShkb20pLnRleHRBbmNob3IpXHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0QW5jaG9yV2VpZ2h0ID0gWzAsIDEsIDAuNV1bdGV4dEFuY2hvcl1cclxuICAgICAgICAgICAgICAgIHRleHRMYXllci5rcyEucCEuayA9IFtjb29yZGluYXRlWzBdICsgY29vcmRpbmF0ZVsyXSAqIHRleHRBbmNob3JXZWlnaHQsIGNvb3JkaW5hdGVbMV0gKyBjb29yZGluYXRlWzNdIC0gYmFzZUxpbmVIZWlnaHQsIDBdXHJcbiAgICAgICAgICAgICAgICB0ZXh0TGF5ZXIua3MhLm8hLmsgPSB+fihwYXJzZUZsb2F0KGdldENvbXB1dGVkU3R5bGUoZG9tKS5maWxsT3BhY2l0eSB8fCAnMScpICogMTAwKVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IFt0ZXh0RGF0YSwgZm9udF0gPSByZW5kZXJUZXh0KGRvbSBhcyBTVkdUZXh0RWxlbWVudCwgZm9udExpc3QpXHJcbiAgICAgICAgICAgICAgICB0ZXh0TGF5ZXIudCA9IHRleHREYXRhXHJcbiAgICAgICAgICAgICAgICBpZiAoIWZvbnRMaXN0Lmxpc3QhLmZpbHRlcihmID0+IGYuZk5hbWUgPT0gZm9udC5mTmFtZSkubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgICAgIGZvbnRMaXN0Lmxpc3QhLnB1c2goZm9udClcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IG1vdmluTGF5ZXIgPSBuZXcgSlNNb3ZpbkxheWVyKGxheWVyKVxyXG4gICAgICAgIHJldHVybiBtb3ZpbkxheWVyXHJcbiAgICB9XHJcbn0iXX0=