import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputTextarea } from 'primereact/inputtextarea';
import { Tag } from 'primereact/tag';
import { InputNumber } from 'primereact/inputnumber';
import { Panel } from 'primereact/panel';


type Product = {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  unit: string;
  category: string;
};

type Adjustment = {
  productId: string;
  currentStock: number;
  newQuantity: number;
  adjustment: number;
  reason: string;
  notes: string;
};

const initialProducts: Product[] = [
  { id: "1", name: "Laptop Dell Inspiron 15", sku: "DELL-INS-15", currentStock: 25, unit: "unidades", category: "Electrónicos" },
  { id: "2", name: "Mouse Inalámbrico Logitech", sku: "LOG-MX-MASTER", currentStock: 150, unit: "unidades", category: "Accesorios" },
  { id: "3", name: 'Monitor Samsung 24"', sku: "SAM-MON-24", currentStock: 45, unit: "unidades", category: "Monitores" },
  { id: "4", name: "Teclado Mecánico RGB", sku: "KEY-MECH-RGB", currentStock: 80, unit: "unidades", category: "Accesorios" },
  { id: "5", name: "Impresora HP LaserJet", sku: "HP-LASER-PRO", currentStock: 12, unit: "unidades", category: "Impresoras" },
];

const reasonOptions = [
  { label: "Recuento físico", value: "Recuento físico" },
  { label: "Producto dañado", value: "Producto dañado" },
  { label: "Producto vencido", value: "Producto vencido" },
  { label: "Robo/Pérdida", value: "Robo/Pérdida" },
  { label: "Error de sistema", value: "Error de sistema" },
  { label: "Devolución de cliente", value: "Devolución de cliente" },
  { label: "Transferencia entre almacenes", value: "Transferencia entre almacenes" },
  { label: "Corrección de inventario", value: "Corrección de inventario" },
  { label: "Otro", value: "Otro" },
];

export const InventoryAdjustmentsApp: React.FC = () => {
  const [products] = useState<Product[]>(initialProducts);
  const [adjustments, setAdjustments] = useState<Record<string, Adjustment>>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [globalFilter, setGlobalFilter] = useState<string>('');

  const updateAdjustment = (productId: string, field: keyof Adjustment, value: any) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setAdjustments((prev) => {
      const current = prev[productId] || {
        productId,
        currentStock: product.currentStock,
        newQuantity: product.currentStock,
        adjustment: 0,
        reason: '',
        notes: '',
      };

      const updated = { ...current, [field]: value };

      if (field === 'newQuantity') {
        updated.adjustment = updated.newQuantity - product.currentStock;
      }

      return { ...prev, [productId]: updated };
    });
  };

  const incrementQuantity = (productId: string) => {
    const current = adjustments[productId]?.newQuantity || products.find((p) => p.id === productId)?.currentStock || 0;
    updateAdjustment(productId, 'newQuantity', current + 1);
  };

  const decrementQuantity = (productId: string) => {
    const current = adjustments[productId]?.newQuantity || products.find((p) => p.id === productId)?.currentStock || 0;
    if (current > 0) {
      updateAdjustment(productId, 'newQuantity', current - 1);
    }
  };

  const handleSaveAdjustments = () => {
    const adjustmentsToSave = Object.values(adjustments).filter((adj) => adj.adjustment !== 0 && adj.reason);

    if (adjustmentsToSave.length === 0) {
      alert("No hay ajustes para guardar o faltan razones por especificar");
      return;
    }

    console.log("Ajustes a guardar:", adjustmentsToSave);
    alert(`Se guardarán ${adjustmentsToSave.length} ajustes de inventario`);
    setAdjustments({});
  };

  const productTemplate = (rowData: Product) => (
    <div>
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{rowData.name}</div>
      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{rowData.category}</div>
    </div>
  );

  const stockTemplate = (rowData: Product) => (
    <Tag value={`${rowData.currentStock} ${rowData.unit}`} severity="info" />
  );

  const quantityTemplate = (rowData: Product) => {
    const current = adjustments[rowData.id] || {
      productId: rowData.id,
      currentStock: rowData.currentStock,
      newQuantity: rowData.currentStock,
      adjustment: 0,
      reason: '',
      notes: '',
    };

    return (
      <div className="flex align-items-center gap-2">
        <Button icon="pi pi-minus" rounded text onClick={() => decrementQuantity(rowData.id)} />
        <InputNumber
          value={current.newQuantity}
          onValueChange={(e) => updateAdjustment(rowData.id, 'newQuantity', e.value || 0)}
          min={0}
          showButtons
          buttonLayout="horizontal"
          decrementButtonClassName="p-button-secondary"
          incrementButtonClassName="p-button-secondary"
        />
        <Button icon="pi pi-plus" rounded text onClick={() => incrementQuantity(rowData.id)} />
      </div>
    );
  };

  const reasonTemplate = (rowData: Product) => (
    <Dropdown
      value={adjustments[rowData.id]?.reason || ''}
      options={reasonOptions}
      onChange={(e) => updateAdjustment(rowData.id, 'reason', e.value)}
      className="w-full"
      placeholder="Seleccione"
    />
  );

  const notesTemplate = (rowData: Product) => (
    <InputTextarea
      value={adjustments[rowData.id]?.notes || ''}
      onChange={(e) => updateAdjustment(rowData.id, 'notes', e.target.value)}
      rows={1}
      autoResize
      className="w-full"
    />
  );

  const adjustmentTemplate = (rowData: Product) => {
    const adj = adjustments[rowData.id]?.adjustment || 0;
    const severity = adj > 0 ? 'success' : adj < 0 ? 'danger' : 'info';
    return <Tag value={adj} severity={severity} />;
  };

  return (
    <div className="card">
      <Panel header="Ajustes de Inventario">
        <div className="mb-4 flex justify-content-between align-items-center">
          <span className="p-input-icon-left w-50">
            <i className="pi pi-search" />
            <InputText value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar producto" className="w-full" />
          </span>
          <Button label="Guardar Ajustes" icon="pi pi-save" onClick={handleSaveAdjustments} disabled={Object.values(adjustments).filter(a => a.adjustment !== 0 && a.reason).length === 0} />
        </div>

        <DataTable value={products} globalFilter={globalFilter} paginator rows={5} responsiveLayout="scroll">
          <Column header="Producto" body={productTemplate} />
          <Column header="Stock Actual" body={stockTemplate} />
          <Column header="Cantidad Nueva" body={quantityTemplate} />
          <Column header="Ajuste" body={adjustmentTemplate} />
          <Column header="Motivo" body={reasonTemplate} />
          <Column header="Notas" body={notesTemplate} />
        </DataTable>
      </Panel>
    </div>
  );
};
