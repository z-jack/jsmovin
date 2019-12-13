"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var JSMovin = _interopRequireWildcard(require("./jsmovin"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

Object.entries(JSMovin).forEach(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      entry = _ref2[0],
      body = _ref2[1];

  if (entry === 'default') {
    Object.defineProperty(window, 'JSMovin', {
      get: function get() {
        return body;
      },
      enumerable: true
    });
  } else {
    Object.defineProperty(window, entry, {
      get: function get() {
        return body;
      },
      enumerable: true
    });
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9icm93c2VyRW50cnkudHMiXSwibmFtZXMiOlsiT2JqZWN0IiwiZW50cmllcyIsIkpTTW92aW4iLCJmb3JFYWNoIiwiZW50cnkiLCJib2R5IiwiZGVmaW5lUHJvcGVydHkiLCJ3aW5kb3ciLCJnZXQiLCJlbnVtZXJhYmxlIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7O0FBRUFBLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlQyxPQUFmLEVBQXdCQyxPQUF4QixDQUFnQyxnQkFBbUI7QUFBQTtBQUFBLE1BQWpCQyxLQUFpQjtBQUFBLE1BQVZDLElBQVU7O0FBQy9DLE1BQUlELEtBQUssS0FBSyxTQUFkLEVBQXlCO0FBQ3JCSixJQUFBQSxNQUFNLENBQUNNLGNBQVAsQ0FBc0JDLE1BQXRCLEVBQThCLFNBQTlCLEVBQXlDO0FBQUVDLE1BQUFBLEdBQUcsRUFBRTtBQUFBLGVBQU1ILElBQU47QUFBQSxPQUFQO0FBQW1CSSxNQUFBQSxVQUFVLEVBQUU7QUFBL0IsS0FBekM7QUFDSCxHQUZELE1BRU87QUFDSFQsSUFBQUEsTUFBTSxDQUFDTSxjQUFQLENBQXNCQyxNQUF0QixFQUE4QkgsS0FBOUIsRUFBcUM7QUFBRUksTUFBQUEsR0FBRyxFQUFFO0FBQUEsZUFBTUgsSUFBTjtBQUFBLE9BQVA7QUFBbUJJLE1BQUFBLFVBQVUsRUFBRTtBQUEvQixLQUFyQztBQUNIO0FBQ0osQ0FORCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEpTTW92aW4gZnJvbSAnLi9qc21vdmluJ1xuXG5PYmplY3QuZW50cmllcyhKU01vdmluKS5mb3JFYWNoKChbZW50cnksIGJvZHldKSA9PiB7XG4gICAgaWYgKGVudHJ5ID09PSAnZGVmYXVsdCcpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdywgJ0pTTW92aW4nLCB7IGdldDogKCkgPT4gYm9keSwgZW51bWVyYWJsZTogdHJ1ZSB9KVxuICAgIH0gZWxzZSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3csIGVudHJ5LCB7IGdldDogKCkgPT4gYm9keSwgZW51bWVyYWJsZTogdHJ1ZSB9KVxuICAgIH1cbn0pIl19