import React from 'react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
DataTable.use(DT);
const CustomDataTable = ({
  children,
  data,
  slots,
  columns,
  customOptions
}) => {
  const options = {
    language: {
      url: "https://cdn.datatables.net/plug-ins/2.2.2/i18n/es-ES.json"
    },
    ...customOptions
  };
  return /*#__PURE__*/React.createElement(DataTable, {
    data: data,
    slots: slots,
    options: options,
    columns: columns,
    className: "text-body-emphasis"
  }, children);
};
export default CustomDataTable;