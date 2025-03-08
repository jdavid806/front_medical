<?php

include "../menu.php";
include "../header.php";
?>
<style type="text/css">
    .tox .tox-notification,
    .tox-promotion {
        display: none;
    }

    canvas {
        border: 1px solid black;
    }

    .field span {
        font-size: 10px;
        /* Reduce el tamaño del texto */
        color: #555;
        /* Opcional: hace el texto más tenue */
    }

    .btn-sm {
        padding: 3px 6px;
        /* Reduce el padding */
        font-size: 10px;
        /* Reduce el tamaño del icono */
    }
</style>

<div class="content">
    <div class="container">
        <div class="row">
            <div class="col">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Formato de impresión</h5>

                        <div class="row g-3">
                            <div class="col-md-6">
                                <label for="template_name" class="form-label">Nombre de la plantilla</label>
                                <input type="text" class="form-control" id="template_name" name="template_name">
                            </div>
                            <div class="col-md-6">
                                <label for="size_sheet" class="form-label">Tamaño de la hoja</label>
                                <select id="size_sheet" class="form-select">
                                    <option selected>Seleccione...</option>
                                    <option value="carta">Carta</option>
                                    <option value="oficio">Oficio</option>
                                    <option value="a4">A4</option>
                                    <option value="a5">A5</option>
                                    <option value="a6">A6</option>
                                </select>
                            </div>
                            <div class="col-6">
                                <label for="width_sheet" class="form-label">Ancho</label>
                                <input type="number" class="form-control" id="width_sheet" name="width_sheet">
                            </div>
                            <div class="col-6">
                                <label for="sheet_height" class="form-label">Alto</label>
                                <input type="number" class="form-control" id="sheet_height" name="sheet_height">
                            </div>
                            <div class="col-md-6">
                                <label for="margin_top" class="form-label">Margen superior</label>
                                <input type="number" class="form-control" id="margin_top" name="margin_top">
                            </div>
                            <div class="col-md-6">
                                <label for="margin_bottom" class="form-label">Margen inferior</label>
                                <input type="number" class="form-control" id="margin_bottom" name="margin_bottom">
                            </div>
                            <div class="col-md-6">
                                <label for="orientation" class="form-label">Orientación</label>
                                <select id="orientation" class="form-select" name="orientation">
                                    <option selected>Seleccione...</option>
                                    <option value="vertical">Vertical</option>
                                    <option value="horizontal">Horizontal</option>
                                </select>
                            </div>
                            <div class="col-6">
                                <label for="print_type" class="form-label">Tipo de impresión</label>
                                <select id="print_type" class="form-select" name="print_type">
                                    <option selected>Seleccione...</option>
                                    <option value="full">Página completa</option>
                                    <option value="half">Media página</option>
                                </select>
                            </div>
                            <div class="col-12 text-start">
                                <label for="header_sheet" class="form-label">Cabecera de pagina</label>
                                <textarea id="header_sheet" class="form-control"></textarea>
                                <input type="number" class="form-control" id="header_height" name="header_height">
                                <small>tamaño del encabezado</small>
                            </div>
                            <hr>

                            <div class="col-12 text-start">
                                <div class="col-md-12">
                                    <label for="orientation" class="form-label">impresion a:</label>
                                    <select id="orientation" class="form-select" name="orientation">
                                        <option selected>Seleccione...</option>
                                        <option value="vertical">Vertical</option>
                                        <option value="horizontal">Horizontal</option>
                                    </select>
                                </div>

                                <div class="row gap-2 m-2">
                                    <div class="col-auto field"> <span required="">[[NOMBRE_PACIENTE]]</span>
                                        <button type="button" class="btn btn-outline-secondary btn-sm" onclick="showMessage(this)"><i class="far fa-copy"></i></button>
                                        <div class="valid-feedback">Elemento copiado</div>
                                    </div>
                                    <div class="col-auto field"> <span>[[DOCUMENTO]]</span> <button type="button" class="btn btn-outline-secondary btn-sm" onclick="showMessage(this)"><i class="far fa-copy"></i></button>
                                        <div class="valid-feedback">Elemento copiado</div>
                                    </div>
                                    <div class="col-auto field"> <span>[[NOMBRE_DOCTOR]]</span> <button type="button" class="btn btn-outline-secondary btn-sm" onclick="showMessage(this)"><i class="far fa-copy"></i></button>
                                        <div class="valid-feedback">Elemento copiado</div>
                                    </div>
                                    <div class="col-auto field"> <span>[[EDAD]]</span> <button type="button" class="btn btn-outline-secondary btn-sm" onclick="showMessage(this)"><i class="far fa-copy"></i></button>
                                        <div class="valid-feedback">Elemento copiado</div>
                                    </div>
                                    <div class="col-auto field"> <span>[[FECHAACTUAL]]</span> <button type="button" class="btn btn-outline-secondary btn-sm" onclick="showMessage(this)"><i class="far fa-copy"></i></button>
                                        <div class="valid-feedback">Elemento copiado</div>
                                    </div>
                                    <div class="col-auto field"> <span>[[FECHANACIMIENTO]]</span> <button type="button" class="btn btn-outline-secondary btn-sm" onclick="showMessage(this)"><i class="far fa-copy"></i></button>
                                        <div class="valid-feedback">Elemento copiado</div>
                                    </div>
                                    <div class="col-auto field"> <span>[[TELEFONO]]</span> <button type="button" class="btn btn-outline-secondary btn-sm" onclick="showMessage(this)"><i class="far fa-copy"></i></button>
                                        <div class="valid-feedback">Elemento copiado</div>
                                    </div>
                                    <div class="col-auto field"> <span>[[CORREOELECTRONICO]]</span> <button type="button" class="btn btn-outline-secondary btn-sm" onclick="showMessage(this)"><i class="far fa-copy"></i></button>
                                        <div class="valid-feedback">Elemento copiado</div>
                                    </div>
                                    <div class="col-auto field"> <span>[[CIUDAD]]</span> <button type="button" class="btn btn-outline-secondary btn-sm" onclick="showMessage(this)"><i class="far fa-copy"></i></button>
                                        <div class="valid-feedback">Elemento copiado</div>
                                    </div>
                                </div>

                                <label for="body_sheet" class="form-label">Cuerpo de la impresion</label>
                                <textarea id="body_sheet" class="form-control"></textarea>
                            </div>

                            <hr>
                            <div class="col-12">
                                <label for="footer_sheet" class="form-label">Pie de pagina</label>
                                <textarea id="footer_sheet" class="form-control"></textarea>
                                <input type="number" class="form-control" id="footer_height" name="footer_height">
                                <small>tamaño del pie de pagina</small>
                            </div>
                            <hr>

                            <div class="col-6">
                                <input class="form-check-input" type="checkbox" id="addSignature" />
                                <label class="form-check-label" for="addSignature">
                                    Habilitar firma
                                </label>
                            </div>
                            <div class="col-6">
                                <button id="generate_pdf" type="button" class="btn btn-primary">Generar PDF</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card">
                    <div class="card-body">
                        <canvas id="sheet_print" width="408" height="528"></canvas>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>

