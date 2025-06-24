import { showToast } from '../components/toast.js';
import { AddProfissionalModal } from '../forms/add-profissional.js';
import { EditProfissionalModal } from '../forms/edit-profissional.js';
import { RemoveProfissionalModal } from '../forms/remove-profissional.js';

export function ProfissionaisPage(profissionais = []) {
  
  return `
    <section class="profissionais-page">
      <h1 id="title-profissionais">Profissionais</h1>
      <button id="btn-adicionar-profissional" class="btn-primary" type="button">
       <i class="fa-solid fa-circle-plus"></i>Adicionar Profissional</button>

      <div class="profissionais-container">
        <div class="pesquisa-profissionais">
          <label for="barra-pesquisa-profissionais">Pesquisar:</label>
          <input type="search" id="barra-pesquisa-profissionais" aria-label="Pesquisar profissionais">
        </div>

        <table class="profissionais-tabela" aria-label="Lista de profissionais">
          <thead>
            <tr>
              <th>Cargo</th>
              <th>Nome</th>
              <th>Apelido</th>
              <th>Morada</th>
              <th>Email</th>
              <th>Telefone</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="profissionais-lista">
            ${renderProfissionais(profissionais.slice(0, 10))}
          </tbody>
        </table>

        <div class="profissionais-footer">
          <div id="profissionais-feedback" class="profissionais-feedback">
            Mostrando 1 a ${Math.min(10, profissionais.length)} de ${profissionais.length} profissionais
          </div>
          <div class="profissionais-paginacao">
            <button id="btn-anterior" type="button" class="btn-paginacao" disabled>Anterior</button>
            <button id="btn-pagina-atual" type="button" class="btn-pagina-atual" disabled>1</button>
            <button id="btn-seguinte" type="button" class="btn-paginacao" ${profissionais.length > 10 ? '' : 'disabled'}>Seguinte</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderProfissionais(profissionais) {
  if (profissionais.length === 0) {
    return `<tr><td colspan="7" style="text-align:center;">Nenhum profissional encontrado.</td></tr>`;
  }
  return profissionais.map(p => `
    <tr data-id="${p.id}">
      <td>${escapeHtml(p.cargo)}</td>
      <td>${escapeHtml(p.nome)}</td>
      <td>${escapeHtml(p.apelido)}</td>
      <td>${escapeHtml(p.morada)}</td>
      <td>${escapeHtml(p.email)}</td>
      <td>${escapeHtml(p.telefone)}</td>
      <td class="acoes-coluna">
        <button class="btn-editar" type="button" title="Editar">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="btn-remover" type="button" title="Remover">
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
export function setupProfissionaisPageListeners(profissionais) {
  const inputPesquisa = document.getElementById('barra-pesquisa-profissionais');
  const tbody = document.getElementById('profissionais-lista');
  const btnAnterior = document.getElementById('btn-anterior');
  const btnSeguinte = document.getElementById('btn-seguinte');
  const btnPaginaAtual = document.getElementById('btn-pagina-atual');
  const feedback = document.getElementById('profissionais-feedback');
  const btnAdicionarProfissional = document.getElementById('btn-adicionar-profissional');

  function loadModalStyle(href) {
    // Remove previously loaded dynamic modal styles (only modal styles, not page styles)
    const previousStyles = document.querySelectorAll('link[data-dynamic-style="true"]');
    previousStyles.forEach(link => {
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

  if (!inputPesquisa || !tbody || !btnAnterior || !btnSeguinte || !btnPaginaAtual || !feedback || !btnAdicionarProfissional) return;

  let paginaAtual = 1;
  const itensPorPagina = 10;
  let dadosFiltrados = profissionais;

  function atualizarLista() {
    const termo = inputPesquisa.value.trim().toLowerCase();

    dadosFiltrados = profissionais.filter(p =>
      (p.cargo && p.cargo.toLowerCase().includes(termo)) ||
      (p.nome && p.nome.toLowerCase().includes(termo)) ||
      (p.apelido && p.apelido.toLowerCase().includes(termo)) ||
      (p.morada && p.morada.toLowerCase().includes(termo)) ||
      (p.email && p.email.toLowerCase().includes(termo)) ||
      (p.telefone && p.telefone.toLowerCase().includes(termo))
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

    tbody.innerHTML = renderProfissionais(itensPagina);

    // Atualizar estado dos botões
    btnAnterior.disabled = paginaAtual <= 1;
    btnSeguinte.disabled = paginaAtual >= totalPaginas;

    btnPaginaAtual.textContent = paginaAtual;

    feedback.textContent = `Mostrando ${inicio + 1} a ${Math.min(fim, totalItens)} de ${totalItens} profissionais`;
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

  // Evento para abrir modal de adicionar profissional
  btnAdicionarProfissional.addEventListener('click', () => {
    loadModalStyle('/styles/forms/add-profissional-modal.css');
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-add-profissional-container';
    modalContainer.innerHTML = AddProfissionalModal();
    document.body.appendChild(modalContainer);

    // Botão fechar modal
    const btnFechar = modalContainer.querySelector('#btn-fechar-modal');
    if (btnFechar) {
      btnFechar.addEventListener('click', () => {
        modalContainer.remove();
      });
    }

    // Botão adicionar profissional e formulário
    const btnAdicionar = modalContainer.querySelector('#btn-adicionar');
    const form = modalContainer.querySelector('#form-adicionar-profissional');

    btnAdicionar.addEventListener('click', async () => {
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const novoProfissional = {
        cargo: form.cargo.value.trim(),
        nome: form.nome.value.trim(),
        apelido: form.apelido.value.trim(),
        morada: form.morada.value.trim(),
        email: form.email.value.trim(),
        telefone: form.telefone.value.trim()
      };

      try {
        const res = await fetch('/backend/profissionais.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(novoProfissional)
        });

        if (!res.ok) {
          const errorData = await res.json();
          showToast('Erro ao adicionar profissional: ' + (errorData.error || 'Erro desconhecido'), 'error');
          return;
        }

        const data = await res.json();
        if (data.id) {
          profissionais.push(data);
          atualizarLista();
          modalContainer.remove();
        } else {
          showToast('Erro ao adicionar profissional.', 'error');
        }
      } catch (error) {
        showToast('Erro ao adicionar profissional: ' + error.message, 'error');
      }
    });
  });

  // Função para abrir modal de edição com dados do profissional
  function abrirModalEditarProfissional(profissional) {
    loadModalStyle('/styles/forms/edit-profissional-modal.css');
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-edit-profissional-container';
    modalContainer.innerHTML = EditProfissionalModal();
    document.body.appendChild(modalContainer);

    const form = modalContainer.querySelector('#form-adicionar-profissional');
    form.cargo.placeholder = profissional.cargo || '';
    form.nome.placeholder = profissional.nome || '';
    form.apelido.placeholder = profissional.apelido || '';
    form.morada.placeholder = profissional.morada || '';
    form.email.placeholder = profissional.email || '';
    form.telefone.placeholder = profissional.telefone || '';

    const btnFechar = modalContainer.querySelector('#btn-fechar-modal');
    btnFechar.addEventListener('click', () => modalContainer.remove());

    const btnSalvar = modalContainer.querySelector('#btn-adicionar');

    btnSalvar.addEventListener('click', async () => {
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const cargo = form.cargo.value.trim() || profissional.cargo;
      const nome = form.nome.value.trim() || profissional.nome;
      const apelido = form.apelido.value.trim() || profissional.apelido;
      const morada = form.morada.value.trim() || profissional.morada;
      const email = form.email.value.trim() || profissional.email;
      const telefone = form.telefone.value.trim() || profissional.telefone;

      const profissionalAtualizado = {
        id: profissional.id,
        cargo,
        nome,
        apelido,
        morada,
        email,
        telefone
      };

      try {
        const res = await fetch('/backend/profissionais.php', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profissionalAtualizado)
        });

        if (!res.ok) {
          const errorData = await res.json();
          showToast('Erro ao atualizar profissional: ' + (errorData.error || 'Erro desconhecido'), 'error');
          return;
        }

        const data = await res.json();
        if (data.success) {
          const index = profissionais.findIndex(p => p.id === profissional.id);
          if (index !== -1) {
            profissionais[index] = profissionalAtualizado;
            atualizarLista();
          }
          modalContainer.remove();
        } else {
          showToast('Erro ao atualizar profissional.', 'error');
        }
      } catch (error) {
        showToast('Erro ao atualizar profissional: ' + error.message, 'error');
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

    const profissional = profissionais.find(p => p.id == id);
    if (!profissional) {
      showToast('Profissional não encontrado', 'error');
      return;
    }

    abrirModalEditarProfissional(profissional);
  });

  // Função para abrir modal de remoção com dados do profissional
  function abrirModalRemoverProfissional(profissional) {
    loadModalStyle('/styles/forms/remove-profissional-modal.css');

    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-remove-profissional-container';
    modalContainer.innerHTML = RemoveProfissionalModal(profissional.nome + ' ' + profissional.apelido);
    document.body.appendChild(modalContainer);

    const btnCancelar = modalContainer.querySelector('#btn-cancelar');
    const btnRemover = modalContainer.querySelector('#btn-remover');

    btnCancelar.addEventListener('click', () => {
      modalContainer.remove();
    });

    btnRemover.addEventListener('click', async () => {
      try {
        const res = await fetch('/backend/profissionais.php', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: profissional.id })
        });

        if (!res.ok) {
          const errorData = await res.json();
          showToast('Erro ao remover profissional: ' + (errorData.error || 'Erro desconhecido'), 'error');
          return;
        }

        const data = await res.json();
        if (data.success) {
          // Remover profissional da lista local
          const index = profissionais.findIndex(p => p.id === profissional.id);
          if (index !== -1) {
            profissionais.splice(index, 1);
            atualizarLista();
          }
          modalContainer.remove();
        } else {
          showToast('Erro ao remover profissional.', 'error');
        }
      } catch (error) {
        showToast('Erro ao remover profissional: ' + error.message, 'error');
      }
    });
  }

  // Listener para botões remover - delegação de evento no tbody
  tbody.addEventListener('click', e => {
    const btn = e.target.closest('.btn-remover');
    if (!btn) return;

    const tr = btn.closest('tr');
    if (!tr) return;

    const id = tr.getAttribute('data-id');
    if (!id) return;

    const profissional = profissionais.find(p => p.id == id);
    if (!profissional) {
      showToast('Profissional não encontrado', 'error');
      return;
    }

    abrirModalRemoverProfissional(profissional);
  });

  // Inicializa lista
  atualizarPaginacao();
}
