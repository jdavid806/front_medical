import React, { forwardRef, useImperativeHandle } from "react";
import { CustomPRTable } from "../../components/CustomPRTable.js";
import { useSuppliesDeliveries } from "./hooks/useSuppliesDeliveries.js";
import { SuppliesDeliveriesTableMapper } from "./mappers.js";
import { Tag } from "primereact/tag";
export const SuppliesDeliveriesTable = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    suppliesDeliveries,
    fetchSuppliesDeliveries,
    loading
  } = useSuppliesDeliveries();
  const tableItems = SuppliesDeliveriesTableMapper.mapToTableItems(suppliesDeliveries);
  useImperativeHandle(ref, () => ({
    refresh: () => fetchSuppliesDeliveries()
  }));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: [{
      field: 'type',
      header: 'Tipo'
    }, {
      field: 'products',
      header: 'Insumos',
      body: data => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        className: "d-flex flex-column gap-2"
      }, data.products.map(product => /*#__PURE__*/React.createElement("div", {
        key: product.id
      }, /*#__PURE__*/React.createElement("div", null, product.name, " (x", product.quantity, ")")))))
    }, {
      field: 'observations',
      header: 'Observaciones'
    }, {
      field: 'status',
      header: 'Estado',
      body: data => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Tag, {
        value: data.status.label,
        severity: data.status.severity
      }))
    }],
    data: tableItems,
    loading: loading,
    onReload: fetchSuppliesDeliveries
  }));
});