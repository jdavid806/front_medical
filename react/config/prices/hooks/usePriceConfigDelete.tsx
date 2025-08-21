import React, { useState } from 'react';
import { productService } from '../../../../services/api';
import { SwalManager } from '../../../../services/alertManagerImported';
import { ErrorHandler } from '../../../../services/errorHandler';

export const usePriceConfigDelete = () => {
    const [loading, setLoading] = useState(true);

    const deleteProduct = async (id: string) => {
        setLoading(true);
        try {
            const response = await SwalManager.confirmDelete(
                async () => {
                    await productService.deleteProductById(id);
                    SwalManager.success();
                }
            )

            return response;
        } catch (error) {
            ErrorHandler.generic(error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        deleteProduct,
        loading
    };
};
