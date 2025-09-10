function changeAjaxFast(
    table,
    columnChange,
    value,
    columnWhere,
    idWhere,
    toast = false
) {
    // console.log("Funcion");

    $.ajax({
        type: "POST",
        url: `${baseSitema}js/Ajax_Change_Fast.php`,
        data: {
            action: "changeAjaxFast",
            table: table,
            columnChange: columnChange,
            value: value,
            columnWhere: columnWhere,
            idWhere: idWhere,
        },
        success: function (response) {
            if (response == "ok") {
                if (toast) {
                    Swal.fire({
                        icon: "success",
                        title: "Actualizado",
                        showConfirmButton: false,
                        timer: 1500,
                        toast: true,
                        timerProgressBar: true,
                        position: "top-end",
                    });
                }
            } else {
                if (toast) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        showConfirmButton: false,
                        timer: 1500,
                        toast: true,
                        timerProgressBar: true,
                        position: "top-end",
                    });
                }
            }
        },
        error: function (xhr, status, error) {
            console.log(xhr);
            console.log(status);
            console.log(error);
        },
    });
}

export const formatDate = (dateString, returnAsISO = false) => {
    const date = new Date(dateString);

    if (returnAsISO) {
        // Devuelve formato: YYYY-MM-DD
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() es base 0
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Formato local con hora
    const formattedDate = date.toLocaleString("es-AR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
    return formattedDate;
};

export const formatDateDMY = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleString("es-AR", {
        timeZone: "UTC", // Fuerza a usar UTC
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    return formattedDate;
}

export const parseFechaDMY = (fechaString) => {
    if (!fechaString) return null;

    const [dia, mes] = fechaString.split("/").map((num) => parseInt(num, 10));

    if (!dia || !mes) return null; // Validación básica

    const hoy = new Date();
    return new Date(hoy.getFullYear(), mes - 1, dia); // `mes - 1` porque los meses en JavaScript van de 0 a 11
};

export const calcularDiasEntreFechas = (fechaInicio, fechaFin) => {
    if (!(fechaInicio instanceof Date) || !(fechaFin instanceof Date)) {
        throw new Error("Ambas fechas deben ser instancias de Date");
    }

    const milisegundosPorDia = 1000 * 60 * 60 * 24;
    const diferenciaEnMilisegundos = fechaFin.getTime() - fechaInicio.getTime();
    return Math.ceil(diferenciaEnMilisegundos / milisegundosPorDia);
};

export const rellenarFormularioConObjeto = (obj) => {
    Object.keys(obj).forEach((key) => {
        const element = document.querySelector(`[name="${key}"],[id="${key}"]`);
        if (element) {
            if (element.type === "checkbox") {
                element.checked = obj[key];
            } else {
                element.value = obj[key];
            }
        }
    });
};

export const handleSuccess = (alertManager, message) => {
    alertManager.success({ text: message });
    setTimeout(() => window.location.reload(), 2000);
};

export const handleError = (alertManager, err) => {
    if (err.data?.errors) {
        alertManager.formErrors(err.data.errors);
    } else {
        alertManager.error({ text: err.message || "Ocurrió un error inesperado" });
    }
};

export const objectToArray = (obj) => {
    const array = [];

    Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === "object") {
            throw new Error("No se permiten objetos anidados");
        }

        array.push({ value: key, label: value });
    });

    return array;
};

export const getJWTPayload = () => {
    const token = sessionStorage.getItem("auth_token");

    if (token) {
        const payloadBase64 = token.split(".")[1];
        return JSON.parse(atob(payloadBase64));
    }

    // console.log("No token found in localStorage");
    return null;
};

export const getUserLogged = () => {
    const userLogged = localStorage.getItem("userData");

    return JSON.parse(userLogged);
};

export function formatTime(date) {
    // Usar métodos locales en lugar de UTC
    const hours = String(date.getHours()).padStart(2, "0"); // Hora local
    const minutes = String(date.getMinutes()).padStart(2, "0"); // Minutos locales
    const seconds = String(date.getSeconds()).padStart(2, "0"); // Segundos locales

    return `${hours}:${minutes}:${seconds}`;
}

