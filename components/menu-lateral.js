export function MenuLateral(user, currentPage) {
  // user = { nome, perfil }
  // currentPage = string com o nome da página atual
  return `
    <aside class="menu-lateral">
      ${
        user && currentPage !== 'login'
          ? `
            <button class="user-btn" title="${user.nome}">
              <i class="fa-solid fa-user"></i><span class="btn-text" style="margin-left: 0.5rem;">${user.nome}</span>
            </button>
            <button data-page="dashboard" title="Painel Geral">
              <i class="fa-solid fa-house"></i><span class="btn-text" style="margin-left: 0.5rem;">Painel Geral</span>
            </button>
            <button data-page="tecnicos" title="Gestão Técnicos">
              <i class="fa-solid fa-user"></i><span class="btn-text" style="margin-left: 0.5rem;">Gestão Técnicos</span>
            </button>
            <button data-page="equipamentos" title="Gestão Equipamentos">
              <i class="fa-solid fa-computer"></i><span class="btn-text" style="margin-left: 0.5rem;">Gestão Equipamentos</span>
            </button>
            <button data-page="reparacoes" title="Gestão Reparações">
              <i class="fa-solid fa-screwdriver-wrench"></i><span class="btn-text" style="margin-left: 0.5rem;">Gestão Reparações</span>
            </button>
            <button data-page="clientes" title="Gestão Clientes">
              <i class="fa-solid fa-user-group"></i><span class="btn-text" style="margin-left: 0.5rem;">Gestão Clientes</span>
            </button>
            <button data-page="config" title="Configurações">
              <i class="fa-solid fa-gear"></i><span class="btn-text" style="margin-left: 0.5rem;">Configurações</span>
            </button>
            <button id="logout-btn" title="Sair (${user.nome})">
              <i class="fa-solid fa-right-from-bracket"></i><span class="btn-text" style="margin-left: 0.5rem;">Sair (${user.nome})</span>
            </button>
          `
          : ``
      }
    </aside>
  `;
}