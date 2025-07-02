export function AddReparacoesModal(clientes = [], equipamentos = []) {
  // Gera as opções do select customizado para clientes
  if (!Array.isArray(clientes)) clientes = [];
  if (!Array.isArray(equipamentos)) equipamentos = [];

  // Criar listas únicas para cada campo do equipamento para os selects
  const modelos = [...new Set(equipamentos.map(eq => eq.modelo).filter(Boolean))];
  const numerosSerie = [...new Set(equipamentos.map(eq => eq.numeroSerie).filter(Boolean))];
  const imeis = [...new Set(equipamentos.map(eq => eq.imei).filter(Boolean))];

  const clienteOptions = clientes.map(c => `<div class="option" data-value="${c.id}">${escapeHtml(c.nome)}</div>`).join('');
  const modeloOptions = modelos.map(m => `<div class="option" data-value="${escapeHtml(m)}">${escapeHtml(m)}</div>`).join('');
  const numeroSerieOptions = numerosSerie.map(n => `<div class="option" data-value="${escapeHtml(n)}">${escapeHtml(n)}</div>`).join('');
  const imeiOptions = imeis.map(i => `<div class="option" data-value="${escapeHtml(i)}">${escapeHtml(i)}</div>`).join('');

  return `
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Adicionar Reparação</h2>
          <button class="modal-close" id="btn-fechar-modal" title="Fechar">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <form id="form-adicionar-reparacao" autocomplete="off" novalidate>
          <div class="form-row">
            <div class="form-group cliente-select-group" style="position: relative;">
              <label for="clienteSelect">Cliente</label>
              <div class="custom-select" style="width: 100%;">
                <i class="fa-solid fa-user select-icon"></i>
                <div class="select-selected" tabindex="0">
                </div>
                <div class="select-items select-hide">
                  <input type="text" placeholder="Pesquisar..." class="select-search" />
                  <div class="options-list">
                    ${clienteOptions}
                  </div>
                </div>
              </div>
              <input type="hidden" id="clienteId" name="clienteId" value="">
            </div>

            <div class="form-group modelo-select-group" style="position: relative;">
              <label for="modeloSelect">Modelo</label>
              <div class="custom-select" style="width: 100%;">
                <i class="fa-solid fa-tag"></i>
                <div class="select-selected" tabindex="0">
                </div>
                <div class="select-items select-hide">
                  <input type="text" placeholder="Pesquisar..." class="select-search" />
                  <div class="options-list">
                    ${modeloOptions}
                  </div>
                </div>
              </div>
              <input type="hidden" id="modeloId" name="modeloId" value="">
            </div>

            <div class="form-group numeroserie-select-group" style="position: relative;">
              <label for="numeroserieSelect">Número de Série</label>
              <div  class="custom-select" style="width: 100%;">
                <i class="fa-solid fa-barcode"></i>
                <div class="select-selected" tabindex="0">
                </div>
                <div class="select-items select-hide">
                  <input type="text" placeholder="Pesquisar..." class="select-search" />
                  <div class="options-list">
                    ${numeroSerieOptions}
                  </div>
                </div>
              </div>
              <input type="hidden" id="numeroserieId" name="numeroserieId" value="">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group tipoequipamento-select-group" style="position: relative;">
              <label for="tipoequipamentoSelect">Tipo de Equipamento</label>
              <div class="input-icon">
                <i class="fa-solid fa-cogs"></i>
                <select id="tipoequipamento" name="tipoequipamento" required>
                  <option value="" disabled selected>Escolha a categoria</option>
                  <option value="PC">PC</option>
                  <option value="Telemóvel">Telemóvel</option>
                </select>
              </div>
            </div>

            <div class="form-group imei-select-group" style="position: relative;">
              <label for="imeiSelect">IMEI</label>
              <div  class="custom-select" style="width: 100%;">
                <i class="fa-solid fa-barcode"></i>
                <div class="select-selected" tabindex="0">
                </div>
                <div class="select-items select-hide">
                  <input type="text" placeholder="Pesquisar..." class="select-search" />
                  <div class="options-list">
                    ${imeiOptions}
                  </div>
                </div>
              </div>
              <input type="hidden" id="imeiId" name="imeiId" value="">
            </div>

            <div class="form-group dataentrada-select-group" style="position: relative;">
              <label for="dadatentradaSelect">Data de Entrada</label>
              <input type="date" id="data-entrada" name="data-entrada">
            </div>
          </div>

          
          <div class="form-row">
            <div class="form-group">
              <label for="problema">Problema reportado:</label>
              <div class="input-icon">
                <input type="text" id="problema" name="problema">
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group descricao-group">
              <label for="descricao">Descrição do problema:</label>
              <textarea id="descricao" name="descricao" rows="4"></textarea>
            </div>
          </div>
        </form>
        <div class="modal-footer">
          <button id="btn-adicionar" class="btn-primary">Adicionar Reparação</button>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[m]);
}