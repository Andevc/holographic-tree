/**
 * TREEMANAGER.JS - Coordinador del Árbol con Clusters
 * ====================================================
 * 
 * ACTUALIZADO: Ahora coordina el sistema de clusters
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
    
    this.treeGroup = new THREE.Group();
    this.treeGroup.name = 'KnowledgeTree';
    
    this.rootsBuilder = null;
    this.trunkBuilder = null;
    this.branchBuilder = null;
    this.nodeBuilder = null;
    
    this.allNodes = [];
    this.allBranches = [];
    this.allRoots = [];
    
    this.isBuilt = false;
    
    this.build();
  }

  build() {
    console.log('🌳 Iniciando construcción del árbol con CLUSTERS...');
    
    // 1. Construir raíces
    this.buildRoots();
    
    // 2. Construir tronco
    this.buildTrunk();
    
    // 3. Construir clusters (antes "ramas")
    this.buildClusters();
    
    // 4. Agregar a la escena
    this.scene.add(this.treeGroup);
    
    this.isBuilt = true;
    
    console.log(`✅ Árbol construido con ${this.allNodes.length} nodos`);
    console.log(`   - Raíces: ${this.allRoots.length}`);
    console.log(`   - Clusters: ${this.allBranches.length}`);
    
    EventBus.emit(EVENTS.TREE_BUILT, {
      nodeCount: this.allNodes.length,
      clusterCount: this.allBranches.length
    });
  }

  buildRoots() {
    this.rootsBuilder = new RootsBuilder(this.treeGroup, ROOTS);
    const rootNodes = this.rootsBuilder.build();
    
    this.allRoots = rootNodes;
    this.allNodes.push(...rootNodes);
    
    console.log(`  ├─ Raíces: ${rootNodes.length} nodos`);
  }

  buildTrunk() {
    this.trunkBuilder = new TrunkBuilder(this.treeGroup, TRUNK);
    const trunkNodes = this.trunkBuilder.build();
    
    this.allNodes.push(...trunkNodes);
    
    console.log(`  ├─ Tronco: ${trunkNodes.length} nodos`);
  }

  /**
   * ⭐ NUEVO: Construir clusters en lugar de ramas lineales
   */
  buildClusters() {
    this.branchBuilder = new BranchBuilder(this.treeGroup, BRANCHES);
    const { nodes, branches } = this.branchBuilder.build();
    
    this.allNodes.push(...nodes);
    this.allBranches = branches;
    
    console.log(`  └─ Clusters: ${branches.length} clusters, ${nodes.length} nodos`);
  }

  /**
   * Actualizar animaciones
   */
  update(time, delta) {
    if (!this.isBuilt) return;
    
    // Animar tronco
    if (this.trunkBuilder) {
      this.trunkBuilder.update(time);
    }
    
    // ⭐ NUEVO: Animar clusters
    if (this.branchBuilder) {
      this.branchBuilder.update(time);
    }
    
    // Animaciones adicionales de nodos individuales
    this.allNodes.forEach((node, index) => {
      // Solo animar si no es parte de un cluster (que ya tiene animación)
      if (!node.userData.type || 
          (!node.userData.type.includes('cluster') && 
           node.userData.type !== 'root')) {
        
        // Pulso de escala
        const scale = 1 + Math.sin(time * 2 + index * 0.5) * 0.1;
        node.scale.setScalar(scale);
        
        // Float vertical
        if (node.userData.originalY === undefined) {
          node.userData.originalY = node.position.y;
        }
        node.position.y = node.userData.originalY + Math.sin(time + index) * 0.05;
        
        // Rotar anillos
        if (node.children.length > 0) {
          node.children.forEach(child => {
            if (child.type === 'Mesh' && child.geometry.type === 'RingGeometry') {
              child.rotation.z += 0.01;
            }
          });
        }
      }
    });
  }

  getNodes() {
    return this.allNodes;
  }

  getNodeBySubjectId(subjectId) {
    return this.allNodes.find(node => 
      node.userData.subjectData?.id === subjectId ||
      node.userData.satelliteData?.id === subjectId
    );
  }

  highlightNode(node) {
    if (!node) return;
    
    if (node.material && node.material.emissive) {
      node.material.emissiveIntensity = 1.5;
    }
    
    node.children.forEach(child => {
      if (child.material && child.material.opacity !== undefined) {
        child.material.opacity = 0.8;
      }
    });
  }

  unhighlightNode(node) {
    if (!node) return;
    
    if (node.material && node.material.emissive) {
      node.material.emissiveIntensity = 1.0;
    }
    
    node.children.forEach(child => {
      if (child.material && child.material.opacity !== undefined) {
        child.material.opacity = 0.4;
      }
    });
  }

  filterByArea(area) {
    this.allNodes.forEach(node => {
      const nodeArea = node.userData.subjectData?.area || 
                       node.userData.satelliteData?.area ||
                       node.userData.area;
      
      if (area === 'all' || nodeArea === area) {
        node.visible = true;
      } else {
        node.visible = false;
      }
    });
  }

  showAll() {
    this.allNodes.forEach(node => {
      node.visible = true;
    });
  }

  getStats() {
    return {
      totalNodes: this.allNodes.length,
      roots: this.allRoots.length,
      clusters: this.allBranches.length,
      areas: [...new Set(this.allNodes.map(n => 
        n.userData.subjectData?.area || 
        n.userData.satelliteData?.area ||
        n.userData.area
      ))]
    };
  }

  dispose() {
    this.scene.remove(this.treeGroup);
    
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