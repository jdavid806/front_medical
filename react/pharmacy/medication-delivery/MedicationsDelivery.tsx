import React, { useState } from 'react';
import useTimer from '../../components/timer/hooks/useTimer';
import { MedicationDeliveryList } from './MedicationDeliveryList';
import { MedicationDeliveryDetail } from './MedicationDeliveryDetail';

export const ProductsDelivery = () => {

    const { formatCurrentTime } = useTimer({ autoStart: true, interval: 1000 });

    const [selectedDelivery, setSelectedDelivery] = useState<any | null>(null);
    const [selectedConvenio, setSelectedConvenio] = useState<any | null>(null);

    return (<>
        <div className="d-flex flex-column gap-3">
            <div className="d-flex justify-content-between align-items-center">
                <h4>Entrega de Medicamentos</h4>
                <div className="d-flex gap-2 align-items-center">
                    <span>Fecha: {new Date().toISOString().split('T')[0]}</span>
                    <span>Hora: {formatCurrentTime(true)}</span>
                </div>
            </div>
            <div className="row">
                <div className="col-4">
                    <div className="card">
                        <div className="card-body">
                            <MedicationDeliveryList onDeliverySelect={setSelectedDelivery} onDeliverySelectConvenio={setSelectedConvenio} />
                        </div>
                    </div>
                </div>
                <div className="col-8">
                    <div className="card">
                        <div className="card-body">
                            {selectedDelivery && <MedicationDeliveryDetail deliveryId={selectedDelivery?.id} />}
                            {!selectedDelivery && <p>Seleccione un pedido</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>);
};