import { useState } from 'react';
import { ticketService } from '../../../services/api';
import { TicketReasonDto } from '../../models/models';

export const useTicketReason = () => {
  const [ticketReason, setTicketReason] = useState<TicketReasonDto | null>(null);

  const fetchTicketReason = async (id: string) => {
    try {
      const res = await ticketService.getTicketReason(id);
      setTicketReason(res);
    } catch (error) {
      console.error("Error fetching ticket reason:", error);
    }
  };

  return { ticketReason, fetchTicketReason };
};
