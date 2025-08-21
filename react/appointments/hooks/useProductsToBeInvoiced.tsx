import { useState, useEffect } from 'react';
import { handleError } from '../../../services/utilidades';
import AppointmentService from '../../../services/api/classes/appointmentService';

export const useProductsToBeInvoiced = (appointmentId) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!appointmentId) return;
      
      try {
        setLoading(true);
        const appointmentService = new AppointmentService();
        const response = await appointmentService.getProductsToBeInvoiced(appointmentId);
        setProducts(response.data || []);
      } catch (error) {
        handleError(error);
        console.error('Error fetching products to be invoiced:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [appointmentId, handleError]);

  return { products, loading };
};