/**
 * CONSTANTS.JS - Configuración Global del Proyecto
 * ================================================
 * 
 * PROPÓSITO:
 * - Centralizar todos los valores configurables
 * - Evitar "magic numbers" en el código
 * - Facilitar ajustes rápidos sin tocar lógica
 * 
 * PARA LA DEFENSA:
 * "Usamos un archivo de constantes centralizado para mantener
 * consistencia en todo el proyecto y facilitar ajustes de valores
 * sin modificar la lógica del código"
 */

// ============================================
// COLORES DEL PROYECTO
// ============================================
export const COLORS = {
  // Color de fondo de la escena
  background: 0x0a0a15,  // Azul oscuro casi negro
  
  // Color del grid del suelo
  grid: {
    primary: 0x00ffff,   // Cian brillante
    secondary: 0x1b3848  // Azul oscuro
  },
  
  // Colores por área del conocimiento
  // Cada área tiene su color único para identificación visual
  areas: {
    fundamentos: 0x00ffff,  // Cian - Base del conocimiento
    web: 0x00BFFF,          // Azul cielo - Desarrollo web
    ia: 0x9D00FF,           // Morado - Inteligencia artificial
    redes: 0x00FF88,        // Verde - Redes y conectividad
    sistemas: 0xFF3366,     // Rojo - Sistemas y hardware
    datos: 0xFFB800,        // Naranja - Bases de datos
    gamedev: 0xFF00FF       // Rosa - Desarrollo de videojuegos
  },
  
  // Colores para efectos especiales
  effects: {
    glow: 0x00ffff,
    highlight: 0xffffff,
    selection: 0xffff00
  }
};

// ============================================
// CONFIGURACIÓN DEL ÁRBOL
// ============================================
export const TREE_CONFIG = {
  // RAÍCES - Base del árbol (fundamentos de la carrera)
  roots: {
    count: 4,              // Número de raíces (3 materias base)
    radius: 4,             // Distancia del centro (radio del círculo)
    radiusTop: 0.2,
    radiusBottom: 0.5,
    size: 1,             // Radio de la base del cono
    height: 0.75,           // Altura del cono invertido
    segments: 16,          // Número de segmentos (más = más suave)
    yPosition: 2       // Posición vertical (enterradas)
  },
  
  // TRONCO - Núcleo central del árbol
  trunk: {
    radiusTop: 0.2,        // Radio superior (más delgado arriba)
    radiusBottom: 1.0,     // Radio inferior (más ancho abajo)
    height: 7,             // Altura total del tronco
    segments: 10,          // Segmentos radiales (circunferencia)
    heightSegments: 5,     // Segmentos de altura (anillos)
    yPosition: 7,        // Posición vertical del centro
    
    // Anillos decorativos (como en la referencia)
    rings: {
      count: 6,            // Número de anillos
      spacing: 1.5,          // Espacio entre anillos
      thickness: 0.05,     // Grosor del torus
      startY: 7          // Altura inicial del primer anillo
    }
  },
  
  // RAMAS - Especialidades que salen del tronco
  branches: {
    count: 5,              // Número de ramas principales
    tubeRadius: 0.05,      // Grosor de la rama (tubo)
    segments: 40,          // Segmentos del tubo (suavidad de la curva)
    radialSegments: 12,    // Segmentos radiales del tubo (redondez)
    length: 5,             // Longitud base de la rama
    curvature: 1,          // Altura del punto medio de la curva
    startY: 10,             // Altura donde empiezan las ramas
    spread: 0.9            // Variación de altura entre ramas
  },
  
  // NODOS - Esferas que representan materias
  nodes: {
    radius: 0.25,          // Radio de la esfera
    segments: 24,          // Segmentos (más = más suave)
    
    // Anillos decorativos alrededor de los nodos
    rings: {
      inner: {
        min: 0.4,          // Radio interno del anillo
        max: 0.5,          // Radio externo del anillo
        opacity: 0.4       // Transparencia
      },
      outer: {
        min: 0.52,
        max: 0.6,
        opacity: 0.2
      }
    }
  },
  
  // DISTRIBUCIÓN de nodos en el tronco
  trunkNodes: {
    radius: 1.2,           // Distancia del centro del tronco
    startY: 1,             // Altura inicial
    spacing: 1             // Espacio vertical entre nodos
  }
};

