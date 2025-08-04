<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Perfil de Paciente</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome para íconos -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
    body {
        background-color: #f8f9fa;
        color: #333;
    }

    .profile-header {
        background-color: white;
        border-bottom: 1px solid #eaeaea;
    }

    .profile-img {
        width: 15rem;
        height: 15rem;
        object-fit: cover;
        border: 4px solid white;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .gallery-img {
        height: 200px;
        object-fit: cover;
        transition: opacity 0.3s;
        cursor: pointer;
    }

    .gallery-img:hover {
        opacity: 0.9;
    }

    .social-icon {
        width: 36px;
        height: 36px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: #f0f0f0;
        margin: 0 3px;
        color: #555;
        text-decoration: none;
        transition: all 0.3s;
    }

    .social-icon:hover {
        background: #e0e0e0;
        color: #333;
    }

    .card {
        border: none;
        box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
        margin-bottom: 20px;
    }

    .section-title {
        font-size: 1.2rem;
        color: #444;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
        margin-bottom: 15px;
    }

    .medical-info-item {
        margin-bottom: 15px;
    }

    .medical-info-title {
        font-weight: bold;
        color: #2c3e50;
    }
    </style>
</head>

<body>
    <!-- Header del perfil -->
    <div class="profile-header py-4">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-md-3 text-center">
                    <img src="https://img.freepik.com/foto-gratis/retrato-hombre-blanco-aislado_53876-40306.jpg"
                        alt="Foto de perfil" class="profile-img rounded-circle mb-3">
                </div>
                <div class="col-md-9">
                    <h2 class="mb-1">Carlos Méndez</h2>
                    <p class="text-muted mb-2"><i class="fas fa-user me-1"></i> Paciente</p>

                    <p class="mb-3">
                        <i class="fas fa-map-marker-alt me-1"></i>
                        <span>Calle Principal 456, Departamento 3B, Buenos Aires</span>
                    </p>

                    <div class="d-flex mb-3">
                        <a href="#" class="social-icon"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
                        <a href="#" class="social-icon"><i class="fas fa-envelope"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Descripción y contenido -->
    <div class="container my-4">
        <div class="row">
            <div class="col-lg-8">
                <!-- Sección "Descripción personal" -->
                <div class="card">
                    <div class="card-body">
                        <h5 class="section-title"><i class="fas fa-user me-2"></i>Descripción personal</h5>
                        <p class="card-text">Soy Carlos Méndez, tengo 42 años y trabajo como ingeniero civil. Me gusta
                            mantenerme activo practicando fútbol los fines de semana y salir a correr por las mañanas.
                            Estoy casado y tengo dos hijos.</p>
                        <p class="card-text">Siempre he tratado de llevar una vida saludable, pero recientemente he
                            estado experimentando algunos problemas de salud que me preocupan.</p>
                    </div>
                </div>

                <!-- Solicitud de atención -->
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h5 class="section-title mb-0"><i class="fas fa-heartbeat me-2"></i>Solicitud de atención
                            </h5>
                        </div>

                        <div class="mb-4">
                            <h6>Descripción del problema:</h6>
                            <p>Desde hace aproximadamente tres semanas, he estado experimentando dolores agudos en el
                                pecho que aparecen especialmente cuando realizo actividad física. El dolor es punzante y
                                a veces se irradia hacia el brazo izquierdo. También he notado que me canso más
                                fácilmente al subir escaleras o caminar rápido. Estos síntomas me preocupan porque mi
                                padre tuvo problemas cardíacos a mi edad.</p>
                        </div>

                        <div class="row g-3 mb-4">
                            <!-- Imágenes médicas -->
                            <div class="col-md-4 col-6">
                                <img src="https://www.vital-balance.com/wp-content/uploads/2017/05/radiografia-1-VB.jpg"
                                    alt="Radiografía de tórax" class="img-fluid rounded gallery-img">
                            </div>
                            <div class="col-md-4 col-6">
                                <img src="https://imgv2-2-f.scribdassets.com/img/document/485018492/original/fa4c95f6e7/1?v=1"
                                    alt="Ecocardiograma" class="img-fluid rounded gallery-img">
                            </div>
                            <div class="col-md-4 col-6">
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx9IdAso7dgoPc2iVMBkQVNy76BlX6hTrjyA&s"
                                    alt="Electrocardiograma" class="img-fluid rounded gallery-img">
                            </div>
                        </div>

                        <div class="d-flex justify-content-end gap-3">
                            <button class="btn btn-outline-primary">
                                <i class="fas fa-user-md me-2"></i>Recomendar doctor
                            </button>
                            <button class="btn btn-primary">
                                <i class="fas fa-check-circle me-2"></i>Tomar caso
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-4">
                <!-- Información médica relevante -->
                <div class="card">
                    <div class="card-body">
                        <h5 class="section-title"><i class="fas fa-file-medical me-2"></i>Información médica</h5>

                        <div class="medical-info-item">
                            <div class="medical-info-title">Antecedentes familiares:</div>
                            <ul>
                                <li>Padre: Infarto a los 45 años</li>
                                <li>Madre: Hipertensión arterial</li>
                                <li>Abuelo materno: Diabetes tipo 2</li>
                            </ul>
                        </div>

                        <div class="medical-info-item">
                            <div class="medical-info-title">Antecedentes personales:</div>
                            <ul>
                                <li>Hipertensión arterial diagnosticada hace 5 años</li>
                                <li>Colesterol elevado (en tratamiento)</li>
                                <li>Apnea del sueño leve</li>
                            </ul>
                        </div>

                        <div class="medical-info-item">
                            <div class="medical-info-title">Medicamentos actuales:</div>
                            <ul>
                                <li>Losartán 50mg - 1 comprimido al día</li>
                                <li>Atorvastatina 20mg - 1 comprimido al día</li>
                                <li>Aspirina 100mg - 1 comprimido al día</li>
                            </ul>
                        </div>

                        <div class="medical-info-item">
                            <div class="medical-info-title">Alergias:</div>
                            <ul>
                                <li>Penicilina (rash cutáneo)</li>
                                <li>Ibuprofeno (malestar estomacal)</li>
                            </ul>
                        </div>

                        <div class="medical-info-item">
                            <div class="medical-info-title">Otros datos relevantes:</div>
                            <ul>
                                <li>Fumador ocasional (5-10 cigarrillos/semana)</li>
                                <li>Consumo moderado de alcohol</li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <!-- Bootstrap JS Bundle con Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>