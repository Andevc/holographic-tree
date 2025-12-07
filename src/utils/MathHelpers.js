/**
 * MATHHELPERS.JS - Utilidades Matemáticas
 * ========================================
 */

export class MathHelpers {
  /**
   * Mapear valor de un rango a otro
   * @param {number} value - Valor a mapear
   * @param {number} inMin - Mínimo del rango de entrada
   * @param {number} inMax - Máximo del rango de entrada
   * @param {number} outMin - Mínimo del rango de salida
   * @param {number} outMax - Máximo del rango de salida
   * @returns {number}
   */
  static map(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  /**
   * Clamp valor entre min y max
   * @param {number} value - Valor a limitar
   * @param {number} min - Valor mínimo
   * @param {number} max - Valor máximo
   * @returns {number}
   */
  static clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  /**
   * Lerp (interpolación lineal)
   * @param {number} start - Valor inicial
   * @param {number} end - Valor final
   * @param {number} t - Factor de interpolación (0-1)
   * @returns {number}
   */
  static lerp(start, end, t) {
    return start + (end - start) * t;
  }

  /**
   * Ease in-out (suavizado)
   * @param {number} t - Factor (0-1)
   * @returns {number}
   */
  static easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  /**
   * Distancia entre dos puntos 3D
   * @param {Object} p1 - Punto 1 {x, y, z}
   * @param {Object} p2 - Punto 2 {x, y, z}
   * @returns {number}
   */
  static distance3D(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = p2.z - p1.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Ángulo aleatorio en radianes
   * @returns {number}
   */
  static randomAngle() {
    return Math.random() * Math.PI * 2;
  }

  /**
   * Número aleatorio entre min y max
   * @param {number} min - Mínimo
   * @param {number} max - Máximo
   * @returns {number}
   */
  static randomRange(min, max) {
    return min + Math.random() * (max - min);
  }

  /**
   * Convertir grados a radianes
   * @param {number} degrees - Grados
   * @returns {number}
   */
  static degToRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Convertir radianes a grados
   * @param {number} radians - Radianes
   * @returns {number}
   */
  static radToDeg(radians) {
    return radians * (180 / Math.PI);
  }

  /**
   * Normalizar valor entre 0 y 1
   * @param {number} value - Valor
   * @param {number} min - Mínimo
   * @param {number} max - Máximo
   * @returns {number}
   */
  static normalize(value, min, max) {
    return (value - min) / (max - min);
  }

  /**
   * Redondear a N decimales
   * @param {number} value - Valor
   * @param {number} decimals - Número de decimales
   * @returns {number}
   */
  static round(value, decimals = 2) {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }
}