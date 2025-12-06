import * as THREE from 'three';
export class MathHelpers {
  /**
   * Mapear valor de un rango a otro
   */
  static map(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  /**
   * Clamp valor entre min y max
   */
  static clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  /**
   * Lerp (interpolación lineal)
   */
  static lerp(start, end, t) {
    return start + (end - start) * t;
  }

  /**
   * Ease in-out
   */
  static easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  /**
   * Distancia entre dos puntos 3D
   */
  static distance3D(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = p2.z - p1.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Ángulo aleatorio en radianes
   */
  static randomAngle() {
    return Math.random() * Math.PI * 2;
  }

  /**
   * Número aleatorio entre min y max
   */
  static randomRange(min, max) {
    return min + Math.random() * (max - min);
  }

  /**
   * Convertir grados a radianes
   */
  static degToRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Convertir radianes a grados
   */
  static radToDeg(radians) {
    return radians * (180 / Math.PI);
  }
}