export function convertDateToHHMM(date) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
}

export function convertHHMMSSToDate(timeString) {
    // Get the current date
    const currentDate = new Date();

    // Split the time string into hours, minutes, and seconds
    const [hours, minutes, seconds] = timeString.split(":");

    // Set the hours, minutes, and seconds in the current date
    currentDate.setHours(hours);
    currentDate.setMinutes(minutes);
    currentDate.setSeconds(seconds);

    // Return the Date object with the specified time
    return currentDate;
}

export function convertHHMMToDate(timeString) {
    const currentDate = new Date();

    const [hours, minutes] = timeString.split(":");

    currentDate.setHours(hours);
    currentDate.setMinutes(minutes);

    return currentDate;
}

export function ordenarPorFecha(array, key) {
    return array.sort((a, b) => {
        const fechaA = new Date(a[key]).getTime();
        const fechaB = new Date(b[key]).getTime();

        return fechaA - fechaB;
    });
}

export function sortSpaghettiArray(array) {
    array.sort((a, b) => {
        const parseCustomDate = (dateString) => {
            const [datePart, timePart] = dateString.split(", ");
            const [dayStr, monthStr, yearStr] = datePart.split(" de ");
            const months = [
                "enero",
                "febrero",
                "marzo",
                "abril",
                "mayo",
                "junio",
                "julio",
                "agosto",
                "septiembre",
                "octubre",
                "noviembre",
                "diciembre",
            ];
            const day = parseInt(dayStr, 10);
            const month = months.indexOf(monthStr.toLowerCase());
            const year = parseInt(yearStr, 10);
            const [hours, minutes, seconds] = timePart.split(":").map(Number);
            return new Date(year, month, day, hours, minutes, seconds);
        };
        const dateA = parseCustomDate(a.createdAt);
        const dateB = parseCustomDate(b.createdAt);
        return dateB.getTime() - dateA.getTime();
    });
}

export function stringToDate(dateString) {
    if (!dateString) return new Date();

    const parts = dateString.split('-');
    if (parts.length !== 3) return new Date();

    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const day = parseInt(parts[2]);

    return new Date(year, month, day);
}

export function getAge(dateString) {
    const today = new Date();
    const birthDate = stringToDate(dateString);

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {
        type: mimeString
    });
}

export function validFile(id_input, throwError = true) {
    let fileInput = document.getElementById(id_input);
    let file = fileInput.files[0];

    console.log("fileInput", fileInput);
    console.log("file", file);

    if (!file && throwError) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Por favor seleccione un archivo antes de continuar.",
        });
        return;
    }

    return file;
}



function cleanJson(obj) {
    if (obj === null || obj === undefined) {
        return undefined;
    }

    if (typeof obj === 'object') {
        if (Array.isArray(obj)) {
            const cleanArray = obj
                .map(item => cleanJson(item))
                .filter(item => item !== undefined && item !== null && item !== '');
            return cleanArray.length === 0 ? undefined : cleanArray;
        }
        else {
            const cleanObj = {};
            let hasProperties = false;

            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const cleanValue = cleanJson(obj[key]);
                    if (cleanValue !== undefined && cleanValue !== null && cleanValue !== '') {
                        cleanObj[key] = cleanValue;
                        hasProperties = true;
                    }
                }
            }

            return hasProperties ? cleanObj : undefined;
        }
    }

    if (typeof obj === 'string' && obj.trim() === '') {
        return undefined;
    }

    return obj;
}

export function cleanJsonObject(obj) {
    const result = cleanJson(obj);
    return result === undefined ? {} : result;
}

export function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        console.log(args, delay);

        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

