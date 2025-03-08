document.addEventListener("DOMContentLoaded", () => {
  // 1. Construir acordeón
  const accordionContainer = document.getElementById("accordionHistorial");

  historialData.forEach((section, index) => {
    const isActive = index === 0 ? "show" : "";
    const isCollapsed = index !== 0 ? "collapsed" : "";

    const accordionItem = `
                 <div class="card">
                  <div class="accordion-item">
                      <h2 class="accordion-header" id="heading${index}">
                          <button class="accordion-button ${isCollapsed}" type="button" 
                                  data-bs-toggle="collapse" data-bs-target="#collapse${index}" 
                                  aria-expanded="${
                                    index === 0
                                  }" aria-controls="collapse${index}">
                              ${section.titulo}
                          </button>
                      </h2>
                      <div id="collapse${index}" class="accordion-collapse collapse ${isActive}" 
                           aria-labelledby="heading${index}" data-bs-parent="#accordionHistorial">
                          <div class="accordion-body">
                              <ul class="timeline">
                                  ${section.eventos
                                    .map(
                                      (evento) => `
                                          <li class="timeline-item">
                                              <h5 class="fw-bold">${evento.titulo}</h5>
                                              <p class="text-muted mb-1">${evento.descripcion}</p>
                                          </li>`
                                    )
                                    .join("")}
                              </ul>
                          </div>
                      </div>
                  </div>
                 </div>
              `;
    accordionContainer.innerHTML += accordionItem;
  });

  const events = historialData.flatMap((section) =>
    section.eventos.map((evento) => ({
      title: evento.titulo,
      start: evento.start,
    }))
  );

  const calendarEl = document.getElementById("calendar");
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    locale: "es",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    events: events,
    dateClick: (info) => {
      const modalNuevaVacuna = new bootstrap.Modal(
        document.getElementById("modalNuevaVacuna")
      );
      modalNuevaVacuna.show();

      const modalDateField = document.getElementById("selectedDate");
      if (modalDateField) {
        modalDateField.textContent = `Fecha seleccionada: ${info.dateStr}`;
      }
    },
  });

  calendar.render();

  const tabLink = document.querySelector(
    'a[data-bs-toggle="tab"][href="#tab-profile"]'
  );
  if (tabLink) {
    tabLink.addEventListener("shown.bs.tab", () => {
      calendar.updateSize();
    });
  }
});
