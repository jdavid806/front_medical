import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { clinicalRecordService, evolutionNotesService } from "../../services/api/index.js";
export const EvolutionsForm = () => {
  const [evolutions, setEvolutions] = useState([]);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [mappedServiceClinicalRecord, setMappedServiceClinicalRecord] = useState([]);
  const [selectedService, setSelectedService] = useState([]);
  useEffect(() => {
    fetchClinicalRecords();
  }, []);
  const handleSubmit = event => {
    event.preventDefault();
    const newEvolution = {
      clinical_record_id: selectedService ? selectedService : 0,
      create_by_user_id: 1,
      note
      //   clinicalRecord
    };
    console.log(newEvolution);
    evolutionNotesService.createEvolutionNotes(newEvolution, newEvolution.clinical_record_id).then(response => {
      console.log("saved:", response);
      window.location.reload();
    }).catch(error => {
      console.error("Error:", error);
    });
  };
  const fetchClinicalRecords = async () => {
    const url = new URLSearchParams(window.location.search).get("patient_id");
    const data = await clinicalRecordService.ofParent(url);
    console.log(data);
    const mappedData = data.map(item => {
      return {
        value: item.id,
        label: item.clinical_record_type.name + " - " + formatDate(item.created_at)
      };
    });
    setMappedServiceClinicalRecord(mappedData);
  };
  const formatDate = isoDate => {
    if (!isoDate) return ""; // Manejo de valores nulos o indefinidos
    return new Date(isoDate).toISOString().split("T")[0];
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit
  }, mappedServiceClinicalRecord.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "clinicalRecords",
    className: "form-label"
  }, "Historias"), /*#__PURE__*/React.createElement(Dropdown, {
    inputId: "clinicalRecords",
    value: selectedService,
    onChange: e => setSelectedService(e.value),
    options: mappedServiceClinicalRecord,
    optionLabel: "label",
    optionValue: "value",
    filter: true,
    className: "w-100",
    style: {
      zIndex: 100000
    },
    panelStyle: {
      zIndex: 100000
    },
    appendTo: "self"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "note",
    className: "form-label"
  }, "Nota"), /*#__PURE__*/React.createElement("textarea", {
    id: "note",
    className: "form-control",
    value: note,
    onChange: e => setNote(e.target.value),
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end mt-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleSubmit,
    className: "btn btn-outline-info",
    type: "button"
  }, "Guardar Evoluci\xF3n"))));
};