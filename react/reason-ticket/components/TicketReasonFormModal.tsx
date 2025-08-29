import React from 'react';
import { CustomFormModal } from '../../components/CustomFormModal';
import { TicketReasonForm, TicketReasonFormInputs } from './TicketReasonForm';

interface TicketReasonFormModalProps {
  title?: string;
  show: boolean;
  handleSubmit: (data: TicketReasonFormInputs) => void;
  initialData?: TicketReasonFormInputs;
  onHide?: () => void;
}

export const TicketReasonFormModal: React.FC<TicketReasonFormModalProps> = ({ title = 'Crear motivo de consulta', show, handleSubmit, onHide, initialData }) => {
  const formId = 'ticketReasonForm';

  return (
    <CustomFormModal show={show} onHide={onHide} formId={formId} title={title} scrollable={true}>
      <TicketReasonForm formId={formId} onHandleSubmit={handleSubmit} initialData={initialData} />
    </CustomFormModal>
  );
};
