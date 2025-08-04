import React from "react";
import { ComissionForm, UserComissionsFormInputs } from "./Comissions";
import { CustomFormModal } from "../components/CustomFormModal";

interface UserFormModalProps {
  title: string;
  show: boolean;
  handleSubmit: (data: UserComissionsFormInputs) => void;
  initialData?: UserComissionsFormInputs;
  onHide?: () => void;
}

export const ComissionFormModal: React.FC<UserFormModalProps> = ({
  title,
  show,
  handleSubmit,
  onHide,
  initialData,
}) => {
  const formId = "createDoctor";

  return (
    <CustomFormModal show={show} formId={formId} onHide={onHide} title={title}>
      <ComissionForm
        formId={formId}
        onHandleSubmit={handleSubmit}
        initialData={initialData}
      ></ComissionForm>
    </CustomFormModal>
  );
};
