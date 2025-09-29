import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import GeneralInfoTab from "./components/GeneralInfoTab.js";
import CommunicationsTab from "./components/CommunicationsTab.js";
import BranchesTab from "./components/BranchesTab.js";
import RepresentativeTab from "./components/RepresentativeTab.js";
import { useCompanyGeneral } from "./hooks/useCompanyGeneral.js";
import { Button } from 'primereact/button';
export const CompanyConfiguration = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [whatsAppStatus, setWhatsAppStatus] = useState({
    connected: false
  });
  const {
    company,
    loading,
    error,
    refetch
  } = useCompanyGeneral();
  const handleCompanyUpdate = updatedCompany => {
    refetch();
  };
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "container-fluid"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-center align-items-center",
      style: {
        height: '400px'
      }
    }, /*#__PURE__*/React.createElement(ProgressSpinner, null)));
  }
  if (error) {
    return /*#__PURE__*/React.createElement("div", {
      className: "container-fluid"
    }, /*#__PURE__*/React.createElement(Message, {
      severity: "error",
      text: error,
      className: "my-3"
    }), /*#__PURE__*/React.createElement(Button, {
      label: "Reintentar",
      icon: "pi pi-refresh",
      onClick: refetch
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row gx-3 gy-4 mb-5"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "p-3"
  }, /*#__PURE__*/React.createElement(TabView, {
    activeIndex: activeIndex,
    onTabChange: e => setActiveIndex(e.index),
    className: "company-config-tabs"
  }, /*#__PURE__*/React.createElement(TabPanel, {
    header: /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center gap-2"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-circle-info"
    }), /*#__PURE__*/React.createElement("span", null, "Informaci\xF3n General"))
  }, /*#__PURE__*/React.createElement(GeneralInfoTab, {
    company: company,
    onUpdate: handleCompanyUpdate
  })), /*#__PURE__*/React.createElement(TabPanel, {
    header: /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center gap-2"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-address-book"
    }), /*#__PURE__*/React.createElement("span", null, "Representante"))
  }, /*#__PURE__*/React.createElement(RepresentativeTab, {
    companyId: company?.id
  })), /*#__PURE__*/React.createElement(TabPanel, {
    header: /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center gap-2"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-envelopes-bulk"
    }), /*#__PURE__*/React.createElement("span", null, "Comunicaciones"))
  }, /*#__PURE__*/React.createElement(CommunicationsTab, {
    whatsAppStatus: whatsAppStatus,
    onStatusChange: setWhatsAppStatus
  })), /*#__PURE__*/React.createElement(TabPanel, {
    header: /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center gap-2"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-location-dot"
    }), /*#__PURE__*/React.createElement("span", null, "Sedes"))
  }, /*#__PURE__*/React.createElement(BranchesTab, {
    companyId: company?.id
  }))))));
};