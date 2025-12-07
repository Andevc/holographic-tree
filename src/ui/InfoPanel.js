/**
 * INFOPANEL.JS - Panel de Información
 * ====================================
 */

import EventBus, { EVENTS } from '../core/EventBus.js';

export class InfoPanel {
  constructor() {
    this.element = document.getElementById('info-panel');
    this.content = document.getElementById('panel-content');
    this.closeBtn = document.getElementById('close-panel');
    
    this.currentSubject = null;
    
    this.setupEvents();
  }

  setupEvents() {
    // Botón cerrar
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.hide());
    }

    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.element.classList.contains('hidden')) {
        this.hide();
      }
    });

    // Escuchar eventos
    EventBus.on(EVENTS.NODE_CLICKED, (data) => {
      this.show(data.data);
    });

    EventBus.on(EVENTS.PANEL_CLOSED, () => {
      this.hide();
    });
  }

  /**
   * Mostrar panel con datos
   */
  show(subjectData) {
    if (!this.element || !subjectData) return;
    
    this.currentSubject = subjectData;
    this.updateContent(subjectData);
    this.element.classList.remove('hidden');
    
    EventBus.emit(EVENTS.PANEL_OPENED, { subject: subjectData });
  }

  /**
   * Ocultar panel
   */
  hide() {
    if (this.element) {
      this.element.classList.add('hidden');
      this.currentSubject = null;
    }
  }

  /**
   * Actualizar contenido del panel
   */
  updateContent(subject) {
    if (!this.content) return;
    
    const html = `
      <div class="fade-in">
        <div class="subject-header">
          <div class="subject-icon">
            ${this.getAreaIcon(subject.area)}
          </div>
          <div class="subject-details">
            <h2>${subject.name}</h2>
            <div class="subject-meta">
              <span class="badge badge-primary">${subject.id}</span>
              <span class="badge">Semestre ${subject.semester}</span>
              <span class="badge badge-success">${subject.credits} créditos</span>
            </div>
          </div>
        </div>
        
        <div class="info-section">
          <p>${subject.description}</p>
        </div>
        
        ${subject.prerequisites && subject.prerequisites.length > 0 ? `
          <div class="info-section">
            <h3>📚 Pre-requisitos</h3>
            <ul class="info-list">
              ${subject.prerequisites.map(p => `<li>${p}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        
        ${subject.topics && subject.topics.length > 0 ? `
          <div class="info-section">
            <h3>📖 Temas del curso</h3>
            <ul class="info-list">
              ${subject.topics.map(t => `<li>${t}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        
        <div class="info-section">
          <h3>👨‍🏫 Información adicional</h3>
          <p><strong>Docente:</strong> ${subject.professor || 'Por asignar'}</p>
          <p><strong>Carga horaria:</strong> ${subject.hours} horas/semana</p>
          <p><strong>Área:</strong> ${this.getAreaName(subject.area)}</p>
        </div>
        
        ${this.renderActionButtons(subject)}
      </div>
    `;
    
    this.content.innerHTML = html;
  }

  /**
   * Obtener icono según área
   */
  getAreaIcon(area) {
    const icons = {
      fundamentos: '📚',
      web: '🌐',
      ia: '🤖',
      redes: '🔒',
      sistemas: '⚙️',
      datos: '💾',
      gamedev: '🎮'
    };
    return icons[area] || '📘';
  }

  /**
   * Obtener nombre del área
   */
  getAreaName(area) {
    const names = {
      fundamentos: 'Fundamentos',
      web: 'Desarrollo Web/Móvil',
      ia: 'Inteligencia Artificial',
      redes: 'Redes y Seguridad',
      sistemas: 'Sistemas y Hardware',
      datos: 'Bases de Datos',
      gamedev: 'Game Dev & XR'
    };
    return names[area] || area;
  }

  /**
   * Renderizar botones de acción
   */
  renderActionButtons(subject) {
    return `
      <div class="panel-footer">
        <button class="control-btn" onclick="console.log('Materia marcada:', '${subject.id}')">
          ⭐ Marcar como favorita
        </button>
      </div>
    `;
  }

  /**
   * Verificar si está visible
   */
  isVisible() {
    return this.element && !this.element.classList.contains('hidden');
  }

  /**
   * Toggle visibilidad
   */
  toggle() {
    if (this.isVisible()) {
      this.hide();
    } else if (this.currentSubject) {
      this.show(this.currentSubject);
    }
  }
}