// ============================================
// CONFIGURACIÓN DE CÁMARA
// ============================================
export const CAMERA_CONFIG = {
  // Parámetros de perspectiva
  fov: 75,                 // Field of view (ángulo de visión)
  near: 0.1,               // Plano cercano de recorte
  far: 1000,               // Plano lejano de recorte
  
  // Posición inicial de la cámara
  position: {
    x: 0,
    y: 5,
    z: 12
  },
  
  // Objetivo al que mira la cámara
  target: {
    x: 0,
    y: 2,
    z: 0
  },
  
  // Límites de zoom (con OrbitControls)
  minDistance: 5,          // No acercarse más de 5 unidades
  maxDistance: 25,         // No alejarse más de 25 unidades
  
  // Límites de rotación vertical
  minPolarAngle: Math.PI * 0.1,  // No ver muy desde arriba
  maxPolarAngle: Math.PI * 0.8   // No ver desde abajo
};

// ============================================
// CONFIGURACIÓN DE LUCES
// ============================================
export const LIGHTS_CONFIG = {
  // Luz ambiental - ilumina todo suavemente
  ambient: {
    color: 0xffffff,
    intensity: 0.3
  },
  
  // Luz direccional - simula el sol
  directional: {
    color: 0xffffff,
    intensity: 0.5,
    position: { x: 5, y: 10, z: 5 },
    castShadow: true,
    shadow: {
      camera: { near: 0.1, far: 50, size: 15 },
      mapSize: 2048
    }
  },
  
  // Luces de punto - acentos de color
  point: [
    {
      color: 0x00ffff,
      intensity: 1,
      distance: 20,
      position: { x: -5, y: 5, z: 5 }
    },
    {
      color: 0xff00ff,
      intensity: 0.8,
      distance: 20,
      position: { x: 5, y: 5, z: -5 }
    }
  ],
  
  // Luz hemisférica - simula cielo y suelo
  hemisphere: {
    skyColor: 0x0066ff,
    groundColor: 0x002244,
    intensity: 0.4
  }
};

// ============================================
// CONFIGURACIÓN DE PARTÍCULAS
// ============================================
export const PARTICLES_CONFIG = {
  // Partículas ambientales - distribuidas por toda la escena
  ambient: {
    count: 5,            // Número de partículas
    size: 0.1,             // Tamaño de cada partícula
    opacity: 0.6,          // Transparencia
    spread: {              // Área de distribución
      radius: { min: 3, max: 13 },
      height: { min: -3, max: 12 }
    },
    velocity: {            // Velocidad de movimiento
      x: 0.002,
      y: 0.005,
      z: 0.002
    }
  },
  
  // Partículas que fluyen - suben desde las raíces
  flowing: {
    count: 2,
    size: 0.15,
    opacity: 0.8,
    speed: 0.005,          // Velocidad de ascenso
    startY: -1,            // Altura inicial
    endY: 8,               // Altura final
    radius: 1.5            // Radio de distribución
  },
  
  // Partículas flotantes - cerca del árbol
  floating: {
    count: 300,
    size: 0.08,
    opacity: 0.7,
    spread: {
      radius: { min: 1, max: 5 },
      height: { min: 0, max: 8 }
    },
    rotationSpeed: 0.0005  // Velocidad de rotación del grupo
  }
};

