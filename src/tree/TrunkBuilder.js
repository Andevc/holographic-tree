/**
 * TRUNKNUILDER.JS - Constructor del Tronco con Nodos Orbitales
 * ============================================================
 * 
 * ACTUALIZADO: Nodos distribuidos alrededor del tronco
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
    this.trunkGroup = new THREE.Group();
    this.trunkGroup.name = 'TrunkGroup';
    this.trunkMesh = null;
    this.trunkCurve = null;
    this.rings = [];
    this.particles = [];
  }

  build() {
    console.log('🌲 Construyendo tronco curvo con nodos orbitales...');

    this.createTrunkCurve();
    this.createTrunkTube();
    this.createTrunkRings();
    this.createVerticalLines();
    this.createTrunkParticles();
    
    // ⭐ NUEVO: Crear nodos ORBITALES alrededor del tronco
    this.createOrbitalTrunkNodes();

    this.parent.add(this.trunkGroup);

    console.log(`  ✓ Tronco creado con ${this.nodes.length} nodos orbitales`);
    console.log(`  ✓ ${this.rings.length} anillos decorativos`);
    console.log(`  ✓ ${this.particles.length} partículas`);

    return this.nodes;
  }

  createTrunkCurve() {
    const config = TREE_CONFIG.trunk;
    const startY = 4;
    const endY = config.yPosition + 10;

    const points = [
      new THREE.Vector3(0, startY, 0),
      new THREE.Vector3(0, startY + 2, 0),
      new THREE.Vector3(-1, startY + 5, 0.5),
      new THREE.Vector3(0.5, endY, -2)
    ];

    this.trunkCurve = new THREE.CatmullRomCurve3(points);
    console.log(`  ✓ Curva en forma de "S" creada desde Y=${startY} hasta Y=${endY}`);
  }

  createTrunkTube() {
    const config = TREE_CONFIG.trunk;
    const baseRadius = 1;
    const topRadius = 0.1;

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
      opacity: 0.1,
      emissive: COLORS.areas.fundamentos,
      emissiveIntensity: 0.6,
      shininess: 150
    });

    this.trunkMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
    this.trunkMesh.userData = {
      type: 'trunk',
      name: 'Informática',
      description: 'Campo de estudio que abarca el procesamiento automático de información.'
    };

    const edgesGeometry = new THREE.EdgesGeometry(tubeGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: COLORS.areas.fundamentos,
      linewidth: 2
    });
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    this.trunkMesh.add(edges);

    this.trunkGroup.add(this.trunkMesh);
    console.log('  ✓ Tubo principal curvo creado');
  }

  createTrunkRings() {
    const ringCount = 12;
    const trunkPoints = this.trunkCurve.getPoints(ringCount);

    trunkPoints.forEach((point, i) => {
      const ringSize = 1 - i * 0.05;
      const ringGeometry = new THREE.TorusGeometry(ringSize, 0.025, 16, 64);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: COLORS.areas.fundamentos,
        transparent: true,
        opacity: 0.4 - i * 0.02,
        wireframe: true
      });

      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.copy(point);

      const t = i / (trunkPoints.length - 1);
      const tangent = this.trunkCurve.getTangent(t).normalize();
      ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);

      this.trunkGroup.add(ring);
      this.rings.push(ring);
    });

    console.log(`  ✓ ${this.rings.length} anillos creados`);
  }

  createVerticalLines() {
    const lineCount = 8;
    const trunkPoints = this.trunkCurve.getPoints(50);

    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2;
      const linePoints = trunkPoints.map(p => {
        return new THREE.Vector3(
          p.x + Math.cos(angle) * 0.45,
          p.y,
          p.z + Math.sin(angle) * 0.45
        );
      });

      const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: COLORS.grid.secondary,
        transparent: true,
        opacity: 0.3
      });

      const line = new THREE.Line(lineGeometry, lineMaterial);
      this.trunkGroup.add(line);
    }

    console.log(`  ✓ ${lineCount} líneas de textura creadas`);
  }

  createTrunkParticles() {
    const particleCount = 50;
    const trunkPoints = this.trunkCurve.getPoints(particleCount);

    trunkPoints.forEach((point, i) => {
      const particleGeo = new THREE.SphereGeometry(0.03, 8, 8);
      const particleMat = new THREE.MeshBasicMaterial({
        color: COLORS.areas.fundamentos,
        transparent: true,
        opacity: 0.7
      });

      const particle = new THREE.Mesh(particleGeo, particleMat);
      particle.position.copy(point);
      particle.position.x += (Math.random() - 0.5) * 0.8;
      particle.position.z += (Math.random() - 0.5) * 0.8;
      particle.userData.originalPos = particle.position.clone();
      particle.userData.offset = Math.random() * Math.PI * 2;

      this.trunkGroup.add(particle);
      this.particles.push(particle);
    });

    console.log(`  ✓ ${this.particles.length} partículas creadas`);
  }

  /**
   * ⭐ NUEVO: Crear nodos en órbita alrededor del tronco
   * Similar a index2.html - distribuidos en espiral
   */
  createOrbitalTrunkNodes() {
    const nodeConfig = TREE_CONFIG.trunkNodes;
    const numNodes = this.trunkData.length;
    const orbitRadius = 1.5; // Radio de órbita alrededor del tronco

    this.trunkData.forEach((data, i) => {
      // Altura a lo largo del tronco
      const t = (i + 1) / (numNodes + 1);
      const pointOnCurve = this.trunkCurve.getPoint(t);

      // Ángulo alrededor del tronco (espiral)
      const angle = (i / numNodes) * Math.PI * 2 + i * 0.5;

      // Calcular sistema de coordenadas local perpendicular a la curva
      const tangent = this.trunkCurve.getTangent(t).normalize();
      const up = Math.abs(tangent.y) < 0.9 
        ? new THREE.Vector3(0, 1, 0) 
        : new THREE.Vector3(1, 0, 0);
      const right = new THREE.Vector3().crossVectors(tangent, up).normalize();
      const forward = new THREE.Vector3().crossVectors(right, tangent).normalize();

      // Posición orbital
      const orbitalOffset = new THREE.Vector3()
        .addScaledVector(right, Math.cos(angle) * orbitRadius)
        .addScaledVector(forward, Math.sin(angle) * orbitRadius);

      const nodePos = pointOnCurve.clone().add(orbitalOffset);

      // Crear nodo
      const node = this.nodeBuilder.createNode(nodePos, data);
      this.nodes.push(node);

      // Crear línea de conexión curva al tronco
      this.createCurvedConnectionLine(nodePos, pointOnCurve);
    });

    console.log(`  ✓ ${this.nodes.length} nodos orbitales creados`);
  }

  /**
   * Crear línea de conexión curva de nodo al tronco
   */
  createCurvedConnectionLine(nodePos, trunkPos) {
    const midPoint = new THREE.Vector3().lerpVectors(nodePos, trunkPos, 0.5);
    midPoint.y += 0.2;

    const curve = new THREE.QuadraticBezierCurve3(nodePos, midPoint, trunkPos);
    const points = curve.getPoints(30);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    
    const material = new THREE.LineBasicMaterial({
      color: COLORS.areas.fundamentos,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });

    const line = new THREE.Line(geometry, material);
    this.trunkGroup.add(line);

    // Puntos brillantes
    for (let j = 0; j < points.length; j += 3) {
      const dotGeo = new THREE.SphereGeometry(0.015, 6, 6);
      const dotMat = new THREE.MeshBasicMaterial({
        color: COLORS.areas.fundamentos,
        transparent: true,
        opacity: 0.7
      });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.copy(points[j]);
      this.trunkGroup.add(dot);
    }
  }

  update(time) {
    this.rings.forEach((ring, i) => {
      ring.rotation.z += 0.005 * (i % 2 === 0 ? -1 : 1);
    });

    this.particles.forEach(particle => {
      const offset = particle.userData.offset;
      particle.position.y = particle.userData.originalPos.y +
        Math.sin(time * 2 + offset) * 0.05;
    });

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