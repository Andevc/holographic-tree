/**
 * CAMERACONTROLLER.JS - Controlador de Cámara Avanzado
 * =====================================================
 * 
 * Funciones adicionales para la cámara más allá de OrbitControls
 * - Animaciones suaves de transición
 * - Presets de vista
 * - Focus en objetos específicos
 */

import * as THREE from 'three';
import { CAMERA_CONFIG } from '../config/constants.js';

export class CameraController {
  constructor(camera, controls) {
    this.camera = camera;
    this.controls = controls;
    
    // Para animaciones suaves
    this.isAnimating = false;
    this.animationDuration = 1000; // ms
  }

  /**
   * Animar cámara a una posición
   */
  animateToPosition(targetPos, targetLookAt, duration = this.animationDuration) {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    
    const startPos = this.camera.position.clone();
    const startLookAt = this.controls.target.clone();
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      
      // Ease in-out
      const eased = t < 0.5 
        ? 2 * t * t 
        : -1 + (4 - 2 * t) * t;
      
      // Interpolar posición
      this.camera.position.lerpVectors(startPos, targetPos, eased);
      this.controls.target.lerpVectors(startLookAt, targetLookAt, eased);
      this.controls.update();
      
      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isAnimating = false;
      }
    };
    
    animate();
  }

  /**
   * Focus en un nodo específico
   */
  focusOnNode(node) {
    const nodePos = node.position.clone();
    
    // Calcular posición de cámara (offset desde el nodo)
    const offset = new THREE.Vector3(3, 2, 3);
    const cameraPos = nodePos.clone().add(offset);
    
    this.animateToPosition(cameraPos, nodePos);
  }

  /**
   * Vista frontal
   */
  setFrontView() {
    const pos = new THREE.Vector3(0, 5, 12);
    const target = new THREE.Vector3(0, 2, 0);
    this.animateToPosition(pos, target);
  }

  /**
   * Vista lateral
   */
  setSideView() {
    const pos = new THREE.Vector3(12, 5, 0);
    const target = new THREE.Vector3(0, 2, 0);
    this.animateToPosition(pos, target);
  }

  /**
   * Vista superior
   */
  setTopView() {
    const pos = new THREE.Vector3(0, 15, 0.1);
    const target = new THREE.Vector3(0, 0, 0);
    this.animateToPosition(pos, target);
  }

  /**
   * Reset a posición inicial
   */
  reset() {
    const pos = new THREE.Vector3(
      CAMERA_CONFIG.position.x,
      CAMERA_CONFIG.position.y,
      CAMERA_CONFIG.position.z
    );
    const target = new THREE.Vector3(
      CAMERA_CONFIG.target.x,
      CAMERA_CONFIG.target.y,
      CAMERA_CONFIG.target.z
    );
    this.animateToPosition(pos, target);
  }

  /**
   * Toggle auto-rotate
   */
  toggleAutoRotate() {
    this.controls.autoRotate = !this.controls.autoRotate;
    return this.controls.autoRotate;
  }
}