/**
 * DEBUGTOOLS.JS - Herramientas de Debug
 * ======================================
 */

import * as THREE from 'three';

export class DebugTools {
  constructor(scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.helpers = [];
    this.enabled = false;
  }

  /**
   * Activar/desactivar modo debug
   */
  toggle() {
    this.enabled = !this.enabled;
    
    if (this.enabled) {
      this.enable();
    } else {
      this.disable();
    }
    
    console.log(`🐛 Debug mode: ${this.enabled ? 'ON' : 'OFF'}`);
  }

  /**
   * Activar debug
   */
  enable() {
    this.showAxes();
    this.logSceneInfo();
  }

  /**
   * Desactivar debug
   */
  disable() {
    this.clear();
  }

  /**
   * Mostrar AxesHelper
   */
  showAxes(size = 5) {
    const axesHelper = new THREE.AxesHelper(size);
    axesHelper.name = 'AxesHelper';
    this.scene.add(axesHelper);
    this.helpers.push(axesHelper);
    console.log('📐 Ejes mostrados (R=X, G=Y, B=Z)');
  }

  /**
   * Mostrar BoxHelper para un objeto
   */
  showBoundingBox(object, color = 0xffff00) {
    const box = new THREE.BoxHelper(object, color);
    box.name = 'BoundingBox';
    this.scene.add(box);
    this.helpers.push(box);
    console.log('📦 Bounding box mostrado');
  }

  /**
   * Mostrar grid adicional
   */
  showGrid(size = 20, divisions = 20) {
    const grid = new THREE.GridHelper(size, divisions);
    grid.name = 'DebugGrid';
    this.scene.add(grid);
    this.helpers.push(grid);
  }

  /**
   * Log info de la escena
   */
  logSceneInfo() {
    console.log('🔍 Scene Info:', {
      objects: this.scene.children.length,
      vertices: this.countVertices(),
      triangles: this.countTriangles(),
      materials: this.countMaterials(),
      textures: this.countTextures()
    });
  }

  /**
   * Contar vértices en la escena
   */
  countVertices() {
    let count = 0;
    this.scene.traverse((object) => {
      if (object.geometry) {
        const positions = object.geometry.attributes.position;
        if (positions) {
          count += positions.count;
        }
      }
    });
    return count;
  }

  /**
   * Contar triángulos
   */
  countTriangles() {
    let count = 0;
    this.scene.traverse((object) => {
      if (object.geometry) {
        const index = object.geometry.index;
        if (index) {
          count += index.count / 3;
        } else {
          const positions = object.geometry.attributes.position;
          if (positions) {
            count += positions.count / 3;
          }
        }
      }
    });
    return Math.round(count);
  }

  /**
   * Contar materiales
   */
  countMaterials() {
    const materials = new Set();
    this.scene.traverse((object) => {
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(m => materials.add(m.uuid));
        } else {
          materials.add(object.material.uuid);
        }
      }
    });
    return materials.size;
  }

  /**
   * Contar texturas
   */
  countTextures() {
    const textures = new Set();
    this.scene.traverse((object) => {
      if (object.material) {
        const materials = Array.isArray(object.material) 
          ? object.material 
          : [object.material];
        
        materials.forEach(material => {
          Object.values(material).forEach(value => {
            if (value instanceof THREE.Texture) {
              textures.add(value.uuid);
            }
          });
        });
      }
    });
    return textures.size;
  }

  /**
   * Log jerarquía de la escena
   */
  logHierarchy(object = this.scene, indent = 0) {
    const prefix = '  '.repeat(indent);
    console.log(`${prefix}${object.name || object.type} (${object.uuid.slice(0, 8)})`);
    
    object.children.forEach(child => {
      this.logHierarchy(child, indent + 1);
    });
  }

  /**
   * Screenshot de la escena
   */
  takeScreenshot(filename = `umsa-tree-${Date.now()}.png`) {
    const canvas = this.renderer.domElement;
    const dataURL = canvas.toDataURL('image/png');
    
    // Crear link de descarga
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataURL;
    link.click();
    
    console.log('📸 Screenshot guardado:', filename);
  }

  /**
   * Exportar info de la escena como JSON
   */
  exportSceneInfo() {
    const info = {
      timestamp: new Date().toISOString(),
      objects: this.scene.children.length,
      vertices: this.countVertices(),
      triangles: this.countTriangles(),
      materials: this.countMaterials(),
      textures: this.countTextures(),
      camera: {
        position: this.camera.position.toArray(),
        rotation: this.camera.rotation.toArray()
      }
    };
    
    console.log('📄 Scene Info:', JSON.stringify(info, null, 2));
    return info;
  }

  /**
   * Limpiar todos los helpers
   */
  clear() {
    this.helpers.forEach(helper => {
      this.scene.remove(helper);
      if (helper.geometry) helper.geometry.dispose();
      if (helper.material) {
        if (Array.isArray(helper.material)) {
          helper.material.forEach(m => m.dispose());
        } else {
          helper.material.dispose();
        }
      }
    });
    this.helpers = [];
  }

  /**
   * Destructor
   */
  dispose() {
    this.clear();
  }
}