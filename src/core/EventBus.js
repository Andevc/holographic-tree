class EventBus {
  constructor() {
 
    this.events = {};
    this.debug = false;
  }

  on(event, callback) {
    // Si el evento no existe, crear array vacío
    if (!this.events[event]) {
      this.events[event] = [];
    }
    
    // Agregar callback al array de listeners
    this.events[event].push(callback);
    
    if (this.debug) {
    }
    
    // Retornar función para desuscribirse (útil para cleanup)
    return () => this.off(event, callback);
  }


  off(event, callback) {
    if (!this.events[event]) return;
    
    // Filtrar el callback específico
    this.events[event] = this.events[event].filter(cb => cb !== callback);
    
    if (this.debug) {
      console.log(`📡 EventBus: Listener removido de "${event}"`);
    }
  }

  /**
   * Emitir un evento
   * @param {string} event - Nombre del evento
   * @param {*} data - Datos a pasar a los callbacks
   */
  emit(event, data) {
    // Si no hay listeners para este evento, no hacer nada
    if (!this.events[event]) {
      if (this.debug) {
        console.warn(`⚠️ EventBus: No hay listeners para "${event}"`);
      }
      return;
    }
    
    if (this.debug) {
      console.log(`📡 EventBus: Emitiendo "${event}"`, data);
    }
    
    // Ejecutar todos los callbacks
    this.events[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`❌ Error en listener de "${event}":`, error);
      }
    });
  }

  /**
   * Suscribirse a un evento solo una vez
   * @param {string} event - Nombre del evento
   * @param {Function} callback - Función a ejecutar
   */
  once(event, callback) {
    const onceWrapper = (data) => {
      callback(data);
      this.off(event, onceWrapper);
    };
    
    this.on(event, onceWrapper);
  }

  /**
   * Remover todos los listeners de un evento
   * @param {string} event - Nombre del evento
   */
  removeAllListeners(event) {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
    
    if (this.debug) {
      console.log(`📡 EventBus: Todos los listeners removidos${event ? ` de "${event}"` : ''}`);
    }
  }

  /**
   * Obtener número de listeners de un evento
   * @param {string} event - Nombre del evento
   * @returns {number} Cantidad de listeners
   */
  listenerCount(event) {
    return this.events[event] ? this.events[event].length : 0;
  }

  /**
   * Activar/desactivar modo debug
   * @param {boolean} enabled - true para activar
   */
  setDebug(enabled) {
    this.debug = enabled;
  }

  /**
   * Obtener lista de todos los eventos registrados
   * @returns {Array} Array de nombres de eventos
   */
  getEvents() {
    return Object.keys(this.events);
  }
}

// ============================================
// EVENTOS ESTÁNDAR DEL PROYECTO
// ============================================

/**
 * Lista de eventos que se usan en el proyecto
 * (Para referencia y documentación)
 */
export const EVENTS = {
  // Eventos de interacción
  NODE_CLICKED: 'node:clicked',
  NODE_HOVER: 'node:hover',
  NODE_UNHOVER: 'node:unhover',
  
  // Eventos de UI
  PANEL_OPENED: 'panel:opened',
  PANEL_CLOSED: 'panel:closed',
  FILTER_CHANGED: 'filter:changed',
  MODE_CHANGED: 'mode:changed',
  
  // Eventos de cámara
  CAMERA_MOVED: 'camera:moved',
  CAMERA_RESET: 'camera:reset',
  
  // Eventos de sistema
  SCENE_READY: 'scene:ready',
  TREE_BUILT: 'tree:built',
  LOADING_COMPLETE: 'loading:complete',
  
  // Eventos de animación
  ANIMATION_START: 'animation:start',
  ANIMATION_STOP: 'animation:stop'
};

// Exportar instancia única (Singleton)
export default new EventBus();