export function LoginPage() {
  return `
    <div class="login-page-wrapper">
      <h1 class="site-title">Site Gestão</h1>
      <section class="login-container">
        <form id="login-form">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required />
          
          <label for="senha">Senha:</label>
          <input type="password" id="senha" name="senha" required />
          
          <button type="submit">Entrar</button>
        </form>
        <div id="login-error"></div>
      </section>
    </div>
  `;
}
