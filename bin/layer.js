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

      this.timeRange[key] = Math.max(this.timeRange[key] || 0, endFrame + 1);
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
        this.addKeyframe(base, k, index, endFrame, endValue, _easing.EasingFactory.linear(), wrap);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sYXllci50cyJdLCJuYW1lcyI6WyJKU01vdmluTGF5ZXIiLCJrZXkiLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJhbmNob3IiLCJwb3NpdGlvbiIsInMiLCJrIiwiZSIsIm8iLCJ0cmFuc2Zvcm0iLCJhIiwiZ2V0RGVmYXVsdFByb3BlcnR5Iiwic3RhdGljVmFsdWUiLCJpZHgiLCJ0aW1lIiwidmFsdWUiLCJlYXNpbmciLCJ3cmFwIiwiZXhpc3RLZXlmcmFtZSIsImZpbHRlciIsIngiLCJ0IiwicmVhZHlUb1NldCIsImxlbmd0aCIsInByZXZpb3VzS2V5ZnJhbWVDb3VudCIsInJlZHVjZSIsInAiLCJzcGxpY2UiLCJ5IiwiaSIsIkFycmF5Iiwicm9vdCIsInNoYXBlcyIsIml0IiwiZmluZCIsInNoYXBlIiwidHkiLCJmaW5kUHJvcGVydHlDb25maWciLCJoYXNUcmFuc2Zvcm0iLCJjb25maWciLCJncm91cFNoYXBlcyIsInB1c2giLCJiYXNlIiwiaW5kZXgiLCJrcyIsImZpbmRPckluc2VydFByb3BlcnR5Q29uZmlnIiwib3AiLCJNYXRoIiwibWF4IiwiT2JqZWN0IiwidmFsdWVzIiwidGltZVJhbmdlIiwicmVmIiwidXBkYXRlVGltZVJhbmdlIiwiUGF0aE1ha2VyIiwidW5pZm9ybSIsInBhdGgiLCJjb21tb25Qcm9wZXJ0eU1hcHBpbmciLCJ1bmRlZmluZWQiLCJkb2MiLCJkIiwiY29uc29sZSIsImVycm9yIiwiRXJyb3IiLCJjb252ZXJ0VG9TdGF0aWNQcm9wZXJ0eSIsInN0YXJ0RnJhbWUiLCJlbmRGcmFtZSIsInN0YXJ0VmFsdWUiLCJlbmRWYWx1ZSIsIkVhc2luZ0ZhY3RvcnkiLCJsaW5lYXIiLCJmb3JFYWNoIiwidiIsInN0YXJ0TGluZUNvdW50IiwiZW5kTGluZUNvdW50IiwibWluIiwibmVlZENvcHkiLCJuZWVkTGVuZ3RoIiwiZmlsbCIsImNvbW1vbk11bHRpcGxlIiwidXBzYW1wbGUiLCJyb3VuZCIsIm1hcCIsInRleHRQcm9wIiwidG1wU3RhcnRWYWx1ZSIsInRtcEVuZFZhbHVlIiwiY29udmVydFRvQW5pbWF0YWJsZVByb3BlcnR5IiwiYWRkS2V5ZnJhbWUiLCJMYXllckZhY3RvcnkiLCJjb29yZGluYXRlIiwiciIsImRvbSIsImJvdW5kaW5nQm94IiwicmVjdCIsImxheWVyIiwiZGRkIiwic3IiLCJhbyIsImdlbmVyYXRlVHJhbnNmb3JtIiwiaXAiLCJzdCIsImJtIiwibGVmdCIsInRvcCIsIndpZHRoIiwiaGVpZ2h0IiwiY3giLCJjeSIsInJ4IiwicnkiLCJpZCIsInciLCJoIiwicmVmSWQiLCJhc3NldExpc3QiLCJmb250TGlzdCIsImRvbVR5cGUiLCJTVkdUZXh0RWxlbWVudCIsIlNWR0ltYWdlRWxlbWVudCIsIlNWR0dFbGVtZW50IiwiZG9tTGVhdmVzIiwicHJlY29tcExheWVyIiwicHJlQ29tcEFzc2V0IiwicHJlQ29tcFJlZklkIiwiU1ZHR3JhcGhpY3NFbGVtZW50IiwidW5zaGlmdCIsImhpZXJhcmNoeSIsImxheWVycyIsInNoYXBlTGF5ZXIiLCJpbWFnZUxheWVyIiwiaW1hZ2VSZWZJZCIsImltYWdlQXNzZXQiLCJ0ZXh0TGF5ZXIiLCJiYXNlTGluZUhlaWdodCIsInRleHRBbmNob3IiLCJnZXRDb21wdXRlZFN0eWxlIiwidGV4dEFuY2hvcldlaWdodCIsInBhcnNlRmxvYXQiLCJmaWxsT3BhY2l0eSIsInRleHREYXRhIiwiZm9udCIsImxpc3QiLCJmIiwiZk5hbWUiLCJtb3ZpbkxheWVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBSWFBLFk7Ozs7O3VDQUtrQkMsRyxFQUFhO0FBQ3BDLGNBQVFBLEdBQVI7QUFDSSxhQUFLLEdBQUw7QUFDQSxhQUFLLEdBQUw7QUFDSSxpQkFBT0MsSUFBSSxDQUFDQyxLQUFMLENBQVdELElBQUksQ0FBQ0UsU0FBTCxDQUFlSCxHQUFHLElBQUksR0FBUCxHQUFhLEtB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YUFBT2tELFVBQVA7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNoYXBlTGF5ZXIsIFRleHRMYXllciwgSW1hZ2VMYXllciwgVHJhbnNmb3JtLCBBc3NldHMsIEZvbnRzLCBHcm91cFNoYXBlLCBQcmVDb21wTGF5ZXIsIFJlZmVyZW5jZUlEIH0gZnJvbSAnLi9hbmltYXRpb24nXG5pbXBvcnQgeyBFYXNpbmdGdW5jdGlvbiwgRWFzaW5nRmFjdG9yeSB9IGZyb20gJy4vZWFzaW5nJ1xuaW1wb3J0IHsgcmVuZGVyVGV4dCwgcmVuZGVyLCByZW5kZXJJbWFnZSwgcmVuZGVyUGxhaW5HbHlwaCB9IGZyb20gJy4vcmVuZGVyJztcbmltcG9ydCB7IGdldEJvdW5kaW5nQm94LCBnZXRMZWFmTm9kZXMsIGdldEJhc2VsaW5lSGVpZ2h0LCBlbmNvZGVUZXh0QW5jaG9yLCBsZWFzdENvbW1vbk11bHRpcGxlIH0gZnJvbSAnLi9oZWxwZXInXG5pbXBvcnQgdXVpZCBmcm9tICd1dWlkL3Y0JztcbmltcG9ydCB7IFBhdGhNYWtlciB9IGZyb20gJy4vcGF0aCc7XG5cbnR5cGUgU2V0YWJsZUtleXMgPSBcInNjYWxlWFwiIHwgXCJzY2FsZVlcIiB8IFwiYW5jaG9yWFwiIHwgXCJhbmNob3JZXCIgfCBcInhcIiB8IFwieVwiIHwgXCJyb3RhdGVcIiB8IFwib3BhY2l0eVwiIHwgJ3NoYXBlJyB8ICdmaWxsQ29sb3InIHwgJ3RyaW1TdGFydCcgfCAndHJpbUVuZCcgfCAndHJpbU9mZnNldCcgfCAnc3Ryb2tlQ29sb3InIHwgJ3N0cm9rZVdpZHRoJyB8ICd0ZXh0JyB8ICdmaWxsT3BhY2l0eScgfCAnc3Ryb2tlT3BhY2l0eSdcblxuZXhwb3J0IGNsYXNzIEpTTW92aW5MYXllciB7XG4gICAgcHVibGljIHJlYWRvbmx5IHJvb3Q6IFNoYXBlTGF5ZXIgfCBUZXh0TGF5ZXIgfCBJbWFnZUxheWVyIHwgUHJlQ29tcExheWVyO1xuICAgIHByaXZhdGUgYW5jaG9yOiBudW1iZXJbXVxuICAgIHByaXZhdGUgcG9zaXRpb246IG51bWJlcltdXG4gICAgcHJpdmF0ZSB0aW1lUmFuZ2U6IHsgW2tleTogc3RyaW5nXTogbnVtYmVyIH0gPSB7fVxuICAgIHByaXZhdGUgZ2V0RGVmYXVsdFByb3BlcnR5KGtleTogc3RyaW5nKSB7XG4gICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgICAgICBjYXNlICdhJzpcbiAgICAgICAgICAgIGNhc2UgJ3AnOlxuICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGtleSA9PSAnYScgPyB0aGlzLmFuY2hvciA6IHRoaXMucG9zaXRpb24pKVxuICAgICAgICAgICAgY2FzZSAncyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsxMDAsIDEwMCwgMTAwXVxuICAgICAgICAgICAgY2FzZSAnbyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIDEwMFxuICAgICAgICAgICAgY2FzZSAncic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIDBcbiAgICAgICAgICAgIGNhc2UgJ3RtJzpcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrOiAwXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGs6IDEwMFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBvOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrOiAwXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiAwXG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBjb252ZXJ0VG9TdGF0aWNQcm9wZXJ0eSh0cmFuc2Zvcm06IGFueSwga2V5OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0cmFuc2Zvcm1ba2V5XSkge1xuICAgICAgICAgICAgdHJhbnNmb3JtW2tleV0gPSB7XG4gICAgICAgICAgICAgICAgYTogMCxcbiAgICAgICAgICAgICAgICBrOiB0aGlzLmdldERlZmF1bHRQcm9wZXJ0eShrZXkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRyYW5zZm9ybVtrZXldLmEgPT0gMSkge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGljVmFsdWUgPSB0cmFuc2Zvcm1ba2V5XS5rWzBdLnNcbiAgICAgICAgICAgIHRyYW5zZm9ybVtrZXldID0ge1xuICAgICAgICAgICAgICAgIGE6IDAsXG4gICAgICAgICAgICAgICAgazogc3RhdGljVmFsdWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGNvbnZlcnRUb0FuaW1hdGFibGVQcm9wZXJ0eSh0cmFuc2Zvcm06IGFueSwga2V5OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0cmFuc2Zvcm1ba2V5XSB8fCAhdHJhbnNmb3JtW2tleV0uYSkge1xuICAgICAgICAgICAgaWYgKGtleSA9PSAnYScpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFuY2hvciA9IHRyYW5zZm9ybVtrZXldID8gdHJhbnNmb3JtW2tleV0uayA6IFswLCAwLCAwXVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGtleSA9PSAncCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gdHJhbnNmb3JtW2tleV0gPyB0cmFuc2Zvcm1ba2V5XS5rIDogWzAsIDAsIDBdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0cmFuc2Zvcm1ba2V5XSA9IHtcbiAgICAgICAgICAgICAgICBhOiAxLFxuICAgICAgICAgICAgICAgIGs6IFtdXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBhZGRLZXlmcmFtZSh0cmFuc2Zvcm06IGFueSwga2V5OiBzdHJpbmcsIGlkeDogbnVtYmVyID0gLTEsIHRpbWU6IG51bWJlciwgdmFsdWU6IEFycmF5PGFueT4sIGVhc2luZz86IEVhc2luZ0Z1bmN0aW9uLCB3cmFwOiBib29sZWFuID0gdHJ1ZSkge1xuICAgICAgICBjb25zdCBleGlzdEtleWZyYW1lID0gdHJhbnNmb3JtW2tleV0uay5maWx0ZXIoKHg6IGFueSkgPT4geC50ID09IHRpbWUpIGFzIGFueVtdXG4gICAgICAgIGxldCByZWFkeVRvU2V0O1xuICAgICAgICBpZiAoZXhpc3RLZXlmcmFtZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJlYWR5VG9TZXQgPSBleGlzdEtleWZyYW1lWzBdXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWFkeVRvU2V0ID0ge1xuICAgICAgICAgICAgICAgIHQ6IHRpbWUsXG4gICAgICAgICAgICAgICAgczogdGhpcy5nZXREZWZhdWx0UHJvcGVydHkoa2V5KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcHJldmlvdXNLZXlmcmFtZUNvdW50ID0gdHJhbnNmb3JtW2tleV0uay5yZWR1Y2UoKHA6IG51bWJlciwgeDogYW55KSA9PiB4LnQgPCB0aW1lID8gcCArIDEgOiBwLCAwKVxuICAgICAgICAgICAgdHJhbnNmb3JtW2tleV0uay5zcGxpY2UocHJldmlvdXNLZXlmcmFtZUNvdW50LCAwLCByZWFkeVRvU2V0KVxuICAgICAgICB9XG4gICAgICAgIGlmIChlYXNpbmcpIHtcbiAgICAgICAgICAgIHJlYWR5VG9TZXQubyA9IHtcbiAgICAgICAgICAgICAgICB4OiBlYXNpbmdbMF1bMF0sXG4gICAgICAgICAgICAgICAgeTogZWFzaW5nWzBdWzFdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZWFkeVRvU2V0LmkgPSB7XG4gICAgICAgICAgICAgICAgeDogZWFzaW5nWzFdWzBdLFxuICAgICAgICAgICAgICAgIHk6IGVhc2luZ1sxXVsxXVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgICAgICAgcmVhZHlUb1NldC5zW2lkeF0gPSB2YWx1ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVhZHlUb1NldC5zID0gd3JhcCAmJiAhKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpID8gW3ZhbHVlXSA6IHZhbHVlXG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBmaW5kUHJvcGVydHlDb25maWcoa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuICgodGhpcy5yb290IGFzIFNoYXBlTGF5ZXIpLnNoYXBlcyFbMF0gYXMgR3JvdXBTaGFwZSkuaXQhLmZpbmQoc2hhcGUgPT5cbiAgICAgICAgICAgIHNoYXBlLnR5ID09IGtleVxuICAgICAgICApXG4gICAgfVxuICAgIHByaXZhdGUgZmluZE9ySW5zZXJ0UHJvcGVydHlDb25maWcoa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgZmluZCA9IHRoaXMuZmluZFByb3BlcnR5Q29uZmlnKGtleSlcbiAgICAgICAgaWYgKGZpbmQpIHJldHVybiBmaW5kXG4gICAgICAgIGNvbnN0IGhhc1RyYW5zZm9ybSA9IHRoaXMuZmluZFByb3BlcnR5Q29uZmlnKCd0cicpXG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IHtcbiAgICAgICAgICAgIHR5OiBrZXksXG4gICAgICAgICAgICAuLi50aGlzLmdldERlZmF1bHRQcm9wZXJ0eShrZXkpIGFzIG9iamVjdFxuICAgICAgICB9XG4gICAgICAgIGlmIChoYXNUcmFuc2Zvcm0pIHtcbiAgICAgICAgICAgIGNvbnN0IGdyb3VwU2hhcGVzID0gKCh0aGlzLnJvb3QgYXMgU2hhcGVMYXllcikuc2hhcGVzIVswXSBhcyBHcm91cFNoYXBlKS5pdCFcbiAgICAgICAgICAgIGdyb3VwU2hhcGVzLnNwbGljZShncm91cFNoYXBlcy5sZW5ndGggLSAxLCAwLCBjb25maWcpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAoKHRoaXMucm9vdCBhcyBTaGFwZUxheWVyKS5zaGFwZXMhWzBdIGFzIEdyb3VwU2hhcGUpLml0IS5wdXNoKGNvbmZpZylcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29uZmlnXG4gICAgfVxuICAgIHByaXZhdGUgY29tbW9uUHJvcGVydHlNYXBwaW5nKGtleTogU2V0YWJsZUtleXMpOiBbYW55LCBzdHJpbmcgfCB1bmRlZmluZWQsIG51bWJlciB8IHVuZGVmaW5lZF0ge1xuICAgICAgICBsZXQgYmFzZTogYW55LCBrOiBzdHJpbmcgfCB1bmRlZmluZWQsIGluZGV4OiBudW1iZXIgfCB1bmRlZmluZWRcbiAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgIGNhc2UgJ3NjYWxlWCc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMucm9vdC5rc1xuICAgICAgICAgICAgICAgIGsgPSAncydcbiAgICAgICAgICAgICAgICBpbmRleCA9IDBcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnc2NhbGVZJzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXG4gICAgICAgICAgICAgICAgayA9ICdzJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdhbmNob3JYJzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXG4gICAgICAgICAgICAgICAgayA9ICdhJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gMFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdhbmNob3JZJzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXG4gICAgICAgICAgICAgICAgayA9ICdhJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICd4JzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXG4gICAgICAgICAgICAgICAgayA9ICdwJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gMFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICd5JzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXG4gICAgICAgICAgICAgICAgayA9ICdwJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdyb3RhdGUnOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLnJvb3Qua3NcbiAgICAgICAgICAgICAgICBrID0gJ3InXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdvcGFjaXR5JzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXG4gICAgICAgICAgICAgICAgayA9ICdvJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAndHJpbVN0YXJ0JzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kT3JJbnNlcnRQcm9wZXJ0eUNvbmZpZygndG0nKVxuICAgICAgICAgICAgICAgIGsgPSAncydcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3RyaW1FbmQnOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLmZpbmRPckluc2VydFByb3BlcnR5Q29uZmlnKCd0bScpXG4gICAgICAgICAgICAgICAgayA9ICdlJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAndHJpbU9mZnNldCc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZE9ySW5zZXJ0UHJvcGVydHlDb25maWcoJ3RtJylcbiAgICAgICAgICAgICAgICBrID0gJ28nXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdmaWxsQ29sb3InOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLmZpbmRQcm9wZXJ0eUNvbmZpZygnZmwnKVxuICAgICAgICAgICAgICAgIGsgPSAnYydcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3N0cm9rZUNvbG9yJzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kUHJvcGVydHlDb25maWcoJ3N0JylcbiAgICAgICAgICAgICAgICBrID0gJ2MnXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdzdHJva2VXaWR0aCc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZFByb3BlcnR5Q29uZmlnKCdzdCcpXG4gICAgICAgICAgICAgICAgayA9ICd3J1xuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnc2hhcGUnOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLmZpbmRQcm9wZXJ0eUNvbmZpZygnc2gnKVxuICAgICAgICAgICAgICAgIGsgPSAna3MnXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdmaWxsT3BhY2l0eSc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZFByb3BlcnR5Q29uZmlnKCdmbCcpXG4gICAgICAgICAgICAgICAgayA9ICdvJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnc3Ryb2tlT3BhY2l0eSc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZFByb3BlcnR5Q29uZmlnKCdzdCcpXG4gICAgICAgICAgICAgICAgayA9ICdvJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbYmFzZSwgaywgaW5kZXhdXG4gICAgfVxuICAgIHByaXZhdGUgdXBkYXRlVGltZVJhbmdlKCkge1xuICAgICAgICB0aGlzLnJvb3Qub3AgPSBNYXRoLm1heCguLi5PYmplY3QudmFsdWVzKHRoaXMudGltZVJhbmdlKSwgMSlcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihyZWY6IFNoYXBlTGF5ZXIgfCBUZXh0TGF5ZXIgfCBJbWFnZUxheWVyIHwgUHJlQ29tcExheWVyKSB7XG4gICAgICAgIHRoaXMucm9vdCA9IHJlZlxuICAgICAgICB0aGlzLmFuY2hvciA9IFswLCAwLCAwXVxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gWzAsIDAsIDBdXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIGtleSB0aGUgbmFtZSBvZiBwcm9wZXJ0eSB0byBiZSBzZXRcbiAgICAgKiBAcGFyYW0gdmFsdWUgdGhlIHZhbHVlIHRvIGJlIHNldFxuICAgICAqL1xuICAgIHNldFN0YXRpY1Byb3BlcnR5KGtleTogU2V0YWJsZUtleXMsIHZhbHVlOiBhbnkpIHtcbiAgICAgICAgdGhpcy50aW1lUmFuZ2Vba2V5XSA9IDFcbiAgICAgICAgdGhpcy51cGRhdGVUaW1lUmFuZ2UoKVxuICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBQYXRoTWFrZXIpIHtcbiAgICAgICAgICAgIHZhbHVlLnVuaWZvcm0oKVxuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5wYXRoXG4gICAgICAgIH1cbiAgICAgICAgbGV0IGJhc2U6IGFueSwgazogc3RyaW5nIHwgdW5kZWZpbmVkLCBpbmRleDogbnVtYmVyIHwgdW5kZWZpbmVkXG4gICAgICAgIFtiYXNlLCBrLCBpbmRleF0gPSB0aGlzLmNvbW1vblByb3BlcnR5TWFwcGluZyhrZXkpXG4gICAgICAgIGlmICghayB8fCBpbmRleCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5yb290LnR5ID09IDUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRvYyA9IHRoaXMucm9vdC50IS5kIVxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jLmsgPSBbZG9jLmshWzBdXVxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jLmtbMF0udCA9IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvYy5rWzBdLnMhLnQgPSB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihrZXksIHZhbHVlKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBhIHZhbGlkIGtleS4nKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChiYXNlICYmIGsgJiYgaW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9TdGF0aWNQcm9wZXJ0eShiYXNlLCBrKVxuICAgICAgICAgICAgaWYgKGluZGV4ID49IDApXG4gICAgICAgICAgICAgICAgYmFzZVtrXS5rW2luZGV4XSA9IHZhbHVlXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgYmFzZVtrXS5rID0gdmFsdWVcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSBrZXkgdGhlIG5hbWUgb2YgcHJvcGVydHkgdG8gYmUgc2V0XG4gICAgICogQHBhcmFtIHN0YXJ0RnJhbWUgZnJhbWUgbnVtYmVyIHRvIHN0YXJ0IHRoZSBhbmltYXRpb25cbiAgICAgKiBAcGFyYW0gZW5kRnJhbWUgZnJhbWUgbnVtYmVyIHRvIGVuZCB0aGUgYW5pbWF0aW9uXG4gICAgICogQHBhcmFtIHN0YXJ0VmFsdWUgdmFsdWUgdG8gYmUgc2V0IGluIHN0YXJ0IG9mIGFuaW1hdGlvblxuICAgICAqIEBwYXJhbSBlbmRWYWx1ZSB2YWx1ZSB0byBiZSBzZXQgaW4gZW5kIG9mIGFuaW1hdGlvblxuICAgICAqIEBwYXJhbSBlYXNpbmcgZWFzaW5nIGZ1bmN0aW9uLCBkZWZhdWx0IGlzIGxpbmVhclxuICAgICAqL1xuICAgIHNldEFuaW1hdGFibGVQcm9wZXJ0eShrZXk6IFNldGFibGVLZXlzLCBzdGFydEZyYW1lOiBudW1iZXIsIGVuZEZyYW1lOiBudW1iZXIsIHN0YXJ0VmFsdWU6IGFueSwgZW5kVmFsdWU6IGFueSwgZWFzaW5nPzogRWFzaW5nRnVuY3Rpb24pIHtcbiAgICAgICAgaWYgKGVuZEZyYW1lIDw9IHN0YXJ0RnJhbWUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRW5kIGZyYW1lIHNob3VsZCBiZSBsYXJnZXIgdGhhbiBzdGFydCBmcmFtZS4nKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMudGltZVJhbmdlW2tleV0gPSBNYXRoLm1heCh0aGlzLnRpbWVSYW5nZVtrZXldIHx8IDAsIGVuZEZyYW1lICsgMSlcbiAgICAgICAgdGhpcy51cGRhdGVUaW1lUmFuZ2UoKVxuICAgICAgICBpZiAoIWVhc2luZykge1xuICAgICAgICAgICAgZWFzaW5nID0gRWFzaW5nRmFjdG9yeS5saW5lYXIoKVxuICAgICAgICB9XG4gICAgICAgIGlmIChzdGFydFZhbHVlIGluc3RhbmNlb2YgUGF0aE1ha2VyIHx8IGVuZFZhbHVlIGluc3RhbmNlb2YgUGF0aE1ha2VyKSB7XG4gICAgICAgICAgICBbc3RhcnRWYWx1ZSwgZW5kVmFsdWVdLmZvckVhY2godiA9PiB2IGluc3RhbmNlb2YgUGF0aE1ha2VyICYmIHYudW5pZm9ybSgpKVxuICAgICAgICAgICAgaWYgKHN0YXJ0VmFsdWUgaW5zdGFuY2VvZiBQYXRoTWFrZXIgJiYgZW5kVmFsdWUgaW5zdGFuY2VvZiBQYXRoTWFrZXIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGFydExpbmVDb3VudCA9IHN0YXJ0VmFsdWUucGF0aC52IS5sZW5ndGggLSAxXG4gICAgICAgICAgICAgICAgY29uc3QgZW5kTGluZUNvdW50ID0gZW5kVmFsdWUucGF0aC52IS5sZW5ndGggLSAxXG4gICAgICAgICAgICAgICAgaWYgKCEoc3RhcnRMaW5lQ291bnQgPD0gMCAmJiBlbmRMaW5lQ291bnQgPD0gMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGgubWluKHN0YXJ0TGluZUNvdW50LCBlbmRMaW5lQ291bnQpIDw9IDAgJiYgTWF0aC5tYXgoc3RhcnRMaW5lQ291bnQsIGVuZExpbmVDb3VudCkgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmVlZENvcHkgPSBzdGFydExpbmVDb3VudCA8PSAwID8gc3RhcnRWYWx1ZSA6IGVuZFZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmVlZExlbmd0aCA9IE1hdGgubWF4KHN0YXJ0TGluZUNvdW50LCBlbmRMaW5lQ291bnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgWydpJywgJ28nLCAndiddLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZWVkQ29weS5wYXRoW2tleV0gPSBBcnJheShuZWVkTGVuZ3RoKS5maWxsKG5lZWRDb3B5LnBhdGhba2V5XS5sZW5ndGggPyBuZWVkQ29weS5wYXRoW2tleV1bMF0gOiBbMCwgMF0pXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29tbW9uTXVsdGlwbGUgPSBsZWFzdENvbW1vbk11bHRpcGxlKHN0YXJ0TGluZUNvdW50LCBlbmRMaW5lQ291bnQpXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlLnVwc2FtcGxlKE1hdGgucm91bmQoY29tbW9uTXVsdGlwbGUgLyBzdGFydExpbmVDb3VudCkpXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZS51cHNhbXBsZShNYXRoLnJvdW5kKGNvbW1vbk11bHRpcGxlIC8gZW5kTGluZUNvdW50KSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFtzdGFydFZhbHVlLCBlbmRWYWx1ZV0gPSBbc3RhcnRWYWx1ZSwgZW5kVmFsdWVdLm1hcCh2ID0+IHYgaW5zdGFuY2VvZiBQYXRoTWFrZXIgPyB2LnBhdGggOiB2KVxuICAgICAgICB9XG4gICAgICAgIGxldCBiYXNlOiBhbnksIGs6IHN0cmluZyB8IHVuZGVmaW5lZCwgaW5kZXg6IG51bWJlciB8IHVuZGVmaW5lZCwgd3JhcCA9IHRydWU7XG4gICAgICAgIFtiYXNlLCBrLCBpbmRleF0gPSB0aGlzLmNvbW1vblByb3BlcnR5TWFwcGluZyhrZXkpXG4gICAgICAgIGlmICghayB8fCBpbmRleCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5yb290LnR5ID09IDUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLnJvb3QudFxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRleHRQcm9wID0gYmFzZS5kLmtbMF0uc1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRtcFN0YXJ0VmFsdWUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRleHRQcm9wKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0bXBFbmRWYWx1ZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGV4dFByb3ApKVxuICAgICAgICAgICAgICAgICAgICAgICAgdG1wU3RhcnRWYWx1ZS50ID0gc3RhcnRWYWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgdG1wRW5kVmFsdWUudCA9IGVuZFZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlID0gdG1wU3RhcnRWYWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSB0bXBFbmRWYWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgayA9ICdkJ1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgICAgICAgICAgd3JhcCA9IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGtleSwgc3RhcnRGcmFtZSwgZW5kRnJhbWUsIHN0YXJ0VmFsdWUsIGVuZFZhbHVlLCBlYXNpbmcpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGEgdmFsaWQga2V5LicpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJhc2UgJiYgayAmJiBpbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnZlcnRUb0FuaW1hdGFibGVQcm9wZXJ0eShiYXNlLCBrKVxuICAgICAgICAgICAgdGhpcy5hZGRLZXlmcmFtZShiYXNlLCBrLCBpbmRleCwgc3RhcnRGcmFtZSwgc3RhcnRWYWx1ZSwgZWFzaW5nLCB3cmFwKVxuICAgICAgICAgICAgdGhpcy5hZGRLZXlmcmFtZShiYXNlLCBrLCBpbmRleCwgZW5kRnJhbWUsIGVuZFZhbHVlLCBFYXNpbmdGYWN0b3J5LmxpbmVhcigpLCB3cmFwKVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTGF5ZXJGYWN0b3J5IHtcbiAgICBwcml2YXRlIHN0YXRpYyBnZW5lcmF0ZVRyYW5zZm9ybShjb29yZGluYXRlOiBudW1iZXJbXSk6IFRyYW5zZm9ybSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvOiB7XG4gICAgICAgICAgICAgICAgYTogMCxcbiAgICAgICAgICAgICAgICBrOiAxMDBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByOiB7XG4gICAgICAgICAgICAgICAgYTogMCxcbiAgICAgICAgICAgICAgICBrOiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcDoge1xuICAgICAgICAgICAgICAgIGE6IDAsXG4gICAgICAgICAgICAgICAgazogW1xuICAgICAgICAgICAgICAgICAgICBjb29yZGluYXRlWzBdLFxuICAgICAgICAgICAgICAgICAgICBjb29yZGluYXRlWzFdLFxuICAgICAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGE6IHtcbiAgICAgICAgICAgICAgICBhOiAwLFxuICAgICAgICAgICAgICAgIGs6IFtcbiAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzOiB7XG4gICAgICAgICAgICAgICAgYTogMCxcbiAgICAgICAgICAgICAgICBrOiBbXG4gICAgICAgICAgICAgICAgICAgIDEwMCxcbiAgICAgICAgICAgICAgICAgICAgMTAwLFxuICAgICAgICAgICAgICAgICAgICAxMDBcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjcmVhdGUgdGhlIGJvdW5kaW5nIGJveCBvZiBzdmcgZWxlbWVudFxuICAgICAqIEBwYXJhbSBkb20gc3ZnIGVsZW1lbnQgbmVlZHMgdG8gY2FsY3VsYXRlIHRoZSBib3VuZGluZyBib3hcbiAgICAgKi9cbiAgICBzdGF0aWMgYm91bmRpbmdCb3goZG9tOiBTVkdHcmFwaGljc0VsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgYm91bmRpbmdCb3ggPSBnZXRCb3VuZGluZ0JveChkb20pLm1hcCgodiwgaSkgPT4gaSA8IDIgPyB2IC0gMSA6IHYgKyAxKSBhcyBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXVxuICAgICAgICByZXR1cm4gdGhpcy5yZWN0KC4uLmJvdW5kaW5nQm94KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNyZWF0ZSB0aGUgc2FtZSBzaGFwZSBvZiBzdmcgcGF0aFxuICAgICAqIEBwYXJhbSBkb20gc3ZnIHBhdGggZWxlbWVudCByZXByZXNlbnQgdGhlIHNoYXBlXG4gICAgICovXG4gICAgc3RhdGljIHNoYXBlKGRvbTogU1ZHUGF0aEVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgY29vcmRpbmF0ZSA9IGdldEJvdW5kaW5nQm94KGRvbSlcbiAgICAgICAgY29uc3QgbGF5ZXI6IFNoYXBlTGF5ZXIgPSB7XG4gICAgICAgICAgICB0eTogNCxcbiAgICAgICAgICAgIGRkZDogMCxcbiAgICAgICAgICAgIHNyOiAxLFxuICAgICAgICAgICAgYW86IDAsXG4gICAgICAgICAgICBrczogdGhpcy5nZW5lcmF0ZVRyYW5zZm9ybShjb29yZGluYXRlKSxcbiAgICAgICAgICAgIGlwOiAwLFxuICAgICAgICAgICAgb3A6IDEsXG4gICAgICAgICAgICBzdDogMCxcbiAgICAgICAgICAgIGJtOiAwLFxuICAgICAgICAgICAgc2hhcGVzOiByZW5kZXIoZG9tKVxuXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBKU01vdmluTGF5ZXIobGF5ZXIpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY3JlYXRlIGEgcmVjdGFuZ2xlXG4gICAgICogQHBhcmFtIGxlZnQgbGVmdCBvZiByZWN0XG4gICAgICogQHBhcmFtIHRvcCB0b3Agb2YgcmVjdFxuICAgICAqIEBwYXJhbSB3aWR0aCB3aWR0aCBvZiByZWN0XG4gICAgICogQHBhcmFtIGhlaWdodCBoZWlnaHQgb2YgcmVjdFxuICAgICAqL1xuICAgIHN0YXRpYyByZWN0KGxlZnQ6IG51bWJlciwgdG9wOiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGxheWVyOiBTaGFwZUxheWVyID0ge1xuICAgICAgICAgICAgdHk6IDQsXG4gICAgICAgICAgICBkZGQ6IDAsXG4gICAgICAgICAgICBzcjogMSxcbiAgICAgICAgICAgIGFvOiAwLFxuICAgICAgICAgICAga3M6IHRoaXMuZ2VuZXJhdGVUcmFuc2Zvcm0oW2xlZnQsIHRvcCwgd2lkdGgsIGhlaWdodF0pLFxuICAgICAgICAgICAgaXA6IDAsXG4gICAgICAgICAgICBvcDogMSxcbiAgICAgICAgICAgIHN0OiAwLFxuICAgICAgICAgICAgYm06IDAsXG4gICAgICAgICAgICBzaGFwZXM6IFtcbiAgICAgICAgICAgICAgICByZW5kZXJQbGFpbkdseXBoKCdyZWN0JywgW3dpZHRoLCBoZWlnaHRdKVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgSlNNb3ZpbkxheWVyKGxheWVyKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNyZWF0ZSBhIGVsbGlwc2VcbiAgICAgKiBAcGFyYW0gY3ggeCBjZW50ZXIgb2YgZWxsaXBzZVxuICAgICAqIEBwYXJhbSBjeSB5IGNlbnRlciBvZiBlbGxpcHNlXG4gICAgICogQHBhcmFtIHJ4IHggcmFkaXVzIG9mIGVsbGlwc2VcbiAgICAgKiBAcGFyYW0gcnkgeSByYWRpdXMgb2YgZWxsaXBzZVxuICAgICAqL1xuICAgIHN0YXRpYyBlbGxpcHNlKGN4OiBudW1iZXIsIGN5OiBudW1iZXIsIHJ4OiBudW1iZXIsIHJ5OiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgbGF5ZXI6IFNoYXBlTGF5ZXIgPSB7XG4gICAgICAgICAgICB0eTogNCxcbiAgICAgICAgICAgIGRkZDogMCxcbiAgICAgICAgICAgIHNyOiAxLFxuICAgICAgICAgICAgYW86IDAsXG4gICAgICAgICAgICBrczogdGhpcy5nZW5lcmF0ZVRyYW5zZm9ybShbY3ggLSByeCwgY3kgLSByeSwgMiAqIHJ4LCAyICogcnldKSxcbiAgICAgICAgICAgIGlwOiAwLFxuICAgICAgICAgICAgb3A6IDEsXG4gICAgICAgICAgICBzdDogMCxcbiAgICAgICAgICAgIGJtOiAwLFxuICAgICAgICAgICAgc2hhcGVzOiBbXG4gICAgICAgICAgICAgICAgcmVuZGVyUGxhaW5HbHlwaCgnZWxsaXBzZScsIFtyeCwgcnldKVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgSlNNb3ZpbkxheWVyKGxheWVyKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG1ha2UgYSBsYXllciBieSBhc3NldCBJRFxuICAgICAqIEBwYXJhbSBpZCBhc3NldCByZWZlcmVuY2UgSURcbiAgICAgKi9cbiAgICBzdGF0aWMgcmVmKGlkOiBSZWZlcmVuY2VJRCkge1xuICAgICAgICBjb25zdCBsYXllciA9IG5ldyBKU01vdmluTGF5ZXIoe1xuICAgICAgICAgICAgdHk6IDAsXG4gICAgICAgICAgICBkZGQ6IDAsXG4gICAgICAgICAgICBzcjogMSxcbiAgICAgICAgICAgIGFvOiAwLFxuICAgICAgICAgICAga3M6IHRoaXMuZ2VuZXJhdGVUcmFuc2Zvcm0oWzAsIDAsIDAsIDBdKSxcbiAgICAgICAgICAgIGlwOiAwLFxuICAgICAgICAgICAgb3A6IDEsXG4gICAgICAgICAgICBzdDogMCxcbiAgICAgICAgICAgIGJtOiAwLFxuICAgICAgICAgICAgdzogOWU5LFxuICAgICAgICAgICAgaDogOWU5LFxuICAgICAgICAgICAgcmVmSWQ6IGlkXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBsYXllclxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG1ha2UgYSBjb21wbGV4IGxheWVyIGJ5IGFuIGFyYml0cmFyeSBzdmcgZWxlbWVudFxuICAgICAqIEBwYXJhbSBkb20gc3ZnIGVsZW1lbnQgbmVlZCB0byBiZSBwYXJzZWRcbiAgICAgKiBAcGFyYW0gYXNzZXRMaXN0IGEgbGlzdCBjb250YWlucyBpbWFnZS9sYXllciBhc3NldFxuICAgICAqIEBwYXJhbSBmb250TGlzdCBhIGxpc3QgY29udGFpbnMgZm9udCBhc3NldFxuICAgICAqL1xuICAgIHN0YXRpYyBoaWVyYXJjaHkoZG9tOiBTVkdHcmFwaGljc0VsZW1lbnQsIGFzc2V0TGlzdDogQXNzZXRzLCBmb250TGlzdDogRm9udHMpIHtcbiAgICAgICAgY29uc3QgY29vcmRpbmF0ZSA9IGdldEJvdW5kaW5nQm94KGRvbSlcbiAgICAgICAgbGV0IGRvbVR5cGU6IDIgfCA0IHwgNSB8IDA7XG4gICAgICAgIGlmIChkb20gaW5zdGFuY2VvZiBTVkdUZXh0RWxlbWVudCkge1xuICAgICAgICAgICAgZG9tVHlwZSA9IDVcbiAgICAgICAgfSBlbHNlIGlmIChkb20gaW5zdGFuY2VvZiBTVkdJbWFnZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIGRvbVR5cGUgPSAyXG4gICAgICAgIH0gZWxzZSBpZiAoZG9tIGluc3RhbmNlb2YgU1ZHR0VsZW1lbnQpIHtcbiAgICAgICAgICAgIGRvbVR5cGUgPSAwXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb21UeXBlID0gNFxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxheWVyOiBTaGFwZUxheWVyIHwgSW1hZ2VMYXllciB8IFRleHRMYXllciB8IFByZUNvbXBMYXllciA9IHtcbiAgICAgICAgICAgIHR5OiBkb21UeXBlLFxuICAgICAgICAgICAgZGRkOiAwLFxuICAgICAgICAgICAgc3I6IDEsXG4gICAgICAgICAgICBhbzogMCxcbiAgICAgICAgICAgIGtzOiB0aGlzLmdlbmVyYXRlVHJhbnNmb3JtKGRvbVR5cGUgPT0gMCA/IFswLCAwLCAwLCAwXSA6IGNvb3JkaW5hdGUpLFxuICAgICAgICAgICAgaXA6IDAsXG4gICAgICAgICAgICBvcDogMSxcbiAgICAgICAgICAgIHN0OiAwLFxuICAgICAgICAgICAgYm06IDBcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKGRvbVR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBjb25zdCBkb21MZWF2ZXMgPSBnZXRMZWFmTm9kZXMoZG9tKVxuICAgICAgICAgICAgICAgIGlmIChkb21MZWF2ZXMuZmlsdGVyKGRvbSA9PiBkb20gaW5zdGFuY2VvZiBTVkdUZXh0RWxlbWVudCB8fCBkb20gaW5zdGFuY2VvZiBTVkdJbWFnZUVsZW1lbnQpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcmVjb21wTGF5ZXIgPSBsYXllciBhcyBQcmVDb21wTGF5ZXJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJlQ29tcEFzc2V0OiBKU01vdmluTGF5ZXJbXSA9IFtdXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByZUNvbXBSZWZJZCA9IHV1aWQoKVxuICAgICAgICAgICAgICAgICAgICBkb21MZWF2ZXMuZm9yRWFjaChkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkIGluc3RhbmNlb2YgU1ZHR3JhcGhpY3NFbGVtZW50ICYmICEoZCBpbnN0YW5jZW9mIFNWR0dFbGVtZW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZUNvbXBBc3NldC51bnNoaWZ0KHRoaXMuaGllcmFyY2h5KGQsIGFzc2V0TGlzdCwgZm9udExpc3QpKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICBwcmVDb21wQXNzZXQuZm9yRWFjaChsYXllciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXllci5yb290Lm9wID0gOWU5XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIHByZWNvbXBMYXllci53ID0gY29vcmRpbmF0ZVswXSArIGNvb3JkaW5hdGVbMl0gKyAxXG4gICAgICAgICAgICAgICAgICAgIHByZWNvbXBMYXllci5oID0gY29vcmRpbmF0ZVsxXSArIGNvb3JkaW5hdGVbM10gKyAxXG4gICAgICAgICAgICAgICAgICAgIHByZWNvbXBMYXllci5yZWZJZCA9IHByZUNvbXBSZWZJZFxuICAgICAgICAgICAgICAgICAgICBhc3NldExpc3QucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogcHJlQ29tcFJlZklkLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGF5ZXJzOiBwcmVDb21wQXNzZXQubWFwKGxheWVyID0+IGxheWVyLnJvb3QpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2hhcGVMYXllciA9IGxheWVyIGFzIFNoYXBlTGF5ZXJcbiAgICAgICAgICAgICAgICAgICAgc2hhcGVMYXllci50eSA9IDRcbiAgICAgICAgICAgICAgICAgICAgc2hhcGVMYXllci5rcyA9IHRoaXMuZ2VuZXJhdGVUcmFuc2Zvcm0oY29vcmRpbmF0ZSlcbiAgICAgICAgICAgICAgICAgICAgc2hhcGVMYXllci5zaGFwZXMgPSByZW5kZXIoZG9tKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGNvbnN0IGltYWdlTGF5ZXIgPSBsYXllciBhcyBJbWFnZUxheWVyXG4gICAgICAgICAgICAgICAgY29uc3QgW2ltYWdlUmVmSWQsIGltYWdlQXNzZXRdID0gcmVuZGVySW1hZ2UoZG9tIGFzIFNWR0ltYWdlRWxlbWVudCwgYXNzZXRMaXN0KVxuICAgICAgICAgICAgICAgIGltYWdlTGF5ZXIucmVmSWQgPSBpbWFnZVJlZklkXG4gICAgICAgICAgICAgICAgaWYgKCFhc3NldExpc3QuZmlsdGVyKGEgPT4gYS5pZCA9PSBpbWFnZVJlZklkKS5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgIGFzc2V0TGlzdC5wdXNoKGltYWdlQXNzZXQpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICBjb25zdCBzaGFwZUxheWVyID0gbGF5ZXIgYXMgU2hhcGVMYXllclxuICAgICAgICAgICAgICAgIHNoYXBlTGF5ZXIuc2hhcGVzID0gcmVuZGVyKGRvbSlcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgIGNvbnN0IHRleHRMYXllciA9IGxheWVyIGFzIFRleHRMYXllclxuXG4gICAgICAgICAgICAgICAgLy8gbW92ZSB0ZXh0TGF5ZXIncyBwb3NpdGlvbiB0byB0ZXh0LWFuY2hvci1yZWxhdGVkXG4gICAgICAgICAgICAgICAgY29uc3QgYmFzZUxpbmVIZWlnaHQgPSBnZXRCYXNlbGluZUhlaWdodChkb20gYXMgU1ZHVGV4dEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dEFuY2hvciA9IGVuY29kZVRleHRBbmNob3IoZ2V0Q29tcHV0ZWRTdHlsZShkb20pLnRleHRBbmNob3IpXG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dEFuY2hvcldlaWdodCA9IFswLCAxLCAwLjVdW3RleHRBbmNob3JdXG4gICAgICAgICAgICAgICAgdGV4dExheWVyLmtzIS5wIS5rID0gW2Nvb3JkaW5hdGVbMF0gKyBjb29yZGluYXRlWzJdICogdGV4dEFuY2hvcldlaWdodCwgY29vcmRpbmF0ZVsxXSArIGNvb3JkaW5hdGVbM10gLSBiYXNlTGluZUhlaWdodCwgMF1cbiAgICAgICAgICAgICAgICB0ZXh0TGF5ZXIua3MhLm8hLmsgPSB+fihwYXJzZUZsb2F0KGdldENvbXB1dGVkU3R5bGUoZG9tKS5maWxsT3BhY2l0eSB8fCAnMScpICogMTAwKVxuXG4gICAgICAgICAgICAgICAgY29uc3QgW3RleHREYXRhLCBmb250XSA9IHJlbmRlclRleHQoZG9tIGFzIFNWR1RleHRFbGVtZW50LCBmb250TGlzdClcbiAgICAgICAgICAgICAgICB0ZXh0TGF5ZXIudCA9IHRleHREYXRhXG4gICAgICAgICAgICAgICAgaWYgKCFmb250TGlzdC5saXN0IS5maWx0ZXIoZiA9PiBmLmZOYW1lID09IGZvbnQuZk5hbWUpLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgZm9udExpc3QubGlzdCEucHVzaChmb250KVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbW92aW5MYXllciA9IG5ldyBKU01vdmluTGF5ZXIobGF5ZXIpXG4gICAgICAgIHJldHVybiBtb3ZpbkxheWVyXG4gICAgfVxufSJdfQ==