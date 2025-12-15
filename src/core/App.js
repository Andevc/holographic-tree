/**
 * APP.JS - Aplicación Principal
 * ==============================
 * 
 * PROPÓSITO:
 * - Coordinar todos los módulos del proyecto
 * - Inicializar Scene, TreeManager, etc.
 * - Manejar el loop de animación
 * - Actuar como "director de orquesta"
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SceneManager } from './Scene.js';
import { TreeManager } from '../tree/TreeManager.js';
import { ParticleManager } from '../particles/ParticleManager.js';
import { LightingSystem } from '../effects/LightingSystem.js';
import { InputManager } from '../interaction/InputManager.js';
import { CameraController } from '../interaction/CameraController.js';
import { UIManager } from '../ui/UIManager.js';
import { Performance } from '../utils/Performance.js';
import { DebugTools } from '../utils/DebugTools.js';
import { CAMERA_CONFIG } from '../config/constants.js';
import EventBus, { EVENTS } from './EventBus.js';

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
    this.cameraController = null;
    this.uiManager = null;
    this.controls = null;
    
    // Utils
    this.performance = null;
    this.debugTools = null;
    
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
      // 1. Crear escena base
      this.createScene();
      
      // 2. Crear controles de cámara
      this.createControls();
      
      // 3. Crear árbol del conocimiento
      this.createTree();
      
      // 4. Crear sistema de partículas
      this.createParticles();
      
      // 5. Crear sistema de luces dinámico
      this.createLighting();
      
      // 6. Crear UI Manager
      this.createUIManager();
      
      // 7. Crear sistema de input
      this.createInput();
      
      // 8. Crear utils (Performance y Debug)
      this.createUtils();
      
      // 9. Setup de eventos
      this.setupEvents();
      
      // 10. Iniciar loop de animación
      this.start();
      
      
      // Emitir evento de que la escena está lista
      EventBus.emit(EVENTS.SCENE_READY, {
        scene: this.sceneManager.getScene(),
        camera: this.sceneManager.getCamera()
      });
      
    } catch (error) {
      throw error;
    }
  }

  /**
   * PASO 1: Crear escena
   */
  createScene() {
    this.sceneManager = new SceneManager(this.container);
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
    
    this.controls.enablePan = true;         // Desactivar paneo
    
    // Límites verticales
    this.controls.maxPolarAngle = CAMERA_CONFIG.maxPolarAngle;
    this.controls.minPolarAngle = CAMERA_CONFIG.minPolarAngle;
    
    // Auto-rotación (opcional, desactivada por defecto)
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 1;
    
    // Punto de enfoque
    this.controls.target.set(
      CAMERA_CONFIG.target.x,
      CAMERA_CONFIG.target.y,
      CAMERA_CONFIG.target.z
    );
    
    this.controls.update();
    
    // Crear controlador avanzado
    this.cameraController = new CameraController(camera, this.controls);
    
  }

  /**
   * PASO 3: Crear árbol del conocimiento
   */
  createTree() {
    const scene = this.sceneManager.getScene();
    this.treeManager = new TreeManager(scene);
  }

  /**
   * PASO 4: Crear sistema de partículas
   */
  createParticles() {
    const scene = this.sceneManager.getScene();
    this.particleManager = new ParticleManager(scene);
  }

  /**
   * PASO 5: Crear sistema de luces dinámico
   */
  createLighting() {
    const scene = this.sceneManager.getScene();
    const lights = this.sceneManager.lights;
    this.lightingSystem = new LightingSystem(scene, lights);
  }

  /**
   * PASO 6: Crear sistema de input
   */
  createInput() {
    const camera = this.sceneManager.getCamera();
    const renderer = this.sceneManager.getRenderer();
    const nodes = this.treeManager.getNodes();
    
    this.inputManager = new InputManager(camera, renderer.domElement, nodes);
  }

  /**
   * PASO 7: Crear UI Manager
   */
  createUIManager() {
    const scene = this.sceneManager.getScene();
    const camera = this.sceneManager.getCamera();
    this.uiManager = new UIManager(scene, camera);
  }

  /**
   * PASO 8: Crear utils (Performance y Debug)
   */
  createUtils() {
    // Performance monitor
    this.performance = new Performance();
    
    // Debug tools
    const scene = this.sceneManager.getScene();
    const camera = this.sceneManager.getCamera();
    const renderer = this.sceneManager.getRenderer();
    this.debugTools = new DebugTools(scene, camera, renderer);
    

  }

  /**
   * PASO 9: Setup de eventos globales
   */
  setupEvents() {
    // Eventos de teclado
    window.addEventListener('keydown', (e) => this.onKeyDown(e));
    
    // Eventos del EventBus
    EventBus.on(EVENTS.CAMERA_RESET, () => this.resetCamera());
    EventBus.on(EVENTS.NODE_HOVER, (data) => this.onNodeHover(data));
    EventBus.on(EVENTS.NODE_UNHOVER, () => this.onNodeUnhover());
    
 
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
        if (this.cameraController) {
          this.cameraController.reset();
        } else {
          this.resetCamera();
        }
        break;
        
      case 'p':
        // Toggle auto-rotación
        this.controls.autoRotate = !this.controls.autoRotate;
        break;
        
      case 'h':
        // Ocultar/mostrar UI
        EventBus.emit('ui:toggle');
        break;
        
      case 'f':
        // Fullscreen
        this.toggleFullscreen();
        break;              
        
      case '1':
        // Vista frontal
        if (this.cameraController) {
          this.cameraController.setFrontView();
        }
        break;
        
      case '2':
        // Vista lateral
        if (this.cameraController) {
          this.cameraController.setSideView();
        }
        break;
        
      case '3':
        // Vista superior
        if (this.cameraController) {
          this.cameraController.setTopView();
        }
        break;
        
      case 's':
        // Screenshot (con Shift)
        if (event.shiftKey && this.debugTools) {
          this.debugTools.takeScreenshot();
        }
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
   * PASO 10: Iniciar loop de animación
   */
  start() {
    this.isRunning = true;
    this.animate();
  }

  /**
   * Detener loop de animación
   */
  stop() {
    this.isRunning = false;
  }

  animate() {
    if (!this.isRunning) return;
    
    // Solicitar siguiente frame
    requestAnimationFrame(() => this.animate());
    
    // Obtener tiempo transcurrido
    const time = this.clock.getElapsedTime();
    const delta = this.clock.getDelta();
    
    // Actualizar controles
    this.controls.update();
    
    // Actualizar escena (luces, anillo base, etc)
    this.sceneManager.update(time);
    
    if (this.treeManager) {
      this.treeManager.update(time, delta); // Ahora pasa delta también
    }
    
    // Actualizar partículas
    if (this.particleManager) {
      this.particleManager.update(time, delta);
    }
    
    // Actualizar sistema de luces
    if (this.lightingSystem) {
      this.lightingSystem.update(time);
    }
    
    // Actualizar performance monitor
    if (this.performance) {
      this.performance.update();
    }
    
    // Renderizar escena
    this.sceneManager.render();
    
    // Calcular FPS (opcional)
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
    
  }
}