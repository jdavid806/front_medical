import React, { useState } from "react";
import {
  Button,
  Dropdown,
  InputText,
  InputTextarea,
  Calendar,
  FileUpload,
  InputNumber,
  Dialog,
} from "primereact";

interface FormData {
  tipo: string;
  clientes: string;
  realizarUn: string;
  origenDinero: string;
  numeroFactura: number;
  fechaElaboracion: Date | null;
  centroCosto: string;
  valorPagado: number;
  observaciones: string;
  archivo: File | null;
}

interface DropdownOption {
  label: string;
  value: string;
}

interface NewReceiptBoxModalProps {
  visible: boolean;
  onHide: () => void;
  onSubmit: (formData: FormData) => void;
  onSave?: (formData: FormData) => void;
  onSaveAndDownload?: (formData: FormData) => void;
}

export const NewReceiptBoxModal: React.FC<NewReceiptBoxModalProps> = ({
  visible,
  onHide,
  onSubmit,
  onSave,
  onSaveAndDownload,
}) => {
  const [formData, setFormData] = useState<FormData>({
    tipo: "",
    clientes: "",
    realizarUn: "",
    origenDinero: "",
    numeroFactura: 0,
    fechaElaboracion: null,
    centroCosto: "",
    valorPagado: 0,
    observaciones: "",
    archivo: null,
  });

  // Datos mock para los dropdowns
  const tipoOptions: DropdownOption[] = [
    { label: "Opción 1", value: "opcion1" },
    { label: "Opción 2", value: "opcion2" },
    { label: "Opción 3", value: "opcion3" },
  ];

  const clientesOptions: DropdownOption[] = [
    { label: "Cliente A", value: "clienteA" },
    { label: "Cliente B", value: "clienteB" },
    { label: "Cliente C", value: "clienteC" },
  ];

  const realizarUnOptions: DropdownOption[] = [
    { label: "Acción 1", value: "accion1" },
    { label: "Acción 2", value: "accion2" },
    { label: "Acción 3", value: "accion3" },
  ];

  const origenDineroOptions: DropdownOption[] = [
    { label: "Caja menor", value: "caja_menor" },
    { label: "Cuenta corriente", value: "cuenta_corriente" },
    { label: "Fondo de reserva", value: "fondo_reserva" },
  ];

  const centroCostoOptions: DropdownOption[] = [
    { label: "Administración", value: "admin" },
    { label: "Ventas", value: "ventas" },
    { label: "Producción", value: "produccion" },
  ];

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onDropdownChange = (e: { value: string }, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: e.value }));
  };

  const onDateChange = (e: { value: Date | Date[] | null }) => {
    if (e.value && !Array.isArray(e.value)) {
      setFormData((prev) => ({ ...prev, fechaElaboracion: e.value as Date }));
    }
  };

  const onNumberChange = (e: { value: number }, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: e.value }));
  };

  const onFileUpload = (e: { files: File[] }) => {
    setFormData((prev) => ({ ...prev, archivo: e.files[0] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
  };

  const handleSaveAndDownload = () => {
    if (onSaveAndDownload) {
      onSaveAndDownload(formData);
    }
  };

  return (
    <Dialog
      header="Nuevo recibo de Caja"
      visible={visible}
      style={{ width: "80vw" }}
      onHide={onHide}
      maximizable
      modal
      className="p-fluid"
    >
      <form onSubmit={handleSubmit}>
        <div className="row mb-4">
          {/* Columna izquierda */}
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="tipo" className="form-label">
                Tipo
              </label>
              <Dropdown
                id="tipo"
                value={formData.tipo}
                options={tipoOptions}
                onChange={(e) => onDropdownChange(e, "tipo")}
                placeholder="Seleccione..."
                className="w-100"
                filter
                showClear
              />
            </div>

            <div className="mb-3">
              <label htmlFor="clientes" className="form-label">
                Clientes
              </label>
              <Dropdown
                id="clientes"
                value={formData.clientes}
                options={clientesOptions}
                onChange={(e) => onDropdownChange(e, "clientes")}
                placeholder="Seleccione..."
                className="w-100"
                filter
                showClear
              />
            </div>

            <div className="mb-3">
              <label htmlFor="realizarUn" className="form-label">
                Realizar un
              </label>
              <Dropdown
                id="realizarUn"
                value={formData.realizarUn}
                options={realizarUnOptions}
                onChange={(e) => onDropdownChange(e, "realizarUn")}
                placeholder="Seleccione..."
                className="w-100"
                filter
                showClear
              />
            </div>

            <div className="mb-3">
              <label htmlFor="origenDinero" className="form-label">
                De donde ingresa el dinero
              </label>
              <Dropdown
                id="origenDinero"
                value={formData.origenDinero}
                options={origenDineroOptions}
                onChange={(e) => onDropdownChange(e, "origenDinero")}
                placeholder="Seleccione..."
                className="w-100"
                filter
                showClear
              />
            </div>
          </div>

          {/* Columna derecha */}
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="numeroFactura" className="form-label">
                Número de factura (Númeración automática)
              </label>
              <InputNumber
                id="numeroFactura"
                value={formData.numeroFactura}
                onValueChange={(e) => onNumberChange(e, "numeroFactura")}
                mode="decimal"
                className="w-100"
                disabled
              />
            </div>

            <div className="mb-3">
              <label htmlFor="fechaElaboracion" className="form-label">
                Fecha de elaboración
              </label>
              <Calendar
                id="fechaElaboracion"
                value={formData.fechaElaboracion}
                onChange={onDateChange}
                dateFormat="dd/mm/yy"
                className="w-100"
                showIcon
                placeholder="Seleccione la fecha"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="centroCosto" className="form-label">
                Centro de costo
              </label>
              <Dropdown
                id="centroCosto"
                value={formData.centroCosto}
                options={centroCostoOptions}
                onChange={(e) => onDropdownChange(e, "centroCosto")}
                placeholder="Seleccione..."
                className="w-100"
                filter
                showClear
              />
            </div>

            <div className="mb-3">
              <label htmlFor="valorPagado" className="form-label">
                Valor pagado
              </label>
              <InputNumber
                id="valorPagado"
                value={formData.valorPagado}
                onValueChange={(e) => onNumberChange(e, "valorPagado")}
                mode="currency"
                currency="USD"
                locale="en-US"
                className="w-100"
              />
            </div>
          </div>
        </div>

        {/* Observaciones y archivo */}
        <div className="row mb-4">
          <div className="col-12">
            <label htmlFor="observaciones" className="form-label">
              Observaciones
            </label>
            <InputTextarea
              id="observaciones"
              name="observaciones"
              value={formData.observaciones}
              onChange={onInputChange}
              rows={3}
              className="w-100"
              placeholder="Detalles adicionales..."
            />
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-12">
            <label className="form-label">Agregar archivo</label>
            <FileUpload
              mode="basic"
              name="archivo"
              accept="image/*,.pdf,.doc,.docx"
              maxFileSize={1000000}
              chooseLabel="Seleccionar archivo"
              className="w-100"
              onUpload={onFileUpload}
            />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-content-end gap-2">
          <Button
            label="Cancelar"
            icon="pi pi-times"
            className="p-button-secondary"
            onClick={onHide}
          />
          {onSaveAndDownload && (
            <Button
              label="Guardar y Descargar"
              icon="fa fa-plus"
              className="btn btn-phoenix-secondary"
              onClick={handleSaveAndDownload}
            />
          )}
          {onSave && (
            <Button
              label="Guardar"
              icon="fa fa-plus"
              className="p-button-success"
              onClick={handleSave}
            />
          )}
        </div>
      </form>
    </Dialog>
  );
};
