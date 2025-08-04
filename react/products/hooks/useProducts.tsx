import { useState, useEffect } from 'react';
import { ErrorHandler } from '../../../services/errorHandler';
import { productService } from '../../../services/api';

export const useProducts = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const data = await productService.getAllProducts();
            const mappedData = data.data.map((item: any) => {
                return {
                    ...item,
                    label: item.attributes.name,
                };
            });

            setProducts(mappedData);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return {
        products,
        fetchProducts,
        loading
    };
};
