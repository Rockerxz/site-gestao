import { Menu } from './components/menu.js';
import { MenuLateral } from './components/menu-lateral.js';
import { LoginPage } from './pages/login.js';
import { TecnicosPage } from './pages/tecnicos.js';
import { DashboardPage } from './pages/dashboard.js';
import { ReparacoesPage, setupReparacoesPageListeners } from './pages/reparacoes.js';
import { ClientesPage, setupClientesPageListeners } from './pages/clientes.js';
import { UsersPage, setupUsersPageListeners } from './pages/utilizadores.js';
import { DefinicoesUserPage } from './pages/definicoes-user.js';
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

// Add this function to fetch utilizadores data
async function fetchUtilizadores() {
  try {
    const res = await fetch('/backend/utilizadores.php', { method: 'GET', credentials: 'include' });
    if (!res.ok) throw new Error('Erro ao buscar utilizadores');
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

async function render(page) {

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
    // Add event listener for user-btn toggle submenu
    const userBtn = lateralMenuContainer.querySelector('#user-btn');
    const userSubmenu = lateralMenuContainer.querySelector('#user-submenu');

    if (userBtn && userSubmenu) {
      userBtn.onclick = e => {
        e.stopPropagation();
        const isVisible = userSubmenu.style.display === 'flex' || userSubmenu.style.display === 'block';
        userSubmenu.style.display = isVisible ? 'none' : 'flex';
      };

      // Close submenu if click outside
      document.addEventListener('click', () => {
        if (userSubmenu.style.display !== 'none') {
          userSubmenu.style.display = 'none';
        }
      });
    }

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

  // Remove any previously loaded page or modal styles
  const loadedStyles = document.querySelectorAll('link[data-dynamic-style="true"]');
  loadedStyles.forEach(link => link.remove());

  // Helper to load a CSS file dynamically with data attribute
  function loadStyle(href) {
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.setAttribute('data-dynamic-style', 'true');
      document.head.appendChild(link);
    }
  }

  // Load page-specific style
  // Map page names to their CSS files in /styles/
  const pageStyles = {
    'clientes': '/styles/pagina-clientes.css',
    'dashboard': '/styles/pagina-dashboard.css',
    'tecnicos': '/styles/pagina-tecnicos.css',
    'reparacoes': '/styles/pagina-reparacoes.css',
    'utilizadores': '/styles/pagina-utilizadores.css',
    'definicoes-user': '/styles/definicoes-user.css',
  };

  if (pageStyles[page]) {
    loadStyle(pageStyles[page]);
  }


  let content = '';
  let clientesData = null;
  let reparacoesData = null;
  let tecnicosData = null;
  let utilizadoresData = null;

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

    case 'utilizadores':
      if (!currentUser) return render('login');
      utilizadoresData = await fetchUtilizadores();
      if (thisRender.cancelled) return;
      content = UsersPage(utilizadoresData);
      break;
    
    case 'definicoes-user':
      if (!currentUser) return render('login');
      content = DefinicoesUserPage(currentUser);
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
      const password = form.password.value;
      const u = await login(email, password);
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

  if (page === 'utilizadores') {
    setupUsersPageListeners(utilizadoresData);
  }
}

render('login');