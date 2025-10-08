function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { useCountries } from "../countries/hooks/useCountries.js";
import { genders } from "../../services/commons.js";
import { useRoles } from "../user-roles/hooks/useUserRoles.js";
import { useUserSpecialties } from "../user-specialties/hooks/useUserSpecialties.js";
import { Divider } from "primereact/divider";
import { Password } from "primereact/password";
import { useCitiesByCountry } from "../cities/hooks/useCitiesByCountry.js";
import { useRef } from "react";
import { InputSwitch } from "primereact/inputswitch";
const UserForm = ({
  formId,
  onHandleSubmit,
  initialData,
  config
}) => {
  console.log('initialData en UserForm:', initialData);
  const [profileUrl, setProfileUrl] = useState("../assets/img/profile/profile_default.jpg");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Iniciar cámara
  const handleTakePhoto = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true
    });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
    document.getElementById("camera")?.parentElement?.classList.remove("d-none");
    document.getElementById("takePhoto")?.classList.add("d-none");
    document.getElementById("capturePhoto")?.classList.remove("d-none");
  };

  // Capturar imagen
  const handleCapturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => {
      const file = new File([blob], "photo.jpg", {
        type: "image/jpeg"
      });

      // Mostrar previsualización
      const url = URL.createObjectURL(file);
      setProfileUrl(url);

      // Asignar al input file para hook form
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = fileInputRef.current;
      input.files = dataTransfer.files;

      // Detener cámara
      video.srcObject.getTracks().forEach(track => track.stop());

      // Ocultar cámara
      document.getElementById("camera")?.parentElement?.classList.add("d-none");
      document.getElementById("takePhoto")?.classList.remove("d-none");
      document.getElementById("capturePhoto")?.classList.add("d-none");
    }, "image/jpeg");
  };
  const [selectedRole, setSelectedRole] = useState(null);
  const {
    control,
    handleSubmit,
    formState: {
      errors
    },
    reset,
    watch,
    setValue,
    getValues
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      second_last_name: "",
      user_role_id: 0,
      user_specialty_id: 0,
      country_id: "",
      city_id: "",
      gender: "",
      address: "",
      phone: "",
      minio_id: null,
      minio_url: null,
      clinical_record: null,
      otp_enabled: false
    }
  });
  const onSubmit = data => onHandleSubmit(data);

  // Manejar cambio del switch OTP

  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name].message);
  };
  const fetchCitiesByCountryName = countryId => {
    const country = countries.find(country => country.name === countryId);
    if (country) {
      fetchCities(country.id);
    }
  };

  // useEffect para el reset
  // En UserForm, corrige el useEffect del reset
  useEffect(() => {
    if (initialData) {
      const resetData = {
        ...initialData
      };
      reset(resetData);
    } else {
      reset({
        username: "",
        email: "",
        password: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        second_last_name: "",
        user_role_id: 0,
        user_specialty_id: 0,
        country_id: "",
        city_id: "",
        gender: "",
        address: "",
        phone: "",
        minio_id: null,
        minio_url: null,
        clinical_record: null,
        otp_enabled: false
      });
    }
  }, [initialData, reset]);
  const {
    countries
  } = useCountries();
  const {
    cities,
    fetchCities,
    isInitialCitiesLoad,
    setIsInitialCitiesLoad
  } = useCitiesByCountry();
  const {
    userRoles
  } = useRoles();
  const {
    userSpecialties
  } = useUserSpecialties();
  const gendersForSelect = Object.entries(genders).map(([value, label]) => ({
    value,
    label
  }));
  const watchUserRoleId = watch("user_role_id");
  const watchCountryId = watch("country_id");
  const watchMinioUrl = watch("minio_url");
  const watchOtpEnabled = watch("otp_enabled");
  const watchEmail = watch("email");

  // Debug para ver los valores actuales
  useEffect(() => {
    console.log('Valores actuales del formulario:', {
      otp_enabled: watchOtpEnabled,
      email: watchEmail,
      user_role_id: watchUserRoleId
    });
  }, [watchOtpEnabled, watchEmail, watchUserRoleId]);
  useEffect(() => {
    if (initialData && initialData.country_id) {
      fetchCitiesByCountryName(initialData.country_id);
    }
  }, [countries, initialData]);
  useEffect(() => {
    if (isInitialCitiesLoad && cities.length > 0 && initialData?.city_id) {
      setValue("city_id", initialData.city_id);
      setIsInitialCitiesLoad(false);
    }
  }, [cities, initialData, setValue, isInitialCitiesLoad]);
  useEffect(() => {
    if (watchUserRoleId) {
      const role = userRoles.find(role => role.id === watchUserRoleId);
      setSelectedRole(role);
    } else {
      setSelectedRole(null);
    }
  }, [watchUserRoleId, userRoles]);
  useEffect(() => {
    if (watchCountryId) {
      fetchCitiesByCountryName(watchCountryId);
    }
  }, [watchCountryId]);
  useEffect(() => {
    handleProfileUrl(watchMinioUrl);
  }, [watchMinioUrl]);
  const handleProfileUrl = async minioUrl => {
    //@ts-ignore
    const url = getUrlImage(minioUrl);
    setProfileUrl(url);
  };
  const passwordHeader = /*#__PURE__*/React.createElement("div", {
    className: "font-bold mb-3"
  }, "Escribe una contrase\xF1a");
  const passwordFooter = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("p", {
    className: "mt-2"
  }, "Sugerencias"), /*#__PURE__*/React.createElement("ul", {
    className: "pl-2 ml-2 mt-0 line-height-3"
  }, /*#__PURE__*/React.createElement("li", null, "Al menos una min\xFAscula"), /*#__PURE__*/React.createElement("li", null, "Al menos una may\xFAscula"), /*#__PURE__*/React.createElement("li", null, "Al menos un n\xFAmero"), /*#__PURE__*/React.createElement("li", null, "M\xEDnimo 8 caracteres")));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("form", {
    id: formId,
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "card mb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row justify-content-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 text-center mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "position-relative d-flex justify-content-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "profile-img-container"
  }, /*#__PURE__*/React.createElement("img", {
    id: "profilePreview",
    src: profileUrl || "../assets/img/profile/profile_default.jpg",
    alt: "Previsualizaci\xF3n",
    style: {
      width: "150px",
      height: "150px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "2px solid #ddd"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "video-container d-none"
  }, /*#__PURE__*/React.createElement("video", {
    id: "camera",
    ref: videoRef,
    autoPlay: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 d-flex flex-column justify-content-center gap-2"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "uploadImageConfigUsers",
    className: "btn btn-primary align-self-center"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-upload me-1"
  }), " Subir Imagen"), /*#__PURE__*/React.createElement("div", {
    className: "icon-container",
    id: "takePhoto",
    onClick: handleTakePhoto
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-camera fs-4"
  })), /*#__PURE__*/React.createElement("div", {
    className: "icon-container d-none",
    id: "capturePhoto",
    onClick: handleCapturePhoto
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-check fs-4 text-success"
  }))), /*#__PURE__*/React.createElement("input", {
    type: "file",
    id: "uploadImageConfigUsers",
    className: "d-none",
    accept: "image/*",
    ref: fileInputRef,
    onChange: e => {
      const file = e.target.files?.[0];
      if (file) {
        setProfileUrl(URL.createObjectURL(file));
      }
    }
  }), /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef,
    style: {
      display: "none"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "first_name",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Primer nombre ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      placeholder: "Primer nombre",
      className: classNames("w-100", {
        "p-invalid": errors.first_name
      })
    }, field)))
  }), getFormErrorMessage("first_name")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "middle_name",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Segundo nombre"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      placeholder: "Segundo nombre",
      className: "w-100"
    }, field)))
  }), getFormErrorMessage("middle_name")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "last_name",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Primer apellido ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      placeholder: "Primer apellido",
      className: classNames("w-100", {
        "p-invalid": errors.last_name
      })
    }, field)))
  }), getFormErrorMessage("last_name")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "second_last_name",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Segundo apellido"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      placeholder: "Segundo apellido",
      className: "w-100"
    }, field)))
  }), getFormErrorMessage("second_last_name")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "country_id",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Pa\xEDs ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(Dropdown, _extends({
      inputId: field.name,
      filter: true,
      options: countries,
      optionLabel: "name",
      optionValue: "name",
      placeholder: "Seleccione un pa\xEDs",
      className: classNames("w-100", {
        "p-invalid": errors.country_id
      })
    }, field)))
  }), getFormErrorMessage("country_id")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "city_id",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Ciudad ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(Dropdown, {
      inputId: field.name,
      filter: true,
      options: cities,
      optionLabel: "name",
      optionValue: "name",
      placeholder: "Seleccione una ciudad",
      className: classNames("w-100", {
        "p-invalid": errors.city_id
      }),
      value: field.value,
      onChange: e => field.onChange(e.value)
    }))
  }), getFormErrorMessage("city_id")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "gender",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "G\xE9nero ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(Dropdown, _extends({
      inputId: field.name,
      options: gendersForSelect,
      optionLabel: "label",
      optionValue: "value",
      placeholder: "Seleccione un g\xE9nero",
      className: classNames("w-100", {
        "p-invalid": errors.gender
      })
    }, field)))
  }), getFormErrorMessage("gender")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "address",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Direcci\xF3n ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      placeholder: "Direcci\xF3n",
      className: classNames("w-100", {
        "p-invalid": errors.address
      })
    }, field)))
  }), getFormErrorMessage("address")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "phone",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Tel\xE9fono ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      placeholder: "Tel\xE9fono",
      className: classNames("w-100", {
        "p-invalid": errors.phone
      })
    }, field)))
  }), getFormErrorMessage("phone")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "email",
    control: control,
    rules: {
      required: "Este campo es requerido",
      pattern: {
        value: /^\S+@\S+$/i,
        message: "Correo inválido"
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Correo ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      placeholder: "Correo",
      className: classNames("w-100", {
        "p-invalid": errors.email
      })
    }, field)))
  }), getFormErrorMessage("email")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-12 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "otp_enabled",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center p-3 border rounded bg-light"
    }, /*#__PURE__*/React.createElement(InputSwitch, {
      inputId: field.name,
      checked: field.value,
      onChange: e => {
        field.onChange(e.value);
      },
      disabled: !watchEmail
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label ms-3 mb-0 flex-grow-1"
    }, /*#__PURE__*/React.createElement("strong", null, "Autenticaci\xF3n de dos factores (OTP)"), /*#__PURE__*/React.createElement("div", {
      className: "text-muted small"
    }, !watchEmail ? "Complete el campo de email primero" : field.value ? "OTP activado" : "OTP desactivado")))
  }), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "Al activar/desactivar se enviar\xE1 autom\xE1ticamente al servidor"))))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "user_role_id",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Rol ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(Dropdown, _extends({
      inputId: field.name,
      options: userRoles,
      optionLabel: "name",
      optionValue: "id",
      placeholder: "Seleccione un rol",
      className: classNames("w-100", {
        "p-invalid": errors.user_role_id
      })
    }, field)))
  }), getFormErrorMessage("user_role_id")), selectedRole && ["DOCTOR_ASSISTANT", "DOCTOR"].includes(selectedRole.group) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "user_specialty_id",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Especialidad", " ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(Dropdown, _extends({
      inputId: field.name,
      options: userSpecialties,
      optionLabel: "name",
      optionValue: "id",
      placeholder: "Seleccione una especialidad",
      className: classNames("w-100", {
        "p-invalid": errors.user_specialty_id
      })
    }, field)))
  }), getFormErrorMessage("user_specialty_id")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "clinical_record",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Registro medico", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      placeholder: "Registro medico",
      className: classNames("w-100", {
        "p-invalid": errors.clinical_record
      })
    }, field)))
  }), getFormErrorMessage("clinical_record")))))), !config?.credentials || config?.credentials?.visible && /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "username",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Username ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      placeholder: "Username",
      className: classNames("w-100", {
        "p-invalid": errors.username
      })
    }, field)))
  }), getFormErrorMessage("username")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "password",
    control: control,
    rules: {
      required: !initialData
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Contrase\xF1a ", !initialData && /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(Password, _extends({}, field, {
      header: passwordHeader,
      footer: passwordFooter,
      mediumLabel: "Medio",
      strongLabel: "Fuerte",
      weakLabel: "De\u0301bil",
      className: "w-100",
      inputClassName: "w-100",
      toggleMask: true,
      placeholder: initialData ? "Dejar en blanco para no cambiar" : ""
    })))
  }), getFormErrorMessage("password")))))));
};
export default UserForm;