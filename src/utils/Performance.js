/**
 * PERFORMANCE.JS - Monitor de Rendimiento
 * ========================================
 */

import EventBus from '../core/EventBus.js';

export class Performance {
  constructor() {
    this.fps = 0;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.deltaTime = 0;
    
    // Métricas
    this.metrics = {
      avgFps: 60,
      minFps: 60,
      maxFps: 60,
      drawCalls: 0,
      triangles: 0,
      memory: 0
    };

    // Historial de FPS (últimos 60 frames)
    this.fpsHistory = [];
    this.maxHistoryLength = 60;
  }

  /**
   * Actualizar métricas (llamar en cada frame)
   */
  update() {
    this.frameCount++;
    const currentTime = performance.now();
    const elapsed = currentTime - this.lastTime;
    
    // Calcular FPS cada segundo
    if (elapsed >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / elapsed);
      
      // Actualizar historial
      this.fpsHistory.push(this.fps);
      if (this.fpsHistory.length > this.maxHistoryLength) {
        this.fpsHistory.shift();
      }
      
      // Actualizar métricas
      this.metrics.avgFps = this.calculateAvgFps();
      this.metrics.minFps = Math.min(this.metrics.minFps, this.fps);
      this.metrics.maxFps = Math.max(this.metrics.maxFps, this.fps);
      
      // Emitir evento con stats
      EventBus.emit('stats:update', {
        fps: this.fps,
        avg: this.metrics.avgFps,
        min: this.metrics.minFps,
        max: this.metrics.maxFps
      });
      
      this.frameCount = 0;
      this.lastTime = currentTime;
    }
  }

  /**
   * Calcular FPS promedio
   */
  calculateAvgFps() {
    if (this.fpsHistory.length === 0) return 60;
    const sum = this.fpsHistory.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.fpsHistory.length);
  }

  /**
   * Verificar si el rendimiento es bajo
   */
  isLowPerformance() {
    return this.fps < 30;
  }

  /**
   * Obtener nivel de calidad recomendado
   */
  getQualityLevel() {
    if (this.fps >= 55) return 'high';
    if (this.fps >= 40) return 'medium';
    return 'low';
  }

  /**
   * Obtener estadísticas del renderer
   */
  getRendererStats(renderer) {
    const info = renderer.info;
    
    this.metrics.drawCalls = info.render.calls;
    this.metrics.triangles = info.render.triangles;
    
    return {
      drawCalls: info.render.calls,
      triangles: info.render.triangles,
      points: info.render.points,
      lines: info.render.lines,
      geometries: info.memory.geometries,
      textures: info.memory.textures
    };
  }

  /**
   * Obtener uso de memoria (si está disponible)
   */
  getMemoryUsage() {
    if (performance.memory) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(performance.memory.totalJSHeapSize / 1048576),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
      };
    }
    return null;
  }

  /**
   * Log de métricas en consola
   */
  log() {
    console.log('📊 Performance Metrics:', {
      fps: this.fps,
      avg: this.metrics.avgFps,
      min: this.metrics.minFps,
      max: this.metrics.maxFps,
      quality: this.getQualityLevel()
    });
  }

  /**
   * Reset de métricas
   */
  reset() {
    this.metrics.minFps = 60;
    this.metrics.maxFps = 60;
    this.fpsHistory = [];
  }

  /**
   * Obtener todas las métricas
   */
  getMetrics() {
    return {
      ...this.metrics,
      current: this.fps,
      quality: this.getQualityLevel()
    };
  }
}