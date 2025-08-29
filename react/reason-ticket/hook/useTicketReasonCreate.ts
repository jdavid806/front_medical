import { ticketService } from '../../../services/api';
import { TicketReasonDto } from '../../models/models';

export const useTicketReasonCreate = () => {
  const createTicketReason = async (data: TicketReasonDto) => {
    try {
      await ticketService.createTicketReason(data);
    } catch (error) {
      console.error("Error creating ticket reason:", error);
    }
  };
  return { createTicketReason };
};
