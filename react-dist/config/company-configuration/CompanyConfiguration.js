// CompanyConfiguration.tsx
import React, { useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";
import GeneralInfoTab from "./components/GeneralInfoTab.js";
import CommunicationsTab from "./components/CommunicationsTab.js";
import BranchesTab from "./components/BranchesTab.js";
import RepresentativeTab from "./components/RepresentativeTab.js";
import { useCompanyGeneral } from "./hooks/useCompanyGeneral.js";
import { Button } from "primereact/button";
import { useTabValidation } from "../general-configuration/hooks/useTabValidation.js";
export const CompanyConfiguration = ({
  onComplete
}) => {
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
  const {
    validations,
    updateValidation,
    allTabsCompleted,
    getEnabledTabs
  } = useTabValidation(company);
  const handleCompanyUpdate = updatedCompany => {
    console.log("Company updated:", updatedCompany);
    refetch();
    console.log("company:", company);
  };
  const handleTabChange = index => {
    const enabledTabs = getEnabledTabs();
    if (enabledTabs.includes(index)) {
      setActiveIndex(index);
    }
  };
  const isTabEnabled = index => {
    return getEnabledTabs().includes(index);
  };
  const getTabHeader = (index, icon, label) => {
    const enabled = isTabEnabled(index);
    const getDisabledReason = () => {
      if (index === 1 && !validations.generalInfo) return "Complete Información General primero";
      if (index === 2 && (!validations.generalInfo || !validations.representative)) return "Complete Representante primero";
      if (index === 3 && (!validations.generalInfo || !validations.representative)) return "Complete Representante primero";
      return "Módulo bloqueado";
    };
    return /*#__PURE__*/React.createElement("div", {
      className: `flex align-items-center gap-2 ${!enabled ? "opacity-50" : ""}`
    }, /*#__PURE__*/React.createElement("i", {
      className: icon
    }), /*#__PURE__*/React.createElement("span", null, label), !enabled && /*#__PURE__*/React.createElement("i", {
      className: "pi pi-lock text-muted ml-2",
      style: {
        fontSize: "0.8rem"
      },
      title: getDisabledReason()
    }));
  };
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "container-fluid"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-center align-items-center",
      style: {
        height: "400px"
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
    onTabChange: e => handleTabChange(e.index),
    className: "company-config-tabs"
  }, /*#__PURE__*/React.createElement(TabPanel, {
    header: getTabHeader(0, "fa-solid fa-circle-info", "Información General")
  }, /*#__PURE__*/React.createElement(GeneralInfoTab, {
    company: company,
    onUpdate: handleCompanyUpdate,
    onValidationChange: isValid => updateValidation("generalInfo", isValid)
  })), /*#__PURE__*/React.createElement(TabPanel, {
    header: getTabHeader(1, "fa-solid fa-address-book", "Representante"),
    disabled: !isTabEnabled(1)
  }, /*#__PURE__*/React.createElement(RepresentativeTab, {
    companyId: company?.id,
    onValidationChange: isValid => updateValidation("representative", isValid)
  })), /*#__PURE__*/React.createElement(TabPanel, {
    header: getTabHeader(2, "fa-solid fa-envelopes-bulk", "Comunicaciones"),
    disabled: !isTabEnabled(2)
  }, /*#__PURE__*/React.createElement(CommunicationsTab, {
    whatsAppStatus: whatsAppStatus,
    onStatusChange: setWhatsAppStatus
  })), /*#__PURE__*/React.createElement(TabPanel, {
    header: getTabHeader(3, "fa-solid fa-location-dot", "Sedes"),
    disabled: !isTabEnabled(3)
  }, /*#__PURE__*/React.createElement(BranchesTab, {
    companyId: company?.id,
    onValidationChange: isValid => updateValidation("branches", isValid)
  }))), allTabsCompleted && /*#__PURE__*/React.createElement("div", {
    className: "mt-4 p-3 border-top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("small", {
    className: "text-success"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-check-circle mr-2"
  }), "Todos los m\xF3dulos completados")), /*#__PURE__*/React.createElement(Button, {
    label: "Continuar a Siguiente M\xF3dulo",
    icon: "pi pi-arrow-right",
    iconPos: "right",
    className: "p-button-success",
    onClick: onComplete
  }))))));
};