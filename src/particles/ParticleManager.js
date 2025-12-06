/**
 * PARTICLEMANAGER.JS - Coordinador de Partículas
 * ===============================================
 * 
 * PROPÓSITO:
 * - Coordinar todos los sistemas de partículas
 * - Administrar AmbientParticles y FlowParticles
 * - Optimizar rendimiento según FPS
 * 
 * PARA LA DEFENSA:
 * "El sistema de partículas usa BufferGeometry y PointsMaterial
 * para renderizar miles de partículas eficientemente. Implementé
 * tres tipos: ambientales (distribuidas), flotantes (cerca del árbol)
 * y de flujo (animadas ascendentemente)."
 */

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
    console.log('✨ Inicializando sistema de partículas...');
    
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
    
    console.log(`  ✓ ${PARTICLES_CONFIG.ambient.count} partículas ambientales`);
    console.log(`  ✓ ${PARTICLES_CONFIG.flowing.count} partículas de flujo`);
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
    console.log('⚡ Modo bajo rendimiento activado');
    
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