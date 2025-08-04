import { useState, useEffect } from 'react';
import { billingService } from "../../../services/api/index.js";

export const useBillings = () => {
    const [billings, setBillings] = useState<any[]>([]);

    const fetchBillings = async () => {
        try {
            const data: any = await billingService.getBillings();

            setBillings(data);

            return data;
        } catch (error) {
            console.error('Error fetching billing:', error);
        }
    };

    return { billings, fetchBillings };
};

