import React, { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ExamForm } from "../exams/components/ExamForm.js";
import { DisabilityForm } from "../disabilities/form/DisabilityForm.js";
import { remissionsForm as RemissionsForm } from "../remissions/RemissionsForm.js";
import PrescriptionForm from "../prescriptions/components/PrescriptionForm.js";
import { LeavingConsultationGenerateTicket } from "../tickets/LeavingConsultationGenerateTicket.js";
import { LeavingConsultationAppointmentForm } from "../appointments/LeavingConsultationAppointmentForm.js";
import { Divider } from "primereact/divider";
import { AddVaccineForm } from "../vaccines/form/AddVaccineForm.js";
import { Card } from "primereact/card";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useSpecialty } from "../fe-config/speciality/hooks/useSpecialty.js";
import { AutoComplete } from "primereact/autocomplete";
import { CustomPRTable } from "../components/CustomPRTable.js";
export const FinishClinicalRecordModal = ({
  patientId,
  visible,
  onClose
}) => {
  const {
    control,
    resetField
  } = useForm({
    defaultValues: {
      diagnosis: null,
      diagnoses: []
    }
  });
  const {
    append: appendDiagnosis,
    remove: removeDiagnosis,
    update: updateDiagnosis
  } = useFieldArray({
    control,
    name: "diagnoses"
  });
  const diagnoses = useWatch({
    control,
    name: "diagnoses"
  });
  const {
    cie11Codes,
    loadCie11Codes,
    cie11Code,
    setCie11Code
  } = useSpecialty();
  const [activeTab, setActiveTab] = useState(null);
  const [examsActive, setExamsActive] = useState(false);
  const [disabilitiesActive, setDisabilitiesActive] = useState(false);
  const [prescriptionsActive, setPrescriptionsActive] = useState(false);
  const [vaccinationsActive, setVaccinationsActive] = useState(false);
  const [remissionsActive, setRemissionsActive] = useState(false);
  const [appointmentActive, setAppointmentActive] = useState(false);
  const [turnsActive, setTurnsActive] = useState(false);
  const examFormRef = useRef(null);
  const disabilityFormRef = useRef(null);
  const prescriptionFormRef = useRef(null);
  const vaccineFormRef = useRef(null);
  const remissionFormRef = useRef(null);
  const appointmentFormRef = useRef(null);
  const hideModal = () => {
    onClose?.();
  };
  const tabs = [{
    key: "examinations",
    label: "Exámenes Clínicos"
  }, {
    key: "incapacities",
    label: "Incapacidades Clínicas"
  }, {
    key: "prescriptions",
    label: "Recetas Médicas"
  }, {
    key: "vaccinations",
    label: "Vacunas"
  }, {
    key: "referral",
    label: "Remisión"
  }, {
    key: "appointment",
    label: "Cita"
  }, {
    key: "turns",
    label: "Turnos"
  }];
  const handleFinish = async () => {
    const exams = examFormRef.current?.getFormData();
    const disabilities = disabilityFormRef.current?.getFormData();
    const prescriptions = prescriptionFormRef.current?.getFormData();
    const vaccinations = vaccineFormRef.current?.getFormData();
    const remissions = remissionFormRef.current?.getFormData();
    const appointment = await appointmentFormRef.current?.mapAppointmentToServer();
    console.log(appointmentFormRef);
    console.log(exams);
    console.log(disabilities);
    console.log(prescriptions);
    console.log(vaccinations);
    console.log(remissions);
    console.log(appointment);
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Dialog, {
    visible: visible,
    onHide: () => {
      hideModal();
    },
    header: "Finalizar Consulta",
    modal: true,
    style: {
      width: '100vw',
      maxWidth: '100vw'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3 border-right d-flex flex-column gap-2",
    style: {
      width: '250px',
      minWidth: '250px'
    }
  }, tabs.map(tab => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Tab, {
    key: tab.key,
    tab: tab,
    activeTab: activeTab,
    onActiveTabChange: activeTab => setActiveTab(activeTab)
  })))), /*#__PURE__*/React.createElement("div", {
    className: "p-3 flex-grow-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: activeTab === "examinations" ? "d-block" : "d-none"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between"
  }, /*#__PURE__*/React.createElement("h2", null, "Ex\xE1menes Cl\xEDnicos"), !examsActive && /*#__PURE__*/React.createElement(Button, {
    label: "Agregar Ex\xE1menes",
    className: "btn btn-primary",
    onClick: () => setExamsActive(true)
  }), examsActive && /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    className: "btn btn-danger",
    onClick: () => setExamsActive(false)
  })), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: examsActive ? "d-block" : "d-none"
  }, /*#__PURE__*/React.createElement(ExamForm, {
    ref: examFormRef
  }))), /*#__PURE__*/React.createElement("div", {
    className: activeTab === "incapacities" ? "d-block" : "d-none"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between"
  }, /*#__PURE__*/React.createElement("h2", null, "Incapacidades Cl\xEDnicas"), !disabilitiesActive && /*#__PURE__*/React.createElement(Button, {
    label: "Agregar Incapacidad",
    className: "btn btn-primary",
    onClick: () => setDisabilitiesActive(true)
  }), disabilitiesActive && /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    className: "btn btn-danger",
    onClick: () => setDisabilitiesActive(false)
  })), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: disabilitiesActive ? "d-block" : "d-none"
  }, /*#__PURE__*/React.createElement(DisabilityForm, {
    ref: disabilityFormRef
  }))), /*#__PURE__*/React.createElement("div", {
    className: activeTab === "prescriptions" ? "d-block" : "d-none"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between"
  }, /*#__PURE__*/React.createElement("h2", null, "Recetas M\xE9dicas"), !prescriptionsActive && /*#__PURE__*/React.createElement(Button, {
    label: "Agregar Recetas",
    className: "btn btn-primary",
    onClick: () => setPrescriptionsActive(true)
  }), prescriptionsActive && /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    className: "btn btn-danger",
    onClick: () => setPrescriptionsActive(false)
  })), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: prescriptionsActive ? "d-block" : "d-none"
  }, /*#__PURE__*/React.createElement(PrescriptionForm, {
    ref: prescriptionFormRef
  }))), /*#__PURE__*/React.createElement("div", {
    className: activeTab === "vaccinations" ? "d-block" : "d-none"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between"
  }, /*#__PURE__*/React.createElement("h2", null, "Vacunas"), !vaccinationsActive && /*#__PURE__*/React.createElement(Button, {
    label: "Agregar Vacunas",
    className: "btn btn-primary",
    onClick: () => setVaccinationsActive(true)
  }), vaccinationsActive && /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    className: "btn btn-danger",
    onClick: () => setVaccinationsActive(false)
  })), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: vaccinationsActive ? "d-block" : "d-none"
  }, /*#__PURE__*/React.createElement(AddVaccineForm, {
    ref: vaccineFormRef
  }))), /*#__PURE__*/React.createElement("div", {
    className: activeTab === "referral" ? "d-block" : "d-none"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between"
  }, /*#__PURE__*/React.createElement("h2", null, "Remisi\xF3n"), !remissionsActive && /*#__PURE__*/React.createElement(Button, {
    label: "Agregar Remisi\xF3n",
    className: "btn btn-primary",
    onClick: () => setRemissionsActive(true)
  }), remissionsActive && /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    className: "btn btn-danger",
    onClick: () => setRemissionsActive(false)
  })), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: remissionsActive ? "d-block" : "d-none"
  }, /*#__PURE__*/React.createElement(RemissionsForm, {
    ref: remissionFormRef
  }))), /*#__PURE__*/React.createElement("div", {
    className: activeTab === "appointment" ? "d-block" : "d-none"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between"
  }, /*#__PURE__*/React.createElement("h2", null, "Cita"), !appointmentActive && /*#__PURE__*/React.createElement(Button, {
    label: "Agregar Cita",
    className: "btn btn-primary",
    onClick: () => setAppointmentActive(true)
  }), appointmentActive && /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    className: "btn btn-danger",
    onClick: () => setAppointmentActive(false)
  })), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: appointmentActive ? "d-block" : "d-none"
  }, /*#__PURE__*/React.createElement(LeavingConsultationAppointmentForm, {
    userSpecialtyId: "1",
    ref: appointmentFormRef
  }))), /*#__PURE__*/React.createElement("div", {
    className: activeTab === "turns" ? "d-block" : "d-none"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between"
  }, /*#__PURE__*/React.createElement("h2", null, "Turnos"), !turnsActive && /*#__PURE__*/React.createElement(Button, {
    label: "Generar Turnos",
    className: "btn btn-primary",
    onClick: () => setTurnsActive(true)
  }), turnsActive && /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    className: "btn btn-danger",
    onClick: () => setTurnsActive(false)
  })), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: turnsActive ? "d-block" : "d-none"
  }, /*#__PURE__*/React.createElement(LeavingConsultationGenerateTicket, {
    patientId: patientId
  }))))), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("p", {
    className: "fs-9 text-danger"
  }, "Antes de finalizar la consulta por favor complete la siguiente informaci\xF3n:"), /*#__PURE__*/React.createElement(Card, {
    header: "Diagn\xF3sticos"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-grow-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-100 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "cie11-code",
    className: "form-label"
  }, "Escriba un C\xF3digo CIE-11"), /*#__PURE__*/React.createElement(AutoComplete, {
    inputId: "cie11-code",
    placeholder: "Seleccione un CIE-11",
    field: "label",
    suggestions: cie11Codes,
    completeMethod: event => loadCie11Codes(event.query),
    inputClassName: "w-100",
    className: "w-100",
    appendTo: "self",
    value: cie11Code,
    onChange: e => setCie11Code(e.value),
    forceSelection: false,
    showEmptyMessage: true,
    emptyMessage: "No se encontraron c\xF3digos CIE-11",
    delay: 1000,
    minLength: 3,
    panelStyle: {
      zIndex: 100000,
      width: 'auto'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Agregar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-plus"
    }),
    disabled: !cie11Code || !cie11Code.label,
    onClick: () => {
      console.log(cie11Code);
      if (cie11Code && cie11Code.label) {
        appendDiagnosis(cie11Code);
        setCie11Code(null);
      }
    }
  }))), /*#__PURE__*/React.createElement(CustomPRTable, {
    data: diagnoses,
    columns: [{
      field: "label",
      header: "Diagnóstico"
    }],
    disableSearch: true,
    disableReload: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Finalizar",
    className: "btn btn-primary",
    onClick: () => {
      handleFinish();
    }
  }))));
};
const Tab = ({
  tab,
  activeTab,
  onActiveTabChange
}) => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: `w-100 p-3 btn btn-outline-primary ${activeTab === tab.key ? "btn-primary text-white" : ""} btn-sm`,
    onClick: () => {
      if (activeTab === tab.key) {
        onActiveTabChange?.(null);
        return;
      }
      onActiveTabChange?.(tab.key);
    }
  }, tab.label));
};