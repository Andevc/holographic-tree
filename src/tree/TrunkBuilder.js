/**
 * TRUNKBUILDER.JS - Constructor del Tronco Curvo Holográfico
 * ===========================================================
 * 
 * BASADO EN index2.html:
 * - Tronco curvo usando TubeGeometry
 * - Anillos TorusGeometry siguiendo la curva
 * - Partículas flotantes alrededor
 * - Líneas verticales de textura
 * - Material Phong translúcido
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

    // Grupo para todo el tronco
    this.trunkGroup = new THREE.Group();
    this.trunkGroup.name = 'TrunkGroup';

    // Referencias
    this.trunkMesh = null;
    this.trunkCurve = null;
    this.rings = [];
    this.particles = [];
  }

  build() {
    console.log('🌲 Construyendo tronco curvo...');

    // 1. Crear curva principal del tronco
    this.createTrunkCurve();

    // 2. Crear tubo siguiendo la curva
    this.createTrunkTube();

    // 3. Crear anillos decorativos a lo largo de la curva
    this.createTrunkRings();

    // 4. Crear líneas verticales de textura
    this.createVerticalLines();

    // 5. Crear partículas flotantes
    this.createTrunkParticles();

    // 6. Crear nodos (materias del tronco) ALREDEDOR del tronco
    this.createTrunkNodes();

    // Agregar grupo completo a la escena
    this.parent.add(this.trunkGroup);

    console.log(`  ✓ Tronco creado con ${this.nodes.length} nodos`);
    console.log(`  ✓ ${this.rings.length} anillos decorativos`);
    console.log(`  ✓ ${this.particles.length} partículas`);

    return this.nodes;
  }

  /**
   * PASO 1: Crear curva del tronco (CubicBezier)
   * Similar a index2.html pero ajustado a nuestras coordenadas
   */
  createTrunkCurve() {
    const config = TREE_CONFIG.trunk;
    const startY = 4;               // Base del tronco
    const endY = config.yPosition + 10;  // Altura final (7)

    // Puntos de control para forma de "S"
    const points = [
      new THREE.Vector3(0, startY, 0),            // Base recta
      new THREE.Vector3(0, startY + 2, 0),  // Curva a la derecha y algo de profundidad
      new THREE.Vector3(-1, startY + 5, 0.5),    // Curva a la izquierda y profundidad contraria
      new THREE.Vector3(0.5, endY, -2)                // Fin en el centro
    ];

    // Curva suave que pasa por todos los puntos
    this.trunkCurve = new THREE.CatmullRomCurve3(points);

    console.log(`  ✓ Curva en forma de "S" creada desde Y=${startY} hasta Y=${endY}`);
  }

  /**
   * PASO 2: Crear tubo principal siguiendo la curva
   */
  createTrunkTube() {
    const config = TREE_CONFIG.trunk;

    const baseRadius = 1; // radio en la base
    const topRadius = 0.1;  // radio en la cima

    // Crear TubeGeometry siguiendo la curva
    const tubeGeometry = new THREE.TubeGeometry(
      this.trunkCurve,
      64,   // segmentos a lo largo de la curva
      baseRadius, // radio inicial (se escalará)
      16,   // segmentos radiales
      false
    );

    // Escalar los vértices para que el tronco se estreche hacia arriba
    const pos = tubeGeometry.attributes.position;
    const vertexCount = pos.count;

    for (let i = 0; i < vertexCount; i++) {
      const t = i / (vertexCount - 1); // 0 = base, 1 = cima
      const scale = baseRadius + (topRadius - baseRadius) * t;

      const x = pos.getX(i);
      const z = pos.getZ(i);

      pos.setX(i, x * (scale / baseRadius));
      pos.setZ(i, z * (scale / baseRadius));
    }

    tubeGeometry.attributes.position.needsUpdate = true;
    tubeGeometry.computeVertexNormals();

    // Material holográfico Phong
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
      description: 'Campo de estudio que abarca el procesamiento automático de información mediante sistemas computacionales.'
    };

    // Bordes brillantes
    const edgesGeometry = new THREE.EdgesGeometry(tubeGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: COLORS.areas.fundamentos,
      linewidth: 2
    });
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    this.trunkMesh.add(edges);

    // Agregar al grupo
    this.trunkGroup.add(this.trunkMesh);

    console.log('  ✓ Tubo principal curvo y cónico truncado creado');
  }

  /**
   * PASO 3: Crear anillos TorusGeometry a lo largo de la curva
   * IGUAL QUE index2.html
   */
  createTrunkRings() {
  const ringCount = 12;  // Número de anillos
  const trunkPoints = this.trunkCurve.getPoints(ringCount);

  trunkPoints.forEach((point, i) => {
    // Radio del anillo (más grande abajo, más pequeño arriba)
    const ringSize = 1 - i * 0.05;

    // Crear TorusGeometry
    const ringGeometry = new THREE.TorusGeometry(
      ringSize,      // radio
      0.025,         // grosor del tubo
      16,            // segmentos radiales
      64             // segmentos tubulares
    );

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: COLORS.areas.fundamentos,
      transparent: true,
      opacity: 0.4 - i * 0.02,
      wireframe: true
    });

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);

    // Posición en la curva
    ring.position.copy(point);

    // Orientar el anillo perpendicular a la tangente de la curva
    const t = i / (trunkPoints.length - 1);
    const tangent = this.trunkCurve.getTangent(t).normalize();

    // El eje "up" del torus es Y, alineamos con la tangente
    ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);

    // Guardamos para animación
    this.trunkGroup.add(ring);
    this.rings.push(ring);
  });

  console.log(`✓ ${this.rings.length} anillos creados`);
}

  /**
   * PASO 4: Crear líneas verticales de textura
   * Dan la sensación de "fibras" deal árbol
   */
  createVerticalLines() {
    const lineCount = 8;  // Número de líneas alrededor del tronco
    const trunkPoints = this.trunkCurve.getPoints(50);

    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2;

      // Crear puntos para la línea siguiendo la curva
      const linePoints = trunkPoints.map(p => {
        return new THREE.Vector3(
          p.x + Math.cos(angle) * 0.45,  // Offset radial
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

  /**
   * PASO 5: Crear partículas flotantes alrededor del tronco
   * IGUAL QUE index2.html
   */
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

      // Posición alrededor del punto de la curva
      particle.position.copy(point);
      particle.position.x += (Math.random() - 0.5) * 0.8;
      particle.position.z += (Math.random() - 0.5) * 0.8;

      // Guardar posición original para animación
      particle.userData.originalPos = particle.position.clone();
      particle.userData.offset = Math.random() * Math.PI * 2;

      this.trunkGroup.add(particle);
      this.particles.push(particle);
    });

    console.log(`  ✓ ${this.particles.length} partículas creadas`);
  }

  /**
   * PASO 6: Crear nodos (materias) ALREDEDOR del tronco
   * En lugar de un círculo plano, los distribuimos en espiral alrededor
   */
  createTrunkNodes() {
    const nodeConfig = TREE_CONFIG.trunkNodes;
    const numNodes = this.trunkData.length;

    this.trunkData.forEach((data, i) => {
      // Altura a lo largo del tronco
      const t = (i + 1) / (numNodes + 1);  // 0.2, 0.4, 0.6, 0.8...
      const posOnCurve = this.trunkCurve.getPoint(t);

      // Ángulo alrededor del tronco (espiral)
      const angle = (i / numNodes) * Math.PI * 2;

      // Posición radial alrededor del tronco
      const radius = nodeConfig.radius;
      const x = posOnCurve.x + Math.cos(angle) * radius;
      const y = posOnCurve.y;
      const z = posOnCurve.z + Math.sin(angle) * radius;

      // Crear nodo
      const node = this.nodeBuilder.createNode(
        new THREE.Vector3(x, y, z),
        data
      );

      this.nodes.push(node);

      // Crear línea de conexión al tronco
      this.createConnectionLine(node.position, posOnCurve);
    });
  }

  /**
   * Crear línea de conexión de nodo al tronco
   */
  createConnectionLine(nodePos, trunkPos) {
    // Curva suave entre nodo y tronco
    const midPoint = new THREE.Vector3().lerpVectors(nodePos, trunkPos, 0.5);
    midPoint.y += 0.2;  // Elevar el punto medio

    const curve = new THREE.QuadraticBezierCurve3(
      nodePos,
      midPoint,
      trunkPos
    );

    const points = curve.getPoints(20);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: COLORS.areas.fundamentos,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });

    const line = new THREE.Line(geometry, material);
    this.trunkGroup.add(line);
  }

  /**
   * Animar el tronco (llamar en el loop)
   */
  update(time) {
    // Animar anillos (rotación)
    this.rings.forEach((ring, i) => {
      ring.rotation.z += 0.005 * (i % 2 === 0 ? -1 : 1);
    });

    // Animar partículas (float)
    this.particles.forEach(particle => {
      const offset = particle.userData.offset;
      particle.position.y = particle.userData.originalPos.y +
        Math.sin(time * 2 + offset) * 0.05;
    });

    // Pulso del material del tronco
    if (this.trunkMesh && this.trunkMesh.material) {
      const baseIntensity = 0.6;
      this.trunkMesh.material.emissiveIntensity =
        baseIntensity + Math.sin(time * 0.5) * 0.2;
    }
  }

  /**
   * Obtener referencia al mesh del tronco (para raycast)
   */
  getTrunkMesh() {
    return this.trunkMesh;
  }

  /**
   * Limpiar recursos
   */
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