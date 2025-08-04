import { useState } from 'react';
import { ErrorHandler } from "../../../services/errorHandler.js";
import { getSupportingDocumentsPolicy } from "../../../services/koneksiService.js";
export const useSupportingDocumentsPolicy = () => {
  const [supportingDocuments, setSupportingDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchSupportingDocumentsPolicy = async ({
    preauthorizationId
  }) => {
    try {
      const data = await getSupportingDocumentsPolicy({
        preauthorizationId
      });
      setSupportingDocuments(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  return {
    supportingDocuments,
    fetchSupportingDocumentsPolicy,
    loading
  };
};