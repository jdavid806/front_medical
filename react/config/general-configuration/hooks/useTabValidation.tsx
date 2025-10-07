import { useState, useEffect } from 'react';
import { Company } from '../../company-configuration/types/consultorio';

interface TabValidationState {
    generalInfo: boolean;
    representative: boolean;
    branches: boolean;
}

export const useTabValidation = (company?: Company) => {
    const [validations, setValidations] = useState<TabValidationState>({
        generalInfo: false,
        representative: false,
        branches: false
    });

    useEffect(() => {
        if (company) {
            const hasGeneralInfo = Boolean(
                company.legal_name &&
                company.document_type &&
                company.document_number &&
                company.phone &&
                company.email &&
                company.address &&
                company.country &&
                company.city
            );
            setValidations(prev => ({ ...prev, generalInfo: hasGeneralInfo }));
        } else {
            setValidations(prev => ({ ...prev, generalInfo: false }));
        }
    }, [company]);

    const updateValidation = (tab: keyof TabValidationState, isValid: boolean) => {
        setValidations(prev => ({ ...prev, [tab]: isValid }));
    };

    const allTabsCompleted = Object.values(validations).every(Boolean);

    // Obtener tabs habilitados
    const getEnabledTabs = (): number[] => {
        const enabledTabs = [0]; // Siempre habilitar el primer tab

        if (validations.generalInfo) {
            enabledTabs.push(1)
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