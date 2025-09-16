import React from "react";
import { BranchForm } from "../form/BranchForm";
import { Dialog } from "primereact/dialog";

interface FormModalProps {
  title: string;
  show: boolean;
  handleSubmit: (data: any) => void;
  initialData?: any;
  onHide?: () => void;
}

export const BranchFormModal: React.FC<FormModalProps> = ({
  title,
  show,
  handleSubmit,
  onHide,
  initialData,
}) => {

  return (
    <Dialog visible={show} onHide={onHide ?? (() => {})} header={title} style={{ width: '70vw' }}>
      <BranchForm
        onHandleSubmit={handleSubmit}
        initialData={initialData}
      ></BranchForm>
    </Dialog>
  );
};
