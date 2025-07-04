export function RemoveReparacoesModal() {
  return `
    <div class="modal-overlay">
      <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="remove-reparacoes-title" aria-describedby="remove-reparacoes-desc">
        <h2 id="remove-reparacoes-title">Remover Reparacão</h2>
        <p id="remove-reparacoes-desc">Tem certeza que deseja remover esta <strong>reparacão</strong>?</p>
        <div class="remove-reparacoes-buttons">
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