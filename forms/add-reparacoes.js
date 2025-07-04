export function AddReparacoesModal(clientes = [], equipamentos = []) {
  // Gera as opções do select customizado para clientes
  if (!Array.isArray(clientes)) clientes = [];
  if (!Array.isArray(equipamentos)) equipamentos = [];

  const clienteOptions = clientes.map(c => `<div class="option" data-value="${c.id}">${escapeHtml(c.nome)}</div>`).join('');
  const modeloOptions = equipamentos.map(eq => 
  `<div class="option" data-value="${eq.id}">${escapeHtml(eq.modelo)}</div>`).join('');
  const numeroSerieOptions = equipamentos.map(eq => 
  `<div class="option" data-value="${eq.id}">${escapeHtml(eq.numeroSerie)}</div>`).join('');
  const imeiOptions = equipamentos.map(eq => 
  `<div class="option" data-value="${eq.id}">${escapeHtml(eq.imei)}</div>`).join('');
  const tipoequipamentoOptions = equipamentos.map(eq => 
  `<div class="option" data-value="${eq.id}">${escapeHtml(eq.tipoEquipamento)}</div>`).join('');

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
              <div class="custom-select" id="custom-select-cliente" style="width: 100%;">
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
              <button type="button" id="btn-add-cliente" class="btn-add-equipamento" title="Adicionar Equipamento">
              <i class="fa-solid fa-user-plus"></i>
              </button>
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
              <div  class="custom-select" style="width: 100%;">
                <i class="fa-solid fa-barcode"></i>
                <div class="select-selected" tabindex="0">
                </div>
                <div class="select-items select-hide">
                  <input type="text" placeholder="Pesquisar..." class="select-search" />
                  <div class="options-list">
                    ${tipoequipamentoOptions}
                  </div>
                </div>
              </div>
              <input type="hidden" id="tipoequipamentoId" name="tipoequipamentoId" value="">
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

            <div class="form-group">
              <label for="profissional-reparacao">Profissional</label>
              <div class="input-icon">
                <input type="text" id="profissional-reparacao" name="profissional"></button>
              </div>
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