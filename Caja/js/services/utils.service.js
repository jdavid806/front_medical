
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
  