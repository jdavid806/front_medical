<div class="modal fade" id="modalGrabacion" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-md">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Grabación al sistema</h5>
                <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="card">
                    <div class="card-body">
                        <!-- Agregamos los detalles de la cita -->
                        <div class="mb-3">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-2">
                                        <label class="form-label fw-bold">Cita:</label>
                                        <span class="small">7</span>
                                    </div>
                                    <div class="mb-2">
                                        <label class="form-label fw-bold">Fecha:</label>
                                        <span class="small">2024-10-03</span>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-2">
                                        <label class="form-label fw-bold">Hora:</label>
                                        <span class="small">10:00:00</span>
                                    </div>
                                    <div class="mb-2">
                                        <label class="form-label fw-bold">Paciente:</label>
                                        <span class="small">Felipe Rodriguez</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Input file -->
                        <div class="mb-2">
                            <label class="form-label" for="customFile">Cargar grabación al sistema</label>
                        </div>
                        <input class="form-control" id="customFile" type="file">
                    </div>
                </div>

                <div class="card mt-2">
                    <div class="card-body">

                        <div id="tableExample" data-list="{&quot;valueNames&quot;:[&quot;name&quot;,&quot;email&quot;,&quot;age&quot;],&quot;page&quot;:5,&quot;pagination&quot;:true}">
                            <div class="table-responsive">
                                <table class="table table-sm fs-9 mb-0">
                                    <thead>
                                        <tr>
                                            <th class="sort border-top border-translucent ps-3 small" data-sort="name">Fecha</th>
                                            <th class="sort border-top border-translucent small" data-sort="email">Nombre</th>
                                            <th class="sort text-end align-middle pe-0 border-top border-translucent small" scope="col">ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody class="list">
                                        <tr>
                                            <td class="align-middle ps-3 name small">Anna</td>
                                            <td class="align-middle email small">2025-10-16</td>
                                            <td class="align-middle white-space-nowrap text-end pe-0">
                                                <div class="btn-reveal-trigger position-static"><button class="btn btn-sm dropdown-toggle dropdown-caret-none transition-none btn-reveal fs-10" type="button" data-bs-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent"><svg class="svg-inline--fa fa-ellipsis fs-10" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ellipsis" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
                                                            <path fill="currentColor" d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z"></path>
                                                        </svg><!-- <span class="fas fa-ellipsis-h fs-10"></span> Font Awesome fontawesome.com --></button>
                                                    <div class="dropdown-menu dropdown-menu-end py-2"><a class="dropdown-item" href="#!">View</a><a class="dropdown-item" href="#!">Export</a>
                                                        <div class="dropdown-divider"></div><a class="dropdown-item text-danger" href="#!">Remove</a>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        
                                        
                                    </tbody>
                                </table>
                            </div>
                            <div class="d-flex flex-between-center pt-3">
                                <div class="pagination d-none">
                                    <li class="active"><button class="page small" type="button" data-i="1" data-page="5">1</button></li>
                                    <li><button class="page small" type="button" data-i="2" data-page="5">2</button></li>
                                    <li><button class="page small" type="button" data-i="3" data-page="5">3</button></li>
                                    <li class="disabled"><button class="page" type="button">...</button></li>
                                </div>
                                <p class="mb-0 fs-9">
                                    <span class="d-none d-sm-inline-block" data-list-info="data-list-info">1 to 5 <span class="text-body-tertiary"> Items of </span>43</span>
                                    <span class="d-none d-sm-inline-block"> — </span>
                                    <a class="fw-semibold" href="#!" data-list-view="*">
                                        View all
                                        <svg class="svg-inline--fa fa-angle-right ms-1" data-fa-transform="down-1" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg="" style="transform-origin: 0.3125em 0.5625em;">
                                            <g transform="translate(160 256)">
                                                <g transform="translate(0, 32)  scale(1, 1)  rotate(0 0 0)">
                                                    <path fill="currentColor" d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" transform="translate(-160 -256)"></path>
                                                </g>
                                            </g>
                                        </svg><!-- <span class="fas fa-angle-right ms-1" data-fa-transform="down-1"></span> Font Awesome fontawesome.com -->
                                    </a><a class="fw-semibold d-none" href="#!" data-list-view="less">
                                        View Less
                                        <svg class="svg-inline--fa fa-angle-right ms-1" data-fa-transform="down-1" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg="" style="transform-origin: 0.3125em 0.5625em;">
                                            <g transform="translate(160 256)">
                                                <g transform="translate(0, 32)  scale(1, 1)  rotate(0 0 0)">
                                                    <path fill="currentColor" d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" transform="translate(-160 -256)"></path>
                                                </g>
                                            </g>
                                        </svg><!-- <span class="fas fa-angle-right ms-1" data-fa-transform="down-1"></span> Font Awesome fontawesome.com -->
                                    </a>
                                </p>
                                <div class="d-flex">
                                    <button class="btn btn-sm btn-primary disabled" type="button" data-list-pagination="prev" disabled=""><span>Previous</span></button>
                                    <button class="btn btn-sm btn-primary px-4 ms-2" type="button" data-list-pagination="next"><span>Next</span></button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button">Aceptar</button>
                <button class="btn btn-outline-primary" type="button" data-bs-dismiss="modal">Cancelar</button>
            </div>
        </div>
    </div>
</div>