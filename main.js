import { Menu } from './components/menu.js';
import { MenuLateral } from './components/menu-lateral.js';
import { LoginPage } from './pages/login.js';
import { TecnicosPage } from './pages/tecnicos.js';
import { DashboardPage } from './pages/dashboard.js';
import { ReparacoesPage, setupReparacoesPageListeners } from './pages/reparacoes.js';
import { ClientesPage, setupClientesPageListeners } from './pages/clientes.js';
import { login, logout, checkSession } from './utils/auth.js';

const menuContainer = document.getElementById('menu');
const conteudoContainer = document.getElementById('conteudo');

let currentUser = null;
let inactivityTimeout = null;
let sessionCheckInterval = null;
const SESSION_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutos
const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutos

function resetInactivityTimer() {
  if (!currentUser) return;
  if (inactivityTimeout) clearTimeout(inactivityTimeout);
  inactivityTimeout = setTimeout(() => {
    alert('Sessão expirada por inatividade.');
    doLogout();
  }, INACTIVITY_LIMIT);
}

function setupActivityListeners() {
  if (!currentUser) return;
  ['click', 'keydown', 'mousemove', 'scroll'].forEach(evt => {
    window.addEventListener(evt, activityHandler);
  });
}

function removeActivityListeners() {
  ['click', 'keydown', 'mousemove', 'scroll'].forEach(evt => {
    window.removeEventListener(evt, activityHandler);
  });
}

function activityHandler() {
  resetInactivityTimer();
  renewSession();
}

let renewSessionTimeout = null;
async function renewSession() {
  if (!currentUser) return;
  if (renewSessionTimeout) return;
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

async function fetchReparacoes() {
  try {
    const res = await fetch('/backend/reparacoes.php', { method: 'GET', credentials: 'include' });
    if (!res.ok) throw new Error('Erro ao buscar reparações');
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchClientes() {
  try {
    const res = await fetch('/backend/clientes.php', { method: 'GET', credentials: 'include' });
    if (!res.ok) throw new Error('Erro ao buscar clientes');
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
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

function carregarEstilo(href) {
  if (!document.querySelector(`link[href="${href}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }
}

async function render(page) {
  switch (page) {
    case 'clientes':
      carregarEstilo('/styles/pagina-clientes.css');
      break;
    case 'dashboard':
      carregarEstilo('/styles/pagina-dashboard.css');
      break;
    case 'tecnicos':
      carregarEstilo('/styles/pagina-tecnicos.css');
      break;
    case 'reparacoes':
      carregarEstilo('/styles/pagina-reparacoes.css');
      break;
    default:
      // Nenhum estilo específico
  }
  
  if (render.currentRender) {
    render.currentRender.cancelled = true;
  }
  const thisRender = { cancelled: false };
  render.currentRender = thisRender;

  if (currentUser === null) {
    currentUser = await checkSession();
  }

  if (!currentUser && page !== 'login') {
    page = 'login';
  }

  if (currentUser && page === 'login') {
    page = 'dashboard';
  }

  if (thisRender.cancelled) return;

  document.body.className = `pagina-${page}`;

  menuContainer.innerHTML = (page === 'login' && !currentUser) ? '' : Menu(currentUser, page);

  const lateralMenuContainer = document.getElementById('menu-lateral');
  if (lateralMenuContainer) {
    lateralMenuContainer.innerHTML = (page === 'login' && !currentUser) ? '' : MenuLateral(currentUser, page);
  }

  if (menuContainer) {
    menuContainer.onclick = e => {
      let target = e.target;
      while (target && target !== menuContainer && target.tagName !== 'BUTTON') {
        target = target.parentElement;
      }
      if (target && target.tagName === 'BUTTON') {
        e.preventDefault();
        if (target.dataset.page) {
          render(target.dataset.page);
        } else if (target.id === 'logout-btn') {
          doLogout();
        }
      }
    };
  }

  if (lateralMenuContainer) {
    lateralMenuContainer.onclick = e => {
      let target = e.target;
      while (target && target !== lateralMenuContainer && target.tagName !== 'BUTTON') {
        target = target.parentElement;
      }
      if (target && target.tagName === 'BUTTON') {
        e.preventDefault();
        if (target.dataset.page) {
          render(target.dataset.page);
        } else if (target.id === 'logout-btn') {
          doLogout();
        }
      }
    };
  }

  let content = '';
  let clientesData = null;
  let reparacoesData = null;
  let tecnicosData = null;

  switch (page) {
    case 'login':
      content = LoginPage();
      break;

    case 'dashboard':
      content = DashboardPage(currentUser);
      break;

    case 'tecnicos':
      if (!currentUser) return render('login');
      tecnicosData = await fetchTecnicos();
      if (thisRender.cancelled) return;
      content = TecnicosPage(tecnicosData);
      break;

    case 'reparacoes':
      if (!currentUser) return render('login');
      reparacoesData = await fetchReparacoes();
      if (thisRender.cancelled) return;
      content = ReparacoesPage(reparacoesData);
      break;

    case 'clientes':
      if (!currentUser) return render('login');
      clientesData = await fetchClientes();
      if (thisRender.cancelled) return;
      content = ClientesPage(clientesData);
      break;

    default:
      content = `<h2>Página não encontrada</h2>`;
  }

  if (thisRender.cancelled) return;

  conteudoContainer.innerHTML = '';
  const divContent = document.createElement('div');
  divContent.innerHTML = content;
  conteudoContainer.appendChild(divContent);

  if (page === 'login') {
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

  if (page === 'reparacoes') {
    setupReparacoesPageListeners();
    setupReparacoesPageListeners.setDados(reparacoesData);
  }

  if (page === 'clientes') {
    setupClientesPageListeners(clientesData);
  }
}

render('login');