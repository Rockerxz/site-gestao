import { showToast } from '../components/toast.js';
import { openAddClienteModal } from './clientes.js';
import { AddEquipamentoModal } from '../forms/add-equipamento.js';
import { EditEquipamentoModal } from '../forms/edit-equipamento.js';
import { RemoveEquipamentoModal } from '../forms/remove-equipamento.js';

export function EquipamentosPage(equipamentos = [], clientes = []) {
  // equipamentos = array de objetos com { id, tipoEquipamento, numeroSerie, modelo, marca, comentarios, clienteId }
  // clientes = array de objetos com { id, nome, ... }

  // Helper para obter nome do cliente pelo id
  function getClienteNome(clienteId) {
    const cliente = clientes.find(c => c.id == clienteId);
    return cliente ? cliente.nome : '';
  }

  return `
    <section class="equipamentos-page">
      <h1 id="title-equipamentos">Equipamentos</h1>
      
      <div class="equipamentos-container">
        <h1 id="main-info">Informações de equipamentos</h1>
        <div class="equipamentos-header">
            <div class="pesquisa-equipamentos">
              <label for="barra-pesquisa-equipamentos">Pesquisar:</label>
              <input type="search" id="barra-pesquisa-equipamentos" aria-label="Pesquisar equipamentos">
            </div>  
            <button id="btn-adicionar-equipamento" class="btn-primary" type="button">
                <i class="fa-solid fa-circle-plus"></i>Adicionar Equipamento</button>
        </div>

        <table class="equipamentos-tabela" aria-label="Lista de equipamentos">
          <thead>
            <tr>
              <th>Tipo de Equipamento</th>
              <th>Número de Série</th>
              <th>Modelo</th>
              <th>IMEI</th>
              <th>Cliente</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="equipamentos-lista">
            ${renderEquipamentos(equipamentos.slice(0, 5), getClienteNome)}
          </tbody>
        </table>

        <div class="equipamentos-footer">
          <div id="equipamentos-feedback" class="equipamentos-feedback">
            Mostrando 1 a ${Math.min(5, equipamentos.length)} de ${equipamentos.length} equipamentos
          </div>
          <div class="equipamentos-paginacao">
            <button id="btn-anterior" type="button" class="btn-paginacao" disabled>Anterior</button>
            <button id="btn-pagina-atual" type="button" class="btn-pagina-atual" disabled>1</button>
            <button id="btn-seguinte" type="button" class="btn-paginacao" ${equipamentos.length > 5 ? '' : 'disabled'}>Seguinte</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderEquipamentos(equipamentos, getClienteNome) {
  if (equipamentos.length === 0) {
    return `<tr><td colspan="7" style="text-align:center;">Nenhum equipamento encontrado.</td></tr>`;
  }
  return equipamentos.map(e => `
    <tr data-id="${e.id}">
      <td>${escapeHtml(e.tipoEquipamento)}</td>
      <td>${escapeHtml(e.numeroSerie)}</td>
      <td>${escapeHtml(e.modelo)}</td>
      <td>${escapeHtml(e.imei)}</td>
      <td>${escapeHtml(getClienteNome(e.clienteId))}</td>
      <td class="acoes-coluna">
        <button class="btn-editar" type="button" title="Editar">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="btn-remover-equipamento" type="button" title="Remover">
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

export function setupEquipamentosPageListeners(equipamentos, clientes) {
  const inputPesquisa = document.getElementById('barra-pesquisa-equipamentos');
  const tbody = document.getElementById('equipamentos-lista');
  const btnAnterior = document.getElementById('btn-anterior');
  const btnSeguinte = document.getElementById('btn-seguinte');
  const btnPaginaAtual = document.getElementById('btn-pagina-atual');
  const feedback = document.getElementById('equipamentos-feedback');
  const btnAdicionarEquipamento = document.getElementById('btn-adicionar-equipamento');

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

  if (!inputPesquisa || !tbody || !btnAnterior || !btnSeguinte || !btnPaginaAtual || !feedback || !btnAdicionarEquipamento) return;

  let paginaAtual = 1;
  const itensPorPagina = 5;
  let dadosFiltrados = equipamentos;

  function getClienteNome(clienteId) {
    const cliente = clientes.find(c => c.id == clienteId);
    return cliente ? cliente.nome : '';
  }

  function atualizarLista() {
    const termo = inputPesquisa.value.trim().toLowerCase();

    dadosFiltrados = equipamentos.filter(e =>
      (e.tipoEquipamento && e.tipoEquipamento.toLowerCase().includes(termo)) ||
      (e.numeroSerie && e.numeroSerie.toLowerCase().includes(termo)) ||
      (e.modelo && e.modelo.toLowerCase().includes(termo)) ||
      (e.imei && e.imei.toLowerCase().includes(termo)) ||
      (getClienteNome(e.clienteId).toLowerCase().includes(termo))
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

    tbody.innerHTML = renderEquipamentos(itensPagina, getClienteNome);

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
    const select = modalContainer.querySelector('#custom-select');
    if (!select) return;

    // Apenas adiciona o event listener ao botão já existente
    const addClienteBtn = modalContainer.querySelector('#btn-add-cliente');
    if (addClienteBtn && !addClienteBtn.dataset.listener) {
      addClienteBtn.addEventListener('click', () => {
        loadModalStyle('/styles/forms/add-cliente-modal.css');

        import('./clientes.js').then(({ openAddClienteModal }) => {
          // Save current modal content and id
          const previousModalContent = modalContainer.innerHTML;
          const previousModalId = modalContainer.id;
          const isEdit = !!modalContainer.equipamento;
          const equipamento = modalContainer.equipamento;

          // Replace current modal content with add-cliente modal
          modalContainer.id = 'modal-add-cliente-container';
          modalContainer.innerHTML = '';

          // Open add cliente modal inside the same container
          openAddClienteModal(
            clientes,
            // Callback when client is added successfully
            (newCliente) => {

              loadModalStyle(isEdit
                ? '/styles/forms/edit-equipamento-modal.css'
                : '/styles/forms/add-equipamento-modal.css'
              );
              // Restore previous modal content using the helper
              restaurarModalEquipamento(
                modalContainer,
                previousModalId,
                previousModalContent,
                isEdit ? 'edit' : 'add',
                equipamento
              );

              // Update clientes array with new client
              clientes.push(newCliente);


              // Select the new client in the restored modal's select
              const selectRestored = modalContainer.querySelector('#custom-select');
              const selectedRestored = selectRestored.querySelector('.select-selected');
              const optionsListRestored = selectRestored.querySelector('.options-list');
              const hiddenInputRestored = modalContainer.querySelector('#clienteId');

              // Add new option to options list
              const newOption = document.createElement('div');
              newOption.className = 'option';
              newOption.dataset.id = newCliente.id;
              newOption.textContent = newCliente.nome;
              optionsListRestored.appendChild(newOption);

              // Add click event to new option
              newOption.addEventListener('click', () => {
                selectedRestored.textContent = newOption.textContent;
                hiddenInputRestored.value = newOption.dataset.id;
                selectRestored.querySelector('.select-items').classList.add('select-hide');
              });

              // Select new client automatically
              selectedRestored.textContent = newCliente.nome;
              hiddenInputRestored.value = newCliente.id;
            },
            // Callback when modal is closed without adding client
            () => {
              // Restore previous modal content
              loadModalStyle(isEdit
                ? '/styles/forms/edit-equipamento-modal.css'
                : '/styles/forms/add-equipamento-modal.css'
              );
              // Restore previous modal content using the helper
              restaurarModalEquipamento(
                modalContainer,
                previousModalId,
                previousModalContent,
                isEdit ? 'edit' : 'add',
                equipamento
              );
            }
          );
        });
      });
      addClienteBtn.dataset.listener = "true";
    }

    const selected = select.querySelector('.select-selected');
    const itemsContainer = select.querySelector('.select-items');
    const searchInput = select.querySelector('.select-search');
    const optionsList = select.querySelector('.options-list');
    const hiddenInput = modalContainer.querySelector('#clienteId');

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
    selected.addEventListener('click', () => {
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
        hiddenInput.value = option.dataset.id;
        itemsContainer.classList.add('select-hide');
      });
    });

    // Fecha dropdown ao clicar fora
    document.addEventListener('click', (e) => {
      if (!select.contains(e.target)) {
        itemsContainer.classList.add('select-hide');
      }
    });
     
  }

  function restaurarModalEquipamento(modalContainer, previousModalId, previousModalContent, tipo, equipamento = null) {
    modalContainer.id = previousModalId;
    modalContainer.innerHTML = previousModalContent;

    if (tipo === 'add') {
      inicializarListenersEquipamentoModal(modalContainer);
    } else if (tipo === 'edit') {
      inicializarListenersEditarEquipamentoModal(modalContainer, equipamento);
    }
  }

  // Use esta função no botão
  btnAdicionarEquipamento.addEventListener('click', abrirModalAdicionarEquipamento);

  function abrirModalAdicionarEquipamento() {
    loadModalStyle('/styles/forms/add-equipamento-modal.css');
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-add-equipamento-container';
    modalContainer.innerHTML = AddEquipamentoModal(clientes);
    document.body.appendChild(modalContainer);

    inicializarListenersEquipamentoModal(modalContainer);

  }

  function inicializarListenersEquipamentoModal(modalContainer) {
    initCustomSelect(modalContainer);

    const btnFechar = modalContainer.querySelector('#btn-fechar-modal');
    if (btnFechar) {
      btnFechar.addEventListener('click', () => {
        modalContainer.remove();
      });
    }

    let btnAdicionar = modalContainer.querySelector('#btn-adicionar');
    const form = modalContainer.querySelector('#form-adicionar-equipamento');

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

        const novoEquipamento = {
          tipoEquipamento: form.tipoEquipamento.value.trim(),
          numeroSerie: form.numeroSerie.value.trim(),
          modelo: form.modelo.value.trim(),
          marca: form.marca.value.trim(),
          imei: form.IMEI.value.trim(),
          comentarios: form.comentarios.value.trim(),
          clienteId: form.clienteId.value.trim(),
        };

        try {
          const res = await fetch('/backend/equipamentos.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoEquipamento)
          });

          if (!res.ok) {
            const errorData = await res.json();
            showToast('Erro ao adicionar equipamento: ' + (errorData.error || 'Erro desconhecido'), 'error');
            return;
          }

          const data = await res.json();
          if (data.success) {
            equipamentos.push(data.item);
            atualizarLista();
            modalContainer.remove();
            showToast('Equipamento adicionado com sucesso.', 'success');
          } else {
            showToast('Erro ao adicionar equipamento.', 'error');
          }
        } catch (error) {
          showToast('Erro ao adicionar equipamento: ' + error.message, 'error');
        }
      });
    }
  }


  function abrirModalEditarEquipamento(equipamento) {
    loadModalStyle('/styles/forms/edit-equipamento-modal.css');
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-edit-equipamento-container';
    modalContainer.innerHTML = EditEquipamentoModal(equipamento, clientes);

    // Salva o equipamento no container para referência futura
    modalContainer.equipamento = equipamento;

    document.body.appendChild(modalContainer);

    inicializarListenersEditarEquipamentoModal(modalContainer, equipamento);
  }

  function inicializarListenersEditarEquipamentoModal(modalContainer, equipamento) {
    initCustomSelect(modalContainer);

    const btnFechar = modalContainer.querySelector('#btn-fechar-modal');
    if (btnFechar) {
      btnFechar.onclick = () => modalContainer.remove();
    }

    let btnSalvar = modalContainer.querySelector('#btn-adicionar');
    const form = modalContainer.querySelector('#form-adicionar-equipamento');

    // Remove listeners antigos do botão
    if (btnSalvar) {
      const newBtn = btnSalvar.cloneNode(true);
      btnSalvar.parentNode.replaceChild(newBtn, btnSalvar);
      btnSalvar = newBtn;
    }

    if (btnSalvar && form) {
      btnSalvar.addEventListener('click', async () => {
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        const equipamentoAtualizado = {
          id: equipamento.id,
          tipoEquipamento: form.tipoEquipamento.value ? form.tipoEquipamento.value.trim() : equipamento.tipoEquipamento,
          numeroSerie: form.numeroSerie.value ? form.numeroSerie.value.trim() : equipamento.numeroSerie,
          modelo: form.modelo.value ? form.modelo.value.trim() : equipamento.modelo,
          marca: form.marca.value ? form.marca.value.trim() : equipamento.marca,
          imei: form.IMEI.value ? form.IMEI.value.trim() : equipamento.imei,
          comentarios: form.comentarios.value ? form.comentarios.value.trim() : equipamento.comentarios,
          clienteId: form.clienteId.value ? form.clienteId.value.trim() : equipamento.clienteId,
        };

        try {
          const res = await fetch('/backend/equipamentos.php', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(equipamentoAtualizado)
          });

          if (!res.ok) {
            const errorData = await res.json();
            showToast('Erro ao atualizar equipamento: ' + (errorData.error || 'Erro desconhecido'), 'error');
            return;
          }

          const data = await res.json();
          if (data.success) {
            const index = equipamentos.findIndex(e => e.id === equipamento.id);
            if (index !== -1) {
              equipamentos[index] = { ...equipamento, ...equipamentoAtualizado };
              atualizarLista();
            }
            modalContainer.remove();
            showToast('Equipamento atualizado com sucesso.', 'success');
          } else {
            showToast('Erro ao atualizar equipamento.', 'error');
          }
        } catch (error) {
          showToast('Erro ao atualizar equipamento: ' + error.message, 'error');
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

    const equipamento = equipamentos.find(e => e.id == id);
    if (!equipamento) {
      showToast('Equipamento não encontrado', 'error');
      return;
    }

    abrirModalEditarEquipamento(equipamento);
  });

  function abrirModalRemoverEquipamento(equipamento) {
    loadModalStyle('/styles/forms/remove-equipamento-modal.css');

    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-remove-equipamento-container';
    modalContainer.innerHTML = RemoveEquipamentoModal(equipamento.modelo);
    document.body.appendChild(modalContainer);

    const btnCancelar = modalContainer.querySelector('#btn-cancelar');
    const btnRemover = modalContainer.querySelector('#btn-remover');
    
    btnCancelar.addEventListener('click', () => {
      modalContainer.remove();
    });

    btnRemover.addEventListener('click', async () => {
      try {
        const res = await fetch('/backend/equipamentos.php', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: equipamento.id })
        });

        if (!res.ok) {
          const errorData = await res.json();
          showToast('Erro ao remover equipamento: ' + (errorData.error || 'Erro desconhecido'), 'error');
          return;
        }

        const data = await res.json();
        if (data.success) {
          const index = equipamentos.findIndex(e => e.id === equipamento.id);
          if (index !== -1) {
            equipamentos.splice(index, 1);
            atualizarLista();
          }
          modalContainer.remove();
          showToast('Equipamento removido com sucesso.', 'success');
        } else {
          showToast('Erro ao remover equipamento.', 'error');
        }
      } catch (error) {
        showToast('Erro ao remover equipamento: ' + error.message, 'error');
      }
    });
  }

  tbody.addEventListener('click', e => {
    const btn = e.target.closest('.btn-remover-equipamento');
    if (!btn) return;

    const tr = btn.closest('tr');
    if (!tr) return;

    const id = tr.getAttribute('data-id');
    if (!id) return;

    const equipamento = equipamentos.find(e => e.id == id);
    if (!equipamento) {
      showToast('Equipamento não encontrado', 'error');
      return;
    }

    abrirModalRemoverEquipamento(equipamento);
  });

  atualizarPaginacao();
}

