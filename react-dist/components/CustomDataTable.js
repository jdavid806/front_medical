import React from 'react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
DataTable.use(DT);
const CustomDataTable = ({
  children,
  data,
  slots,
  columns
}) => {
  const options = {
    language: {
      url: "https://cdn.datatables.net/plug-ins/2.2.2/i18n/es-ES.json"
    }
  };
  return /*#__PURE__*/React.createElement(DataTable, {
    data: data,
    slots: slots,
    options: options,
    columns: columns
  }, children);
};
export default CustomDataTable;