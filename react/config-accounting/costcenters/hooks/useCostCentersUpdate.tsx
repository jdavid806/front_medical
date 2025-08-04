import { useState } from 'react';
import { ErrorHandler } from '../../../../services/errorHandler';
import { costCenterService } from '../../../../services/api';
import { UpdateCostCenterDTO } from '../interfaces/CostCenterDTO';
import { SwalManager } from '../../../../services/alertManagerImported';

export const useCostCentersUpdate = () => {
    const [loading, setLoading] = useState(false);

    const updateCostCenter = async (id: string | number, data: UpdateCostCenterDTO) => {
        setLoading(true);
        try {
            const response = await costCenterService.updateCostCenter(id, data);
            console.log('Cost center updated:', response);
            return response;
        } catch (error) {
            console.error("Error update cost center:", error);
            ErrorHandler.getErrorMessage(error);
            SwalManager.error("Error al Actualizar centro de costo");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateCostCenter,
        loading
    };
};