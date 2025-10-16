import React, { useEffect, useRef, useState } from "react";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { formatDateDMY } from "../../../services/utilidades.js";
import { useAllRecipes } from "./hooks/useAllRecipes.js";
import { MedicationPrescriptionManager } from "./helpers/MedicationPrescriptionManager.js";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useActiveTenantConvenios } from "../../convenios/hooks/useActiveTenantConvenios.js";
import { useConvenioRecipes } from "../../convenios/hooks/useConvenioRecipes.js";
export const MedicationDeliveryList = ({
  onDeliverySelect,
  onDeliverySelectConvenio
}) => {
  const {
    fetchAllRecipes,
    recipes
  } = useAllRecipes();
  const {
    convenios
  } = useActiveTenantConvenios();
  const {
    fetchConvenioRecipes,
    recipes: convenioRecipes
  } = useConvenioRecipes();
  const [search, setSearch] = useState('');
  const [selectedConvenio, setSelectedConvenio] = useState(null);
  const statusItems = [{
    label: 'Todos',
    command: () => fetchRecipes("ALL")
  }, {
    label: 'Pendiente',
    command: () => fetchRecipes("PENDING")
  }, {
    label: 'Entregado',
    command: () => fetchRecipes("DELIVERED")
  }];
  const statusMenu = useRef(null);
  const finalRecipes = selectedConvenio ? convenioRecipes : recipes;

  // useEffect(() => {
  //     fetchRecipes("PENDING");
  // }, [selectedConvenio]);

  const fetchRecipes = status => {
    if (search.length < 3) {
      return;
    }
    if (!selectedConvenio) {
      fetchAllRecipes(status, search);
    } else {
      fetchConvenioRecipes({
        tenantId: selectedConvenio.tenant_b_id,
        apiKey: selectedConvenio.api_keys.find(apiKey => apiKey.module === "farmacia").key,
        module: "farmacia",
        search,
        status
      });
    }
  };
  useEffect(() => {
    fetchRecipes("PENDING");
  }, [search]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-wrap justify-content-between gap-2 align-items-center mb-3"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-filter me-2"
    }),
    label: "Filtrar por estado",
    onClick: event => statusMenu.current?.toggle(event),
    className: "btn btn-sm btn-outline-secondary"
  }), /*#__PURE__*/React.createElement(Menu, {
    model: statusItems,
    popup: true,
    ref: statusMenu
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Dropdown, {
    inputId: "convenio",
    options: convenios,
    optionLabel: "label",
    filter: true,
    showClear: true,
    placeholder: "Convenio",
    className: "w-100",
    value: selectedConvenio,
    onChange: e => {
      console.log(e.value);
      setSelectedConvenio(e.value);
      onDeliverySelectConvenio(e.value);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "input-group mb-2"
  }, /*#__PURE__*/React.createElement(InputText, {
    placeholder: "Buscar por # o nombre...",
    id: "searchOrder",
    className: "w-100",
    value: search,
    onChange: e => setSearch(e.target.value)
  })), /*#__PURE__*/React.createElement(Divider, {
    className: "my-2"
  }), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-4"
  }, finalRecipes.map(recipe => {
    const manager = new MedicationPrescriptionManager(recipe);
    return /*#__PURE__*/React.createElement("div", {
      key: recipe.id,
      className: "card shadow-sm border-0 cursor-pointer hover-shadow",
      onClick: () => onDeliverySelect(recipe),
      style: {
        transition: 'all 0.2s ease',
        borderRadius: '8px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-body p-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between align-items-start mb-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center gap-2"
    }, /*#__PURE__*/React.createElement("h6", {
      className: "card-title mb-0 fw-bold text-primary"
    }, "Receta #", recipe.id), /*#__PURE__*/React.createElement("span", {
      className: `badge fs-7 bg-${manager.statusSeverity}`,
      style: {
        fontSize: '0.7rem'
      }
    }, manager.statusLabel)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("small", {
      className: "text-muted fw-medium"
    }, formatDateDMY(recipe.created_at)))), /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between align-items-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center gap-1"
    }, /*#__PURE__*/React.createElement("small", {
      className: "fw-semibold text-muted fs-7"
    }, "Paciente:"), /*#__PURE__*/React.createElement("small", {
      className: "text-dark fs-7"
    }, manager?.prescriber?.name || '--'))))));
  })), /*#__PURE__*/React.createElement("style", null, `
                .hover-shadow:hover {
                    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                    transform: translateY(-2px);
                }
                .min-width-fit {
                    min-width: 110px;
                }
                .fs-7 {
                    font-size: 0.875rem !important;
                }
                .fs-9 {
                    font-size: 0.75rem !important;
                }
                .lh-sm {
                    line-height: 1.4 !important;
                }
            `));
};