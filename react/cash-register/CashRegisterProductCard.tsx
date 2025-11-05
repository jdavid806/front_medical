import React from "react";
import { Card } from "primereact/card";
import { CashRegisterProduct } from "./interfaces";
import { formatPrice } from "../../services/utilidades";
import { Tooltip } from "primereact/tooltip";
import { Button } from "primereact/button";

interface CashRegisterProductCardProps {
    product: CashRegisterProduct;
    addToCart: (product: CashRegisterProduct) => void;
    inCart: boolean;
}

export const CashRegisterProductCard = (props: CashRegisterProductCardProps) => {

    const { product, addToCart, inCart } = props;

    const getStockSeverity = (stock: number) => {
        if (stock === 0) return 'danger';
        if (stock < 10) return 'warning';
        return 'success';
    };

    const getStockText = (stock: number) => {
        if (stock === 0) return 'Sin stock';
        if (stock < 10) return `Stock bajo: ${stock}`;
        return `En stock: ${stock}`;
    };

    const header = (
        <div className="position-relative">
            {!product.pharmacy_available_stock && (
                <div className="badge bg-danger position-absolute top-0 start-0 m-3">AGOTADO</div>
            )}
            {product.pharmacy_available_stock && (
                <div className="badge bg-success position-absolute top-0 start-0 m-3">DISPONIBLE</div>
            )}
        </div>
    );

    const footer = (
        <div className="d-flex justify-content-between align-items-center w-100 gap-2">
            <div
                className={`badge bg-${getStockSeverity(product.pharmacy_product_stock)}`}
            >
                {getStockText(product.pharmacy_product_stock)}
            </div>
            <Tooltip target=".add-to-cart-btn" />
            <div
                className="add-to-cart-btn"
                data-pr-tooltip={inCart ? 'Ya se encuentra en el carrito' : 'Agregar al carrito'}
            >
                <Button
                    className={`${inCart ? 'p-button-success' : 'p-button-primary'}`}
                    size="small"
                    disabled={!product.pharmacy_available_stock || inCart}
                    onClick={() => addToCart(product)}
                    icon={<i className="fas fa-cart-plus"></i>}
                />
            </div>
        </div>
    );

    return (
        <Card
            key={product.id}
            header={header}
            footer={footer}
            className="h-100 shadow-sm product-card"
        >
            <div className="card-body d-flex flex-column h-100 mt-3">
                <h6 className="card-title fw-bold text-primary mb-2 line-clamp-2">
                    {product.name}
                </h6>
                {product.description && (
                    <p className="card-text small text-muted mb-2 line-clamp-2">
                        {product.description}
                    </p>
                )}

                <div className="mt-auto">
                    <div className="row small text-muted g-1 mb-2">
                        {product.presentation && (
                            <div className="col-12">
                                <i className="fas fa-box me-1"></i>
                                <strong>Presentación:</strong> {product.presentation}
                            </div>
                        )}
                    </div>

                    <div className="d-flex justify-content-between align-items-center border-top pt-2">
                        <span className="fw-bold fs-6">
                            {formatPrice(product.price)}
                        </span>
                        {product.pharmacy_available_stock && product.pharmacy_product_stock > 0 && (
                            <i className="fas fa-check-circle text-success"></i>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}