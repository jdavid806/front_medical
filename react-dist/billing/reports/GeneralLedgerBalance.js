import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import { Toast } from 'primereact/toast';
import { useAccountingEntries } from "./hooks/useAccountingEntries.js";
export const GeneralLedgerBalance = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedRows, setExpandedRows] = useState(null);
  const [accountGroups, setAccountGroups] = useState([]);
  const toast = useRef(null);
  const {
    accountingEntries: data
  } = useAccountingEntries();

  // Procesar datos iniciales
  useEffect(() => {
    if (data && data.data.length > 0) {
      processAccountData(data.data);
    }
  }, [data]);

  // Procesar datos y agrupar por cuenta contable
  const processAccountData = entries => {
    const accountsMap = new Map();
    entries.forEach(entry => {
      const account = entry.accounting_account;
      if (!accountsMap.has(account.account_code)) {
        accountsMap.set(account.account_code, {
          account_code: account.account_code,
          account_name: account.account_name,
          account_type: account.account_type,
          balance: parseFloat(account.balance),
          entries: []
        });
      }
      accountsMap.get(account.account_code)?.entries.push(entry);
    });
    setAccountGroups(Array.from(accountsMap.values()));
  };

  // Formatear saldo
  const formatBalance = balance => {
    return Math.abs(balance).toFixed(2);
  };

  // Plantilla de expansión de fila
  const rowExpansionTemplate = account => {
    return /*#__PURE__*/React.createElement("div", {
      className: "p-3"
    }, /*#__PURE__*/React.createElement("h5", null, "Movimientos de ", account.account_name), /*#__PURE__*/React.createElement(DataTable, {
      value: account.entries,
      size: "small"
    }, /*#__PURE__*/React.createElement(Column, {
      field: "entry_date",
      header: "Fecha",
      body: rowData => new Date(rowData.entry_date).toLocaleDateString()
    }), /*#__PURE__*/React.createElement(Column, {
      field: "description",
      header: "Descripci\xF3n"
    }), /*#__PURE__*/React.createElement(Column, {
      header: "D\xE9bito",
      body: rowData => rowData.type === "debit" ? parseFloat(rowData.amount).toFixed(2) : "-"
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Cr\xE9dito",
      body: rowData => rowData.type === "credit" ? parseFloat(rowData.amount).toFixed(2) : "-"
    })));
  };

  // Determinar si una fila puede expandirse
  const allowExpansion = rowData => {
    return rowData.entries.length > 0;
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4"
  }, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement(TabView, {
    activeIndex: activeTab,
    onTabChange: e => setActiveTab(e.index)
  }, /*#__PURE__*/React.createElement(TabPanel, {
    header: "Libro Mayor"
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(DataTable, {
    value: accountGroups,
    expandedRows: expandedRows,
    onRowToggle: e => setExpandedRows(e.data),
    rowExpansionTemplate: rowExpansionTemplate,
    dataKey: "account_code",
    tableStyle: {
      minWidth: '60rem'
    }
  }, /*#__PURE__*/React.createElement(Column, {
    expander: allowExpansion,
    style: {
      width: '3rem'
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "account_code",
    header: "C\xF3digo",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "account_name",
    header: "Nombre de Cuenta",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Tipo",
    body: rowData => {
      switch (rowData.account_type) {
        case "asset":
          return "Activo";
        case "liability":
          return "Pasivo";
        case "income":
          return "Ingreso";
        case "expense":
          return "Gasto";
        default:
          return rowData.account_type;
      }
    },
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Saldo",
    body: rowData => formatBalance(rowData.balance),
    sortable: true
  })))), /*#__PURE__*/React.createElement(TabPanel, {
    header: "Balance"
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(DataTable, {
    value: accountGroups,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    className: "p-datatable-striped",
    emptyMessage: "No se encontraron cuentas",
    tableStyle: {
      minWidth: "50rem"
    }
  }, /*#__PURE__*/React.createElement(Column, {
    field: "account_code",
    header: "C\xF3digo"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "account_name",
    header: "Nombre de Cuenta"
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Tipo",
    body: rowData => {
      switch (rowData.account_type) {
        case "asset":
          return "Activo";
        case "liability":
          return "Pasivo";
        case "income":
          return "Ingreso";
        case "expense":
          return "Gasto";
        default:
          return rowData.account_type;
      }
    }
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Saldo",
    body: rowData => formatBalance(rowData.balance)
  }))))));
};