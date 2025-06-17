export function AddClienteModal() {
  return `
    <div class="modal-overlay">
      <div class="modal-content">
        <h2>Adicionar Cliente</h2>
        <form id="form-adicionar-cliente" autocomplete="off" novalidate>
          <div class="form-group">
            <label for="nome-cliente">Nome</label>
            <div class="input-icon">
              <i class="fa-solid fa-user"></i>
              <input type="text" id="nome-cliente" name="nome" placeholder="Nome do cliente" required>
            </div>
          </div>

          <div class="form-group">
            <label for="empresa-cliente">Empresa</label>
            <div class="input-icon">
              <i class="fa-solid fa-building"></i>
              <input type="text" id="empresa-cliente" name="empresa" placeholder="Empresa" required>
            </div>
          </div>

          <div class="form-group">
            <label for="endereco-cliente">Endereço</label>
            <div class="input-icon">
              <i class="fa-solid fa-house"></i>
              <input type="text" id="endereco-cliente" name="endereco" placeholder="Endereço" required>
            </div>
          </div>

          <div class="form-group">
            <label for="email-cliente">Email</label>
            <div class="input-icon">
              <i class="fa-solid fa-envelope"></i>
              <input type="email" id="email-cliente" name="email" placeholder="Email" required>
            </div>
          </div>

          <div class="form-group">
            <label for="telefone-cliente">Telefone</label>
            <div class="input-icon">
              <i class="fa-solid fa-phone"></i>
              <input type="tel" id="telefone-cliente" name="telefone" placeholder="Telefone" required>
            </div>
          </div>

          <div class="modal-buttons">
            <button type="button" id="btn-voltar" class="btn-secondary">Voltar</button>
            <button type="submit" id="btn-adicionar" class="btn-primary">Adicionar Cliente</button>
          </div>
        </form>
      </div>
    </div>
  `;
}