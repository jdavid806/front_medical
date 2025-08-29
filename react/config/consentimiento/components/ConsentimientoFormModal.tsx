import React from "react";
import { ConsentimientoForm } from "./ConsentimientoForm";
import { Dialog } from "primereact/dialog";

interface FormModalProps {
  title: string;
  show: boolean;
  handleSubmit: (data: any) => void;
  initialData?: any;
  onHide?: () => void;
}

export const ConsentimientoFormModal: React.FC<FormModalProps> = ({
  title,
  show,
  handleSubmit,
  onHide,
  initialData,
}) => {

  return (
    <Dialog visible={show} onHide={onHide ?? (() => { })} header={title} style={{ width: '50rem' }}>
      <ConsentimientoForm
        onHandleSubmit={handleSubmit}
        initialData={initialData}
      ></ConsentimientoForm>
    </Dialog>
  );
};
