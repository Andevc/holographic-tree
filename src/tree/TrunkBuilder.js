/**
 * TRUNKBUILDER.JS - Constructor del Tronco
 * Crea el cilindro central con anillos decorativos
 */

import * as THREE from 'three';
import { MaterialLibrary } from '../materials/MaterialLibrary.js';
import { NodeBuilder } from './NodeBuilder.js';
import { TREE_CONFIG, COLORS } from '../config/constants.js';

export class TrunkBuilder {
  constructor(parent, trunkData) {
    this.parent = parent;
    this.trunkData = trunkData;
    this.nodes = [];
    this.nodeBuilder = new NodeBuilder(parent);
  }

  build() {
    const config = TREE_CONFIG.trunk;

    // Crear cilindro principal (wireframe)
    const geometry = new THREE.CylinderGeometry(
      config.radiusTop,
      config.radiusBottom,
      config.height,
      config.segments,
      config.heightSegments,
    );

    const material = MaterialLibrary.createHologram(COLORS.areas.fundamentos, {
      wireframe: false,
      opacity: 0.9
    });

    const trunk = new THREE.Mesh(geometry, material);
    trunk.position.y = config.yPosition;
    trunk.userData = { type: 'trunk' };
    this.parent.add(trunk);

    // Crear anillos horizontales decorativos
    for (let i = 0; i < config.rings.count; i++) {
      const ringGeometry = new THREE.TorusGeometry(
        config.radiusBottom + 0.3 - (i * 0.2),
        config.rings.thickness,
        16,
        64
      );

      const ringMaterial = new THREE.MeshStandardMaterial({
        color: COLORS.areas.fundamentos,
        emissive: COLORS.areas.fundamentos,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.8
      });

      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = config.rings.startY + i * config.rings.spacing;
      this.parent.add(ring);
      
    }

    // Crear nodos en el tronco
    const nodeConfig = TREE_CONFIG.trunkNodes;
    this.trunkData.forEach((data, i) => {
      const y = nodeConfig.startY + 0 * nodeConfig.spacing;
      const angle = (i / this.trunkData.length) * Math.PI * 2;
      const x = Math.cos(angle) * nodeConfig.radius;
      const z = Math.sin(angle) * nodeConfig.radius;

      const node = this.nodeBuilder.createNode(
        new THREE.Vector3(x, y, z),
        data
      );

      this.nodes.push(node);
      
    });

    return this.nodes;
  }
}