/**
 * SCENE.JS - Configuración de Escena Three.js
 * ============================================
 * 
 * PROPÓSITO:
 * - Crear y configurar la escena 3D
 * - Configurar la cámara con perspectiva
 * - Inicializar el renderer (WebGL)
 * - Configurar el sistema de luces
 * - Manejar resize de ventana
 * 
 * COMPONENTES PRINCIPALES:
 * 1. Scene - Contenedor de todos los objetos 3D
 * 2. Camera - Define cómo vemos la escena
 * 3. Renderer - Dibuja la escena en el canvas
 * 4. Lights - Iluminación de la escena
 * 
 * PARA LA DEFENSA:
 * "Scene.js encapsula toda la configuración base de Three.js.
 * Utiliza una PerspectiveCamera para simular visión humana,
 * WebGLRenderer para renderizado acelerado por GPU, y un
 * sistema de luces mixto (ambiental, direccional, punto) para
 * crear profundidad y realismo."
 */

import * as THREE from 'three';
import {
  CAMERA_CONFIG,
  LIGHTS_CONFIG,
  COLORS,
  EFFECTS_CONFIG
} from '../config/constants.js';

export class SceneManager {
  constructor(container) {
    this.container = container;

    // Referencias principales
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.lights = {};

    // Elementos decorativos
    this.baseRing = null;
    this.gridHelper = null;

    this.init();
  }

  /**
   * Inicializar todos los componentes
   */
  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createLights();
    this.createHelpers();
    this.setupResize();

  }

  /**
   * PASO 1: Crear la escena
   * La escena es el contenedor de todos los objetos 3D
   */
  createScene() {
    this.scene = new THREE.Scene();

    // Color de fondo
    //const loader = new THREE.TextureLoader();
    //const bgTexture = loader.load("../../public/assets/images/background-texture.png");
    //this.scene.background = bgTexture;
    this.scene.background = new THREE.Color(COLORS.background);

    // Niebla para profundidad
    // near: distancia donde empieza la niebla
    // far: distancia donde es completamente opaca
    this.scene.fog = new THREE.Fog(
      EFFECTS_CONFIG.fog.color,
      EFFECTS_CONFIG.fog.near,
      EFFECTS_CONFIG.fog.far
    );
  }

  /**
   * PASO 2: Crear la cámara
   * PerspectiveCamera simula cómo ve el ojo humano
   * 
   * Parámetros:
   * - fov (Field of View): Ángulo de visión en grados
   * - aspect: Relación de aspecto (ancho/alto)
   * - near: Plano cercano de recorte
   * - far: Plano lejano de recorte
   */
  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      CAMERA_CONFIG.fov,
      window.innerWidth / window.innerHeight,
      CAMERA_CONFIG.near,
      CAMERA_CONFIG.far
    );

    // Posición inicial de la cámara
    this.camera.position.set(
      CAMERA_CONFIG.position.x,
      CAMERA_CONFIG.position.y,
      CAMERA_CONFIG.position.z
    );

    // Hacia dónde mira la cámara
    this.camera.lookAt(
      CAMERA_CONFIG.target.x,
      CAMERA_CONFIG.target.y,
      CAMERA_CONFIG.target.z
    );
  }

  /**
   * PASO 3: Crear el renderer
   * WebGLRenderer usa la GPU para renderizar la escena
   */
  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,  // Suaviza los bordes
      alpha: true,       // Permite transparencias
      precision: "highp",
      preserveDrawingBuffer: true,
      powerPreference: "high-performance"
    });

    // Tamaño del canvas
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Mejorar calidad en pantallas retina
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Habilitar sombras
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Agregar el canvas al DOM
    this.container.appendChild(this.renderer.domElement);
  }

  /**
   * PASO 4: Crear sistema de luces
   * Combinación de diferentes tipos para realismo
   */
  createLights() {
    // 1. LUZ AMBIENTAL
    // Ilumina todo uniformemente (no proyecta sombras)
    this.lights.ambient = new THREE.AmbientLight(
      LIGHTS_CONFIG.ambient.color,
      LIGHTS_CONFIG.ambient.intensity
    );
    this.scene.add(this.lights.ambient);

    // 2. LUZ DIRECCIONAL
    // Simula el sol (rayos paralelos, proyecta sombras)
    this.lights.directional = new THREE.DirectionalLight(
      LIGHTS_CONFIG.directional.color,
      LIGHTS_CONFIG.directional.intensity
    );

    const dirPos = LIGHTS_CONFIG.directional.position;
    this.lights.directional.position.set(dirPos.x, dirPos.y, dirPos.z);
    this.lights.directional.castShadow = LIGHTS_CONFIG.directional.castShadow;

    // Configurar sombras
    const shadow = LIGHTS_CONFIG.directional.shadow;
    this.lights.directional.shadow.camera.near = shadow.camera.near;
    this.lights.directional.shadow.camera.far = shadow.camera.far;
    this.lights.directional.shadow.camera.left = -shadow.camera.size;
    this.lights.directional.shadow.camera.right = shadow.camera.size;
    this.lights.directional.shadow.camera.top = shadow.camera.size;
    this.lights.directional.shadow.camera.bottom = -shadow.camera.size;
    this.lights.directional.shadow.mapSize.width = shadow.mapSize;
    this.lights.directional.shadow.mapSize.height = shadow.mapSize;

    this.scene.add(this.lights.directional);

    // 3. LUCES DE PUNTO
    // Iluminan desde un punto en todas direcciones (como bombillas)
    this.lights.points = [];
    LIGHTS_CONFIG.point.forEach((config, index) => {
      const pointLight = new THREE.PointLight(
        config.color,
        config.intensity,
        config.distance
      );
      pointLight.position.set(
        config.position.x,
        config.position.y,
        config.position.z
      );
      this.lights.points.push(pointLight);
      this.scene.add(pointLight);
    });

    // 4. LUZ HEMISFÉRICA
    // Simula luz del cielo y reflejo del suelo
    this.lights.hemisphere = new THREE.HemisphereLight(
      LIGHTS_CONFIG.hemisphere.skyColor,
      LIGHTS_CONFIG.hemisphere.groundColor,
      LIGHTS_CONFIG.hemisphere.intensity
    );
    this.scene.add(this.lights.hemisphere);
  }

  /**
   * PASO 5: Crear helpers visuales
   * Grid, anillos y otros elementos decorativos
   */
  createHelpers() {
    // Grid del suelo (estilo holográfico)
    this.gridHelper = new THREE.GridHelper(
      50,  // Tamaño
      50,  // Divisiones
      COLORS.grid.primary,
      COLORS.grid.secondary
    );
    this.gridHelper.material.transparent = true;
    this.gridHelper.material.opacity = 0.5;
    this.gridHelper.position.y = 0;
    this.scene.add(this.gridHelper);

    // Círculo/base pequeño holográfico
const baseRingGeometry = new THREE.RingGeometry(2.5, 3, 64);
const baseRingMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ffff,
  transparent: true,
  opacity: 0.15,
  side: THREE.DoubleSide
});
const baseRing = new THREE.Mesh(baseRingGeometry, baseRingMaterial);
baseRing.rotation.x = -Math.PI / 2;
baseRing.position.y = 0.05; // ligeramente elevado
this.scene.add(baseRing);

