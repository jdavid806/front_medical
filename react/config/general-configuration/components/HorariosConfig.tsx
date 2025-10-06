import React from 'react';
import { UserAvailabilityApp } from '../../../user-availabilities/UserAvailabilityApp';

interface HorariosConfigProps {
    onConfigurationComplete?: (isComplete: boolean) => void;
}

export const HorariosConfig: React.FC<HorariosConfigProps> = ({
    onConfigurationComplete
}) => {
    return (
        <UserAvailabilityApp onConfigurationComplete={onConfigurationComplete} />
    );
};