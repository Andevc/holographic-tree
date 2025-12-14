/**
 * TRUNKNUILDER.JS - Constructor del Tronco con Nodos Orbitales
 * ============================================================
 * 
 * ACTUALIZADO: Nodos distribuidos alrededor del tronco
 */

import * as THREE from 'three';
import { NodeBuilder } from './NodeBuilder.js';
import { TREE_CONFIG, COLORS } from '../config/constants.js';

export class TrunkBuilder {
  constructor(parent, trunkData) {
    this.parent = parent;
    this.trunkData = trunkData;
    this.nodes = [];
    this.nodeBuilder = new NodeBuilder(parent);
    this.trunkGroup = new THREE.Group();
    this.trunkGroup.name = 'TrunkGroup';
    this.trunkMesh = null;
    this.trunkCurve = null;
  }

  build() {

    this.createTrunkCurve();
    this.createTrunkTube();

    this.parent.add(this.trunkGroup);
    return this.nodes;
  }

  createTrunkCurve() {
    const config = TREE_CONFIG.trunk;
    const startY = config.startY;
    const endY = config.height;

    const points = [
      new THREE.Vector3(0, startY, 0),
      new THREE.Vector3(0, startY + 7, 0),
      new THREE.Vector3(-1, endY - 7, 0.5),
      new THREE.Vector3(0.5, endY, -2)
    ];

    this.trunkCurve = new THREE.CatmullRomCurve3(points);
  }

 
  getTrunkCurve() {
    return this.trunkCurve;
  }

  createTrunkTube() {
    const config = TREE_CONFIG.trunk;
    const baseRadius = config.radiusBottom;
    const topRadius = config.radiusTop;

    const tubeGeometry = new THREE.TubeGeometry(
      this.trunkCurve,
      64,
      baseRadius,
      16,
      false
    );

    const pos = tubeGeometry.attributes.position;
    const vertexCount = pos.count;

    for (let i = 0; i < vertexCount; i++) {
      const t = i / (vertexCount - 1);
      const scale = baseRadius + (topRadius - baseRadius) * t;
      const x = pos.getX(i);
      const z = pos.getZ(i);
      pos.setX(i, x * (scale / baseRadius));
      pos.setZ(i, z * (scale / baseRadius));
    }

    tubeGeometry.attributes.position.needsUpdate = true;
    tubeGeometry.computeVertexNormals();

    const tubeMaterial = new THREE.MeshPhongMaterial({
      color: COLORS.areas.fundamentos,
      transparent: true,
      opacity: 0.6,
      emissive: COLORS.areas.fundamentos,
      emissiveIntensity: 0.6,
      shininess: 150
    });

    this.trunkMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);

    const edgesGeometry = new THREE.EdgesGeometry(tubeGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: COLORS.areas.fundamentos,
      linewidth: 0.5,
    });
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    this.trunkMesh.add(edges);

    this.trunkGroup.add(this.trunkMesh);
  }

  update(time) {    
    if (this.trunkMesh && this.trunkMesh.material) {
      const baseIntensity = 0.6;
      this.trunkMesh.material.emissiveIntensity =
        baseIntensity + Math.sin(time * 0.5) * 0.2;
    }
  }

  getTrunkMesh() {
    return this.trunkMesh;
  }

  dispose() {
    this.trunkGroup.traverse(object => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(m => m.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
    this.parent.remove(this.trunkGroup);
  }
}