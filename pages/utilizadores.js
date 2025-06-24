import { showToast } from '../components/toast.js';
import { AddUtilizadorModal } from '../forms/add-user.js';
import { EditUtilizadorModal } from '../forms/edit-user.js';
import { RemoveUtilizadorModal } from '../forms/remove-user.js';

export function UsersPage(users = []) {
  // users = array de objetos com { id, nome, empresa, endereco, email, telefone, totalReparacoes }

  return `
    <section class="users-page">
      <h1 id="title-users">Gestão de Utilizadores</h1>
      
      <div class="users-container">
        <div class="header-users">
          <h1 id="main-info">Configuração de utilizadores</h1>
          <button id="btn-adicionar-user" class="btn-primary" type="button">
            <i class="fa-solid fa-circle-plus"></i>Adicionar Utilizador</button>
        </div>

        <table class="users-tabela" aria-label="Lista de utilizadores">
          <thead>
            <tr>
              <th>Perfil</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="utilizadores-lista">
            ${renderUsers(users.slice(0, 10))}
          </tbody>
        </table>

        <div class="users-footer">
          <div class="users-paginacao">
            <button id="btn-anterior" type="button" class="btn-paginacao" disabled>Anterior</button>
            <button id="btn-pagina-atual" type="button" class="btn-pagina-atual" disabled>1</button>
            <button id="btn-seguinte" type="button" class="btn-paginacao" ${users.length > 10 ? '' : 'disabled'}>Seguinte</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderUsers(users) {
  if (users.length === 0) {
    return `<tr><td colspan="7" style="text-align:center;">Nenhum utilizador encontrado.</td></tr>`;
  }
  return users.map(c => `
    <tr data-id="${c.id}">
      <td>${escapeHtml(c.perfil)}</td>
      <td>${escapeHtml(c.nome)}</td>
      <td>${escapeHtml(c.email)}</td>
      <td>
        <button class="estado-btn" disabled style="cursor: default; padding: 0.2em 0.5em; border-radius: 0.3em; border: none; background-color: ${c.estado === 'bloqueado' ? '#d9534f' : '#5cb85c'}; color: white;">
          ${c.estado === 'bloqueado' ? 'Inativo' : 'Ativo'}
        </button>
      </td>
      <td class="acoes-coluna">
        ${c.perfil.toLowerCase() === 'admin' ? '' : `
          <button class="btn-editar" type="button" title="Editar">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn-remover-cliente" type="button" title="Remover">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        `}
      </td>
    </tr>
  `).join('');
}

// Função simples para escapar HTML (evitar XSS)
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

// Exporta função para ativar a paginação e pesquisa
export function setupUsersPageListeners(users) {
  const tbody = document.getElementById('utilizadores-lista');
  const btnAnterior = document.getElementById('btn-anterior');
  const btnSeguinte = document.getElementById('btn-seguinte');
  const btnPaginaAtual = document.getElementById('btn-pagina-atual');
  const btnAdicionarUser = document.getElementById('btn-adicionar-user');

  function loadModalStyle(href) {
    // Remove previously loaded dynamic modal styles (only modal styles, not page styles)
    const modalStylePrefix = '/styles/';
    const previousStyles = document.querySelectorAll('link[data-dynamic-style="true"]');
    previousStyles.forEach(link => {
      // Remove only if href is a modal style (e.g. contains 'modal' in filename)
      if (link.href.includes('modal') && link.href !== location.origin + href) {
        link.remove();
      }
    });

    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.setAttribute('data-dynamic-style', 'true');
      document.head.appendChild(link);
    }
  }

  if (!tbody || !btnAnterior || !btnSeguinte || !btnPaginaAtual || !btnAdicionarUser) return;

  let paginaAtual = 1;
  const itensPorPagina = 10;
  let dadosFiltrados = users;

  function atualizarPaginacao() {
    const totalItens = dadosFiltrados.length;
    const totalPaginas = Math.max(1, Math.ceil(totalItens / itensPorPagina));
    if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;

    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const itensPagina = dadosFiltrados.slice(inicio, fim);

    tbody.innerHTML = renderUsers(itensPagina);


    // Atualizar estado dos botões
    btnAnterior.disabled = paginaAtual <= 1;
    btnSeguinte.disabled = paginaAtual >= totalPaginas;

    btnPaginaAtual.textContent = paginaAtual;

  }


  btnAnterior.addEventListener('click', () => {
    if (paginaAtual > 1) {
      paginaAtual--;
      atualizarPaginacao();
    }
  });

  btnSeguinte.addEventListener('click', () => {
    const totalPaginas = Math.max(1, Math.ceil(dadosFiltrados.length / itensPorPagina));
    if (paginaAtual < totalPaginas) {
      paginaAtual++;
      atualizarPaginacao();
    }
  });

  // Evento para abrir modal de adicionar utilizador
  btnAdicionarUser.addEventListener('click', () => {
    loadModalStyle('/styles/forms/add-user-modal.css');
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-add-utilizador-container';
    modalContainer.innerHTML = AddUtilizadorModal();
    document.body.appendChild(modalContainer);

    const btnFechar = modalContainer.querySelector('#btn-fechar-modal');
    if (btnFechar) {
      btnFechar.addEventListener('click', () => {
        modalContainer.remove();
      });
    }

    const btnAdicionar = modalContainer.querySelector('#btn-adicionar');
    const form = modalContainer.querySelector('#form-adicionar-utilizador');

    btnAdicionar.addEventListener('click', async () => {
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const novoUtilizador = {
        perfil: form.perfil.value,
        nome: form.nome.value.trim(),
        email: form.email.value.trim(),
        password: form.password.value.trim()
      };

      try {
        const res = await fetch('/backend/utilizadores.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(novoUtilizador)
        });

        if (!res.ok) {
          const errorData = await res.json();
          showToast('Erro ao adicionar utilizador: ' + (errorData.error || 'Erro desconhecido'), 'error');
          return;
        }

        const data = await res.json();
        if (data.success) {
          users.push(data.item);
          atualizarPaginacao();
          modalContainer.remove();
          showToast('Utilizador adicionado com sucesso.', 'success');
        } else {
          showToast('Erro ao adicionar utilizador.', 'error');
        }
      } catch (error) {
        showToast('Erro ao adicionar utilizador: ' + error.message, 'error');
      }
    });
  });

  // Função para abrir modal de edição com dados do utilizador
  function abrirModalEditarUtilizador(utilizador) {
    loadModalStyle('/styles/forms/edit-user-modal.css');

    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-edit-utilizador-container';
    modalContainer.innerHTML = EditUtilizadorModal();
    document.body.appendChild(modalContainer);

    const form = modalContainer.querySelector('#form-adicionar-user');
    form.nome.placeholder = utilizador.nome || '';
    form.email.placeholder = utilizador.email || '';
    form.password.placeholder = '********';
    form.estado.value = utilizador.estado || 'ativo';  // select stays as value

    const btnFechar = modalContainer.querySelector('#btn-fechar-modal');
    btnFechar.addEventListener('click', () => modalContainer.remove());

    const btnSalvar = modalContainer.querySelector('#btn-adicionar');

    btnSalvar.addEventListener('click', async () => {
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const nome = form.nome.value.trim() || utilizador.nome;
      const email = form.email.value.trim() || utilizador.email;
      const password = form.password.value.trim(); // senha vazia significa sem alteração
      const estado = form.estado.value;

      const utilizadorAtualizado = {
        id: utilizador.id,
        perfil: utilizador.perfil,
        nome,
        email,
        password,
        estado
      };

      try {
        const res = await fetch('/backend/utilizadores.php', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(utilizadorAtualizado)
        });

        if (!res.ok) {
          const errorData = await res.json();
          showToast('Erro ao atualizar utilizador: ' + (errorData.error || 'Erro desconhecido'), 'error');
          return;
        }

        const data = await res.json();
        if (data.success) {
          const index = users.findIndex(u => u.id === utilizador.id);
          if (index !== -1) {
            users[index] = utilizadorAtualizado;
            atualizarPaginacao();
          }
          modalContainer.remove();
          showToast('Utilizador atualizado com sucesso.', 'success');
        } else {
          showToast('Erro ao atualizar utilizador.', 'error');
        }
      } catch (error) {
        showToast('Erro ao atualizar utilizador: ' + error.message), 'error';
      }
    });
  }

  // Listener para botões editar - delegação de evento no tbody
  tbody.addEventListener('click', e => {
    const btn = e.target.closest('.btn-editar');
    if (!btn) return;

    const tr = btn.closest('tr');
    if (!tr) return;

    const id = tr.getAttribute('data-id');
    if (!id) return;

    const utilizador = users.find(u => u.id == id);
    if (!utilizador) {
      showToast('Utilizador não encontrado', 'error');
      return;
    }

    // Bloquear edição para admin (redundant but safe)
    if (utilizador.perfil.toLowerCase() === 'admin') {
      showToast('Não é possível editar o utilizador Admin.', 'error');
      return;
    }

    abrirModalEditarUtilizador(utilizador);
  });

  // Função para abrir modal de remoção com dados do utilizador
  function abrirModalRemoverUtilizador(utilizador) {
    loadModalStyle('/styles/forms/remove-user-modal.css');

    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-remove-utilizador-container';
    modalContainer.innerHTML = RemoveUtilizadorModal(utilizador.nome);
    document.body.appendChild(modalContainer);

    const btnCancelar = modalContainer.querySelector('#btn-cancelar');
    const btnRemover = modalContainer.querySelector('#btn-remover');

    btnCancelar.addEventListener('click', () => {
      modalContainer.remove();
    });

    btnRemover.addEventListener('click', async () => {
      try {
        const res = await fetch('/backend/utilizadores.php', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: utilizador.id })
        });

        if (!res.ok) {
          const errorData = await res.json();
          showToast('Erro ao remover utilizador: ' + (errorData.error || 'Erro desconhecido'), 'error');
          return;
        }

        const data = await res.json();
        if (data.success) {
          // Remover utilizador da lista local
          const index = users.findIndex(u => u.id === utilizador.id);
          if (index !== -1) {
            users.splice(index, 1);
            atualizarPaginacao();
          }
          modalContainer.remove();
          showToast('Utilizador removido com sucesso.', 'success');
        } else {
          showToast('Erro ao remover utilizador.', 'error');
        }
      } catch (error) {
        showToast('Erro ao remover utilizador: ' + error.message, 'error');
      }
    });
  }

  // Listener para botões remover - delegação de evento no tbody
  tbody.addEventListener('click', e => {
    const btn = e.target.closest('.btn-remover-cliente');
    if (!btn) return;

    const tr = btn.closest('tr');
    if (!tr) return;

    const id = tr.getAttribute('data-id');
    if (!id) return;

    const utilizador = users.find(u => u.id == id);
    if (!utilizador) {
      showToast('Utilizador não encontrado', 'error');
      return;
    }

    // Bloquear remoção para admin (redundant but safe)
    if (utilizador.perfil.toLowerCase() === 'admin') {
      showToast('Não é possível remover o utilizador Admin.', 'error');
      return;
    }

    abrirModalRemoverUtilizador(utilizador);
  });

  // Inicializa lista
  atualizarPaginacao();
}