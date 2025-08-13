import React from 'react'
import  DisabilityTable  from './components/DisabilityTable'
import { getColumns } from './enums/columns'
import { useGetData } from './hooks/useGetData'

interface DisabilityAppProps {
  patientId: number | string;
}

const DisabilityApp: React.FC<DisabilityAppProps> = ({ patientId }) => {
  const { data, loading, error, reload } = useGetData(patientId);

  const editDisability = (id: string) => {
    console.log('Editando discapacidad:', id)
  }

  const deleteDisability = (id: string) => {
    console.log('Eliminando discapacidad:', id)
    // Después de eliminar, podrías llamar reload() para refrescar los datos
  }

  const columns = getColumns({ editDisability, deleteDisability })

  if (!patientId) {
    return (
      <div className="alert alert-warning">
        <strong>Advertencia:</strong> No se ha proporcionado un ID de paciente. 
        Por favor, asegúrese de que la URL incluya el parámetro <code>patient_id</code> o <code>id</code>.
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <strong>Error:</strong> {error}
        <button 
          className="btn btn-sm btn-outline-danger ms-2" 
          onClick={reload}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
       <DisabilityTable 
         data={data} 
         columns={columns} 
         loading={loading}
         onReload={reload}
       />
    </div>
  )
}

export default DisabilityApp
