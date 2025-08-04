import React, { useEffect, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import { comissionConfig } from "../../../services/api/index.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { useMassMessage } from "./hooks/useMassMessage.js";
import { useMassMessagesAll } from "./hooks/useMassMessagesAll.js";
import { MassMessageTable } from "./MassMessageTable.js";
import { MassMessageFormModal } from "./MassMessageFormModal.js";
export const MassMessageApp = () => {
  const {
    massMessage,
    setMassMessage,
    fetchMassMessage
  } = useMassMessage();
  const {
    massMessages,
    setMassMessages,
    fetchMassMessages
  } = useMassMessagesAll();
  const [showFormModal, setShowFormModal] = useState(false);
  const [initialData, setInitialData] = useState(undefined);
  useEffect(() => {
    fetchMassMessages();
  }, []);

  //   useEffect(() => {
  //     if (commission) {
  //       const productsIds = commission.services.map(
  //         (service) => service.product.id
  //       );
  //       setInitialData({
  //         users: [commission.user.id],
  //         attention_type: commission.attention_type,
  //         application_type: commission.application_type,
  //         commission_type: commission.commission_type,
  //         services: productsIds,
  //         commission_value: commission.commission_value,
  //         percentage_base: commission.percentage_base,
  //         percentage_value: commission.percentage_value,
  //         retention_type: commission.retention_type,
  //         value_retention: commission.value_retention,
  //         isEditing: true,
  //         id: commission.id,
  //       });
  //     }
  //   }, [commission]);

  const onCreate = () => {
    setInitialData(undefined);
    setShowFormModal(true);
  };
  const handleSubmit = async data => {
    const finalData = {
      ...data
    };
    try {
      if (massMessage) {
        const response = await comissionConfig.CommissionConfigUpdate(massMessage.id, finalData);
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
      setShowFormModal(false);
      await fetchMassMessages();
    }
  };
  const handleHideFormModal = () => {
    setShowFormModal(false);
  };
  const handleTableEdit = id => {
    fetchMassMessage(id);
    setShowFormModal(true);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      appendTo: "self",
      zIndex: {
        overlay: 100000
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-end mb-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary d-flex align-items-center",
    onClick: onCreate
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus me-2"
  }), "Nuevo Mensaje"))), /*#__PURE__*/React.createElement(MassMessageTable, {
    massMessages: massMessages,
    onEditItem: handleTableEdit
  }), /*#__PURE__*/React.createElement(MassMessageFormModal, {
    title: "Crear Mensaje Masivo",
    show: showFormModal,
    handleSubmit: handleSubmit,
    onHide: handleHideFormModal,
    initialData: initialData
  })));
};