export async function DashboardPage(user) {
  // Buscar dados via backend PHP (usando endpoints corretos)
  const [reparacoes, clientes, equipamentos] = await Promise.all([
    fetch('/backend/reparacoes.php', { credentials: 'include' })
      .then(r => r.json()).then(j => Array.isArray(j.data) ? j.data : []),
    fetch('/backend/clientes.php', { credentials: 'include' })
      .then(r => r.json()).then(j => Array.isArray(j.data) ? j.data : []),
    fetch('/backend/equipamentos.php', { credentials: 'include' })
      .then(r => r.json()).then(j => Array.isArray(j.data) ? j.data : []),
  ]);

  // Contagens
  const totalReparacoes = reparacoes.length;
  const totalClientes = clientes.length;
  const totalEquipamentos = equipamentos.length;

  // HTML conforme pedido
  return `
    <section class="dashboard-container">
      <h1 class="dashboard-title">Painel Geral</h1>
      <div class="dashboard-session-success">
        Sessão Iniciada com Sucesso
      </div>
      <div class="dashboard-kpi-row">
        <div class="dashboard-kpi-box">
          <div class="dashboard-kpi-num">${totalReparacoes}</div>
          <div class="dashboard-kpi-label">Reparações</div>
        </div>
        <div class="dashboard-kpi-box">
          <div class="dashboard-kpi-num">${totalClientes}</div>
          <div class="dashboard-kpi-label">Clientes</div>
        </div>
        <div class="dashboard-kpi-box">
          <div class="dashboard-kpi-num">${totalEquipamentos}</div>
          <div class="dashboard-kpi-label">Equipamentos</div>
        </div>
      </div>
      <div class="dashboard-kpi-row dashboard-kpi-row-white">
        <div class="dashboard-kpi-box dashboard-kpi-white"></div>
        <div class="dashboard-kpi-box dashboard-kpi-white"></div>
      </div>
    </section>
  `;
}