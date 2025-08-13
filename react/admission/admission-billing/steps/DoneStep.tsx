import React from "react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { finalizeOptions } from "../utils/constants";

const DoneStep = ({ onHide }) => {
  return (
    <div className="flex flex-column align-items-center justify-content-center py-6">
      <i className="pi pi-check-circle text-6xl text-green-500 mb-4"></i>
      <h2 className="mb-4">¡Felicidades!</h2>
      <p className="text-xl mb-6">La factura ha sido creada exitosamente</p>
      
      <div className="flex flex-column" style={{ width: '300px' }}>
        <Dropdown 
          options={finalizeOptions}
          optionLabel="label"
          placeholder="Finalizar factura"
          className="mb-4"
        />
        
        <Button 
          label="Terminar" 
          icon="pi pi-home" 
          onClick={onHide}
        />
      </div>
    </div>
  );
};

export default DoneStep;