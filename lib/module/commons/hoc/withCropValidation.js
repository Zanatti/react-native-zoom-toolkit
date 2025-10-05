function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { forwardRef } from 'react';
export default function withCropValidation(Component) {
  return /*#__PURE__*/forwardRef((props, ref) => {
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
    return /*#__PURE__*/React.createElement(Component, _extends({}, props, {
      reference: ref
    }));
  });
}
//# sourceMappingURL=withCropValidation.js.map