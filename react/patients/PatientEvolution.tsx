import React, { useEffect, useState } from 'react';
import { patientService } from '../../services/api/index.js';

interface PatientEvolutionItem {
    title: string;
    content: string;
    created_at: string;
}

export const PatientEvolution: React.FC = () => {
    const [evolution, setEvolution] = useState<PatientEvolutionItem[]>([]);
    const patientId =
        new URLSearchParams(window.location.search).get('id') ||
        new URLSearchParams(window.location.search).get('patient_id');

    useEffect(() => {
        const fetchEvolution = async () => {
            const data = await patientService.evolution(patientId);
            setEvolution(data);
        };
        fetchEvolution();
    }, [patientId]);

    return (
        <div className="timeline" id="patient-evolution-container">
            {evolution.map((item, index) => (
                <div className="timeline-item align-items-start" key={index}>
                    <div className="row g-md-3 align-items-start mb-8 mb-lg-5">
                        <div className="col-12 col-md-auto d-flex">
                            <div className="timeline-item-date text-end order-1 order-md-0 me-md-4">
                                <p className="fs-10 fw-semibold text-body-tertiary mb-0">
                                    {new Date(item.created_at).toLocaleDateString()}
                                    <br className="d-none d-md-block" />
                                    {new Date(item.created_at).toLocaleTimeString()}
                                </p>
                            </div>
                            <div className="timeline-item-bar position-relative me-3 me-md-0">
                                <div className="icon-item icon-item-sm bg-success" data-bs-theme="light">
                                    <span className="fa-solid fa-check text-white fs-10" />
                                </div>
                                <span className="timeline-bar border-end border-success" />
                            </div>
                        </div>
                        <div className="col">
                            <div className="timeline-item-content text-start ps-6 ps-md-3">
                                <h5 className="text-start">{item.title}</h5>
                                <p className="fs-9 text-body-secondary mb-0" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {item.content}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PatientEvolution;
