/**
 * INFOPANEL.JS - Panel de Información con Soporte para Clusters
 * ==============================================================
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
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.hide());
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.element.classList.contains('hidden')) {
        this.hide();
      }
    });

    EventBus.on(EVENTS.NODE_CLICKED, (data) => {
      // Detectar si es un nodo normal o un satélite de cluster
      const nodeData = data.node.userData;
      
      if (nodeData.type === 'cluster-central') {
        this.showClusterCentral(nodeData);
      } else if (nodeData.type === 'cluster-satellite') {
        this.showClusterSatellite(nodeData.satelliteData);
      } else if (nodeData.subjectData) {
        this.show(nodeData.subjectData);
      }
    });

    EventBus.on(EVENTS.PANEL_CLOSED, () => {
      this.hide();
    });
  }

  /**
   * Mostrar info del nodo central del cluster
   */
  showClusterCentral(nodeData) {
    if (!this.element) return;
    
    const html = `
      <div class="fade-in">
        <div class="subject-header">
          <div class="subject-icon">
            ${this.getAreaIcon(nodeData.area)}
          </div>
          <div class="subject-details">
            <h2>${nodeData.name}</h2>
            <div class="subject-meta">
              <span class="badge badge-primary">Área Central</span>
              <span class="badge">${nodeData.area}</span>
            </div>
          </div>
        </div>
        
        <div class="info-section">
          <h3>📚 Sobre esta área</h3>
          <p>Este es el nodo central del cluster de <strong>${nodeData.name}</strong>.</p>
          <p>Explora las tecnologías y conceptos específicos haciendo click en los nodos satélites alrededor.</p>
        </div>
        
        <div class="info-section">
          <h3>🎯 Tecnologías relacionadas</h3>
          <p>Los nodos orbitales representan herramientas, frameworks y conceptos clave de esta área.</p>
        </div>
      </div>
    `;
    
    this.content.innerHTML = html;
    this.element.classList.remove('hidden');
    
    EventBus.emit(EVENTS.PANEL_OPENED, { cluster: nodeData });
  }

  /**
   * Mostrar info de un satélite del cluster
   */
  showClusterSatellite(satelliteData) {
    if (!this.element || !satelliteData) return;
    
    const html = `
      <div class="fade-in">
        <div class="subject-header">
          <div class="subject-icon">
            ${this.getAreaIcon(satelliteData.area)}
          </div>
          <div class="subject-details">
            <h2>${satelliteData.name}</h2>
            <div class="subject-meta">
              <span class="badge badge-primary">${satelliteData.id}</span>
              <span class="badge badge-success">Tecnología</span>
            </div>
          </div>
        </div>
        
        <div class="info-section">
          <p>${satelliteData.description}</p>
        </div>
        
        <div class="info-section">
          <h3>🎯 Información adicional</h3>
          <p><strong>Área:</strong> ${this.getAreaName(satelliteData.area)}</p>
          <p><strong>Tipo:</strong> Satélite de Cluster</p>
        </div>
        
        <div class="panel-footer">
          <button class="control-btn" onclick="console.log('Satélite:', '${satelliteData.id}')">
            ⭐ Marcar como importante
          </button>
        </div>
      </div>
    `;
    
    this.content.innerHTML = html;
    this.element.classList.remove('hidden');
    this.currentSubject = satelliteData;
    
    EventBus.emit(EVENTS.PANEL_OPENED, { satellite: satelliteData });
  }

  /**
   * Mostrar panel normal (para nodos del tronco/raíces)
   */
  show(subjectData) {
    if (!this.element || !subjectData) return;
    
    this.currentSubject = subjectData;
    this.updateContent(subjectData);
    this.element.classList.remove('hidden');
    
    EventBus.emit(EVENTS.PANEL_OPENED, { subject: subjectData });
  }

  hide() {
    if (this.element) {
      this.element.classList.add('hidden');
      this.currentSubject = null;
    }
  }

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

  renderActionButtons(subject) {
    return `
      <div class="panel-footer">
        <button class="control-btn" onclick="console.log('Materia marcada:', '${subject.id}')">
          ⭐ Marcar como favorita
        </button>
      </div>
    `;
  }

  isVisible() {
    return this.element && !this.element.classList.contains('hidden');
  }

  toggle() {
    if (this.isVisible()) {
      this.hide();
    } else if (this.currentSubject) {
      this.show(this.currentSubject);
    }
  }
}