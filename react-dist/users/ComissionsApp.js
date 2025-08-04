import React, { useEffect, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import { CommissionTable } from "./ComissionTable.js";
import { ComissionFormModal } from "./ComissionsFormModal.js";
import { comissionConfig } from "../../services/api/index.js";
import { SwalManager } from "../../services/alertManagerImported.js";
import { useCommission } from "./hooks/useCommission.js";
export const ComissionApp = () => {
  const {
    commission,
    setCommission,
    fetchCommissionsHook
  } = useCommission();
  const [commissions, setCommissions] = useState([]);
  const [showUserFormModal, setShowUserFormModal] = useState(false);
  const [initialData, setInitialData] = useState(undefined);
  useEffect(() => {
    fetchCommissions();
  }, []);
  useEffect(() => {
    if (commission) {
      const productsIds = commission.services.map(service => service.product.id);
      setInitialData({
        users: [commission.user.id],
        attention_type: commission.attention_type,
        application_type: commission.application_type,
        commission_type: commission.commission_type,
        services: productsIds,
        commission_value: commission.commission_value,
        percentage_base: commission.percentage_base,
        percentage_value: commission.percentage_value,
        retention_type: commission.retention_type,
        value_retention: commission.value_retention,
        isEditing: true,
        id: commission.id
      });
    }
  }, [commission]);
  const onCreate = () => {
    setInitialData(undefined);
    setShowUserFormModal(true);
  };
  const handleSubmit = async data => {
    const finalData = {
      ...data
    };
    try {
      if (commission) {
        const response = await comissionConfig.CommissionConfigUpdate(commission.id, finalData);
        SwalManager.success({
          title: "Registro actualizado"
        });
      } else {
        const response = await comissionConfig.create(finalData);
        SwalManager.success();
      }
    } catch (error) {
      console.error("Error creating/updating comission config: ", error);
    } finally {
      setShowUserFormModal(false);
      await fetchCommissions();
    }
  };
  const handleHideUserFormModal = () => {
    setShowUserFormModal(false);
  };
  const handleTableEdit = id => {
    fetchCommissionsHook(id);
    setShowUserFormModal(true);
  };
  async function fetchCommissions() {
    try {
      const response = await comissionConfig.comissionConfigGet();
      if (response.length) {
        const dataMapped = response.map(item => ({
          id: item.id,
          attention_type: item.attention_type == "entity" ? "Entidad" : "Particular",
          application_type: item.application_type == "service" ? "Servicio" : "Orden",
          commission_type: item.commission_type == "percentage" ? "Porcentaje" : "Cantidad fija",
          percentage_base: item.percentage_base == "public" ? "Por paciente particular" : "Por entidad",
          percentage_value: item.percentage_value ? item.percentage_value : " - - - ",
          commission_value: item.commission_value,
          fullName: `${item.user.first_name || ""} ${item.user.middle_name || ""} ${item.user.last_name || ""} ${item.user.second_last_name || ""}`
        }));
        setCommissions(dataMapped);
      }
    } catch (error) {
      console.error("Error fetching comissions: ", error);
    }
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      appendTo: "self",
      zIndex: {
        overlay: 100000
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "mb-1"
  }, "Comisiones"), /*#__PURE__*/React.createElement("div", {
    className: "text-end mb-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary d-flex align-items-center",
    onClick: onCreate
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus me-2"
  }), "Nuevo"))), /*#__PURE__*/React.createElement(CommissionTable, {
    commissions: commissions,
    onEditItem: handleTableEdit
  }), /*#__PURE__*/React.createElement(ComissionFormModal, {
    title: "Crear Comisiones",
    show: showUserFormModal,
    handleSubmit: handleSubmit,
    onHide: handleHideUserFormModal,
    initialData: initialData
  })));
};