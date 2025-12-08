/**
 * MATERIALLIBRARY.JS - Materiales Holográficos Mejorados
 * =======================================================
 * 
 * Basado en el efecto holográfico de index2.html
 * 
 * CLAVES DEL EFECTO:
 * 1. MeshPhongMaterial (en lugar de MeshStandardMaterial)
 * 2. Opacidad baja (0.4-0.7)
 * 3. Emissive intensity alto
 * 4. Shininess: 100
 * 5. Wireframe exterior + EdgesGeometry
 */

import * as THREE from 'three';
import { COLORS, getColorByArea } from '../config/constants.js';

export class MaterialLibrary {
  /**
   * Crear material holográfico principal
   * NUEVO: Usa MeshPhongMaterial con shininess
   */
  static createHologram(color = COLORS.areas.fundamentos, options = {}) {
    return new THREE.MeshPhongMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: options.emissiveIntensity || 0.6,
      transparent: true,
      opacity: options.opacity || 0.5,  // MÁS TRANSPARENTE
      shininess: options.shininess || 100,  // BRILLO ESPECULAR
      wireframe: options.wireframe || false,
      side: THREE.DoubleSide
    });
  }

  /**
   * Material para tubos (ramas)
   * NUEVO: Más transparente y brillante
   */
  static createTube(color = COLORS.areas.fundamentos) {
    return new THREE.MeshPhongMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.4,  // MÁS TRANSPARENTE
      shininess: 100,
      side: THREE.DoubleSide
    });
  }

  /**
   * Material para nodos (esferas)
   * NUEVO: Opacidad 0.7 + shininess
   */
  static createNode(color = COLORS.areas.fundamentos) {
    return new THREE.MeshPhongMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.7,  // MÁS TRANSPARENTE
      shininess: 100
    });
  }

  /**
   * Material para nodo central del cluster
   * MÁS GRANDE Y BRILLANTE
   */
  static createCentralNode(color = COLORS.areas.fundamentos) {
    return new THREE.MeshPhongMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.7,
      shininess: 100
    });
  }

  /**
   * Material para hojas (nodos pequeños)
   * Un poco menos brillante que el central
   */
  static createLeafNode(color = COLORS.areas.fundamentos) {
    return new THREE.MeshPhongMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.7,
      transparent: true,
      opacity: 0.6,
      shininess: 100
    });
  }

  /**
   * Material para líneas de conexión
   * NUEVO: AdditiveBlending para efecto glow
   */
  static createLine(color = COLORS.areas.fundamentos, options = {}) {
    return new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: options.opacity || 0.6,
      blending: THREE.AdditiveBlending,  // ← CLAVE DEL GLOW
      linewidth: 1
    });
  }

  /**
   * Material para anillos decorativos
   * NUEVO: Wireframe + baja opacidad
   */
  static createRing(color = COLORS.areas.fundamentos, opacity = 0.3) {
    return new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: opacity,
      wireframe: true,  // ← WIREFRAME
      side: THREE.DoubleSide
    });
  }

  /**
   * Material para bordes brillantes (EdgesGeometry)
   * ESTE ES EL SECRETO DEL EFECTO
   */
  static createEdges(color = COLORS.areas.fundamentos, opacity = 0.9) {
    return new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: opacity,
      linewidth: 2  // No funciona en WebGL pero lo dejamos
    });
  }

  /**
   * Material para wireframe exterior
   * La capa exterior que hace el efecto holográfico
   */
  static createWireframe(color = COLORS.areas.fundamentos, opacity = 0.3) {
    return new THREE.MeshBasicMaterial({
      color: color,
      wireframe: true,
      transparent: true,
      opacity: opacity
    });
  }

  /**
   * Material para partículas
   * NUEVO: AdditiveBlending
   */
  static createParticle(color = COLORS.areas.fundamentos, size = 0.05) {
    return new THREE.PointsMaterial({
      color: color,
      size: size,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,  // ← GLOW
      sizeAttenuation: true,
      depthWrite: false
    });
  }

  /**
   * Obtener material por área (actualizado con Phong)
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
      case 'central-node':
        return this.createCentralNode(color);
      case 'leaf-node':
        return this.createLeafNode(color);
      case 'line':
        return this.createLine(color);
      case 'ring':
        return this.createRing(color);
      case 'wireframe':
        return this.createWireframe(color);
      case 'edges':
        return this.createEdges(color);
      case 'particle':
        return this.createParticle(color);
      default:
        return this.createHologram(color);
    }
  }

  /**
   * NUEVO: Agregar capa wireframe a un objeto
   * Esta es la función clave del efecto holográfico
   * 
   * @param {THREE.Mesh} mesh - Mesh al que agregar wireframe
   * @param {number} scaleFactor - Factor de escala (ej: 1.1 = 10% más grande)
   */
  static addWireframeLayer(mesh, scaleFactor = 1.1) {
    const geometry = mesh.geometry.clone();
    const wireframeMat = this.createWireframe(
      mesh.material.color,
      0.3
    );
    
    const wireframe = new THREE.Mesh(geometry, wireframeMat);
    wireframe.scale.setScalar(scaleFactor);
    mesh.add(wireframe);
    
    return wireframe;
  }

  /**
   * NUEVO: Agregar bordes brillantes (EdgesGeometry)
   * Los bordes hacen que se vea mucho más holográfico
   * 
   * @param {THREE.Mesh} mesh - Mesh al que agregar bordes
   * @param {number} opacity - Opacidad de los bordes
   */
  static addBrightEdges(mesh, opacity = 0.9) {
    const edgesGeometry = new THREE.EdgesGeometry(mesh.geometry);
    const edgesMaterial = this.createEdges(
      mesh.material.color,
      opacity
    );
    
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    mesh.add(edges);
    
    return edges;
  }

  /**
   * NUEVO: Aplicar efecto holográfico completo a un mesh
   * Combina: wireframe exterior + bordes brillantes
   */
  static applyHolographicEffect(mesh, options = {}) {
    const wireframeScale = options.wireframeScale || 1.1;
    const edgesOpacity = options.edgesOpacity || 0.9;
    
    // 1. Agregar wireframe exterior
    const wireframe = this.addWireframeLayer(mesh, wireframeScale);
    
    // 2. Agregar bordes brillantes
    const edges = this.addBrightEdges(mesh, edgesOpacity);
    
    return { wireframe, edges };
  }

  /**
   * Crear material variante "highlighted"
   */
  static createHighlighted(originalMaterial) {
    const highlighted = originalMaterial.clone();
    
    if (highlighted.emissiveIntensity !== undefined) {
      highlighted.emissiveIntensity = 1.5;
    }
    highlighted.opacity = Math.min(highlighted.opacity + 0.2, 1.0);
    
    return highlighted;
  }
}