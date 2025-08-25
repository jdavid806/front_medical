import React from 'react'
import { Toast } from 'primereact/toast'
import { ConfirmDialog } from 'primereact/confirmdialog'

// Components
import SpecialityTable from './components/SpecialityTable'
import SpecialityModal from './components/SpecialityModal'

// Hook
import { useSpecialty } from './hooks/useSpecialty'

export default function SpecialityApp() {
  const {
    // State
    specialties,
    clinicalRecordTypes,
    loading,
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
    onGlobalFilterChange
  } = useSpecialty()

  const handleModalClose = () => {
    setShowConfigModal(false)
    resetModalForm()
  }

  return (
    <div className="container-fluid mt-4">
      <Toast ref={toast} />
      <ConfirmDialog />

      {/* Specialty Table */}
      <SpecialityTable
        specialties={specialties}
        loading={loading}
        globalFilterValue={globalFilterValue}
        filters={filters}
        onGlobalFilterChange={onGlobalFilterChange}
        onConfigModalOpen={openConfigModal}
      />

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