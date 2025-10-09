import React from 'react';
import { UserRoleApp } from '../../../user-roles/UserRoleApp';

interface RolesConfigProps {
    onConfigurationComplete?: (isComplete: boolean) => void;
    isConfigurationContext?: boolean;
}

export const RolesConfig: React.FC<RolesConfigProps> = ({
    onConfigurationComplete,
    isConfigurationContext = false
}) => {
    return (
        <UserRoleApp
            onConfigurationComplete={onConfigurationComplete}
            isConfigurationContext={isConfigurationContext}
        />
    );
};