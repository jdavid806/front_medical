// Current Date and Time
function updateDateTime() {
    const now = new Date();
    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };

    document.getElementById('currentDate').textContent = now.toLocaleDateString('es-ES', dateOptions);
    document.getElementById('currentTime').textContent = now.toLocaleTimeString('es-ES', timeOptions);
}

updateDateTime();
setInterval(updateDateTime, 1000);

// Order Timer
function updateOrderTimer() {
    const timerEl = document.getElementById('orderTimer');
    const timeParts = timerEl.textContent.split(':');
    let hours = parseInt(timeParts[0]);
    let minutes = parseInt(timeParts[1]);
    let seconds = parseInt(timeParts[2]);

    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }

    timerEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

setInterval(updateOrderTimer, 1000);


const orderItems = document.querySelectorAll('.order-item');
orderItems.forEach(item => {
    item.addEventListener('click', function () {
        orderItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
    });
});

const verifyButton = document.getElementById('verifyButton');
const barcodeInput = document.getElementById('barcodeInput');
const verificationStatus = document.getElementById('verificationStatus');


// Signature Pad
let signaturePad;
document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('signaturePad');
    signaturePad = new SignaturePad(canvas);
});

const clearSignature = document.getElementById('clearSignature');
clearSignature.addEventListener('click', function () {
    signaturePad.clear();
});

