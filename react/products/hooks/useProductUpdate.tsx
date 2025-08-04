import React, { useState } from 'react';
import { productService } from "../../../services/api/index";
import { ErrorHandler } from "../../../services/errorHandler";
import { SwalManager } from '../../../services/alertManagerImported';

export const useProductUpdate = () => {
    const [loading, setLoading] = useState(true);

    const updateProduct = async (id: string, data: any) => {
        setLoading(true);
        try {
            await productService.updateProduct(id, data);
            SwalManager.success()
        } catch (error) {
            ErrorHandler.generic(error);
        } finally {
            setLoading(false);
        }
    };

    return {
        updateProduct,
        loading
    };
};