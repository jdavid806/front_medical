<div class="row gx-3 gy-4 mb-5">
    <div class="card mb-3 p-3">
        <div class="d-flex">
            <ul class="nav nav-underline fs-9 flex-column me-3" id="tabs-typeMessages" role="tablist">
                <li class="nav-item" role="exams">
                    <button class="nav-link active" id="exams-tab" data-bs-toggle="tab" data-bs-target="#exams-tab-pane"
                        type="button" role="tab" aria-controls="exams-tab-pane" aria-selected="true">
                        <i class="fa-solid fa-microscope"></i> Exámenes
                    </button>
                </li>
                <!-- <li class="nav-item" role="exam-categories">
                    <button class="nav-link" id="exam-categories-tab" data-bs-toggle="tab" data-bs-target="#exam-categories-tab-pane"
                        type="button" role="tab" aria-controls="exam-categories-tab-pane" aria-selected="false">
                        <i class="fa-solid fa-folder-open"></i> Categorias de Exámenes
                    </button>
                </li>
                <li class="nav-item" role="exam-packages">
                    <button class="nav-link" id="exam-packages-tab" data-bs-toggle="tab" data-bs-target="#exam-packages-tab-pane"
                        type="button" role="tab" aria-controls="exam-packages-tab-pane" aria-selected="false">
                        <i class="fa-solid fa-box"></i> Paquetes de exámenes
                    </button>
                </li> -->
            </ul>

            <div class="tab-content w-100" id="typeMessages-tabContent">
                <div class="tab-pane fade show active" id="exams-tab-pane" role="tabpanel" aria-labelledby="exams-tab">
                    <div id="examsConfigReact"></div>
                </div>

                <!-- <div class="tab-pane fade" id="exam-categories-tab-pane" role="tabpanel" aria-labelledby="exam-categories-tab">
                    <div id="examsCategoriesReact"></div>
                </div>

                <div class="tab-pane fade" id="exam-packages-tab-pane" role="tabpanel" aria-labelledby="exam-packages-tab">
                    Aquí van los paquetes
                </div> -->
            </div>
        </div>
    </div>
</div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        ExamConfigApp
    } from './react-dist/exams-config/ExamConfigApp.js';
    import {
        ExamCategoryApp
    } from './react-dist/exam-categories/ExamCategoryApp.js';

    ReactDOMClient.createRoot(document.getElementById('examsConfigReact')).render(React.createElement(ExamConfigApp));
    // ReactDOMClient.createRoot(document.getElementById('examsCategoriesReact')).render(React.createElement(ExamCategoryApp));
</script>