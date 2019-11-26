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
  _createClass(JSMovin, [{
    key: "addProperty",
    value: function addProperty(obj, key, value) {
      Object.defineProperty(obj, key, {
        value: value,
        writable: true,
        enumerable: false
      });
    }
    /**
     * @param fps number of frames per second
     * @param width width of viewport (px)
     * @param height height of viewport (px)
     */

  }]);

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
  }, {
    key: "toObject",
    value: function toObject() {
      this.uniform();
      return JSON.parse(this.toJSON());
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9qc21vdmluLnRzIl0sIm5hbWVzIjpbIkpTTW92aW4iLCJvYmoiLCJrZXkiLCJ2YWx1ZSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5Iiwid3JpdGFibGUiLCJlbnVtZXJhYmxlIiwiZnBzIiwid2lkdGgiLCJoZWlnaHQiLCJyb290IiwiZnIiLCJ3IiwiaCIsImRkZCIsImxheWVycyIsImFzc2V0cyIsImZvbnRzIiwibGlzdCIsImlwIiwib3AiLCJkb21PckxheWVyIiwibGF5ZXIiLCJTVkdHcmFwaGljc0VsZW1lbnQiLCJMYXllckZhY3RvcnkiLCJoaWVyYXJjaHkiLCJwdXNoIiwibWFza09yRG9tIiwibGF5ZXJSZWZPckluZGV4IiwibWFza1R5cGUiLCJNYXNrVHlwZSIsIkFscGhhIiwibGF5ZXJSZWYiLCJsYXllckluZGV4IiwiSlNNb3ZpbkxheWVyIiwiaW5kZXhPZiIsInR0IiwiRXJyb3IiLCJtYXNrTGF5ZXIiLCJzcGxpY2UiLCJtYXhUaW1lIiwicmVkdWNlIiwicCIsInYiLCJmb3JFYWNoIiwidW5pZm9ybSIsIkpTT04iLCJwYXJzZSIsInRvSlNPTiIsInN0cmluZ2lmeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBOztBQWtHQTs7Ozs7Ozs7OztJQS9GcUJBLE87Ozs7O2dDQUVHQyxHLEVBQVVDLEcsRUFBc0JDLEssRUFBWTtBQUM1REMsTUFBQUEsTUFBTSxDQUFDQyxjQUFQLENBQXNCSixHQUF0QixFQUEyQkMsR0FBM0IsRUFBZ0M7QUFBRUMsUUFBQUEsS0FBSyxFQUFMQSxLQUFGO0FBQVNHLFFBQUFBLFFBQVEsRUFBRSxJQUFuQjtBQUF5QkMsUUFBQUEsVUFBVSxFQUFFO0FBQXJDLE9BQWhDO0FBQ0g7QUFFRDs7Ozs7Ozs7QUFLQSxxQkFBeUU7QUFBQSxRQUE3REMsR0FBNkQsdUVBQS9DLEVBQStDO0FBQUEsUUFBM0NDLEtBQTJDLHVFQUEzQixHQUEyQjtBQUFBLFFBQXRCQyxNQUFzQix1RUFBTCxHQUFLOztB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QUE5QjtBQUFBLE9BQXpCLEVBQTBELENBQTFELENBQWQ7QUFDQSxXQUFLaEMsSUFBTCxDQUFVVSxFQUFWLEdBQWVvQixPQUFmO0FBQ0EsV0FBSzlCLElBQUwsQ0FBVUssTUFBVixDQUFrQjZCLE9BQWxCLENBQTBCLFVBQUF0QixLQUFLO0FBQUEsZUFBSUEsS0FBSyxDQUFDRixFQUFOLEdBQVdvQixPQUFmO0FBQUEsT0FBL0I7QUFDSDs7OytCQUVVO0FBQ1AsV0FBS0ssT0FBTDtBQUNBLGFBQU9DLElBQUksQ0FBQ0MsS0FBTCxDQUFXLEtBQUtDLE1BQUwsRUFBWCxDQUFQO0FBQ0g7Ozs2QkFFUTtBQUNMLFdBQUtILE9BQUw7QUFDQSxhQUFPQyxJQUFJLENBQUNHLFNBQUwsQ0FBZSxLQUFLdkMsSUFBcEIsQ0FBUDtBQUNIOzs7Ozs7O0lBS09vQixROzs7V0FBQUEsUTtBQUFBQSxFQUFBQSxRLENBQUFBLFE7QUFBQUEsRUFBQUEsUSxDQUFBQSxRO0FBQUFBLEVBQUFBLFEsQ0FBQUEsUTtBQUFBQSxFQUFBQSxRLENBQUFBLFE7R0FBQUEsUSx3QkFBQUEsUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFuaW1hdGlvbiwgU2hhcGVMYXllciwgSW1hZ2VMYXllciwgVGV4dExheWVyLCBUcmFuc2Zvcm0gfSBmcm9tIFwiLi9hbmltYXRpb25cIjtcclxuaW1wb3J0IHsgSlNNb3ZpbkxheWVyLCBMYXllckZhY3RvcnkgfSBmcm9tICcuL2xheWVyJ1xyXG5pbXBvcnQgeyByZW5kZXIsIHJlbmRlckltYWdlLCByZW5kZXJUZXh0IH0gZnJvbSAnLi9yZW5kZXInXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBKU01vdmluIHtcclxuICAgIHByaXZhdGUgcm9vdDogQW5pbWF0aW9uO1xyXG4gICAgcHJpdmF0ZSBhZGRQcm9wZXJ0eShvYmo6IGFueSwga2V5OiBzdHJpbmcgfCBzeW1ib2wsIHZhbHVlOiBhbnkpIHtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWUsIHdyaXRhYmxlOiB0cnVlLCBlbnVtZXJhYmxlOiBmYWxzZSB9KVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIGZwcyBudW1iZXIgb2YgZnJhbWVzIHBlciBzZWNvbmRcclxuICAgICAqIEBwYXJhbSB3aWR0aCB3aWR0aCBvZiB2aWV3cG9ydCAocHgpXHJcbiAgICAgKiBAcGFyYW0gaGVpZ2h0IGhlaWdodCBvZiB2aWV3cG9ydCAocHgpXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGZwczogbnVtYmVyID0gMzAsIHdpZHRoOiBudW1iZXIgPSA4MDAsIGhlaWdodDogbnVtYmVyID0gNjAwKSB7XHJcbiAgICAgICAgdGhpcy5yb290ID0ge1xyXG4gICAgICAgICAgICBmcjogZnBzLFxyXG4gICAgICAgICAgICB3OiB3aWR0aCxcclxuICAgICAgICAgICAgaDogaGVpZ2h0LFxyXG4gICAgICAgICAgICBkZGQ6IDAsXHJcbiAgICAgICAgICAgIGxheWVyczogW10sXHJcbiAgICAgICAgICAgIGFzc2V0czogW10sXHJcbiAgICAgICAgICAgIGZvbnRzOiB7XHJcbiAgICAgICAgICAgICAgICBsaXN0OiBbXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBpcDogMCxcclxuICAgICAgICAgICAgb3A6IDBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gZnBzIG51bWJlciBvZiBmcmFtZXMgcGVyIHNlY29uZFxyXG4gICAgICovXHJcbiAgICBzZXRGcmFtZVJhdGUoZnBzOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnJvb3QuZnIgPSBmcHNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB3aWR0aCB3aWR0aCBvZiB2aWV3cG9ydCAocHgpXHJcbiAgICAgKiBAcGFyYW0gaGVpZ2h0IGhlaWdodCBvZiB2aWV3cG9ydCAocHgpXHJcbiAgICAgKi9cclxuICAgIHNldFZpZXdwb3J0KHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5yb290LncgPSB3aWR0aFxyXG4gICAgICAgIHRoaXMucm9vdC5oID0gaGVpZ2h0XHJcbiAgICB9XHJcblxyXG4gICAgYWRkTGF5ZXIoZG9tT3JMYXllcjogU1ZHR3JhcGhpY3NFbGVtZW50IHwgSlNNb3ZpbkxheWVyKTogSlNNb3ZpbkxheWVyIHtcclxuICAgICAgICBsZXQgbGF5ZXI6IEpTTW92aW5MYXllcjtcclxuICAgICAgICBpZiAoZG9tT3JMYXllciBpbnN0YW5jZW9mIFNWR0dyYXBoaWNzRWxlbWVudCkge1xyXG4gICAgICAgICAgICBsYXllciA9IExheWVyRmFjdG9yeS5oaWVyYXJjaHkoZG9tT3JMYXllciwgdGhpcy5yb290LmFzc2V0cyEsIHRoaXMucm9vdC5mb250cyEpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGF5ZXIgPSBkb21PckxheWVyXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucm9vdC5sYXllcnMhLnB1c2gobGF5ZXIucm9vdClcclxuICAgICAgICByZXR1cm4gbGF5ZXJcclxuICAgIH1cclxuXHJcbiAgICBhZGRNYXNrKG1hc2tPckRvbTogSlNNb3ZpbkxheWVyIHwgU1ZHR3JhcGhpY3NFbGVtZW50LCBsYXllclJlZk9ySW5kZXg6IG51bWJlciB8IEpTTW92aW5MYXllciwgbWFza1R5cGU6IE1hc2tUeXBlID0gTWFza1R5cGUuQWxwaGEpIHtcclxuICAgICAgICBsZXQgbGF5ZXJSZWY6IEpTTW92aW5MYXllclxyXG4gICAgICAgIGxldCBsYXllckluZGV4OiBudW1iZXJcclxuICAgICAgICBpZiAobGF5ZXJSZWZPckluZGV4IGluc3RhbmNlb2YgSlNNb3ZpbkxheWVyKSB7XHJcbiAgICAgICAgICAgIGxheWVyUmVmID0gbGF5ZXJSZWZPckluZGV4XHJcbiAgICAgICAgICAgIGxheWVySW5kZXggPSB0aGlzLnJvb3QubGF5ZXJzIS5pbmRleE9mKGxheWVyUmVmLnJvb3QpXHJcbiAgICAgICAgICAgIGxheWVyUmVmLnJvb3QudHQgPSBtYXNrVHlwZVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxheWVySW5kZXggPSBsYXllclJlZk9ySW5kZXhcclxuICAgICAgICAgICAgdGhpcy5yb290LmxheWVycyFbbGF5ZXJJbmRleF0udHQgPSBtYXNrVHlwZVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobGF5ZXJJbmRleCA8IDApIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdHaXZlbiBsYXllciBpcyBub3QgYSBtZW1iZXIgb2YgdGhpcyBKU01vdmluLicpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBtYXNrTGF5ZXI6IEpTTW92aW5MYXllclxyXG4gICAgICAgIGlmIChtYXNrT3JEb20gaW5zdGFuY2VvZiBTVkdHcmFwaGljc0VsZW1lbnQpIHtcclxuICAgICAgICAgICAgbWFza0xheWVyID0gTGF5ZXJGYWN0b3J5LmhpZXJhcmNoeShtYXNrT3JEb20sIHRoaXMucm9vdC5hc3NldHMhLCB0aGlzLnJvb3QuZm9udHMhKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG1hc2tMYXllciA9IG1hc2tPckRvbVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJvb3QubGF5ZXJzIS5zcGxpY2UobGF5ZXJJbmRleCwgMCwgbWFza0xheWVyLnJvb3QpXHJcbiAgICB9XHJcblxyXG4gICAgdW5pZm9ybSgpIHtcclxuICAgICAgICBsZXQgbWF4VGltZSA9IHRoaXMucm9vdC5sYXllcnMhLnJlZHVjZSgocCwgdikgPT4gcCA8IHYub3AhID8gdi5vcCEgOiBwLCAwKVxyXG4gICAgICAgIHRoaXMucm9vdC5vcCA9IG1heFRpbWVcclxuICAgICAgICB0aGlzLnJvb3QubGF5ZXJzIS5mb3JFYWNoKGxheWVyID0+IGxheWVyLm9wID0gbWF4VGltZSlcclxuICAgIH1cclxuXHJcbiAgICB0b09iamVjdCgpIHtcclxuICAgICAgICB0aGlzLnVuaWZvcm0oKVxyXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRoaXMudG9KU09OKCkpXHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKCkge1xyXG4gICAgICAgIHRoaXMudW5pZm9ybSgpXHJcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMucm9vdClcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHsgTGF5ZXJGYWN0b3J5IH0gZnJvbSAnLi9sYXllcidcclxuZXhwb3J0IHsgRWFzaW5nRmFjdG9yeSB9IGZyb20gJy4vZWFzaW5nJ1xyXG5leHBvcnQgZW51bSBNYXNrVHlwZSB7XHJcbiAgICBBbHBoYSA9IDEsXHJcbiAgICBJbnZlcnRBbHBoYSA9IDIsXHJcbiAgICBMdW1hID0gMyxcclxuICAgIEludmVydEx1bWEgPSA0XHJcbn0iXX0=