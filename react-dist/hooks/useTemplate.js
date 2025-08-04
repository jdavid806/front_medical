import { useState, useEffect } from 'react';
import { templateService } from "../../services/api/index.js";
export const useTemplate = data => {
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchTemplate = async () => {
    setLoading(true);
    try {
      const response = await templateService.getTemplate(data);
      setTemplate(response.data);
      return response.data;
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTemplate();
  }, []);
  return {
    template,
    setTemplate,
    fetchTemplate
  };
};