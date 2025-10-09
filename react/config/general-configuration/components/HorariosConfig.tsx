import React from 'react';
import { UserAvailabilityApp } from '../../../user-availabilities/UserAvailabilityApp';

interface HorariosConfigProps {
    onConfigurationComplete?: (isComplete: boolean) => void;
    isConfigurationContext?: boolean;

}

export const HorariosConfig: React.FC<HorariosConfigProps> = ({
    onConfigurationComplete,
    isConfigurationContext = false

}) => {
    return (
        <UserAvailabilityApp onConfigurationComplete={onConfigurationComplete}
            isConfigurationContext={isConfigurationContext}
        />
    );
};