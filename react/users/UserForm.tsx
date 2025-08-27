import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { useCountries } from "../countries/hooks/useCountries";
import { genders } from "../../services/commons";
import { useRoles } from "../user-roles/hooks/useUserRoles";
import { useUserSpecialties } from "../user-specialties/hooks/useUserSpecialties";
import { Divider } from "primereact/divider";
import { Password } from "primereact/password";
import { useCitiesByCountry } from "../cities/hooks/useCitiesByCountry";
import { CountryDto } from "../models/models";
import { useRef } from "react";

export type UserFormInputs = {
  username: string;
  email: string;
  password: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  second_last_name: string;
  user_role_id: number;
  user_specialty_id: number;
  country_id: string;
  city_id: string;
  gender: string;
  address: string;
  phone: string;
  minio_id: string | null;
  minio_url: string | null;
  clinical_record: string | null;
};

export interface UserFormElementConfig {
  visible: boolean;
}

export interface UserFormConfig {
  username?: UserFormElementConfig;
  password?: UserFormElementConfig;
  credentials?: UserFormElementConfig;
}

interface UserFormProps {
  formId: string;
  onHandleSubmit: (data: UserFormInputs) => void;
  initialData?: UserFormInputs;
  config?: UserFormConfig;
}

const UserForm: React.FC<UserFormProps> = ({
  formId,
  onHandleSubmit,
  initialData,
  config,
}) => {
  const [profileUrl, setProfileUrl] = useState<string | null>(
    "../assets/img/profile/profile_default.jpg"
  );
  const videoRef = useRef<any | null>(null);
  const canvasRef = useRef<any | null>(null);
  const fileInputRef = useRef<any | null>(null);

  // Iniciar cámara
  const handleTakePhoto = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
    document
      .getElementById("camera")
      ?.parentElement?.classList.remove("d-none");
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

    canvas.toBlob((blob) => {
      const file = new File([blob], "photo.jpg", { type: "image/jpeg" });

      // Mostrar previsualización
      const url = URL.createObjectURL(file);
      setProfileUrl(url);

      // Asignar al input file para hook form
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = fileInputRef.current;
      input.files = dataTransfer.files;

      // Detener cámara
      video.srcObject.getTracks().forEach((track) => track.stop());

      // Ocultar cámara
      document.getElementById("camera")?.parentElement?.classList.add("d-none");
      document.getElementById("takePhoto")?.classList.remove("d-none");
      document.getElementById("capturePhoto")?.classList.add("d-none");
    }, "image/jpeg");
  };

  const [selectedRole, setSelectedRole] = useState<any>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    register,
    getValues,
  } = useForm<UserFormInputs>({
    defaultValues: initialData || {
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
    },
  });

  const onSubmit: SubmitHandler<UserFormInputs> = (data) =>
    onHandleSubmit(data);

  const getFormErrorMessage = (name: keyof UserFormInputs) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  const fetchCitiesByCountryName = (countryId: string) => {
    const country = countries.find(
      (country: CountryDto) => country.name === countryId
    );

    if (country) {
      fetchCities(country.id);
    }
  };

  useEffect(() => {
    reset(
      initialData || {
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
      }
    );
  }, [initialData, reset]);

  const { countries } = useCountries();
  const { cities, fetchCities, isInitialCitiesLoad, setIsInitialCitiesLoad } =
    useCitiesByCountry();
  const { userRoles } = useRoles();
  const { userSpecialties } = useUserSpecialties();
  const gendersForSelect = Object.entries(genders).map(([value, label]) => ({
    value,
    label,
  }));

  const watchUserRoleId = watch("user_role_id");
  const watchCountryId = watch("country_id");
  const watchMinioUrl = watch("minio_url");

  useEffect(() => {
    if (initialData && initialData.country_id) {
      fetchCitiesByCountryName(initialData.country_id);
    }
  }, [countries]);

  useEffect(() => {
    if (isInitialCitiesLoad && cities.length > 0 && initialData?.city_id) {

      setValue("city_id", initialData.city_id);
      setIsInitialCitiesLoad(false);
    }
  }, [cities, initialData, setValue, isInitialCitiesLoad]);

  useEffect(() => {
    if (watchUserRoleId) {
      const role = userRoles.find((role: any) => role.id === watchUserRoleId);
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

  const handleProfileUrl = async (minioUrl: string | null) => {
    //@ts-ignore
    const url = getUrlImage(minioUrl);
    setProfileUrl(url);
  };

  const passwordHeader = (
    <div className="font-bold mb-3">Escribe una contraseña</div>
  );
  const passwordFooter = (
    <>
      <Divider />
      <p className="mt-2">Sugerencias</p>
      <ul className="pl-2 ml-2 mt-0 line-height-3">
        <li>Al menos una minúscula</li>
        <li>Al menos una mayúscula</li>
        <li>Al menos un número</li>
        <li>Mínimo 8 caracteres</li>
      </ul>
    </>
  );

  return (
    <>
      <form id={formId} onSubmit={handleSubmit(onSubmit)}>
        <div className="card mb-2">
          <div className="card-body">
            <div className="row justify-content-center">
              <div className="col-md-6 text-center mb-3">
                <div className="position-relative d-flex justify-content-center">
                  <div className="profile-img-container">
                    <img
                      id="profilePreview"
                      src={
                        profileUrl ||
                        "../assets/img/profile/profile_default.jpg"
                      }
                      alt="Previsualización"
                      style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #ddd",
                      }}
                    />
                  </div>
                  <div className="video-container d-none">
                    <video id="camera" ref={videoRef} autoPlay></video>
                  </div>
                </div>

                <div className="mt-3 d-flex flex-column justify-content-center gap-2">
                  <label
                    htmlFor="uploadImageConfigUsers"
                    className="btn btn-primary align-self-center"
                  >
                    <i className="fa-solid fa-upload me-1"></i> Subir Imagen
                  </label>
                  <div
                    className="icon-container"
                    id="takePhoto"
                    onClick={handleTakePhoto}
                  >
                    <i className="fa-solid fa-camera fs-4"></i>
                  </div>
                  <div
                    className="icon-container d-none"
                    id="capturePhoto"
                    onClick={handleCapturePhoto}
                  >
                    <i className="fa-solid fa-check fs-4 text-success"></i>
                  </div>
                </div>

                <input
                  type="file"
                  id="uploadImageConfigUsers"
                  className="d-none"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setProfileUrl(URL.createObjectURL(file));
                    }
                  }}
                />
                <canvas ref={canvasRef} style={{ display: "none" }} />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-1">
                <Controller
                  name="first_name"
                  control={control}
                  rules={{ required: "Este campo es requerido" }}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        Primer nombre <span className="text-primary">*</span>
                      </label>
                      <InputText
                        id={field.name}
                        placeholder="Primer nombre"
                        className={classNames("w-100", {
                          "p-invalid": errors.first_name,
                        })}
                        {...field}
                      />
                    </>
                  )}
                />
                {getFormErrorMessage("first_name")}
              </div>
              <div className="col-md-6 mb-1">
                <Controller
                  name="middle_name"
                  control={control}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        Segundo nombre
                      </label>
                      <InputText
                        id={field.name}
                        placeholder="Segundo nombre"
                        className="w-100"
                        {...field}
                      />
                    </>
                  )}
                />
                {getFormErrorMessage("middle_name")}
              </div>
              <div className="col-md-6 mb-1">
                <Controller
                  name="last_name"
                  control={control}
                  rules={{ required: "Este campo es requerido" }}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        Primer apellido <span className="text-primary">*</span>
                      </label>
                      <InputText
                        id={field.name}
                        placeholder="Primer apellido"
                        className={classNames("w-100", {
                          "p-invalid": errors.last_name,
                        })}
                        {...field}
                      />
                    </>
                  )}
                />
                {getFormErrorMessage("last_name")}
              </div>
              <div className="col-md-6 mb-1">
                <Controller
                  name="second_last_name"
                  control={control}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        Segundo apellido
                      </label>
                      <InputText
                        id={field.name}
                        placeholder="Segundo apellido"
                        className="w-100"
                        {...field}
                      />
                    </>
                  )}
                />
                {getFormErrorMessage("second_last_name")}
              </div>
              <div className="col-md-6 mb-1">
                <Controller
                  name="country_id"
                  control={control}
                  rules={{ required: "Este campo es requerido" }}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        País <span className="text-primary">*</span>
                      </label>
                      <Dropdown
                        inputId={field.name}
                        filter
                        options={countries}
                        optionLabel="name"
                        optionValue="name"
                        placeholder="Seleccione un país"
                        className={classNames("w-100", {
                          "p-invalid": errors.country_id,
                        })}
                        {...field}
                      />
                    </>
                  )}
                />
                {getFormErrorMessage("country_id")}
              </div>
              <div className="col-md-6 mb-1">
                <Controller
                  name="city_id"
                  control={control}
                  rules={{ required: "Este campo es requerido" }}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        Ciudad <span className="text-primary">*</span>
                      </label>
                      <Dropdown
                        inputId={field.name}
                        filter
                        options={cities}
                        optionLabel="name"
                        optionValue="name"
                        placeholder="Seleccione una ciudad"
                        className={classNames("w-100", {
                          "p-invalid": errors.city_id,
                        })}
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                      />
                    </>
                  )}
                />
                {getFormErrorMessage("city_id")}
              </div>
              <div className="col-md-6 mb-1">
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: "Este campo es requerido" }}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        Género <span className="text-primary">*</span>
                      </label>
                      <Dropdown
                        inputId={field.name}
                        options={gendersForSelect}
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Seleccione un género"
                        className={classNames("w-100", {
                          "p-invalid": errors.gender,
                        })}
                        {...field}
                      />
                    </>
                  )}
                />
                {getFormErrorMessage("gender")}
              </div>
              <div className="col-md-6 mb-1">
                <Controller
                  name="address"
                  control={control}
                  rules={{ required: "Este campo es requerido" }}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        Dirección <span className="text-primary">*</span>
                      </label>
                      <InputText
                        id={field.name}
                        placeholder="Dirección"
                        className={classNames("w-100", {
                          "p-invalid": errors.address,
                        })}
                        {...field}
                      />
                    </>
                  )}
                />
                {getFormErrorMessage("address")}
              </div>
              <div className="col-md-6 mb-1">
                <Controller
                  name="phone"
                  control={control}
                  rules={{ required: "Este campo es requerido" }}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        Teléfono <span className="text-primary">*</span>
                      </label>
                      <InputText
                        id={field.name}
                        placeholder="Teléfono"
                        className={classNames("w-100", {
                          "p-invalid": errors.phone,
                        })}
                        {...field}
                      />
                    </>
                  )}
                />
                {getFormErrorMessage("phone")}
              </div>
              <div className="col-md-6 mb-1">
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Este campo es requerido",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Correo inválido",
                    },
                  }}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        Correo <span className="text-primary">*</span>
                      </label>
                      <InputText
                        id={field.name}
                        placeholder="Correo"
                        className={classNames("w-100", {
                          "p-invalid": errors.email,
                        })}
                        {...field}
                      />
                    </>
                  )}
                />
                {getFormErrorMessage("email")}
              </div>
            </div>
          </div>
        </div>
        <div className="card mb-2">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-1">
                <Controller
                  name="user_role_id"
                  control={control}
                  rules={{ required: "Este campo es requerido" }}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        Rol <span className="text-primary">*</span>
                      </label>
                      <Dropdown
                        inputId={field.name}
                        options={userRoles}
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Seleccione un rol"
                        className={classNames("w-100", {
                          "p-invalid": errors.user_role_id,
                        })}
                        {...field}
                      />
                    </>
                  )}
                />
                {getFormErrorMessage("user_role_id")}
              </div>
              {selectedRole &&
                ["DOCTOR_ASSISTANT", "DOCTOR"].includes(selectedRole.group) && (
                  <>
                    <div className="col-md-6 mb-1">
                      <Controller
                        name="user_specialty_id"
                        control={control}
                        rules={{ required: "Este campo es requerido" }}
                        render={({ field }) => (
                          <>
                            <label htmlFor={field.name} className="form-label">
                              Especialidad{" "}
                              <span className="text-primary">*</span>
                            </label>
                            <Dropdown
                              inputId={field.name}
                              options={userSpecialties}
                              optionLabel="name"
                              optionValue="id"
                              placeholder="Seleccione una especialidad"
                              className={classNames("w-100", {
                                "p-invalid": errors.user_specialty_id,
                              })}
                              {...field}
                            />
                          </>
                        )}
                      />
                      {getFormErrorMessage("user_specialty_id")}
                    </div>
                    <div className="col-md-6 mb-1">
                      <Controller
                        name="clinical_record"
                        control={control}
                        rules={{ required: "Este campo es requerido" }}
                        render={({ field }) => (
                          <>
                            <label htmlFor={field.name} className="form-label">
                              Registro medico
                              <span className="text-primary">*</span>
                            </label>
                            <InputText
                              id={field.name}
                              placeholder="Registro medico"
                              className={classNames("w-100", {
                                "p-invalid": errors.clinical_record,
                              })}
                              {...field}
                            />
                          </>
                        )}
                      />
                      {getFormErrorMessage("clinical_record")}
                    </div>
                  </>
                )}
            </div>
          </div>
        </div>
        {!config?.credentials ||
          (config?.credentials?.visible && (
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-1">
                    <Controller
                      name="username"
                      control={control}
                      rules={{ required: "Este campo es requerido" }}
                      render={({ field }) => (
                        <>
                          <label htmlFor={field.name} className="form-label">
                            Username <span className="text-primary">*</span>
                          </label>
                          <InputText
                            id={field.name}
                            placeholder="Username"
                            className={classNames("w-100", {
                              "p-invalid": errors.username,
                            })}
                            {...field}
                          />
                        </>
                      )}
                    />
                    {getFormErrorMessage("username")}
                  </div>
                  <div className="col-md-6 mb-1">
                    <Controller
                      name="password"
                      control={control}
                      rules={{ required: "Este campo es requerido" }}
                      render={({ field }) => (
                        <>
                          <label htmlFor={field.name} className="form-label">
                            Contraseña <span className="text-primary">*</span>
                          </label>
                          <Password
                            {...field}
                            header={passwordHeader}
                            footer={passwordFooter}
                            mediumLabel="Medio"
                            strongLabel="Fuerte"
                            weakLabel="Débil"
                            className="w-100"
                            inputClassName="w-100"
                            toggleMask
                          />
                        </>
                      )}
                    />
                    {getFormErrorMessage("password")}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </form>
    </>
  );
};

export default UserForm;