<script src="https://cdn.tiny.cloud/1/no-api-key/tinymce/6.3.1-12/skins/ui/oxide/skin.min.css" referrerpolicy="origin"></script>

<script>
    const sizeOptions = {
        carta: {
            width: 408,
            height: 528
        },
        oficio: {
            width: 408,
            height: 672
        },
        a4: {
            width: 420,
            height: 594
        },
        a5: {
            width: 297,
            height: 420
        },
        a6: {
            width: 210,
            height: 297
        },
    };

    let signature = {
        x: 150,
        y: 200,
        width: 57,
        height: 23,
        dragging: false,
    };

    const canvas = document.getElementById("sheet_print");
    const ctx = canvas.getContext("2d");
    const signatureCheckbox = document.getElementById("addSignature");

    let isDraggingHeader = false;
    let isDraggingFooter = false;
    let dragStartY = 0;
    let headerPosition = {
        x: 0,
        y: 0
    }; // Posición inicial del encabezado
    let footerPosition = {
        x: 0,
        y: canvas.height - 100
    }; // Posición inicial del pie de página
    let headerHeight = 0;
    let footerHeight = 0;


    let isSignatureEnabled = false;

    let jsonConfigPrint = {
        width: 408,
        height: 528,
        marginTop: 0,
        marginBottom: 0,
        headerHeight: 0,
        footerHeight: 0,
        headerContent: "",
        bodyContent: "",
        footerContent: "",
        nameSheet: '',
        isSignatureEnabled,
        signature
    };

    document.getElementById("print_type").addEventListener("change", function() {
        updateCanvas();
    });

    function updateCanvas() {
        const width = parseInt(document.getElementById("width_sheet").value) || 408;
        let height = parseInt(document.getElementById("sheet_height").value) || 528;

        const printType = document.getElementById("print_type").value;

        // Ajustar altura si es "media página"
        if (printType === "half") {
            height = height / 2;
        }

        const marginTop = parseInt(document.getElementById("margin_top").value) || 0;
        const marginBottom = parseInt(document.getElementById("margin_bottom").value) || 0;
        const headerHeight = parseInt(document.getElementById("header_height").value) || 0;
        const footerHeight = parseInt(document.getElementById("footer_height").value) || 0;
        const headerContent = tinymce.get("header_sheet")?.getContent() || "";
        const bodyContent = tinymce.get("body_sheet")?.getContent() || "";
        const footerContent = tinymce.get("footer_sheet")?.getContent() || "";
        const nameSheet = document.getElementById("template_name").value;
        let drawTableHeader = "";

        // Actualizar dimensiones del canvas
        canvas.width = width;
        canvas.height = height;

        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar área de impresión
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        const innerWidth = width;
        const innerHeight = height - marginTop - marginBottom - headerHeight;

        // Dibujar rectángulo interno (área de impresión)
        ctx.strokeRect(0, marginTop + headerHeight, innerWidth, innerHeight);

        // Dibujar encabezado si headerHeight > 0
        if (headerHeight > 0) {
            ctx.fillStyle = "lightgray"; // Color del encabezado
            ctx.fillRect(0, marginTop, innerWidth, headerHeight); // Rectángulo del encabezado
            ctx.fillStyle = "black"; // Color del texto
            ctx.font = "12px Arial";

            // Dibujar contenido del encabezado
            ctx.save();
            ctx.font = "10px Arial";
            ctx.fillStyle = "black";

            // Reemplazar el contenido HTML de la tabla con texto
            let headerHTML = headerContent.replace(/<\/?[^>]+(>|$)/g, ""); // Remover etiquetas HTML
            headerHTML = headerHTML.replace(/&nbsp;/g, " "); // Reemplazar los espacios no rompibles con espacios normales

            // Si es una tabla, dibujar su estructura
            if (headerContent.includes("<table")) {
                drawTable(headerContent, marginTop + 10, innerWidth); // Llamar a una función que dibuje la tabla
            } else {
                ctx.fillText(headerHTML, 10, marginTop + 10);
            }

            ctx.restore();
        }

        if (bodyContent) {
            ctx.save();
            ctx.font = "12px Arial";
            ctx.fillStyle = "black";
            let bodyText = bodyContent.replace(/<\/?[^>]+(>|$)/g, "").replace(/&nbsp;/g, " ");
            ctx.fillText(bodyText, 10, marginTop + headerHeight + 20);
            ctx.restore();
        }

        if (footerHeight > 0) {
            ctx.fillStyle = "lightgray"; // Color del pie de página
            ctx.fillRect(0, height - marginBottom - footerHeight, innerWidth, footerHeight); // Rectángulo del pie de página
            ctx.fillStyle = "black"; // Color del texto
            ctx.font = "12px Arial";

            // Dibujar contenido del pie de página
            ctx.save();
            ctx.font = "10px Arial";
            ctx.fillStyle = "black";

            // Reemplazar el contenido HTML de la tabla con texto
            let footerHTML = footerContent.replace(/<\/?[^>]+(>|$)/g, ""); // Remover etiquetas HTML
            footerHTML = footerHTML.replace(/&nbsp;/g, " "); // Reemplazar los espacios no rompibles con espacios normales

            // Si es una tabla, dibujar su estructura
            if (footerContent.includes("<table")) {
                drawTable(footerContent, height - marginBottom - footerHeight + 10, innerWidth); // Llamar a una función que dibuje la tabla
            } else {
                ctx.fillText(footerHTML, 10, height - marginBottom - footerHeight + 40);
            }

            ctx.restore();
        }

        // Redibujar la firma si está habilitada
        if (isSignatureEnabled) {
            drawSignature();
        }

        const tableHeader = document.createElement("div");
        tableHeader.innerHTML = headerContent;


        const tableSelectorHeader = tableHeader.querySelector("table");
        if (tableSelectorHeader) {
            tableSelectorHeader.style.marginTop = headerHeight / 2 + "px";
            tableSelectorHeader.style.transform = "translateY(25%)";
            tableSelectorHeader.style.tableLayout = "fixed";
        }

        const tableFooter = document.createElement("div");
        tableFooter.innerHTML = footerContent;


        const tableSelectorFooter = tableFooter.querySelector("table");
        if (tableSelectorFooter) {
            tableSelectorFooter.style.marginTop = footerHeight / 2 + "px";
            tableSelectorFooter.style.transform = "translateY(25%)";
            tableSelectorFooter.style.tableLayout = "fixed";
        }


        jsonConfigPrint = {
            width: width * 2,
            height: height * 2,
            marginTop: marginTop * 2,
            marginBottom: marginBottom * 2,
            headerHeight: headerHeight * 2,
            footerHeight: footerHeight * 2,
            headerContent: tableSelectorHeader?.outerHTML,
            footerContent: tableSelectorFooter?.outerHTML,
            bodyContent,
            nameSheet,
            isSignatureEnabled,
            signature: {
                x: signature.x * 2,
                y: signature.y * 2,
                width: signature.width * 2,
                height: signature.height * 2,
                dragging: signature.dragging
            }
        };


    }

    function drawTable(tableHTML, startY, width) {
        const table = document.createElement("div");
        table.innerHTML = tableHTML;

        const rows = table.querySelectorAll("tr");
        const cellPadding = 1;
        let y = startY;

        rows.forEach(row => {
            const cells = row.querySelectorAll("td, th");
            let x = 0;
            cells.forEach(cell => {
                const cellWidth = (width - (cells.length - 1) * cellPadding) / cells.length;
                ctx.strokeRect(x, y, cellWidth, 20); // Dibujar la celda
                ctx.fillText(cell.innerText || "", x + 5, y + 15); // Escribir el contenido de la celda
                x += cellWidth + cellPadding;
            });
            y += 20;
        });
    }

    document.getElementById("size_sheet").addEventListener("change", function() {
        const size = this.value;
        if (sizeOptions[size]) {
            document.getElementById("width_sheet").value = sizeOptions[size].width;
            document.getElementById("sheet_height").value = sizeOptions[size].height;
            updateCanvas();
        }
    });

    document.getElementById("width_sheet").addEventListener("input", updateCanvas);
    document.getElementById("sheet_height").addEventListener("input", updateCanvas);
    document.getElementById("margin_top").addEventListener("input", updateCanvas);
    document.getElementById("margin_bottom").addEventListener("input", updateCanvas);
    document.getElementById("header_height").addEventListener("input", updateCanvas);
    document.getElementById("footer_height").addEventListener("input", updateCanvas);

    document.getElementById("orientation").addEventListener("change", function() {
        const orientation = this.value;
        let width = parseInt(document.getElementById("width_sheet").value);
        let height = parseInt(document.getElementById("sheet_height").value);

        if (orientation === "horizontal" && width < height) {
            [width, height] = [height, width];
        } else if (orientation === "vertical" && width > height) {
            [width, height] = [height, width];
        }

        document.getElementById("width_sheet").value = width;
        document.getElementById("sheet_height").value = height;
        updateCanvas();
    });

    function drawSignature() {
        // Dibujar marco de la firma
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.strokeRect(signature.x, signature.y, signature.width, signature.height);

        // Dibujar texto de firma
        ctx.font = "10px Arial";
        ctx.fillStyle = "blue";
        ctx.fillText("Firma aquí", signature.x + 5, signature.y + 15);
    }

    function isInsideSignature(x, y) {
        return (
            x > signature.x &&
            x < signature.x + signature.width &&
            y > signature.y &&
            y < signature.y + signature.height
        );
    }

    canvas.addEventListener("mousedown", (e) => {
        if (!isSignatureEnabled) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        if (isInsideSignature(mouseX, mouseY)) {
            signature.dragging = true;
            signature.offsetX = mouseX - signature.x;
            signature.offsetY = mouseY - signature.y;
        }
    });

    canvas.addEventListener("mousemove", (e) => {
        if (!signature.dragging) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        signature.x = mouseX - signature.offsetX;
        signature.y = mouseY - signature.offsetY;

        updateCanvas();
    });

    canvas.addEventListener("mouseup", () => {
        signature.dragging = false;
    });

    canvas.addEventListener("mouseleave", () => {
        signature.dragging = false;
    });

    signatureCheckbox.addEventListener("change", () => {
        isSignatureEnabled = signatureCheckbox.checked;
        updateCanvas();
    });

    // Eventos para arrastrar el encabezado y pie de página
    canvas.addEventListener("mousedown", (event) => {
        const {
            offsetX,
            offsetY
        } = event;

        if (
            offsetY >= headerPosition.y &&
            offsetY <= headerPosition.y + headerHeight
        ) {
            isDraggingHeader = true;
            dragStartY = offsetY - headerPosition.y;
        }

        if (
            offsetY >= footerPosition.y &&
            offsetY <= footerPosition.y + footerHeight
        ) {
            isDraggingFooter = true;
            dragStartY = offsetY - footerPosition.y;
        }
    });

    canvas.addEventListener("mousemove", (event) => {
        if (isDraggingHeader) {
            headerPosition.y = event.offsetY - dragStartY;
            updateCanvas();
        }

        if (isDraggingFooter) {
            footerPosition.y = event.offsetY - dragStartY;
            updateCanvas();
        }
    });

    canvas.addEventListener("mouseup", () => {
        isDraggingHeader = false;
        isDraggingFooter = false;
    });

    canvas.addEventListener("mouseleave", () => {
        isDraggingHeader = false;
        isDraggingFooter = false;
    });

    // Inicializar
    updateCanvas();

    document.addEventListener("DOMContentLoaded", function() {
        tinymce
            .init({
                selector: "#header_sheet",
                plugins: "table code advtable lists fullscreen",
                setup: (editor) => {
                    editor.on("keyup change", () => {
                        updateCanvas(); // Actualizar el canvas cuando se escriba en el editor
                    });
                }
            })
            .then((editors) => console.log("Inicialización exitosa"))
            .catch((error) => console.error("Error:", error));
        tinymce
            .init({
                selector: "#body_sheet",
                plugins: "table code advtable lists fullscreen",
                setup: (editor) => {
                    editor.on("keyup change", () => {
                        updateCanvas(); // Actualizar el canvas cuando se escriba en el editor
                    });
                }
            })
            .then((editors) => console.log("Inicialización exitosa"))
            .catch((error) => console.error("Error:", error));
        tinymce
            .init({
                selector: "#footer_sheet",
                plugins: "table code advtable lists fullscreen",
                setup: (editor) => {
                    editor.on("keyup change", () => {
                        updateCanvas(); // Actualizar el canvas cuando se escriba en el editor
                    });
                }
            })
            .then((editors) => console.log("Inicialización exitosa"))
            .catch((error) => console.error("Error:", error));

        document.querySelectorAll(".field button").forEach(button => {
            button.addEventListener("click", function() {
                let text = this.previousElementSibling.textContent.trim(); // Obtiene el texto dentro del <span>
                navigator.clipboard.writeText(text).then(() => {
                    console.log("Texto copiado: ", text);
                }).catch(err => {
                    console.error("Error al copiar: ", err);
                });
            });
        });
    });

    document.getElementById("generate_pdf").addEventListener("click", function(e) {
        console.log(jsonConfigPrint);

        const jsonData = JSON.stringify(jsonConfigPrint);

        fetch('../Configuracion/generate_pdf.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: jsonData,
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error al generar el PDF');
                }
                return response.blob(); // Convertir la respuesta en un blob
            })
            .then((blob) => {
                // Crear una URL para el blob
                const url = window.URL.createObjectURL(blob);

                // Crear un enlace para descargar o mostrar el PDF
                const link = document.createElement('a');
                link.href = url;
                link.download = 'document.pdf'; // Nombre del archivo para descargar
                link.target = '_blank'; // Abre en una nueva pestaña
                link.click();

                // Liberar la URL del blob
                window.URL.revokeObjectURL(url);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
</script>


<?php include "../footer.php"; ?>