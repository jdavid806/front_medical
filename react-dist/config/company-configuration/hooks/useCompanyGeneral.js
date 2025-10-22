import { useState, useEffect } from "react";
import { companyService } from "../../../../services/api/index.js";
export const useCompanyGeneral = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await companyService.getAllCompanies();
      if (response.status === 200 && response.data && response.data.length > 0) {
        const companyData = response.data[0].attributes;
        const mappedCompany = {
          id: response.data[0].id,
          legal_name: companyData.legal_name,
          document_type: companyData.document_type,
          document_number: companyData.document_number,
          logo: companyData.logo,
          watermark: companyData.watermark,
          phone: companyData.phone,
          email: companyData.email,
          address: companyData.address,
          country: companyData.country,
          province: companyData.province,
          city: companyData.city,
          nit: companyData.nit,
          trade_name: companyData.trade_name,
          economic_activity: companyData.economic_activity,
          created_at: companyData.created_at,
          updated_at: companyData.updated_at
        };
        setCompany(mappedCompany);
      }
    } catch (err) {
      console.error("Error fetching company data:", err);
      setError("Error al cargar los datos de la compañía");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCompanyData();
  }, []);
  const refetch = () => {
    fetchCompanyData();
  };
  return {
    company,
    loading,
    error,
    refetch
  };
};