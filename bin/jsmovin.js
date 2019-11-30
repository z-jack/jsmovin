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
     * @param domOrLayer a SVG element DOM or JSMovinLayer needs to be inserted
     */

  }, {
    key: "addLayer",
    value: function addLayer(domOrLayer) {
      var layer;

      if (domOrLayer instanceof SVGGraphicsElement) {
        layer = _layer.LayerFactory.hierarchy(domOrLayer, this.root.assets, this.root.fonts);
      } else {
        layer = domOrLayer;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9qc21vdmluLnRzIl0sIm5hbWVzIjpbIkpTTW92aW4iLCJmcHMiLCJ3aWR0aCIsImhlaWdodCIsInJvb3QiLCJmciIsInciLCJoIiwiZGRkIiwibGF5ZXJzIiwiYXNzZXRzIiwiZm9udHMiLCJsaXN0IiwiaXAiLCJvcCIsImRvbU9yTGF5ZXIiLCJsYXllciIsIlNWR0dyYXBoaWNzRWxlbWVudCIsIkxheWVyRmFjdG9yeSIsImhpZXJhcmNoeSIsInNwbGljZSIsIm1hc2tPckRvbSIsImxheWVyUmVmT3JJbmRleCIsIm1hc2tUeXBlIiwiTWFza1R5cGUiLCJBbHBoYSIsImxheWVyUmVmIiwibGF5ZXJJbmRleCIsIkpTTW92aW5MYXllciIsImluZGV4T2YiLCJ0dCIsIkVycm9yIiwibWFza0xheWVyIiwibGF5ZXJSZWZzIiwiZm9yRWFjaCIsImlubmVySW5kZXgiLCJtYXNrIiwibWFwIiwic29ydCIsImEiLCJiIiwiYUluZGV4IiwiYkluZGV4IiwibGF5ZXJXcmFwcGVyIiwicmVmSWQiLCJwdXNoIiwiaWQiLCJtYXhUaW1lIiwicmVkdWNlIiwicCIsInYiLCJ1bmlmb3JtIiwiSlNPTiIsInBhcnNlIiwidG9KU09OIiwic3RyaW5naWZ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7O0FBQ0E7O0FBc01BOztBQUNBOzs7Ozs7Ozs7Ozs7SUFyTXFCQSxPOzs7QUFHakI7Ozs7O0FBS0EscUJBQXlFO0FBQUEsUUFBN0RDLEdBQTZELHVFQUEvQyxFQUErQztBQUFBLFFBQTNDQyxLQUEyQyx1RUFBM0IsR0FBMkI7QUFBQSxRQUF0QkMsTUFBc0IsdUVBQUwsR0FBSzs7QUFBQTs7QUFBQTs7QUFDckUsU0FBS0MsSUFBTCxHQUFZO0FBQ1JDLE1BQUFBLEVBQUUsRUFBRUosR0FESTtBQUVSSyxNQUFBQSxDQUFDLEVBQUVKLEtBRks7QUFHUkssTUFBQUEsQ0FBQyxFQUFFSixNQUhLO0FBSVJLLE1BQUFBLEdBQUcsRUFBRSxDQUpH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VUFBQ0MsQ0FBRCxFQUFJQyxDQUFKO0FBQUEsZUFBVUQsQ0FBQyxHQUFHQyxDQUFDLENBQUNwQyxFQUFOLEdBQVlvQyxDQUFDLENBQUNwQyxFQUFkLEdBQW9CbUMsQ0FBOUI7QUFBQSxPQUF6QixFQUEwRCxDQUExRCxDQUFkO0FBQ0EsV0FBSzdDLElBQUwsQ0FBVVUsRUFBVixHQUFlaUMsT0FBZjtBQUNBLFdBQUszQyxJQUFMLENBQVVLLE1BQVYsQ0FBa0J5QixPQUFsQixDQUEwQixVQUFBbEIsS0FBSztBQUFBLGVBQUlBLEtBQUssQ0FBQ0YsRUFBTixHQUFXaUMsT0FBZjtBQUFBLE9BQS9CO0FBQ0g7QUFFRDs7Ozs7OytCQUdXO0FBQ1AsV0FBS0ksT0FBTDtBQUNBLGFBQU9DLElBQUksQ0FBQ0MsS0FBTCxDQUFXLEtBQUtDLE1BQUwsRUFBWCxDQUFQO0FBQ0g7QUFFRDs7Ozs7OzZCQUdTO0FBQ0wsV0FBS0gsT0FBTDtBQUNBLGFBQU9DLElBQUksQ0FBQ0csU0FBTCxDQUFlLEtBQUtuRCxJQUFwQixDQUFQO0FBQ0g7Ozs7Ozs7SUFNT29CLFE7OztXQUFBQSxRO0FBQUFBLEVBQUFBLFEsQ0FBQUEsUTtBQUFBQSxFQUFBQSxRLENBQUFBLFE7QUFBQUEsRUFBQUEsUSxDQUFBQSxRO0FBQUFBLEVBQUFBLFEsQ0FBQUEsUTtHQUFBQSxRLHdCQUFBQSxRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQW5pbWF0aW9uLCBTaGFwZUxheWVyLCBSZWZlcmVuY2VJRCB9IGZyb20gXCIuL2FuaW1hdGlvblwiO1xuaW1wb3J0IHsgSlNNb3ZpbkxheWVyLCBMYXllckZhY3RvcnkgfSBmcm9tICcuL2xheWVyJ1xuaW1wb3J0IHV1aWQgZnJvbSAndXVpZC92NCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEpTTW92aW4ge1xuICAgIHByaXZhdGUgcm9vdDogQW5pbWF0aW9uO1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGZwcyBudW1iZXIgb2YgZnJhbWVzIHBlciBzZWNvbmRcbiAgICAgKiBAcGFyYW0gd2lkdGggd2lkdGggb2Ygdmlld3BvcnQgKHB4KVxuICAgICAqIEBwYXJhbSBoZWlnaHQgaGVpZ2h0IG9mIHZpZXdwb3J0IChweClcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihmcHM6IG51bWJlciA9IDMwLCB3aWR0aDogbnVtYmVyID0gODAwLCBoZWlnaHQ6IG51bWJlciA9IDYwMCkge1xuICAgICAgICB0aGlzLnJvb3QgPSB7XG4gICAgICAgICAgICBmcjogZnBzLFxuICAgICAgICAgICAgdzogd2lkdGgsXG4gICAgICAgICAgICBoOiBoZWlnaHQsXG4gICAgICAgICAgICBkZGQ6IDAsXG4gICAgICAgICAgICBsYXllcnM6IFtdLFxuICAgICAgICAgICAgYXNzZXRzOiBbXSxcbiAgICAgICAgICAgIGZvbnRzOiB7XG4gICAgICAgICAgICAgICAgbGlzdDogW11cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpcDogMCxcbiAgICAgICAgICAgIG9wOiAwXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gZnBzIG51bWJlciBvZiBmcmFtZXMgcGVyIHNlY29uZFxuICAgICAqL1xuICAgIHNldEZyYW1lUmF0ZShmcHM6IG51bWJlcikge1xuICAgICAgICB0aGlzLnJvb3QuZnIgPSBmcHNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gd2lkdGggd2lkdGggb2Ygdmlld3BvcnQgKHB4KVxuICAgICAqIEBwYXJhbSBoZWlnaHQgaGVpZ2h0IG9mIHZpZXdwb3J0IChweClcbiAgICAgKi9cbiAgICBzZXRWaWV3cG9ydCh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xuICAgICAgICB0aGlzLnJvb3QudyA9IHdpZHRoXG4gICAgICAgIHRoaXMucm9vdC5oID0gaGVpZ2h0XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYWRkIGEgc2ltcGxlIGdyYXBoaWNhbCBsYXllclxuICAgICAqIEBwYXJhbSBkb21PckxheWVyIGEgU1ZHIGVsZW1lbnQgRE9NIG9yIEpTTW92aW5MYXllciBuZWVkcyB0byBiZSBpbnNlcnRlZFxuICAgICAqL1xuICAgIGFkZExheWVyKGRvbU9yTGF5ZXI6IFNWR0dyYXBoaWNzRWxlbWVudCB8IEpTTW92aW5MYXllcik6IEpTTW92aW5MYXllciB7XG4gICAgICAgIGxldCBsYXllcjogSlNNb3ZpbkxheWVyO1xuICAgICAgICBpZiAoZG9tT3JMYXllciBpbnN0YW5jZW9mIFNWR0dyYXBoaWNzRWxlbWVudCkge1xuICAgICAgICAgICAgbGF5ZXIgPSBMYXllckZhY3RvcnkuaGllcmFyY2h5KGRvbU9yTGF5ZXIsIHRoaXMucm9vdC5hc3NldHMhLCB0aGlzLnJvb3QuZm9udHMhKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGF5ZXIgPSBkb21PckxheWVyXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yb290LmxheWVycyEuc3BsaWNlKDAsIDAsIGxheWVyLnJvb3QpXG4gICAgICAgIHJldHVybiBsYXllclxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBtYXNrT3JEb20gYSBTVkcgZWxlbWVudCBET00gb3IgSlNNb3ZpbkxheWVyIHRvIGJlIHRoZSBtYXNrXG4gICAgICogQHBhcmFtIGxheWVyUmVmT3JJbmRleCBhIEpTTW92aW5MYXllciBvciBpbmRleCBvZiBsYXllciB0byBiZSB0aGUgbWFza2VkIGxheWVyXG4gICAgICogQHBhcmFtIG1hc2tUeXBlIHdoaWNoIHR5cGUgb2YgbWFzayB0byB1c2UsIHVzZSBgTWFza1R5cGUuKmAgdG8gc3BlY2lmeVxuICAgICAqL1xuICAgIGFkZE1hc2sobWFza09yRG9tOiBKU01vdmluTGF5ZXIgfCBTVkdHcmFwaGljc0VsZW1lbnQsIGxheWVyUmVmT3JJbmRleDogbnVtYmVyIHwgSlNNb3ZpbkxheWVyLCBtYXNrVHlwZTogTWFza1R5cGUgPSBNYXNrVHlwZS5BbHBoYSkge1xuICAgICAgICBsZXQgbGF5ZXJSZWY6IEpTTW92aW5MYXllclxuICAgICAgICBsZXQgbGF5ZXJJbmRleDogbnVtYmVyXG4gICAgICAgIGlmIChsYXllclJlZk9ySW5kZXggaW5zdGFuY2VvZiBKU01vdmluTGF5ZXIpIHtcbiAgICAgICAgICAgIGxheWVyUmVmID0gbGF5ZXJSZWZPckluZGV4XG4gICAgICAgICAgICBsYXllckluZGV4ID0gdGhpcy5yb290LmxheWVycyEuaW5kZXhPZihsYXllclJlZi5yb290KVxuICAgICAgICAgICAgbGF5ZXJSZWYucm9vdC50dCA9IG1hc2tUeXBlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsYXllckluZGV4ID0gbGF5ZXJSZWZPckluZGV4XG4gICAgICAgICAgICB0aGlzLnJvb3QubGF5ZXJzIVtsYXllckluZGV4XS50dCA9IG1hc2tUeXBlXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxheWVySW5kZXggPCAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0dpdmVuIGxheWVyIGlzIG5vdCBhIG1lbWJlciBvZiB0aGlzIEpTTW92aW4uJylcbiAgICAgICAgfVxuICAgICAgICBsZXQgbWFza0xheWVyOiBKU01vdmluTGF5ZXJcbiAgICAgICAgaWYgKG1hc2tPckRvbSBpbnN0YW5jZW9mIFNWR0dyYXBoaWNzRWxlbWVudCkge1xuICAgICAgICAgICAgbWFza0xheWVyID0gTGF5ZXJGYWN0b3J5LmhpZXJhcmNoeShtYXNrT3JEb20sIHRoaXMucm9vdC5hc3NldHMhLCB0aGlzLnJvb3QuZm9udHMhKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWFza0xheWVyID0gbWFza09yRG9tXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yb290LmxheWVycyEuc3BsaWNlKGxheWVySW5kZXgsIDAsIG1hc2tMYXllci5yb290KVxuICAgICAgICByZXR1cm4gbWFza0xheWVyXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGxheWVyUmVmcyBhIHNldCBvZiBsYXllcnMgdG8gYmUgcGFja2VkIGFzIGFuIGFzc2V0XG4gICAgICovXG4gICAgbWFrZUFzc2V0KGxheWVyUmVmczogSlNNb3ZpbkxheWVyW10pOiBSZWZlcmVuY2VJRCB7XG4gICAgICAgIGxheWVyUmVmcy5mb3JFYWNoKChsYXllciwgaW5uZXJJbmRleCkgPT4ge1xuICAgICAgICAgICAgaWYgKGxheWVyLnJvb3QudHQgPT0gMSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxheWVySW5kZXggPSB0aGlzLnJvb3QubGF5ZXJzIS5pbmRleE9mKGxheWVyLnJvb3QpXG4gICAgICAgICAgICAgICAgaWYgKGxheWVySW5kZXggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1hc2sgPSB0aGlzLnJvb3QubGF5ZXJzIVtsYXllckluZGV4IC0gMV1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlubmVySW5kZXggPT0gMCB8fCBsYXllclJlZnNbaW5uZXJJbmRleCAtIDFdLnJvb3QgIT0gbWFzaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGF5ZXJSZWZzLnNwbGljZShpbm5lckluZGV4LCAwLCBuZXcgSlNNb3ZpbkxheWVyKG1hc2sgYXMgU2hhcGVMYXllcikpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIGxheWVyUmVmcyA9IGxheWVyUmVmcy5tYXAoKGxheWVyLCBpbm5lckluZGV4KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGxheWVyLFxuICAgICAgICAgICAgICAgIGlubmVySW5kZXhcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgY29uc3QgYUluZGV4ID0gdGhpcy5yb290LmxheWVycyEuaW5kZXhPZihhLmxheWVyLnJvb3QpXG4gICAgICAgICAgICBjb25zdCBiSW5kZXggPSB0aGlzLnJvb3QubGF5ZXJzIS5pbmRleE9mKGIubGF5ZXIucm9vdClcbiAgICAgICAgICAgIHJldHVybiAoYUluZGV4IC0gYkluZGV4KSB8fCAoYS5pbm5lckluZGV4IC0gYi5pbm5lckluZGV4KVxuICAgICAgICB9KS5tYXAobGF5ZXJXcmFwcGVyID0+IGxheWVyV3JhcHBlci5sYXllcilcbiAgICAgICAgbGF5ZXJSZWZzLmZvckVhY2gobGF5ZXIgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGF5ZXJJbmRleCA9IHRoaXMucm9vdC5sYXllcnMhLmluZGV4T2YobGF5ZXIucm9vdClcbiAgICAgICAgICAgIGlmIChsYXllckluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMucm9vdC5sYXllcnMhLnNwbGljZShsYXllckluZGV4LCAxKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICBjb25zdCByZWZJZCA9IHV1aWQoKVxuICAgICAgICB0aGlzLnJvb3QuYXNzZXRzIS5wdXNoKHtcbiAgICAgICAgICAgIGlkOiByZWZJZCxcbiAgICAgICAgICAgIGxheWVyczogbGF5ZXJSZWZzLm1hcChsYXllclJlZiA9PiBsYXllclJlZi5yb290KVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gcmVmSWRcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gbGF5ZXJSZWZPckluZGV4IGEgSlNNb3ZpbkxheWVyIG9yIGluZGV4IG9mIGxheWVyIHRvIHJlbW92ZVxuICAgICAqL1xuICAgIHJlbW92ZUxheWVyKGxheWVyUmVmT3JJbmRleDogbnVtYmVyIHwgSlNNb3ZpbkxheWVyKSB7XG4gICAgICAgIGxldCBsYXllclJlZjogSlNNb3ZpbkxheWVyXG4gICAgICAgIGxldCBsYXllckluZGV4OiBudW1iZXJcbiAgICAgICAgaWYgKGxheWVyUmVmT3JJbmRleCBpbnN0YW5jZW9mIEpTTW92aW5MYXllcikge1xuICAgICAgICAgICAgbGF5ZXJSZWYgPSBsYXllclJlZk9ySW5kZXhcbiAgICAgICAgICAgIGxheWVySW5kZXggPSB0aGlzLnJvb3QubGF5ZXJzIS5pbmRleE9mKGxheWVyUmVmLnJvb3QpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsYXllckluZGV4ID0gbGF5ZXJSZWZPckluZGV4XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yb290LmxheWVycyEuc3BsaWNlKGxheWVySW5kZXgsIDEpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGxheWVyUmVmT3JJbmRleCBhIEpTTW92aW5MYXllciBvciBpbmRleCBvZiBtYXNrIG9yIG1hc2tlZCBsYXllciB0byByZW1vdmVcbiAgICAgKi9cbiAgICByZW1vdmVNYXNrKGxheWVyUmVmT3JJbmRleDogbnVtYmVyIHwgSlNNb3ZpbkxheWVyKSB7XG4gICAgICAgIGxldCBsYXllclJlZjogSlNNb3ZpbkxheWVyXG4gICAgICAgIGxldCBsYXllckluZGV4OiBudW1iZXJcbiAgICAgICAgaWYgKGxheWVyUmVmT3JJbmRleCBpbnN0YW5jZW9mIEpTTW92aW5MYXllcikge1xuICAgICAgICAgICAgbGF5ZXJSZWYgPSBsYXllclJlZk9ySW5kZXhcbiAgICAgICAgICAgIGxheWVySW5kZXggPSB0aGlzLnJvb3QubGF5ZXJzIS5pbmRleE9mKGxheWVyUmVmLnJvb3QpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsYXllckluZGV4ID0gbGF5ZXJSZWZPckluZGV4XG4gICAgICAgICAgICBsYXllclJlZiA9IG5ldyBKU01vdmluTGF5ZXIodGhpcy5yb290LmxheWVycyFbbGF5ZXJJbmRleF0gYXMgU2hhcGVMYXllcilcbiAgICAgICAgfVxuICAgICAgICBpZiAobGF5ZXJSZWYucm9vdC50dCkge1xuICAgICAgICAgICAgbGF5ZXJSZWYucm9vdC50dCA9IDBcbiAgICAgICAgICAgIHRoaXMucm9vdC5sYXllcnMhLnNwbGljZShsYXllckluZGV4IC0gMSwgMSlcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnJvb3QubGF5ZXJzIVtsYXllckluZGV4ICsgMV0udHQpIHtcbiAgICAgICAgICAgIHRoaXMucm9vdC5sYXllcnMhW2xheWVySW5kZXggKyAxXS50dCA9IDBcbiAgICAgICAgICAgIHRoaXMucm9vdC5sYXllcnMhLnNwbGljZShsYXllckluZGV4LCAxKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgaW5wdXQgbGF5ZXIgaXMgbm90IGEgbWFzayBvciBhIG1hc2tlZCBsYXllci4nKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY2xlYXIgYWxsIGxheWVyc1xuICAgICAqL1xuICAgIGNsZWFyTGF5ZXJzKCkge1xuICAgICAgICB0aGlzLnJvb3QubGF5ZXJzID0gW11cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBtYWtlIGFsbCBsYXllcnMgZW5kIGF0IHNhbWUgdGltZVxuICAgICAqL1xuICAgIHVuaWZvcm0oKSB7XG4gICAgICAgIGxldCBtYXhUaW1lID0gdGhpcy5yb290LmxheWVycyEucmVkdWNlKChwLCB2KSA9PiBwIDwgdi5vcCEgPyB2Lm9wISA6IHAsIDApXG4gICAgICAgIHRoaXMucm9vdC5vcCA9IG1heFRpbWVcbiAgICAgICAgdGhpcy5yb290LmxheWVycyEuZm9yRWFjaChsYXllciA9PiBsYXllci5vcCA9IG1heFRpbWUpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZXhwb3J0IExvdHRpZSBhcyBKYXZhU2NyaXB0IE9iamVjdCBcbiAgICAgKi9cbiAgICB0b09iamVjdCgpIHtcbiAgICAgICAgdGhpcy51bmlmb3JtKClcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGhpcy50b0pTT04oKSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBleHBvcnQgTG90dGllIGFzIEpTT04gdGV4dFxuICAgICAqL1xuICAgIHRvSlNPTigpIHtcbiAgICAgICAgdGhpcy51bmlmb3JtKClcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMucm9vdClcbiAgICB9XG59XG5cbmV4cG9ydCB7IExheWVyRmFjdG9yeSB9IGZyb20gJy4vbGF5ZXInXG5leHBvcnQgeyBFYXNpbmdGYWN0b3J5IH0gZnJvbSAnLi9lYXNpbmcnXG5leHBvcnQgeyBQYXRoTWFrZXIgfSBmcm9tICcuL3BhdGgnXG5leHBvcnQgZW51bSBNYXNrVHlwZSB7XG4gICAgQWxwaGEgPSAxLFxuICAgIEludmVydEFscGhhID0gMixcbiAgICBMdW1hID0gMyxcbiAgICBJbnZlcnRMdW1hID0gNFxufSJdfQ==