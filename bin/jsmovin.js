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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9qc21vdmluLnRzIl0sIm5hbWVzIjpbIkpTTW92aW4iLCJmcHMiLCJ3aWR0aCIsImhlaWdodCIsInJvb3QiLCJmciIsInciLCJoIiwiZGRkIiwibGF5ZXJzIiwiYXNzZXRzIiwiZm9udHMiLCJsaXN0IiwiaXAiLCJvcCIsImRvbU9yTGF5ZXIiLCJsYXllciIsIlNWR0dyYXBoaWNzRWxlbWVudCIsIkxheWVyRmFjdG9yeSIsImhpZXJhcmNoeSIsInNwbGljZSIsImRvbU9yTGF5ZXJzIiwiaGllcmFyY2h5QWxsIiwibWFwIiwiY29uY2F0IiwibWFza09yRG9tIiwibGF5ZXJSZWZPckluZGV4IiwibWFza1R5cGUiLCJNYXNrVHlwZSIsIkFscGhhIiwibGF5ZXJSZWYiLCJsYXllckluZGV4IiwiSlNNb3ZpbkxheWVyIiwiaW5kZXhPZiIsInR0IiwiRXJyb3IiLCJtYXNrTGF5ZXIiLCJtYXhUaW1lIiwicmVkdWNlIiwicCIsInYiLCJmb3JFYWNoIiwidW5pZm9ybSIsIkpTT04iLCJwYXJzZSIsInRvSlNPTiIsInN0cmluZ2lmeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBOztBQTZLQTs7Ozs7Ozs7OztJQTNLcUJBLE87OztBQUdqQjs7Ozs7QUFLQSxxQkFBeUU7QUFBQSxRQUE3REMsR0FBNkQsdUVBQS9DLEVBQStDO0FBQUEsUUFBM0NDLEtBQTJDLHVFQUEzQixHQUEyQjtBQUFBLFFBQXRCQyxNQUFzQix1RUFBTCxHQUFLOztBQUFBOztBQUFBOztBQUNyRSxTQUFLQyxJQUFMLEdBQVk7QUFDUkMsTUFBQUEsRUFBRSxFQUFFSixHQURJO0FBRVJLLE1BQUFBLENBQUMsRUFBRUosS0FGSztBQUdSSyxNQUFBQSxDQUFDLEVBQUVKLE1BSEs7QUFJUkssTUFBQUEsR0FBRyxFQUFFLENBSkc7QUFLUkMsTUFBQUEsTUFBTSxFQUFFLEVBTEE7QUFNUkMsTUFBQUEsTUFBTSxFQUFFLEVBTkE7QUFPUkMsTUFBQUEsS0FBSyxFQUFFO0FBQ0hD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ZSxLQUFLMUMsSUFBcEIsQ0FBUDtBQUNIOzs7Ozs7O0lBS093QixROzs7V0FBQUEsUTtBQUFBQSxFQUFBQSxRLENBQUFBLFE7QUFBQUEsRUFBQUEsUSxDQUFBQSxRO0FBQUFBLEVBQUFBLFEsQ0FBQUEsUTtBQUFBQSxFQUFBQSxRLENBQUFBLFE7R0FBQUEsUSx3QkFBQUEsUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFuaW1hdGlvbiwgU2hhcGVMYXllciB9IGZyb20gXCIuL2FuaW1hdGlvblwiO1xuaW1wb3J0IHsgSlNNb3ZpbkxheWVyLCBMYXllckZhY3RvcnkgfSBmcm9tICcuL2xheWVyJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBKU01vdmluIHtcbiAgICBwcml2YXRlIHJvb3Q6IEFuaW1hdGlvbjtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBmcHMgbnVtYmVyIG9mIGZyYW1lcyBwZXIgc2Vjb25kXG4gICAgICogQHBhcmFtIHdpZHRoIHdpZHRoIG9mIHZpZXdwb3J0IChweClcbiAgICAgKiBAcGFyYW0gaGVpZ2h0IGhlaWdodCBvZiB2aWV3cG9ydCAocHgpXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZnBzOiBudW1iZXIgPSAzMCwgd2lkdGg6IG51bWJlciA9IDgwMCwgaGVpZ2h0OiBudW1iZXIgPSA2MDApIHtcbiAgICAgICAgdGhpcy5yb290ID0ge1xuICAgICAgICAgICAgZnI6IGZwcyxcbiAgICAgICAgICAgIHc6IHdpZHRoLFxuICAgICAgICAgICAgaDogaGVpZ2h0LFxuICAgICAgICAgICAgZGRkOiAwLFxuICAgICAgICAgICAgbGF5ZXJzOiBbXSxcbiAgICAgICAgICAgIGFzc2V0czogW10sXG4gICAgICAgICAgICBmb250czoge1xuICAgICAgICAgICAgICAgIGxpc3Q6IFtdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaXA6IDAsXG4gICAgICAgICAgICBvcDogMFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGZwcyBudW1iZXIgb2YgZnJhbWVzIHBlciBzZWNvbmRcbiAgICAgKi9cbiAgICBzZXRGcmFtZVJhdGUoZnBzOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5yb290LmZyID0gZnBzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHdpZHRoIHdpZHRoIG9mIHZpZXdwb3J0IChweClcbiAgICAgKiBAcGFyYW0gaGVpZ2h0IGhlaWdodCBvZiB2aWV3cG9ydCAocHgpXG4gICAgICovXG4gICAgc2V0Vmlld3BvcnQod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5yb290LncgPSB3aWR0aFxuICAgICAgICB0aGlzLnJvb3QuaCA9IGhlaWdodFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFkZCBhIHNpbXBsZSBncmFwaGljYWwgbGF5ZXJcbiAgICAgKiBAcGFyYW0gZG9tT3JMYXllciBhIFNWRyBlbGVtZW50IERPTSBvciBKU01vdmluTGF5ZXIgbmVlZHMgdG8gYmUgaW5zZXJ0ZWRcbiAgICAgKi9cbiAgICBhZGRMYXllcihkb21PckxheWVyOiBTVkdHcmFwaGljc0VsZW1lbnQgfCBKU01vdmluTGF5ZXIpOiBKU01vdmluTGF5ZXIge1xuICAgICAgICBsZXQgbGF5ZXI6IEpTTW92aW5MYXllcjtcbiAgICAgICAgaWYgKGRvbU9yTGF5ZXIgaW5zdGFuY2VvZiBTVkdHcmFwaGljc0VsZW1lbnQpIHtcbiAgICAgICAgICAgIGxheWVyID0gTGF5ZXJGYWN0b3J5LmhpZXJhcmNoeShkb21PckxheWVyLCB0aGlzLnJvb3QuYXNzZXRzISwgdGhpcy5yb290LmZvbnRzISlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxheWVyID0gZG9tT3JMYXllclxuICAgICAgICB9XG4gICAgICAgIHRoaXMucm9vdC5sYXllcnMhLnNwbGljZSgwLCAwLCBsYXllci5yb290KVxuICAgICAgICByZXR1cm4gbGF5ZXJcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhZGQgYSBzZXJpZXMgb2YgZ3JhcGhpY2FsIGxheWVyc1xuICAgICAqIEBwYXJhbSBkb21PckxheWVycyBhIFNWRyBET00gbWF5IGJlIHRoZSBtaXh0dXJlIG9mIHRleHQsIGltYWdlIGFuZCBncmFwaGljYWwgZWxlbWVudHMgb3IgSlNNb3ZpbkxheWVycyBuZWVkIHRvIGJlIGluc2VydGVkXG4gICAgICovXG4gICAgYWRkQ29tcGxleExheWVyKGRvbU9yTGF5ZXJzOiBTVkdHcmFwaGljc0VsZW1lbnQgfCBKU01vdmluTGF5ZXJbXSk6IEpTTW92aW5MYXllcltdIHtcbiAgICAgICAgbGV0IGxheWVyczogSlNNb3ZpbkxheWVyW11cbiAgICAgICAgaWYgKGRvbU9yTGF5ZXJzIGluc3RhbmNlb2YgU1ZHR3JhcGhpY3NFbGVtZW50KSB7XG4gICAgICAgICAgICBsYXllcnMgPSBMYXllckZhY3RvcnkuaGllcmFyY2h5QWxsKGRvbU9yTGF5ZXJzLCB0aGlzLnJvb3QuYXNzZXRzISwgdGhpcy5yb290LmZvbnRzISlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxheWVycyA9IGRvbU9yTGF5ZXJzXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yb290LmxheWVycyA9IGxheWVycy5tYXAobGF5ZXIgPT4gbGF5ZXIucm9vdCkuY29uY2F0KHRoaXMucm9vdC5sYXllcnMhKVxuICAgICAgICByZXR1cm4gbGF5ZXJzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIG1hc2tPckRvbSBhIFNWRyBlbGVtZW50IERPTSBvciBKU01vdmluTGF5ZXIgdG8gYmUgdGhlIG1hc2tcbiAgICAgKiBAcGFyYW0gbGF5ZXJSZWZPckluZGV4IGEgSlNNb3ZpbkxheWVyIG9yIGluZGV4IG9mIGxheWVyIHRvIGJlIHRoZSBtYXNrZWQgbGF5ZXJcbiAgICAgKiBAcGFyYW0gbWFza1R5cGUgd2hpY2ggdHlwZSBvZiBtYXNrIHRvIHVzZSwgdXNlIGBNYXNrVHlwZS4qYCB0byBzcGVjaWZ5XG4gICAgICovXG4gICAgYWRkTWFzayhtYXNrT3JEb206IEpTTW92aW5MYXllciB8IFNWR0dyYXBoaWNzRWxlbWVudCwgbGF5ZXJSZWZPckluZGV4OiBudW1iZXIgfCBKU01vdmluTGF5ZXIsIG1hc2tUeXBlOiBNYXNrVHlwZSA9IE1hc2tUeXBlLkFscGhhKSB7XG4gICAgICAgIGxldCBsYXllclJlZjogSlNNb3ZpbkxheWVyXG4gICAgICAgIGxldCBsYXllckluZGV4OiBudW1iZXJcbiAgICAgICAgaWYgKGxheWVyUmVmT3JJbmRleCBpbnN0YW5jZW9mIEpTTW92aW5MYXllcikge1xuICAgICAgICAgICAgbGF5ZXJSZWYgPSBsYXllclJlZk9ySW5kZXhcbiAgICAgICAgICAgIGxheWVySW5kZXggPSB0aGlzLnJvb3QubGF5ZXJzIS5pbmRleE9mKGxheWVyUmVmLnJvb3QpXG4gICAgICAgICAgICBsYXllclJlZi5yb290LnR0ID0gbWFza1R5cGVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxheWVySW5kZXggPSBsYXllclJlZk9ySW5kZXhcbiAgICAgICAgICAgIHRoaXMucm9vdC5sYXllcnMhW2xheWVySW5kZXhdLnR0ID0gbWFza1R5cGVcbiAgICAgICAgfVxuICAgICAgICBpZiAobGF5ZXJJbmRleCA8IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignR2l2ZW4gbGF5ZXIgaXMgbm90IGEgbWVtYmVyIG9mIHRoaXMgSlNNb3Zpbi4nKVxuICAgICAgICB9XG4gICAgICAgIGxldCBtYXNrTGF5ZXI6IEpTTW92aW5MYXllclxuICAgICAgICBpZiAobWFza09yRG9tIGluc3RhbmNlb2YgU1ZHR3JhcGhpY3NFbGVtZW50KSB7XG4gICAgICAgICAgICBtYXNrTGF5ZXIgPSBMYXllckZhY3RvcnkuaGllcmFyY2h5KG1hc2tPckRvbSwgdGhpcy5yb290LmFzc2V0cyEsIHRoaXMucm9vdC5mb250cyEpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtYXNrTGF5ZXIgPSBtYXNrT3JEb21cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJvb3QubGF5ZXJzIS5zcGxpY2UobGF5ZXJJbmRleCwgMCwgbWFza0xheWVyLnJvb3QpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGxheWVyUmVmT3JJbmRleCBhIEpTTW92aW5MYXllciBvciBpbmRleCBvZiBsYXllciB0byByZW1vdmVcbiAgICAgKi9cbiAgICByZW1vdmVMYXllcihsYXllclJlZk9ySW5kZXg6IG51bWJlciB8IEpTTW92aW5MYXllcikge1xuICAgICAgICBsZXQgbGF5ZXJSZWY6IEpTTW92aW5MYXllclxuICAgICAgICBsZXQgbGF5ZXJJbmRleDogbnVtYmVyXG4gICAgICAgIGlmIChsYXllclJlZk9ySW5kZXggaW5zdGFuY2VvZiBKU01vdmluTGF5ZXIpIHtcbiAgICAgICAgICAgIGxheWVyUmVmID0gbGF5ZXJSZWZPckluZGV4XG4gICAgICAgICAgICBsYXllckluZGV4ID0gdGhpcy5yb290LmxheWVycyEuaW5kZXhPZihsYXllclJlZi5yb290KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGF5ZXJJbmRleCA9IGxheWVyUmVmT3JJbmRleFxuICAgICAgICB9XG4gICAgICAgIHRoaXMucm9vdC5sYXllcnMhLnNwbGljZShsYXllckluZGV4LCAxKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBsYXllclJlZk9ySW5kZXggYSBKU01vdmluTGF5ZXIgb3IgaW5kZXggb2YgbWFzayBvciBtYXNrZWQgbGF5ZXIgdG8gcmVtb3ZlXG4gICAgICovXG4gICAgcmVtb3ZlTWFzayhsYXllclJlZk9ySW5kZXg6IG51bWJlciB8IEpTTW92aW5MYXllcikge1xuICAgICAgICBsZXQgbGF5ZXJSZWY6IEpTTW92aW5MYXllclxuICAgICAgICBsZXQgbGF5ZXJJbmRleDogbnVtYmVyXG4gICAgICAgIGlmIChsYXllclJlZk9ySW5kZXggaW5zdGFuY2VvZiBKU01vdmluTGF5ZXIpIHtcbiAgICAgICAgICAgIGxheWVyUmVmID0gbGF5ZXJSZWZPckluZGV4XG4gICAgICAgICAgICBsYXllckluZGV4ID0gdGhpcy5yb290LmxheWVycyEuaW5kZXhPZihsYXllclJlZi5yb290KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGF5ZXJJbmRleCA9IGxheWVyUmVmT3JJbmRleFxuICAgICAgICAgICAgbGF5ZXJSZWYgPSBuZXcgSlNNb3ZpbkxheWVyKHRoaXMucm9vdC5sYXllcnMhW2xheWVySW5kZXhdIGFzIFNoYXBlTGF5ZXIpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxheWVyUmVmLnJvb3QudHQpIHtcbiAgICAgICAgICAgIGxheWVyUmVmLnJvb3QudHQgPSAwXG4gICAgICAgICAgICB0aGlzLnJvb3QubGF5ZXJzIS5zcGxpY2UobGF5ZXJJbmRleCAtIDEsIDEpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5yb290LmxheWVycyFbbGF5ZXJJbmRleCArIDFdLnR0KSB7XG4gICAgICAgICAgICB0aGlzLnJvb3QubGF5ZXJzIVtsYXllckluZGV4ICsgMV0udHQgPSAwXG4gICAgICAgICAgICB0aGlzLnJvb3QubGF5ZXJzIS5zcGxpY2UobGF5ZXJJbmRleCwgMSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGlucHV0IGxheWVyIGlzIG5vdCBhIG1hc2sgb3IgYSBtYXNrZWQgbGF5ZXIuJylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNsZWFyIGFsbCBsYXllcnNcbiAgICAgKi9cbiAgICBjbGVhckxheWVycygpIHtcbiAgICAgICAgdGhpcy5yb290LmxheWVycyA9IFtdXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogbWFrZSBhbGwgbGF5ZXJzIGVuZCBhdCBzYW1lIHRpbWVcbiAgICAgKi9cbiAgICB1bmlmb3JtKCkge1xuICAgICAgICBsZXQgbWF4VGltZSA9IHRoaXMucm9vdC5sYXllcnMhLnJlZHVjZSgocCwgdikgPT4gcCA8IHYub3AhID8gdi5vcCEgOiBwLCAwKVxuICAgICAgICB0aGlzLnJvb3Qub3AgPSBtYXhUaW1lXG4gICAgICAgIHRoaXMucm9vdC5sYXllcnMhLmZvckVhY2gobGF5ZXIgPT4gbGF5ZXIub3AgPSBtYXhUaW1lKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGV4cG9ydCBMb3R0aWUgYXMgSmF2YVNjcmlwdCBPYmplY3QgXG4gICAgICovXG4gICAgdG9PYmplY3QoKSB7XG4gICAgICAgIHRoaXMudW5pZm9ybSgpXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRoaXMudG9KU09OKCkpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZXhwb3J0IExvdHRpZSBhcyBKU09OIHRleHRcbiAgICAgKi9cbiAgICB0b0pTT04oKSB7XG4gICAgICAgIHRoaXMudW5pZm9ybSgpXG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLnJvb3QpXG4gICAgfVxufVxuXG5leHBvcnQgeyBMYXllckZhY3RvcnkgfSBmcm9tICcuL2xheWVyJ1xuZXhwb3J0IHsgRWFzaW5nRmFjdG9yeSB9IGZyb20gJy4vZWFzaW5nJ1xuZXhwb3J0IGVudW0gTWFza1R5cGUge1xuICAgIEFscGhhID0gMSxcbiAgICBJbnZlcnRBbHBoYSA9IDIsXG4gICAgTHVtYSA9IDMsXG4gICAgSW52ZXJ0THVtYSA9IDRcbn0iXX0=