/**
 * APP.JS - Con PostProcessing Integrado
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SceneManager } from './Scene.js';
import { TreeManager } from '../tree/TreeManager.js';
import { ParticleManager } from '../particles/ParticleManager.js';
import { LightingSystem } from '../effects/LightingSystem.js';
import { PostProcessing } from '../effects/PostProcessing.js'; // ← NUEVO
import { InputManager } from '../interaction/InputManager.js';
import { CameraController } from '../interaction/CameraController.js';
import { UIManager } from '../ui/UIManager.js';
import { Performance } from '../utils/Performance.js';
import { DebugTools } from '../utils/DebugTools.js';
import { CAMERA_CONFIG } from '../config/constants.js';
import EventBus, { EVENTS } from './EventBus.js';

export class App {
  constructor(container) {
    this.container = container;

    // Managers principales
    this.sceneManager = null;
    this.treeManager = null;
    this.particleManager = null;
    this.lightingSystem = null;
    this.postProcessing = null; // ← NUEVO
    this.inputManager = null;
    this.cameraController = null;
    this.uiManager = null;
    this.controls = null;

    // Utils
    this.performance = null;
    this.debugTools = null;

    this.clock = new THREE.Clock();
    this.isRunning = false;

    this.stats = {
      fps: 0,
      frameCount: 0,
      lastTime: performance.now()
    };

    // Control de calidad
    this.usePostProcessing = true; // ← ACTIVAR/DESACTIVAR
  }

  async init() {
    console.log('🚀 Inicializando aplicación...');

    try {
      // 1-4. Igual que antes
      this.createScene();
      this.createControls();
      this.createTree();
      this.createParticles();

      // 5. Crear sistema de luces
      this.createLighting();

      // 6. ✨ NUEVO: Crear PostProcessing
      if (this.usePostProcessing) {
        this.createPostProcessing();
      }

      // 7-10. Igual que antes
      this.createUIManager();
      this.createInput();
      this.createUtils();
      this.setupEvents();

      this.start();

      EventBus.emit(EVENTS.SCENE_READY, {
        scene: this.sceneManager.getScene(),
        camera: this.sceneManager.getCamera()
      });

    } catch (error) {
      throw error;
    }
  }

  // ... (métodos anteriores sin cambios) ...

  createScene() {
    this.sceneManager = new SceneManager(this.container);
  }

  createControls() {
    const camera = this.sceneManager.getCamera();
    const renderer = this.sceneManager.getRenderer();

    this.controls = new OrbitControls(camera, renderer.domElement);

    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = true;
    this.controls.zoomSpeed = 0.8;
    this.controls.minDistance = CAMERA_CONFIG.minDistance;
    this.controls.maxDistance = CAMERA_CONFIG.maxDistance;
    this.controls.enablePan = true;
    this.controls.maxPolarAngle = CAMERA_CONFIG.maxPolarAngle;
    this.controls.minPolarAngle = CAMERA_CONFIG.minPolarAngle;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 1;

    this.controls.target.set(
      CAMERA_CONFIG.target.x,
      CAMERA_CONFIG.target.y,
      CAMERA_CONFIG.target.z
    );

    this.controls.update();
    this.cameraController = new CameraController(camera, this.controls);
  }

  createTree() {
    const scene = this.sceneManager.getScene();
    this.treeManager = new TreeManager(scene);
  }

  createParticles() {
    const scene = this.sceneManager.getScene();
    this.particleManager = new ParticleManager(scene);
  }

  createLighting() {
    const scene = this.sceneManager.getScene();
    const lights = this.sceneManager.lights;
    this.lightingSystem = new LightingSystem(scene, lights);
  }

  createPostProcessing() {
    const renderer = this.sceneManager.getRenderer();
    const scene = this.sceneManager.getScene();
    const camera = this.sceneManager.getCamera();

    this.postProcessing = new PostProcessing(renderer, scene, camera);

  }

  createInput() {
    const camera = this.sceneManager.getCamera();
    const renderer = this.sceneManager.getRenderer();
    const nodes = this.treeManager.getNodes();

    this.inputManager = new InputManager(camera, renderer.domElement, nodes);
  }

  createUIManager() {
    const scene = this.sceneManager.getScene();
    const camera = this.sceneManager.getCamera();
    this.uiManager = new UIManager(scene, camera);
  }

  createUtils() {
    this.performance = new Performance();

    const scene = this.sceneManager.getScene();
    const camera = this.sceneManager.getCamera();
    const renderer = this.sceneManager.getRenderer();
    this.debugTools = new DebugTools(scene, camera, renderer);
  }

  setupEvents() {
    window.addEventListener('keydown', (e) => this.onKeyDown(e));

    EventBus.on(EVENTS.CAMERA_RESET, () => this.resetCamera());
    EventBus.on(EVENTS.NODE_HOVER, (data) => this.onNodeHover(data));
    EventBus.on(EVENTS.NODE_UNHOVER, () => this.onNodeUnhover());
  }

  onNodeHover(data) {
    if (this.treeManager) {
      this.treeManager.highlightNode(data.node);
    }

    if (this.lightingSystem) {
      this.lightingSystem.focusOnNode(data.node);
    }
  }

  onNodeUnhover() {
    const nodes = this.treeManager.getNodes();
    nodes.forEach(node => {
      this.treeManager.unhighlightNode(node);
    });

    if (this.lightingSystem) {
      this.lightingSystem.unfocus();
    }
  }

  onKeyDown(event) {
    switch (event.key.toLowerCase()) {
      case 'r':
        if (this.cameraController) {
          this.cameraController.reset();
        } else {
          this.resetCamera();
        }
        break;

      case 'p':
        this.controls.autoRotate = !this.controls.autoRotate;
        break;

      case 'h':
        EventBus.emit('ui:toggle');
        break;

      case 'f':
        this.toggleFullscreen();
        break;

      // ✨ NUEVO: Toggle Bloom con tecla 'B'
      case 'b':
        if (this.postProcessing) {
          this.usePostProcessing = !this.usePostProcessing;
          this.postProcessing.setBloomEnabled(this.usePostProcessing);
        }
        break;

      // ✨ NUEVO: Ajustar intensidad con +/-
      case '+':
      case '=':
        if (this.postProcessing) {
          const current = this.postProcessing.bloomPass.strength;
          this.postProcessing.setBloomStrength(Math.min(current + 0.2, 3));
        }
        break;

      case '-':
      case '_':
        if (this.postProcessing) {
          const current = this.postProcessing.bloomPass.strength;
          this.postProcessing.setBloomStrength(Math.max(current - 0.2, 0));
        }
        break;

      case '1':
        if (this.cameraController) {
          this.cameraController.setFrontView();
        }
        break;

      case '2':
        if (this.cameraController) {
          this.cameraController.setSideView();
        }
        break;

      case '3':
        if (this.cameraController) {
          this.cameraController.setTopView();
        }
        break;

      case 's':
        if (event.shiftKey && this.debugTools) {
          this.debugTools.takeScreenshot();
        }
        break;
    }
  }

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

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  start() {
    this.isRunning = true;
    this.animate();
  }

  stop() {
    this.isRunning = false;
  }


  animate() {
    if (!this.isRunning) return;

    requestAnimationFrame(() => this.animate());

    const time = this.clock.getElapsedTime();
    const delta = this.clock.getDelta();

    // Actualizar controles
    this.controls.update();

    // Actualizar escena
    this.sceneManager.update(time);

    if (this.treeManager) {
      this.treeManager.update(time, delta);
    }

    if (this.particleManager) {
      this.particleManager.update(time, delta);
    }

    if (this.lightingSystem) {
      this.lightingSystem.update(time);
    }

    if (this.performance) {
      this.performance.update();
    }

    // ✨ CLAVE: Renderizar con o sin PostProcessing
    if (this.postProcessing && this.usePostProcessing) {
      this.postProcessing.render(); // ← Con Bloom
    } else {
      this.sceneManager.render(); // ← Sin Bloom
    }

    this.updateStats();
  }

  updateStats() {
    this.stats.frameCount++;
    const currentTime = performance.now();
    const elapsed = currentTime - this.stats.lastTime;

    if (elapsed >= 1000) {
      this.stats.fps = Math.round((this.stats.frameCount * 1000) / elapsed);
      this.stats.frameCount = 0;
      this.stats.lastTime = currentTime;

      EventBus.emit('stats:update', {
        fps: this.stats.fps
      });
    }
  }

  getScene() {
    return this.sceneManager.getScene();
  }

  getCamera() {
    return this.sceneManager.getCamera();
  }

  getTreeManager() {
    return this.treeManager;
  }

  getNodes() {
    return this.treeManager ? this.treeManager.getNodes() : [];
  }


  dispose() {
    this.stop();

    if (this.controls) {
      this.controls.dispose();
    }

    if (this.treeManager) {
      this.treeManager.dispose();
    }

    // ✨ NUEVO: Limpiar PostProcessing
    if (this.postProcessing) {
      this.postProcessing.dispose();
    }

    if (this.sceneManager) {
      this.sceneManager.dispose();
    }

    window.removeEventListener('keydown', this.onKeyDown);
  }
}