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
        readyToSet.s = wrap ? [value] : value;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sYXllci50cyJdLCJuYW1lcyI6WyJKU01vdmluTGF5ZXIiLCJrZXkiLCJzIiwiayIsImUiLCJvIiwidHJhbnNmb3JtIiwiYSIsImdldERlZmF1bHRQcm9wZXJ0eSIsInN0YXRpY1ZhbHVlIiwiaWR4IiwidGltZSIsInZhbHVlIiwiZWFzaW5nIiwid3JhcCIsImV4aXN0S2V5ZnJhbWUiLCJmaWx0ZXIiLCJ4IiwidCIsInJlYWR5VG9TZXQiLCJsZW5ndGgiLCJwcmV2aW91c0tleWZyYW1lQ291bnQiLCJyZWR1Y2UiLCJwIiwic3BsaWNlIiwieSIsImkiLCJyb290Iiwic2hhcGVzIiwiaXQiLCJmaW5kIiwic2hhcGUiLCJ0eSIsImZpbmRQcm9wZXJ0eUNvbmZpZyIsImhhc1RyYW5zZm9ybSIsImNvbmZpZyIsImdyb3VwU2hhcGVzIiwicHVzaCIsImJhc2UiLCJpbmRleCIsImtzIiwiZmluZE9ySW5zZXJ0UHJvcGVydHlDb25maWciLCJyZWYiLCJvcCIsImNvbW1vblByb3BlcnR5TWFwcGluZyIsInVuZGVmaW5lZCIsImRvYyIsImQiLCJjb25zb2xlIiwiZXJyb3IiLCJFcnJvciIsImNvbnZlcnRUb1N0YXRpY1Byb3BlcnR5Iiwic3RhcnRGcmFtZSIsImVuZEZyYW1lIiwic3RhcnRWYWx1ZSIsImVuZFZhbHVlIiwiRWFzaW5nRmFjdG9yeSIsImxpbmVhciIsInRleHRQcm9wIiwidG1wU3RhcnRWYWx1ZSIsIkpTT04iLCJwYXJzZSIsInN0cmluZ2lmeSIsInRtcEVuZFZhbHVlIiwiY29udmVydFRvQW5pbWF0YWJsZVByb3BlcnR5IiwiYWRkS2V5ZnJhbWUiLCJMYXllckZhY3RvcnkiLCJjb29yZGluYXRlIiwiciIsImRvbSIsImJvdW5kaW5nQm94IiwibWFwIiwidiIsInJlY3QiLCJsYXllciIsImRkZCIsInNyIiwiYW8iLCJnZW5lcmF0ZVRyYW5zZm9ybSIsImlwIiwic3QiLCJibSIsImxlZnQiLCJ0b3AiLCJ3aWR0aCIsImhlaWdodCIsImN4IiwiY3kiLCJyeCIsInJ5IiwiYXNzZXRMaXN0IiwiZm9udExpc3QiLCJkb21UeXBlIiwiU1ZHVGV4dEVsZW1lbnQiLCJTVkdJbWFnZUVsZW1lbnQiLCJTVkdHRWxlbWVudCIsInByZWNvbXBMYXllciIsImRvbUxlYXZlcyIsInByZUNvbXBBc3NldCIsInByZUNvbXBSZWZJZCIsImZvckVhY2giLCJTVkdHcmFwaGljc0VsZW1lbnQiLCJ1bnNoaWZ0IiwiaGllcmFyY2h5IiwidyIsImgiLCJyZWZJZCIsImlkIiwibGF5ZXJzIiwiaW1hZ2VMYXllciIsImltYWdlUmVmSWQiLCJpbWFnZUFzc2V0Iiwic2hhcGVMYXllciIsInRleHRMYXllciIsImJhc2VMaW5lSGVpZ2h0IiwidGV4dERhdGEiLCJmb250IiwibGlzdCIsImYiLCJmTmFtZSIsIm1vdmluTGF5ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFJYUEsWTs7Ozs7dUNBRWtCQyxHLEVBQWE7QUFDcEMsY0FBUUEsR0FBUjtBQUNJLGFBQUssR0FBTDtBQUNBLGFBQUssR0FBTDtBQUNJLGlCQUFPLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLENBQVA7O0FBQ0osYUFBSyxHQUFMO0FBQ0ksaUJBQU8sQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEdBQVgsQ0FBUDs7QUFDSixhQUFLLEdBQUw7QUFDSSxpQkFBTyxHQUFQOztBQUNKLGFBQUssR0FBTDtBQUNJLGlCQUFPLENBQVA7O0FBQ0osYUFBSyxJQUFMO0FBQ0ksaUJBQU87QUFDSEMsWUFBQUEsQ0FBQyxFQUFFO0FBQ0NDLGNBQUFBLENBQUMsRUFBRSxDQUFDLENBQUQ7QUFESixhQURBO0FBSUhDLFlBQUFBLENBQUMsRUFBRTtBQUNDRCxjQUFBQSxDQUFDLEVBQUUsQ0FBQyxHQUFEO0FBREosYUFKQTtBQU9IRSxZQUFBQSxDQUFDLEVBQUU7QUFDQ0YsY0FBQUEsQ0FBQyxFQUFFLENBQUMsQ0FBRDtBQURK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cEI7QUFBQSxXQUF2QixFQUFrRG5HLE1BQXZELEVBQ0l1RSxRQUFRLENBQUMwQixJQUFULENBQWVoRixJQUFmLENBQW9CK0UsSUFBcEI7QUFDSjtBQTVDUjs7QUE4Q0EsVUFBTUksVUFBVSxHQUFHLElBQUl4SCxZQUFKLENBQWlCMEUsS0FBakIsQ0FBbkI7QUFDQSxhQUFPOEMsVUFBUDtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2hhcGVMYXllciwgVGV4dExheWVyLCBJbWFnZUxheWVyLCBUcmFuc2Zvcm0sIEFzc2V0cywgRm9udHMsIEdyb3VwU2hhcGUsIFByZUNvbXBMYXllciB9IGZyb20gJy4vYW5pbWF0aW9uJ1xuaW1wb3J0IHsgRWFzaW5nRnVuY3Rpb24sIEVhc2luZ0ZhY3RvcnkgfSBmcm9tICcuL2Vhc2luZydcbmltcG9ydCB7IHJlbmRlclRleHQsIHJlbmRlciwgcmVuZGVySW1hZ2UsIHJlbmRlclBsYWluR2x5cGggfSBmcm9tICcuL3JlbmRlcic7XG5pbXBvcnQgeyBnZXRCb3VuZGluZ0JveCwgZ2V0TGVhZk5vZGVzLCBnZXRCYXNlbGluZUhlaWdodCwgZW5jb2RlTGluZUNhcCwgZW5jb2RlTGluZUpvaW4gfSBmcm9tICcuL2hlbHBlcidcbmltcG9ydCB1dWlkIGZyb20gJ3V1aWQvdjQnO1xuXG50eXBlIFNldGFibGVLZXlzID0gXCJzY2FsZVhcIiB8IFwic2NhbGVZXCIgfCBcImFuY2hvclhcIiB8IFwiYW5jaG9yWVwiIHwgXCJ4XCIgfCBcInlcIiB8IFwicm90YXRlXCIgfCBcIm9wYWNpdHlcIiB8ICdzaGFwZScgfCAnZmlsbENvbG9yJyB8ICd0cmltU3RhcnQnIHwgJ3RyaW1FbmQnIHwgJ3RyaW1PZmZzZXQnIHwgJ3N0cm9rZUNvbG9yJyB8ICdzdHJva2VXaWR0aCcgfCAndGV4dCcgfCAnZmlsbE9wYWNpdHknIHwgJ3N0cm9rZU9wYWNpdHknIHwgJ2xpbmVDYXAnIHwgJ2xpbmVKb2luJ1xuXG5leHBvcnQgY2xhc3MgSlNNb3ZpbkxheWVyIHtcbiAgICBwdWJsaWMgcmVhZG9ubHkgcm9vdDogU2hhcGVMYXllciB8IFRleHRMYXllciB8IEltYWdlTGF5ZXIgfCBQcmVDb21wTGF5ZXI7XG4gICAgcHJpdmF0ZSBnZXREZWZhdWx0UHJvcGVydHkoa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgIGNhc2UgJ2EnOlxuICAgICAgICAgICAgY2FzZSAncCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFswLCAwLCAwXVxuICAgICAgICAgICAgY2FzZSAncyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsxMDAsIDEwMCwgMTAwXVxuICAgICAgICAgICAgY2FzZSAnbyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIDEwMFxuICAgICAgICAgICAgY2FzZSAncic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIDBcbiAgICAgICAgICAgIGNhc2UgJ3RtJzpcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrOiBbMF1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgazogWzEwMF1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgazogWzBdXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiAwXG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBjb252ZXJ0VG9TdGF0aWNQcm9wZXJ0eSh0cmFuc2Zvcm06IGFueSwga2V5OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0cmFuc2Zvcm1ba2V5XSkge1xuICAgICAgICAgICAgdHJhbnNmb3JtW2tleV0gPSB7XG4gICAgICAgICAgICAgICAgYTogMCxcbiAgICAgICAgICAgICAgICBrOiB0aGlzLmdldERlZmF1bHRQcm9wZXJ0eShrZXkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRyYW5zZm9ybVtrZXldLmEgPT0gMSkge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGljVmFsdWUgPSB0cmFuc2Zvcm1ba2V5XS5rWzBdLnNcbiAgICAgICAgICAgIHRyYW5zZm9ybVtrZXldID0ge1xuICAgICAgICAgICAgICAgIGE6IDAsXG4gICAgICAgICAgICAgICAgazogc3RhdGljVmFsdWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGNvbnZlcnRUb0FuaW1hdGFibGVQcm9wZXJ0eSh0cmFuc2Zvcm06IGFueSwga2V5OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0cmFuc2Zvcm1ba2V5XSB8fCB0cmFuc2Zvcm1ba2V5XS5hID09IDApIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybVtrZXldID0ge1xuICAgICAgICAgICAgICAgIGE6IDEsXG4gICAgICAgICAgICAgICAgazogW11cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGFkZEtleWZyYW1lKHRyYW5zZm9ybTogYW55LCBrZXk6IHN0cmluZywgaWR4OiBudW1iZXIgPSAtMSwgdGltZTogbnVtYmVyLCB2YWx1ZTogQXJyYXk8YW55PiwgZWFzaW5nPzogRWFzaW5nRnVuY3Rpb24sIHdyYXA6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgICAgIGNvbnN0IGV4aXN0S2V5ZnJhbWUgPSB0cmFuc2Zvcm1ba2V5XS5rLmZpbHRlcigoeDogYW55KSA9PiB4LnQgPT0gdGltZSkgYXMgYW55W11cbiAgICAgICAgbGV0IHJlYWR5VG9TZXQ7XG4gICAgICAgIGlmIChleGlzdEtleWZyYW1lLmxlbmd0aCkge1xuICAgICAgICAgICAgcmVhZHlUb1NldCA9IGV4aXN0S2V5ZnJhbWVbMF1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlYWR5VG9TZXQgPSB7XG4gICAgICAgICAgICAgICAgdDogdGltZSxcbiAgICAgICAgICAgICAgICBzOiB0aGlzLmdldERlZmF1bHRQcm9wZXJ0eShrZXkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBwcmV2aW91c0tleWZyYW1lQ291bnQgPSB0cmFuc2Zvcm1ba2V5XS5rLnJlZHVjZSgocDogbnVtYmVyLCB4OiBhbnkpID0+IHgudCA8IHRpbWUgPyBwICsgMSA6IHAsIDApXG4gICAgICAgICAgICB0cmFuc2Zvcm1ba2V5XS5rLnNwbGljZShwcmV2aW91c0tleWZyYW1lQ291bnQsIDAsIHJlYWR5VG9TZXQpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVhc2luZykge1xuICAgICAgICAgICAgcmVhZHlUb1NldC5vID0ge1xuICAgICAgICAgICAgICAgIHg6IGVhc2luZ1swXVswXSxcbiAgICAgICAgICAgICAgICB5OiBlYXNpbmdbMF1bMV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlYWR5VG9TZXQuaSA9IHtcbiAgICAgICAgICAgICAgICB4OiBlYXNpbmdbMV1bMF0sXG4gICAgICAgICAgICAgICAgeTogZWFzaW5nWzFdWzFdXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICAgICAgICByZWFkeVRvU2V0LnNbaWR4XSA9IHZhbHVlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWFkeVRvU2V0LnMgPSB3cmFwID8gW3ZhbHVlXSA6IHZhbHVlXG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBmaW5kUHJvcGVydHlDb25maWcoa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuICgodGhpcy5yb290IGFzIFNoYXBlTGF5ZXIpLnNoYXBlcyFbMF0gYXMgR3JvdXBTaGFwZSkuaXQhLmZpbmQoc2hhcGUgPT5cbiAgICAgICAgICAgIHNoYXBlLnR5ID09IGtleVxuICAgICAgICApXG4gICAgfVxuICAgIHByaXZhdGUgZmluZE9ySW5zZXJ0UHJvcGVydHlDb25maWcoa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgZmluZCA9IHRoaXMuZmluZFByb3BlcnR5Q29uZmlnKGtleSlcbiAgICAgICAgaWYgKGZpbmQpIHJldHVybiBmaW5kXG4gICAgICAgIGNvbnN0IGhhc1RyYW5zZm9ybSA9IHRoaXMuZmluZFByb3BlcnR5Q29uZmlnKCd0cicpXG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IHtcbiAgICAgICAgICAgIHR5OiBrZXksXG4gICAgICAgICAgICAuLi50aGlzLmdldERlZmF1bHRQcm9wZXJ0eShrZXkpIGFzIG9iamVjdFxuICAgICAgICB9XG4gICAgICAgIGlmIChoYXNUcmFuc2Zvcm0pIHtcbiAgICAgICAgICAgIGNvbnN0IGdyb3VwU2hhcGVzID0gKCh0aGlzLnJvb3QgYXMgU2hhcGVMYXllcikuc2hhcGVzIVswXSBhcyBHcm91cFNoYXBlKS5pdCFcbiAgICAgICAgICAgIGdyb3VwU2hhcGVzLnNwbGljZShncm91cFNoYXBlcy5sZW5ndGggLSAxLCAwLCBjb25maWcpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAoKHRoaXMucm9vdCBhcyBTaGFwZUxheWVyKS5zaGFwZXMhWzBdIGFzIEdyb3VwU2hhcGUpLml0IS5wdXNoKGNvbmZpZylcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29uZmlnXG4gICAgfVxuICAgIHByaXZhdGUgY29tbW9uUHJvcGVydHlNYXBwaW5nKGtleTogU2V0YWJsZUtleXMpOiBbYW55LCBzdHJpbmcgfCB1bmRlZmluZWQsIG51bWJlciB8IHVuZGVmaW5lZF0ge1xuICAgICAgICBsZXQgYmFzZTogYW55LCBrOiBzdHJpbmcgfCB1bmRlZmluZWQsIGluZGV4OiBudW1iZXIgfCB1bmRlZmluZWRcbiAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgIGNhc2UgJ3NjYWxlWCc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMucm9vdC5rc1xuICAgICAgICAgICAgICAgIGsgPSAncydcbiAgICAgICAgICAgICAgICBpbmRleCA9IDBcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnc2NhbGVZJzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXG4gICAgICAgICAgICAgICAgayA9ICdzJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdhbmNob3JYJzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXG4gICAgICAgICAgICAgICAgayA9ICdhJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gMFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdhbmNob3JZJzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXG4gICAgICAgICAgICAgICAgayA9ICdhJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICd4JzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXG4gICAgICAgICAgICAgICAgayA9ICdwJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gMFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICd5JzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXG4gICAgICAgICAgICAgICAgayA9ICdwJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdyb3RhdGUnOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLnJvb3Qua3NcbiAgICAgICAgICAgICAgICBrID0gJ3InXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdvcGFjaXR5JzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXG4gICAgICAgICAgICAgICAgayA9ICdvJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAndHJpbVN0YXJ0JzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kT3JJbnNlcnRQcm9wZXJ0eUNvbmZpZygndG0nKVxuICAgICAgICAgICAgICAgIGsgPSAncydcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3RyaW1FbmQnOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLmZpbmRPckluc2VydFByb3BlcnR5Q29uZmlnKCd0bScpXG4gICAgICAgICAgICAgICAgayA9ICdlJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAndHJpbU9mZnNldCc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZE9ySW5zZXJ0UHJvcGVydHlDb25maWcoJ3RtJylcbiAgICAgICAgICAgICAgICBrID0gJ28nXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdmaWxsQ29sb3InOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLmZpbmRQcm9wZXJ0eUNvbmZpZygnZmwnKVxuICAgICAgICAgICAgICAgIGsgPSAnYydcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3N0cm9rZUNvbG9yJzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kUHJvcGVydHlDb25maWcoJ3N0JylcbiAgICAgICAgICAgICAgICBrID0gJ2MnXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdzdHJva2VXaWR0aCc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZFByb3BlcnR5Q29uZmlnKCdzdCcpXG4gICAgICAgICAgICAgICAgayA9ICd3J1xuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnc2hhcGUnOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLmZpbmRQcm9wZXJ0eUNvbmZpZygnc2gnKVxuICAgICAgICAgICAgICAgIGsgPSAna3MnXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdmaWxsT3BhY2l0eSc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZFByb3BlcnR5Q29uZmlnKCdmbCcpXG4gICAgICAgICAgICAgICAgayA9ICdvJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnc3Ryb2tlT3BhY2l0eSc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZFByb3BlcnR5Q29uZmlnKCdzdCcpXG4gICAgICAgICAgICAgICAgayA9ICdvJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnbGluZUNhcCc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZFByb3BlcnR5Q29uZmlnKCdzdCcpXG4gICAgICAgICAgICAgICAgayA9ICdsYydcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ2xpbmVKb2luJzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kUHJvcGVydHlDb25maWcoJ3N0JylcbiAgICAgICAgICAgICAgICBrID0gJ2xqJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbYmFzZSwgaywgaW5kZXhdXG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocmVmOiBTaGFwZUxheWVyIHwgVGV4dExheWVyIHwgSW1hZ2VMYXllciB8IFByZUNvbXBMYXllcikge1xuICAgICAgICB0aGlzLnJvb3QgPSByZWZcbiAgICB9XG5cbiAgICBzZXRTdGF0aWNQcm9wZXJ0eShrZXk6IFNldGFibGVLZXlzLCB2YWx1ZTogYW55KSB7XG4gICAgICAgIHRoaXMucm9vdC5vcCA9IDFcbiAgICAgICAgbGV0IGJhc2U6IGFueSwgazogc3RyaW5nIHwgdW5kZWZpbmVkLCBpbmRleDogbnVtYmVyIHwgdW5kZWZpbmVkXG4gICAgICAgIFtiYXNlLCBrLCBpbmRleF0gPSB0aGlzLmNvbW1vblByb3BlcnR5TWFwcGluZyhrZXkpXG4gICAgICAgIGlmICghayB8fCBpbmRleCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5yb290LnR5ID09IDUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRvYyA9IHRoaXMucm9vdC50IS5kIVxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jLmsgPSBbZG9jLmshWzBdXVxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jLmtbMF0udCA9IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvYy5rWzBdLnMhLnQgPSB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihrZXksIHZhbHVlKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBhIHZhbGlkIGtleS4nKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChrZXkgPT09ICdsaW5lQ2FwJykge1xuICAgICAgICAgICAgdmFsdWUgPSBlbmNvZGVMaW5lQ2FwKHZhbHVlKVxuICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ2xpbmVKb2luJykge1xuICAgICAgICAgICAgdmFsdWUgPSBlbmNvZGVMaW5lSm9pbih2YWx1ZSlcbiAgICAgICAgfVxuICAgICAgICBpZiAoYmFzZSAmJiBrICYmIGluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY29udmVydFRvU3RhdGljUHJvcGVydHkoYmFzZSwgaylcbiAgICAgICAgICAgIGlmIChpbmRleCA+PSAwKVxuICAgICAgICAgICAgICAgIGJhc2Vba10ua1tpbmRleF0gPSB2YWx1ZVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGJhc2Vba10uayA9IHZhbHVlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRBbmltYXRhYmxlUHJvcGVydHkoa2V5OiBTZXRhYmxlS2V5cywgc3RhcnRGcmFtZTogbnVtYmVyLCBlbmRGcmFtZTogbnVtYmVyLCBzdGFydFZhbHVlOiBhbnksIGVuZFZhbHVlOiBhbnksIGVhc2luZz86IEVhc2luZ0Z1bmN0aW9uKSB7XG4gICAgICAgIGlmIChlbmRGcmFtZSA8PSBzdGFydEZyYW1lKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0VuZCBmcmFtZSBzaG91bGQgYmUgbGFyZ2VyIHRoYW4gc3RhcnQgZnJhbWUuJylcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJvb3Qub3AgPSBlbmRGcmFtZSArIDFcbiAgICAgICAgaWYgKCFlYXNpbmcpIHtcbiAgICAgICAgICAgIGVhc2luZyA9IEVhc2luZ0ZhY3RvcnkubGluZWFyKClcbiAgICAgICAgfVxuICAgICAgICBsZXQgYmFzZTogYW55LCBrOiBzdHJpbmcgfCB1bmRlZmluZWQsIGluZGV4OiBudW1iZXIgfCB1bmRlZmluZWQsIHdyYXAgPSB0cnVlO1xuICAgICAgICBbYmFzZSwgaywgaW5kZXhdID0gdGhpcy5jb21tb25Qcm9wZXJ0eU1hcHBpbmcoa2V5KVxuICAgICAgICBpZiAoIWsgfHwgaW5kZXggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICd0ZXh0JzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucm9vdC50eSA9PSA1KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LnRcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0ZXh0UHJvcCA9IGJhc2UuZC5rWzBdLnNcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0bXBTdGFydFZhbHVlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0ZXh0UHJvcCkpXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdG1wRW5kVmFsdWUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRleHRQcm9wKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRtcFN0YXJ0VmFsdWUudCA9IHN0YXJ0VmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIHRtcEVuZFZhbHVlLnQgPSBlbmRWYWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZSA9IHRtcFN0YXJ0VmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlID0gdG1wRW5kVmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGsgPSAnZCdcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcbiAgICAgICAgICAgICAgICAgICAgICAgIHdyYXAgPSBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihrZXksIHN0YXJ0RnJhbWUsIGVuZEZyYW1lLCBzdGFydFZhbHVlLCBlbmRWYWx1ZSwgZWFzaW5nKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBhIHZhbGlkIGtleS4nKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChrZXkgPT09ICdsaW5lQ2FwJykge1xuICAgICAgICAgICAgc3RhcnRWYWx1ZSA9IGVuY29kZUxpbmVDYXAoc3RhcnRWYWx1ZSlcbiAgICAgICAgICAgIGVuZFZhbHVlID0gZW5jb2RlTGluZUNhcChlbmRWYWx1ZSlcbiAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09ICdsaW5lSm9pbicpIHtcbiAgICAgICAgICAgIHN0YXJ0VmFsdWUgPSBlbmNvZGVMaW5lSm9pbihzdGFydFZhbHVlKVxuICAgICAgICAgICAgZW5kVmFsdWUgPSBlbmNvZGVMaW5lSm9pbihlbmRWYWx1ZSlcbiAgICAgICAgfVxuICAgICAgICBpZiAoYmFzZSAmJiBrICYmIGluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY29udmVydFRvQW5pbWF0YWJsZVByb3BlcnR5KGJhc2UsIGspXG4gICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKGJhc2UsIGssIGluZGV4LCBzdGFydEZyYW1lLCBzdGFydFZhbHVlLCBlYXNpbmcsIHdyYXApXG4gICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKGJhc2UsIGssIGluZGV4LCBlbmRGcmFtZSwgZW5kVmFsdWUsIHVuZGVmaW5lZCwgd3JhcClcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIExheWVyRmFjdG9yeSB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2VuZXJhdGVUcmFuc2Zvcm0oY29vcmRpbmF0ZTogbnVtYmVyW10pOiBUcmFuc2Zvcm0ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbzoge1xuICAgICAgICAgICAgICAgIGE6IDAsXG4gICAgICAgICAgICAgICAgazogMTAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcjoge1xuICAgICAgICAgICAgICAgIGE6IDAsXG4gICAgICAgICAgICAgICAgazogMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHA6IHtcbiAgICAgICAgICAgICAgICBhOiAwLFxuICAgICAgICAgICAgICAgIGs6IFtcbiAgICAgICAgICAgICAgICAgICAgY29vcmRpbmF0ZVswXSxcbiAgICAgICAgICAgICAgICAgICAgY29vcmRpbmF0ZVsxXSxcbiAgICAgICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhOiB7XG4gICAgICAgICAgICAgICAgYTogMCxcbiAgICAgICAgICAgICAgICBrOiBbXG4gICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgIDBcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgczoge1xuICAgICAgICAgICAgICAgIGE6IDAsXG4gICAgICAgICAgICAgICAgazogW1xuICAgICAgICAgICAgICAgICAgICAxMDAsXG4gICAgICAgICAgICAgICAgICAgIDEwMCxcbiAgICAgICAgICAgICAgICAgICAgMTAwXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGJvdW5kaW5nQm94KGRvbTogU1ZHR3JhcGhpY3NFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IGJvdW5kaW5nQm94ID0gZ2V0Qm91bmRpbmdCb3goZG9tKS5tYXAoKHYsIGkpID0+IGkgPCAyID8gdiAtIDEgOiB2ICsgMSkgYXMgW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl1cbiAgICAgICAgcmV0dXJuIHRoaXMucmVjdCguLi5ib3VuZGluZ0JveClcbiAgICB9XG5cbiAgICBzdGF0aWMgc2hhcGUoZG9tOiBTVkdQYXRoRWxlbWVudCkge1xuICAgICAgICBjb25zdCBjb29yZGluYXRlID0gZ2V0Qm91bmRpbmdCb3goZG9tKVxuICAgICAgICBjb25zdCBsYXllcjogU2hhcGVMYXllciA9IHtcbiAgICAgICAgICAgIHR5OiA0LFxuICAgICAgICAgICAgZGRkOiAwLFxuICAgICAgICAgICAgc3I6IDEsXG4gICAgICAgICAgICBhbzogMCxcbiAgICAgICAgICAgIGtzOiB0aGlzLmdlbmVyYXRlVHJhbnNmb3JtKGNvb3JkaW5hdGUpLFxuICAgICAgICAgICAgaXA6IDAsXG4gICAgICAgICAgICBvcDogMSxcbiAgICAgICAgICAgIHN0OiAwLFxuICAgICAgICAgICAgYm06IDAsXG4gICAgICAgICAgICBzaGFwZXM6IHJlbmRlcihkb20pXG5cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEpTTW92aW5MYXllcihsYXllcilcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVjdChsZWZ0OiBudW1iZXIsIHRvcDogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xuICAgICAgICBjb25zdCBsYXllcjogU2hhcGVMYXllciA9IHtcbiAgICAgICAgICAgIHR5OiA0LFxuICAgICAgICAgICAgZGRkOiAwLFxuICAgICAgICAgICAgc3I6IDEsXG4gICAgICAgICAgICBhbzogMCxcbiAgICAgICAgICAgIGtzOiB0aGlzLmdlbmVyYXRlVHJhbnNmb3JtKFtsZWZ0LCB0b3AsIHdpZHRoLCBoZWlnaHRdKSxcbiAgICAgICAgICAgIGlwOiAwLFxuICAgICAgICAgICAgb3A6IDEsXG4gICAgICAgICAgICBzdDogMCxcbiAgICAgICAgICAgIGJtOiAwLFxuICAgICAgICAgICAgc2hhcGVzOiBbXG4gICAgICAgICAgICAgICAgcmVuZGVyUGxhaW5HbHlwaCgncmVjdCcsIFt3aWR0aCwgaGVpZ2h0XSlcbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEpTTW92aW5MYXllcihsYXllcilcbiAgICB9XG5cbiAgICBzdGF0aWMgZWxsaXBzZShjeDogbnVtYmVyLCBjeTogbnVtYmVyLCByeDogbnVtYmVyLCByeTogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGxheWVyOiBTaGFwZUxheWVyID0ge1xuICAgICAgICAgICAgdHk6IDQsXG4gICAgICAgICAgICBkZGQ6IDAsXG4gICAgICAgICAgICBzcjogMSxcbiAgICAgICAgICAgIGFvOiAwLFxuICAgICAgICAgICAga3M6IHRoaXMuZ2VuZXJhdGVUcmFuc2Zvcm0oW2N4IC0gcngsIGN5IC0gcnksIDIgKiByeCwgMiAqIHJ5XSksXG4gICAgICAgICAgICBpcDogMCxcbiAgICAgICAgICAgIG9wOiAxLFxuICAgICAgICAgICAgc3Q6IDAsXG4gICAgICAgICAgICBibTogMCxcbiAgICAgICAgICAgIHNoYXBlczogW1xuICAgICAgICAgICAgICAgIHJlbmRlclBsYWluR2x5cGgoJ2VsbGlwc2UnLCBbcngsIHJ5XSlcbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEpTTW92aW5MYXllcihsYXllcilcbiAgICB9XG5cbiAgICBzdGF0aWMgaGllcmFyY2h5KGRvbTogU1ZHR3JhcGhpY3NFbGVtZW50LCBhc3NldExpc3Q6IEFzc2V0cywgZm9udExpc3Q6IEZvbnRzKSB7XG4gICAgICAgIGNvbnN0IGNvb3JkaW5hdGUgPSBnZXRCb3VuZGluZ0JveChkb20pXG4gICAgICAgIGxldCBkb21UeXBlOiAyIHwgNCB8IDUgfCAwO1xuICAgICAgICBpZiAoZG9tIGluc3RhbmNlb2YgU1ZHVGV4dEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGRvbVR5cGUgPSA1XG4gICAgICAgIH0gZWxzZSBpZiAoZG9tIGluc3RhbmNlb2YgU1ZHSW1hZ2VFbGVtZW50KSB7XG4gICAgICAgICAgICBkb21UeXBlID0gMlxuICAgICAgICB9IGVsc2UgaWYgKGRvbSBpbnN0YW5jZW9mIFNWR0dFbGVtZW50KSB7XG4gICAgICAgICAgICBkb21UeXBlID0gMFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG9tVHlwZSA9IDRcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsYXllcjogU2hhcGVMYXllciB8IEltYWdlTGF5ZXIgfCBUZXh0TGF5ZXIgfCBQcmVDb21wTGF5ZXIgPSB7XG4gICAgICAgICAgICB0eTogZG9tVHlwZSxcbiAgICAgICAgICAgIGRkZDogMCxcbiAgICAgICAgICAgIHNyOiAxLFxuICAgICAgICAgICAgYW86IDAsXG4gICAgICAgICAgICBrczogdGhpcy5nZW5lcmF0ZVRyYW5zZm9ybShkb21UeXBlID09IDAgPyBbMCwgMCwgMCwgMF0gOiBjb29yZGluYXRlKSxcbiAgICAgICAgICAgIGlwOiAwLFxuICAgICAgICAgICAgb3A6IDEsXG4gICAgICAgICAgICBzdDogMCxcbiAgICAgICAgICAgIGJtOiAwXG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoIChkb21UeXBlKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgY29uc3QgcHJlY29tcExheWVyID0gbGF5ZXIgYXMgUHJlQ29tcExheWVyXG4gICAgICAgICAgICAgICAgY29uc3QgZG9tTGVhdmVzID0gZ2V0TGVhZk5vZGVzKGRvbSlcbiAgICAgICAgICAgICAgICBjb25zdCBwcmVDb21wQXNzZXQ6IEpTTW92aW5MYXllcltdID0gW11cbiAgICAgICAgICAgICAgICBjb25zdCBwcmVDb21wUmVmSWQgPSB1dWlkKClcbiAgICAgICAgICAgICAgICBkb21MZWF2ZXMuZm9yRWFjaChkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGQgaW5zdGFuY2VvZiBTVkdHcmFwaGljc0VsZW1lbnQgJiYgIShkIGluc3RhbmNlb2YgU1ZHR0VsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVDb21wQXNzZXQudW5zaGlmdCh0aGlzLmhpZXJhcmNoeShkLCBhc3NldExpc3QsIGZvbnRMaXN0KSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgcHJlQ29tcEFzc2V0LmZvckVhY2gobGF5ZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsYXllci5yb290Lm9wID0gOWU5XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBwcmVjb21wTGF5ZXIudyA9IGNvb3JkaW5hdGVbMF0gKyBjb29yZGluYXRlWzJdICsgMVxuICAgICAgICAgICAgICAgIHByZWNvbXBMYXllci5oID0gY29vcmRpbmF0ZVsxXSArIGNvb3JkaW5hdGVbM10gKyAxXG4gICAgICAgICAgICAgICAgcHJlY29tcExheWVyLnJlZklkID0gcHJlQ29tcFJlZklkXG4gICAgICAgICAgICAgICAgYXNzZXRMaXN0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBpZDogcHJlQ29tcFJlZklkLFxuICAgICAgICAgICAgICAgICAgICBsYXllcnM6IHByZUNvbXBBc3NldC5tYXAobGF5ZXIgPT4gbGF5ZXIucm9vdClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgY29uc3QgaW1hZ2VMYXllciA9IGxheWVyIGFzIEltYWdlTGF5ZXJcbiAgICAgICAgICAgICAgICBjb25zdCBbaW1hZ2VSZWZJZCwgaW1hZ2VBc3NldF0gPSByZW5kZXJJbWFnZShkb20gYXMgU1ZHSW1hZ2VFbGVtZW50LCBhc3NldExpc3QpXG4gICAgICAgICAgICAgICAgaW1hZ2VMYXllci5yZWZJZCA9IGltYWdlUmVmSWRcbiAgICAgICAgICAgICAgICBpZiAoIWFzc2V0TGlzdC5maWx0ZXIoYSA9PiBhLmlkID09IGltYWdlUmVmSWQpLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgYXNzZXRMaXN0LnB1c2goaW1hZ2VBc3NldClcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIGNvbnN0IHNoYXBlTGF5ZXIgPSBsYXllciBhcyBTaGFwZUxheWVyXG4gICAgICAgICAgICAgICAgc2hhcGVMYXllci5zaGFwZXMgPSByZW5kZXIoZG9tKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dExheWVyID0gbGF5ZXIgYXMgVGV4dExheWVyXG5cbiAgICAgICAgICAgICAgICAvLyBtb3ZlIHRleHRMYXllcidzIGFuY2hvciB0byBsZWZ0LXRvcFxuICAgICAgICAgICAgICAgIGNvbnN0IGJhc2VMaW5lSGVpZ2h0ID0gZ2V0QmFzZWxpbmVIZWlnaHQoZG9tIGFzIFNWR1RleHRFbGVtZW50KVxuICAgICAgICAgICAgICAgIHRleHRMYXllci5rcyEuYSEuayA9IFswLCBiYXNlTGluZUhlaWdodCAtIGNvb3JkaW5hdGVbM10sIDBdXG5cbiAgICAgICAgICAgICAgICBjb25zdCBbdGV4dERhdGEsIGZvbnRdID0gcmVuZGVyVGV4dChkb20gYXMgU1ZHVGV4dEVsZW1lbnQsIGZvbnRMaXN0KVxuICAgICAgICAgICAgICAgIHRleHRMYXllci50ID0gdGV4dERhdGFcbiAgICAgICAgICAgICAgICBpZiAoIWZvbnRMaXN0Lmxpc3QhLmZpbHRlcihmID0+IGYuZk5hbWUgPT0gZm9udC5mTmFtZSkubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICBmb250TGlzdC5saXN0IS5wdXNoKGZvbnQpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtb3ZpbkxheWVyID0gbmV3IEpTTW92aW5MYXllcihsYXllcilcbiAgICAgICAgcmV0dXJuIG1vdmluTGF5ZXJcbiAgICB9XG59Il19