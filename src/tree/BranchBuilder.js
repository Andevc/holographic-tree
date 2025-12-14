import * as THREE from 'three';
import { MaterialLibrary } from '../materials/MaterialLibrary.js';
import { NodeBuilder } from './NodeBuilder.js';
import { TREE_CONFIG } from '../config/constants.js';

export class BranchBuilder {
  constructor(parent, clustersData) {
    this.parent = parent;
    this.clustersData = clustersData; 
    this.nodes = [];
    this.clusters = [];
    this.animatedObjects = [];
    this.nodeBuilder = new NodeBuilder(parent);
  }

  build() {
    const clusterKeys = Object.keys(this.clustersData);

    clusterKeys.forEach((key, index) => {
      const clusterData = this.clustersData[key];
      this.createBranchToCluster(clusterData, index, clusterKeys.length);
      this.createCluster(clusterData);
    });

    return { nodes: this.nodes, branches: this.clusters };
  }

  //Crear rama curva del tronco al cluster con variación orgánica
  createBranchToCluster(clusterData, branchIndex, totalBranches) {
    const config = TREE_CONFIG.branches;    
    const endPos = new THREE.Vector3(
      clusterData.position.x,
      clusterData.position.y,
      clusterData.position.z
    );

    const startPoint = new THREE.Vector3(0, clusterData.positionBranch.y, 0);

    // Calcular dirección hacia el cluster
    const direction = new THREE.Vector3()
      .subVectors(endPos, startPoint)
      .normalize();

    // Variables para crear curvas más orgánicas y variadas
    const curveFactor = 0.3 + (branchIndex % 3) * 0.15;
    const twistFactor = Math.sin(branchIndex * 1.3) * 2;
    const archHeight = 1.5 + (branchIndex % 4) * 0.5;

    // Perpendicular para agregar torsión
    const perpendicular = new THREE.Vector3(-direction.y, 0, direction.x).normalize();

    // Puntos de control para curva suave y VARIADA
    const points = [
      // Inicio: desde un punto específico del tronco
      startPoint.clone(),

      // Control 1: salida del tronco con dirección inicial + variación
      new THREE.Vector3(
        startPoint.x + direction.x * 1.5 + perpendicular.x * (twistFactor * 0.3),
        startPoint.y + 1.2,
        startPoint.z + direction.z * 1.5 + perpendicular.z * (twistFactor * 0.3)
      ),

      // Control 2: punto medio - elevado y curvado con TORSIÓN
      new THREE.Vector3(
        startPoint.x + (endPos.x - startPoint.x) * (0.35 + curveFactor * 0.1) + perpendicular.x * twistFactor,
        startPoint.y + (endPos.y - startPoint.y) * 0.1 + archHeight,
        startPoint.z + (endPos.z - startPoint.z) * (0.35 + curveFactor * 0.1) + perpendicular.z * twistFactor
      ),

      // Control 3: otro punto medio (para más suavidad) con desviación
      new THREE.Vector3(
        startPoint.x + (endPos.x - startPoint.x) * 0.7 + perpendicular.x * (twistFactor * 0.5),
        startPoint.y + (endPos.y - startPoint.y) * 0.9,  // ← CAMBIADO: quité archHeight
        startPoint.z + (endPos.z - startPoint.z) * 0.7 + perpendicular.z * (twistFactor * 0.5)
      ),

      // Control 4: acercándose al cluster
      new THREE.Vector3(
        endPos.x - direction.x * 1.2,
        endPos.y - 0.5,
        endPos.z - direction.z * 1.2
      ),

      // Final: posición exacta del cluster
      endPos.clone()
    ];

    // Crear curva CatmullRom con tensión variable
    const curve = new THREE.CatmullRomCurve3(points);
    curve.tension = 0.3 + (branchIndex % 5) * 0.05;

    // Crear tubo con radio variable
    const tubeGeometry = new THREE.TubeGeometry(
      curve,
      80,
      1,
      16,
      false
    );

    // Aplicar radio variable (más grueso → más delgado)
    const positions = tubeGeometry.attributes.position;
    const vertexCount = positions.count;
    const segments = config.segments;
    const startRadius = config.startRadius;
    const endRadius = config.endRadius;

    for (let i = 0; i < vertexCount; i++) {
      const segmentIndex = Math.floor(i / 16);
      const t = segmentIndex / segments;

      const radius = startRadius * Math.pow(1 - t, 1.5) + endRadius * t;

      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);

      const centerPoint = curve.getPoint(t);

      const dx = x - centerPoint.x;
      const dy = y - centerPoint.y;
      const dz = z - centerPoint.z;
      const length = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (length > 0) {
        positions.setXYZ(
          i,
          centerPoint.x + (dx / length) * radius,
          centerPoint.y + (dy / length) * radius,
          centerPoint.z + (dz / length) * radius
        );
      }
    }

    positions.needsUpdate = true;
    tubeGeometry.computeVertexNormals();

