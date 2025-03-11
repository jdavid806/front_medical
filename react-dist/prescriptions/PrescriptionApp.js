import React, { useEffect, useState } from 'react';
import PrescriptionTable from "../prescriptions/components/PrescriptionTable.js";
import PrescriptionModal from "./components/PrescriptionModal.js";
import { useAllPrescriptions } from "./hooks/useAllPrescriptions.js";
import { usePrescriptionCreate } from "./hooks/usePrescriptionCreate.js";
import { usePrescription } from "./hooks/usePrescription.js";
import { usePrescriptionDelete } from "./hooks/usePrescriptionDelete.js";
import { usePrescriptionUpdate } from "./hooks/usePrescriptionUpdate.js";
export const PrescriptionApp = () => {
  const {
    createPrescription
  } = usePrescriptionCreate();
  const {
    updatePrescription
  } = usePrescriptionUpdate();
  const {
    prescriptions,
    fetchPrescriptions
  } = useAllPrescriptions();
  const {
    deletePrescription
  } = usePrescriptionDelete();
  const {
    prescription,
    setPrescription,
    fetchPrescription
  } = usePrescription();
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [initialData, setInitialData] = useState(undefined);
  const handleSubmit = async data => {
    console.log(data);
    const newData = {
      user_id: 1,
      patient_id: +((new URLSearchParams(window.location.search).get('patient_id') || new URLSearchParams(window.location.search).get('id')) ?? 0),
      medicines: data,
      is_active: true
    };
    if (prescription) {
      await updatePrescription(prescription.id, newData);
    } else {
      await createPrescription(newData);
    }
    fetchPrescriptions();
    setShowPrescriptionModal(false);
  };
  const handleTableEdit = id => {
    fetchPrescription(id);
    setShowPrescriptionModal(true);
  };
  const handleTableDelete = async id => {
    const confirmed = await deletePrescription(id);
    if (confirmed) fetchPrescriptions();
  };
  const handleOnCreate = () => {
    setInitialData(undefined);
    setPrescription(null);
    setShowPrescriptionModal(true);
  };
  const handleHidePrescriptionModal = () => {
    setShowPrescriptionModal(false);
  };
  useEffect(() => {
    console.log('Prescription: ', prescription);
    if (!prescription) return;
    setInitialData({
      patient_id: +((new URLSearchParams(window.location.search).get('patient_id') || new URLSearchParams(window.location.search).get('id')) ?? "0"),
      medicines: prescription.recipe_items,
      user_id: 1,
      is_active: true
    });
  }, [prescription]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "mb-1"
  }, "Recetas")), /*#__PURE__*/React.createElement(PrescriptionTable, {
    prescriptions: prescriptions,
    onEditItem: handleTableEdit,
    onDeleteItem: handleTableDelete
  }), /*#__PURE__*/React.createElement(PrescriptionModal, {
    title: prescription ? 'Editar receta' : 'Crear receta',
    show: showPrescriptionModal,
    handleSubmit: handleSubmit,
    onHide: handleHidePrescriptionModal,
    initialData: initialData
  }));
};