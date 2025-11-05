import React from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { confirmDialog } from 'primereact/confirmdialog'
import { CustomModal } from '../../../components/CustomModal'
import { SpecialityModalProps } from '../interfaces'
import { AutoComplete, AutoCompleteCompleteEvent } from 'primereact/autocomplete'
import { useSpecialty } from '../hooks/useSpecialty'

export default function SpecialityModal({
  visible,
  selectedSpecialty,
  selectedAntecedent,
  onAntecedentChange,
  clinicalRecordTypes,
  specializableElements,
  selectedClinicalRecord,
  cie11Code,
  onHide,
  onSave,
  onAddClinicalRecord,
  onAddCie11Code,
  onRemoveElement,
  onClinicalRecordChange,
  onCie11CodeChange
}: SpecialityModalProps) {

  const { cie11Codes, loadCie11Codes } = useSpecialty()
  const confirmRemove = (index: number) => {
    confirmDialog({
      message: '¿Está seguro de que desea eliminar este elemento?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => onRemoveElement(index)
    })
  }

  const modalFooter = (
    <>
      <Button
        className="btn btn-outline-primary"
        onClick={onHide}
      >
        Cancelar
      </Button>
      <Button
        className="btn btn-primary my-0"
        onClick={onSave}
      >
        Guardar
      </Button>
    </>
  )

  const searchCie11Codes = async (event: AutoCompleteCompleteEvent) => {
    await loadCie11Codes(event.query)
  };

  return (
    <CustomModal
      title="Vincular Historias Clínicas y CIE-11"
      show={visible}
      onHide={onHide}
      footerTemplate={modalFooter}
    >
      <div className="row">
        {/* Clinical Records Column */}
        <div className="col-12 col-md-6">
          <h6 className="mb-3">Historias Clínicas</h6>
          <div className="mb-3">
            <label htmlFor="clinical-record" className="form-label">Seleccione Historia Clínica</label>
            <Dropdown
              id="clinical-record"
              value={selectedClinicalRecord}
              options={clinicalRecordTypes}
              onChange={(e) => onClinicalRecordChange(e.value)}
              optionLabel="name"
              placeholder="Seleccione una historia clínica"
              className="w-100"
              filter
              filterBy="name"
              showClear
              style={{
                zIndex: 100000,
              }}
              panelStyle={{
                zIndex: 100000,
              }}
              appendTo="self"
            />
          </div>
          <Button
            className="btn btn-primary my-0 w-100"
            onClick={onAddClinicalRecord}
            disabled={!selectedClinicalRecord}
          >
            Agregar Historia Clínica
          </Button>

        </div>

        {/* CIE-11 Column */}
        <div className="col-12 col-md-6">
          <h6 className="mb-3">Listado de CIE-11</h6>
          <div className="mb-3">
            <label htmlFor="cie11-code" className="form-label">Escriba un Código CIE-11</label>
            {/* <InputText
              id="cie11-code"
              value={cie11Code}
              onChange={(e) => onCie11CodeChange(e.target.value)}
              placeholder="Código CIE-11"
              className="w-100"
              onKeyPress={(e) => e.key === 'Enter' && onAddCie11Code()}
            /> */}
            <AutoComplete
              inputId="cie11-code"
              placeholder="Seleccione un CIE-11"
              field="label"
              suggestions={cie11Codes}
              completeMethod={searchCie11Codes}
              inputClassName="w-100"
              className="w-100"
              appendTo={"self"}
              value={cie11Code}
              onChange={(e) => onCie11CodeChange(e.value)}
              onKeyPress={(e) => e.key === 'Enter' && onAddCie11Code()}
              forceSelection={false}
              dropdown={true}
              showEmptyMessage={true}
              emptyMessage="No se encontraron códigos CIE-11"
              delay={1000}
              panelStyle={{
                zIndex: 100000,
                width: 'auto'
              }}
            />
          </div>
          <Button
            className="btn btn-primary my-0 w-100"
            onClick={onAddCie11Code}
            disabled={!cie11Code}
          >
            Agregar CIE-11
          </Button>
        </div>

        <div className="col-12 col-md-12 mt-3">
          <h6 className="mb-3">Formato de Antecedentes</h6>
          <div className="mb-3">
            <label htmlFor="antecedent" className="form-label">Seleccione Formato de Antecedentes</label>
            <Dropdown
              id="antecedent"
              value={selectedAntecedent}
              options={clinicalRecordTypes}
              onChange={(e) => onAntecedentChange?.(e.value)}
              optionLabel="name"
              placeholder="Seleccione un formato de antecedentes"
              className="w-100"
              filter
              filterBy="name"
              showClear
              appendTo="self"
            />
          </div>
        </div>
      </div>

      {/* Elements Table */}
      <div className="mt-4">
        <h6 className="mb-3">Elementos Agregados</h6>
        <div className="table-responsive">
          <DataTable
            value={specializableElements}
            emptyMessage="No hay elementos agregados"
            className="p-datatable-striped"
            size="small"
          >
            <Column field="specializable_type" header="Tipo" />
            <Column field="display_name" header="Nombre" />
            <Column
              header="Acción"
              body={(rowData, options) => (
                <Button
                  className="p-button-rounded p-button-text p-button-sm p-button-danger"
                  onClick={() => confirmRemove(options.rowIndex)}
                  tooltip="Eliminar elemento"
                >
                  <i className="fa-solid fa-trash"></i>
                </Button>
              )}
              style={{ width: '100px', textAlign: 'center' }}
            />
          </DataTable>
        </div>
      </div>
    </CustomModal>
  )
}
