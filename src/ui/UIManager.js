/**
 * UIMANAGER.JS - Gestor de Interfaz de Usuario
 * =============================================
 * 
 * Coordina todos los paneles y elementos HTML
 */

import EventBus, { EVENTS } from '../core/EventBus.js';
import { InfoPanel } from './InfoPanel.js';
import { ControlPanel } from './ControlPanel.js';


export class UIManager {
  constructor(scene, camera) {
    // Componentes de UI
    this.infoPanel = new InfoPanel();
    this.controlPanel = new ControlPanel();

    
    // Referencias a elementos del DOM
    this.elements = {
      header: document.getElementById('header'),
      overlay: document.getElementById('ui-overlay'),
      loadingScreen: document.getElementById('loading-screen')
    };
    
    this.setupEvents();
    this.hideLoading();
    
    console.log('🎨 UI Manager configurado');
  }

  setupEvents() {
    // Toggle UI con tecla H
    EventBus.on('ui:toggle', () => this.toggleUI());
    
  }

  /**
   * Ocultar pantalla de carga
   */
  hideLoading() {
    if (this.elements.loadingScreen) {
      setTimeout(() => {
        this.elements.loadingScreen.classList.add('hidden');
        setTimeout(() => {
          this.elements.loadingScreen.remove();
        }, 500);
      }, 500);
    }
  }

  /**
   * Toggle visibilidad de toda la UI
   */
  toggleUI() {
    if (this.elements.overlay) {
      this.elements.overlay.classList.toggle('hidden');
    }
  }

  /**
   * Mostrar notificación
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type} fade-in`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: rgba(10, 10, 30, 0.9);
      backdrop-filter: blur(10px);
      border: 2px solid var(--color-primary);
      border-radius: 10px;
      padding: 1rem 1.5rem;
      color: white;
      z-index: 1000;
      box-shadow: var(--shadow-glow);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  /**
   * Actualizar UI con datos del árbol
   */
  updateTreeInfo(treeManager) {
    const stats = treeManager.getStats();
    // Puedes usar estos datos para actualizar la UI
  }

  /**
   * Obtener componentes individuales
   */
  getInfoPanel() { return this.infoPanel; }
  getControlPanel() { return this.controlPanel; }
  
}