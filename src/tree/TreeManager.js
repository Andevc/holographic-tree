/**
 * TREEMANAGER.JS - Coordinador del Árbol
 * =======================================
 * 
 * PROPÓSITO:
 * - Orquestar la construcción completa del árbol
 * - Coordinar RootsBuilder, TrunkBuilder, BranchBuilder, NodeBuilder
 * - Mantener referencias a todos los objetos 3D
 * - Manejar animaciones del árbol
 * 
 * ARQUITECTURA:
 * TreeManager (este archivo)
 *   ├─ RootsBuilder → Construye raíces
 *   ├─ TrunkBuilder → Construye tronco
 *   ├─ BranchBuilder → Construye ramas
 *   └─ NodeBuilder → Construye nodos
 * 
 * PARA LA DEFENSA:
 * "TreeManager implementa el patrón Facade, simplificando
 * la construcción del árbol al coordinar múltiples builders.
 * Cada builder es responsable de una parte específica,
 * siguiendo el principio de responsabilidad única."
 */

import * as THREE from 'three';
import { RootsBuilder } from './RootsBuilder.js';
import { TrunkBuilder } from './TrunkBuilder.js';
import { BranchBuilder } from './BranchBuilder.js';
import { NodeBuilder } from './NodeBuilder.js';
import { ROOTS, TRUNK, BRANCHES } from '../config/subjects.js';
import EventBus, { EVENTS } from '../core/EventBus.js';

export class TreeManager {
  constructor(scene) {
    this.scene = scene;
    
    // Grupo principal que contiene todo el árbol
    this.treeGroup = new THREE.Group();
    this.treeGroup.name = 'KnowledgeTree';
    
    // Referencias a los builders
    this.rootsBuilder = null;
    this.trunkBuilder = null;
    this.branchBuilder = null;
    this.nodeBuilder = null;
    
    // Arrays para mantener referencias
    this.allNodes = [];      // Todos los nodos (para interacción)
    this.allBranches = [];   // Todas las ramas
    this.allRoots = [];      // Todas las raíces
    
    // Estado
    this.isBuilt = false;
    
    this.build();
  }

  /**
   * Construir el árbol completo
   */
  build() {
    console.log('🌳 Iniciando construcción del árbol...');
    
    // 1. Construir raíces (fundamentos)
    this.buildRoots();
    
    // 2. Construir tronco (núcleo)
    this.buildTrunk();
    
    // 3. Construir ramas (especialidades)
    this.buildBranches();
    
    // 4. Agregar grupo completo a la escena
    this.scene.add(this.treeGroup);
    
    this.isBuilt = true;
    
    console.log(`✅ Árbol construido con ${this.allNodes.length} nodos`);
    
    // Emitir evento de que el árbol está listo
    EventBus.emit(EVENTS.TREE_BUILT, {
      nodeCount: this.allNodes.length,
      branchCount: this.allBranches.length
    });
  }

  /**
   * Construir raíces
   */
  buildRoots() {
    this.rootsBuilder = new RootsBuilder(this.treeGroup, ROOTS);
    const rootNodes = this.rootsBuilder.build();
    
    // Guardar referencias
    this.allRoots = rootNodes;
    this.allNodes.push(...rootNodes);
    
    console.log(`  ├─ Raíces: ${rootNodes.length} construidas`);
  }

  /**
   * Construir tronco
   */
  buildTrunk() {
    this.trunkBuilder = new TrunkBuilder(this.treeGroup, TRUNK);
    const trunkNodes = this.trunkBuilder.build();
    
    // Guardar referencias
    this.allNodes.push(...trunkNodes);
    
    console.log(`  ├─ Tronco: ${trunkNodes.length} nodos agregados`);
  }

  /**
   * Construir ramas
   */
  buildBranches() {
    this.branchBuilder = new BranchBuilder(this.treeGroup, BRANCHES);
    const { nodes, branches } = this.branchBuilder.build();
    
    // Guardar referencias
    this.allNodes.push(...nodes);
    this.allBranches = branches;
    
    console.log(`  └─ Ramas: ${branches.length} ramas, ${nodes.length} nodos`);
  }

  /**
   * Animar el árbol (llamar en el loop)
   * @param {number} time - Tiempo transcurrido
   */
  update(time) {
    if (!this.isBuilt) return;
    
    // Animar nodos individuales
    this.allNodes.forEach((node, index) => {
      // Pulso de escala
      const scale = 1 + Math.sin(time * 2 + index * 0.5) * 0.1;
      node.scale.setScalar(scale);
      
      // Float vertical sutil
      if (node.userData.originalY === undefined) {
        node.userData.originalY = node.position.y;
      }
      node.position.y = node.userData.originalY + Math.sin(time + index) * 0.05;
      
      // Rotar anillos decorativos si existen
      if (node.children.length > 0) {
        node.children.forEach(child => {
          if (child.type === 'Mesh' && child.geometry.type === 'RingGeometry') {
            child.rotation.z += 0.01;
          }
        });
      }
    });
    
    // Rotación suave de todo el árbol (opcional)
    // this.treeGroup.rotation.y += 0.001;
  }

  /**
   * Obtener todos los nodos interactivos
   * @returns {Array} Array de THREE.Mesh
   */
  getNodes() {
    return this.allNodes;
  }

  /**
   * Obtener nodo por ID de materia
   * @param {string} subjectId - ID de materia (ej: "INF-111")
   * @returns {THREE.Mesh|null}
   */
  getNodeBySubjectId(subjectId) {
    return this.allNodes.find(node => 
      node.userData.subjectData?.id === subjectId
    );
  }

  /**
   * Resaltar un nodo
   * @param {THREE.Mesh} node - Nodo a resaltar
   */
  highlightNode(node) {
    if (!node) return;
    
    // Aumentar intensidad emissive
    if (node.material && node.material.emissive) {
      node.material.emissiveIntensity = 1.5;
    }
    
    // Aumentar opacidad de anillos
    node.children.forEach(child => {
      if (child.material && child.material.opacity !== undefined) {
        child.material.opacity = 0.8;
      }
    });
  }

  /**
   * Quitar resaltado de un nodo
   * @param {THREE.Mesh} node - Nodo a des-resaltar
   */
  unhighlightNode(node) {
    if (!node) return;
    
    // Restaurar intensidad normal
    if (node.material && node.material.emissive) {
      node.material.emissiveIntensity = 1.0;
    }
    
    // Restaurar opacidad de anillos
    node.children.forEach(child => {
      if (child.material && child.material.opacity !== undefined) {
        child.material.opacity = 0.4;
      }
    });
  }

  /**
   * Filtrar nodos por área
   * @param {string} area - Nombre del área
   */
  filterByArea(area) {
    this.allNodes.forEach(node => {
      const nodeArea = node.userData.subjectData?.area;
      if (area === 'all' || nodeArea === area) {
        node.visible = true;
      } else {
        node.visible = false;
      }
    });
  }

  /**
   * Mostrar todos los nodos
   */
  showAll() {
    this.allNodes.forEach(node => {
      node.visible = true;
    });
  }

  /**
   * Obtener estadísticas del árbol
   * @returns {Object}
   */
  getStats() {
    return {
      totalNodes: this.allNodes.length,
      roots: this.allRoots.length,
      branches: this.allBranches.length,
      areas: [...new Set(this.allNodes.map(n => n.userData.subjectData?.area))]
    };
  }

  /**
   * Limpiar recursos
   */
  dispose() {
    this.scene.remove(this.treeGroup);
    
    // Limpiar geometrías y materiales
    this.treeGroup.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(m => m.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
  }
}