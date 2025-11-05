import { useState } from 'react';
import { ErrorHandler } from '../../../services/errorHandler';
import { inventoryService } from '../../../services/api';

export const useProductsByType = () => {
    const [productsByType, setProductsByType] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const getPromise = (type: string): Promise<any> | null => {
        switch (type) {
            case "Medicamentos":
                return inventoryService.getMedications();
            case "Insumos":
                return inventoryService.getSupplies();
            case "Vacunas":
                return inventoryService.getVaccines();
            case "Servicios":
                return inventoryService.getServices();
            default:
                return null;
        }
    };

    const fetchProductsByType = async (type: string) => {
        setLoading(true);
        try {
            const promise = getPromise(type);

            if (!promise) {
                return;
            }

            const data = await promise;
            const mappedData = data.map((item: any) => {
                return {
                    ...item,
                    label: item.name,
                };
            });

            setProductsByType(mappedData);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        productsByType,
        fetchProductsByType,
        loading
    };
};
