import { useState, useEffect } from 'react';
import { branchService } from '../../../services/api';
import { BranchDto } from '../../models/models';

export const useBranchesForSelect = () => {
    const [branches, setBranches] = useState<{ value: string, label: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchBranches = async () => {
        try {
            const data: BranchDto[] = await branchService.getAll();
            const mappedData = data.map(item => {
                return {
                    value: item.id.toString(),
                    label: item.address
                }
            })
            console.log('branches', data, mappedData);
            setBranches(mappedData);
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchBranches()
            .finally(() => setLoading(false));
    }, []);

    return {
        branches,
        loading
    };
};
