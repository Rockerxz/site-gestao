import { showToast } from '../components/toast.js';
import { AddClienteModal } from '../forms/add-cliente.js';
import { EditClienteModal } from '../forms/edit-cliente.js';
import { RemoveClienteModal } from '../forms/remove-cliente.js';

export function ClientesPage(clientes = []) {
  // clientes = array de objetos com { id, nome, empresa, endereco, email, telefone }

  return `
    <section class="clientes-page">
      <h1 id="title-clientes">Clientes</h1>
      <button id="btn-adicionar-cliente" class="btn-primary" type="button">
       <i class="fa-solid fa-circle-plus"></i>Adicionar Cliente</button>

      <div class="clientes-container">
        <div class="clientes-header">
            <h1 id="main-info">Informações de clientes</h1>
            <div class="pesquisa-clientes">
              <label for="barra-pesquisa-clientes">Pesquisar:</label>
              <input type="search" id="barra-pesquisa-clientes" aria-label="Pesquisar clientes">
            </div>  
        </div>

        <table class="clientes-tabela" aria-label="Lista de clientes">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Empresa</th>
              <th>Endereço</th>
              <th>Email</th>
              <th>Telefone</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="clientes-lista">
            ${renderClientes(clientes.slice(0, 10))}
          </tbody>
        </table>

        <div class="clientes-footer">
          <div id="clientes-feedback" class="clientes-feedback">
            Mostrando 1 a ${Math.min(10, clientes.length)} de ${clientes.length} clientes
          </div>
          <div class="clientes-paginacao">
            <button id="btn-anterior" type="button" class="btn-paginacao" disabled>Anterior</button>
            <button id="btn-pagina-atual" type="button" class="btn-pagina-atual" disabled>1</button>
            <button id="btn-seguinte" type="button" class="btn-paginacao" ${clientes.length > 10 ? '' : 'disabled'}>Seguinte</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderClientes(clientes) {
  if (clientes.length === 0) {
    return `<tr><td colspan="7" style="text-align:center;">Nenhum cliente encontrado.</td></tr>`;
  }
  return clientes.map(c => `
    <tr data-id="${c.id}">
      <td>${escapeHtml(c.nome)}</td>
      <td>${escapeHtml(c.empresa)}</td>
      <td>${escapeHtml(c.endereco)}</td>
      <td>${escapeHtml(c.email)}</td>
      <td>${escapeHtml(c.telefone)}</td>
      <td class="acoes-coluna">
        <button class="btn-editar" type="button" title="Editar">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="btn-remover-cliente" type="button" title="Remover">
          <i class="fa-solid fa-trash-can"></i>
        </button>
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
export function setupClientesPageListeners(clientes) {
  const inputPesquisa = document.getElementById('barra-pesquisa-clientes');
  const tbody = document.getElementById('clientes-lista');
  const btnAnterior = document.getElementById('btn-anterior');
  const btnSeguinte = document.getElementById('btn-seguinte');
  const btnPaginaAtual = document.getElementById('btn-pagina-atual');
  const feedback = document.getElementById('clientes-feedback');
  const btnAdicionarCliente = document.getElementById('btn-adicionar-cliente');

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

  if (!inputPesquisa || !tbody || !btnAnterior || !btnSeguinte || !btnPaginaAtual || !feedback || !btnAdicionarCliente) return;

  let paginaAtual = 1;
  const itensPorPagina = 10;
  let dadosFiltrados = clientes;

  function atualizarLista() {
    const termo = inputPesquisa.value.trim().toLowerCase();

    dadosFiltrados = clientes.filter(c =>
      (c.nome && c.nome.toLowerCase().includes(termo)) ||
      (c.empresa && c.empresa.toLowerCase().includes(termo)) ||
      (c.endereco && c.endereco.toLowerCase().includes(termo)) ||
      (c.email && c.email.toLowerCase().includes(termo)) ||
      (c.telefone && c.telefone.toLowerCase().includes(termo))
    );

    paginaAtual = 1;
    atualizarPaginacao();
  }

  function atualizarPaginacao() {
    const totalItens = dadosFiltrados.length;
    const totalPaginas = Math.max(1, Math.ceil(totalItens / itensPorPagina));
    if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;

    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const itensPagina = dadosFiltrados.slice(inicio, fim);

    tbody.innerHTML = renderClientes(itensPagina);


    // Atualizar estado dos botões
    btnAnterior.disabled = paginaAtual <= 1;
    btnSeguinte.disabled = paginaAtual >= totalPaginas;

    btnPaginaAtual.textContent = paginaAtual;

    feedback.textContent = `Mostrando ${inicio + 1} a ${Math.min(fim, totalItens)} de ${totalItens} clientes`;
  }

  inputPesquisa.addEventListener('input', () => {
    atualizarLista();
  });

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

  // Evento para abrir modal de adicionar cliente
  btnAdicionarCliente.addEventListener('click', () => {
    loadModalStyle('/styles/forms/add-cliente-modal.css')
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-add-cliente-container';
    modalContainer.innerHTML = AddClienteModal();
    document.body.appendChild(modalContainer);

    // Botão fechar modal
    const btnFechar = modalContainer.querySelector('#btn-fechar-modal');
    if (btnFechar) {
      btnFechar.addEventListener('click', () => {
        modalContainer.remove();
      });
    }

    // Botão adicionar cliente e formulário
    const btnAdicionar = modalContainer.querySelector('#btn-adicionar');
    const form = modalContainer.querySelector('#form-adicionar-cliente');

    btnAdicionar.addEventListener('click', async () => {
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const novoCliente = {
        nome: form.nome.value.trim(),
        empresa: form.empresa.value.trim(),
        endereco: form.endereco.value.trim(),
        email: form.email.value.trim(),
        telefone: form.telefone.value.trim(),
        comentarios: form.comentarios.value.trim(),
      };

      try {
        const res = await fetch('/backend/clientes.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(novoCliente)
        });

        if (!res.ok) {
          const errorData = await res.json();
          showToast('Erro ao adicionar cliente: ' + (errorData.error || 'Erro desconhecido'), 'error');
          return;
        }

        const data = await res.json();
        if (data.success) {
          clientes.push(data.item);
          atualizarLista();
          modalContainer.remove();
          showToast('Cliente adicionado com sucesso.', 'success');
        } else {
          showToast('Erro ao adicionar cliente.', 'error');
        }
      } catch (error) {
        showToast('Erro ao adicionar cliente: ' + error.message, 'error');
      }
    });
  });

  // Função para abrir modal de edição com dados do cliente
  function abrirModalEditarCliente(cliente) {
    loadModalStyle('/styles/forms/edit-cliente-modal.css')
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-edit-cliente-container';
    modalContainer.innerHTML = EditClienteModal();
    document.body.appendChild(modalContainer);

    const form = modalContainer.querySelector('#form-adicionar-cliente');
    form.nome.placeholder = cliente.nome || '';
    form.empresa.placeholder = cliente.empresa || '';
    form.endereco.placeholder = cliente.endereco || '';
    form.email.placeholder = cliente.email || '';
    form.telefone.placeholder = cliente.telefone || '';

    const btnFechar = modalContainer.querySelector('#btn-fechar-modal');
    btnFechar.addEventListener('click', () => modalContainer.remove());

    const btnSalvar = modalContainer.querySelector('#btn-adicionar');

    btnSalvar.addEventListener('click', async () => {
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const nome = form.nome.value.trim() || cliente.nome;
      const empresa = form.empresa.value.trim() || cliente.empresa;
      const endereco = form.endereco.value.trim() || cliente.endereco;
      const email = form.email.value.trim() || cliente.email;
      const telefone = form.telefone.value.trim() || cliente.telefone;
      const comentarios = form.comentarios.value.trim() || cliente.comentarios;

      const clienteAtualizado = {
        id: cliente.id,
        nome,
        empresa,
        endereco,
        email,
        telefone,
        comentarios,
      };

      try {
        const res = await fetch('/backend/clientes.php', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(clienteAtualizado)
        });

        if (!res.ok) {
          const errorData = await res.json();
          showToast('Erro ao atualizar cliente: ' + (errorData.error || 'Erro desconhecido'), 'error');
          return;
        }

        const data = await res.json();
        if (data.success) {
          const index = clientes.findIndex(c => c.id === cliente.id);
          if (index !== -1) {
            clientes[index] = clienteAtualizado;
            atualizarLista();
          }
          modalContainer.remove();
          showToast('Cliente atualizado com sucesso.', 'success');
        } else {
          showToast('Erro ao atualizar cliente.', 'error');
        }
      } catch (error) {
        showToast('Erro ao atualizar cliente: ' + error.message, 'error');
      }
    });
  }

  // Listener para botões editar - movido para o escopo principal da função
  tbody.addEventListener('click', e => {
    const btn = e.target.closest('.btn-editar');
    if (!btn) return;

    const tr = btn.closest('tr');
    if (!tr) return;

    const id = tr.getAttribute('data-id');
    if (!id) return;

    const cliente = clientes.find(c => c.id == id);
    if (!cliente) {
      showToast('Cliente não encontrado', 'error');
      return;
    }

    abrirModalEditarCliente(cliente);
  });

  // Função para abrir modal de remoção com dados do cliente
  function abrirModalRemoverCliente(cliente) {
    loadModalStyle('/styles/forms/remove-cliente-modal.css')

    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-remove-cliente-container';
    modalContainer.innerHTML = RemoveClienteModal(cliente.nome);
    document.body.appendChild(modalContainer);

    const btnCancelar = modalContainer.querySelector('#btn-cancelar');
    const btnRemover = modalContainer.querySelector('#btn-remover');

    btnCancelar.addEventListener('click', () => {
      modalContainer.remove();
    });

    btnRemover.addEventListener('click', async () => {
      try {
        const res = await fetch('/backend/clientes.php', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: cliente.id })
        });

        if (!res.ok) {
          const errorData = await res.json();
          showToast('Erro ao remover cliente: ' + (errorData.error || 'Erro desconhecido'), 'error');
          return;
        }

        const data = await res.json();
        if (data.success) {
          // Remover cliente da lista local
          const index = clientes.findIndex(c => c.id === cliente.id);
          if (index !== -1) {
            clientes.splice(index, 1);
            atualizarLista();
          }
          modalContainer.remove();
          showToast('Cliente removido com sucesso.', 'success');
        } else {
          showToast('Erro ao remover cliente.', 'error');
        }
      } catch (error) {
        showToast('Erro ao remover cliente: ' + error.message, 'error');
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

    const cliente = clientes.find(c => c.id == id);
    if (!cliente) {
      showToast('Cliente não encontrado', 'error');
      return;
    }

    abrirModalRemoverCliente(cliente);
  });

  // Inicializa lista
  atualizarPaginacao();
}