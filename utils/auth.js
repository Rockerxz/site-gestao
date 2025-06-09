export async function login(email, senha) {
  const res = await fetch('/backend/login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (data.success) {
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  }
  return null;
}

export function logout() {
  fetch('/backend/logout.php', { method: 'POST' });
  localStorage.removeItem('user');
}

export function getCurrentUser() {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
}