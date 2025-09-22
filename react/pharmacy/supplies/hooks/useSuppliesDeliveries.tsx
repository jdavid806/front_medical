import { useEffect, useState } from "react";
import { suppliesService } from "../../../../services/api";
import { MedicalSupply, MedicalSupplyResponse } from "../interfaces";

export const useSuppliesDeliveries = () => {
    const [suppliesDeliveries, setSuppliesDeliveries] = useState<MedicalSupply[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchSuppliesDeliveries = async () => {
        setLoading(true);
        try {
            const response: MedicalSupplyResponse = await suppliesService.getAllSupplies();
            setSuppliesDeliveries(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliesDeliveries();
    }, []);

    return {
        suppliesDeliveries,
        fetchSuppliesDeliveries,
        loading,
    };
}
