import React from "react";
import { CategoriesForm } from "../form/CategoriesForm";
import { Dialog } from "primereact/dialog";

interface FormModalProps {
  title: string;
  show: boolean;
  handleSubmit: (data: any) => void;
  initialData?: any;
  onHide?: () => void;
}

export const CategoriesFormModal: React.FC<FormModalProps> = ({
  title,
  show,
  handleSubmit,
  onHide,
  initialData,
}) => {

  return (
    <Dialog visible={show} onHide={onHide ?? (() => {})} header={title} style={{ width: '70vw' }}>
      <CategoriesForm
        onHandleSubmit={handleSubmit}
        initialData={initialData}
      ></CategoriesForm>
    </Dialog>
  );
};
