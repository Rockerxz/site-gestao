export function AddProfissionalModal() {
  return `
    <div class="modal-overlay">
      <div class="modal-content">
        <h2>Adicionar Profissional</h2>
        <form id="form-adicionar-profissional" novalidate>
          <label for="cargo">Cargo</label>
          <select id="cargo" name="cargo" required>
            <option value="">Selecione o cargo</option>
            <option value="Técnico">Técnico</option>
            <option value="Atendimento">Atendimento</option>
          </select>

          <label for="nome">Nome</label>
          <input type="text" id="nome" name="nome" required placeholder="Primeiro nome">

          <label for="apelido">Apelido</label>
          <input type="text" id="apelido" name="apelido"  placeholder="Último nome">

          <label for="morada">Morada</label>
          <input type="text" id="morada" name="morada"  placeholder="Morada">

          <label for="email">Email</label>
          <input type="email" id="email" name="email"  placeholder="Email">

          <label for="telefone">Telefone</label>
          <input type="tel" id="telefone" name="telefone"  placeholder="Telefone">

          <div class="modal-buttons">
            <button type="button" id="btn-fechar-modal" class="btn-secondary">Cancelar</button>
            <button type="button" id="btn-adicionar" class="btn-primary">Adicionar</button>
          </div>
        </form>
      </div>
    </div>
  `;
}