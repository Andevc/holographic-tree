/**
 * INPUTMANAGER.JS - Gestor de Entrada
 * ====================================
 * 
 * Maneja todos los eventos de usuario: mouse, teclado, touch
 * Coordina con RaycasterManager para detección de clicks
 */

import { RaycasterManager } from './RaycasterManager.js';
import EventBus, { EVENTS } from '../core/EventBus.js';

export class InputManager {
  constructor(camera, domElement, nodes) {
    this.camera = camera;
    this.domElement = domElement;
    this.nodes = nodes;
    
    // Raycaster para detección
    this.raycaster = new RaycasterManager(camera, nodes);
    
    // Estado del mouse
    this.mouseState = {
      isDown: false,
      moved: false,
      startX: 0,
      startY: 0
    };
    
    this.setupEvents();
  }

  setupEvents() {
    // Mouse events
    this.domElement.addEventListener('mousedown', (e) => this.onMouseDown(e));
    this.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.domElement.addEventListener('mouseup', (e) => this.onMouseUp(e));
    
    // Touch events (móvil)
    this.domElement.addEventListener('touchstart', (e) => this.onTouchStart(e));
    this.domElement.addEventListener('touchmove', (e) => this.onTouchMove(e));
    this.domElement.addEventListener('touchend', (e) => this.onTouchEnd(e));
    
    console.log('🖱️ Input manager configurado');
  }

  onMouseDown(event) {
    this.mouseState.isDown = true;
    this.mouseState.moved = false;
    this.mouseState.startX = event.clientX;
    this.mouseState.startY = event.clientY;
  }

  onMouseMove(event) {
    if (this.mouseState.isDown) {
      const dx = event.clientX - this.mouseState.startX;
      const dy = event.clientY - this.mouseState.startY;
      
      // Considerar "moved" si se movió más de 5px
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        this.mouseState.moved = true;
      }
    }
    
    // Hover detection
    this.raycaster.checkHover(event.clientX, event.clientY);
  }

  onMouseUp(event) {
    // Solo disparar click si no hubo movimiento (drag)
    if (!this.mouseState.moved) {
      this.raycaster.checkClick(event.clientX, event.clientY);
    }
    
    this.mouseState.isDown = false;
    this.mouseState.moved = false;
  }

  // Touch events (móvil)
  onTouchStart(event) {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      this.mouseState.isDown = true;
      this.mouseState.moved = false;
      this.mouseState.startX = touch.clientX;
      this.mouseState.startY = touch.clientY;
    }
  }

  onTouchMove(event) {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      const dx = touch.clientX - this.mouseState.startX;
      const dy = touch.clientY - this.mouseState.startY;
      
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        this.mouseState.moved = true;
      }
    }
  }

  onTouchEnd(event) {
    if (!this.mouseState.moved && event.changedTouches.length === 1) {
      const touch = event.changedTouches[0];
      this.raycaster.checkClick(touch.clientX, touch.clientY);
    }
    
    this.mouseState.isDown = false;
    this.mouseState.moved = false;
  }

  dispose() {
    this.domElement.removeEventListener('mousedown', this.onMouseDown);
    this.domElement.removeEventListener('mousemove', this.onMouseMove);
    this.domElement.removeEventListener('mouseup', this.onMouseUp);
    this.domElement.removeEventListener('touchstart', this.onTouchStart);
    this.domElement.removeEventListener('touchmove', this.onTouchMove);
    this.domElement.removeEventListener('touchend', this.onTouchEnd);
  }
}