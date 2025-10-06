import React from 'react';
import { UserRoleApp } from '../../../user-roles/UserRoleApp';

interface RolesConfigProps {
    onConfigurationComplete?: (isComplete: boolean) => void;
}

export const RolesConfig: React.FC<RolesConfigProps> = ({
    onConfigurationComplete
}) => {
    return (
        <UserRoleApp onConfigurationComplete={onConfigurationComplete} />
    );
};