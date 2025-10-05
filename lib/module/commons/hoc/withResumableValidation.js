function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { forwardRef } from 'react';
export default function withResumableValidation(Component) {
  return /*#__PURE__*/forwardRef((props, ref) => {
    const childrenCount = React.Children.count(props.children);
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
    return /*#__PURE__*/React.createElement(Component, _extends({}, props, {
      reference: ref
    }));
  });
}
//# sourceMappingURL=withResumableValidation.js.map