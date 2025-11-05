import React, { useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { SalesInvoices } from "../invoices/SalesInvoices.js";
import { PurchaseInvoices } from "../invoices/PurchaseInvoices.js";
import { BillingEntity } from "../invoices/BillingEntity.js";
import { DebitCreditNotes } from "../invoices/DebitCreditNotes.js";
import { PurchaseOrders } from "../invoices/PurchaseOrders.js";
export const TabsBilling = () => {
  const [activeTab, setActiveTab] = useState("salesInvoices");
  const [loading, setLoading] = useState(false);
  const renderActiveComponent = () => {
    switch (activeTab) {
      case "salesInvoices":
        return /*#__PURE__*/React.createElement(SalesInvoices, null);
      case "purchaseInvoices":
        return /*#__PURE__*/React.createElement(PurchaseInvoices, null);
      case "billingEntity":
        return /*#__PURE__*/React.createElement(BillingEntity, null);
      case "debitCreditNotes":
        return /*#__PURE__*/React.createElement(DebitCreditNotes, null);
      case "purchaseOrders":
        return /*#__PURE__*/React.createElement(PurchaseOrders, null);
      default:
        return /*#__PURE__*/React.createElement(SalesInvoices, null);
    }
  };
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex justify-content-center align-items-center",
      style: {
        height: "50vh"
      }
    }, /*#__PURE__*/React.createElement(ProgressSpinner, null));
  }
  return /*#__PURE__*/React.createElement("main", {
    className: "main",
    id: "top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3 justify-content-between align-items-start mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto",
    style: {
      minHeight: "400px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body h-100 w-100 d-flex flex-column",
    style: {
      marginTop: "-40px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "tabs-professional-container mt-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tabs-header"
  }, /*#__PURE__*/React.createElement("button", {
    className: `tab-item ${activeTab === "salesInvoices" ? "active" : ""}`,
    onClick: () => setActiveTab("salesInvoices")
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-file-invoice-dollar"
  }), "Facturaci\xF3n Ventas"), /*#__PURE__*/React.createElement("button", {
    className: `tab-item ${activeTab === "purchaseInvoices" ? "active" : ""}`,
    onClick: () => setActiveTab("purchaseInvoices")
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-file-invoice-dollar"
  }), "Facturaci\xF3n Compras"), /*#__PURE__*/React.createElement("button", {
    className: `tab-item ${activeTab === "billingEntity" ? "active" : ""}`,
    onClick: () => setActiveTab("billingEntity")
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-file-invoice-dollar"
  }), "Facturaci\xF3n X Entidad"), /*#__PURE__*/React.createElement("button", {
    className: `tab-item ${activeTab === "debitCreditNotes" ? "active" : ""}`,
    onClick: () => setActiveTab("debitCreditNotes")
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-file-alt"
  }), "Nota D\xE9bito/Cr\xE9ditos"), /*#__PURE__*/React.createElement("button", {
    className: `tab-item ${activeTab === "purchaseOrders" ? "active" : ""}`,
    onClick: () => setActiveTab("purchaseOrders")
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-file-invoice"
  }), "\xD3rdenes de Compras")), /*#__PURE__*/React.createElement("div", {
    className: "tabs-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: `tab-panel ${activeTab === "salesInvoices" ? "active" : ""}`
  }, renderActiveComponent()), /*#__PURE__*/React.createElement("div", {
    className: `tab-panel ${activeTab === "purchaseInvoices" ? "active" : ""}`
  }, renderActiveComponent()), /*#__PURE__*/React.createElement("div", {
    className: `tab-panel ${activeTab === "billingEntity" ? "active" : ""}`
  }, renderActiveComponent()), /*#__PURE__*/React.createElement("div", {
    className: `tab-panel ${activeTab === "debitCreditNotes" ? "active" : ""}`
  }, renderActiveComponent()), /*#__PURE__*/React.createElement("div", {
    className: `tab-panel ${activeTab === "purchaseOrders" ? "active" : ""}`
  }, renderActiveComponent()))))))));
};