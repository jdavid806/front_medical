import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, useCallback } from "react";
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
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useSpecialty } from "../fe-config/speciality/hooks/useSpecialty.js";
import { AutoComplete } from "primereact/autocomplete";
import { CustomPRTable } from "../components/CustomPRTable.js";
import { Editor } from "primereact/editor";
import { classNames } from "primereact/utils";
import { appointmentService, clinicalRecordService, clinicalRecordTypeService, userService } from "../../services/api/index.js";
import { Toast } from "primereact/toast";
import { useMassMessaging } from "../hooks/useMassMessaging.js";
import { getIndicativeByCountry } from "../../services/utilidades.js";
import { useTemplateBuilded } from "../hooks/useTemplateBuilded.js";
import { generarFormato } from "../../funciones/funcionesJS/generarPDF.js";
import { ProgressBar } from "primereact/progressbar";
function getPurpuse(purpuse) {
  switch (purpuse) {
    case "Tratamiento":
      return "TREATMENT";
    case "Promoción":
      return "PROMOTION";
    case "Rehabilitación":
      return "REHABILITATION";
    case "Prevención":
      return "PREVENTION";
  }
}
export const FinishClinicalRecordModal = /*#__PURE__*/forwardRef((props, ref) => {
  const toast = useRef(null);
  const {
    initialExternalDynamicData,
    appointmentId = new URLSearchParams(window.location.search).get("appointment_id") || "",
    clinicalRecordType = new URLSearchParams(window.location.search).get("tipo_historia") || "",
    patientId = new URLSearchParams(window.location.search).get("patient_id") || new URLSearchParams(window.location.search).get("id") || "",
    specialtyName = new URLSearchParams(window.location.search).get("especialidad") || "medicina_general"
  } = props;
  const {
    control
  } = useForm({
    defaultValues: {
      diagnosis: null,
      diagnoses: []
    }
  });
  const {
    append: appendDiagnosis,
    remove: removeDiagnosis
  } = useFieldArray({
    control,
    name: "diagnoses"
  });
  const diagnoses = useWatch({
    control,
    name: "diagnoses"
  });
  const treatmentPlan = useWatch({
    control,
    name: "treatment_plan"
  });
  const {
    cie11Codes,
    loadCie11Codes,
    cie11Code,
    setCie11Code
  } = useSpecialty();
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [examsActive, setExamsActive] = useState(false);
  const [disabilitiesActive, setDisabilitiesActive] = useState(false);
  const [prescriptionsActive, setPrescriptionsActive] = useState(false);
  const [vaccinationsActive, setVaccinationsActive] = useState(false);
  const [remissionsActive, setRemissionsActive] = useState(false);
  const [appointmentActive, setAppointmentActive] = useState(false);
  const [turnsActive, setTurnsActive] = useState(false);
  const [clinicalRecordTypeId, setClinicalRecordTypeId] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [externalDynamicData, setExternalDynamicData] = useState(null);
  const examFormRef = useRef(null);
  const disabilityFormRef = useRef(null);
  const prescriptionFormRef = useRef(null);
  const vaccineFormRef = useRef(null);
  const remissionFormRef = useRef(null);
  const appointmentFormRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const showModal = () => {
    setVisible(true);
  };
  const hideModal = () => {
    setVisible(false);
  };
  const updateExternalDynamicData = data => {
    setExternalDynamicData(data);
  };
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
  const showErrorToast = ({
    title,
    message
  }) => {
    toast.current?.show({
      severity: "error",
      summary: title || "Error",
      detail: message || "Operación fallida"
    });
  };
  const showFormErrors = ({
    title,
    errors
  }) => {
    toast.current?.show({
      severity: "error",
      summary: title || "Errores de validación",
      content: props => /*#__PURE__*/React.createElement("div", {
        className: "text-start"
      }, /*#__PURE__*/React.createElement("h3", null, props.message.summary), Object.entries(errors).map(([field, messages]) => /*#__PURE__*/React.createElement("div", {
        className: "mb-2"
      }, /*#__PURE__*/React.createElement("ul", {
        className: "mb-0 mt-1 ps-3"
      }, messages.map(msg => /*#__PURE__*/React.createElement("li", null, msg))))))
    });
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
    sendMessage: sendMessageWpp,
    responseMsg,
    loading: loadingMessage,
    error
  } = useMassMessaging();
  const {
    fetchTemplate,
    switchTemplate
  } = useTemplateBuilded();
  const sendMessageWppRef = useRef(sendMessageWpp);
  useEffect(() => {
    sendMessageWppRef.current = sendMessageWpp;
  }, [sendMessageWpp]);
  useEffect(() => {
    setExternalDynamicData(initialExternalDynamicData);
  }, [initialExternalDynamicData]);
  useEffect(() => {
    const fetchClinicalRecordType = async () => {
      const clinicalRecordTypes = await clinicalRecordTypeService.getAll();
      const currentClinicalRecordType = clinicalRecordTypes.find(type => type.key_ === clinicalRecordType);
      if (currentClinicalRecordType) {
        setClinicalRecordTypeId(currentClinicalRecordType.id);
      }
    };
    fetchClinicalRecordType();
  }, [clinicalRecordType]);
  useEffect(() => {
    const fetchUser = async () => {
      const user = await userService.getLoggedUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, []);
  useEffect(() => {
    const fetchAppointment = async () => {
      const appointment = await appointmentService.get(appointmentId);
      setCurrentAppointment(appointment);
    };
    fetchAppointment();
  }, [appointmentId]);
  function buildDataToMessageToExams(exams) {
    const dataMapped = {
      ...exams[0],
      details: exams.flatMap(exam => exam.details)
    };
    return dataMapped;
  }
  const prepareDataToSendMessageWPP = useCallback(async clinicalRecordSaved => {
    const tenant = window.location.hostname.split(".")[0];
    // Función auxiliar para esperar
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    //calcular total de bloques a enviar
    const totalBlocks = [clinicalRecordSaved.exam_recipes.length > 0 && clinicalRecordSaved.patient.whatsapp_notifications, clinicalRecordSaved.patient_disabilities.length > 0 && clinicalRecordSaved.patient.whatsapp_notifications, clinicalRecordSaved.recipes.length > 0 && clinicalRecordSaved.patient.whatsapp_notifications, clinicalRecordSaved.remissions.length > 0 && clinicalRecordSaved.patient.whatsapp_notifications, clinicalRecordSaved && clinicalRecordSaved.patient.whatsapp_notifications,
    // Historia clínica
    clinicalRecordSaved.appointment && clinicalRecordSaved.patient.whatsapp_notifications].filter(Boolean).length;
    const progressIncrement = totalBlocks > 0 ? 100 / totalBlocks : 0;
    let currentProgress = 0;
    const updateProgress = message => {
      currentProgress += progressIncrement;
      setProgress(currentProgress);
      setProgressMessage(message);
    };
    try {
      //Message to exams
      if (clinicalRecordSaved.exam_recipes.length && clinicalRecordSaved.patient.whatsapp_notifications) {
        updateProgress("Procesando exámenes...");
        const dataToMessage = buildDataToMessageToExams(clinicalRecordSaved.exam_recipes);
        const data = {
          tenantId: tenant,
          belongsTo: "examenes-creacion",
          type: "whatsapp"
        };
        const templateExams = await fetchTemplate(data);
        const finishTemplate = await switchTemplate(templateExams.template, "examenes", dataToMessage);
        const pdfFile = await generatePdfFile("RecetaExamen", dataToMessage, "prescriptionInput");
        await sendMessageWhatsapp(clinicalRecordSaved.patient, finishTemplate, pdfFile);
      }

      //Message to disabilities
      if (clinicalRecordSaved.patient_disabilities.length && clinicalRecordSaved.patient.whatsapp_notifications) {
        updateProgress("Procesando incapacidades...");
        const data = {
          tenantId: tenant,
          belongsTo: "incapacidades-creacion",
          type: "whatsapp"
        };
        const templateDisabilities = await fetchTemplate(data);
        const finishTemplate = await switchTemplate(templateDisabilities.template, "disabilities", clinicalRecordSaved.patient_disabilities[0]);
        const pdfFile = await generatePdfFile("Incapacidad", clinicalRecordSaved.patient_disabilities[0], "recordDisabilityInput");
        await sendMessageWhatsapp(clinicalRecordSaved.patient, finishTemplate, pdfFile);
      }

      //Message to recipes
      if (clinicalRecordSaved.recipes.length && clinicalRecordSaved.patient.whatsapp_notifications) {
        updateProgress("Procesando recetas...");
        const dataMapped = {
          ...clinicalRecordSaved.recipes[0],
          clinical_record: {
            description: clinicalRecordSaved.description
          },
          recipe_items: clinicalRecordSaved.recipes.flatMap(recipe => recipe.recipe_items)
        };
        const data = {
          tenantId: tenant,
          belongsTo: "recetas-creacion",
          type: "whatsapp"
        };
        const templateRecipes = await fetchTemplate(data);
        const finishTemplate = await switchTemplate(templateRecipes.template, "recipes", dataMapped);
        const pdfFile = await generatePdfFile("Receta", dataMapped, "prescriptionInput");
        await sendMessageWhatsapp(clinicalRecordSaved.patient, finishTemplate, pdfFile);
      }

      //message to remmissions
      if (clinicalRecordSaved.remissions.length && clinicalRecordSaved.patient.whatsapp_notifications) {
        updateProgress("Procesando remisiones...");
        const dataMapped = {
          ...clinicalRecordSaved.remissions[0],
          clinical_record: {
            patient: clinicalRecordSaved.patient
          }
        };
        const data = {
          tenantId: tenant,
          belongsTo: "remiciones-creacion",
          type: "whatsapp"
        };
        const templateRemissions = await fetchTemplate(data);
        const finishTemplate = await switchTemplate(templateRemissions.template, "remissions", dataMapped);
        const pdfFile = await generatePdfFile("Remision", dataMapped, "remisionInput");
        await sendMessageWhatsapp(clinicalRecordSaved.patient, finishTemplate, pdfFile);
      }

      //Message to clinical record
      if (clinicalRecordSaved && clinicalRecordSaved.patient.whatsapp_notifications) {
        updateProgress("Procesando historia clínica...");
        const data = {
          tenantId: tenant,
          belongsTo: "historia_clinica-creacion",
          type: "whatsapp"
        };
        const templateClinicalRecord = await fetchTemplate(data);
        const finishTemplate = await switchTemplate(templateClinicalRecord.template, "clinical_records", clinicalRecordSaved);
        const pdfFile = await generatePdfFile("Consulta", clinicalRecordSaved, "consultaInput");
        await sendMessageWhatsapp(clinicalRecordSaved.patient, finishTemplate, pdfFile);
      }
      //message to appointments
      if (clinicalRecordSaved.appointment && clinicalRecordSaved.patient.whatsapp_notifications) {
        updateProgress("Procesando cita...");
        const data = {
          tenantId: tenant,
          belongsTo: "citas-creacion",
          type: "whatsapp"
        };
        const templateAppointment = await fetchTemplate(data);
        const finishTemplate = await switchTemplate(templateAppointment.template, "appointments", clinicalRecordSaved.appointment);
        await sendMessageWhatsapp(clinicalRecordSaved.patient, finishTemplate, null);
      }
      setProgress(100);
      setProgressMessage("Proceso completado");
    } catch (error) {
      setProgressMessage(`Error: ${error.message}`);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 5000
      });
      throw error;
    }
  }, []);
  async function generatePdfFile(printType, data, nameInputTemp) {
    //@ts-ignore
    await generarFormato(printType, data, "Impresion", nameInputTemp, true);
    return new Promise((resolve, reject) => {
      let fileInput = document.getElementById("pdf-input-hidden-to-" + nameInputTemp);
      let file = fileInput?.files[0];
      if (!file) {
        resolve(null);
        return;
      }
      let formData = new FormData();
      formData.append("file", file);
      formData.append("model_type", "App\\Models\\ExamRecipes");
      formData.append("model_id", data.id);
      //@ts-ignore
      guardarArchivo(formData, true).then(async response => {
        resolve({
          //@ts-ignore
          file_url: await getUrlImage(response.file.file_url.replaceAll("\\", "/"), true),
          model_type: response.file.model_type,
          model_id: response.file.model_id,
          id: response.file.id
        });
      }).catch(reject);
    });
  }
  const sendMessageWhatsapp = useCallback(async (patient, templateFormatted, dataToFile) => {
    let dataMessage = {};
    if (dataToFile !== null) {
      dataMessage = {
        channel: "whatsapp",
        recipients: [getIndicativeByCountry(patient.country_id) + patient.whatsapp],
        message_type: "media",
        message: templateFormatted,
        attachment_url: dataToFile?.file_url,
        attachment_type: "document",
        minio_model_type: dataToFile?.model_type,
        minio_model_id: dataToFile?.model_id,
        minio_id: dataToFile?.id,
        webhook_url: "https://example.com/webhook"
      };
    } else {
      dataMessage = {
        channel: "whatsapp",
        recipients: [getIndicativeByCountry(patient.country_id) + patient.whatsapp],
        message_type: "text",
        message: templateFormatted,
        webhook_url: "https://example.com/webhook"
      };
    }
    await sendMessageWppRef.current(dataMessage);
  }, [sendMessageWpp]);
  const handleFinish = async () => {
    setIsProcessing(true);
    setProgress(0);
    setProgressMessage("Iniciando proceso...");
    const mappedData = await mapToServer();
    try {
      const clinicalRecordRes = await clinicalRecordService.clinicalRecordsParamsStore(patientId, mappedData);
      await prepareDataToSendMessageWPP(clinicalRecordRes.clinical_record);
      toast.current?.show({
        severity: "success",
        summary: "Completado",
        detail: "Se ha creado el registro exitosamente y se han enviado todos los mensajes correctamente",
        life: 3000
      });
      hideModal();
      window.location.href = `consultas-especialidad?patient_id=${patientId}&especialidad=${specialtyName}`;
    } catch (error) {
      console.error(error);
      if (error.data?.errors) {
        showFormErrors({
          title: "Errores de validación",
          errors: error.data.errors
        });
      } else {
        showErrorToast({
          title: "Error",
          message: error.message || "Ocurrió un error inesperado"
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };
  const mapToServer = async () => {
    const exams = examFormRef.current?.getFormData();
    const disability = disabilityFormRef.current?.getFormData();
    const prescriptions = prescriptionFormRef.current?.getFormData();
    const remission = remissionFormRef.current?.getFormData();
    const appointment = await appointmentFormRef.current?.mapAppointmentToServer();
    const requestDataAppointment = {
      assigned_user_specialty_id: currentAppointment.user_availability.user.user_specialty_id,
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time,
      assigned_user_availability_id: appointment.assigned_user_availability_id,
      assigned_supervisor_user_availability_id: appointment.assigned_supervisor_user_availability_id,
      attention_type: currentAppointment.attention_type,
      product_id: currentAppointment.product_id,
      consultation_purpose: getPurpuse(currentAppointment.consultation_purpose),
      consultation_type: "FOLLOW_UP",
      external_cause: "OTHER",
      frecuenciaCita: "",
      numRepeticiones: 0,
      selectPaciente: currentAppointment.patient_id,
      telefonoPaciente: currentAppointment.patient.whatsapp,
      correoPaciente: currentAppointment.patient.email,
      patient_id: currentAppointment.patient_id,
      appointment_state_id: currentAppointment.appointment_state_id,
      assigned_user_id: appointment.assigned_user_availability_id,
      created_by_user_id: appointment.created_by_user_id,
      duration: currentAppointment.user_availability.appointment_duration,
      branch_id: currentAppointment.user_availability.branch_id,
      phone: currentAppointment.patient.whatsapp,
      email: currentAppointment.patient.email
    };
    let result = {
      appointment_id: appointmentId,
      branch_id: "1",
      clinical_record_type_id: clinicalRecordTypeId,
      created_by_user_id: currentUser?.id,
      description: treatmentPlan || "--",
      data: {
        ...externalDynamicData,
        rips: diagnoses
      },
      consultation_duration: ""
    };
    if (examsActive && exams.length > 0) {
      result.exam_order = exams.map(exam => ({
        patient_id: patientId,
        exam_order_item_id: exam.id,
        exam_order_item_type: "exam_type"
      }));
    }
    if (prescriptionsActive && prescriptions.length > 0) {
      result.recipe = {
        user_id: currentUser?.id,
        patient_id: patientId,
        medicines: prescriptions.map(medicine => ({
          medication: medicine.medication,
          concentration: medicine.concentration,
          duration: medicine.duration,
          frequency: medicine.frequency,
          medication_type: medicine.medication_type,
          observations: medicine.observations,
          quantity: medicine.quantity,
          take_every_hours: medicine.take_every_hours
        })),
        type: "general"
      };
    }
    if (disabilitiesActive) {
      result.patient_disability = {
        user_id: currentUser?.id,
        start_date: disability.start_date.toISOString().split("T")[0],
        end_date: disability.end_date.toISOString().split("T")[0],
        reason: disability.reason
      };
    }
    if (remissionsActive) {
      result.remission = remission;
    }
    if (appointmentActive) {
      result.appointment = requestDataAppointment;
    }
    return result;
  };
  useImperativeHandle(ref, () => ({
    updateExternalDynamicData,
    showModal,
    hideModal
  }));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Dialog, {
    visible: visible,
    onHide: () => {
      hideModal();
    },
    header: "Finalizar Consulta",
    modal: true,
    style: {
      width: "100vw",
      maxWidth: "100vw"
    }
  }, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), isProcessing && /*#__PURE__*/React.createElement("div", {
    className: "position-fixed top-0 start-0 w-100 p-3 bg-light border-bottom",
    style: {
      zIndex: 10000,
      height: "18%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container-fluid h-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center justify-content-center h-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-3 w-100"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-spin pi-spinner text-primary"
  }), /*#__PURE__*/React.createElement(ProgressBar, {
    value: progress,
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "text-center",
    style: {
      minWidth: "100px"
    }
  }, /*#__PURE__*/React.createElement("strong", null, Math.round(progress), "% - ", progressMessage)))))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3 border-right d-flex flex-column gap-2",
    style: {
      width: "250px",
      minWidth: "250px"
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
    header: /*#__PURE__*/React.createElement("h3", {
      className: "p-3"
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
  }))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2 mt-3"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    className: "btn btn-danger",
    onClick: () => {
      hideModal();
    },
    disabled: isProcessing
  }), /*#__PURE__*/React.createElement(Button, {
    label: isProcessing ? "Procesando..." : "Finalizar",
    className: "btn btn-primary",
    onClick: () => {
      handleFinish();
    },
    disabled: isProcessing
  }))));
});
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