import { ticketService } from '../../../services/api';

export const useTicketReasonDelete = () => {
  const deleteTicketReason = async (id: string) => {
    try {
      await ticketService.deleteTicketReason(id);
      return true;
    } catch (error) {
      console.error("Error deleting ticket reason:", error);
      return false;
    }
  };
  return { deleteTicketReason };
};
