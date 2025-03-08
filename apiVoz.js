	var recognition;
	var recognizing = false;
	if (!('webkitSpeechRecognition' in window)) {
		alert("¡API no soportada!");
	} else {

		recognition = new webkitSpeechRecognition();
		recognition.lang = "es-VE";
		recognition.continuous = true;
		recognition.interimResults = true;

		recognition.onstart = function() {
			recognizing = true;
			console.log("empezando a eschucar");
		}
		recognition.onresult = function(event) {

		 for (var i = event.resultIndex; i < event.results.length; i++) {
			if(event.results[i].isFinal)
				document.getElementById("motivoConsulta").value += event.results[i][0].transcript;
		    }
			
			//texto
		}
		recognition.onerror = function(event) {
		}
		recognition.onend = function() {
			recognizing = false;
			document.getElementById("procesar").innerHTML = "<i title='Iniciar Grabación' style='font-size: 18px;' class='fa fa-fw fa-microphone'>";
			console.log("terminó de eschucar, llegó a su fin");

		}

	}

	function procesar() {

		if (recognizing == false) {
			recognition.start();
			recognizing = true;
			document.getElementById("procesar").innerHTML = "<i title='Detener Grabación' style='font-size: 18px;' class='fa fa-pause'>";
		} else {
			recognition.stop();
			recognizing = false;
			document.getElementById("procesar").innerHTML = "<i title='Iniciar Grabación' style='font-size: 18px;' class='fa fa-fw fa-microphone'>";
		}
	}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	var recognition2;
	var recognizing2 = false;
	if (!('webkitSpeechRecognition' in window)) {
		alert("¡API no soportada!");
	} else {

		recognition2 = new webkitSpeechRecognition();
		recognition2.lang = "es-VE";
		recognition2.continuous = true;
		recognition2.interimResults = true;

		recognition2.onstart = function() {
			recognizing2 = true;
			console.log("empezando a eschucar");
		}
		recognition2.onresult = function(event) {

		 for (var i = event.resultIndex; i < event.results.length; i++) {
			if(event.results[i].isFinal)
				document.getElementById("enfermedadActual").value += event.results[i][0].transcript;
		    }
			
			//texto
		}
		recognition2.onerror = function(event) {
		}
		recognition2.onend = function() {
			recognizing2 = false;
			document.getElementById("procesar2").innerHTML = "<i title='Iniciar Grabación' style='font-size: 18px;' class='fa fa-fw fa-microphone'>";
			console.log("terminó de eschucar, llegó a su fin");

		}

	}

	function procesar2() {

		if (recognizing2 == false) {
			recognition2.start();
			recognizing2 = true;
			document.getElementById("procesar2").innerHTML = "<i title='Detener Grabación' style='font-size: 18px;' class='fa fa-pause'>";
		} else {
			recognition2.stop();
			recognizing2 = false;
			document.getElementById("procesar2").innerHTML = "<i title='Iniciar Grabación' style='font-size: 18px;' class='fa fa-fw fa-microphone'>";
		}
	}




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	var recognition3;
	var recognizing3 = false;
	if (!('webkitSpeechRecognition' in window)) {
		alert("¡API no soportada!");
	} else {

		recognition3 = new webkitSpeechRecognition();
		recognition3.lang = "es-VE";
		recognition3.continuous = true;
		recognition3.interimResults = true;

		recognition3.onstart = function() {
			recognizing3 = true;
			console.log("empezando a eschucar");
		}
		recognition3.onresult = function(event) {

		 for (var i = event.resultIndex; i < event.results.length; i++) {
			if(event.results[i].isFinal)
				document.getElementById("notasadicionales").value += event.results[i][0].transcript;
		    }
			
			//texto
		}
		recognition3.onerror = function(event) {
		}
		recognition3.onend = function() {
			recognizing3 = false;
			document.getElementById("procesar3").innerHTML = "<i title='Iniciar Grabación' style='font-size: 18px;' class='fa fa-fw fa-microphone'>";
			console.log("terminó de eschucar, llegó a su fin");

		}

	}

	function procesar3() {

		if (recognizing3 == false) {
			recognition3.start();
			recognizing3 = true;
			document.getElementById("procesar3").innerHTML = "<i title='Detener Grabación' style='font-size: 18px;' class='fa fa-pause'>";
		} else {
			recognition3.stop();
			recognizing3 = false;
			document.getElementById("procesar3").innerHTML = "<i title='Iniciar Grabación' style='font-size: 18px;' class='fa fa-fw fa-microphone'>";
		}
	}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	var recognition4;
	var recognizing4 = false;
	if (!('webkitSpeechRecognition' in window)) {
		alert("¡API no soportada!");
	} else {

		recognition4 = new webkitSpeechRecognition();
		recognition4.lang = "es-VE";
		recognition4.continuous = true;
		recognition4.interimResults = true;

		recognition4.onstart = function() {
			recognizing4 = true;
			console.log("empezando a eschucar");
		}
		recognition4.onresult = function(event) {

		 for (var i = event.resultIndex; i < event.results.length; i++) {
			if(event.results[i].isFinal)
				document.getElementById("antecedentesP").value += event.results[i][0].transcript;
		    }
			
			//texto
		}
		recognition4.onerror = function(event) {
		}
		recognition4.onend = function() {
			recognizing4 = false;
			document.getElementById("procesar4").innerHTML = "<i title='Iniciar Grabación' style='font-size: 18px;' class='fa fa-fw fa-microphone'>";
			console.log("terminó de eschucar, llegó a su fin");

		}

	}

	function procesar4() {

		if (recognizing4 == false) {
			recognition4.start();
			recognizing4 = true;
			document.getElementById("procesar4").innerHTML = "<i title='Detener Grabación' style='font-size: 18px;' class='fa fa-pause'>";
		} else {
			recognition4.stop();
			recognizing4 = false;
			document.getElementById("procesar4").innerHTML = "<i title='Iniciar Grabación' style='font-size: 18px;' class='fa fa-fw fa-microphone'>";
		}
	}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	var recognition5;
	var recognizing5 = false;
	if (!('webkitSpeechRecognition' in window)) {
		alert("¡API no soportada!");
	} else {

		recognition5 = new webkitSpeechRecognition();
		recognition5.lang = "es-VE";
		recognition5.continuous = true;
		recognition5.interimResults = true;

		recognition5.onstart = function() {
			recognizing5 = true;
			console.log("empezando a eschucar");
		}
		recognition5.onresult = function(event) {

		 for (var i = event.resultIndex; i < event.results.length; i++) {
			if(event.results[i].isFinal)
				document.getElementById("antecedentesF").value += event.results[i][0].transcript;
		    }
			
			//texto
		}
		recognition5.onerror = function(event) {
		}
		recognition5.onend = function() {
			recognizing5 = false;
			document.getElementById("procesar5").innerHTML = "<i title='Iniciar Grabación' style='font-size: 18px;' class='fa fa-fw fa-microphone'>";
			console.log("terminó de eschucar, llegó a su fin");

		}

	}

	function procesar5() {

		if (recognizing5 == false) {
			recognition5.start();
			recognizing5 = true;
			document.getElementById("procesar5").innerHTML = "<i title='Detener Grabación' style='font-size: 18px;' class='fa fa-pause'>";
		} else {
			recognition5.stop();
			recognizing5 = false;
			document.getElementById("procesar5").innerHTML = "<i title='Iniciar Grabación' style='font-size: 18px;' class='fa fa-fw fa-microphone'>";
		}
	}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	var recognition6;
	var recognizing6 = false;
	if (!('webkitSpeechRecognition' in window)) {
		alert("¡API no soportada!");
	} else {

		recognition6 = new webkitSpeechRecognition();
		recognition6.lang = "es-VE";
		recognition6.continuous = true;
		recognition6.interimResults = true;

		recognition6.onstart = function() {
			recognizing6 = true;
			console.log("empezando a eschucar");
		}
		recognition6.onresult = function(event) {

		 for (var i = event.resultIndex; i < event.results.length; i++) {
			if(event.results[i].isFinal)
				document.getElementById("hallazgos").value += event.results[i][0].transcript;
		    }
			
			//texto
		}
		recognition6.onerror = function(event) {
		}
		recognition6.onend = function() {
			recognizing6 = false;
			document.getElementById("procesar6").innerHTML = "<i title='Iniciar Grabación' style='font-size: 18px;' class='fa fa-fw fa-microphone'>";
			console.log("terminó de eschucar, llegó a su fin");

		}

	}

	function procesar6() {

		if (recognizing6 == false) {
			recognition6.start();
			recognizing6 = true;
			document.getElementById("procesar6").innerHTML = "<i title='Detener Grabación' style='font-size: 18px;' class='fa fa-pause'>";
		} else {
			recognition6.stop();
			recognizing6 = false;
			document.getElementById("procesar6").innerHTML = "<i title='Iniciar Grabación' style='font-size: 18px;' class='fa fa-fw fa-microphone'>";
		}
	}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	var recognition7;
	var recognizing7 = false;
	if (!('webkitSpeechRecognition' in window)) {
		alert("¡API no soportada!");
	} else {

		recognition7 = new webkitSpeechRecognition();
		recognition7.lang = "es-VE";
		recognition7.continuous = true;
		recognition7.interimResults = true;

		recognition7.onstart = function() {
			recognizing7 = true;
			console.log("empezando a eschucar");
		}
		recognition7.onresult = function(event) {

		 for (var i = event.resultIndex; i < event.results.length; i++) {
			if(event.results[i].isFinal)
				document.getElementById("diagnostico").value += event.results[i][0].transcript;
		    }
			
			//texto
		}
		recognition7.onerror = function(event) {
		}
		recognition7.onend = function() {
			recognizing7 = false;
			document.getElementById("procesar7").innerHTML = "<i title='Iniciar Grabación' style='font-size: 18px;' class='fa fa-fw fa-microphone'>";
			console.log("terminó de eschucar, llegó a su fin");

		}

	}

	function procesar7() {

		if (recognizing7 == false) {
			recognition7.start();
			recognizing7 = true;
			document.getElementById("procesar7").innerHTML = "<i title='Detener Grabación' style='font-size: 18px;' class='fa fa-pause'>";
		} else {
			recognition7.stop();
			recognizing7 = false;
			document.getElementById("procesar7").innerHTML = "<i title='Iniciar Grabación' style='font-size: 18px;' class='fa fa-fw fa-microphone'>";
		}
	}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	var recognition8;
	var recognizing8 = false;
	if (!('webkitSpeechRecognition' in window)) {
		alert("¡API no soportada!");
	} else {

		recognition8 = new webkitSpeechRecognition();
		recognition8.lang = "es-VE";
		recognition8.continuous = true;
		recognition8.interimResults = true;

		recognition8.onstart = function() {
			recognizing8 = true;
			console.log("empezando a eschucar");
		}
		recognition8.onresult = function(event) {

		 for (var i = event.resultIndex; i < event.results.length; i++) {
			if(event.results[i].isFinal)
				document.getElementById("notas").value += event.results[i][0].transcript;
		    }
			
			//texto
		}
		recognition8.onerror = function(event) {
		}
		recognition8.onend = function() {
			recognizing8 = false;
			document.getElementById("procesar8").innerHTML = "<i title='Iniciar Grabación' style='font-size: 18px;' class='fa fa-fw fa-microphone'>";
			console.log("terminó de eschucar, llegó a su fin");

		}

	}

	function procesar8() {

		if (recognizing8 == false) {
			recognition8.start();
			recognizing8 = true;
			document.getElementById("procesar8").innerHTML = "<i title='Detener Grabación' style='font-size: 18px;' class='fa fa-pause'>";
		} else {
			recognition8.stop();
			recognizing8 = false;
			document.getElementById("procesar8").innerHTML = "<i title='Iniciar Grabación' style='font-size: 18px;' class='fa fa-fw fa-microphone'>";
		}
	}




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	var recognition9;
	var recognizing9 = false;
	if (!('webkitSpeechRecognition' in window)) {
		alert("¡API no soportada!");
	} else {

		recognition9 = new webkitSpeechRecognition();
		recognition9.lang = "es-VE";
		recognition9.continuous = true;
		recognition9.interimResults = true;

		recognition9.onstart = function() {
			recognizing9 = true;
			console.log("empezando a eschucar");
		}
		recognition9.onresult = function(event) {

		 for (var i = event.resultIndex; i < event.results.length; i++) {
			if(event.results[i].isFinal)
				document.getElementById("notas").value += event.results[i][0].transcript;
		    }
			
			//texto
		}
		recognition9.onerror = function(event) {
		}
		recognition9.onend = function() {
			recognizing9 = false;
			document.getElementById("procesar9").innerHTML = "<i title='Iniciar Grabación' style='font-size: 18px;' class='fa fa-fw fa-microphone'>";
			console.log("terminó de eschucar, llegó a su fin");

		}

	}

	function procesar9() {

		if (recognizing9 == false) {
			recognition9.start();
			recognizing9 = true;
			document.getElementById("procesar9").innerHTML = "<i title='Detener Grabación' style='font-size: 18px;' class='fa fa-pause'>";
		} else {
			recognition9.stop();
			recognizing9 = false;
			document.getElementById("procesar9").innerHTML = "<i title='Iniciar Grabación' style='font-size: 18px;' class='fa fa-fw fa-microphone'>";
		}
	}
