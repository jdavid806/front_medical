import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
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
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useSpecialty } from "../fe-config/speciality/hooks/useSpecialty.js";
import { AutoComplete } from "primereact/autocomplete";
import { CustomPRTable } from "../components/CustomPRTable.js";
import { Editor } from "primereact/editor";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { useMassMessaging } from "../hooks/useMassMessaging.js";
import { addDaysToDate, daysBetweenDates, stringToDate } from "../../services/utilidades.js";
import { useClinicalPackages } from "../clinical-packages/hooks/useClinicalPackages.js";
import { InputSwitch } from "primereact/inputswitch";
import { useLastPatientPrescription } from "../prescriptions/hooks/useLastPatientPrescription.js";
import { OptometryPrescriptionForm } from "../prescriptions/components/OptometryPrescriptionForm.js";
import { Dropdown } from "primereact/dropdown";
import { useClinicalRecord } from "./hooks/useClinicalRecord.js";
import { appointmentService, clinicalRecordTypeService, userService } from "../../services/api/index.js";
const diagnosisTypeOptions = [{
  value: 'definitivo',
  label: 'Definitivo'
}, {
  value: 'presuntivo',
  label: 'Presuntivo'
}, {
  value: 'diferencial',
  label: 'Diferencial'
}];
export const FinishClinicalRecordForm = /*#__PURE__*/forwardRef((props, ref) => {
  const toast = useRef(null);
  const {
    appointmentId = new URLSearchParams(window.location.search).get("appointment_id") || "",
    clinicalRecordType = new URLSearchParams(window.location.search).get("tipo_historia") || "",
    patientId = new URLSearchParams(window.location.search).get("patient_id") || new URLSearchParams(window.location.search).get("id") || "",
    clinicalRecordId = new URLSearchParams(window.location.search).get("clinical_record_id") || "",
    specialtyName = new URLSearchParams(window.location.search).get("especialidad") || "medicina_general"
  } = props;
  const [finalClinicalRecordType, setFinalClinicalRecordType] = useState(clinicalRecordType);
  const [finalPatientId, setFinalPatientId] = useState(patientId);
  const [finalAppointmentId, setFinalAppointmentId] = useState(appointmentId);
  const [finalSpecialtyName, setFinalSpecialtyName] = useState(specialtyName);
  const {
    control,
    setValue,
    getValues
  } = useForm({
    defaultValues: {
      diagnosis: null,
      diagnoses: [],
      treatment_plan: null
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
  const {
    getClinicalRecord,
    clinicalRecord: clinicalRecordForUpdate
  } = useClinicalRecord();
  const {
    clinicalPackages
  } = useClinicalPackages();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [initialSelectedExamTypes, setInitialSelectedExamTypes] = useState([]);
  const [initialDisabilityFormData, setInitialDisabilityFormData] = useState(undefined);
  const [initialRemissionData, setInitialRemissionData] = useState(undefined);
  const [initialPrescriptionData, setInitialPrescriptionData] = useState(undefined);
  const [loadLastPrescriptionCheck, setLoadLastPrescriptionCheck] = useState(false);
  const [clinicalRecordTypeId, setClinicalRecordTypeId] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [examsActive, setExamsActive] = useState(false);
  const [disabilitiesActive, setDisabilitiesActive] = useState(false);
  const [prescriptionsActive, setPrescriptionsActive] = useState(false);
  const [optometryActive, setOptometryActive] = useState(false);
  const [vaccinationsActive, setVaccinationsActive] = useState(false);
  const [remissionsActive, setRemissionsActive] = useState(false);
  const [appointmentActive, setAppointmentActive] = useState(false);
  const [turnsActive, setTurnsActive] = useState(false);
  const examFormRef = useRef(null);
  const disabilityFormRef = useRef(null);
  const prescriptionFormRef = useRef(null);
  const optometryFormRef = useRef(null);
  const vaccineFormRef = useRef(null);
  const remissionFormRef = useRef(null);
  const appointmentFormRef = useRef(null);
  const showSuccessToast = ({
    title,
    message
  }) => {
    toast.current?.show({
      severity: "success",
      summary: title || "Éxito",
      detail: message || "Operación exitosa"
    });
  };
  const getRecipeTab = () => {
    if (["historiaOptometria", "historiaOptometriaD"].map(item => item.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()).includes(clinicalRecordType.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())) {
      return {
        key: "optometry",
        label: "Receta de Optometría"
      };
    }
    return {
      key: "prescriptions",
      label: "Recetas Médicas"
    };
  };
  const tabs = [{
    key: "examinations",
    label: "Exámenes Clínicos"
  }, {
    key: "incapacities",
    label: "Incapacidades Clínicas"
  }, getRecipeTab(), {
    key: "referral",
    label: "Remisión"
  }, {
    key: "appointment",
    label: "Cita"
  }, {
    key: "turns",
    label: "Turnos"
  }];
  const {
    sendMessage: sendMessageWpp
  } = useMassMessaging();
  const {
    lastPatientPrescription,
    loadLastPatientPrescription
  } = useLastPatientPrescription();
  const sendMessageWppRef = useRef(sendMessageWpp);
  useEffect(() => {
    sendMessageWppRef.current = sendMessageWpp;
  }, [sendMessageWpp]);
  useImperativeHandle(ref, () => ({
    getFormState: () => {
      return {
        clinicalRecordTypeId: clinicalRecordTypeId,
        examsActive: examsActive,
        disabilitiesActive: disabilitiesActive,
        prescriptionsActive: prescriptionsActive,
        optometryActive: optometryActive,
        remissionsActive: remissionsActive,
        appointmentActive: appointmentActive,
        currentUser: currentUser,
        currentAppointment: currentAppointment,
        clinicalRecordId: clinicalRecordId,
        diagnoses: diagnoses,
        treatmentPlan: getValues("treatment_plan"),
        exams: examFormRef.current?.getFormData(),
        disability: disabilityFormRef.current?.getFormData(),
        prescriptions: prescriptionFormRef.current?.getFormData(),
        optometry: optometryFormRef.current?.getFormData(),
        remission: remissionFormRef.current?.getFormData(),
        appointment: appointmentFormRef.current?.mapAppointmentToServer(),
        specialtyName: finalSpecialtyName,
        patientId: finalPatientId,
        appointmentId: finalAppointmentId
      };
    }
  }));
  const onPackageChange = pkg => {
    setSelectedPackage(pkg);
    setExamsActive(false);
    setDisabilitiesActive(false);
    setRemissionsActive(false);
    setPrescriptionsActive(false);
    setInitialSelectedExamTypes([]);
    setInitialDisabilityFormData(undefined);
    setInitialRemissionData(undefined);
    setInitialPrescriptionData(undefined);
    const packageExamTypes = pkg.package_items.filter(item => item.item_type == "App\\Models\\Examen");
    const packageExamTypeIds = packageExamTypes.map(item => `${item.item_id}`);
    if (packageExamTypeIds.length > 0) {
      setExamsActive(true);
      setInitialSelectedExamTypes(packageExamTypeIds);
    }
    const packageDisability = pkg.package_items.find(item => item.item_type == "App\\Models\\Incapacidad");
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
    const packageRemission = pkg.package_items.find(item => item.item_type == "App\\Models\\Remision");
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
    const packagePrescriptions = pkg.package_items.filter(item => item.item_type == "App\\Models\\medicamento");
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
        })), ...(lastPatientPrescription?.recipe_items || [])]
      });
    }
  };
  useEffect(() => {
    if (clinicalRecordId) {
      getClinicalRecord(+clinicalRecordId);
    }
  }, [clinicalRecordId]);
  useEffect(() => {
    if (clinicalRecordForUpdate) {
      setFinalClinicalRecordType(clinicalRecordForUpdate.clinical_record_type.key_);
      setFinalSpecialtyName(clinicalRecordForUpdate.created_by_user.specialty.name);
      setFinalPatientId(clinicalRecordForUpdate.patient_id);
      setFinalAppointmentId(clinicalRecordForUpdate.appointment_id);
      console.log("clinicalRecordForUpdate", clinicalRecordForUpdate);
      setValue('treatment_plan', clinicalRecordForUpdate.description);
      setValue('diagnoses', clinicalRecordForUpdate.clinical_record_diagnoses.map(diagnosis => {
        return {
          codigo: diagnosis.diagnosis_code,
          diagnosis_type: diagnosis.diagnosis_type,
          description: diagnosis.diagnosis.descripcion,
          label: `${diagnosis.diagnosis_code} - ${diagnosis.diagnosis.descripcion}`
        };
      }));
      const examRecipesDetails = clinicalRecordForUpdate.exam_recipes.map(examRecipe => examRecipe.details.map(detail => `${detail.exam_type_id}`)).flat();
      if (examRecipesDetails.length > 0) {
        setExamsActive(true);
        setInitialSelectedExamTypes(examRecipesDetails);
      }
      if (clinicalRecordForUpdate.patient_disabilities.length > 0) {
        const disability = clinicalRecordForUpdate.patient_disabilities[0];
        setDisabilitiesActive(true);
        setInitialDisabilityFormData({
          user_id: 0,
          days_disability: daysBetweenDates(stringToDate(disability.start_date), stringToDate(disability.end_date)),
          start_date: stringToDate(disability.start_date),
          end_date: stringToDate(disability.end_date),
          reason: disability.reason,
          id: 0,
          isEditing: false
        });
      }
      const prescriptionDetails = clinicalRecordForUpdate.recipes[0].recipe_items;
      if (prescriptionDetails.length > 0) {
        const prescription = clinicalRecordForUpdate.recipes[0];
        setPrescriptionsActive(true);
        setInitialPrescriptionData({
          user_id: 0,
          patient_id: prescription.patient_id,
          is_active: true,
          medicines: [...prescriptionDetails.map(item => ({
            medication: item.medication,
            concentration: item.concentration,
            duration: item.duration,
            frequency: item.frequency,
            medication_type: item.medication_type,
            observations: item.observations,
            quantity: item.quantity,
            take_every_hours: +item.take_every_hours,
            showQuantity: false,
            showTimeField: false
          }))]
        });
      }
      const remission = clinicalRecordForUpdate.remissions[0];
      if (remission) {
        setRemissionsActive(true);
        setInitialRemissionData({
          receiver_user_id: remission.receiver_user_id,
          remitter_user_id: remission.remitter_user_id,
          clinical_record_id: 0,
          receiver_user_specialty_id: remission.receiver_user_specialty_id,
          note: remission.note
        });
      }
    }
  }, [clinicalRecordForUpdate]);
  const handleLoadLastPrescriptionChange = async e => {
    setLoadLastPrescriptionCheck(e);
    if (e && selectedPackage) {
      const lastPrescription = await loadLastPatientPrescription(patientId);
      const newMedicines = [...(initialPrescriptionData?.medicines || []), ...lastPrescription.recipe_items];
      setInitialPrescriptionData({
        user_id: 0,
        patient_id: 0,
        is_active: true,
        medicines: newMedicines
      });
    } else if (e && !selectedPackage) {
      loadLastPrescription();
    } else if (!e && selectedPackage) {
      setPrescriptionsActive(true);
      setInitialPrescriptionData({
        user_id: 0,
        patient_id: 0,
        is_active: true,
        medicines: selectedPackage.package_items.filter(item => item.item_type == "App\\Models\\medicamento").map(item => ({
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
        }))
      });
    } else {
      setInitialPrescriptionData({
        user_id: 0,
        patient_id: 0,
        is_active: true,
        medicines: []
      });
    }
  };
  const loadLastPrescription = async () => {
    const lastRecipe = await loadLastPatientPrescription(patientId);
    setInitialPrescriptionDataFromLastPatientPrescription(lastRecipe);
  };
  const setInitialPrescriptionDataFromLastPatientPrescription = lastPatientPrescription => {
    setInitialPrescriptionData({
      user_id: 0,
      patient_id: 0,
      is_active: true,
      medicines: lastPatientPrescription.recipe_items
    });
  };
  const shouldShowCIE11PackageButton = cie11Code => {
    return clinicalPackages.some(pkg => pkg.cie11 === cie11Code);
  };
  const getCIE11Package = cie11Code => {
    return clinicalPackages.find(pkg => pkg.cie11 === cie11Code);
  };
  const onCIE11PackageClick = cie11Code => {
    const pkg = getCIE11Package(cie11Code);
    if (pkg) {
      onPackageChange(pkg);
    }
    showSuccessToast({
      title: "Paquete seleccionado",
      message: `Se ha seleccionado el paquete ${pkg.label}`
    });
  };
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
      case "optometry":
        return optometryActive;
      default:
        return false;
    }
  };
  useEffect(() => {
    const fetchClinicalRecordType = async () => {
      const clinicalRecordTypes = await clinicalRecordTypeService.getAll();
      const currentClinicalRecordType = clinicalRecordTypes.find(type => type.key_ === finalClinicalRecordType);
      if (currentClinicalRecordType) {
        setClinicalRecordTypeId(currentClinicalRecordType.id);
      }
    };
    fetchClinicalRecordType();
  }, [finalClinicalRecordType]);
  useEffect(() => {
    const fetchUser = async () => {
      const user = await userService.getLoggedUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, []);
  useEffect(() => {
    const fetchAppointment = async () => {
      const appointment = await appointmentService.get(finalAppointmentId);
      setCurrentAppointment(appointment);
    };
    fetchAppointment();
  }, [finalAppointmentId]);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement(Card, {
    header: /*#__PURE__*/React.createElement("h3", {
      className: "px-3 pt-3"
    }, "Diagn\xF3sticos")
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
      width: "auto"
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
      console.log("cie11Code", cie11Code);
      if (cie11Code && cie11Code.label) {
        appendDiagnosis(cie11Code);
        setCie11Code(null);
      }
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(CustomPRTable, {
    data: diagnoses,
    columns: [{
      field: "label",
      header: "Diagnóstico"
    }, {
      field: "",
      header: "Tipo de Diagnóstico",
      width: "200px",
      body: rowData => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dropdown, {
        id: "diagnosis_type",
        value: rowData.diagnosis_type,
        onChange: e => updateDiagnosis(diagnoses.indexOf(rowData), {
          ...rowData,
          diagnosis_type: e.value
        }),
        options: diagnosisTypeOptions,
        optionLabel: "label",
        optionValue: "value",
        placeholder: "Seleccione un tipo de diagn\xF3stico",
        className: "w-100",
        showClear: true
      }))
    }, {
      field: "actions",
      header: "Acciones",
      width: "100px",
      body: row => /*#__PURE__*/React.createElement("div", {
        className: "d-flex align-items-center justify-content-center gap-2"
      }, shouldShowCIE11PackageButton(row.codigo) && /*#__PURE__*/React.createElement(Button, {
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fa fa-gift"
        }),
        rounded: true,
        text: true,
        severity: "success",
        tooltip: "Utilizar paquete configurado para CIE-11",
        tooltipOptions: {
          position: "top"
        },
        onClick: () => onCIE11PackageClick(row.codigo)
      }), /*#__PURE__*/React.createElement(Button, {
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fa fa-trash"
        }),
        rounded: true,
        text: true,
        severity: "danger",
        onClick: () => removeDiagnosis(diagnoses.indexOf(row))
      }))
    }],
    disableSearch: true,
    disableReload: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "treatment_plan",
    control: control,
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "treatment-plan",
      className: "form-label"
    }, "Plan de Tratamiento"), /*#__PURE__*/React.createElement(Editor, {
      id: "treatment-plan",
      value: field.value || "",
      onTextChange: e => field.onChange(e.htmlValue),
      style: {
        height: "320px"
      },
      className: classNames({
        "p-invalid": fieldState.error
      })
    }))
  }))), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: "d-flex"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3 border-right d-flex flex-column gap-2",
    style: {
      width: "300px",
      minWidth: "300px"
    }
  }, tabs.map(tab => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Tab, {
    key: tab.key,
    tab: tab,
    activeTab: activeTab,
    onActiveTabChange: activeTab => setActiveTab(activeTab),
    showCheckIcon: shouldShowCheckIcon(tab.key)
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
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-2 mb-3"
  }, /*#__PURE__*/React.createElement(InputSwitch, {
    checked: loadLastPrescriptionCheck,
    onChange: e => handleLoadLastPrescriptionChange(e.value)
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "loadLastPrescriptionCheck"
  }, "Cargar \xDAltima Receta")), /*#__PURE__*/React.createElement(PrescriptionForm, {
    ref: prescriptionFormRef,
    initialData: initialPrescriptionData
  }))), /*#__PURE__*/React.createElement("div", {
    className: activeTab === "optometry" ? "d-block" : "d-none"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between"
  }, /*#__PURE__*/React.createElement("h2", null, "Receta de Optometr\xEDa"), !optometryActive && /*#__PURE__*/React.createElement(Button, {
    label: "Agregar Receta de Optometr\xEDa",
    className: "btn btn-primary",
    onClick: () => setOptometryActive(true)
  }), optometryActive && /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    className: "btn btn-danger",
    onClick: () => setOptometryActive(false)
  })), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: optometryActive ? "d-block" : "d-none"
  }, /*#__PURE__*/React.createElement(OptometryPrescriptionForm, {
    ref: optometryFormRef
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
    ref: remissionFormRef,
    initialData: initialRemissionData
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
    patientId: patientId,
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
  }))))));
});
const Tab = ({
  tab,
  activeTab,
  onActiveTabChange,
  showCheckIcon
}) => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
    className: `w-100 p-3 p-button-primary ${activeTab === tab.key ? "p-button-primary text-white" : ""} btn-sm`,
    onClick: () => {
      if (activeTab === tab.key) {
        onActiveTabChange?.(null);
        return;
      }
      onActiveTabChange?.(tab.key);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: showCheckIcon ? "d-block" : "d-none"
  }, /*#__PURE__*/React.createElement("i", {
    className: `fas fa-check-circle`,
    style: {
      width: "20px",
      height: "20px"
    }
  })), tab.label)));
};