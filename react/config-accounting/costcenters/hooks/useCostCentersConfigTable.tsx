import { useState, useEffect } from 'react';
import { costCenterService } from '../../../../services/api';
import { CostCenter } from '../interfaces/CostCenterConfigTableType';


export const useCostCentersConfigTable = () => {
    const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const transformCostCenterData = (data: any): CostCenter[] => {
        try {
            if (!Array.isArray(data)) {
                console.error('Expected array but received:', data);
                return [];
            }
            
            return data.map((costCenter: any) => {
                return {
                    id: costCenter?.id?.toString() || '',
                    name: costCenter?.name || '',
                    code: costCenter?.code || '',
                    description: costCenter?.description || 'Sin descripción'
                };
            });
        } catch (error) {
            console.error('Error transforming cost center data:', error);
            return [];
        }
    };

    const fetchCostCenters = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await costCenterService.getCostCenterAll();
            const data = response?.data ?? response;
            console.log('Datos recibidos del backend:', data);
            const transformedData = transformCostCenterData(data);
            setCostCenters(transformedData);
        } catch (err) {
            console.error('Error fetching cost centers:', err);
            setError('Error al cargar los centros de costo. Por favor, intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCostCenters();
    }, []);

    return { 
        costCenters, 
        loading, 
        error, 
        refreshCostCenters: fetchCostCenters 
    };
};