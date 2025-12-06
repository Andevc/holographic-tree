/**
 * BRANCHBUILDER.JS - Constructor de Ramas
 * Crea los tubos curvos que representan especialidades
 */

import * as THREE from 'three';
import { MaterialLibrary } from '../materials/MaterialLibrary.js';
import { NodeBuilder } from './NodeBuilder.js';
import { TREE_CONFIG } from '../config/constants.js';

export class BranchBuilder {
  constructor(parent, branchesData) {
    this.parent = parent;
    this.branchesData = branchesData;
    this.nodes = [];
    this.branches = [];
    this.nodeBuilder = new NodeBuilder(parent);
  }

  build() {
    const config = TREE_CONFIG.branches;
    const branchKeys = Object.keys(this.branchesData);
    const numBranches = branchKeys.length;

    branchKeys.forEach((key, branchIndex) => {
      const branchData = this.branchesData[key];
      const numSubjects = branchData.length;

      // Ángulo de esta rama
      const baseAngle = (branchIndex / numBranches) * Math.PI * 2;

      // Punto de inicio (desde el tronco)
      const startPos = new THREE.Vector3(0, config.startY, 0);

      // Punto final (dirección de la rama)
      const branchLength = config.length + numSubjects * 0.3;
      const endX = Math.cos(baseAngle) * branchLength;
      const endY = config.startY + 1 + branchIndex * config.spread;
      const endZ = Math.sin(baseAngle) * branchLength;
      const endPos = new THREE.Vector3(endX, endY, endZ);

      // Crear tubo curvo
      this.createCurvedBranch(startPos, endPos, branchData[0].area);

      // Crear nodos a lo largo de la rama
      branchData.forEach((data, i) => {
        const t = (i + 1) / (numSubjects + 1);
        const pos = new THREE.Vector3().lerpVectors(startPos, endPos, t);

        // Pequeña variación aleatoria
        pos.x += (Math.random() - 0.5) * 0.5;
        pos.z += (Math.random() - 0.5) * 0.5;

        const node = this.nodeBuilder.createNode(pos, data);
        this.nodes.push(node);
      });
    });

    return { nodes: this.nodes, branches: this.branches };
  }

  createCurvedBranch(start, end, area) {
    // Punto de control para la curva
    const mid = new THREE.Vector3().lerpVectors(start, end, 0.5);
    mid.y += TREE_CONFIG.branches.curvature;

    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);

    // Crear tubo
    const tubeGeometry = new THREE.TubeGeometry(
      curve,
      TREE_CONFIG.branches.segments,
      TREE_CONFIG.branches.tubeRadius,
      TREE_CONFIG.branches.radialSegments,
      false
    );

    const material = MaterialLibrary.getByArea(area, 'tube');
    const tube = new THREE.Mesh(tubeGeometry, material);

    // Agregar wireframe overlay
    const wireframeGeo = new THREE.EdgesGeometry(tubeGeometry);
    const wireframeMat = MaterialLibrary.createEdges(material.color, 0.4);
    const wireframe = new THREE.LineSegments(wireframeGeo, wireframeMat);
    tube.add(wireframe);

    this.parent.add(tube);
    this.branches.push(tube);
  }
}