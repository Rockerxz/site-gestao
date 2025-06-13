export function MenuLateral(user, currentPage) {
  // user = { nome, perfil }
  // currentPage = string com o nome da página atual
  return `
    <aside class="menu-lateral">
      ${
        user && currentPage !== 'login'
          ? `
            <button class="user-btn" style="cursor: default; margin-bottom: 20px;">
              <i class="fa-solid fa-circle-user" style="margin-right: 0.5rem;"></i>${user.nome}
            </button>
            <button data-page="dashboard">Painel Geral</button>
            <button data-page="tecnicos">Gestão Técnicos</button>
            <button data-page="equipamentos">Gestão Equipamentos</button>
            <button data-page="reparacoes">Gestão Reparações</button>
            <button data-page="clientes">Gestão Clientes</button>
            <button data-page="config">Configurações</button>
            <button id="logout-btn">Sair (${user.nome})</button>
          `
          : ``
      }
    </aside>
  `;
}