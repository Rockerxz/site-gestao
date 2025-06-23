// toast.js

const toastContainerId = 'toast-container';

function createToastContainer() {
  let container = document.getElementById(toastContainerId);
  if (!container) {
    container = document.createElement('div');
    container.id = toastContainerId;
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'true');
    // Não definir estilos inline, assume que o CSS cuida do posicionamento
    document.body.appendChild(container);
  }
  return container;
}

export function showToast(message, type = 'info', duration = 4000) {
  const container = createToastContainer();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  // Forçar reflow para ativar a transição de opacidade
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
  });

  // Remover toast após duração
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.addEventListener('transitionend', () => {
      toast.remove();
    });
  }, duration);
}