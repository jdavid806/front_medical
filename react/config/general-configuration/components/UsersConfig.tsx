import React from 'react';
import { UserApp } from '../../../users/UserApp';

interface UsersConfigProps {
    onConfigurationComplete?: (isComplete: boolean) => void;
}

export const UsersConfig: React.FC<UsersConfigProps> = ({
    onConfigurationComplete
}) => {
    return (
        <UserApp onConfigurationComplete={onConfigurationComplete} />
    );
};