export function formatWhatsAppMessage(html, replacements) {
    // Primero reemplazar los placeholders en el HTML
    if (replacements) {
        Object.keys(replacements).forEach(key => {
            const placeholder = `\\[\\[${key}\\]\\]`; // Escapar los corchetes para la expresión regular
            const regex = new RegExp(placeholder, 'g');
            html = html.replace(regex, replacements[key]);
        });
    }

    // Convertir HTML a texto plano con mejor manejo de saltos de línea
    let text = html
        // Convertir párrafos y breaks a saltos de línea
        .replace(/<\/p>|<br\s*\/?>|<\/div>/gi, '\n')
        // Eliminar todas las demás etiquetas HTML
        .replace(/<[^>]+>/g, '')
        // Reemplazar entidades HTML
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'");

    // Limpiar formato
    text = text
        // Eliminar espacios múltiples
        .replace(/[ \t]+/g, ' ')
        // Eliminar espacios al inicio y final de cada línea
        .replace(/^[ \t]+|[ \t]+$/gm, '')
        // Eliminar líneas vacías múltiples
        .replace(/\n{3,}/g, '\n\n')
        // Eliminar espacios alrededor de saltos de línea
        .replace(/[ \t]*\n[ \t]*/g, '\n')
        // Eliminar espacios al inicio y final
        .trim();

    return text;
}

export function getIndicativeByCountry(nombrePais) {
    // Convertir el nombre del país a minúsculas y sin tildes (opcional, para mejor manejo)
    const pais = nombrePais.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Elimina tildes

    // Mapeo de países y sus indicativos (sin el "+")
    const indicativos = {
        'colombia': '57',
        'mexico': '52',
        'argentina': '54',
        'dominican republic': '1',
        'chile': '56',
        'peru': '51',
        'venezuela': '58',
        'ecuador': '593',
        'brasil': '55',
        'bolivia': '591'
    };

    // Devuelve el indicativo o null si no existe
    return indicativos[pais] || '1';
}

export function obtenerUltimaParteUrl() {
    // Obtener la URL completa
    const urlCompleta = window.location.href;

    // Crear un objeto URL para facilitar el análisis
    const url = new URL(urlCompleta);

    // Obtener la parte del pathname (ruta)
    const pathname = url.pathname;

    // Dividir el pathname por las barras y filtrar elementos vacíos
    const partes = pathname.split('/').filter(part => part !== '');

    // Devolver la última parte del pathname
    return partes.length > 0 ? partes[partes.length - 1] : '';
}

export function calculateDaysBetweenDates(startDate, endDate) {
    // Convert date strings to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate the dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error('Invalid date format. Please use "YYYY-MM-DD"');
    }

    // Calculate difference in milliseconds
    const timeDifference = end - start;

    // Convert milliseconds to days (1000 ms * 60 sec * 60 min * 24 hrs)
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

    // Return absolute value in case dates are reversed
    return Math.abs(Math.round(daysDifference));
}

/**
 * Calcula la distancia de Levenshtein entre dos strings
 * @param {string} a 
 * @param {string} b 
 * @returns {number} Distancia de Levenshtein
 */
export function levenshteinDistance(a, b) {
    const matrix = [];
    let i, j;

    // Inicializar la matriz
    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Calcular distancias
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // Sustitución
                    matrix[i][j - 1] + 1,     // Inserción
                    matrix[i - 1][j] + 1      // Eliminación
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

/**
 * Calcula el porcentaje de similitud entre dos strings
 * @param {string} str1 
 * @param {string} str2 
 * @returns {number} Porcentaje de similitud (0-1)
 */
export function similarity(str1, str2) {
    const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
    const maxLength = Math.max(str1.length, str2.length);
    return 1 - distance / maxLength;
}

export function getLocalTodayISODate() {
    return new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000).toISOString().split('T')[0];
}

export function daysBetweenDates(fecha1, fecha2) {
    const utc1 = Date.UTC(fecha1.getFullYear(), fecha1.getMonth(), fecha1.getDate());
    const utc2 = Date.UTC(fecha2.getFullYear(), fecha2.getMonth(), fecha2.getDate());

    return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
}

export function addDaysToDate(date, days) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
}