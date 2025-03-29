import React, { useState, useCallback, useMemo } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { FilterMatchMode, FilterService } from "primereact/api";
import { Toolbar } from "primereact/toolbar";

// Configurar filtros personalizados para PrimeReact
FilterService.register('customSearch', (value, filter) => {
    if (filter === undefined || filter === null || filter.trim() === '') {
        return true;
    }

    if (value === undefined || value === null) {
        return false;
    }

    return value.toString().toLowerCase().includes(filter.toLowerCase());
});

type AccountLevel = 'clase' | 'grupo' | 'cuenta' | 'subcuenta' | 'auxiliar' | 'subauxiliar';

interface Categoria {
    label: string;
    value: string;
}

interface DetalleSaldo {
    label: string;
    value: string;
}

interface Cuenta {
    id: string;
    codigo: string;
    nombre: string;
    nivel: AccountLevel;
    categoria?: string;
    detalleSaldos?: string;
    fiscalDifference: boolean;
    activa: boolean;
    children?: Cuenta[];
}

interface TableRow {
    tipo: string;
    codigo: string;
    nombre: string;
}

interface NewAccountForm {
    tipo: AccountLevel;
    codigo: string;
    nombre: string;
    categoria?: string;
    detalleSaldos?: string;
    fiscalDifference: boolean;
    activa: boolean;
}

