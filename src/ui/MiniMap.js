/**
 * MINIMAP.JS - Mini Mapa
 * =======================
 * 
 * Opcional: Vista top-down pequeña del árbol
 * Por ahora es un placeholder - se puede implementar después
 */

export class MiniMap {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.element = null;
    this.enabled = false;
  }

  /**
   * Crear elemento del minimapa
   */
  create() {
    // Crear contenedor
    this.element = document.createElement('div');
    this.element.id = 'minimap';
    this.element.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 150px;
      height: 150px;
      background: rgba(10, 10, 30, 0.9);
      border: 2px solid rgba(0, 255, 255, 0.5);
      border-radius: 10px;
      padding: 10px;
      display: none;
    `;
    
    // Agregar título
    const title = document.createElement('div');
    title.textContent = '🗺️ Mapa';
    title.style.cssText = `
      color: #00ffff;
      font-size: 0.8rem;
      margin-bottom: 5px;
      text-align: center;
    `;
    this.element.appendChild(title);
    
    // Canvas para dibujar
    const canvas = document.createElement('canvas');
    canvas.width = 130;
    canvas.height = 100;
    canvas.style.cssText = `
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 5px;
    `;
    this.element.appendChild(canvas);
    
    document.body.appendChild(this.element);
    
    console.log('📍 MiniMap creado (vista simplificada)');
  }

  /**
   * Activar minimapa
   */
  enable() {
    if (!this.element) {
      this.create();
    }
    
    this.element.style.display = 'block';
    this.enabled = true;
  }

  /**
   * Desactivar minimapa
   */
  disable() {
    if (this.element) {
      this.element.style.display = 'none';
    }
    this.enabled = false;
  }

  /**
   * Toggle visibilidad
   */
  toggle() {
    if (this.enabled) {
      this.disable();
    } else {
      this.enable();
    }
  }

  /**
   * Actualizar posición del indicador
   * (Se puede implementar dibujando en el canvas)
   */
  update() {
    if (!this.enabled) return;
    
    // TODO: Dibujar vista top-down simplificada
    // Usar canvas 2D para dibujar puntos representando nodos
  }

  /**
   * Destruir minimapa
   */
  dispose() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
}