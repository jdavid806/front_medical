import React, { useEffect, useState } from "react";
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
import { countryService, patientService } from "../../../services/api";
import { useDataPagination } from "../../hooks/useDataPagination";
import { CustomPRTable } from "../../components/CustomPRTable";
import { genders } from "../../../services/commons";

interface MassMessageFormProps {
  formId: string;
  onHandleSubmit: (data: any) => void;
  initialData?: any;
}

export const MassMessageForm: React.FC<MassMessageFormProps> = ({
  formId,
  onHandleSubmit,
  initialData,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    body: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedEmailFiles, setSelectedEmailFiles] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>(
    {}
  );
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>(
    {}
  );
  const [countries, setCountries] = useState<any[]>([]);
  const [selectedPatientsSegmentation, setSelectedPatientsSegmentation] =
    useState<any[]>([]);

  const { control, handleSubmit } = useForm();

  const fetchPatientsWithFilters = async (paginationParams: any) => {
    try {
      const { per_page, page, search, ...filters } = paginationParams;

      // Transformar los filtros al formato del backend
      const backendFilters = transformFiltersForBackend(selectedFilters);

      // Combinar parámetros de paginación con filtros
      const params = {
        per_page: 500,
        page,
        search,
        ...backendFilters,
      };

      const response = await patientService.getWithFilters(params);

      return {
        data: response.data || response, // Ajusta según la estructura de tu API
        total: response.total || response.count || 0,
      };
    } catch (error) {
      console.error("Error fetching patients:", error);
      return {
        data: [],
        total: 0,
      };
    }
  };

  const {
    data: patientsData,
    loading: loadingPatients,
    first,
    perPage,
    totalRecords,
    handlePageChange,
    handleSearchChange,
    refresh: refreshPatients,
  } = useDataPagination({
    fetchFunction: fetchPatientsWithFilters,
    defaultPerPage: 10,
    getCustomFilters: () => selectedFilters,
  });

  const bloodTypes = [
    { label: "Seleccione", value: "" },
    { label: "A+", value: "A_POSITIVE" },
    { label: "A-", value: "A_NEGATIVE" },
    { label: "B+", value: "B_POSITIVE" },
    { label: "B-", value: "B_NEGATIVE" },
    { label: "AB+", value: "AB_POSITIVE" },
    { label: "AB-", value: "AB_NEGATIVE" },
    { label: "O+", value: "O_POSITIVE" },
    { label: "O-", value: "O_NEGATIVE" },
  ];

  const marital_status = [
    { label: "Seleccione", value: "" },
    { label: "Soltero", value: "SINGLE" },
    { label: "Casado", value: "MARRIED" },
    { label: "Divorciado", value: "DIVORCED" },
    { label: "Viudo", value: "WIDOWED" },
  ];

  const steps = [
    { label: "Segmentación" },
    { label: "Pacientes" },
    { label: "Formato de envío" },
    { label: "Vista previa" },
  ];

  const appointmentCounts = [
    { label: "Seleccione", value: "" },
    { label: "1-3 citas", value: "1-3 citas" },
    { label: "4-6 citas", value: "4-6 citas" },
    { label: "7+ citas", value: "7+ citas" },
  ];

  const genderOptions = [
    { label: "Seleccione", value: "" },
    { label: "Masculino", value: "MALE" },
    { label: "Femenino", value: "FEMALE" },
    { label: "Otro", value: "OTHER" },
    { label: "Indeterminado", value: "INDETERMINATE" },
  ];

  const ageOptiones = [
    { label: "Seleccione", value: "" },
    { label: "18-25", value: "18-25" },
    { label: "26-35", value: "26-35" },
    { label: "36-45", value: "36-45" },
    { label: "46+", value: "46+" },
  ];

  const filterGroups = [
    { label: "Seleccione un filtro", value: null },
    { label: "De la A a la I grupo 1", value: "group1" },
    { label: "De la J a la M grupo 2", value: "group2" },
    { label: "De la N a la Z grupo 3", value: "group3" },
  ];

  const customFilters = [
    { label: "Seleccione un filtro", value: null },
    { label: "Filtro de prueba", value: "1" },
    { label: "Filtro de test", value: "2" },
  ];

  const sendMethods = [
    { label: "Seleccione una opción", value: "" },
    { label: "Whatsapp", value: "whatsapp" },
    { label: "Correo electrónico", value: "email" },
  ];

  const patientColumns = [
    {
      field: "name",
      header: "Nombre",
      body: (rowData: any) =>
        `${rowData.first_name ?? ""} ${rowData.middle_name ?? ""} ${
          rowData.last_name
        } ${rowData.second_last_name ?? ""}`,
    },
    {
      field: "email",
      header: "Email",
    },
    {
      field: "whatsapp",
      header: "Teléfono",
    },
    {
      field: "gender",
      header: "Género",
      body: (rowData: any) => {
        const genderKey = rowData.gender as keyof typeof genders;
        return genders[genderKey] || rowData.gender;
      },
    },
    {
      field: "age",
      header: "Edad",
    },
    {
      field: "country_id",
      header: "País",
    },
  ];

  const loadCountries = async () => {
    const response = await countryService.getAll();
    const responseMapped = response.data.map((country: any) => ({
      label: country.name,
      value: country,
    }));
    setCountries(responseMapped);
  };

  useEffect(() => {
    loadCountries();
  }, []);

  const handleFilterToggle = (filterType: string, checked: boolean) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterType]: checked,
    }));

    if (!checked) {
      // Si se desactiva el check, elimina el valor del filtro
      const newFilters = { ...selectedFilters };
      delete newFilters[filterType];
      setSelectedFilters(newFilters);
    } else {
      // Si se activa el check, inicializa con valor vacío
      setSelectedFilters((prev) => ({ ...prev, [filterType]: "" }));
    }
  };

  const handleFilterSelection = (filterType: string, value: any) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleWhatsappFileUpload = (e: any) => {
    const file = e.files[0];
    setSelectedFile(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmailFileUpload = (e: any) => {
    setSelectedEmailFiles(e.files);
  };

  const nextStep = () => {
    if (activeIndex < steps.length - 1) {
      // Si vamos al paso 2 (índice 1), ejecutar la función
      if (activeIndex === 0) {
        handlePatientsSegmentation(); // Esta función se ejecutará al pasar del paso 1 al 2
      }
      setActiveIndex(activeIndex + 1);
    }
  };

  const prevStep = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const handlePatientsSegmentation = async () => {
    await refreshPatients();
  };

  const transformFiltersForBackend = (filters: Record<string, any>) => {
    const transformed: any = {};

    // Rango de edad
    if (filters["age"]) {
      transformed.age = filters["age"];
    }

    if (filters["gender"]) {
      transformed.gender = [filters["gender"]];
    }

    if (filters["country"]) {
      transformed.country = [filters["country"].name];
    }

    if (
      filters["clinical_record_dates"] &&
      filters["clinical_record_dates"].startDate &&
      filters["clinical_record_dates"].endDate
    ) {
      transformed.last_clinical_record = {
        from: new Date(filters["clinical_record_dates"].startDate)
          .toISOString()
          .split("T")[0],
        to: new Date(filters["clinical_record_dates"].endDate)
          .toISOString()
          .split("T")[0],
      };
    }

    if (
      filters["appointments_date"] &&
      filters["appointments_date"].startDate &&
      filters["appointments_date"].endDate
    ) {
      transformed.date_appointment = {
        from: new Date(filters["appointments_date"].startDate)
          .toISOString()
          .split("T")[0],
        to: new Date(filters["appointments_date"].endDate)
          .toISOString()
          .split("T")[0],
      };
    }

    if (filters["marital_status"]) {
      transformed.marital_status = [filters["marital_status"]];
    }

    if (filters["blood_type"]) {
      transformed.blood_type = [filters["blood_type"]];
    }

    if (filters["appointments_count"]) {
      transformed.appointments_count = filters["appointments_count"];
    }

    return transformed;
  };

  const onSubmit = (data: any) => {
    const formData = {
      ...data,
      method: selectedMethod,
      whatsapp: {
        message: whatsappMessage,
        file: selectedFile,
      },
      email: {
        ...emailData,
        attachments: selectedEmailFiles,
      },
      filters: selectedFilters,
    };

    console.log("Form Data Submitted:", formData);

    // onHandleSubmit(formData);
  };

  return (
    <div className="container-fluid p-3">
      {/* Stepper de PrimeReact */}
      <Steps
        model={steps}
        activeIndex={activeIndex}
        className="mb-4"
        readOnly
      />

      <form id={formId} onSubmit={handleSubmit(onSubmit)}>
        {/* Paso 1: Segmentación */}
        <div className={classNames({ "d-none": activeIndex !== 0 })}>
          <div className="mb-3">
            <label className="form-label">Filtro [A-Z]</label>
            <Controller
              name="filterGroups"
              control={control}
              render={({ field }) => (
                <Dropdown
                  {...field}
                  options={filterGroups}
                  placeholder="Seleccione un filtro"
                  className="w-100"
                />
              )}
            />
          </div>

          {/* <div className="mb-3">
            <label className="form-label">Filtros personalizados</label>
            <Controller
              name="filterCustom"
              control={control}
              render={({ field }) => (
                <Dropdown
                  {...field}
                  options={customFilters}
                  placeholder="Seleccione un filtro"
                  className="w-100"
                />
              )}
            />
          </div> */}
          <div className="mb-3">
            <a
              href="#"
              className="text-decoration-none"
              onClick={(e) => {
                e.preventDefault();
                setShowFilters(!showFilters);
              }}
            >
              Configurar filtros de cliente
            </a>

            {showFilters && (
              <div className="mt-2 p-3 border rounded">
                {/* Filtro Rango de edad */}
                <div className="mb-2">
                  <Checkbox
                    inputId="rango-edad"
                    onChange={(e) =>
                      handleFilterToggle("age", e.checked || false)
                    }
                    checked={!!activeFilters["age"]}
                    className="me-2"
                  />
                  <label htmlFor="rango-edad">Rango de edad</label>

                  {selectedFilters["age"] !== undefined && (
                    <Dropdown
                      value={selectedFilters["age"]}
                      options={ageOptiones}
                      placeholder="Seleccione rango de edad"
                      className="w-100 mt-1"
                      onChange={(e) => handleFilterSelection("age", e.value)}
                    />
                  )}
                </div>

                {/* Filtro Sexo */}
                <div className="mb-2">
                  <Checkbox
                    inputId="sexo"
                    onChange={(e) =>
                      handleFilterToggle("gender", e.checked || false)
                    }
                    checked={!!activeFilters["gender"]}
                    className="me-2"
                  />
                  <label htmlFor="gender">Sexo</label>

                  {selectedFilters["gender"] !== undefined && (
                    <Dropdown
                      value={selectedFilters["gender"]}
                      options={genderOptions}
                      placeholder="Seleccione sexo"
                      className="w-100 mt-1"
                      onChange={(e) => handleFilterSelection("gender", e.value)}
                    />
                  )}
                </div>

                {/* Filtro Pais */}
                <div className="mb-2">
                  <Checkbox
                    inputId="pais"
                    onChange={(e) =>
                      handleFilterToggle("country", e.checked || false)
                    }
                    checked={!!activeFilters["country"]}
                    className="me-2"
                  />
                  <label htmlFor="country">Pais</label>

                  {selectedFilters["country"] !== undefined && (
                    <Dropdown
                      value={selectedFilters["country"]}
                      options={countries}
                      placeholder="Seleccione Pais"
                      className="w-100 mt-1"
                      onChange={(e) => {
                        handleFilterSelection("country", e.value);
                      }}
                      filter
                    />
                  )}
                </div>

                {/* Filtro Última consulta */}
                <div className="mb-2">
                  <Checkbox
                    inputId="ultima-consulta"
                    onChange={(e) =>
                      handleFilterToggle(
                        "clinical_record_dates",
                        e.checked || false
                      )
                    }
                    checked={!!activeFilters["clinical_record_dates"]}
                    className="me-2"
                  />
                  <label htmlFor="ultima-consulta">Consultas desde</label>

                  {selectedFilters["clinical_record_dates"] !== undefined && (
                    <div className="row">
                      <div className="col-md-6">
                        <label className="form-label small">Fecha inicio</label>
                        <Calendar
                          value={
                            selectedFilters["clinical_record_dates"]?.startDate
                              ? new Date(
                                  selectedFilters[
                                    "clinical_record_dates"
                                  ].startDate
                                )
                              : null
                          }
                          onChange={(e) => {
                            handleFilterSelection("clinical_record_dates", {
                              ...selectedFilters["clinical_record_dates"],
                              startDate: e.value ? e.value.toISOString() : "",
                            });
                          }}
                          placeholder="Fecha inicio"
                          className="w-100"
                          dateFormat="dd/mm/yy"
                          showIcon
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small">Fecha fin</label>
                        <Calendar
                          value={
                            selectedFilters["clinical_record_dates"]?.endDate
                              ? new Date(
                                  selectedFilters[
                                    "clinical_record_dates"
                                  ].endDate
                                )
                              : null
                          }
                          onChange={(e) => {
                            handleFilterSelection("clinical_record_dates", {
                              ...selectedFilters["clinical_record_dates"],
                              endDate: e.value ? e.value.toISOString() : "",
                            });
                          }}
                          placeholder="Fecha fin"
                          className="w-100"
                          dateFormat="dd/mm/yy"
                          showIcon
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Filtro Citas */}
                <div className="mb-2">
                  <Checkbox
                    inputId="citas"
                    onChange={(e) =>
                      handleFilterToggle(
                        "appointments_count",
                        e.checked || false
                      )
                    }
                    checked={!!activeFilters["appointments_count"]}
                    className="me-2"
                  />
                  <label htmlFor="appointments_count">Citas</label>

                  {selectedFilters["appointments_count"] !== undefined && (
                    <Dropdown
                      value={selectedFilters["appointments_count"]}
                      options={appointmentCounts}
                      placeholder="Seleccione citas"
                      className="w-100 mt-1"
                      onChange={(e) =>
                        handleFilterSelection("appointments_count", e.value)
                      }
                    />
                  )}
                </div>

                {/* Filtro Citas desde */}
                <div className="mb-2">
                  <Checkbox
                    inputId="citas-desde"
                    onChange={(e) =>
                      handleFilterToggle(
                        "appointments_date",
                        e.checked || false
                      )
                    }
                    checked={!!activeFilters["appointments_date"]}
                    className="me-2"
                  />
                  <label htmlFor="citas-desde">Citas desde</label>

                  {activeFilters["appointments_date"] && (
                    <div className="row">
                      <div className="col-md-6">
                        <label className="form-label small">Fecha inicio</label>
                        <Calendar
                          value={
                            selectedFilters["appointments_date"]?.startDate
                              ? new Date(
                                  selectedFilters["appointments_date"].startDate
                                )
                              : null
                          }
                          onChange={(e) => {
                            handleFilterSelection("appointments_date", {
                              ...selectedFilters["appointments_date"],
                              startDate: e.value ? e.value.toISOString() : "",
                            });
                          }}
                          placeholder="Fecha inicio"
                          className="w-100"
                          dateFormat="dd/mm/yy"
                          showIcon={true}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small">Fecha fin</label>
                        <Calendar
                          value={
                            selectedFilters["appointments_date"]?.endDate
                              ? new Date(
                                  selectedFilters["appointments_date"].endDate
                                )
                              : null
                          }
                          onChange={(e) => {
                            handleFilterSelection("appointments_date", {
                              ...selectedFilters["appointments_date"],
                              endDate: e.value ? e.value.toISOString() : "",
                            });
                          }}
                          placeholder="Fecha fin"
                          className="w-100"
                          dateFormat="dd/mm/yy"
                          showIcon
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Filtro Estado civil */}
                <div className="mb-2">
                  <Checkbox
                    inputId="estado-civil"
                    onChange={(e) =>
                      handleFilterToggle("marital_status", e.checked || false)
                    }
                    checked={!!activeFilters["marital_status"]}
                    className="me-2"
                  />
                  <label htmlFor="estado-civil">Estado civil</label>

                  {selectedFilters["marital_status"] !== undefined && (
                    <Dropdown
                      value={selectedFilters["marital_status"]}
                      options={marital_status}
                      placeholder="Seleccione estado civil"
                      className="w-100 mt-1"
                      onChange={(e) =>
                        handleFilterSelection("marital_status", e.value)
                      }
                    />
                  )}
                </div>

                {/* Filtro Grupo sanguíneo */}
                <div className="mb-2">
                  <Checkbox
                    inputId="grupo-sanguineo"
                    onChange={(e) =>
                      handleFilterToggle("blood_type", e.checked || false)
                    }
                    checked={!!activeFilters["blood_type"]}
                    className="me-2"
                  />
                  <label htmlFor="grupo-sanguineo">grupo sanguineo</label>

                  {selectedFilters["blood_type"] !== undefined && (
                    <Dropdown
                      value={selectedFilters["blood_type"]}
                      options={bloodTypes}
                      placeholder="Seleccione grupo sanguineo"
                      className="w-100 mt-1"
                      onChange={(e) =>
                        handleFilterSelection("blood_type", e.value)
                      }
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Paso 2: Pacientes */}
        <div className={classNames({ "d-none": activeIndex !== 1 })}>
          <Card title="Pacientes Segmentados" className="shadow-2">
            <CustomPRTable
              columns={patientColumns}
              data={patientsData}
              lazy
              first={first}
              rows={perPage}
              totalRecords={totalRecords}
              loading={loadingPatients}
              onPage={handlePageChange}
              onSearch={handleSearchChange}
              onReload={refreshPatients}
            />
          </Card>
        </div>

        {/* Paso 3: Formato de envío */}
        <div className={classNames({ "d-none": activeIndex !== 2 })}>
          <div className="mb-3">
            <label className="form-label">Selecciona el método de envío:</label>
            <Dropdown
              value={selectedMethod}
              options={sendMethods}
              onChange={(e) => setSelectedMethod(e.value)}
              className="w-100"
              required
            />
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Fecha de envío</label>
              <Calendar className="w-100" dateFormat="dd/mm/yy" showIcon />
            </div>
            <div className="col-md-6">
              <label className="form-label">Hora de envío</label>
              <Calendar className="w-100" timeOnly showIcon />
            </div>
          </div>

          {selectedMethod === "whatsapp" && (
            <div className="mb-3">
              <h4>Enviar por Whatsapp</h4>
              <label className="form-label">Mensaje:</label>
              <InputTextarea
                value={whatsappMessage}
                onChange={(e) => setWhatsappMessage(e.target.value)}
                rows={4}
                className="w-100 mb-2"
                required
              />

              <label className="form-label">Adjuntar archivo:</label>
              <FileUpload
                mode="basic"
                name="whatsappFile"
                accept="image/*"
                maxFileSize={1000000}
                chooseLabel="Seleccionar archivo"
                onSelect={handleWhatsappFileUpload}
                className="w-100"
              />
            </div>
          )}

          {selectedMethod === "email" && (
            <div className="mb-3">
              <h4>Enviar por Correo Electrónico</h4>
              <label className="form-label">Para:</label>
              <InputText
                type="email"
                value={emailData.to}
                onChange={(e) =>
                  setEmailData({ ...emailData, to: e.target.value })
                }
                className="w-100 mb-2"
                required
              />

              <label className="form-label">Asunto:</label>
              <InputText
                value={emailData.subject}
                onChange={(e) =>
                  setEmailData({ ...emailData, subject: e.target.value })
                }
                className="w-100 mb-2"
                required
              />

              <label className="form-label">Mensaje:</label>
              <InputTextarea
                value={emailData.body}
                onChange={(e) =>
                  setEmailData({ ...emailData, body: e.target.value })
                }
                rows={6}
                className="w-100 mb-2"
                required
              />

              <label className="form-label">Adjuntar archivos:</label>
              <FileUpload
                mode="basic"
                name="emailAttachments"
                multiple
                accept="image/*"
                maxFileSize={1000000}
                chooseLabel="Seleccionar archivos"
                onSelect={handleEmailFileUpload}
                className="w-100"
              />
            </div>
          )}
        </div>

        {/* Paso 3: Vista previa */}
        <div className={classNames({ "d-none": activeIndex !== 3 })}>
          {selectedMethod === "whatsapp" && (
            <div className="d-flex justify-content-center">
              <Card className="p-2 w-75">
                {previewImage && (
                  <div className="mb-3 text-center">
                    <img
                      src={previewImage}
                      alt="Imagen adjunta"
                      className="img-fluid rounded cursor-pointer"
                      style={{ maxHeight: "300px" }}
                      onClick={() => setShowImageModal(true)}
                    />
                  </div>
                )}
                <div className="p-3 border rounded bg-light">
                  {whatsappMessage || "Sin mensaje"}
                </div>
              </Card>
            </div>
          )}

          {selectedMethod === "email" && (
            <div className="d-flex justify-content-center">
              <Card className="p-3 w-75">
                <h3>Vista Previa del Correo</h3>
                <div className="mb-2">
                  <strong>Para:</strong>{" "}
                  <span>{emailData.to || "Sin destinatario"}</span>
                </div>
                <div className="mb-2">
                  <strong>Asunto:</strong>{" "}
                  <span>{emailData.subject || "Sin asunto"}</span>
                </div>
                <div className="p-3 border rounded bg-light mb-3">
                  {emailData.body || "Sin mensaje"}
                </div>

                {selectedEmailFiles.length > 0 && (
                  <div>
                    <h5>Archivos Adjuntos:</h5>
                    <ul className="list-unstyled">
                      {selectedEmailFiles.map((file, index) => (
                        <li key={index} className="mb-1">
                          <i className="pi pi-file me-2"></i>
                          {file.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>

        <div className="d-flex justify-content-between mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={prevStep}
            disabled={activeIndex === 0}
          >
            <i className="pi pi-chevron-left me-2"></i>
            Anterior
          </button>

          {activeIndex < steps.length - 1 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={nextStep}
            >
              Siguiente
              <i className="pi pi-chevron-right ms-2"></i>
            </button>
          ) : (
            <button type="submit" className="btn btn-success">
              <i className="pi pi-check me-2"></i>
              Finalizar
            </button>
          )}
        </div>
      </form>

      <Dialog
        visible={showImageModal}
        onHide={() => setShowImageModal(false)}
        header="Vista previa de la imagen"
        style={{ width: "50vw" }}
        className="bootstrap-dialog"
      >
        <img
          src={previewImage}
          alt="Imagen adjunta"
          className="img-fluid rounded"
        />
      </Dialog>
    </div>
  );
};
