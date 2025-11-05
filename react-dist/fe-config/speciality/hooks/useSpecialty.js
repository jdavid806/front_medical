import { useState, useEffect, useRef } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { CentralSpecialtyService } from "../../../../services/api/classes/centralSpecialtyService.js";
export const useSpecialty = () => {
  // State management
  const [specialties, setSpecialties] = useState([]);
  const [currentSpecialties, setCurrentSpecialties] = useState([]);
  const [clinicalRecordTypes, setClinicalRecordTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCurrentSpecialties, setLoadingCurrentSpecialties] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedAntecedent, setSelectedAntecedent] = useState(null);
  const [specializableElements, setSpecializableElements] = useState([]);

  // Form states
  const [selectedClinicalRecord, setSelectedClinicalRecord] = useState(null);
  const [cie11Code, setCie11Code] = useState(null);
  const [cie11Codes, setCie11Codes] = useState([]);

  // DataTable filter
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS
    }
  });
  const toast = useRef(null);

  // Utility functions
  const getApiUrl = () => {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port;
    return `${protocol}//${hostname}${port ? ':' + port : ''}`;
  };
  const showSuccess = message => {
    toast.current?.show({
      severity: 'success',
      summary: 'Éxito',
      detail: message
    });
  };
  const showError = message => {
    toast.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: message
    });
  };
  const showWarn = message => {
    toast.current?.show({
      severity: 'warn',
      summary: 'Advertencia',
      detail: message
    });
  };

  // API calls
  const loadSpecialties = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/medical/specialties`);
      if (!response.ok) throw new Error('Error loading specialties');
      const data = await response.json();
      setSpecialties(data);
    } catch (error) {
      console.error('Error loading specialties:', error);
      throw error;
    }
  };
  const loadCurrentSpecialties = async () => {
    try {
      setLoadingCurrentSpecialties(true);
      const response = await fetch(`${getApiUrl()}/medical/user-specialties`);
      if (!response.ok) throw new Error('Error loading current specialties');
      const data = await response.json();
      setCurrentSpecialties(data);
    } catch (error) {
      console.error('Error loading current specialties:', error);
      throw error;
    } finally {
      setLoadingCurrentSpecialties(false);
    }
  };
  const loadClinicalRecordTypes = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/medical/clinical-record-types`);
      if (!response.ok) throw new Error('Error loading clinical record types');
      const data = await response.json();
      setClinicalRecordTypes(data);
    } catch (error) {
      console.error('Error loading clinical record types:', error);
      throw error;
    }
  };
  const loadCie11Codes = async query => {
    if (query.length < 3) return;
    try {
      const response = await fetch(`${getApiUrl()}/medical/cie11/search?query=${query}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      if (!response.ok) throw new Error('CIE-11 code not found');
      const data = await response.json();

      // Handle different response formats
      let dataArray = [];
      if (Array.isArray(data)) {
        dataArray = data;
      } else if (data && typeof data === 'object') {
        // Check common response wrapper patterns
        if (Array.isArray(data.data)) {
          dataArray = data.data;
        } else if (Array.isArray(data.results)) {
          dataArray = data.results;
        } else if (Array.isArray(data.items)) {
          dataArray = data.items;
        } else {
          console.warn('Unexpected data format from CIE-11 API:', data);
          dataArray = [];
        }
      } else {
        console.warn('Invalid data type from CIE-11 API:', typeof data);
        dataArray = [];
      }

      // Transform data to include label property for AutoComplete
      const transformedData = dataArray.map(item => {
        // Validate required fields
        const codigo = item.codigo || '';
        const descripcion = item.descripcion || '';

        // Create comprehensive label with code AND description
        const label = codigo && descripcion ? `${codigo} - ${descripcion}` : codigo || descripcion || 'Sin información';
        return {
          ...item,
          codigo,
          descripcion,
          label
        };
      });
      setCie11Codes(transformedData);
      return transformedData;
    } catch (error) {
      console.error('Error loading CIE-11 codes:', error);
      setCie11Codes([]);
      return [];
    }
  };
  const loadSpecializableElements = async specialtyName => {
    try {
      const response = await fetch(`${getApiUrl()}/medical/specializables/by-specialty/${specialtyName}`);
      if (!response.ok) throw new Error('Error loading specializable elements');
      const data = await response.json();
      const antecedents = data.filter(item => item.specializable_type === 'Antecedente');
      if (antecedents.length > 0) {
        const response = await fetch(`${getApiUrl()}/medical/clinical-record-types`);
        if (!response.ok) throw new Error('Error loading clinical record types');
        const serverClinicalRecordTypes = await response.json();
        console.log('Antecedentes:', antecedents);
        console.log('Clinical Record Types:', serverClinicalRecordTypes);
        const antecedent = serverClinicalRecordTypes.find(item => item.id == antecedents[0].specializable_id);
        if (antecedent) {
          setSelectedAntecedent(antecedent);
        }
      }

      // Transform data to match our interface
      const transformedData = data.filter(item => item.specializable_type !== 'Antecedente').map(item => ({
        id: item.id,
        specializable_type: item.specializable_type,
        specializable_id: item.specializable_id,
        specialty_id: specialtyName,
        description: item.description,
        display_name: `${item.specializable_id} - ${item.description}`
      }));
      setSpecializableElements(transformedData);
    } catch (error) {
      console.error('Error loading specializable elements:', error);
      setSpecializableElements([]);
    }
  };
  const fetchCie11Code = async code => {
    try {
      const response = await fetch(`${getApiUrl()}/medical/cie11/get-by-code/${code}`);
      if (!response.ok) throw new Error('CIE-11 code not found');
      const data = await response.json();
      if (data && data.length > 0) {
        return data[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching CIE-11 code:', error);
      throw error;
    }
  };
  const saveSpecializableElements = async () => {
    if (!selectedSpecialty) return;
    const finalSpecializableElements = [...specializableElements];
    if (selectedAntecedent) {
      finalSpecializableElements.push({
        specializable_type: 'Antecedente',
        specializable_id: selectedAntecedent.id.toString(),
        specialty_id: selectedSpecialty.specialty || "",
        description: selectedAntecedent.name,
        display_name: selectedAntecedent.name
      });
    }
    try {
      const url = `${getApiUrl()}/medical/specializables/${selectedSpecialty.specialty}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(finalSpecializableElements)
      });
      if (!response.ok) throw new Error('Error saving data');
      showSuccess('Configuración guardada exitosamente');
      setShowConfigModal(false);
      resetModalForm();
    } catch (error) {
      console.error('Error saving specializable elements:', error);
      showError('Error al guardar la configuración');
    }
  };

  // Business logic functions
  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadSpecialties(), loadCurrentSpecialties(), loadClinicalRecordTypes()]);
    } catch (error) {
      console.error('Error loading data:', error);
      showError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };
  const openConfigModal = async specialty => {
    setSelectedSpecialty(specialty);
    await loadSpecializableElements(specialty.specialty);
    setShowConfigModal(true);
  };
  const addClinicalRecord = () => {
    if (!selectedClinicalRecord || !selectedSpecialty) return;
    const newElement = {
      specializable_type: 'Historia Clínica',
      specializable_id: String(selectedClinicalRecord.id),
      specialty_id: selectedSpecialty.specialty,
      description: selectedClinicalRecord.name,
      display_name: selectedClinicalRecord.name
    };

    // Check if already exists
    const exists = specializableElements.some(el => el.specializable_type === 'Historia Clínica' && el.specializable_id === selectedClinicalRecord.id);
    if (!exists) {
      setSpecializableElements([...specializableElements, newElement]);
      setSelectedClinicalRecord(null);
    } else {
      showWarn('Esta historia clínica ya está agregada');
    }
  };
  const addCie11Code = async () => {
    if (!cie11Code || !selectedSpecialty) return;
    try {
      const displayName = `${cie11Code.codigo} - ${cie11Code.descripcion}`;
      const newElement = {
        specializable_type: 'CIE-11',
        specializable_id: String(cie11Code.codigo),
        specialty_id: selectedSpecialty.specialty,
        description: cie11Code.descripcion,
        display_name: displayName
      };

      // Check if already exists
      const exists = specializableElements.some(el => el.specializable_type === 'CIE-11' && el.specializable_id === cie11Code.codigo);
      if (!exists) {
        setSpecializableElements([...specializableElements, newElement]);
        setCie11Code(null);
      } else {
        showWarn('Este código CIE-11 ya está agregado');
      }
    } catch (error) {
      showError('Error al agregar código CIE-11');
    }
  };
  const removeSpecializableElement = index => {
    const updatedElements = [...specializableElements];
    updatedElements.splice(index, 1);
    setSpecializableElements(updatedElements);
  };
  const resetModalForm = () => {
    setSelectedAntecedent(null);
    setSelectedSpecialty(null);
    setSpecializableElements([]);
    setSelectedClinicalRecord(null);
    setCie11Code(null);
  };
  const onGlobalFilterChange = e => {
    const value = e.target.value;
    let _filters = {
      ...filters
    };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const onActiveSpecialty = async specialty => {
    try {
      const service = new CentralSpecialtyService();
      await service.activateSpecialty(specialty.name);
      await loadCurrentSpecialties();
      showSuccess('Especialidad activada exitosamente');
    } catch (error) {
      console.error('Error activating specialty:', error);
      showError('Error al activar la especialidad');
    }
  };
  const onDeactiveSpecialty = async specialty => {
    try {
      const service = new CentralSpecialtyService();
      await service.deactivateSpecialty(specialty.name);
      await loadCurrentSpecialties();
      showSuccess('Especialidad desactivada exitosamente');
    } catch (error) {
      console.error('Error deactivating specialty:', error);
      showError('Error al desactivar la especialidad');
    }
  };

  // Initialize data on hook mount
  useEffect(() => {
    loadData();
  }, []);
  return {
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
    cie11Codes,
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
    showWarn,
    loadCie11Codes,
    onActiveSpecialty,
    onDeactiveSpecialty,
    selectedAntecedent,
    setSelectedAntecedent
  };
};