export function aPesos(valor) {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(valor);
  }
  
  export function formatFullName(person) {
    return `${person.first_name ?? ""} ${person.last_name ?? ""}`.trim();
  }
  
  export function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-MX', options);
  }
  
  export function getStatusBadgeClass(status) {
    const statusMap = {
      PENDING: { class: "bg-warning", label: "Pendiente" },
      VALIDATED: { class: "bg-success", label: "Validada" },
      DELIVERED: { class: "bg-success", label: "Entregada" },
      PARTIALLY_DELIVERED: { class: "bg-info", label: "Parcialmente entregada" },
      REJECTED: { class: "bg-danger", label: "Rechazada" }
    };
    return statusMap[status] || { class: "bg-secondary", label: "Desconocido" };
  }


  export function getLoggedInUser() {
    try {
      const userData = localStorage.getItem("userData");
      if (userData) {
        return JSON.parse(userData); 
      }
      return null; 
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
      return null;
    }
  }
  
  