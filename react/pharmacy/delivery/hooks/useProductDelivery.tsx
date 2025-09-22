import { useState } from "react";
import { suppliesService } from "../../../../services/api";
import { MedicalSupply } from "../../supplies/interfaces";

interface GetSuppliesByIdResponse {
    data: MedicalSupply;
}

export const useProductDelivery = () => {

    const [delivery, setDelivery] = useState<MedicalSupply | null>(null);
    const [loading, setLoading] = useState(false);

    const getDelivery = async (deliveryId: string) => {
        setLoading(true);
        try {
            const data: GetSuppliesByIdResponse = await suppliesService.getSuppliesById(deliveryId);
            setDelivery(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return {
        delivery,
        loading,
        getDelivery
    };
};
