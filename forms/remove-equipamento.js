export function RemoveEquipamentoModal(modelo = '') {
  return `
    <div class="modal-overlay">
      <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="remove-equipamento-title" aria-describedby="remove-equipamento-desc">
        <h2 id="remove-equipamento-title">Remover Equipamento</h2>
        <p id="remove-equipamento-desc">Tem certeza que deseja remover o equipamento <strong>${escapeHtml(modelo)}</strong>?</p>
        <div class="remove-equipamento-buttons">
          <button type="button" id="btn-cancelar" class="btn-cancelar">Cancelar</button>
          <button type="button" id="btn-remover" class="btn-remover">Remover</button>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[m]);
}