import { useState, useEffect } from 'react';
import { ticketService } from "../../../services/api/index.js";
export const useTicketReasons = () => {
  const [ticketReasons, setTicketReasons] = useState([]);
  const fetchTicketReasons = async () => {
    try {
      const res = await ticketService.getAllTicketReasons();
      setTicketReasons(res.reasons);
    } catch (error) {
      console.error("Error fetching ticket reasons:", error);
    }
  };
  useEffect(() => {
    fetchTicketReasons();
  }, []);
  return {
    ticketReasons,
    fetchTicketReasons
  };
};