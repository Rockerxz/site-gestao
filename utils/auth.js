// auth.js - sem localStorage, usa sessões PHP com cookies

// Verifica se a sessão está ativa no backend
export async function checkSession() {
  try {
    const res = await fetch('/backend/auth_check.php', {
      method: 'GET',
      credentials: 'include' // envia cookies de sessão
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.authenticated) {
      return data.user; // retorna dados do utilizador
    }
    return null;
  } catch {
    return null;
  }
}

export async function login(emailOrNome, senha) {
  try {
    const res = await fetch('/backend/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // para receber cookie de sessão
      body: JSON.stringify({ email: emailOrNome, senha })
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.success) {
      return data.user;
    }
    return null;
  } catch {
    return null;
  }
}

export async function logout() {
  try {
    await fetch('/backend/logout.php', {
      method: 'POST',
      credentials: 'include'
    });
  } catch {}
}