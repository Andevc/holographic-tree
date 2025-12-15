import { AmbientParticles } from './AmbientParticles.js';
import { FlowParticles } from './FlowParticles.js';
import { PARTICLES_CONFIG } from '../config/constants.js';

export class ParticleManager {
  constructor(scene) {
    this.scene = scene;
    
    // Sistemas de partículas
    this.ambientParticles = null;
    this.flowParticles = null;
    
    // Control de rendimiento
    this.isLowPerformance = false;
    
    this.init();
  }

  init() {
    
    // Crear partículas ambientales
    this.ambientParticles = new AmbientParticles(
      this.scene,
      PARTICLES_CONFIG.ambient.count
    );
    
    // Crear partículas de flujo
    this.flowParticles = new FlowParticles(
      this.scene,
      PARTICLES_CONFIG.flowing.count
    );
    
  }

  /**
   * Actualizar todas las partículas
   */
  update(time, delta) {
    if (this.ambientParticles) {
      this.ambientParticles.update(time, delta);
    }
    
    if (this.flowParticles) {
      this.flowParticles.update(time, delta);
    }
  }

  /**
   * Activar modo bajo rendimiento
   */
  enableLowPerformance() {
    if (this.isLowPerformance) return;
    
    this.isLowPerformance = true;
    
    // Reducir cantidad de partículas
    if (this.ambientParticles) {
      this.ambientParticles.setCount(300);
    }
    
    if (this.flowParticles) {
      this.flowParticles.setCount(100);
    }
  }

  /**
   * Mostrar/ocultar partículas
   */
  setVisible(visible) {
    if (this.ambientParticles) {
      this.ambientParticles.setVisible(visible);
    }
    
    if (this.flowParticles) {
      this.flowParticles.setVisible(visible);
    }
  }

  /**
   * Limpiar recursos
   */
  dispose() {
    if (this.ambientParticles) {
      this.ambientParticles.dispose();
    }
    
    if (this.flowParticles) {
      this.flowParticles.dispose();
    }
  }
}   