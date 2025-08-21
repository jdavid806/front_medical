import { useState, useEffect, useRef } from 'react'
import { FilterMatchMode } from 'primereact/api'
import { Toast } from 'primereact/toast'
import { 
  Specialty, 
  ClinicalRecordType, 
  SpecializableElement, 
  Cie11Code 
} from '../interfaces'

export const useSpecialty = () => {
  // State management
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [clinicalRecordTypes, setClinicalRecordTypes] = useState<ClinicalRecordType[]>([])
  const [loading, setLoading] = useState(true)
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null)
  const [specializableElements, setSpecializableElements] = useState<SpecializableElement[]>([])
  
  // Form states
  const [selectedClinicalRecord, setSelectedClinicalRecord] = useState<ClinicalRecordType | null>(null)
  const [cie11Code, setCie11Code] = useState('')
  
  // DataTable filter
  const [globalFilterValue, setGlobalFilterValue] = useState('')
  const [filters, setFilters] = useState({
    global: { value: null as string | null, matchMode: FilterMatchMode.CONTAINS }
  })

  const toast = useRef<Toast>(null)

  // Utility functions
  const getApiUrl = () => {
    const protocol = window.location.protocol
    const hostname = window.location.hostname
    const port = window.location.port
    return `${protocol}//${hostname}${port ? ':' + port : ''}`
  }

  const showSuccess = (message: string) => {
    toast.current?.show({ severity: 'success', summary: 'Éxito', detail: message })
  }

  const showError = (message: string) => {
    toast.current?.show({ severity: 'error', summary: 'Error', detail: message })
  }

  const showWarn = (message: string) => {
    toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: message })
  }

  // API calls
  const loadSpecialties = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/medical/specialties`)
      if (!response.ok) throw new Error('Error loading specialties')
      const data = await response.json()
      setSpecialties(data)
    } catch (error) {
      console.error('Error loading specialties:', error)
      throw error
    }
  }

  const loadClinicalRecordTypes = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/medical/clinical-record-types`)
      if (!response.ok) throw new Error('Error loading clinical record types')
      const data = await response.json()
      setClinicalRecordTypes(data)
    } catch (error) {
      console.error('Error loading clinical record types:', error)
      throw error
    }
  }

  const loadSpecializableElements = async (specialtyName: string) => {
    try {
      const response = await fetch(`${getApiUrl()}/medical/specializables/by-specialty/${specialtyName}`)
      if (!response.ok) throw new Error('Error loading specializable elements')
      const data = await response.json()
      
      // Transform data to match our interface
      const transformedData = data.map((item: any) => ({
        id: item.id,
        specializable_type: item.specializable_type,
        specializable_id: item.specializable_id,
        specialty_id: specialtyName,
        description: item.description,
        display_name: `${item.specializable_id} - ${item.description}`
      }))
      
      setSpecializableElements(transformedData)
    } catch (error) {
      console.error('Error loading specializable elements:', error)
      setSpecializableElements([])
    }
  }

  const fetchCie11Code = async (code: string): Promise<Cie11Code | null> => {
    try {
      const response = await fetch(`${getApiUrl()}/medical/cie11/get-by-code/${code}`)
      if (!response.ok) throw new Error('CIE-11 code not found')
      const data = await response.json()
      
      if (data && data.length > 0) {
        return data[0]
      }
      return null
    } catch (error) {
      console.error('Error fetching CIE-11 code:', error)
      throw error
    }
  }

  const saveSpecializableElements = async () => {
    if (!selectedSpecialty) return

    try {
      const url = `${getApiUrl()}/medical/specializables/${selectedSpecialty.name}`
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(specializableElements),
      })

      if (!response.ok) throw new Error('Error saving data')

      showSuccess('Configuración guardada exitosamente')
      setShowConfigModal(false)
      resetModalForm()
    } catch (error) {
      console.error('Error saving specializable elements:', error)
      showError('Error al guardar la configuración')
    }
  }

  // Business logic functions
  const loadData = async () => {
    try {
      setLoading(true)
      await Promise.all([
        loadSpecialties(),
        loadClinicalRecordTypes()
      ])
    } catch (error) {
      console.error('Error loading data:', error)
      showError('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const openConfigModal = async (specialty: Specialty) => {
    setSelectedSpecialty(specialty)
    await loadSpecializableElements(specialty.name)
    setShowConfigModal(true)
  }

  const addClinicalRecord = () => {
    if (!selectedClinicalRecord || !selectedSpecialty) return

    const newElement: SpecializableElement = {
      specializable_type: 'Historia Clínica',
      specializable_id: selectedClinicalRecord.id,
      specialty_id: selectedSpecialty.name,
      description: selectedClinicalRecord.name,
      display_name: selectedClinicalRecord.name
    }

    // Check if already exists
    const exists = specializableElements.some(
      el => el.specializable_type === 'Historia Clínica' && 
           el.specializable_id === selectedClinicalRecord.id
    )

    if (!exists) {
      setSpecializableElements([...specializableElements, newElement])
      setSelectedClinicalRecord(null)
    } else {
      showWarn('Esta historia clínica ya está agregada')
    }
  }

  const addCie11Code = async () => {
    if (!cie11Code.trim() || !selectedSpecialty) return

    try {
      const cie11Data = await fetchCie11Code(cie11Code)
      
      if (cie11Data) {
        const displayName = `${cie11Data.codigo} - ${cie11Data.descripcion}`
        
        const newElement: SpecializableElement = {
          specializable_type: 'CIE-11',
          specializable_id: cie11Data.codigo,
          specialty_id: selectedSpecialty.name,
          description: cie11Data.descripcion,
          display_name: displayName
        }

        // Check if already exists
        const exists = specializableElements.some(
          el => el.specializable_type === 'CIE-11' && 
               el.specializable_id === cie11Data.codigo
        )

        if (!exists) {
          setSpecializableElements([...specializableElements, newElement])
          setCie11Code('')
        } else {
          showWarn('Este código CIE-11 ya está agregado')
        }
      }
    } catch (error) {
      showError('Código CIE-11 no encontrado')
    }
  }

  const removeSpecializableElement = (index: number) => {
    const updatedElements = [...specializableElements]
    updatedElements.splice(index, 1)
    setSpecializableElements(updatedElements)
  }

  const resetModalForm = () => {
    setSelectedSpecialty(null)
    setSpecializableElements([])
    setSelectedClinicalRecord(null)
    setCie11Code('')
  }

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    let _filters = { ...filters }
    _filters['global'].value = value
    setFilters(_filters)
    setGlobalFilterValue(value)
  }

  // Initialize data on hook mount
  useEffect(() => {
    loadData()
  }, [])

  return {
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
    onGlobalFilterChange,
    showSuccess,
    showError,
    showWarn
  }
}
