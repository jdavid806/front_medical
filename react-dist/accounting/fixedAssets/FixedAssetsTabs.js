import React, { useState, useEffect } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import FixedAssetsTable from "./tables/FixedAssetsTable.js";
import DepreciationHistoryTable from "./tables/DepreciationHistoryTable.js";
export const FixedAssetsTabs = () => {
  const [activeTab, setActiveTab] = useState("assets");
  const [loading, setLoading] = useState(false);
  const renderActiveComponent = () => {
    switch (activeTab) {
      case "assets":
        return /*#__PURE__*/React.createElement(FixedAssetsTable, null);
      case "depreciation":
        return /*#__PURE__*/React.createElement(DepreciationHistoryTable, null);
      default:
        return /*#__PURE__*/React.createElement(FixedAssetsTable, null);
    }
  };
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [activeTab]);
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
  }, /*#__PURE__*/React.createElement("nav", {
    className: "mb-3",
    "aria-label": "breadcrumb"
  }, /*#__PURE__*/React.createElement("ol", {
    className: "breadcrumb mb-0"
  }, /*#__PURE__*/React.createElement("li", {
    className: "breadcrumb-item"
  }, /*#__PURE__*/React.createElement("a", {
    href: "homeContabilidad"
  }, "Contabilidad")), /*#__PURE__*/React.createElement("li", {
    className: "breadcrumb-item active"
  }, "Activos Fijos"))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto",
    style: {
      minHeight: "400px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body h-100 w-100 d-flex flex-column"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tabs-professional-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tabs-header"
  }, /*#__PURE__*/React.createElement("button", {
    className: `tab-item ${activeTab === "assets" ? "active" : ""}`,
    onClick: () => setActiveTab("assets")
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-building"
  }), "Activos Fijos"), /*#__PURE__*/React.createElement("button", {
    className: `tab-item ${activeTab === "depreciation" ? "active" : ""}`,
    onClick: () => setActiveTab("depreciation")
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-calculator"
  }), "Historial")), /*#__PURE__*/React.createElement("div", {
    className: "tabs-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: `tab-panel ${activeTab === "assets" ? "active" : ""}`
  }, renderActiveComponent()), /*#__PURE__*/React.createElement("div", {
    className: `tab-panel ${activeTab === "depreciation" ? "active" : ""}`
  }, renderActiveComponent()))))))));
};