/**
 * AMBIENTPARTICLES.JS - Partículas Ambientales
 * =============================================
 * 
 * Crea partículas distribuidas por toda la escena con movimiento aleatorio
 */

import * as THREE from 'three';
import { PARTICLES_CONFIG, COLORS } from '../config/constants.js';

export class AmbientParticles {
  constructor(scene, count) {
    this.scene = scene;
    this.count = count;
    this.particles = null;
    this.velocities = [];
    
    this.create();
  }

  create() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.count * 3);
    const colors = new Float32Array(this.count * 3);
    const sizes = new Float32Array(this.count);
    
    const color = new THREE.Color();
    const config = PARTICLES_CONFIG.ambient.spread;
    
    for (let i = 0; i < this.count; i++) {
      // Posición en cilindro alrededor del árbol
      const angle = Math.random() * Math.PI * 2;
      const radius = config.radius.min + Math.random() * (config.radius.max - config.radius.min);
      const height = config.height.min + Math.random() * (config.height.max - config.height.min);
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      // Colores variados (cyan a blanco)
      const hue = 0.5 + Math.random() * 0.1;
      const saturation = 0.5 + Math.random() * 0.5;
      const lightness = 0.5 + Math.random() * 0.5;
      color.setHSL(hue, saturation, lightness);
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Tamaños variados
      sizes[i] = Math.random() * 3 + 1;
      
      // Velocidades aleatorias
      this.velocities.push({
        x: (Math.random() - 0.5) * PARTICLES_CONFIG.ambient.velocity.x,
        y: (Math.random() - 0.5) * PARTICLES_CONFIG.ambient.velocity.y,
        z: (Math.random() - 0.5) * PARTICLES_CONFIG.ambient.velocity.z
      });
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.PointsMaterial({
      size: PARTICLES_CONFIG.ambient.size,
      vertexColors: true,
      transparent: true,
      opacity: PARTICLES_CONFIG.ambient.opacity,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false
    });
    
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  update(time, delta) {
    const positions = this.particles.geometry.attributes.position.array;
    const config = PARTICLES_CONFIG.ambient.spread;
    
    for (let i = 0; i < this.count; i++) {
      // Mover según velocidad
      positions[i * 3] += this.velocities[i].x;
      positions[i * 3 + 1] += this.velocities[i].y;
      positions[i * 3 + 2] += this.velocities[i].z;
      
      // Mantener dentro de límites (rebotar)
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];
      
      if (Math.abs(x) > config.radius.max) this.velocities[i].x *= -1;
      if (y > config.height.max || y < config.height.min) this.velocities[i].y *= -1;
      if (Math.abs(z) > config.radius.max) this.velocities[i].z *= -1;
    }
    
    this.particles.geometry.attributes.position.needsUpdate = true;
  }

  setCount(newCount) {
    this.dispose();
    this.count = newCount;
    this.velocities = [];
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