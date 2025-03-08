import React from 'react';
import { TicketTable } from "./components/TicketTable.js";
import { PrimeReactProvider } from 'primereact/api';
export const TicketApp = () => {
  return /*#__PURE__*/React.createElement(PrimeReactProvider, null, /*#__PURE__*/React.createElement(TicketTable, null));
};