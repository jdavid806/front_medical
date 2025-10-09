import { useState, useEffect } from 'react';
import { companyService } from "../../../../services/api/index.js";
import { SwalManager } from "../../../../services/alertManagerImported.js";
export const useCompanyCommunication = () => {
  const [company, setCompany] = useState(null);
  const [communication, setCommunication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const fetchCommunicationData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await companyService.getAllCompanies();
      if (response.status === 200 && response.data && response.data.length > 0) {
        const companyData = response.data[0];
        setCompany(companyData);
        if (companyData.includes && companyData.includes.communication) {
          const commData = companyData.includes.communication;
          const mappedCommunication = {
            id: commData.id,
            company_id: commData.company_id,
            smtp_server: commData.smtp_server,
            port: commData.port,
            security: commData.security,
            email: commData.email,
            password: commData.password,
            api_key: commData.api_key,
            instance: commData.instance,
            created_at: commData.created_at,
            updated_at: commData.updated_at
          };
          setCommunication(mappedCommunication);
        } else {
          setCommunication(null);
        }
      } else {
        setError('No se encontraron datos de la compañía');
      }
    } catch (err) {
      console.error('Error fetching communication data:', err);
      setError('Error al cargar los datos de comunicación');
    } finally {
      setLoading(false);
    }
  };
  const saveCommunication = async data => {
    // Usamos el company_id que viene en los datos de communication
    const companyId = company?.id;
    console.log('company', company);
    if (!companyId) {
      throw new Error('No se encontró company_id en la configuración');
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      let response;
      if (communication?.id) {
        console.log('Actualizando comunicación para companyId:', companyId);
        response = await companyService.updateCommunication(companyId, data);
        SwalManager.success('Configuración SMTP se actualizó correctamente');
      } else {
        console.log('Creando comunicación para companyId:', companyId);
        response = await companyService.createCommunication(companyId, data);
        SwalManager.success('Configuración SMTP se creó correctamente');
      }
      if (response.status === 200 || response.status === 201) {
        const savedData = response.data;
        const savedCommunication = {
          id: savedData.id,
          company_id: savedData.company_id,
          smtp_server: savedData.smtp_server,
          port: savedData.port,
          security: savedData.security,
          email: savedData.email,
          password: savedData.password,
          api_key: savedData.api_key,
          instance: savedData.instance,
          created_at: savedData.created_at,
          updated_at: savedData.updated_at
        };
        setCommunication(savedCommunication);
        return savedCommunication;
      }
    } catch (err) {
      console.error('Error saving communication:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar la configuración de comunicación';
      setSubmitError(errorMessage);
      SwalManager.error('Error al guardar la configuración SMTP');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    fetchCommunicationData();
  }, []);
  const refetch = () => {
    fetchCommunicationData();
  };
  return {
    communication,
    loading,
    error,
    isSubmitting,
    submitError,
    refetch,
    saveCommunication
  };
};