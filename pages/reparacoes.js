export function ReparacoesPage(reparacoes = []) {
  // reparacoes = array de objetos com pelo menos { id, categoria, descricao, ... }

  // Categorias únicas para filtro dropdown
  const categorias = Array.from(new Set(reparacoes.map(r => r.categoria))).sort();

  return `
    <section class="reparacoes-page">
      <h1>Reparações</h1>
      <button id="btn-criar-reparacao" class="btn-primary" type="button">Criar Ficha de Reparação</button>

      <div class="filtros">
        <label for="filtro-categoria">Filtrar por categoria:</label>
        <select id="filtro-categoria">
          <option value="">Todas</option>
          ${categorias.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
        </select>

        <label for="barra-pesquisa" style="margin-left: 1rem;">Pesquisar:</label>
        <input type="search" id="barra-pesquisa" placeholder="Pesquisar reparações...">
      </div>

      <div id="lista-reparacoes" class="lista-reparacoes">
        ${renderLista(reparacoes)}
      </div>
    </section>
  `;
}

// Função auxiliar para renderizar a lista de reparações (limite 20 itens)
function renderLista(items) {
  const limit = 20;
  if (items.length === 0) {
    return `<p>Nenhuma reparação encontrada.</p>`;
  }
  const slice = items.slice(0, limit);
  return `
    <ul>
      ${slice.map(r => `
        <li class="reparacao-item" data-id="${r.id}">
          <strong>${r.categoria}</strong> - ${r.descricao || '(sem descrição)'}
        </li>
      `).join('')}
    </ul>
    ${items.length > limit ? `<p>Mostrando os primeiros ${limit} resultados.</p>` : ''}
  `;
}

// Exporta também uma função para adicionar os event listeners e lógica de filtro/pesquisa
export function setupReparacoesPageListeners() {
  const filtroCategoria = document.getElementById('filtro-categoria');
  const barraPesquisa = document.getElementById('barra-pesquisa');
  const listaContainer = document.getElementById('lista-reparacoes');

  if (!filtroCategoria || !barraPesquisa || !listaContainer) return;

  // Guardar dados originais para filtrar localmente
  let dadosOriginais = [];

  // Função para atualizar a lista com base nos filtros
  function atualizarLista() {
    const categoriaSelecionada = filtroCategoria.value.trim().toLowerCase();
    const termoPesquisa = barraPesquisa.value.trim().toLowerCase();

    let filtrados = dadosOriginais;

    if (categoriaSelecionada) {
      filtrados = filtrados.filter(r => r.categoria.toLowerCase() === categoriaSelecionada);
    }
    if (termoPesquisa) {
      filtrados = filtrados.filter(r =>
        (r.descricao && r.descricao.toLowerCase().includes(termoPesquisa)) ||
        (r.categoria && r.categoria.toLowerCase().includes(termoPesquisa))
      );
    }

    listaContainer.innerHTML = renderLista(filtrados);
  }

  // Inicializa dadosOriginais a partir do conteúdo atual da lista (extraindo dataset)
  // Como a lista é renderizada no HTML, precisamos que o código que chama setupReparacoesPageListeners
  // passe os dados para esta função para setar dadosOriginais.
  // Para isso, vamos expor uma função para setar os dados:

  setupReparacoesPageListeners.setDados = function(dados) {
    dadosOriginais = dados || [];
    atualizarLista();
  };

  filtroCategoria.addEventListener('change', atualizarLista);
  barraPesquisa.addEventListener('input', atualizarLista);
}