"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _clamp = require("../../commons/utils/clamp");
var _getMaxScale = require("../../commons/utils/getMaxScale");
var _getScrollPosition = require("../../commons/utils/getScrollPosition");
var _GalleryGestureHandler = _interopRequireDefault(require("./GalleryGestureHandler"));
var _GalleryItem = _interopRequireDefault(require("./GalleryItem"));
var _context = require("./context");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const Gallery = props => {
  const {
    reference,
    data,
    renderItem,
    keyExtractor,
    initialIndex = 0,
    windowSize = 5,
    maxScale: userMaxScale = 6,
    vertical = false,
    gap = 0,
    allowOverflow = false,
    tapOnEdgeToItem = true,
    zoomEnabled = true,
    scaleMode = 'bounce',
    pinchMode = 'clamp',
    allowPinchPanning = true,
    longPressDuration = 500,
    customTransition,
    onIndexChange,
    onScroll,
    onTap,
    onUpdate,
    onPanStart,
    onPanEnd,
    onPinchStart,
    onPinchEnd,
    onSwipe,
    onLongPress,
    onZoomBegin,
    onZoomEnd,
    onVerticalPull,
    onGestureEnd
  } = props;
  const {
    activeIndex,
    rootSize,
    rootChildSize,
    scroll,
    translate,
    scale,
    hasZoomed,
    overflow
  } = (0, _react.useContext)(_context.GalleryContext);
  const nextItems = Math.floor(windowSize / 2);
  const [scrollIndex, setScrollIndex] = (0, _react.useState)(initialIndex);
  const itemSize = (0, _reactNativeReanimated.useDerivedValue)(() => {
    return vertical ? rootSize.height.value : rootSize.width.value;
  }, [vertical, rootSize]);
  const maxScale = (0, _reactNativeReanimated.useDerivedValue)(() => {
    if (typeof userMaxScale === 'object') {
      if (userMaxScale.length === 0) return 6;
      return (0, _getMaxScale.getMaxScale)({
        width: rootChildSize.width.value,
        height: rootChildSize.height.value
      }, userMaxScale[activeIndex.value]);
    }
    return userMaxScale;
  }, [userMaxScale, activeIndex, rootChildSize]);
  const measureRoot = e => {
    const {
      width,
      height
    } = e.nativeEvent.layout;
    const scrollPosition = (0, _getScrollPosition.getScrollPosition)({
      index: activeIndex.get(),
      itemSize: vertical ? height : width,
      gap
    });
    rootSize.width.set(width);
    rootSize.height.set(height);
    scroll.set(scrollPosition);
  };
  const animatedStyles = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: overflow.value
  }), [overflow]);
  (0, _reactNativeReanimated.useDerivedValue)(() => {
    onUpdate === null || onUpdate === void 0 || onUpdate({
      containerSize: {
        width: rootSize.width.value,
        height: rootSize.height.value
      },
      childSize: {
        width: rootChildSize.width.value,
        height: rootChildSize.height.value
      },
      maxScale: maxScale.value,
      translateX: translate.x.value,
      translateY: translate.y.value,
      scale: scale.value
    });
  }, [rootSize, rootChildSize, maxScale, translate, scale]);
  (0, _reactNativeReanimated.useAnimatedReaction)(() => ({
    scroll: scroll.value,
    itemSize: itemSize.value
  }), value => onScroll === null || onScroll === void 0 ? void 0 : onScroll(value.scroll, (data.length - 1) * value.itemSize), [scroll, itemSize]);
  (0, _reactNativeReanimated.useAnimatedReaction)(() => activeIndex.value, value => {
    onIndexChange && (0, _reactNativeReanimated.runOnJS)(onIndexChange)(value);
    (0, _reactNativeReanimated.runOnJS)(setScrollIndex)(value);
  }, [activeIndex]);
  (0, _reactNativeReanimated.useAnimatedReaction)(() => ({
    vertical,
    size: {
      width: rootSize.width.value,
      height: rootSize.height.value
    }
  }), value => {
    scroll.value = (0, _getScrollPosition.getScrollPosition)({
      index: activeIndex.value,
      itemSize: value.vertical ? value.size.height : value.size.width,
      gap
    });
  }, [vertical, rootSize]);
  (0, _reactNativeReanimated.useAnimatedReaction)(() => scale.value, (value, previousValue) => {
    if (value !== 1 && !hasZoomed.value) {
      hasZoomed.value = true;
      onZoomBegin && (0, _reactNativeReanimated.runOnJS)(onZoomBegin)(activeIndex.value);
    } else if (value === 1 && previousValue !== 1 && hasZoomed.value) {
      hasZoomed.value = false;
      onZoomEnd && (0, _reactNativeReanimated.runOnJS)(onZoomEnd)(activeIndex.value);
    }
  }, [scale]);

  // Reference handling
  function setIndex(index) {
    const clampedIndex = (0, _clamp.clamp)(index, 0, data.length - 1);
    activeIndex.value = clampedIndex;
    scroll.value = (0, _getScrollPosition.getScrollPosition)({
      index: clampedIndex,
      itemSize: itemSize.value,
      gap
    });
  }
  function getState() {
    return {
      containerSize: {
        width: rootSize.width.value,
        height: rootSize.height.value
      },
      childSize: {
        width: rootChildSize.width.value,
        height: rootChildSize.height.value
      },
      maxScale: maxScale.value,
      translateX: translate.x.value,
      translateY: translate.y.value,
      scale: scale.value
    };
  }
  function reset(animate = true) {
    translate.x.value = animate ? (0, _reactNativeReanimated.withTiming)(0) : 0;
    translate.y.value = animate ? (0, _reactNativeReanimated.withTiming)(0) : 0;
    scale.value = animate ? (0, _reactNativeReanimated.withTiming)(1) : 1;
  }
  (0, _react.useImperativeHandle)(reference, () => ({
    setIndex,
    reset,
    getState: getState
  }));
  return /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    testID: 'root',
    style: animatedStyles,
    onLayout: measureRoot
  }, data.map((item, index) => {
    const inLowerHalf = index < scrollIndex - nextItems;
    const inUpperHalf = index > scrollIndex + nextItems;
    if (inLowerHalf || inUpperHalf) return null;
    const key = (keyExtractor === null || keyExtractor === void 0 ? void 0 : keyExtractor(item, index)) ?? `item-${index}`;
    return /*#__PURE__*/_react.default.createElement(_GalleryItem.default, {
      key: key,
      zIndex: data.length - index,
      index: index,
      gap: gap,
      item: item,
      vertical: vertical,
      renderItem: renderItem,
      customTransition: customTransition
    });
  }), /*#__PURE__*/_react.default.createElement(_GalleryGestureHandler.default, {
    gap: gap,
    maxScale: maxScale,
    itemSize: itemSize,
    length: data.length,
    vertical: vertical,
    tapOnEdgeToItem: tapOnEdgeToItem,
    zoomEnabled: zoomEnabled,
    scaleMode: scaleMode,
    allowOverflow: allowOverflow,
    allowPinchPanning: allowPinchPanning,
    pinchMode: pinchMode,
    longPressDuration: longPressDuration,
    onTap: onTap,
    onPanStart: onPanStart,
    onPanEnd: onPanEnd,
    onPinchStart: onPinchStart,
    onPinchEnd: onPinchEnd,
    onSwipe: onSwipe,
    onLongPress: onLongPress,
    onVerticalPull: onVerticalPull,
    onGestureEnd: onGestureEnd
  }));
};
var _default = exports.default = Gallery;
//# sourceMappingURL=Gallery.js.map