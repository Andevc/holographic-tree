import * as THREE from 'three';
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
  }

  /**
   * Actualizar métricas
   */
  update() {
    this.frameCount++;
    const currentTime = performance.now();
    const elapsed = currentTime - this.lastTime;
    
    // Calcular FPS cada segundo
    if (elapsed >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / elapsed);
      
      // Actualizar métricas
      this.metrics.avgFps = this.fps;
      this.metrics.minFps = Math.min(this.metrics.minFps, this.fps);
      this.metrics.maxFps = Math.max(this.metrics.maxFps, this.fps);
      
      this.frameCount = 0;
      this.lastTime = currentTime;
    }
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
    return {
      drawCalls: info.render.calls,
      triangles: info.render.triangles,
      points: info.render.points,
      lines: info.render.lines
    };
  }

  /**
   * Log de métricas
   */
  log() {
    console.log('📊 Performance Metrics:', {
      fps: this.fps,
      avg: this.metrics.avgFps,
      min: this.metrics.minFps,
      max: this.metrics.maxFps
    });
  }
}