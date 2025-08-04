import { useState, useEffect } from 'react';
import AccountingClosingsService from '../../../../services/api/classes/accountingClosingsService';

export interface UseAccountingClosingsResponse {
    data: AccountingClosing[];
}

export interface AccountingClosing {
    id: number;
    age: number;
    status: string;
    start_month: string;
    end_month: string;
    warning_days: number;
    is_closed: boolean;
    created_at: string;
    updated_at: string;
}

export const useAccountingClosings = () => {
    const [accountingClosings, setAccountingClosings] = useState<UseAccountingClosingsResponse>({
        data: []
    });

    const fetchAccountingClosings = async () => {
        try {
            const service = new AccountingClosingsService();
            const data: UseAccountingClosingsResponse = await service.getAll();

            setAccountingClosings(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchAccountingClosings();
    }, []);

    return { accountingClosings, fetchAccountingClosings };
};

