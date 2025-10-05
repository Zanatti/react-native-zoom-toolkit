"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _clamp = require("../../commons/utils/clamp");
var _useVector = require("../../commons/hooks/useVector");
var _getMaxScale = require("../../commons/utils/getMaxScale");
var _useSizeVector = require("../../commons/hooks/useSizeVector");
var _usePanCommons = require("../../commons/hooks/usePanCommons");
var _usePinchCommons = require("../../commons/hooks/usePinchCommons");
var _useDoubleTapCommons = require("../../commons/hooks/useDoubleTapCommons");
var _getVisibleRect = require("../../commons/utils/getVisibleRect");
var _withResumableValidation = _interopRequireDefault(require("../../commons/hoc/withResumableValidation"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const ResumableZoom = props => {
  const {
    reference,
    children,
    style,
    extendGestures = false,
    decay = true,
    tapsEnabled = true,
    panEnabled = true,
    pinchEnabled = true,
    minScale = 1,
    maxScale: userMaxScale = 6,
    panMode = 'clamp',
    scaleMode = 'bounce',
    pinchMode = 'clamp',
    allowPinchPanning = true,
    longPressDuration = 500,
    onTap,
    onLongPress,
    onUpdate,
    onGestureEnd,
    onSwipe,
    onPinchStart: onUserPinchStart,
    onPinchEnd: onUserPinchEnd,
    onPanStart: onUserPanStart,
    onPanEnd: onUserPanEnd,
    onOverPanning
  } = props;
  const rootSize = (0, _useSizeVector.useSizeVector)(1, 1);
  const childSize = (0, _useSizeVector.useSizeVector)(1, 1);
  const extendedSize = (0, _useSizeVector.useSizeVector)(1, 1);
  const translate = (0, _useVector.useVector)(0, 0);
  const offset = (0, _useVector.useVector)(0, 0);
  const scale = (0, _reactNativeReanimated.useSharedValue)(minScale);
  const scaleOffset = (0, _reactNativeReanimated.useSharedValue)(minScale);
  const maxScale = (0, _reactNativeReanimated.useDerivedValue)(() => {
    if (typeof userMaxScale === 'object') {
      return (0, _getMaxScale.getMaxScale)({
        width: childSize.width.value,
        height: childSize.height.value
      }, userMaxScale);
    }
    return userMaxScale;
  }, [userMaxScale, childSize]);
  (0, _reactNativeReanimated.useDerivedValue)(() => {
    extendedSize.width.value = extendGestures ? Math.max(rootSize.width.value, childSize.width.value) : childSize.width.value;
    extendedSize.height.value = extendGestures ? Math.max(rootSize.height.value, childSize.height.value) : childSize.height.value;
  }, [extendGestures, rootSize, childSize]);
  const boundsFn = optionalScale => {
    'worklet';

    const actualScale = optionalScale ?? scale.value;
    const {
      width: cWidth,
      height: cHeight
    } = childSize;
    const {
      width: rWidth,
      height: rHeight
    } = rootSize;
    const boundX = Math.max(0, cWidth.value * actualScale - rWidth.value) / 2;
    const boundY = Math.max(0, cHeight.value * actualScale - rHeight.value) / 2;
    return {
      x: boundX,
      y: boundY
    };
  };
  const set = (toX, toY, toScale, animate) => {
    'worklet';

    translate.x.value = animate ? (0, _reactNativeReanimated.withTiming)(toX) : toX;
    translate.y.value = animate ? (0, _reactNativeReanimated.withTiming)(toY) : toY;
    scale.value = animate ? (0, _reactNativeReanimated.withTiming)(toScale) : toScale;
    scaleOffset.value = toScale;
  };
  (0, _reactNativeReanimated.useDerivedValue)(() => {
    onUpdate === null || onUpdate === void 0 || onUpdate({
      containerSize: {
        width: rootSize.width.value,
        height: rootSize.height.value
      },
      childSize: {
        width: childSize.width.value,
        height: childSize.height.value
      },
      maxScale: maxScale.value,
      translateX: translate.x.value,
      translateY: translate.y.value,
      scale: scale.value
    });
  }, [rootSize, childSize, translate, maxScale, scale]);
  const {
    gesturesEnabled,
    onTouchesDown,
    onTouchesMove,
    onTouchesUp,
    onPinchStart,
    onPinchUpdate,
    onPinchEnd
  } = (0, _usePinchCommons.usePinchCommons)({
    container: extendedSize,
    translate,
    offset,
    scale,
    scaleOffset,
    minScale,
    maxScale,
    allowPinchPanning,
    scaleMode,
    pinchMode,
    boundFn: boundsFn,
    userCallbacks: {
      onGestureEnd,
      onPinchStart: onUserPinchStart,
      onPinchEnd: onUserPinchEnd
    }
  });
  const {
    onPanStart,
    onPanChange,
    onPanEnd
  } = (0, _usePanCommons.usePanCommons)({
    container: extendedSize,
    translate,
    offset,
    panMode,
    boundFn: boundsFn,
    decay,
    userCallbacks: {
      onSwipe,
      onGestureEnd,
      onPanStart: onUserPanStart,
      onPanEnd: onUserPanEnd,
      onOverPanning
    }
  });
  const {
    onDoubleTapStart,
    onDoubleTapEnd,
    enablePanGestureByDoubleTap
  } = (0, _useDoubleTapCommons.useDoubleTapCommons)({
    container: extendedSize,
    translate,
    scale,
    minScale,
    maxScale,
    scaleOffset,
    boundsFn: boundsFn,
    onGestureEnd
  });
  const pinch = _reactNativeGestureHandler.Gesture.Pinch().withTestId('pinch').enabled(pinchEnabled).manualActivation(true).onTouchesDown(onTouchesDown).onTouchesMove(onTouchesMove).onTouchesUp(onTouchesUp).onStart(onPinchStart).onUpdate(onPinchUpdate).onEnd(onPinchEnd);
  const pan = _reactNativeGestureHandler.Gesture.Pan().withTestId('pan').enabled(panEnabled && gesturesEnabled && enablePanGestureByDoubleTap).maxPointers(1).onStart(onPanStart).onChange(onPanChange).onEnd(onPanEnd);
  const tap = _reactNativeGestureHandler.Gesture.Tap().withTestId('tap').enabled(tapsEnabled && gesturesEnabled).maxDuration(250).numberOfTaps(1).runOnJS(true).onEnd(e => onTap === null || onTap === void 0 ? void 0 : onTap(e));
  const doubleTap = _reactNativeGestureHandler.Gesture.Tap().withTestId('doubleTap').enabled(tapsEnabled && gesturesEnabled).maxDuration(250).numberOfTaps(2).onStart(onDoubleTapStart).onEnd(onDoubleTapEnd);
  const longPress = _reactNativeGestureHandler.Gesture.LongPress().withTestId('longPress').enabled(gesturesEnabled).minDuration(longPressDuration).runOnJS(true).onStart(e => onLongPress === null || onLongPress === void 0 ? void 0 : onLongPress(e));
  const measureRoot = e => {
    rootSize.width.value = e.nativeEvent.layout.width;
    rootSize.height.value = e.nativeEvent.layout.height;
  };
  const measureChild = e => {
    childSize.width.value = e.nativeEvent.layout.width;
    childSize.height.value = e.nativeEvent.layout.height;
  };
  const detectorStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    return {
      width: extendedSize.width.value,
      height: extendedSize.height.value,
      transform: [{
        translateX: translate.x.value
      }, {
        translateY: translate.y.value
      }, {
        scale: scale.value
      }]
    };
  }, [extendedSize, translate, scale]);
  const getState = () => {
    return {
      containerSize: {
        width: rootSize.width.value,
        height: rootSize.height.value
      },
      childSize: {
        width: childSize.width.value,
        height: childSize.height.value
      },
      maxScale: maxScale.value,
      translateX: translate.x.value,
      translateY: translate.y.value,
      scale: scale.value
    };
  };
  const setState = (state, animate = true) => {
    const toScale = (0, _clamp.clamp)(state.scale, minScale, maxScale.value);
    const {
      x: boundX,
      y: boundY
    } = boundsFn(toScale);
    const toX = (0, _clamp.clamp)(state.translateX, -1 * boundX, boundX);
    const toY = (0, _clamp.clamp)(state.translateY, -1 * boundY, boundY);
    set(toX, toY, toScale, animate);
  };
  const getVisibleRect = () => {
    return (0, _getVisibleRect.getVisibleRect)({
      scale: scale.value,
      itemSize: {
        width: childSize.width.value,
        height: childSize.height.value
      },
      containerSize: {
        width: rootSize.width.value,
        height: rootSize.height.value
      },
      translation: {
        x: translate.x.value,
        y: translate.y.value
      }
    });
  };
  const zoom = (newScale, position) => {
    const toScale = (0, _clamp.clamp)(newScale, minScale, maxScale.value);
    let focal = position;
    if (focal !== undefined) {
      focal = {
        x: (0, _clamp.clamp)(focal.x, 0, childSize.width.value),
        y: (0, _clamp.clamp)(focal.y, 0, childSize.height.value)
      };
    } else {
      const frame = getVisibleRect();
      focal = {
        x: frame.x + frame.width / 2,
        y: frame.y + frame.height / 2
      };
    }
    const centerX = childSize.width.value / 2;
    const centerY = childSize.height.value / 2;
    const originX = focal.x - centerX;
    const originY = focal.y - centerY;
    const signedDistanceCenterX = centerX - focal.x;
    const signedDistanceCenterY = centerY - focal.y;
    const translateX = signedDistanceCenterX + (originX - originX * toScale);
    const translateY = signedDistanceCenterY + (originY - originY * toScale);
    const {
      x: boundX,
      y: boundY
    } = boundsFn(toScale);
    const toX = (0, _clamp.clamp)(translateX, -1 * boundX, boundX);
    const toY = (0, _clamp.clamp)(translateY, -1 * boundY, boundY);
    set(toX, toY, toScale, true);
  };
  (0, _react.useImperativeHandle)(reference, () => ({
    reset: (animate = true) => set(0, 0, minScale, animate),
    getState: getState,
    setTransformState: setState,
    zoom: zoom,
    getVisibleRect: getVisibleRect
  }));
  const composedTap = _reactNativeGestureHandler.Gesture.Exclusive(doubleTap, tap, longPress);
  const composedGesture = _reactNativeGestureHandler.Gesture.Race(pinch, pan, composedTap);
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [style ?? styles.flex, styles.center],
    onLayout: measureRoot
  }, /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.GestureDetector, {
    gesture: composedGesture
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    testID: 'root',
    style: [detectorStyle, styles.center]
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    testID: 'child',
    onLayout: measureChild
  }, children))));
};
const styles = _reactNative.StyleSheet.create({
  flex: {
    flex: 1
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});
var _default = exports.default = (0, _withResumableValidation.default)(ResumableZoom);
//# sourceMappingURL=ResumableZoom.js.map