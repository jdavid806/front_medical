import React from 'react';
import { PricesConfig } from '../../prices/PricesConfig';

interface PreciosConfigProps {
    onConfigurationComplete?: (isComplete: boolean) => void;
}

export const PreciosConfig: React.FC<PreciosConfigProps> = ({
    onConfigurationComplete
}) => {
    return (
        <PricesConfig onConfigurationComplete={onConfigurationComplete} />
    );
};