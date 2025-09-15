import React, { useState, useEffect, useCallback, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Paginator } from 'primereact/paginator';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { appointmentService, examOrderService, examRecipeResultService, examRecipeService, infoCompanyService, patientService, templateService, ticketService } from '../../services/api';
import { getPatientNextAppointment } from '../../services/patientHelpers';
import { reestructurarPacientes } from '../../Pacientes/js/reestructurarPacientes';
import { formatWhatsAppMessage, getIndicativeByCountry, getUserLogged } from '../../services/utilidades';
import { createMassMessaging } from '../../funciones/funcionesJS/massMessage';

import "https://js.pusher.com/8.2.0/pusher.min.js";
import { useAppointmentStates } from '../appointments/hooks/useAppointmentStates';
import { SwalManager } from '../../services/alertManagerImported';
import UserManager from '../../services/userManager';

export const PatientConsultationList = () => {
    const [patients, setPatients] = useState<any[]>([]);
    const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPatients, setTotalPatients] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(true);

    const [messaging, setMessaging] = useState<any | null>(null);
    const [template, setTemplate] = useState<any | null>(null);

    const [selectedAppointmentId, setSelectedAppointmentId] = useState<
        string | null
    >(null);
    const [selectedExamOrder, setSelectedExamOrder] = useState<any>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [showPdfModal, setShowPdfModal] = useState(false);

    const [pdfFile, setPdfFile] = useState<File | null>(null); // Para almacenar el archivo PDF
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null); // Para la previsualización del PDF
    const userLogged = getUserLogged();

    const itemsPerPage = 8;
    const statusOptions = [
        { label: 'Todos', value: 'all' },
        { label: 'Pendiente', value: 'pending' },
        { label: 'En espera', value: 'pending_consultation' },
        { label: 'Llamado', value: 'called' },
        { label: 'En proceso', value: 'in_consultation' },
        { label: 'Finalizada', value: 'consultation_completed' },
        { label: 'Cancelada', value: 'cancelled' }
    ];

    const { appointmentStates } = useAppointmentStates();

    const appointmentStatesRef = useRef(appointmentStates);

    // Actualizar la referencia cuando appointmentStates cambie
    useEffect(() => {
        appointmentStatesRef.current = appointmentStates;
    }, [appointmentStates]);

    // Obtener pacientes desde la API
    const fetchPatients = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await patientService.getWithAppointmentsByUserAndFilter({
                per_page: itemsPerPage,
                page: page
            });

            const patientsData = response.original.data.data;
            const processedPatients = procesarPacientes(patientsData);

            setPatients(processedPatients);
            setFilteredPatients(processedPatients);
            setTotalPatients(response.original.data.total);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching patients:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Procesar pacientes (similar a la función PHP)
    const procesarPacientes = (pacientes) => {
        const hoy = new Date().toISOString().split('T')[0];

        return pacientes
            .map(paciente => {
                const primeraCita = getPatientNextAppointment(paciente);
                const estado = primeraCita ? primeraCita.appointment_state.name : null;

                const citaHoy = paciente.appointments.find(c => c.appointment_date === hoy);
                const esFinalizadaOCancelada = citaHoy &&
                    (citaHoy.appointment_state.name === 'consultation_completed' ||
                        citaHoy.appointment_state.name === 'cancelled');

                return {
                    ...paciente,
                    estado,
                    primeraCita,
                    _esFinalizadaOCancelada: esFinalizadaOCancelada,
                    _fechaHoraPrimeraCita: primeraCita ?
                        new Date(`${primeraCita.appointment_date}T${primeraCita.appointment_time}`) : new Date(0),
                    fullName: `${paciente.first_name || ''} ${paciente.middle_name || ''} ${paciente.last_name || ''} ${paciente.second_last_name || ''}`
                };
            })
            .sort((a, b) => {
                if (a._esFinalizadaOCancelada && !b._esFinalizadaOCancelada) return 1;
                if (!a._esFinalizadaOCancelada && b._esFinalizadaOCancelada) return -1;
                return a._fechaHoraPrimeraCita - b._fechaHoraPrimeraCita;
            })
            .map(({ _esFinalizadaOCancelada, _fechaHoraPrimeraCita, ...paciente }) => paciente);
    };

    // Filtrar pacientes
    const filterPatients = useCallback(() => {
        console.log('Filtrando pacientes...', patients, searchText, statusFilter);
        const filtered = patients.filter(paciente => {
            let isMatch = true;

            // Filtro de búsqueda por nombre o documento
            if (searchText &&
                !paciente.fullName?.toLowerCase().includes(searchText.toLowerCase()) &&
                !paciente.document_number.includes(searchText)) {
                isMatch = false;
            }

            // Filtro por status
            if (statusFilter && paciente.estado !== statusFilter && statusFilter !== 'all') {
                isMatch = false;
            }

            return isMatch;
        });

        setFilteredPatients(filtered);
    }, [patients, searchText, statusFilter]);

    // Efecto para aplicar filtros
    useEffect(() => {
        filterPatients();
    }, [filterPatients]);

    // Efecto inicial para cargar pacientes
    useEffect(() => {
        fetchPatients(1);
    }, [fetchPatients]);

    // Inicializar Pusher y configuración
    useEffect(() => {
        // @ts-ignore
        const pusher = new Pusher('5e57937071269859a439', {
            cluster: 'us2'
        });

        const hostname = window.location.hostname.split('.')[0];
        const channel = pusher.subscribe('waiting-room.' + hostname);

        // Configurar event listeners
        channel.bind('appointment.created', (data: any) => {
            console.log('Appointment created:', data);
            handleAppointmentCreated(data);
        });

        channel.bind('appointment.state.updated', (data: any) => {
            console.log('Appointment state updated:', data);
            handleAppointmentStateUpdated(data);
        });

        channel.bind('appointment.inactivated', (data: any) => {
            console.log('Appointment inactivated:', data);
            handleAppointmentInactivated(data);
        });

        const asyncScope = async () => {
            const tenant = window.location.hostname.split(".")[0];
            const data = {
                tenantId: tenant,
                belongsTo: "turnos-llamadoPaciente",
                type: "whatsapp",
            };
            const companies = await infoCompanyService.getCompany();
            const communications = await infoCompanyService.getInfoCommunication(companies.data[0].id);
            let template;
            try {
                template = await templateService.getTemplate(data);
            } catch (error) {
                console.error('Error al obtener template:', error);
            }
            const infoInstance = {
                api_key: communications.api_key,
                instance: communications.instance
            }

            const messaging = createMassMessaging(infoInstance);
            setMessaging(messaging);
            setTemplate(template);
        }

        asyncScope();

        return () => {
            channel.unbind_all(); // Eliminar todos los listeners
            channel.unsubscribe(); // Desuscribirse del canal
            pusher.disconnect(); // Desconectar Pusher
        };
    }, []);

    // Manejadores de eventos de Pusher
    const handleAppointmentCreated = (data: any) => {
        setPatients(prevPatients => {
            const updatedPatients = prevPatients.map(paciente => {
                if (paciente.id === data.appointment.patient_id) {
                    return {
                        ...paciente,
                        appointments: [...paciente.appointments, data.appointment]
                    };
                }
                return paciente;
            });

            const processedPatients = procesarPacientes(updatedPatients);
            return processedPatients;
        });
    };

    const handleAppointmentStateUpdated = (data: any) => {
        console.log('Appointment states: ', appointmentStatesRef.current);
        setPatients(prevPatients => {
            const updatedPatients = prevPatients.map(paciente => {
                const updatedAppointments = paciente.appointments.map(cita => {
                    if (cita.id === data.appointmentId) {
                        return {
                            ...cita,
                            appointment_state: appointmentStatesRef.current.find(state => state.id === data.newState)
                        };
                    }
                    return cita;
                });

                return {
                    ...paciente,
                    appointments: updatedAppointments
                };
            });

            const processedPatients = procesarPacientes(updatedPatients);
            return processedPatients;
        });
    };

    const handleAppointmentInactivated = (data: any) => {
        setPatients(prevPatients => {
            const updatedPatients = prevPatients.map(paciente => {
                const updatedAppointments = paciente.appointments.map(cita => {
                    if (cita.id === data.appointmentId) {
                        return {
                            ...cita,
                            appointment_state: appointmentStatesRef.current.find(state => state.name === 'cancelled')
                        };
                    }
                    return cita;
                });

                return {
                    ...paciente,
                    appointments: updatedAppointments
                };
            });

            const processedPatients = procesarPacientes(updatedPatients);
            return processedPatients;
        });
    };

    // Calcular edad
    const calculateAge = (dateOfBirth) => {
        const birthDate = new Date(dateOfBirth);
        const currentDate = new Date();
        let age = currentDate.getFullYear() - birthDate.getFullYear();
        const monthDifference = currentDate.getMonth() - birthDate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    // Cambiar página
    const onPageChange = (event) => {
        const newPage = event.page + 1;
        fetchPatients(newPage);
    };

    function sendMessageWhatsapp(data, currentAppointment) {
        const replacements = {
            NOMBRE_PACIENTE: `${data?.patient?.first_name ?? ""} ${data?.patient?.middle_name ?? ""
                } ${data?.patient?.last_name ?? ""} ${data?.patient?.second_last_name ?? ""
                }`,
            TICKET: `${data?.ticket_number ?? ""}`,
            MODULO: `${data?.module?.name ?? ""}`,
            ESPECIALISTA: `${currentAppointment?.user_availability?.user?.specialty?.name ?? ""}`,
            CONSULTORIO: `${data?.branch?.address ?? ""}`,
        };

        const templateFormatted = formatWhatsAppMessage(
            template?.data?.template,
            replacements
        );

        const dataMessage = {
            channel: "whatsapp",
            message_type: "text",
            recipients: [
                getIndicativeByCountry(data?.patient.country_id) +
                data?.patient.whatsapp,
            ],
            message: templateFormatted,
            webhook_url: "https://example.com/webhook",
        };
        messaging?.sendMessage(dataMessage).then(() => { });
    }

    // Llamar paciente
    const llamarPaciente = async (patientId, appointmentId) => {
        //@ts-ignore
        Swal.fire({
            title: '¿Estás seguro de llamar al paciente al consultorio?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, llamar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const patient = await patientService.get(patientId);
                const currentAppointment = await appointmentService.get(appointmentId);

                if (currentAppointment) {
                    await appointmentService.changeStatus(currentAppointment.id, 'called');
                    await ticketService.lastByPatient(patientId).then((response) => {

                        if (response?.patient?.whatsapp_notifications) {
                            sendMessageWhatsapp(response, currentAppointment);
                        }
                        //@ts-ignore
                        Swal.fire(
                            '¡Paciente llamado!',
                            'Se ha llamado al paciente para que se acerque al consultorio.',
                            'success'
                        )

                    });
                } else {
                    //@ts-ignore
                    Swal.fire(
                        'Error',
                        'El paciente no está en espera de consulta.',
                        'error'
                    )
                }
            }
        });
    };

    const handleLoadExamResults = (
        appointmentId: string,
        patientId: string,
        productId: string
    ) => {
        window.location.href = `cargarResultadosExamen?patient_id=${patientId}&product_id=${productId}&appointment_id=${appointmentId}`;
    };

    const handlePDFSubmit = async () => {
        console.log("selectedExamOrder", selectedExamOrder);
        try {
            // Llamar a la función guardarArchivoExamen
            //@ts-ignore
            const enviarPDf = await guardarArchivoExamen("inputPdf", 2);

            // Acceder a la PromiseResult
            if (enviarPDf !== undefined) {
                const dataUpdate = {
                    minio_url: enviarPDf,
                };
                const examRecipeResultData = {
                    exam_recipe_id: selectedAppointment?.exam_recipe_id,
                    uploaded_by_user_id: userLogged.id,
                    date: new Date().toISOString(),
                    result_minio_url: enviarPDf,
                };
                await examOrderService.updateMinioFile(
                    selectedExamOrder?.id,
                    dataUpdate
                );
                await examRecipeResultService.create(examRecipeResultData);
                await examRecipeService.changeStatus(
                    selectedAppointment?.exam_recipe_id,
                    "uploaded"
                );
                SwalManager.success({ text: "Resultados guardados exitosamente" });
            } else {
                console.error("No se obtuvo un resultado válido.");
            }
        } catch (error) {
            console.error("Error al guardar el archivo:", error);
        } finally {
            // Limpiar el estado después de la operación
            setShowPdfModal(false);
            setPdfFile(null);
            setPdfPreviewUrl(null);
            refresh();
        }
    };

    const handleMakeClinicalRecord = (
        patientId: string,
        appointmentId: string
    ) => {
        UserManager.onAuthChange((isAuthenticated, user) => {
            if (user) {
                window.location.href = `consultas-especialidad?patient_id=${patientId}&especialidad=${user.specialty.name}&appointment_id=${appointmentId}`;
            }
        });
    };

    const refresh = () => {
        fetchPatients();
    };

    // Renderizar tarjetas de pacientes
    const renderPatientCards = () => {
        if (loading) {
            return <div className="text-center py-5">Cargando pacientes...</div>;
        }

        if (filteredPatients.length === 0) {
            return <div className="text-center py-5">No se encontraron pacientes</div>;
        }

        const pacientesReestructurados = reestructurarPacientes(filteredPatients);

        console.log("pacientesReestructurados", pacientesReestructurados);

        return (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {pacientesReestructurados.map(paciente => {

                    const estadoActual = paciente.appointment_state?.estadoActual || 'Sin estado';
                    const estadoColor = paciente.appointment_state?.colorEstado || 'secondary';

                    return (
                        <div key={paciente.id} className="col-12 col-sm-6 col-md-4 col-lg-4 mb-4">
                            <div className="card card-paciente">
                                <div className="card-body">
                                    <Badge
                                        value={estadoActual}
                                        className={`badge-phoenix badge-phoenix-${estadoColor} fs-10 mb-3`}
                                    />

                                    <div className="info-paciente row">
                                        <div className="col-6">
                                            <div className="d-flex align-items-center">
                                                <i className="fa-solid fa-id-card me-2 text-body-tertiary fs-9 fw-extra-bold"></i>
                                                <p className="fw-bold mb-0">Documento</p>
                                            </div>
                                            <p className="text-body-emphasis mb-3">{paciente.document_number}</p>
                                        </div>

                                        <div className="col-6">
                                            <div className="d-flex align-items-center">
                                                <i className="fa-solid fa-cake-candles me-2 text-body-tertiary fs-9 fw-extra-bold"></i>
                                                <p className="fw-bold mb-0">Edad</p>
                                            </div>
                                            <p className="text-body-emphasis mb-3">{calculateAge(paciente.date_of_birth)} Años</p>
                                        </div>

                                        <div className="col-6">
                                            <div className="d-flex align-items-center">
                                                <i className="far fa-calendar-check me-2 text-body-tertiary fs-9 fw-extra-bold"></i>
                                                <p className="fw-bold mb-0">Fecha</p>
                                            </div>
                                            <p className="text-body-emphasis mb-3">
                                                {paciente.cita?.appointment_date || "Fecha no disponible"}
                                            </p>
                                        </div>

                                        <div className="col-6">
                                            <div className="d-flex align-items-center">
                                                <i className="far fa-clock me-2 text-body-tertiary fs-9 fw-extra-bold"></i>
                                                <p className="fw-bold mb-0">Hora</p>
                                            </div>
                                            <p className="text-body-emphasis">
                                                {paciente.cita?.appointment_time || "Hora no disponible"}
                                            </p>
                                        </div>

                                        <div className="col-6">
                                            <div className="d-flex align-items-center">
                                                <i className="fa-solid fa-user me-2 text-body-tertiary fs-9 fw-extra-bold"></i>
                                                <p className="fw-bold mb-0">Nombre</p>
                                            </div>
                                            <p className="text-body-emphasis">
                                                {paciente.first_name || ''}
                                                {paciente.middle_name ? ` ${paciente.middle_name}` : ''}
                                                {paciente.last_name ? ` ${paciente.last_name}` : ''}
                                                {paciente.second_last_name ? ` ${paciente.second_last_name}` : ''}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="d-flex flex-column gap-2 w-100 mt-3">
                                        <Button
                                            label="Ver Paciente"
                                            className="btn-sm btn btn-primary"
                                            onClick={() => window.location.href = `verPaciente?id=${paciente.id}`}
                                        />

                                        <Button
                                            label="Llamar paciente"
                                            className="btn-sm btn btn-primary"
                                            onClick={() => llamarPaciente(paciente.id, paciente.cita?.id)}
                                        />

                                        {(paciente.appointment_state?.stateKey === "pending_consultation" ||
                                            paciente.appointment_state?.stateKey === "called" ||
                                            paciente.appointment_state?.stateKey === "in_consultation") &&
                                            paciente.appointment_state?.attention_type === "CONSULTATION" &&
                                            (
                                                <Button
                                                    label="Realizar Consulta"
                                                    className="btn-sm btn btn-primary mb-2"
                                                    onClick={() => handleMakeClinicalRecord(paciente.id, paciente.cita?.id)}
                                                />
                                            )}
                                        {(paciente.appointment_state?.stateKey === "pending_consultation" ||
                                            paciente.appointment_state?.stateKey === "called" ||
                                            paciente.appointment_state?.stateKey === "in_consultation") &&
                                            paciente.appointment_state?.attention_type === "PROCEDURE" &&
                                            (
                                                <>
                                                    <Button
                                                        label="Realizar Examen"
                                                        className="btn-sm btn btn-primary"
                                                        onClick={() => {
                                                            handleLoadExamResults(
                                                                paciente.cita.id,
                                                                paciente.id,
                                                                paciente.cita.product_id
                                                            );
                                                        }}
                                                    />
                                                    <Button
                                                        label="Subir Examen"
                                                        className="btn-sm btn btn-primary"
                                                        onClick={() => {
                                                            console.log("paciente.cita?.exam_orders", paciente.cita?.exam_orders);

                                                            setSelectedAppointment(paciente.cita);
                                                            setSelectedAppointmentId(paciente.cita?.id);
                                                            setSelectedExamOrder(paciente.cita?.exam_orders[0]);
                                                            setShowPdfModal(true);
                                                        }}
                                                    />
                                                </>
                                            )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (<>
        <div className="accordion mb-4" id="accordionFiltros">
            <div className="accordion-item">
                <h2 className="accordion-header" id="headingFiltros">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseFiltros" aria-expanded="false"
                        aria-controls="collapseFiltros">
                        Filtros
                    </button>
                </h2>
                <div id="collapseFiltros" className="accordion-collapse collapse"
                    aria-labelledby="headingFiltros" data-bs-parent="#accordionFiltros">
                    <div className="accordion-body">
                        <div className="row g-3 mb-4">
                            <div className="col-12 col-md-6">
                                <label htmlFor="searchPaciente" className="form-label">Buscar Paciente</label>
                                <InputText
                                    id="searchPaciente"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    placeholder="Buscar por nombre o documento"
                                    className="w-100"
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <label htmlFor="statusPaciente" className="form-label">Filtrar por Estado</label>
                                <Dropdown
                                    id="statusPaciente"
                                    value={statusFilter}
                                    options={statusOptions}
                                    onChange={(e) => setStatusFilter(e.value)}
                                    placeholder="Seleccione Estado"
                                    className="w-100"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {renderPatientCards()}

        <div className="d-flex justify-content-center mt-4">
            <Paginator
                first={(currentPage - 1) * itemsPerPage}
                rows={itemsPerPage}
                totalRecords={totalPatients}
                onPageChange={onPageChange}
                template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
            />
        </div>

        {showPdfModal && (
            <div
                className="modal fade show"
                style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Previsualización de PDF</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => {
                                    setPdfFile(null);
                                    setPdfPreviewUrl(null);
                                    setShowPdfModal(false);
                                }}
                            ></button>
                        </div>
                        <div className="modal-body">
                            {pdfPreviewUrl ? (
                                <embed
                                    src={pdfPreviewUrl}
                                    width="100%"
                                    height="500px"
                                    type="application/pdf"
                                />
                            ) : (
                                <p>Por favor, seleccione un archivo PDF.</p>
                            )}
                        </div>
                        <div className="modal-footer">
                            <input
                                type="file"
                                accept=".pdf"
                                id="inputPdf"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    if (file) {
                                        setPdfFile(file);
                                        setPdfPreviewUrl(URL.createObjectURL(file));
                                    }
                                }}
                            />
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    setShowPdfModal(false);
                                    setPdfFile(null);
                                    setPdfPreviewUrl(null);
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                    handlePDFSubmit();
                                    setShowPdfModal(false);
                                    setPdfFile(null);
                                    setPdfPreviewUrl(null);
                                }}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        <style>{`
                .card-paciente {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .card-paciente:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
                }

                .card-paciente .card-body {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 15px;
                }

                .card-paciente .avatar {
                    width: 80px;
                    height: 80px;
                    margin-bottom: 10px;
                }

                .card-paciente .badge {
                    font-size: 12px;
                    margin-bottom: 10px;
                }

                .card-paciente .info-paciente {
                    width: 100%;
                    text-align: left;
                }

                .card-paciente .info-paciente p {
                    margin-bottom: 8px;
                    font-size: 14px;
                    white-space: normal;
                    overflow: visible;
                }

                .card-paciente .btn-ver {
                    width: 100%;
                    margin-top: auto;
                    font-size: 14px;
                }

                .info-paciente .row {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                }

                .info-paciente .col-6 {
                    flex: 1 1 45%;
                    min-width: 45%;
                }

                @media (max-width: 768px) {
                    .card-paciente .avatar {
                        width: 60px;
                        height: 60px;
                    }

                    .card-paciente .info-paciente p {
                        font-size: 12px;
                    }

                    .card-paciente .btn-ver {
                        font-size: 12px;
                    }

                    .info-paciente .col-6 {
                        flex: 1 1 100%;
                        min-width: 100%;
                    }
                }
            `}</style>
    </>);
};