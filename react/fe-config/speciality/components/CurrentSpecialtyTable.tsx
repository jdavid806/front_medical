import React, { useRef, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { CurrentSpecialtyTableProps, Specialty } from '../interfaces'
import { MenuItem } from 'primereact/menuitem'
import { Menu } from 'primereact/menu'
import { Dialog } from 'primereact/dialog'
import { SpecialtyPatientViewConfigForm } from './SpecialtyPatientViewConfigForm'
import { Divider } from 'primereact/divider'

export default function CurrentSpecialityTable({
    specialties,
    loading,
    globalFilterValue,
    filters,
    onGlobalFilterChange,
    onDeactiveSpecialty
}: CurrentSpecialtyTableProps) {

    const [showPatientViewConfigModal, setShowPatientViewConfigModal] = useState<boolean>(false)
    const [selectedItem, setSelectedItem] = useState<Specialty>()

    const openPatientViewConfigmModal = (rowData: Specialty) => {
        setSelectedItem(rowData)
        setShowPatientViewConfigModal(true)

    }

    const renderHeader = () => {
        return (
            <div className="d-flex justify-content-between align-items-center">
                <h4 className="m-0">Especialidades Activas</h4>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Buscar especialidad..."
                    />
                </span>
            </div>
        )
    }

    const actionBodyTemplate = (rowData: Specialty) => {
        return <CurrentSpecialityTableActions
            onDeactiveSpecialty={() => onDeactiveSpecialty(rowData)}
            onShowPatientViewConfig={() => openPatientViewConfigmModal(rowData)}
        />
    }

    return (<>
        <div className="container-fluid mt-4" style={{ width: '100%', padding: '0 15px' }}>
            <DataTable
                value={specialties}
                loading={loading}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
                className="p-datatable-striped p-datatable-gridlines"
                emptyMessage="No se encontraron especialidades"
                filters={filters}
                globalFilterFields={['name']}
                header={renderHeader()}
                responsiveLayout="scroll"
            >
                <Column
                    field="name"
                    header="Nombre"
                    sortable
                    style={{ minWidth: '200px' }}
                />
                <Column
                    header="Acciones"
                    body={actionBodyTemplate}
                    style={{ width: '120px', textAlign: 'center' }}
                />
            </DataTable>
        </div>

        <Dialog
            visible={showPatientViewConfigModal}
            header={"Configurar vista de paciente"}
            onHide={() => setShowPatientViewConfigModal(false)}
            style={{ width: "70vw" }}
        >
            {!selectedItem && <>Selecciona una especialidad</>}

            {selectedItem && <>
                <SpecialtyPatientViewConfigForm
                    formId={"specialtyPatientViewConfigForm"}
                    specialty={selectedItem}
                />
                <Divider />
                <div className="d-flex justify-content-end gap-2">
                    <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() => setShowPatientViewConfigModal(false)}
                    >
                        <i className="fa fa-times me-2"></i>Cancelar
                    </button>
                    <button form='specialtyPatientViewConfigForm' className="btn btn-primary" type="submit">
                        <i className="fa fa-save me-2"></i>Guardar
                    </button>
                </div>
            </>}
        </Dialog>
    </>)
}

interface CurrentSpecialityTableActionsProps {
    onDeactiveSpecialty: () => void
    onShowPatientViewConfig: () => void
}

export const CurrentSpecialityTableActions = (props: CurrentSpecialityTableActionsProps) => {

    const { onDeactiveSpecialty, onShowPatientViewConfig } = props

    const menuActions = useRef<Menu>(null);
    const actions: MenuItem[] = [
        {
            label: 'Configurar vista de paciente',
            icon: <i className='fa fa-upload me-2'></i>,
            command: () => {
                onShowPatientViewConfig()
            }
        },
        {
            label: 'Desactivar especialidad',
            icon: <i className="fa-solid fa-xmark-circle me-2"></i>,
            command: () => {
                onDeactiveSpecialty()
            }
        }
    ];

    return <>
        <Menu model={actions} popup ref={menuActions} id="popup_menu_actions" />
        <button
            className='btn btn-primary'
            onClick={(event) => menuActions.current?.toggle(event)}
            aria-controls="popup_menu_actions"
            aria-haspopup
        >
            <i className='fa fa-cog'></i> Acciones
        </button>
    </>
}