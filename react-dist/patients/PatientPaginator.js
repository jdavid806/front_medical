import React from 'react';
export const PatientPaginator = ({
  totalPages,
  currentPage,
  onPageChange
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: "paginator"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "pagination"
  }, /*#__PURE__*/React.createElement("li", {
    className: `page-item ${currentPage === 1 ? 'disabled' : ''}`
  }, /*#__PURE__*/React.createElement("a", {
    className: "page-link",
    href: "#",
    onClick: () => onPageChange(currentPage - 1)
  }, "\xAB")), Array.from({
    length: totalPages
  }, (_, page) => /*#__PURE__*/React.createElement("li", {
    key: page + 1,
    className: `page-item ${page + 1 === currentPage ? 'active' : ''}`
  }, /*#__PURE__*/React.createElement("a", {
    className: "page-link",
    href: "#",
    onClick: () => onPageChange(page + 1)
  }, page + 1))), /*#__PURE__*/React.createElement("li", {
    className: `page-item ${currentPage === totalPages ? 'disabled' : ''}`
  }, /*#__PURE__*/React.createElement("a", {
    className: "page-link",
    href: "#",
    onClick: () => onPageChange(currentPage + 1)
  }, "\xBB"))));
};