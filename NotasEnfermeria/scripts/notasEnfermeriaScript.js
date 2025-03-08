document.addEventListener("DOMContentLoaded", function () {
  // Manejo del acordeón
  const accordionHeaders = document.querySelectorAll(".accordion-header");

  accordionHeaders.forEach((header) => {
    header.addEventListener("click", function () {
      const accordionItem = header.closest(".accordion-item");

      const isActive = accordionItem.classList.toggle("active");

      if (isActive) {
        document.querySelectorAll(".accordion-item.active").forEach((item) => {
          if (item !== accordionItem) item.classList.remove("active");
        });
      }
    });
  });

  const elements = {
    mainButton: document.getElementById("mainButton"),
    menuOptions: document.getElementById("menuOptions"),
    addNoteButton: document.getElementById("addNoteButton"),
    noteSidebar: document.getElementById("noteSidebar"),
    closeSidebarButton1: document.getElementById("closeSidebarButton1"),
    saveNoteButton1: document.getElementById("saveNoteButton1"),
    noteTextarea1: document.getElementById("noteTextarea1"),
    showNoteSidebar: document.getElementById("showNoteSidebar"),
    closeSidebarButton2: document.getElementById("closeSidebarButton2"),
    saveNoteButton2: document.getElementById("saveNoteButton2"),
    noteTextarea2: document.getElementById("noteTextarea2"),
    viewNotesButton: document.querySelector(
      ".menu-options .option-menu:nth-child(2) button"
    ),
  };

  for (const [key, element] of Object.entries(elements)) {
    if (!element) {
      console.error(`El elemento "${key}" no se encontró en el DOM.`);
      return;
    }
  }

  const {
    mainButton,
    menuOptions,
    addNoteButton,
    noteSidebar,
    closeSidebarButton1,
    saveNoteButton1,
    noteTextarea1,
    showNoteSidebar,
    closeSidebarButton2,
    saveNoteButton2,
    noteTextarea2,
    viewNotesButton,
  } = elements;

  // Eventos
  mainButton.addEventListener("click", () => {
    menuOptions.classList.toggle("active");
  });

  addNoteButton.addEventListener("click", () => {
    noteSidebar.classList.add("active");
  });

  closeSidebarButton1.addEventListener("click", () => {
    noteSidebar.classList.remove("active");
  });

  viewNotesButton.addEventListener("click", () => {
    showNoteSidebar.classList.add("active");
  });

  closeSidebarButton2.addEventListener("click", () => {
    showNoteSidebar.classList.remove("active");
  });

  const saveNote = (textarea, sidebar) => {
    const noteText = textarea.value.trim();
    if (noteText) {
      alert(`Nota guardada: ${noteText}`);
      textarea.value = "";
      sidebar.classList.remove("active");
    } else {
      alert("Por favor, escribe una nota antes de guardar.");
    }
  };

  saveNoteButton1.addEventListener("click", () =>
    saveNote(noteTextarea1, noteSidebar)
  );
  saveNoteButton2.addEventListener("click", () =>
    saveNote(noteTextarea2, showNoteSidebar)
  );
});
