/**
 * MAIN.JS - Punto de Entrada
 * ===========================
 * 
 * PROPÓSITO:
 * - Iniciar la aplicación cuando el DOM esté listo
 * - Configurar el contenedor del canvas
 * - Manejar errores de inicialización
 * 
 * Este es el primer archivo que se ejecuta.
 * Vite lo usa como entry point definido en index.html
 */

import { App } from './core/App.js';
import '../styles/main.css';  // Importar estilos

// Variable global para acceder a la app desde la consola
// Útil para debugging: window.app.getTreeManager()
let app = null;

/**
 * Inicializar aplicación
 */
async function init() {
  try {
    // Obtener contenedor del canvas
    const container = document.getElementById('canvas-container');
    
    if (!container) {
      throw new Error('No se encontró el contenedor #canvas-container');
    }
    
    // Mostrar mensaje de carga
    console.log('⏳ Cargando Árbol del Conocimiento UMSA...');
    
    // Crear y inicializar aplicación
    app = new App(container);
    await app.init();
    
    // Hacer accesible globalmente (para debugging)
    window.app = app;
    
    console.log('✅ Aplicación lista');
    console.log('💡 Tip: Presiona "R" para resetear cámara, "P" para auto-rotación');
    
  } catch (error) {
    console.error('❌ Error fatal:', error);
    
    // Mostrar error en la UI
    document.body.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background: #0a0a15;
        color: #ff4444;
        font-family: monospace;
        padding: 20px;
        text-align: center;
      ">
        <div>
          <h1>❌ Error de Inicialización</h1>
          <p>${error.message}</p>
          <p style="color: #888; margin-top: 20px;">
            Abre la consola (F12) para más detalles
          </p>
        </div>
      </div>
    `;
  }
}

/**
 * Cleanup cuando se cierra la página
 */
window.addEventListener('beforeunload', () => {
  if (app) {
    app.dispose();
  }
});

/**
 * Iniciar cuando el DOM esté listo
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM ya está listo
  init();
}

/**
 * Hot Module Replacement (HMR) para desarrollo con Vite
 * Recarga módulos sin refrescar la página completa
 */
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    console.log('🔥 HMR: Módulo recargado');
  });
}