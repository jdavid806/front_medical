import { ticketService } from "../../../services/api/index.js";
export const useTicketReasonUpdate = () => {
  const updateTicketReason = async (id, data) => {
    try {
      await ticketService.updateTicketReason(id, data);
    } catch (error) {
      console.error("Error updating ticket reason:", error);
    }
  };
  return {
    updateTicketReason
  };
};