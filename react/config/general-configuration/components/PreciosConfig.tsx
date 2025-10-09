import React from 'react';
import { PricesConfig } from '../../prices/PricesConfig';

interface PreciosConfigProps {
    onConfigurationComplete?: (isComplete: boolean) => void;
    isConfigurationContext?: boolean;

}

export const PreciosConfig: React.FC<PreciosConfigProps> = ({
    onConfigurationComplete,
    isConfigurationContext = false

}) => {
    return (
        <PricesConfig
            onConfigurationComplete={onConfigurationComplete}
            isConfigurationContext={isConfigurationContext}

        />
    );
};