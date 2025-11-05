import React, { useState, useEffect } from "react";
import { useGenericFilter } from "../hooks/userSearchModel.js";
import { AppointmentForm } from "../components/AppointmentForm.js";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Alert, Spinner } from "react-bootstrap";
import PatientFormModal from "../../patients/modals/form/PatientFormModal.js";
export const PatientSearch = () => {
  const {
    data: patients,
    loading,
    error,
    search
  } = useGenericFilter("Patient");
  const [searchType, setSearchType] = useState("document_number");
  const [searchValue, setSearchValue] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showPatientFormModal, setShowPatientFormModal] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchTypeOptions = [{
    label: "Cédula",
    value: "document_number"
  }, {
    label: "Correo",
    value: "email"
  }, {
    label: "Teléfono",
    value: "phone"
  }];
  const getSearchTypeLabel = value => {
    const option = searchTypeOptions.find(option => option.value === value);
    return option ? option.label : value;
  };
  const searchPatient = searchValue => {
    if (!searchValue.trim()) return;
    setHasSearched(true);
    search({
      [`${searchType}__like`]: searchValue
    }, {
      field: "created_at",
      direction: "desc"
    }, 10, 10);
    setSelectedPatient(null);
    setShowAppointmentForm(false);
  };
  const handleSearch = () => {
    searchPatient(searchValue);
  };

  // Auto-seleccionar el primer paciente cuando hay resultados
  useEffect(() => {
    if (!loading && patients.length > 0 && !selectedPatient && hasSearched) {
      const firstPatient = patients[0];
      setSelectedPatient(firstPatient);
      setShowAppointmentForm(true);
    }
  }, [patients, selectedPatient, hasSearched, loading]);

  // Manejar Enter en el input
  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PatientFormModal, {
    visible: showPatientFormModal,
    onHide: () => setShowPatientFormModal(false),
    onSuccess: data => {
      setShowPatientFormModal(false);
      const documentNumber = data?.message?.[0]?.document_number;
      setSearchValue(documentNumber);
      searchPatient(documentNumber);
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-5"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "shadow-sm mb-4",
    header: /*#__PURE__*/React.createElement("h3", {
      className: "text-center text-primary mb-0 pt-3 px-3"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-user me-2"
    }), "B\xFAsqueda de Pacientes")
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-2 align-items-end"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label fw-bold"
  }, "Buscar por:"), /*#__PURE__*/React.createElement(Dropdown, {
    value: searchType,
    onChange: e => setSearchType(e.value),
    options: searchTypeOptions,
    optionLabel: "label",
    optionValue: "value",
    placeholder: "Selecciona un tipo",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-5"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label fw-bold"
  }, "Valor:"), /*#__PURE__*/React.createElement(InputText, {
    type: "text",
    placeholder: `Ingrese ${getSearchTypeLabel(searchType)}...`,
    value: searchValue,
    onChange: e => setSearchValue(e.target.value),
    onKeyPress: handleKeyPress,
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-3"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Buscar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-search"
    }),
    loadingIcon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-spinner"
    }),
    className: "w-100",
    onClick: handleSearch,
    disabled: loading || !searchValue.trim(),
    loading: loading
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mt-3"
  }, error && /*#__PURE__*/React.createElement(Alert, {
    variant: "danger",
    className: "d-flex align-items-center"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-exclamation-triangle me-2"
  }), error), loading && /*#__PURE__*/React.createElement("div", {
    className: "text-center py-3"
  }, /*#__PURE__*/React.createElement(Spinner, {
    animation: "border",
    variant: "primary"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-muted mt-2"
  }, "Buscando pacientes...")), !loading && hasSearched && patients.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "text-center py-5"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-user-plus text-muted mb-3",
    style: {
      fontSize: '3rem'
    }
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-muted fw-bold mb-2"
  }, "No se encontraron pacientes"), /*#__PURE__*/React.createElement("p", {
    className: "text-muted small mb-4"
  }, "No hay pacientes que coincidan con tu b\xFAsqueda"), /*#__PURE__*/React.createElement(Button, {
    label: "Agregar Nuevo Paciente",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-user-plus me-2"
    }),
    className: "p-button-primary",
    onClick: () => setShowPatientFormModal(true)
  })))), selectedPatient && /*#__PURE__*/React.createElement(Card, {
    className: "shadow-sm mb-4",
    header: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h4", {
      className: "fw-bold text-secondary pt-3 px-3"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-user me-2"
    }), "Informaci\xF3n del Paciente"))
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fw-bold text-secondary mb-1"
  }, "Nombre completo"), /*#__PURE__*/React.createElement("p", {
    className: "mb-0"
  }, selectedPatient.first_name || '', " ", selectedPatient.last_name || '', " ", selectedPatient.middle_name || '', " ", selectedPatient.second_last_name || '')), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fw-bold text-secondary mb-1"
  }, "C\xE9dula"), /*#__PURE__*/React.createElement("p", {
    className: "mb-0"
  }, selectedPatient.document_number)), selectedPatient.email && /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fw-bold text-secondary mb-1"
  }, "Correo"), /*#__PURE__*/React.createElement("p", {
    className: "mb-0"
  }, selectedPatient.email)), selectedPatient.whatsapp && /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fw-bold text-secondary mb-1"
  }, "Tel\xE9fono"), /*#__PURE__*/React.createElement("p", {
    className: "mb-0"
  }, selectedPatient.whatsapp))))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-7"
  }, showAppointmentForm && selectedPatient ? /*#__PURE__*/React.createElement(Card, {
    className: "shadow-sm",
    header: /*#__PURE__*/React.createElement("h3", {
      className: "text-primary mb-0 pt-3 px-3"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-calendar-alt me-2"
    }), "Agendar Nueva Cita")
  }, /*#__PURE__*/React.createElement(AppointmentForm, {
    patient: selectedPatient,
    onSave: () => {
      setShowAppointmentForm(false);
      setSelectedPatient(null);
      setSearchValue("");
      setHasSearched(false);
    }
  })) : /*#__PURE__*/React.createElement(Card, {
    className: "shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center text-muted py-5"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-calendar-alt",
    style: {
      fontSize: '3rem'
    }
  }), /*#__PURE__*/React.createElement("h5", {
    className: "mt-3"
  }, "Formulario de Cita"), /*#__PURE__*/React.createElement("p", {
    className: "mb-0"
  }, "Realice una b\xFAsqueda para agendar una cita")))))));
};