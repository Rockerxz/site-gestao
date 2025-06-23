// auth.js - usa sessões PHP com cookies
import { showToast } from '../components/toast.js';

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

export async function login(emailOrNome, password) {
  try {
    const res = await fetch('/backend/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // para receber cookie de sessão
      body: JSON.stringify({ email: emailOrNome, password })
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.success) {
      return data.user;
    }
    if (data.error === 'Este perfil está desativado') {
      showToast(data.error, 'error');
      return null;
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