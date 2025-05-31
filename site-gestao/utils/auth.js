const USERS = [
  { id:1, nome:'Admin', email:'admin@empresa.com', senha:'1234', perfil:'superuser' },
  { id:2, nome:'Técnico 1', email:'tecnico1@empresa.com', senha:'abcd', perfil:'tecnico' }
];

// Salva usuário no localStorage para simular sessão
export function login(email, senha) {
  const user = USERS.find(u => u.email === email && u.senha === senha);
  if(user) {
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }
  return null;
}

export function logout() {
  localStorage.removeItem('user');
}

export function getCurrentUser() {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
}
