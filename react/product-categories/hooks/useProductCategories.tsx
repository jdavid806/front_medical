import { useEffect, useState } from "react";
import ProductCategoryService from "../../../services/api/classes/productCategoryService";

export const useProductCategories = () => {
    const [productCategories, setProductCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const service = new ProductCategoryService();
                const response = await service.getProductCategories();
                const data = response;
                setProductCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return { productCategories, loading };
}
