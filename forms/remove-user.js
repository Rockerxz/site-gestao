export function RemoveUtilizadorModal(utilizadorNome = '') {
  return `
     <div class="remove-user-overlay">
      <div class="remove-user-modal" role="dialog" aria-modal="true" aria-labelledby="remove-user-title" aria-describedby="remove-user-desc">
        <h2 id="remove-user-title">Remover Utilizador</h2>
        <p id="remove-user-desc">Tem a certeza que quer remover o utilizador <strong>${escapeHtml(utilizadorNome)}</strong> e os seus dados?</p>
        <div class="remove-user-buttons">
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