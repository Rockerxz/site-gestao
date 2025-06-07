import { Menu } from './components/menu.js';
import { LoginPage } from './pages/login.js';
import { TecnicosPage } from './pages/tecnicos.js';
import { login, logout, getCurrentUser } from './utils/auth.js';

const menuContainer = document.getElementById('menu');
const conteudoContainer = document.getElementById('conteudo');

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

  // Renderiza o menu
  menuContainer.innerHTML = Menu(user);

  // Adiciona eventos de navegação
  const nav = menuContainer.querySelector('nav');
  nav.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON' && e.target.dataset.page) {
      render(e.target.dataset.page);
    }
    if (e.target.id === 'logout-btn') {
      logout();
      render('login');
    }
  });

  // Conteúdo principal
  let content = '';

  switch (page) {
    case 'login':
      content = LoginPage();
      break;

    case 'tecnicos':
      if (!user) return render('login');
      const tecnicosData = await fetchTecnicos();
      content = TecnicosPage(tecnicosData);
      break;

    case 'home':
      content = `<h1>Bem-vindo ao Sistema</h1>`;
      break;

    default:
      content = `<h2>Página não encontrada</h2>`;
  }

  // Renderiza o conteúdo
  conteudoContainer.innerHTML = '';
  const divContent = document.createElement('div');
  divContent.innerHTML = content;
  conteudoContainer.appendChild(divContent);

  // Eventos pós-render
  if (page === 'login') {
    const form = conteudoContainer.querySelector('#login-form');
    const errDiv = conteudoContainer.querySelector('#login-error');
    form.onsubmit = e => {
      e.preventDefault();
      const email = form.email.value;
      const senha = form.senha.value;
      const u = login(email, senha);
      if (u) render('home');
      else errDiv.textContent = 'Credenciais inválidas';
    };
  }

  if (page === 'tecnicos') {
    const form = conteudoContainer.querySelector('#add-tecnico-form');
    form.onsubmit = async e => {
      e.preventDefault();
      const nome = form.nome.value.trim();
      const email = form.email.value.trim();
      if (nome && email) {
        const sucesso = await addTecnico(nome, email);
        if (sucesso) {
          render('tecnicos');
        } else {
          alert('Erro ao adicionar técnico. Tente novamente.');
        }
      }
    };
  }
}

// Inicialização
if (getCurrentUser()) render('home');
else render('login');

function dobrar(numero) {
  return numero * 2;
}