// ============================================
// CONFIGURACIÓN DE MATERIALES
// ============================================
export const MATERIALS_CONFIG = {
  // Material holográfico base
  hologram: {
    wireframe: true,
    transparent: true,
    opacity: 0.7,
    metalness: 0.9,
    roughness: 0.2,
    emissiveIntensity: 0.8
  },
  
  // Material para nodos (más brillante)
  node: {
    wireframe: false,
    transparent: true,
    opacity: 0.9,
    metalness: 0.8,
    roughness: 0.2,
    emissiveIntensity: 1.0
  },
  
  // Material para tubos (ramas)
  tube: {
    wireframe: false,
    transparent: true,
    opacity: 0.8,
    metalness: 0.9,
    roughness: 0.1,
    emissiveIntensity: 1.0
  }
};

// ============================================
// CONFIGURACIÓN DE EFECTOS VISUALES
// ============================================
export const EFFECTS_CONFIG = {
  // Configuración de Bloom (efecto de brillo)
  bloom: {
    threshold: 0.7,        // Objetos más brillantes que esto brillarán
    strength: 1.5,         // Intensidad del brillo
    radius: 0.8,           // Radio del efecto
    exposure: 1            // Exposición general
  },
  
  // Niebla atmosférica
  fog: {
    color: 0x131313,       // Mismo color que el fondo
    near: 15,              // Distancia donde empieza
    far: 150                // Distancia donde es opaca
  }
};

// ============================================
// CONFIGURACIÓN DE ANIMACIONES
// ============================================
export const ANIMATION_CONFIG = {
  // Velocidades de animación
  node: {
    pulseSpeed: 2,         // Velocidad del pulso (escala)
    pulseAmount: 0.1,      // Cantidad de cambio de escala
    floatSpeed: 1,         // Velocidad de flotación
    floatAmount: 0.05      // Cantidad de movimiento vertical
  },
  
  lights: {
    pulseSpeed: 0.5,       // Velocidad del pulso de luces
    pulseAmount: 0.3       // Cantidad de cambio de intensidad
  },
  
  baseRing: {
    pulseSpeed: 2,         // Velocidad del pulso del anillo base
    scaleAmount: 0.02,     // Cantidad de cambio de escala
    opacityBase: 0.4,      // Opacidad base
    opacityAmount: 0.2     // Variación de opacidad
  }
};

// ============================================
// CONFIGURACIÓN DE RENDIMIENTO
// ============================================
export const PERFORMANCE_CONFIG = {
  // FPS objetivo
  targetFPS: 60,
  
  // Límite bajo de FPS para reducir calidad
  minFPS: 30,
  
  // Calidad reducida (cuando FPS < 30)
  lowQuality: {
    particleCount: 300,    // Reducir partículas
    shadowMapSize: 1024,   // Reducir calidad de sombras
    antialiasing: false    // Desactivar antialiasing
  },
  
  // Calidad normal
  normalQuality: {
    particleCount: 1000,
    shadowMapSize: 2048,
    antialiasing: true
  }
};

// ============================================
// CONFIGURACIÓN DE UI
// ============================================
export const UI_CONFIG = {
  // Transiciones
  transitions: {
    panelDuration: 300,    // ms para abrir/cerrar paneles
    fadeInDuration: 200,   // ms para fade in
    fadeOutDuration: 150   // ms para fade out
  },
  
  // Tamaños
  sizes: {
    infoPanelWidth: 400,   // px
    controlPanelWidth: 200,
    miniMapSize: 150
  }
};

// ============================================
// EXPORTS ÚTILES
// ============================================

/**
 * Obtener color por área
 * @param {string} area - Nombre del área
 * @returns {number} Color en hexadecimal
 */
export function getColorByArea(area) {
  return COLORS.areas[area] || COLORS.areas.fundamentos;
}

/**
 * Convertir hex a RGB normalizado (para shaders)
 * @param {number} hex - Color en hexadecimal
 * @returns {object} {r, g, b} normalizado 0-1
 */
export function hexToRGB(hex) {
  return {
    r: ((hex >> 16) & 255) / 255,
    g: ((hex >> 8) & 255) / 255,
    b: (hex & 255) / 255
  };
}