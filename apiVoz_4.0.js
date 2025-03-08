// Función para cambiar el ícono del botón
function cambiarIcono() {
  const allTextA = document.querySelectorAll("textarea");
  for (let i = 0; i < allTextA.length; i++) {
    const editor = tinymce.get(`ReconocimientoVoz${i}`); // Obtener la instancia de TinyMCE
    const boton = document.getElementById(`boton${i}`);

    if (editor) {
      // Verificar si el editor TinyMCE está deshabilitado
      const editorContainer = editor.getContainer();
      if (editorContainer.querySelector("textarea").disabled) {
        boton.innerHTML =
          "<i title='No Activo' style='font-size: 18px; color: #DF2424;' class='fa fa-exclamation-triangle'>";
      } else {
        boton.innerHTML =
          "<i title='Iniciar Grabación' style='font-size: 18px; color: #3c8dbc;' class='fa fa-fw fa-microphone'>";
      }
    } else {
      // Si no es un editor TinyMCE, verificar el textarea tradicional
      if (allTextA[i].disabled !== true) {
        boton.innerHTML =
          "<i title='Iniciar Grabación' style='font-size: 18px; color: #3c8dbc;' class='fa fa-fw fa-microphone'>";
      } else {
        boton.innerHTML =
          "<i title='No Activo' style='font-size: 18px; color: #DF2424;' class='fa fa-exclamation-triangle'>";
      }
    }
  }
}

// Configurar los textareas y botones
const textAreas = document.getElementsByTagName("textarea");
for (let i = 0; i < textAreas.length; i++) {
  textAreas[i].setAttribute(
    "class",
    `ReconocimientoVoz${i} ${textAreas[i].className}`
  );
  textAreas[i].value = textAreas[i].value.replaceAll("<br>", "");

  const boton = document.createElement("a");
  boton.setAttribute("id", `boton${i}`);
  boton.setAttribute("type", "button");
  boton.setAttribute("class", "reconocimiento_de_voz");
  boton.setAttribute(
    "style",
    "float: right;position: relative;top:-40px;padding: 5px;left: -5px;color: #3c8dbc;"
  );
  boton.setAttribute("onclick", `toggleStartStop(${i})`);

  textAreas[i].insertAdjacentElement("afterend", boton);

  // Observar cambios en el textarea o editor TinyMCE
  new MutationObserver(() => cambiarIcono()).observe(textAreas[i], {
    attributes: true,
    childList: true,
  });
}

// Configurar el reconocimiento de voz
const recognizing = [];
const recognition = [];
for (
  let valor = 0;
  valor < document.getElementsByClassName("reconocimiento_de_voz").length;
  valor++
) {
  recognizing[valor] = false;
  recognition[valor] = new webkitSpeechRecognition();
  recognition[valor].continuous = true;
  recognition[valor].lang = "es-CO";
  reset(valor);
  recognition[valor].onend = () => reset(valor);
}

// Función para reiniciar el estado del botón
function reset(valor) {
  recognizing[valor] = false;
  cambiarIcono();
}

// Función para iniciar/detener el reconocimiento de voz
function toggleStartStop(valor) {
  const editor = tinymce.get(`ReconocimientoVoz${valor}`); // Obtener la instancia de TinyMCE

  if (recognizing[valor]) {
    recognition[valor].stop();
    reset(valor);
  } else {
    recognition[valor].start();
    recognizing[valor] = true;
    document.getElementById(`boton${valor}`).innerHTML =
      "<i title='Detener Grabación' style='font-size: 18px; color: #3c8dbc;' class='fa fa-pause'>";
  }

  recognition[valor].onresult = function (event) {
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        const transcript = event.results[i][0].transcript;

        if (editor) {
          // Si es un editor TinyMCE, actualizar su contenido
          const currentContent = editor.getContent();
          editor.setContent(currentContent + transcript + "<br>");
        } else {
          // Si es un textarea tradicional, actualizar su valor
          const textarea = document.getElementsByClassName(
            `ReconocimientoVoz${valor}`
          )[0];
          textarea.value += transcript + "\n";
        }
      }
    }
  };
}
