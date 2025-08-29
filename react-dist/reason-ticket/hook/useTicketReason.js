import { useState } from 'react';
import { ticketService } from "../../../services/api/index.js";
export const useTicketReason = () => {
  const [ticketReason, setTicketReason] = useState(null);
  const fetchTicketReason = async id => {
    try {
      const res = await ticketService.getTicketReason(id);
      setTicketReason(res);
    } catch (error) {
      console.error("Error fetching ticket reason:", error);
    }
  };
  return {
    ticketReason,
    fetchTicketReason
  };
};