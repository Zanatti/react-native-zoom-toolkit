"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = withCropValidation;
var _react = _interopRequireWildcard(require("react"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function withCropValidation(Component) {
  return /*#__PURE__*/(0, _react.forwardRef)((props, ref) => {
    const {
      minScale,
      maxScale
    } = props;
    if (minScale !== undefined && minScale < 1) {
      throw new Error('minScale property must be greater than or equals one');
    }
    if (maxScale !== undefined && maxScale < 1) {
      throw new Error('maxScale property must be greater than or equals one');
    }
    if (minScale !== undefined && maxScale !== undefined && minScale > maxScale) {
      throw new Error('minScale property must not be greater than maxScale');
    }
    return /*#__PURE__*/_react.default.createElement(Component, _extends({}, props, {
      reference: ref
    }));
  });
}
//# sourceMappingURL=withCropValidation.js.map