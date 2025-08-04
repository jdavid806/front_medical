import { classNames } from 'primereact/utils';
import React, { useRef, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
export const AddParaclinicalFields = ({
  control,
  errors,
  patientExamRecipes,
  file,
  fileUrl,
  onFileChange
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name].message);
  };
  const previewFile = () => {
    if (!file) return;
    const fileUrl = URL.createObjectURL(file);
    window.open(fileUrl, '_blank');
    setTimeout(() => URL.revokeObjectURL(fileUrl), 600000);
  };
  const handleTakePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      toggleCameraElements(true);
    } catch (error) {
      console.error("Error al acceder a la cámara:", error);
      alert("No se pudo acceder a la cámara. Por favor verifica los permisos.");
    }
  };
  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => {
      if (!blob || !fileInputRef.current) return;
      const file = new File([blob], "photo.jpg", {
        type: "image/jpeg"
      });
      const url = URL.createObjectURL(file);
      onFileChange(file);
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      stopCamera();
      toggleCameraElements(false);
    }, "image/jpeg", 0.95);
  };
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };
  const toggleCameraElements = showCamera => {
    const cameraParent = document.getElementById("camera")?.parentElement;
    const takePhotoBtn = document.getElementById("takePhoto");
    const capturePhotoBtn = document.getElementById("capturePhoto");
    if (showCamera) {
      cameraParent?.classList.remove("d-none");
      takePhotoBtn?.classList.add("d-none");
      capturePhotoBtn?.classList.remove("d-none");
    } else {
      cameraParent?.classList.add("d-none");
      takePhotoBtn?.classList.remove("d-none");
      capturePhotoBtn?.classList.add("d-none");
    }
  };
  useEffect(() => {
    return () => {
      stopCamera();
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "date",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Fecha *"), /*#__PURE__*/React.createElement(Calendar, {
      id: field.name,
      value: field.value,
      onChange: e => field.onChange(e.value),
      className: classNames('w-100', {
        'p-invalid': errors.date
      }),
      appendTo: 'self',
      placeholder: "Seleccione una fecha",
      showIcon: true,
      dateFormat: "dd/mm/yy"
    }))
  }), getFormErrorMessage('date')), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "exam_recipe_id",
    control: control,
    rules: {
      required: 'Seleccione una receta de examen'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Receta de examen *"), /*#__PURE__*/React.createElement(Dropdown, {
      inputId: field.name,
      value: field.value,
      onChange: e => field.onChange(e.value),
      options: patientExamRecipes,
      optionLabel: "label",
      optionValue: "id",
      filter: true,
      showClear: true,
      placeholder: "Seleccione una receta de examen",
      className: classNames('w-100', {
        'p-invalid': errors.exam_recipe_id
      }),
      appendTo: 'self'
    }))
  }), getFormErrorMessage('exam_recipe_id')), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "comment",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Comentarios (opcional)"), /*#__PURE__*/React.createElement(InputTextarea, {
      id: field.name,
      value: field.value || '',
      onChange: e => field.onChange(e.target.value),
      autoResize: true,
      rows: 5,
      cols: 30,
      className: "w-100"
    }))
  })), /*#__PURE__*/React.createElement("div", {
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
    onChange: e => onFileChange(e.target.files ? e.target.files[0] : null),
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
    className: "position-relative d-flex justify-content-center mb-3"
  }, fileUrl && /*#__PURE__*/React.createElement("div", {
    className: "profile-img-container"
  }, /*#__PURE__*/React.createElement("img", {
    id: "profilePreview",
    src: fileUrl,
    alt: "Previsualizaci\xF3n",
    style: {
      width: "100%",
      maxWidth: "300px",
      height: "auto",
      maxHeight: "300px",
      border: "2px solid #ddd",
      borderRadius: "8px"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "video-container d-none"
  }, /*#__PURE__*/React.createElement("video", {
    id: "camera",
    ref: videoRef,
    autoPlay: true,
    playsInline: true,
    style: {
      width: "100%",
      maxWidth: "300px",
      height: "auto",
      border: "2px solid #ddd",
      borderRadius: "8px"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 d-flex flex-column justify-content-center gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-outline-primary",
    id: "takePhoto",
    onClick: handleTakePhoto
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-camera me-2"
  }), " Tomar Foto"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-success d-none",
    id: "capturePhoto",
    onClick: handleCapturePhoto
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-check me-2"
  }), " Capturar Foto"), /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef,
    style: {
      display: "none"
    }
  })));
};