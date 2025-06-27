export function AddProfissionalModal() {
  return `
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Adicionar Profissional</h2>
          <button class="modal-close" id="btn-fechar-modal" title="Fechar">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <form id="form-adicionar-profissional" autocomplete="off" novalidate>
          <div class="form-group">
              <label for="cargo">Cargo</label>
              <div class="input-icon">
                <i class="fa-solid fa-id-badge"></i>
                <select id="cargo-profissional" name="cargo" required>
                  <option value="" disabled selected>Escolha o cargo</option>
                  <option value="Técnico">Técnico</option>
                  <option value="Atendimento">Atendimento</option>
                </select>
              </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="nome">Nome</label>
              <div class="input-icon">
                <i class="fa-solid fa-user"></i>
                <input type="text" id="nome" name="nome" required placeholder="Nome">
              </div>
            </div>

            <div class="form-group">
              <label for="morada">Morada</label>
              <div class="input-icon">
                <i class="fa-solid fa-map-marker-alt"></i>
                <input type="text" id="morada" name="morada"  placeholder="Morada">
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="email">Email</label>
              <div class="input-icon">
                <i class="fa-solid fa-user"></i>
                <input type="email" id="email" name="email" placeholder="Email">
              </div>
            </div>

            <div class="form-group">
              <label for="telefone">Telefone</label>
              <div class="input-icon">
                <i class="fa-solid fa-map-marker-alt"></i>
                <input type="tel" id="telefone" name="telefone"  placeholder="Telefone">
              </div>
            </div>
          </div>

          <!-- Novo campo Comentários -->
          <div class="form-row">
            <div class="form-group comentarios-group">
              <label for="comentarios-profissional">Comentários</label>
              <textarea id="comentarios-profissional" name="comentarios" rows="4"></textarea>
            </div>
          </div>
        </form>
        <div class="modal-footer">
            <button type="button" id="btn-adicionar" class="btn-primary">Adicionar</button>
        </div>
      </div>
    </div>
  `;
}