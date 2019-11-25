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
        layer = _layer.LayerFactory.hierarchy(domOrLayer);
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
        maskLayer = _layer.LayerFactory.hierarchy(maskOrDom);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9qc21vdmluLnRzIl0sIm5hbWVzIjpbIkpTTW92aW4iLCJvYmoiLCJrZXkiLCJ2YWx1ZSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5Iiwid3JpdGFibGUiLCJlbnVtZXJhYmxlIiwiZnBzIiwid2lkdGgiLCJoZWlnaHQiLCJyb290IiwiZnIiLCJ3IiwiaCIsImRkZCIsImxheWVycyIsImFzc2V0cyIsImlwIiwib3AiLCJkb21PckxheWVyIiwibGF5ZXIiLCJTVkdHcmFwaGljc0VsZW1lbnQiLCJMYXllckZhY3RvcnkiLCJoaWVyYXJjaHkiLCJwdXNoIiwibWFza09yRG9tIiwibGF5ZXJSZWZPckluZGV4IiwibGF5ZXJSZWYiLCJsYXllckluZGV4IiwiSlNNb3ZpbkxheWVyIiwiaW5kZXhPZiIsInR0IiwiRXJyb3IiLCJtYXNrTGF5ZXIiLCJzcGxpY2UiLCJtYXhUaW1lIiwicmVkdWNlIiwicCIsInYiLCJmb3JFYWNoIiwidW5pZm9ybSIsIkpTT04iLCJwYXJzZSIsInRvSlNPTiIsInN0cmluZ2lmeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBOztBQStGQTs7Ozs7Ozs7OztJQTVGcUJBLE87Ozs7O2dDQUVHQyxHLEVBQVVDLEcsRUFBc0JDLEssRUFBWTtBQUM1REMsTUFBQUEsTUFBTSxDQUFDQyxjQUFQLENBQXNCSixHQUF0QixFQUEyQkMsR0FBM0IsRUFBZ0M7QUFBRUMsUUFBQUEsS0FBSyxFQUFMQSxLQUFGO0FBQVNHLFFBQUFBLFFBQVEsRUFBRSxJQUFuQjtBQUF5QkMsUUFBQUEsVUFBVSxFQUFFO0FBQXJDLE9BQWhDO0FBQ0g7QUFFRDs7Ozs7Ozs7QUFLQSxxQkFBeUU7QUFBQSxRQUE3REMsR0FBNkQsdUVBQS9DLEVBQStDO0FBQUEsUUFBM0NDLEtBQTJDLHVFQUEzQixHQUEyQjtBQUFBLFFBQXRCQyxNQUFzQix1RUFBTCxHQUFLOztBQUFBOztBQUFBOztBQUNyRSxTQUFLQyxJQUFMLEdBQVk7QUFDUkMsTUFBQUEs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O0FBQ0g7Ozs2QkFFUTtBQUNMLFdBQUtILE9BQUw7QUFDQSxhQUFPQyxJQUFJLENBQUNHLFNBQUwsQ0FBZSxLQUFLbEMsSUFBcEIsQ0FBUDtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQW5pbWF0aW9uLCBTaGFwZUxheWVyLCBJbWFnZUxheWVyLCBUZXh0TGF5ZXIsIFRyYW5zZm9ybSB9IGZyb20gXCIuL2FuaW1hdGlvblwiO1xuaW1wb3J0IHsgSlNNb3ZpbkxheWVyLCBMYXllckZhY3RvcnkgfSBmcm9tICcuL2xheWVyJ1xuaW1wb3J0IHsgcmVuZGVyLCByZW5kZXJJbWFnZSwgcmVuZGVyVGV4dCB9IGZyb20gJy4vcmVuZGVyJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBKU01vdmluIHtcbiAgICBwcml2YXRlIHJvb3Q6IEFuaW1hdGlvbjtcbiAgICBwcml2YXRlIGFkZFByb3BlcnR5KG9iajogYW55LCBrZXk6IHN0cmluZyB8IHN5bWJvbCwgdmFsdWU6IGFueSkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWUsIHdyaXRhYmxlOiB0cnVlLCBlbnVtZXJhYmxlOiBmYWxzZSB9KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBmcHMgbnVtYmVyIG9mIGZyYW1lcyBwZXIgc2Vjb25kXG4gICAgICogQHBhcmFtIHdpZHRoIHdpZHRoIG9mIHZpZXdwb3J0IChweClcbiAgICAgKiBAcGFyYW0gaGVpZ2h0IGhlaWdodCBvZiB2aWV3cG9ydCAocHgpXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZnBzOiBudW1iZXIgPSAzMCwgd2lkdGg6IG51bWJlciA9IDgwMCwgaGVpZ2h0OiBudW1iZXIgPSA2MDApIHtcbiAgICAgICAgdGhpcy5yb290ID0ge1xuICAgICAgICAgICAgZnI6IGZwcyxcbiAgICAgICAgICAgIHc6IHdpZHRoLFxuICAgICAgICAgICAgaDogaGVpZ2h0LFxuICAgICAgICAgICAgZGRkOiAwLFxuICAgICAgICAgICAgbGF5ZXJzOiBbXSxcbiAgICAgICAgICAgIGFzc2V0czogW10sXG4gICAgICAgICAgICBpcDogMCxcbiAgICAgICAgICAgIG9wOiAwXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gZnBzIG51bWJlciBvZiBmcmFtZXMgcGVyIHNlY29uZFxuICAgICAqL1xuICAgIHNldEZyYW1lUmF0ZShmcHM6IG51bWJlcikge1xuICAgICAgICB0aGlzLnJvb3QuZnIgPSBmcHNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gd2lkdGggd2lkdGggb2Ygdmlld3BvcnQgKHB4KVxuICAgICAqIEBwYXJhbSBoZWlnaHQgaGVpZ2h0IG9mIHZpZXdwb3J0IChweClcbiAgICAgKi9cbiAgICBzZXRWaWV3cG9ydCh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xuICAgICAgICB0aGlzLnJvb3QudyA9IHdpZHRoXG4gICAgICAgIHRoaXMucm9vdC5oID0gaGVpZ2h0XG4gICAgfVxuXG4gICAgYWRkTGF5ZXIoZG9tT3JMYXllcjogU1ZHR3JhcGhpY3NFbGVtZW50IHwgSlNNb3ZpbkxheWVyKTogSlNNb3ZpbkxheWVyIHtcbiAgICAgICAgbGV0IGxheWVyOiBKU01vdmluTGF5ZXI7XG4gICAgICAgIGlmIChkb21PckxheWVyIGluc3RhbmNlb2YgU1ZHR3JhcGhpY3NFbGVtZW50KSB7XG4gICAgICAgICAgICBsYXllciA9IExheWVyRmFjdG9yeS5oaWVyYXJjaHkoZG9tT3JMYXllcilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxheWVyID0gZG9tT3JMYXllclxuICAgICAgICB9XG4gICAgICAgIHRoaXMucm9vdC5sYXllcnMhLnB1c2gobGF5ZXIucm9vdClcbiAgICAgICAgcmV0dXJuIGxheWVyXG4gICAgfVxuXG4gICAgYWRkTWFzayhtYXNrT3JEb206IEpTTW92aW5MYXllciB8IFNWR0dyYXBoaWNzRWxlbWVudCwgbGF5ZXJSZWZPckluZGV4OiBudW1iZXJ8IEpTTW92aW5MYXllcikge1xuICAgICAgICBsZXQgbGF5ZXJSZWY6IEpTTW92aW5MYXllclxuICAgICAgICBsZXQgbGF5ZXJJbmRleDogbnVtYmVyXG4gICAgICAgIGlmKGxheWVyUmVmT3JJbmRleCBpbnN0YW5jZW9mIEpTTW92aW5MYXllcil7XG4gICAgICAgICAgICBsYXllclJlZj1sYXllclJlZk9ySW5kZXhcbiAgICAgICAgbGF5ZXJJbmRleCA9IHRoaXMucm9vdC5sYXllcnMhLmluZGV4T2YobGF5ZXJSZWYucm9vdClcbiAgICAgICAgbGF5ZXJSZWYucm9vdC50dD0xXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgbGF5ZXJJbmRleD1sYXllclJlZk9ySW5kZXhcbiAgICAgICAgICAgIHRoaXMucm9vdC5sYXllcnMhW2xheWVySW5kZXhdLnR0ID0gMVxuICAgICAgICB9XG4gICAgICAgIGlmIChsYXllckluZGV4IDwgMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdHaXZlbiBsYXllciBpcyBub3QgYSBtZW1iZXIgb2YgdGhpcyBKU01vdmluLicpXG4gICAgICAgIH1cbiAgICAgICAgbGV0IG1hc2tMYXllcjogSlNNb3ZpbkxheWVyXG4gICAgICAgIGlmIChtYXNrT3JEb20gaW5zdGFuY2VvZiBTVkdHcmFwaGljc0VsZW1lbnQpe1xuICAgICAgICAgICAgbWFza0xheWVyPUxheWVyRmFjdG9yeS5oaWVyYXJjaHkobWFza09yRG9tKVxuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICBtYXNrTGF5ZXI9bWFza09yRG9tXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yb290LmxheWVycyEuc3BsaWNlKGxheWVySW5kZXgsIDAsIG1hc2tMYXllci5yb290KVxuICAgIH1cblxuICAgIHVuaWZvcm0oKSB7XG4gICAgICAgIGxldCBtYXhUaW1lID0gdGhpcy5yb290LmxheWVycyEucmVkdWNlKChwLCB2KSA9PiBwIDwgdi5vcCEgPyB2Lm9wISA6IHAsIDApXG4gICAgICAgIHRoaXMucm9vdC5vcCA9IG1heFRpbWVcbiAgICAgICAgdGhpcy5yb290LmxheWVycyEuZm9yRWFjaChsYXllciA9PiBsYXllci5vcCA9IG1heFRpbWUpXG4gICAgfVxuXG4gICAgdG9PYmplY3QoKSB7XG4gICAgICAgIHRoaXMudW5pZm9ybSgpXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRoaXMudG9KU09OKCkpXG4gICAgfVxuXG4gICAgdG9KU09OKCkge1xuICAgICAgICB0aGlzLnVuaWZvcm0oKVxuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5yb290KVxuICAgIH1cbn1cblxuZXhwb3J0IHsgTGF5ZXJGYWN0b3J5IH0gZnJvbSAnLi9sYXllcidcbmV4cG9ydCB7IEVhc2luZ0ZhY3RvcnkgfSBmcm9tICcuL2Vhc2luZyciXX0=