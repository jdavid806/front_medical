import { useState } from "react";
import { retentionsService } from "../../../../services/api";
import { Retention } from "../interfaces/RetentionFormConfigType";

export const useRetentionConfigByTable = () => {
    const [retention, setRetention] = useState<Retention | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchRetentionById = async (id: string | number) => {
        setLoading(true);
        try {
            const response = await retentionsService.getRetentionById(id);
            console.log('Retention data from API:', response.data);
            setRetention(response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching retention:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        retention,
        fetchRetentionById,
        setRetention,
        loading
    };
};