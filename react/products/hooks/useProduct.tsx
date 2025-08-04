import React, { useState } from "react";
import { productService } from "../../../services/api";
import { ErrorHandler } from "../../../services/errorHandler";

export const useProduct = () => {
    const [product, setProduct] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProduct = async (id: string) => {
        try {
            const data = await productService.getProductById(id);
            setProduct(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        product,
        fetchProduct,
        loading
    };
};