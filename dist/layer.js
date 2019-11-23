"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LayerFactory = exports.JSMovinLayer = void 0;

var _render = require("./render");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var JSMovinLayer =
/*#__PURE__*/
function () {
  function JSMovinLayer(ref) {
    _classCallCheck(this, JSMovinLayer);

    _defineProperty(this, "root", void 0);

    this.root = ref;
  }

  _createClass(JSMovinLayer, [{
    key: "setStaticProperty",
    value: function setStaticProperty(key, value) {}
  }, {
    key: "setAnimatableProperty",
    value: function setAnimatableProperty(key, startFrame, endFrame, startValue, endValue, easing) {}
  }]);

  return JSMovinLayer;
}();

exports.JSMovinLayer = JSMovinLayer;

var LayerFactory =
/*#__PURE__*/
function () {
  function LayerFactory() {
    _classCallCheck(this, LayerFactory);
  }

  _createClass(LayerFactory, null, [{
    key: "generateTransform",
    value: function generateTransform(coordinate) {
      return {
        o: {
          a: 0,
          k: 100
        },
        r: {
          a: 0,
          k: 0
        },
        p: {
          a: 0,
          k: [coordinate[0], coordinate[1], 0]
        },
        a: {
          a: 0,
          k: [0, 0, 0]
        },
        s: {
          a: 0,
          k: [100, 100, 100]
        }
      };
    }
  }, {
    key: "getBoundingBox",
    value: function getBoundingBox(dom) {
      var svgRoot = dom;

      while (true) {
        if (svgRoot.parentElement instanceof SVGGraphicsElement) {
          svgRoot = svgRoot.parentElement;
        } else {
          break;
        }
      }

      var rootBBox = svgRoot.getBoundingClientRect();
      var refBBox = dom.getBoundingClientRect();
      var coordinate = [refBBox.left - rootBBox.left, refBBox.top - rootBBox.top, refBBox.width + 1, refBBox.height + 1];
      return coordinate;
    }
  }, {
    key: "boundingBox",
    value: function boundingBox(dom) {
      var coordinate = this.getBoundingBox(dom);
      var layer = {
        ty: 4,
        ddd: 0,
        sr: 1,
        ao: 0,
        ks: this.generateTransform(coordinate),
        ip: 0,
        op: 1,
        st: 0,
        bm: 0,
        shapes: []
      };
      return new JSMovinLayer({});
    }
  }, {
    key: "shape",
    value: function shape(dom) {
      return new JSMovinLayer({});
    }
  }, {
    key: "rect",
    value: function rect(left, top, width, height) {}
  }, {
    key: "ellipse",
    value: function ellipse(cx, cy, rx, ry, rotate) {}
  }, {
    key: "hierarchy",
    value: function hierarchy(dom) {
      var coordinate = this.getBoundingBox(dom);
      var domType;

      if (dom instanceof SVGTextElement) {
        domType = 5;
      } else if (dom instanceof SVGImageElement) {
        domType = 2;
      } else {
        domType = 4;
      }

      var layer = {
        ty: domType,
        ddd: 0,
        sr: 1,
        ao: 0,
        ks: this.generateTransform(coordinate),
        ip: 0,
        op: 1,
        st: 0,
        bm: 0
      };

      switch (domType) {
        case 2:
          var imageLayer = layer;
          imageLayer.refId = (0, _render.renderImage)(dom);
          break;

        case 4:
          var shapeLayer = layer;
          shapeLayer.shapes = [];
          shapeLayer.shapes.push((0, _render.render)(dom));
          break;

        case 5:
          var textLayer = layer;
          textLayer.t = (0, _render.renderText)(dom);
          break;
      }

      var movinLayer = new JSMovinLayer(layer);
      return movinLayer;
    }
  }]);

  return LayerFactory;
}();

