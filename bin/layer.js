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
  }]);

  return LayerFactory;
}();

exports.LayerFactory = LayerFactory;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sYXllci50cyJdLCJuYW1lcyI6WyJKU01vdmluTGF5ZXIiLCJrZXkiLCJzIiwiayIsImUiLCJvIiwidHJhbnNmb3JtIiwiYSIsImdldERlZmF1bHRQcm9wZXJ0eSIsInN0YXRpY1ZhbHVlIiwiaWR4IiwidGltZSIsInZhbHVlIiwiZWFzaW5nIiwiZXhpc3RLZXlmcmFtZSIsImZpbHRlciIsIngiLCJ0IiwicmVhZHlUb1NldCIsImxlbmd0aCIsInByZXZpb3VzS2V5ZnJhbWVDb3VudCIsInJlZHVjZSIsInAiLCJzcGxpY2UiLCJ5IiwiaSIsInJvb3QiLCJzaGFwZXMiLCJpdCIsImZpbmQiLCJzaGFwZSIsInR5IiwiZmluZFByb3BlcnR5Q29uZmlnIiwiaGFzVHJhbnNmb3JtIiwiZ3JvdXBTaGFwZXMiLCJwdXNoIiwiYmFzZSIsImluZGV4Iiwia3MiLCJmaW5kT3JJbnNlcnRQcm9wZXJ0eUNvbmZpZyIsInJlZiIsIm9wIiwiY29tbW9uUHJvcGVydHlNYXBwaW5nIiwidW5kZWZpbmVkIiwiZG9jIiwiZCIsImNvbnNvbGUiLCJlcnJvciIsIkVycm9yIiwiY29udmVydFRvU3RhdGljUHJvcGVydHkiLCJzdGFydEZyYW1lIiwiZW5kRnJhbWUiLCJzdGFydFZhbHVlIiwiZW5kVmFsdWUiLCJFYXNpbmdGYWN0b3J5IiwibGluZWFyIiwidGV4dFByb3AiLCJ0bXBTdGFydFZhbHVlIiwiSlNPTiIsInBhcnNlIiwic3RyaW5naWZ5IiwidG1wRW5kVmFsdWUiLCJjb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkiLCJhZGRLZXlmcmFtZSIsIkxheWVyRmFjdG9yeSIsImNvb3JkaW5hdGUiLCJyIiwiZG9tIiwiYm91bmRpbmdCb3giLCJtYXAiLCJ2IiwicmVjdCIsImxheWVyIiwiZGRkIiwic3IiLCJhbyIsImdlbmVyYXRlVHJhbnNmb3JtIiwiaXAiLCJzdCIsImJtIiwibGVmdCIsInRvcCIsIndpZHRoIiwiaGVpZ2h0IiwiY3giLCJjeSIsInJ4IiwicnkiLCJhc3NldExpc3QiLCJmb250TGlzdCIsImRvbVR5cGUiLCJTVkdUZXh0RWxlbWVudCIsIlNWR0ltYWdlRWxlbWVudCIsIlNWR0dFbGVtZW50IiwicHJlY29tcExheWVyIiwiZG9tTGVhdmVzIiwicHJlQ29tcEFzc2V0IiwicHJlQ29tcFJlZklkIiwiZm9yRWFjaCIsIlNWR0dyYXBoaWNzRWxlbWVudCIsInVuc2hpZnQiLCJoaWVyYXJjaHkiLCJ3IiwiaCIsInJlZklkIiwiaWQiLCJsYXllcnMiLCJpbWFnZUxheWVyIiwiaW1hZ2VSZWZJZCIsImltYWdlQXNzZXQiLCJzaGFwZUxheWVyIiwidGV4dExheWVyIiwidGV4dERhdGEiLCJmb250IiwibGlzdCIsImYiLCJmTmFtZSIsIm1vdmluTGF5ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFJYUEsWTs7Ozs7dUNBRWtCQyxHLEVBQWE7QUFDcEMsY0FBUUEsR0FBUjtBQUNJLGFBQUssR0FBTDtBQUNBLGFBQUssR0FBTDtBQUNJLGlCQUFPLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLENBQVA7O0FBQ0osYUFBSyxHQUFMO0FBQ0ksaUJBQU8sQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEdBQVgsQ0FBUDs7QUFDSixhQUFLLEdBQUw7QUFDSSxpQkFBTyxHQUFQOztBQUNKLGFBQUssR0FBTDtBQUNJLGlCQUFPLENBQVA7O0FBQ0osYUFBSyxJQUFMO0FBQ0ksaUJBQU87QUFDSEMsWUFBQUEsQ0FBQyxFQUFFO0FBQ0NDLGNBQUFBLENBQUMsRUFBRSxDQUFDLENBQUQ7QUFESixhQURBO0FBSUhDLFlBQUFBLENBQUMsRUFBRTtBQUNDRCxjQUFBQSxDQUFDLEVBQUUsQ0FBQyxHQUFEO0FBREosYUFKQTtBQU9IRSxZQUFBQSxDQUFDLEVBQUU7QUFDQ0YsY0FBQUEsQ0FBQyxFQUFFLENBQUMsQ0FBRDtBQURKO0FBUEEsV0FBUDs7QUFXSjtBQUNJLGlCQUFPLENBQVA7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bEIsQ0FESixDQUdJOztBQUNBdUMsVUFBQUEsU0FBUyxDQUFDekUsRUFBVixDQUFjL0IsQ0FBZCxDQUFpQkosQ0FBakIsR0FBcUIsQ0FBQyxDQUFELEVBQUksQ0FBQzhELFVBQVUsQ0FBQyxDQUFELENBQWYsRUFBb0IsQ0FBcEIsQ0FBckI7O0FBSkosNEJBTTZCLHdCQUFXRSxHQUFYLEVBQWtDc0IsUUFBbEMsQ0FON0I7QUFBQTtBQUFBLGNBTVd1QixRQU5YO0FBQUEsY0FNcUJDLElBTnJCOztBQU9JRixVQUFBQSxTQUFTLENBQUM5RixDQUFWLEdBQWMrRixRQUFkO0FBQ0EsY0FBSSxDQUFDdkIsUUFBUSxDQUFDeUIsSUFBVCxDQUFlbkcsTUFBZixDQUFzQixVQUFBb0csQ0FBQztBQUFBLG1CQUFJQSxDQUFDLENBQUNDLEtBQUYsSUFBV0gsSUFBSSxDQUFDRyxLQUFwQjtBQUFBLFdBQXZCLEVBQWtEakcsTUFBdkQsRUFDSXNFLFFBQVEsQ0FBQ3lCLElBQVQsQ0FBZS9FLElBQWYsQ0FBb0I4RSxJQUFwQjtBQUNKO0FBMUNSOztBQTRDQSxVQUFNSSxVQUFVLEdBQUcsSUFBSXJILFlBQUosQ0FBaUJ3RSxLQUFqQixDQUFuQjtBQUNBLGFBQU82QyxVQUFQO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTaGFwZUxheWVyLCBUZXh0TGF5ZXIsIEltYWdlTGF5ZXIsIFRyYW5zZm9ybSwgQXNzZXRzLCBGb250cywgR3JvdXBTaGFwZSwgUHJlQ29tcExheWVyIH0gZnJvbSAnLi9hbmltYXRpb24nXG5pbXBvcnQgeyBFYXNpbmdGdW5jdGlvbiwgRWFzaW5nRmFjdG9yeSB9IGZyb20gJy4vZWFzaW5nJ1xuaW1wb3J0IHsgcmVuZGVyVGV4dCwgcmVuZGVyLCByZW5kZXJJbWFnZSwgcmVuZGVyUGxhaW5HbHlwaCB9IGZyb20gJy4vcmVuZGVyJztcbmltcG9ydCB7IGdldEJvdW5kaW5nQm94LCBnZXRMZWFmTm9kZXMgfSBmcm9tICcuL2hlbHBlcidcbmltcG9ydCB1dWlkIGZyb20gJ3V1aWQvdjQnO1xuXG50eXBlIFNldGFibGVLZXlzID0gXCJzY2FsZVhcIiB8IFwic2NhbGVZXCIgfCBcImFuY2hvclhcIiB8IFwiYW5jaG9yWVwiIHwgXCJ4XCIgfCBcInlcIiB8IFwicm90YXRlXCIgfCBcIm9wYWNpdHlcIiB8ICdzaGFwZScgfCAnZmlsbENvbG9yJyB8ICd0cmltU3RhcnQnIHwgJ3RyaW1FbmQnIHwgJ3RyaW1PZmZzZXQnIHwgJ3N0cm9rZUNvbG9yJyB8ICdzdHJva2VXaWR0aCcgfCAndGV4dCdcblxuZXhwb3J0IGNsYXNzIEpTTW92aW5MYXllciB7XG4gICAgcHVibGljIHJlYWRvbmx5IHJvb3Q6IFNoYXBlTGF5ZXIgfCBUZXh0TGF5ZXIgfCBJbWFnZUxheWVyIHwgUHJlQ29tcExheWVyO1xuICAgIHByaXZhdGUgZ2V0RGVmYXVsdFByb3BlcnR5KGtleTogc3RyaW5nKSB7XG4gICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgICAgICBjYXNlICdhJzpcbiAgICAgICAgICAgIGNhc2UgJ3AnOlxuICAgICAgICAgICAgICAgIHJldHVybiBbMCwgMCwgMF1cbiAgICAgICAgICAgIGNhc2UgJ3MnOlxuICAgICAgICAgICAgICAgIHJldHVybiBbMTAwLCAxMDAsIDEwMF1cbiAgICAgICAgICAgIGNhc2UgJ28nOlxuICAgICAgICAgICAgICAgIHJldHVybiAxMDBcbiAgICAgICAgICAgIGNhc2UgJ3InOlxuICAgICAgICAgICAgICAgIHJldHVybiAwXG4gICAgICAgICAgICBjYXNlICd0bSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgazogWzBdXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGs6IFsxMDBdXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG86IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGs6IFswXVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gMFxuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgY29udmVydFRvU3RhdGljUHJvcGVydHkodHJhbnNmb3JtOiBhbnksIGtleTogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdHJhbnNmb3JtW2tleV0pIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybVtrZXldID0ge1xuICAgICAgICAgICAgICAgIGE6IDAsXG4gICAgICAgICAgICAgICAgazogdGhpcy5nZXREZWZhdWx0UHJvcGVydHkoa2V5KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0cmFuc2Zvcm1ba2V5XS5hID09IDEpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRpY1ZhbHVlID0gdHJhbnNmb3JtW2tleV0ua1swXS5zXG4gICAgICAgICAgICB0cmFuc2Zvcm1ba2V5XSA9IHtcbiAgICAgICAgICAgICAgICBhOiAwLFxuICAgICAgICAgICAgICAgIGs6IHN0YXRpY1ZhbHVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBjb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkodHJhbnNmb3JtOiBhbnksIGtleTogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdHJhbnNmb3JtW2tleV0gfHwgdHJhbnNmb3JtW2tleV0uYSA9PSAwKSB7XG4gICAgICAgICAgICB0cmFuc2Zvcm1ba2V5XSA9IHtcbiAgICAgICAgICAgICAgICBhOiAxLFxuICAgICAgICAgICAgICAgIGs6IFtdXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBhZGRLZXlmcmFtZSh0cmFuc2Zvcm06IGFueSwga2V5OiBzdHJpbmcsIGlkeDogbnVtYmVyID0gLTEsIHRpbWU6IG51bWJlciwgdmFsdWU6IEFycmF5PGFueT4sIGVhc2luZz86IEVhc2luZ0Z1bmN0aW9uKSB7XG4gICAgICAgIGNvbnN0IGV4aXN0S2V5ZnJhbWUgPSB0cmFuc2Zvcm1ba2V5XS5rLmZpbHRlcigoeDogYW55KSA9PiB4LnQgPT0gdGltZSkgYXMgYW55W11cbiAgICAgICAgbGV0IHJlYWR5VG9TZXQ7XG4gICAgICAgIGlmIChleGlzdEtleWZyYW1lLmxlbmd0aCkge1xuICAgICAgICAgICAgcmVhZHlUb1NldCA9IGV4aXN0S2V5ZnJhbWVbMF1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlYWR5VG9TZXQgPSB7XG4gICAgICAgICAgICAgICAgdDogdGltZSxcbiAgICAgICAgICAgICAgICBzOiB0aGlzLmdldERlZmF1bHRQcm9wZXJ0eShrZXkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBwcmV2aW91c0tleWZyYW1lQ291bnQgPSB0cmFuc2Zvcm1ba2V5XS5rLnJlZHVjZSgocDogbnVtYmVyLCB4OiBhbnkpID0+IHgudCA8IHRpbWUgPyBwICsgMSA6IHAsIDApXG4gICAgICAgICAgICB0cmFuc2Zvcm1ba2V5XS5rLnNwbGljZShwcmV2aW91c0tleWZyYW1lQ291bnQsIDAsIHJlYWR5VG9TZXQpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVhc2luZykge1xuICAgICAgICAgICAgcmVhZHlUb1NldC5vID0ge1xuICAgICAgICAgICAgICAgIHg6IGVhc2luZ1swXVswXSxcbiAgICAgICAgICAgICAgICB5OiBlYXNpbmdbMF1bMV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlYWR5VG9TZXQuaSA9IHtcbiAgICAgICAgICAgICAgICB4OiBlYXNpbmdbMV1bMF0sXG4gICAgICAgICAgICAgICAgeTogZWFzaW5nWzFdWzFdXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICAgICAgICByZWFkeVRvU2V0LnNbaWR4XSA9IHZhbHVlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWFkeVRvU2V0LnMgPSBbdmFsdWVdXG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBmaW5kUHJvcGVydHlDb25maWcoa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuICgodGhpcy5yb290IGFzIFNoYXBlTGF5ZXIpLnNoYXBlcyFbMF0gYXMgR3JvdXBTaGFwZSkuaXQhLmZpbmQoc2hhcGUgPT5cbiAgICAgICAgICAgIHNoYXBlLnR5ID09IGtleVxuICAgICAgICApXG4gICAgfVxuICAgIHByaXZhdGUgZmluZE9ySW5zZXJ0UHJvcGVydHlDb25maWcoa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgZmluZCA9IHRoaXMuZmluZFByb3BlcnR5Q29uZmlnKGtleSlcbiAgICAgICAgaWYgKGZpbmQpIHJldHVybiBmaW5kXG4gICAgICAgIGNvbnN0IGhhc1RyYW5zZm9ybSA9IHRoaXMuZmluZFByb3BlcnR5Q29uZmlnKCd0cicpXG4gICAgICAgIGlmIChoYXNUcmFuc2Zvcm0pIHtcbiAgICAgICAgICAgIGNvbnN0IGdyb3VwU2hhcGVzID0gKCh0aGlzLnJvb3QgYXMgU2hhcGVMYXllcikuc2hhcGVzIVswXSBhcyBHcm91cFNoYXBlKS5pdCFcbiAgICAgICAgICAgIGdyb3VwU2hhcGVzLnNwbGljZShncm91cFNoYXBlcy5sZW5ndGggLSAxLCAwLCB7XG4gICAgICAgICAgICAgICAgdHk6IGtleSxcbiAgICAgICAgICAgICAgICAuLi50aGlzLmdldERlZmF1bHRQcm9wZXJ0eShrZXkpIGFzIG9iamVjdFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICgodGhpcy5yb290IGFzIFNoYXBlTGF5ZXIpLnNoYXBlcyFbMF0gYXMgR3JvdXBTaGFwZSkuaXQhLnB1c2goe1xuICAgICAgICAgICAgICAgIHR5OiBrZXksXG4gICAgICAgICAgICAgICAgLi4udGhpcy5nZXREZWZhdWx0UHJvcGVydHkoa2V5KSBhcyBvYmplY3RcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBjb21tb25Qcm9wZXJ0eU1hcHBpbmcoa2V5OiBTZXRhYmxlS2V5cyk6IFthbnksIHN0cmluZyB8IHVuZGVmaW5lZCwgbnVtYmVyIHwgdW5kZWZpbmVkXSB7XG4gICAgICAgIGxldCBiYXNlOiBhbnksIGs6IHN0cmluZyB8IHVuZGVmaW5lZCwgaW5kZXg6IG51bWJlciB8IHVuZGVmaW5lZFxuICAgICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICAgICAgY2FzZSAnc2NhbGVYJzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5yb290LmtzXG4gICAgICAgICAgICAgICAgayA9ICdzJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gMFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdzY2FsZVknOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLnJvb3Qua3NcbiAgICAgICAgICAgICAgICBrID0gJ3MnXG4gICAgICAgICAgICAgICAgaW5kZXggPSAxXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ2FuY2hvclgnOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLnJvb3Qua3NcbiAgICAgICAgICAgICAgICBrID0gJ2EnXG4gICAgICAgICAgICAgICAgaW5kZXggPSAwXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ2FuY2hvclknOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLnJvb3Qua3NcbiAgICAgICAgICAgICAgICBrID0gJ2EnXG4gICAgICAgICAgICAgICAgaW5kZXggPSAxXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3gnOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLnJvb3Qua3NcbiAgICAgICAgICAgICAgICBrID0gJ3AnXG4gICAgICAgICAgICAgICAgaW5kZXggPSAwXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3knOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLnJvb3Qua3NcbiAgICAgICAgICAgICAgICBrID0gJ3AnXG4gICAgICAgICAgICAgICAgaW5kZXggPSAxXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3JvdGF0ZSc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMucm9vdC5rc1xuICAgICAgICAgICAgICAgIGsgPSAncidcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ29wYWNpdHknOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLnJvb3Qua3NcbiAgICAgICAgICAgICAgICBrID0gJ28nXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICd0cmltU3RhcnQnOlxuICAgICAgICAgICAgICAgIGJhc2UgPSB0aGlzLmZpbmRPckluc2VydFByb3BlcnR5Q29uZmlnKCd0bScpXG4gICAgICAgICAgICAgICAgayA9ICdzJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAndHJpbUVuZCc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZE9ySW5zZXJ0UHJvcGVydHlDb25maWcoJ3RtJylcbiAgICAgICAgICAgICAgICBrID0gJ2UnXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICd0cmltT2Zmc2V0JzpcbiAgICAgICAgICAgICAgICBiYXNlID0gdGhpcy5maW5kT3JJbnNlcnRQcm9wZXJ0eUNvbmZpZygndG0nKVxuICAgICAgICAgICAgICAgIGsgPSAnbydcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ2ZpbGxDb2xvcic6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZE9ySW5zZXJ0UHJvcGVydHlDb25maWcoJ2ZsJylcbiAgICAgICAgICAgICAgICBrID0gJ2MnXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdzdHJva2VDb2xvcic6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZE9ySW5zZXJ0UHJvcGVydHlDb25maWcoJ3N0JylcbiAgICAgICAgICAgICAgICBrID0gJ2MnXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdzdHJva2VXaWR0aCc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZE9ySW5zZXJ0UHJvcGVydHlDb25maWcoJ3N0JylcbiAgICAgICAgICAgICAgICBrID0gJ3cnXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdzaGFwZSc6XG4gICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMuZmluZE9ySW5zZXJ0UHJvcGVydHlDb25maWcoJ3NoJylcbiAgICAgICAgICAgICAgICBrID0gJ2tzJ1xuICAgICAgICAgICAgICAgIGluZGV4ID0gLTFcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbYmFzZSwgaywgaW5kZXhdXG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocmVmOiBTaGFwZUxheWVyIHwgVGV4dExheWVyIHwgSW1hZ2VMYXllciB8IFByZUNvbXBMYXllcikge1xuICAgICAgICB0aGlzLnJvb3QgPSByZWZcbiAgICB9XG5cbiAgICBzZXRTdGF0aWNQcm9wZXJ0eShrZXk6IFNldGFibGVLZXlzLCB2YWx1ZTogYW55KSB7XG4gICAgICAgIHRoaXMucm9vdC5vcCA9IDFcbiAgICAgICAgbGV0IGJhc2U6IGFueSwgazogc3RyaW5nIHwgdW5kZWZpbmVkLCBpbmRleDogbnVtYmVyIHwgdW5kZWZpbmVkXG4gICAgICAgIFtiYXNlLCBrLCBpbmRleF0gPSB0aGlzLmNvbW1vblByb3BlcnR5TWFwcGluZyhrZXkpXG4gICAgICAgIGlmICghayB8fCBpbmRleCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5yb290LnR5ID09IDUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRvYyA9IHRoaXMucm9vdC50IS5kIVxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jLmsgPSBbZG9jLmshWzBdXVxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jLmtbMF0udCA9IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvYy5rWzBdLnMhLnQgPSB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihrZXksIHZhbHVlKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBhIHZhbGlkIGtleS4nKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChiYXNlICYmIGsgJiYgaW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9TdGF0aWNQcm9wZXJ0eShiYXNlLCBrKVxuICAgICAgICAgICAgYmFzZVtrXS5rW2luZGV4XSA9IHZhbHVlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRBbmltYXRhYmxlUHJvcGVydHkoa2V5OiBTZXRhYmxlS2V5cywgc3RhcnRGcmFtZTogbnVtYmVyLCBlbmRGcmFtZTogbnVtYmVyLCBzdGFydFZhbHVlOiBhbnksIGVuZFZhbHVlOiBhbnksIGVhc2luZz86IEVhc2luZ0Z1bmN0aW9uKSB7XG4gICAgICAgIGlmIChlbmRGcmFtZSA8PSBzdGFydEZyYW1lKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0VuZCBmcmFtZSBzaG91bGQgYmUgbGFyZ2VyIHRoYW4gc3RhcnQgZnJhbWUuJylcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJvb3Qub3AgPSBlbmRGcmFtZSArIDFcbiAgICAgICAgaWYgKCFlYXNpbmcpIHtcbiAgICAgICAgICAgIGVhc2luZyA9IEVhc2luZ0ZhY3RvcnkubGluZWFyKClcbiAgICAgICAgfVxuICAgICAgICBsZXQgYmFzZTogYW55LCBrOiBzdHJpbmcgfCB1bmRlZmluZWQsIGluZGV4OiBudW1iZXIgfCB1bmRlZmluZWRcbiAgICAgICAgW2Jhc2UsIGssIGluZGV4XSA9IHRoaXMuY29tbW9uUHJvcGVydHlNYXBwaW5nKGtleSlcbiAgICAgICAgaWYgKCFrIHx8IGluZGV4ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgICAgICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnJvb3QudHkgPT0gNSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmFzZSA9IHRoaXMucm9vdC50IS5kXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGV4dFByb3AgPSBiYXNlLmtbMF0uc1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRtcFN0YXJ0VmFsdWUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRleHRQcm9wKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0bXBFbmRWYWx1ZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGV4dFByb3ApKVxuICAgICAgICAgICAgICAgICAgICAgICAgdG1wU3RhcnRWYWx1ZS50ID0gc3RhcnRWYWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgdG1wRW5kVmFsdWUudCA9IGVuZFZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlID0gdG1wU3RhcnRWYWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSB0bXBFbmRWYWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgayA9ICdrJ1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihrZXksIHN0YXJ0RnJhbWUsIGVuZEZyYW1lLCBzdGFydFZhbHVlLCBlbmRWYWx1ZSwgZWFzaW5nKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBhIHZhbGlkIGtleS4nKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChiYXNlICYmIGsgJiYgaW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG9BbmltYXRhYmxlUHJvcGVydHkoYmFzZSwgaylcbiAgICAgICAgICAgIHRoaXMuYWRkS2V5ZnJhbWUoYmFzZSwgaywgaW5kZXgsIHN0YXJ0RnJhbWUsIHN0YXJ0VmFsdWUsIGVhc2luZylcbiAgICAgICAgICAgIHRoaXMuYWRkS2V5ZnJhbWUoYmFzZSwgaywgaW5kZXgsIGVuZEZyYW1lLCBlbmRWYWx1ZSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIExheWVyRmFjdG9yeSB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2VuZXJhdGVUcmFuc2Zvcm0oY29vcmRpbmF0ZTogbnVtYmVyW10pOiBUcmFuc2Zvcm0ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbzoge1xuICAgICAgICAgICAgICAgIGE6IDAsXG4gICAgICAgICAgICAgICAgazogMTAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcjoge1xuICAgICAgICAgICAgICAgIGE6IDAsXG4gICAgICAgICAgICAgICAgazogMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHA6IHtcbiAgICAgICAgICAgICAgICBhOiAwLFxuICAgICAgICAgICAgICAgIGs6IFtcbiAgICAgICAgICAgICAgICAgICAgY29vcmRpbmF0ZVswXSxcbiAgICAgICAgICAgICAgICAgICAgY29vcmRpbmF0ZVsxXSxcbiAgICAgICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhOiB7XG4gICAgICAgICAgICAgICAgYTogMCxcbiAgICAgICAgICAgICAgICBrOiBbXG4gICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgIDBcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgczoge1xuICAgICAgICAgICAgICAgIGE6IDAsXG4gICAgICAgICAgICAgICAgazogW1xuICAgICAgICAgICAgICAgICAgICAxMDAsXG4gICAgICAgICAgICAgICAgICAgIDEwMCxcbiAgICAgICAgICAgICAgICAgICAgMTAwXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGJvdW5kaW5nQm94KGRvbTogU1ZHR3JhcGhpY3NFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IGJvdW5kaW5nQm94ID0gZ2V0Qm91bmRpbmdCb3goZG9tKS5tYXAoKHYsIGkpID0+IGkgPCAyID8gdiAtIDEgOiB2ICsgMSkgYXMgW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl1cbiAgICAgICAgcmV0dXJuIHRoaXMucmVjdCguLi5ib3VuZGluZ0JveClcbiAgICB9XG5cbiAgICBzdGF0aWMgc2hhcGUoZG9tOiBTVkdQYXRoRWxlbWVudCkge1xuICAgICAgICBjb25zdCBjb29yZGluYXRlID0gZ2V0Qm91bmRpbmdCb3goZG9tKVxuICAgICAgICBjb25zdCBsYXllcjogU2hhcGVMYXllciA9IHtcbiAgICAgICAgICAgIHR5OiA0LFxuICAgICAgICAgICAgZGRkOiAwLFxuICAgICAgICAgICAgc3I6IDEsXG4gICAgICAgICAgICBhbzogMCxcbiAgICAgICAgICAgIGtzOiB0aGlzLmdlbmVyYXRlVHJhbnNmb3JtKGNvb3JkaW5hdGUpLFxuICAgICAgICAgICAgaXA6IDAsXG4gICAgICAgICAgICBvcDogMSxcbiAgICAgICAgICAgIHN0OiAwLFxuICAgICAgICAgICAgYm06IDAsXG4gICAgICAgICAgICBzaGFwZXM6IHJlbmRlcihkb20pXG5cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEpTTW92aW5MYXllcihsYXllcilcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVjdChsZWZ0OiBudW1iZXIsIHRvcDogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xuICAgICAgICBjb25zdCBsYXllcjogU2hhcGVMYXllciA9IHtcbiAgICAgICAgICAgIHR5OiA0LFxuICAgICAgICAgICAgZGRkOiAwLFxuICAgICAgICAgICAgc3I6IDEsXG4gICAgICAgICAgICBhbzogMCxcbiAgICAgICAgICAgIGtzOiB0aGlzLmdlbmVyYXRlVHJhbnNmb3JtKFtsZWZ0LCB0b3AsIHdpZHRoLCBoZWlnaHRdKSxcbiAgICAgICAgICAgIGlwOiAwLFxuICAgICAgICAgICAgb3A6IDEsXG4gICAgICAgICAgICBzdDogMCxcbiAgICAgICAgICAgIGJtOiAwLFxuICAgICAgICAgICAgc2hhcGVzOiBbXG4gICAgICAgICAgICAgICAgcmVuZGVyUGxhaW5HbHlwaCgncmVjdCcsIFt3aWR0aCwgaGVpZ2h0XSlcbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEpTTW92aW5MYXllcihsYXllcilcbiAgICB9XG5cbiAgICBzdGF0aWMgZWxsaXBzZShjeDogbnVtYmVyLCBjeTogbnVtYmVyLCByeDogbnVtYmVyLCByeTogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGxheWVyOiBTaGFwZUxheWVyID0ge1xuICAgICAgICAgICAgdHk6IDQsXG4gICAgICAgICAgICBkZGQ6IDAsXG4gICAgICAgICAgICBzcjogMSxcbiAgICAgICAgICAgIGFvOiAwLFxuICAgICAgICAgICAga3M6IHRoaXMuZ2VuZXJhdGVUcmFuc2Zvcm0oW2N4IC0gcngsIGN5IC0gcnksIDIgKiByeCwgMiAqIHJ5XSksXG4gICAgICAgICAgICBpcDogMCxcbiAgICAgICAgICAgIG9wOiAxLFxuICAgICAgICAgICAgc3Q6IDAsXG4gICAgICAgICAgICBibTogMCxcbiAgICAgICAgICAgIHNoYXBlczogW1xuICAgICAgICAgICAgICAgIHJlbmRlclBsYWluR2x5cGgoJ2VsbGlwc2UnLCBbcngsIHJ5XSlcbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEpTTW92aW5MYXllcihsYXllcilcbiAgICB9XG5cbiAgICBzdGF0aWMgaGllcmFyY2h5KGRvbTogU1ZHR3JhcGhpY3NFbGVtZW50LCBhc3NldExpc3Q6IEFzc2V0cywgZm9udExpc3Q6IEZvbnRzKSB7XG4gICAgICAgIGNvbnN0IGNvb3JkaW5hdGUgPSBnZXRCb3VuZGluZ0JveChkb20pXG4gICAgICAgIGxldCBkb21UeXBlOiAyIHwgNCB8IDUgfCAwO1xuICAgICAgICBpZiAoZG9tIGluc3RhbmNlb2YgU1ZHVGV4dEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGRvbVR5cGUgPSA1XG4gICAgICAgIH0gZWxzZSBpZiAoZG9tIGluc3RhbmNlb2YgU1ZHSW1hZ2VFbGVtZW50KSB7XG4gICAgICAgICAgICBkb21UeXBlID0gMlxuICAgICAgICB9IGVsc2UgaWYgKGRvbSBpbnN0YW5jZW9mIFNWR0dFbGVtZW50KSB7XG4gICAgICAgICAgICBkb21UeXBlID0gMFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG9tVHlwZSA9IDRcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsYXllcjogU2hhcGVMYXllciB8IEltYWdlTGF5ZXIgfCBUZXh0TGF5ZXIgfCBQcmVDb21wTGF5ZXIgPSB7XG4gICAgICAgICAgICB0eTogZG9tVHlwZSxcbiAgICAgICAgICAgIGRkZDogMCxcbiAgICAgICAgICAgIHNyOiAxLFxuICAgICAgICAgICAgYW86IDAsXG4gICAgICAgICAgICBrczogdGhpcy5nZW5lcmF0ZVRyYW5zZm9ybShkb21UeXBlID09IDAgPyBbMCwgMCwgMCwgMF0gOiBjb29yZGluYXRlKSxcbiAgICAgICAgICAgIGlwOiAwLFxuICAgICAgICAgICAgb3A6IDEsXG4gICAgICAgICAgICBzdDogMCxcbiAgICAgICAgICAgIGJtOiAwXG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoIChkb21UeXBlKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgY29uc3QgcHJlY29tcExheWVyID0gbGF5ZXIgYXMgUHJlQ29tcExheWVyXG4gICAgICAgICAgICAgICAgY29uc3QgZG9tTGVhdmVzID0gZ2V0TGVhZk5vZGVzKGRvbSlcbiAgICAgICAgICAgICAgICBjb25zdCBwcmVDb21wQXNzZXQ6IEpTTW92aW5MYXllcltdID0gW11cbiAgICAgICAgICAgICAgICBjb25zdCBwcmVDb21wUmVmSWQgPSB1dWlkKClcbiAgICAgICAgICAgICAgICBkb21MZWF2ZXMuZm9yRWFjaChkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGQgaW5zdGFuY2VvZiBTVkdHcmFwaGljc0VsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZUNvbXBBc3NldC51bnNoaWZ0KHRoaXMuaGllcmFyY2h5KGQsIGFzc2V0TGlzdCwgZm9udExpc3QpKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBwcmVDb21wQXNzZXQuZm9yRWFjaChsYXllciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxheWVyLnJvb3Qub3AgPSA5ZTlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIHByZWNvbXBMYXllci53ID0gY29vcmRpbmF0ZVswXSArIGNvb3JkaW5hdGVbMl0gKyAxXG4gICAgICAgICAgICAgICAgcHJlY29tcExheWVyLmggPSBjb29yZGluYXRlWzFdICsgY29vcmRpbmF0ZVszXSArIDFcbiAgICAgICAgICAgICAgICBwcmVjb21wTGF5ZXIucmVmSWQgPSBwcmVDb21wUmVmSWRcbiAgICAgICAgICAgICAgICBhc3NldExpc3QucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGlkOiBwcmVDb21wUmVmSWQsXG4gICAgICAgICAgICAgICAgICAgIGxheWVyczogcHJlQ29tcEFzc2V0Lm1hcChsYXllciA9PiBsYXllci5yb290KVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBjb25zdCBpbWFnZUxheWVyID0gbGF5ZXIgYXMgSW1hZ2VMYXllclxuICAgICAgICAgICAgICAgIGNvbnN0IFtpbWFnZVJlZklkLCBpbWFnZUFzc2V0XSA9IHJlbmRlckltYWdlKGRvbSBhcyBTVkdJbWFnZUVsZW1lbnQpXG4gICAgICAgICAgICAgICAgaW1hZ2VMYXllci5yZWZJZCA9IGltYWdlUmVmSWRcbiAgICAgICAgICAgICAgICBhc3NldExpc3QucHVzaChpbWFnZUFzc2V0KVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgY29uc3Qgc2hhcGVMYXllciA9IGxheWVyIGFzIFNoYXBlTGF5ZXJcbiAgICAgICAgICAgICAgICBzaGFwZUxheWVyLnNoYXBlcyA9IHJlbmRlcihkb20pXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0TGF5ZXIgPSBsYXllciBhcyBUZXh0TGF5ZXJcblxuICAgICAgICAgICAgICAgIC8vIG1vdmUgdGV4dExheWVyJ3MgYW5jaG9yIHRvIGxlZnQtdG9wXG4gICAgICAgICAgICAgICAgdGV4dExheWVyLmtzIS5hIS5rID0gWzAsIC1jb29yZGluYXRlWzNdLCAwXVxuXG4gICAgICAgICAgICAgICAgY29uc3QgW3RleHREYXRhLCBmb250XSA9IHJlbmRlclRleHQoZG9tIGFzIFNWR1RleHRFbGVtZW50LCBmb250TGlzdClcbiAgICAgICAgICAgICAgICB0ZXh0TGF5ZXIudCA9IHRleHREYXRhXG4gICAgICAgICAgICAgICAgaWYgKCFmb250TGlzdC5saXN0IS5maWx0ZXIoZiA9PiBmLmZOYW1lID09IGZvbnQuZk5hbWUpLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgZm9udExpc3QubGlzdCEucHVzaChmb250KVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbW92aW5MYXllciA9IG5ldyBKU01vdmluTGF5ZXIobGF5ZXIpXG4gICAgICAgIHJldHVybiBtb3ZpbkxheWVyXG4gICAgfVxufSJdfQ==