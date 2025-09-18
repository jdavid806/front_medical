import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { clinicalRecordService, remissionService, userService, userSpecialtyService } from "../../services/api/index.js";
import { Checkbox } from "primereact/checkbox";
import { PrimeReactProvider } from "primereact/api";
import { forwardRef } from "react";
import { useImperativeHandle } from "react";
export const remissionsForm = /*#__PURE__*/forwardRef(({
  initialData
}, ref) => {
  const [note, setNote] = useState("");
  const [mappedServiceClinicalRecord, setMappedServiceClinicalRecord] = useState([]);
  const [selectedService, setSelectedService] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [mappedServiceUsers, setMappedServiceUsers] = useState([]);
  const [checked, setChecked] = useState(false);
  const [mappedServiceUserSpecialty, setMappedServiceUserSpecialty] = useState([]);
  const [selectedUserSpecialty, setSelectedUserSpecialty] = useState([]);
  useEffect(() => {
    fetchClinicalRecords();
    fetchDoctors();
    fetchUserSpecialties();
  }, []);
  useEffect(() => {
    if (initialData) {
      setSelectedUser(initialData.receiver_user_id);
      setSelectedUserSpecialty(initialData.receiver_user_specialty_id);
      setChecked(initialData.receiver_user_specialty_id ? true : false);
      setNote(initialData.note);
    }
  }, [initialData]);
  const handleSubmit = event => {
    event.preventDefault();
    const newremission = {
      receiver_user_id: !checked ? selectedUser : null,
      remitter_user_id: 1,
      clinical_record_id: selectedService,
      receiver_user_specialty_id: checked ? selectedUserSpecialty : null,
      note: note
    };
    console.log(newremission, checked);
    remissionService.createRemission(newremission, newremission.clinical_record_id).then(response => {
      console.log("saved:", response);
      window.location.reload();
    }).catch(error => {
      console.error("Error:", error);
    });
  };
  useImperativeHandle(ref, () => ({
    getFormData: () => {
      return {
        receiver_user_id: !checked ? selectedUser : null,
        remitter_user_id: 1,
        //clinical_record_id: selectedService,
        receiver_user_specialty_id: checked ? selectedUserSpecialty : null,
        note: note
      };
    },
    resetForm: () => {
      setSelectedUser(null);
      setSelectedUserSpecialty(null);
      setChecked(false);
      setNote("");
    }
  }));
  const fetchClinicalRecords = async () => {
    const url = new URLSearchParams(window.location.search).get("patient_id");
    if (url) {
      const data = await clinicalRecordService.ofParent(url);
      const mappedData = data.map(item => {
        return {
          value: item.id,
          label: item.clinical_record_type.name + " - " + formatDate(item.created_at)
        };
      });
      setMappedServiceClinicalRecord(mappedData);
    }
  };
  const fetchDoctors = async () => {
    const data = await userService.getAll();
    console.log(data);
    const mappedData = data.map(item => {
      return {
        value: item.id,
        label: item.first_name + " " + item.last_name + " - " + item.id
      };
    });
    setMappedServiceUsers(mappedData);
  };
  const fetchUserSpecialties = async () => {
    const data = await userSpecialtyService.getAllItems();
    console.log(data);
    const mappedData = data.map(item => {
      return {
        value: item.id,
        label: item.name + " - " + item.id
      };
    });
    setMappedServiceUserSpecialty(mappedData);
  };
  const formatDate = isoDate => {
    if (!isoDate) return "";
    return new Date(isoDate).toISOString().split("T")[0];
  };
  return /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      appendTo: "self",
      zIndex: {
        overlay: 100000
      }
    }
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit
  }, !checked && /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "user",
    className: "form-label"
  }, "Doctores"), /*#__PURE__*/React.createElement(Dropdown, {
    inputId: "user",
    value: selectedUser,
    onChange: e => setSelectedUser(e.value),
    options: mappedServiceUsers,
    optionLabel: "label",
    optionValue: "value",
    filter: true,
    className: "w-100",
    appendTo: "self"
  })), checked && /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "userSpecialty",
    className: "form-label"
  }, "Especialista"), /*#__PURE__*/React.createElement(Dropdown, {
    inputId: "userSpecialty",
    value: selectedUserSpecialty,
    onChange: e => setSelectedUserSpecialty(e.value),
    options: mappedServiceUserSpecialty,
    optionLabel: "label",
    optionValue: "value",
    filter: true,
    className: "w-100",
    appendTo: "self"
  })), /*#__PURE__*/React.createElement("div", {
    className: "m-3 d-flex align-items-center gap-2"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    onChange: e => setChecked(e.checked),
    checked: checked
  }), /*#__PURE__*/React.createElement("label", {
    className: "form-check-label",
    htmlFor: "seleccionarEspecialista"
  }, "Desea remitir a un especialista?")), /*#__PURE__*/React.createElement("div", {
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
  }))));
});