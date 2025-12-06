/**
 * RAYCASTERMANAGER.JS - Detección de Clicks
 * ==========================================
 * 
 * Usa Raycasting para detectar qué objeto 3D fue clickeado
 * Emite eventos cuando se hace click o hover sobre nodos
 * 
 * PARA LA DEFENSA:
 * "El Raycaster lanza un rayo desde la cámara a través
 * del punto del mouse y detecta intersecciones con objetos 3D.
 * Es la técnica estándar para picking en aplicaciones 3D."
 */

import * as THREE from 'three';
import EventBus, { EVENTS } from '../core/EventBus.js';

export class RaycasterManager {
  constructor(camera, nodes) {
    this.camera = camera;
    this.nodes = nodes;
    
    // Raycaster de Three.js
    this.raycaster = new THREE.Raycaster();
    
    // Vector 2D normalizado del mouse
    this.mouse = new THREE.Vector2();
    
    // Nodo actualmente hovereado
    this.hoveredNode = null;
    
    // Nodo seleccionado
    this.selectedNode = null;
  }

  /**
   * Normalizar coordenadas del mouse (-1 a 1)
   */
  normalizeMouseCoords(x, y) {
    this.mouse.x = (x / window.innerWidth) * 2 - 1;
    this.mouse.y = -(y / window.innerHeight) * 2 + 1;
  }

  /**
   * Verificar hover (mientras se mueve el mouse)
   */
  checkHover(mouseX, mouseY) {
    this.normalizeMouseCoords(mouseX, mouseY);
    
    // Actualizar raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Buscar intersecciones
    const intersects = this.raycaster.intersectObjects(this.nodes, false);
    
    if (intersects.length > 0) {
      const newHovered = intersects[0].object;
      
      // Si es un nodo diferente al que ya está hovereado
      if (newHovered !== this.hoveredNode) {
        // Quitar hover del anterior
        if (this.hoveredNode) {
          EventBus.emit(EVENTS.NODE_UNHOVER, {
            node: this.hoveredNode
          });
        }
        
        // Aplicar hover al nuevo
        this.hoveredNode = newHovered;
        
        EventBus.emit(EVENTS.NODE_HOVER, {
          node: this.hoveredNode,
          data: this.hoveredNode.userData.subjectData
        });
        
        // Cambiar cursor
        document.body.style.cursor = 'pointer';
      }
    } else {
      // No hay hover sobre ningún nodo
      if (this.hoveredNode) {
        EventBus.emit(EVENTS.NODE_UNHOVER, {
          node: this.hoveredNode
        });
        this.hoveredNode = null;
        document.body.style.cursor = 'default';
      }
    }
  }

  /**
   * Verificar click
   */
  checkClick(mouseX, mouseY) {
    this.normalizeMouseCoords(mouseX, mouseY);
    
    // Actualizar raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Buscar intersecciones
    const intersects = this.raycaster.intersectObjects(this.nodes, false);
    
    if (intersects.length > 0) {
      const clickedNode = intersects[0].object;
      
      // Guardar como seleccionado
      this.selectedNode = clickedNode;
      
      // Emitir evento
      EventBus.emit(EVENTS.NODE_CLICKED, {
        node: clickedNode,
        data: clickedNode.userData.subjectData
      });
      
      console.log('🎯 Nodo clickeado:', clickedNode.userData.subjectData?.name);
    } else {
      // Click en espacio vacío
      if (this.selectedNode) {
        this.selectedNode = null;
        
        EventBus.emit(EVENTS.PANEL_CLOSED);
      }
    }
  }

  /**
   * Obtener nodo seleccionado
   */
  getSelectedNode() {
    return this.selectedNode;
  }

  /**
   * Limpiar selección
   */
  clearSelection() {
    this.selectedNode = null;
    this.hoveredNode = null;
    document.body.style.cursor = 'default';
  }
}