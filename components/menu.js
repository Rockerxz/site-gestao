// Barra superior de menu atualizada
export function Menu(user, currentPage) {
  return `
    <nav class="navbar">
      <button id="home-btn" data-page="dashboard" class="home-btn">
        Telemonteredondo Sistema de Gestão
      </button>
      ${
        user
          ? `<button class="user-btn">
              <i class="fa-solid fa-user"></i> <span class="user-name">${user.nome}</span>
            </button>`
          : ``
      }
    </nav>
  `;
}
