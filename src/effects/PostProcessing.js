/**
 * POSTPROCESSING.JS - Efectos de Post-Procesamiento
 * ==================================================
 * 
 * Aplica efectos visuales después del renderizado
 * Principalmente: Bloom (efecto de brillo)
 * 
 * NOTA: Para usar esto necesitas instalar:
 * pnpm add postprocessing
 * 
 * Por simplicidad, esta versión es opcional
 */ 

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import * as THREE from 'three';
import { EFFECTS_CONFIG } from '../config/constants.js';

export class PostProcessing {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    
    this.composer = null;
    this.bloomPass = null;
    
    this.init();
  }

  init() {
    // Crear composer
    this.composer = new EffectComposer(this.renderer);
    
    // Render pass básico
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
    
    // Bloom pass
    const bloomConfig = EFFECTS_CONFIG.bloom;
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      bloomConfig.strength,
      bloomConfig.radius,
      bloomConfig.threshold
    );
    
    this.composer.addPass(this.bloomPass);
    
  }

  /**
   * Renderizar con efectos
   */
  render() {
    this.composer.render();
  }

  /**
   * Actualizar tamaño
   */
  setSize(width, height) {
    this.composer.setSize(width, height);
  }

  /**
   * Activar/desactivar bloom
   */
  setBloomEnabled(enabled) {
    this.bloomPass.enabled = enabled;
  }

  /**
   * Ajustar intensidad del bloom
   */
  setBloomStrength(strength) {
    this.bloomPass.strength = strength;
  }

  dispose() {
    this.composer.dispose();
  }
}