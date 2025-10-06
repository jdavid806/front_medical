import React, { useEffect } from 'react';
import SpecialityApp from '../../../fe-config/speciality/SpecialityApp';

interface EspecialidadesConfigProps {
    onConfigurationComplete?: (isComplete: boolean) => void;
}

export const EspecialidadesConfig: React.FC<EspecialidadesConfigProps> = ({
    onConfigurationComplete
}) => {
    return (
        <SpecialityApp onConfigurationComplete={onConfigurationComplete} />
    );
};