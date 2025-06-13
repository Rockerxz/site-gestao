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
              <i class="fa-solid fa-circle-user" style="margin-right: 0.5rem;"></i>${user.nome}
            </button>`
          : ``
      }
    </nav>
  `;
}

