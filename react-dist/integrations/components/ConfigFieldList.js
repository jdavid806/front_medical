function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from "react";
import { ConfigFieldListSingle } from "./ConfigFieldListSingle.js";
import { ConfigFieldListMultiple } from "./ConfigFieldListMultiple.js";
import { useFieldListOptions } from "../hooks/useFieldListOptions.js";
export const ConfigFieldList = props => {
  const {
    multiple,
    source,
    sourceType
  } = props;
  const {
    options
  } = useFieldListOptions(source || "", sourceType || "");
  return /*#__PURE__*/React.createElement(React.Fragment, null, !multiple && /*#__PURE__*/React.createElement(ConfigFieldListSingle, _extends({}, props, {
    options: options
  })), multiple && /*#__PURE__*/React.createElement(ConfigFieldListMultiple, _extends({}, props, {
    options: options
  })));
};