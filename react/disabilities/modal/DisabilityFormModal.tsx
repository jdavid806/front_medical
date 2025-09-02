import React, { useRef } from "react";
import { DisabilityForm } from "../form/DisabilityForm";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

interface FormModalProps {
  title: string;
  show: boolean;
  handleSubmit: (data: any) => void;
  initialData?: any;
  onHide?: () => void;
}

export const DisabilityFormModal: React.FC<FormModalProps> = ({
  title,
  show,
  handleSubmit,
  onHide,
  initialData,
}) => {

  const formId = "disabilityForm";
  const ref = useRef<any>(null);

  const reset = () => {
    ref.current?.resetForm();
  };

  return (
    <Dialog visible={show} onHide={onHide ?? (() => { })} header={title} style={{ width: '70vw' }}>
      <DisabilityForm
        onHandleSubmit={handleSubmit}
        initialData={initialData}
        ref={ref}
        formId={formId}
      ></DisabilityForm>
      <div className="d-flex justify-content-end mt-4">
        <Button
          label="Cancelar"
          icon="pi pi-times"
          type="button"
          className="p-button-text w-30"
          onClick={() => reset()}
        />
        <Button
          label={initialData?.isEditing ? "Actualizar" : "Guardar"}
          icon="pi pi-check"
          type="submit"
          className="w-30 ml-2"
          form={formId}
        />
      </div>
    </Dialog>
  );
};
