function changeAjaxFast(
  table,
  columnChange,
  value,
  columnWhere,
  idWhere,
  toast = false
) {
  console.log("Funcion");

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

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleString("es-AR", {
    timeZone: "UTC", // Fuerza a usar UTC
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  return formattedDate;
};

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
  const token = localStorage.getItem("auth_token");

  if (token) {
    const payloadBase64 = token.split(".")[1];
    return JSON.parse(atob(payloadBase64));
  }

  console.log("No token found in localStorage");
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
