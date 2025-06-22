export function DefinicoesUserPage(user = {}) {
  return `
    <section class="definicoes-user-page">
      <h1 id="title-users">Definições de utilizador</h1>
      <div class="users-container">
        <form id="form-definicoes-user" autocomplete="off" novalidate>
          <div class="form-row">
            <div class="form-group">
              <label for="nome-user">Nome</label>
              <div class="input-icon">
                <i class="fa-solid fa-user"></i>
                <input type="text" id="nome-user" name="nome" value="${escapeHtml(user.nome || '')}">
              </div>
            </div>

            <div class="form-group">
              <label for="email-user">Email</label>
              <div class="input-icon">
                <i class="fa-solid fa-envelope"></i>
                <input type="email" id="email-user" name="email" value="${escapeHtml(user.email || '')}">
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="password-user">Password</label>
              <div class="input-icon">
                <i class="fa-solid fa-key"></i>
                <input type="password" id="password-user" name="password" value="">
              </div>
            </div>
            <div class="form-group"></div>
          </div>

          <div class="modal-footer">
            <button id="btn-atualizar" class="btn-primary" type="button">Atualizar dados</button>
          </div>
        </form>
      </div>
    </section>
  `;
}

// Simple escape function to prevent XSS
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
