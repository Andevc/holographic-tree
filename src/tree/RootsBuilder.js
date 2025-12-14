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
    const numRoots = config.count;

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
        { wireframe: false, opacity: 1 }
      );

      const root = new THREE.Mesh(geometry, material);
      root.position.set(x, config.yPosition, z);

      // Guardar datos
      root.userData = {
        type: 'root',
        subjectData: data
      };
      MaterialLibrary.applyHolographicEffect(root, {
        wireframeScale: 1.05,
        edgesOpacity: 0.7
      });

      // Agregar halo adicional (opcional)
      const haloGeometry = new THREE.EdgesGeometry(geometry);
      const haloMaterial = new THREE.LineBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending  // ← CLAVE
      });
      const haloLine = new THREE.LineSegments(haloGeometry, haloMaterial);
      haloLine.scale.multiplyScalar(1.1);
      root.add(haloLine);
      // Edges brillantes
      const edges = new THREE.EdgesGeometry(geometry);
      const edgesMat = new THREE.LineBasicMaterial({
        color: 0x00ffff,       // color neón
        transparent: false,
        opacity: 1,
        blending: THREE.AdditiveBlending
      });

      const edgesLine = new THREE.LineSegments(edges, edgesMat);
      root.add(edgesLine);

      const haloMat = new THREE.LineBasicMaterial({
        color: 0x00ffff,
        transparent: false,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
      });



      this.parent.add(root);
      this.nodes.push(root);

      // Conexión al centro
      // Conexión al centro (raíces hacia el tronco)
      // más cerca del tronco para un efecto de convergencia
      const angles = [
        0,
        2 * Math.PI / 8,
        4 * Math.PI / 8,
        6 * Math.PI / 8,
        8 * Math.PI / 8,
        10 * Math.PI / 8,
        12 * Math.PI / 8,
        14 * Math.PI / 8
      ];
      const thicknesses = [0.05, 0.07, 0.1, 0.04, 0.06, 0.01, 0.02, 0.03];
      angles.forEach((a, i) => {

        // Pequeñas variaciones para raíces más naturales
        const h = 3.5 + Math.random() * 3.5;  // altura variable
        const d = 0.5 + Math.random() * 0.5;  // desviación lateral
        const r = 1;

        this.createConnection(
          new THREE.Vector3(x, 0.5, z),     // inicio nodo
          new THREE.Vector3(0, 3.6, 0),   // tronco
          material.color,
          thicknesses[i],
          h,
          d,
          r,
          a
        );
      });
    });

    return this.nodes;
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
      (start.x + finalEnd.x) * 0.9,      // 30% hacia el tronco
      start.y + curveHeight * 0.5,             // subida
      (start.z + finalEnd.z) * 0.7       // 30% hacia adentro
    );

    // Segundo control: ya muy cerca del tronco
    const control2 = new THREE.Vector3(
      (start.x + finalEnd.x) * 0.6,      // 70% hacia el tronco
      finalEnd.y - curveHeight * 0.7,    // ligera bajada
      (start.z + finalEnd.z) * 0.6
    );

    // Curva cúbica tipo "S" vertical
    const curveS = new THREE.CubicBezierCurve3(start, control1, control2, finalEnd);

    // Generar geometría tubular
    const tubularSegments = 60;
    const geometry = new THREE.TubeGeometry(curveS, tubularSegments, thickness, 64, false);

    // Material tipo neón
    const material = MaterialLibrary.createLine(color, { opacity: 0.5, blending: THREE.AdditiveBlending });

    const tube = new THREE.Mesh(geometry, material);

    // Añadir a la escena
    this.parent.add(tube);

    return tube;
  }


}