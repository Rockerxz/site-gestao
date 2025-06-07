// Barra superior de menu
export function Menu(user) {
  // user = { nome, perfil }
  return `
  <nav>
    <button data-page="home">Início</button>
    ${user ? `
      <button data-page="tecnicos">Gestão Técnicos</button>
      <button data-page="equipamentos">Gestão Equipamentos</button>
      <button data-page="reparacoes">Gestão Reparações</button>
      <button data-page="clientes">Gestão Clientes</button>
      <button data-page="config">Configurações</button>
      <button id="logout-btn">Sair (${user.nome})</button>
    ` : `
      <button data-page="login">Login</button>
    `}
  </nav>
  `;
}
