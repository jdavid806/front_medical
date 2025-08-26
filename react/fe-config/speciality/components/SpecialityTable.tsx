import React from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { SpecialityTableProps } from '../interfaces'

export default function SpecialityTable({
  specialties,
  loading,
  globalFilterValue,
  filters,
  onGlobalFilterChange,
  onConfigModalOpen,
  onActiveSpecialty
}: SpecialityTableProps) {

  const renderHeader = () => {
    return (
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="m-0">Listado de Especialidades</h4>
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

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="d-flex gap-2">
        <Button
          className="p-button-rounded p-button-text p-button-sm"
          onClick={() => onConfigModalOpen(rowData)}
          tooltip="Configurar especialidad"
        >
          <i className="fa-solid fa-tools"></i>
        </Button>

        <Button
          className="btn btn-sm btn-text btn-success"
          onClick={() => onActiveSpecialty(rowData)}
          tooltip="Activar especialidad"
        >
          <i className="fa-solid fa-check-circle"></i>
        </Button>
      </div>
    )
  }

  return (
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
  )
}
