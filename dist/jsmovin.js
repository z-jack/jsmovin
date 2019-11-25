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
exports["default"] = void 0;

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
      var layerRef;
      var layerIndex;

      if (layerRefOrIndex instanceof _layer.JSMovinLayer) {
        layerRef = layerRefOrIndex;
        layerIndex = this.root.layers.indexOf(layerRef.root);
        layerRef.root.tt = 1;
      } else {
        layerIndex = layerRefOrIndex;
        this.root.layers[layerIndex].tt = 1;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9qc21vdmluLnRzIl0sIm5hbWVzIjpbIkpTTW92aW4iLCJvYmoiLCJrZXkiLCJ2YWx1ZSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5Iiwid3JpdGFibGUiLCJlbnVtZXJhYmxlIiwiZnBzIiwid2lkdGgiLCJoZWlnaHQiLCJyb290IiwiZnIiLCJ3IiwiaCIsImRkZCIsImxheWVycyIsImFzc2V0cyIsImZvbnRzIiwibGlzdCIsImlwIiwib3AiLCJkb21PckxheWVyIiwibGF5ZXIiLCJTVkdHcmFwaGljc0VsZW1lbnQiLCJMYXllckZhY3RvcnkiLCJoaWVyYXJjaHkiLCJwdXNoIiwibWFza09yRG9tIiwibGF5ZXJSZWZPckluZGV4IiwibGF5ZXJSZWYiLCJsYXllckluZGV4IiwiSlNNb3ZpbkxheWVyIiwiaW5kZXhPZiIsInR0IiwiRXJyb3IiLCJtYXNrTGF5ZXIiLCJzcGxpY2UiLCJtYXhUaW1lIiwicmVkdWNlIiwicCIsInYiLCJmb3JFYWNoIiwidW5pZm9ybSIsIkpTT04iLCJwYXJzZSIsInRvSlNPTiIsInN0cmluZ2lmeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBOztBQWtHQTs7Ozs7Ozs7OztJQS9GcUJBLE87Ozs7O2dDQUVHQyxHLEVBQVVDLEcsRUFBc0JDLEssRUFBWTtBQUM1REMsTUFBQUEsTUFBTSxDQUFDQyxjQUFQLENBQXNCSixHQUF0QixFQUEyQkMsR0FBM0IsRUFBZ0M7QUFBRUMsUUFBQUEsS0FBSyxFQUFMQSxLQUFGO0FBQVNHLFFBQUFBLFFBQVEsRUFBRSxJQUFuQjtBQUF5QkMsUUFBQUEsVUFBVSxFQUFFO0FBQXJDLE9BQWhDO0FBQ0g7QUFFRDs7Ozs7Ozs7QUFLQSxxQkFBeUU7QUFBQSxRQUE3REMsR0FBNkQsdUVBQS9DLEVBQStDO0FBQUEsUUFBM0NDLEtBQTJDLHVFQUEzQixHQUEyQjtBQUFBLFFBQXRCQyxNQUFzQix1RUFBTCxHQUFLOztBQUFBOztBQUFBOztBQUNyRSxTQUFLQyxJQUFMLEdB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Q0EsV0FBSzNCLElBQUwsQ0FBVUssTUFBVixDQUFrQjBCLE9BQWxCLENBQTBCLFVBQUFuQixLQUFLO0FBQUEsZUFBSUEsS0FBSyxDQUFDRixFQUFOLEdBQVdpQixPQUFmO0FBQUEsT0FBL0I7QUFDSDs7OytCQUVVO0FBQ1AsV0FBS0ssT0FBTDtBQUNBLGFBQU9DLElBQUksQ0FBQ0MsS0FBTCxDQUFXLEtBQUtDLE1BQUwsRUFBWCxDQUFQO0FBQ0g7Ozs2QkFFUTtBQUNMLFdBQUtILE9BQUw7QUFDQSxhQUFPQyxJQUFJLENBQUNHLFNBQUwsQ0FBZSxLQUFLcEMsSUFBcEIsQ0FBUDtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQW5pbWF0aW9uLCBTaGFwZUxheWVyLCBJbWFnZUxheWVyLCBUZXh0TGF5ZXIsIFRyYW5zZm9ybSB9IGZyb20gXCIuL2FuaW1hdGlvblwiO1xuaW1wb3J0IHsgSlNNb3ZpbkxheWVyLCBMYXllckZhY3RvcnkgfSBmcm9tICcuL2xheWVyJ1xuaW1wb3J0IHsgcmVuZGVyLCByZW5kZXJJbWFnZSwgcmVuZGVyVGV4dCB9IGZyb20gJy4vcmVuZGVyJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBKU01vdmluIHtcbiAgICBwcml2YXRlIHJvb3Q6IEFuaW1hdGlvbjtcbiAgICBwcml2YXRlIGFkZFByb3BlcnR5KG9iajogYW55LCBrZXk6IHN0cmluZyB8IHN5bWJvbCwgdmFsdWU6IGFueSkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWUsIHdyaXRhYmxlOiB0cnVlLCBlbnVtZXJhYmxlOiBmYWxzZSB9KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBmcHMgbnVtYmVyIG9mIGZyYW1lcyBwZXIgc2Vjb25kXG4gICAgICogQHBhcmFtIHdpZHRoIHdpZHRoIG9mIHZpZXdwb3J0IChweClcbiAgICAgKiBAcGFyYW0gaGVpZ2h0IGhlaWdodCBvZiB2aWV3cG9ydCAocHgpXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZnBzOiBudW1iZXIgPSAzMCwgd2lkdGg6IG51bWJlciA9IDgwMCwgaGVpZ2h0OiBudW1iZXIgPSA2MDApIHtcbiAgICAgICAgdGhpcy5yb290ID0ge1xuICAgICAgICAgICAgZnI6IGZwcyxcbiAgICAgICAgICAgIHc6IHdpZHRoLFxuICAgICAgICAgICAgaDogaGVpZ2h0LFxuICAgICAgICAgICAgZGRkOiAwLFxuICAgICAgICAgICAgbGF5ZXJzOiBbXSxcbiAgICAgICAgICAgIGFzc2V0czogW10sXG4gICAgICAgICAgICBmb250czoge1xuICAgICAgICAgICAgICAgIGxpc3Q6IFtdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaXA6IDAsXG4gICAgICAgICAgICBvcDogMFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGZwcyBudW1iZXIgb2YgZnJhbWVzIHBlciBzZWNvbmRcbiAgICAgKi9cbiAgICBzZXRGcmFtZVJhdGUoZnBzOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5yb290LmZyID0gZnBzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHdpZHRoIHdpZHRoIG9mIHZpZXdwb3J0IChweClcbiAgICAgKiBAcGFyYW0gaGVpZ2h0IGhlaWdodCBvZiB2aWV3cG9ydCAocHgpXG4gICAgICovXG4gICAgc2V0Vmlld3BvcnQod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5yb290LncgPSB3aWR0aFxuICAgICAgICB0aGlzLnJvb3QuaCA9IGhlaWdodFxuICAgIH1cblxuICAgIGFkZExheWVyKGRvbU9yTGF5ZXI6IFNWR0dyYXBoaWNzRWxlbWVudCB8IEpTTW92aW5MYXllcik6IEpTTW92aW5MYXllciB7XG4gICAgICAgIGxldCBsYXllcjogSlNNb3ZpbkxheWVyO1xuICAgICAgICBpZiAoZG9tT3JMYXllciBpbnN0YW5jZW9mIFNWR0dyYXBoaWNzRWxlbWVudCkge1xuICAgICAgICAgICAgbGF5ZXIgPSBMYXllckZhY3RvcnkuaGllcmFyY2h5KGRvbU9yTGF5ZXIsIHRoaXMucm9vdC5hc3NldHMhLCB0aGlzLnJvb3QuZm9udHMhKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGF5ZXIgPSBkb21PckxheWVyXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yb290LmxheWVycyEucHVzaChsYXllci5yb290KVxuICAgICAgICByZXR1cm4gbGF5ZXJcbiAgICB9XG5cbiAgICBhZGRNYXNrKG1hc2tPckRvbTogSlNNb3ZpbkxheWVyIHwgU1ZHR3JhcGhpY3NFbGVtZW50LCBsYXllclJlZk9ySW5kZXg6IG51bWJlciB8IEpTTW92aW5MYXllcikge1xuICAgICAgICBsZXQgbGF5ZXJSZWY6IEpTTW92aW5MYXllclxuICAgICAgICBsZXQgbGF5ZXJJbmRleDogbnVtYmVyXG4gICAgICAgIGlmIChsYXllclJlZk9ySW5kZXggaW5zdGFuY2VvZiBKU01vdmluTGF5ZXIpIHtcbiAgICAgICAgICAgIGxheWVyUmVmID0gbGF5ZXJSZWZPckluZGV4XG4gICAgICAgICAgICBsYXllckluZGV4ID0gdGhpcy5yb290LmxheWVycyEuaW5kZXhPZihsYXllclJlZi5yb290KVxuICAgICAgICAgICAgbGF5ZXJSZWYucm9vdC50dCA9IDFcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxheWVySW5kZXggPSBsYXllclJlZk9ySW5kZXhcbiAgICAgICAgICAgIHRoaXMucm9vdC5sYXllcnMhW2xheWVySW5kZXhdLnR0ID0gMVxuICAgICAgICB9XG4gICAgICAgIGlmIChsYXllckluZGV4IDwgMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdHaXZlbiBsYXllciBpcyBub3QgYSBtZW1iZXIgb2YgdGhpcyBKU01vdmluLicpXG4gICAgICAgIH1cbiAgICAgICAgbGV0IG1hc2tMYXllcjogSlNNb3ZpbkxheWVyXG4gICAgICAgIGlmIChtYXNrT3JEb20gaW5zdGFuY2VvZiBTVkdHcmFwaGljc0VsZW1lbnQpIHtcbiAgICAgICAgICAgIG1hc2tMYXllciA9IExheWVyRmFjdG9yeS5oaWVyYXJjaHkobWFza09yRG9tLCB0aGlzLnJvb3QuYXNzZXRzISwgdGhpcy5yb290LmZvbnRzISlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1hc2tMYXllciA9IG1hc2tPckRvbVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucm9vdC5sYXllcnMhLnNwbGljZShsYXllckluZGV4LCAwLCBtYXNrTGF5ZXIucm9vdClcbiAgICB9XG5cbiAgICB1bmlmb3JtKCkge1xuICAgICAgICBsZXQgbWF4VGltZSA9IHRoaXMucm9vdC5sYXllcnMhLnJlZHVjZSgocCwgdikgPT4gcCA8IHYub3AhID8gdi5vcCEgOiBwLCAwKVxuICAgICAgICB0aGlzLnJvb3Qub3AgPSBtYXhUaW1lXG4gICAgICAgIHRoaXMucm9vdC5sYXllcnMhLmZvckVhY2gobGF5ZXIgPT4gbGF5ZXIub3AgPSBtYXhUaW1lKVxuICAgIH1cblxuICAgIHRvT2JqZWN0KCkge1xuICAgICAgICB0aGlzLnVuaWZvcm0oKVxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0aGlzLnRvSlNPTigpKVxuICAgIH1cblxuICAgIHRvSlNPTigpIHtcbiAgICAgICAgdGhpcy51bmlmb3JtKClcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMucm9vdClcbiAgICB9XG59XG5cbmV4cG9ydCB7IExheWVyRmFjdG9yeSB9IGZyb20gJy4vbGF5ZXInXG5leHBvcnQgeyBFYXNpbmdGYWN0b3J5IH0gZnJvbSAnLi9lYXNpbmcnIl19