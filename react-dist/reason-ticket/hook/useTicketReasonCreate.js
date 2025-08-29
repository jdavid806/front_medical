import { ticketService } from "../../../services/api/index.js";
export const useTicketReasonCreate = () => {
  const createTicketReason = async data => {
    try {
      await ticketService.createTicketReason(data);
    } catch (error) {
      console.error("Error creating ticket reason:", error);
    }
  };
  return {
    createTicketReason
  };
};