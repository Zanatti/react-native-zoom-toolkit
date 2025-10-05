"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = withResumableValidation;
var _react = _interopRequireWildcard(require("react"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function withResumableValidation(Component) {
  return /*#__PURE__*/(0, _react.forwardRef)((props, ref) => {
    const childrenCount = _react.default.Children.count(props.children);
    if (childrenCount !== 1) {
      const message = `ResumableZoom expected one child but received ${childrenCount} children`;
      throw new Error(message);
    }
    if (props.minScale !== undefined && props.minScale < 1) {
      throw new Error('minScale must be greater than or equals one');
    }
    if (typeof props.maxScale === 'number' && props.maxScale < 1) {
      throw new Error('maxScale must be greater than one, or a SizeVector object in order to infer the max scale');
    }
    if (props.minScale && typeof props.maxScale === 'number' && props.minScale > props.maxScale) {
      throw new Error('minScale must not be greater maxScale');
    }
    if (props.longPressDuration !== undefined && props.longPressDuration <= 250) {
      throw new Error('longPressDuration must be greater than 250ms');
    }
    return /*#__PURE__*/_react.default.createElement(Component, _extends({}, props, {
      reference: ref
    }));
  });
}
//# sourceMappingURL=withResumableValidation.js.map