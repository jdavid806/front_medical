import React, { useEffect } from 'react';
import SpecialityApp from '../../../fe-config/speciality/SpecialityApp';

interface EspecialidadesConfigProps {
    onConfigurationComplete?: (isComplete: boolean) => void;
    isConfigurationContext?: boolean;
}

export const EspecialidadesConfig: React.FC<EspecialidadesConfigProps> = ({
    onConfigurationComplete,
    isConfigurationContext = false
}) => {
    return (
        <SpecialityApp
            onConfigurationComplete={onConfigurationComplete}
            isConfigurationContext={isConfigurationContext}
        />
    );
};