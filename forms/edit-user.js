export function EditUtilizadorModal() {
  return `
     <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Editar Utilizador</h2>
          <button class="modal-close" id="btn-fechar-modal" title="Fechar">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <form id="form-adicionar-user" autocomplete="off" novalidate>

          <div class="form-row">
            <div class="form-group">
              <label for="nome-user">Nome</label>
              <div class="input-icon">
                <i class="fa-solid fa-user"></i>
                <input type="text" id="nome-user" name="nome">
              </div>
            </div>

            <div class="form-group">
              <label for="email-user">Email</label>
              <div class="input-icon">
                <i class="fa-solid fa-envelope"></i>
                <input type="email" id="email-user" name="email">
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="password-user">Redifinir Password</label>
              <div class="input-icon">
                <i class="fa-solid fa-key"></i>
                <input type="password" id="password-user" name="password">
              </div>
            </div>

            <div class="form-group">
              <label for="estado-user">Estado</label>
              <div class="input-icon">
                <i class="fa-solid fa-toggle-on"></i>
                <select id="estado-user" name="estado" required>
                  <option value="ativo">Ativo</option>
                  <option value="bloqueado">Inativo</option>
                </select>
              </div>
            </div>
          </div>
        </form>
        <div class="modal-footer">
          <button id="btn-adicionar" class="btn-primary">Editar utilizador</button>
        </div>
      </div>
    </div>
  `;
}