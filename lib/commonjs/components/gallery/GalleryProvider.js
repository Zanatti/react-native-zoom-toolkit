"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNativeReanimated = require("react-native-reanimated");
var _clamp = require("../../commons/utils/clamp");
var _useVector = require("../../commons/hooks/useVector");
var _useSizeVector = require("../../commons/hooks/useSizeVector");
var _Gallery = _interopRequireDefault(require("./Gallery"));
var _context = require("./context");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const GalleryProvider = (props, ref) => {
  const startIndex = (0, _clamp.clamp)(props.initialIndex ?? 0, 0, props.data.length - 1);
  const activeIndex = (0, _reactNativeReanimated.useSharedValue)(startIndex);
  const rootSize = (0, _useSizeVector.useSizeVector)(0, 0);
  const rootChildSize = (0, _useSizeVector.useSizeVector)(0, 0);
  const translate = (0, _useVector.useVector)(0, 0);
  const scale = (0, _reactNativeReanimated.useSharedValue)(1);
  const scroll = (0, _reactNativeReanimated.useSharedValue)(0);
  const scrollOffset = (0, _reactNativeReanimated.useSharedValue)(0);
  const isScrolling = (0, _reactNativeReanimated.useSharedValue)(false);
  const hasZoomed = (0, _reactNativeReanimated.useSharedValue)(false);
  const overflow = (0, _reactNativeReanimated.useSharedValue)('hidden');
  const hideAdjacentItems = (0, _reactNativeReanimated.useSharedValue)(false);
  const context = {
    rootSize,
    rootChildSize,
    scroll,
    scrollOffset,
    translate,
    activeIndex,
    isScrolling,
    scale,
    hasZoomed,
    overflow,
    hideAdjacentItems
  };
  return /*#__PURE__*/_react.default.createElement(_context.GalleryContext.Provider, {
    value: context
  }, /*#__PURE__*/_react.default.createElement(_Gallery.default, _extends({}, props, {
    initialIndex: startIndex,
    reference: ref
  })));
};
var _default = exports.default = /*#__PURE__*/(0, _react.forwardRef)(GalleryProvider);
//# sourceMappingURL=GalleryProvider.js.map