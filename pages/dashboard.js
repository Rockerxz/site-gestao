export function DashboardPage(user) {
  // Exemplo de dados estáticos para demonstração, idealmente buscar via API/backend
  const kpis = {
    reparacoesEmCurso: 12,
    reparacoesConcluidasHoje: 5,
    reparacoesConcluidasSemana: 20,
    reparacoesConcluidasMes: 75,
    reparacoesPendentes: 8,
    reparacoesAtrasadas: 3,
    equipamentosSemSerie: 4,
    tecnicosAtivos: 6,
    clientesRegistados: 150,
  };

  const ultimasReparacoes = [
    {
      cliente: 'João Silva',
      tecnico: 'Ana Costa',
      equipamento: 'Smartphone',
      estado: 'Em curso',
      dataEntrada: '2024-06-10',
      dataConclusao: '',
    },
    {
      cliente: 'Maria Santos',
      tecnico: 'Pedro Almeida',
      equipamento: 'Portátil',
      estado: 'Concluída',
      dataEntrada: '2024-06-05',
      dataConclusao: '2024-06-12',
    },
    {
      cliente: 'Carlos Pereira',
      tecnico: 'Ana Costa',
      equipamento: 'Tablet',
      estado: 'Aguardando peças',
      dataEntrada: '2024-06-08',
      dataConclusao: '',
    },
    {
      cliente: 'Sofia Martins',
      tecnico: 'João Lopes',
      equipamento: 'Smartphone',
      estado: 'Em curso',
      dataEntrada: '2024-06-11',
      dataConclusao: '',
    },
    {
      cliente: 'Ricardo Gomes',
      tecnico: 'Pedro Almeida',
      equipamento: 'Portátil',
      estado: 'Concluída',
      dataEntrada: '2024-06-01',
      dataConclusao: '2024-06-10',
    },
  ];

  const alertas = [
    '3 reparações atrasadas (data limite ultrapassada)',
    '4 equipamentos sem número de série atribuído',
    '1 técnico inativo',
    '2 clientes sem contacto atualizado',
  ];

  // Formata datas para formato legível
  function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString();
  }

  return `
    <section>
      <header style="display:flex; justify-content: space-between; align-items:center; margin-bottom: 1rem;">
        <div>
          <h1>Painel Geral</h1>
          <p>Bem-vindo, <strong>${user.nome}</strong> (<em>${user.perfil}</em>)</p>
          <p>Último acesso: ${user.ultimoAcesso || '-'}</p>
        </div>
        <button id="logout-btn" style="padding: 0.5rem 1rem; cursor:pointer;">Logout</button>
      </header>

      <section style="display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem;">
        <article style="flex: 1 1 200px; background: #f0f0f0; padding: 1rem; border-radius: 5px;">
          <h3>Resumo de Estado (KPIs)</h3>
          <ul>
            <li>Total de reparações em curso: <strong>${kpis.reparacoesEmCurso}</strong></li>
            <li>Reparações concluídas hoje: <strong>${kpis.reparacoesConcluidasHoje}</strong></li>
            <li>Reparações concluídas esta semana: <strong>${kpis.reparacoesConcluidasSemana}</strong></li>
            <li>Reparações concluídas este mês: <strong>${kpis.reparacoesConcluidasMes}</strong></li>
            <li>Reparações pendentes: <strong>${kpis.reparacoesPendentes}</strong></li>
            <li>Reparações atrasadas: <strong>${kpis.reparacoesAtrasadas}</strong></li>
            <li>Equipamentos sem número de série: <strong>${kpis.equipamentosSemSerie}</strong></li>
            <li>Técnicos ativos: <strong>${kpis.tecnicosAtivos}</strong></li>
            <li>Clientes registados: <strong>${kpis.clientesRegistados}</strong></li>
          </ul>
        </article>

        <article style="flex: 2 1 400px; background: #f9f9f9; padding: 1rem; border-radius: 5px; overflow-x:auto;">
          <h3>Últimas Reparações</h3>
          <table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Técnico</th>
                <th>Equipamento</th>
                <th>Estado</th>
                <th>Data Entrada</th>
                <th>Data Conclusão</th>
              </tr>
            </thead>
            <tbody>
              ${ultimasReparacoes.map(r => `
                <tr>
                  <td>${r.cliente}</td>
                  <td>${r.tecnico}</td>
                  <td>${r.equipamento}</td>
                  <td>${r.estado}</td>
                  <td>${formatDate(r.dataEntrada)}</td>
                  <td>${formatDate(r.dataConclusao)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </article>

        <article style="flex: 1 1 250px; background: #fff3f3; padding: 1rem; border-radius: 5px;">
          <h3>Alertas / Notificações</h3>
          <ul>
            ${alertas.map(a => `<li>${a}</li>`).join('')}
          </ul>
        </article>
      </section>

      <section style="margin-bottom: 2rem;">
        <h3>Ações Rápidas</h3>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <button data-page="nova-reparacao" style="padding: 0.5rem 1rem; cursor:pointer;">Criar nova reparação</button>
          <button data-page="novo-cliente" style="padding: 0.5rem 1rem; cursor:pointer;">Registar novo cliente</button>
          <button data-page="tecnicos" style="padding: 0.5rem 1rem; cursor:pointer;">Adicionar técnico</button>
          <button data-page="numeros-serie" style="padding: 0.5rem 1rem; cursor:pointer;">Gerir números de série</button>
          <button data-page="relatorios" style="padding: 0.5rem 1rem; cursor:pointer;">Gerar relatório rápido</button>
        </div>
      </section>
    </section>
  `;
}