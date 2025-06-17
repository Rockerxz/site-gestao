export function ClientesPage(clientes = []) {
  // clientes = array de objetos com { id, nome, empresa, endereco, email, telefone, totalReparacoes }

  return `
    <section class="clientes-page">
      <h1>Clientes</h1>
      <button id="btn-adicionar-cliente" class="btn-primary" type="button">
       <i class="fa-solid fa-circle-plus"></i>Adicionar Cliente</button>

      <div class="clientes-container">
        <div class="pesquisa-clientes">
          <label for="barra-pesquisa-clientes">Pesquisar:</label>
          <input type="search" id="barra-pesquisa-clientes" aria-label="Pesquisar clientes">
        </div>

        <table class="clientes-tabela" aria-label="Lista de clientes">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Empresa</th>
              <th>Endereço</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Total de Reparações</th>
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
      <td>${c.totalReparacoes ?? 0}</td>
      <td class="acoes-coluna">
        <button class="btn-editar" type="button" title="Editar">Editar</button>
        <button class="btn-remover" type="button" title="Remover">Remover</button>
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

  if (!inputPesquisa || !tbody || !btnAnterior || !btnSeguinte || !btnPaginaAtual || !feedback) return;

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

    btnAnterior.disabled = paginaAtual === 1;
    btnSeguinte.disabled = paginaAtual === totalPaginas;
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
  

  // Inicializa lista
  atualizarPaginacao();
}
