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
     * add a series of graphical layers
     * @param domOrLayers a SVG DOM may be the mixture of text, image and graphical elements or JSMovinLayers need to be inserted
     */

  }, {
    key: "addComplexLayer",
    value: function addComplexLayer(domOrLayers) {
      var layers;

      if (domOrLayers instanceof SVGGraphicsElement) {
        layers = _layer.LayerFactory.hierarchyAll(domOrLayers, this.root.assets, this.root.fonts);
      } else {
        layers = domOrLayers;
      }

      this.root.layers = layers.map(function (layer) {
        return layer.root;
      }).concat(this.root.layers);
      return layers;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9qc21vdmluLnRzIl0sIm5hbWVzIjpbIkpTTW92aW4iLCJmcHMiLCJ3aWR0aCIsImhlaWdodCIsInJvb3QiLCJmciIsInciLCJoIiwiZGRkIiwibGF5ZXJzIiwiYXNzZXRzIiwiZm9udHMiLCJsaXN0IiwiaXAiLCJvcCIsImRvbU9yTGF5ZXIiLCJsYXllciIsIlNWR0dyYXBoaWNzRWxlbWVudCIsIkxheWVyRmFjdG9yeSIsImhpZXJhcmNoeSIsInNwbGljZSIsImRvbU9yTGF5ZXJzIiwiaGllcmFyY2h5QWxsIiwibWFwIiwiY29uY2F0IiwibWFza09yRG9tIiwibGF5ZXJSZWZPckluZGV4IiwibWFza1R5cGUiLCJNYXNrVHlwZSIsIkFscGhhIiwibGF5ZXJSZWYiLCJsYXllckluZGV4IiwiSlNNb3ZpbkxheWVyIiwiaW5kZXhPZiIsInR0IiwiRXJyb3IiLCJtYXNrTGF5ZXIiLCJtYXhUaW1lIiwicmVkdWNlIiwicCIsInYiLCJmb3JFYWNoIiwidW5pZm9ybSIsIkpTT04iLCJwYXJzZSIsInRvSlNPTiIsInN0cmluZ2lmeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBOztBQThLQTs7Ozs7Ozs7OztJQTVLcUJBLE87OztBQUdqQjs7Ozs7QUFLQSxxQkFBeUU7QUFBQSxRQUE3REMsR0FBNkQsdUVBQS9DLEVBQStDO0FBQUEsUUFBM0NDLEtBQTJDLHVFQUEzQixHQUEyQjtBQUFBLFFBQXRCQyxNQUFzQix1RUFBTCxHQUFLOztBQUFBOztBQUFBOztBQUNyRSxTQUFLQyxJQUFMLEdBQVk7QUFDUkMsTUFBQUEsRUFBRSxFQUFFSixHQURJO0FBRVJLLE1BQUFBLENBQUMsRUFBRUosS0FGSztBQUdSSyxNQUFBQSxDQUFDLEVBQUVKLE1BSEs7QUFJUkssTUFBQUEsR0FBRyxFQUFFLENBSkc7QUFLUkMsTUFBQUEsTUFBTSxFQUFFLEVBTEE7QUFNUkMsTUFBQUEsTUFBTSxFQUFFLEVBTkE7QUFPUkMsTUFBQUEsS0FBSyxFQUFFO0FBQ0hD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SSxDQUFDRyxTQUFMLENBQWUsS0FBSzFDLElBQXBCLENBQVA7QUFDSDs7Ozs7OztJQUtPd0IsUTs7O1dBQUFBLFE7QUFBQUEsRUFBQUEsUSxDQUFBQSxRO0FBQUFBLEVBQUFBLFEsQ0FBQUEsUTtBQUFBQSxFQUFBQSxRLENBQUFBLFE7QUFBQUEsRUFBQUEsUSxDQUFBQSxRO0dBQUFBLFEsd0JBQUFBLFEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBbmltYXRpb24sIFNoYXBlTGF5ZXIgfSBmcm9tIFwiLi9hbmltYXRpb25cIjtcbmltcG9ydCB7IEpTTW92aW5MYXllciwgTGF5ZXJGYWN0b3J5IH0gZnJvbSAnLi9sYXllcidcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSlNNb3ZpbiB7XG4gICAgcHJpdmF0ZSByb290OiBBbmltYXRpb247XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gZnBzIG51bWJlciBvZiBmcmFtZXMgcGVyIHNlY29uZFxuICAgICAqIEBwYXJhbSB3aWR0aCB3aWR0aCBvZiB2aWV3cG9ydCAocHgpXG4gICAgICogQHBhcmFtIGhlaWdodCBoZWlnaHQgb2Ygdmlld3BvcnQgKHB4KVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGZwczogbnVtYmVyID0gMzAsIHdpZHRoOiBudW1iZXIgPSA4MDAsIGhlaWdodDogbnVtYmVyID0gNjAwKSB7XG4gICAgICAgIHRoaXMucm9vdCA9IHtcbiAgICAgICAgICAgIGZyOiBmcHMsXG4gICAgICAgICAgICB3OiB3aWR0aCxcbiAgICAgICAgICAgIGg6IGhlaWdodCxcbiAgICAgICAgICAgIGRkZDogMCxcbiAgICAgICAgICAgIGxheWVyczogW10sXG4gICAgICAgICAgICBhc3NldHM6IFtdLFxuICAgICAgICAgICAgZm9udHM6IHtcbiAgICAgICAgICAgICAgICBsaXN0OiBbXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGlwOiAwLFxuICAgICAgICAgICAgb3A6IDBcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBmcHMgbnVtYmVyIG9mIGZyYW1lcyBwZXIgc2Vjb25kXG4gICAgICovXG4gICAgc2V0RnJhbWVSYXRlKGZwczogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMucm9vdC5mciA9IGZwc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB3aWR0aCB3aWR0aCBvZiB2aWV3cG9ydCAocHgpXG4gICAgICogQHBhcmFtIGhlaWdodCBoZWlnaHQgb2Ygdmlld3BvcnQgKHB4KVxuICAgICAqL1xuICAgIHNldFZpZXdwb3J0KHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMucm9vdC53ID0gd2lkdGhcbiAgICAgICAgdGhpcy5yb290LmggPSBoZWlnaHRcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhZGQgYSBzaW1wbGUgZ3JhcGhpY2FsIGxheWVyXG4gICAgICogQHBhcmFtIGRvbU9yTGF5ZXIgYSBTVkcgZWxlbWVudCBET00gb3IgSlNNb3ZpbkxheWVyIG5lZWRzIHRvIGJlIGluc2VydGVkXG4gICAgICovXG4gICAgYWRkTGF5ZXIoZG9tT3JMYXllcjogU1ZHR3JhcGhpY3NFbGVtZW50IHwgSlNNb3ZpbkxheWVyKTogSlNNb3ZpbkxheWVyIHtcbiAgICAgICAgbGV0IGxheWVyOiBKU01vdmluTGF5ZXI7XG4gICAgICAgIGlmIChkb21PckxheWVyIGluc3RhbmNlb2YgU1ZHR3JhcGhpY3NFbGVtZW50KSB7XG4gICAgICAgICAgICBsYXllciA9IExheWVyRmFjdG9yeS5oaWVyYXJjaHkoZG9tT3JMYXllciwgdGhpcy5yb290LmFzc2V0cyEsIHRoaXMucm9vdC5mb250cyEpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsYXllciA9IGRvbU9yTGF5ZXJcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJvb3QubGF5ZXJzIS5zcGxpY2UoMCwgMCwgbGF5ZXIucm9vdClcbiAgICAgICAgcmV0dXJuIGxheWVyXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYWRkIGEgc2VyaWVzIG9mIGdyYXBoaWNhbCBsYXllcnNcbiAgICAgKiBAcGFyYW0gZG9tT3JMYXllcnMgYSBTVkcgRE9NIG1heSBiZSB0aGUgbWl4dHVyZSBvZiB0ZXh0LCBpbWFnZSBhbmQgZ3JhcGhpY2FsIGVsZW1lbnRzIG9yIEpTTW92aW5MYXllcnMgbmVlZCB0byBiZSBpbnNlcnRlZFxuICAgICAqL1xuICAgIGFkZENvbXBsZXhMYXllcihkb21PckxheWVyczogU1ZHR3JhcGhpY3NFbGVtZW50IHwgSlNNb3ZpbkxheWVyW10pOiBKU01vdmluTGF5ZXJbXSB7XG4gICAgICAgIGxldCBsYXllcnM6IEpTTW92aW5MYXllcltdXG4gICAgICAgIGlmIChkb21PckxheWVycyBpbnN0YW5jZW9mIFNWR0dyYXBoaWNzRWxlbWVudCkge1xuICAgICAgICAgICAgbGF5ZXJzID0gTGF5ZXJGYWN0b3J5LmhpZXJhcmNoeUFsbChkb21PckxheWVycywgdGhpcy5yb290LmFzc2V0cyEsIHRoaXMucm9vdC5mb250cyEpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsYXllcnMgPSBkb21PckxheWVyc1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucm9vdC5sYXllcnMgPSBsYXllcnMubWFwKGxheWVyID0+IGxheWVyLnJvb3QpLmNvbmNhdCh0aGlzLnJvb3QubGF5ZXJzISlcbiAgICAgICAgcmV0dXJuIGxheWVyc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBtYXNrT3JEb20gYSBTVkcgZWxlbWVudCBET00gb3IgSlNNb3ZpbkxheWVyIHRvIGJlIHRoZSBtYXNrXG4gICAgICogQHBhcmFtIGxheWVyUmVmT3JJbmRleCBhIEpTTW92aW5MYXllciBvciBpbmRleCBvZiBsYXllciB0byBiZSB0aGUgbWFza2VkIGxheWVyXG4gICAgICogQHBhcmFtIG1hc2tUeXBlIHdoaWNoIHR5cGUgb2YgbWFzayB0byB1c2UsIHVzZSBgTWFza1R5cGUuKmAgdG8gc3BlY2lmeVxuICAgICAqL1xuICAgIGFkZE1hc2sobWFza09yRG9tOiBKU01vdmluTGF5ZXIgfCBTVkdHcmFwaGljc0VsZW1lbnQsIGxheWVyUmVmT3JJbmRleDogbnVtYmVyIHwgSlNNb3ZpbkxheWVyLCBtYXNrVHlwZTogTWFza1R5cGUgPSBNYXNrVHlwZS5BbHBoYSkge1xuICAgICAgICBsZXQgbGF5ZXJSZWY6IEpTTW92aW5MYXllclxuICAgICAgICBsZXQgbGF5ZXJJbmRleDogbnVtYmVyXG4gICAgICAgIGlmIChsYXllclJlZk9ySW5kZXggaW5zdGFuY2VvZiBKU01vdmluTGF5ZXIpIHtcbiAgICAgICAgICAgIGxheWVyUmVmID0gbGF5ZXJSZWZPckluZGV4XG4gICAgICAgICAgICBsYXllckluZGV4ID0gdGhpcy5yb290LmxheWVycyEuaW5kZXhPZihsYXllclJlZi5yb290KVxuICAgICAgICAgICAgbGF5ZXJSZWYucm9vdC50dCA9IG1hc2tUeXBlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsYXllckluZGV4ID0gbGF5ZXJSZWZPckluZGV4XG4gICAgICAgICAgICB0aGlzLnJvb3QubGF5ZXJzIVtsYXllckluZGV4XS50dCA9IG1hc2tUeXBlXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxheWVySW5kZXggPCAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0dpdmVuIGxheWVyIGlzIG5vdCBhIG1lbWJlciBvZiB0aGlzIEpTTW92aW4uJylcbiAgICAgICAgfVxuICAgICAgICBsZXQgbWFza0xheWVyOiBKU01vdmluTGF5ZXJcbiAgICAgICAgaWYgKG1hc2tPckRvbSBpbnN0YW5jZW9mIFNWR0dyYXBoaWNzRWxlbWVudCkge1xuICAgICAgICAgICAgbWFza0xheWVyID0gTGF5ZXJGYWN0b3J5LmhpZXJhcmNoeShtYXNrT3JEb20sIHRoaXMucm9vdC5hc3NldHMhLCB0aGlzLnJvb3QuZm9udHMhKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWFza0xheWVyID0gbWFza09yRG9tXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yb290LmxheWVycyEuc3BsaWNlKGxheWVySW5kZXgsIDAsIG1hc2tMYXllci5yb290KVxuICAgICAgICByZXR1cm4gbWFza0xheWVyXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGxheWVyUmVmT3JJbmRleCBhIEpTTW92aW5MYXllciBvciBpbmRleCBvZiBsYXllciB0byByZW1vdmVcbiAgICAgKi9cbiAgICByZW1vdmVMYXllcihsYXllclJlZk9ySW5kZXg6IG51bWJlciB8IEpTTW92aW5MYXllcikge1xuICAgICAgICBsZXQgbGF5ZXJSZWY6IEpTTW92aW5MYXllclxuICAgICAgICBsZXQgbGF5ZXJJbmRleDogbnVtYmVyXG4gICAgICAgIGlmIChsYXllclJlZk9ySW5kZXggaW5zdGFuY2VvZiBKU01vdmluTGF5ZXIpIHtcbiAgICAgICAgICAgIGxheWVyUmVmID0gbGF5ZXJSZWZPckluZGV4XG4gICAgICAgICAgICBsYXllckluZGV4ID0gdGhpcy5yb290LmxheWVycyEuaW5kZXhPZihsYXllclJlZi5yb290KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGF5ZXJJbmRleCA9IGxheWVyUmVmT3JJbmRleFxuICAgICAgICB9XG4gICAgICAgIHRoaXMucm9vdC5sYXllcnMhLnNwbGljZShsYXllckluZGV4LCAxKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBsYXllclJlZk9ySW5kZXggYSBKU01vdmluTGF5ZXIgb3IgaW5kZXggb2YgbWFzayBvciBtYXNrZWQgbGF5ZXIgdG8gcmVtb3ZlXG4gICAgICovXG4gICAgcmVtb3ZlTWFzayhsYXllclJlZk9ySW5kZXg6IG51bWJlciB8IEpTTW92aW5MYXllcikge1xuICAgICAgICBsZXQgbGF5ZXJSZWY6IEpTTW92aW5MYXllclxuICAgICAgICBsZXQgbGF5ZXJJbmRleDogbnVtYmVyXG4gICAgICAgIGlmIChsYXllclJlZk9ySW5kZXggaW5zdGFuY2VvZiBKU01vdmluTGF5ZXIpIHtcbiAgICAgICAgICAgIGxheWVyUmVmID0gbGF5ZXJSZWZPckluZGV4XG4gICAgICAgICAgICBsYXllckluZGV4ID0gdGhpcy5yb290LmxheWVycyEuaW5kZXhPZihsYXllclJlZi5yb290KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGF5ZXJJbmRleCA9IGxheWVyUmVmT3JJbmRleFxuICAgICAgICAgICAgbGF5ZXJSZWYgPSBuZXcgSlNNb3ZpbkxheWVyKHRoaXMucm9vdC5sYXllcnMhW2xheWVySW5kZXhdIGFzIFNoYXBlTGF5ZXIpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxheWVyUmVmLnJvb3QudHQpIHtcbiAgICAgICAgICAgIGxheWVyUmVmLnJvb3QudHQgPSAwXG4gICAgICAgICAgICB0aGlzLnJvb3QubGF5ZXJzIS5zcGxpY2UobGF5ZXJJbmRleCAtIDEsIDEpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5yb290LmxheWVycyFbbGF5ZXJJbmRleCArIDFdLnR0KSB7XG4gICAgICAgICAgICB0aGlzLnJvb3QubGF5ZXJzIVtsYXllckluZGV4ICsgMV0udHQgPSAwXG4gICAgICAgICAgICB0aGlzLnJvb3QubGF5ZXJzIS5zcGxpY2UobGF5ZXJJbmRleCwgMSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGlucHV0IGxheWVyIGlzIG5vdCBhIG1hc2sgb3IgYSBtYXNrZWQgbGF5ZXIuJylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNsZWFyIGFsbCBsYXllcnNcbiAgICAgKi9cbiAgICBjbGVhckxheWVycygpIHtcbiAgICAgICAgdGhpcy5yb290LmxheWVycyA9IFtdXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogbWFrZSBhbGwgbGF5ZXJzIGVuZCBhdCBzYW1lIHRpbWVcbiAgICAgKi9cbiAgICB1bmlmb3JtKCkge1xuICAgICAgICBsZXQgbWF4VGltZSA9IHRoaXMucm9vdC5sYXllcnMhLnJlZHVjZSgocCwgdikgPT4gcCA8IHYub3AhID8gdi5vcCEgOiBwLCAwKVxuICAgICAgICB0aGlzLnJvb3Qub3AgPSBtYXhUaW1lXG4gICAgICAgIHRoaXMucm9vdC5sYXllcnMhLmZvckVhY2gobGF5ZXIgPT4gbGF5ZXIub3AgPSBtYXhUaW1lKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGV4cG9ydCBMb3R0aWUgYXMgSmF2YVNjcmlwdCBPYmplY3QgXG4gICAgICovXG4gICAgdG9PYmplY3QoKSB7XG4gICAgICAgIHRoaXMudW5pZm9ybSgpXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRoaXMudG9KU09OKCkpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZXhwb3J0IExvdHRpZSBhcyBKU09OIHRleHRcbiAgICAgKi9cbiAgICB0b0pTT04oKSB7XG4gICAgICAgIHRoaXMudW5pZm9ybSgpXG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLnJvb3QpXG4gICAgfVxufVxuXG5leHBvcnQgeyBMYXllckZhY3RvcnkgfSBmcm9tICcuL2xheWVyJ1xuZXhwb3J0IHsgRWFzaW5nRmFjdG9yeSB9IGZyb20gJy4vZWFzaW5nJ1xuZXhwb3J0IGVudW0gTWFza1R5cGUge1xuICAgIEFscGhhID0gMSxcbiAgICBJbnZlcnRBbHBoYSA9IDIsXG4gICAgTHVtYSA9IDMsXG4gICAgSW52ZXJ0THVtYSA9IDRcbn0iXX0=