export function RemoveProfissionalModal(nomeCompleto) {
  return `
    <div class="modal-overlay">
      <div class="modal-content">
        <h2>Remover Profissional</h2>
        <p>Tem certeza que deseja remover o profissional <strong>${nomeCompleto}</strong>?</p>
        <div class="modal-buttons">
          <button type="button" id="btn-cancelar" class="btn-secondary">Cancelar</button>
          <button type="button" id="btn-remover" class="btn-danger">Remover</button>
        </div>
      </div>
    </div>
  `;
}