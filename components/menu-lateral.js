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
            <div class="nav-section-title">NAVEGAÇÃO PRINCIPAL</div>
            <button data-page="dashboard" title="Painel Geral" class="nav-btn">
              <i class="fa-solid fa-house"></i><span class="btn-text" style="margin-left: 0.5rem;">Painel Geral</span>
            </button>
            <button data-page="reparacoes" title="Reparações" class="nav-btn">
              <i class="fa-solid fa-screwdriver-wrench"></i><span class="btn-text" style="margin-left: 0.5rem;">Reparações</span>
            </button>
            <button data-page="tecnicos" title="Técnicos" class="nav-btn">
              <i class="fa-solid fa-user-group"></i></i><span class="btn-text" style="margin-left: 0.5rem;">Técnicos</span>
            </button>
            <button data-page="equipamentos" title="Equipamentos" class="nav-btn">
              <i class="fa-solid fa-computer"></i><span class="btn-text" style="margin-left: 0.5rem;">Equipamentos</span>
            </button>
            <button data-page="clientes" title="Clientes" class="nav-btn">
              <i class="fa-solid fa-user-group"></i><span class="btn-text" style="margin-left: 0.5rem;">Clientes</span>
            </button>
            <button data-page="config" title="Configurações" class="nav-btn">
              <i class="fa-solid fa-gear"></i><span class="btn-text" style="margin-left: 0.5rem;">Configurações</span>
            </button>
            <button data-page="users" title="Utilizadores" class="nav-btn">
              <i class="fa-solid fa-users-gear"></i><span class="btn-text" style="margin-left: 0.5rem;">Utilizadores</span>
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