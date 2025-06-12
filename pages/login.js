export function LoginPage() {
  return `
    <div class="login-page-wrapper">
      <h1 class="site-title">
        <span class="main-title">Telemonteredondo</span>
        <span class="sub-title">Sistema de Gestão</span>
      </h1>
      <section class="login-container">
        <form id="login-form">
          <h2 class="login-heading">Inicie sessão</h2>
          
          <input type="text" id="email" name="email" placeholder="Email / Nome de utilizador" required>
          <input type="password" id="senha" name="senha" placeholder="Palavra-passe" required>
          
          <button type="submit">Entrar</button>
          <div id="login-error"></div>
        </form>
      </section>
    </div>
  `;
}


