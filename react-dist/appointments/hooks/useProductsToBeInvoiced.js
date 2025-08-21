import { useState, useEffect } from 'react';
import { handleError } from "../../../services/utilidades";
import AppointmentService from "../../../services/api/classes/appointmentService";

export const useProductsToBeInvoiced = (appointmentId) => {
  const [state, setState] = useState({
    products: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchProducts = async () => {
      if (!appointmentId) {
        setState(prev => ({ ...prev, loading: false, products: [] }));
        return;
      }
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const service = new AppointmentService();
        const response = await service.getProductsToBeInvoiced(appointmentId, { signal });

        if (!signal.aborted) {
          setState({
            products: response || [],
            loading: false,
            error: null
          });
        }
      } catch (error) {
        if (!signal.aborted) {
          handleError(error);
          setState({
            products: [],
            loading: false,
            error: error.message
          });
        }
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [appointmentId]);

  return state;
};