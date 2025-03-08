/*
<textarea id="ReconocimientoVoz0" rows=10 cols=80></textarea>
<button id="boton0" class="reconocimiento_de_voz" onclick="toggleStartStop(0)"></button>

<textarea id="ReconocimientoVoz1" rows=10 cols=80></textarea>
<button id="boton1" class="reconocimiento_de_voz" onclick="toggleStartStop(1)"></button>
*/

// const cambiarIcono = function () {
//     console.log("Si wenas");
// }

// esteban
function cambiarIcono () { // teoricamente todos los textarea tienen el apivoz asi que nuevamente los llamo a todos para validar unicamente si esta disabled
    allTextA = document.querySelectorAll("textarea");
    for (i = 0; i < allTextA.length; i++) {
        if (allTextA[i].disabled !== true) {
            document.getElementById(`boton${i}`).innerHTML = "<i title='Iniciar Grabación' style='font-size: 18px; color: #3c8dbc;' class='fa fa-fw fa-microphone'>";
        } else {
            document.getElementById(`boton${i}`).innerHTML = "<i title='No Activo' style='font-size: 18px; color: #DF2424;' class='fa fa-exclamation-triangle'>";
        }
    }
}
// esteban

// const RVX = document.querySelector(`.ReconocimientoVoz0`);
// const observer = new MutationObserver(queCambio);

// observer.observe(RVX, configuracion);


var text_areas = document.getElementsByTagName('textarea');

for (i = 0; i < text_areas.length; i++) {
    text_areas[i].setAttribute('class', 'ReconocimientoVoz' + i + ' ' + text_areas[i].className);
    text_areas[i].value = text_areas[i].value.replaceAll("<br>", "");
    var boton = document.createElement("a");
    boton.setAttribute('id', 'boton' + i);
    boton.setAttribute('type', 'button');
    boton.setAttribute('class', 'reconocimiento_de_voz');
    boton.setAttribute('style', 'float: right;position: relative;top:-40px;padding: 5px;left: -5px;color: #3c8dbc;');
    boton.setAttribute('onclick', `(document.querySelector(".ReconocimientoVoz${i}").disabled !== true ? toggleStartStop(${i}) : console.log("not active"))`);
    
    text_areas[i].insertAdjacentElement("afterend", boton);
    
    // esteban
    new MutationObserver(queCambio => { cambiarIcono() }).observe(document.querySelector(`.ReconocimientoVoz${i}`), { attributes: true, childList: true });
    // esteban
    //K.C
}


var recognizing = [];
var recognition = [];
var valoracion = "";
for (var valor = 0; valor < document.getElementsByClassName("reconocimiento_de_voz").length; valor++) {
    recognizing[valor] = [];
    recognition[valor] = new webkitSpeechRecognition();
    recognition[valor].continuous = true;
    recognition[valor].lang = 'es-CO';
    recognizing[valor] = false;
    reset(valor);
    recognition[valor].onend = reset(valor);
}

function reset(valor) {
    recognizing[valor] = false;
    if (document.querySelector(`.ReconocimientoVoz${valor}`).disabled !== true) {
        document.getElementById("boton" + valor).innerHTML = "<i title='Iniciar Grabación' style='font-size: 18px; color: #3c8dbc;' class='fa fa-fw fa-microphone'>";
    } else {
        document.getElementById("boton" + valor).innerHTML = "<i title='No Activo' style='font-size: 18px; color: #DF2424;' class='fa fa-exclamation-triangle'>";
    }
}

function toggleStartStop(valor) {
    if (recognizing[valor]) {
        recognition[valor].stop();
        reset(valor);
    } else {
        recognition[valor].start();
        recognizing[valor] = true;
        document.getElementById("boton" + valor).innerHTML = "<i title='Detener Grabación' style='font-size: 18px; color: #3c8dbc;' class='fa fa-pause'>";
    }

    recognition[valor].onresult = function(event) {
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            //console.log(event.results[i][0].transcript);
            //console.log(valor);
            if (event.results[i].isFinal) {

                document.getElementsByClassName("ReconocimientoVoz" + valor)[0].value += event.results[i][0].transcript + '\n';
                /* si se quiere que se cierre el reconocimiento automatico usar esto */
                //reset(valor);
            }
        }
    }
}