export function MenuLateral(user, currentPage) {
  // user = { nome, perfil }
  // currentPage = string com o nome da página atual

  // Define quais páginas mostrar no menu lateral dependendo do perfil
  const isAdmin = user && user.perfil === 'Admin';
  const isTecnicoOuAtendimento = user && (user.perfil === 'Técnico' || user.perfil === 'Atendimento');

  return `
    <aside class="menu-lateral">
      ${
        user && currentPage !== 'login'
          ? `
            <div class="user-menu-wrapper">
              <button class="user-btn" title="${user.nome}" id="user-btn">
                <i class="fa-solid fa-user"></i><span class="btn-text" style="margin-left: 0.5rem;">${user.nome}</span>
                <i class="fa-solid fa-caret-down" style="margin-left: auto;"></i>
              </button>
              <div class="user-submenu" id="user-submenu" style="display:none;">
                <button data-page="definicoes-user" class="submenu-btn">Alterar credenciais</button>
                <button id="logout-btn" class="submenu-btn">Terminar sessão</button>
              </div>
            </div>
            <div class="nav-section-title">NAVEGAÇÃO PRINCIPAL</div>
            <button data-page="dashboard" title="Painel Geral" class="nav-btn">
              <i class="fa-solid fa-house"></i><span class="btn-text" style="margin-left: 0.5rem;">Painel Geral</span>
            </button>
            <button data-page="reparacoes" title="Reparações" class="nav-btn">
              <i class="fa-solid fa-screwdriver-wrench"></i><span class="btn-text" style="margin-left: 0.5rem;">Reparações</span>
            </button>
            <button data-page="equipamentos" title="Equipamentos" class="nav-btn">
              <i class="fa-solid fa-computer"></i><span class="btn-text" style="margin-left: 0.5rem;">Equipamentos</span>
            </button>
            <button data-page="clientes" title="Clientes" class="nav-btn">
              <i class="fa-solid fa-user-group"></i><span class="btn-text" style="margin-left: 0.5rem;">Clientes</span>
            </button>
            ${
              isAdmin
                ? `
                  <button data-page="profissionais" title="Profissionais" class="nav-btn">
                    <i class="fa-solid fa-user-gear"></i><span class="btn-text" style="margin-left: 0.5rem;">Profissionais</span>
                  </button>
                  <button data-page="utilizadores" title="Utilizadores" class="nav-btn">
                    <i class="fa-solid fa-users-gear"></i><span class="btn-text" style="margin-left: 0.5rem;">Utilizadores</span>
                  </button>
                `
                : ''
            }
          `
          : ``
      }
    </aside>
  `;
}