export function datosUsuario(user) {
    // console.log("user", user);
  //   const userData = await consultarDatosDoctor(user.id);
  //   console.log("userData", userData);
  const html = `
      <style>
      .footer-firma {
              display: flex;
              justify-content: center;
              position: relative;
              margin-top: 10px;
              page-break-inside: avoid;
          }
  
          .firma {
              text-align: center;
          }

          img {
              border: none !important;
          }
  
          .sello {
              position: absolute;
              right: 5%;
              top: 120px;
          }
  
          .sello img {
              max-height: 90px;
              opacity: 0.8;
              transform: rotate(-10deg);
          }
  
          .firma img {
              max-height: 100px;
              margin-bottom: 10px;
          }
  
          .firma-linea {
              border-top: 2px solid #aaa;
              width: 60%;
              margin: 5px auto;
          }
  
      </style>
        <div class="footer-firma">
          <div class="sello">
              <img src="${user.sello || ""}" alt="Sello Doctor">
          </div>
          <div class="firma">
              <img src="${user.firma || ""}" alt="Firma Doctor">
              <hr class="firma-linea">
              <p style="margin: 0"><strong>${
                capitalizeFirstLetter(user.nombre) || ""
              }</strong></p>
              <p style="margin: 0">${
                capitalizeFirstLetter(user.especialidad) || ""
              }</p>
              ${
                user.registro_medico
                  ? `<p style="margin: 0"><strong>Registro medico: </strong>${capitalizeFirstLetter(
                      user.registro_medico
                    )}</p>`
                  : ""
              }
              
              <strong style="margin: 0">Firmado digitalmente</strong>
          </div>
      </div>
      `;

  return html;
}

// Función auxiliar para capitalizar la primera letra
function capitalizeFirstLetter(value) {
  if (typeof value !== "string") {
    value = String(value ?? ""); // Maneja null/undefined
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}


export default datosUsuario;
