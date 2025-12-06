/**
 * ROOTSBUILDER.JS - Constructor de Raíces
 * Crea los conos invertidos que representan los fundamentos
 */

import * as THREE from 'three';
import { MaterialLibrary } from '../materials/MaterialLibrary.js';
import { TREE_CONFIG } from '../config/constants.js';

export class RootsBuilder {
  constructor(parent, rootsData) {
    this.parent = parent;
    this.rootsData = rootsData;
    this.nodes = [];
  }

  build() {
    const config = TREE_CONFIG.roots;
    const numRoots = this.rootsData.length;

    this.rootsData.forEach((data, i) => {
      // Posición en círculo
      const angle = (i / numRoots) * Math.PI * 2;
      const x = Math.cos(angle) * config.radius;
      const z = Math.sin(angle) * config.radius;

      // ⭐ Reemplazo del cono por cilindro
      const geometry = new THREE.CylinderGeometry(
        config.radiusTop,      // radiusTop
        config.radiusBottom,      // radiusBottom (igual → cilindro)
        config.height,    // height
        config.segments,  // radialSegments
        1,                // heightSegments
        false             // openEnded
      );

      const material = MaterialLibrary.createHologram(
        MaterialLibrary.getByArea(data.area, 'hologram').color,
        { wireframe: true , opacity: 0.5 }
      );

      const root = new THREE.Mesh(geometry, material);
      root.position.set(x, config.yPosition, z);

      // Guardar datos
      root.userData = {
        type: 'root',
        subjectData: data
      };

      // Edges brillantes
      const edges = new THREE.EdgesGeometry(geometry);
      const edgesMat = new THREE.LineBasicMaterial({
        color: 0x00ffff,       // color neón
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
      });

      const edgesLine = new THREE.LineSegments(edges, edgesMat);
      root.add(edgesLine);

      const haloMat = new THREE.LineBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
      });

      const haloLine = new THREE.LineSegments(edges.clone(), haloMat);
      haloLine.scale.multiplyScalar(1.1); // un poco más grande
      root.add(haloLine);

      this.parent.add(root);
      this.nodes.push(root);

      // Conexión al centro
      const radius = 2;                  // radio alrededor del centro
const angles = [0, 2*Math.PI/3, 4*Math.PI/3]; // tres conexiones
angles.forEach(a => {
    this.createConnection(
        new THREE.Vector3(x, 1.25, z), // inicio nodo
        new THREE.Vector3(0, 2, 0),    // centro/base
        material.color,                 // color
        0.1,                            // grosor
        1,                              // altura de curva
        0.5,                            // desviación lateral
        radius,                         // radio
        a                               // ángulo
    );
});
    });

    return this.nodes;
  }

  createConnection(start, end, color, thickness = 0.05, curveHeight = 1, curveDepth = 0.5, radius = 0, angle = 0) {
    // Ajustar el punto final si se define un radio
    const finalEnd = end.clone();
    if (radius > 0) {
        finalEnd.x += radius * Math.cos(angle);
        finalEnd.z += radius * Math.sin(angle);
    }

    // Puntos de control para la curva tipo "S" vertical
    const control1 = new THREE.Vector3(
        start.x,
        start.y + curveHeight,        // primera subida
        start.z + curveDepth           // desviación adelante/atrás
    );

    const control2 = new THREE.Vector3(
        finalEnd.x,
        finalEnd.y - curveHeight * 0.5,    // bajada final
        finalEnd.z - curveDepth             // desviación opuesta
    );

    // Curva cúbica tipo "S" vertical
    const curveS = new THREE.CubicBezierCurve3(start, control1, control2, finalEnd);

    // Generar geometría tubular
    const tubularSegments = 60;
    const geometry = new THREE.TubeGeometry(curveS, tubularSegments, thickness, 8, false);

    // Material tipo neón
    const material = MaterialLibrary.createLine(color, { opacity: 0.8, blending: THREE.AdditiveBlending });

    const tube = new THREE.Mesh(geometry, material);

    // Añadir a la escena
    this.parent.add(tube);

    return tube;
}


}