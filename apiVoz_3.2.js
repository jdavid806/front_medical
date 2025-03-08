/*
<textarea id="ReconocimientoVoz0" rows=10 cols=80></textarea>
<button id="boton0" class="reconocimiento_de_voz" onclick="toggleStartStop(0)"></button>

<textarea id="ReconocimientoVoz1" rows=10 cols=80></textarea>
<button id="boton1" class="reconocimiento_de_voz" onclick="toggleStartStop(1)"></button>
*/


var text_areas = document.getElementsByTagName('textarea');

  for (i = 0; i < text_areas.length; i++) {
    text_areas[i].setAttribute('class','ReconocimientoVoz'+i+' '+text_areas[i].className);

    var boton = document.createElement("a");
    boton.setAttribute('id','boton'+i);
    boton.setAttribute('type','button');
    boton.setAttribute('class','reconocimiento_de_voz');
    boton.setAttribute('style','float: right;position: relative;top:-40px;padding: 5px;left: -5px;color: #3c8dbc;');
    boton.setAttribute('onclick','toggleStartStop('+i+')');

    text_areas[i].insertAdjacentElement("afterend", boton);

    //K.C
  }


  var recognizing=[];
  var recognition=[];
  var valoracion="";
  for (var valor = 0; valor < document.getElementsByClassName("reconocimiento_de_voz").length; valor++) 
  {
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
    document.getElementById("boton"+valor).innerHTML = "<i title='Iniciar Grabación' style='font-size: 18px; color: #3c8dbc;' class='fa fa-fw fa-microphone'>";
  }

  function toggleStartStop(valor) {
    if (recognizing[valor]) {
      recognition[valor].stop();
      reset(valor);
    } else {
      recognition[valor].start();
      recognizing[valor] = true;
      document.getElementById("boton"+valor).innerHTML = "<i title='Detener Grabación' style='font-size: 18px; color: #3c8dbc;' class='fa fa-pause'>";
    }

    recognition[valor].onresult = function (event) {
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        //console.log(event.results[i][0].transcript);
        //console.log(valor);
        if (event.results[i].isFinal) {
          
          document.getElementsByClassName("ReconocimientoVoz"+valor)[0].value += event.results[i][0].transcript;
          /* si se quiere que se cierre el reconocimiento automatico usar esto */
          //reset(valor);
        }
      }
    }
  }
