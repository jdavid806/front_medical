import { useState, useEffect } from 'react';
import { billingService } from "../../../services/api/index.js";

export const useBillingByType = () => {
    const [billing, setBilling] = useState<any>(null);

    const fetchBillingByType = async (type: string) => {
        try {
            const data: any = await billingService.getBillingByType(type);

            setBilling(data);

            return data;
        } catch (error) {
            console.error('Error fetching billing:', error);
        }
    };

    return { billing, fetchBillingByType };
};

