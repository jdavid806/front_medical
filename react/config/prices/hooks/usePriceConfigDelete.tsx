import React, { useState } from 'react';
import { productService } from '../../../../services/api';
import { SwalManager } from '../../../../services/alertManagerImported';
import { ErrorHandler } from '../../../../services/errorHandler';

export const usePriceConfigDelete = () => {
    const [loading, setLoading] = useState(false);

    const deleteProduct = async (id: string) => {
        setLoading(true);
        try {
            const confirmed = await SwalManager.confirmDelete(
                async () => {
                    await productService.deleteProductById(id);
                    SwalManager.success();
                }
            );
            return confirmed;
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
