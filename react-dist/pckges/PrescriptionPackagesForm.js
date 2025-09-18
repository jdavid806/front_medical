function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { forwardRef, useImperativeHandle } from "react";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { AutoComplete } from "primereact/autocomplete";
import { useClinicalPackage } from "../clinical-packages/hooks/useClinicalPackage.js";
import { useSpecialty } from "../fe-config/speciality/hooks/useSpecialty.js";
import { DisabilityForm } from "../disabilities/form/DisabilityForm.js";
import PrescriptionForm from "../prescriptions/components/PrescriptionForm.js";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Tab } from "../components/tabs/Tab.js";
import { ExamForm } from "../exams/components/ExamForm.js";
import { remissionsForm as RemissionsForm } from "../remissions/RemissionsForm.js";
import { addDaysToDate } from "../../services/utilidades.js";
import { PrescriptionPackagesMapper } from "./mappers.js";
export const PrescriptionPackagesForm = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    packageId
  } = props;
  const {
    clinicalPackage,
    fetchClinicalPackage,
    loading
  } = useClinicalPackage();
  const {
    cie11Codes,
    loadCie11Codes,
    cie11Code,
    setCie11Code
  } = useSpecialty();
  const {
    control,
    setValue,
    getValues,
    reset
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      relatedTo: 'cie11',
      cie11: null,
      cups: null
    }
  });
  const [activeTab, setActiveTab] = useState(null);
  const [examsActive, setExamsActive] = useState(false);
  const [disabilitiesActive, setDisabilitiesActive] = useState(false);
  const [prescriptionsActive, setPrescriptionsActive] = useState(false);
  const [remissionsActive, setRemissionsActive] = useState(false);
  const [initialSelectedExamTypes, setInitialSelectedExamTypes] = useState([]);
  const [initialDisabilityFormData, setInitialDisabilityFormData] = useState(undefined);
  const [initialRemissionData, setInitialRemissionData] = useState(undefined);
  const [initialPrescriptionData, setInitialPrescriptionData] = useState(undefined);
  const examFormRef = useRef(null);
  const disabilityFormRef = useRef(null);
  const prescriptionFormRef = useRef(null);
  const remissionFormRef = useRef(null);
  const relatedToOptions = [{
    label: 'CIE-11',
    value: 'cie11'
  }, {
    label: 'CUPS',
    value: 'cups'
  }];
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
    key: "referral",
    label: "Remisión"
  }];
  useImperativeHandle(ref, () => ({
    getFormData: () => {
      return PrescriptionPackagesMapper.toFormDataFromFormInputs({
        formInputs: getValues(),
        exams: examsActive ? examFormRef.current?.getFormData() || [] : [],
        prescriptions: prescriptionsActive ? prescriptionFormRef.current?.getFormData() || [] : [],
        referrals: remissionsActive ? remissionFormRef.current?.getFormData() || null : null,
        disabilities: disabilitiesActive ? disabilityFormRef.current?.getFormData() || null : null
      });
    },
    resetForm: () => {
      reset();
      examFormRef.current?.resetForm();
      disabilityFormRef.current?.resetForm();
      prescriptionFormRef.current?.resetForm();
      remissionFormRef.current?.resetForm();
    }
  }));
  useEffect(() => {
    if (packageId) {
      fetchClinicalPackage(packageId);
    }
  }, [packageId]);
  useEffect(() => {
    if (clinicalPackage) {
      setValue('name', clinicalPackage.name);
      setValue('description', clinicalPackage.description);
      setValue('relatedTo', clinicalPackage.cie11 ? 'cie11' : 'cups');
      setValue('cie11', clinicalPackage.cie11);
      setValue('cups', clinicalPackage.cups);
      setCie11Code(clinicalPackage.cie11);
      onPackageChange();
    }
  }, [clinicalPackage]);
  const onPackageChange = () => {
    setExamsActive(false);
    setDisabilitiesActive(false);
    setRemissionsActive(false);
    setPrescriptionsActive(false);
    setInitialSelectedExamTypes([]);
    setInitialDisabilityFormData(undefined);
    setInitialRemissionData(undefined);
    setInitialPrescriptionData(undefined);
    const packageExamTypes = clinicalPackage.package_items.filter(item => item.item_type == "App\\Models\\Examen");
    const packageExamTypeIds = packageExamTypes.map(item => `${item.item_id}`);
    if (packageExamTypeIds.length > 0) {
      setExamsActive(true);
      setInitialSelectedExamTypes(packageExamTypeIds);
    }
    const packageDisability = clinicalPackage.package_items.find(item => item.item_type == "App\\Models\\Incapacidad");
    if (packageDisability) {
      setDisabilitiesActive(true);
      setInitialDisabilityFormData({
        user_id: 0,
        days_disability: packageDisability.prescription.days_incapacity,
        start_date: new Date(),
        end_date: addDaysToDate(new Date(), packageDisability.prescription.days_incapacity),
        reason: packageDisability.prescription.reason,
        id: 0,
        isEditing: false
      });
    }
    const packageRemission = clinicalPackage.package_items.find(item => item.item_type == "App\\Models\\Remision");
    if (packageRemission) {
      setRemissionsActive(true);
      setInitialRemissionData({
        receiver_user_id: packageRemission.prescription.user_id,
        remitter_user_id: 0,
        clinical_record_id: 0,
        receiver_user_specialty_id: packageRemission.prescription.specialty_id,
        note: packageRemission.prescription.reason
      });
    }
    const packagePrescriptions = clinicalPackage.package_items.filter(item => item.item_type == "App\\Models\\medicamento");
    if (packagePrescriptions.length > 0) {
      setPrescriptionsActive(true);
      setInitialPrescriptionData({
        user_id: 0,
        patient_id: 0,
        is_active: true,
        medicines: [...packagePrescriptions.map(item => ({
          medication: item.prescription.medication,
          concentration: item.prescription.concentration,
          //
          duration: item.prescription.duration_days,
          //
          frequency: item.prescription.frequency,
          //
          medication_type: item.prescription.medication_type,
          //
          observations: item.prescription.instructions,
          //
          quantity: item.prescription.quantity,
          //
          take_every_hours: +item.prescription.medication_frequency?.split(" ")[0] || 0,
          showQuantity: false,
          showTimeField: false
        }))]
      });
    }
  };
  const relatedTo = useWatch({
    control,
    name: 'relatedTo'
  });
  const shouldShowCheckIcon = tabKey => {
    switch (tabKey) {
      case "examinations":
        return examsActive;
      case "incapacities":
        return disabilitiesActive;
      case "referral":
        return remissionsActive;
      case "prescriptions":
        return prescriptionsActive;
      default:
        return false;
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "name",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "name",
      className: "form-label"
    }, "Nombre"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: "name"
    }, field, {
      className: "w-100"
    })))
  }), /*#__PURE__*/React.createElement(Controller, {
    name: "description",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "description",
      className: "form-label"
    }, "Descripci\xF3n"), /*#__PURE__*/React.createElement(InputTextarea, _extends({
      id: "description"
    }, field, {
      rows: 4,
      cols: 50,
      className: "w-100"
    })))
  }), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "relatedTo",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "relatedTo",
      className: "form-label"
    }, "Relacionado con"), /*#__PURE__*/React.createElement(Dropdown, _extends({
      id: "relatedTo"
    }, field, {
      options: relatedToOptions,
      optionLabel: "label",
      optionValue: "value",
      className: "w-100"
    })))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6"
  }, relatedTo === 'cie11' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
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
    value: cie11Code,
    onChange: e => {
      setCie11Code(e.value);
      setValue('cie11', e.value?.codigo || null);
    },
    forceSelection: false,
    showEmptyMessage: true,
    emptyMessage: "No se encontraron c\xF3digos CIE-11",
    delay: 1000,
    minLength: 3
  })), relatedTo === 'cups' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "cupsCode",
    className: "form-label"
  }, "C\xF3digo CUPS"), /*#__PURE__*/React.createElement(InputText, {
    id: "cupsCode",
    className: "w-100"
  })))), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: "d-flex"
  }, /*#__PURE__*/React.createElement("div", {
    className: "border-right d-flex flex-column gap-2",
    style: {
      width: "300px",
      minWidth: "300px"
    }
  }, tabs.map(tab => /*#__PURE__*/React.createElement(Tab, {
    key: tab.key,
    tab: tab,
    activeTab: activeTab,
    onActiveTabChange: activeTab => setActiveTab(activeTab),
    showCheckIcon: shouldShowCheckIcon(tab.key)
  }))), /*#__PURE__*/React.createElement("div", {
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
    ref: examFormRef,
    initialSelectedExamTypes: initialSelectedExamTypes
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
    ref: disabilityFormRef,
    formConfig: {
      fieldsConfig: {
        user_id: {
          visible: false
        }
      }
    },
    initialData: initialDisabilityFormData
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
    ref: prescriptionFormRef,
    initialData: initialPrescriptionData
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
    ref: remissionFormRef,
    initialData: initialRemissionData
  })))))));
});