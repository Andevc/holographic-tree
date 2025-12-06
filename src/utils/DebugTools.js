import * as THREE from 'three';
export class DebugTools {
  constructor(scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.helpers = [];
  }

  /**
   * Mostrar AxesHelper
   */
  showAxes(size = 5) {
    const axesHelper = new THREE.AxesHelper(size);
    this.scene.add(axesHelper);
    this.helpers.push(axesHelper);
  }

  /**
   * Mostrar BoxHelper para un objeto
   */
  showBoundingBox(object) {
    const box = new THREE.BoxHelper(object, 0xffff00);
    this.scene.add(box);
    this.helpers.push(box);
  }

  /**
   * Log info de la escena
   */
  logSceneInfo() {
    console.log('🔍 Scene Info:', {
      objects: this.scene.children.length,
      vertices: this.countVertices(),
      triangles: this.countTriangles()
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
   * Limpiar todos los helpers
   */
  clear() {
    this.helpers.forEach(helper => {
      this.scene.remove(helper);
      if (helper.geometry) helper.geometry.dispose();
      if (helper.material) helper.material.dispose();
    });
    this.helpers = [];
  }

  /**
   * Screenshot de la escena
   */
  takeScreenshot() {
    const canvas = this.renderer.domElement;
    const dataURL = canvas.toDataURL('image/png');
    
    // Crear link de descarga
    const link = document.createElement('a');
    link.download = `umsa-tree-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
    
    console.log('📸 Screenshot guardado');
  }
}