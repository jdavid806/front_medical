function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useState } from "react";
import { Steps } from "primereact/steps";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { FileUpload } from "primereact/fileupload";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { Checkbox } from "primereact/checkbox";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
export const MassMessageForm = ({
  formId,
  onHandleSubmit,
  initialData
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    body: ""
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedEmailFiles, setSelectedEmailFiles] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});
  const {
    control,
    handleSubmit
  } = useForm();
  const filterOptions = {
    "Rango de edad": ["18-25", "26-35", "36-45", "46+"],
    Sexo: ["Masculino", "Femenino", "Otro"],
    Pais: ["Colombia", "México", "Argentina", "España"],
    "Última consulta": ["Última semana", "Último mes", "Últimos 6 meses"],
    Citas: ["1-3 citas", "4-6 citas", "7+ citas"],
    "Citas desde": ["Última semana", "Último mes", "Último año"],
    "Estado civil": ["Soltero", "Casado", "Divorciado", "Viudo"],
    "Grupo sanguíneo": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  };
  const steps = [{
    label: "Segmentación"
  }, {
    label: "Formato de envío"
  }, {
    label: "Vista previa"
  }];
  const filterGroups = [{
    label: "Seleccione un filtro",
    value: null
  }, {
    label: "De la A a la I grupo 1",
    value: "group1"
  }, {
    label: "De la J a la M grupo 2",
    value: "group2"
  }, {
    label: "De la N a la Z grupo 3",
    value: "group3"
  }];
  const customFilters = [{
    label: "Seleccione un filtro",
    value: null
  }, {
    label: "Filtro de prueba",
    value: "1"
  }, {
    label: "Filtro de test",
    value: "2"
  }];
  const sendMethods = [{
    label: "Seleccione una opción",
    value: ""
  }, {
    label: "Whatsapp",
    value: "whatsapp"
  }, {
    label: "Correo electrónico",
    value: "email"
  }];
  const handleFilterToggle = (filterType, checked) => {
    if (checked) {
      setSelectedFilters(prev => ({
        ...prev,
        [filterType]: ""
      }));
    } else {
      const newFilters = {
        ...selectedFilters
      };
      delete newFilters[filterType];
      setSelectedFilters(newFilters);
    }
  };
  const handleFilterSelection = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };
  const handleWhatsappFileUpload = e => {
    const file = e.files[0];
    setSelectedFile(file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = event => {
        setPreviewImage(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleEmailFileUpload = e => {
    setSelectedEmailFiles(e.files);
  };
  const nextStep = () => {
    if (activeIndex < steps.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };
  const prevStep = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };
  const onSubmit = data => {
    const formData = {
      ...data,
      method: selectedMethod,
      whatsapp: {
        message: whatsappMessage,
        file: selectedFile
      },
      email: {
        ...emailData,
        attachments: selectedEmailFiles
      },
      filters: selectedFilters
    };
    console.log("Form Data Submitted:", formData);

    // onHandleSubmit(formData);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid p-3"
  }, /*#__PURE__*/React.createElement(Steps, {
    model: steps,
    activeIndex: activeIndex,
    className: "mb-4",
    readOnly: true
  }), /*#__PURE__*/React.createElement("form", {
    id: formId,
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames({
      "d-none": activeIndex !== 0
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Filtro [A-Z]"), /*#__PURE__*/React.createElement(Controller, {
    name: "filterGroups",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      options: filterGroups,
      placeholder: "Seleccione un filtro",
      className: "w-100"
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Filtros personalizados"), /*#__PURE__*/React.createElement(Controller, {
    name: "filterCustom",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      options: customFilters,
      placeholder: "Seleccione un filtro",
      className: "w-100"
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "text-decoration-none",
    onClick: e => {
      e.preventDefault();
      setShowFilters(!showFilters);
    }
  }, "Configurar filtros de cliente"), showFilters && /*#__PURE__*/React.createElement("div", {
    className: "mt-2 p-3 border rounded"
  }, Object.keys(filterOptions).map(filterType => /*#__PURE__*/React.createElement("div", {
    key: filterType,
    className: "mb-2"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    inputId: filterType,
    onChange: e => handleFilterToggle(filterType, e.checked || false),
    checked: !!selectedFilters[filterType],
    className: "me-2"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: filterType
  }, filterType.replace("-", " ")), selectedFilters[filterType] !== undefined && /*#__PURE__*/React.createElement(Dropdown, {
    value: selectedFilters[filterType],
    options: [{
      label: "Seleccione",
      value: ""
    }, ...filterOptions[filterType].map(opt => ({
      label: opt,
      value: opt
    }))],
    placeholder: `Seleccione ${filterType}`,
    className: "w-100 mt-1",
    onChange: e => handleFilterSelection(filterType, e.value)
  })))))), /*#__PURE__*/React.createElement("div", {
    className: classNames({
      "d-none": activeIndex !== 1
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Selecciona el m\xE9todo de env\xEDo:"), /*#__PURE__*/React.createElement(Dropdown, {
    value: selectedMethod,
    options: sendMethods,
    onChange: e => setSelectedMethod(e.value),
    className: "w-100",
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "row mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Fecha de env\xEDo"), /*#__PURE__*/React.createElement(Calendar, {
    className: "w-100",
    dateFormat: "dd/mm/yy",
    showIcon: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Hora de env\xEDo"), /*#__PURE__*/React.createElement(Calendar, {
    className: "w-100",
    timeOnly: true,
    showIcon: true
  }))), selectedMethod === "whatsapp" && /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("h4", null, "Enviar por Whatsapp"), /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Mensaje:"), /*#__PURE__*/React.createElement(InputTextarea, {
    value: whatsappMessage,
    onChange: e => setWhatsappMessage(e.target.value),
    rows: 4,
    className: "w-100 mb-2",
    required: true
  }), /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Adjuntar archivo:"), /*#__PURE__*/React.createElement(FileUpload, {
    mode: "basic",
    name: "whatsappFile",
    accept: "image/*",
    maxFileSize: 1000000,
    chooseLabel: "Seleccionar archivo",
    onSelect: handleWhatsappFileUpload,
    className: "w-100"
  })), selectedMethod === "email" && /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("h4", null, "Enviar por Correo Electr\xF3nico"), /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Para:"), /*#__PURE__*/React.createElement(InputText, {
    type: "email",
    value: emailData.to,
    onChange: e => setEmailData({
      ...emailData,
      to: e.target.value
    }),
    className: "w-100 mb-2",
    required: true
  }), /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Asunto:"), /*#__PURE__*/React.createElement(InputText, {
    value: emailData.subject,
    onChange: e => setEmailData({
      ...emailData,
      subject: e.target.value
    }),
    className: "w-100 mb-2",
    required: true
  }), /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Mensaje:"), /*#__PURE__*/React.createElement(InputTextarea, {
    value: emailData.body,
    onChange: e => setEmailData({
      ...emailData,
      body: e.target.value
    }),
    rows: 6,
    className: "w-100 mb-2",
    required: true
  }), /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Adjuntar archivos:"), /*#__PURE__*/React.createElement(FileUpload, {
    mode: "basic",
    name: "emailAttachments",
    multiple: true,
    accept: "image/*",
    maxFileSize: 1000000,
    chooseLabel: "Seleccionar archivos",
    onSelect: handleEmailFileUpload,
    className: "w-100"
  }))), /*#__PURE__*/React.createElement("div", {
    className: classNames({
      "d-none": activeIndex !== 2
    })
  }, selectedMethod === "whatsapp" && /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-center"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "p-2 w-75"
  }, previewImage && /*#__PURE__*/React.createElement("div", {
    className: "mb-3 text-center"
  }, /*#__PURE__*/React.createElement("img", {
    src: previewImage,
    alt: "Imagen adjunta",
    className: "img-fluid rounded cursor-pointer",
    style: {
      maxHeight: "300px"
    },
    onClick: () => setShowImageModal(true)
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-3 border rounded bg-light"
  }, whatsappMessage || "Sin mensaje"))), selectedMethod === "email" && /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-center"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "p-3 w-75"
  }, /*#__PURE__*/React.createElement("h3", null, "Vista Previa del Correo"), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("strong", null, "Para:"), " ", /*#__PURE__*/React.createElement("span", null, emailData.to || "Sin destinatario")), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("strong", null, "Asunto:"), " ", /*#__PURE__*/React.createElement("span", null, emailData.subject || "Sin asunto")), /*#__PURE__*/React.createElement("div", {
    className: "p-3 border rounded bg-light mb-3"
  }, emailData.body || "Sin mensaje"), selectedEmailFiles.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h5", null, "Archivos Adjuntos:"), /*#__PURE__*/React.createElement("ul", {
    className: "list-unstyled"
  }, selectedEmailFiles.map((file, index) => /*#__PURE__*/React.createElement("li", {
    key: index,
    className: "mb-1"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-file me-2"
  }), file.name))))))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between mt-4"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: prevStep,
    disabled: activeIndex === 0
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-chevron-left me-2"
  }), "Anterior"), activeIndex < steps.length - 1 ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-primary",
    onClick: nextStep
  }, "Siguiente", /*#__PURE__*/React.createElement("i", {
    className: "pi pi-chevron-right ms-2"
  })) : /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-success"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-check me-2"
  }), "Finalizar"))), /*#__PURE__*/React.createElement(Dialog, {
    visible: showImageModal,
    onHide: () => setShowImageModal(false),
    header: "Vista previa de la imagen",
    style: {
      width: "50vw"
    },
    className: "bootstrap-dialog"
  }, /*#__PURE__*/React.createElement("img", {
    src: previewImage,
    alt: "Imagen adjunta",
    className: "img-fluid rounded"
  })));
};