import React from 'react'
import { Toast } from 'primereact/toast'
import { ConfirmDialog } from 'primereact/confirmdialog'

// Components
import SpecialityTable from './components/SpecialityTable'
import SpecialityModal from './components/SpecialityModal'

// Hook
import { useSpecialty } from './hooks/useSpecialty'
import CurrentSpecialityTable from './components/CurrentSpecialtyTable'

export default function SpecialityApp() {
  const {
    // State
    specialties,
    currentSpecialties,
    clinicalRecordTypes,
    loading,
    loadingCurrentSpecialties,
    showConfigModal,
    selectedSpecialty,
    specializableElements,
    selectedClinicalRecord,
    cie11Code,
    globalFilterValue,
    filters,
    toast,

    // Setters
    setShowConfigModal,
    setSelectedClinicalRecord,
    setCie11Code,

    // Functions
    openConfigModal,
    addClinicalRecord,
    addCie11Code,
    removeSpecializableElement,
    saveSpecializableElements,
    resetModalForm,
    onGlobalFilterChange,
    onActiveSpecialty,
    onDeactiveSpecialty
  } = useSpecialty()

  const handleModalClose = () => {
    setShowConfigModal(false)
    resetModalForm()
  }

  return (
    <div className="container-fluid mt-4">
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className='row'>
        <div className='col-md-6 col-lg-6 col-xl-6 col-12'>
          {/* Specialty Table */}
          <SpecialityTable
            specialties={specialties}
            loading={loading}
            globalFilterValue={globalFilterValue}
            filters={filters}
            onGlobalFilterChange={onGlobalFilterChange}
            onConfigModalOpen={openConfigModal}
            onActiveSpecialty={onActiveSpecialty}
          />
        </div>
        <div className='col-md-6 col-lg-6 col-xl-6 col-12'>

          {/* Current Specialty Table */}
          <CurrentSpecialityTable
            specialties={currentSpecialties}
            loading={loadingCurrentSpecialties}
            globalFilterValue={globalFilterValue}
            filters={filters}
            onGlobalFilterChange={onGlobalFilterChange}
            onDeactiveSpecialty={onDeactiveSpecialty}
          />
        </div>
      </div>

      {/* Configuration Modal */}
      <SpecialityModal
        visible={showConfigModal}
        selectedSpecialty={selectedSpecialty}
        clinicalRecordTypes={clinicalRecordTypes}
        specializableElements={specializableElements}
        selectedClinicalRecord={selectedClinicalRecord}
        cie11Code={cie11Code}
        onHide={handleModalClose}
        onSave={saveSpecializableElements}
        onAddClinicalRecord={addClinicalRecord}
        onAddCie11Code={addCie11Code}
        onRemoveElement={removeSpecializableElement}
        onClinicalRecordChange={setSelectedClinicalRecord}
        onCie11CodeChange={setCie11Code}
      />
    </div>
  )
}