import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";

interface NoteModalProps {
  visible: boolean;
  onHide: () => void;
  onSubmit: (data: any) => void;
  factura: any | null;
  tipo: "debito" | "credito";
}

export const NewNoteModal: React.FC<NoteModalProps> = ({
  visible,
  onHide,
  onSubmit,
  factura,
  tipo,
}) => {
  const [numeroNota, setNumeroNota] = useState("");
  const [comprobanteFiscal, setComprobanteFiscal] = useState("");
  const [monto, setMonto] = useState<number>(0);
  const [motivo, setMotivo] = useState("");

  // impuesto y retención ahora son valores directos del usuario
  const [impuesto, setImpuesto] = useState<number>(0);
  const [retencion, setRetencion] = useState<number>(0);

  // subtotal calculado
  const subtotal = monto + impuesto - retencion;

  const handleSave = () => {
    onSubmit({
      invoice_id: factura?.id,
      note_code: numeroNota,
      resolution_number: comprobanteFiscal,
      amount: monto,
      tax: impuesto,
      withholding: retencion,
      subtotal,
      reason: motivo,
      type: tipo === "credito" ? "credit" : "debit",
    });
    onHide();
  };

  return (
    <Dialog
      header={`Generar Nota ${tipo === "debito" ? "Débito" : "Crédito"}`}
      visible={visible}
      style={{ width: "500px" }}
      modal
      onHide={onHide}
    >
      <div className="p-fluid">
        {/* Número de la nota */}
        <div className="field">
          <label># de la nota</label>
          <InputText value={numeroNota} onChange={(e) => setNumeroNota(e.target.value)} />
        </div>

        {/* Comprobante Fiscal */}
        <div className="field">
          <label>Comprobante Fiscal</label>
          <InputText value={comprobanteFiscal} onChange={(e) => setComprobanteFiscal(e.target.value)} />
        </div>

        {/* Monto de la nota */}
        <div className="field">
          <label>Monto de la nota</label>
          <InputText
            keyfilter="num"
            value={monto.toString()}
            onChange={(e) => setMonto(Number(e.target.value))}
          />
        </div>

        {/* Impuesto */}
        <div className="field">
          <label>Impuesto</label>
          <InputText
            keyfilter="num"
            value={impuesto.toString()}
            onChange={(e) => setImpuesto(Number(e.target.value))}
          />
        </div>

        {/* Retención */}
        <div className="field">
          <label>Retención</label>
          <InputText
            keyfilter="num"
            value={retencion.toString()}
            onChange={(e) => setRetencion(Number(e.target.value))}
          />
        </div>

        {/* Subtotal */}
        <div className="field">
          <label>Subtotal</label>
          <InputText value={subtotal.toFixed(2)} disabled />
        </div>

        {/* Resumen factura */}
        <div className="field">
          {factura && (
            <small>
              Factura actual: <b>{factura.monto}</b> → después:{" "}
              <b>
                {tipo === "credito"
                  ? factura.monto - monto
                  : factura.monto + monto}
              </b>
            </small>
          )}
        </div>

        {/* Motivo */}
        <div className="field">
          <label>Motivo</label>
          <InputTextarea
            rows={3}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
        </div>

        {/* Botones */}
        <div className="flex justify-content-end gap-2 mt-3">
          <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={onHide} />
          <Button label="Guardar" icon="pi pi-check" className="p-button-primary" disabled={!numeroNota || !comprobanteFiscal || !monto } onClick={handleSave} />
        </div>
      </div>
    </Dialog>
  );
};
