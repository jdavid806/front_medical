import React from "react";
export const WebCreatorLogo = ({
  component
}) => {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    style: {
      width: "100%",
      height: "70px",
      objectFit: "contain",
      objectPosition: "center"
    },
    src: component.imgSrc,
    alt: "Logo"
  }));
};