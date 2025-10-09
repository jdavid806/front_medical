import React, { useEffect, useState, useRef } from 'react';
import { PricesTableConfig } from "../prices/table/PricesTableConfig.js";
import PricesConfigFormModal from "../prices/form/PricesConfigFormModal.js";
import { PrimeReactProvider } from 'primereact/api';
import { ProductMapperCreate, ProductMapperUpdate } from "./mappers/index.js";
import { usePricesConfigTable } from "./hooks/usePricesConfigTable.js";
import { usePriceConfigCreate } from "./hooks/usePriceConfigCreate.js";
import { usePriceConfigUpdate } from "./hooks/usePriceConfigUpdate.js";
import { usePriceConfigById } from "./hooks/usePriceConfigById.js";
import { usePriceConfigDelete } from "./hooks/usePriceConfigDelete.js";
import { entitiesService } from "../../../services/api/index.js";
export const PricesConfig = ({
  onConfigurationComplete,
  isConfigurationContext = false
}) => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [initialData, setInitialData] = useState(undefined);
  const [entitiesData, setEntitiesData] = useState([]);
  const [isMounted, setIsMounted] = useState(true);
  const modalRef = useRef(null);
  const {
    fetchProducts,
    products
  } = usePricesConfigTable();
  const {
    createProduct,
    loading
  } = usePriceConfigCreate();
  const {
    updateProduct
  } = usePriceConfigUpdate();
  const {
    fetchPriceById,
    priceById,
    setPriceById
  } = usePriceConfigById();
  const {
    deleteProduct
  } = usePriceConfigDelete();
  const isComplete = products && products.length > 0;
  const showValidations = isConfigurationContext;
  useEffect(() => {
    if (!isMounted) return;
    const hasProducts = products && products.length > 0;
    onConfigurationComplete?.(hasProducts);
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
  const handleSubmit = async data => {
    const mapperDataProduct = ProductMapperCreate(data);
    const mapperDataProductUpdate = ProductMapperUpdate(data);
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
  const handleTableEdit = id => {
    fetchPriceById(id);
    setShowFormModal(true);
  };
  const handleTableDelete = async id => {
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
      const data = {
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
            negotation_type: entity?.negotation_type || entity?.negotation_type || ''
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
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      appendTo: modalRef.current || 'self',
      zIndex: {
        overlay: 100000
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: modalRef
  }, showValidations && /*#__PURE__*/React.createElement("div", {
    className: "validation-section mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: `alert ${isComplete ? 'alert-success' : 'alert-info'} p-3`
  }, /*#__PURE__*/React.createElement("i", {
    className: `${isComplete ? 'pi pi-check-circle' : 'pi pi-info-circle'} me-2`
  }), isComplete ? 'Precios configurados correctamente! Puede continuar al siguiente módulo.' : 'Configure al menos un rol de usuario para habilitar el botón "Siguiente Módulo"')), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "mb-1"
  }, "Configuraci\xF3n de Precios"), /*#__PURE__*/React.createElement("div", {
    className: "text-end mb-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary d-flex align-items-center",
    onClick: onCreate,
    disabled: loading
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus me-2"
  }), loading ? 'Cargando...' : 'Nuevo Precio'))), /*#__PURE__*/React.createElement(PricesTableConfig, {
    prices: products,
    onEditItem: handleTableEdit,
    onDeleteItem: handleTableDelete
  }), showFormModal && /*#__PURE__*/React.createElement(PricesConfigFormModal, {
    show: showFormModal,
    entitiesData: entitiesData,
    handleSubmit: handleSubmit,
    onHide: handleModalHide,
    initialData: initialData
  }))));
};