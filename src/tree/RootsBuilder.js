import * as THREE from 'three';
import { TREE_CONFIG, COLORS } from '../config/constants.js';

export class RootsBuilder {
  constructor(parent) {
    this.parent = parent;
    this.connections = [];
  }

  build() {
    const config = TREE_CONFIG.roots;
    const numRoots = config.count; // Usar directamente el número de raíces del config

    // Crear las conexiones sin nodos físicos
    for (let i = 0; i < numRoots; i++) {
      // Posición en círculo (punto de inicio de cada raíz)
      const angle = (i / numRoots) * Math.PI * 2;
      const x = Math.cos(angle) * config.radius;
      const z = Math.sin(angle) * config.radius;

      // Punto de inicio en el suelo
      const startPoint = new THREE.Vector3(x, config.yPosition, z);

      // 8 conexiones por raíz (como antes)
      const angles = [
        0,                    // 0°
        2 * Math.PI / 5,      // 72°
        4 * Math.PI / 5,      // 144°
        6 * Math.PI / 5,      // 216°
        8 * Math.PI / 5       // 288°
      ];

      const thicknesses = [0.08, 0.07, 0.09, 0.06, 0.09];

      angles.forEach((a, idx) => {
        // Variaciones para raíces más naturales
        const h = 3.5 + Math.random() * 3.5;  // altura variable
        const d = 0.5 + Math.random() * 0.5;  // desviación lateral
        const r = 1;

        const connection = this.createConnection(
          startPoint,
          new THREE.Vector3(0, 4, 0),   
          COLORS.areas.fundamentos,       
          thicknesses[idx],
          h,
          d,
          r,
          a
        );

        this.connections.push(connection);
      });
    }

    return []; 
  }

  createConnection(start, end, color, thickness, curveHeight, curveDepth, radius, angle) {
    // Ajustar el punto final si se define un radio
    const finalEnd = end.clone();
    if (radius > 0) {
      finalEnd.x += radius * Math.cos(angle);
      finalEnd.z += radius * Math.sin(angle);
    }

    // Puntos de control para la curva tipo "S" vertical
    const control1 = new THREE.Vector3(
      (start.x + finalEnd.x) * 0.9,
      start.y + curveHeight * 0.3,
      (start.z + finalEnd.z) * 0.7
    );

    const control2 = new THREE.Vector3(
      (start.x + finalEnd.x) * 0.6,
      finalEnd.y - curveHeight * 0.7,
      (start.z + finalEnd.z) * 0.6
    );

    // Curva cúbica tipo "S" vertical
    const curveS = new THREE.CubicBezierCurve3(start, control1, control2, finalEnd);

    // Generar geometría tubular
    const tubularSegments = 32;
    const geometry = new THREE.TubeGeometry(curveS, tubularSegments, thickness, 16, false);

    const material = new THREE.MeshPhongMaterial({
      color: color,
      transparent: true,
      opacity: 0.2,
      emissive: color,
      emissiveIntensity: 0.6,
      shininess: 100,
      wireframe: true,
      side: THREE.DoubleSide
    });

    const tube = new THREE.Mesh(geometry, material);
    const edgesGeometry = new THREE.EdgesGeometry(geometry);
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.2,
    });
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    tube.add(edges);

    this.parent.add(tube);

    return tube;
  }

  update(time) {
    // Animar las conexiones si es necesario (pulso de emisión)
    this.connections.forEach((connection, index) => {
      if (connection.material && connection.material.emissive) {
        const baseIntensity = 0.6;
        connection.material.emissiveIntensity =
          baseIntensity + Math.sin(time * 0.5 + index * 0.5) * 0.2;
      }
    });
  }

  dispose() {
    this.connections.forEach(connection => {
      this.parent.remove(connection);
      if (connection.geometry) connection.geometry.dispose();
      if (connection.material) connection.material.dispose();
    });
    this.connections = [];
  }
}