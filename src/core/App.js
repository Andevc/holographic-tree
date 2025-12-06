/**
 * APP.JS - Aplicación Principal
 * ==============================
 * 
 * PROPÓSITO:
 * - Coordinar todos los módulos del proyecto
 * - Inicializar Scene, TreeManager, etc.
 * - Manejar el loop de animación
 * - Actuar como "director de orquesta"
 * 
 * CICLO DE VIDA:
 * 1. Constructor → Inicializa variables
 * 2. init() → Crea todos los componentes
 * 3. animate() → Loop infinito de renderizado
 * 
 * PARA LA DEFENSA:
 * "App.js implementa el patrón Mediator, coordinando
 * la comunicación entre Scene, TreeManager y otros módulos.
 * Maneja el game loop usando requestAnimationFrame para
 * sincronizar animaciones con el refresh rate del monitor."
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SceneManager } from './Scene.js';
import { TreeManager } from '../tree/TreeManager.js';
import { ParticleManager } from '../particles/ParticleManager.js';
import { LightingSystem } from '../effects/LightingSystem.js';
import { InputManager } from '../interaction/InputManager.js';
import { UIManager } from '../ui/UIManager.js';
import { CAMERA_CONFIG } from '../config/constants.js';
import EventBus, { EVENTS } from './EventBus.js';
import { PostProcessing } from '../effects/PostProcessing.js';

export class App {
  constructor(container) {
    // Referencia al contenedor DOM
    this.container = container;
    
    // Managers principales
    this.sceneManager = null;
    this.treeManager = null;
    this.particleManager = null;
    this.lightingSystem = null;
    this.inputManager = null;
    this.uiManager = null;
    this.controls = null;
    
    // Clock para animaciones
    this.clock = new THREE.Clock();
    
    // Estado
    this.isRunning = false;
    
    // Stats (opcional, para debugging)
    this.stats = {
      fps: 0,
      frameCount: 0,
      lastTime: performance.now()
    };
  }

  /**
   * Inicializar toda la aplicación
   */
  async init() {
    console.log('🚀 Inicializando aplicación...');
    
    try {
      // 1. Crear UI Manager (primero para manejar loading)
      this.createUIManager();
      
      // 2. Crear escena base
      this.createScene();
      
      // 3. Crear controles de cámara
      this.createControls();
      
      // 4. Crear árbol del conocimiento
      this.createTree();
      
      // 5. Crear sistema de partículas
      this.createParticles();
      
      // 6. Crear sistema de luces dinámico
      this.createLighting();
      
      // 7. Crear sistema de input
      this.createInput();
      
      // 8. Setup de eventos
      this.setupEvents();
      
      // 9. Iniciar loop de animación
      this.start();
      
      console.log('✅ Aplicación inicializada correctamente');
      
      // Emitir evento de que la escena está lista
      EventBus.emit(EVENTS.SCENE_READY, {
        scene: this.sceneManager.getScene(),
        camera: this.sceneManager.getCamera()
      });
      
    } catch (error) {
      console.error('❌ Error inicializando aplicación:', error);
      throw error;
    }
  }

  /**
   * PASO 1: Crear escena
   */
  createScene() {
  this.sceneManager = new SceneManager(this.container);
  console.log('  ✓ Escena creada');

  // Inicializar PostProcessing
  this.postProcessing = new PostProcessing(
    this.sceneManager.getRenderer(),
    this.sceneManager.getScene(),
    this.sceneManager.getCamera()
  );
  console.log('  ✓ PostProcessing inicializado');
}

  /**
   * PASO 2: Crear controles de cámara (OrbitControls)
   * Permite rotar, hacer zoom y pan con el mouse
   */
  createControls() {
    const camera = this.sceneManager.getCamera();
    const renderer = this.sceneManager.getRenderer();
    
    this.controls = new OrbitControls(camera, renderer.domElement);
    
    // Configuración de controles
    this.controls.enableDamping = true;      // Suaviza el movimiento
    this.controls.dampingFactor = 0.05;
    
    this.controls.enableZoom = true;
    this.controls.zoomSpeed = 0.8;
    this.controls.minDistance = CAMERA_CONFIG.minDistance;
    this.controls.maxDistance = CAMERA_CONFIG.maxDistance;
    
    this.controls.enablePan = false;         // Desactivar paneo
    
    // Límites verticales
    this.controls.maxPolarAngle = CAMERA_CONFIG.maxPolarAngle;
    this.controls.minPolarAngle = CAMERA_CONFIG.minPolarAngle;
    
    // Auto-rotación (opcional, desactivada por defecto)
    this.controls.autoRotate = false;
    this.controls.autoRotateSpeed = 0.5;
    
    // Punto de enfoque
    this.controls.target.set(
      CAMERA_CONFIG.target.x,
      CAMERA_CONFIG.target.y,
      CAMERA_CONFIG.target.z
    );
    
    this.controls.update();
    
    console.log('  ✓ Controles creados');
  }

  /**
   * PASO 3: Crear árbol del conocimiento
   */
  createTree() {
    const scene = this.sceneManager.getScene();
    this.treeManager = new TreeManager(scene);
    console.log('  ✓ Árbol creado');
  }

  /**
   * PASO 4: Crear sistema de partículas
   */
  createParticles() {
    const scene = this.sceneManager.getScene();
    this.particleManager = new ParticleManager(scene);
    console.log('  ✓ Partículas creadas');
  }

  /**
   * PASO 5: Crear sistema de luces dinámico
   */
  createLighting() {
    const scene = this.sceneManager.getScene();
    const lights = this.sceneManager.lights;
    this.lightingSystem = new LightingSystem(scene, lights);
    console.log('  ✓ Sistema de luces creado');
  }

  /**
   * PASO 6: Crear sistema de input
   */
  createInput() {
    const camera = this.sceneManager.getCamera();
    const renderer = this.sceneManager.getRenderer();
    const nodes = this.treeManager.getNodes();
    
    this.inputManager = new InputManager(camera, renderer.domElement, nodes);
    console.log('  ✓ Sistema de input creado');
  }

  /**
   * PASO 7: Crear UI Manager
   */
  createUIManager() {
    this.uiManager = new UIManager();
    console.log('  ✓ UI Manager creado');
  }

  /**
   * PASO 4: Setup de eventos globales
   */
  setupEvents() {
    // Eventos de teclado
    window.addEventListener('keydown', (e) => this.onKeyDown(e));
    
    // Eventos del EventBus
    EventBus.on(EVENTS.CAMERA_RESET, () => this.resetCamera());
    EventBus.on(EVENTS.NODE_HOVER, (data) => this.onNodeHover(data));
    EventBus.on(EVENTS.NODE_UNHOVER, () => this.onNodeUnhover());
    
    console.log('  ✓ Eventos configurados');
  }

  /**
   * Cuando se hace hover sobre un nodo
   */
  onNodeHover(data) {
    if (this.treeManager) {
      this.treeManager.highlightNode(data.node);
    }
  }

  /**
   * Cuando se quita el hover
   */
  onNodeUnhover() {
    // Restaurar todos los nodos (quitarles highlight)
    const nodes = this.treeManager.getNodes();
    nodes.forEach(node => {
      this.treeManager.unhighlightNode(node);
    });
  }

  /**
   * Manejar teclas presionadas
   */
  onKeyDown(event) {
    switch (event.key.toLowerCase()) {
      case 'r':
        // Reset de cámara
        this.resetCamera();
        console.log('🔄 Cámara reseteada');
        break;
        
      case 'p':
        // Toggle auto-rotación
        this.controls.autoRotate = !this.controls.autoRotate;
        console.log(`🔄 Auto-rotación: ${this.controls.autoRotate ? 'ON' : 'OFF'}`);
        break;
        
      case 'h':
        // Ocultar/mostrar UI
        EventBus.emit('ui:toggle');
        break;
        
      case 'd':
        // Toggle debug mode
        EventBus.setDebug(!EventBus.debug);
        console.log(`🐛 Debug: ${EventBus.debug ? 'ON' : 'OFF'}`);
        break;
        
      case 'f':
        // Fullscreen
        this.toggleFullscreen();
        break;
    }
  }

  /**
   * Resetear cámara a posición inicial
   */
  resetCamera() {
    const camera = this.sceneManager.getCamera();
    
    camera.position.set(
      CAMERA_CONFIG.position.x,
      CAMERA_CONFIG.position.y,
      CAMERA_CONFIG.position.z
    );
    
    this.controls.target.set(
      CAMERA_CONFIG.target.x,
      CAMERA_CONFIG.target.y,
      CAMERA_CONFIG.target.z
    );
    
    this.controls.update();
    
    EventBus.emit(EVENTS.CAMERA_RESET);
  }

  /**
   * Toggle fullscreen
   */
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  /**
   * PASO 5: Iniciar loop de animación
   */
  start() {
    this.isRunning = true;
    this.animate();
    console.log('  ✓ Loop de animación iniciado');
  }

  /**
   * Detener loop de animación
   */
  stop() {
    this.isRunning = false;
  }

  /**
   * LOOP DE ANIMACIÓN PRINCIPAL
   * Se ejecuta ~60 veces por segundo
   * 
   * requestAnimationFrame sincroniza con el refresh rate
   * de la pantalla para animaciones suaves
   */
  animate() {
  if (!this.isRunning) return;
  
  requestAnimationFrame(() => this.animate());
  
  const time = this.clock.getElapsedTime();
  const delta = this.clock.getDelta();
  
  this.controls.update();
  
  this.sceneManager.update(time);
  
  if (this.treeManager) this.treeManager.update(time);
  if (this.particleManager) this.particleManager.update(time, delta);
  if (this.lightingSystem) this.lightingSystem.update(time);
  
  // Render con efectos
  this.postProcessing.render();
  
  this.updateStats();
}

  /**
   * Actualizar estadísticas de rendimiento
   */
  updateStats() {
    this.stats.frameCount++;
    const currentTime = performance.now();
    const elapsed = currentTime - this.stats.lastTime;
    
    // Actualizar FPS cada segundo
    if (elapsed >= 1000) {
      this.stats.fps = Math.round((this.stats.frameCount * 1000) / elapsed);
      this.stats.frameCount = 0;
      this.stats.lastTime = currentTime;
      
      // Emitir evento con stats (para UI)
      EventBus.emit('stats:update', {
        fps: this.stats.fps
      });
    }
  }

  /**
   * Obtener referencia a la escena
   */
  getScene() {
    return this.sceneManager.getScene();
  }

  /**
   * Obtener referencia a la cámara
   */
  getCamera() {
    return this.sceneManager.getCamera();
  }

  /**
   * Obtener referencia al tree manager
   */
  getTreeManager() {
    return this.treeManager;
  }

  /**
   * Obtener todos los nodos interactivos
   */
  getNodes() {
    return this.treeManager ? this.treeManager.getNodes() : [];
  }

  /**
   * Cleanup - Liberar recursos
   */
  dispose() {
    this.stop();
    
    if (this.controls) {
      this.controls.dispose();
    }
    
    if (this.treeManager) {
      this.treeManager.dispose();
    }
    
    if (this.sceneManager) {
      this.sceneManager.dispose();
    }
    
    window.removeEventListener('keydown', this.onKeyDown);
    
    console.log('🗑️ Aplicación destruida');
  }
}