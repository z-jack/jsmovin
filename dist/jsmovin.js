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
    value: function addMask(mask, layerRef) {
      var layerIndex = this.root.layers.indexOf(layerRef.root);

      if (layerIndex < 0) {
        throw new Error('Given layer is not a member of this JSMovin.');
      }

      layerRef.root.tt = 1;
      this.root.layers.splice(layerIndex, 0, mask.root);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9qc21vdmluLnRzIl0sIm5hbWVzIjpbIkpTTW92aW4iLCJvYmoiLCJrZXkiLCJ2YWx1ZSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5Iiwid3JpdGFibGUiLCJlbnVtZXJhYmxlIiwiZnBzIiwid2lkdGgiLCJoZWlnaHQiLCJyb290IiwiZnIiLCJ3IiwiaCIsImRkZCIsImxheWVycyIsImFzc2V0cyIsImlwIiwib3AiLCJkb21PckxheWVyIiwibGF5ZXIiLCJTVkdHcmFwaGljc0VsZW1lbnQiLCJMYXllckZhY3RvcnkiLCJoaWVyYXJjaHkiLCJwdXNoIiwibWFzayIsImxheWVyUmVmIiwibGF5ZXJJbmRleCIsImluZGV4T2YiLCJFcnJvciIsInR0Iiwic3BsaWNlIiwibWF4VGltZSIsInJlZHVjZSIsInAiLCJ2IiwiZm9yRWFjaCIsInVuaWZvcm0iLCJKU09OIiwicGFyc2UiLCJ0b0pTT04iLCJzdHJpbmdpZnkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7QUFpRkE7Ozs7Ozs7Ozs7SUE5RXFCQSxPOzs7OztnQ0FFR0MsRyxFQUFVQyxHLEVBQXNCQyxLLEVBQVk7QUFDNURDLE1BQUFBLE1BQU0sQ0FBQ0MsY0FBUCxDQUFzQkosR0FBdEIsRUFBMkJDLEdBQTNCLEVBQWdDO0FBQUVDLFFBQUFBLEtBQUssRUFBTEEsS0FBRjtBQUFTRyxRQUFBQSxRQUFRLEVBQUUsSUFBbkI7QUFBeUJDLFFBQUFBLFVBQVUsRUFBRTtBQUFyQyxPQUFoQztBQUNIO0FBRUQ7Ozs7Ozs7O0FBS0EscUJBQXlFO0FBQUEsUUFBN0RDLEdBQTZELHVFQUEvQyxFQUErQztBQUFBLFFBQTNDQyxLQUEyQyx1RUFBM0IsR0FBMkI7QUFBQSxRQUF0QkMsTUFBc0IsdUVBQUwsR0FBSzs7QUFBQTs7QUFBQTs7QUFDckUsU0FBS0MsSUFBTCxHQUFZO0FBQ1JDLE1BQUFBLEVBQUUsRUFBRUosR0FESTtBQUVSSyxNQUFBQSxDQUFDLEVBQUVKLEtBRks7QUFHUkssTUFBQUEsQ0FBQyxFQUFFSixNQUhLO0FBSVJLLE1BQUFBLEdBQUcsRUFBRSxDQUpHO0FBS1JDLE1BQUFBLE1BQU0sRUFBRSxFQUxBO0FBTVJDLE1BQUFBLE1BQU0sRUFBRSxFQU5BO0FBT1JDLE1BQUFBLEVBQUUsRUFBRSxDQVBJO0FBUVJDLE1BQUFBLEVBQUUsRUFBRTtBQVJJLEtBQVo7QUFVSDtBQUVEOzs7Ozs7O2lDQUdhWCxHLEVBQWE7QUFDdEIsV0FBS0csSUFBTCxDQUFVQyxFQUFWLEdBQWVKLEdBQWY7QUFDSDtBQUVEOzs7Ozs7O2dDQUlZQyxLLEVBQWVDLE0sRUFBZ0I7QUFDdkMsV0FBS0MsSUFBTCxDQUFVRSxDQUFWLEdBQWNKLEtBQWQ7QUFDQSxXQUFLRSxJQUFMLENBQVVHLENBQVYsR0FBY0osTUFBZDtBQUNIOzs7NkJBRVFVLFUsRUFBNkQ7QUFDbEUsVUFBSUMsS0FBSjs7QUFDQSxVQUFJRCxVQUFVLFlBQVlFLGtCQUExQixFQUE4QztBQUMxQ0QsUUFBQUEsS0FBSyxHQUFHRSxvQkFBYUMsU0FBYixDQUF1QkosVUFBdkIsQ0FBUjtBQUNILE9BRkQsTUFFTztBQUNIQyxRQUFBQSxLQUFLLEdBQUdELFVBQVI7QUFDSDs7QUFDRCxXQUFLVCxJQUFMLENBQVVLLE1BQVYsQ0FBa0JTLElBQWxCLENBQXVCSixLQUFLLENBQUNWLElBQTdCO0FBQ0EsYUFBT1UsS0FBUDtBQUNIOzs7NEJBRU9LLEksRUFBb0JDLFEsRUFBd0I7QUFDaEQsVUFBTUMsVUFBVSxHQUFHLEtBQUtqQixJQUFMLENBQVVLLE1BQVYsQ0FBa0JhLE9BQWxCLENBQTBCRixRQUFRLENBQUNoQixJQUFuQyxDQUFuQjs7QUFDQSxVQUFJaUIsVUFBVSxHQUFHLENBQWpCLEVBQW9CO0FBQ2hCLGNBQU0sSUFBSUUsS0FBSixDQUFVLDhDQUFWLENBQU47QUFDSDs7QUFDREgsTUFBQUEsUUFBUSxDQUFDaEIsSUFBVCxDQUFjb0IsRUFBZCxHQUFtQixDQUFuQjtBQUNBLFdBQUtwQixJQUFMLENBQVVLLE1BQVYsQ0FBa0JnQixNQUFsQixDQUF5QkosVUFBekIsRUFBcUMsQ0FBckMsRUFBd0NGLElBQUksQ0FBQ2YsSUFBN0M7QUFDSDs7OzhCQUVTO0FBQ04sVUFBSXNCLE9BQU8sR0FBRyxLQUFLdEIsSUFBTCxDQUFVSyxNQUFWLENBQWtCa0IsTUFBbEIsQ0FBeUIsVUFBQ0MsQ0FBRCxFQUFJQyxDQUFKO0FBQUEsZUFBVUQsQ0FBQyxHQUFHQyxDQUFDLENBQUNqQixFQUFOLEdBQVlpQixDQUFDLENBQUNqQixFQUFkLEdBQW9CZ0IsQ0FBOUI7QUFBQSxPQUF6QixFQUEwRCxDQUExRCxDQUFkO0FBQ0EsV0FBS3hCLElBQUwsQ0FBVVEsRUFBVixHQUFlYyxPQUFmO0FBQ0EsV0FBS3RCLElBQUwsQ0FBVUssTUFBVixDQUFrQnFCLE9BQWxCLENBQTBCLFVBQUFoQixLQUFLO0FBQUEsZUFBSUEsS0FBSyxDQUFDRixFQUFOLEdBQVdjLE9BQWY7QUFBQSxPQUEvQjtBQUNIOzs7K0JBRVU7QUFDUCxXQUFLSyxPQUFMO0FBQ0EsYUFBT0MsSUFBSSxDQUFDQyxLQUFMLENBQVcsS0FBS0MsTUFBTCxFQUFYLENBQVA7QUFDSDs7OzZCQUVRO0FBQ0wsV0FBS0gsT0FBTDtBQUNBLGFBQU9DLElBQUksQ0FBQ0csU0FBTCxDQUFlLEtBQUsvQixJQUFwQixDQUFQO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBbmltYXRpb24sIFNoYXBlTGF5ZXIsIEltYWdlTGF5ZXIsIFRleHRMYXllciwgVHJhbnNmb3JtIH0gZnJvbSBcIi4vYW5pbWF0aW9uXCI7XG5pbXBvcnQgeyBKU01vdmluTGF5ZXIsIExheWVyRmFjdG9yeSB9IGZyb20gJy4vbGF5ZXInXG5pbXBvcnQgeyByZW5kZXIsIHJlbmRlckltYWdlLCByZW5kZXJUZXh0IH0gZnJvbSAnLi9yZW5kZXInXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEpTTW92aW4ge1xuICAgIHByaXZhdGUgcm9vdDogQW5pbWF0aW9uO1xuICAgIHByaXZhdGUgYWRkUHJvcGVydHkob2JqOiBhbnksIGtleTogc3RyaW5nIHwgc3ltYm9sLCB2YWx1ZTogYW55KSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZSwgd3JpdGFibGU6IHRydWUsIGVudW1lcmFibGU6IGZhbHNlIH0pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGZwcyBudW1iZXIgb2YgZnJhbWVzIHBlciBzZWNvbmRcbiAgICAgKiBAcGFyYW0gd2lkdGggd2lkdGggb2Ygdmlld3BvcnQgKHB4KVxuICAgICAqIEBwYXJhbSBoZWlnaHQgaGVpZ2h0IG9mIHZpZXdwb3J0IChweClcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihmcHM6IG51bWJlciA9IDMwLCB3aWR0aDogbnVtYmVyID0gODAwLCBoZWlnaHQ6IG51bWJlciA9IDYwMCkge1xuICAgICAgICB0aGlzLnJvb3QgPSB7XG4gICAgICAgICAgICBmcjogZnBzLFxuICAgICAgICAgICAgdzogd2lkdGgsXG4gICAgICAgICAgICBoOiBoZWlnaHQsXG4gICAgICAgICAgICBkZGQ6IDAsXG4gICAgICAgICAgICBsYXllcnM6IFtdLFxuICAgICAgICAgICAgYXNzZXRzOiBbXSxcbiAgICAgICAgICAgIGlwOiAwLFxuICAgICAgICAgICAgb3A6IDBcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBmcHMgbnVtYmVyIG9mIGZyYW1lcyBwZXIgc2Vjb25kXG4gICAgICovXG4gICAgc2V0RnJhbWVSYXRlKGZwczogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMucm9vdC5mciA9IGZwc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB3aWR0aCB3aWR0aCBvZiB2aWV3cG9ydCAocHgpXG4gICAgICogQHBhcmFtIGhlaWdodCBoZWlnaHQgb2Ygdmlld3BvcnQgKHB4KVxuICAgICAqL1xuICAgIHNldFZpZXdwb3J0KHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMucm9vdC53ID0gd2lkdGhcbiAgICAgICAgdGhpcy5yb290LmggPSBoZWlnaHRcbiAgICB9XG5cbiAgICBhZGRMYXllcihkb21PckxheWVyOiBTVkdHcmFwaGljc0VsZW1lbnQgfCBKU01vdmluTGF5ZXIpOiBKU01vdmluTGF5ZXIge1xuICAgICAgICBsZXQgbGF5ZXI6IEpTTW92aW5MYXllcjtcbiAgICAgICAgaWYgKGRvbU9yTGF5ZXIgaW5zdGFuY2VvZiBTVkdHcmFwaGljc0VsZW1lbnQpIHtcbiAgICAgICAgICAgIGxheWVyID0gTGF5ZXJGYWN0b3J5LmhpZXJhcmNoeShkb21PckxheWVyKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGF5ZXIgPSBkb21PckxheWVyXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yb290LmxheWVycyEucHVzaChsYXllci5yb290KVxuICAgICAgICByZXR1cm4gbGF5ZXJcbiAgICB9XG5cbiAgICBhZGRNYXNrKG1hc2s6IEpTTW92aW5MYXllciwgbGF5ZXJSZWY6IEpTTW92aW5MYXllcikge1xuICAgICAgICBjb25zdCBsYXllckluZGV4ID0gdGhpcy5yb290LmxheWVycyEuaW5kZXhPZihsYXllclJlZi5yb290KVxuICAgICAgICBpZiAobGF5ZXJJbmRleCA8IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignR2l2ZW4gbGF5ZXIgaXMgbm90IGEgbWVtYmVyIG9mIHRoaXMgSlNNb3Zpbi4nKVxuICAgICAgICB9XG4gICAgICAgIGxheWVyUmVmLnJvb3QudHQgPSAxXG4gICAgICAgIHRoaXMucm9vdC5sYXllcnMhLnNwbGljZShsYXllckluZGV4LCAwLCBtYXNrLnJvb3QpXG4gICAgfVxuXG4gICAgdW5pZm9ybSgpIHtcbiAgICAgICAgbGV0IG1heFRpbWUgPSB0aGlzLnJvb3QubGF5ZXJzIS5yZWR1Y2UoKHAsIHYpID0+IHAgPCB2Lm9wISA/IHYub3AhIDogcCwgMClcbiAgICAgICAgdGhpcy5yb290Lm9wID0gbWF4VGltZVxuICAgICAgICB0aGlzLnJvb3QubGF5ZXJzIS5mb3JFYWNoKGxheWVyID0+IGxheWVyLm9wID0gbWF4VGltZSlcbiAgICB9XG5cbiAgICB0b09iamVjdCgpIHtcbiAgICAgICAgdGhpcy51bmlmb3JtKClcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGhpcy50b0pTT04oKSlcbiAgICB9XG5cbiAgICB0b0pTT04oKSB7XG4gICAgICAgIHRoaXMudW5pZm9ybSgpXG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLnJvb3QpXG4gICAgfVxufVxuXG5leHBvcnQgeyBMYXllckZhY3RvcnkgfSBmcm9tICcuL2xheWVyJ1xuZXhwb3J0IHsgRWFzaW5nRmFjdG9yeSB9IGZyb20gJy4vZWFzaW5nJyJdfQ==