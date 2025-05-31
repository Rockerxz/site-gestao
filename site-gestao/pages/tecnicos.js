export function TecnicosPage(data) {
  // data = array de técnicos [{id, nome, email}]
  const list = data.map(t => `<li>${t.nome} (${t.email})</li>`).join('');
  return `
    <section>
      <h2>Gestão Técnicos</h2>
      <ul>${list}</ul>
      <form id="add-tecnico-form">
        <h3>Adicionar Técnico</h3>
        <input name="nome" placeholder="Nome" required />
        <input name="email" type="email" placeholder="Email" required />
        <button type="submit">Adicionar</button>
      </form>
    </section>
  `;
}
