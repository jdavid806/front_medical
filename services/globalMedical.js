// const domain = window.location.hostname; // Obtiene el subdominio dinámico
// const api = "/";
// const url = `${domain}${api}`;
// export { url };


const domain = window.location.hostname; // Obtiene el subdominio dinámico
const api = "/";
const port = "8000";


const url = `${domain}:${port}${api}`;
console.log(url);
export { url };
