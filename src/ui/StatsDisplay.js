/**
 * STATSDISPLAY.JS - Visualizador de Estadísticas
 * ===============================================
 */

import EventBus from '../core/EventBus.js';

export class StatsDisplay {
  constructor() {
    this.exploredCount = document.getElementById('explored-count');
    this.explored = new Set();
    
    this.setupEvents();
  }

  setupEvents() {
    // Escuchar cuando se explora un nodo
    EventBus.on('node:explored', (data) => {
      this.addExplored(data.subjectId);
    });

    // Escuchar clicks en nodos
    EventBus.on('node:clicked', (data) => {
      if (data.data && data.data.id) {
        this.addExplored(data.data.id);
      }
    });
  }

  /**
   * Agregar materia explorada
   */
  addExplored(subjectId) {
    if (!subjectId) return;
    
    const wasNew = !this.explored.has(subjectId);
    this.explored.add(subjectId);
    
    if (wasNew) {
      this.update();
      
      // Animación de incremento
      this.animateIncrement();
    }
  }

  /**
   * Actualizar display
   */
  update() {
    if (this.exploredCount) {
      this.exploredCount.textContent = this.explored.size;
    }
  }

  /**
   * Animación de incremento
   */
  animateIncrement() {
    if (this.exploredCount) {
      this.exploredCount.classList.add('pulse');
      setTimeout(() => {
        this.exploredCount.classList.remove('pulse');
      }, 500);
    }
  }

  /**
   * Obtener cantidad de materias exploradas
   */
  getCount() {
    return this.explored.size;
  }

  /**
   * Obtener porcentaje explorado
   */
  getPercentage(total) {
    if (total === 0) return 0;
    return Math.round((this.explored.size / total) * 100);
  }

  /**
   * Verificar si una materia fue explorada
   */
  isExplored(subjectId) {
    return this.explored.has(subjectId);
  }

  /**
   * Obtener lista de materias exploradas
   */
  getExploredList() {
    return Array.from(this.explored);
  }

  /**
   * Reset estadísticas
   */
  reset() {
    this.explored.clear();
    this.update();
  }

  /**
   * Exportar estadísticas
   */
  export() {
    return {
      explored: this.getExploredList(),
      count: this.getCount(),
      timestamp: new Date().toISOString()
    };
  }
}