const baseCircleGeometry = new THREE.CircleGeometry(2.5, 64);
const baseCircleMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ffff,
  transparent: true,
  opacity: 0.2,
  side: THREE.DoubleSide
});
const baseCircle = new THREE.Mesh(baseCircleGeometry, baseCircleMaterial);
baseCircle.rotation.x = -Math.PI / 2;
baseCircle.position.y = 0; 
this.scene.add(baseCircle);

// ---------------------------
// Círculo/anillo principal (donde estará el árbol)
const mainRingGeometry = new THREE.RingGeometry(5.5, 6, 64); // grosor = 0.5
const mainRingMaterial = new THREE.MeshBasicMaterial({
  color: 0x001122,
  transparent: true,
  opacity: 0.3,
  side: THREE.DoubleSide
});
const mainRing = new THREE.Mesh(mainRingGeometry, mainRingMaterial);
mainRing.rotation.x = -Math.PI / 2;
mainRing.position.y = 0.8; // más elevado
this.scene.add(mainRing);

const mainCircleGeometry = new THREE.CircleGeometry(5.5, 64); // círculo interior
const mainCircleMaterial = new THREE.MeshBasicMaterial({
  color: 0x001122,
  transparent: true,
  opacity: 0.3,
  side: THREE.DoubleSide
});
const mainCircle = new THREE.Mesh(mainCircleGeometry, mainCircleMaterial);
mainCircle.rotation.x = -Math.PI / 2;
mainCircle.position.y = 0.75; // un poco debajo del anillo
this.scene.add(mainCircle);
    
  }

  /**
   * PASO 6: Configurar resize de ventana
   */
  setupResize() {
    window.addEventListener('resize', () => this.onWindowResize());
  }

  /**
   * Manejar cambio de tamaño de ventana
   */
  onWindowResize() {
    // Actualizar aspect ratio de la cámara
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    // Actualizar tamaño del renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * Animar elementos de la escena (llamar en el loop)
   * @param {number} time - Tiempo transcurrido
   */
  update(time) {
    // Animar luces (pulso sutil)
    this.lights.points.forEach((light, index) => {
      const baseIntensity = LIGHTS_CONFIG.point[index].intensity;
      light.intensity = baseIntensity + Math.sin(time * 0.5 + index) * 0.3;
    });

    // Animar anillo base
    if (this.baseRing) {
      this.baseRing.material.opacity = 0.4 + Math.sin(time * 2) * 0.2;
      this.baseRing.scale.setScalar(1 + Math.sin(time * 1.5) * 0.02);
    }
  }

  /**
   * Renderizar la escena
   */
  render() {
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Limpiar recursos (llamar cuando se destruye)
   */
  dispose() {
    window.removeEventListener('resize', this.onWindowResize);
    this.renderer.dispose();

    // Limpiar geometrías y materiales
    this.scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
  }

  /**
   * Getters útiles
   */
  getScene() { return this.scene; }
  getCamera() { return this.camera; }
  getRenderer() { return this.renderer; }
}   