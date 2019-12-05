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

          if (!(startLineCount <= 0 && endLineCount <= 0)) {
            if (Math.min(startLineCount, endLineCount) <= 0 && Math.max(startLineCount, endLineCount) > 0) {
              var needCopy = startLineCount <= 0 ? startValue : endValue;
              var needLength = Math.max(startLineCount, endLineCount);
              ['i', 'o', 'v'].forEach(function (key) {
                needCopy.path[key] = Array(needLength).fill(needCopy.path[key].length ? needCopy.path[key][0] : [0, 0]);
              });
            } else {
              var commonMultiple = (0, _helper.leastCommonMultiple)(startLineCount, endLineCount);
              startValue.upsample(Math.round(commonMultiple / startLineCount));
              endValue.upsample(Math.round(commonMultiple / endLineCount));
            }
          }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sYXllci50cyJdLCJuYW1lcyI6WyJKU01vdmluTGF5ZXIiLCJrZXkiLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJhbmNob3IiLCJwb3NpdGlvbiIsInMiLCJrIiwiZSIsIm8iLCJ0cmFuc2Zvcm0iLCJhIiwiZ2V0RGVmYXVsdFByb3BlcnR5Iiwic3RhdGljVmFsdWUiLCJpZHgiLCJ0aW1lIiwidmFsdWUiLCJlYXNpbmciLCJ3cmFwIiwiZXhpc3RLZXlmcmFtZSIsImZpbHRlciIsIngiLCJ0IiwicmVhZHlUb1NldCIsImxlbmd0aCIsInByZXZpb3VzS2V5ZnJhbWVDb3VudCIsInJlZHVjZSIsInAiLCJzcGxpY2UiLCJ5IiwiaSIsIkFycmF5Iiwicm9vdCIsInNoYXBlcyIsIml0IiwiZmluZCIsInNoYXBlIiwidHkiLCJmaW5kUHJvcGVydHlDb25maWciLCJoYXNUcmFuc2Zvcm0iLCJjb25maWciLCJncm91cFNoYXBlcyIsInB1c2giLCJiYXNlIiwiaW5kZXgiLCJrcyIsImZpbmRPckluc2VydFByb3BlcnR5Q29uZmlnIiwib3AiLCJNYXRoIiwibWF4IiwiT2JqZWN0IiwidmFsdWVzIiwidGltZVJhbmdlIiwicmVmIiwidXBkYXRlVGltZVJhbmdlIiwiUGF0aE1ha2VyIiwidW5pZm9ybSIsInBhdGgiLCJjb21tb25Qcm9wZXJ0eU1hcHBpbmciLCJ1bmRlZmluZWQiLCJkb2MiLCJkIiwiY29uc29sZSIsImVycm9yIiwiRXJyb3IiLCJjb252ZXJ0VG9TdGF0aWNQcm9wZXJ0eSIsInN0YXJ0RnJhbWUiLCJlbmRGcmFtZSIsInN0YXJ0VmFsdWUiLCJlbmRWYWx1ZSIsIkVhc2luZ0ZhY3RvcnkiLCJsaW5lYXIiLCJmb3JFYWNoIiwidiIsInN0YXJ0TGluZUNvdW50IiwiZW5kTGluZUNvdW50IiwibWluIiwibmVlZENvcHkiLCJuZWVkTGVuZ3RoIiwiZmlsbCIsImNvbW1vbk11bHRpcGxlIiwidXBzYW1wbGUiLCJyb3VuZCIsIm1hcCIsInRleHRQcm9wIiwidG1wU3RhcnRWYWx1ZSIsInRtcEVuZFZhbHVlIiwiY29udmVydFRvQW5pbWF0YWJsZVByb3BlcnR5IiwiYWRkS2V5ZnJhbWUiLCJMYXllckZhY3RvcnkiLCJjb29yZGluYXRlIiwiciIsImRvbSIsImJvdW5kaW5nQm94IiwicmVjdCIsImxheWVyIiwiZGRkIiwic3IiLCJhbyIsImdlbmVyYXRlVHJhbnNmb3JtIiwiaXAiLCJzdCIsImJtIiwibGVmdCIsInRvcCIsIndpZHRoIiwiaGVpZ2h0IiwiY3giLCJjeSIsInJ4IiwicnkiLCJpZCIsInciLCJoIiwicmVmSWQiLCJhc3NldExpc3QiLCJmb250TGlzdCIsImRvbVR5cGUiLCJTVkdUZXh0RWxlbWVudCIsIlNWR0ltYWdlRWxlbWVudCIsIlNWR0dFbGVtZW50IiwiZG9tTGVhdmVzIiwicHJlY29tcExheWVyIiwicHJlQ29tcEFzc2V0IiwicHJlQ29tcFJlZklkIiwiU1ZHR3JhcGhpY3NFbGVtZW50IiwidW5zaGlmdCIsImhpZXJhcmNoeSIsImxheWVycyIsInNoYXBlTGF5ZXIiLCJpbWFnZUxheWVyIiwiaW1hZ2VSZWZJZCIsImltYWdlQXNzZXQiLCJ0ZXh0TGF5ZXIiLCJiYXNlTGluZUhlaWdodCIsInRleHRBbmNob3IiLCJnZXRDb21wdXRlZFN0eWxlIiwidGV4dEFuY2hvcldlaWdodCIsInBhcnNlRmxvYXQiLCJmaWxsT3BhY2l0eSIsInRleHREYXRhIiwiZm9udCIsImxpc3QiLCJmIiwiZk5hbWUiLCJtb3ZpbkxheWVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBSWFBLFk7Ozs7O3VDQUtrQkMsRyxFQUFhO0FBQ3BDLGNBQVFBLEdBQVI7QUFDSSxhQUFLLEdBQUw7QUFDQSxhQUFLLEdBQUw7QUFDSSxpQkFBT0MsSUFBSSxDQUFDQyxLQUFMLENBQVdELElBQUksQ0FBQ0UsU0FBTCxDQUFlSCxHQUFHLElBQUksR0FBUCxHQUFhLEtB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cmFuc2Zvcm0sIEFzc2V0cywgRm9udHMsIEdyb3VwU2hhcGUsIFByZUNvbXBMYXllciwgUmVmZXJlbmNlSUQgfSBmcm9tICcuL2FuaW1hdGlvbidcclxuaW1wb3J0IHsgRWFzaW5nRnVuY3Rpb24sIEVhc2luZ0ZhY3RvcnkgfSBmcm9tICcuL2Vhc2luZydcclxuaW1wb3J0IHsgcmVuZGVyVGV4dCwgcmVuZGVyLCByZW5kZXJJbWFnZSwgcmVuZGVyUGxhaW5HbHlwaCB9IGZyb20gJy4vcmVuZGVyJztcclxuaW1wb3J0IHsgZ2V0Qm91bmRpbmdCb3gsIGdldExlYWZOb2RlcywgZ2V0QmFzZWxpbmVIZWlnaHQsIGVuY29kZVRleHRBbmNob3IsIGxlYXN0Q29tbW9uTXVsdGlwbGUgfSBmcm9tICcuL2hlbHBlcidcclxuaW1wb3J0IHV1aWQgZnJvbSAndXVpZC92NCc7XHJcbmltcG9ydCB7IFBhdGhNYWtlciB9IGZyb20gJy4vcGF0aCc7XHJcblxyXG50eXBlIFNldGFibGVLZXlzID0gXCJzY2FsZVhcIiB8IFwic2NhbGVZXCIgfCBcImFuY2hvclhcIiB8IFwiYW5jaG9yWVwiIHwgXCJ4XCIgfCBcInlcIiB8IFwicm90YXRlXCIgfCBcIm9wYWNpdHlcIiB8ICdzaGFwZScgfCAnZmlsbENvbG9yJyB8ICd0cmltU3RhcnQnIHwgJ3RyaW1FbmQnIHwgJ3RyaW1PZmZzZXQnIHwgJ3N0cm9rZUNvbG9yJyB8ICdzdHJva2VXaWR0aCcgfCAndGV4dCcgfCAnZmlsbE9wYWNpdHknIHwgJ3N0cm9rZU9wYWNpdHknXHJcblxyXG5leHBvcnQgY2xhc3MgSlNNb3ZpbkxheWVyIHtcclxuICAgIHB1YmxpYyByZWFkb25seSByb290OiBTaGFwZUxheWVyIHwgVGV4dExheWVyIHwgSW1hZ2VMYXllciB8IFByZUNvbXBMYXllcjtcclxuICAgIHByaXZhdGUgYW5jaG9yOiBudW1iZXJbXVxyXG4gICAgcHJpdmF0ZSBwb3NpdGlvbjogbnVtYmVyW11cclxuICAgIHByaXZhdGUgdGltZVJhbmdlOiB7IFtrZXk6IHN0cmluZ106IG51bWJlciB9ID0ge31cclxuICAgIHByaXZhdGUgZ2V0RGVmYXVsdFByb3BlcnR5KGtleTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3dpdGNoIChrZXkpIHtcclxuICAgICAgICAgICAgY2FzZSAnYSc6XHJcbiAgICAgICAgICAgIGNhc2UgJ3AnOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoa2V5ID09ICdhJyA/IHRoaXMuYW5jaG9yIDogdGhpcy5wb3NpdGlvbikpXHJcbiAgICAgICAgICAgIGNhc2UgJ3MnOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFsxMDAsIDEwMCwgMTAwXVxyXG4gICAgICAgICAgICBjYXNlICdvJzpcclxuICAgICAgICAgICAgICAgIHJldHVybiAxMDBcclxuICAgICAgICAgICAgY2FzZSAncic6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMFxyXG4gICAgICAgICAgICBjYXNlICd0bSc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgazogMFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBrOiAxMDBcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG86IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgazogMFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHJldHVybiAwXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjb252ZXJ0VG9TdGF0aWNQcm9wZXJ0eSh0cmFuc2Zvcm06IGFueSwga2V5OiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoIXRyYW5zZm9ybVtrZXldKSB7XHJcbiAgICAgICAgICAgIHRyYW5zZm9ybVtrZXldID0ge1xyXG4gICAgICAgICAgICAgICAgYTogMCxcclxuICAgICAgICAgICAgICAgIGs6IHRoaXMuZ2V0RGVmYXVsdFByb3BlcnR5KGtleSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHJhbnNmb3JtW2tleV0uYSA9PSAxKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0YXRpY1ZhbHVlID0gdHJhbnNmb3JtW2tleV0ua1swXS5zXHJcbiAgICAgICAgICAgIHRyYW5zZm9ybVtrZXldID0ge1xyXG4gICAgICAgICAgICAgICAgYTogMCxcclxuICAgICAgICAgICAgICAgIGs6IHN0YXRpY1ZhbHVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNvbnZlcnRUb0FuaW1hdGFibGVQcm9wZXJ0eSh0cmFuc2Zvcm06IGFueSwga2V5OiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoIXRyYW5zZm9ybVtrZXldIHx8ICF0cmFuc2Zvcm1ba2V5XS5hKSB7XHJcbiAgICAgICAgICAgIGlmIChrZXkgPT0gJ2EnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuY2hvciA9IHRyYW5zZm9ybVtrZXldID8gdHJhbnNmb3JtW2tleV0uayA6IFswLCAwLCAwXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChrZXkgPT0gJ3AnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gdHJhbnNmb3JtW2tleV0gPyB0cmFuc2Zvcm1ba2V5XS5rIDogWzAsIDAsIDBdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdHJhbnNmb3JtW2tleV0gPSB7XHJcbiAgICAgICAgICAgICAgICBhOiAxLFxyXG4gICAgICAgICAgICAgICAgazogW11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgYWRkS2V5ZnJhbWUodHJhbnNmb3JtOiBhbnksIGtleTogc3RyaW5nLCBpZHg6IG51bWJlciA9IC0xLCB0aW1lOiBudW1iZXIsIHZhbHVlOiBBcnJheTxhbnk+LCBlYXNpbmc/OiBFYXNpbmdGdW5jdGlvbiwgd3JhcDogYm9vbGVhbiA9IHRydWUpIHtcclxuICAgICAgICBjb25zdCBleGlzdEtleWZyYW1lID0gdHJhbnNmb3JtW2tleV0uay5maWx0ZXIoKHg6IGFueSkgPT4geC50ID09IHRpbWUpIGFzIGFueVtdXHJcbiAgICAgICAgbGV0IHJlYWR5VG9TZXQ7XHJcbiAgICAgICAgaWYgKGV4aXN0S2V5ZnJhbWUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJlYWR5VG9TZXQgPSBleGlzdEtleWZyYW1lWzBdXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVhZHlUb1NldCA9IHtcclxuICAgICAgICAgICAgICAgIHQ6IHRpbWUsXHJcbiAgICAgICAgICAgICAgICBzOiB0aGlzLmdldERlZmF1bHRQcm9wZXJ0eShrZXkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgcHJldmlvdXNLZXlmcmFtZUNvdW50ID0gdHJhbnNmb3JtW2tleV0uay5yZWR1Y2UoKHA6IG51bWJlciwgeDogYW55KSA9PiB4LnQgPCB0aW1lID8gcCArIDEgOiBwLCAwKVxyXG4gICAgICAgICAgICB0cmFuc2Zvcm1ba2V5XS5rLnNwbGljZShwcmV2aW91c0tleWZyYW1lQ291bnQsIDAsIHJlYWR5VG9TZXQpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChlYXNpbmcpIHtcclxuICAgICAgICAgICAgcmVhZHlUb1NldC5vID0ge1xyXG4gICAgICAgICAgICAgICAgeDogZWFzaW5nWzBdWzBdLFxyXG4gICAgICAgICAgICAgICAgeTogZWFzaW5nWzBdWzFdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVhZHlUb1NldC5pID0ge1xyXG4gICAgICAgICAgICAgICAgeDogZWFzaW5nWzFdWzBdLFxyXG4gICAgICAgICAgICAgICAgeTogZWFzaW5nWzFdWzFdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlkeCA+PSAwKSB7XHJcbiAgICAgICAgICAgIHJlYWR5VG9TZXQuc1tpZHhdID0gdmFsdWVcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZWFkeVRvU2V0LnMgPSB3cmFwICYmICEodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkgPyBbdmFsdWVdIDogdmFsdWVcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGZpbmRQcm9wZXJ0eUNvbmZpZyhrZXk6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiAoKHRoaXMucm9vdCBhcyBTaGFwZUxheWVyKS5zaGFwZXMhWzBdIGFzIEdyb3VwU2hhcGUpLml0IS5maW5kKHNoYXBlID0+XHJcbiAgICAgICAgICAgIHNoYXBlLnR5ID09IGtleVxyXG4gICAgICAgIClcclxuICAgIH1cclxuICAgIHByaXZhdGUgZmluZE9ySW5zZXJ0UHJvcGVydHlDb25maWcoa2V5OiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBmaW5kID0gdGhpcy5maW5kUHJvcGVydHlDb25maWcoa2V5KVxyXG4gICAgICAgIGlmIChmaW5kKSByZXR1cm4gZmluZFxyXG4gICAgICAgIGNvbnN0IGhhc1RyYW5zZm9ybSA9IHRoaXMuZmluZFByb3BlcnR5Q29uZmlnKCd0cicpXHJcbiAgICAgICAgY29uc3QgY29uZmlnID0ge1xyXG4gICAgICAgICAgICB0eToga2V5LFxyXG4gICAgICAgICAgICAuLi50aGlzLmdldERlZmF1bHRQcm9wZXJ0eShrZXkpIGFzIG9iamVjdFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaGFzVHJhbnNmb3JtKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdyb3VwU2hhcGVzID0gKCh0aGlzLnJvb3QgYXMgU2hhcGVMYXllcikuc2hhcGVzIVswXSBhcyBHcm91cFNoYXBlKS5pdCFcclxuICAgICAgICAgICAgZ3JvdXBTaGFwZXMuc3BsaWNlKGdyb3VwU2hhcGVzLmxlbmd0aCAtIDEsIDAsIGNvbmZpZylcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAoKHRoaXMucm9vdCBhcyBTaGFwZUxheWVyKS5zaGFwZXMhWzBdIGFzIEdyb3VwU2hhcGUpLml0IS5wdXNoKGNvbmZpZylcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvbmZpZ1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjb21tb25Qcm9wZXJ0eU1hcHBpbmcoa2V5OiBTZXRhYmxlS2V5cyk6IFthbnksIHN0cmluZyB8IHVuZGVmaW5lZCwgbnVtYmVyIHwgdW5kZWZpbmVkXSB7XHJcbiAgICAgICAgbGV0IGJhc2U6IGFueSwgazogc3RyaW5nIHwgdW5kZWZpbmVkLCBpbmRleDogbnVtYmVyIHwgdW5kZWZpbmVkXHJcbiAgICAgICAgc3dpdGNoIChrZXkpIHtcclxuICAgICAgICAgICAgY2FzZSAnc2NhbGVYJzpcclxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLnJvb3Qua3NcclxuICAgICAgICAgICAgICAgIGsgPSAncydcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gMFxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAnc2NhbGVZJzpcclxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLnJvb3Qua3NcclxuICAgICAgICAgICAgICAgIGsgPSAncydcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gMVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAnYW5jaG9yWCc6XHJcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXHJcbiAgICAgICAgICAgICAgICBrID0gJ2EnXHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IDBcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ2FuY2hvclknOlxyXG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMucm9vdC5rc1xyXG4gICAgICAgICAgICAgICAgayA9ICdhJ1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSAxXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlICd4JzpcclxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLnJvb3Qua3NcclxuICAgICAgICAgICAgICAgIGsgPSAncCdcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gMFxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAneSc6XHJcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXHJcbiAgICAgICAgICAgICAgICBrID0gJ3AnXHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IDFcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ3JvdGF0ZSc6XHJcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXHJcbiAgICAgICAgICAgICAgICBrID0gJ3InXHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlICdvcGFjaXR5JzpcclxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLnJvb3Qua3NcclxuICAgICAgICAgICAgICAgIGsgPSAnbydcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ3RyaW1TdGFydCc6XHJcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kT3JJbnNlcnRQcm9wZXJ0eUNvbmZpZygndG0nKVxyXG4gICAgICAgICAgICAgICAgayA9ICdzJ1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAndHJpbUVuZCc6XHJcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kT3JJbnNlcnRQcm9wZXJ0eUNvbmZpZygndG0nKVxyXG4gICAgICAgICAgICAgICAgayA9ICdlJ1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAndHJpbU9mZnNldCc6XHJcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kT3JJbnNlcnRQcm9wZXJ0eUNvbmZpZygndG0nKVxyXG4gICAgICAgICAgICAgICAgayA9ICdvJ1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAnZmlsbENvbG9yJzpcclxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLmZpbmRQcm9wZXJ0eUNvbmZpZygnZmwnKVxyXG4gICAgICAgICAgICAgICAgayA9ICdjJ1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAnc3Ryb2tlQ29sb3InOlxyXG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZFByb3BlcnR5Q29uZmlnKCdzdCcpXHJcbiAgICAgICAgICAgICAgICBrID0gJ2MnXHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlICdzdHJva2VXaWR0aCc6XHJcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kUHJvcGVydHlDb25maWcoJ3N0JylcclxuICAgICAgICAgICAgICAgIGsgPSAndydcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ3NoYXBlJzpcclxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLmZpbmRQcm9wZXJ0eUNvbmZpZygnc2gnKVxyXG4gICAgICAgICAgICAgICAgayA9ICdrcydcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ2ZpbGxPcGFjaXR5JzpcclxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLmZpbmRQcm9wZXJ0eUNvbmZpZygnZmwnKVxyXG4gICAgICAgICAgICAgICAgayA9ICdvJ1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAnc3Ryb2tlT3BhY2l0eSc6XHJcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kUHJvcGVydHlDb25maWcoJ3N0JylcclxuICAgICAgICAgICAgICAgIGsgPSAnbydcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBbYmFzZSwgaywgaW5kZXhdXHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHVwZGF0ZVRpbWVSYW5nZSgpIHtcclxuICAgICAgICB0aGlzLnJvb3Qub3AgPSBNYXRoLm1heCguLi5PYmplY3QudmFsdWVzKHRoaXMudGltZVJhbmdlKSwgMSlcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihyZWY6IFNoYXBlTGF5ZXIgfCBUZXh0TGF5ZXIgfCBJbWFnZUxheWVyIHwgUHJlQ29tcExheWVyKSB7XHJcbiAgICAgICAgdGhpcy5yb290ID0gcmVmXHJcbiAgICAgICAgdGhpcy5hbmNob3IgPSBbMCwgMCwgMF1cclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gWzAsIDAsIDBdXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBrZXkgdGhlIG5hbWUgb2YgcHJvcGVydHkgdG8gYmUgc2V0XHJcbiAgICAgKiBAcGFyYW0gdmFsdWUgdGhlIHZhbHVlIHRvIGJlIHNldFxyXG4gICAgICovXHJcbiAgICBzZXRTdGF0aWNQcm9wZXJ0eShrZXk6IFNldGFibGVLZXlzLCB2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgdGhpcy50aW1lUmFuZ2Vba2V5XSA9IDFcclxuICAgICAgICB0aGlzLnVwZGF0ZVRpbWVSYW5nZSgpXHJcbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUGF0aE1ha2VyKSB7XHJcbiAgICAgICAgICAgIHZhbHVlLnVuaWZvcm0oKVxyXG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnBhdGhcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGJhc2U6IGFueSwgazogc3RyaW5nIHwgdW5kZWZpbmVkLCBpbmRleDogbnVtYmVyIHwgdW5kZWZpbmVkXHJcbiAgICAgICAgW2Jhc2UsIGssIGluZGV4XSA9IHRoaXMuY29tbW9uUHJvcGVydHlNYXBwaW5nKGtleSlcclxuICAgICAgICBpZiAoIWsgfHwgaW5kZXggPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGtleSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAndGV4dCc6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucm9vdC50eSA9PSA1KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRvYyA9IHRoaXMucm9vdC50IS5kIVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2MuayA9IFtkb2MuayFbMF1dXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvYy5rWzBdLnQgPSAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvYy5rWzBdLnMhLnQgPSB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGtleSwgdmFsdWUpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgYSB2YWxpZCBrZXkuJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYmFzZSAmJiBrICYmIGluZGV4ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9TdGF0aWNQcm9wZXJ0eShiYXNlLCBrKVxyXG4gICAgICAgICAgICBpZiAoaW5kZXggPj0gMClcclxuICAgICAgICAgICAgICAgIGJhc2Vba10ua1tpbmRleF0gPSB2YWx1ZVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBiYXNlW2tdLmsgPSB2YWx1ZVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIGtleSB0aGUgbmFtZSBvZiBwcm9wZXJ0eSB0byBiZSBzZXRcclxuICAgICAqIEBwYXJhbSBzdGFydEZyYW1lIGZyYW1lIG51bWJlciB0byBzdGFydCB0aGUgYW5pbWF0aW9uXHJcbiAgICAgKiBAcGFyYW0gZW5kRnJhbWUgZnJhbWUgbnVtYmVyIHRvIGVuZCB0aGUgYW5pbWF0aW9uXHJcbiAgICAgKiBAcGFyYW0gc3RhcnRWYWx1ZSB2YWx1ZSB0byBiZSBzZXQgaW4gc3RhcnQgb2YgYW5pbWF0aW9uXHJcbiAgICAgKiBAcGFyYW0gZW5kVmFsdWUgdmFsdWUgdG8gYmUgc2V0IGluIGVuZCBvZiBhbmltYXRpb25cclxuICAgICAqIEBwYXJhbSBlYXNpbmcgZWFzaW5nIGZ1bmN0aW9uLCBkZWZhdWx0IGlzIGxpbmVhclxyXG4gICAgICovXHJcbiAgICBzZXRBbmltYXRhYmxlUHJvcGVydHkoa2V5OiBTZXRhYmxlS2V5cywgc3RhcnRGcmFtZTogbnVtYmVyLCBlbmRGcmFtZTogbnVtYmVyLCBzdGFydFZhbHVlOiBhbnksIGVuZFZhbHVlOiBhbnksIGVhc2luZz86IEVhc2luZ0Z1bmN0aW9uKSB7XHJcbiAgICAgICAgaWYgKGVuZEZyYW1lIDw9IHN0YXJ0RnJhbWUpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFbmQgZnJhbWUgc2hvdWxkIGJlIGxhcmdlciB0aGFuIHN0YXJ0IGZyYW1lLicpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudGltZVJhbmdlW2tleV0gPSBlbmRGcmFtZSArIDFcclxuICAgICAgICB0aGlzLnVwZGF0ZVRpbWVSYW5nZSgpXHJcbiAgICAgICAgaWYgKCFlYXNpbmcpIHtcclxuICAgICAgICAgICAgZWFzaW5nID0gRWFzaW5nRmFjdG9yeS5saW5lYXIoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc3RhcnRWYWx1ZSBpbnN0YW5jZW9mIFBhdGhNYWtlciB8fCBlbmRWYWx1ZSBpbnN0YW5jZW9mIFBhdGhNYWtlcikge1xyXG4gICAgICAgICAgICBbc3RhcnRWYWx1ZSwgZW5kVmFsdWVdLmZvckVhY2godiA9PiB2IGluc3RhbmNlb2YgUGF0aE1ha2VyICYmIHYudW5pZm9ybSgpKVxyXG4gICAgICAgICAgICBpZiAoc3RhcnRWYWx1ZSBpbnN0YW5jZW9mIFBhdGhNYWtlciAmJiBlbmRWYWx1ZSBpbnN0YW5jZW9mIFBhdGhNYWtlcikge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhcnRMaW5lQ291bnQgPSBzdGFydFZhbHVlLnBhdGgudiEubGVuZ3RoIC0gMVxyXG4gICAgICAgICAgICAgICAgY29uc3QgZW5kTGluZUNvdW50ID0gZW5kVmFsdWUucGF0aC52IS5sZW5ndGggLSAxXHJcbiAgICAgICAgICAgICAgICBpZiAoIShzdGFydExpbmVDb3VudCA8PSAwICYmIGVuZExpbmVDb3VudCA8PSAwKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLm1pbihzdGFydExpbmVDb3VudCwgZW5kTGluZUNvdW50KSA8PSAwICYmIE1hdGgubWF4KHN0YXJ0TGluZUNvdW50LCBlbmRMaW5lQ291bnQpID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmVlZENvcHkgPSBzdGFydExpbmVDb3VudCA8PSAwID8gc3RhcnRWYWx1ZSA6IGVuZFZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZWVkTGVuZ3RoID0gTWF0aC5tYXgoc3RhcnRMaW5lQ291bnQsIGVuZExpbmVDb3VudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFsnaScsICdvJywgJ3YnXS5mb3JFYWNoKGtleSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZWVkQ29weS5wYXRoW2tleV0gPSBBcnJheShuZWVkTGVuZ3RoKS5maWxsKG5lZWRDb3B5LnBhdGhba2V5XS5sZW5ndGggPyBuZWVkQ29weS5wYXRoW2tleV1bMF0gOiBbMCwgMF0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29tbW9uTXVsdGlwbGUgPSBsZWFzdENvbW1vbk11bHRpcGxlKHN0YXJ0TGluZUNvdW50LCBlbmRMaW5lQ291bnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWUudXBzYW1wbGUoTWF0aC5yb3VuZChjb21tb25NdWx0aXBsZSAvIHN0YXJ0TGluZUNvdW50KSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUudXBzYW1wbGUoTWF0aC5yb3VuZChjb21tb25NdWx0aXBsZSAvIGVuZExpbmVDb3VudCkpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFtzdGFydFZhbHVlLCBlbmRWYWx1ZV0gPSBbc3RhcnRWYWx1ZSwgZW5kVmFsdWVdLm1hcCh2ID0+IHYgaW5zdGFuY2VvZiBQYXRoTWFrZXIgPyB2LnBhdGggOiB2KVxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgYmFzZTogYW55LCBrOiBzdHJpbmcgfCB1bmRlZmluZWQsIGluZGV4OiBudW1iZXIgfCB1bmRlZmluZWQsIHdyYXAgPSB0cnVlO1xyXG4gICAgICAgIFtiYXNlLCBrLCBpbmRleF0gPSB0aGlzLmNvbW1vblByb3BlcnR5TWFwcGluZyhrZXkpXHJcbiAgICAgICAgaWYgKCFrIHx8IGluZGV4ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgc3dpdGNoIChrZXkpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3RleHQnOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnJvb3QudHkgPT0gNSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRleHRQcm9wID0gYmFzZS5kLmtbMF0uc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdG1wU3RhcnRWYWx1ZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGV4dFByb3ApKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdG1wRW5kVmFsdWUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRleHRQcm9wKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG1wU3RhcnRWYWx1ZS50ID0gc3RhcnRWYWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0bXBFbmRWYWx1ZS50ID0gZW5kVmFsdWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZSA9IHRtcFN0YXJ0VmFsdWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSB0bXBFbmRWYWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBrID0gJ2QnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcclxuICAgICAgICAgICAgICAgICAgICAgICAgd3JhcCA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3Ioa2V5LCBzdGFydEZyYW1lLCBlbmRGcmFtZSwgc3RhcnRWYWx1ZSwgZW5kVmFsdWUsIGVhc2luZylcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBhIHZhbGlkIGtleS4nKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChiYXNlICYmIGsgJiYgaW5kZXggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnZlcnRUb0FuaW1hdGFibGVQcm9wZXJ0eShiYXNlLCBrKVxyXG4gICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKGJhc2UsIGssIGluZGV4LCBzdGFydEZyYW1lLCBzdGFydFZhbHVlLCBlYXNpbmcsIHdyYXApXHJcbiAgICAgICAgICAgIHRoaXMuYWRkS2V5ZnJhbWUoYmFzZSwgaywgaW5kZXgsIGVuZEZyYW1lLCBlbmRWYWx1ZSwgdW5kZWZpbmVkLCB3cmFwKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIExheWVyRmFjdG9yeSB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZW5lcmF0ZVRyYW5zZm9ybShjb29yZGluYXRlOiBudW1iZXJbXSk6IFRyYW5zZm9ybSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbzoge1xyXG4gICAgICAgICAgICAgICAgYTogMCxcclxuICAgICAgICAgICAgICAgIGs6IDEwMFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByOiB7XHJcbiAgICAgICAgICAgICAgICBhOiAwLFxyXG4gICAgICAgICAgICAgICAgazogMFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwOiB7XHJcbiAgICAgICAgICAgICAgICBhOiAwLFxyXG4gICAgICAgICAgICAgICAgazogW1xyXG4gICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgY29vcmRpbmF0ZVsxXSxcclxuICAgICAgICAgICAgICAgICAgICAwXHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGE6IHtcclxuICAgICAgICAgICAgICAgIGE6IDAsXHJcbiAgICAgICAgICAgICAgICBrOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAgICAgICAgIDBcclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgczoge1xyXG4gICAgICAgICAgICAgICAgYTogMCxcclxuICAgICAgICAgICAgICAgIGs6IFtcclxuICAgICAgICAgICAgICAgICAgICAxMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgMTAwLFxyXG4gICAgICAgICAgICAgICAgICAgIDEwMFxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogY3JlYXRlIHRoZSBib3VuZGluZyBib3ggb2Ygc3ZnIGVsZW1lbnRcclxuICAgICAqIEBwYXJhbSBkb20gc3ZnIGVsZW1lbnQgbmVlZHMgdG8gY2FsY3VsYXRlIHRoZSBib3VuZGluZyBib3hcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGJvdW5kaW5nQm94KGRvbTogU1ZHR3JhcGhpY3NFbGVtZW50KSB7XHJcbiAgICAgICAgY29uc3QgYm91bmRpbmdCb3ggPSBnZXRCb3VuZGluZ0JveChkb20pLm1hcCgodiwgaSkgPT4gaSA8IDIgPyB2IC0gMSA6IHYgKyAxKSBhcyBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXVxyXG4gICAgICAgIHJldHVybiB0aGlzLnJlY3QoLi4uYm91bmRpbmdCb3gpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBjcmVhdGUgdGhlIHNhbWUgc2hhcGUgb2Ygc3ZnIHBhdGhcclxuICAgICAqIEBwYXJhbSBkb20gc3ZnIHBhdGggZWxlbWVudCByZXByZXNlbnQgdGhlIHNoYXBlXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBzaGFwZShkb206IFNWR1BhdGhFbGVtZW50KSB7XHJcbiAgICAgICAgY29uc3QgY29vcmRpbmF0ZSA9IGdldEJvdW5kaW5nQm94KGRvbSlcclxuICAgICAgICBjb25zdCBsYXllcjogU2hhcGVMYXllciA9IHtcclxuICAgICAgICAgICAgdHk6IDQsXHJcbiAgICAgICAgICAgIGRkZDogMCxcclxuICAgICAgICAgICAgc3I6IDEsXHJcbiAgICAgICAgICAgIGFvOiAwLFxyXG4gICAgICAgICAgICBrczogdGhpcy5nZW5lcmF0ZVRyYW5zZm9ybShjb29yZGluYXRlKSxcclxuICAgICAgICAgICAgaXA6IDAsXHJcbiAgICAgICAgICAgIG9wOiAxLFxyXG4gICAgICAgICAgICBzdDogMCxcclxuICAgICAgICAgICAgYm06IDAsXHJcbiAgICAgICAgICAgIHNoYXBlczogcmVuZGVyKGRvbSlcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgSlNNb3ZpbkxheWVyKGxheWVyKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogY3JlYXRlIGEgcmVjdGFuZ2xlXHJcbiAgICAgKiBAcGFyYW0gbGVmdCBsZWZ0IG9mIHJlY3RcclxuICAgICAqIEBwYXJhbSB0b3AgdG9wIG9mIHJlY3RcclxuICAgICAqIEBwYXJhbSB3aWR0aCB3aWR0aCBvZiByZWN0XHJcbiAgICAgKiBAcGFyYW0gaGVpZ2h0IGhlaWdodCBvZiByZWN0XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZWN0KGxlZnQ6IG51bWJlciwgdG9wOiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgbGF5ZXI6IFNoYXBlTGF5ZXIgPSB7XHJcbiAgICAgICAgICAgIHR5OiA0LFxyXG4gICAgICAgICAgICBkZGQ6IDAsXHJcbiAgICAgICAgICAgIHNyOiAxLFxyXG4gICAgICAgICAgICBhbzogMCxcclxuICAgICAgICAgICAga3M6IHRoaXMuZ2VuZXJhdGVUcmFuc2Zvcm0oW2xlZnQsIHRvcCwgd2lkdGgsIGhlaWdodF0pLFxyXG4gICAgICAgICAgICBpcDogMCxcclxuICAgICAgICAgICAgb3A6IDEsXHJcbiAgICAgICAgICAgIHN0OiAwLFxyXG4gICAgICAgICAgICBibTogMCxcclxuICAgICAgICAgICAgc2hhcGVzOiBbXHJcbiAgICAgICAgICAgICAgICByZW5kZXJQbGFpbkdseXBoKCdyZWN0JywgW3dpZHRoLCBoZWlnaHRdKVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgSlNNb3ZpbkxheWVyKGxheWVyKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogY3JlYXRlIGEgZWxsaXBzZVxyXG4gICAgICogQHBhcmFtIGN4IHggY2VudGVyIG9mIGVsbGlwc2VcclxuICAgICAqIEBwYXJhbSBjeSB5IGNlbnRlciBvZiBlbGxpcHNlXHJcbiAgICAgKiBAcGFyYW0gcnggeCByYWRpdXMgb2YgZWxsaXBzZVxyXG4gICAgICogQHBhcmFtIHJ5IHkgcmFkaXVzIG9mIGVsbGlwc2VcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGVsbGlwc2UoY3g6IG51bWJlciwgY3k6IG51bWJlciwgcng6IG51bWJlciwgcnk6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGxheWVyOiBTaGFwZUxheWVyID0ge1xyXG4gICAgICAgICAgICB0eTogNCxcclxuICAgICAgICAgICAgZGRkOiAwLFxyXG4gICAgICAgICAgICBzcjogMSxcclxuICAgICAgICAgICAgYW86IDAsXHJcbiAgICAgICAgICAgIGtzOiB0aGlzLmdlbmVyYXRlVHJhbnNmb3JtKFtjeCAtIHJ4LCBjeSAtIHJ5LCAyICogcngsIDIgKiByeV0pLFxyXG4gICAgICAgICAgICBpcDogMCxcclxuICAgICAgICAgICAgb3A6IDEsXHJcbiAgICAgICAgICAgIHN0OiAwLFxyXG4gICAgICAgICAgICBibTogMCxcclxuICAgICAgICAgICAgc2hhcGVzOiBbXHJcbiAgICAgICAgICAgICAgICByZW5kZXJQbGFpbkdseXBoKCdlbGxpcHNlJywgW3J4LCByeV0pXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBKU01vdmluTGF5ZXIobGF5ZXIpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBtYWtlIGEgbGF5ZXIgYnkgYXNzZXQgSURcclxuICAgICAqIEBwYXJhbSBpZCBhc3NldCByZWZlcmVuY2UgSURcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlZihpZDogUmVmZXJlbmNlSUQpIHtcclxuICAgICAgICBjb25zdCBsYXllciA9IG5ldyBKU01vdmluTGF5ZXIoe1xyXG4gICAgICAgICAgICB0eTogMCxcclxuICAgICAgICAgICAgZGRkOiAwLFxyXG4gICAgICAgICAgICBzcjogMSxcclxuICAgICAgICAgICAgYW86IDAsXHJcbiAgICAgICAgICAgIGtzOiB0aGlzLmdlbmVyYXRlVHJhbnNmb3JtKFswLCAwLCAwLCAwXSksXHJcbiAgICAgICAgICAgIGlwOiAwLFxyXG4gICAgICAgICAgICBvcDogMSxcclxuICAgICAgICAgICAgc3Q6IDAsXHJcbiAgICAgICAgICAgIGJtOiAwLFxyXG4gICAgICAgICAgICB3OiA5ZTksXHJcbiAgICAgICAgICAgIGg6IDllOSxcclxuICAgICAgICAgICAgcmVmSWQ6IGlkXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gbGF5ZXJcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIG1ha2UgYSBjb21wbGV4IGxheWVyIGJ5IGFuIGFyYml0cmFyeSBzdmcgZWxlbWVudFxyXG4gICAgICogQHBhcmFtIGRvbSBzdmcgZWxlbWVudCBuZWVkIHRvIGJlIHBhcnNlZFxyXG4gICAgICogQHBhcmFtIGFzc2V0TGlzdCBhIGxpc3QgY29udGFpbnMgaW1hZ2UvbGF5ZXIgYXNzZXRcclxuICAgICAqIEBwYXJhbSBmb250TGlzdCBhIGxpc3QgY29udGFpbnMgZm9udCBhc3NldFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgaGllcmFyY2h5KGRvbTogU1ZHR3JhcGhpY3NFbGVtZW50LCBhc3NldExpc3Q6IEFzc2V0cywgZm9udExpc3Q6IEZvbnRzKSB7XHJcbiAgICAgICAgY29uc3QgY29vcmRpbmF0ZSA9IGdldEJvdW5kaW5nQm94KGRvbSlcclxuICAgICAgICBsZXQgZG9tVHlwZTogMiB8IDQgfCA1IHwgMDtcclxuICAgICAgICBpZiAoZG9tIGluc3RhbmNlb2YgU1ZHVGV4dEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgZG9tVHlwZSA9IDVcclxuICAgICAgICB9IGVsc2UgaWYgKGRvbSBpbnN0YW5jZW9mIFNWR0ltYWdlRWxlbWVudCkge1xyXG4gICAgICAgICAgICBkb21UeXBlID0gMlxyXG4gICAgICAgIH0gZWxzZSBpZiAoZG9tIGluc3RhbmNlb2YgU1ZHR0VsZW1lbnQpIHtcclxuICAgICAgICAgICAgZG9tVHlwZSA9IDBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkb21UeXBlID0gNFxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBsYXllcjogU2hhcGVMYXllciB8IEltYWdlTGF5ZXIgfCBUZXh0TGF5ZXIgfCBQcmVDb21wTGF5ZXIgPSB7XHJcbiAgICAgICAgICAgIHR5OiBkb21UeXBlLFxyXG4gICAgICAgICAgICBkZGQ6IDAsXHJcbiAgICAgICAgICAgIHNyOiAxLFxyXG4gICAgICAgICAgICBhbzogMCxcclxuICAgICAgICAgICAga3M6IHRoaXMuZ2VuZXJhdGVUcmFuc2Zvcm0oZG9tVHlwZSA9PSAwID8gWzAsIDAsIDAsIDBdIDogY29vcmRpbmF0ZSksXHJcbiAgICAgICAgICAgIGlwOiAwLFxyXG4gICAgICAgICAgICBvcDogMSxcclxuICAgICAgICAgICAgc3Q6IDAsXHJcbiAgICAgICAgICAgIGJtOiAwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN3aXRjaCAoZG9tVHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkb21MZWF2ZXMgPSBnZXRMZWFmTm9kZXMoZG9tKVxyXG4gICAgICAgICAgICAgICAgaWYgKGRvbUxlYXZlcy5maWx0ZXIoZG9tID0+IGRvbSBpbnN0YW5jZW9mIFNWR1RleHRFbGVtZW50IHx8IGRvbSBpbnN0YW5jZW9mIFNWR0ltYWdlRWxlbWVudCkubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJlY29tcExheWVyID0gbGF5ZXIgYXMgUHJlQ29tcExheWVyXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJlQ29tcEFzc2V0OiBKU01vdmluTGF5ZXJbXSA9IFtdXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJlQ29tcFJlZklkID0gdXVpZCgpXHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTGVhdmVzLmZvckVhY2goZCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkIGluc3RhbmNlb2YgU1ZHR3JhcGhpY3NFbGVtZW50ICYmICEoZCBpbnN0YW5jZW9mIFNWR0dFbGVtZW50KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlQ29tcEFzc2V0LnVuc2hpZnQodGhpcy5oaWVyYXJjaHkoZCwgYXNzZXRMaXN0LCBmb250TGlzdCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIHByZUNvbXBBc3NldC5mb3JFYWNoKGxheWVyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGF5ZXIucm9vdC5vcCA9IDllOVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgcHJlY29tcExheWVyLncgPSBjb29yZGluYXRlWzBdICsgY29vcmRpbmF0ZVsyXSArIDFcclxuICAgICAgICAgICAgICAgICAgICBwcmVjb21wTGF5ZXIuaCA9IGNvb3JkaW5hdGVbMV0gKyBjb29yZGluYXRlWzNdICsgMVxyXG4gICAgICAgICAgICAgICAgICAgIHByZWNvbXBMYXllci5yZWZJZCA9IHByZUNvbXBSZWZJZFxyXG4gICAgICAgICAgICAgICAgICAgIGFzc2V0TGlzdC5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHByZUNvbXBSZWZJZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGF5ZXJzOiBwcmVDb21wQXNzZXQubWFwKGxheWVyID0+IGxheWVyLnJvb3QpXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2hhcGVMYXllciA9IGxheWVyIGFzIFNoYXBlTGF5ZXJcclxuICAgICAgICAgICAgICAgICAgICBzaGFwZUxheWVyLnR5ID0gNFxyXG4gICAgICAgICAgICAgICAgICAgIHNoYXBlTGF5ZXIua3MgPSB0aGlzLmdlbmVyYXRlVHJhbnNmb3JtKGNvb3JkaW5hdGUpXHJcbiAgICAgICAgICAgICAgICAgICAgc2hhcGVMYXllci5zaGFwZXMgPSByZW5kZXIoZG9tKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgY29uc3QgaW1hZ2VMYXllciA9IGxheWVyIGFzIEltYWdlTGF5ZXJcclxuICAgICAgICAgICAgICAgIGNvbnN0IFtpbWFnZVJlZklkLCBpbWFnZUFzc2V0XSA9IHJlbmRlckltYWdlKGRvbSBhcyBTVkdJbWFnZUVsZW1lbnQsIGFzc2V0TGlzdClcclxuICAgICAgICAgICAgICAgIGltYWdlTGF5ZXIucmVmSWQgPSBpbWFnZVJlZklkXHJcbiAgICAgICAgICAgICAgICBpZiAoIWFzc2V0TGlzdC5maWx0ZXIoYSA9PiBhLmlkID09IGltYWdlUmVmSWQpLmxlbmd0aClcclxuICAgICAgICAgICAgICAgICAgICBhc3NldExpc3QucHVzaChpbWFnZUFzc2V0KVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hhcGVMYXllciA9IGxheWVyIGFzIFNoYXBlTGF5ZXJcclxuICAgICAgICAgICAgICAgIHNoYXBlTGF5ZXIuc2hhcGVzID0gcmVuZGVyKGRvbSlcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgNTpcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRleHRMYXllciA9IGxheWVyIGFzIFRleHRMYXllclxyXG5cclxuICAgICAgICAgICAgICAgIC8vIG1vdmUgdGV4dExheWVyJ3MgcG9zaXRpb24gdG8gdGV4dC1hbmNob3ItcmVsYXRlZFxyXG4gICAgICAgICAgICAgICAgY29uc3QgYmFzZUxpbmVIZWlnaHQgPSBnZXRCYXNlbGluZUhlaWdodChkb20gYXMgU1ZHVGV4dEVsZW1lbnQpXHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0QW5jaG9yID0gZW5jb2RlVGV4dEFuY2hvcihnZXRDb21wdXRlZFN0eWxlKGRvbSkudGV4dEFuY2hvcilcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRleHRBbmNob3JXZWlnaHQgPSBbMCwgMSwgMC41XVt0ZXh0QW5jaG9yXVxyXG4gICAgICAgICAgICAgICAgdGV4dExheWVyLmtzIS5wIS5rID0gW2Nvb3JkaW5hdGVbMF0gKyBjb29yZGluYXRlWzJdICogdGV4dEFuY2hvcldlaWdodCwgY29vcmRpbmF0ZVsxXSArIGNvb3JkaW5hdGVbM10gLSBiYXNlTGluZUhlaWdodCwgMF1cclxuICAgICAgICAgICAgICAgIHRleHRMYXllci5rcyEubyEuayA9IH5+KHBhcnNlRmxvYXQoZ2V0Q29tcHV0ZWRTdHlsZShkb20pLmZpbGxPcGFjaXR5IHx8ICcxJykgKiAxMDApXHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgW3RleHREYXRhLCBmb250XSA9IHJlbmRlclRleHQoZG9tIGFzIFNWR1RleHRFbGVtZW50LCBmb250TGlzdClcclxuICAgICAgICAgICAgICAgIHRleHRMYXllci50ID0gdGV4dERhdGFcclxuICAgICAgICAgICAgICAgIGlmICghZm9udExpc3QubGlzdCEuZmlsdGVyKGYgPT4gZi5mTmFtZSA9PSBmb250LmZOYW1lKS5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICAgICAgZm9udExpc3QubGlzdCEucHVzaChmb250KVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgbW92aW5MYXllciA9IG5ldyBKU01vdmluTGF5ZXIobGF5ZXIpXHJcbiAgICAgICAgcmV0dXJuIG1vdmluTGF5ZXJcclxuICAgIH1cclxufSJdfQ==