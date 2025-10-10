import React, { useEffect, useState } from "react";
import PrescriptionModal from "./components/PrescriptionModal.js";
import { usePrescriptionCreate } from "./hooks/usePrescriptionCreate.js";
import { usePrescription } from "./hooks/usePrescription.js";
import { usePrescriptionUpdate } from "./hooks/usePrescriptionUpdate.js";
import { usePatientPrescriptions } from "./hooks/usePatientPrescriptions.js";
import { OptometryPrescriptionTable } from "./components/OptometryPrescriptionTable.js";
const patientId = (new URLSearchParams(window.location.search).get("patient_id") || new URLSearchParams(window.location.search).get("id")) ?? "0";
export const OptometryPrescriptionApp = () => {
  const {
    createPrescription
  } = usePrescriptionCreate();
  const {
    updatePrescription
  } = usePrescriptionUpdate();
  const {
    prescriptions,
    fetchPrescriptions
  } = usePatientPrescriptions();
  const {
    prescription
  } = usePrescription();
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [initialData, setInitialData] = useState(undefined);
  const handleSubmit = async data => {
    const newData = {
      user_id: 1,
      patient_id: +patientId,
      medicines: data,
      is_active: true
    };
    if (prescription) {
      await updatePrescription(prescription.id, newData);
    } else {
      await createPrescription(newData);
    }
    fetchPrescriptions(patientId, "optometry");
    setShowPrescriptionModal(false);
  };
  const handleHidePrescriptionModal = () => {
    setShowPrescriptionModal(false);
  };
  useEffect(() => {
    fetchPrescriptions(patientId, "optometry");
  }, []);
  useEffect(() => {
    if (!prescription) return;
    setInitialData({
      patient_id: +((new URLSearchParams(window.location.search).get("patient_id") || new URLSearchParams(window.location.search).get("id")) ?? "0"),
      medicines: prescription.recipe_items,
      user_id: 1,
      is_active: true
    });
  }, [prescription]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "mb-1"
  }, "Recetas")), /*#__PURE__*/React.createElement(OptometryPrescriptionTable, {
    prescriptions: prescriptions
  }), /*#__PURE__*/React.createElement(PrescriptionModal, {
    title: prescription ? "Editar receta" : "Crear receta",
    show: showPrescriptionModal,
    handleSubmit: handleSubmit,
    onHide: handleHidePrescriptionModal,
    initialData: initialData
  }));
};