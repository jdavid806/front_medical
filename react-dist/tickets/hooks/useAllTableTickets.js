import { useState, useEffect } from 'react';
import { ticketService } from "../../../services/api/index.js";
export const useAllTableTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await ticketService.getAllByReasons(["SPECIALIST", "VACCINATION", "ADMISSION_PRESCHEDULED", "CONSULTATION_GENERAL", "LABORATORY", "OTHER"]);
        console.log(data);
        setTickets(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);
  return {
    tickets,
    loading,
    error
  };
};