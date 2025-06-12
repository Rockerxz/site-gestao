// Barra superior de menu
export function Menu(user, currentPage) {
  // user = { nome, perfil }
  return `
    <nav>
      ${
        user && currentPage !== 'login'
          ? `
            <button data-page="dashboard">Dashboard</button>
            <button data-page="tecnicos">Gestão Técnicos</button>
            <button data-page="equipamentos">Gestão Equipamentos</button>
            <button data-page="reparacoes">Gestão Reparações</button>
            <button data-page="clientes">Gestão Clientes</button>
            <button data-page="config">Configurações</button>
            <button id="logout-btn">Sair (${user.nome})</button>
          `
          : ``
      }
    </nav>
  `;
}
