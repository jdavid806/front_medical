import React, { useEffect, useState } from 'react';
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

export const PricesConfig = () => {
    const [showFormModal, setShowFormModal] = useState(false);
    const [initialData, setInitialData] = useState<ProductFormInputs | undefined>(undefined);
    const [entitiesData, setEntitiesData] = useState<any[]>([]);

    const { fetchProducts, products } = usePricesConfigTable();
    const { createProduct, loading } = usePriceConfigCreate();
    const { updateProduct } = usePriceConfigUpdate();
    const { fetchPriceById, priceById, setPriceById } = usePriceConfigById();
    const { deleteProduct } = usePriceConfigDelete();
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
            fetchProducts();
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
        const entities = await entitiesService.getEntities();
        setEntitiesData(entities.data);
    }

    useEffect(() => {
        loadEntities();
    }, []);

    useEffect(() => {
        if (priceById) {
            const data: ProductFormInputs = {
                product_id: priceById.id?.toString(), // Agregar product_id para la actualización
                name: priceById.name,
                attention_type: priceById.attention_type,
                curp: priceById.barcode,
                sale_price: priceById.sale_price,
                copago: +priceById.copayment,
                taxProduct_type: priceById.tax_charge_id ?? '0',
                exam_type_id: priceById.exam_type_id?.toString() ?? '',
                purchase_price: priceById.purchase_price,
                entities: priceById.entities?.map(entity => {
                    // Priorizar datos del pivot si existen, luego los datos directos
                    return {
                        entity_id: entity.pivot?.entity_id || entity.entity_id || entity.id,
                        entity_name: entitiesData.find(e => e.id === entity?.entity_id)?.name || 'N/A',
                        price: +(entity.pivot?.price || entity?.price || 0),
                        tax_charge_id: entity?.pivot?.tax_charge_id || entity?.tax_charge_id || null,
                        tax_name: entity?.tax_charge?.name || 'N/A',
                        withholding_tax_id: entity?.pivot?.withholding_tax_id || entity?.withholding_tax_id || '',
                        retention_name: entity?.withholding_tax?.name || 'N/A',
                    };
                }) || []
            };
            setInitialData(data);
        }
    }, [priceById]);

    return (
        <>
            <PrimeReactProvider value={{
                appendTo: 'self',
                zIndex: {
                    overlay: 100000
                }
            }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-1">Configuración de Precios</h4>
                    <div className="text-end mb-2">
                        <button
                            className="btn btn-primary d-flex align-items-center"
                            onClick={onCreate}
                        >
                            <i className="fas fa-plus me-2"></i>
                            Nuevo Precio
                        </button>
                    </div>
                </div>
                <PricesTableConfig
                    prices={products}
                    onEditItem={handleTableEdit}
                    onDeleteItem={handleTableDelete}
                />
                <PricesConfigFormModal
                    show={showFormModal}
                    entitiesData={entitiesData}
                    handleSubmit={handleSubmit}
                    onHide={() => { setShowFormModal(false); }}
                    initialData={initialData}
                />
            </PrimeReactProvider>
        </>
    );
};