    // Material holográfico
    const color = MaterialLibrary.getByArea(clusterData.area, 'tube').color;
    const material = new THREE.MeshPhongMaterial({
      color: color,
      transparent: true,
      wireframe: false,
      opacity: 0.25,
      emissive: color,
      emissiveIntensity: 0.6,
      shininess: 100,
      side: THREE.DoubleSide
    });

    const tube = new THREE.Mesh(tubeGeometry, material);

    // Bordes brillantes
    const edgesGeometry = new THREE.EdgesGeometry(tubeGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: color,
      transparent: false,
      opacity: 1,
    });
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    tube.add(edges);

    this.parent.add(tube);
  }

  //Crear un cluster completo
  createCluster(data) {
    const group = new THREE.Group();
    group.name = `Cluster_${data.area}`;
    group.position.set(data.position.x, data.position.y, data.position.z);

    const config = TREE_CONFIG.clusters;

    // FIX: Obtener el color como número hexadecimal
    const materialData = MaterialLibrary.getByArea(data.area, 'hologram');
    const color = typeof materialData.color === 'number'
      ? materialData.color
      : (materialData.color.isColor ? materialData.color.getHex() : 0xffffff);

    // 1. Crear nodo central
    const centralNode = this.createCentralNode(color, data.name, data.area);
    group.add(centralNode);
    this.animatedObjects.push(centralNode);
    this.nodes.push(centralNode);

    // 2. Label del nodo central
    const centerLabel = this.createLabel(
      data.name,
      new THREE.Vector3(0, config.central.radius + 0.8, 0),
      color,
      true
    );
    group.add(centerLabel);

    // 3. Crear satélites CON LABELS
    const orbitRadius = config.orbit.radius;
    const satelliteCount = data.satellites.length;
    const angleStep = (Math.PI * 2) / satelliteCount;

    data.satellites.forEach((sat, i) => {
      const angle = i * angleStep;
      const x = Math.cos(angle) * orbitRadius;
      const z = Math.sin(angle) * orbitRadius;
      const y = Math.sin(i * config.orbit.floatSpeed) * config.orbit.floatAmount;

      // Crear satélite
      const satNode = this.createSatelliteNode(
        new THREE.Vector3(x, y, z),
        color,
        sat
      );
      group.add(satNode);
      this.animatedObjects.push(satNode);
      this.nodes.push(satNode);

      // Conexión al centro
      const connection = this.createConnection(
        new THREE.Vector3(x, y, z),
        new THREE.Vector3(0, 0, 0),
        color
      );
      group.add(connection);

      // Label para CADA satélite
      const satLabel = this.createLabel(
        sat.name,
        new THREE.Vector3(x, y + 0.4, z),
        color,
        false
      );
      satLabel.userData.satelliteIndex = i;
      group.add(satLabel);
    });

    this.parent.add(group);
    this.clusters.push(group);
  }

  //Crear nodo central del cluster (grande y brillante)
  createCentralNode(color, name, area) {
    const config = TREE_CONFIG.clusters.central;

    // Esfera principal
    const geometry = new THREE.SphereGeometry(
      config.radius,
      config.segments,
      config.segments
    );

    const material = new THREE.MeshPhongMaterial({
      color: color,
      transparent: true,
      opacity: config.opacity,
      emissive: color,
      emissiveIntensity: config.emissiveIntensity,
      shininess: 100
    });

    const node = new THREE.Mesh(geometry, material);
    node.userData = {
      type: 'cluster-central',
      name: name,
      area: area
    };

    // Wireframe exterior
    const wireGeo = new THREE.SphereGeometry(
      config.radius * 1.15,
      16,
      16
    );
    const wireMat = new THREE.MeshBasicMaterial({
      color: color,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    node.add(wire);

    // Anillos orbitales
    config.rings.forEach((ringConfig, i) => {
      const ringGeo = new THREE.RingGeometry(
        config.radius * ringConfig.radius * 0.95,
        config.radius * ringConfig.radius * 1.05,
        32
      );
      const ringMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: ringConfig.opacity,
        wireframe: true,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.userData.rotSpeed = 0.005 * (i % 2 === 0 ? 1 : -1);
      node.add(ring);
    });

    return node;
  }

  //Crear nodo satélite (pequeño, orbita alrededor del central)
  createSatelliteNode(position, color, satelliteData) {
    const config = TREE_CONFIG.clusters.satellite;

    // Esfera satélite
    const geometry = new THREE.SphereGeometry(
      config.radius,
      config.segments,
      config.segments
    );

    const material = new THREE.MeshPhongMaterial({
      color: color,
      transparent: true,
      opacity: config.opacity,
      emissive: color,
      emissiveIntensity: config.emissiveIntensity,
      shininess: config.shininess
    });

    const node = new THREE.Mesh(geometry, material);
    node.position.copy(position);
    node.userData = {
      type: 'cluster-satellite',
      satelliteData: satelliteData,
      originalY: position.y
    };

    // Wireframe exterior
    const wireGeo = new THREE.SphereGeometry(config.radius * 1.5, 8, 8);
    const wireMat = new THREE.MeshBasicMaterial({
      color: color,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    node.add(wire);



    return node;
  }

  //Crear conexión curva entre satélite y nodo central
  createConnection(from, to, color) {
    const config = TREE_CONFIG.clusters.connections;

    // Punto medio elevado para curva suave
    const mid = new THREE.Vector3().lerpVectors(from, to, 0.5);
    mid.y += config.curveHeight;

    // Curva cuadrática Bezier
    const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
    const points = curve.getPoints(30);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const material = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: config.opacity,
    });

    const line = new THREE.Line(geometry, material);

    // Puntos brillantes a lo largo de la conexión
    for (let j = 0; j < points.length; j += 3) {
      const dotGeo = new THREE.SphereGeometry(0.02, 6, 6);
      const dotMat = new THREE.MeshBasicMaterial({
        color: color, // Usar el mismo color de la conexión
        transparent: true,
        opacity: 0.7
      });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.copy(points[j]);
      line.add(dot); // Agregar el punto a la línea
    }

    return line;
  }

  //Crear label flotante mejorado
  createLabel(text, position, color, isCentral) {
    const config = isCentral
      ? TREE_CONFIG.clusters.labels.central
      : TREE_CONFIG.clusters.labels.satellite;

    // Aumentar tamaño del canvas para mejor calidad
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = config.width * 2; // Doble resolución
    canvas.height = config.height * 2;

    // Fondo transparente
    context.fillStyle = 'rgba(0, 0, 0, 0)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Configurar texto
    const fontSize = isCentral ? 48 : 32;
    context.font = `bold ${fontSize}px 'Inter', 'Segoe UI', Arial, sans-serif`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // FIX: Asegurar que el color sea un número hexadecimal
    let colorHex;
    if (typeof color === 'number') {
      // Si es un número, convertir directamente
      colorHex = color;
    } else if (color.isColor) {
      // Si es un THREE.Color, obtener el hex
      colorHex = color.getHex();
    } else if (typeof color === 'string') {
      // Si es string, parsearlo
      colorHex = parseInt(color.replace('#', ''), 16);
    } else {
      // Fallback a blanco
      colorHex = 0xffffff;
    }

    const colorStr = '#' + ('000000' + colorHex.toString(16)).slice(-6);

    // Sombra/glow más pronunciado
    context.shadowColor = colorStr;
    context.shadowBlur = isCentral ? 25 : 20;

    // Texto con gradiente
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, colorStr);
    gradient.addColorStop(1, '#ffffff');
    context.fillStyle = gradient;

    // Dibujar texto
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    // Borde del texto para mejor legibilidad
    context.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    context.lineWidth = 2;
    context.strokeText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.95,
      depthTest: false,
      depthWrite: false
    });

    const sprite = new THREE.Sprite(material);
    const scale = isCentral ? 2.5 : 1.5;
    sprite.scale.set(scale, scale * 0.3, 1);
    sprite.position.copy(position);

    sprite.userData.isLabel = true;
    sprite.userData.labelText = text;

    return sprite;
  }

  //Actualizar animaciones (llamar desde TreeManager)
  update(time) {
    // Animar clusters
    this.animatedObjects.forEach(obj => {
      if (obj.userData.type === 'cluster-central') {
        // Pulso del nodo central
        const scale = 1 + Math.sin(time * 2) * 0.05;
        obj.scale.setScalar(scale);

        obj.children.forEach((child, index) => {
          if (child.userData.rotSpeed) {
            if (index === 1 || index === 2) {
              child.rotation.x -= child.userData.rotSpeed;
            } else {
              child.rotation.y += child.userData.rotSpeed;
            }
          }
        });

      } else if (obj.userData.type === 'cluster-satellite') {
        // Pulso satélite
        const scale = 1 + Math.sin(time * 2 + obj.position.x) * 0.1;
        obj.scale.setScalar(scale);

        // Float vertical
        obj.position.y = obj.userData.originalY + Math.sin(time + obj.position.x) * 0.01;
        // Rotar anillo
        if (obj.children[1]) {
          obj.children[1].rotation.z += 0.01;
        }
      }
    });

    // Animar partículas y anillos de las ramas
    this.parent.traverse(object => {
      // Animar anillos de las ramas
      if (object.userData.rotationSpeed) {
        object.rotation.z += object.userData.rotationSpeed;
      }

      // Animar partículas flotantes
      if (object.userData.originalPos) {
        const offset = object.userData.offset;
        object.position.y = object.userData.originalPos.y +
          Math.sin(time * 2 + offset) * 0.05;
      }
    });
  }

  //Limpiar recursos
  dispose() {
    this.clusters.forEach(cluster => {
      this.parent.remove(cluster);
      cluster.traverse(object => {
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