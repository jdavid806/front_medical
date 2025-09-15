function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispensedClaim } from "../koneksi/hooks/useDispensedClaim.js";
import { useAdmission } from "./hooks/useAdmission.js";
import { useSupportingDocumentsPolicy } from "../koneksi/hooks/useSupportingDocumentsPolicy.js";
import { useViewDocument } from "../koneksi/hooks/useViewDocument.js";
import { useAddFilesToPreauthorization } from "../koneksi/hooks/useAddFilesToPreauthorization.js";
export const KoneksiUploadAndVisualizeExamResultsModal = ({
  admissionId
}) => {
  const {
    admission,
    fetchAdmission
  } = useAdmission();
  const {
    dispensedClaim,
    dispensedClaimFiles,
    fetchDispensedClaim
  } = useDispensedClaim();
  const {
    supportingDocuments,
    fetchSupportingDocumentsPolicy
  } = useSupportingDocumentsPolicy();
  const {
    viewDocumentPDF
  } = useViewDocument();
  const {
    addFilesToPreauthorization
  } = useAddFilesToPreauthorization();
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const {
    control,
    register,
    reset,
    handleSubmit,
    setValue,
    getValues,
    formState: {
      errors
    }
  } = useForm({
    defaultValues: {
      document_type: null
    }
  });
  const fileInputRef = useRef(null);
  useEffect(() => {
    fetchAdmission(admissionId);
  }, []);
  useEffect(() => {
    if (admission) {
      fetchDispensedClaim(admission.koneksi_claim_id);
    }
  }, [admission]);
  useEffect(() => {
    if (dispensedClaim) {
      fetchSupportingDocumentsPolicy({
        preauthorizationId: dispensedClaim.authorization_id
      });
    }
  }, [dispensedClaim]);
  useEffect(() => {}, [supportingDocuments]);
  const getFormErrorMessage = name => {
    return errors[name] && errors[name].type !== "required" && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name].message);
  };
  const handleFileChange = newFile => {
    setFile(newFile);
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
      setFileUrl(null);
    }
    if (newFile) {
      setFileUrl(URL.createObjectURL(newFile));
    }
  };
  const previewFile = () => {
    if (!file) return;
    const fileUrl = URL.createObjectURL(file);
    window.open(fileUrl, '_blank');
    setTimeout(() => URL.revokeObjectURL(fileUrl), 600000);
  };
  const onSubmit = async data => {
    if (data.document_type && file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await addFilesToPreauthorization(dispensedClaim.authorization_request_id, formData, {
          authorization_id: dispensedClaim.authorization_id,
          document_type_slug: data.document_type,
          coverage: dispensedClaim.transaction_type,
          product_type: dispensedClaim.product_type
        });
        fetchSupportingDocumentsPolicy({
          preauthorizationId: dispensedClaim.authorization_id
        });
      } catch (error) {}
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "document_type",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Tipo de archivo"), /*#__PURE__*/React.createElement(Dropdown, _extends({
      options: supportingDocuments,
      optionLabel: "fallback_name",
      optionValue: "slug",
      placeholder: "Seleccione un tipo de archivo",
      className: classNames("w-100", {
        "p-invalid": errors.document_type
      })
    }, field)))
  }), getFormErrorMessage("document_type")), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "addParaclinicalFormFile",
    className: "form-label"
  }, "Adjuntar resultados de ex\xE1menes"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-fill"
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    type: "file",
    id: "addParaclinicalFormFile",
    accept: ".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx",
    onChange: e => handleFileChange(e.target.files ? e.target.files[0] : null),
    ref: fileInputRef
  }), file && /*#__PURE__*/React.createElement("div", {
    className: "d-flex"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary ms-2",
    type: "button",
    onClick: previewFile,
    disabled: !file
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-eye"
  }), " Previsualizar")))), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "Formatos aceptados: PDF, JPG, PNG, DOC, XLS")), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end"
  }, /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary"
  }, "Cargar archivo"))), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("h4", {
    className: "mb-3"
  }, "Archivos cargados"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-wrap"
  }, dispensedClaimFiles.map(file => /*#__PURE__*/React.createElement("div", {
    key: file.id,
    className: "d-flex justify-content-between align-items-center w-100 mb-2"
  }, /*#__PURE__*/React.createElement("span", null, file.fallback_name), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary btn-sm",
    onClick: () => viewDocumentPDF(file.id)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-eye"
  }))))));
};