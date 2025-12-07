/**
 * CONTROLPANEL.JS - Panel de Controles
 * =====================================
 */

export class ControlPanel {
  constructor() {
    this.element = document.getElementById('controls-panel');
    this.isVisible = true;
  }

  /**
   * Mostrar panel
   */
  show() {
    if (this.element) {
      this.element.classList.remove('hidden');
      this.isVisible = true;
    }
  }

  /**
   * Ocultar panel
   */
  hide() {
    if (this.element) {
      this.element.classList.add('hidden');
      this.isVisible = false;
    }
  }

  /**
   * Toggle visibilidad
   */
  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Actualizar contenido con controles dinámicos
   */
  updateControls(controls) {
    if (!this.element) return;
    
    const html = `
      <h3>⌨️ Controles</h3>
      <ul>
        ${controls.map(ctrl => `
          <li>
            <kbd>${ctrl.key}</kbd>
            <span>${ctrl.description}</span>
          </li>
        `).join('')}
      </ul>
    `;
    
    this.element.innerHTML = html;
  }
}