import React from 'react';
import { UserApp } from '../../../users/UserApp';

interface UsersConfigProps {
    onConfigurationComplete?: (isComplete: boolean) => void;
    isConfigurationContext?: boolean;

}

export const UsersConfig: React.FC<UsersConfigProps> = ({
    onConfigurationComplete,
    isConfigurationContext = false

}) => {
    return (
        <UserApp onConfigurationComplete={onConfigurationComplete}
            isConfigurationContext={isConfigurationContext}
        />
    );
};