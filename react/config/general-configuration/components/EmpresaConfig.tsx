import React from 'react';
import { CompanyConfiguration } from '../../company-configuration/CompanyConfiguration';

interface EmpresaConfigProps {
    onConfigurationComplete?: () => void;
}

export const EmpresaConfig: React.FC<EmpresaConfigProps> = ({ onConfigurationComplete }) => {
    return (
        <CompanyConfiguration onComplete={onConfigurationComplete} />
    );
};