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
exports.MaskType = exports["default"] = void 0;

var _layer = require("./layer");

var _easing = require("./easing");

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

      this.root.layers.push(layer.root);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9qc21vdmluLnRzIl0sIm5hbWVzIjpbIkpTTW92aW4iLCJmcHMiLCJ3aWR0aCIsImhlaWdodCIsInJvb3QiLCJmciIsInciLCJoIiwiZGRkIiwibGF5ZXJzIiwiYXNzZXRzIiwiZm9udHMiLCJsaXN0IiwiaXAiLCJvcCIsImRvbU9yTGF5ZXIiLCJsYXllciIsIlNWR0dyYXBoaWNzRWxlbWVudCIsIkxheWVyRmFjdG9yeSIsImhpZXJhcmNoeSIsInB1c2giLCJtYXNrT3JEb20iLCJsYXllclJlZk9ySW5kZXgiLCJtYXNrVHlwZSIsIk1hc2tUeXBlIiwiQWxwaGEiLCJsYXllclJlZiIsImxheWVySW5kZXgiLCJKU01vdmluTGF5ZXIiLCJpbmRleE9mIiwidHQiLCJFcnJvciIsIm1hc2tMYXllciIsInNwbGljZSIsIm1heFRpbWUiLCJyZWR1Y2UiLCJwIiwidiIsImZvckVhY2giLCJ1bmlmb3JtIiwiSlNPTiIsInBhcnNlIiwidG9KU09OIiwic3RyaW5naWZ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7O0FBNkpBOzs7Ozs7Ozs7O0lBM0pxQkEsTzs7O0FBR2pCOzs7OztBQUtBLHFCQUF5RTtBQUFBLFFBQTdEQyxHQUE2RCx1RUFBL0MsRUFBK0M7QUFBQSxRQUEzQ0MsS0FBMkMsdUVBQTNCLEdBQTJCO0FBQUEsUUFBdEJDLE1BQXNCLHVFQUFMLEdBQUs7O0FBQUE7O0FBQUE7O0FBQ3JFLFNBQUtDLElBQUwsR0FBWTtBQUNSQyxNQUFBQSxFQUFFLEVBQUVKLEdBREk7QUFFUkssTUFBQUEsQ0FBQyxFQUFFSixLQUZLO0FBR1JLLE1BQUFBLENBQUMsRUFBRUosTUFISztBQUlSSyxNQUFBQSxHQUFHLEVBQUUsQ0FKRztBQUtSQyxNQUFBQSxNQUFNLEVBQUUsRUFMQTtBQU1SQyxNQUFBQSxNQUFNLEVBQUUsRUFOQTtBQU9SQyxNQUFBQSxLQUFLLEVBQUU7QUFDSEMsUUFBQUEsSUFBSSxFQUFFO0FBREgsT0FQQztBQVVSQyxNQUFB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QUlDLENBQUo7QUFBQSxlQUFVRCxDQUFDLEdBQUdDLENBQUMsQ0FBQ3ZCLEVBQU4sR0FBWXVCLENBQUMsQ0FBQ3ZCLEVBQWQsR0FBb0JzQixDQUE5QjtBQUFBLE9BQXpCLEVBQTBELENBQTFELENBQWQ7QUFDQSxXQUFLaEMsSUFBTCxDQUFVVSxFQUFWLEdBQWVvQixPQUFmO0FBQ0EsV0FBSzlCLElBQUwsQ0FBVUssTUFBVixDQUFrQjZCLE9BQWxCLENBQTBCLFVBQUF0QixLQUFLO0FBQUEsZUFBSUEsS0FBSyxDQUFDRixFQUFOLEdBQVdvQixPQUFmO0FBQUEsT0FBL0I7QUFDSDtBQUVEOzs7Ozs7K0JBR1c7QUFDUCxXQUFLSyxPQUFMO0FBQ0EsYUFBT0MsSUFBSSxDQUFDQyxLQUFMLENBQVcsS0FBS0MsTUFBTCxFQUFYLENBQVA7QUFDSDtBQUVEOzs7Ozs7NkJBR1M7QUFDTCxXQUFLSCxPQUFMO0FBQ0EsYUFBT0MsSUFBSSxDQUFDRyxTQUFMLENBQWUsS0FBS3ZDLElBQXBCLENBQVA7QUFDSDs7Ozs7OztJQUtPb0IsUTs7O1dBQUFBLFE7QUFBQUEsRUFBQUEsUSxDQUFBQSxRO0FBQUFBLEVBQUFBLFEsQ0FBQUEsUTtBQUFBQSxFQUFBQSxRLENBQUFBLFE7QUFBQUEsRUFBQUEsUSxDQUFBQSxRO0dBQUFBLFEsd0JBQUFBLFEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBbmltYXRpb24sIFNoYXBlTGF5ZXIsIEltYWdlTGF5ZXIsIFRleHRMYXllciwgVHJhbnNmb3JtIH0gZnJvbSBcIi4vYW5pbWF0aW9uXCI7XG5pbXBvcnQgeyBKU01vdmluTGF5ZXIsIExheWVyRmFjdG9yeSB9IGZyb20gJy4vbGF5ZXInXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEpTTW92aW4ge1xuICAgIHByaXZhdGUgcm9vdDogQW5pbWF0aW9uO1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGZwcyBudW1iZXIgb2YgZnJhbWVzIHBlciBzZWNvbmRcbiAgICAgKiBAcGFyYW0gd2lkdGggd2lkdGggb2Ygdmlld3BvcnQgKHB4KVxuICAgICAqIEBwYXJhbSBoZWlnaHQgaGVpZ2h0IG9mIHZpZXdwb3J0IChweClcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihmcHM6IG51bWJlciA9IDMwLCB3aWR0aDogbnVtYmVyID0gODAwLCBoZWlnaHQ6IG51bWJlciA9IDYwMCkge1xuICAgICAgICB0aGlzLnJvb3QgPSB7XG4gICAgICAgICAgICBmcjogZnBzLFxuICAgICAgICAgICAgdzogd2lkdGgsXG4gICAgICAgICAgICBoOiBoZWlnaHQsXG4gICAgICAgICAgICBkZGQ6IDAsXG4gICAgICAgICAgICBsYXllcnM6IFtdLFxuICAgICAgICAgICAgYXNzZXRzOiBbXSxcbiAgICAgICAgICAgIGZvbnRzOiB7XG4gICAgICAgICAgICAgICAgbGlzdDogW11cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpcDogMCxcbiAgICAgICAgICAgIG9wOiAwXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gZnBzIG51bWJlciBvZiBmcmFtZXMgcGVyIHNlY29uZFxuICAgICAqL1xuICAgIHNldEZyYW1lUmF0ZShmcHM6IG51bWJlcikge1xuICAgICAgICB0aGlzLnJvb3QuZnIgPSBmcHNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gd2lkdGggd2lkdGggb2Ygdmlld3BvcnQgKHB4KVxuICAgICAqIEBwYXJhbSBoZWlnaHQgaGVpZ2h0IG9mIHZpZXdwb3J0IChweClcbiAgICAgKi9cbiAgICBzZXRWaWV3cG9ydCh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xuICAgICAgICB0aGlzLnJvb3QudyA9IHdpZHRoXG4gICAgICAgIHRoaXMucm9vdC5oID0gaGVpZ2h0XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGRvbU9yTGF5ZXIgYSBTVkcgZWxlbWVudCBET00gb3IgSlNNb3ZpbkxheWVyIG5lZWRzIHRvIGJlIGluc2VydGVkXG4gICAgICovXG4gICAgYWRkTGF5ZXIoZG9tT3JMYXllcjogU1ZHR3JhcGhpY3NFbGVtZW50IHwgSlNNb3ZpbkxheWVyKTogSlNNb3ZpbkxheWVyIHtcbiAgICAgICAgbGV0IGxheWVyOiBKU01vdmluTGF5ZXI7XG4gICAgICAgIGlmIChkb21PckxheWVyIGluc3RhbmNlb2YgU1ZHR3JhcGhpY3NFbGVtZW50KSB7XG4gICAgICAgICAgICBsYXllciA9IExheWVyRmFjdG9yeS5oaWVyYXJjaHkoZG9tT3JMYXllciwgdGhpcy5yb290LmFzc2V0cyEsIHRoaXMucm9vdC5mb250cyEpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsYXllciA9IGRvbU9yTGF5ZXJcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJvb3QubGF5ZXJzIS5wdXNoKGxheWVyLnJvb3QpXG4gICAgICAgIHJldHVybiBsYXllclxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBtYXNrT3JEb20gYSBTVkcgZWxlbWVudCBET00gb3IgSlNNb3ZpbkxheWVyIHRvIGJlIHRoZSBtYXNrXG4gICAgICogQHBhcmFtIGxheWVyUmVmT3JJbmRleCBhIEpTTW92aW5MYXllciBvciBpbmRleCBvZiBsYXllciB0byBiZSB0aGUgbWFza2VkIGxheWVyXG4gICAgICogQHBhcmFtIG1hc2tUeXBlIHdoaWNoIHR5cGUgb2YgbWFzayB0byB1c2UsIHVzZSBgTWFza1R5cGUuKmAgdG8gc3BlY2lmeVxuICAgICAqL1xuICAgIGFkZE1hc2sobWFza09yRG9tOiBKU01vdmluTGF5ZXIgfCBTVkdHcmFwaGljc0VsZW1lbnQsIGxheWVyUmVmT3JJbmRleDogbnVtYmVyIHwgSlNNb3ZpbkxheWVyLCBtYXNrVHlwZTogTWFza1R5cGUgPSBNYXNrVHlwZS5BbHBoYSkge1xuICAgICAgICBsZXQgbGF5ZXJSZWY6IEpTTW92aW5MYXllclxuICAgICAgICBsZXQgbGF5ZXJJbmRleDogbnVtYmVyXG4gICAgICAgIGlmIChsYXllclJlZk9ySW5kZXggaW5zdGFuY2VvZiBKU01vdmluTGF5ZXIpIHtcbiAgICAgICAgICAgIGxheWVyUmVmID0gbGF5ZXJSZWZPckluZGV4XG4gICAgICAgICAgICBsYXllckluZGV4ID0gdGhpcy5yb290LmxheWVycyEuaW5kZXhPZihsYXllclJlZi5yb290KVxuICAgICAgICAgICAgbGF5ZXJSZWYucm9vdC50dCA9IG1hc2tUeXBlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsYXllckluZGV4ID0gbGF5ZXJSZWZPckluZGV4XG4gICAgICAgICAgICB0aGlzLnJvb3QubGF5ZXJzIVtsYXllckluZGV4XS50dCA9IG1hc2tUeXBlXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxheWVySW5kZXggPCAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0dpdmVuIGxheWVyIGlzIG5vdCBhIG1lbWJlciBvZiB0aGlzIEpTTW92aW4uJylcbiAgICAgICAgfVxuICAgICAgICBsZXQgbWFza0xheWVyOiBKU01vdmluTGF5ZXJcbiAgICAgICAgaWYgKG1hc2tPckRvbSBpbnN0YW5jZW9mIFNWR0dyYXBoaWNzRWxlbWVudCkge1xuICAgICAgICAgICAgbWFza0xheWVyID0gTGF5ZXJGYWN0b3J5LmhpZXJhcmNoeShtYXNrT3JEb20sIHRoaXMucm9vdC5hc3NldHMhLCB0aGlzLnJvb3QuZm9udHMhKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWFza0xheWVyID0gbWFza09yRG9tXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yb290LmxheWVycyEuc3BsaWNlKGxheWVySW5kZXgsIDAsIG1hc2tMYXllci5yb290KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBsYXllclJlZk9ySW5kZXggYSBKU01vdmluTGF5ZXIgb3IgaW5kZXggb2YgbGF5ZXIgdG8gcmVtb3ZlXG4gICAgICovXG4gICAgcmVtb3ZlTGF5ZXIobGF5ZXJSZWZPckluZGV4OiBudW1iZXIgfCBKU01vdmluTGF5ZXIpIHtcbiAgICAgICAgbGV0IGxheWVyUmVmOiBKU01vdmluTGF5ZXJcbiAgICAgICAgbGV0IGxheWVySW5kZXg6IG51bWJlclxuICAgICAgICBpZiAobGF5ZXJSZWZPckluZGV4IGluc3RhbmNlb2YgSlNNb3ZpbkxheWVyKSB7XG4gICAgICAgICAgICBsYXllclJlZiA9IGxheWVyUmVmT3JJbmRleFxuICAgICAgICAgICAgbGF5ZXJJbmRleCA9IHRoaXMucm9vdC5sYXllcnMhLmluZGV4T2YobGF5ZXJSZWYucm9vdClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxheWVySW5kZXggPSBsYXllclJlZk9ySW5kZXhcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJvb3QubGF5ZXJzIS5zcGxpY2UobGF5ZXJJbmRleCwgMSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gbGF5ZXJSZWZPckluZGV4IGEgSlNNb3ZpbkxheWVyIG9yIGluZGV4IG9mIG1hc2sgb3IgbWFza2VkIGxheWVyIHRvIHJlbW92ZVxuICAgICAqL1xuICAgIHJlbW92ZU1hc2sobGF5ZXJSZWZPckluZGV4OiBudW1iZXIgfCBKU01vdmluTGF5ZXIpIHtcbiAgICAgICAgbGV0IGxheWVyUmVmOiBKU01vdmluTGF5ZXJcbiAgICAgICAgbGV0IGxheWVySW5kZXg6IG51bWJlclxuICAgICAgICBpZiAobGF5ZXJSZWZPckluZGV4IGluc3RhbmNlb2YgSlNNb3ZpbkxheWVyKSB7XG4gICAgICAgICAgICBsYXllclJlZiA9IGxheWVyUmVmT3JJbmRleFxuICAgICAgICAgICAgbGF5ZXJJbmRleCA9IHRoaXMucm9vdC5sYXllcnMhLmluZGV4T2YobGF5ZXJSZWYucm9vdClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxheWVySW5kZXggPSBsYXllclJlZk9ySW5kZXhcbiAgICAgICAgICAgIGxheWVyUmVmID0gbmV3IEpTTW92aW5MYXllcih0aGlzLnJvb3QubGF5ZXJzIVtsYXllckluZGV4XSBhcyBTaGFwZUxheWVyKVxuICAgICAgICB9XG4gICAgICAgIGlmIChsYXllclJlZi5yb290LnR0KSB7XG4gICAgICAgICAgICBsYXllclJlZi5yb290LnR0ID0gMFxuICAgICAgICAgICAgdGhpcy5yb290LmxheWVycyEuc3BsaWNlKGxheWVySW5kZXggLSAxLCAxKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucm9vdC5sYXllcnMhW2xheWVySW5kZXggKyAxXS50dCkge1xuICAgICAgICAgICAgdGhpcy5yb290LmxheWVycyFbbGF5ZXJJbmRleCArIDFdLnR0ID0gMFxuICAgICAgICAgICAgdGhpcy5yb290LmxheWVycyEuc3BsaWNlKGxheWVySW5kZXgsIDEpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBpbnB1dCBsYXllciBpcyBub3QgYSBtYXNrIG9yIGEgbWFza2VkIGxheWVyLicpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjbGVhciBhbGwgbGF5ZXJzXG4gICAgICovXG4gICAgY2xlYXJMYXllcnMoKSB7XG4gICAgICAgIHRoaXMucm9vdC5sYXllcnMgPSBbXVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG1ha2UgYWxsIGxheWVycyBlbmQgYXQgc2FtZSB0aW1lXG4gICAgICovXG4gICAgdW5pZm9ybSgpIHtcbiAgICAgICAgbGV0IG1heFRpbWUgPSB0aGlzLnJvb3QubGF5ZXJzIS5yZWR1Y2UoKHAsIHYpID0+IHAgPCB2Lm9wISA/IHYub3AhIDogcCwgMClcbiAgICAgICAgdGhpcy5yb290Lm9wID0gbWF4VGltZVxuICAgICAgICB0aGlzLnJvb3QubGF5ZXJzIS5mb3JFYWNoKGxheWVyID0+IGxheWVyLm9wID0gbWF4VGltZSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBleHBvcnQgTG90dGllIGFzIEphdmFTY3JpcHQgT2JqZWN0IFxuICAgICAqL1xuICAgIHRvT2JqZWN0KCkge1xuICAgICAgICB0aGlzLnVuaWZvcm0oKVxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0aGlzLnRvSlNPTigpKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGV4cG9ydCBMb3R0aWUgYXMgSlNPTiB0ZXh0XG4gICAgICovXG4gICAgdG9KU09OKCkge1xuICAgICAgICB0aGlzLnVuaWZvcm0oKVxuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5yb290KVxuICAgIH1cbn1cblxuZXhwb3J0IHsgTGF5ZXJGYWN0b3J5IH0gZnJvbSAnLi9sYXllcidcbmV4cG9ydCB7IEVhc2luZ0ZhY3RvcnkgfSBmcm9tICcuL2Vhc2luZydcbmV4cG9ydCBlbnVtIE1hc2tUeXBlIHtcbiAgICBBbHBoYSA9IDEsXG4gICAgSW52ZXJ0QWxwaGEgPSAyLFxuICAgIEx1bWEgPSAzLFxuICAgIEludmVydEx1bWEgPSA0XG59Il19