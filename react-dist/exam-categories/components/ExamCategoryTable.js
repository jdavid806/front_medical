import React from 'react';
import CustomDataTable from "../../components/CustomDataTable.js";
import { useEffect } from 'react';
import { useState } from 'react';
import { TableBasicActions } from "../../components/TableBasicActions.js";
export const ExamCategoryTable = ({
  examCategories,
  onEditItem,
  onDeleteItem
}) => {
  const [tableExamCategories, setTableExamCategories] = useState([]);
  useEffect(() => {
    const mappedExamCategories = examCategories.map(examCategory => {
      return {
        id: examCategory.id,
        examCategoryName: examCategory.name
      };
    });
    setTableExamCategories(mappedExamCategories);
  }, [examCategories]);
  const columns = [{
    data: 'examCategoryName'
  }, {
    orderable: false,
    searchable: false
  }];
  const slots = {
    1: (cell, data) => /*#__PURE__*/React.createElement(TableBasicActions, {
      onEdit: () => onEditItem(data.id),
      onDelete: () => onDeleteItem(data.id)
    })
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(CustomDataTable, {
    data: tableExamCategories,
    slots: slots,
    columns: columns
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Nombre"), /*#__PURE__*/React.createElement("th", {
    className: "text-end align-middle pe-0 border-top mb-2",
    scope: "col"
  })))))));
};