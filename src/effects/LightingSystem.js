/**
 * LIGHTINGSYSTEM.JS - Sistema de Luces Dinámico
 * ==============================================
 * 
 * Maneja animaciones y efectos de las luces ya creadas en Scene.js
 * Permite crear efectos especiales como "spotlight" en nodos seleccionados
 */

import * as THREE from 'three';
import { ANIMATION_CONFIG } from '../config/constants.js';

export class LightingSystem {
  constructor(scene, lights) {
    this.scene = scene;
    this.lights = lights;
    
    // Spotlight para nodo seleccionado
    this.spotlight = null;
    
    this.createSpotlight();
  }
 
  /**
   * Crear spotlight para resaltar nodos
   */
  createSpotlight() {
    this.spotlight = new THREE.SpotLight(0xffffff, 0);
    this.spotlight.angle = Math.PI / 6;
    this.spotlight.penumbra = 0.3;
    this.spotlight.decay = 2;
    this.spotlight.distance = 20;
    this.spotlight.castShadow = true;
    
    this.spotlight.position.set(0, 10, 0);
    this.spotlight.target.position.set(0, 0, 0);
    
    this.scene.add(this.spotlight);
    this.scene.add(this.spotlight.target);
  }

  /**
   * Actualizar animaciones de luces
   */
  update(time) {
    const config = ANIMATION_CONFIG.lights;
    
    // Animar luces de punto (pulso)
    if (this.lights.points) {
      this.lights.points.forEach((light, index) => {
        const baseIntensity = 2;
        light.intensity = baseIntensity + 
          Math.sin(time * config.pulseSpeed + index) * config.pulseAmount;
      });
    }
  }

  /**
   * Iluminar nodo específico
   */
  focusOnNode(node) {
    if (!node) return;
    
    // Mover spotlight hacia el nodo
    this.spotlight.target.position.copy(node.position);
    this.spotlight.intensity = 5;
  }

  /**
   * Quitar foco del spotlight
   */
  unfocus() {
    this.spotlight.intensity = 1;
  }

  dispose() {
    if (this.spotlight) {
      this.scene.remove(this.spotlight);
      this.scene.remove(this.spotlight.target);
    }
  }
}