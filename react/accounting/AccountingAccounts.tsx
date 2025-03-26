import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

interface Categoria {
    label: string;
    value: string;
}

interface DetalleSaldo {
    label: string;
    value: string;
}

interface Cuenta {
    key: string;
    codigo: string;
    cuenta: string;
    nivel: number;
    children?: Cuenta[];
}

const cuentasData = [
    { code: 1, name: "Activo" },
    { code: 2, name: "Pasivo" },
    { code: 3, name: "Patrimonio" },
    { code: 4, name: "Ingresos" },
    { code: 5, name: "Gasto" },
    { code: 6, name: "Costos de venta" },
    { code: 7, name: "Costos de producción" },
    { code: 8, name: "Cuentas de orden deudoras" },
    { code: 9, name: "Cuentas de orden acreedoras" },
];

const categorias: Categoria[] = [
    { label: "Caja - bancos", value: "Caja - bancos" },
    { label: "Cuentas por cobrar", value: "Cuentas por cobrar" },
    { label: "Otros activos corrientes", value: "Otros activos corrientes" },
    { label: "Inventarios", value: "Inventarios" },
    { label: "Activos fijos", value: "Activos fijos" },
    { label: "Otros Activos", value: "Otros Activos" },
    { label: "Cuentas por pagar", value: "Cuentas por pagar" },
    { label: "Otros pasivos corrientes", value: "Otros pasivos corrientes" },
    { label: "Pasivo corto plazo", value: "Pasivo corto plazo" },
    { label: "Pasivo largos plazos", value: "Pasivo largos plazos" },
    { label: "Otros pasivos", value: "Otros pasivos" },
    { label: "Patrimonio", value: "Patrimonio" },
];

const detalleSaldos: DetalleSaldo[] = [
    {
        label: "Sin detalle de vencimientos",
        value: "Sin detalle de vencimientos",
    },
    {
        label: "Clientes, controla vencimientos y estados de cuenta",
        value: "Clientes, controla vencimientos y estados de cuenta",
    },
    {
        label: "Proveedores, controla vencimientos y estado de cuenta",
        value: "Proveedores, controla vencimientos y estado de cuenta",
    },
];

