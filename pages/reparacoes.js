import { showToast } from '../components/toast.js';
import { AddReparacoesModal } from '../forms/add-reparacoes.js';
import { EditReparacoesModal } from '../forms/edit-reparacoes.js';
import { RemoveReparacoesModal } from '../forms/remove-reparacoes.js';

export function ReparacoesPage(reparacoes = [], clientes = [], equipamentos = [], profissionais = []) {
  // reparacoes = array de objetos com { id, tipoEquipamento, numeroSerie, modelo, marca, comentarios, clienteId }
  // clientes = array de objetos com { id, nome, ... }

  function getClienteNome(clienteId) {
    const cliente = clientes.find(c => c.id == clienteId);
    return cliente ? cliente.nome : '';
  }


  function getEquipamentoModelo(modeloId) {
    const eq = equipamentos.find(e => e.id == modeloId);
    return eq ? eq.modelo : '';
  }
  function getEquipamentoNumeroSerie(numeroserieId) {
    const eq = equipamentos.find(e => e.id == numeroserieId);
    return eq ? eq.numeroSerie : '';
  }
  function getEquipamentoImei(tipoequipamentoId) {
    const eq = equipamentos.find(e => e.id == tipoequipamentoId);
    return eq ? eq.imei : '';
  }
  function getEquipamentoTipo(imeiId) {
    const eq = equipamentos.find(e => e.id == imeiId);
    return eq ? eq.tipoEquipamento : '';
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
            ${renderReparacoes(reparacoes.slice(0, 10), getClienteNome, getEquipamentoModelo, getEquipamentoNumeroSerie, getEquipamentoTipo, getEquipamentoImei)}
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

function renderReparacoes(reparacoes, getClienteNome, getEquipamentoModelo, getEquipamentoNumeroSerie, getEquipamentoTipo, getEquipamentoImei) {
  if (reparacoes.length === 0) {
    return `<tr><td colspan="7" style="text-align:center;">Nenhuma reparação encontrada.</td></tr>`;
  }
  return reparacoes.map(r => {
    return `
    <tr data-id="${r.id}">
      <td>${escapeHtml(getClienteNome(r.clienteId))}</td>
      <td>${escapeHtml(getEquipamentoModelo(r.modeloId))}</td>
      <td>${escapeHtml(getEquipamentoNumeroSerie(r.numeroserieId))}</td>
      <td>${escapeHtml(getEquipamentoTipo(r.tipoequipamentoId))}</td>
      <td>${escapeHtml(r.profissional)}</td>
      <td>
        <button class="estado-btn" disabled style="cursor: default; padding: 0.2em 0.5em; border-radius: 0.3em; border: none; background-color: ${r.estado === 'Concluido' ? '#09c70f' : '#1c74f0'}; color: white;">
          ${r.estado === 'Concluido' ? 'Concluido' : 'Em progresso'}
        </button>
      </td>
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

  function getEquipamentoModelo(modeloId) {
    const eq = equipamentos.find(e => e.id == modeloId);
    return eq ? eq.modelo : '';
  }
  function getEquipamentoNumeroSerie(numeroserieId) {
    const eq = equipamentos.find(e => e.id == numeroserieId);
    return eq ? eq.numeroSerie : '';
  }
  function getEquipamentoImei(tipoequipamentoId) {
    const eq = equipamentos.find(e => e.id == tipoequipamentoId);
    return eq ? eq.imei : '';
  }
  function getEquipamentoTipo(imeiId) {
    const eq = equipamentos.find(e => e.id == imeiId);
    return eq ? eq.tipoEquipamento : '';
  }

  function atualizarLista() {
    const termo = inputPesquisa.value.trim().toLowerCase();

    dadosFiltrados = reparacoes.filter(r => {
      // Corrigir getEquipamentoNome para retornar objeto equipamento, não string
      const clienteNome = (clientes.find(c => c.id == r.clienteId) || {}).nome || '';
      const equipamentoModelo = (equipamentos.find(eq => eq.id == r.equipamentoId || {}).modelo ) || '';
      const equipamentoNumeroserie = (equipamentos.find(eq => eq.id == r.equipamentoId || {}).numeroSerie ) || '';
      const equipamentoTipo = (equipamentos.find(eq => eq.id == r.equipamentoId || {}).tipoEquipamento ) || '';
      return (
        clienteNome.toLowerCase().includes(termo) ||
        equipamentoModelo.toLowerCase().includes(termo) ||
        equipamentoNumeroserie.toLowerCase().includes(termo) ||
        equipamentoTipo.toLowerCase().includes(termo) 
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

    tbody.innerHTML = renderReparacoes(itensPagina, getClienteNome,
      getEquipamentoModelo,
      getEquipamentoNumeroSerie,
      getEquipamentoTipo,
      getEquipamentoImei);

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
      let hiddenInput = null;
      if (select.id && select.id.startsWith('custom-select-')) {
        const field = select.id.replace('custom-select-', '');
        hiddenInput = modalContainer.querySelector(`#${field}`) ||
          modalContainer.querySelector(`[name="${field}"]`);
      }
      if (!hiddenInput) {
        // fallback: procura input hidden dentro do mesmo grupo
        hiddenInput = select.parentElement.querySelector('input[type="hidden"]');
      }

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

      // Sincronização dos selects de equipamento
      function syncEquipamentoSelects(selectedEquipamentoId) {
        if (!selectedEquipamentoId) return;
        // Busca o equipamento selecionado
        const equipamento = equipamentos.find(eq => eq.id == selectedEquipamentoId);
        if (!equipamento) return;

        // Atualiza selects: modelo, numero de serie, imei, tipo de equipamento
        const modeloSelect = modalContainer.querySelector('.modelo-select-group .custom-select .select-selected');
        const modeloHidden = modalContainer.querySelector('#modeloId');
        const modeloOptionsList = modalContainer.querySelector('.modelo-select-group .options-list');
        if (modeloSelect && modeloHidden && modeloOptionsList) {
          modeloSelect.textContent = equipamento.modelo || '';
          modeloHidden.value = equipamento.id;
          modeloOptionsList.innerHTML = `<div class="option" data-value="${equipamento.id}">${equipamento.modelo || ''}</div>`;
        }

        const numeroSerieSelect = modalContainer.querySelector('.numeroserie-select-group .custom-select .select-selected');
        const numeroSerieHidden = modalContainer.querySelector('#numeroserieId');
        if (numeroSerieSelect && numeroSerieHidden) {
          numeroSerieSelect.textContent = equipamento.numeroSerie || '';
          numeroSerieHidden.value = equipamento.id;
        }

        const imeiSelect = modalContainer.querySelector('.imei-select-group .custom-select .select-selected');
        const imeiHidden = modalContainer.querySelector('#imeiId');
        if (imeiSelect && imeiHidden) {
          imeiSelect.textContent = equipamento.imei || '';
          imeiHidden.value = equipamento.id;
        }

        const tipoEquipamentoSelect = modalContainer.querySelector('.tipoequipamento-select-group .custom-select .select-selected');
        const tipoEquipamentoHidden = modalContainer.querySelector('#tipoequipamentoId');
        const tipoEquipamentoOptionsList = modalContainer.querySelector('.tipoequipamento-select-group .options-list');
        if (tipoEquipamentoSelect && tipoEquipamentoHidden && tipoEquipamentoOptionsList) {
          tipoEquipamentoSelect.textContent = equipamento.tipoEquipamento || '';
          tipoEquipamentoHidden.value = equipamento.id;
          tipoEquipamentoOptionsList.innerHTML = `<div class="option" data-value="${equipamento.id}">${equipamento.tipoEquipamento || ''}</div>`;
        }
      }

      // Adiciona listeners para sincronizar selects ao escolher numero de serie ou imei
      const numeroSerieOptions = modalContainer.querySelectorAll('.numeroserie-select-group .option');
      numeroSerieOptions.forEach(option => {
        option.addEventListener('click', () => {
          const equipamentoId = option.dataset.value;
          syncEquipamentoSelects(equipamentoId);
        });
      });

      const imeiOptions = modalContainer.querySelectorAll('.imei-select-group .option');
      imeiOptions.forEach(option => {
        option.addEventListener('click', () => {
          const equipamentoId = option.dataset.value;
          syncEquipamentoSelects(equipamentoId);
        });
      });
    });

    const selectCliente = modalContainer.querySelector('#custom-select-cliente');
    if (!selectCliente) return;

    const addClienteBtn = modalContainer.querySelector('#btn-add-cliente');
    if (addClienteBtn && !addClienteBtn.dataset.listener) {
      addClienteBtn.addEventListener('click', () => {
        loadModalStyle('/styles/forms/add-cliente-modal.css');
        import('./clientes.js').then(({ openAddClienteModal }) => {
          const previousModalContent = modalContainer.innerHTML;
          const previousModalId = modalContainer.id;
          const isEdit = !!modalContainer.reparacao;
          const reparacao = modalContainer.reparacao;

          modalContainer.id = 'modal-add-cliente-container';
          modalContainer.innerHTML = '';

          openAddClienteModal(
            clientes,
            (newCliente) => {
              loadModalStyle(isEdit
                ? '/styles/forms/edit-reparacoes-modal.css'
                : '/styles/forms/add-reparacoes-modal.css'
              );
              restaurarModalReparacao(
                modalContainer,
                previousModalId,
                previousModalContent,
                isEdit ? 'edit' : 'add',
                reparacao
              );
              clientes.push(newCliente);


              // Atualiza o select de clientes no modal restaurado
              const selectRestored = modalContainer.querySelector('#custom-select-cliente');
              const selectedRestored = selectRestored.querySelector('.select-selected');
              const optionsListRestored = selectRestored.querySelector('.options-list');
              const hiddenInputRestored = modalContainer.querySelector('#clienteId');


              // Cria nova opção
              const newOption = document.createElement('div');
              newOption.className = 'option';
              newOption.dataset.value = newCliente.id;
              newOption.textContent = newCliente.nome;
              optionsListRestored.appendChild(newOption);


              // Evento para selecionar o novo cliente
              newOption.addEventListener('click', () => {
                selectedRestored.textContent = newOption.textContent;
                hiddenInputRestored.value = newOption.dataset.value;
                selectRestored.querySelector('.select-items').classList.add('select-hide');
              });


              // Seleciona automaticamente o novo cliente
              selectedRestored.textContent = newCliente.nome;
              hiddenInputRestored.value = newCliente.id;
            },
            () => {
              loadModalStyle(isEdit
                ? '/styles/forms/edit-reparacoes-modal.css'
                : '/styles/forms/add-reparacoes-modal.css'
              );
              restaurarModalReparacao(
                modalContainer,
                previousModalId,
                previousModalContent,
                isEdit ? 'edit' : 'add',
                reparacao
              );
            }
          );
        });
      });
      addClienteBtn.dataset.listener = "true";
    }

    const selectEquipamento = modalContainer.querySelector('#custom-select-modelo' || '#custom-select-numeroserie' || '#custom-select-tipoequipamento' || '#custom-select-imei');
    if (!selectEquipamento) return;

    const addEquipamentoBtn = modalContainer.querySelector('#btn-add-equipamento');
    if (addEquipamentoBtn && !addEquipamentoBtn.dataset.listener) {
      addEquipamentoBtn.addEventListener('click', () => {
        loadModalStyle('/styles/forms/add-equipamento-modal.css');
        import('./equipamentos.js').then(({ openAddEquipamentoModal }) => {
          const previousModalContent = modalContainer.innerHTML;
          const previousModalId = modalContainer.id;
          const isEdit = !!modalContainer.reparacao;
          const reparacao = modalContainer.reparacao;

          modalContainer.id = 'modal-add-equipamento-container';
          modalContainer.innerHTML = '';

          openAddEquipamentoModal(
            clientes,
            (newCliente) => {
              loadModalStyle(isEdit
                ? '/styles/forms/edit-reparacoes-modal.css'
                : '/styles/forms/add-reparacoes-modal.css'
              );
              restaurarModalReparacao(
                modalContainer,
                previousModalId,
                previousModalContent,
                isEdit ? 'edit' : 'add',
                reparacao
              );
              clientes.push(newCliente);


              // Atualiza o select de clientes no modal restaurado
              const selectRestored = modalContainer.querySelector('#custom-select-cliente');
              const selectedRestored = selectRestored.querySelector('.select-selected');
              const optionsListRestored = selectRestored.querySelector('.options-list');
              const hiddenInputRestored = modalContainer.querySelector('#clienteId');


              // Cria nova opção
              const newOption = document.createElement('div');
              newOption.className = 'option';
              newOption.dataset.value = newCliente.id;
              newOption.textContent = newCliente.nome;
              optionsListRestored.appendChild(newOption);


              // Evento para selecionar o novo cliente
              newOption.addEventListener('click', () => {
                selectedRestored.textContent = newOption.textContent;
                hiddenInputRestored.value = newOption.dataset.value;
                selectRestored.querySelector('.select-items').classList.add('select-hide');
              });


              // Seleciona automaticamente o novo cliente
              selectedRestored.textContent = newCliente.nome;
              hiddenInputRestored.value = newCliente.id;
            },
            () => {
              loadModalStyle(isEdit
                ? '/styles/forms/edit-reparacoes-modal.css'
                : '/styles/forms/add-reparacoes-modal.css'
              );
              restaurarModalReparacao(
                modalContainer,
                previousModalId,
                previousModalContent,
                isEdit ? 'edit' : 'add',
                reparacao
              );
            }
          );
        });
      });
      addEquipamentoBtn.dataset.listener = "true";
    }

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

  function restaurarModalReparacao(modalContainer, previousModalId, previousModalContent, tipo, reparacao = null) {
    modalContainer.id = previousModalId;
    modalContainer.innerHTML = previousModalContent;

    if (tipo === 'add') {
      inicializarListenersReparacaoModal(modalContainer);
    } else if (tipo === 'edit') {
      inicializarListenersEditarReparacaoModal(modalContainer, reparacao);
    }
  }

  // Use esta função no botão
  btnAdicionarReparacao.addEventListener('click', abrirModalAdicionarReparacao);

  function abrirModalAdicionarReparacao() {
    loadModalStyle('/styles/forms/add-reparacoes-modal.css');
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-add-reparacoes-container';
    modalContainer.innerHTML = AddReparacoesModal(clientes, equipamentos);
    document.body.appendChild(modalContainer);

    inicializarListenersReparacaoModal(modalContainer);

  }
  
  function inicializarListenersReparacaoModal(modalContainer) {
    initCustomSelect(modalContainer);

    // Botão fechar modal
    const btnFechar = modalContainer.querySelector('#btn-fechar-modal');
    if (btnFechar) {
      btnFechar.addEventListener('click', () => {
        modalContainer.remove();
      });
    }

    let btnAdicionar = modalContainer.querySelector('#btn-adicionar');
    const form = modalContainer.querySelector('#form-adicionar-reparacao');

    // Remove listeners antigos do botão
    if (btnAdicionar) {
      const newBtn = btnAdicionar.cloneNode(true);
      btnAdicionar.parentNode.replaceChild(newBtn, btnAdicionar);
      btnAdicionar = newBtn;
    }

    if (btnAdicionar && form) {
      btnAdicionar.addEventListener('click', async () => {
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }


        const novaReparacao = {
          clienteId: form.clienteId.value.trim(),
          modeloId: form.modeloId.value.trim(),
          numeroserieId: form.numeroserieId.value.trim(),
          tipoequipamentoId: form.tipoequipamentoId.value.trim(),
          imeiId: form.imeiId.value.trim(),
          profissional: form.profissional ? form.profissional.value.trim() : '',
          problema: form.problema ? form.problema.value.trim() : '',
          descricao: form.descricao ? form.descricao.value.trim() : '',
          estado: "Em progresso"
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
    }
  }

  function abrirModalEditarReparacao(reparacao) {
    loadModalStyle('/styles/forms/edit-reparacoes-modal.css');
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-edit-reparacao-container';
    modalContainer.innerHTML = EditReparacoesModal(clientes, equipamentos, reparacao);

    // Salva o equipamento no container para referência futura
    modalContainer.reparacao = reparacao;

    document.body.appendChild(modalContainer);

    inicializarListenersEditarReparacaoModal(modalContainer, reparacao);

  }

  function inicializarListenersEditarReparacaoModal(modalContainer, reparacao) {
    initCustomSelect(modalContainer);


    const btnFechar = modalContainer.querySelector('#btn-fechar-modal');
    if (btnFechar) {
      btnFechar.onclick = () => modalContainer.remove();
    }

    let btnSalvar = modalContainer.querySelector('#btn-editar');
    const form = modalContainer.querySelector('#form-editar-reparacao');
    const estadoedit= modalContainer.querySelector('.modal-footer select#estado');


    // Remove listeners antigos do botão
    if (btnSalvar) {
      const newBtn = btnSalvar.cloneNode(true);
      btnSalvar.parentNode.replaceChild(newBtn, btnSalvar);
      btnSalvar = newBtn;
    }

    if (btnSalvar && form && estadoedit) {
      btnSalvar.addEventListener('click', async () => {
        if (!form.checkValidity() || !estadoedit.checkValidity()) {
          form.reportValidity();
          estadoedit.reportValidity();
          return;
        }


        const reparacaoAtualizada = {
          id: reparacao.id,
          clienteId: form.clienteId.value.trim() || reparacao.clienteId,
          modeloId: form.modeloId.value.trim() || reparacao.modeloId,
          numeroserieId: form.numeroserieId.value.trim() || reparacao.numeroserieId,
          tipoequipamentoId: form.tipoequipamentoId.value.trim() || reparacao.tipoequipamentoId,
          imeiId: form.imeiId.value.trim() || reparacao.imeiId,
          profissional: form.profissional ? form.profissional.value.trim() : reparacao.profissional,
          problema: form.problema ? form.problema.value.trim() : reparacao.problema,
          descricao: form.descricao ? form.descricao.value.trim() : reparacao.descricao,
          estado: estadoedit.value || reparacao.estado
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
              reparacoes[index] = { ...reparacao, ...reparacaoAtualizada };
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
    modalContainer.innerHTML = RemoveReparacoesModal(reparacao.modelo);
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