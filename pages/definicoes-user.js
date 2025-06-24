import { showToast } from '../components/toast.js';
export function DefinicoesUserPage(user = {}) {
  return `
    <section class="definicoes-user-page">
      <h1 id="title-users">Credenciais de utilizador</h1>
      <div class="users-container">
        <form id="form-definicoes-user" autocomplete="off" novalidate>
          <div class="form-row">
            <div class="form-group">
              <label for="nome-user">Nome</label>
              <div class="input-icon">
                <i class="fa-solid fa-user"></i>
                <input type="text" id="nome-user" name="nome" placeholder="${escapeHtml(user.nome || '')}">
              </div>
            </div>

            <div class="form-group">
              <label for="email-user">Email</label>
              <div class="input-icon">
                <i class="fa-solid fa-envelope"></i>
                <input type="email" id="email-user" name="email" placeholder="${escapeHtml(user.email || '')}">
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="password-user"> Redefinir Password</label>
              <div class="input-icon">
                <i class="fa-solid fa-key"></i>
                <input type="password" id="password-user" name="password" placeholder="********">
              </div>
            </div>
            <div class="form-group"></div>
          </div>

          <div class="modal-footer">
            <button id="btn-atualizar" class="btn-primary" type="button">Guardar alterações</button>
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

// Nova função para gerir submissão e atualização
export function setupDefinicoesUserListeners(user) {
  const form = document.getElementById('form-definicoes-user');
  const btnAtualizar = document.getElementById('btn-atualizar');

  if (!form || !btnAtualizar) return;

  btnAtualizar.onclick = async () => {
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;

    // Construir objeto para enviar
    const payload = {
      id: user.id,
      perfil: user.perfil, // manter perfil atual
      nome,
      email,
      password: password || '', // se vazio, backend pode decidir manter password atual
      estado: user.estado || 'ativo' // manter estado atual
    };

    try {
      const res = await fetch('/backend/utilizadores.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      if (!res.ok) {
        const errorData = await res.json();
        showToast('Erro ao atualizar dados: ' + (errorData.error || 'Erro desconhecido'), 'error');
        return;
      }

      const data = await res.json();
      if (data.success) {
        showToast('Dados atualizados com sucesso.', 'success');
        // Atualizar user localmente (opcional)
        user.nome = nome;
        user.email = email;
        // Limpar campo password
        form.password.value = '';
      } else {
        showToast('Erro ao atualizar dados.', 'error');
      }
    } catch (error) {
      showToast('Erro ao atualizar dados: ' + error.message, 'error');
    }
  };
}