export function openAddEquipamentoModal(equipamentos, onEquipamentoAdded, onModalClosed) {
  // Load modal style
  const linkHref = '/styles/forms/add-equipamento-modal.css';
  if (!document.querySelector(`link[href="${linkHref}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = linkHref;
    link.setAttribute('data-dynamic-style', 'true');
    document.head.appendChild(link);
  }

  const modalEquipamentoContainer = document.createElement('div');
  modalEquipamentoContainer.id = 'modal-add-equipamento-container';
  modalEquipamentoContainer.innerHTML = AddEquipamentoModal();
  document.body.appendChild(modalEquipamentoContainer);

  const btnFecharEquipamento = modalEquipamentoContainer.querySelector('#btn-fechar-modal');
  if (btnFecharEquipamento) {
    btnFecharEquipamento.addEventListener('click', () => {
      modalEquipamentoContainer.remove();
      if (typeof onModalClosed === 'function') {
        onModalClosed(); // Chama callback quando o modal é fechado
      }
    });
  }

  const btnAdicionarEquipamento = modalEquipamentoContainer.querySelector('#btn-adicionar');
  const formEquipamento = modalEquipamentoContainer.querySelector('#form-adicionar-equipamento');

  btnAdicionarEquipamento.addEventListener('click', async () => {
    if (!formEquipamento.checkValidity()) {
      formEquipamento.reportValidity();
      return;
    }

    const novoEquipamento = {
      tipoEquipamento: formEquipamento.tipoEquipamento.value.trim(),
      numeroSerie: formEquipamento.numeroSerie.value.trim(),
      modelo: formEquipamento.modelo.value.trim(),
      imei: form.IMEI.value.trim(),
    };

    try {
      const res = await fetch('/backend/clientes.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoEquipamento)
      });

      if (!res.ok) {
        const errorData = await res.json();
        showToast('Erro ao adicionar equipamento: ' + (errorData.error || 'Erro desconhecido'), 'error');
        return;
      }

      const data = await res.json();
      if (data.success) {
        equipamentos.push(data.item);
        modalEquipamentoContainer.remove();
        showToast('Equipamento adicionado com sucesso.', 'success');
        if (typeof onEquipamentoAdded === 'function') {
          onEquipamentoAdded(data.item);
        }
      } else {
        showToast('Erro ao adicionar equipamento.', 'error');
      }
    } catch (error) {
      showToast('Erro ao adicionar equipamento: ' + error.message, 'error');
    }
  });
}
