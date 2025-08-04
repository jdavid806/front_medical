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
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string>
  >({});

  const { control, handleSubmit } = useForm();

  const filterOptions = {
    "Rango de edad": ["18-25", "26-35", "36-45", "46+"],
    Sexo: ["Masculino", "Femenino", "Otro"],
    Pais: ["Colombia", "México", "Argentina", "España"],
    "Última consulta": ["Última semana", "Último mes", "Últimos 6 meses"],
    Citas: ["1-3 citas", "4-6 citas", "7+ citas"],
    "Citas desde": ["Última semana", "Último mes", "Último año"],
    "Estado civil": ["Soltero", "Casado", "Divorciado", "Viudo"],
    "Grupo sanguíneo": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  };

  const steps = [
    { label: "Segmentación" },
    { label: "Formato de envío" },
    { label: "Vista previa" },
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

  const handleFilterToggle = (filterType: string, checked: boolean) => {
    if (checked) {
      setSelectedFilters((prev) => ({ ...prev, [filterType]: "" }));
    } else {
      const newFilters = { ...selectedFilters };
      delete newFilters[filterType];
      setSelectedFilters(newFilters);
    }
  };

  const handleFilterSelection = (filterType: string, value: string) => {
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
      setActiveIndex(activeIndex + 1);
    }
  };

  const prevStep = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
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

          <div className="mb-3">
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
          </div>

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
                {Object.keys(filterOptions).map((filterType) => (
                  <div key={filterType} className="mb-2">
                    <Checkbox
                      inputId={filterType}
                      onChange={(e) =>
                        handleFilterToggle(filterType, e.checked || false)
                      }
                      checked={!!selectedFilters[filterType]}
                      className="me-2"
                    />
                    <label htmlFor={filterType}>
                      {filterType.replace("-", " ")}
                    </label>

                    {selectedFilters[filterType] !== undefined && (
                      <Dropdown
                        value={selectedFilters[filterType]}
                        options={[
                          { label: "Seleccione", value: "" },
                          ...filterOptions[filterType].map((opt) => ({
                            label: opt,
                            value: opt,
                          })),
                        ]}
                        placeholder={`Seleccione ${filterType}`}
                        className="w-100 mt-1"
                        onChange={(e) =>
                          handleFilterSelection(filterType, e.value)
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Paso 2: Formato de envío */}
        <div className={classNames({ "d-none": activeIndex !== 1 })}>
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
        <div className={classNames({ "d-none": activeIndex !== 2 })}>
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
