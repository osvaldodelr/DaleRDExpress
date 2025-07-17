// Helpers de filtrado opcionales

//⚙️ 3. JavaScript para abrir/cerrar modal
  const modal = document.getElementById("modal-filtros");
  const abrirBtn = document.getElementById("abrir-filtros");
  const cerrarBtn = document.getElementById("cerrar-modal");

  abrirBtn.addEventListener("click", () => modal.style.display = "block");
  cerrarBtn.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", (e) => {
    if (e.target == modal) modal.style.display = "none";
  });
