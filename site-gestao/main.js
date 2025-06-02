import { Menu } from './components/menu.js';
import { LoginPage } from './pages/login.js';
import { TecnicosPage } from './pages/tecnicos.js';
import { login, logout, getCurrentUser } from './utils/auth.js';

const root = document.getElementById('site-gestao');

// Função para buscar técnicos do backend
async function fetchTecnicos() {
  try {
    const res = await fetch('/backend/tecnicos.php', { method: 'GET' });
    if (!res.ok) throw new Error('Erro ao buscar técnicos');
    const data = await res.json();
    return data.tecnicos || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Função para adicionar técnico via backend
async function addTecnico(nome, email) {
  try {
    const res = await fetch('/backend/tecnicos.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email })
    });
    if (!res.ok) throw new Error('Erro ao adicionar técnico');
    const data = await res.json();
    return data.success;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function render(page) {
  const user = getCurrentUser();
  root.innerHTML = Menu(user);

  // Monta conteúdo conforme página
  const nav = root.querySelector('nav');
  nav.addEventListener('click', e => {
    if(e.target.tagName === 'BUTTON' && e.target.dataset.page) {
      render(e.target.dataset.page);
    }
    if(e.target.id === 'logout-btn') {
      logout();
      render('login');
    }
  });

  let content = '';

  switch(page) {
    case 'login':
      content = LoginPage();
      break;

    case 'tecnicos':
      if(!user) return render('login');
      // Buscar técnicos via backend
      const tecnicosData = await fetchTecnicos();
      content = TecnicosPage(tecnicosData);
      break;

    case 'home':
      content = `<h1>Bem vindo ao Sistema</h1>`;
      break;

    default:
      content = `<h2>Página não encontrada</h2>`;
  }

  const divContent = document.createElement('div');
  divContent.innerHTML = content;
  root.appendChild(divContent);

  // Eventos pós-render
  if(page === 'login') {
    const form = root.querySelector('#login-form');
    const errDiv = root.querySelector('#login-error');
    form.onsubmit = e => {
      e.preventDefault();
      const email = form.email.value;
      const senha = form.senha.value;
      const u = login(email, senha);
      if(u) render('home');
      else errDiv.textContent = 'Credenciais inválidas';
    }
  }

  if(page === 'tecnicos') {
    const form = root.querySelector('#add-tecnico-form');
    form.onsubmit = async e => {
      e.preventDefault();
      const nome = form.nome.value.trim();
      const email = form.email.value.trim();
      if(nome && email) {
        const sucesso = await addTecnico(nome, email);
        if(sucesso) {
          render('tecnicos'); // Re-renderiza com dados atualizados
        } else {
          alert('Erro ao adicionar técnico. Tente novamente.');
        }
      }
    }
  }
}

// Começa no login ou home se estiver logado
if(getCurrentUser()) render('home');
else render('login');