const initialCuentas: Cuenta[] = [
    {
        id: "1",
        codigo: "1",
        nombre: "Activo",
        nivel: "clase",
        fiscalDifference: false,
        activa: true,
        children: [
            {
                id: "1-1",
                codigo: "11",
                nombre: "Activo Corriente",
                nivel: "grupo",
                fiscalDifference: false,
                activa: true,
                children: [
                    {
                        id: "1-1-1",
                        codigo: "1105",
                        nombre: "Caja y Bancos",
                        nivel: "cuenta",
                        fiscalDifference: false,
                        activa: true,
                        children: [
                            {
                                id: "1-1-1-1",
                                codigo: "110505",
                                nombre: "Bancos nacionales",
                                nivel: "subcuenta",
                                fiscalDifference: false,
                                activa: true,
                                children: [
                                    {
                                        id: "1-1-1-1-1",
                                        codigo: "11050501",
                                        nombre: "Banco de Bogotá",
                                        nivel: "auxiliar",
                                        fiscalDifference: false,
                                        activa: true,
                                        children: [
                                            {
                                                id: "1-1-1-1-1-1",
                                                codigo: "1105050101",
                                                nombre: "Cuenta Corriente",
                                                nivel: "subauxiliar",
                                                fiscalDifference: false,
                                                activa: true
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "2",
        codigo: "2",
        nombre: "Pasivo",
        nivel: "clase",
        fiscalDifference: false,
        activa: true,
        children: [
            {
                id: "2-1",
                codigo: "21",
                nombre: "Pasivo Corriente",
                nivel: "grupo",
                fiscalDifference: false,
                activa: true,
                children: [
                    {
                        id: "2-1-1",
                        codigo: "2105",
                        nombre: "Obligaciones Bancarias",
                        nivel: "cuenta",
                        fiscalDifference: false,
                        activa: true,
                        children: [
                            {
                                id: "2-1-1-1",
                                codigo: "210505",
                                nombre: "Préstamos a Corto Plazo",
                                nivel: "subcuenta",
                                fiscalDifference: false,
                                activa: true
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "3",
        codigo: "3",
        nombre: "Patrimonio",
        nivel: "clase",
        fiscalDifference: false,
        activa: true,
        children: [
            {
                id: "3-1",
                codigo: "31",
                nombre: "Capital Social",
                nivel: "grupo",
                fiscalDifference: false,
                activa: true,
                children: [
                    {
                        id: "3-1-1",
                        codigo: "3105",
                        nombre: "Acciones Ordinarias",
                        nivel: "cuenta",
                        fiscalDifference: false,
                        activa: true
                    }
                ]
            }
        ]
    }
];

const categorias: Categoria[] = [
    { label: "Caja - bancos", value: "Caja - bancos" },
    { label: "Cuentas por cobrar", value: "Cuentas por cobrar" },
    { label: "Otros activos corrientes", value: "Otros activos corrientes" },
];

const detalleSaldos: DetalleSaldo[] = [
    { label: "Sin detalle de vencimientos", value: "Sin detalle de vencimientos" },
    { label: "Clientes, controla vencimientos y estados de cuenta", value: "Clientes, controla vencimientos y estados de cuenta" },
    { label: "Proveedores, controla vencimientos y estado de cuenta", value: "Proveedores, controla vencimientos y estado de cuenta" },
];

const accountLevels = [
    { label: 'Clase', value: 'clase' },
    { label: 'Grupo', value: 'grupo' },
    { label: 'Cuenta', value: 'cuenta' },
    { label: 'SubCuenta', value: 'subcuenta' },
    { label: 'Auxiliar', value: 'auxiliar' },
    { label: 'SubAuxiliar', value: 'subauxiliar' }
];

export const AccountingAccounts: React.FC = () => {
    // Estados principales
    const [cuentas, setCuentas] = useState<Cuenta[]>(initialCuentas);
    const [tableData, setTableData] = useState<TableRow[]>([]);
    const [activeAccordionKeys, setActiveAccordionKeys] = useState<{ [key: string]: number[] }>({});
    const [selectedPath, setSelectedPath] = useState<Cuenta[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<Cuenta | null>(null);

    // Filtros mejorados con PrimeReact
    const [filters, setFilters] = useState({
        codigo: { value: '', matchMode: 'customSearch' },
        nombre: { value: '', matchMode: 'customSearch' }
    });

    // Estados del formulario
    const [fiscalChecked, setFiscalChecked] = useState<boolean>(false);
    const [activaChecked, setActivaChecked] = useState<boolean>(true);
    const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
    const [selectedDetalle, setSelectedDetalle] = useState<DetalleSaldo | null>(null);
    const [showNewAccountDialog, setShowNewAccountDialog] = useState<boolean>(false);
    const [showNewComponentDialog, setShowNewComponentDialog] = useState<boolean>(false);
    const [newAccount, setNewAccount] = useState<NewAccountForm>({
        tipo: 'clase',
        codigo: '',
        nombre: '',
        fiscalDifference: false,
        activa: true
    });

    // Función para encontrar la ruta de un nodo
    const findNodePath = useCallback((nodes: Cuenta[], id: string, path: Cuenta[] = []): Cuenta[] | null => {
        for (const node of nodes) {
            if (node.id === id) return [...path, node];
            if (node.children) {
                const found = findNodePath(node.children, id, [...path, node]);
                if (found) return found;
            }
        }
        return null;
    }, []);

    // Función para obtener índices activos basados en la ruta
    const getActiveIndexesFromPath = useCallback((nodes: Cuenta[], path: Cuenta[]): { [key: string]: number[] } => {
        let currentNodes = nodes;
        const activeIndexes: { [key: string]: number[] } = {};
        let currentPath = 'root';

        for (const pathNode of path.slice(0, -1)) {
            const index = currentNodes.findIndex(n => n.id === pathNode.id);
            if (index === -1) break;

            if (!activeIndexes[currentPath]) {
                activeIndexes[currentPath] = [];
            }

            if (!activeIndexes[currentPath].includes(index)) {
                activeIndexes[currentPath].push(index);
            }

            currentNodes = currentNodes[index].children || [];
            currentPath = pathNode.id;
        }
        return activeIndexes;
    }, []);

    // Manejador de selección de cuenta
    const handleAccountSelect = useCallback((id: string, parentId?: string, event?: React.MouseEvent) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const path = findNodePath(cuentas, id);
        if (path) {
            const account = path[path.length - 1];
            setSelectedAccount(account);
            setSelectedPath(path);
            setTableData(path.map(node => ({
                tipo: node.nivel.charAt(0).toUpperCase() + node.nivel.slice(1),
                codigo: node.codigo,
                nombre: node.nombre
            })));

            const newActiveIndexes = getActiveIndexesFromPath(cuentas, path);
            setActiveAccordionKeys(prev => {
                // If clicking on the same parent, toggle the accordion
                if (parentId) {
                    const parentNodes = parentId === 'root' ? cuentas :
                        cuentas.flatMap(c => c.children || []).find(c => c.id === parentId)?.children || [];
                    const index = parentNodes.findIndex(n => n.id === id);

                    if (prev[parentId]?.includes(index)) {
                        return {
                            ...prev,
                            [parentId]: prev[parentId].filter(i => i !== index)
                        };
                    }
                }
                return newActiveIndexes;
            });

            // Set form values from selected account
            setFiscalChecked(account.fiscalDifference);
            setActivaChecked(account.activa);
            setSelectedCategoria(account.categoria ?
                categorias.find(c => c.value === account.categoria) || null : null);
            setSelectedDetalle(account.detalleSaldos ?
                detalleSaldos.find(d => d.value === account.detalleSaldos) || null : null);
        }
    }, [cuentas, findNodePath, getActiveIndexesFromPath]);

    // Renderizar acordeón con indentación
    const renderAccordion = useCallback((data: Cuenta[], depth: number = 0, parentId: string = 'root'): React.ReactNode[] => {
        return data.map((item, index) => {
            const hasContent = item.children && item.children.length > 0;
            const isActive = activeAccordionKeys[parentId]?.includes(index) || false;

            return (
                <AccordionTab
                    key={item.id}
                    header={
                        <div
                            className="accordion-header-content"
                            onClick={(e) => handleAccountSelect(item.id, parentId, e)}
                            style={{ paddingLeft: `${depth * 1.5}rem` }}
                        >
                            <span className="account-code">{item.codigo}</span>
                            <span className="account-name">{item.nombre}</span>
                            {hasContent && <i className={`pi pi-chevron-${isActive ? 'down' : 'right'} accordion-arrow`}></i>}
                        </div>
                    }
                >
                    {hasContent && (
                        <Accordion
                            multiple
                            activeIndex={activeAccordionKeys[item.id] || []}
                            onTabChange={(e) => {
                                setActiveAccordionKeys(prev => ({
                                    ...prev,
                                    [item.id]: e.index as number[]
                                }));
                            }}
                        >
                            {renderAccordion(item.children || [], depth + 1, item.id)}
                        </Accordion>
                    )}
                </AccordionTab>
            );
        });
    }, [activeAccordionKeys, handleAccountSelect]);

    // Filtrar cuentas con PrimeReact
    const filteredCuentas = useMemo(() => {
        if (!filters.codigo.value && !filters.nombre.value) return cuentas;

        const filterNodes = (nodes: Cuenta[]): Cuenta[] => {
            return nodes
                .map(node => {
                    const matchesCode = !filters.codigo.value ||
                        node.codigo.toLowerCase().includes(filters.codigo.value.toLowerCase());
                    const matchesName = !filters.nombre.value ||
                        node.nombre.toLowerCase().includes(filters.nombre.value.toLowerCase());

                    const filteredChildren = node.children ? filterNodes(node.children) : undefined;

                    if (matchesCode || matchesName || (filteredChildren && filteredChildren.length > 0)) {
                        return { ...node, children: filteredChildren };
                    }
                    return null;
                })
                .filter(node => node !== null) as Cuenta[];
        };

        return filterNodes(cuentas);
    }, [cuentas, filters]);

    const accordionContent = useMemo(() =>
        renderAccordion(filteredCuentas, 0),
        [filteredCuentas, renderAccordion]
    );

    // Manejadores de eventos
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAccount) return;

        // Actualizar la cuenta seleccionada
        const updatedAccount = {
            ...selectedAccount,
            fiscalDifference: fiscalChecked,
            activa: activaChecked,
            categoria: selectedCategoria?.value,
            detalleSaldos: selectedDetalle?.value
        };

        // Función para actualizar el árbol de cuentas
        const updateAccounts = (nodes: Cuenta[]): Cuenta[] => {
            return nodes.map(node => {
                if (node.id === selectedAccount.id) {
                    return updatedAccount;
                }
                if (node.children) {
                    return {
                        ...node,
                        children: updateAccounts(node.children)
                    };
                }
                return node;
            });
        };

        setCuentas(updateAccounts(cuentas));
    };

    const handleCreateAccount = () => {
        if (!newAccount.codigo || !newAccount.nombre) return;

        const newAccountNode: Cuenta = {
            id: `new-${Date.now()}`,
            codigo: newAccount.codigo,
            nombre: newAccount.nombre,
            nivel: newAccount.tipo,
            fiscalDifference: newAccount.fiscalDifference,
            activa: newAccount.activa,
            categoria: newAccount.categoria,
            detalleSaldos: newAccount.detalleSaldos
        };

        // Lógica para agregar la nueva cuenta al árbol
        if (selectedAccount) {
            // Agregar como hijo de la cuenta seleccionada
            const addToParent = (nodes: Cuenta[]): Cuenta[] => {
                return nodes.map(node => {
                    if (node.id === selectedAccount.id) {
                        return {
                            ...node,
                            children: [...(node.children || []), newAccountNode]
                        };
                    }
                    if (node.children) {
                        return {
                            ...node,
                            children: addToParent(node.children)
                        };
                    }
                    return node;
                });
            };

            setCuentas(addToParent(cuentas));
        } else {
            // Agregar como nueva cuenta de nivel superior
            setCuentas([...cuentas, newAccountNode]);
        }

        setShowNewAccountDialog(false);
        setNewAccount({
            tipo: 'clase',
            codigo: '',
            nombre: '',
            fiscalDifference: false,
            activa: true
        });
    };

    const handleCreateComponent = () => {
        // Lógica para crear un nuevo componente
        setShowNewComponentDialog(false);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="d-flex gap-2">
                <Button
                    label="Nuevo Componente"
                    icon="pi pi-plus"
                    className="p-button-success"
                    onClick={() => setShowNewComponentDialog(true)}
                />
                <Button
                    label="Nueva Cuenta"
                    icon="pi pi-plus"
                    className="p-button-primary"
                    onClick={() => setShowNewAccountDialog(true)}
                />
            </div>
        );
    };

    return (
        <div className="accounting-container container-fluid py-4">
            <Card className="main-card shadow-sm">
                <div className="card-header bg-light">
                    <Toolbar left={leftToolbarTemplate} />
                </div>

                <div className="card-body p-3">
                    <div className="row g-3">
                        {/* Columna izquierda - Plan de cuentas */}
                        <div className="col-lg-6">
                            <Card className="h-100 border-0 shadow-sm">
                                <div className="card-header bg-light">
                                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                                        <h3 className="h5 mb-3 mb-md-0">Estructura Contable</h3>
                                        <div className="d-flex gap-2 w-100 w-md-auto">
                                            <span className="p-float-label flex-grow-1">
                                                <InputText
                                                    id="searchCode"
                                                    value={filters.codigo.value}
                                                    onChange={(e) => setFilters({
                                                        ...filters,
                                                        codigo: { ...filters.codigo, value: e.target.value }
                                                    })}
                                                    className="w-100"
                                                />
                                                <label htmlFor="searchCode">Código</label>
                                            </span>
                                            <span className="p-float-label flex-grow-1">
                                                <InputText
                                                    id="searchName"
                                                    value={filters.nombre.value}
                                                    onChange={(e) => setFilters({
                                                        ...filters,
                                                        nombre: { ...filters.nombre, value: e.target.value }
                                                    })}
                                                    className="w-100"
                                                />
                                                <label htmlFor="searchName">Nombre</label>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body p-0">
                                    <div className="account-accordion-container">
                                        <Accordion
                                            multiple
                                            activeIndex={activeAccordionKeys['root'] || []}
                                            onTabChange={(e) => {
                                                setActiveAccordionKeys(prev => ({
                                                    ...prev,
                                                    ['root']: e.index as number[]
                                                }));
                                            }}
                                        >
                                            {accordionContent}
                                        </Accordion>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Columna derecha - Detalle y características */}
                        <div className="col-lg-6">
                            <div className="d-flex flex-column gap-3 h-100">
                                <Card className="border-0 shadow-sm">
                                    <div className="card-header bg-light d-flex justify-content-between align-items-center">
                                        <h3 className="h5 m-0">Jerarquía de la Cuenta</h3>
                                        <Button
                                            label="Nueva Subcuenta"
                                            icon="pi pi-plus"
                                            className="p-button-sm p-button-outlined"
                                            onClick={() => setShowNewAccountDialog(true)}
                                            disabled={!selectedAccount}
                                        />
                                    </div>
                                    <div className="card-body p-2">
                                        <DataTable
                                            value={tableData}
                                            emptyMessage="Seleccione una cuenta del plan"
                                            className="p-datatable-sm"
                                            scrollable
                                            scrollHeight="200px"
                                        >
                                            <Column
                                                field="tipo"
                                                header="Nivel"
                                                style={{ width: '25%' }}
                                                body={(rowData: TableRow) => (
                                                    <span className={`level-${rowData.tipo.toLowerCase()}`}>
                                                        {rowData.tipo}
                                                    </span>
                                                )}
                                            />
                                            <Column field="codigo" header="Código" style={{ width: '25%' }} />
                                            <Column field="nombre" header="Nombre" style={{ width: '50%' }} />
                                        </DataTable>
                                    </div>
                                </Card>

                                <Card className="border-0 shadow-sm flex-grow-1">
                                    <div className="card-header bg-light">
                                        <h3 className="h5 m-0">Características de la Cuenta</h3>
                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit} className="d-flex flex-column h-100">
                                            <div className="row g-3 mb-3">
                                                <div className="col-12">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label fw-bold">Categoría</label>
                                                        <Dropdown
                                                            value={selectedCategoria}
                                                            options={categorias}
                                                            onChange={(e) => setSelectedCategoria(e.value)}
                                                            optionLabel="label"
                                                            placeholder="Seleccione categoría"
                                                            className="w-100"
                                                            disabled={!selectedAccount}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="form-group mb-3">
                                                        <label className="form-label fw-bold">Detalle de saldos</label>
                                                        <Dropdown
                                                            value={selectedDetalle}
                                                            options={detalleSaldos}
                                                            onChange={(e) => setSelectedDetalle(e.value)}
                                                            optionLabel="label"
                                                            placeholder="Seleccione opción"
                                                            className="w-100"
                                                            disabled={!selectedAccount}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-check">
                                                        <Checkbox
                                                            inputId="fiscalDifference"
                                                            checked={fiscalChecked}
                                                            onChange={(e) => setFiscalChecked(e.checked ?? false)}
                                                            className="form-check-input"
                                                            disabled={!selectedAccount}
                                                        />
                                                        <label htmlFor="fiscalDifference" className="form-check-label">
                                                            Cuenta de diferencia fiscal
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-check">
                                                        <Checkbox
                                                            inputId="active"
                                                            checked={activaChecked}
                                                            onChange={(e) => setActivaChecked(e.checked ?? false)}
                                                            className="form-check-input"
                                                            disabled={!selectedAccount}
                                                        />
                                                        <label htmlFor="active" className="form-check-label">
                                                            Cuenta activa
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-auto d-flex gap-2 justify-content-end">
                                                <Button
                                                    label="Cancelar"
                                                    icon="pi pi-times"
                                                    className="p-button-outlined p-button-danger rounded-pill"
                                                    disabled={!selectedAccount}
                                                />
                                                <Button
                                                    label="Guardar"
                                                    icon="pi pi-save"
                                                    className="p-button-primary rounded-pill"
                                                    type="submit"
                                                    disabled={!selectedAccount}
                                                />
                                            </div>
                                        </form>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Diálogo para nueva cuenta */}
            <Dialog
                header="Crear Nueva Cuenta"
                visible={showNewAccountDialog}
                style={{ width: '50vw' }}
                onHide={() => setShowNewAccountDialog(false)}
                footer={
                    <div>
                        <Button label="Cancelar" icon="pi pi-times" onClick={() => setShowNewAccountDialog(false)} className="p-button-text" />
                        <Button label="Crear" icon="pi pi-check" onClick={handleCreateAccount} autoFocus />
                    </div>
                }
            >
                <div className="p-fluid">
                    <div className="field">
                        <label htmlFor="accountType">Tipo de Cuenta</label>
                        <Dropdown
                            id="accountType"
                            value={newAccount.tipo}
                            options={accountLevels}
                            onChange={(e) => setNewAccount({ ...newAccount, tipo: e.value })}
                            optionLabel="label"
                            placeholder="Seleccione el tipo"
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="accountCode">Código *</label>
                        <InputText
                            id="accountCode"
                            value={newAccount.codigo}
                            onChange={(e) => setNewAccount({ ...newAccount, codigo: e.target.value })}
                            required
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="accountName">Nombre *</label>
                        <InputText
                            id="accountName"
                            value={newAccount.nombre}
                            onChange={(e) => setNewAccount({ ...newAccount, nombre: e.target.value })}
                            required
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="accountCategory">Categoría</label>
                        <Dropdown
                            id="accountCategory"
                            value={selectedCategoria}
                            options={categorias}
                            onChange={(e) => setSelectedCategoria(e.value)}
                            optionLabel="label"
                            placeholder="Seleccione categoría"
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="accountDetail">Detalle de saldos</label>
                        <Dropdown
                            id="accountDetail"
                            value={selectedDetalle}
                            options={detalleSaldos}
                            onChange={(e) => setSelectedDetalle(e.value)}
                            optionLabel="label"
                            placeholder="Seleccione opción"
                        />
                    </div>
                    <div className="field-checkbox">
                        <Checkbox
                            inputId="newFiscalDifference"
                            checked={newAccount.fiscalDifference}
                            onChange={(e) => setNewAccount({ ...newAccount, fiscalDifference: e.checked ?? false })}
                        />
                        <label htmlFor="newFiscalDifference">Cuenta de diferencia fiscal</label>
                    </div>
                    <div className="field-checkbox">
                        <Checkbox
                            inputId="newActive"
                            checked={newAccount.activa}
                            onChange={(e) => setNewAccount({ ...newAccount, activa: e.checked ?? false })}
                        />
                        <label htmlFor="newActive">Cuenta activa</label>
                    </div>
                </div>
            </Dialog>

            {/* Diálogo para nuevo componente */}
            <Dialog
                header="Crear Nuevo Componente"
                visible={showNewComponentDialog}
                style={{ width: '50vw' }}
                onHide={() => setShowNewComponentDialog(false)}
                footer={
                    <div>
                        <Button label="Cancelar" icon="pi pi-times" onClick={() => setShowNewComponentDialog(false)} className="p-button-text" />
                        <Button label="Crear" icon="pi pi-check" onClick={handleCreateComponent} autoFocus />
                    </div>
                }
            >
                <div className="p-fluid">
                    <div className="field">
                        <label htmlFor="componentName">Nombre del Componente *</label>
                        <InputText
                            id="componentName"
                            placeholder="Ingrese el nombre del componente"
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="componentDescription">Descripción</label>
                        <InputText
                            id="componentDescription"
                            placeholder="Ingrese una descripción"
                        />
                    </div>
                </div>
            </Dialog>

            <style>{`
                .main-card {
                    border: none;
                }
                
                .card-header {
                    padding: 1rem 1.5rem;
                    border-bottom: 1px solid #e0e0e0;
                }
                
                .card-body {
                    padding: 1.5rem;
                }
                
                .account-accordion-container {
                    max-height: 60vh;
                }
                
                .accordion-header-content {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 1rem;
                    padding: 0.75rem 1rem;
                    transition: all 0.2s;
                    cursor: pointer;
                    border-bottom: 1px solid #eee;
                }
                
                .accordion-header-content:hover {
                    background-color: #f8f9fa;
                }
                
                .account-code {
                    font-weight: 600;
                    color: #2c3e50;
                    width: 80px;
                    flex-shrink: 0;
                    font-family: 'Roboto Mono', monospace;
                }
                
                .account-name {
                    color: #34495e;
                    flex-grow: 1;
                    font-size: medium !important;
                }
                
                .p-accordion .p-accordion-tab {
                    margin-bottom: 0.25rem;
                    border-radius: 4px;
                    overflow: hidden;
                }
                
                .p-accordion-header-link {
                    background: none !important;
                    border: none !important;
                    padding: 0 !important;
                }
                
                .p-accordion-content {
                    background-color: #fff !important;
                    border-left: 2px solid #3b82f6 !important;
                    margin-left: 1rem;
                    padding: 0.5rem !important;
                }
                
                .accordion-arrow {
                    transition: transform 0.2s;
                    margin-left: auto;
                }
                
                /* Estilos para la jerarquía en la tabla */
                .level-clase {
                    font-weight: bold;
                    color: #1e40af;
                }
                
                .level-grupo {
                    font-weight: bold;
                    color: #1e3a8a;
                }
                
                .level-cuenta {
                    color: #1e3a8a;
                }
                
                .level-subcuenta {
                    color: #4338ca;
                }
                
                .level-auxiliar {
                    color: #6b21a8;
                }
                
                .level-subauxiliar {
                    color: #86198f;
                }
                
                .form-label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: #495057;
                }
                
                .field {
                    margin-bottom: 1.5rem;
                }
                
                .field-checkbox {
                    margin: 1.5rem 0;
                    display: flex;
                    align-items: center;
                }
                
                .field-checkbox label {
                    margin-left: 0.5rem;
                }
                
                .p-datatable .p-datatable-tbody > tr > td {
                    padding: 0.5rem 1rem;
                }
                
                @media (max-width: 768px) {
                    .account-code {
                        width: 60px;
                    }
                    
                    .accordion-header-content {
                        padding: 0.5rem;
                    }
                    
                    .card-body {
                        padding: 1rem;
                    }
                }
            `}</style>
        </div>
    );
};