import { useState, useEffect } from 'react';
export const useTabValidation = company => {
  const [validations, setValidations] = useState({
    generalInfo: false,
    representative: false,
    branches: false
  });
  useEffect(() => {
    if (company) {
      const hasGeneralInfo = Boolean(company.legal_name && company.document_type && company.document_number && company.phone && company.email && company.address && company.country && company.city);
      setValidations(prev => ({
        ...prev,
        generalInfo: hasGeneralInfo
      }));
    } else {
      setValidations(prev => ({
        ...prev,
        generalInfo: false
      }));
    }
  }, [company]);
  const updateValidation = (tab, isValid) => {
    setValidations(prev => ({
      ...prev,
      [tab]: isValid
    }));
  };
  const allTabsCompleted = Object.values(validations).every(Boolean);

  // Obtener tabs habilitados
  const getEnabledTabs = () => {
    const enabledTabs = [0]; // Siempre habilitar el primer tab

    if (validations.generalInfo) {
      enabledTabs.push(1);
      if (validations.representative) {
        enabledTabs.push(2);
        enabledTabs.push(3);
      }
    }
    return enabledTabs;
  };
  return {
    validations,
    updateValidation,
    allTabsCompleted,
    getEnabledTabs
  };
};