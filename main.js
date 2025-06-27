import { Menu } from './components/menu.js';
import { MenuLateral } from './components/menu-lateral.js';
import { showToast } from './components/toast.js';
import { LoginPage } from './pages/login.js';
import { ProfissionaisPage, setupProfissionaisPageListeners } from './pages/profissionais.js';
import { DashboardPage } from './pages/dashboard.js';
import { EquipamentosPage, setupEquipamentosPageListeners } from './pages/equipamentos.js';
import { ReparacoesPage, setupReparacoesPageListeners } from './pages/reparacoes.js';
import { ClientesPage, setupClientesPageListeners } from './pages/clientes.js';
import { UsersPage, setupUsersPageListeners } from './pages/utilizadores.js';
import { DefinicoesUserPage, setupDefinicoesUserListeners} from './pages/definicoes-user.js';
import { login, logout, checkSession } from './utils/auth.js';

const menuContainer = document.getElementById('menu');
const conteudoContainer = document.getElementById('conteudo');

let currentUser = null;
let inactivityTimeout = null;
let sessionCheckInterval = null;
const SESSION_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutos
const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutos

// Variáveis para controle de tentativas falhadas
let failedLoginAttempts = 0;
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MS = 60 * 1000; // 1 minuto
let lockTimeout = null;

function resetInactivityTimer() {
  if (!currentUser) return;
  if (inactivityTimeout) clearTimeout(inactivityTimeout);
  inactivityTimeout = setTimeout(() => {
    showToast('Sessão expirada por inatividade.', 'warning');
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
      showToast('Sessão expirada.', 'warning');
      doLogout();
    } else {
      currentUser = user;
    }
  }, 1000);
}


async function fetchReparacoes() {
  try {
    const res = await fetch('/backend/reparacoes.php', { method: 'GET', credentials: 'include' });
    if (!res.ok) throw new Error('Erro ao buscar equipamentos');
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchEquipamentos() {
  try {
    const res = await fetch('/backend/equipamentos.php', { method: 'GET', credentials: 'include' });
    if (!res.ok) throw new Error('Erro ao buscar equipamentos');
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchProfissionais() {
  try {
    const res = await fetch('/backend/profissionais.php', { method: 'GET', credentials: 'include' });
    if (!res.ok) throw new Error('Erro ao buscar técnicos');
    const data = await res.json();
    return Array.isArray(data) ? data : [];
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
    'clientes': '/styles/pages/pagina-clientes.css',
    'dashboard': '/styles/pages/dashboard.css',
    'profissionais': '/styles/pages/pagina-profissionais.css',
    'reparacoes': '/styles/pages/pagina-reparacoes.css',
    'equipamentos': '/styles/pages/pagina-equipamentos.css',
    'utilizadores': '/styles/pages/pagina-utilizadores.css',
    'definicoes-user': '/styles/pages/definicoes-user.css',
  };

  if (pageStyles[page]) {
    loadStyle(pageStyles[page]);
  }


  let content = '';
  let clientesData = null;
  let reparacoesData = null;
  let profissionaisData = null;
  let utilizadoresData = null;
  let equipamentosData = null;

  switch (page) {
    case 'login':
      content = LoginPage();
      break;

    case 'dashboard':
      if (!currentUser) return render('login');
      content = await DashboardPage(currentUser);
      break;

    case 'profissionais':
      if (!currentUser) return render('login');
      profissionaisData = await fetchProfissionais();
      if (thisRender.cancelled) return;
      content = ProfissionaisPage(profissionaisData);
      break;

    case 'reparacoes':
      if (!currentUser) return render('login');
      // Fetch equipamentos and clientes in parallel
      [reparacoesData, profissionaisData, equipamentosData, clientesData] = await Promise.all([fetchReparacoes(), fetchProfissionais(), fetchEquipamentos(), fetchClientes()]);
      if (thisRender.cancelled) return;
      content = ReparacoesPage(reparacoesData, clientesData, equipamentosData, profissionaisData);
      break;
    
    case 'equipamentos':
      if (!currentUser) return render('login');
      // Fetch equipamentos and clientes in parallel
      [equipamentosData, clientesData] = await Promise.all([fetchEquipamentos(), fetchClientes()]);
      if (thisRender.cancelled) return;
      content = EquipamentosPage(equipamentosData, clientesData);
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

    failedLoginAttempts = 0;
    if (lockTimeout) {
      clearTimeout(lockTimeout);
      lockTimeout = null;
    }

    const form = conteudoContainer.querySelector('#login-form');
    const errDiv = conteudoContainer.querySelector('#login-error');

    function lockLoginForm() {
      form.querySelector('button[type="submit"]').disabled = true;
      errDiv.textContent = `Muitas tentativas falhadas. Tente novamente em 1 minuto.`;
      lockTimeout = setTimeout(() => {
        failedLoginAttempts = 0;
        errDiv.textContent = '';
        form.querySelector('button[type="submit"]').disabled = false;
      }, LOCK_TIME_MS);
    }

    form.onsubmit = async e => {
      e.preventDefault();

      if (failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        lockLoginForm();
        return;
      }

      const email = form.email.value;
      const password = form.password.value;
      const u = await login(email, password);
      if (u) {
        currentUser = u;
        failedLoginAttempts = 0; // reset após login bem-sucedido

        resetInactivityTimer();
        setupActivityListeners();
        if (!sessionCheckInterval) {
          sessionCheckInterval = setInterval(async () => {
            const user = await checkSession();
            if (!user) {
              showToast('Sessão expirada.', 'warning');
              doLogout();
            } else {
              currentUser = user;
            }
          }, SESSION_CHECK_INTERVAL);
        }
        render('dashboard');
      } else {
        failedLoginAttempts++;
        errDiv.textContent = 'Credenciais inválidas';
        if (failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
          lockLoginForm();
        }
      }
    };
  }

  if (page === 'profissionais') {
    setupProfissionaisPageListeners(profissionaisData);
  }

  if (page === 'reparacoes') {
    setupReparacoesPageListeners(reparacoesData, clientesData, equipamentosData, profissionaisData);
  }

  if (page === 'equipamentos') {
    setupEquipamentosPageListeners(equipamentosData, clientesData);
  }

  if (page === 'clientes') {
    setupClientesPageListeners(clientesData);
  }

  if (page === 'utilizadores') {
    setupUsersPageListeners(utilizadoresData);
  }

  if (page === 'definicoes-user') {
    setupDefinicoesUserListeners(currentUser);
  }
  
}

render('login');