exports.LayerFactory = LayerFactory;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sYXllci50cyJdLCJuYW1lcyI6WyJKU01vdmluTGF5ZXIiLCJyZWYiLCJyb290Iiwia2V5IiwidmFsdWUiLCJzdGFydEZyYW1lIiwiZW5kRnJhbWUiLCJzdGFydFZhbHVlIiwiZW5kVmFsdWUiLCJlYXNpbmciLCJMYXllckZhY3RvcnkiLCJjb29yZGluYXRlIiwibyIsImEiLCJrIiwiciIsInAiLCJzIiwiZG9tIiwic3ZnUm9vdCIsInBhcmVudEVsZW1lbnQiLCJTVkdHcmFwaGljc0VsZW1lbnQiLCJyb290QkJveCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInJlZkJCb3giLCJsZWZ0IiwidG9wIiwid2lkdGgiLCJoZWlnaHQiLCJnZXRCb3VuZGluZ0JveCIsImxheWVyIiwidHkiLCJkZGQiLCJzciIsImFvIiwia3MiLCJnZW5lcmF0ZVRyYW5zZm9ybSIsImlwIiwib3AiLCJzdCIsImJtIiwic2hhcGVzIiwiY3giLCJjeSIsInJ4IiwicnkiLCJyb3RhdGUiLCJkb21UeXBlIiwiU1ZHVGV4dEVsZW1lbnQiLCJTVkdJbWFnZUVsZW1lbnQiLCJpbWFnZUxheWVyIiwicmVmSWQiLCJzaGFwZUxheWVyIiwicHVzaCIsInRleHRMYXllciIsInQiLCJtb3ZpbkxheWVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7SUFJYUEsWTs7O0FBR1Qsd0JBQVlDLEdBQVosRUFBc0Q7QUFBQTs7QUFBQTs7QUFDbEQsU0FBS0MsSUFBTCxHQUFZRCxHQUFaO0FBQ0g7Ozs7c0NBRWlCRSxHLEVBQWtCQyxLLEVBQVksQ0FFL0M7OzswQ0FFcUJELEcsRUFBa0JFLFUsRUFBb0JDLFEsRUFBa0JDLFUsRUFBaUJDLFEsRUFBZUMsTSxFQUF5QixDQUV0STs7Ozs7Ozs7SUFHUUMsWTs7Ozs7Ozs7O3NDQUN3QkMsVSxFQUFpQztBQUM5RCxhQUFPO0FBQ0hDLFFBQUFBLENBQUMsRUFBRTtBQUNDQyxVQUFBQSxDQUFDLEVBQUUsQ0FESjtBQUVDQyxVQUFBQSxD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ZXIsIEltYWdlTGF5ZXIsIFRyYW5zZm9ybSB9IGZyb20gJy4vYW5pbWF0aW9uJ1xuaW1wb3J0IHsgRWFzaW5nRnVuY3Rpb24gfSBmcm9tICcuL2Vhc2luZydcbmltcG9ydCB7IHJlbmRlclRleHQsIHJlbmRlciwgcmVuZGVySW1hZ2UgfSBmcm9tICcuL3JlbmRlcic7XG5cbnR5cGUgU2V0YWJsZUtleXMgPSBcIndpZHRoXCIgfCBcImhlaWdodFwiIHwgXCJhbmNob3JYXCIgfCBcImFuY2hvcllcIiB8IFwieFwiIHwgXCJ5XCIgfCBcInNrZXdYXCIgfCBcInNrZXdZXCIgfCBcInJvdGF0ZVwiIHwgXCJvcGFjaXR5XCIgfCBcInZhbHVlXCJcblxuZXhwb3J0IGNsYXNzIEpTTW92aW5MYXllciB7XG4gICAgcHVibGljIHJlYWRvbmx5IHJvb3Q6IFNoYXBlTGF5ZXIgfCBUZXh0TGF5ZXIgfCBJbWFnZUxheWVyO1xuXG4gICAgY29uc3RydWN0b3IocmVmOiBTaGFwZUxheWVyIHwgVGV4dExheWVyIHwgSW1hZ2VMYXllcikge1xuICAgICAgICB0aGlzLnJvb3QgPSByZWZcbiAgICB9XG5cbiAgICBzZXRTdGF0aWNQcm9wZXJ0eShrZXk6IFNldGFibGVLZXlzLCB2YWx1ZTogYW55KSB7XG5cbiAgICB9XG5cbiAgICBzZXRBbmltYXRhYmxlUHJvcGVydHkoa2V5OiBTZXRhYmxlS2V5cywgc3RhcnRGcmFtZTogbnVtYmVyLCBlbmRGcmFtZTogbnVtYmVyLCBzdGFydFZhbHVlOiBhbnksIGVuZFZhbHVlOiBhbnksIGVhc2luZz86IEVhc2luZ0Z1bmN0aW9uKSB7XG5cbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMYXllckZhY3Rvcnkge1xuICAgIHByaXZhdGUgc3RhdGljIGdlbmVyYXRlVHJhbnNmb3JtKGNvb3JkaW5hdGU6IG51bWJlcltdKTogVHJhbnNmb3JtIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG86IHtcbiAgICAgICAgICAgICAgICBhOiAwLFxuICAgICAgICAgICAgICAgIGs6IDEwMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHI6IHtcbiAgICAgICAgICAgICAgICBhOiAwLFxuICAgICAgICAgICAgICAgIGs6IDBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwOiB7XG4gICAgICAgICAgICAgICAgYTogMCxcbiAgICAgICAgICAgICAgICBrOiBbXG4gICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVbMF0sXG4gICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVbMV0sXG4gICAgICAgICAgICAgICAgICAgIDBcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYToge1xuICAgICAgICAgICAgICAgIGE6IDAsXG4gICAgICAgICAgICAgICAgazogW1xuICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHM6IHtcbiAgICAgICAgICAgICAgICBhOiAwLFxuICAgICAgICAgICAgICAgIGs6IFtcbiAgICAgICAgICAgICAgICAgICAgMTAwLFxuICAgICAgICAgICAgICAgICAgICAxMDAsXG4gICAgICAgICAgICAgICAgICAgIDEwMFxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIGdldEJvdW5kaW5nQm94KGRvbTpTVkdHcmFwaGljc0VsZW1lbnQpe1xuICAgICAgICBsZXQgc3ZnUm9vdDogU1ZHRWxlbWVudCA9IGRvbVxuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgaWYgKHN2Z1Jvb3QucGFyZW50RWxlbWVudCBpbnN0YW5jZW9mIFNWR0dyYXBoaWNzRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHN2Z1Jvb3QgPSBzdmdSb290LnBhcmVudEVsZW1lbnRcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCByb290QkJveCA9IHN2Z1Jvb3QuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICAgY29uc3QgcmVmQkJveCA9IGRvbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgICBjb25zdCBjb29yZGluYXRlID0gW3JlZkJCb3gubGVmdCAtIHJvb3RCQm94LmxlZnQsIHJlZkJCb3gudG9wIC0gcm9vdEJCb3gudG9wLCByZWZCQm94LndpZHRoICsgMSwgcmVmQkJveC5oZWlnaHQgKyAxXVxuICAgICAgICByZXR1cm4gY29vcmRpbmF0ZVxuICAgIH1cblxuICAgIHN0YXRpYyBib3VuZGluZ0JveChkb206IFNWR0dyYXBoaWNzRWxlbWVudCkge1xuICAgICAgICBjb25zdCBjb29yZGluYXRlID0gdGhpcy5nZXRCb3VuZGluZ0JveChkb20pXG4gICAgICAgIGNvbnN0IGxheWVyOiBTaGFwZUxheWVyID0ge1xuICAgICAgICAgICAgdHk6IDQsXG4gICAgICAgICAgICBkZGQ6IDAsXG4gICAgICAgICAgICBzcjogMSxcbiAgICAgICAgICAgIGFvOiAwLFxuICAgICAgICAgICAga3M6IHRoaXMuZ2VuZXJhdGVUcmFuc2Zvcm0oY29vcmRpbmF0ZSksXG4gICAgICAgICAgICBpcDogMCxcbiAgICAgICAgICAgIG9wOiAxLFxuICAgICAgICAgICAgc3Q6IDAsXG4gICAgICAgICAgICBibTogMCxcbiAgICAgICAgICAgIHNoYXBlczogW1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgSlNNb3ZpbkxheWVyKHt9KVxuICAgIH1cblxuICAgIHN0YXRpYyBzaGFwZShkb206IFNWR1BhdGhFbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBuZXcgSlNNb3ZpbkxheWVyKHt9KVxuICAgIH1cblxuICAgIHN0YXRpYyByZWN0KGxlZnQ6IG51bWJlciwgdG9wOiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSB7XG5cbiAgICB9XG5cbiAgICBzdGF0aWMgZWxsaXBzZShjeDogbnVtYmVyLCBjeTogbnVtYmVyLCByeDogbnVtYmVyLCByeTogbnVtYmVyLCByb3RhdGU6IG51bWJlcikge1xuXG4gICAgfVxuXG4gICAgc3RhdGljIGhpZXJhcmNoeShkb206IFNWR0dyYXBoaWNzRWxlbWVudCkge1xuICAgICAgICBjb25zdCBjb29yZGluYXRlID0gdGhpcy5nZXRCb3VuZGluZ0JveChkb20pXG4gICAgICAgIGxldCBkb21UeXBlOiAyIHwgNCB8IDU7XG4gICAgICAgIGlmIChkb20gaW5zdGFuY2VvZiBTVkdUZXh0RWxlbWVudCkge1xuICAgICAgICAgICAgZG9tVHlwZSA9IDVcbiAgICAgICAgfSBlbHNlIGlmIChkb20gaW5zdGFuY2VvZiBTVkdJbWFnZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIGRvbVR5cGUgPSAyXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb21UeXBlID0gNFxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxheWVyOiBTaGFwZUxheWVyIHwgSW1hZ2VMYXllciB8IFRleHRMYXllciA9IHtcbiAgICAgICAgICAgIHR5OiBkb21UeXBlLFxuICAgICAgICAgICAgZGRkOiAwLFxuICAgICAgICAgICAgc3I6IDEsXG4gICAgICAgICAgICBhbzogMCxcbiAgICAgICAgICAgIGtzOiB0aGlzLmdlbmVyYXRlVHJhbnNmb3JtKGNvb3JkaW5hdGUpLFxuICAgICAgICAgICAgaXA6IDAsXG4gICAgICAgICAgICBvcDogMSxcbiAgICAgICAgICAgIHN0OiAwLFxuICAgICAgICAgICAgYm06IDBcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKGRvbVR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBjb25zdCBpbWFnZUxheWVyID0gbGF5ZXIgYXMgSW1hZ2VMYXllclxuICAgICAgICAgICAgICAgIGltYWdlTGF5ZXIucmVmSWQgPSByZW5kZXJJbWFnZShkb20gYXMgU1ZHSW1hZ2VFbGVtZW50KVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgY29uc3Qgc2hhcGVMYXllciA9IGxheWVyIGFzIFNoYXBlTGF5ZXJcbiAgICAgICAgICAgICAgICBzaGFwZUxheWVyLnNoYXBlcyA9IFtdXG4gICAgICAgICAgICAgICAgc2hhcGVMYXllci5zaGFwZXMucHVzaChyZW5kZXIoZG9tKSlcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgIGNvbnN0IHRleHRMYXllciA9IGxheWVyIGFzIFRleHRMYXllclxuICAgICAgICAgICAgICAgIHRleHRMYXllci50ID0gcmVuZGVyVGV4dChkb20gYXMgU1ZHVGV4dEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgY29uc3QgbW92aW5MYXllciA9IG5ldyBKU01vdmluTGF5ZXIobGF5ZXIpXG4gICAgICAgIHJldHVybiBtb3ZpbkxheWVyXG4gICAgfVxufSJdfQ==