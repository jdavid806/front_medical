import React from "react";
import { BrandForm } from "../form/BrandForm";
import { Dialog } from "primereact/dialog";

interface FormModalProps {
  title: string;
  show: boolean;
  handleSubmit: (data: any) => void;
  initialData?: any;
  onHide?: () => void;
}

export const BrandFormModal: React.FC<FormModalProps> = ({
  title,
  show,
  handleSubmit,
  onHide,
  initialData,
}) => {

  return (
    <Dialog visible={show} onHide={onHide ?? (() => {})} header={title} style={{ width: '70vw' }}>
      <BrandForm
        onHandleSubmit={handleSubmit}
        initialData={initialData}
      ></BrandForm>
    </Dialog>
  );
};
