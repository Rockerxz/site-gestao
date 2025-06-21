export function RemoveClienteModal(clienteNome = '') {
  return `
     <div class="remove-cliente-overlay">
      <div class="remove-cliente-modal" role="dialog" aria-modal="true" aria-labelledby="remove-cliente-title" aria-describedby="remove-cliente-desc">
        <h2 id="remove-cliente-title">Remover Cliente</h2>
        <p id="remove-cliente-desc">Tem a certeza que quer remover o cliente <strong>${escapeHtml(clienteNome)}</strong> e os seus dados?</p>
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