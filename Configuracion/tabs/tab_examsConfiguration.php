<div class="row gx-3 gy-4 mb-5">
    <div class="card mb-3 p-3">
        <div id="examsConfigReact"></div>
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