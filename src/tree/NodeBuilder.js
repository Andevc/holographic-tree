/**
 * NODEBUILDER.JS - Constructor de Nodos
 * Crea las esferas que representan materias individuales
 */

import * as THREE from 'three';
import { MaterialLibrary } from '../materials/MaterialLibrary.js';
import { TREE_CONFIG } from '../config/constants.js';

export class NodeBuilder {
  constructor(parent) {
    this.parent = parent;
  }

  createNode(position, data) {
    const config = TREE_CONFIG.nodes;

    // Crear esfera principal
    const geometry = new THREE.SphereGeometry(
      config.radius,
      config.segments,
      config.segments
    );

    const material = MaterialLibrary.getByArea(data.area, 'node');
    const node = new THREE.Mesh(geometry, material);

    node.position.copy(position);
    node.userData = {
      type: 'node',
      subjectData: data
    };

    // Anillo interno
    const innerRing = this.createRing(
      config.rings.inner.min,
      config.rings.inner.max,
      material.color,
      config.rings.inner.opacity
    );
    node.add(innerRing);

    // Anillo externo
    const outerRing = this.createRing(
      config.rings.outer.min,
      config.rings.outer.max,
      material.color,
      config.rings.outer.opacity
    );
    node.add(outerRing);

    this.parent.add(node);
    return node;
  }

  createRing(minRadius, maxRadius, color, opacity) {
    const geometry = new THREE.RingGeometry(minRadius, maxRadius, 24);
    const material = MaterialLibrary.createRing(color, opacity);
    const ring = new THREE.Mesh(geometry, material);
    ring.rotation.x = Math.PI / 2;
    return ring;
  }
}

