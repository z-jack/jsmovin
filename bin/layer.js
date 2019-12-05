"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LayerFactory = exports.JSMovinLayer = void 0;

var _easing = require("./easing");

var _render = require("./render");

var _helper = require("./helper");

var _v = _interopRequireDefault(require("uuid/v4"));

var _path = require("./path");

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

      if (value instanceof _path.PathMaker) {
        value.uniform();
        value = value.path;
      }

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

      if (startValue instanceof _path.PathMaker || endValue instanceof _path.PathMaker) {
        [startValue, endValue].forEach(function (v) {
          return v instanceof _path.PathMaker && v.uniform();
        });

        if (startValue instanceof _path.PathMaker && endValue instanceof _path.PathMaker) {
          var startLineCount = startValue.path.v.length - 1;
          var endLineCount = endValue.path.v.length - 1;
          var commonMultiple = (0, _helper.leastCommonMultiple)(startLineCount, endLineCount);
          startValue.upsample(Math.round(commonMultiple / startLineCount));
          endValue.upsample(Math.round(commonMultiple / endLineCount));
        }

        var _map = [startValue, endValue].map(function (v) {
          return v instanceof _path.PathMaker ? v.path : v;
        });

        var _map2 = _slicedToArray(_map, 2);

        startValue = _map2[0];
        endValue = _map2[1];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sYXllci50cyJdLCJuYW1lcyI6WyJKU01vdmluTGF5ZXIiLCJrZXkiLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJhbmNob3IiLCJwb3NpdGlvbiIsInMiLCJrIiwiZSIsIm8iLCJ0cmFuc2Zvcm0iLCJhIiwiZ2V0RGVmYXVsdFByb3BlcnR5Iiwic3RhdGljVmFsdWUiLCJpZHgiLCJ0aW1lIiwidmFsdWUiLCJlYXNpbmciLCJ3cmFwIiwiZXhpc3RLZXlmcmFtZSIsImZpbHRlciIsIngiLCJ0IiwicmVhZHlUb1NldCIsImxlbmd0aCIsInByZXZpb3VzS2V5ZnJhbWVDb3VudCIsInJlZHVjZSIsInAiLCJzcGxpY2UiLCJ5IiwiaSIsIkFycmF5Iiwicm9vdCIsInNoYXBlcyIsIml0IiwiZmluZCIsInNoYXBlIiwidHkiLCJmaW5kUHJvcGVydHlDb25maWciLCJoYXNUcmFuc2Zvcm0iLCJjb25maWciLCJncm91cFNoYXBlcyIsInB1c2giLCJiYXNlIiwiaW5kZXgiLCJrcyIsImZpbmRPckluc2VydFByb3BlcnR5Q29uZmlnIiwib3AiLCJNYXRoIiwibWF4IiwiT2JqZWN0IiwidmFsdWVzIiwidGltZVJhbmdlIiwicmVmIiwidXBkYXRlVGltZVJhbmdlIiwiUGF0aE1ha2VyIiwidW5pZm9ybSIsInBhdGgiLCJjb21tb25Qcm9wZXJ0eU1hcHBpbmciLCJ1bmRlZmluZWQiLCJkb2MiLCJkIiwiY29uc29sZSIsImVycm9yIiwiRXJyb3IiLCJjb252ZXJ0VG9TdGF0aWNQcm9wZXJ0eSIsInN0YXJ0RnJhbWUiLCJlbmRGcmFtZSIsInN0YXJ0VmFsdWUiLCJlbmRWYWx1ZSIsIkVhc2luZ0ZhY3RvcnkiLCJsaW5lYXIiLCJmb3JFYWNoIiwidiIsInN0YXJ0TGluZUNvdW50IiwiZW5kTGluZUNvdW50IiwiY29tbW9uTXVsdGlwbGUiLCJ1cHNhbXBsZSIsInJvdW5kIiwibWFwIiwidGV4dFByb3AiLCJ0bXBTdGFydFZhbHVlIiwidG1wRW5kVmFsdWUiLCJjb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkiLCJhZGRLZXlmcmFtZSIsIkxheWVyRmFjdG9yeSIsImNvb3JkaW5hdGUiLCJyIiwiZG9tIiwiYm91bmRpbmdCb3giLCJyZWN0IiwibGF5ZXIiLCJkZGQiLCJzciIsImFvIiwiZ2VuZXJhdGVUcmFuc2Zvcm0iLCJpcCIsInN0IiwiYm0iLCJsZWZ0IiwidG9wIiwid2lkdGgiLCJoZWlnaHQiLCJjeCIsImN5IiwicngiLCJyeSIsImlkIiwidyIsImgiLCJyZWZJZCIsImFzc2V0TGlzdCIsImZvbnRMaXN0IiwiZG9tVHlwZSIsIlNWR1RleHRFbGVtZW50IiwiU1ZHSW1hZ2VFbGVtZW50IiwiU1ZHR0VsZW1lbnQiLCJkb21MZWF2ZXMiLCJwcmVjb21wTGF5ZXIiLCJwcmVDb21wQXNzZXQiLCJwcmVDb21wUmVmSWQiLCJTVkdHcmFwaGljc0VsZW1lbnQiLCJ1bnNoaWZ0IiwiaGllcmFyY2h5IiwibGF5ZXJzIiwic2hhcGVMYXllciIsImltYWdlTGF5ZXIiLCJpbWFnZVJlZklkIiwiaW1hZ2VBc3NldCIsInRleHRMYXllciIsImJhc2VMaW5lSGVpZ2h0IiwidGV4dEFuY2hvciIsImdldENvbXB1dGVkU3R5bGUiLCJ0ZXh0QW5jaG9yV2VpZ2h0IiwicGFyc2VGbG9hdCIsImZpbGxPcGFjaXR5IiwidGV4dERhdGEiLCJmb250IiwibGlzdCIsImYiLCJmTmFtZSIsIm1vdmluTGF5ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFJYUEsWTs7Ozs7dUNBS2tCQyxHLEVBQWE7QUFDcEMsY0FBUUEsR0FBUjtBQUNJLGFBQUssR0FBTDtBQUNBLGFBQUssR0FBTDtBQUNJLGlCQUFPQyxJQUFJLENBQUNDLEtBQUwsQ0FBV0QsSUFBSSxDQUFDRSxTQUFMLENBQWVILEdBQUcsSUFBSSxHQUFQLEdBQWEsS0FBS0ksTUFBbEIsR0FBMkIsS0FBS0MsUUFBL0MsQ0FBWCxDQUFQOztBQUNKLGFBQUssR0FBTDtBQUNJLGlCQUFPLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxHQUFYLENBQVA7O0FBQ0osYUFBSyxHQUFMO0FBQ0ksaUJBQU8sR0FBUDs7QUFDSixhQUFLLEdBQUw7QUFDSSxpQkFBTyxDQUFQOztBQUNKLGFBQUssSUFBTDtBQUNJLGlCQUFPO0FBQ0hDLFlBQUFBLENBQUMsRUFBRTtBQUNDQyxjQUFBQSxDQUFDLEVBQUU7QUFESixhQURBO0FBSUhDLFlBQUFBLENBQUMsRUFBRTtBQUNDRCxjQUFBQSxDQUFDLEVBQUU7QUFESixhQUpBO0FBT0hFLFlBQUFBLENBQUMsRUFBRTtBQUNDRixjQUFBQSxDQUFDLEVBQUU7QUFESjtBQVBBLFdBQVA7O0FBV0o7QUFDSSxpQkFBTyxDQUFQO0FBdkJSO0FBeUJIOzs7NENBQytCRyxTLEVBQWdCVixHLEVBQWE7QUFDekQsVUFBSSxDQUFDVSxTQUFTLENBQUNWLEdBQUQsQ0FBZCxFQUFxQjtBQUNqQlUsUUFBQUEsU0FBUyxDQUFDVixHQUFELENBQVQsR0FBaUI7QUFDYlcsVUFBQUEsQ0FBQyxFQUFFLENBRFU7QUFFYkosVUFBQUEsQ0FBQyxFQUFFLEtBQUtLLGtCQUFMLENBQXdCWixHQUF4QjtBQUZVLFNBQWpCO0FBSUg7O0FBQ0QsVUFBSVUsU0FBUyxDQUFDVixHQUFELENBQVQsQ0FBZVcsQ0FBZixJQUFvQixDQUF4QixFQUEyQjtBQUN2QixZQUFNRSxXQUFXLEdBQUdILFNBQVMsQ0FBQ1YsR0FBRCxDQUFULENBQWVPLENBQWYsQ0FBaUIsQ0FBakIsRUFBb0JELENBQXhDO0FBQ0FJLFFBQUFBLFNBQVMsQ0FBQ1YsR0FBRCxDQUFULEdBQWlCO0FBQ2JXLFVBQUFBLENBQUMsRUFBRSxDQURVO0FBRWJKLFVBQUFBLENBQUMsRUFBRU07QUFGVSxTQUFqQjtBQUlIO0FBQ0o7OztnREFDbUNILFMsRUFBZ0JWLEcsRUFBYTtBQUM3RCxVQUFJLENBQUNVLFNBQVMsQ0FBQ1YsR0FBRCxDQUFWLElBQW1CLENBQUNVLFNBQVMsQ0FBQ1YsR0FBRCxDQUFULENBQWVXLENBQXZDLEVBQTBDO0FBQ3RDLFlBQUlYLEdBQUcsSUFBSSxHQUFYLEVBQWdCO0FBQ1osZUFBS0ksTUFBTCxHQUFjTSxTQUFTLENBQUNWLEdBQUQsQ0FBVCxHQUFpQlUsU0FBUyxDQUFDVixHQUFELENBQVQsQ0FBZU8sQ0FBaEMsR0FBb0MsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsQ0FBbEQ7QUFDSDs7QUFDRCxZQUFJUCxHQUFHLElBQUksR0FBWCxFQUFnQjtBQUNaLGVBQUtLLFFBQUwsR0FBZ0JLLFNBQVMsQ0FBQ1YsR0FBRCxDQUFULEdBQWlCVSxTQUFTLENBQUNWLEdBQUQsQ0FBVCxDQUFlTyxDQUFoQyxHQUFvQyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxDQUFwRDtBQUNIOztBQUNERyxRQUFBQSxTQUFTLENBQUNWLEdBQUQsQ0FBVCxHQUFpQjtBQUNiVyxVQUFBQSxDQUFDLEVBQUUsQ0FEVTtBQUViSixVQUFBQSxDQUFDLEVBQUU7QUFGVSxTQUFqQjtBQUlIO0FBQ0o7OztnQ0FDbUJHLFMsRUFBZ0JWLEcsRUFBK0c7QUFBQSxVQUFsR2MsR0FBa0csdUVBQXBGLENBQUMsQ0FBbUY7QUFBQSxVQUFoRkMsSUFBZ0Y7QUFBQSxVQUFsRUMsS0FBa0U7QUFBQSxVQUEvQ0MsTUFBK0M7QUFBQSxVQUF0QkMsSUFBc0IsdUVBQU4sSUFBTTtBQUMvSSxVQUFNQyxhQUFhLEdBQUdULFNBQVMsQ0FBQ1YsR0FBRCxDQUFULENBQWVPLENBQWYsQ0FBaUJhLE1BQWpCLENBQXdCLFVBQUNDLENBQUQ7QUFBQSxlQUFZQSxDQUFDLENBQUNDLENBQUYsSUFBT1AsSUFBbkI7QUFBQSxPQUF4QixDQUF0QjtBQUNBLFVBQUlRLFVBQUo7O0FBQ0EsVUFBSUosYUFBYSxDQUFDSyxNQUFsQixFQUEwQjtBQUN0QkQsUUFBQUEsVUFBVSxHQUFHSixhQUFhLENBQUMsQ0FBRCxDQUExQjtBQUNILE9BRkQsTUFFTztBQUNISSxRQUFBQSxVQUFVLEdBQUc7QUFDVEQsVUFBQUEsQ0FBQyxFQUFFUCxJQURNO0FBRVRULFVBQUFBLENBQUMsRUFBRSxLQUFLTSxrQkFBTCxDQUF3QlosR0FBeEI7QUFGTSxTQUFiO0FBSUEsWUFBTXlCLHFCQUFxQixHQUFHZixTQUFTLENBQUNWLEdBQUQsQ0FBVCxDQUFlTyxDQUFmLENBQWlCbUIsTUFBakIsQ0FBd0IsVUFBQ0MsQ0FBRCxFQUFZTixDQUFaO0FBQUEsaUJBQXVCQSxDQUFDLENBQUNDLENBQUYsR0FBTVAsSUFBTixHQUFhWSxDQUFDLEdBQUcsQ0FBakIsR0FBcUJBLENBQTVDO0FBQUEsU0FBeEIsRUFBdUUsQ0FBdkUsQ0FBOUI7QUFDQWpCLFFBQUFBLFNBQVMsQ0FBQ1YsR0FBRCxDQUFULENBQWVPLENBQWYsQ0FBaUJxQixNQUFqQixDQUF3QkgscUJBQXhCLEVBQStDLENBQS9DLEVBQWtERixVQUFsRDtBQUNIOztBQUNELFVBQUlOLE1BQUosRUFBWTtBQUNSTSxRQUFBQSxVQUFVLENBQUNkLENBQVgsR0FBZTtBQUNYWSxVQUFBQSxDQUFDLEVBQUVKLE1BQU0sQ0FBQyxDQUFELENBQU4sQ0FBVSxDQUFWLENBRFE7QUFFWFksVUFBQUEsQ0FBQyxFQUFFWixNQUFNLENBQUMsQ0FBRCxDQUFOLENBQVUsQ0FBVjtBQUZRLFNBQWY7QUFJQU0sUUFBQUEsVUFBVSxDQUFDTyxDQUFYLEdBQWU7QUFDWFQsVUFBQUEsQ0FBQyxFQUFFSixNQUFNLENBQUMsQ0FBRCxDQUFOLENBQVUsQ0FBVixDQURRO0FBRVhZLFVBQUFBLENBQUMsRUFBRVosTUFBTSxDQUFDLENBQUQsQ0FBTixDQUFVLENBQVY7QUFGUSxTQUFmO0FBSUg7O0FBQ0QsVUFBSUgsR0FBRyxJQUFJLENBQVgsRUFBYztBQUNWUyxRQUFBQSxVQUFVLENBQUNqQixDQUFYLENBQWFRLEdBQWIsSUFBb0JFLEtBQXBCO0FBQ0gsT0FGRCxNQUVPO0FBQ0hPLFFBQUFBLFVBQVUsQ0FBQ2pCLENBQVgsR0FBZVksSUFBSSxJQUFJLEVBQUVGLEtBQUssWUFBWWUsS0FBbkIsQ0FBUixHQUFvQyxDQUFDZixLQUFELENBQXBDLEdBQThDQSxLQUE3RDtBQUNIO0FBQ0o7Ozt1Q0FDMEJoQixHLEVBQWE7QUFDcEMsYUFBUyxLQUFLZ0MsSUFBTixDQUEwQkMsTUFBMUIsQ0FBa0MsQ0FBbEMsQ0FBRCxDQUFxREMsRUFBckQsQ0FBeURDLElBQXpELENBQThELFVBQUFDLEtBQUs7QUFBQSxlQUN0RUEsS0FBSyxDQUFDQyxFQUFOLElBQVlyQyxHQUQwRDtBQUFBLE9BQW5FLENBQVA7QUFHSDs7OytDQUNrQ0EsRyxFQUFhO0FBQzVDLFVBQU1tQyxJQUFJLEdBQUcsS0FBS0csa0JBQUwsQ0FBd0J0QyxHQUF4QixDQUFiO0FBQ0EsVUFBSW1DLElBQUosRUFBVSxPQUFPQSxJQUFQO0FBQ1YsVUFBTUksWUFBWSxHQUFHLEtBQUtELGtCQUFMLENBQXdCLElBQXhCLENBQXJCOztBQUNBLFVBQU1FLE1BQU07QUFDUkgsUUFBQUEsRUFBRSxFQUFFckM7QUFESSxTQUVMLEtBQUtZLGtCQUFMLENBQXdCWixHQUF4QixDQUZLLENBQVo7O0FBSUEsVUFBSXVDLFlBQUosRUFBa0I7QUFDZCxZQUFNRSxXQUFXLEdBQUssS0FBS1QsSUFBTixDQUEwQkMsTUFBMUIsQ0FBa0MsQ0FBbEMsQ0FBRCxDQUFxREMsRUFBekU7QUFDQU8sUUFBQUEsV0FBVyxDQUFDYixNQUFaLENBQW1CYSxXQUFXLENBQUNqQixNQUFaLEdBQXFCLENBQXhDLEVBQTJDLENBQTNDLEVBQThDZ0IsTUFBOUM7QUFDSCxPQUhELE1BR087QUFDRCxhQUFLUixJQUFOLENBQTBCQyxNQUExQixDQUFrQyxDQUFsQyxDQUFELENBQXFEQyxFQUFyRCxDQUF5RFEsSUFBekQsQ0FBOERGLE1BQTlEO0FBQ0g7O0FBQ0QsYUFBT0EsTUFBUDtBQUNIOzs7MENBQzZCeEMsRyxFQUFpRTtBQUMzRixVQUFJMkMsSUFBSixFQUFlcEMsQ0FBZixFQUFzQ3FDLEtBQXRDOztBQUNBLGNBQVE1QyxHQUFSO0FBQ0ksYUFBSyxRQUFMO0FBQ0kyQyxVQUFBQSxJQUFJLEdBQUcsS0FBS1gsSUFBTCxDQUFVYSxFQUFqQjtBQUNBdEMsVUFBQUEsQ0FBQyxHQUFHLEdBQUo7QUFDQXFDLFVBQUFBLEtBQUssR0FBRyxDQUFSO0FBQ0E7O0FBQ0osYUFBSyxRQUFMO0FBQ0lELFVBQUFBLElBQUksR0FBRyxLQUFLWCxJQUFMLENBQVVhLEVBQWpCO0FBQ0F0QyxVQUFBQSxDQUFDLEdBQUcsR0FBSjtBQUNBcUMsVUFBQUEsS0FBSyxHQUFHLENBQVI7QUFDQTs7QUFDSixhQUFLLFNBQUw7QUFDSUQsVUFBQUEsSUFBSSxHQUFHLEtBQUtYLElBQUwsQ0FBVWEsRUFBakI7QUFDQXRDLFVBQUFBLENBQUMsR0FBRyxHQUFKO0FBQ0FxQyxVQUFBQSxLQUFLLEdBQUcsQ0FBUjtBQUNBOztBQUNKLGFBQUssU0FBTDtBQUNJRCxVQUFBQSxJQUFJLEdBQUcsS0FBS1gsSUFBTCxDQUFVYSxFQUFqQjtBQUNBdEMsVUFBQUEsQ0FBQyxHQUFHLEdBQUo7QUFDQXFDLFVBQUFBLEtBQUssR0FBRyxDQUFSO0FBQ0E7O0FBQ0osYUFBSyxHQUFMO0FBQ0lELFVBQUFBLElBQUksR0FBRyxLQUFLWCxJQUFMLENBQVVhLEVBQWpCO0FBQ0F0QyxVQUFBQSxDQUFDLEdBQUcsR0FBSjtBQUNBcUMsVUFBQUEsS0FBSyxHQUFHLENBQVI7QUFDQTs7QUFDSixhQUFLLEdBQUw7QUFDSUQsVUFBQUEsSUFBSSxHQUFHLEtBQUtYLElBQUwsQ0FBVWEsRUFBakI7QUFDQXRDLFVBQUFBLENBQUMsR0FBRyxHQUFKO0FBQ0FxQyxVQUFBQSxLQUFLLEdBQUcsQ0FBUjtBQUNBOztBQUNKLGFBQUssUUFBTDtBQUNJRCxVQUFBQSxJQUFJLEdBQUcsS0FBS1gsSUFBTCxDQUFVYSxFQUFqQjtBQUNBdEMsVUFBQUEsQ0FBQyxHQUFHLEdBQUo7QUFDQXFDLFVBQUFBLEtBQUssR0FBRyxDQUFDLENBQVQ7QUFDQTs7QUFDSixhQUFLLFNBQUw7QUFDSUQsVUFBQUEsSUFBSSxHQUFHLEtBQUtYLElBQUwsQ0FBVWEsRUFBakI7QUFDQXRDLFVBQUFBLENBQUMsR0FBRyxHQUFKO0FBQ0FxQyxVQUFBQSxLQUFLLEdBQUcsQ0FBQyxDQUFUO0FBQ0E7O0FBQ0osYUFBSyxXQUFMO0FBQ0lELFVBQUFBLElBQUksR0FBRyxLQUFLRywwQkFBTCxDQUFnQyxJQUFoQyxDQUFQO0FBQ0F2QyxVQUFBQSxDQUFDLEdBQUcsR0FBSjtBQUNBcUMsVUFBQUEsS0FBSyxHQUFHLENBQUMsQ0FBVDtBQUNBOztBQUNKLGFBQUssU0FBTDtBQUNJRCxVQUFBQSxJQUFJLEdBQUcsS0FBS0csMEJBQUwsQ0FBZ0MsSUFBaEMsQ0FBUDtBQUNBdkMsVUFBQUEsQ0FBQyxHQUFHLEdBQUo7QUFDQXFDLFVBQUFBLEtBQUssR0FBRyxDQUFDLENBQVQ7QUFDQTs7QUFDSixhQUFLLFlBQUw7QUFDSUQsVUFBQUEsSUFBSSxHQUFHLEtBQUtHLDBCQUFMLENBQWdDLElBQWhDLENBQVA7QUFDQXZDLFVBQUFBLENBQUMsR0FBRyxHQUFKO0FBQ0FxQyxVQUFBQSxLQUFLLEdBQUcsQ0FBQyxDQUFUO0FBQ0E7O0FBQ0osYUFBSyxXQUFMO0FBQ0lELFVBQUFBLElBQUksR0FBRyxLQUFLTCxrQkFBTCxDQUF3QixJQUF4QixDQUFQO0FBQ0EvQixVQUFBQSxDQUFDLEdBQUcsR0FBSjtBQUNBcUMsVUFBQUEsS0FBSyxHQUFHLENBQUMsQ0FBVDtBQUNBOztBQUNKLGFBQUssYUFBTDtBQUNJRCxVQUFBQSxJQUFJLEdBQUcsS0FBS0wsa0JBQUwsQ0FBd0IsSUFBeEIsQ0FBUDtBQUNBL0IsVUFBQUEsQ0FBQyxHQUFHLEdBQUo7QUFDQXFDLFVBQUFBLEtBQUssR0FBRyxDQUFDLENBQVQ7QUFDQTs7QUFDSixhQUFLLGFBQUw7QUFDSUQsVUFBQUEsSUFBSSxHQUFHLEtBQUtMLGtCQUFMLENBQXdCLElBQXhCLENBQVA7QUFDQS9CLFVBQUFBLENBQUMsR0FBRyxHQUFKO0FBQ0FxQyxVQUFBQSxLQUFLLEdBQUcsQ0FBQyxDQUFUO0FBQ0E7O0FBQ0osYUFBSyxPQUFMO0FBQ0lELFVBQUFBLElBQUksR0FBRyxLQUFLTCxrQkFBTCxDQUF3QixJQUF4QixDQUFQO0FBQ0EvQixVQUFBQSxDQUFDLEdBQUcsSUFBSjtBQUNBcUMsVUFBQUEsS0FBSyxHQUFHLENBQUMsQ0FBVDtBQUNBOztBQUNKLGFBQUssYUFBTDtBQUNJRCxVQUFBQSxJQUFJLEdBQUcsS0FBS0wsa0JBQUwsQ0FBd0IsSUFBeEIsQ0FBUDtBQUNBL0IsVUFBQUEsQ0FBQyxHQUFHLEdBQUo7QUFDQXFDLFVBQUFBLEtBQUssR0FBRyxDQUFDLENBQVQ7QUFDQTs7QUFDSixhQUFLLGVBQUw7QUFDSUQsVUFBQUEsSUFBSSxHQUFHLEtBQUtMLGtCQUFMLENBQXdCLElBQXhCLENBQVA7QUFDQS9CLFVBQUFBLENBQUMsR0FBRyxHQUFKO0FBQ0FxQyxVQUFBQSxLQUFLLEdBQUcsQ0FBQyxDQUFUO0FBQ0E7QUFyRlI7O0FBdUZBLGFBQU8sQ0FBQ0QsSUFBRCxFQUFPcEMsQ0FBUCxFQUFVcUMsS0FBVixDQUFQO0FBQ0g7OztzQ0FDeUI7QUFDdEIsV0FBS1osSUFBTCxDQUFVZSxFQUFWLEdBQWVDLElBQUksQ0FBQ0MsR0FBTCxPQUFBRCxJQUFJLHFCQUFRRSxNQUFNLENBQUNDLE1BQVAsQ0FBYyxLQUFLQyxTQUFuQixDQUFSLFVBQXVDLENBQXZDLEdBQW5CO0FBQ0g7OztBQUVELHdCQUFZQyxHQUFaLEVBQXFFO0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUEsdUNBMU10QixFQTBNc0I7O0FBQ2pFLFNBQUtyQixJQUFMLEdBQVlxQixHQUFaO0FBQ0EsU0FBS2pELE1BQUwsR0FBYyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxDQUFkO0FBQ0EsU0FBS0MsUUFBTCxHQUFnQixDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxDQUFoQjtBQUNIO0FBRUQ7Ozs7Ozs7OztzQ0FLa0JMLEcsRUFBa0JnQixLLEVBQVk7QUFDNUMsV0FBS29DLFNBQUwsQ0FBZXBELEdBQWYsSUFBc0IsQ0FBdEI7QUFDQSxXQUFLc0QsZUFBTDs7QUFDQSxVQUFJdEMsS0FBSyxZQUFZdUMsZUFBckIsRUFBZ0M7QUFDNUJ2QyxRQUFBQSxLQUFLLENBQUN3QyxPQUFOO0FBQ0F4QyxRQUFBQSxLQUFLLEdBQUdBLEtBQUssQ0FBQ3lDLElBQWQ7QUFDSDs7QUFDRCxVQUFJZCxJQUFKLEVBQWVwQyxDQUFmLEVBQXNDcUMsS0FBdEM7O0FBUDRDLGtDQVF6QixLQUFLYyxxQkFBTCxDQUEyQjFELEdBQTNCLENBUnlCOztBQUFBOztBQVEzQzJDLE1BQUFBLElBUjJDO0FBUXJDcEMsTUFBQUEsQ0FScUM7QUFRbENxQyxNQUFBQSxLQVJrQzs7QUFTNUMsVUFBSSxDQUFDckMsQ0FBRCxJQUFNcUMsS0FBSyxLQUFLZSxTQUFwQixFQUErQjtBQUMzQixnQkFBUTNELEdBQVI7QUFDSSxlQUFLLE1BQUw7QUFDSSxnQkFBSSxLQUFLZ0MsSUFBTCxDQUFVSyxFQUFWLElBQWdCLENBQXBCLEVBQXVCO0FBQ25CLGtCQUFNdUIsR0FBRyxHQUFHLEtBQUs1QixJQUFMLENBQVVWLENBQVYsQ0FBYXVDLENBQXpCO0FBQ0FELGNBQUFBLEdBQUcsQ0FBQ3JELENBQUosR0FBUSxDQUFDcUQsR0FBRyxDQUFDckQsQ0FBSixDQUFPLENBQVAsQ0FBRCxDQUFSO0FBQ0FxRCxjQUFBQSxHQUFHLENBQUNyRCxDQUFKLENBQU0sQ0FBTixFQUFTZSxDQUFULEdBQWEsQ0FBYjtBQUNBc0MsY0FBQUEsR0FBRyxDQUFDckQsQ0FBSixDQUFNLENBQU4sRUFBU0QsQ0FBVCxDQUFZZ0IsQ0FBWixHQUFnQk4sS0FBaEI7QUFDSDs7QUFDRDs7QUFDSjtBQUNJOEMsWUFBQUEsT0FBTyxDQUFDQyxLQUFSLENBQWMvRCxHQUFkLEVBQW1CZ0IsS0FBbkI7QUFDQSxrQkFBTSxJQUFJZ0QsS0FBSixDQUFVLGtCQUFWLENBQU47QUFYUjtBQWFIOztBQUNELFVBQUlyQixJQUFJLElBQUlwQyxDQUFSLElBQWFxQyxLQUFLLEtBQUtlLFNBQTNCLEVBQXNDO0FBQ2xDLGFBQUtNLHVCQUFMLENBQTZCdEIsSUFBN0IsRUFBbUNwQyxDQUFuQztBQUNBLFlBQUlxQyxLQUFLLElBQUksQ0FBYixFQUNJRCxJQUFJLENBQUNwQyxDQUFELENBQUosQ0FBUUEsQ0FBUixDQUFVcUMsS0FBVixJQUFtQjVCLEtBQW5CLENBREosS0FHSTJCLElBQUksQ0FBQ3BDLENBQUQsQ0FBSixDQUFRQSxDQUFSLEdBQVlTLEtBQVo7QUFDUDtBQUNKO0FBRUQ7Ozs7Ozs7Ozs7OzswQ0FTc0JoQixHLEVBQWtCa0UsVSxFQUFvQkMsUSxFQUFrQkMsVSxFQUFpQkMsUSxFQUFlcEQsTSxFQUF5QjtBQUNuSSxVQUFJa0QsUUFBUSxJQUFJRCxVQUFoQixFQUE0QjtBQUN4QixjQUFNLElBQUlGLEtBQUosQ0FBVSw4Q0FBVixDQUFOO0FBQ0g7O0FBQ0QsV0FBS1osU0FBTCxDQUFlcEQsR0FBZixJQUFzQm1FLFFBQVEsR0FBRyxDQUFqQztBQUNBLFdBQUtiLGVBQUw7O0FBQ0EsVUFBSSxDQUFDckMsTUFBTCxFQUFhO0FBQ1RBLFFBQUFBLE1BQU0sR0FBR3FELHNCQUFjQyxNQUFkLEVBQVQ7QUFDSDs7QUFDRCxVQUFJSCxVQUFVLFlBQVliLGVBQXRCLElBQW1DYyxRQUFRLFlBQVlkLGVBQTNELEVBQXNFO0FBQ2xFLFNBQUNhLFVBQUQsRUFBYUMsUUFBYixFQUF1QkcsT0FBdkIsQ0FBK0IsVUFBQUMsQ0FBQztBQUFBLGlCQUFJQSxDQUFDLFlBQVlsQixlQUFiLElBQTBCa0IsQ0FBQyxDQUFDakIsT0FBRixFQUE5QjtBQUFBLFNBQWhDOztBQUNBLFlBQUlZLFVBQVUsWUFBWWIsZUFBdEIsSUFBbUNjLFFBQVEsWUFBWWQsZUFBM0QsRUFBc0U7QUFDbEUsY0FBTW1CLGNBQWMsR0FBR04sVUFBVSxDQUFDWCxJQUFYLENBQWdCZ0IsQ0FBaEIsQ0FBbUJqRCxNQUFuQixHQUE0QixDQUFuRDtBQUNBLGNBQU1tRCxZQUFZLEdBQUdOLFFBQVEsQ0FBQ1osSUFBVCxDQUFjZ0IsQ0FBZCxDQUFpQmpELE1BQWpCLEdBQTBCLENBQS9DO0FBQ0EsY0FBTW9ELGNBQWMsR0FBRyxpQ0FBb0JGLGNBQXBCLEVBQW9DQyxZQUFwQyxDQUF2QjtBQUNBUCxVQUFBQSxVQUFVLENBQUNTLFFBQVgsQ0FBb0I3QixJQUFJLENBQUM4QixLQUFMLENBQVdGLGNBQWMsR0FBR0YsY0FBNUIsQ0FBcEI7QUFDQUwsVUFBQUEsUUFBUSxDQUFDUSxRQUFULENBQWtCN0IsSUFBSSxDQUFDOEIsS0FBTCxDQUFXRixjQUFjLEdBQUdELFlBQTVCLENBQWxCO0FBQ0g7O0FBUmlFLG1CQVN6QyxDQUFDUCxVQUFELEVBQWFDLFFBQWIsRUFBdUJVLEdBQXZCLENBQTJCLFVBQUFOLENBQUM7QUFBQSxpQkFBSUEsQ0FBQyxZQUFZbEIsZUFBYixHQUF5QmtCLENBQUMsQ0FBQ2hCLElBQTNCLEdBQWtDZ0IsQ0FBdEM7QUFBQSxTQUE1QixDQVR5Qzs7QUFBQTs7QUFTakVMLFFBQUFBLFVBVGlFO0FBU3JEQyxRQUFBQSxRQVRxRDtBQVVyRTs7QUFDRCxVQUFJMUIsSUFBSjtBQUFBLFVBQWVwQyxDQUFmO0FBQUEsVUFBc0NxQyxLQUF0QztBQUFBLFVBQWlFMUIsSUFBSSxHQUFHLElBQXhFOztBQXBCbUksbUNBcUJoSCxLQUFLd0MscUJBQUwsQ0FBMkIxRCxHQUEzQixDQXJCZ0g7O0FBQUE7O0FBcUJsSTJDLE1BQUFBLElBckJrSTtBQXFCNUhwQyxNQUFBQSxDQXJCNEg7QUFxQnpIcUMsTUFBQUEsS0FyQnlIOztBQXNCbkksVUFBSSxDQUFDckMsQ0FBRCxJQUFNcUMsS0FBSyxLQUFLZSxTQUFwQixFQUErQjtBQUMzQixnQkFBUTNELEdBQVI7QUFDSSxlQUFLLE1BQUw7QUFDSSxnQkFBSSxLQUFLZ0MsSUFBTCxDQUFVSyxFQUFWLElBQWdCLENBQXBCLEVBQXVCO0FBQ25CTSxjQUFBQSxJQUFJLEdBQUcsS0FBS1gsSUFBTCxDQUFVVixDQUFqQjtBQUNBLGtCQUFJMEQsUUFBUSxHQUFHckMsSUFBSSxDQUFDa0IsQ0FBTCxDQUFPdEQsQ0FBUCxDQUFTLENBQVQsRUFBWUQsQ0FBM0I7QUFDQSxrQkFBSTJFLGFBQWEsR0FBR2hGLElBQUksQ0FBQ0MsS0FBTCxDQUFXRCxJQUFJLENBQUNFLFNBQUwsQ0FBZTZFLFFBQWYsQ0FBWCxDQUFwQjtBQUNBLGtCQUFJRSxXQUFXLEdBQUdqRixJQUFJLENBQUNDLEtBQUwsQ0FBV0QsSUFBSSxDQUFDRSxTQUFMLENBQWU2RSxRQUFmLENBQVgsQ0FBbEI7QUFDQUMsY0FBQUEsYUFBYSxDQUFDM0QsQ0FBZCxHQUFrQjhDLFVBQWxCO0FBQ0FjLGNBQUFBLFdBQVcsQ0FBQzVELENBQVosR0FBZ0IrQyxRQUFoQjtBQUNBRCxjQUFBQSxVQUFVLEdBQUdhLGFBQWI7QUFDQVosY0FBQUEsUUFBUSxHQUFHYSxXQUFYO0FBQ0EzRSxjQUFBQSxDQUFDLEdBQUcsR0FBSjtBQUNBcUMsY0FBQUEsS0FBSyxHQUFHLENBQUMsQ0FBVDtBQUNBMUIsY0FBQUEsSUFBSSxHQUFHLEtBQVA7QUFDSDs7QUFDRDs7QUFDSjtBQUNJNEMsWUFBQUEsT0FBTyxDQUFDQyxLQUFSLENBQWMvRCxHQUFkLEVBQW1Ca0UsVUFBbkIsRUFBK0JDLFFBQS9CLEVBQXlDQyxVQUF6QyxFQUFxREMsUUFBckQsRUFBK0RwRCxNQUEvRDtBQUNBLGtCQUFNLElBQUkrQyxLQUFKLENBQVUsa0JBQVYsQ0FBTjtBQWxCUjtBQW9CSDs7QUFDRCxVQUFJckIsSUFBSSxJQUFJcEMsQ0FBUixJQUFhcUMsS0FBSyxLQUFLZSxTQUEzQixFQUFzQztBQUNsQyxhQUFLd0IsMkJBQUwsQ0FBaUN4QyxJQUFqQyxFQUF1Q3BDLENBQXZDO0FBQ0EsYUFBSzZFLFdBQUwsQ0FBaUJ6QyxJQUFqQixFQUF1QnBDLENBQXZCLEVBQTBCcUMsS0FBMUIsRUFBaUNzQixVQUFqQyxFQUE2Q0UsVUFBN0MsRUFBeURuRCxNQUF6RCxFQUFpRUMsSUFBakU7QUFDQSxhQUFLa0UsV0FBTCxDQUFpQnpDLElBQWpCLEVBQXVCcEMsQ0FBdkIsRUFBMEJxQyxLQUExQixFQUFpQ3VCLFFBQWpDLEVBQTJDRSxRQUEzQyxFQUFxRFYsU0FBckQsRUFBZ0V6QyxJQUFoRTtBQUNIO0FBQ0o7Ozs7Ozs7O0lBR1FtRSxZOzs7Ozs7Ozs7c0NBQ3dCQyxVLEVBQWlDO0FBQzlELGFBQU87QUFDSDdFLFFBQUFBLENBQUMsRUFBRTtBQUNDRSxVQUFBQSxDQUFDLEVBQUUsQ0FESjtBQUVDSixVQUFBQSxDQUFDLEVBQUU7QUFGSixTQURBO0FBS0hnRixRQUFBQSxDQUFDLEVBQUU7QUFDQzVFLFVBQUFBLENBQUMsRUFBRSxDQURKO0FBRUNKLFVBQUFBLENBQUMsRUFBRTtBQUZKLFNBTEE7QUFTSG9CLFFBQUFBLENBQUMsRUFBRTtBQUNDaEIsVUFBQUEsQ0FBQyxFQUFFLENBREo7QUFFQ0osVUFBQUEsQ0FBQyxFQUFFLENBQ0MrRSxVQUFVLENBQUMsQ0FBRCxDQURYLEVBRUNBLFVBQVUsQ0FBQyxDQUFELENBRlgsRUFHQyxDQUhEO0FBRkosU0FUQTtBQWlCSDNFLFFBQUFBLENBQUMsRUFBRTtBQUNDQSxVQUFBQSxDQUFDLEVBQUUsQ0FESjtBQUVDSixVQUFBQSxDQUFDLEVBQUUsQ0FDQyxDQURELEVBRUMsQ0FGRCxFQUdDLENBSEQ7QUFGSixTQWpCQTtBQXlCSEQsUUFBQUEsQ0FBQyxFQUFFO0FBQ0NLLFVBQUFBLENBQUMsRUFBRSxDQURKO0FBRUNKLFVBQUFBLENBQUMsRUFBRSxDQUNDLEdBREQsRUFFQyxHQUZELEVBR0MsR0FIRDtBQUZKO0FBekJBLE9BQVA7QUFrQ0g7QUFFRDs7Ozs7OztnQ0FJbUJpRixHLEVBQXlCO0FBQ3hDLFVBQU1DLFdBQVcsR0FBRyw0QkFBZUQsR0FBZixFQUFvQlQsR0FBcEIsQ0FBd0IsVUFBQ04sQ0FBRCxFQUFJM0MsQ0FBSjtBQUFBLGVBQVVBLENBQUMsR0FBRyxDQUFKLEdBQVEyQyxDQUFDLEdBQUcsQ0FBWixHQUFnQkEsQ0FBQyxHQUFHLENBQTlCO0FBQUEsT0FBeEIsQ0FBcEI7QUFDQSxhQUFPLEtBQUtpQixJQUFMLGdDQUFhRCxXQUFiLEVBQVA7QUFDSDtBQUVEOzs7Ozs7OzBCQUlhRCxHLEVBQXFCO0FBQzlCLFVBQU1GLFVBQVUsR0FBRyw0QkFBZUUsR0FBZixDQUFuQjtBQUNBLFVBQU1HLEtBQWlCLEdBQUc7QUFDdEJ0RCxRQUFBQSxFQUFFLEVBQUUsQ0FEa0I7QUFFdEJ1RCxRQUFBQSxHQUFHLEVBQUUsQ0FGaUI7QUFHdEJDLFFBQUFBLEVBQUUsRUFBRSxDQUhrQjtBQUl0QkMsUUFBQUEsRUFBRSxFQUFFLENBSmtCO0FBS3RCakQsUUFBQUEsRUFBRSxFQUFFLEtBQUtrRCxpQkFBTCxDQUF1QlQsVUFBdkIsQ0FMa0I7QUFNdEJVLFFBQUFBLEVBQUUsRUFBRSxDQU5rQjtBQU90QmpELFFBQUFBLEVBQUUsRUFBRSxDQVBrQjtBQVF0QmtELFFBQUFBLEVBQUUsRUFBRSxDQVJrQjtBQVN0QkMsUUFBQUEsRUFBRSxFQUFFLENBVGtCO0FBVXRCakUsUUFBQUEsTUFBTSxFQUFFLG9CQUFPdUQsR0FBUDtBQVZjLE9BQTFCO0FBYUEsYUFBTyxJQUFJekYsWUFBSixDQUFpQjRGLEtBQWpCLENBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7O3lCQU9ZUSxJLEVBQWNDLEcsRUFBYUMsSyxFQUFlQyxNLEVBQWdCO0FBQ2xFLFVBQU1YLEtBQWlCLEdBQUc7QUFDdEJ0RCxRQUFBQSxFQUFFLEVBQUUsQ0FEa0I7QUFFdEJ1RCxRQUFBQSxHQUFHLEVBQUUsQ0FGaUI7QUFHdEJDLFFBQUFBLEVBQUUsRUFBRSxDQUhrQjtBQUl0QkMsUUFBQUEsRUFBRSxFQUFFLENBSmtCO0FBS3RCakQsUUFBQUEsRUFBRSxFQUFFLEtBQUtrRCxpQkFBTCxDQUF1QixDQUFDSSxJQUFELEVBQU9DLEdBQVAsRUFBWUMsS0FBWixFQUFtQkMsTUFBbkIsQ0FBdkIsQ0FMa0I7QUFNdEJOLFFBQUFBLEVBQUUsRUFBRSxDQU5rQjtBQU90QmpELFFBQUFBLEVBQUUsRUFBRSxDQVBrQjtBQVF0QmtELFFBQUFBLEVBQUUsRUFBRSxDQVJrQjtBQVN0QkMsUUFBQUEsRUFBRSxFQUFFLENBVGtCO0FBVXRCakUsUUFBQUEsTUFBTSxFQUFFLENBQ0osOEJBQWlCLE1BQWpCLEVBQXlCLENBQUNvRSxLQUFELEVBQVFDLE1BQVIsQ0FBekIsQ0FESTtBQVZjLE9BQTFCO0FBY0EsYUFBTyxJQUFJdkcsWUFBSixDQUFpQjRGLEtBQWpCLENBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7OzRCQU9lWSxFLEVBQVlDLEUsRUFBWUMsRSxFQUFZQyxFLEVBQVk7QUFDM0QsVUFBTWYsS0FBaUIsR0FBRztBQUN0QnRELFFBQUFBLEVBQUUsRUFBRSxDQURrQjtBQUV0QnVELFFBQUFBLEdBQUcsRUFBRSxDQUZpQjtBQUd0QkMsUUFBQUEsRUFBRSxFQUFFLENBSGtCO0FBSXRCQyxRQUFBQSxFQUFFLEVBQUUsQ0FKa0I7QUFLdEJqRCxRQUFBQSxFQUFFLEVBQUUsS0FBS2tELGlCQUFMLENBQXVCLENBQUNRLEVBQUUsR0FBR0UsRUFBTixFQUFVRCxFQUFFLEdBQUdFLEVBQWYsRUFBbUIsSUFBSUQsRUFBdkIsRUFBMkIsSUFBSUMsRUFBL0IsQ0FBdkIsQ0FMa0I7QUFNdEJWLFFBQUFBLEVBQUUsRUFBRSxDQU5rQjtBQU90QmpELFFBQUFBLEVBQUUsRUFBRSxDQVBrQjtBQVF0QmtELFFBQUFBLEVBQUUsRUFBRSxDQVJrQjtBQVN0QkMsUUFBQUEsRUFBRSxFQUFFLENBVGtCO0FBVXRCakUsUUFBQUEsTUFBTSxFQUFFLENBQ0osOEJBQWlCLFNBQWpCLEVBQTRCLENBQUN3RSxFQUFELEVBQUtDLEVBQUwsQ0FBNUIsQ0FESTtBQVZjLE9BQTFCO0FBY0EsYUFBTyxJQUFJM0csWUFBSixDQUFpQjRGLEtBQWpCLENBQVA7QUFDSDtBQUVEOzs7Ozs7O3dCQUlXZ0IsRSxFQUFpQjtBQUN4QixVQUFNaEIsS0FBSyxHQUFHLElBQUk1RixZQUFKLENBQWlCO0FBQzNCc0MsUUFBQUEsRUFBRSxFQUFFLENBRHVCO0FBRTNCdUQsUUFBQUEsR0FBRyxFQUFFLENBRnNCO0FBRzNCQyxRQUFBQSxFQUFFLEVBQUUsQ0FIdUI7QUFJM0JDLFFBQUFBLEVBQUUsRUFBRSxDQUp1QjtBQUszQmpELFFBQUFBLEVBQUUsRUFBRSxLQUFLa0QsaUJBQUwsQ0FBdUIsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWLENBQXZCLENBTHVCO0FBTTNCQyxRQUFBQSxFQUFFLEVBQUUsQ0FOdUI7QUFPM0JqRCxRQUFBQSxFQUFFLEVBQUUsQ0FQdUI7QUFRM0JrRCxRQUFBQSxFQUFFLEVBQUUsQ0FSdUI7QUFTM0JDLFFBQUFBLEVBQUUsRUFBRSxDQVR1QjtBQVUzQlUsUUFBQUEsQ0FBQyxFQUFFLEdBVndCO0FBVzNCQyxRQUFBQSxDQUFDLEVBQUUsR0FYd0I7QUFZM0JDLFFBQUFBLEtBQUssRUFBRUg7QUFab0IsT0FBakIsQ0FBZDtBQWNBLGFBQU9oQixLQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7OzhCQU1pQkgsRyxFQUF5QnVCLFMsRUFBbUJDLFEsRUFBaUI7QUFBQTs7QUFDMUUsVUFBTTFCLFVBQVUsR0FBRyw0QkFBZUUsR0FBZixDQUFuQjtBQUNBLFVBQUl5QixPQUFKOztBQUNBLFVBQUl6QixHQUFHLFlBQVkwQixjQUFuQixFQUFtQztBQUMvQkQsUUFBQUEsT0FBTyxHQUFHLENBQVY7QUFDSCxPQUZELE1BRU8sSUFBSXpCLEdBQUcsWUFBWTJCLGVBQW5CLEVBQW9DO0FBQ3ZDRixRQUFBQSxPQUFPLEdBQUcsQ0FBVjtBQUNILE9BRk0sTUFFQSxJQUFJekIsR0FBRyxZQUFZNEIsV0FBbkIsRUFBZ0M7QUFDbkNILFFBQUFBLE9BQU8sR0FBRyxDQUFWO0FBQ0gsT0FGTSxNQUVBO0FBQ0hBLFFBQUFBLE9BQU8sR0FBRyxDQUFWO0FBQ0g7O0FBQ0QsVUFBTXRCLEtBQXlELEdBQUc7QUFDOUR0RCxRQUFBQSxFQUFFLEVBQUU0RSxPQUQwRDtBQUU5RHJCLFFBQUFBLEdBQUcsRUFBRSxDQUZ5RDtBQUc5REMsUUFBQUEsRUFBRSxFQUFFLENBSDBEO0FBSTlEQyxRQUFBQSxFQUFFLEVBQUUsQ0FKMEQ7QUFLOURqRCxRQUFBQSxFQUFFLEVBQUUsS0FBS2tELGlCQUFMLENBQXVCa0IsT0FBTyxJQUFJLENBQVgsR0FBZSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsQ0FBZixHQUE4QjNCLFVBQXJELENBTDBEO0FBTTlEVSxRQUFBQSxFQUFFLEVBQUUsQ0FOMEQ7QUFPOURqRCxRQUFBQSxFQUFFLEVBQUUsQ0FQMEQ7QUFROURrRCxRQUFBQSxFQUFFLEVBQUUsQ0FSMEQ7QUFTOURDLFFBQUFBLEVBQUUsRUFBRTtBQVQwRCxPQUFsRTs7QUFXQSxjQUFRZSxPQUFSO0FBQ0ksYUFBSyxDQUFMO0FBQ0ksY0FBTUksU0FBUyxHQUFHLDBCQUFhN0IsR0FBYixDQUFsQjs7QUFDQSxjQUFJNkIsU0FBUyxDQUFDakcsTUFBVixDQUFpQixVQUFBb0UsR0FBRztBQUFBLG1CQUFJQSxHQUFHLFlBQVkwQixjQUFmLElBQWlDMUIsR0FBRyxZQUFZMkIsZUFBcEQ7QUFBQSxXQUFwQixFQUF5RjNGLE1BQTdGLEVBQXFHO0FBQ2pHLGdCQUFNOEYsWUFBWSxHQUFHM0IsS0FBckI7QUFDQSxnQkFBTTRCLFlBQTRCLEdBQUcsRUFBckM7QUFDQSxnQkFBTUMsWUFBWSxHQUFHLG9CQUFyQjtBQUNBSCxZQUFBQSxTQUFTLENBQUM3QyxPQUFWLENBQWtCLFVBQUFYLENBQUMsRUFBSTtBQUNuQixrQkFBSUEsQ0FBQyxZQUFZNEQsa0JBQWIsSUFBbUMsRUFBRTVELENBQUMsWUFBWXVELFdBQWYsQ0FBdkMsRUFBb0U7QUFDaEVHLGdCQUFBQSxZQUFZLENBQUNHLE9BQWIsQ0FBcUIsS0FBSSxDQUFDQyxTQUFMLENBQWU5RCxDQUFmLEVBQWtCa0QsU0FBbEIsRUFBNkJDLFFBQTdCLENBQXJCO0FBQ0g7QUFDSixhQUpEO0FBS0FPLFlBQUFBLFlBQVksQ0FBQy9DLE9BQWIsQ0FBcUIsVUFBQW1CLEtBQUssRUFBSTtBQUMxQkEsY0FBQUEsS0FBSyxDQUFDM0QsSUFBTixDQUFXZSxFQUFYLEdBQWdCLEdBQWhCO0FBQ0gsYUFGRDtBQUdBdUUsWUFBQUEsWUFBWSxDQUFDVixDQUFiLEdBQWlCdEIsVUFBVSxDQUFDLENBQUQsQ0FBVixHQUFnQkEsVUFBVSxDQUFDLENBQUQsQ0FBMUIsR0FBZ0MsQ0FBakQ7QUFDQWdDLFlBQUFBLFlBQVksQ0FBQ1QsQ0FBYixHQUFpQnZCLFVBQVUsQ0FBQyxDQUFELENBQVYsR0FBZ0JBLFVBQVUsQ0FBQyxDQUFELENBQTFCLEdBQWdDLENBQWpEO0FBQ0FnQyxZQUFBQSxZQUFZLENBQUNSLEtBQWIsR0FBcUJVLFlBQXJCO0FBQ0FULFlBQUFBLFNBQVMsQ0FBQ3JFLElBQVYsQ0FBZTtBQUNYaUUsY0FBQUEsRUFBRSxFQUFFYSxZQURPO0FBRVhJLGNBQUFBLE1BQU0sRUFBRUwsWUFBWSxDQUFDeEMsR0FBYixDQUFpQixVQUFBWSxLQUFLO0FBQUEsdUJBQUlBLEtBQUssQ0FBQzNELElBQVY7QUFBQSxlQUF0QjtBQUZHLGFBQWY7QUFJSCxXQW5CRCxNQW1CTztBQUNILGdCQUFNNkYsV0FBVSxHQUFHbEMsS0FBbkI7QUFDQWtDLFlBQUFBLFdBQVUsQ0FBQ3hGLEVBQVgsR0FBZ0IsQ0FBaEI7QUFDQXdGLFlBQUFBLFdBQVUsQ0FBQ2hGLEVBQVgsR0FBZ0IsS0FBS2tELGlCQUFMLENBQXVCVCxVQUF2QixDQUFoQjtBQUNBdUMsWUFBQUEsV0FBVSxDQUFDNUYsTUFBWCxHQUFvQixvQkFBT3VELEdBQVAsQ0FBcEI7QUFDSDs7QUFDRDs7QUFDSixhQUFLLENBQUw7QUFDSSxjQUFNc0MsVUFBVSxHQUFHbkMsS0FBbkI7O0FBREosNkJBRXFDLHlCQUFZSCxHQUFaLEVBQW9DdUIsU0FBcEMsQ0FGckM7QUFBQTtBQUFBLGNBRVdnQixVQUZYO0FBQUEsY0FFdUJDLFVBRnZCOztBQUdJRixVQUFBQSxVQUFVLENBQUNoQixLQUFYLEdBQW1CaUIsVUFBbkI7QUFDQSxjQUFJLENBQUNoQixTQUFTLENBQUMzRixNQUFWLENBQWlCLFVBQUFULENBQUM7QUFBQSxtQkFBSUEsQ0FBQyxDQUFDZ0csRUFBRixJQUFRb0IsVUFBWjtBQUFBLFdBQWxCLEVBQTBDdkcsTUFBL0MsRUFDSXVGLFNBQVMsQ0FBQ3JFLElBQVYsQ0FBZXNGLFVBQWY7QUFDSjs7QUFDSixhQUFLLENBQUw7QUFDSSxjQUFNSCxVQUFVLEdBQUdsQyxLQUFuQjtBQUNBa0MsVUFBQUEsVUFBVSxDQUFDNUYsTUFBWCxHQUFvQixvQkFBT3VELEdBQVAsQ0FBcEI7QUFDQTs7QUFDSixhQUFLLENBQUw7QUFDSSxjQUFNeUMsU0FBUyxHQUFHdEMsS0FBbEIsQ0FESixDQUdJOztBQUNBLGNBQU11QyxjQUFjLEdBQUcsK0JBQWtCMUMsR0FBbEIsQ0FBdkI7QUFDQSxjQUFNMkMsVUFBVSxHQUFHLDhCQUFpQkMsZ0JBQWdCLENBQUM1QyxHQUFELENBQWhCLENBQXNCMkMsVUFBdkMsQ0FBbkI7QUFDQSxjQUFNRSxnQkFBZ0IsR0FBRyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sR0FBUCxFQUFZRixVQUFaLENBQXpCO0FBQ0FGLFVBQUFBLFNBQVMsQ0FBQ3BGLEVBQVYsQ0FBY2xCLENBQWQsQ0FBaUJwQixDQUFqQixHQUFxQixDQUFDK0UsVUFBVSxDQUFDLENBQUQsQ0FBVixHQUFnQkEsVUFBVSxDQUFDLENBQUQsQ0FBVixHQUFnQitDLGdCQUFqQyxFQUFtRC9DLFVBQVUsQ0FBQyxDQUFELENBQVYsR0FBZ0JBLFVBQVUsQ0FBQyxDQUFELENBQTFCLEdBQWdDNEMsY0FBbkYsRUFBbUcsQ0FBbkcsQ0FBckI7QUFDQUQsVUFBQUEsU0FBUyxDQUFDcEYsRUFBVixDQUFjcEMsQ0FBZCxDQUFpQkYsQ0FBakIsR0FBcUIsQ0FBQyxFQUFFK0gsVUFBVSxDQUFDRixnQkFBZ0IsQ0FBQzVDLEdBQUQsQ0FBaEIsQ0FBc0IrQyxXQUF0QixJQUFxQyxHQUF0QyxDQUFWLEdBQXVELEdBQXpELENBQXRCOztBQVJKLDRCQVU2Qix3QkFBVy9DLEdBQVgsRUFBa0N3QixRQUFsQyxDQVY3QjtBQUFBO0FBQUEsY0FVV3dCLFFBVlg7QUFBQSxjQVVxQkMsSUFWckI7O0FBV0lSLFVBQUFBLFNBQVMsQ0FBQzNHLENBQVYsR0FBY2tILFFBQWQ7QUFDQSxjQUFJLENBQUN4QixRQUFRLENBQUMwQixJQUFULENBQWV0SCxNQUFmLENBQXNCLFVBQUF1SCxDQUFDO0FBQUEsbUJBQUlBLENBQUMsQ0FBQ0MsS0FBRixJQUFXSCxJQUFJLENBQUNHLEtBQXBCO0FBQUEsV0FBdkIsRUFBa0RwSCxNQUF2RCxFQUNJd0YsUUFBUSxDQUFDMEIsSUFBVCxDQUFlaEcsSUFBZixDQUFvQitGLElBQXBCO0FBQ0o7QUF0RFI7O0FBd0RBLFVBQU1JLFVBQVUsR0FBRyxJQUFJOUksWUFBSixDQUFpQjRGLEtBQWpCLENBQW5CO0FBQ0EsYUFBT2tELFVBQVA7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNoYXBlTGF5ZXIsIFRleHRMYXllciwgSW1hZ2VMYXllciwgVHJhbnNmb3JtLCBBc3NldHMsIEZvbnRzLCBHcm91cFNoYXBlLCBQcmVDb21wTGF5ZXIsIFJlZmVyZW5jZUlEIH0gZnJvbSAnLi9hbmltYXRpb24nXHJcbmltcG9ydCB7IEVhc2luZ0Z1bmN0aW9uLCBFYXNpbmdGYWN0b3J5IH0gZnJvbSAnLi9lYXNpbmcnXHJcbmltcG9ydCB7IHJlbmRlclRleHQsIHJlbmRlciwgcmVuZGVySW1hZ2UsIHJlbmRlclBsYWluR2x5cGggfSBmcm9tICcuL3JlbmRlcic7XHJcbmltcG9ydCB7IGdldEJvdW5kaW5nQm94LCBnZXRMZWFmTm9kZXMsIGdldEJhc2VsaW5lSGVpZ2h0LCBlbmNvZGVUZXh0QW5jaG9yLCBsZWFzdENvbW1vbk11bHRpcGxlIH0gZnJvbSAnLi9oZWxwZXInXHJcbmltcG9ydCB1dWlkIGZyb20gJ3V1aWQvdjQnO1xyXG5pbXBvcnQgeyBQYXRoTWFrZXIgfSBmcm9tICcuL3BhdGgnO1xyXG5cclxudHlwZSBTZXRhYmxlS2V5cyA9IFwic2NhbGVYXCIgfCBcInNjYWxlWVwiIHwgXCJhbmNob3JYXCIgfCBcImFuY2hvcllcIiB8IFwieFwiIHwgXCJ5XCIgfCBcInJvdGF0ZVwiIHwgXCJvcGFjaXR5XCIgfCAnc2hhcGUnIHwgJ2ZpbGxDb2xvcicgfCAndHJpbVN0YXJ0JyB8ICd0cmltRW5kJyB8ICd0cmltT2Zmc2V0JyB8ICdzdHJva2VDb2xvcicgfCAnc3Ryb2tlV2lkdGgnIHwgJ3RleHQnIHwgJ2ZpbGxPcGFjaXR5JyB8ICdzdHJva2VPcGFjaXR5J1xyXG5cclxuZXhwb3J0IGNsYXNzIEpTTW92aW5MYXllciB7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgcm9vdDogU2hhcGVMYXllciB8IFRleHRMYXllciB8IEltYWdlTGF5ZXIgfCBQcmVDb21wTGF5ZXI7XHJcbiAgICBwcml2YXRlIGFuY2hvcjogbnVtYmVyW11cclxuICAgIHByaXZhdGUgcG9zaXRpb246IG51bWJlcltdXHJcbiAgICBwcml2YXRlIHRpbWVSYW5nZTogeyBba2V5OiBzdHJpbmddOiBudW1iZXIgfSA9IHt9XHJcbiAgICBwcml2YXRlIGdldERlZmF1bHRQcm9wZXJ0eShrZXk6IHN0cmluZykge1xyXG4gICAgICAgIHN3aXRjaCAoa2V5KSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2EnOlxyXG4gICAgICAgICAgICBjYXNlICdwJzpcclxuICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGtleSA9PSAnYScgPyB0aGlzLmFuY2hvciA6IHRoaXMucG9zaXRpb24pKVxyXG4gICAgICAgICAgICBjYXNlICdzJzpcclxuICAgICAgICAgICAgICAgIHJldHVybiBbMTAwLCAxMDAsIDEwMF1cclxuICAgICAgICAgICAgY2FzZSAnbyc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMTAwXHJcbiAgICAgICAgICAgIGNhc2UgJ3InOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDBcclxuICAgICAgICAgICAgY2FzZSAndG0nOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGs6IDBcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgazogMTAwXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBvOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGs6IDBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgY29udmVydFRvU3RhdGljUHJvcGVydHkodHJhbnNmb3JtOiBhbnksIGtleTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKCF0cmFuc2Zvcm1ba2V5XSkge1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm1ba2V5XSA9IHtcclxuICAgICAgICAgICAgICAgIGE6IDAsXHJcbiAgICAgICAgICAgICAgICBrOiB0aGlzLmdldERlZmF1bHRQcm9wZXJ0eShrZXkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRyYW5zZm9ybVtrZXldLmEgPT0gMSkge1xyXG4gICAgICAgICAgICBjb25zdCBzdGF0aWNWYWx1ZSA9IHRyYW5zZm9ybVtrZXldLmtbMF0uc1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm1ba2V5XSA9IHtcclxuICAgICAgICAgICAgICAgIGE6IDAsXHJcbiAgICAgICAgICAgICAgICBrOiBzdGF0aWNWYWx1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkodHJhbnNmb3JtOiBhbnksIGtleTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKCF0cmFuc2Zvcm1ba2V5XSB8fCAhdHJhbnNmb3JtW2tleV0uYSkge1xyXG4gICAgICAgICAgICBpZiAoa2V5ID09ICdhJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmNob3IgPSB0cmFuc2Zvcm1ba2V5XSA/IHRyYW5zZm9ybVtrZXldLmsgOiBbMCwgMCwgMF1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoa2V5ID09ICdwJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHRyYW5zZm9ybVtrZXldID8gdHJhbnNmb3JtW2tleV0uayA6IFswLCAwLCAwXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRyYW5zZm9ybVtrZXldID0ge1xyXG4gICAgICAgICAgICAgICAgYTogMSxcclxuICAgICAgICAgICAgICAgIGs6IFtdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGFkZEtleWZyYW1lKHRyYW5zZm9ybTogYW55LCBrZXk6IHN0cmluZywgaWR4OiBudW1iZXIgPSAtMSwgdGltZTogbnVtYmVyLCB2YWx1ZTogQXJyYXk8YW55PiwgZWFzaW5nPzogRWFzaW5nRnVuY3Rpb24sIHdyYXA6IGJvb2xlYW4gPSB0cnVlKSB7XHJcbiAgICAgICAgY29uc3QgZXhpc3RLZXlmcmFtZSA9IHRyYW5zZm9ybVtrZXldLmsuZmlsdGVyKCh4OiBhbnkpID0+IHgudCA9PSB0aW1lKSBhcyBhbnlbXVxyXG4gICAgICAgIGxldCByZWFkeVRvU2V0O1xyXG4gICAgICAgIGlmIChleGlzdEtleWZyYW1lLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZWFkeVRvU2V0ID0gZXhpc3RLZXlmcmFtZVswXVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlYWR5VG9TZXQgPSB7XHJcbiAgICAgICAgICAgICAgICB0OiB0aW1lLFxyXG4gICAgICAgICAgICAgICAgczogdGhpcy5nZXREZWZhdWx0UHJvcGVydHkoa2V5KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzS2V5ZnJhbWVDb3VudCA9IHRyYW5zZm9ybVtrZXldLmsucmVkdWNlKChwOiBudW1iZXIsIHg6IGFueSkgPT4geC50IDwgdGltZSA/IHAgKyAxIDogcCwgMClcclxuICAgICAgICAgICAgdHJhbnNmb3JtW2tleV0uay5zcGxpY2UocHJldmlvdXNLZXlmcmFtZUNvdW50LCAwLCByZWFkeVRvU2V0KVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZWFzaW5nKSB7XHJcbiAgICAgICAgICAgIHJlYWR5VG9TZXQubyA9IHtcclxuICAgICAgICAgICAgICAgIHg6IGVhc2luZ1swXVswXSxcclxuICAgICAgICAgICAgICAgIHk6IGVhc2luZ1swXVsxXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlYWR5VG9TZXQuaSA9IHtcclxuICAgICAgICAgICAgICAgIHg6IGVhc2luZ1sxXVswXSxcclxuICAgICAgICAgICAgICAgIHk6IGVhc2luZ1sxXVsxXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpZHggPj0gMCkge1xyXG4gICAgICAgICAgICByZWFkeVRvU2V0LnNbaWR4XSA9IHZhbHVlXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVhZHlUb1NldC5zID0gd3JhcCAmJiAhKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpID8gW3ZhbHVlXSA6IHZhbHVlXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBmaW5kUHJvcGVydHlDb25maWcoa2V5OiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gKCh0aGlzLnJvb3QgYXMgU2hhcGVMYXllcikuc2hhcGVzIVswXSBhcyBHcm91cFNoYXBlKS5pdCEuZmluZChzaGFwZSA9PlxyXG4gICAgICAgICAgICBzaGFwZS50eSA9PSBrZXlcclxuICAgICAgICApXHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGZpbmRPckluc2VydFByb3BlcnR5Q29uZmlnKGtleTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgZmluZCA9IHRoaXMuZmluZFByb3BlcnR5Q29uZmlnKGtleSlcclxuICAgICAgICBpZiAoZmluZCkgcmV0dXJuIGZpbmRcclxuICAgICAgICBjb25zdCBoYXNUcmFuc2Zvcm0gPSB0aGlzLmZpbmRQcm9wZXJ0eUNvbmZpZygndHInKVxyXG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IHtcclxuICAgICAgICAgICAgdHk6IGtleSxcclxuICAgICAgICAgICAgLi4udGhpcy5nZXREZWZhdWx0UHJvcGVydHkoa2V5KSBhcyBvYmplY3RcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGhhc1RyYW5zZm9ybSkge1xyXG4gICAgICAgICAgICBjb25zdCBncm91cFNoYXBlcyA9ICgodGhpcy5yb290IGFzIFNoYXBlTGF5ZXIpLnNoYXBlcyFbMF0gYXMgR3JvdXBTaGFwZSkuaXQhXHJcbiAgICAgICAgICAgIGdyb3VwU2hhcGVzLnNwbGljZShncm91cFNoYXBlcy5sZW5ndGggLSAxLCAwLCBjb25maWcpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgKCh0aGlzLnJvb3QgYXMgU2hhcGVMYXllcikuc2hhcGVzIVswXSBhcyBHcm91cFNoYXBlKS5pdCEucHVzaChjb25maWcpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb25maWdcclxuICAgIH1cclxuICAgIHByaXZhdGUgY29tbW9uUHJvcGVydHlNYXBwaW5nKGtleTogU2V0YWJsZUtleXMpOiBbYW55LCBzdHJpbmcgfCB1bmRlZmluZWQsIG51bWJlciB8IHVuZGVmaW5lZF0ge1xyXG4gICAgICAgIGxldCBiYXNlOiBhbnksIGs6IHN0cmluZyB8IHVuZGVmaW5lZCwgaW5kZXg6IG51bWJlciB8IHVuZGVmaW5lZFxyXG4gICAgICAgIHN3aXRjaCAoa2V5KSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ3NjYWxlWCc6XHJcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXHJcbiAgICAgICAgICAgICAgICBrID0gJ3MnXHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IDBcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ3NjYWxlWSc6XHJcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXHJcbiAgICAgICAgICAgICAgICBrID0gJ3MnXHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IDFcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ2FuY2hvclgnOlxyXG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMucm9vdC5rc1xyXG4gICAgICAgICAgICAgICAgayA9ICdhJ1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSAwXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlICdhbmNob3JZJzpcclxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLnJvb3Qua3NcclxuICAgICAgICAgICAgICAgIGsgPSAnYSdcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gMVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAneCc6XHJcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXHJcbiAgICAgICAgICAgICAgICBrID0gJ3AnXHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IDBcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ3knOlxyXG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMucm9vdC5rc1xyXG4gICAgICAgICAgICAgICAgayA9ICdwJ1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSAxXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlICdyb3RhdGUnOlxyXG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMucm9vdC5rc1xyXG4gICAgICAgICAgICAgICAgayA9ICdyJ1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAnb3BhY2l0eSc6XHJcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXHJcbiAgICAgICAgICAgICAgICBrID0gJ28nXHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlICd0cmltU3RhcnQnOlxyXG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZE9ySW5zZXJ0UHJvcGVydHlDb25maWcoJ3RtJylcclxuICAgICAgICAgICAgICAgIGsgPSAncydcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ3RyaW1FbmQnOlxyXG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZE9ySW5zZXJ0UHJvcGVydHlDb25maWcoJ3RtJylcclxuICAgICAgICAgICAgICAgIGsgPSAnZSdcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ3RyaW1PZmZzZXQnOlxyXG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZE9ySW5zZXJ0UHJvcGVydHlDb25maWcoJ3RtJylcclxuICAgICAgICAgICAgICAgIGsgPSAnbydcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ2ZpbGxDb2xvcic6XHJcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kUHJvcGVydHlDb25maWcoJ2ZsJylcclxuICAgICAgICAgICAgICAgIGsgPSAnYydcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ3N0cm9rZUNvbG9yJzpcclxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLmZpbmRQcm9wZXJ0eUNvbmZpZygnc3QnKVxyXG4gICAgICAgICAgICAgICAgayA9ICdjJ1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAnc3Ryb2tlV2lkdGgnOlxyXG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZFByb3BlcnR5Q29uZmlnKCdzdCcpXHJcbiAgICAgICAgICAgICAgICBrID0gJ3cnXHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlICdzaGFwZSc6XHJcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kUHJvcGVydHlDb25maWcoJ3NoJylcclxuICAgICAgICAgICAgICAgIGsgPSAna3MnXHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlICdmaWxsT3BhY2l0eSc6XHJcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kUHJvcGVydHlDb25maWcoJ2ZsJylcclxuICAgICAgICAgICAgICAgIGsgPSAnbydcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ3N0cm9rZU9wYWNpdHknOlxyXG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZFByb3BlcnR5Q29uZmlnKCdzdCcpXHJcbiAgICAgICAgICAgICAgICBrID0gJ28nXHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW2Jhc2UsIGssIGluZGV4XVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSB1cGRhdGVUaW1lUmFuZ2UoKSB7XHJcbiAgICAgICAgdGhpcy5yb290Lm9wID0gTWF0aC5tYXgoLi4uT2JqZWN0LnZhbHVlcyh0aGlzLnRpbWVSYW5nZSksIDEpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IocmVmOiBTaGFwZUxheWVyIHwgVGV4dExheWVyIHwgSW1hZ2VMYXllciB8IFByZUNvbXBMYXllcikge1xyXG4gICAgICAgIHRoaXMucm9vdCA9IHJlZlxyXG4gICAgICAgIHRoaXMuYW5jaG9yID0gWzAsIDAsIDBdXHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IFswLCAwLCAwXVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0ga2V5IHRoZSBuYW1lIG9mIHByb3BlcnR5IHRvIGJlIHNldFxyXG4gICAgICogQHBhcmFtIHZhbHVlIHRoZSB2YWx1ZSB0byBiZSBzZXRcclxuICAgICAqL1xyXG4gICAgc2V0U3RhdGljUHJvcGVydHkoa2V5OiBTZXRhYmxlS2V5cywgdmFsdWU6IGFueSkge1xyXG4gICAgICAgIHRoaXMudGltZVJhbmdlW2tleV0gPSAxXHJcbiAgICAgICAgdGhpcy51cGRhdGVUaW1lUmFuZ2UoKVxyXG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFBhdGhNYWtlcikge1xyXG4gICAgICAgICAgICB2YWx1ZS51bmlmb3JtKClcclxuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5wYXRoXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBiYXNlOiBhbnksIGs6IHN0cmluZyB8IHVuZGVmaW5lZCwgaW5kZXg6IG51bWJlciB8IHVuZGVmaW5lZFxyXG4gICAgICAgIFtiYXNlLCBrLCBpbmRleF0gPSB0aGlzLmNvbW1vblByb3BlcnR5TWFwcGluZyhrZXkpXHJcbiAgICAgICAgaWYgKCFrIHx8IGluZGV4ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgc3dpdGNoIChrZXkpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3RleHQnOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnJvb3QudHkgPT0gNSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkb2MgPSB0aGlzLnJvb3QudCEuZCFcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jLmsgPSBbZG9jLmshWzBdXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2Mua1swXS50ID0gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2Mua1swXS5zIS50ID0gdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihrZXksIHZhbHVlKVxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGEgdmFsaWQga2V5LicpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGJhc2UgJiYgayAmJiBpbmRleCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udmVydFRvU3RhdGljUHJvcGVydHkoYmFzZSwgaylcclxuICAgICAgICAgICAgaWYgKGluZGV4ID49IDApXHJcbiAgICAgICAgICAgICAgICBiYXNlW2tdLmtbaW5kZXhdID0gdmFsdWVcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgYmFzZVtrXS5rID0gdmFsdWVcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBrZXkgdGhlIG5hbWUgb2YgcHJvcGVydHkgdG8gYmUgc2V0XHJcbiAgICAgKiBAcGFyYW0gc3RhcnRGcmFtZSBmcmFtZSBudW1iZXIgdG8gc3RhcnQgdGhlIGFuaW1hdGlvblxyXG4gICAgICogQHBhcmFtIGVuZEZyYW1lIGZyYW1lIG51bWJlciB0byBlbmQgdGhlIGFuaW1hdGlvblxyXG4gICAgICogQHBhcmFtIHN0YXJ0VmFsdWUgdmFsdWUgdG8gYmUgc2V0IGluIHN0YXJ0IG9mIGFuaW1hdGlvblxyXG4gICAgICogQHBhcmFtIGVuZFZhbHVlIHZhbHVlIHRvIGJlIHNldCBpbiBlbmQgb2YgYW5pbWF0aW9uXHJcbiAgICAgKiBAcGFyYW0gZWFzaW5nIGVhc2luZyBmdW5jdGlvbiwgZGVmYXVsdCBpcyBsaW5lYXJcclxuICAgICAqL1xyXG4gICAgc2V0QW5pbWF0YWJsZVByb3BlcnR5KGtleTogU2V0YWJsZUtleXMsIHN0YXJ0RnJhbWU6IG51bWJlciwgZW5kRnJhbWU6IG51bWJlciwgc3RhcnRWYWx1ZTogYW55LCBlbmRWYWx1ZTogYW55LCBlYXNpbmc/OiBFYXNpbmdGdW5jdGlvbikge1xyXG4gICAgICAgIGlmIChlbmRGcmFtZSA8PSBzdGFydEZyYW1lKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRW5kIGZyYW1lIHNob3VsZCBiZSBsYXJnZXIgdGhhbiBzdGFydCBmcmFtZS4nKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnRpbWVSYW5nZVtrZXldID0gZW5kRnJhbWUgKyAxXHJcbiAgICAgICAgdGhpcy51cGRhdGVUaW1lUmFuZ2UoKVxyXG4gICAgICAgIGlmICghZWFzaW5nKSB7XHJcbiAgICAgICAgICAgIGVhc2luZyA9IEVhc2luZ0ZhY3RvcnkubGluZWFyKClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHN0YXJ0VmFsdWUgaW5zdGFuY2VvZiBQYXRoTWFrZXIgfHwgZW5kVmFsdWUgaW5zdGFuY2VvZiBQYXRoTWFrZXIpIHtcclxuICAgICAgICAgICAgW3N0YXJ0VmFsdWUsIGVuZFZhbHVlXS5mb3JFYWNoKHYgPT4gdiBpbnN0YW5jZW9mIFBhdGhNYWtlciAmJiB2LnVuaWZvcm0oKSlcclxuICAgICAgICAgICAgaWYgKHN0YXJ0VmFsdWUgaW5zdGFuY2VvZiBQYXRoTWFrZXIgJiYgZW5kVmFsdWUgaW5zdGFuY2VvZiBQYXRoTWFrZXIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0TGluZUNvdW50ID0gc3RhcnRWYWx1ZS5wYXRoLnYhLmxlbmd0aCAtIDFcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVuZExpbmVDb3VudCA9IGVuZFZhbHVlLnBhdGgudiEubGVuZ3RoIC0gMVxyXG4gICAgICAgICAgICAgICAgY29uc3QgY29tbW9uTXVsdGlwbGUgPSBsZWFzdENvbW1vbk11bHRpcGxlKHN0YXJ0TGluZUNvdW50LCBlbmRMaW5lQ291bnQpXHJcbiAgICAgICAgICAgICAgICBzdGFydFZhbHVlLnVwc2FtcGxlKE1hdGgucm91bmQoY29tbW9uTXVsdGlwbGUgLyBzdGFydExpbmVDb3VudCkpXHJcbiAgICAgICAgICAgICAgICBlbmRWYWx1ZS51cHNhbXBsZShNYXRoLnJvdW5kKGNvbW1vbk11bHRpcGxlIC8gZW5kTGluZUNvdW50KSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBbc3RhcnRWYWx1ZSwgZW5kVmFsdWVdID0gW3N0YXJ0VmFsdWUsIGVuZFZhbHVlXS5tYXAodiA9PiB2IGluc3RhbmNlb2YgUGF0aE1ha2VyID8gdi5wYXRoIDogdilcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGJhc2U6IGFueSwgazogc3RyaW5nIHwgdW5kZWZpbmVkLCBpbmRleDogbnVtYmVyIHwgdW5kZWZpbmVkLCB3cmFwID0gdHJ1ZTtcclxuICAgICAgICBbYmFzZSwgaywgaW5kZXhdID0gdGhpcy5jb21tb25Qcm9wZXJ0eU1hcHBpbmcoa2V5KVxyXG4gICAgICAgIGlmICghayB8fCBpbmRleCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoa2V5KSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICd0ZXh0JzpcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5yb290LnR5ID09IDUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMucm9vdC50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0ZXh0UHJvcCA9IGJhc2UuZC5rWzBdLnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRtcFN0YXJ0VmFsdWUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRleHRQcm9wKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRtcEVuZFZhbHVlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0ZXh0UHJvcCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRtcFN0YXJ0VmFsdWUudCA9IHN0YXJ0VmFsdWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG1wRW5kVmFsdWUudCA9IGVuZFZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWUgPSB0bXBTdGFydFZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlID0gdG1wRW5kVmFsdWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgayA9ICdkJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IC0xXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdyYXAgPSBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGtleSwgc3RhcnRGcmFtZSwgZW5kRnJhbWUsIHN0YXJ0VmFsdWUsIGVuZFZhbHVlLCBlYXNpbmcpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgYSB2YWxpZCBrZXkuJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYmFzZSAmJiBrICYmIGluZGV4ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkoYmFzZSwgaylcclxuICAgICAgICAgICAgdGhpcy5hZGRLZXlmcmFtZShiYXNlLCBrLCBpbmRleCwgc3RhcnRGcmFtZSwgc3RhcnRWYWx1ZSwgZWFzaW5nLCB3cmFwKVxyXG4gICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKGJhc2UsIGssIGluZGV4LCBlbmRGcmFtZSwgZW5kVmFsdWUsIHVuZGVmaW5lZCwgd3JhcClcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBMYXllckZhY3Rvcnkge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2VuZXJhdGVUcmFuc2Zvcm0oY29vcmRpbmF0ZTogbnVtYmVyW10pOiBUcmFuc2Zvcm0ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG86IHtcclxuICAgICAgICAgICAgICAgIGE6IDAsXHJcbiAgICAgICAgICAgICAgICBrOiAxMDBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcjoge1xyXG4gICAgICAgICAgICAgICAgYTogMCxcclxuICAgICAgICAgICAgICAgIGs6IDBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcDoge1xyXG4gICAgICAgICAgICAgICAgYTogMCxcclxuICAgICAgICAgICAgICAgIGs6IFtcclxuICAgICAgICAgICAgICAgICAgICBjb29yZGluYXRlWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVbMV0sXHJcbiAgICAgICAgICAgICAgICAgICAgMFxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhOiB7XHJcbiAgICAgICAgICAgICAgICBhOiAwLFxyXG4gICAgICAgICAgICAgICAgazogW1xyXG4gICAgICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgICAgICAgICAwXHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHM6IHtcclxuICAgICAgICAgICAgICAgIGE6IDAsXHJcbiAgICAgICAgICAgICAgICBrOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgMTAwLFxyXG4gICAgICAgICAgICAgICAgICAgIDEwMCxcclxuICAgICAgICAgICAgICAgICAgICAxMDBcclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGNyZWF0ZSB0aGUgYm91bmRpbmcgYm94IG9mIHN2ZyBlbGVtZW50XHJcbiAgICAgKiBAcGFyYW0gZG9tIHN2ZyBlbGVtZW50IG5lZWRzIHRvIGNhbGN1bGF0ZSB0aGUgYm91bmRpbmcgYm94XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBib3VuZGluZ0JveChkb206IFNWR0dyYXBoaWNzRWxlbWVudCkge1xyXG4gICAgICAgIGNvbnN0IGJvdW5kaW5nQm94ID0gZ2V0Qm91bmRpbmdCb3goZG9tKS5tYXAoKHYsIGkpID0+IGkgPCAyID8gdiAtIDEgOiB2ICsgMSkgYXMgW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl1cclxuICAgICAgICByZXR1cm4gdGhpcy5yZWN0KC4uLmJvdW5kaW5nQm94KVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogY3JlYXRlIHRoZSBzYW1lIHNoYXBlIG9mIHN2ZyBwYXRoXHJcbiAgICAgKiBAcGFyYW0gZG9tIHN2ZyBwYXRoIGVsZW1lbnQgcmVwcmVzZW50IHRoZSBzaGFwZVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgc2hhcGUoZG9tOiBTVkdQYXRoRWxlbWVudCkge1xyXG4gICAgICAgIGNvbnN0IGNvb3JkaW5hdGUgPSBnZXRCb3VuZGluZ0JveChkb20pXHJcbiAgICAgICAgY29uc3QgbGF5ZXI6IFNoYXBlTGF5ZXIgPSB7XHJcbiAgICAgICAgICAgIHR5OiA0LFxyXG4gICAgICAgICAgICBkZGQ6IDAsXHJcbiAgICAgICAgICAgIHNyOiAxLFxyXG4gICAgICAgICAgICBhbzogMCxcclxuICAgICAgICAgICAga3M6IHRoaXMuZ2VuZXJhdGVUcmFuc2Zvcm0oY29vcmRpbmF0ZSksXHJcbiAgICAgICAgICAgIGlwOiAwLFxyXG4gICAgICAgICAgICBvcDogMSxcclxuICAgICAgICAgICAgc3Q6IDAsXHJcbiAgICAgICAgICAgIGJtOiAwLFxyXG4gICAgICAgICAgICBzaGFwZXM6IHJlbmRlcihkb20pXHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IEpTTW92aW5MYXllcihsYXllcilcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGNyZWF0ZSBhIHJlY3RhbmdsZVxyXG4gICAgICogQHBhcmFtIGxlZnQgbGVmdCBvZiByZWN0XHJcbiAgICAgKiBAcGFyYW0gdG9wIHRvcCBvZiByZWN0XHJcbiAgICAgKiBAcGFyYW0gd2lkdGggd2lkdGggb2YgcmVjdFxyXG4gICAgICogQHBhcmFtIGhlaWdodCBoZWlnaHQgb2YgcmVjdFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVjdChsZWZ0OiBudW1iZXIsIHRvcDogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGxheWVyOiBTaGFwZUxheWVyID0ge1xyXG4gICAgICAgICAgICB0eTogNCxcclxuICAgICAgICAgICAgZGRkOiAwLFxyXG4gICAgICAgICAgICBzcjogMSxcclxuICAgICAgICAgICAgYW86IDAsXHJcbiAgICAgICAgICAgIGtzOiB0aGlzLmdlbmVyYXRlVHJhbnNmb3JtKFtsZWZ0LCB0b3AsIHdpZHRoLCBoZWlnaHRdKSxcclxuICAgICAgICAgICAgaXA6IDAsXHJcbiAgICAgICAgICAgIG9wOiAxLFxyXG4gICAgICAgICAgICBzdDogMCxcclxuICAgICAgICAgICAgYm06IDAsXHJcbiAgICAgICAgICAgIHNoYXBlczogW1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyUGxhaW5HbHlwaCgncmVjdCcsIFt3aWR0aCwgaGVpZ2h0XSlcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IEpTTW92aW5MYXllcihsYXllcilcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGNyZWF0ZSBhIGVsbGlwc2VcclxuICAgICAqIEBwYXJhbSBjeCB4IGNlbnRlciBvZiBlbGxpcHNlXHJcbiAgICAgKiBAcGFyYW0gY3kgeSBjZW50ZXIgb2YgZWxsaXBzZVxyXG4gICAgICogQHBhcmFtIHJ4IHggcmFkaXVzIG9mIGVsbGlwc2VcclxuICAgICAqIEBwYXJhbSByeSB5IHJhZGl1cyBvZiBlbGxpcHNlXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBlbGxpcHNlKGN4OiBudW1iZXIsIGN5OiBudW1iZXIsIHJ4OiBudW1iZXIsIHJ5OiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBsYXllcjogU2hhcGVMYXllciA9IHtcclxuICAgICAgICAgICAgdHk6IDQsXHJcbiAgICAgICAgICAgIGRkZDogMCxcclxuICAgICAgICAgICAgc3I6IDEsXHJcbiAgICAgICAgICAgIGFvOiAwLFxyXG4gICAgICAgICAgICBrczogdGhpcy5nZW5lcmF0ZVRyYW5zZm9ybShbY3ggLSByeCwgY3kgLSByeSwgMiAqIHJ4LCAyICogcnldKSxcclxuICAgICAgICAgICAgaXA6IDAsXHJcbiAgICAgICAgICAgIG9wOiAxLFxyXG4gICAgICAgICAgICBzdDogMCxcclxuICAgICAgICAgICAgYm06IDAsXHJcbiAgICAgICAgICAgIHNoYXBlczogW1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyUGxhaW5HbHlwaCgnZWxsaXBzZScsIFtyeCwgcnldKVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgSlNNb3ZpbkxheWVyKGxheWVyKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogbWFrZSBhIGxheWVyIGJ5IGFzc2V0IElEXHJcbiAgICAgKiBAcGFyYW0gaWQgYXNzZXQgcmVmZXJlbmNlIElEXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZWYoaWQ6IFJlZmVyZW5jZUlEKSB7XHJcbiAgICAgICAgY29uc3QgbGF5ZXIgPSBuZXcgSlNNb3ZpbkxheWVyKHtcclxuICAgICAgICAgICAgdHk6IDAsXHJcbiAgICAgICAgICAgIGRkZDogMCxcclxuICAgICAgICAgICAgc3I6IDEsXHJcbiAgICAgICAgICAgIGFvOiAwLFxyXG4gICAgICAgICAgICBrczogdGhpcy5nZW5lcmF0ZVRyYW5zZm9ybShbMCwgMCwgMCwgMF0pLFxyXG4gICAgICAgICAgICBpcDogMCxcclxuICAgICAgICAgICAgb3A6IDEsXHJcbiAgICAgICAgICAgIHN0OiAwLFxyXG4gICAgICAgICAgICBibTogMCxcclxuICAgICAgICAgICAgdzogOWU5LFxyXG4gICAgICAgICAgICBoOiA5ZTksXHJcbiAgICAgICAgICAgIHJlZklkOiBpZFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIGxheWVyXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBtYWtlIGEgY29tcGxleCBsYXllciBieSBhbiBhcmJpdHJhcnkgc3ZnIGVsZW1lbnRcclxuICAgICAqIEBwYXJhbSBkb20gc3ZnIGVsZW1lbnQgbmVlZCB0byBiZSBwYXJzZWRcclxuICAgICAqIEBwYXJhbSBhc3NldExpc3QgYSBsaXN0IGNvbnRhaW5zIGltYWdlL2xheWVyIGFzc2V0XHJcbiAgICAgKiBAcGFyYW0gZm9udExpc3QgYSBsaXN0IGNvbnRhaW5zIGZvbnQgYXNzZXRcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGhpZXJhcmNoeShkb206IFNWR0dyYXBoaWNzRWxlbWVudCwgYXNzZXRMaXN0OiBBc3NldHMsIGZvbnRMaXN0OiBGb250cykge1xyXG4gICAgICAgIGNvbnN0IGNvb3JkaW5hdGUgPSBnZXRCb3VuZGluZ0JveChkb20pXHJcbiAgICAgICAgbGV0IGRvbVR5cGU6IDIgfCA0IHwgNSB8IDA7XHJcbiAgICAgICAgaWYgKGRvbSBpbnN0YW5jZW9mIFNWR1RleHRFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGRvbVR5cGUgPSA1XHJcbiAgICAgICAgfSBlbHNlIGlmIChkb20gaW5zdGFuY2VvZiBTVkdJbWFnZUVsZW1lbnQpIHtcclxuICAgICAgICAgICAgZG9tVHlwZSA9IDJcclxuICAgICAgICB9IGVsc2UgaWYgKGRvbSBpbnN0YW5jZW9mIFNWR0dFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGRvbVR5cGUgPSAwXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZG9tVHlwZSA9IDRcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgbGF5ZXI6IFNoYXBlTGF5ZXIgfCBJbWFnZUxheWVyIHwgVGV4dExheWVyIHwgUHJlQ29tcExheWVyID0ge1xyXG4gICAgICAgICAgICB0eTogZG9tVHlwZSxcclxuICAgICAgICAgICAgZGRkOiAwLFxyXG4gICAgICAgICAgICBzcjogMSxcclxuICAgICAgICAgICAgYW86IDAsXHJcbiAgICAgICAgICAgIGtzOiB0aGlzLmdlbmVyYXRlVHJhbnNmb3JtKGRvbVR5cGUgPT0gMCA/IFswLCAwLCAwLCAwXSA6IGNvb3JkaW5hdGUpLFxyXG4gICAgICAgICAgICBpcDogMCxcclxuICAgICAgICAgICAgb3A6IDEsXHJcbiAgICAgICAgICAgIHN0OiAwLFxyXG4gICAgICAgICAgICBibTogMFxyXG4gICAgICAgIH1cclxuICAgICAgICBzd2l0Y2ggKGRvbVR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgY29uc3QgZG9tTGVhdmVzID0gZ2V0TGVhZk5vZGVzKGRvbSlcclxuICAgICAgICAgICAgICAgIGlmIChkb21MZWF2ZXMuZmlsdGVyKGRvbSA9PiBkb20gaW5zdGFuY2VvZiBTVkdUZXh0RWxlbWVudCB8fCBkb20gaW5zdGFuY2VvZiBTVkdJbWFnZUVsZW1lbnQpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByZWNvbXBMYXllciA9IGxheWVyIGFzIFByZUNvbXBMYXllclxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByZUNvbXBBc3NldDogSlNNb3ZpbkxheWVyW10gPSBbXVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByZUNvbXBSZWZJZCA9IHV1aWQoKVxyXG4gICAgICAgICAgICAgICAgICAgIGRvbUxlYXZlcy5mb3JFYWNoKGQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZCBpbnN0YW5jZW9mIFNWR0dyYXBoaWNzRWxlbWVudCAmJiAhKGQgaW5zdGFuY2VvZiBTVkdHRWxlbWVudCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZUNvbXBBc3NldC51bnNoaWZ0KHRoaXMuaGllcmFyY2h5KGQsIGFzc2V0TGlzdCwgZm9udExpc3QpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICBwcmVDb21wQXNzZXQuZm9yRWFjaChsYXllciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxheWVyLnJvb3Qub3AgPSA5ZTlcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIHByZWNvbXBMYXllci53ID0gY29vcmRpbmF0ZVswXSArIGNvb3JkaW5hdGVbMl0gKyAxXHJcbiAgICAgICAgICAgICAgICAgICAgcHJlY29tcExheWVyLmggPSBjb29yZGluYXRlWzFdICsgY29vcmRpbmF0ZVszXSArIDFcclxuICAgICAgICAgICAgICAgICAgICBwcmVjb21wTGF5ZXIucmVmSWQgPSBwcmVDb21wUmVmSWRcclxuICAgICAgICAgICAgICAgICAgICBhc3NldExpc3QucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBwcmVDb21wUmVmSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxheWVyczogcHJlQ29tcEFzc2V0Lm1hcChsYXllciA9PiBsYXllci5yb290KVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNoYXBlTGF5ZXIgPSBsYXllciBhcyBTaGFwZUxheWVyXHJcbiAgICAgICAgICAgICAgICAgICAgc2hhcGVMYXllci50eSA9IDRcclxuICAgICAgICAgICAgICAgICAgICBzaGFwZUxheWVyLmtzID0gdGhpcy5nZW5lcmF0ZVRyYW5zZm9ybShjb29yZGluYXRlKVxyXG4gICAgICAgICAgICAgICAgICAgIHNoYXBlTGF5ZXIuc2hhcGVzID0gcmVuZGVyKGRvbSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgIGNvbnN0IGltYWdlTGF5ZXIgPSBsYXllciBhcyBJbWFnZUxheWVyXHJcbiAgICAgICAgICAgICAgICBjb25zdCBbaW1hZ2VSZWZJZCwgaW1hZ2VBc3NldF0gPSByZW5kZXJJbWFnZShkb20gYXMgU1ZHSW1hZ2VFbGVtZW50LCBhc3NldExpc3QpXHJcbiAgICAgICAgICAgICAgICBpbWFnZUxheWVyLnJlZklkID0gaW1hZ2VSZWZJZFxyXG4gICAgICAgICAgICAgICAgaWYgKCFhc3NldExpc3QuZmlsdGVyKGEgPT4gYS5pZCA9PSBpbWFnZVJlZklkKS5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICAgICAgYXNzZXRMaXN0LnB1c2goaW1hZ2VBc3NldClcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNoYXBlTGF5ZXIgPSBsYXllciBhcyBTaGFwZUxheWVyXHJcbiAgICAgICAgICAgICAgICBzaGFwZUxheWVyLnNoYXBlcyA9IHJlbmRlcihkb20pXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlIDU6XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0TGF5ZXIgPSBsYXllciBhcyBUZXh0TGF5ZXJcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBtb3ZlIHRleHRMYXllcidzIHBvc2l0aW9uIHRvIHRleHQtYW5jaG9yLXJlbGF0ZWRcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJhc2VMaW5lSGVpZ2h0ID0gZ2V0QmFzZWxpbmVIZWlnaHQoZG9tIGFzIFNWR1RleHRFbGVtZW50KVxyXG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dEFuY2hvciA9IGVuY29kZVRleHRBbmNob3IoZ2V0Q29tcHV0ZWRTdHlsZShkb20pLnRleHRBbmNob3IpXHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0QW5jaG9yV2VpZ2h0ID0gWzAsIDEsIDAuNV1bdGV4dEFuY2hvcl1cclxuICAgICAgICAgICAgICAgIHRleHRMYXllci5rcyEucCEuayA9IFtjb29yZGluYXRlWzBdICsgY29vcmRpbmF0ZVsyXSAqIHRleHRBbmNob3JXZWlnaHQsIGNvb3JkaW5hdGVbMV0gKyBjb29yZGluYXRlWzNdIC0gYmFzZUxpbmVIZWlnaHQsIDBdXHJcbiAgICAgICAgICAgICAgICB0ZXh0TGF5ZXIua3MhLm8hLmsgPSB+fihwYXJzZUZsb2F0KGdldENvbXB1dGVkU3R5bGUoZG9tKS5maWxsT3BhY2l0eSB8fCAnMScpICogMTAwKVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IFt0ZXh0RGF0YSwgZm9udF0gPSByZW5kZXJUZXh0KGRvbSBhcyBTVkdUZXh0RWxlbWVudCwgZm9udExpc3QpXHJcbiAgICAgICAgICAgICAgICB0ZXh0TGF5ZXIudCA9IHRleHREYXRhXHJcbiAgICAgICAgICAgICAgICBpZiAoIWZvbnRMaXN0Lmxpc3QhLmZpbHRlcihmID0+IGYuZk5hbWUgPT0gZm9udC5mTmFtZSkubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgICAgIGZvbnRMaXN0Lmxpc3QhLnB1c2goZm9udClcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IG1vdmluTGF5ZXIgPSBuZXcgSlNNb3ZpbkxheWVyKGxheWVyKVxyXG4gICAgICAgIHJldHVybiBtb3ZpbkxheWVyXHJcbiAgICB9XHJcbn0iXX0=