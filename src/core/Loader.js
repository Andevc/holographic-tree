/**
 * LOADER.JS - Gestor de Pantalla de Carga
 * ========================================
 * 
 * Maneja la pantalla de carga inicial con progreso
 */

export class Loader {
  constructor() {
    this.element = document.getElementById('loading-screen');
    this.progress = 0;
    this.tasks = [];
  }

  /**
   * Agregar tarea de carga
   */
  addTask(name) {
    this.tasks.push({ name, completed: false });
  }

  /**
   * Marcar tarea como completada
   */
  completeTask(name) {
    const task = this.tasks.find(t => t.name === name);
    if (task) {
      task.completed = true;
      this.updateProgress();
    }
  }

  /**
   * Actualizar progreso
   */
  updateProgress() {
    const completed = this.tasks.filter(t => t.completed).length;
    this.progress = (completed / this.tasks.length) * 100;
    
    // Actualizar texto si existe elemento
    const progressText = document.querySelector('.loading-content p');
    if (progressText) {
      progressText.textContent = `Cargando... ${Math.round(this.progress)}%`;
    }
  }

  /**
   * Ocultar pantalla de carga
   */
  hide() {
    if (this.element) {
      this.element.style.opacity = '0';
      setTimeout(() => {
        this.element.style.display = 'none';
        this.element.remove();
      }, 500);
    }
  }

  /**
   * Mostrar error
   */
  showError(message) {
    if (this.element) {
      this.element.innerHTML = `
        <div class="loading-content">
          <h2 style="color: #ff4444;">❌ Error de Carga</h2>
          <p>${message}</p>
        </div>
      `;
    }
  }
}