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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9qc21vdmluLnRzIl0sIm5hbWVzIjpbIkpTTW92aW4iLCJvYmoiLCJrZXkiLCJ2YWx1ZSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5Iiwid3JpdGFibGUiLCJlbnVtZXJhYmxlIiwiZnBzIiwid2lkdGgiLCJoZWlnaHQiLCJyb290IiwiZnIiLCJ3IiwiaCIsImRkZCIsImxheWVycyIsImFzc2V0cyIsImZvbnRzIiwibGlzdCIsImlwIiwib3AiLCJkb21PckxheWVyIiwibGF5ZXIiLCJTVkdHcmFwaGljc0VsZW1lbnQiLCJMYXllckZhY3RvcnkiLCJoaWVyYXJjaHkiLCJwdXNoIiwibWFza09yRG9tIiwibGF5ZXJSZWZPckluZGV4IiwibGF5ZXJSZWYiLCJsYXllckluZGV4IiwiSlNNb3ZpbkxheWVyIiwiaW5kZXhPZiIsInR0IiwiRXJyb3IiLCJtYXNrTGF5ZXIiLCJzcGxpY2UiLCJtYXhUaW1lIiwicmVkdWNlIiwicCIsInYiLCJmb3JFYWNoIiwidW5pZm9ybSIsIkpTT04iLCJwYXJzZSIsInRvSlNPTiIsInN0cmluZ2lmeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBOztBQWtHQTs7Ozs7Ozs7OztJQS9GcUJBLE87Ozs7O2dDQUVHQyxHLEVBQVVDLEcsRUFBc0JDLEssRUFBWTtBQUM1REMsTUFBQUEsTUFBTSxDQUFDQyxjQUFQLENBQXNCSixHQUF0QixFQUEyQkMsR0FBM0IsRUFBZ0M7QUFBRUMsUUFBQUEsS0FBSyxFQUFMQSxLQUFGO0FBQVNHLFFBQUFBLFFBQVEsRUFBRSxJQUFuQjtBQUF5QkMsUUFBQUEsVUFBVSxFQUFFO0FBQXJDLE9BQWhDO0FBQ0g7QUFFRDs7Ozs7Ozs7QUFLQSxxQkFBeUU7QUFBQSxRQUE3REMsR0FBNkQsdUVBQS9DLEVBQStDO0FBQUEsUUFBM0NDLEtBQTJDLHVFQUEzQixHQUEyQjtBQUFBLFFBQXRCQyxNQUFzQix1RUFBTCxHQUFLOztBQUFBOztBQUFBOztBQUNyRSxTQUFLQyxJQUFMLEdB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Q0EsV0FBSzNCLElBQUwsQ0FBVUssTUFBVixDQUFrQjBCLE9BQWxCLENBQTBCLFVBQUFuQixLQUFLO0FBQUEsZUFBSUEsS0FBSyxDQUFDRixFQUFOLEdBQVdpQixPQUFmO0FBQUEsT0FBL0I7QUFDSDs7OytCQUVVO0FBQ1AsV0FBS0ssT0FBTDtBQUNBLGFBQU9DLElBQUksQ0FBQ0MsS0FBTCxDQUFXLEtBQUtDLE1BQUwsRUFBWCxDQUFQO0FBQ0g7Ozs2QkFFUTtBQUNMLFdBQUtILE9BQUw7QUFDQSxhQUFPQyxJQUFJLENBQUNHLFNBQUwsQ0FBZSxLQUFLcEMsSUFBcEIsQ0FBUDtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQW5pbWF0aW9uLCBTaGFwZUxheWVyLCBJbWFnZUxheWVyLCBUZXh0TGF5ZXIsIFRyYW5zZm9ybSB9IGZyb20gXCIuL2FuaW1hdGlvblwiO1xyXG5pbXBvcnQgeyBKU01vdmluTGF5ZXIsIExheWVyRmFjdG9yeSB9IGZyb20gJy4vbGF5ZXInXHJcbmltcG9ydCB7IHJlbmRlciwgcmVuZGVySW1hZ2UsIHJlbmRlclRleHQgfSBmcm9tICcuL3JlbmRlcidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEpTTW92aW4ge1xyXG4gICAgcHJpdmF0ZSByb290OiBBbmltYXRpb247XHJcbiAgICBwcml2YXRlIGFkZFByb3BlcnR5KG9iajogYW55LCBrZXk6IHN0cmluZyB8IHN5bWJvbCwgdmFsdWU6IGFueSkge1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZSwgd3JpdGFibGU6IHRydWUsIGVudW1lcmFibGU6IGZhbHNlIH0pXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gZnBzIG51bWJlciBvZiBmcmFtZXMgcGVyIHNlY29uZFxyXG4gICAgICogQHBhcmFtIHdpZHRoIHdpZHRoIG9mIHZpZXdwb3J0IChweClcclxuICAgICAqIEBwYXJhbSBoZWlnaHQgaGVpZ2h0IG9mIHZpZXdwb3J0IChweClcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoZnBzOiBudW1iZXIgPSAzMCwgd2lkdGg6IG51bWJlciA9IDgwMCwgaGVpZ2h0OiBudW1iZXIgPSA2MDApIHtcclxuICAgICAgICB0aGlzLnJvb3QgPSB7XHJcbiAgICAgICAgICAgIGZyOiBmcHMsXHJcbiAgICAgICAgICAgIHc6IHdpZHRoLFxyXG4gICAgICAgICAgICBoOiBoZWlnaHQsXHJcbiAgICAgICAgICAgIGRkZDogMCxcclxuICAgICAgICAgICAgbGF5ZXJzOiBbXSxcclxuICAgICAgICAgICAgYXNzZXRzOiBbXSxcclxuICAgICAgICAgICAgZm9udHM6IHtcclxuICAgICAgICAgICAgICAgIGxpc3Q6IFtdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGlwOiAwLFxyXG4gICAgICAgICAgICBvcDogMFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSBmcHMgbnVtYmVyIG9mIGZyYW1lcyBwZXIgc2Vjb25kXHJcbiAgICAgKi9cclxuICAgIHNldEZyYW1lUmF0ZShmcHM6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMucm9vdC5mciA9IGZwc1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHdpZHRoIHdpZHRoIG9mIHZpZXdwb3J0IChweClcclxuICAgICAqIEBwYXJhbSBoZWlnaHQgaGVpZ2h0IG9mIHZpZXdwb3J0IChweClcclxuICAgICAqL1xyXG4gICAgc2V0Vmlld3BvcnQod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnJvb3QudyA9IHdpZHRoXHJcbiAgICAgICAgdGhpcy5yb290LmggPSBoZWlnaHRcclxuICAgIH1cclxuXHJcbiAgICBhZGRMYXllcihkb21PckxheWVyOiBTVkdHcmFwaGljc0VsZW1lbnQgfCBKU01vdmluTGF5ZXIpOiBKU01vdmluTGF5ZXIge1xyXG4gICAgICAgIGxldCBsYXllcjogSlNNb3ZpbkxheWVyO1xyXG4gICAgICAgIGlmIChkb21PckxheWVyIGluc3RhbmNlb2YgU1ZHR3JhcGhpY3NFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGxheWVyID0gTGF5ZXJGYWN0b3J5LmhpZXJhcmNoeShkb21PckxheWVyLCB0aGlzLnJvb3QuYXNzZXRzISwgdGhpcy5yb290LmZvbnRzISlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsYXllciA9IGRvbU9yTGF5ZXJcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yb290LmxheWVycyEucHVzaChsYXllci5yb290KVxyXG4gICAgICAgIHJldHVybiBsYXllclxyXG4gICAgfVxyXG5cclxuICAgIGFkZE1hc2sobWFza09yRG9tOiBKU01vdmluTGF5ZXIgfCBTVkdHcmFwaGljc0VsZW1lbnQsIGxheWVyUmVmT3JJbmRleDogbnVtYmVyIHwgSlNNb3ZpbkxheWVyKSB7XHJcbiAgICAgICAgbGV0IGxheWVyUmVmOiBKU01vdmluTGF5ZXJcclxuICAgICAgICBsZXQgbGF5ZXJJbmRleDogbnVtYmVyXHJcbiAgICAgICAgaWYgKGxheWVyUmVmT3JJbmRleCBpbnN0YW5jZW9mIEpTTW92aW5MYXllcikge1xyXG4gICAgICAgICAgICBsYXllclJlZiA9IGxheWVyUmVmT3JJbmRleFxyXG4gICAgICAgICAgICBsYXllckluZGV4ID0gdGhpcy5yb290LmxheWVycyEuaW5kZXhPZihsYXllclJlZi5yb290KVxyXG4gICAgICAgICAgICBsYXllclJlZi5yb290LnR0ID0gMVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxheWVySW5kZXggPSBsYXllclJlZk9ySW5kZXhcclxuICAgICAgICAgICAgdGhpcy5yb290LmxheWVycyFbbGF5ZXJJbmRleF0udHQgPSAxXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChsYXllckluZGV4IDwgMCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0dpdmVuIGxheWVyIGlzIG5vdCBhIG1lbWJlciBvZiB0aGlzIEpTTW92aW4uJylcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IG1hc2tMYXllcjogSlNNb3ZpbkxheWVyXHJcbiAgICAgICAgaWYgKG1hc2tPckRvbSBpbnN0YW5jZW9mIFNWR0dyYXBoaWNzRWxlbWVudCkge1xyXG4gICAgICAgICAgICBtYXNrTGF5ZXIgPSBMYXllckZhY3RvcnkuaGllcmFyY2h5KG1hc2tPckRvbSwgdGhpcy5yb290LmFzc2V0cyEsIHRoaXMucm9vdC5mb250cyEpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbWFza0xheWVyID0gbWFza09yRG9tXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucm9vdC5sYXllcnMhLnNwbGljZShsYXllckluZGV4LCAwLCBtYXNrTGF5ZXIucm9vdClcclxuICAgIH1cclxuXHJcbiAgICB1bmlmb3JtKCkge1xyXG4gICAgICAgIGxldCBtYXhUaW1lID0gdGhpcy5yb290LmxheWVycyEucmVkdWNlKChwLCB2KSA9PiBwIDwgdi5vcCEgPyB2Lm9wISA6IHAsIDApXHJcbiAgICAgICAgdGhpcy5yb290Lm9wID0gbWF4VGltZVxyXG4gICAgICAgIHRoaXMucm9vdC5sYXllcnMhLmZvckVhY2gobGF5ZXIgPT4gbGF5ZXIub3AgPSBtYXhUaW1lKVxyXG4gICAgfVxyXG5cclxuICAgIHRvT2JqZWN0KCkge1xyXG4gICAgICAgIHRoaXMudW5pZm9ybSgpXHJcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGhpcy50b0pTT04oKSlcclxuICAgIH1cclxuXHJcbiAgICB0b0pTT04oKSB7XHJcbiAgICAgICAgdGhpcy51bmlmb3JtKClcclxuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5yb290KVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgeyBMYXllckZhY3RvcnkgfSBmcm9tICcuL2xheWVyJ1xyXG5leHBvcnQgeyBFYXNpbmdGYWN0b3J5IH0gZnJvbSAnLi9lYXNpbmcnIl19