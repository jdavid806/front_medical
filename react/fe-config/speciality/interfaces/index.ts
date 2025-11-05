export interface Specialty {
  id: number
  name: string
  specialty?: string
}

export interface ClinicalRecordType {
  id: number
  name: string
  [key: string]: any
}

export interface SpecializableElement {
  id?: number
  specializable_type: string
  specializable_id: string | number
  specialty_id: string
  description: string
  display_name?: string
}

export interface Cie11Code {
  codigo: string
  descripcion: string
  label?: string
}

export interface SpecialityTableProps {
  specialties: Specialty[]
  loading: boolean
  globalFilterValue: string
  filters: any
  onGlobalFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onConfigModalOpen: (specialty: Specialty) => void
  onActiveSpecialty: (specialty: Specialty) => void
}

export interface CurrentSpecialtyTableProps {
  specialties: Specialty[]
  loading: boolean
  globalFilterValue: string
  filters: any
  onGlobalFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDeactiveSpecialty: (specialty: Specialty) => void
}

export interface SpecialityModalProps {
  visible: boolean
  selectedSpecialty: Specialty | null
  selectedAntecedent?: ClinicalRecordType | null
  onAntecedentChange?: (value: ClinicalRecordType | null) => void
  clinicalRecordTypes: ClinicalRecordType[]
  specializableElements: SpecializableElement[]
  selectedClinicalRecord: ClinicalRecordType | null
  cie11Code: Cie11Code | null
  onHide: () => void
  onSave: () => void
  onAddClinicalRecord: () => void
  onAddCie11Code: () => void
  onRemoveElement: (index: number) => void
  onClinicalRecordChange: (value: ClinicalRecordType | null) => void
  onCie11CodeChange: (value: Cie11Code | null) => void
}
