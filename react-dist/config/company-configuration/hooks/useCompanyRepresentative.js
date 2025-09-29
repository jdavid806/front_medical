import { useState, useEffect } from 'react';
import { companyService } from "../../../../services/api/index.js";
import { SwalManager } from "../../../../services/alertManagerImported.js";
export const useCompanyRepresentative = () => {
  const [representative, setRepresentative] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const fetchRepresentativeData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await companyService.getAllCompanies();
      if (response.status === 200 && response.data && response.data.length > 0) {
        const companyData = response.data[0];
        if (companyData.includes && companyData.includes.representative) {
          const repData = companyData.includes.representative;
          const mappedRepresentative = {
            id: repData.id,
            company_id: repData.company_id,
            name: repData.name,
            phone: repData.phone,
            email: repData.email,
            document_type: repData.document_type,
            document_number: repData.document_number
          };
          setRepresentative(mappedRepresentative);
        } else {
          setRepresentative(null);
        }
      } else {
        setError('No se encontraron datos de la compañía');
      }
    } catch (err) {
      console.error('Error fetching representative data:', err);
      setError('Error al cargar los datos del representante');
    } finally {
      setLoading(false);
    }
  };
  const saveRepresentative = async (companyId, data) => {
    if (!companyId) {
      throw new Error('companyId es requerido');
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      let response;
      if (data.id) {
        response = await companyService.updateRepresentative(companyId, data);
        SwalManager.success('Representante Legal se actualizo correctamente');
      } else {
        response = await companyService.createRepresentative(companyId, data);
        SwalManager.success('Representante Legal se Creo correctamente');
      }
      if (response.status === 200 || response.status === 201) {
        const savedData = response.data;
        const savedRepresentative = {
          id: savedData.id,
          company_id: savedData.company_id,
          name: savedData.name,
          phone: savedData.phone,
          email: savedData.email,
          document_type: savedData.document_type,
          document_number: savedData.document_number
        };
        setRepresentative(savedRepresentative);
        SwalManager.success('Representante Legal');
        return savedRepresentative;
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (err) {
      setSubmitError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    fetchRepresentativeData();
  }, []);
  const refetch = () => {
    fetchRepresentativeData();
  };
  return {
    representative,
    loading,
    error,
    isSubmitting,
    submitError,
    refetch,
    saveRepresentative
  };
};