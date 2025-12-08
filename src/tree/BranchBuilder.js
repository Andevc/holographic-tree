/**
 * BRANCHBUILDER.JS - Constructor de Ramas Holográficas
 * =====================================================
 * 
 * NUEVO: Inspirado en index2.html
 * - Curvas suaves CatmullRom con múltiples puntos de control
 * - Radio variable (grueso→delgado)
 * - Anillos holográficos a lo largo
 * - Partículas flotantes
 * - Bordes brillantes
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
    this.branchGroups = [];
    this.nodeBuilder = new NodeBuilder(parent);
  }

  build() {
    console.log('🌿 Construyendo ramas holográficas...');
    
    const branchKeys = Object.keys(this.branchesData);
    const numBranches = branchKeys.length;

    branchKeys.forEach((key, branchIndex) => {
      const branchData = this.branchesData[key];
      const numSubjects = branchData.length;

      // Crear grupo para esta rama completa
      const branchGroup = new THREE.Group();
      branchGroup.name = `Branch_${key}`;

      // Configuración de la rama
      const config = this.getBranchConfig(branchIndex, numBranches, numSubjects);
      
      // Crear curva principal de la rama
      const curve = this.createBranchCurve(config);
      
      // Crear tubo con radio variable
      const tube = this.createHolographicTube(curve, config.color, config.startRadius, config.endRadius);
      branchGroup.add(tube);
      this.branches.push(tube);
      
      // Crear anillos holográficos
      this.createBranchRings(curve, config.color, branchGroup);
      
      // Crear partículas flotantes
      this.createBranchParticles(curve, config.color, branchGroup);
      
      // Crear nodos a lo largo de la rama
      this.createNodesAlongBranch(curve, branchData, branchGroup);
      
      // Agregar grupo a la escena
      this.parent.add(branchGroup);
      this.branchGroups.push(branchGroup);
    });

    console.log(`  ✓ ${this.branches.length} ramas creadas`);
    console.log(`  ✓ ${this.nodes.length} nodos en ramas`);

    return { nodes: this.nodes, branches: this.branches };
  }

  /**
   * Obtener configuración para cada rama
   */
  getBranchConfig(branchIndex, totalBranches, numSubjects) {
    const baseAngle = (branchIndex / totalBranches) * Math.PI * 2;
    const branchLength = 6 + numSubjects * 0.4;  // ⬆️ Más largo según materias
    const startY = TREE_CONFIG.branches.startY;
    const heightSpread = TREE_CONFIG.branches.spread;

    // Puntos de control para la curva (5 puntos = curva suave tipo "S")
    const points = [
      // Punto inicial (desde el tronco)
      new THREE.Vector3(0, startY, 0),
      
      // Punto de control 1 (salida del tronco)
      new THREE.Vector3(
        Math.cos(baseAngle) * (branchLength * 0.25),
        startY + 1 + branchIndex * heightSpread * 0.3,
        Math.sin(baseAngle) * (branchLength * 0.25)
      ),
      
      // Punto de control 2 (curva media más pronunciada)
      new THREE.Vector3(
        Math.cos(baseAngle) * (branchLength * 0.5) + (Math.random() - 0.5) * 0.8,
        startY + 2.5 + branchIndex * heightSpread * 0.6,
        Math.sin(baseAngle) * (branchLength * 0.5) + (Math.random() - 0.5) * 0.8
      ),
      
      // Punto de control 3 (cerca del final)
      new THREE.Vector3(
        Math.cos(baseAngle) * (branchLength * 0.75) + (Math.random() - 0.5) * 0.5,
        startY + 3.5 + branchIndex * heightSpread * 0.8,
        Math.sin(baseAngle) * (branchLength * 0.75) + (Math.random() - 0.5) * 0.5
      ),
      
      // Punto final
      new THREE.Vector3(
        Math.cos(baseAngle) * branchLength,
        startY + 4 + branchIndex * heightSpread,
        Math.sin(baseAngle) * branchLength
      )
    ];

    // Obtener color según área
    const area = Object.values(this.branchesData)[branchIndex][0]?.area || 'fundamentos';
    const color = MaterialLibrary.getByArea(area, 'tube').color;

    return {
      points,
      color,
      startRadius: 0.2,  // ⬆️ Más grueso en la base
      endRadius: 0.04,   // ⬆️ Más grueso en la punta
      branchIndex,
      area
    };
  }

  /**
   * Crear curva suave CatmullRom
   */
  createBranchCurve(config) {
    const curve = new THREE.CatmullRomCurve3(config.points);
    curve.tension = 0.5; // Tensión de la curva (0.5 = suave)
    return curve;
  }

  /**
   * Crear tubo holográfico con radio variable
   */
  createHolographicTube(curve, color, startRadius, endRadius) {
    const segments = 100;
    const radialSegments = 16;

    // Crear geometría base
    const tubeGeometry = new THREE.TubeGeometry(
      curve,
      segments,
      1, // Radio base (lo escalaremos después)
      radialSegments,
      false
    );

    // ⭐ CLAVE: Aplicar radio variable manualmente
    const positions = tubeGeometry.attributes.position;
    const vertexCount = positions.count;
    const segmentCount = segments + 1;

    const normals = tubeGeometry.attributes.normal;

for (let i = 0; i < vertexCount; i++) {
  const segmentIndex = Math.floor(i / radialSegments);
  const t = segmentIndex / segments;

  // Radio interpolado
  const radius = startRadius * (1 - t) + endRadius * t;

  // Vector normal
  const nx = normals.getX(i);
  const ny = normals.getY(i);
  const nz = normals.getZ(i);

  // Centro de la curva en este punto
  const baseX = curve.getPoint(t).x;
  const baseY = curve.getPoint(t).y;
  const baseZ = curve.getPoint(t).z;

  // Nueva posición = centro + normal * radio
  positions.setXYZ(
    i,
    baseX + nx * radius,
    baseY + ny * radius,
    baseZ + nz * radius
  );
}

positions.needsUpdate = true;
tubeGeometry.computeVertexNormals();

    positions.needsUpdate = true;
    tubeGeometry.computeVertexNormals();

    // Material holográfico Phong
    const material = new THREE.MeshPhongMaterial({
      color: color,
      transparent: true,
      opacity: 0.4,
      emissive: color,
      emissiveIntensity: 0.5,
      shininess: 100,
      side: THREE.DoubleSide
    });

    const tube = new THREE.Mesh(tubeGeometry, material);

    // ✨ Agregar bordes brillantes
    const edgesGeometry = new THREE.EdgesGeometry(tubeGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.8,
      linewidth: 2
    });
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    tube.add(edges);

    return tube;
  }

  /**
   * Crear anillos holográficos a lo largo de la rama
   */
  createBranchRings(curve, color, parent) {
    const ringCount = 20;  // ⬆️ Más anillos
    const points = curve.getPoints(ringCount);

    points.forEach((point, i) => {
      // Solo cada 3 anillos (no saturar)
      if (i % 3 !== 0) return;

      // Radio del anillo (más grande en la base, más pequeño en la punta)
      const t = i / ringCount;
      const ringRadius = 0.35 * (1 - t) + 0.12 * t;  // ⬆️ Más grandes

      // Crear TorusGeometry
      const ringGeometry = new THREE.TorusGeometry(
        ringRadius,     // radio
        0.02,           // grosor
        8,              // segmentos radiales
        32              // segmentos tubulares
      );

      const ringMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.4 - i * 0.015,
        wireframe: true
      });

      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.copy(point);

      // Orientar perpendicular a la tangente
      if (i < points.length - 1) {
        const tangent = new THREE.Vector3()
          .subVectors(points[i + 1], point)
          .normalize();
        ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
      }

      // Guardar para animación
      ring.userData.rotationSpeed = 0.01 * (i % 2 === 0 ? 1 : -1);

      parent.add(ring);
    });
  }

  /**
   * Crear partículas que fluyen por la rama
   */
  createBranchParticles(curve, color, parent) {
    const particleCount = 40;  // ⬆️ Más partículas
    const points = curve.getPoints(particleCount);

    points.forEach((point, i) => {
      const particleGeo = new THREE.SphereGeometry(0.04, 8, 8);  // ⬆️ Más grandes
      const particleMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      });

      const particle = new THREE.Mesh(particleGeo, particleMat);
      particle.position.copy(point);

      // Guardar info para animación
      particle.userData.originalPos = point.clone();
      particle.userData.offset = Math.random() * Math.PI * 2;
      particle.userData.progress = i / particleCount;

      parent.add(particle);
    });
  }

  /**
   * Crear nodos a lo largo de la rama
   */
  createNodesAlongBranch(curve, branchData, parent) {
    const numNodes = branchData.length;

    branchData.forEach((data, i) => {
      // Posición a lo largo de la curva
      const t = (i + 1) / (numNodes + 1);
      const pos = curve.getPoint(t);

      // Pequeña variación radial
      const angle = Math.random() * Math.PI * 2;
      const offset = 0.3;
      pos.x += Math.cos(angle) * offset;
      pos.z += Math.sin(angle) * offset;

      // Crear nodo
      const node = this.nodeBuilder.createNode(pos, data);
      this.nodes.push(node);

      // Crear línea de conexión
      this.createConnectionLine(pos, curve.getPoint(t), data.area, parent);
    });
  }

  /**
   * Crear línea de conexión de nodo a rama
   */
  createConnectionLine(nodePos, branchPos, area, parent) {
    const points = [branchPos, nodePos];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    
    const color = MaterialLibrary.getByArea(area, 'line').color;
    const material = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });

    const line = new THREE.Line(geometry, material);
    parent.add(line);
  }

  /**
   * Actualizar animaciones (llamar desde TreeManager)
   */
  update(time) {
    this.branchGroups.forEach(group => {
      group.traverse(object => {
        // Animar anillos
        if (object.userData.rotationSpeed) {
          object.rotation.z += object.userData.rotationSpeed;
        }

        // Animar partículas
        if (object.userData.progress !== undefined) {
          const offset = object.userData.offset;
          object.position.y = object.userData.originalPos.y + 
            Math.sin(time * 2 + offset) * 0.05;
        }
      });
    });
  }

  /**
   * Limpiar recursos
   */
  dispose() {
    this.branchGroups.forEach(group => {
      this.parent.remove(group);
      group.traverse(object => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(m => m.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    });
  }
}