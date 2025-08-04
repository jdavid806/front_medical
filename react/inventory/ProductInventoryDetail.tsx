import React from 'react';

export const ProductInventoryDetail: React.FC<{ product: any }> = ({ product }) => {
    return (<>
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    <p><i className="fas fa-tag"></i> <strong>ID:</strong> <span>{product.id}</span></p>
                    <p><i className="fas fa-file-alt"></i> <strong>Nombre:</strong> <span>{product.name}</span></p>
                    <p><i className="fas fa-file"></i> <strong>Descripción:</strong> <span>{product.description || '--'}</span></p>
                    <p><i className="fas fa-barcode"></i> <strong>Código de Barras:</strong> <span>{product.barcode}</span></p>
                </div>
                <div className="col-md-6">
                    <p><i className="fas fa-box"></i> <strong>Stock:</strong> <span>{product.stock || '--'}</span></p>
                    <p><i className="fas fa-exclamation-triangle"></i> <strong>Stock Mínimo:</strong> <span>{product.minimum_stock || '--'}</span></p>
                    <p><i className="fas fa-chart-line"></i> <strong>Stock Máximo:</strong> <span>{product.maximum_stock || '--'}</span></p>
                </div>
            </div>

            <hr />

            <div className="row">
                <div className="col-md-6">
                    <p><i className="fas fa-coins"></i> <strong>Precio de Compra:</strong> <span>{product.purchase_price || '--'}</span></p>
                    <p><i className="fas fa-dollar-sign"></i> <strong>Precio de Venta:</strong> <span>{product.sale_price}</span></p>
                    <p><i className="fas fa-info-circle"></i> <strong>Estado:</strong> <span>{'--'}</span></p>
                </div>
                <div className="col-md-6">
                    <p><i className="fas fa-industry"></i> <strong>Laboratorio:</strong> <span>{product.laboratory_id || '--'}</span></p>
                    <p><i className="fas fa-tags"></i> <strong>Marca:</strong> <span>{product.brand_id || '--'}</span></p>
                    <p><i className="fas fa-store"></i> <strong>Proveedor:</strong> <span>{product.supplier_id || '--'}</span></p>
                </div>
            </div>

            <hr />

            <div className="row">
                <div className="col-md-6">
                    <p><i className="fas fa-clipboard-check"></i> <strong>Registro Sanitario:</strong> <span>{product.sanitary_registration || '--'}</span></p>
                    <p><i className="fas fa-calendar-alt"></i> <strong>Fecha de Expiración:</strong> <span>{product.expiration_date || '--'}</span></p>
                </div>
                <div className="col-md-6">
                    <p><i className="fas fa-vial"></i> <strong>Concentración:</strong> <span>{product.concentration || '--'}</span></p>
                    <p><i className="fas fa-prescription"></i> <strong>¿Requiere Receta?:</strong> <span>{product.prescription ? 'Sí' : 'No'}</span></p>
                </div>
            </div>
        </div>
    </>);
}

