/**
 * NODEBUILDER.JS - Constructor de Nodos Holográficos
 * ==================================================
 * 
 * NUEVO: Aplica el efecto holográfico completo:
 * - Esfera base transparente
 * - Wireframe exterior
 * - Bordes brillantes
 * - Anillos decorativos
 */

import * as THREE from 'three';
import { MaterialLibrary } from '../materials/MaterialLibrary.js';
import { TREE_CONFIG } from '../config/constants.js';

export class NodeBuilder {
  constructor(parent) {
    this.parent = parent;
  }

  /**
   * Crear nodo con efecto holográfico completo
   */
  createNode(position, data) {
    const config = TREE_CONFIG.nodes;

    // 1. Esfera base (transparente)
    const geometry = new THREE.SphereGeometry(
      config.radius,
      32,  // Más segmentos = más suave
      32
    );

    const material = MaterialLibrary.getByArea(data.area, 'node');
    const node = new THREE.Mesh(geometry, material);
    
    node.position.copy(position);
    node.userData = {
      type: 'node',
      subjectData: data
    };

    // 2. ✨ EFECTO HOLOGRÁFICO: Wireframe exterior + Bordes
    MaterialLibrary.applyHolographicEffect(node, {
      wireframeScale: 1.1,  // 10% más grande
      edgesOpacity: 0.4
    });

    // 3. Anillos decorativos (wireframe)
    const innerRing = this.createRing(
      config.rings.inner.min,
      config.rings.inner.max,
      material.color,
      0.4
    );
    node.add(innerRing);

    const outerRing = this.createRing(
      config.rings.outer.min,
      config.rings.outer.max,
      material.color,
      0.3
    );
    node.add(outerRing);

    this.parent.add(node);
    return node;
  }

  /**
   * Crear nodo central (más grande y brillante)
   */
  createCentralNode(position, data, radius) {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = MaterialLibrary.getByArea(data.id, 'central-node');
    
    const node = new THREE.Mesh(geometry, material);
    node.position.copy(position);
    node.userData = {
      type: 'central-node',
      areaData: data
    };

    // Efecto holográfico más prominente
    MaterialLibrary.applyHolographicEffect(node, {
      wireframeScale: 1.15,  // 15% más grande
      edgesOpacity: 0.5
    });

    // Múltiples anillos orbitales
    this.addOrbitalRings(node, radius);

    this.parent.add(node);
    return node;
  }

  /**
   * Crear nodo hoja (más pequeño)
   */
  createLeafNode(position, data, radius) {
    const geometry = new THREE.SphereGeometry(radius, 16, 16);
    const material = MaterialLibrary.getByArea(data.parentArea, 'leaf-node');
    
    const node = new THREE.Mesh(geometry, material);
    node.position.copy(position);
    node.userData = {
      type: 'leaf-node',
      leafData: data
    };

    // Efecto holográfico sutil
    MaterialLibrary.applyHolographicEffect(node, {
      wireframeScale: 1.08,
      edgesOpacity: 0.4
    });

    // Un solo anillo
    const ring = this.createRing(
      radius * 1.2,
      radius * 1.3,
      material.color,
      0.4
    );
    node.add(ring);

    this.parent.add(node);
    return node;
  }

  /**
   * Crear anillo decorativo (wireframe)
   */
  createRing(minRadius, maxRadius, color, opacity) {
    const geometry = new THREE.RingGeometry(minRadius, maxRadius, 24);
    const material = MaterialLibrary.createRing(color, opacity);
    
    const ring = new THREE.Mesh(geometry, material);
    ring.rotation.x = Math.PI / 2;
    
    return ring;
  }

  /**
   * Agregar anillos orbitales (para nodos centrales)
   */
  addOrbitalRings(node, baseRadius) {
    const ringConfigs = [
      { radius: baseRadius * 1.3, opacity: 0.5, rotationSpeed: 0.01 },
      { radius: baseRadius * 1.6, opacity: 0.4, rotationSpeed: -0.008 },
      { radius: baseRadius * 1.9, opacity: 0.3, rotationSpeed: 0.006 }
    ];

    ringConfigs.forEach(config => {
      const geometry = new THREE.RingGeometry(
        config.radius * 0.95,
        config.radius * 1.05,
        32
      );

      const material = new THREE.MeshBasicMaterial({
        color: node.material.color,
        transparent: true,
        opacity: config.opacity,
        wireframe: true,  // ← WIREFRAME
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending  // ← GLOW
      });

      const ring = new THREE.Mesh(geometry, material);
      ring.rotation.x = Math.PI / 2;
      ring.userData.rotationSpeed = config.rotationSpeed;

      node.add(ring);
    });
  }
}