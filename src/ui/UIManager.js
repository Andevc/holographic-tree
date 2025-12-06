/**
 * UIMANAGER.JS - Gestor de Interfaz de Usuario
 * =============================================
 * 
 * Coordina todos los paneles y elementos HTML
 * Escucha eventos del EventBus para actualizar la UI
 */

import EventBus, { EVENTS } from '../core/EventBus.js';

export class UIManager {
  constructor() {
    // Referencias a elementos del DOM
    this.elements = {
      header: document.getElementById('header'),
      infoPanel: document.getElementById('info-panel'),
      panelContent: document.getElementById('panel-content'),
      closePanel: document.getElementById('close-panel'),
      exploredCount: document.getElementById('explored-count'),
      controlsPanel: document.getElementById('controls-panel'),
      overlay: document.getElementById('ui-overlay'),
      loadingScreen: document.getElementById('loading-screen')
    };
    
    // Estado
    this.exploredNodes = new Set();
    
    this.setupEvents();
    this.hideLoading();
  }

  setupEvents() {
    // Escuchar eventos de nodos
    EventBus.on(EVENTS.NODE_CLICKED, (data) => this.onNodeClicked(data));
    EventBus.on(EVENTS.NODE_HOVER, (data) => this.onNodeHover(data));
    EventBus.on(EVENTS.NODE_UNHOVER, () => this.onNodeUnhover());
    
    // Botón cerrar panel
    if (this.elements.closePanel) {
      this.elements.closePanel.addEventListener('click', () => this.closePanel());
    }
    
    // Toggle UI con tecla H
    EventBus.on('ui:toggle', () => this.toggleUI());
    
    console.log('🎨 UI Manager configurado');
  }

  /**
   * Cuando se hace click en un nodo
   */
  onNodeClicked(data) {
    const subject = data.data;
    
    if (!subject) {
      console.warn('No hay datos de materia');
      return;
    }
    
    // Marcar como explorado
    this.exploredNodes.add(subject.id);
    this.updateExploredCount();
    
    // Actualizar contenido del panel
    this.updatePanelContent(subject);
    
    // Mostrar panel
    this.openPanel();
  }

  /**
   * Cuando se hace hover sobre un nodo
   */
  onNodeHover(data) {
    // Podrías mostrar un tooltip aquí
    // Por ahora solo cambiamos el cursor (hecho en RaycasterManager)
  }

  /**
   * Cuando se quita el hover
   */
  onNodeUnhover() {
    // Limpiar tooltip si existiera
  }

  /**
   * Actualizar contenido del panel de información
   */
  updatePanelContent(subject) {
    if (!this.elements.panelContent) return;
    
    // Construir HTML con los datos
    const html = `
      <div class="fade-in">
        <h2>${subject.name}</h2>
        <div class="subject-meta">
          <span class="badge">${subject.id}</span>
          <span class="badge">Semestre ${subject.semester}</span>
          <span class="badge">${subject.credits} créditos</span>
        </div>
        
        <p>${subject.description}</p>
        
        ${subject.prerequisites && subject.prerequisites.length > 0 ? `
          <h3>📚 Pre-requisitos</h3>
          <ul>
            ${subject.prerequisites.map(p => `<li>${p}</li>`).join('')}
          </ul>
        ` : ''}
        
        ${subject.topics && subject.topics.length > 0 ? `
          <h3>📖 Temas</h3>
          <ul>
            ${subject.topics.map(t => `<li>${t}</li>`).join('')}
          </ul>
        ` : ''}
        
        <h3>👨‍🏫 Información adicional</h3>
        <p><strong>Docente:</strong> ${subject.professor || 'Por asignar'}</p>
        <p><strong>Carga horaria:</strong> ${subject.hours} horas/semana</p>
      </div>
    `;
    
    this.elements.panelContent.innerHTML = html;
  }

  /**
   * Abrir panel de información
   */
  openPanel() {
    if (this.elements.infoPanel) {
      this.elements.infoPanel.classList.remove('hidden');
      EventBus.emit(EVENTS.PANEL_OPENED);
    }
  }

  /**
   * Cerrar panel de información
   */
  closePanel() {
    if (this.elements.infoPanel) {
      this.elements.infoPanel.classList.add('hidden');
      EventBus.emit(EVENTS.PANEL_CLOSED);
    }
  }

  /**
   * Actualizar contador de nodos explorados
   */
  updateExploredCount() {
    if (this.elements.exploredCount) {
      this.elements.exploredCount.textContent = this.exploredNodes.size;
    }
  }

  /**
   * Ocultar pantalla de carga
   */
  hideLoading() {
    if (this.elements.loadingScreen) {
      setTimeout(() => {
        this.elements.loadingScreen.classList.add('hidden');
        setTimeout(() => {
          this.elements.loadingScreen.remove();
        }, 500);
      }, 500);
    }
  }

  /**
   * Toggle visibilidad de toda la UI
   */
  toggleUI() {
    if (this.elements.overlay) {
      this.elements.overlay.classList.toggle('hidden');
    }
  }

  /**
   * Mostrar notificación
   */
  showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type} fade-in`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: rgba(10, 10, 30, 0.9);
      backdrop-filter: blur(10px);
      border: 2px solid var(--color-primary);
      border-radius: 10px;
      padding: 1rem 1.5rem;
      color: white;
      z-index: 1000;
      box-shadow: var(--shadow-glow);
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remover después de 3 segundos
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}