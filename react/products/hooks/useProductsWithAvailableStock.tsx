import { useEffect, useState } from "react";
import { farmaciaService } from "../../../services/api";
import { ProductDto } from "../../models/models";

export const useProductsWithAvailableStock = () => {
    const [productsWithAvailableStock, setProductsWithAvailableStock] = useState<ProductDto[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchProductsWithAvailableStock = async (productTypeNames: string, inventoryType: string) => {
        setLoading(true);
        try {
            const response = await farmaciaService.getProductsWithAvailableStock(productTypeNames, inventoryType);
            const products: ProductDto[] = response.data.map((product: any) => {
                const concentration = product.attributes.concentration ?? "";
                return {
                    id: product.id,
                    name: concentration
                        ? `${product.attributes.name} - ${concentration} | Stock: ${product.attributes.product_stock}`
                        : `${product.attributes.name} | Stock: ${product.attributes.product_stock}`,
                    product_stock: product.attributes.product_stock,
                    pharmacy_product_stock: product.attributes.pharmacy_product_stock,
                    sale_price: product.attributes.sale_price,
                };
            });
            setProductsWithAvailableStock(products);
        } catch (error) {
            console.error("Error fetching products with available stock:", error);
        } finally {
            setLoading(false);
        }
    };

    return { productsWithAvailableStock, loading, fetchProductsWithAvailableStock };
}
