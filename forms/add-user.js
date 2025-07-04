export function AddUtilizadorModal() {
  return `
     <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Adicionar Utilizador</h2>
          <button class="modal-close" id="btn-fechar-modal" title="Fechar">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <form id="form-adicionar-utilizador" autocomplete="off" novalidate>
          <div class="form-group">
              <label for="perfil-user">Perfil</label>
              <div class="input-icon">
                <i class="fa-solid fa-id-badge"></i>
                <select id="perfil-user" name="perfil" required>
                  <option value="" disabled selected>Escolha o perfil</option>
                  <option value="Técnico">Técnico</option>
                  <option value="Atendimento">Atendimento</option>
                </select>
              </div>
          </div>
          
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
              <label for="password-user">Password</label>
              <div class="input-icon">
                <i class="fa-solid fa-key"></i>
                <input type="password" id="password-user" name="password">
              </div>
            </div>
            <!-- Empty div to keep two columns per row -->
            <div class="form-group"></div>
          </div>
        </form>
        <div class="modal-footer">
          <button id="btn-adicionar" class="btn-primary">Adicionar Utilizador</button>
        </div>
      </div>
    </div>
  `;
}