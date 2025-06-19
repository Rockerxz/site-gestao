export function AddClienteModal() {
  return `
     <div class="modal-overlay" id="modal-remover-cliente">
       <div class="modal-content small">
    <div class="modal-header">
      <h2>Confirmar Remoção</h2>
      <button class="modal-close" onclick="fecharModal()">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <p>Tem a certeza que pretende remover o cliente <strong>João Silva</strong>?<br>
    Esta ação irá apagar permanentemente os seus dados.</p>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="fecharModal()">Cancelar</button>
      <button class="btn btn-danger" onclick="removerClienteConfirmado(clienteId)">Remover</button>
    </div>
       </div>
     </div>

  `;
}