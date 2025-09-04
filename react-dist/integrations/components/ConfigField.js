import React from "react";
import { ConfigFieldText } from "./ConfigFieldText.js";
import { ConfigFieldFile } from "./ConfigFieldFile.js";
import { ConfigFieldPassword } from "./ConfigFieldPassword.js";
import { ConfigFieldList } from "./ConfigFieldList.js";
export const ConfigField = props => {
  const {
    field,
    label,
    type,
    initialValue,
    onChange,
    onFileChange,
    multiple,
    source,
    sourceType,
    placeholder,
    description
  } = props;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2 mb-3 w-100"
  }, type === "text" && /*#__PURE__*/React.createElement(ConfigFieldText, {
    field: field,
    label: label,
    initialValue: initialValue,
    onChange: onChange,
    placeholder: placeholder
  }), type === "password" && /*#__PURE__*/React.createElement(ConfigFieldPassword, {
    field: field,
    label: label,
    initialValue: initialValue,
    onChange: onChange,
    placeholder: placeholder
  }), type === "file" && /*#__PURE__*/React.createElement(ConfigFieldFile, {
    field: field,
    label: label,
    initialValue: initialValue,
    onChange: onChange,
    onFileChange: onFileChange,
    placeholder: placeholder
  }), type === "list" && /*#__PURE__*/React.createElement(ConfigFieldList, {
    field: field,
    label: label,
    initialValue: initialValue,
    onChange: onChange,
    multiple: multiple,
    source: source,
    sourceType: sourceType,
    placeholder: placeholder
  }), /*#__PURE__*/React.createElement("small", null, description)));
};