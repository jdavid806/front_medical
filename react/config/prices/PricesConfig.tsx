import React, { useEffect, useState, useRef } from 'react';
import { PricesTableConfig } from '../prices/table/PricesTableConfig';
import PricesConfigFormModal from '../prices/form/PricesConfigFormModal';
import { PrimeReactProvider } from 'primereact/api';
import { ProductFormInputs } from '../prices/form/PricesConfigForm';
import { ProductMapperCreate, ProductMapperUpdate } from './mappers';
import { usePricesConfigTable } from './hooks/usePricesConfigTable';
import { usePriceConfigCreate } from './hooks/usePriceConfigCreate';
import { usePriceConfigUpdate } from './hooks/usePriceConfigUpdate';
import { usePriceConfigById } from './hooks/usePriceConfigById';
import { usePriceConfigDelete } from './hooks/usePriceConfigDelete';
import { entitiesService } from "../../../services/api";
import { SwalManager } from '../../../services/alertManagerImported';

interface PricesConfigProps {
    onConfigurationComplete?: (isComplete: boolean) => void;
}

export const PricesConfig = ({ onConfigurationComplete }: PricesConfigProps) => {
    const [showFormModal, setShowFormModal] = useState(false);
    const [initialData, setInitialData] = useState<ProductFormInputs | undefined>(undefined);
    const [entitiesData, setEntitiesData] = useState<any[]>([]);
    const [isMounted, setIsMounted] = useState(true);
    const modalRef = useRef<HTMLDivElement>(null);

    const { fetchProducts, products } = usePricesConfigTable();
    const { createProduct, loading } = usePriceConfigCreate();
    const { updateProduct } = usePriceConfigUpdate();
    const { fetchPriceById, priceById, setPriceById } = usePriceConfigById();
    const { deleteProduct } = usePriceConfigDelete();

    useEffect(() => {
        if (!isMounted) return;

        const hasProducts = products && products.length > 0;
        console.log('🔍 Validando precios:', {
            totalPrecios: products?.length,
            hasProducts
        });
        onConfigurationComplete?.(hasProducts);
        console.log("onConfigurationComplete!!!!", onConfigurationComplete)
    }, [products, onConfigurationComplete, isMounted]);

    // Cleanup para evitar el error de removeChild
    useEffect(() => {
        return () => {
            setIsMounted(false);
        };
    }, []);

    const onCreate = () => {
        setInitialData(undefined);
        setPriceById(null);
        setShowFormModal(true);
    };

    const handleSubmit = async (data: ProductFormInputs) => {
        const mapperDataProduct = ProductMapperCreate(data)
        const mapperDataProductUpdate = ProductMapperUpdate(data)

        try {
            if (priceById) {
                await updateProduct(priceById.id.toString(), mapperDataProductUpdate);
            } else {
                await createProduct(mapperDataProduct);
            }
            await fetchProducts();
            setShowFormModal(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleTableEdit = (id: string) => {
        fetchPriceById(id);
        setShowFormModal(true);
    };

    const handleTableDelete = async (id: string) => {
        const confirmed = await deleteProduct(id);
        if (confirmed) {
            await fetchProducts();
        }
    };

    async function loadEntities() {
        try {
            const entities = await entitiesService.getEntities();
            setEntitiesData(entities.data);
        } catch (error) {
            console.error('Error loading entities:', error);
        }
    }

    useEffect(() => {
        loadEntities();
    }, []);

    useEffect(() => {
        if (priceById && isMounted) {
            const data: ProductFormInputs = {
                product_id: priceById.id?.toString(),
                name: priceById.name,
                attention_type: priceById.attention_type,
                curp: priceById.barcode,
                sale_price: priceById.sale_price,
                copago: +priceById.copayment,
                taxProduct_type: priceById.tax_charge_id ?? '0',
                exam_type_id: priceById.exam_type_id?.toString() ?? '',
                purchase_price: priceById.purchase_price,
                entities: priceById.entities?.map(entity => {
                    return {
                        entity_id: entity.pivot?.entity_id || entity.entity_id || entity.id,
                        entity_name: entitiesData.find(e => e.id === entity?.entity_id)?.name || 'N/A',
                        price: +(entity.pivot?.price || entity?.price || 0),
                        tax_charge_id: entity?.pivot?.tax_charge_id || entity?.tax_charge_id || null,
                        tax_name: entity?.tax_charge?.name || 'N/A',
                        withholding_tax_id: entity?.pivot?.withholding_tax_id || entity?.withholding_tax_id || '',
                        retention_name: entity?.withholding_tax?.name || 'N/A',
                        negotation_type: entity?.negotation_type || entity?.negotation_type || '',
                    };
                }) || []
            };
            setInitialData(data);
        }
    }, [priceById, entitiesData, isMounted]);

    const handleModalHide = () => {
        setShowFormModal(false);
        setPriceById(null);
        setInitialData(undefined);
    };

    return (
        <>
            <PrimeReactProvider value={{
                appendTo: modalRef.current || 'self',
                zIndex: {
                    overlay: 100000
                }
            }}>
                <div ref={modalRef}>
                    <div className="mb-3">
                        <div className="alert alert-info p-2">
                            <small>
                                <i className="pi pi-info-circle me-2"></i>
                                Configure al menos un precio para poder continuar al siguiente módulo.
                            </small>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="mb-1">Configuración de Precios</h4>
                        <div className="text-end mb-2">
                            <button
                                className="btn btn-primary d-flex align-items-center"
                                onClick={onCreate}
                                disabled={loading}
                            >
                                <i className="fas fa-plus me-2"></i>
                                {loading ? 'Cargando...' : 'Nuevo Precio'}
                            </button>
                        </div>
                    </div>

                    <PricesTableConfig
                        prices={products}
                        onEditItem={handleTableEdit}
                        onDeleteItem={handleTableDelete}
                    />

                    {showFormModal && (
                        <PricesConfigFormModal
                            show={showFormModal}
                            entitiesData={entitiesData}
                            handleSubmit={handleSubmit}
                            onHide={handleModalHide}
                            initialData={initialData}
                        />
                    )}
                </div>
            </PrimeReactProvider>
        </>
    );
};