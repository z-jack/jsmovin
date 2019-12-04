"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "LayerFactory", {
  enumerable: true,
  get: function get() {
    return _layer.LayerFactory;
  }
});
Object.defineProperty(exports, "EasingFactory", {
  enumerable: true,
  get: function get() {
    return _easing.EasingFactory;
  }
});
Object.defineProperty(exports, "PathMaker", {
  enumerable: true,
  get: function get() {
    return _path.PathMaker;
  }
});
exports.MaskType = exports["default"] = void 0;

var _layer = require("./layer");

var _v = _interopRequireDefault(require("uuid/v4"));

var _easing = require("./easing");

var _path = require("./path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var JSMovin =
/*#__PURE__*/
function () {
  /**
   * @param fps number of frames per second
   * @param width width of viewport (px)
   * @param height height of viewport (px)
   */
  function JSMovin() {
    var fps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 30;
    var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 800;
    var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 600;

    _classCallCheck(this, JSMovin);

    _defineProperty(this, "root", void 0);

    this.root = {
      fr: fps,
      w: width,
      h: height,
      ddd: 0,
      layers: [],
      assets: [],
      fonts: {
        list: []
      },
      ip: 0,
      op: 0
    };
  }
  /**
   * @param fps number of frames per second
   */


  _createClass(JSMovin, [{
    key: "setFrameRate",
    value: function setFrameRate(fps) {
      this.root.fr = fps;
    }
    /**
     * @param width width of viewport (px)
     * @param height height of viewport (px)
     */

  }, {
    key: "setViewport",
    value: function setViewport(width, height) {
      this.root.w = width;
      this.root.h = height;
    }
    /**
     * add a simple graphical layer
     * @param domLayerOrAssetId a SVG element DOM or JSMovinLayer or asset ID needs to be inserted
     */

  }, {
    key: "addLayer",
    value: function addLayer(domLayerOrAssetId) {
      var layer;

      if (domLayerOrAssetId instanceof SVGGraphicsElement) {
        layer = _layer.LayerFactory.hierarchy(domLayerOrAssetId, this.root.assets, this.root.fonts);
      } else if (typeof domLayerOrAssetId === 'string') {
        layer = _layer.LayerFactory.ref(domLayerOrAssetId);
      } else {
        layer = domLayerOrAssetId;
      }

      this.root.layers.splice(0, 0, layer.root);
      return layer;
    }
    /**
     * @param maskOrDom a SVG element DOM or JSMovinLayer to be the mask
     * @param layerRefOrIndex a JSMovinLayer or index of layer to be the masked layer
     * @param maskType which type of mask to use, use `MaskType.*` to specify
     */

  }, {
    key: "addMask",
    value: function addMask(maskOrDom, layerRefOrIndex) {
      var maskType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : MaskType.Alpha;
      var layerRef;
      var layerIndex;

      if (layerRefOrIndex instanceof _layer.JSMovinLayer) {
        layerRef = layerRefOrIndex;
        layerIndex = this.root.layers.indexOf(layerRef.root);
        layerRef.root.tt = maskType;
      } else {
        layerIndex = layerRefOrIndex;
        this.root.layers[layerIndex].tt = maskType;
      }

      if (layerIndex < 0) {
        throw new Error('Given layer is not a member of this JSMovin.');
      }

      var maskLayer;

      if (maskOrDom instanceof SVGGraphicsElement) {
        maskLayer = _layer.LayerFactory.hierarchy(maskOrDom, this.root.assets, this.root.fonts);
      } else {
        maskLayer = maskOrDom;
      }

      this.root.layers.splice(layerIndex, 0, maskLayer.root);
      return maskLayer;
    }
    /**
     * @param layerRefs a set of layers to be packed as an asset
     */

  }, {
    key: "makeAsset",
    value: function makeAsset(layerRefs) {
      var _this = this;

      layerRefs.forEach(function (layer, innerIndex) {
        if (layer.root.tt == 1) {
          var layerIndex = _this.root.layers.indexOf(layer.root);

          if (layerIndex > 0) {
            var mask = _this.root.layers[layerIndex - 1];

            if (innerIndex == 0 || layerRefs[innerIndex - 1].root != mask) {
              layerRefs.splice(innerIndex, 0, new _layer.JSMovinLayer(mask));
            }
          }
        }
      });
      layerRefs = layerRefs.map(function (layer, innerIndex) {
        return {
          layer: layer,
          innerIndex: innerIndex
        };
      }).sort(function (a, b) {
        var aIndex = _this.root.layers.indexOf(a.layer.root);

        var bIndex = _this.root.layers.indexOf(b.layer.root);

        return aIndex - bIndex || a.innerIndex - b.innerIndex;
      }).map(function (layerWrapper) {
        return layerWrapper.layer;
      });
      layerRefs.forEach(function (layer) {
        var layerIndex = _this.root.layers.indexOf(layer.root);

        if (layerIndex > 0) {
          _this.root.layers.splice(layerIndex, 1);
        }

        layer.root.op = 9e9;
      });
      var refId = (0, _v["default"])();
      this.root.assets.push({
        id: refId,
        layers: layerRefs.map(function (layerRef) {
          return layerRef.root;
        })
      });
      return refId;
    }
    /**
     * @param layerRefOrIndex a JSMovinLayer or index of layer to remove
     */

  }, {
    key: "removeLayer",
    value: function removeLayer(layerRefOrIndex) {
      var layerRef;
      var layerIndex;

      if (layerRefOrIndex instanceof _layer.JSMovinLayer) {
        layerRef = layerRefOrIndex;
        layerIndex = this.root.layers.indexOf(layerRef.root);
      } else {
        layerIndex = layerRefOrIndex;
      }

      this.root.layers.splice(layerIndex, 1);
    }
    /**
     * @param layerRefOrIndex a JSMovinLayer or index of mask or masked layer to remove
     */

  }, {
    key: "removeMask",
    value: function removeMask(layerRefOrIndex) {
      var layerRef;
      var layerIndex;

      if (layerRefOrIndex instanceof _layer.JSMovinLayer) {
        layerRef = layerRefOrIndex;
        layerIndex = this.root.layers.indexOf(layerRef.root);
      } else {
        layerIndex = layerRefOrIndex;
        layerRef = new _layer.JSMovinLayer(this.root.layers[layerIndex]);
      }

      if (layerRef.root.tt) {
        layerRef.root.tt = 0;
        this.root.layers.splice(layerIndex - 1, 1);
      } else if (this.root.layers[layerIndex + 1].tt) {
        this.root.layers[layerIndex + 1].tt = 0;
        this.root.layers.splice(layerIndex, 1);
      } else {
        throw new Error('The input layer is not a mask or a masked layer.');
      }
    }
    /**
     * clear all layers
     */

  }, {
    key: "clearLayers",
    value: function clearLayers() {
      this.root.layers = [];
    }
    /**
     * make all layers end at same time
     */

  }, {
    key: "uniform",
    value: function uniform() {
      var maxTime = this.root.layers.reduce(function (p, v) {
        return p < v.op ? v.op : p;
      }, 0);
      this.root.op = maxTime;
      this.root.layers.forEach(function (layer) {
        return layer.op = maxTime;
      });
    }
    /**
     * export Lottie as JavaScript Object 
     */

  }, {
    key: "toObject",
    value: function toObject() {
      this.uniform();
      return JSON.parse(this.toJSON());
    }
    /**
     * export Lottie as JSON text
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.uniform();
      return JSON.stringify(this.root);
    }
  }]);

  return JSMovin;
}();

exports["default"] = JSMovin;
var MaskType;
exports.MaskType = MaskType;

(function (MaskType) {
  MaskType[MaskType["Alpha"] = 1] = "Alpha";
  MaskType[MaskType["InvertAlpha"] = 2] = "InvertAlpha";
  MaskType[MaskType["Luma"] = 3] = "Luma";
  MaskType[MaskType["InvertLuma"] = 4] = "InvertLuma";
})(MaskType || (exports.MaskType = MaskType = {}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9qc21vdmluLnRzIl0sIm5hbWVzIjpbIkpTTW92aW4iLCJmcHMiLCJ3aWR0aCIsImhlaWdodCIsInJvb3QiLCJmciIsInciLCJoIiwiZGRkIiwibGF5ZXJzIiwiYXNzZXRzIiwiZm9udHMiLCJsaXN0IiwiaXAiLCJvcCIsImRvbUxheWVyT3JBc3NldElkIiwibGF5ZXIiLCJTVkdHcmFwaGljc0VsZW1lbnQiLCJMYXllckZhY3RvcnkiLCJoaWVyYXJjaHkiLCJyZWYiLCJzcGxpY2UiLCJtYXNrT3JEb20iLCJsYXllclJlZk9ySW5kZXgiLCJtYXNrVHlwZSIsIk1hc2tUeXBlIiwiQWxwaGEiLCJsYXllclJlZiIsImxheWVySW5kZXgiLCJKU01vdmluTGF5ZXIiLCJpbmRleE9mIiwidHQiLCJFcnJvciIsIm1hc2tMYXllciIsImxheWVyUmVmcyIsImZvckVhY2giLCJpbm5lckluZGV4IiwibWFzayIsIm1hcCIsInNvcnQiLCJhIiwiYiIsImFJbmRleCIsImJJbmRleCIsImxheWVyV3JhcHBlciIsInJlZklkIiwicHVzaCIsImlkIiwibWF4VGltZSIsInJlZHVjZSIsInAiLCJ2IiwidW5pZm9ybSIsIkpTT04iLCJwYXJzZSIsInRvSlNPTiIsInN0cmluZ2lmeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBOztBQUNBOztBQTBNQTs7QUFDQTs7Ozs7Ozs7Ozs7O0lBek1xQkEsTzs7O0FBR2pCOzs7OztBQUtBLHFCQUF5RTtBQUFBLFFBQTdEQyxHQUE2RCx1RUFBL0MsRUFBK0M7QUFBQSxRQUEzQ0MsS0FBMkMsdUVBQTNCLEdBQTJCO0FBQUEsUUFBdEJDLE1BQXNCLHVFQUFMLEdBQUs7O0FBQUE7O0FBQUE7O0FBQ3JFLFNBQUtDLElBQUwsR0FBWTtBQUNSQyxNQUFBQSxFQUFFLEVBQUVKLEdBREk7QUFFUkssTUFBQUEsQ0FBQyxFQUFFSixLQUZLO0FBR1JLLE1BQUFBLENBQUMsRUFBRUosTUFISztBQUlSSyxNQUFBQSxH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SUksS0FBSixDQUFVLGtEQUFWLENBQU47QUFDSDtBQUNKO0FBRUQ7Ozs7OztrQ0FHYztBQUNWLFdBQUs1QixJQUFMLENBQVVLLE1BQVYsR0FBbUIsRUFBbkI7QUFDSDtBQUVEOzs7Ozs7OEJBR1U7QUFDTixVQUFJdUMsT0FBTyxHQUFHLEtBQUs1QyxJQUFMLENBQVVLLE1BQVYsQ0FBa0J3QyxNQUFsQixDQUF5QixVQUFDQyxDQUFELEVBQUlDLENBQUo7QUFBQSxlQUFVRCxDQUFDLEdBQUdDLENBQUMsQ0FBQ3JDLEVBQU4sR0FBWXFDLENBQUMsQ0FBQ3JDLEVBQWQsR0FBb0JvQyxDQUE5QjtBQUFBLE9BQXpCLEVBQTBELENBQTFELENBQWQ7QUFDQSxXQUFLOUMsSUFBTCxDQUFVVSxFQUFWLEdBQWVrQyxPQUFmO0FBQ0EsV0FBSzVDLElBQUwsQ0FBVUssTUFBVixDQUFrQjBCLE9BQWxCLENBQTBCLFVBQUFuQixLQUFLO0FBQUEsZUFBSUEsS0FBSyxDQUFDRixFQUFOLEdBQVdrQyxPQUFmO0FBQUEsT0FBL0I7QUFDSDtBQUVEOzs7Ozs7K0JBR1c7QUFDUCxXQUFLSSxPQUFMO0FBQ0EsYUFBT0MsSUFBSSxDQUFDQyxLQUFMLENBQVcsS0FBS0MsTUFBTCxFQUFYLENBQVA7QUFDSDtBQUVEOzs7Ozs7NkJBR1M7QUFDTCxXQUFLSCxPQUFMO0FBQ0EsYUFBT0MsSUFBSSxDQUFDRyxTQUFMLENBQWUsS0FBS3BELElBQXBCLENBQVA7QUFDSDs7Ozs7OztJQU1PcUIsUTs7O1dBQUFBLFE7QUFBQUEsRUFBQUEsUSxDQUFBQSxRO0FBQUFBLEVBQUFBLFEsQ0FBQUEsUTtBQUFBQSxFQUFBQSxRLENBQUFBLFE7QUFBQUEsRUFBQUEsUSxDQUFBQSxRO0dBQUFBLFEsd0JBQUFBLFEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBbmltYXRpb24sIFNoYXBlTGF5ZXIsIFJlZmVyZW5jZUlEIH0gZnJvbSBcIi4vYW5pbWF0aW9uXCI7XHJcbmltcG9ydCB7IEpTTW92aW5MYXllciwgTGF5ZXJGYWN0b3J5IH0gZnJvbSAnLi9sYXllcidcclxuaW1wb3J0IHV1aWQgZnJvbSAndXVpZC92NCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBKU01vdmluIHtcclxuICAgIHByaXZhdGUgcm9vdDogQW5pbWF0aW9uO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIGZwcyBudW1iZXIgb2YgZnJhbWVzIHBlciBzZWNvbmRcclxuICAgICAqIEBwYXJhbSB3aWR0aCB3aWR0aCBvZiB2aWV3cG9ydCAocHgpXHJcbiAgICAgKiBAcGFyYW0gaGVpZ2h0IGhlaWdodCBvZiB2aWV3cG9ydCAocHgpXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGZwczogbnVtYmVyID0gMzAsIHdpZHRoOiBudW1iZXIgPSA4MDAsIGhlaWdodDogbnVtYmVyID0gNjAwKSB7XHJcbiAgICAgICAgdGhpcy5yb290ID0ge1xyXG4gICAgICAgICAgICBmcjogZnBzLFxyXG4gICAgICAgICAgICB3OiB3aWR0aCxcclxuICAgICAgICAgICAgaDogaGVpZ2h0LFxyXG4gICAgICAgICAgICBkZGQ6IDAsXHJcbiAgICAgICAgICAgIGxheWVyczogW10sXHJcbiAgICAgICAgICAgIGFzc2V0czogW10sXHJcbiAgICAgICAgICAgIGZvbnRzOiB7XHJcbiAgICAgICAgICAgICAgICBsaXN0OiBbXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBpcDogMCxcclxuICAgICAgICAgICAgb3A6IDBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gZnBzIG51bWJlciBvZiBmcmFtZXMgcGVyIHNlY29uZFxyXG4gICAgICovXHJcbiAgICBzZXRGcmFtZVJhdGUoZnBzOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnJvb3QuZnIgPSBmcHNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB3aWR0aCB3aWR0aCBvZiB2aWV3cG9ydCAocHgpXHJcbiAgICAgKiBAcGFyYW0gaGVpZ2h0IGhlaWdodCBvZiB2aWV3cG9ydCAocHgpXHJcbiAgICAgKi9cclxuICAgIHNldFZpZXdwb3J0KHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5yb290LncgPSB3aWR0aFxyXG4gICAgICAgIHRoaXMucm9vdC5oID0gaGVpZ2h0XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBhZGQgYSBzaW1wbGUgZ3JhcGhpY2FsIGxheWVyXHJcbiAgICAgKiBAcGFyYW0gZG9tTGF5ZXJPckFzc2V0SWQgYSBTVkcgZWxlbWVudCBET00gb3IgSlNNb3ZpbkxheWVyIG9yIGFzc2V0IElEIG5lZWRzIHRvIGJlIGluc2VydGVkXHJcbiAgICAgKi9cclxuICAgIGFkZExheWVyKGRvbUxheWVyT3JBc3NldElkOiBTVkdHcmFwaGljc0VsZW1lbnQgfCBKU01vdmluTGF5ZXIgfCBSZWZlcmVuY2VJRCk6IEpTTW92aW5MYXllciB7XHJcbiAgICAgICAgbGV0IGxheWVyOiBKU01vdmluTGF5ZXI7XHJcbiAgICAgICAgaWYgKGRvbUxheWVyT3JBc3NldElkIGluc3RhbmNlb2YgU1ZHR3JhcGhpY3NFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGxheWVyID0gTGF5ZXJGYWN0b3J5LmhpZXJhcmNoeShkb21MYXllck9yQXNzZXRJZCwgdGhpcy5yb290LmFzc2V0cyEsIHRoaXMucm9vdC5mb250cyEpXHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgKGRvbUxheWVyT3JBc3NldElkKSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgbGF5ZXIgPSBMYXllckZhY3RvcnkucmVmKGRvbUxheWVyT3JBc3NldElkKVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbGF5ZXIgPSBkb21MYXllck9yQXNzZXRJZFxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJvb3QubGF5ZXJzIS5zcGxpY2UoMCwgMCwgbGF5ZXIucm9vdClcclxuICAgICAgICByZXR1cm4gbGF5ZXJcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSBtYXNrT3JEb20gYSBTVkcgZWxlbWVudCBET00gb3IgSlNNb3ZpbkxheWVyIHRvIGJlIHRoZSBtYXNrXHJcbiAgICAgKiBAcGFyYW0gbGF5ZXJSZWZPckluZGV4IGEgSlNNb3ZpbkxheWVyIG9yIGluZGV4IG9mIGxheWVyIHRvIGJlIHRoZSBtYXNrZWQgbGF5ZXJcclxuICAgICAqIEBwYXJhbSBtYXNrVHlwZSB3aGljaCB0eXBlIG9mIG1hc2sgdG8gdXNlLCB1c2UgYE1hc2tUeXBlLipgIHRvIHNwZWNpZnlcclxuICAgICAqL1xyXG4gICAgYWRkTWFzayhtYXNrT3JEb206IEpTTW92aW5MYXllciB8IFNWR0dyYXBoaWNzRWxlbWVudCwgbGF5ZXJSZWZPckluZGV4OiBudW1iZXIgfCBKU01vdmluTGF5ZXIsIG1hc2tUeXBlOiBNYXNrVHlwZSA9IE1hc2tUeXBlLkFscGhhKSB7XHJcbiAgICAgICAgbGV0IGxheWVyUmVmOiBKU01vdmluTGF5ZXJcclxuICAgICAgICBsZXQgbGF5ZXJJbmRleDogbnVtYmVyXHJcbiAgICAgICAgaWYgKGxheWVyUmVmT3JJbmRleCBpbnN0YW5jZW9mIEpTTW92aW5MYXllcikge1xyXG4gICAgICAgICAgICBsYXllclJlZiA9IGxheWVyUmVmT3JJbmRleFxyXG4gICAgICAgICAgICBsYXllckluZGV4ID0gdGhpcy5yb290LmxheWVycyEuaW5kZXhPZihsYXllclJlZi5yb290KVxyXG4gICAgICAgICAgICBsYXllclJlZi5yb290LnR0ID0gbWFza1R5cGVcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsYXllckluZGV4ID0gbGF5ZXJSZWZPckluZGV4XHJcbiAgICAgICAgICAgIHRoaXMucm9vdC5sYXllcnMhW2xheWVySW5kZXhdLnR0ID0gbWFza1R5cGVcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGxheWVySW5kZXggPCAwKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignR2l2ZW4gbGF5ZXIgaXMgbm90IGEgbWVtYmVyIG9mIHRoaXMgSlNNb3Zpbi4nKVxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgbWFza0xheWVyOiBKU01vdmluTGF5ZXJcclxuICAgICAgICBpZiAobWFza09yRG9tIGluc3RhbmNlb2YgU1ZHR3JhcGhpY3NFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIG1hc2tMYXllciA9IExheWVyRmFjdG9yeS5oaWVyYXJjaHkobWFza09yRG9tLCB0aGlzLnJvb3QuYXNzZXRzISwgdGhpcy5yb290LmZvbnRzISlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBtYXNrTGF5ZXIgPSBtYXNrT3JEb21cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yb290LmxheWVycyEuc3BsaWNlKGxheWVySW5kZXgsIDAsIG1hc2tMYXllci5yb290KVxyXG4gICAgICAgIHJldHVybiBtYXNrTGF5ZXJcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSBsYXllclJlZnMgYSBzZXQgb2YgbGF5ZXJzIHRvIGJlIHBhY2tlZCBhcyBhbiBhc3NldFxyXG4gICAgICovXHJcbiAgICBtYWtlQXNzZXQobGF5ZXJSZWZzOiBKU01vdmluTGF5ZXJbXSk6IFJlZmVyZW5jZUlEIHtcclxuICAgICAgICBsYXllclJlZnMuZm9yRWFjaCgobGF5ZXIsIGlubmVySW5kZXgpID0+IHtcclxuICAgICAgICAgICAgaWYgKGxheWVyLnJvb3QudHQgPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGF5ZXJJbmRleCA9IHRoaXMucm9vdC5sYXllcnMhLmluZGV4T2YobGF5ZXIucm9vdClcclxuICAgICAgICAgICAgICAgIGlmIChsYXllckluZGV4ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1hc2sgPSB0aGlzLnJvb3QubGF5ZXJzIVtsYXllckluZGV4IC0gMV1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5uZXJJbmRleCA9PSAwIHx8IGxheWVyUmVmc1tpbm5lckluZGV4IC0gMV0ucm9vdCAhPSBtYXNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxheWVyUmVmcy5zcGxpY2UoaW5uZXJJbmRleCwgMCwgbmV3IEpTTW92aW5MYXllcihtYXNrIGFzIFNoYXBlTGF5ZXIpKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgbGF5ZXJSZWZzID0gbGF5ZXJSZWZzLm1hcCgobGF5ZXIsIGlubmVySW5kZXgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGxheWVyLFxyXG4gICAgICAgICAgICAgICAgaW5uZXJJbmRleFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBhSW5kZXggPSB0aGlzLnJvb3QubGF5ZXJzIS5pbmRleE9mKGEubGF5ZXIucm9vdClcclxuICAgICAgICAgICAgY29uc3QgYkluZGV4ID0gdGhpcy5yb290LmxheWVycyEuaW5kZXhPZihiLmxheWVyLnJvb3QpXHJcbiAgICAgICAgICAgIHJldHVybiAoYUluZGV4IC0gYkluZGV4KSB8fCAoYS5pbm5lckluZGV4IC0gYi5pbm5lckluZGV4KVxyXG4gICAgICAgIH0pLm1hcChsYXllcldyYXBwZXIgPT4gbGF5ZXJXcmFwcGVyLmxheWVyKVxyXG4gICAgICAgIGxheWVyUmVmcy5mb3JFYWNoKGxheWVyID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbGF5ZXJJbmRleCA9IHRoaXMucm9vdC5sYXllcnMhLmluZGV4T2YobGF5ZXIucm9vdClcclxuICAgICAgICAgICAgaWYgKGxheWVySW5kZXggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3QubGF5ZXJzIS5zcGxpY2UobGF5ZXJJbmRleCwgMSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsYXllci5yb290Lm9wID0gOWU5XHJcbiAgICAgICAgfSlcclxuICAgICAgICBjb25zdCByZWZJZCA9IHV1aWQoKVxyXG4gICAgICAgIHRoaXMucm9vdC5hc3NldHMhLnB1c2goe1xyXG4gICAgICAgICAgICBpZDogcmVmSWQsXHJcbiAgICAgICAgICAgIGxheWVyczogbGF5ZXJSZWZzLm1hcChsYXllclJlZiA9PiBsYXllclJlZi5yb290KVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIHJlZklkXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gbGF5ZXJSZWZPckluZGV4IGEgSlNNb3ZpbkxheWVyIG9yIGluZGV4IG9mIGxheWVyIHRvIHJlbW92ZVxyXG4gICAgICovXHJcbiAgICByZW1vdmVMYXllcihsYXllclJlZk9ySW5kZXg6IG51bWJlciB8IEpTTW92aW5MYXllcikge1xyXG4gICAgICAgIGxldCBsYXllclJlZjogSlNNb3ZpbkxheWVyXHJcbiAgICAgICAgbGV0IGxheWVySW5kZXg6IG51bWJlclxyXG4gICAgICAgIGlmIChsYXllclJlZk9ySW5kZXggaW5zdGFuY2VvZiBKU01vdmluTGF5ZXIpIHtcclxuICAgICAgICAgICAgbGF5ZXJSZWYgPSBsYXllclJlZk9ySW5kZXhcclxuICAgICAgICAgICAgbGF5ZXJJbmRleCA9IHRoaXMucm9vdC5sYXllcnMhLmluZGV4T2YobGF5ZXJSZWYucm9vdClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsYXllckluZGV4ID0gbGF5ZXJSZWZPckluZGV4XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucm9vdC5sYXllcnMhLnNwbGljZShsYXllckluZGV4LCAxKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIGxheWVyUmVmT3JJbmRleCBhIEpTTW92aW5MYXllciBvciBpbmRleCBvZiBtYXNrIG9yIG1hc2tlZCBsYXllciB0byByZW1vdmVcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlTWFzayhsYXllclJlZk9ySW5kZXg6IG51bWJlciB8IEpTTW92aW5MYXllcikge1xyXG4gICAgICAgIGxldCBsYXllclJlZjogSlNNb3ZpbkxheWVyXHJcbiAgICAgICAgbGV0IGxheWVySW5kZXg6IG51bWJlclxyXG4gICAgICAgIGlmIChsYXllclJlZk9ySW5kZXggaW5zdGFuY2VvZiBKU01vdmluTGF5ZXIpIHtcclxuICAgICAgICAgICAgbGF5ZXJSZWYgPSBsYXllclJlZk9ySW5kZXhcclxuICAgICAgICAgICAgbGF5ZXJJbmRleCA9IHRoaXMucm9vdC5sYXllcnMhLmluZGV4T2YobGF5ZXJSZWYucm9vdClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsYXllckluZGV4ID0gbGF5ZXJSZWZPckluZGV4XHJcbiAgICAgICAgICAgIGxheWVyUmVmID0gbmV3IEpTTW92aW5MYXllcih0aGlzLnJvb3QubGF5ZXJzIVtsYXllckluZGV4XSBhcyBTaGFwZUxheWVyKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobGF5ZXJSZWYucm9vdC50dCkge1xyXG4gICAgICAgICAgICBsYXllclJlZi5yb290LnR0ID0gMFxyXG4gICAgICAgICAgICB0aGlzLnJvb3QubGF5ZXJzIS5zcGxpY2UobGF5ZXJJbmRleCAtIDEsIDEpXHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnJvb3QubGF5ZXJzIVtsYXllckluZGV4ICsgMV0udHQpIHtcclxuICAgICAgICAgICAgdGhpcy5yb290LmxheWVycyFbbGF5ZXJJbmRleCArIDFdLnR0ID0gMFxyXG4gICAgICAgICAgICB0aGlzLnJvb3QubGF5ZXJzIS5zcGxpY2UobGF5ZXJJbmRleCwgMSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBpbnB1dCBsYXllciBpcyBub3QgYSBtYXNrIG9yIGEgbWFza2VkIGxheWVyLicpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogY2xlYXIgYWxsIGxheWVyc1xyXG4gICAgICovXHJcbiAgICBjbGVhckxheWVycygpIHtcclxuICAgICAgICB0aGlzLnJvb3QubGF5ZXJzID0gW11cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIG1ha2UgYWxsIGxheWVycyBlbmQgYXQgc2FtZSB0aW1lXHJcbiAgICAgKi9cclxuICAgIHVuaWZvcm0oKSB7XHJcbiAgICAgICAgbGV0IG1heFRpbWUgPSB0aGlzLnJvb3QubGF5ZXJzIS5yZWR1Y2UoKHAsIHYpID0+IHAgPCB2Lm9wISA/IHYub3AhIDogcCwgMClcclxuICAgICAgICB0aGlzLnJvb3Qub3AgPSBtYXhUaW1lXHJcbiAgICAgICAgdGhpcy5yb290LmxheWVycyEuZm9yRWFjaChsYXllciA9PiBsYXllci5vcCA9IG1heFRpbWUpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBleHBvcnQgTG90dGllIGFzIEphdmFTY3JpcHQgT2JqZWN0IFxyXG4gICAgICovXHJcbiAgICB0b09iamVjdCgpIHtcclxuICAgICAgICB0aGlzLnVuaWZvcm0oKVxyXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRoaXMudG9KU09OKCkpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBleHBvcnQgTG90dGllIGFzIEpTT04gdGV4dFxyXG4gICAgICovXHJcbiAgICB0b0pTT04oKSB7XHJcbiAgICAgICAgdGhpcy51bmlmb3JtKClcclxuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5yb290KVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgeyBMYXllckZhY3RvcnkgfSBmcm9tICcuL2xheWVyJ1xyXG5leHBvcnQgeyBFYXNpbmdGYWN0b3J5IH0gZnJvbSAnLi9lYXNpbmcnXHJcbmV4cG9ydCB7IFBhdGhNYWtlciB9IGZyb20gJy4vcGF0aCdcclxuZXhwb3J0IGVudW0gTWFza1R5cGUge1xyXG4gICAgQWxwaGEgPSAxLFxyXG4gICAgSW52ZXJ0QWxwaGEgPSAyLFxyXG4gICAgTHVtYSA9IDMsXHJcbiAgICBJbnZlcnRMdW1hID0gNFxyXG59Il19