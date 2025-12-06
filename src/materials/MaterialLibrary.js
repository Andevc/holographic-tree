/**
 * MATERIALLIBRARY.JS - Biblioteca de Materiales
 * ==============================================
 * 
 * PROPÓSITO:
 * - Centralizar la creación de todos los materiales
 * - Reutilizar materiales en lugar de crear duplicados
 * - Facilitar cambios de estilo globales
 * 
 * TIPOS DE MATERIALES:
 * 1. Hologram - Wireframe con glow (raíces, tronco)
 * 2. Tube - Sólido brillante (ramas)
 * 3. Node - Muy brillante (nodos/esferas)
 * 4. Line - Para conexiones
 * 
 * PARA LA DEFENSA:
 * "MaterialLibrary implementa el patrón Factory para crear
 * materiales de manera consistente. Uso MeshStandardMaterial
 * porque responde bien a las luces y permite efectos metálicos
 * y emissive para el estilo holográfico."
 */

import * as THREE from 'three';
import { COLORS, MATERIALS_CONFIG, getColorByArea } from '../config/constants.js';

export class MaterialLibrary {
  /**
   * Crear material holográfico (wireframe con glow)
   * Usado en: Raíces, Tronco
   * 
   * @param {number} color - Color en hexadecimal
   * @param {object} options - Opciones adicionales
   * @returns {THREE.Material}
   */
  static createHologram(color = COLORS.areas.fundamentos, options = {}) {
    const config = MATERIALS_CONFIG.hologram;
    
    return new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,  // Color que emite luz propia
      emissiveIntensity: options.emissiveIntensity || config.emissiveIntensity,
      wireframe: options.wireframe !== undefined ? options.wireframe : config.wireframe,
      transparent: true,
      opacity: options.opacity || config.opacity,
      metalness: config.metalness,  // Qué tan metálico se ve
      roughness: config.roughness,   // Qué tan rugoso/brillante
      side: THREE.DoubleSide        // Visible desde ambos lados
    });
  }

  /**
   * Crear material para tubos (ramas)
   * Más sólido y brillante que hologram
   * 
   * @param {number} color - Color en hexadecimal
   * @returns {THREE.Material}
   */
  static createTube(color = COLORS.areas.fundamentos) {
    const config = MATERIALS_CONFIG.tube;
    
    return new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: config.emissiveIntensity,
      transparent: true,
      opacity: config.opacity,
      metalness: config.metalness,
      roughness: config.roughness,
      side: THREE.DoubleSide
    });
  }

  /**
   * Crear material para nodos (esferas brillantes)
   * El más brillante de todos
   * 
   * @param {number} color - Color en hexadecimal
   * @returns {THREE.Material}
   */
  static createNode(color = COLORS.areas.fundamentos) {
    const config = MATERIALS_CONFIG.node;
    
    return new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: config.emissiveIntensity,
      transparent: true,
      opacity: config.opacity,
      metalness: config.metalness,
      roughness: config.roughness
    });
  }

  /**
   * Crear material para líneas (conexiones)
   * 
   * @param {number} color - Color en hexadecimal
   * @param {object} options - Opciones
   * @returns {THREE.LineBasicMaterial}
   */
  static createLine(color = COLORS.areas.fundamentos, options = {}) {
    return new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: options.opacity || 0.4,
      linewidth: options.linewidth || 1  // Note: linewidth no funciona en WebGL
    });
  }

  /**
   * Crear material para anillos decorativos
   * 
   * @param {number} color - Color en hexadecimal
   * @param {number} opacity - Transparencia
   * @returns {THREE.Material}
   */
  static createRing(color = COLORS.areas.fundamentos, opacity = 0.3) {
    return new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: opacity,
      side: THREE.DoubleSide
    });
  }

  /**
   * Crear material para edges (bordes de wireframe)
   * 
   * @param {number} color - Color en hexadecimal
   * @param {number} opacity - Transparencia
   * @returns {THREE.LineBasicMaterial}
   */
  static createEdges(color = COLORS.areas.fundamentos, opacity = 0.9) {
    return new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: opacity
    });
  }

  /**
   * Obtener material por área del conocimiento
   * Factory method que selecciona el tipo correcto
   * 
   * @param {string} area - Nombre del área
   * @param {string} type - Tipo de material ('hologram', 'tube', 'node')
   * @returns {THREE.Material}
   */
  static getByArea(area, type = 'hologram') {
    const color = getColorByArea(area);
    
    switch (type) {
      case 'hologram':
        return this.createHologram(color);
      case 'tube':
        return this.createTube(color);
      case 'node':
        return this.createNode(color);
      case 'line':
        return this.createLine(color);
      default:
        return this.createHologram(color);
    }
  }

  /**
   * Crear variante "highlighted" (resaltado)
   * Usado cuando el usuario hace hover o click
   * 
   * @param {THREE.Material} originalMaterial - Material original
   * @returns {THREE.Material}
   */
  static createHighlighted(originalMaterial) {
    const highlighted = originalMaterial.clone();
    highlighted.emissiveIntensity = 1.5;
    highlighted.opacity = 1.0;
    return highlighted;
  }

  /**
   * Animar material (para efectos especiales)
   * Modifica el material in-place
   * 
   * @param {THREE.Material} material - Material a animar
   * @param {number} time - Tiempo para la animación
   */
  static animate(material, time) {
    if (material.emissive) {
      // Pulso de intensidad
      const baseIntensity = 0.8;
      material.emissiveIntensity = baseIntensity + Math.sin(time * 2) * 0.2;
    }
  }

  /**
   * Aplicar tema de color
   * Cambia todos los colores base
   * 
   * @param {string} theme - 'cyan', 'green', 'purple'
   */
  static applyTheme(theme) {
    const themes = {
      cyan: 0x00ffff,
      green: 0x00ff88,
      purple: 0x9d00ff
    };
    
    const baseColor = themes[theme] || themes.cyan;
    
    // Aquí podrías actualizar COLORS globalmente
    // O retornar nuevos materiales con el color del tema
    return baseColor;
  }
}