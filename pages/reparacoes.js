import { showToast } from '../components/toast.js';
import { AddReparacoesModal } from '../forms/add-reparacoes.js';
import { EditReparacoesModal } from '../forms/edit-reparacoes.js';
import { RemoveReparacoesModal } from '../forms/remove-reparacoes.js';

export function ReparacoesPage(reparacoes = [], clientes = [], equipamentos = [], profissionais = []) {
  // reparacoes = array de objetos com { id, tipoEquipamento, numeroSerie, modelo, marca, comentarios, clienteId }
  // clientes = array de objetos com { id, nome, ... }

  reparacoes = Array.isArray(reparacoes) ? reparacoes : [];
  equipamentos = Array.isArray(equipamentos) ? equipamentos : [];
  clientes = Array.isArray(clientes) ? clientes : [];
  profissionais = Array.isArray(profissionais) ? profissionais : [];

  function getClienteNome(clienteId) {
    const cliente = clientes.find(c => c.id == clienteId);
    return cliente ? cliente.nome : '';
  }

  // Helper para obter profissional pelo id
  function getProfissionalNome(profissionalId) {
    const profissional = profissionais.find(p => p.id == profissionalId);
    return profissional ? profissional.nome : '';
  }

  // Helper para obter equipamento pelo id
  function getEquipamentoNome(equipamentoId) {
    return equipamentos.find(eq => eq.id == equipamentoId) || {};
  }

  return `
    <section class="reparacoes-page">
      <h1 id="title-reparacoes">Reparações</h1>
      
      <div class="reparacoes-container">
        <h1 id="main-info">Informações de reparações</h1>
        <div class="reparacoes-header">
            <div class="pesquisa-reparacoes">
              <label for="barra-pesquisa-reparacoes">Pesquisar:</label>
              <input type="search" id="barra-pesquisa-reparacoes" aria-label="Pesquisar reparações">
            </div>  
            <button id="btn-adicionar-reparacao" class="btn-primary" type="button">
                <i class="fa-solid fa-circle-plus"></i>Adicionar Reparação</button>
        </div>

        <table class="reparacoes-tabela" aria-label="Lista de reparações">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Modelo</th>
              <th>Número de Série</th>
              <th>Tipo de Equipamento</th>
              <th>Profissional</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="reparacoes-lista">
            ${renderReparacoes(reparacoes.slice(0, 10), getClienteNome, getEquipamentoNome, getProfissionalNome)}
          </tbody>
        </table>

        <div class="reparacoes-footer">
          <div id="reparacoes-feedback" class="reparacoes-feedback">
            Mostrando 1 a ${Math.min(10, reparacoes.length)} de ${reparacoes.length} reparações
          </div>
          <div class="reparacoes-paginacao">
            <button id="btn-anterior" type="button" class="btn-paginacao" disabled>Anterior</button>
            <button id="btn-pagina-atual" type="button" class="btn-pagina-atual" disabled>1</button>
            <button id="btn-seguinte" type="button" class="btn-paginacao" ${reparacoes.length > 10 ? '' : 'disabled'}>Seguinte</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderReparacoes(reparacoes, getClienteNome, getEquipamentoNome, getProfissionalNome) {
  if (reparacoes.length === 0) {
    return `<tr><td colspan="7" style="text-align:center;">Nenhuma reparação encontrada.</td></tr>`;
  }
  return reparacoes.map(r => {
    const equipamento = getEquipamentoNome(r.equipamentoId) || {};
    return `
    <tr data-id="${r.id}">
      <td>${escapeHtml(getClienteNome(r.clienteId))}</td>
      <td>${escapeHtml(equipamento.modelo || '')}</td>
      <td>${escapeHtml(equipamento.numeroSerie || '')}</td>
      <td>${escapeHtml(equipamento.tipoEquipamento || '')}</td>
      <td>${escapeHtml(getProfissionalNome(r.profissionalId))}</td>
      <td>${escapeHtml(r.estado || '')}</td>
      <td class="acoes-coluna">
        <button class="btn-editar" type="button" title="Editar">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="btn-remover-reparacao" type="button" title="Remover">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </td>
    </tr>
  `}).join('');
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

export function setupReparacoesPageListeners(reparacoes, clientes, equipamentos, profissionais) {
  const inputPesquisa = document.getElementById('barra-pesquisa-reparacoes');
  const tbody = document.getElementById('reparacoes-lista');
  const btnAnterior = document.getElementById('btn-anterior');
  const btnSeguinte = document.getElementById('btn-seguinte');
  const btnPaginaAtual = document.getElementById('btn-pagina-atual');
  const feedback = document.getElementById('reparacoes-feedback');
  const btnAdicionarReparacao = document.getElementById('btn-adicionar-reparacao');
  
  function loadModalStyle(href) {
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

  if (!inputPesquisa || !tbody || !btnAnterior || !btnSeguinte || !btnPaginaAtual || !feedback || !btnAdicionarReparacao) return;

  let paginaAtual = 1;
  const itensPorPagina = 10;
  let dadosFiltrados = Array.isArray(reparacoes) ? reparacoes : [];

  function getClienteNome(clienteId) {
    const cliente = clientes.find(c => c.id == clienteId);
    return cliente ? cliente.nome : '';
  }

  function getEquipamentoNome(equipamentoId) {
    const equipamento = equipamentos.find(eq => eq.id == equipamentoId);
    return equipamento ? equipamento.nome : '';
  }

  function getProfissionalNome(profissionalId) {
    const profissional = profissionais.find(p => p.id == profissionalId);
    return profissional ? profissional.nome : '';
  }

  function atualizarLista() {
    const termo = inputPesquisa.value.trim().toLowerCase();

    dadosFiltrados = reparacoes.filter(r => {
      // Corrigir getEquipamentoNome para retornar objeto equipamento, não string
      const equipamento = equipamentos.find(eq => eq.id == r.equipamentoId) || {};
      const clienteNome = (clientes.find(c => c.id == r.clienteId) || {}).nome || '';
      const profissionalNome = (profissionais.find(p => p.id == r.profissionalId) || {}).nome || '';
      return (
        clienteNome.toLowerCase().includes(termo) ||
        (equipamento.modelo && equipamento.modelo.toLowerCase().includes(termo)) ||
        (equipamento.numeroSerie && equipamento.numeroSerie.toLowerCase().includes(termo)) ||
        (equipamento.tipoEquipamento && equipamento.tipoEquipamento.toLowerCase().includes(termo)) ||
        profissionalNome.toLowerCase().includes(termo) ||
        (r.estado && r.estado.toLowerCase().includes(termo))
      );
    });

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

    tbody.innerHTML = renderReparacoes(itensPagina, getClienteNome, getEquipamentoNome, getProfissionalNome);

    btnAnterior.disabled = paginaAtual <= 1;
    btnSeguinte.disabled = paginaAtual >= totalPaginas;

    btnPaginaAtual.textContent = paginaAtual;

    feedback.textContent = `Mostrando ${inicio + 1} a ${Math.min(fim, totalItens)} de ${totalItens} equipamentos`;
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

  function initCustomSelect(modalContainer) {
    // Seleciona todos os selects customizados dentro do modal
    const selects = modalContainer.querySelectorAll('.custom-select');
    selects.forEach(select => {
      const selected = select.querySelector('.select-selected');
      const itemsContainer = select.querySelector('.select-items');
      const searchInput = select.querySelector('.select-search');
      const optionsList = select.querySelector('.options-list');
      const hiddenInput = select.parentElement.querySelector('input[type="hidden"]');

      if (!selected || !itemsContainer || !searchInput || !optionsList || !hiddenInput) return;

      // Filtra as opções com base no texto da pesquisa
      function filterOptions(searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        const options = optionsList.querySelectorAll('.option');
        options.forEach(option => {
          const text = option.textContent.toLowerCase();
          option.style.display = text.includes(lowerSearch) ? '' : 'none';
        });
      }

      // Toggle dropdown
      selected.addEventListener('click', (e) => {
        e.stopPropagation(); // evitar fechar imediatamente
        // Fecha outros selects abertos
        document.querySelectorAll('.select-items').forEach(container => {
          if (container !== itemsContainer) {
            container.classList.add('select-hide');
          }
        });
        itemsContainer.classList.toggle('select-hide');
        searchInput.value = '';
        filterOptions('');
        searchInput.focus();
      });

      // Permitir abrir dropdown com teclado (Enter/Space)
      selected.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selected.click();
        }
      });

      // Filtrar opções ao digitar
      searchInput.addEventListener('input', (e) => {
        filterOptions(e.target.value);
      });

      // Selecionar opção ao clicar
      optionsList.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', () => {
          selected.textContent = option.textContent;
          hiddenInput.value = option.dataset.value || option.dataset.id || '';
          itemsContainer.classList.add('select-hide');
        });
      });
    });

    // Fecha dropdown ao clicar fora
    document.addEventListener('click', (e) => {
      modalContainer.querySelectorAll('.select-items').forEach(itemsContainer => {
        if (!itemsContainer.classList.contains('select-hide')) {
          if (!itemsContainer.parentElement.contains(e.target)) {
            itemsContainer.classList.add('select-hide');
          }
        }
      });
    });
  }

  btnAdicionarReparacao.addEventListener('click', () => {
    loadModalStyle('/styles/forms/add-reparacoes-modal.css');
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-add-reparacoes-container';
    modalContainer.innerHTML = AddReparacoesModal(clientes, equipamentos);
    document.body.appendChild(modalContainer);
  
    // Inicializa select customizado
    initCustomSelect(modalContainer);

    // Botão fechar modal
    const btnFechar = modalContainer.querySelector('#btn-fechar-modal');
    if (btnFechar) {
      btnFechar.addEventListener('click', () => {
        modalContainer.remove();
      });
    }

    const btnAdicionar = modalContainer.querySelector('#btn-adicionar');
    const form = modalContainer.querySelector('#form-adicionar-reparacao');


    btnAdicionar.addEventListener('click', async () => {
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
    

      const novaReparacao = {
        clienteId: form.clienteId.value.trim(),
        equipamentoId: form.modeloId.value.trim(),
        profissionalId: form.profissionalId ? form.profissionalId.value.trim() : null,
        estado: form.estado ? form.estado.value.trim() : '',
        problema: form.problema ? form.problema.value.trim() : '',
        descricao: form.descricao ? form.descricao.value.trim() : '',
        dataEntrada: form['data-entrada'].value,
      };

      try {
        const res = await fetch('/backend/reparacoes.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(novaReparacao)
        });

        if (!res.ok) {
          const errorData = await res.json();
          showToast('Erro ao adicionar reparação: ' + (errorData.error || 'Erro desconhecido'), 'error');
          return;
        }

        const data = await res.json();
        if (data.success) {
          reparacoes.push(data.item);
          atualizarLista();
          modalContainer.remove();
          showToast('Reparação adicionada com sucesso.', 'success');
        } else {
          showToast('Erro ao adicionar reparação.', 'error');
        }
      } catch (error) {
        showToast('Erro ao adicionar reparação: ' + error.message, 'error');
      }
    });
  });

  function abrirModalEditarReparacao(reparacao) {
    loadModalStyle('/styles/forms/edit-reparacoes-modal.css');
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-edit-reparacao-container';


    modalContainer.innerHTML = EditReparacoesModal(clientes, equipamentos);
    document.body.appendChild(modalContainer);

    // Inicializa select customizado
    initCustomSelect(modalContainer);

    const form = modalContainer.querySelector('#form-editar-reparacao');
    
    form.problema.value = reparacao.problema || '';
    form.descricao.value = reparacao.descricao || '';
    form['data-entrada'].value = reparacao.dataEntrada || '';

    const btnFechar = modalContainer.querySelector('#btn-fechar-modal');
    btnFechar.addEventListener('click', () => modalContainer.remove());

    const btnSalvar = modalContainer.querySelector('#btn-editar');

    

    btnSalvar.addEventListener('click', async () => {
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const reparacaoAtualizada = {
        id: reparacao.id,
        equipamentoId: form.modeloId.value.trim() || reparacao.equipamentoId,
        profissionalId: form.profissionalId ? form.profissionalId.value.trim() : reparacoes.profissionalId,
        estado: form.estado ? form.estado.value.trim() : reparacao.estado,
        problema: form.problema ? form.problema.value.trim() : reparacao.problema,
        descricao: form.descricao ? form.descricao.value.trim() : reparacao.descricao,
        dataEntrada: form['data-entrada'].value,
      };

      try {
        const res = await fetch('/backend/reparacoes.php', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reparacaoAtualizada)
        });

        if (!res.ok) {
          const errorData = await res.json();
          showToast('Erro ao atualizar reparação: ' + (errorData.error || 'Erro desconhecido'), 'error');
          return;
        }

        const data = await res.json();
        if (data.success) {
          const index = reparacoes.findIndex(r => r.id === reparacao.id);
          if (index !== -1) {
            reparacoes[index] = reparacaoAtualizada;
            atualizarLista();
          }
          modalContainer.remove();
          showToast('Reparação atualizada com sucesso.', 'success');
        } else {
          showToast('Erro ao atualizar reparação.', 'error');
        }
      } catch (error) {
        showToast('Erro ao atualizar reparação: ' + error.message, 'error');
      }
    });
  }

  tbody.addEventListener('click', e => {
    const btn = e.target.closest('.btn-editar');
    if (!btn) return;

    const tr = btn.closest('tr');
    if (!tr) return;

    const id = tr.getAttribute('data-id');
    if (!id) return;

    const reparacao = reparacoes.find(r => r.id == id);
    if (!reparacao) {
      showToast('Reparação não encontrada', 'error');
      return;
    }

    abrirModalEditarReparacao(reparacao);
  });

  function abrirModalRemoverReparacao(reparacao) {
    loadModalStyle('/styles/forms/remove-reparacoes-modal.css');

    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-remove-reparacao-container';
    modalContainer.innerHTML = RemoveReparacoesModal(reparacao.estado || '');
    document.body.appendChild(modalContainer);

    const btnCancelar = modalContainer.querySelector('#btn-cancelar');
    const btnRemover = modalContainer.querySelector('#btn-remover');
    
    btnCancelar.addEventListener('click', () => {
      modalContainer.remove();
    });

    btnRemover.addEventListener('click', async () => {
      try {
        const res = await fetch('/backend/reparacoes.php', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: reparacao.id })
        });

        if (!res.ok) {
          const errorData = await res.json();
          showToast('Erro ao remover reparação: ' + (errorData.error || 'Erro desconhecido'), 'error');
          return;
        }

        const data = await res.json();
        if (data.success) {
          const index = reparacoes.findIndex(r => r.id === reparacao.id);
          if (index !== -1) {
            reparacoes.splice(index, 1);
            atualizarLista();
          }
          modalContainer.remove();
          showToast('Reparação removida com sucesso.', 'success');
        } else {
          showToast('Erro ao remover reparação.', 'error');
        }
      } catch (error) {
        showToast('Erro ao remover reparação: ' + error.message, 'error');
      }
    });
  }

  tbody.addEventListener('click', e => {
    const btn = e.target.closest('.btn-remover-reparacao');
    if (!btn) return;

    const tr = btn.closest('tr');
    if (!tr) return;

    const id = tr.getAttribute('data-id');
    if (!id) return;

    const reparacao = reparacoes.find(r => r.id == id);
    if (!reparacao) {
      showToast('Reparação não encontrada', 'error');
      return;
    }

    abrirModalRemoverReparacao(reparacao);
  });

  atualizarPaginacao();
}