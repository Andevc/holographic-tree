/**
 * FLOWPARTICLES.JS - Partículas de Flujo
 * =======================================
 * 
 * Partículas que fluyen hacia arriba desde las raíces
 * Representan el "flujo de conocimiento"
 */

import * as THREE from 'three';
import { PARTICLES_CONFIG, COLORS } from '../config/constants.js';

export class FlowParticles {
  constructor(scene, count) {
    this.scene = scene;
    this.count = count;
    this.particles = null;
    this.progress = [];
    
    this.create();
  }

  create() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.count * 3);
    const colors = new Float32Array(this.count * 3);
    
    const color = new THREE.Color(COLORS.grid.primary);
    const config = PARTICLES_CONFIG.flowing;
    
    for (let i = 0; i < this.count; i++) {
      // Posición inicial (en la base)
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * config.radius;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = config.startY;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      // Color cyan brillante
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Progreso inicial aleatorio
      this.progress.push(Math.random());
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: config.size,
      vertexColors: true,
      transparent: true,
      opacity: config.opacity,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false
    });
    
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  update(time, delta) {
    const positions = this.particles.geometry.attributes.position.array;
    const config = PARTICLES_CONFIG.flowing;
    
    for (let i = 0; i < this.count; i++) {
      // Avanzar progreso
      this.progress[i] += config.speed;
      
      // Resetear cuando llega arriba
      if (this.progress[i] > 1) {
        this.progress[i] = 0;
      }
      
      // Calcular altura interpolada
      const y = config.startY + this.progress[i] * (config.endY - config.startY);
      positions[i * 3 + 1] = y;
      
      // Movimiento circular suave
      const angle = this.progress[i] * Math.PI * 2 + i;
      const radius = config.radius * (1 + Math.sin(this.progress[i] * Math.PI) * 0.3);
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    
    this.particles.geometry.attributes.position.needsUpdate = true;
  }

  setCount(newCount) {
    this.dispose();
    this.count = newCount;
    this.progress = [];
    this.create();
  }

  setVisible(visible) {
    this.particles.visible = visible;
  }

  dispose() {
    if (this.particles) {
      this.scene.remove(this.particles);
      this.particles.geometry.dispose();
      this.particles.material.dispose();
    }
  }
}