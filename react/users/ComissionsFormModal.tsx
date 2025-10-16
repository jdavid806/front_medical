import React from "react";
import { ComissionForm, UserComissionsFormInputs } from "./Comissions";
import { Dialog } from "primereact/dialog";

interface ComissionFormModalProps {
  title: string;
  show: boolean;
  handleSubmit: (data: UserComissionsFormInputs) => void;
  initialData?: UserComissionsFormInputs;
  onHide?: () => void;
}

export const ComissionFormModal: React.FC<ComissionFormModalProps> = ({
  title,
  show,
  handleSubmit,
  onHide,
  initialData,
}) => {
  const formId = "createDoctor";

  const footer = (
    <>
      <button
        className="btn btn-link text-danger px-3 my-0"
        aria-label="Close"
        onClick={onHide}
      >
        <i className="fas fa-arrow-left"></i> Cerrar
      </button>
      <button type="submit" form={formId} className="btn btn-primary my-0">
        <i className="fas fa-bookmark"></i> Guardar
      </button>
    </>
  );

  return (
    <Dialog
      visible={show}
      onHide={() => { onHide?.() }}
      header={title}
      footer={footer}
      style={{ width: "80vw", height: "75%", maxHeight: "90%" }}
    >
      <ComissionForm
        formId={formId}
        onHandleSubmit={handleSubmit}
        initialData={initialData}
      ></ComissionForm>
    </Dialog>
  );
};