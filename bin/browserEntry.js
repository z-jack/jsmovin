"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _jsmovin = _interopRequireWildcard(require("./jsmovin"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

Object.defineProperty(window, 'JSMovin', {
  get: function get() {
    return _jsmovin["default"];
  },
  enumerable: true
});
Object.defineProperty(window, 'LayerFactory', {
  get: function get() {
    return _jsmovin.LayerFactory;
  },
  enumerable: true
});
Object.defineProperty(window, 'EasingFactory', {
  get: function get() {
    return _jsmovin.EasingFactory;
  },
  enumerable: true
});
Object.defineProperty(window, 'MaskType', {
  get: function get() {
    return _jsmovin.MaskType;
  },
  enumerable: true
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9icm93c2VyRW50cnkudHMiXSwibmFtZXMiOlsiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJ3aW5kb3ciLCJnZXQiLCJKU01vdmluIiwiZW51bWVyYWJsZSIsIkxheWVyRmFjdG9yeSIsIkVhc2luZ0ZhY3RvcnkiLCJNYXNrVHlwZSJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOzs7Ozs7QUFHQUEsTUFBTSxDQUFDQyxjQUFQLENBQXNCQyxNQUF0QixFQUE4QixTQUE5QixFQUF5QztBQUFFQyxFQUFBQSxHQUFHLEVBQUU7QUFBQSxXQUFNQyxtQkFBTjtBQUFBLEdBQVA7QUFBc0JDLEVBQUFBLFVBQVUsRUFBRTtBQUFsQyxDQUF6QztBQUNBTCxNQUFNLENBQUNDLGNBQVAsQ0FBc0JDLE1BQXRCLEVBQThCLGNBQTlCLEVBQThDO0FBQUVDLEVBQUFBLEdBQUcsRUFBRTtBQUFBLFdBQU1HLHFCQUFOO0FBQUEsR0FBUDtBQUEyQkQsRUFBQUEsVUFBVSxFQUFFO0FBQXZDLENBQTlDO0FBQ0FMLE1BQU0sQ0FBQ0MsY0FBUCxDQUFzQkMsTUFBdEIsRUFBOEIsZUFBOUIsRUFBK0M7QUFBRUMsRUFBQUEsR0FBRyxFQUFFO0FBQUEsV0FBTUksc0JBQU47QUFBQSxHQUFQO0FBQTRCRixFQUFBQSxVQUFVLEVBQUU7QUFBeEMsQ0FBL0M7QUFDQUwsTUFBTSxDQUFDQyxjQUFQLENBQXNCQyxNQUF0QixFQUE4QixVQUE5QixFQUEwQztBQUFFQyxFQUFBQSxHQUFHLEVBQUU7QUFBQSxXQUFNSyxpQkFBTjtBQUFBLEdBQVA7QUFBdUJILEVBQUFBLFVBQVUsRUFBRTtBQUFuQyxDQUExQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBKU01vdmluIGZyb20gJy4vanNtb3ZpbidcbmltcG9ydCB7IEVhc2luZ0ZhY3RvcnksIE1hc2tUeXBlLCBMYXllckZhY3RvcnkgfSBmcm9tICcuL2pzbW92aW4nXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3csICdKU01vdmluJywgeyBnZXQ6ICgpID0+IEpTTW92aW4sIGVudW1lcmFibGU6IHRydWUgfSlcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3csICdMYXllckZhY3RvcnknLCB7IGdldDogKCkgPT4gTGF5ZXJGYWN0b3J5LCBlbnVtZXJhYmxlOiB0cnVlIH0pXG5PYmplY3QuZGVmaW5lUHJvcGVydHkod2luZG93LCAnRWFzaW5nRmFjdG9yeScsIHsgZ2V0OiAoKSA9PiBFYXNpbmdGYWN0b3J5LCBlbnVtZXJhYmxlOiB0cnVlIH0pXG5PYmplY3QuZGVmaW5lUHJvcGVydHkod2luZG93LCAnTWFza1R5cGUnLCB7IGdldDogKCkgPT4gTWFza1R5cGUsIGVudW1lcmFibGU6IHRydWUgfSkiXX0=