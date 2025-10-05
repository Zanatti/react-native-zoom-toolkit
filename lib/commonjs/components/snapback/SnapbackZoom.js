"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _useVector = require("../../commons/hooks/useVector");
var _useSizeVector = require("../../commons/hooks/useSizeVector");
var _resizeToAspectRatio = require("../../commons/utils/resizeToAspectRatio");
var _withSnapbackValidation = _interopRequireDefault(require("../../commons/hoc/withSnapbackValidation"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const DEFAULT_HITSLOP = {
  vertical: 0,
  horizontal: 0
};
const SnapbackZoom = ({
  children,
  hitSlop = DEFAULT_HITSLOP,
  resizeConfig,
  timingConfig,
  gesturesEnabled = true,
  longPressDuration = 500,
  scrollRef,
  onTap,
  onPinchStart,
  onPinchEnd,
  onLongPress,
  onUpdate,
  onGestureEnd,
  onVerticalSwipe
}) => {
  const containerRef = (0, _reactNativeReanimated.useAnimatedRef)();
  const translate = (0, _useVector.useVector)(0, 0);
  const scale = (0, _reactNativeReanimated.useSharedValue)(1);
  const position = (0, _useVector.useVector)(0, 0);
  const origin = (0, _useVector.useVector)(0, 0);
  const initialFocal = (0, _useVector.useVector)(0, 0);
  const currentFocal = (0, _useVector.useVector)(0, 0);
  const containerSize = (0, _useSizeVector.useSizeVector)((resizeConfig === null || resizeConfig === void 0 ? void 0 : resizeConfig.size.width) ?? 0, (resizeConfig === null || resizeConfig === void 0 ? void 0 : resizeConfig.size.height) ?? 0);
  const measureContainer = () => {
    'worklet';

    const measurement = (0, _reactNativeReanimated.measure)(containerRef);
    if (measurement !== null) {
      containerSize.width.value = measurement.width;
      containerSize.height.value = measurement.height;
      position.x.value = measurement.pageX;
      position.y.value = measurement.pageY;
    }
  };
  const childrenSize = (0, _reactNativeReanimated.useDerivedValue)(() => {
    return (0, _resizeToAspectRatio.resizeToAspectRatio)({
      resizeConfig,
      width: containerSize.width.value,
      height: containerSize.height.value,
      scale: scale.value
    });
  }, [resizeConfig, containerSize, scale]);
  (0, _reactNativeReanimated.useDerivedValue)(() => {
    const state = {
      size: {
        width: containerSize.width.value,
        height: containerSize.height.value
      },
      position: {
        x: position.x.value,
        y: position.y.value
      },
      translateX: translate.x.value - childrenSize.value.deltaX,
      translateY: translate.y.value - childrenSize.value.deltaY,
      scale: scale.value
    };
    if (resizeConfig !== undefined) {
      state.resize = {
        width: childrenSize.value.width,
        height: childrenSize.value.height
      };
    }
    onUpdate === null || onUpdate === void 0 || onUpdate(state);
  }, [containerSize, position, childrenSize, resizeConfig, translate, scale]);
  const pinch = _reactNativeGestureHandler.Gesture.Pinch().withTestId('pinch').hitSlop(hitSlop).enabled(gesturesEnabled).onTouchesMove(e => {
    if (e.numberOfTouches !== 2) return;
    const one = e.allTouches[0];
    const two = e.allTouches[1];
    currentFocal.x.value = (one.absoluteX + two.absoluteX) / 2;
    currentFocal.y.value = (one.absoluteY + two.absoluteY) / 2;
  }).onStart(e => {
    measureContainer();
    onPinchStart && (0, _reactNativeReanimated.runOnJS)(onPinchStart)(e);
    initialFocal.x.value = currentFocal.x.value;
    initialFocal.y.value = currentFocal.y.value;
    origin.x.value = e.focalX - containerSize.width.value / 2;
    origin.y.value = e.focalY - containerSize.height.value / 2;
  }).onUpdate(e => {
    measureContainer();
    const deltaX = currentFocal.x.value - initialFocal.x.value;
    const deltaY = currentFocal.y.value - initialFocal.y.value;
    const toX = -1 * (origin.x.value * e.scale - origin.x.value) + deltaX;
    const toY = -1 * (origin.y.value * e.scale - origin.y.value) + deltaY;
    translate.x.value = toX;
    translate.y.value = toY;
    scale.value = e.scale;
  }).onEnd(e => {
    onPinchEnd && (0, _reactNativeReanimated.runOnJS)(onPinchEnd)(e);
    translate.x.value = (0, _reactNativeReanimated.withTiming)(0, timingConfig);
    translate.y.value = (0, _reactNativeReanimated.withTiming)(0, timingConfig);
    scale.value = (0, _reactNativeReanimated.withTiming)(1, timingConfig, _ => {
      onGestureEnd && (0, _reactNativeReanimated.runOnJS)(onGestureEnd)();
    });
  });
  if (scrollRef !== undefined) {
    pinch.blocksExternalGesture(scrollRef);
  }
  const tap = _reactNativeGestureHandler.Gesture.Tap().withTestId('tap').enabled(gesturesEnabled).maxDuration(110).maxDelay(80).maxDistance(18).numberOfTaps(1).minPointers(1).runOnJS(true).onEnd(e => onTap === null || onTap === void 0 ? void 0 : onTap(e));
  const longPress = _reactNativeGestureHandler.Gesture.LongPress().withTestId('longPress').enabled(gesturesEnabled).minDuration(longPressDuration).runOnJS(true).onStart(e => onLongPress === null || onLongPress === void 0 ? void 0 : onLongPress(e));
  const invokeVerticalSwipe = event => {
    if (onVerticalSwipe) {
      onVerticalSwipe(event);
    }
  };
  const pan = _reactNativeGestureHandler.Gesture.Pan().withTestId('pan').enabled(gesturesEnabled).maxPointers(1).minDistance(10).activeOffsetY([-24, 24]).failOffsetX([-16, 16]).onBegin(() => {
    'worklet';

    (0, _reactNativeReanimated.runOnJS)(invokeVerticalSwipe)({
      phase: 'start'
    });
  }).onChange(event => {
    'worklet';

    (0, _reactNativeReanimated.runOnJS)(invokeVerticalSwipe)({
      phase: 'update',
      translationY: event.translationY
    });
  }).onEnd(event => {
    'worklet';

    (0, _reactNativeReanimated.runOnJS)(invokeVerticalSwipe)({
      phase: 'end',
      translationY: event.translationY,
      velocityY: event.velocityY,
      direction: event.translationY >= 0 ? 'down' : 'up'
    });
  }).onFinalize(() => {
    'worklet';

    (0, _reactNativeReanimated.runOnJS)(invokeVerticalSwipe)({
      phase: 'finalize'
    });
  });
  const containerStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    width: resizeConfig === null || resizeConfig === void 0 ? void 0 : resizeConfig.size.width,
    height: resizeConfig === null || resizeConfig === void 0 ? void 0 : resizeConfig.size.height,
    justifyContent: 'center',
    alignItems: 'center'
  }), [resizeConfig]);
  const childStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    const {
      width,
      height,
      deltaX,
      deltaY
    } = childrenSize.value;
    return {
      width: width === 0 ? undefined : width,
      height: height === 0 ? undefined : height,
      transform: [{
        translateX: translate.x.value - deltaX
      }, {
        translateY: translate.y.value - deltaY
      }, {
        scale: scale.value
      }]
    };
  }, [childrenSize, translate, scale]);
  const composedTapGesture = _reactNativeGestureHandler.Gesture.Exclusive(tap, longPress);
  const composedGesture = _reactNativeGestureHandler.Gesture.Simultaneous(pinch, _reactNativeGestureHandler.Gesture.Race(pan, composedTapGesture));
  return /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.GestureDetector, {
    gesture: composedGesture
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: containerStyle,
    ref: containerRef
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: childStyle
  }, children)));
};
var _default = exports.default = (0, _withSnapbackValidation.default)(SnapbackZoom);
//# sourceMappingURL=SnapbackZoom.js.map