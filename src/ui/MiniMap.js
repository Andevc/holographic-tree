import EventBus, { EVENTS } from '../core/EventBus.js';
export class MiniMap {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.element = null;
    
    // Por ahora, minimap es opcional
    // Puedes implementarlo con un segundo renderer pequeño
  }

  create() {
    // TODO: Crear canvas pequeño con vista top-down
    console.log('📍 MiniMap (pendiente de implementación)');
  }

  update() {
    // Actualizar posición del indicador
  }
}