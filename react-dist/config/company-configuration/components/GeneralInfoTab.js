function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useRef, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { useCompany } from "../hooks/useCompanyGenralUpdate.js";
import { SwalManager } from "../../../../services/alertManagerImported.js";
const GeneralInfoTab = ({
  company,
  onUpdate,
  onValidationChange
}) => {
  const {
    guardarInformacionGeneral,
    mutationLoading,
    mutationError,
    mutationSuccess,
    resetMutation
  } = useCompany();
  const logoFileRef = useRef(null);
  const watermarkFileRef = useRef(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [watermarkPreview, setWatermarkPreview] = useState(null);
  const [newLogoFile, setNewLogoFile] = useState(null);
  const [newWatermarkFile, setNewWatermarkFile] = useState(null);
  const {
    control,
    handleSubmit,
    formState: {
      errors,
      isValid,
      isDirty
    },
    reset,
    watch
  } = useForm({
    defaultValues: company || {
      legal_name: "",
      document_type: "",
      document_number: "",
      phone: "",
      email: "",
      address: "",
      country: "",
      city: "",
      logo: "",
      watermark: ""
    },
    mode: "onChange"
  });
  const logoValue = watch("logo");
  const watermarkValue = watch("watermark");
  const formValues = watch();

  // Validar campos requeridos para habilitar siguiente tab
  useEffect(() => {
    const hasRequiredFields = Boolean(formValues.legal_name && formValues.document_type && formValues.document_number && formValues.phone && formValues.email && formValues.address && formValues.country && formValues.city);
    onValidationChange?.(hasRequiredFields);
  }, [formValues, onValidationChange]);
  useEffect(() => {
    if (company) {
      reset(company);
      if (company.logo) {
        loadImagePreview(company.logo, "logo");
      }
      if (company.watermark) {
        loadImagePreview(company.watermark, "watermark");
      }
    }
  }, [company, reset]);
  useEffect(() => {
    if (logoValue && !newLogoFile) {
      loadImagePreview(logoValue, "logo");
    }
  }, [logoValue, newLogoFile]);
  useEffect(() => {
    if (watermarkValue && !newWatermarkFile) {
      loadImagePreview(watermarkValue, "watermark");
    }
  }, [watermarkValue, newWatermarkFile]);
  const loadImagePreview = async (imagePath, type) => {
    try {
      // @ts-ignore - Usar la función global getUrlImage si existe
      if (typeof getUrlImage === "function") {
        // @ts-ignore
        const imageUrl = await getUrlImage(imagePath.replaceAll("\\", "/"), true);
        if (type === "logo") {
          setLogoPreview(imageUrl);
        } else {
          setWatermarkPreview(imageUrl);
        }
      } else {
        const baseUrl = "https://dev.monaros.co";
        const imageUrl = `${baseUrl}/storage/${imagePath.replaceAll("\\", "/")}`;
        if (type === "logo") {
          setLogoPreview(imageUrl);
        } else {
          setWatermarkPreview(imageUrl);
        }
      }
    } catch (error) {
      console.error(`Error loading ${type} preview:`, error);
    }
  };
  const handleLogoChange = event => {
    const file = event.target.files?.[0];
    if (file) {
      setNewLogoFile(file);
      const reader = new FileReader();
      reader.onload = e => {
        setLogoPreview(e.target?.result);
      };
      reader.readAsDataURL(file);
    } else {
      setNewLogoFile(null);
      if (logoValue) {
        loadImagePreview(logoValue, "logo");
      } else {
        setLogoPreview(null);
      }
    }
  };
  const handleWatermarkChange = event => {
    const file = event.target.files?.[0];
    if (file) {
      setNewWatermarkFile(file);
      const reader = new FileReader();
      reader.onload = e => {
        setWatermarkPreview(e.target?.result);
      };
      reader.readAsDataURL(file);
    } else {
      setNewWatermarkFile(null);
      if (watermarkValue) {
        loadImagePreview(watermarkValue, "watermark");
      } else {
        setWatermarkPreview(null);
      }
    }
  };
  const removeLogo = () => {
    setNewLogoFile(null);
    setLogoPreview(null);
    if (logoFileRef.current) {
      logoFileRef.current.value = "";
    }
  };
  const removeWatermark = () => {
    setNewWatermarkFile(null);
    setWatermarkPreview(null);
    if (watermarkFileRef.current) {
      watermarkFileRef.current.value = "";
    }
  };
  const documentTypes = [{
    label: "Rnc",
    value: "RNC"
  }, {
    label: "Cedula De Entidad",
    value: "CC"
  }, {
    label: "Pasaporte",
    value: "PASSPORT"
  }];
  const countries = [{
    label: "República Dominicana",
    value: "RD"
  }, {
    label: "Colombia",
    value: "CO"
  }, {
    label: "México",
    value: "MX"
  }, {
    label: "Argentina",
    value: "AR"
  }, {
    label: "Chile",
    value: "CL"
  }, {
    label: "Perú",
    value: "PE"
  }];
  const onSubmit = async data => {
    try {
      const response = await guardarInformacionGeneral(data, newLogoFile || undefined, newWatermarkFile || undefined);
      if (response.success) {
        onUpdate(data);
        setNewLogoFile(null);
        setNewWatermarkFile(null);
        if (logoFileRef.current) logoFileRef.current.value = "";
        if (watermarkFileRef.current) watermarkFileRef.current.value = "";
        SwalManager.success("Informacion General se actualizo correctamente");
      }
    } catch (error) {
      window["toast"].show({
        severity: "error",
        summary: "Error",
        detail: "Error Actualizar Informacion General",
        life: 5000
      });
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, mutationError && /*#__PURE__*/React.createElement(Message, {
    severity: "error",
    text: mutationError,
    className: "mb-3"
  }), mutationSuccess && /*#__PURE__*/React.createElement(Message, {
    severity: "success",
    text: "Informaci\xF3n guardada correctamente",
    className: "mb-3"
  }), /*#__PURE__*/React.createElement("div", {
    className: "row mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "alert alert-info"
  }, /*#__PURE__*/React.createElement("small", null, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-info-circle mr-2"
  }), /*#__PURE__*/React.createElement("strong", null, "Nota:"), " Complete todos los campos obligatorios para habilitar el siguiente m\xF3dulo.")))), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "row mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "fw-bold"
  }, "Datos Consultorio")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "legal_name",
    className: "form-label"
  }, "Nombre Comercial ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "legal_name",
    control: control,
    rules: {
      required: "El nombre del Consultorio no puede estar vacío"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      id: "legal_name",
      className: `form-control ${errors.legal_name ? "is-invalid" : ""}`,
      placeholder: "Nombre Consultorio"
    }))
  }), errors.legal_name && /*#__PURE__*/React.createElement("div", {
    className: "invalid-feedback d-block"
  }, errors.legal_name.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "address",
    className: "form-label"
  }, "Direcci\xF3n ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "address",
    control: control,
    rules: {
      required: "Ingrese una dirección válida"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      id: "address",
      className: `form-control ${errors.address ? "is-invalid" : ""}`,
      placeholder: "Ej: Calle 123 #45-67, Bogot\xE1"
    }))
  }), errors.address && /*#__PURE__*/React.createElement("div", {
    className: "invalid-feedback d-block"
  }, errors.address.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "document_type",
    className: "form-label"
  }, "Tipo Documento ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "document_type",
    control: control,
    rules: {
      required: "Seleccione un Tipo de Documento"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      id: "document_type",
      options: documentTypes,
      placeholder: "Seleccione un tipo de documento",
      className: `w-100 ${errors.document_type ? "is-invalid" : ""}`
    }))
  }), errors.document_type && /*#__PURE__*/React.createElement("div", {
    className: "invalid-feedback d-block"
  }, errors.document_type.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "document_number",
    className: "form-label"
  }, "Documento ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "document_number",
    control: control,
    rules: {
      required: "El Documento no puede estar vacío"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      id: "document_number",
      className: `form-control ${errors.document_number ? "is-invalid" : ""}`,
      placeholder: "123456789"
    }))
  }), errors.document_number && /*#__PURE__*/React.createElement("div", {
    className: "invalid-feedback d-block"
  }, errors.document_number.message))), /*#__PURE__*/React.createElement("div", {
    className: "row mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "fw-bold"
  }, "Configuraci\xF3n General")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "phone",
    className: "form-label"
  }, "WhatsApp ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "phone",
    control: control,
    rules: {
      required: "Ingrese un número de WhatsApp válido",
      pattern: {
        value: /^\+?[\d\s\-\(\)]+$/,
        message: "Formato de teléfono inválido"
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      id: "phone",
      className: `form-control ${errors.phone ? "is-invalid" : ""}`,
      placeholder: "+57 300 123 4567"
    }))
  }), errors.phone && /*#__PURE__*/React.createElement("div", {
    className: "invalid-feedback d-block"
  }, errors.phone.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "email",
    className: "form-label"
  }, "Correo Electr\xF3nico ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "email",
    control: control,
    rules: {
      required: "Ingrese un correo electrónico válido",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Formato de email inválido"
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      id: "email",
      className: `form-control ${errors.email ? "is-invalid" : ""}`,
      placeholder: "ejemplo@correo.com"
    }))
  }), errors.email && /*#__PURE__*/React.createElement("div", {
    className: "invalid-feedback d-block"
  }, errors.email.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "country",
    className: "form-label"
  }, "Pa\xEDs ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "country",
    control: control,
    rules: {
      required: "Seleccione un país"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      id: "country",
      options: countries,
      placeholder: "Seleccione un pa\xEDs",
      className: `w-100 ${errors.country ? "is-invalid" : ""}`
    }))
  }), errors.country && /*#__PURE__*/React.createElement("div", {
    className: "invalid-feedback d-block"
  }, errors.country.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "city",
    className: "form-label"
  }, "Ciudad ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "city",
    control: control,
    rules: {
      required: "Ingrese una ciudad válida"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      id: "city",
      className: `form-control ${errors.city ? "is-invalid" : ""}`,
      placeholder: "Ej: Medell\xEDn"
    }))
  }), errors.city && /*#__PURE__*/React.createElement("div", {
    className: "invalid-feedback d-block"
  }, errors.city.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "logo",
    className: "form-label"
  }, "Logo"), logoPreview && /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-3"
  }, /*#__PURE__*/React.createElement("img", {
    src: logoPreview,
    alt: "Logo preview",
    className: "img-thumbnail",
    style: {
      width: "200px",
      height: "200px",
      objectFit: "contain"
    }
  }), /*#__PURE__*/React.createElement(Button, {
    type: "button",
    className: "p-button-danger p-button-sm",
    onClick: removeLogo,
    tooltip: "Eliminar logo"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-trash"
  }))), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, newLogoFile ? "Nueva imagen seleccionada" : "Imagen actual")), /*#__PURE__*/React.createElement("input", {
    ref: logoFileRef,
    type: "file",
    id: "logo",
    className: "form-control",
    accept: "image/*",
    onChange: handleLogoChange
  }), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "Formatos aceptados: JPG, PNG, GIF. Tama\xF1o m\xE1ximo: 5MB")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "watermark",
    className: "form-label"
  }, "Marca de Agua"), watermarkPreview && /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-3"
  }, /*#__PURE__*/React.createElement("img", {
    src: watermarkPreview,
    alt: "Watermark preview",
    className: "img-thumbnail",
    style: {
      width: "200px",
      height: "200px",
      objectFit: "contain"
    }
  }), /*#__PURE__*/React.createElement(Button, {
    type: "button",
    className: "p-button-danger p-button-sm",
    onClick: removeWatermark,
    tooltip: "Eliminar marca de agua"
  }, " ", /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-trash"
  }), " ")), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, newWatermarkFile ? "Nueva imagen seleccionada" : "Imagen actual")), /*#__PURE__*/React.createElement("input", {
    ref: watermarkFileRef,
    type: "file",
    id: "watermark",
    className: "form-control",
    accept: "image/*",
    onChange: handleWatermarkChange
  }), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "Formatos aceptados: JPG, PNG, GIF. Tama\xF1o m\xE1ximo: 5MB"))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("div", null, isDirty && /*#__PURE__*/React.createElement("small", {
    className: "text-warning"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-info-circle mr-2"
  }), "Tienes cambios sin guardar")), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    label: "Guardar",
    icon: "pi pi-save",
    loading: mutationLoading,
    disabled: mutationLoading,
    className: "btn-primary"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-save",
    style: {
      marginLeft: "10px"
    }
  }))))));
};
export default GeneralInfoTab;