import { useState, useEffect } from 'react';
import { assetsService } from '../../../../services/api';
import { FixedAsset } from '../interfaces/FixedAssetsTableTypes';

export const useAssets = () => {
    const [assets, setAssets] = useState<FixedAsset[]>([]);

    const fetchAssets = async () => {
        try {
            const data: { data: FixedAsset[] } = await assetsService.getAll();
            setAssets(data.data);
            return data;
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    return { assets, fetchAssets };
};