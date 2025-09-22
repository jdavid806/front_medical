import React, { useState } from 'react';
import useTimer from '../../components/timer/hooks/useTimer';
import { InputText } from 'primereact/inputtext';
import { ProductDeliveryDetail } from './ProductDeliveryDetail';
import { Tag } from 'primereact/tag';
import { formatDateDMY } from '../../../services/utilidades';
import { Divider } from 'primereact/divider';
import { useSuppliesDeliveries } from '../supplies/hooks/useSuppliesDeliveries';

export const ProductsDelivery = () => {

    const { formatCurrentTime } = useTimer({ autoStart: true, interval: 1000 });
    const { suppliesDeliveries } = useSuppliesDeliveries();

    const [selectedDelivery, setSelectedDelivery] = useState<any | null>(null);

    return (<>
        <div className="d-flex flex-column gap-3">
            <div className="d-flex justify-content-between align-items-center">
                <h4>ProductsDelivery</h4>
                <div className="d-flex gap-2 align-items-center">
                    <span>{new Date().toISOString().split('T')[0]}</span>
                    <span>{formatCurrentTime(true)}</span>
                    <button className="btn btn-primary">Nueva Solicitud</button>
                </div>
            </div>
            <div className="d-flex gap-3">
                <div className="d-flex" style={{ width: '300px' }}>
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Pedidos Pendientes</h5>
                            <div className="input-group">
                                <InputText
                                    placeholder="Buscar por # o nombre..."
                                    id="searchOrder"
                                    className="w-100"
                                />
                            </div>
                            <Divider />
                            <div className="d-flex flex-column gap-2">
                                {suppliesDeliveries.map((delivery) => (
                                    <div
                                        key={delivery.id}
                                        className="d-flex flex-column gap-2 cursor-pointer"
                                        onClick={() => setSelectedDelivery(delivery)}
                                    >
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center gap-2">
                                                <h5 className="card-title">Pedido #{delivery.id}</h5>
                                                <Tag value="En espera" />
                                            </div>
                                            <div>
                                                <span>{formatDateDMY(delivery.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex w-100 flex-grow-1">
                    <div className="card w-100">
                        <div className="card-body">
                            {selectedDelivery && <ProductDeliveryDetail deliveryId={selectedDelivery?.id} />}
                            {!selectedDelivery && <p>Seleccione un pedido</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>);
};