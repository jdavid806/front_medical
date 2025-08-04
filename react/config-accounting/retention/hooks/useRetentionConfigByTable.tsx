import { useState } from "react";
import { retentionsService } from "../../../../services/api";

export const useRetentionConfigByTable = () => {
    const [retention, setRetention] = useState<any>(null);
    const [loading, setLoading] = useState(true);

const fetchRetentionById = async (id: string) => {
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