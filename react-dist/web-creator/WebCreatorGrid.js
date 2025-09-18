import React, { forwardRef, useImperativeHandle, useState } from "react";
export const WebCreatorGrid = /*#__PURE__*/forwardRef(({
  grid,
  onCellClick
}, ref) => {
  const [selectedCell, setSelectedCell] = useState(null);
  useImperativeHandle(ref, () => ({}));
  return /*#__PURE__*/React.createElement(React.Fragment, null, grid.map((row, index) => /*#__PURE__*/React.createElement("div", {
    className: "row p-2",
    key: index
  }, row.map((column, index) => /*#__PURE__*/React.createElement("div", {
    className: `col-md-${column.colSpan} cursor-pointer ${selectedCell?.uuid === column.uuid ? "border border-3 border-primary " : ""}`,
    key: index,
    onClick: () => {
      setSelectedCell(column);
      onCellClick(column);
    }
  }, "x", column.component?.name)))));
});