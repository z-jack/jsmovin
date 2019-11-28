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
  }]);

  return LayerFactory;
}();

exports.LayerFactory = LayerFactory;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sYXllci50cyJdLCJuYW1lcyI6WyJKU01vdmluTGF5ZXIiLCJrZXkiLCJzIiwiayIsImUiLCJvIiwidHJhbnNmb3JtIiwiYSIsImdldERlZmF1bHRQcm9wZXJ0eSIsInN0YXRpY1ZhbHVlIiwiaWR4IiwidGltZSIsInZhbHVlIiwiZWFzaW5nIiwiZXhpc3RLZXlmcmFtZSIsImZpbHRlciIsIngiLCJ0IiwicmVhZHlUb1NldCIsImxlbmd0aCIsInByZXZpb3VzS2V5ZnJhbWVDb3VudCIsInJlZHVjZSIsInAiLCJzcGxpY2UiLCJ5IiwiaSIsInJvb3QiLCJzaGFwZXMiLCJpdCIsImZpbmQiLCJzaGFwZSIsInR5IiwiZmluZFByb3BlcnR5Q29uZmlnIiwiaGFzVHJhbnNmb3JtIiwiZ3JvdXBTaGFwZXMiLCJwdXNoIiwiYmFzZSIsImluZGV4Iiwia3MiLCJmaW5kT3JJbnNlcnRQcm9wZXJ0eUNvbmZpZyIsInJlZiIsIm9wIiwiY29tbW9uUHJvcGVydHlNYXBwaW5nIiwidW5kZWZpbmVkIiwiZG9jIiwiZCIsImNvbnNvbGUiLCJlcnJvciIsIkVycm9yIiwiY29udmVydFRvU3RhdGljUHJvcGVydHkiLCJzdGFydEZyYW1lIiwiZW5kRnJhbWUiLCJzdGFydFZhbHVlIiwiZW5kVmFsdWUiLCJFYXNpbmdGYWN0b3J5IiwibGluZWFyIiwidGV4dFByb3AiLCJ0bXBTdGFydFZhbHVlIiwiSlNPTiIsInBhcnNlIiwic3RyaW5naWZ5IiwidG1wRW5kVmFsdWUiLCJjb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkiLCJhZGRLZXlmcmFtZSIsIkxheWVyRmFjdG9yeSIsImNvb3JkaW5hdGUiLCJyIiwiZG9tIiwiYm91bmRpbmdCb3giLCJtYXAiLCJ2IiwicmVjdCIsImxheWVyIiwiZGRkIiwic3IiLCJhbyIsImdlbmVyYXRlVHJhbnNmb3JtIiwiaXAiLCJzdCIsImJtIiwibGVmdCIsInRvcCIsIndpZHRoIiwiaGVpZ2h0IiwiY3giLCJjeSIsInJ4IiwicnkiLCJhc3NldExpc3QiLCJmb250TGlzdCIsImRvbVR5cGUiLCJTVkdUZXh0RWxlbWVudCIsIlNWR0ltYWdlRWxlbWVudCIsIlNWR0dFbGVtZW50IiwicHJlY29tcExheWVyIiwiZG9tTGVhdmVzIiwicHJlQ29tcEFzc2V0IiwicHJlQ29tcFJlZklkIiwiZm9yRWFjaCIsIlNWR0dyYXBoaWNzRWxlbWVudCIsInVuc2hpZnQiLCJoaWVyYXJjaHkiLCJ3IiwiaCIsInJlZklkIiwiaWQiLCJsYXllcnMiLCJpbWFnZUxheWVyIiwiaW1hZ2VSZWZJZCIsImltYWdlQXNzZXQiLCJzaGFwZUxheWVyIiwidGV4dExheWVyIiwidGV4dERhdGEiLCJmb250IiwibGlzdCIsImYiLCJmTmFtZSIsIm1vdmluTGF5ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFJYUEsWTs7Ozs7dUNBRWtCQyxHLEVBQWE7QUFDcEMsY0FBUUEsR0FBUjtBQUNJLGFBQUssR0FBTDtBQUNBLGFBQUssR0FBTDtBQUNJLGlCQUFPLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLENBQVA7O0FBQ0osYUFBSyxHQUFMO0FBQ0ksaUJBQU8sQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEdBQVgsQ0FBUDs7QUFDSixhQUFLLEdBQUw7QUFDSSxpQkFBTyxHQUFQOztBQUNKLGFBQUssR0FBTDtBQUNJLGlCQUFPLENBQVA7O0FBQ0osYUFBSyxJQUFMO0FBQ0ksaUJBQU87QUFDSEMsWUFBQUEsQ0FBQyxFQUFFO0FBQ0NDLGNBQUFBLENBQUMsRUFBRSxDQUFDLENBQUQ7QUFESixhQURBO0FBSUhDLFlBQUFBLENBQUMsRUFBRTtBQUNDRCxjQUFBQSxDQUFDLEVBQUUsQ0FBQyxHQUFEO0FBREosYUFKQTtBQU9IRSxZQUFBQSxDQUFDLEVBQUU7QUFDQ0YsY0FBQUEsQ0FBQyxFQUFFLENBQUMsQ0FBRDtBQURKO0FBUEEsV0FBUDs7QUFXSjtBQUNJLGlCQUFPLENBQVA7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QUNrRyxFQUFGLElBQVFHLFVBQVo7QUFBQSxXQUFsQixFQUEwQ3pGLE1BQS9DLEVBQ0lxRSxTQUFTLENBQUNyRCxJQUFWLENBQWUwRSxVQUFmO0FBQ0o7O0FBQ0osYUFBSyxDQUFMO0FBQ0ksY0FBTUMsVUFBVSxHQUFHdEMsS0FBbkI7QUFDQXNDLFVBQUFBLFVBQVUsQ0FBQ25GLE1BQVgsR0FBb0Isb0JBQU93QyxHQUFQLENBQXBCO0FBQ0E7O0FBQ0osYUFBSyxDQUFMO0FBQ0ksY0FBTTRDLFNBQVMsR0FBR3ZDLEtBQWxCLENBREosQ0FHSTs7QUFDQXVDLFVBQUFBLFNBQVMsQ0FBQ3pFLEVBQVYsQ0FBYy9CLENBQWQsQ0FBaUJKLENBQWpCLEdBQXFCLENBQUMsQ0FBRCxFQUFJLENBQUM4RCxVQUFVLENBQUMsQ0FBRCxDQUFmLEVBQW9CLENBQXBCLENBQXJCOztBQUpKLDRCQU02Qix3QkFBV0UsR0FBWCxFQUFrQ3NCLFFBQWxDLENBTjdCO0FBQUE7QUFBQSxjQU1XdUIsUUFOWDtBQUFBLGNBTXFCQyxJQU5yQjs7QUFPSUYsVUFBQUEsU0FBUyxDQUFDOUYsQ0FBVixHQUFjK0YsUUFBZDtBQUNBLGNBQUksQ0FBQ3ZCLFFBQVEsQ0FBQ3lCLElBQVQsQ0FBZW5HLE1BQWYsQ0FBc0IsVUFBQW9HLENBQUM7QUFBQSxtQkFBSUEsQ0FBQyxDQUFDQyxLQUFGLElBQVdILElBQUksQ0FBQ0csS0FBcEI7QUFBQSxXQUF2QixFQUFrRGpHLE1BQXZELEVBQ0lzRSxRQUFRLENBQUN5QixJQUFULENBQWUvRSxJQUFmLENBQW9COEUsSUFBcEI7QUFDSjtBQTNDUjs7QUE2Q0EsVUFBTUksVUFBVSxHQUFHLElBQUlySCxZQUFKLENBQWlCd0UsS0FBakIsQ0FBbkI7QUFDQSxhQUFPNkMsVUFBUDtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2hhcGVMYXllciwgVGV4dExheWVyLCBJbWFnZUxheWVyLCBUcmFuc2Zvcm0sIEFzc2V0cywgRm9udHMsIEdyb3VwU2hhcGUsIFByZUNvbXBMYXllciB9IGZyb20gJy4vYW5pbWF0aW9uJ1xuaW1wb3J0IHsgRWFzaW5nRnVuY3Rpb24sIEVhc2luZ0ZhY3RvcnkgfSBmcm9tICcuL2Vhc2luZydcbmltcG9ydCB7IHJlbmRlclRleHQsIHJlbmRlciwgcmVuZGVySW1hZ2UsIHJlbmRlclBsYWluR2x5cGggfSBmcm9tICcuL3JlbmRlcic7XG5pbXBvcnQgeyBnZXRCb3VuZGluZ0JveCwgZ2V0TGVhZk5vZGVzIH0gZnJvbSAnLi9oZWxwZXInXG5pbXBvcnQgdXVpZCBmcm9tICd1dWlkL3Y0JztcblxudHlwZSBTZXRhYmxlS2V5cyA9IFwic2NhbGVYXCIgfCBcInNjYWxlWVwiIHwgXCJhbmNob3JYXCIgfCBcImFuY2hvcllcIiB8IFwieFwiIHwgXCJ5XCIgfCBcInJvdGF0ZVwiIHwgXCJvcGFjaXR5XCIgfCAnc2hhcGUnIHwgJ2ZpbGxDb2xvcicgfCAndHJpbVN0YXJ0JyB8ICd0cmltRW5kJyB8ICd0cmltT2Zmc2V0JyB8ICdzdHJva2VDb2xvcicgfCAnc3Ryb2tlV2lkdGgnIHwgJ3RleHQnXG5cbmV4cG9ydCBjbGFzcyBKU01vdmluTGF5ZXIge1xuICAgIHB1YmxpYyByZWFkb25seSByb290OiBTaGFwZUxheWVyIHwgVGV4dExheWVyIHwgSW1hZ2VMYXllciB8IFByZUNvbXBMYXllcjtcbiAgICBwcml2YXRlIGdldERlZmF1bHRQcm9wZXJ0eShrZXk6IHN0cmluZykge1xuICAgICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICAgICAgY2FzZSAnYSc6XG4gICAgICAgICAgICBjYXNlICdwJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gWzAsIDAsIDBdXG4gICAgICAgICAgICBjYXNlICdzJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gWzEwMCwgMTAwLCAxMDBdXG4gICAgICAgICAgICBjYXNlICdvJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gMTAwXG4gICAgICAgICAgICBjYXNlICdyJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gMFxuICAgICAgICAgICAgY2FzZSAndG0nOlxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGs6IFswXVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrOiBbMTAwXVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBvOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrOiBbMF1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIDBcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGNvbnZlcnRUb1N0YXRpY1Byb3BlcnR5KHRyYW5zZm9ybTogYW55LCBrZXk6IHN0cmluZykge1xuICAgICAgICBpZiAoIXRyYW5zZm9ybVtrZXldKSB7XG4gICAgICAgICAgICB0cmFuc2Zvcm1ba2V5XSA9IHtcbiAgICAgICAgICAgICAgICBhOiAwLFxuICAgICAgICAgICAgICAgIGs6IHRoaXMuZ2V0RGVmYXVsdFByb3BlcnR5KGtleSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodHJhbnNmb3JtW2tleV0uYSA9PSAxKSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0aWNWYWx1ZSA9IHRyYW5zZm9ybVtrZXldLmtbMF0uc1xuICAgICAgICAgICAgdHJhbnNmb3JtW2tleV0gPSB7XG4gICAgICAgICAgICAgICAgYTogMCxcbiAgICAgICAgICAgICAgICBrOiBzdGF0aWNWYWx1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgY29udmVydFRvQW5pbWF0YWJsZVByb3BlcnR5KHRyYW5zZm9ybTogYW55LCBrZXk6IHN0cmluZykge1xuICAgICAgICBpZiAoIXRyYW5zZm9ybVtrZXldIHx8IHRyYW5zZm9ybVtrZXldLmEgPT0gMCkge1xuICAgICAgICAgICAgdHJhbnNmb3JtW2tleV0gPSB7XG4gICAgICAgICAgICAgICAgYTogMSxcbiAgICAgICAgICAgICAgICBrOiBbXVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgYWRkS2V5ZnJhbWUodHJhbnNmb3JtOiBhbnksIGtleTogc3RyaW5nLCBpZHg6IG51bWJlciA9IC0xLCB0aW1lOiBudW1iZXIsIHZhbHVlOiBBcnJheTxhbnk+LCBlYXNpbmc/OiBFYXNpbmdGdW5jdGlvbikge1xuICAgICAgICBjb25zdCBleGlzdEtleWZyYW1lID0gdHJhbnNmb3JtW2tleV0uay5maWx0ZXIoKHg6IGFueSkgPT4geC50ID09IHRpbWUpIGFzIGFueVtdXG4gICAgICAgIGxldCByZWFkeVRvU2V0O1xuICAgICAgICBpZiAoZXhpc3RLZXlmcmFtZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJlYWR5VG9TZXQgPSBleGlzdEtleWZyYW1lWzBdXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWFkeVRvU2V0ID0ge1xuICAgICAgICAgICAgICAgIHQ6IHRpbWUsXG4gICAgICAgICAgICAgICAgczogdGhpcy5nZXREZWZhdWx0UHJvcGVydHkoa2V5KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcHJldmlvdXNLZXlmcmFtZUNvdW50ID0gdHJhbnNmb3JtW2tleV0uay5yZWR1Y2UoKHA6IG51bWJlciwgeDogYW55KSA9PiB4LnQgPCB0aW1lID8gcCArIDEgOiBwLCAwKVxuICAgICAgICAgICAgdHJhbnNmb3JtW2tleV0uay5zcGxpY2UocHJldmlvdXNLZXlmcmFtZUNvdW50LCAwLCByZWFkeVRvU2V0KVxuICAgICAgICB9XG4gICAgICAgIGlmIChlYXNpbmcpIHtcbiAgICAgICAgICAgIHJlYWR5VG9TZXQubyA9IHtcbiAgICAgICAgICAgICAgICB4OiBlYXNpbmdbMF1bMF0sXG4gICAgICAgICAgICAgICAgeTogZWFzaW5nWzBdWzFdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZWFkeVRvU2V0LmkgPSB7XG4gICAgICAgICAgICAgICAgeDogZWFzaW5nWzFdWzBdLFxuICAgICAgICAgICAgICAgIHk6IGVhc2luZ1sxXVsxXVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgICAgICAgcmVhZHlUb1NldC5zW2lkeF0gPSB2YWx1ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVhZHlUb1NldC5zID0gW3ZhbHVlXVxuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgZmluZFByb3BlcnR5Q29uZmlnKGtleTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiAoKHRoaXMucm9vdCBhcyBTaGFwZUxheWVyKS5zaGFwZXMhWzBdIGFzIEdyb3VwU2hhcGUpLml0IS5maW5kKHNoYXBlID0+XG4gICAgICAgICAgICBzaGFwZS50eSA9PSBrZXlcbiAgICAgICAgKVxuICAgIH1cbiAgICBwcml2YXRlIGZpbmRPckluc2VydFByb3BlcnR5Q29uZmlnKGtleTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGZpbmQgPSB0aGlzLmZpbmRQcm9wZXJ0eUNvbmZpZyhrZXkpXG4gICAgICAgIGlmIChmaW5kKSByZXR1cm4gZmluZFxuICAgICAgICBjb25zdCBoYXNUcmFuc2Zvcm0gPSB0aGlzLmZpbmRQcm9wZXJ0eUNvbmZpZygndHInKVxuICAgICAgICBpZiAoaGFzVHJhbnNmb3JtKSB7XG4gICAgICAgICAgICBjb25zdCBncm91cFNoYXBlcyA9ICgodGhpcy5yb290IGFzIFNoYXBlTGF5ZXIpLnNoYXBlcyFbMF0gYXMgR3JvdXBTaGFwZSkuaXQhXG4gICAgICAgICAgICBncm91cFNoYXBlcy5zcGxpY2UoZ3JvdXBTaGFwZXMubGVuZ3RoIC0gMSwgMCwge1xuICAgICAgICAgICAgICAgIHR5OiBrZXksXG4gICAgICAgICAgICAgICAgLi4udGhpcy5nZXREZWZhdWx0UHJvcGVydHkoa2V5KSBhcyBvYmplY3RcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAoKHRoaXMucm9vdCBhcyBTaGFwZUxheWVyKS5zaGFwZXMhWzBdIGFzIEdyb3VwU2hhcGUpLml0IS5wdXNoKHtcbiAgICAgICAgICAgICAgICB0eToga2V5LFxuICAgICAgICAgICAgICAgIC4uLnRoaXMuZ2V0RGVmYXVsdFByb3BlcnR5KGtleSkgYXMgb2JqZWN0XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgY29tbW9uUHJvcGVydHlNYXBwaW5nKGtleTogU2V0YWJsZUtleXMpOiBbYW55LCBzdHJpbmcgfCB1bmRlZmluZWQsIG51bWJlciB8IHVuZGVmaW5lZF0ge1xuICAgICAgICBsZXQgYmFzZTogYW55LCBrOiBzdHJpbmcgfCB1bmRlZmluZWQsIGluZGV4OiBudW1iZXIgfCB1bmRlZmluZWRcbiAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgIGNhc2UgJ3NjYWxlWCc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMucm9vdC5rc1xuICAgICAgICAgICAgICAgIGsgPSAncydcbiAgICAgICAgICAgICAgICBpbmRleCA9IDBcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnc2NhbGVZJzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXG4gICAgICAgICAgICAgICAgayA9ICdzJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdhbmNob3JYJzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXG4gICAgICAgICAgICAgICAgayA9ICdhJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gMFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdhbmNob3JZJzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXG4gICAgICAgICAgICAgICAgayA9ICdhJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICd4JzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXG4gICAgICAgICAgICAgICAgayA9ICdwJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gMFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICd5JzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXG4gICAgICAgICAgICAgICAgayA9ICdwJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdyb3RhdGUnOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLnJvb3Qua3NcbiAgICAgICAgICAgICAgICBrID0gJ3InXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdvcGFjaXR5JzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXG4gICAgICAgICAgICAgICAgayA9ICdvJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAndHJpbVN0YXJ0JzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kT3JJbnNlcnRQcm9wZXJ0eUNvbmZpZygndG0nKVxuICAgICAgICAgICAgICAgIGsgPSAncydcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3RyaW1FbmQnOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLmZpbmRPckluc2VydFByb3BlcnR5Q29uZmlnKCd0bScpXG4gICAgICAgICAgICAgICAgayA9ICdlJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAndHJpbU9mZnNldCc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZE9ySW5zZXJ0UHJvcGVydHlDb25maWcoJ3RtJylcbiAgICAgICAgICAgICAgICBrID0gJ28nXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdmaWxsQ29sb3InOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLmZpbmRQcm9wZXJ0eUNvbmZpZygnZmwnKVxuICAgICAgICAgICAgICAgIGsgPSAnYydcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3N0cm9rZUNvbG9yJzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kUHJvcGVydHlDb25maWcoJ3N0JylcbiAgICAgICAgICAgICAgICBrID0gJ2MnXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdzdHJva2VXaWR0aCc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZFByb3BlcnR5Q29uZmlnKCdzdCcpXG4gICAgICAgICAgICAgICAgayA9ICd3J1xuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnc2hhcGUnOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLmZpbmRQcm9wZXJ0eUNvbmZpZygnc2gnKVxuICAgICAgICAgICAgICAgIGsgPSAna3MnXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtiYXNlLCBrLCBpbmRleF1cbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihyZWY6IFNoYXBlTGF5ZXIgfCBUZXh0TGF5ZXIgfCBJbWFnZUxheWVyIHwgUHJlQ29tcExheWVyKSB7XG4gICAgICAgIHRoaXMucm9vdCA9IHJlZlxuICAgIH1cblxuICAgIHNldFN0YXRpY1Byb3BlcnR5KGtleTogU2V0YWJsZUtleXMsIHZhbHVlOiBhbnkpIHtcbiAgICAgICAgdGhpcy5yb290Lm9wID0gMVxuICAgICAgICBsZXQgYmFzZTogYW55LCBrOiBzdHJpbmcgfCB1bmRlZmluZWQsIGluZGV4OiBudW1iZXIgfCB1bmRlZmluZWRcbiAgICAgICAgW2Jhc2UsIGssIGluZGV4XSA9IHRoaXMuY29tbW9uUHJvcGVydHlNYXBwaW5nKGtleSlcbiAgICAgICAgaWYgKCFrIHx8IGluZGV4ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgICAgICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnJvb3QudHkgPT0gNSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZG9jID0gdGhpcy5yb290LnQhLmQhXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2MuayA9IFtkb2MuayFbMF1dXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2Mua1swXS50ID0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jLmtbMF0ucyEudCA9IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGtleSwgdmFsdWUpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGEgdmFsaWQga2V5LicpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJhc2UgJiYgayAmJiBpbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnZlcnRUb1N0YXRpY1Byb3BlcnR5KGJhc2UsIGspXG4gICAgICAgICAgICBpZiAoaW5kZXggPj0gMClcbiAgICAgICAgICAgICAgICBiYXNlW2tdLmtbaW5kZXhdID0gdmFsdWVcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBiYXNlW2tdLmsgPSB2YWx1ZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0QW5pbWF0YWJsZVByb3BlcnR5KGtleTogU2V0YWJsZUtleXMsIHN0YXJ0RnJhbWU6IG51bWJlciwgZW5kRnJhbWU6IG51bWJlciwgc3RhcnRWYWx1ZTogYW55LCBlbmRWYWx1ZTogYW55LCBlYXNpbmc/OiBFYXNpbmdGdW5jdGlvbikge1xuICAgICAgICBpZiAoZW5kRnJhbWUgPD0gc3RhcnRGcmFtZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFbmQgZnJhbWUgc2hvdWxkIGJlIGxhcmdlciB0aGFuIHN0YXJ0IGZyYW1lLicpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yb290Lm9wID0gZW5kRnJhbWUgKyAxXG4gICAgICAgIGlmICghZWFzaW5nKSB7XG4gICAgICAgICAgICBlYXNpbmcgPSBFYXNpbmdGYWN0b3J5LmxpbmVhcigpXG4gICAgICAgIH1cbiAgICAgICAgbGV0IGJhc2U6IGFueSwgazogc3RyaW5nIHwgdW5kZWZpbmVkLCBpbmRleDogbnVtYmVyIHwgdW5kZWZpbmVkXG4gICAgICAgIFtiYXNlLCBrLCBpbmRleF0gPSB0aGlzLmNvbW1vblByb3BlcnR5TWFwcGluZyhrZXkpXG4gICAgICAgIGlmICghayB8fCBpbmRleCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5yb290LnR5ID09IDUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLnJvb3QudCEuZFxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRleHRQcm9wID0gYmFzZS5rWzBdLnNcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0bXBTdGFydFZhbHVlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0ZXh0UHJvcCkpXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdG1wRW5kVmFsdWUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRleHRQcm9wKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRtcFN0YXJ0VmFsdWUudCA9IHN0YXJ0VmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIHRtcEVuZFZhbHVlLnQgPSBlbmRWYWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZSA9IHRtcFN0YXJ0VmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlID0gdG1wRW5kVmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGsgPSAnaydcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3Ioa2V5LCBzdGFydEZyYW1lLCBlbmRGcmFtZSwgc3RhcnRWYWx1ZSwgZW5kVmFsdWUsIGVhc2luZylcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgYSB2YWxpZCBrZXkuJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoYmFzZSAmJiBrICYmIGluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY29udmVydFRvQW5pbWF0YWJsZVByb3BlcnR5KGJhc2UsIGspXG4gICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKGJhc2UsIGssIGluZGV4LCBzdGFydEZyYW1lLCBzdGFydFZhbHVlLCBlYXNpbmcpXG4gICAgICAgICAgICB0aGlzLmFkZEtleWZyYW1lKGJhc2UsIGssIGluZGV4LCBlbmRGcmFtZSwgZW5kVmFsdWUpXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMYXllckZhY3Rvcnkge1xuICAgIHByaXZhdGUgc3RhdGljIGdlbmVyYXRlVHJhbnNmb3JtKGNvb3JkaW5hdGU6IG51bWJlcltdKTogVHJhbnNmb3JtIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG86IHtcbiAgICAgICAgICAgICAgICBhOiAwLFxuICAgICAgICAgICAgICAgIGs6IDEwMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHI6IHtcbiAgICAgICAgICAgICAgICBhOiAwLFxuICAgICAgICAgICAgICAgIGs6IDBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwOiB7XG4gICAgICAgICAgICAgICAgYTogMCxcbiAgICAgICAgICAgICAgICBrOiBbXG4gICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVbMF0sXG4gICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVbMV0sXG4gICAgICAgICAgICAgICAgICAgIDBcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYToge1xuICAgICAgICAgICAgICAgIGE6IDAsXG4gICAgICAgICAgICAgICAgazogW1xuICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHM6IHtcbiAgICAgICAgICAgICAgICBhOiAwLFxuICAgICAgICAgICAgICAgIGs6IFtcbiAgICAgICAgICAgICAgICAgICAgMTAwLFxuICAgICAgICAgICAgICAgICAgICAxMDAsXG4gICAgICAgICAgICAgICAgICAgIDEwMFxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBib3VuZGluZ0JveChkb206IFNWR0dyYXBoaWNzRWxlbWVudCkge1xuICAgICAgICBjb25zdCBib3VuZGluZ0JveCA9IGdldEJvdW5kaW5nQm94KGRvbSkubWFwKCh2LCBpKSA9PiBpIDwgMiA/IHYgLSAxIDogdiArIDEpIGFzIFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdXG4gICAgICAgIHJldHVybiB0aGlzLnJlY3QoLi4uYm91bmRpbmdCb3gpXG4gICAgfVxuXG4gICAgc3RhdGljIHNoYXBlKGRvbTogU1ZHUGF0aEVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgY29vcmRpbmF0ZSA9IGdldEJvdW5kaW5nQm94KGRvbSlcbiAgICAgICAgY29uc3QgbGF5ZXI6IFNoYXBlTGF5ZXIgPSB7XG4gICAgICAgICAgICB0eTogNCxcbiAgICAgICAgICAgIGRkZDogMCxcbiAgICAgICAgICAgIHNyOiAxLFxuICAgICAgICAgICAgYW86IDAsXG4gICAgICAgICAgICBrczogdGhpcy5nZW5lcmF0ZVRyYW5zZm9ybShjb29yZGluYXRlKSxcbiAgICAgICAgICAgIGlwOiAwLFxuICAgICAgICAgICAgb3A6IDEsXG4gICAgICAgICAgICBzdDogMCxcbiAgICAgICAgICAgIGJtOiAwLFxuICAgICAgICAgICAgc2hhcGVzOiByZW5kZXIoZG9tKVxuXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBKU01vdmluTGF5ZXIobGF5ZXIpXG4gICAgfVxuXG4gICAgc3RhdGljIHJlY3QobGVmdDogbnVtYmVyLCB0b3A6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgbGF5ZXI6IFNoYXBlTGF5ZXIgPSB7XG4gICAgICAgICAgICB0eTogNCxcbiAgICAgICAgICAgIGRkZDogMCxcbiAgICAgICAgICAgIHNyOiAxLFxuICAgICAgICAgICAgYW86IDAsXG4gICAgICAgICAgICBrczogdGhpcy5nZW5lcmF0ZVRyYW5zZm9ybShbbGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0XSksXG4gICAgICAgICAgICBpcDogMCxcbiAgICAgICAgICAgIG9wOiAxLFxuICAgICAgICAgICAgc3Q6IDAsXG4gICAgICAgICAgICBibTogMCxcbiAgICAgICAgICAgIHNoYXBlczogW1xuICAgICAgICAgICAgICAgIHJlbmRlclBsYWluR2x5cGgoJ3JlY3QnLCBbd2lkdGgsIGhlaWdodF0pXG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBKU01vdmluTGF5ZXIobGF5ZXIpXG4gICAgfVxuXG4gICAgc3RhdGljIGVsbGlwc2UoY3g6IG51bWJlciwgY3k6IG51bWJlciwgcng6IG51bWJlciwgcnk6IG51bWJlcikge1xuICAgICAgICBjb25zdCBsYXllcjogU2hhcGVMYXllciA9IHtcbiAgICAgICAgICAgIHR5OiA0LFxuICAgICAgICAgICAgZGRkOiAwLFxuICAgICAgICAgICAgc3I6IDEsXG4gICAgICAgICAgICBhbzogMCxcbiAgICAgICAgICAgIGtzOiB0aGlzLmdlbmVyYXRlVHJhbnNmb3JtKFtjeCAtIHJ4LCBjeSAtIHJ5LCAyICogcngsIDIgKiByeV0pLFxuICAgICAgICAgICAgaXA6IDAsXG4gICAgICAgICAgICBvcDogMSxcbiAgICAgICAgICAgIHN0OiAwLFxuICAgICAgICAgICAgYm06IDAsXG4gICAgICAgICAgICBzaGFwZXM6IFtcbiAgICAgICAgICAgICAgICByZW5kZXJQbGFpbkdseXBoKCdlbGxpcHNlJywgW3J4LCByeV0pXG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBKU01vdmluTGF5ZXIobGF5ZXIpXG4gICAgfVxuXG4gICAgc3RhdGljIGhpZXJhcmNoeShkb206IFNWR0dyYXBoaWNzRWxlbWVudCwgYXNzZXRMaXN0OiBBc3NldHMsIGZvbnRMaXN0OiBGb250cykge1xuICAgICAgICBjb25zdCBjb29yZGluYXRlID0gZ2V0Qm91bmRpbmdCb3goZG9tKVxuICAgICAgICBsZXQgZG9tVHlwZTogMiB8IDQgfCA1IHwgMDtcbiAgICAgICAgaWYgKGRvbSBpbnN0YW5jZW9mIFNWR1RleHRFbGVtZW50KSB7XG4gICAgICAgICAgICBkb21UeXBlID0gNVxuICAgICAgICB9IGVsc2UgaWYgKGRvbSBpbnN0YW5jZW9mIFNWR0ltYWdlRWxlbWVudCkge1xuICAgICAgICAgICAgZG9tVHlwZSA9IDJcbiAgICAgICAgfSBlbHNlIGlmIChkb20gaW5zdGFuY2VvZiBTVkdHRWxlbWVudCkge1xuICAgICAgICAgICAgZG9tVHlwZSA9IDBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRvbVR5cGUgPSA0XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbGF5ZXI6IFNoYXBlTGF5ZXIgfCBJbWFnZUxheWVyIHwgVGV4dExheWVyIHwgUHJlQ29tcExheWVyID0ge1xuICAgICAgICAgICAgdHk6IGRvbVR5cGUsXG4gICAgICAgICAgICBkZGQ6IDAsXG4gICAgICAgICAgICBzcjogMSxcbiAgICAgICAgICAgIGFvOiAwLFxuICAgICAgICAgICAga3M6IHRoaXMuZ2VuZXJhdGVUcmFuc2Zvcm0oZG9tVHlwZSA9PSAwID8gWzAsIDAsIDAsIDBdIDogY29vcmRpbmF0ZSksXG4gICAgICAgICAgICBpcDogMCxcbiAgICAgICAgICAgIG9wOiAxLFxuICAgICAgICAgICAgc3Q6IDAsXG4gICAgICAgICAgICBibTogMFxuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAoZG9tVHlwZSkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIGNvbnN0IHByZWNvbXBMYXllciA9IGxheWVyIGFzIFByZUNvbXBMYXllclxuICAgICAgICAgICAgICAgIGNvbnN0IGRvbUxlYXZlcyA9IGdldExlYWZOb2Rlcyhkb20pXG4gICAgICAgICAgICAgICAgY29uc3QgcHJlQ29tcEFzc2V0OiBKU01vdmluTGF5ZXJbXSA9IFtdXG4gICAgICAgICAgICAgICAgY29uc3QgcHJlQ29tcFJlZklkID0gdXVpZCgpXG4gICAgICAgICAgICAgICAgZG9tTGVhdmVzLmZvckVhY2goZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkIGluc3RhbmNlb2YgU1ZHR3JhcGhpY3NFbGVtZW50ICYmICEoZCBpbnN0YW5jZW9mIFNWR0dFbGVtZW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlQ29tcEFzc2V0LnVuc2hpZnQodGhpcy5oaWVyYXJjaHkoZCwgYXNzZXRMaXN0LCBmb250TGlzdCkpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIHByZUNvbXBBc3NldC5mb3JFYWNoKGxheWVyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGF5ZXIucm9vdC5vcCA9IDllOVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgcHJlY29tcExheWVyLncgPSBjb29yZGluYXRlWzBdICsgY29vcmRpbmF0ZVsyXSArIDFcbiAgICAgICAgICAgICAgICBwcmVjb21wTGF5ZXIuaCA9IGNvb3JkaW5hdGVbMV0gKyBjb29yZGluYXRlWzNdICsgMVxuICAgICAgICAgICAgICAgIHByZWNvbXBMYXllci5yZWZJZCA9IHByZUNvbXBSZWZJZFxuICAgICAgICAgICAgICAgIGFzc2V0TGlzdC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHByZUNvbXBSZWZJZCxcbiAgICAgICAgICAgICAgICAgICAgbGF5ZXJzOiBwcmVDb21wQXNzZXQubWFwKGxheWVyID0+IGxheWVyLnJvb3QpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGNvbnN0IGltYWdlTGF5ZXIgPSBsYXllciBhcyBJbWFnZUxheWVyXG4gICAgICAgICAgICAgICAgY29uc3QgW2ltYWdlUmVmSWQsIGltYWdlQXNzZXRdID0gcmVuZGVySW1hZ2UoZG9tIGFzIFNWR0ltYWdlRWxlbWVudCwgYXNzZXRMaXN0KVxuICAgICAgICAgICAgICAgIGltYWdlTGF5ZXIucmVmSWQgPSBpbWFnZVJlZklkXG4gICAgICAgICAgICAgICAgaWYgKCFhc3NldExpc3QuZmlsdGVyKGEgPT4gYS5pZCA9PSBpbWFnZVJlZklkKS5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgIGFzc2V0TGlzdC5wdXNoKGltYWdlQXNzZXQpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICBjb25zdCBzaGFwZUxheWVyID0gbGF5ZXIgYXMgU2hhcGVMYXllclxuICAgICAgICAgICAgICAgIHNoYXBlTGF5ZXIuc2hhcGVzID0gcmVuZGVyKGRvbSlcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgIGNvbnN0IHRleHRMYXllciA9IGxheWVyIGFzIFRleHRMYXllclxuXG4gICAgICAgICAgICAgICAgLy8gbW92ZSB0ZXh0TGF5ZXIncyBhbmNob3IgdG8gbGVmdC10b3BcbiAgICAgICAgICAgICAgICB0ZXh0TGF5ZXIua3MhLmEhLmsgPSBbMCwgLWNvb3JkaW5hdGVbM10sIDBdXG5cbiAgICAgICAgICAgICAgICBjb25zdCBbdGV4dERhdGEsIGZvbnRdID0gcmVuZGVyVGV4dChkb20gYXMgU1ZHVGV4dEVsZW1lbnQsIGZvbnRMaXN0KVxuICAgICAgICAgICAgICAgIHRleHRMYXllci50ID0gdGV4dERhdGFcbiAgICAgICAgICAgICAgICBpZiAoIWZvbnRMaXN0Lmxpc3QhLmZpbHRlcihmID0+IGYuZk5hbWUgPT0gZm9udC5mTmFtZSkubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICBmb250TGlzdC5saXN0IS5wdXNoKGZvbnQpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtb3ZpbkxheWVyID0gbmV3IEpTTW92aW5MYXllcihsYXllcilcbiAgICAgICAgcmV0dXJuIG1vdmluTGF5ZXJcbiAgICB9XG59Il19