import React, { useEffect } from "react";
import { useFileInput } from "../hooks/useFileInput.js";
export const ConfigFieldFile = props => {
  const {
    field,
    label,
    initialValue,
    onFileChange
  } = props;
  const {
    fileUrl,
    setFileUrl,
    fileInputRef,
    handleFileChange: handleFileChangeInput,
    previewFile
  } = useFileInput();
  useEffect(() => {
    if (initialValue) {
      setFileUrl(initialValue);
    }
  }, [initialValue]);
  const handleFileChange = newFile => {
    handleFileChangeInput(newFile);
    onFileChange?.({
      field,
      file: newFile
    });
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
    htmlFor: field,
    className: "form-label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-fill"
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    type: "file",
    id: "addParaclinicalFormFile",
    accept: ".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.p12",
    onChange: e => handleFileChange(e.target.files ? e.target.files[0] : null),
    ref: fileInputRef
  }), fileUrl && /*#__PURE__*/React.createElement("div", {
    className: "d-flex"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary ms-2",
    type: "button",
    onClick: previewFile,
    disabled: !fileUrl
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-eye"
  }), " Previsualizar"))));
};