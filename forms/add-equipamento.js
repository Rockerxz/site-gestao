export function AddEquipamentoModal(clientes = []) {
  // Gera as opções do select customizado para clientes
  const clienteOptions = clientes.map(c => `<div class="option" data-id="${c.id}">${escapeHtml(c.nome)}</div>`).join('');

  return `
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Adicionar Equipamento</h2>
          <button class="modal-close" id="btn-fechar-modal" title="Fechar">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <form id="form-adicionar-equipamento" autocomplete="off" novalidate>
          <div class="form-row">
            <div class="form-group">
              <label for="tipoEquipamento">Tipo de Equipamento</label>
              <div class="input-icon">
                <i class="fa-solid fa-cogs"></i>
                <input type="text" id="tipoEquipamento" name="tipoEquipamento" required>
              </div>
            </div>

            <div class="form-group">
              <label for="numeroSerie">Número de Série</label>
              <div class="input-icon">
                <i class="fa-solid fa-barcode"></i>
                <input type="text" id="numeroSerie" name="numeroSerie">
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="modelo">Modelo</label>
              <div class="input-icon">
                <i class="fa-solid fa-tag"></i>
                <input type="text" id="modelo" name="modelo">
              </div>
            </div>

            <div class="form-group">
              <label for="marca">Marca</label>
              <div class="input-icon">
                <i class="fa-solid fa-industry"></i>
                <input type="text" id="marca" name="marca">
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group cliente-select-group" style="position: relative;">
              <label for="clienteSelect">Cliente</label>
              <div id="custom-select" class="custom-select" style="width: 100%;">
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

            <div class="form-group">
              <label for="imei">IMEI</label>
              <div class="input-icon">
                <i class="fa-solid fa-barcode"></i>
                <input type="text" id="IMEI" name="IMEI">
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group comentarios-group">
              <label for="comentarios">Comentários</label>
              <textarea id="comentarios" name="comentarios" rows="4"></textarea>
            </div>
          </div>
        </form>
        <div class="modal-footer">
          <button id="btn-adicionar" class="btn-primary">Adicionar Equipamento</button>
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