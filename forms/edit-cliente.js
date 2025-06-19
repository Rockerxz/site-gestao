export function EditClienteModal() {
  return `
     <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Editar Cliente</h2>
          <button class="modal-close" id="btn-fechar-modal" title="Fechar">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <form id="form-adicionar-cliente" autocomplete="off" novalidate>
          <div class="form-row">
            <div class="form-group">
              <label for="nome-cliente">Nome</label>
              <div class="input-icon">
                <i class="fa-solid fa-user"></i>
                <input type="text" id="nome-cliente" name="nome">
              </div>
            </div>

            <div class="form-group">
              <label for="empresa-cliente">Empresa</label>
              <div class="input-icon">
                <i class="fa-solid fa-building"></i>
                <input type="text" id="empresa-cliente" name="empresa">
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="endereco-cliente">Endereço</label>
              <div class="input-icon">
                <i class="fa-solid fa-house"></i>
                <input type="text" id="endereco-cliente" name="endereco">
              </div>
            </div>

            <div class="form-group">
              <label for="email-cliente">Email</label>
              <div class="input-icon">
                <i class="fa-solid fa-envelope"></i>
                <input type="email" id="email-cliente" name="email">
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="telefone-cliente">Telefone</label>
              <div class="input-icon">
                <i class="fa-solid fa-phone"></i>
                <input type="tel" id="telefone-cliente" name="telefone">
              </div>
            </div>
            <!-- Empty div to keep two columns per row -->
            <div class="form-group"></div>
          </div>

          <!-- Novo campo Comentários -->
          <div class="form-row">
            <div class="form-group comentarios-group">
              <label for="comentarios-cliente">Comentários</label>
              <textarea id="comentarios-cliente" name="comentarios" rows="4"></textarea>
            </div>
          </div>
        </form>
        <div class="modal-footer">
          <button id="btn-adicionar" class="btn-primary">Editar Cliente</button>
        </div>
      </div>
    </div>
  `;
}