export const AccountingAccounts: React.FC = () => {
    const [fiscalChecked, setFiscalChecked] = useState<boolean>(false);
    const [activaChecked, setActivaChecked] = useState<boolean>(false);
    const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
    const [selectedDetalle, setSelectedDetalle] = useState<DetalleSaldo | null>(null);
    const [searchCode, setSearchCode] = useState<string>("");
    const [searchName, setSearchName] = useState<string>("");
    const [expandedRows, setExpandedRows] = useState<any>(null);

    // Estructura jerárquica de cuentas contables
    const cuentas: Cuenta[] = [
        {
            key: "1",
            codigo: "1",
            cuenta: "Activo",
            nivel: 1,
            children: [
                {
                    key: "1-1",
                    codigo: "11",
                    cuenta: "Activo Corriente",
                    nivel: 2,
                    children: [
                        {
                            key: "1-1-1",
                            codigo: "1105",
                            cuenta: "Caja y Bancos",
                            nivel: 3,
                            children: [
                                {
                                    key: "1-1-1-1",
                                    codigo: "110505",
                                    cuenta: "Bancos nacionales",
                                    nivel: 4,
                                    children: [
                                        {
                                            key: "1-1-1-1-1",
                                            codigo: "11050501",
                                            cuenta: "Banco de Bogotá",
                                            nivel: 5,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            key: "2",
            codigo: "2",
            cuenta: "Pasivo",
            nivel: 1,
            children: [
                {
                    key: "2-1",
                    codigo: "21",
                    cuenta: "Pasivo Corriente",
                    nivel: 2,
                    children: [
                        {
                            key: "2-1-1",
                            codigo: "2105",
                            cuenta: "Bancos nacionales",
                            nivel: 3,
                            children: [
                                {
                                    key: "2-1-1-1",
                                    codigo: "210510",
                                    cuenta: "Pagares",
                                    nivel: 4,
                                    children: [
                                        {
                                            key: "2-1-1-1-1",
                                            codigo: "21051001",
                                            cuenta: "Colpatria costo amortizado",
                                            nivel: 5,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ];

    // Filtrado de cuentas basado en el código o nombre
    const filterCuentas = (cuentas: Cuenta[], searchCode: string, searchName: string): Cuenta[] => {
        return cuentas
            .map((cuenta) => {
                const matchesCode = searchCode === "" || cuenta.codigo.includes(searchCode);
                const matchesName = searchName === "" || cuenta.cuenta.toLowerCase().includes(searchName.toLowerCase());

                let filteredChildren: Cuenta[] | undefined = cuenta.children
                    ? filterCuentas(cuenta.children, searchCode, searchName)
                    : undefined;

                if (matchesCode || matchesName || (filteredChildren && filteredChildren.length > 0)) {
                    return { ...cuenta, children: filteredChildren };
                }
                return null;
            })
            .filter((cuenta) => cuenta !== null) as Cuenta[];
    };

    // Función para expandir/colapsar todos
    const toggleAll = () => {
        if (expandedRows) {
            setExpandedRows(null);
        } else {
            const expanded: Record<string, boolean> = {};
            const expandAll = (cuentas: Cuenta[]) => {
                cuentas.forEach((c) => {
                    expanded[c.key] = true;
                    if (c.children) expandAll(c.children);
                });
            };
            expandAll(cuentas);
            setExpandedRows(expanded);
        }
    };

    // Cuentas filtradas
    const filteredCuentas = filterCuentas(cuentas, searchCode, searchName);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({
            fiscal: fiscalChecked,
            activa: activaChecked,
            categoria: selectedCategoria,
            detalle: selectedDetalle
        });
    };

    return (
        <div className="container mt-4 w-100">
            <div className="card">
                <div className="card-header flex justify-content-between align-items-center">
                    <h2 className="m-0">Cuentas Contables</h2>
                </div>
                <div className="d-flex justify-content-end gap-2 mt-3 px-3">
                    <button className="btn-add">+ Nuevo componente contable</button>
                    <div className="dropdown">
                        <button className="btn-dropdown">+ Nueva</button>
                        <div className="dropdown-content">
                            <a href="#">Recibo Pago</a>
                            <a href="#">Recibo caja</a>
                        </div>
                    </div>
                </div>

                <div className="card-body">
                    {/* Contenedor para búsquedas y tablas */}
                    <div className="row">
                        {/* Columna izquierda */}
                        <div className="col-md-6 pe-2">
                            {/* Fila de búsqueda */}
                            <div className="row mb-4 g-3 align-items-end">
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Código</label>
                                    <InputText
                                        value={searchCode}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchCode(e.target.value)}
                                        placeholder="Buscar código"
                                        className="w-100"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Cuenta</label>
                                    <InputText
                                        value={searchName}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchName(e.target.value)}
                                        placeholder="Buscar nombre"
                                        className="w-100"
                                    />
                                </div>
                            </div>

                            {/* Botón de expansión */}
                            <div className="mb-2">
                                <Button onClick={toggleAll} className="p-button-sm p-button-outlined">
                                    {expandedRows ? "Colapsar Todo" : "Expandir Todo"}
                                </Button>
                            </div>

                            {/* Tabla */}
                            <div className="table-responsive">
                                <DataTable
                                    value={filteredCuentas}
                                    expandedRows={expandedRows}
                                    onRowToggle={(e: any) => setExpandedRows(e.data)}
                                    rowExpansionTemplate={(data: Cuenta) => (
                                        <div style={{ paddingLeft: `${data.nivel * 20}px` }}>
                                            {data.children?.map((child) => (
                                                <div key={child.key} style={{ paddingLeft: "20px" }}>
                                                    {child.cuenta} ({child.codigo})
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    paginator
                                    rows={10}
                                    rowsPerPageOptions={[5, 10, 25]}
                                    className="p-datatable-sm"
                                >
                                    <Column expander style={{ width: "3em" }} />
                                    <Column field="codigo" header="Código" sortable className="text-center" style={{ width: "25%" }} />
                                    <Column
                                        header="Cuenta Contable"
                                        body={(rowData: Cuenta) => (
                                            <div
                                                style={{
                                                    paddingLeft: `${(rowData.nivel - 1) * 20}px`,
                                                    fontWeight: rowData.nivel === 1 ? "bold" : "normal",
                                                }}
                                            >
                                                {rowData.cuenta}
                                            </div>
                                        )}
                                        sortable
                                        style={{ width: "72%" }}
                                    />
                                </DataTable>
                            </div>
                        </div>

                        {/* Columna derecha - Parte superior (Detalle de Cuentas) */}
                        <div className="col-md-6 ps-2">
                            <div className="card mb-3">
                                <div className="card-header">
                                    <h3 className="text-center">Detalle de Cuentas</h3>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <DataTable
                                            value={[
                                                { tipo: "Clase", codigo: "1", nombre: "Activo" },
                                                {
                                                    tipo: "Grupo",
                                                    codigo: "11",
                                                    nombre: "Deudores comerciales",
                                                },
                                                {
                                                    tipo: "Cuenta",
                                                    codigo: "05",
                                                    nombre: "Clientes nacionales",
                                                },
                                                {
                                                    tipo: "subCuenta",
                                                    codigo: "05",
                                                    nombre: "Fiscal de clientes",
                                                },
                                                {
                                                    tipo: "Auxiliar",
                                                    codigo: "11",
                                                    nombre: "Fiscal de clientes nacionales",
                                                },
                                            ]}
                                            className="p-datatable-sm"
                                        >
                                            <Column
                                                field="tipo"
                                                header="Tipo"
                                                className="text-center"
                                            />
                                            <Column
                                                field="codigo"
                                                header="Código"
                                                className="text-center"
                                            />
                                            <Column
                                                field="nombre"
                                                header="Nombre"
                                                className="text-center"
                                            />
                                        </DataTable>
                                    </div>
                                </div>
                            </div>

                            {/* Nuevo contenedor para el formulario */}
                            <div className="card">
                                <div className="card-header">
                                    <div className="row align-items-center">
                                        <div className="col">
                                            <h3 className="m-0 text-center">
                                                Característica Transaccional
                                            </h3>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        {/* Cabecera del form */}
                                        <div className="row mb-3 border-bottom pb-2">
                                            <div className="col-md-6">
                                                <h5 className="m-0">Relacionado con</h5>
                                            </div>
                                            <div className="col-md-6">
                                                <h5 className="m-0">Sin asignar</h5>
                                            </div>
                                        </div>

                                        <div className="row">
                                            {/* Columna izquierda - Selects */}
                                            <div className="col-md-6">
                                                <div className="mb-3 row align-items-center">
                                                    <label className="col-sm-5 col-form-label text-end pe-3 fw-bold">
                                                        Categoría:
                                                    </label>
                                                    <div className="col-sm-7">
                                                        <Dropdown
                                                            value={selectedCategoria}
                                                            onChange={(e) => setSelectedCategoria(e.value)}
                                                            options={categorias}
                                                            optionLabel="label"
                                                            placeholder="Seleccione categoría"
                                                            className="w-100"
                                                            panelClassName="shadow-sm"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mb-3 row align-items-center">
                                                    <label className="col-sm-5 col-form-label text-end pe-3 fw-bold">
                                                        Detallar saldos:
                                                    </label>
                                                    <div className="col-sm-7">
                                                        <Dropdown
                                                            value={selectedDetalle}
                                                            onChange={(e) => setSelectedDetalle(e.value)}
                                                            options={detalleSaldos}
                                                            optionLabel="label"
                                                            placeholder="Seleccione opción"
                                                            className="w-100"
                                                            panelClassName="shadow-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Columna derecha - Checkboxes */}
                                            <div className="col-md-6">
                                                <div className="h-100 d-flex flex-column justify-content-center">
                                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                                        <label htmlFor="fiscal" className="form-check-label fw-bold pe-2 mb-0">
                                                            Cuenta de diferencia fiscal:
                                                        </label>
                                                        <div className="form-check ps-0">
                                                            <Checkbox
                                                                inputId="fiscal"
                                                                checked={fiscalChecked}
                                                                onChange={(e: CheckboxChangeEvent) => setFiscalChecked(e.checked ?? false)}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <label htmlFor="activa" className="form-check-label fw-bold pe-2 mb-0">
                                                            Activa:
                                                        </label>
                                                        <div className="form-check ps-0">
                                                            <Checkbox
                                                                inputId="activa"
                                                                checked={activaChecked}
                                                                onChange={(e: CheckboxChangeEvent) => setActivaChecked(e.checked ?? false)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-center gap-2 mt-4">
                                            <button className="btn-add" type="button">
                                                <i className="fas fa-trash-alt me-2"></i>
                                                Borrar Auxiliar
                                            </button>

                                            <button type="submit" className="btn-add">
                                                <i className="fas fa-save me-2"></i>
                                                Guardar
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                h3 {
                    font-size: 1.2rem;
                    font-weight: 700;
                }
                .btn-add {  
                    background-color: #003C4A;
                    color: white;  
                    border: none;  
                    padding: 10px 20px;  
                    cursor: pointer;  
                    border-radius: 5px;
                }  
                .btn-dropdown {  
                    background-color: #cfe3f7;  
                    color: #003C4A;  
                    border: none;  
                    padding: 10px 20px;  
                    cursor: pointer;  
                    border-radius: 5px;  
                    position: relative;
                }  
                .dropdown {
                    position: relative;
                    display: inline-block;
                }
                .dropdown-content {  
                    display: none;
                    position: absolute;
                    background-color: white;  
                    border: 1px solid #ccc;  
                    z-index: 1;  
                    width: 130px;
                }  
                .dropdown:hover .dropdown-content {  
                    display: block;
                }  
                .dropdown-content a {  
                    display: block;
                    padding: 10px;  
                    color: #003C4A;  
                    text-decoration: none;  
                }  
                .dropdown-content a:hover {  
                    background-color: #f1f1f1;
                } 
                .p-datatable .p-datatable-thead > tr > th,
                .p-datatable .p-datatable-tbody > tr > td {
                    text-align: center !important;
                }
                .p-column-header-content {
                    justify-content: center !important;
                    width: 100%;
                }
                .p-sortable-column-icon {
                    margin-left: 0.5rem;
                }
                .card {
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                }
                .card-header {
                    background-color: #f8f9fa;
                    border-bottom: 1px solid #e0e0e0;
                }
                @media (max-width: 767px) {
                    .col-form-label {
                        text-align: left !important;
                        padding-right: 0.5rem !important;
                    }
                }
            `}</style>
        </div>
    );
};