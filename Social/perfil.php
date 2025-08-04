<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Perfil</title>
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

    .availability-badge {
        font-size: 0.85rem;
        font-weight: normal;
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
    </style>
</head>

<body>
    <!-- Header del perfil -->
    <div class="profile-header py-4">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-md-3 text-center">
                    <img src="https://cdn.euroinnova.edu.es/img/subidasEditor/doctor-5871743_640-1610073541.webp"
                        alt="Foto de perfil" class="profile-img rounded-circle mb-3">
                </div>
                <div class="col-md-9">
                    <h2 class="mb-1">Dr. Javier Rodríguez</h2>
                    <p class="text-muted mb-2"><i class="fas fa-user-md me-1"></i> Cirujano</p>

                    <p class="mb-3">
                        <i class="fas fa-map-marker-alt me-1"></i>
                        <span>Clínica San Lucas, Av. Principal 1234, Piso 5, Consultorio 502, Buenos Aires</span>
                    </p>

                    <div class="d-flex mb-3">
                        <a href="#" class="social-icon"><i class="fab fa-linkedin-in"></i></a>
                        <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="social-icon"><i class="fas fa-globe"></i></a>
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
                <!-- Sección "Sobre el doctor" -->
                <div class="card">
                    <div class="card-body">
                        <h5 class="section-title"><i class="fas fa-user-md me-2"></i>Sobre el doctor</h5>
                        <p class="card-text">
                            Soy el Dr. Javier Rodríguez, especialista en Cardiología con más de 15 años de experiencia.
                            Me gradué con honores de la Universidad de Buenos Aires, completé mi residencia en el
                            Hospital Italiano y realicé una subespecialización en Cardiología Intervencionista en
                            España.
                        </p>
                        <p class="card-text">
                            Me especializo en la prevención cardiovascular, el tratamiento de la hipertensión arterial y
                            el manejo de enfermedades coronarias. Hablo español, inglés y portugués.
                        </p>

                    </div>
                </div>

                <!-- Galería de fotos -->
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h5 class="section-title mb-0"><i class="fas fa-camera me-2"></i>Galería</h5>
                        </div>

                        <div class="row g-3">
                            <!-- Ejemplo de fotos - puedes reemplazar con imágenes reales -->
                            <div class="col-md-4 col-6">
                                <img src="https://cdn.euroinnova.edu.es/img/subidasEditor/el%20texto%20del%20p%C3%A1rrafo%20(2)%20(1)-1661953828.webp"
                                    alt="Clínica" class="img-fluid rounded gallery-img">
                            </div>
                            <div class="col-md-4 col-6">
                                <img src="https://cdn.prod.website-files.com/5ccb2bd0af1d55840b83eee3/642adfc4d24fba3c16ad49f2_dr-juanluis-arminio-cirujano-bogota-19.webp"
                                    alt="Equipo médico" class="img-fluid rounded gallery-img">
                            </div>
                            <div class="col-md-4 col-6">
                                <img src="https://drvargas.co/wp-content/uploads/2021/11/Art2.png" alt="Consultorio"
                                    class="img-fluid rounded gallery-img">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-4">
                <!-- Disponibilidad -->
                <div class="card">
                    <div class="card-body">
                        <h5 class="section-title"><i class="fas fa-calendar-alt me-2"></i>Disponibilidad</h5>

                        <div class="mb-3">
                            <h6 class="mb-2">Clínica San Lucas</h6>
                            <div class="d-flex align-items-center mb-2">
                                <span class="badge availability-badge bg-light text-dark me-2">Lun</span>
                                <span>9:00 - 13:00 / 16:00 - 20:00</span>
                            </div>
                            <div class="d-flex align-items-center mb-2">
                                <span class="badge availability-badge bg-light text-dark me-2">Mié</span>
                                <span>9:00 - 13:00 / 16:00 - 20:00</span>
                            </div>
                            <div class="d-flex align-items-center mb-2">
                                <span class="badge availability-badge bg-light text-dark me-2">Vie</span>
                                <span>9:00 - 13:00</span>
                            </div>
                        </div>

                        <div class="mb-3">
                            <h6 class="mb-2">Hospital Central</h6>
                            <div class="d-flex align-items-center mb-2">
                                <span class="badge availability-badge bg-light text-dark me-2">Mar</span>
                                <span>14:00 - 18:00</span>
                            </div>
                            <div class="d-flex align-items-center">
                                <span class="badge availability-badge bg-light text-dark me-2">Jue</span>
                                <span>14:00 - 18:00</span>
                            </div>
                        </div>

                        <button class="btn btn-primary w-100 mt-3">
                            <i class="fas fa-calendar-check me-2"></i>Pedir cita
                        </button>
                    </div>
                </div>

                <!-- Formación -->
                <div class="card">
                    <div class="card-body">
                        <h5 class="section-title"><i class="fas fa-graduation-cap me-2"></i>Formación</h5>
                        <ul class="list-unstyled">
                            <li class="mb-2">
                                <strong>Medicina</strong><br>
                                Universidad de Buenos Aires, 2005
                            </li>
                            <li class="mb-2">
                                <strong>Residencia en Cardiología</strong><br>
                                Hospital Italiano, 2008
                            </li>
                            <li>
                                <strong>Cardiología Intervencionista</strong><br>
                                Universidad de Barcelona, 2011
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS Bundle con Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>