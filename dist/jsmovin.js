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
      fonts: [],
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9qc21vdmluLnRzIl0sIm5hbWVzIjpbIkpTTW92aW4iLCJvYmoiLCJrZXkiLCJ2YWx1ZSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5Iiwid3JpdGFibGUiLCJlbnVtZXJhYmxlIiwiZnBzIiwid2lkdGgiLCJoZWlnaHQiLCJyb290IiwiZnIiLCJ3IiwiaCIsImRkZCIsImxheWVycyIsImFzc2V0cyIsImZvbnRzIiwiaXAiLCJvcCIsImRvbU9yTGF5ZXIiLCJsYXllciIsIlNWR0dyYXBoaWNzRWxlbWVudCIsIkxheWVyRmFjdG9yeSIsImhpZXJhcmNoeSIsInB1c2giLCJtYXNrT3JEb20iLCJsYXllclJlZk9ySW5kZXgiLCJsYXllclJlZiIsImxheWVySW5kZXgiLCJKU01vdmluTGF5ZXIiLCJpbmRleE9mIiwidHQiLCJFcnJvciIsIm1hc2tMYXllciIsInNwbGljZSIsIm1heFRpbWUiLCJyZWR1Y2UiLCJwIiwidiIsImZvckVhY2giLCJ1bmlmb3JtIiwiSlNPTiIsInBhcnNlIiwidG9KU09OIiwic3RyaW5naWZ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7O0FBZ0dBOzs7Ozs7Ozs7O0lBN0ZxQkEsTzs7Ozs7Z0NBRUdDLEcsRUFBVUMsRyxFQUFzQkMsSyxFQUFZO0FBQzVEQyxNQUFBQSxNQUFNLENBQUNDLGNBQVAsQ0FBc0JKLEdBQXRCLEVBQTJCQyxHQUEzQixFQUFnQztBQUFFQyxRQUFBQSxLQUFLLEVBQUxBLEtBQUY7QUFBU0csUUFBQUEsUUFBUSxFQUFFLElBQW5CO0FBQXlCQyxRQUFBQSxVQUFVLEVBQUU7QUFBckMsT0FBaEM7QUFDSDtBQUVEOzs7Ozs7OztBQUtBLHFCQUF5RTtBQUFBLFFBQTdEQyxHQUE2RCx1RUFBL0MsRUFBK0M7QUFBQSxRQUEzQ0MsS0FBMkMsdUVBQTNCLEdBQTJCO0FBQUEsUUFBdEJDLE1BQXNCLHVFQUFMLEdBQUs7O0FBQUE7O0FBQUE7O0FBQ3JFLFNBQUtDLElBQUwsR0FBWTtBQUNS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T0FBbEIsQ0FBMEIsVUFBQW5CLEtBQUs7QUFBQSxlQUFJQSxLQUFLLENBQUNGLEVBQU4sR0FBV2lCLE9BQWY7QUFBQSxPQUEvQjtBQUNIOzs7K0JBRVU7QUFDUCxXQUFLSyxPQUFMO0FBQ0EsYUFBT0MsSUFBSSxDQUFDQyxLQUFMLENBQVcsS0FBS0MsTUFBTCxFQUFYLENBQVA7QUFDSDs7OzZCQUVRO0FBQ0wsV0FBS0gsT0FBTDtBQUNBLGFBQU9DLElBQUksQ0FBQ0csU0FBTCxDQUFlLEtBQUtuQyxJQUFwQixDQUFQO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBbmltYXRpb24sIFNoYXBlTGF5ZXIsIEltYWdlTGF5ZXIsIFRleHRMYXllciwgVHJhbnNmb3JtIH0gZnJvbSBcIi4vYW5pbWF0aW9uXCI7XG5pbXBvcnQgeyBKU01vdmluTGF5ZXIsIExheWVyRmFjdG9yeSB9IGZyb20gJy4vbGF5ZXInXG5pbXBvcnQgeyByZW5kZXIsIHJlbmRlckltYWdlLCByZW5kZXJUZXh0IH0gZnJvbSAnLi9yZW5kZXInXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEpTTW92aW4ge1xuICAgIHByaXZhdGUgcm9vdDogQW5pbWF0aW9uO1xuICAgIHByaXZhdGUgYWRkUHJvcGVydHkob2JqOiBhbnksIGtleTogc3RyaW5nIHwgc3ltYm9sLCB2YWx1ZTogYW55KSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZSwgd3JpdGFibGU6IHRydWUsIGVudW1lcmFibGU6IGZhbHNlIH0pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGZwcyBudW1iZXIgb2YgZnJhbWVzIHBlciBzZWNvbmRcbiAgICAgKiBAcGFyYW0gd2lkdGggd2lkdGggb2Ygdmlld3BvcnQgKHB4KVxuICAgICAqIEBwYXJhbSBoZWlnaHQgaGVpZ2h0IG9mIHZpZXdwb3J0IChweClcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihmcHM6IG51bWJlciA9IDMwLCB3aWR0aDogbnVtYmVyID0gODAwLCBoZWlnaHQ6IG51bWJlciA9IDYwMCkge1xuICAgICAgICB0aGlzLnJvb3QgPSB7XG4gICAgICAgICAgICBmcjogZnBzLFxuICAgICAgICAgICAgdzogd2lkdGgsXG4gICAgICAgICAgICBoOiBoZWlnaHQsXG4gICAgICAgICAgICBkZGQ6IDAsXG4gICAgICAgICAgICBsYXllcnM6IFtdLFxuICAgICAgICAgICAgYXNzZXRzOiBbXSxcbiAgICAgICAgICAgIGZvbnRzOiBbXSxcbiAgICAgICAgICAgIGlwOiAwLFxuICAgICAgICAgICAgb3A6IDBcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBmcHMgbnVtYmVyIG9mIGZyYW1lcyBwZXIgc2Vjb25kXG4gICAgICovXG4gICAgc2V0RnJhbWVSYXRlKGZwczogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMucm9vdC5mciA9IGZwc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB3aWR0aCB3aWR0aCBvZiB2aWV3cG9ydCAocHgpXG4gICAgICogQHBhcmFtIGhlaWdodCBoZWlnaHQgb2Ygdmlld3BvcnQgKHB4KVxuICAgICAqL1xuICAgIHNldFZpZXdwb3J0KHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMucm9vdC53ID0gd2lkdGhcbiAgICAgICAgdGhpcy5yb290LmggPSBoZWlnaHRcbiAgICB9XG5cbiAgICBhZGRMYXllcihkb21PckxheWVyOiBTVkdHcmFwaGljc0VsZW1lbnQgfCBKU01vdmluTGF5ZXIpOiBKU01vdmluTGF5ZXIge1xuICAgICAgICBsZXQgbGF5ZXI6IEpTTW92aW5MYXllcjtcbiAgICAgICAgaWYgKGRvbU9yTGF5ZXIgaW5zdGFuY2VvZiBTVkdHcmFwaGljc0VsZW1lbnQpIHtcbiAgICAgICAgICAgIGxheWVyID0gTGF5ZXJGYWN0b3J5LmhpZXJhcmNoeShkb21PckxheWVyLCB0aGlzLnJvb3QuYXNzZXRzISwgdGhpcy5yb290LmZvbnRzISlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxheWVyID0gZG9tT3JMYXllclxuICAgICAgICB9XG4gICAgICAgIHRoaXMucm9vdC5sYXllcnMhLnB1c2gobGF5ZXIucm9vdClcbiAgICAgICAgcmV0dXJuIGxheWVyXG4gICAgfVxuXG4gICAgYWRkTWFzayhtYXNrT3JEb206IEpTTW92aW5MYXllciB8IFNWR0dyYXBoaWNzRWxlbWVudCwgbGF5ZXJSZWZPckluZGV4OiBudW1iZXIgfCBKU01vdmluTGF5ZXIpIHtcbiAgICAgICAgbGV0IGxheWVyUmVmOiBKU01vdmluTGF5ZXJcbiAgICAgICAgbGV0IGxheWVySW5kZXg6IG51bWJlclxuICAgICAgICBpZiAobGF5ZXJSZWZPckluZGV4IGluc3RhbmNlb2YgSlNNb3ZpbkxheWVyKSB7XG4gICAgICAgICAgICBsYXllclJlZiA9IGxheWVyUmVmT3JJbmRleFxuICAgICAgICAgICAgbGF5ZXJJbmRleCA9IHRoaXMucm9vdC5sYXllcnMhLmluZGV4T2YobGF5ZXJSZWYucm9vdClcbiAgICAgICAgICAgIGxheWVyUmVmLnJvb3QudHQgPSAxXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsYXllckluZGV4ID0gbGF5ZXJSZWZPckluZGV4XG4gICAgICAgICAgICB0aGlzLnJvb3QubGF5ZXJzIVtsYXllckluZGV4XS50dCA9IDFcbiAgICAgICAgfVxuICAgICAgICBpZiAobGF5ZXJJbmRleCA8IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignR2l2ZW4gbGF5ZXIgaXMgbm90IGEgbWVtYmVyIG9mIHRoaXMgSlNNb3Zpbi4nKVxuICAgICAgICB9XG4gICAgICAgIGxldCBtYXNrTGF5ZXI6IEpTTW92aW5MYXllclxuICAgICAgICBpZiAobWFza09yRG9tIGluc3RhbmNlb2YgU1ZHR3JhcGhpY3NFbGVtZW50KSB7XG4gICAgICAgICAgICBtYXNrTGF5ZXIgPSBMYXllckZhY3RvcnkuaGllcmFyY2h5KG1hc2tPckRvbSwgdGhpcy5yb290LmFzc2V0cyEsIHRoaXMucm9vdC5mb250cyEpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtYXNrTGF5ZXIgPSBtYXNrT3JEb21cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJvb3QubGF5ZXJzIS5zcGxpY2UobGF5ZXJJbmRleCwgMCwgbWFza0xheWVyLnJvb3QpXG4gICAgfVxuXG4gICAgdW5pZm9ybSgpIHtcbiAgICAgICAgbGV0IG1heFRpbWUgPSB0aGlzLnJvb3QubGF5ZXJzIS5yZWR1Y2UoKHAsIHYpID0+IHAgPCB2Lm9wISA/IHYub3AhIDogcCwgMClcbiAgICAgICAgdGhpcy5yb290Lm9wID0gbWF4VGltZVxuICAgICAgICB0aGlzLnJvb3QubGF5ZXJzIS5mb3JFYWNoKGxheWVyID0+IGxheWVyLm9wID0gbWF4VGltZSlcbiAgICB9XG5cbiAgICB0b09iamVjdCgpIHtcbiAgICAgICAgdGhpcy51bmlmb3JtKClcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGhpcy50b0pTT04oKSlcbiAgICB9XG5cbiAgICB0b0pTT04oKSB7XG4gICAgICAgIHRoaXMudW5pZm9ybSgpXG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLnJvb3QpXG4gICAgfVxufVxuXG5leHBvcnQgeyBMYXllckZhY3RvcnkgfSBmcm9tICcuL2xheWVyJ1xuZXhwb3J0IHsgRWFzaW5nRmFjdG9yeSB9IGZyb20gJy4vZWFzaW5nJyJdfQ==