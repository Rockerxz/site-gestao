export function EditEquipamentoModal(equipamento = {}, clientes = []) {
  const clienteSelecionado = clientes.find(c => c.id == equipamento.clienteId);

  const clienteOptions = clientes.map(c => {
    return `<div class="option" data-id="${c.id}">${escapeHtml(c.nome)}</div>`;
  }).join('');

  return `
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Editar Equipamento</h2>
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
                <input type="text" id="tipoEquipamento" name="tipoEquipamento" placeholder="${escapeHtml(equipamento.tipoEquipamento || '')}">
              </div>
            </div>

            <div class="form-group">
              <label for="numeroSerie">Número de Série</label>
              <div class="input-icon">
                <i class="fa-solid fa-barcode"></i>
                <input type="text" id="numeroSerie" name="numeroSerie" placeholder="${escapeHtml(equipamento.numeroSerie || '')}">
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="modelo">Modelo</label>
              <div class="input-icon">
                <i class="fa-solid fa-tag"></i>
                <input type="text" id="modelo" name="modelo" placeholder="${escapeHtml(equipamento.modelo || '')}">
              </div>
            </div>

            <div class="form-group">
              <label for="marca">Marca</label>
              <div class="input-icon">
                <i class="fa-solid fa-industry"></i>
                <input type="text" id="marca" name="marca" placeholder="${escapeHtml(equipamento.marca || '')}">
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group cliente-select-group" style="position: relative;">
              <label for="clienteSelect">Cliente</label>
              <div id="custom-select" class="custom-select" style="width: 100%;">
                <div class="select-selected" tabindex="0">${clienteSelecionado ? escapeHtml(clienteSelecionado.nome) : 'Selecione um cliente'}</div>
                <div class="select-items select-hide">
                  <input type="text" placeholder="Pesquisar..." class="select-search" />
                  <div class="options-list">
                    ${clienteOptions}
                  </div>
                </div>
              </div>
              <input type="hidden" id="clienteId" name="clienteId" value="${clienteSelecionado ? clienteSelecionado.id : ''}">
            </div>
            <!-- Empty div to keep two columns per row -->
            <div class="form-group"></div>
          </div>

          <div class="form-row">
            <div class="form-group comentarios-group">
              <label for="comentarios">Comentários</label>
              <textarea id="comentarios" name="comentarios" rows="4">${escapeHtml(equipamento.comentarios || '')}</textarea>
            </div>
          </div>
        </form>
        <div class="modal-footer">
          <button id="btn-adicionar" class="btn-primary">Salvar Alterações</button>
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