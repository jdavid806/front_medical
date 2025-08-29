import { ticketService } from '../../../services/api';
import { TicketReasonDto } from '../../models/models';

export const useTicketReasonUpdate = () => {
  const updateTicketReason = async (id: string, data: TicketReasonDto) => {
    try {
      await ticketService.updateTicketReason(id, data);
    } catch (error) {
      console.error("Error updating ticket reason:", error);
    }
  };
  return { updateTicketReason };
};
