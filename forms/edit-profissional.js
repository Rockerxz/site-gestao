export function EditProfissionalModal() {
  return `
    <div class="modal-overlay">
      <div class="modal-content">
        <h2>Editar Profissional</h2>
        <form id="form-adicionar-profissional" novalidate>
          <label for="nome">Nome</label>
          <input type="text" id="nome" name="nome"  placeholder="Primeiro nome">

          <label for="morada">Morada</label>
          <input type="text" id="morada" name="morada"  placeholder="Morada">

          <label for="email">Email</label>
          <input type="email" id="email" name="email"  placeholder="Email">

          <label for="telefone">Telefone</label>
          <input type="tel" id="telefone" name="telefone"  placeholder="Telefone">

          <div class="modal-buttons">
            <button type="button" id="btn-fechar-modal" class="btn-secondary">Cancelar</button>
            <button type="button" id="btn-adicionar" class="btn-primary">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  `;
}