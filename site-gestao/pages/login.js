export function LoginPage() {
  return `
    <section>
      <h2>Login</h2>
      <form id="login-form">
        <label>Email:<br><input type="email" name="email" required /></label><br>
        <label>Senha:<br><input type="password" name="senha" required /></label><br>
        <button type="submit">Entrar</button>
      </form>
      <div id="login-error" style="color:red;"></div>
    </section>
  `;
}
