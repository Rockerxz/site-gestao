import { Menu } from './components/menu.js';
import { MenuLateral } from './components/menu-lateral.js';
import { LoginPage } from './pages/login.js';
import { TecnicosPage } from './pages/tecnicos.js';
import { DashboardPage } from './pages/dashboard.js';
import { login, logout, checkSession } from './utils/auth.js';

const menuContainer = document.getElementById('menu');
const conteudoContainer = document.getElementById('conteudo');

let currentUser = null;
let inactivityTimeout = null;
let sessionCheckInterval = null;
const SESSION_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutos
const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutos

// Função para resetar o temporizador de inatividade
function resetInactivityTimer() {
  if (!currentUser) return; // só funciona se autenticado
  if (inactivityTimeout) clearTimeout(inactivityTimeout);
  inactivityTimeout = setTimeout(() => {
    alert('Sessão expirada por inatividade.');
    doLogout();
  }, INACTIVITY_LIMIT);
}

// Função para monitorar atividade do utilizador e renovar sessão
function setupActivityListeners() {
  if (!currentUser) return; // só funciona se autenticado
  ['click', 'keydown', 'mousemove', 'scroll'].forEach(evt => {
    window.addEventListener(evt, activityHandler);
  });
}

// Remove listeners de atividade
function removeActivityListeners() {
  ['click', 'keydown', 'mousemove', 'scroll'].forEach(evt => {
    window.removeEventListener(evt, activityHandler);
  });
}

function activityHandler() {
  resetInactivityTimer();
  renewSession();
}

// Renova sessão no backend (chamada para manter sessão viva)
let renewSessionTimeout = null;
async function renewSession() {
  if (!currentUser) return; // só funciona se autenticado
  if (renewSessionTimeout) return; // evita chamadas muito frequentes
  renewSessionTimeout = setTimeout(async () => {
    renewSessionTimeout = null;
    const user = await checkSession();
    if (!user) {
      alert('Sessão expirada.');
      doLogout();
    } else {
      currentUser = user;
    }
  }, 1000);
}

async function fetchTecnicos() {
  try {
    const res = await fetch('/backend/tecnicos.php', { method: 'GET', credentials: 'include' });
    if (!res.ok) throw new Error('Erro ao buscar técnicos');
    const data = await res.json();
    return data.tecnicos || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function addTecnico(nome, email) {
  try {
    const res = await fetch('/backend/tecnicos.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
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

async function doLogout() {
  removeActivityListeners();
  if (inactivityTimeout) clearTimeout(inactivityTimeout);
  if (sessionCheckInterval) {
    clearInterval(sessionCheckInterval);
    sessionCheckInterval = null;
  }
  await logout();
  currentUser = null;
  render('login');
}

async function render(page) {
  // Se currentUser não definido, verifica sessão no backend
  if (currentUser === null) {
    currentUser = await checkSession();
  }

  // Se não estiver autenticado e não estiver na página de login, redireciona para login
  if (!currentUser && page !== 'login') {
    page = 'login';
  }

  // Se estiver autenticado e tentar ir para login, redireciona para dashboard
  if (currentUser && page === 'login') {
    page = 'dashboard';
  }

  document.body.className = `pagina-${page}`;

  // Renderiza o menu, passando a página atual para ocultar menu na página login
  menuContainer.innerHTML = (page === 'login' && !currentUser) ? '' : Menu(currentUser, page);

  // Renderiza o menu lateral
  const lateralMenuContainer = document.getElementById('menu-lateral');
  if (lateralMenuContainer) {
    lateralMenuContainer.innerHTML = (page === 'login' && !currentUser) ? '' : MenuLateral(currentUser, page);
  }

  // Adiciona eventos de navegação
  const nav = menuContainer.querySelector('nav');
  if (nav) {
    nav.addEventListener('click', e => {
      if (e.target.tagName === 'BUTTON' && e.target.dataset.page) {
        render(e.target.dataset.page);
      }
      if (e.target.id === 'logout-btn') {
        doLogout();
      }
    });
  }

  // Adiciona eventos de navegação e logout no menu lateral
  if (lateralMenuContainer) {
    lateralMenuContainer.addEventListener('click', e => {
      if (e.target.tagName === 'BUTTON' && e.target.dataset.page) {
        render(e.target.dataset.page);
      }
      if (e.target.id === 'logout-btn') {
        doLogout();
      }
    });
  }

  // Conteúdo principal
  let content = '';

  switch (page) {
    case 'login':
      content = LoginPage();
      break;

    case 'dashboard':
      content = DashboardPage(currentUser);
      break;

    case 'tecnicos':
      if (!currentUser) return render('login');
      const tecnicosData = await fetchTecnicos();
      content = TecnicosPage(tecnicosData);
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
    // Limpa timers e listeners para login
    removeActivityListeners();
    if (inactivityTimeout) clearTimeout(inactivityTimeout);
    if (sessionCheckInterval) {
      clearInterval(sessionCheckInterval);
      sessionCheckInterval = null;
    }

    const form = conteudoContainer.querySelector('#login-form');
    const errDiv = conteudoContainer.querySelector('#login-error');
    form.onsubmit = async e => {
      e.preventDefault();
      const email = form.email.value;
      const senha = form.senha.value;
      const u = await login(email, senha);
      if (u) {
        currentUser = u;
        resetInactivityTimer();
        setupActivityListeners();
        // Inicia verificação periódica da sessão
        if (!sessionCheckInterval) {
          sessionCheckInterval = setInterval(async () => {
            const user = await checkSession();
            if (!user) {
              alert('Sessão expirada.');
              doLogout();
            } else {
              currentUser = user;
            }
          }, SESSION_CHECK_INTERVAL);
        }
        render('dashboard');
      } else {
        errDiv.textContent = 'Credenciais inválidas';
      }
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
render('login');