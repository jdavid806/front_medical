import React from "react";
import { ConsentimientoForm } from "../form/ConsentimientoForm";
import { Dialog } from "primereact/dialog";

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

  return (
    <Dialog visible={show} onHide={onHide ?? (() => {})} header={title} style={{ width: '70vw' }}>
      <DisabilityForm
        onHandleSubmit={handleSubmit}
        initialData={initialData}
      ></DisabilityForm>
    </Dialog>
  );
};
