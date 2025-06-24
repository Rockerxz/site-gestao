export function RemoveProfissionalModal(profissionalNome = '') {
  return `
    <div class="remove-cliente-overlay">
      <div class="remove-cliente-modal" role="dialog" aria-modal="true" aria-labelledby="remove-profissional-title" aria-describedby="remove-profissional-desc">
        <h2 id="remove-profissional-title">Remover Profissional</h2>
        <p id="remove-profissional-desc">Tem certeza que deseja remover o profissional <strong>${escapeHtml(profissionalNome)}</strong>?</p>
        <div class="remove-cliente-buttons">
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