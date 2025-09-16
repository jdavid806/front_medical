import { useState, useEffect } from "react";
import { infoCompanyService } from "../../services/api/index.js";
export const useCompany = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchCompany = async () => {
    setLoading(true);
    try {
      const response = await infoCompanyService.getCompany();
      setCompany({
        address: response.data[0].attributes.address,
        city: response.data[0].attributes.city,
        country: response.data[0].attributes.country,
        created_at: response.data[0].attributes.created_at,
        document_number: response.data[0].attributes.document_number,
        document_type: response.data[0].attributes.document_type,
        economic_activity: response.data[0].attributes.economic_activity,
        email: response.data[0].attributes.email,
        legal_name: response.data[0].attributes.legal_name,
        //@ts-ignore
        logo: await getUrlImage(response.data[0].attributes.logo.replaceAll("\\", "/"), true),
        nit: response.data[0].attributes.nit,
        phone: response.data[0].attributes.phone,
        province: response.data[0].attributes.province,
        trade_name: response.data[0].attributes.trade_name,
        updated_at: response.data[0].attributes.update_at,
        //@ts-ignore
        watermark: await getUrlImage(response.data[0].attributes.watermark.replaceAll("\\", "/"), true),
        id: response.data[0].id
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCompany();
  }, []);
  return {
    company,
    setCompany,
    fetchCompany
  };
};