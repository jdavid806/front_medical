import { useState } from 'react';
import { retentionsService } from '../../../../services/api';
import { ErrorHandler } from '../../../../services/errorHandler';
import { SwalManager } from '../../../../services/alertManagerImported';
import { UpdateRetentionDTO } from '../interfaces/RetentionDTO';

export const useRetentionUpdateTable = () => {
    const [loading, setLoading] = useState(false);

    const updateRetention = async (id: string | number, data: UpdateRetentionDTO) => {
        setLoading(true);
        try {
            const response = await retentionsService.updateRetention(id, data);
            SwalManager.success("Retención actualizada exitosamente");
            return response;
        } catch (error) {
            console.error('Error updating retention:', error);
            ErrorHandler.generic(error);
            SwalManager.error("Error al actualizar retención");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateRetention,
        loading
    };
};